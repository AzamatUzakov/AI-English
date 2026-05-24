"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const ai_service_1 = require("../ai/ai.service");
let LessonsService = class LessonsService {
    prisma;
    aiService;
    constructor(prisma, aiService) {
        this.prisma = prisma;
        this.aiService = aiService;
    }
    async create(createLessonDto) {
        const lastLesson = await this.prisma.lesson.findFirst({
            where: { status: 'completed' },
            orderBy: { createdAt: 'desc' },
        });
        const recommendedTopic = lastLesson?.nextRec || 'General Assessment';
        const topic = createLessonDto.topic || recommendedTopic;
        const lesson = await this.prisma.lesson.create({
            data: {
                topic,
                status: 'active',
            },
        });
        const pastLessons = await this.prisma.lesson.findMany({
            where: { status: 'completed' },
            orderBy: { createdAt: 'desc' },
            take: 5,
        });
        const pastSummaries = pastLessons.map((l) => ({
            topic: l.topic || 'General Grammar',
            score: l.score || 0,
            strong: l.strong || '',
            weak: l.weak || '',
            next_rec: l.nextRec || '',
        }));
        const welcomeText = await this.aiService.generateResponse(topic, [], pastSummaries);
        await this.prisma.lessonMessage.create({
            data: {
                lessonId: lesson.id,
                role: 'assistant',
                content: welcomeText,
            },
        });
        return this.prisma.lesson.findUnique({
            where: { id: lesson.id },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
    }
    async findAll() {
        return this.prisma.lesson.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
        if (!lesson) {
            throw new common_1.NotFoundException(`Lesson with ID ${id} not found`);
        }
        return lesson;
    }
    async update(id, updateLessonDto) {
        const lesson = await this.prisma.lesson.findUnique({ where: { id } });
        if (!lesson) {
            throw new common_1.NotFoundException(`Lesson with ID ${id} not found`);
        }
        return this.prisma.lesson.update({
            where: { id },
            data: {
                topic: updateLessonDto.topic,
                score: updateLessonDto.score,
                strong: updateLessonDto.strong,
                weak: updateLessonDto.weak,
                summary: updateLessonDto.summary,
                nextRec: updateLessonDto.nextRec,
                duration: updateLessonDto.duration,
                status: updateLessonDto.status,
            },
        });
    }
    async generateSummary(id) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
        if (!lesson) {
            throw new common_1.NotFoundException(`Lesson with ID ${id} not found`);
        }
        const chatHistory = lesson.messages.map((m) => ({
            role: m.role,
            content: m.content,
        }));
        const summaryData = await this.aiService.generateLessonSummary(lesson.topic || 'General Assessment', chatHistory);
        return this.prisma.lesson.update({
            where: { id },
            data: {
                score: summaryData.score,
                strong: summaryData.strong,
                weak: summaryData.weak,
                summary: summaryData.summary,
                nextRec: summaryData.next_rec,
                status: 'completed',
            },
        });
    }
};
exports.LessonsService = LessonsService;
exports.LessonsService = LessonsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ai_service_1.AIService])
], LessonsService);
//# sourceMappingURL=lessons.service.js.map