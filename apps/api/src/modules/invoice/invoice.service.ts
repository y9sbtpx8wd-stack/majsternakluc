import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { MailService } from '../mail/mail.service';
import { PdfService } from './pdf.service';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
    private readonly pdf: PdfService,
  ) {}

  async createInvoice(userId: string, amount: number) {
    // 1) Vytvoríme faktúru
    const invoice = await this.prisma.invoice.create({
      data: {
        userId,
        amount,
        number: `INV-${Date.now()}`,
      },
      include: { user: true },
    });

    // 2) Vygenerujeme PDF faktúru
    const pdfPath = await this.pdf.generateInvoicePdf(invoice, invoice.user);

    // 3) Okamžite odošleme email s PDF prílohou
    await this.mail.sendInvoiceEmail(invoice.user, invoice, pdfPath);

    return invoice;
  }
}
