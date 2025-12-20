import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      include: {
        reviews: true,
      },
    });

    return users.map((user) => this.addRatingData(user));
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        reviews: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return this.addRatingData(user);
  }

  // ----------------------------------------
  // SORT BY RATING
  // ----------------------------------------
  async findBestRated() {
    const users = await this.prisma.user.findMany({
      include: { reviews: true },
    });

    return users
      .map((u) => this.addRatingData(u))
      .sort((a, b) => (b.avgRating ?? 0) - (a.avgRating ?? 0));
  }

  // ----------------------------------------
  // HELPER: ADD RATING DATA
  // ----------------------------------------
  private addRatingData(user: any) {
    const reviews = user.reviews ?? [];

    const reviewCount = reviews.length;
    const avgRating =
      reviewCount > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
        : null;

    // rating summary
    const summary = {
      '5': 0,
      '4': 0,
      '3': 0,
      '2': 0,
      '1': 0,
    };

    reviews.forEach((r) => {
      summary[r.rating]++;
    });

    const summaryPercent = Object.fromEntries(
      Object.entries(summary).map(([star, count]) => [
        star,
        reviewCount > 0 ? Math.round((count / reviewCount) * 100) : 0,
      ]),
    );

    return {
      ...user,
      avgRating,
      reviewCount,
      ratingSummary: summaryPercent,
    };
  }
}
