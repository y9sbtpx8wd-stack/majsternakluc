import { Controller, Post, Body, Get, Param, Res } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { PrismaService } from '../../prisma.service';
import { PdfService } from './pdf.service';
import { Response } from 'express';

@Controller('invoice')
export class InvoiceController {
  constructor(
    private readonly invoice: InvoiceService,
    private readonly prisma: PrismaService,
    private readonly pdf: PdfService,
  ) {}

  // ----------------------------------------
  // CREATE INVOICE
  // ----------------------------------------
  @Post('create')
  async create(@Body() body: { userId: string; amount: number }) {
    return this.invoice.createInvoice(body.userId, body.amount);
  }

  // ----------------------------------------
  // DOWNLOAD PDF INVOICE
  // ----------------------------------------
  @Get('download/:id')
  async download(@Param('id') id: string, @Res() res: Response) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!invoice) {
      return res.status(404).send('Invoice not found');
    }

    const pdfPath = await this.pdf.generateInvoicePdf(invoice, invoice.user);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=invoice-${invoice.number}.pdf`,
    );

    return res.sendFile(pdfPath);
  }
}

