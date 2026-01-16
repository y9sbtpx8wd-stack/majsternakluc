import { Injectable, NestMiddleware } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AdminGateway } from '../modules/admin/admin.gateway';
import { Request, Response, NextFunction } from 'express';
import { performance } from 'perf_hooks';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(
    private prisma: PrismaService,
    private gateway: AdminGateway,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const start = performance.now();

    res.on('finish', async () => {
      const duration = Math.round(performance.now() - start);

      const log = await this.prisma.apiRequest.create({
        data: {
          method: req.method,
          path: req.originalUrl,
          status: res.statusCode,
          duration,
        },
      });

      // 🔥 realtime WS event
      this.gateway.emitApiRequestLog(log);
    });

    next();
  }
}
