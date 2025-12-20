import { Controller, Get, Param, Query } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Controller('admin/invoice')
export class AdminInvoiceController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('list')
  async list(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('userId') userId?: string,
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

    if (userId) {
      where.userId = userId;
    }

    const [invoices, total] = await Promise.all([
      this.prisma.invoice.findMany({
        where,
        include: { user: true },
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      this.prisma.invoice.count({ where }),
    ]);

    return {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
      data: invoices,
    };
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!invoice) {
      return { error: 'Invoice not found' };
    }

    return invoice;
  }
}

