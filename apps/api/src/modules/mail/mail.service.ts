import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class MailService {
  constructor(private readonly prisma: PrismaService) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
  }

  // ----------------------------------------
  // LOAD TEMPLATE WITH VARIABLES
  // ----------------------------------------
  private loadTemplate(templateName: string, variables: Record<string, string>) {
    const filePath = path.join(__dirname, 'templates', templateName);
    let html = fs.readFileSync(filePath, 'utf8');

    for (const key in variables) {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), variables[key]);
    }

    return html;
  }

  // ----------------------------------------
  // SEND VERIFICATION EMAIL
  // ----------------------------------------
  async sendVerificationEmail(
    email: string,
    token: string,
    name?: string,
    lang: string = 'sk'
  ) {
    const url = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    const subject =
      lang === 'en'
        ? 'Verify your email'
        : lang === 'cz'
        ? 'Ověření emailu'
        : 'Overenie emailu';

    const html = this.loadTemplate('verify-email.html', {
      url,
      name: name ?? 'používateľ',
      lang,
      subject,
      logo: process.env.BRAND_LOGO_URL!,
      brand: process.env.BRAND_NAME!,
      support: process.env.BRAND_SUPPORT_EMAIL!,
      website: process.env.BRAND_WEBSITE!,
    });

    await sgMail.send({
      to: email,
      from: process.env.SENDGRID_FROM!,
      subject,
      html,
    });

    await this.prisma.emailLog.create({
      data: {
        to: email,
        subject,
        template: 'verify-email',
      },
    });
  }

  // ----------------------------------------
  // SEND PASSWORD RESET EMAIL
  // ----------------------------------------
  async sendPasswordResetEmail(
    email: string,
    token: string,
    name?: string,
    lang: string = 'sk'
  ) {
    const url = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const subject =
      lang === 'en'
        ? 'Reset your password'
        : lang === 'cz'
        ? 'Reset hesla'
        : 'Reset hesla';

    const html = this.loadTemplate('reset-password.html', {
      url,
      name: name ?? 'používateľ',
      lang,
      subject,
      logo: process.env.BRAND_LOGO_URL!,
      brand: process.env.BRAND_NAME!,
      support: process.env.BRAND_SUPPORT_EMAIL!,
      website: process.env.BRAND_WEBSITE!,
    });

    await sgMail.send({
      to: email,
      from: process.env.SENDGRID_FROM!,
      subject,
      html,
    });

    await this.prisma.emailLog.create({
      data: {
        to: email,
        subject,
        template: 'reset-password',
      },
    });
  }

  // ----------------------------------------
  // SEND WELCOME EMAIL
  // ----------------------------------------
  async sendWelcomeEmail(user: any) {
    const subject =
      user.language === 'en'
        ? 'Welcome!'
        : user.language === 'cz'
        ? 'Vítej!'
        : 'Vitaj!';

    const html = this.loadTemplate('welcome.html', {
      name: user.firstName,
      lang: user.language,
      subject,
      logo: process.env.BRAND_LOGO_URL!,
      brand: process.env.BRAND_NAME!,
      support: process.env.BRAND_SUPPORT_EMAIL!,
      website: process.env.BRAND_WEBSITE!,
    });

    await sgMail.send({
      to: user.email,
      from: process.env.SENDGRID_FROM!,
      subject,
      html,
    });

    await this.prisma.emailLog.create({
      data: {
        to: user.email,
        subject,
        template: 'welcome',
      },
    });
  }

  // ----------------------------------------
  // SEND INVOICE EMAIL
  // ----------------------------------------
  async sendInvoiceEmail(user: any, invoice: any) {
    const subject = `Faktúra #${invoice.number}`;

    const html = this.loadTemplate('invoice.html', {
      name: user.firstName,
      invoiceNumber: invoice.number,
      amount: invoice.amount.toString(),
      date: invoice.date.toISOString().split('T')[0],
      lang: user.language,
      subject,
      logo: process.env.BRAND_LOGO_URL!,
      brand: process.env.BRAND_NAME!,
      support: process.env.BRAND_SUPPORT_EMAIL!,
      website: process.env.BRAND_WEBSITE!,
    });

    await sgMail.send({
      to: user.email,
      from: process.env.SENDGRID_FROM!,
      subject,
      html,
    });

    await this.prisma.emailLog.create({
      data: {
        to: user.email,
        subject,
        template: 'invoice',
      },
    });
  }

  // ----------------------------------------
  // SEND NOTIFICATION EMAIL
  // ----------------------------------------
  async sendNotificationEmail(user: any, message: string, url: string) {
    const subject =
      user.language === 'en'
        ? 'New notification'
        : user.language === 'cz'
        ? 'Nová notifikace'
        : 'Nová notifikácia';

    const html = this.loadTemplate('notification.html', {
      name: user.firstName,
      message,
      url,
      lang: user.language,
      subject,
      logo: process.env.BRAND_LOGO_URL!,
      brand: process.env.BRAND_NAME!,
      support: process.env.BRAND_SUPPORT_EMAIL!,
      website: process.env.BRAND_WEBSITE!,
    });

    await sgMail.send({
      to: user.email,
      from: process.env.SENDGRID_FROM!,
      subject,
      html,
    });

    await this.prisma.emailLog.create({
      data: {
        to: user.email,
        subject,
        template: 'notification',
      },
    });
  }
}
