import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateReviewDto, reviewerId: string) {
    return this.prisma.review.create({
      data: {
        rating: dto.rating,
        comment: dto.comment ?? null,
        reviewerId,
        targetUserId: dto.targetUserId,
      },
    });
  }

  findForUser(userId: string) {
    return this.prisma.review.findMany({
      where: { targetUserId: userId },
      include: {
        reviewer: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

