import { Controller, Get, Query } from '@nestjs/common';
import { FilterService } from './filter.service';

@Controller('filter')
export class FilterController {
  constructor(private service: FilterService) {}

  @Get()
  filter(
    @Query('role') role?: string,
    @Query('city') city?: string,
  ) {
    return this.service.filter(role, city);
  }
}
