import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AdminGateway } from '../modules/admin/admin.gateway';

@Catch()
export class ErrorLoggerFilter implements ExceptionFilter {
  constructor(
    private prisma: PrismaService,
    private gateway: AdminGateway,
  ) {}

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const error = await this.prisma.errorLog.create({
      data: {
        message,
        stack: exception.stack ?? '',
      },
    });

    // 🔥 realtime WS event
    this.gateway.emitErrorLog(error);

    response.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
    });
  }
}
