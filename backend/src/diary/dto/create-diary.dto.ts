export class CreateDiaryDto {
  lessonId?: string;
  topic?: string;
  title: string;
  content: Record<string, any>; // JSONB — headers[] + rows[][]
}

