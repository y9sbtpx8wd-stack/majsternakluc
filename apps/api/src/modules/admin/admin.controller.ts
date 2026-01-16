import { Controller, Get, Query, Param } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Response } from 'express'; 
import { Res } from '@nestjs/common';
import * as archiver from 'archiver';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { parse } from 'csv-parse';
import { Post, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { UseGuards } from '@nestjs/common';
import { AdminGuard } from './admin.guard';
import { AuditService } from './audit.service';
import { UseInterceptors } from '@nestjs/common'; 
import { AuditInterceptor } from './audit.interceptor';
import { AdminService } from './admin.service';
import { Roles } from '../auth/roles.decorator'; 
import { Role } from '../auth/roles.enum'; 
import { RolesGuard } from '../auth/roles.guard';


@UseGuards(AdminGuard, RolesGuard) 
@Roles(Role.ADMIN, Role.SUPERADMIN)
@UseInterceptors(AuditInterceptor) 
@Controller('admin')
export class AdminController {
  constructor
  (private readonly prisma: PrismaService, 
   private readonly audit: AuditService,
   private adminService: AdminService,)
  {}

  // ---------------------------------------------------------
  // 🔥 ADDED — /admin/dashboard-extended
  // ---------------------------------------------------------
  @Get('dashboard-extended')
  async getDashboardExtended() {
    // ŠTATISTIKY
    const totalDemands = await this.prisma.demand.count();
    const totalListings = await this.prisma.listing.count();
    const totalUsers = await this.prisma.user.count();

    // DOPYTY ZA 30 DNÍ
    const daily = await this.prisma.$queryRawUnsafe(`
      SELECT 
        DATE("createdAt") as date,
        COUNT(*) as count
      FROM "Demand"
      WHERE "createdAt" > NOW() - INTERVAL '30 days'
      GROUP BY DATE("createdAt")
      ORDER BY DATE("createdAt")
    `);

    // TOP USERS
    const topUsers = await this.prisma.user.findMany({
      orderBy: [
        { demands: { _count: 'desc' } },
        { listings: { _count: 'desc' } },
      ],
      take: 10,
      include: {
        _count: {
          select: { demands: true, listings: true },
        },
      },
    });

    const formattedTopUsers = topUsers.map((u) => ({
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      demands: u._count.demands,
      listings: u._count.listings,
    }));

    // TOP SERVICES
    const topServices = await this.prisma.$queryRawUnsafe(`
      SELECT service, COUNT(*) as count
      FROM "Demand"
      GROUP BY service
      ORDER BY count DESC
      LIMIT 10
    `);

    // MONITORING
    const monitoring = await this.prisma.monitoring.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    // POSLEDNÉ API REQUESTY
    const requests = await this.prisma.apiRequest.findMany({
      orderBy: { time: 'desc' },
      take: 20,
    });

    // ERRORS
    const errors = await this.prisma.errorLog.findMany({
      orderBy: { time: 'desc' },
      take: 20,
    });

    // SYSTEM EVENTS
    const events = await this.prisma.systemEvent.findMany({
      orderBy: { time: 'desc' },
      take: 20,
    });

    // AI ODPORÚČANIA
    const aiTips = [];

    if (totalDemands > 1000) {
      aiTips.push('Počet dopytov je vysoký – zvážte zvýraznenie najlepších majstrov.');
    }

    if (monitoring?.latency > 200) {
      aiTips.push('API latencia je zvýšená – odporúčame skontrolovať databázu.');
    }

    if (errors.length > 10) {
      aiTips.push('Zvýšený počet chýb – odporúčame audit posledných deployov.');
    }

    return {
      stats: {
        totalDemands,
        totalListings,
        totalUsers,
      },
      daily,
      topUsers: formattedTopUsers,
      topServices,
      monitoring,
      requests,
      errors,
      events,
      aiTips,
    };
  }
  // ---------------------------------------------------------
  // 🔥 END ADDED
  // ---------------------------------------------------------



  // ---------------------------------------------------------
  // 🔥 ADDED — Admin detail inzerátu
  // ---------------------------------------------------------
  @Get('listings/:id/detail')
  async getListingDetail(@Param('id') id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    const stats = await this.prisma.listingStats.findUnique({
      where: { listingId: id },
    });

    const history = await this.prisma.listingHistory.findMany({
      where: { listingId: id },
      orderBy: { createdAt: 'desc' },
    });

    const reviews = await this.prisma.review.findMany({
      where: { listingId: id },
      include: { reviewer: true },
    });

    const reports = await this.prisma.report.findMany({
      where: { targetId: id, type: 'listing' },
      include: { reporter: true },
    });

    return {
      listing,
      stats,
      history,
      reviews,
      reports,
    };
  }
  // ---------------------------------------------------------
  // 🔥 END ADDED
  // ---------------------------------------------------------

// ---------------------------------------------------------
// 🔥 ADDED — Admin detail dopytu
// ---------------------------------------------------------
@Get('demands/:id/detail')
async getDemandDetail(@Param('id') id: string) {
  const demand = await this.prisma.demand.findUnique({
    where: { id },
    include: {
      user: true,
    },
  });

  const reports = await this.prisma.report.findMany({
    where: { targetId: id, type: 'demand' },
    include: { reporter: true },
  });

  return {
    demand,
    reports,
  };
}
// ---------------------------------------------------------
// 🔥 END ADDED
// ---------------------------------------------------------

// ---------------------------------------------------------
// 🔥 ADDED — Admin detail používateľa
// ---------------------------------------------------------
@Get('users/:id/detail')
async getUserDetail(@Param('id') id: string) {
  const user = await this.prisma.user.findUnique({
    where: { id },
    include: {
      profile: true,
      listings: true,
      demands: true,
      reviews: true,
    },
  });

  const reports = await this.prisma.report.findMany({
    where: { targetId: id, type: 'user' },
    include: { reporter: true },
  });

  return {
    user,
    reports,
  };
}
// ---------------------------------------------------------
// 🔥 END ADDED
// ---------------------------------------------------------
// ---------------------------------------------------------
// 🔥 ADDED — Admin audit log
// ---------------------------------------------------------
@Get('audit')
async getAuditLog(
  @Query('entity') entity?: string,
  @Query('user') userEmail?: string,
) {
  const where: any = {};

  if (entity) where.action = { contains: entity };
  if (userEmail) where.userEmail = { contains: userEmail };

  const logs = await this.prisma.listingHistory.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  return logs;
}
// ---------------------------------------------------------
// 🔥 END ADDED
// ---------------------------------------------------------
// ---------------------------------------------------------
// 🔥 ADDED — Admin reporty
// ---------------------------------------------------------

// Všetky reporty
@Get('reports')
async getReports(@Query('type') type?: string) {
  const where: any = {};
  if (type) where.type = type;

  return this.prisma.report.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { reporter: true },
  });
}

