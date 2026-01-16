import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MetricsCron {
  constructor(private prisma: PrismaService) {}

  @Cron('*/10 * * * * *') // každých 10 sekúnd
  async computeMetrics() {
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60_000);

    const requestsPerMinute = await this.prisma.apiRequest.count({
      where: { time: { gte: oneMinuteAgo } },
    });

    const errorsPerMinute = await this.prisma.errorLog.count({
      where: { time: { gte: oneMinuteAgo } },
    });

    const activeUsers = await this.prisma.user.count({
      where: { updatedAt: { gte: oneMinuteAgo } },
    });

    const activeChats = await this.prisma.chat.count({
      where: { isClosed: false },
    });

    await this.prisma.metrics.create({
      data: {
        requestsPerMinute,
        errorsPerMinute,
        activeUsers,
        activeChats,
      },
    });
  }
}
