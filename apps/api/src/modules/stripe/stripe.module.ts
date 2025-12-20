import { Module } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { InvoiceService } from '../invoice/invoice.service';
import { PrismaService } from '../../prisma.service';
import { MailService } from '../mail/mail.service';
import { PdfService } from '../invoice/pdf.service';

@Module({
  controllers: [StripeController],
  providers: [InvoiceService, PrismaService, MailService, PdfService],
})
export class StripeModule {}
