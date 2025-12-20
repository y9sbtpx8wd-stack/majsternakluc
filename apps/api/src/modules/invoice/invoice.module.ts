import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { PrismaService } from '../../prisma.service';
import { MailService } from '../mail/mail.service';

@Module({
  controllers: [InvoiceController],
  providers: [InvoiceService, PrismaService, MailService],
})
export class InvoiceModule {}
