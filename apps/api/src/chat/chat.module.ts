import { Module } from '@nestjs/common';
import { ChatService } from '../chat/chat.service';
import { ChatGateway } from '../chat/chat.gateway';
import { ChatController } from '../chat/chat.controller';
import { PrismaService } from '../prisma.service';
import { ChatCleanupService } from './chat.cleanup';

@Module({
  providers: [
    ChatService,
    ChatGateway,
    ChatCleanupService,   // 🔥 MUSÍ TU BYŤ
    PrismaService,
  ],
  controllers: [ChatController],
})
export class ChatModule {}