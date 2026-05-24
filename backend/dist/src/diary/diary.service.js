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
exports.DiaryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DiaryService = class DiaryService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createDiaryDto) {
        return this.prisma.diaryRule.create({
            data: {
                lessonId: createDiaryDto.lessonId ?? null,
                topic: createDiaryDto.topic ?? null,
                title: createDiaryDto.title,
                content: createDiaryDto.content,
            },
        });
    }
    async findAll(topic) {
        return this.prisma.diaryRule.findMany({
            where: topic ? { topic } : undefined,
            orderBy: { createdAt: 'desc' },
        });
    }
    async remove(id) {
        const rule = await this.prisma.diaryRule.findUnique({ where: { id } });
        if (!rule) {
            throw new common_1.NotFoundException(`Diary rule with ID ${id} not found`);
        }
        return this.prisma.diaryRule.delete({ where: { id } });
    }
};
exports.DiaryService = DiaryService;
exports.DiaryService = DiaryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DiaryService);
//# sourceMappingURL=diary.service.js.map