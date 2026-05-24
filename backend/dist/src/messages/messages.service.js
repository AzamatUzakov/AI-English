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
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const ai_service_1 = require("../ai/ai.service");
let MessagesService = class MessagesService {
    prisma;
    aiService;
    constructor(prisma, aiService) {
        this.prisma = prisma;
        this.aiService = aiService;
    }
    async create(lessonId, createMessageDto) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: lessonId },
        });
        if (!lesson) {
            throw new common_1.NotFoundException(`Lesson with ID ${lessonId} not found`);
        }
        const userMessage = await this.prisma.lessonMessage.create({
            data: {
                lessonId,
                role: createMessageDto.role,
                content: createMessageDto.content,
            },
        });
        if (createMessageDto.role === 'assistant') {
            return userMessage;
        }
        const allMessages = await this.prisma.lessonMessage.findMany({
            where: { lessonId },
            orderBy: { createdAt: 'asc' },
        });
        const chatHistory = allMessages.map((m) => ({
            role: m.role,
            content: m.content,
        }));
        const pastLessons = await this.prisma.lesson.findMany({
            where: {
                status: 'completed',
                id: { not: lessonId },
            },
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
        const aiResponseText = await this.aiService.generateResponse(lesson.topic || 'General Assessment', chatHistory, pastSummaries);
        return this.prisma.lessonMessage.create({
            data: {
                lessonId,
                role: 'assistant',
                content: aiResponseText,
            },
        });
    }
    async findByLessonId(lessonId) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: lessonId },
        });
        if (!lesson) {
            throw new common_1.NotFoundException(`Lesson with ID ${lessonId} not found`);
        }
        return this.prisma.lessonMessage.findMany({
            where: { lessonId },
            orderBy: { createdAt: 'asc' },
        });
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ai_service_1.AIService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map