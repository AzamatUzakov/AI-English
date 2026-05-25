import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AIService, LessonSummaryContext } from '../ai/ai.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(
    private prisma: PrismaService,
    private aiService: AIService,
  ) {}

  /**
   * Initializes a new lesson, queries past summaries, triggers AI starting topic and response,
   * saves the response, and returns the lesson session.
   */
  async create(createLessonDto: CreateLessonDto) {
    // 1. Check for last completed lesson to find a recommended next topic
    const lastLesson = await this.prisma.lesson.findFirst({
      where: { status: 'completed' },
      orderBy: { createdAt: 'desc' },
    });

    const recommendedTopic = lastLesson?.nextRec || 'General Assessment';
    const topic = createLessonDto.topic || recommendedTopic;

    // 2. Create the new lesson in the database
    const lesson = await this.prisma.lesson.create({
      data: {
        topic,
        status: 'active',
      },
    });

    // 3. Fetch up to 5 previous completed lessons to build student context
    const pastLessons = await this.prisma.lesson.findMany({
      where: { status: 'completed' },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const pastSummaries: LessonSummaryContext[] = pastLessons.map((l) => ({
      topic: l.topic || 'General Grammar',
      score: l.score || 0,
      strong: l.strong || '',
      weak: l.weak || '',
      next_rec: l.nextRec || '',
    }));

    // 4. Generate the tutor's welcome and opening message for the lesson topic
    const welcomeText = await this.aiService.generateResponse(
      topic,
      [], // No history yet
      pastSummaries,
    );

    // 5. Save the assistant's first message to the database
    await this.prisma.lessonMessage.create({
      data: {
        lessonId: lesson.id,
        role: 'assistant',
        content: welcomeText,
      },
    });

    // 6. Return the fully initialized lesson with the first message included
    return this.prisma.lesson.findUnique({
      where: { id: lesson.id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  /**
   * Returns a history of all lessons, sorted by creation date descending.
   */
  async findAll() {
    return this.prisma.lesson.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Returns a specific lesson by ID, including its chat messages.
   */
  async findOne(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }

    return lesson;
  }

  /**
   * Updates lesson fields (score, strong, weak, summary, nextRec) and updates status.
   */
  async update(id: string, updateLessonDto: UpdateLessonDto) {
    // Verify lesson exists
    const lesson = await this.prisma.lesson.findUnique({ where: { id } });
    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }

    return this.prisma.lesson.update({
      where: { id },
      data: {
        topic: updateLessonDto.topic,
        score: updateLessonDto.score,
        strong: updateLessonDto.strong,
        weak: updateLessonDto.weak,
        summary: updateLessonDto.summary,
        nextRec: updateLessonDto.nextRec,
        duration: updateLessonDto.duration,
        status: updateLessonDto.status,
      },
    });
  }

  /**
   * Generates a final summary and score using AIService, updates the database,
   * sets status to 'completed', and returns the updated lesson details.
   */
  async generateSummary(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }

    const chatHistory = lesson.messages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    // Call Claude AI to analyze student performance and generate summary
    const summaryData = await this.aiService.generateLessonSummary(
      lesson.topic || 'General Assessment',
      chatHistory,
    );

    // Save summary data and mark the lesson completed in the DB
    return this.prisma.lesson.update({
      where: { id },
      data: {
        score: summaryData.score,
        strong: summaryData.strong,
        weak: summaryData.weak,
        summary: summaryData.summary,
        nextRec: summaryData.next_rec,
        status: 'completed',
      },
    });
  }
}
