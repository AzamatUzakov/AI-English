import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    create(createChatDto: CreateChatDto): Promise<{
        text: string;
        role: string;
        createdAt: Date;
        id: number;
        userId: number;
    }>;
    findAll(userId: string): Promise<{
        text: string;
        role: string;
        createdAt: Date;
        id: number;
        userId: number;
    }[]>;
}
