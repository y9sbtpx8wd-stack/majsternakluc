import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminInvoiceController } from './admin-invoice.controller';
import { PrismaService } from '../../prisma.service';
import { AdminService } from './admin.service';
import { AdminGateway } from './admin.gateway';
import { AuditService } from './audit.service';
import { MonitoringService } from './monitoring.service';
import { LoggingService } from './logging.service';
import { AuditInterceptor } from './audit.interceptor';
import { AdminGuard } from './admin.guard'; 
import { RolesGuard } from '../auth/roles.guard';

@Module({
  controllers: [AdminController, AdminInvoiceController],
  providers: [
    PrismaService,
    AdminService,
    AdminGateway,
    AuditService,
    MonitoringService,
    LoggingService,
    AuditInterceptor,
    AdminGuard, 
    RolesGuard,
  ],
  exports: [AdminGateway, AuditService, MonitoringService, LoggingService],
})
export class AdminModule {}
