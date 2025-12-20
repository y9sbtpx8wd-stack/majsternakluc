import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PdfService {
  async generateInvoicePdf(invoice: any, user: any): Promise<string> {
    const fileName = `invoice-${invoice.number}.pdf`;
    const filePath = path.join('/tmp', fileName);

    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Logo
    if (process.env.BRAND_LOGO_URL) {
      try {
        doc.image(process.env.BRAND_LOGO_URL, 50, 40, { width: 120 });
      } catch {}
    }

    doc.fontSize(20).text(`Faktúra #${invoice.number}`, 50, 150);
    doc.moveDown();

    doc.fontSize(14).text(`Dátum: ${invoice.date.toISOString().split('T')[0]}`);
    doc.text(`Meno: ${user.firstName} ${user.lastName}`);
    doc.text(`Email: ${user.email}`);
    doc.moveDown();

    doc.fontSize(16).text(`Suma: ${invoice.amount} €`);
    doc.moveDown();

    doc.fontSize(12).text(`Vystavil: ${process.env.BRAND_NAME}`);
    doc.text(`Web: ${process.env.BRAND_WEBSITE}`);
    doc.text(`Kontakt: ${process.env.BRAND_SUPPORT_EMAIL}`);

    doc.end();

    return new Promise((resolve) => {
      stream.on('finish', () => resolve(filePath));
    });
  }
}

