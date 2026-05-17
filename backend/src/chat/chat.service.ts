import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async create(createChatDto: any) {
    return this.prisma.message.create({
      data: {
        text: createChatDto.text,
        role: createChatDto.role,
        userId: createChatDto.userId,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.message.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