// Detail reportu
@Get('reports/:id')
async getReportDetail(@Param('id') id: string) {
  return this.prisma.report.findUnique({
    where: { id },
    include: { reporter: true },
  });
}

// Označiť ako vyriešené
@Get('reports/:id/resolve')
async resolveReport(@Param('id') id: string) {
  return this.prisma.report.update({
    where: { id },
    data: { status: 'resolved' },
  });
}

// Zamietnuť report
@Get('reports/:id/dismiss')
async dismissReport(@Param('id') id: string) {
  return this.prisma.report.update({
    where: { id },
    data: { status: 'dismissed' },
  });
}

// Zmazať cieľ reportu (inzerát/dopyt/recenzia/používateľ)
@Get('reports/:id/delete-target')
async deleteReportTarget(@Param('id') id: string) {
  const report = await this.prisma.report.findUnique({ where: { id } });

  if (!report) return { error: 'Report not found' };

  if (report.type === 'listing') {
    await this.prisma.listing.delete({ where: { id: report.targetId } });

    // 🔥 Audit log 
    await this.audit.log(req.user.id, 'DELETE_LISTING', { listingId: report.targetId })
  }

  if (report.type === 'demand') {
    await this.prisma.demand.delete({ where: { id: report.targetId } });

    // 🔥 Audit log 
    await this.audit.log(req.user.id, 'DELETE_LISTING', { listingId: report.targetId })
  }

  if (report.type === 'review') {
    await this.prisma.review.delete({ where: { id: report.targetId } });

    // 🔥 Audit log 
    await this.audit.log(req.user.id, 'DELETE_LISTING', { listingId: report.targetId })
  }

  if (report.type === 'user') {
    await this.prisma.user.delete({ where: { id: report.targetId } });

    // 🔥 Audit log 
    await this.audit.log(req.user.id, 'DELETE_LISTING', { listingId: report.targetId })
  }

  return { success: true };
}
// ---------------------------------------------------------
// 🔥 END ADDED
// ---------------------------------------------------------

