import { DiaryService } from './diary.service';
import { CreateDiaryDto } from './dto/create-diary.dto';
export declare class DiaryController {
    private readonly diaryService;
    constructor(diaryService: DiaryService);
    create(createDiaryDto: CreateDiaryDto): Promise<{
        id: string;
        content: import("@prisma/client/runtime/client").JsonValue;
        topic: string | null;
        createdAt: Date;
        lessonId: string | null;
        title: string;
    }>;
    findAll(topic?: string): Promise<{
        id: string;
        content: import("@prisma/client/runtime/client").JsonValue;
        topic: string | null;
        createdAt: Date;
        lessonId: string | null;
        title: string;
    }[]>;
    remove(id: string): Promise<{
        id: string;
        content: import("@prisma/client/runtime/client").JsonValue;
        topic: string | null;
        createdAt: Date;
        lessonId: string | null;
        title: string;
    }>;
}
