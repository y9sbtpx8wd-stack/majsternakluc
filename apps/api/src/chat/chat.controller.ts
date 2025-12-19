import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('start')
  async startChat(
    @Body()
    body: {
      listingId: string;
      listingTitle: string;
      customerName?: string;
      customerEmail?: string;
      customerPhone?: string;
      firstMessage?: string;
    },
  ) {
    return this.chatService.startChat(body);
  }

  @Post(':id/message')
  async sendMessage(
    @Param('id') chatId: string,
    @Body() body: { sender: string; text: string },
  ) {
    return this.chatService.addMessage(chatId, body.sender, body.text);
  }

  @Get(':id/messages')
  async getMessages(@Param('id') chatId: string) {
    return this.chatService.getMessages(chatId);
  }
}