// 🔥 Admin import CSV (hromadné pridanie inzerátov)
@Post('import/listings')
@UseInterceptors(FileInterceptor('file'))
async importListings(@UploadedFile() file: Express.Multer.File) {
  const content = fs.readFileSync(file.path, 'utf8');

  const records: any[] = await new Promise((resolve, reject) => {
    parse(
      content,
      { columns: true, skip_empty_lines: true },
      (err, output) => (err ? reject(err) : resolve(output)),
    );
  });

  for (const row of records) {
    await this.prisma.listing.create({
      data: {
        userId: row.userId,
        title: row.title,
        summary: row.summary,
        description: row.description,
        category: row.category as any,
        location: row.location,
        price: row.price ? Number(row.price) : null,
        pricePerHour: row.pricePerHour,
        photos: row.photos ? row.photos.split('|') : [],
      },
    });
  }

  return { imported: records.length };
}


// ---------------------------------------------------------
// 🔥 ADDED — Admin detail recenzie
// ---------------------------------------------------------
@Get('reviews/:id/detail')
async getReviewDetail(@Param('id') id: string) {
  const review = await this.prisma.review.findUnique({
    where: { id },
    include: {
      reviewer: true,
      targetUser: true,
      listing: true,
    },
  });

  const reports = await this.prisma.report.findMany({
    where: { targetId: id, type: 'review' },
    include: { reporter: true },
  });

  return {
    review,
    reports,
  };
}
// ---------------------------------------------------------
// 🔥 END ADDED
// ---------------------------------------------------------
// ---------------------------------------------------------
// 🔥 ADDED — Admin detail chatu
// ---------------------------------------------------------
@Get('chats/:id/detail')
async getChatDetail(@Param('id') id: string) {
  const chat = await this.prisma.chat.findUnique({
    where: { id },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!chat) return { error: 'Chat not found' };

  return chat;
}
// ---------------------------------------------------------
// 🔥 END ADDED
// ---------------------------------------------------------
// ---------------------------------------------------------
// 🔥 ADDED — Admin hromadné akcie pre inzeráty
// ---------------------------------------------------------

// Skryť všetky inzeráty
@Get('listings/hide-all')
async hideAllListings() {
  await this.prisma.listing.updateMany({
    data: { isPublished: false },
  });
  return { success: true };
}

// Zverejniť všetky inzeráty
@Get('listings/publish-all')
async publishAllListings() {
  await this.prisma.listing.updateMany({
    data: { isPublished: true },
  });
  return { success: true };
}

// Označiť všetky ako premium
@Get('listings/premium-all')
async premiumAllListings() {
  await this.prisma.listing.updateMany({
    data: { category: 'PREMIUM' }, // alebo ak máš iný field
  });
  return { success: true };
}
// ---------------------------------------------------------
// 🔥 END ADDED
// ---------------------------------------------------------

// ---------------------------------------------------------
// 🔥 ADDED — Admin export CSV
// ---------------------------------------------------------
@Get('export/listings')
async exportListings(@Res() res: Response) {
  const listings = await this.prisma.listing.findMany({
    include: { user: true },
  });

  const header = [
    'id',
    'title',
    'category',
    'location',
    'price',
    'userEmail',
    'createdAt',
  ];

  const rows = listings.map((l) => [
    l.id,
    l.title,
    l.category ?? '',
    l.location ?? '',
    l.price ?? '',
    l.user.email,
    l.createdAt.toISOString(),
  ]);

  const csv =
    header.join(',') +
    '\n' +
    rows.map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=listings.csv');
  res.send(csv);
}
// ---------------------------------------------------------
// 🔥 END ADDED
// ---------------------------------------------------------

// ---------------------------------------------------------
// 🔥 ADDED — Admin export všetkých dát do ZIP
// ---------------------------------------------------------
@Get('export/all')
async exportAllData(@Res() res: Response) {
  const archive = archiver('zip', { zlib: { level: 9 } });

  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename=export.zip');

  archive.pipe(res);

  // Helper na CSV
  const toCSV = (rows: any[]) => {
    if (!rows.length) return '';
    const header = Object.keys(rows[0]);
    const csvRows = rows.map((r) =>
      header.map((h) => JSON.stringify(r[h] ?? '')).join(',')
    );
    return header.join(',') + '\n' + csvRows.join('\n');
  };

  // Export Users
  const users = await this.prisma.user.findMany();
  archive.append(toCSV(users), { name: 'users.csv' });

  // Export Listings
  const listings = await this.prisma.listing.findMany();
  archive.append(toCSV(listings), { name: 'listings.csv' });

  // Export Demands
  const demands = await this.prisma.demand.findMany();
  archive.append(toCSV(demands), { name: 'demands.csv' });

  // Export Reviews
  const reviews = await this.prisma.review.findMany();
  archive.append(toCSV(reviews), { name: 'reviews.csv' });

  // Export Reports
  const reports = await this.prisma.report.findMany();
  archive.append(toCSV(reports), { name: 'reports.csv' });

  // Export Monitoring
  const monitoring = await this.prisma.monitoring.findMany();
  archive.append(toCSV(monitoring), { name: 'monitoring.csv' });

  // Export API Requests
  const apiRequests = await this.prisma.apiRequest.findMany();
  archive.append(toCSV(apiRequests), { name: 'api_requests.csv' });

  // Export Errors
  const errors = await this.prisma.errorLog.findMany();
  archive.append(toCSV(errors), { name: 'errors.csv' });

  // Export System Events
  const events = await this.prisma.systemEvent.findMany();
  archive.append(toCSV(events), { name: 'system_events.csv' });

  await archive.finalize();
}
// ---------------------------------------------------------
// 🔥 END ADDED
// ---------------------------------------------------------

// ---------------------------------------------------------
// 🔥 ADDED — Admin import CSV (hromadné pridanie inzerátov)
// ---------------------------------------------------------
@Post('import/listings')
@UseInterceptors(FileInterceptor('file'))
async importListings(@UploadedFile() file: Express.Multer.File) {
  const content = fs.readFileSync(file.path, 'utf8');

  const records: any[] = await new Promise((resolve, reject) => {
    parse(
      content,
      {
        columns: true,
        skip_empty_lines: true,
      },
      (err, output) => {
        if (err) reject(err);
        else resolve(output);
      },
    );
  });

  for (const row of records) {
    await this.prisma.listing.create({
      data: {
        userId: row.userId,
        title: row.title,
        summary: row.summary,
        description: row.description,
        category: row.category as any,
        location: row.location,
        price: row.price ? Number(row.price) : null,
        pricePerHour: row.pricePerHour,
        photos: row.photos ? row.photos.split('|') : [],
      },
    });
  }

  return { imported: records.length };
}
// ---------------------------------------------------------
// 🔥 END ADDED
// ---------------------------------------------------------

  // ---------------------------------------------------------
  // PÔVODNÝ KÓD 
  // ---------------------------------------------------------
  @Get('email-logs')
  async getEmailLogs(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    const pageNum = Number(page);
    const limitNum = Number(limit);

    const where: any = {};

    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lte = new Date(to);
    }

    const logs = await this.prisma.emailLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    });

    const total = await this.prisma.emailLog.count({ where });

    return {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
      data: logs,
    };
  }
}
// 🔥 Posledné API logy
@Get('logs/api')
async getApiLogs() {
  return this.prisma.apiRequest.findMany({
    orderBy: { time: 'desc' },
    take: 100,
  });
}

