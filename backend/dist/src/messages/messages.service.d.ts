import { PrismaService } from '../prisma/prisma.service';
import { AIService } from '../ai/ai.service';
import { CreateMessageDto } from './dto/create-message.dto';
export declare class MessagesService {
    private prisma;
    private aiService;
    constructor(prisma: PrismaService, aiService: AIService);
    create(lessonId: string, createMessageDto: CreateMessageDto): Promise<{
        id: string;
        createdAt: Date;
        content: string;
        role: string;
        lessonId: string;
    }>;
    findByLessonId(lessonId: string): Promise<{
        id: string;
        createdAt: Date;
        content: string;
        role: string;
        lessonId: string;
    }[]>;
}
