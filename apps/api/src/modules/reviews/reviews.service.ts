import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  create(listingId: string, dto: CreateReviewDto, userId: string) {
    return this.prisma.review.create({
      data: {
        rating: dto.rating,
        comment: dto.comment ?? null,
        listingId,
        userId,
      },
    });
  }

  findForListing(listingId: string) {
    return this.prisma.review.findMany({
      where: { listingId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
