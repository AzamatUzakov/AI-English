import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { LessonsModule } from './lessons/lessons.module';
import { MessagesModule } from './messages/messages.module';
import { DiaryModule } from './diary/diary.module';
import { AIModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AIModule,
    LessonsModule,
    MessagesModule,
    DiaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

