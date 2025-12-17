import { Controller, Get, Param } from '@nestjs/common';
import { DemandsService } from './demands.service';

@Controller('demands')
export class DemandsController {
  constructor(private readonly demandsService: DemandsService) {}

  @Get()
  findAll() {
    return this.demandsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.demandsService.findOne(id);
  }
}
