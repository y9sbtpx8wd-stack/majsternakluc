import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('listings')
export class ListingsController {
  constructor(private service: ListingsService) {}

  @Get()
  all() {
    return this.service.findAll();
  }

  @Get(':id')
  one(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get('me/mine')
  @UseGuards(AuthGuard)
  myListings(@CurrentUser() user: any) {
    return this.service.findByUser(user.sub);
  }

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() dto: CreateListingDto,
    @CurrentUser() user: any,
  ) {
    return this.service.create(dto, user.sub);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateListingDto,
    @CurrentUser() user: any,
  ) {
    return this.service.update(id, dto, user.sub);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  delete(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.service.delete(id, user.sub);
  }
}

