import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
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
