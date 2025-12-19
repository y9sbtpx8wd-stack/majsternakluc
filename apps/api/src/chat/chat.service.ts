import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async startChat(payload: {
    listingId: string;
    listingTitle: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    firstMessage?: string;
  }) {
    const chat = await this.prisma.chat.create({
      data: {
        listingId: payload.listingId,
        listingTitle: payload.listingTitle,
        customerName: payload.customerName,
        customerEmail: payload.customerEmail,
        customerPhone: payload.customerPhone,
        messages: payload.firstMessage
          ? {
              create: {
                sender: 'customer',
                text: payload.firstMessage,
              },
            }
          : undefined,
      },
    });

    return chat;
  }

  async addMessage(chatId: string, sender: string, text: string) {
    const message = await this.prisma.message.create({
      data: {
        chatId,
        sender,
        text,
      },
    });
    return message;
  }

  async getMessages(chatId: string) {
    return this.prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getChat(chatId: string) {
    return this.prisma.chat.findUnique({
      where: { id: chatId },
    });
  }

  async deleteOldMessages(days = 30) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    await this.prisma.message.deleteMany({
      where: {
        createdAt: {
          lt: cutoff,
        },
      },
    });
  }
}
