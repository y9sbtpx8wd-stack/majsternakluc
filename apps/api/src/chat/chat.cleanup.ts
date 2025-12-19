import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ChatService } from './chat.service';

@Injectable()
export class ChatCleanupService {
  constructor(private readonly chatService: ChatService) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async handleCleanup() {
    await this.chatService.deleteOldMessages(30);
  }
}
