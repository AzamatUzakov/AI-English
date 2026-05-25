import { PrismaService } from '../prisma/prisma.service';
import { AIService } from '../ai/ai.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
export declare class LessonsService {
    private prisma;
    private aiService;
    constructor(prisma: PrismaService, aiService: AIService);
    create(createLessonDto: CreateLessonDto): Promise<({
        messages: {
            id: string;
            createdAt: Date;
            content: string;
            role: string;
            lessonId: string;
        }[];
    } & {
        id: string;
        date: Date;
        topic: string | null;
        score: number | null;
        strong: string | null;
        weak: string | null;
        summary: string | null;
        nextRec: string | null;
        duration: number | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    findAll(): Promise<{
        id: string;
        date: Date;
        topic: string | null;
        score: number | null;
        strong: string | null;
        weak: string | null;
        summary: string | null;
        nextRec: string | null;
        duration: number | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        messages: {
            id: string;
            createdAt: Date;
            content: string;
            role: string;
            lessonId: string;
        }[];
    } & {
        id: string;
        date: Date;
        topic: string | null;
        score: number | null;
        strong: string | null;
        weak: string | null;
        summary: string | null;
        nextRec: string | null;
        duration: number | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateLessonDto: UpdateLessonDto): Promise<{
        id: string;
        date: Date;
        topic: string | null;
        score: number | null;
        strong: string | null;
        weak: string | null;
        summary: string | null;
        nextRec: string | null;
        duration: number | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    generateSummary(id: string): Promise<{
        id: string;
        date: Date;
        topic: string | null;
        score: number | null;
        strong: string | null;
        weak: string | null;
        summary: string | null;
        nextRec: string | null;
        duration: number | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
