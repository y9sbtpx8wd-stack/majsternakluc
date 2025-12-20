import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  // ----------------------------------------
  // HELPER: BUILD USER RATING DATA
  // ----------------------------------------
  private buildUserRatingData(user: any) {
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

  // ----------------------------------------
  // GET ALL LISTINGS + USER RATING
  // ----------------------------------------
  async findAll() {
    const listings = await this.prisma.listing.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          include: {
            reviews: true,
          },
        },
      },
    });

    return listings.map((listing) => ({
      ...listing,
      user: this.buildUserRatingData(listing.user),
    }));
  }

  // ----------------------------------------
  // GET ONE LISTING + USER RATING
  // ----------------------------------------
  async findOne(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            reviews: true,
          },
        },
      },
    });

    if (!listing) throw new NotFoundException('Listing not found');

    return {
      ...listing,
      user: this.buildUserRatingData(listing.user),
    };
  }

  // ----------------------------------------
  // GET LISTINGS BY USER
  // ----------------------------------------
  findByUser(userId: string) {
    return this.prisma.listing.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ----------------------------------------
  // CREATE LISTING
  // ----------------------------------------
  create(dto: CreateListingDto, userId: string) {
    return this.prisma.listing.create({
      data: {
        title: dto.title,
        description: dto.description ?? null,
        pricePerHour: dto.pricePerHour ?? null,
        photos: dto.photos ?? [],
        userId,
      },
    });
  }

  // ----------------------------------------
  // UPDATE LISTING
  // ----------------------------------------
  update(id: string, dto: UpdateListingDto, userId: string) {
    return this.prisma.listing.update({
      where: { id },
      data: {
        ...(dto.title !== undefined ? { title: dto.title } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.pricePerHour !== undefined ? { pricePerHour: dto.pricePerHour } : {}),
        ...(dto.photos !== undefined ? { photos: dto.photos } : {}),
        ...(dto.isPublished !== undefined ? { isPublished: dto.isPublished } : {}),
        userId,
      },
    });
  }
}
