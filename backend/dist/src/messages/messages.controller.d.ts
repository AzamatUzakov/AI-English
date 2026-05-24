import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    create(lessonId: string, createMessageDto: CreateMessageDto): Promise<{
        id: string;
        content: string;
        role: string;
        createdAt: Date;
        lessonId: string;
    }>;
    findByLessonId(lessonId: string): Promise<{
        id: string;
        content: string;
        role: string;
        createdAt: Date;
        lessonId: string;
    }[]>;
}
