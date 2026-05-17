import { PrismaService } from '../prisma/prisma.service';
export declare class ChatService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createChatDto: any): Promise<{
        text: string;
        role: string;
        createdAt: Date;
        id: number;
        userId: number;
    }>;
    findAll(userId: number): Promise<{
        text: string;
        role: string;
        createdAt: Date;
        id: number;
        userId: number;
    }[]>;
}
