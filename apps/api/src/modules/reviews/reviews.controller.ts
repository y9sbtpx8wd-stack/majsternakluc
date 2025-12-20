import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private service: ReviewsService) {}

  @Get(':listingId')
  getReviews(@Param('listingId') listingId: string) {
    return this.service.findForListing(listingId);
  }

  @Post(':listingId')
  @UseGuards(AuthGuard)
  create(
    @Param('listingId') listingId: string,
    @Body() dto: CreateReviewDto,
    @CurrentUser() user: any,
  ) {
    return this.service.create(listingId, dto, user.sub);
  }
}