// 🔥 Posledné error logy
@Get('logs/errors')
async getErrorLogs() {
  return this.prisma.errorLog.findMany({
    orderBy: { time: 'desc' },
    take: 100,
  });
}

// 🔥 Posledné chat správy
@Get('logs/chats')
async getChatLogs() {
  return this.prisma.message.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
}

// 🔥 Export jednej faktúry do PDF
@Get('invoices/:id/pdf')
async exportInvoicePdf(@Param('id') id: string, @Res() res: Response) {
  const invoice = await this.prisma.invoice.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!invoice) {
    res.status(404).send('Invoice not found');
    return;
  }

  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=invoice-${invoice.number}.pdf`,
  );
  doc.pipe(res);

  doc.fontSize(20).text('Faktúra', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Číslo: ${invoice.number}`);
  doc.text(`Dátum: ${invoice.date.toISOString().slice(0, 10)}`);
  doc.text(`Suma: ${invoice.amount} €`);
  doc.moveDown();
  doc.text(`Zákazník: ${invoice.user.firstName} ${invoice.user.lastName ?? ''}`);
  doc.text(`Email: ${invoice.user.email}`);

  doc.end();
}
// 🔥 Export reportov do PDF
@Get('reports/export/pdf')
async exportReportsPdf(@Res() res: Response) {
  const reports = await this.prisma.report.findMany({
    orderBy: { createdAt: 'desc' },
    include: { reporter: true },
  });

  const doc = new PDFDocument({ margin: 40 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=reports.pdf');
  doc.pipe(res);

  doc.fontSize(20).text('Reporty', { align: 'center' });
  doc.moveDown();

  reports.forEach((r) => {
    doc
      .fontSize(12)
      .text(`ID: ${r.id}`)
      .text(`Typ: ${r.type}`)
      .text(`Dôvod: ${r.reason}`)
      .text(`Status: ${r.status}`)
      .text(
        `Reporter: ${r.reporter?.email ?? 'neznámy'} (${r.reporterId ?? '-'})`,
      )
      .text(`Target ID: ${r.targetId}`)
      .text(`Dátum: ${r.createdAt.toISOString()}`)
      .moveDown();
  });

  doc.end();
}
