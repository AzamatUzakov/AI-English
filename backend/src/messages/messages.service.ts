import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AIService, ChatMessage, LessonSummaryContext } from '../ai/ai.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    private prisma: PrismaService,
    private aiService: AIService,
  ) {}

  /**
   * Saves the user's message, retrieves history and context, calls Claude, saves AI response,
   * and returns the generated AI response message.
   */
  async create(lessonId: string, createMessageDto: CreateMessageDto) {
    // 1. Verify that the lesson exists
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${lessonId} not found`);
    }

    // 2. Save the user's message
    const userMessage = await this.prisma.lessonMessage.create({
      data: {
        lessonId,
        role: createMessageDto.role,
        content: createMessageDto.content,
      },
    });

    // 3. If the role is assistant, we don't trigger Claude. We just return the saved message.
    if (createMessageDto.role === 'assistant') {
      return userMessage;
    }

    // 4. Fetch the entire chat history for this lesson to build current context
    const allMessages = await this.prisma.lessonMessage.findMany({
      where: { lessonId },
      orderBy: { createdAt: 'asc' },
    });

    const chatHistory: ChatMessage[] = allMessages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    // 5. Fetch previous completed lessons to build the historical summaries context
    const pastLessons = await this.prisma.lesson.findMany({
      where: {
        status: 'completed',
        id: { not: lessonId }, // Exclude the current lesson session
      },
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

    // 6. Generate the tutor response using the AI Service
    const aiResponseText = await this.aiService.generateResponse(
      lesson.topic || 'General Assessment',
      chatHistory,
      pastSummaries,
    );

    // 7. Save and return the generated AI response message
    return this.prisma.lessonMessage.create({
      data: {
        lessonId,
        role: 'assistant',
        content: aiResponseText,
      },
    });
  }

  /**
   * Retrieves all messages for a specific lesson, sorted by time ascending.
   */
  async findByLessonId(lessonId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${lessonId} not found`);
    }

    return this.prisma.lessonMessage.findMany({
      where: { lessonId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
