import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminInvoiceController } from './admin-invoice.controller';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [AdminController, AdminInvoiceController],
  providers: [PrismaService],
})
export class AdminModule {}