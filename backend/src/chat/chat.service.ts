import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  async create(createChatDto: any) {
    return { id: 'mock', ...createChatDto };
  }

  async findAll(userId: number) {
    return [];
  }
}

