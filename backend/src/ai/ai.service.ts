import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';

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

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);
  private anthropic: Anthropic | null = null;
  private readonly useMock: boolean = true;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('ANTHROPIC_API_KEY') || this.configService.get<string>('CLAUDE_API_KEY');
    
    if (apiKey && apiKey !== 'your_api_key_here' && !apiKey.startsWith('mock')) {
      this.logger.log('Initializing Anthropic Claude Client...');
      this.anthropic = new Anthropic({ apiKey });
      this.useMock = false;
    } else {
      this.logger.warn('No valid Anthropic API key found. Running in MOCK mode!');
      this.useMock = true;
    }
  }

  /**
   * Generates the next response from Claude in the chat session.
   * Injects historical context (past summaries) and systemic tutor guidelines.
   */
  async generateResponse(
    currentTopic: string,
    history: ChatMessage[],
    pastSummaries: LessonSummaryContext[]
  ): Promise<string> {
    if (this.useMock || !this.anthropic) {
      return this.generateMockResponse(currentTopic, history);
    }

    try {
      const systemPrompt = this.buildSystemPrompt(currentTopic, pastSummaries);
      
      // Convert standard messages to Anthropic model format
      // Note: Anthropic messages API requires alternating 'user' and 'assistant' roles.
      const anthropicMessages = history.map(msg => ({
        role: msg.role === 'user' ? ('user' as const) : ('assistant' as const),
        content: msg.content,
      }));

      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1500,
        temperature: 0.7,
        system: systemPrompt,
        messages: anthropicMessages,
      });

      const firstTextContent = response.content.find(block => block.type === 'text');
      return firstTextContent && 'text' in firstTextContent ? firstTextContent.text : 'I apologize, but I could not formulate a response.';
    } catch (error) {
      this.logger.error('Error calling Claude API', error);
      // Fallback to mock response on API failure so user experience is not disrupted
      return `[System Note: Claude API error. Using fallback tutor response]\n\n${await this.generateMockResponse(currentTopic, history)}`;
    }
  }

  /**
   * Generates the final lesson summary analysis when the timer expires.
   */
  async generateLessonSummary(
    topic: string,
    history: ChatMessage[]
  ): Promise<{
    score: number;
    topic: string;
    strong: string;
    weak: string;
    summary: string;
    next_rec: string;
  }> {
    if (this.useMock || !this.anthropic) {
      return this.generateMockSummary(topic);
    }

    try {
      const summaryPrompt = `
You are the English AI Tutor. The lesson is now finished. Analyze the conversation history below and output a strict JSON summary assessing the student.
The output MUST be a valid JSON object matching this schema exactly (do not output any markdown formatting or explanations outside the JSON block):
{
  "score": <integer score from 0 to 100 based on grammatical correctness and vocabulary usage>,
  "topic": "<name of the topic studied, e.g. Present Simple>",
  "strong": "<description of student's strong areas identified during this lesson, in Russian>",
  "weak": "<description of student's weak areas or errors identified during this lesson, in Russian>",
  "summary": "<a 2-3 sentence friendly summary of the student's overall performance during the lesson, in Russian>",
  "next_rec": "<recommendations and topic suggestion for the next lesson, in Russian>"
}

Chat History:
${history.map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n')}
`;

      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        temperature: 0.3,
        messages: [{ role: 'user', content: summaryPrompt }],
      });

      const firstTextContent = response.content.find(block => block.type === 'text');
      const text = firstTextContent && 'text' in firstTextContent ? firstTextContent.text.trim() : '';
      
      // Clean potential JSON markdown wraps
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const cleanedJson = text.substring(jsonStart, jsonEnd);
        return JSON.parse(cleanedJson);
      }
      
      throw new Error('Failed to parse JSON response from Claude');
    } catch (error) {
      this.logger.error('Error generating lesson summary from Claude', error);
      return this.generateMockSummary(topic);
    }
  }

  /**
   * Builds the comprehensive systemic instructions for Claude.
   */
  private buildSystemPrompt(currentTopic: string, pastSummaries: LessonSummaryContext[]): string {
    let summariesText = 'No previous lessons recorded yet. Start with introductory diagnostics.';
    if (pastSummaries && pastSummaries.length > 0) {
      summariesText = pastSummaries.map((s, idx) => `
Lesson ${idx + 1}:
- Topic: ${s.topic}
- Performance Score: ${s.score}%
- Strengths: ${s.strong}
- Weaknesses: ${s.weak}
- Recommendations: ${s.next_rec}
`).join('\n');
    }

    return `
You are a professional, helpful, and highly encouraging English Tutor. You communicate with the student in a mix of Russian (for explanations, support, and feedback) and English (for exercises, practice, and conversation).

Current lesson topic focus: "${currentTopic || 'General Assessment / Teacher\'s Choice'}".

Guidance:
1. Explain rules in a simple, structured way. Do not overwhelm the user.
2. Provide exercises one-by-one. Let the user answer before giving the next question.
3. Correct mistakes immediately and explain them kindly.
4. When introducing a grammar table, vocabulary list, or structured guide, you MUST output a "rule_card" inside your message.

A "rule_card" must be formatted EXACTLY as a markdown JSON codeblock like this (DO NOT make syntax errors, this will be parsed by the client UI):
\`\`\`json
{
  "type": "rule_card",
  "topic": "<Name of general topic, e.g. Глаголы>",
  "title": "<Specific title of card, e.g. Глагол TO BE — таблица>",
  "content": {
    "headers": ["Местоимение", "Форма", "Пример"],
    "rows": [
      ["I (Я)", "am", "I am a teacher (Я учитель)"],
      ["He/She/It", "is", "He is a student (Он студент)"],
      ["We/You/They", "are", "We are a team (Мы команда)"]
    ]
  }
}
\`\`\`

Here is the context of the student's previous lessons to guide your lesson planning:
=== Previous Lessons History ===
${summariesText}
================================

Acknowledge their weaknesses and reinforce their strengths dynamically without repeating the exact words. Always maintain a positive, welcoming classroom atmosphere.
`;
  }

  /**
   * Generates highly realistic mock tutor replies for local offline testing.
   */
  private async generateMockResponse(topic: string, history: ChatMessage[]): Promise<string> {
    const userMessageCount = history.filter(m => m.role === 'user').length;
    const lastUserMessage = history[history.length - 1]?.content.toLowerCase() || '';

    // If it's the very first exchange of the lesson
    if (userMessageCount === 0) {
      return `Привет! Рад приветствовать тебя на сегодняшнем уроке. 📚

Сегодня мы сосредоточимся на теме **"${topic || 'Business English Negotiation'}"**. Это невероятно полезный навык в современном деловом мире.

Давай начнем с простого правила. В английском языке при переговорах важно использовать вежливые уступки. Например, конструкция: **"If you can... we can..."**.
Я подготовил для тебя небольшую карточку-правило, сохрани её в свой дневник!

\`\`\`json
{
  "type": "rule_card",
  "topic": "Negotiation",
  "title": "Условные предложения в переговорах (First Conditional)",
  "content": {
    "headers": ["Конструкция", "Применение", "Пример"],
    "rows": [
      ["If + Present Simple, will + Verb", "Твердое предложение условий", "If you sign today, we will give a 10% discount."],
      ["If + Present Simple, can + Verb", "Гибкое предложение возможностей", "If you increase the order, we can reduce shipping costs."],
      ["Would it be possible to...", "Очень вежливый запрос уступки", "Would it be possible to extend the deadline by two weeks?"]
    ]
  }
}
\`\`\`

Скажи, приходилось ли тебе уже вести переговоры на английском? Давай попробуем составить твое первое предложение условий по формуле: 
*"Если вы купите 3 лицензии, мы предоставим вам скидку (discount)"*. Попробуй перевести!`;
    }

    // Interactive practice translation validation
    if (lastUserMessage.includes('sign') || lastUserMessage.includes('buy') || lastUserMessage.includes('licens') || lastUserMessage.includes('discount')) {
      return `Великолепно! Твой перевод абсолютно верен. 🌟
Ты написал отличное предложение условий: *"If you buy 3 licenses, we will give you a discount."*

Это идеальный пример **First Conditional** в действии. Обрати внимание, что после **"if"** мы используем настоящее время (*buy*), а во второй части — будущее с *will* (*will give*).

Давай сделаем следующий шаг. В переговорах очень популярна идиома **"Win-Win"** (взаимовыгодный исход).
Вот еще одна карточка полезной лексики для переговоров, которую стоит занести в Дневник:

\`\`\`json
{
  "type": "rule_card",
  "topic": "Vocabulary",
  "title": "Ключевые идиомы для деловых встреч",
  "content": {
    "headers": ["Идиома", "Значение", "Пример в переговорах"],
    "rows": [
      ["Win-win situation", "Взаимовыгодная ситуация", "We are looking for a win-win solution for both of us."],
      ["Meet halfway", "Пойти на взаимные уступки", "Since you cannot accept $10k, let's meet halfway at $9k."],
      ["Get down to business", "Перейти сразу к делу", "Let's skip the small talk and get down to business."]
    ]
  }
}
\`\`\`

Попробуй теперь ответить на такой вопрос: *What is your main goal in business negotiations? Is it always to find a win-win situation?* Напиши свой ответ на английском!`;
    }

    // Fallback dialogue loop
    return `Отличная мысль! Ты очень хорошо формулируешь свои идеи на английском языке. 👍

Твой ответ показывает хорошее владение лексикой переговоров. Давай закрепим это на практике. Я дам тебе сценарий:
*Ты представляешь компанию по разработке ПО. Твой клиент просит завершить проект на неделю раньше, но это потребует сверхурочной работы твоей команды. Тебе нужно вежливо отказать или предложить компромисс.*

Например, используя фразу: **"I understand your position, but unfortunately we can't do it unless we..."** ( unless — если только не).

Напиши свой вариант ответа клиенту!`;
  }

  /**
   * Generates highly realistic mock lesson summary for local testing.
   */
  private generateMockSummary(topic: string): {
    score: number;
    topic: string;
    strong: string;
    weak: string;
    summary: string;
    next_rec: string;
  } {
    return {
      score: 88,
      topic: topic || 'Business English Negotiation',
      strong: 'Отличное понимание концепций переговоров, правильное употребление First Conditional в условных предложениях условий, уверенное владение терминологией "win-win" и "meet halfway".',
      weak: 'Небольшая путаница при быстром ответе с использованием конструкции "unless" и сослагательного наклонения. Иногда забываются вспомогательные глаголы.',
      summary: 'Превосходный урок! Вы продемонстрировали отличную готовность вести деловые беседы. Все практические задания на перевод условий и компромиссов были выполнены с высокой точностью.',
      next_rec: 'Рекомендуется закрепить тему "Сослагательное наклонение в вежливых отказах (Second Conditional)" и повторить разницу между "unless" и "if not" на следующем уроке.',
    };
  }
}
