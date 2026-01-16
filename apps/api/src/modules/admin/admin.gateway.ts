import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PrismaService } from '../../prisma.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class AdminGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(private prisma: PrismaService) {}

  async afterInit() {
    this.startMonitoringStream();

    // ---------------------------------------------------------
    // 🔥 ADDED — spustenie realtime metrikového streamu
    // ---------------------------------------------------------
    this.startMetricsStream();
  }

  // ---------------------------------------------------------
  // 🔥 pôvodný monitoring stream (CPU, RAM, latency)
  // ---------------------------------------------------------
  private async startMonitoringStream() {
    setInterval(async () => {
      const latest = await this.prisma.monitoring.findFirst({
        orderBy: { createdAt: 'desc' },
      });

      const now = new Date();
      const oneMinuteAgo = new Date(now.getTime() - 60_000);

      const requestsPerMinute = await this.prisma.apiRequest.count({
        where: { time: { gte: oneMinuteAgo } },
      });

      const errorsPerMinute = await this.prisma.errorLog.count({
        where: { time: { gte: oneMinuteAgo } },
      });

      const activeChats = await this.prisma.chat.count({
        where: { isClosed: false },
      });

      const activeUsers = await this.prisma.user.count({
        where: { updatedAt: { gte: oneMinuteAgo } },
      });

      this.server.emit('monitoring-update', {
        cpu: latest?.cpu ?? 0,
        ram: latest?.ram ?? 0,
        latency: latest?.latency ?? 0,
        requestsPerMinute,
        errorsPerMinute,
        activeUsers,
        activeChats,
      });
    }, 3000);
  }

  // ---------------------------------------------------------
  // 🔥 ADDED — realtime stream pre API requesty/min, errors/min,
  //            aktívnych používateľov a chaty
  // ---------------------------------------------------------
  private async startMetricsStream() {
    setInterval(async () => {
      const now = new Date();
      const oneMinuteAgo = new Date(now.getTime() - 60_000);

      const metrics = {
        requestsPerMinute: await this.prisma.apiRequest.count({
          where: { time: { gte: oneMinuteAgo } },
        }),
        errorsPerMinute: await this.prisma.errorLog.count({
          where: { time: { gte: oneMinuteAgo } },
        }),
        activeUsers: await this.prisma.user.count({
          where: { updatedAt: { gte: oneMinuteAgo } },
        }),
        activeChats: await this.prisma.chat.count({
          where: { isClosed: false },
        }),
      };

      this.server.emit('metrics-update', metrics);
    }, 3000);
  }

  // ---------------------------------------------------------
  // 🔥 ADDED — realtime API request log
  // ---------------------------------------------------------
  emitApiRequestLog(log: any) {
    this.server.emit('api-request-log', log);
  }

  // ---------------------------------------------------------
  // 🔥 ADDED — realtime error log
  // ---------------------------------------------------------
  emitErrorLog(error: any) {
    this.server.emit('error-log', error);
  }

  // ---------------------------------------------------------
  // 🔥 ADDED — realtime chat správa
  // ---------------------------------------------------------
  emitChatMessage(message: any) {
    this.server.emit('chat-message', message);
  }
 // ---------------------------------------------------------
  // 🔥 ADDED — audit-log
  // ---------------------------------------------------------
  emitAuditLog(entry: any) {
  this.server.emit('audit-log', entry);
}

}
