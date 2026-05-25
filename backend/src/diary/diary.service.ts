import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDiaryDto } from './dto/create-diary.dto';

@Injectable()
export class DiaryService {
  constructor(private prisma: PrismaService) {}

  /**
   * Saves a rule card to the diary.
   */
  async create(createDiaryDto: CreateDiaryDto) {
    return this.prisma.diaryRule.create({
      data: {
        lessonId: createDiaryDto.lessonId ?? null,
        topic: createDiaryDto.topic ?? null,
        title: createDiaryDto.title,
        content: createDiaryDto.content,
      },
    });
  }

  /**
   * Returns all diary rule cards, optionally filtered by topic.
   */
  async findAll(topic?: string) {
    return this.prisma.diaryRule.findMany({
      where: topic ? { topic } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Deletes a diary rule card by ID.
   */
  async remove(id: string) {
    const rule = await this.prisma.diaryRule.findUnique({ where: { id } });
    if (!rule) {
      throw new NotFoundException(`Diary rule with ID ${id} not found`);
    }
    return this.prisma.diaryRule.delete({ where: { id } });
  }
}

