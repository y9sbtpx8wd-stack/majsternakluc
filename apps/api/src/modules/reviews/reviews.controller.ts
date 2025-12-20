import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private service: ReviewsService) {}

  @Get(':userId')
  getReviews(@Param('userId') userId: string) {
    return this.service.findForUser(userId);
  }

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() dto: CreateReviewDto,
    @CurrentUser() user: any,
  ) {
    return this.service.create(dto, user.sub);
  }
}

