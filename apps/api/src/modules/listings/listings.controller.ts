import { Controller, Get, Post, Body } from '@nestjs/common';
import { ListingsService } from './listings.service';

@Controller('listings')
export class ListingsController {
  constructor(private service: ListingsService) {}

  @Get()
  all() { return this.service.findAll(); }

  @Post()
  create(@Body() dto: { title: string; description: string; pricePerHour?: string; photos?: string[] }) {
    return this.service.create(dto);
  }
}
