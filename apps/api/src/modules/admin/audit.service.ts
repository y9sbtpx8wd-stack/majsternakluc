import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardExtended() {
    const totalDemands = await this.prisma.demand.count();
    const totalListings = await this.prisma.listing.count();
    const totalUsers = await this.prisma.user.count();

    const daily = await this.prisma.$queryRawUnsafe(`
      SELECT 
        DATE("createdAt") as date,
        COUNT(*) as count
      FROM "Demand"
      WHERE "createdAt" > NOW() - INTERVAL '30 days'
      GROUP BY DATE("createdAt")
      ORDER BY DATE("createdAt")
    `);

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

    const topServices = await this.prisma.$queryRawUnsafe(`
      SELECT service, COUNT(*) as count
      FROM "Demand"
      GROUP BY service
      ORDER BY count DESC
      LIMIT 10
    `);

    const monitoring = await this.prisma.monitoring.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    const requests = await this.prisma.apiRequest.findMany({
      orderBy: { time: 'desc' },
      take: 20,
    });

    const errors = await this.prisma.errorLog.findMany({
      orderBy: { time: 'desc' },
      take: 20,
    });

    const events = await this.prisma.systemEvent.findMany({
      orderBy: { time: 'desc' },
      take: 20,
    });

    const aiTips: string[] = [];

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
}

