import { ConfigService } from '@nestjs/config';
export interface LessonSummaryContext {
    topic: string;
    score: number;
    strong: string;
    weak: string;
    next_rec: string;
}
export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}
export declare class AIService {
    private configService;
    private readonly logger;
    private anthropic;
    private readonly useMock;
    constructor(configService: ConfigService);
    generateResponse(currentTopic: string, history: ChatMessage[], pastSummaries: LessonSummaryContext[]): Promise<string>;
    generateLessonSummary(topic: string, history: ChatMessage[]): Promise<{
        score: number;
        topic: string;
        strong: string;
        weak: string;
        summary: string;
        next_rec: string;
    }>;
    private buildSystemPrompt;
    private generateMockResponse;
    private generateMockSummary;
}
