import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class FilterService {
  constructor(private prisma: PrismaService) {}

  async filter(role?: string, city?: string) {
    const users = await this.prisma.user.findMany({
      where: {
        ...(role ? { role } : {}),
        ...(city ? { city } : {}),
      },
    });

    if (users.length > 0) {
      return { type: 'users', data: users };
    }

    const listings = await this.prisma.listing.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return { type: 'listings', data: listings };
  }
}
