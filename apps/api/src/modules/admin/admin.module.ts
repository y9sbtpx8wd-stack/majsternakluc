import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminInvoiceController } from './admin-invoice.controller';
import { PrismaService } from '../../prisma.service';
import { AuditService } from './audit.service';
import { AdminGateway } from './admin.gateway';
import { AdminService } from './admin.service';

@Module({
  controllers: [
    AdminController,
    AdminInvoiceController,
  ],

  providers: [
    PrismaService,
    AuditService,
    AdminGateway,
    AdminService,
  ],

  exports: [
    AuditService,
    AdminGateway,
  ],
})
export class AdminModule {}
