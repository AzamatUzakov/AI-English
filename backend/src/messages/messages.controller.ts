import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('lessons/:lessonId/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  create(
    @Param('lessonId') lessonId: string,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.messagesService.create(lessonId, createMessageDto);
  }

  @Get()
  findByLessonId(@Param('lessonId') lessonId: string) {
    return this.messagesService.findByLessonId(lessonId);
  }
}
