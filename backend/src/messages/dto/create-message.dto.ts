export class CreateMessageDto {
  content: string;
  role: 'user' | 'assistant';
}
