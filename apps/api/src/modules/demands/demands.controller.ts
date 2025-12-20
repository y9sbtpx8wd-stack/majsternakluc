import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { DemandsService } from './demands.service';
import { CreateDemandDto } from './dto/create-demand.dto';
import { UpdateDemandDto } from './dto/update-demand.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

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

  @Get('me/mine')
  @UseGuards(AuthGuard)
  myDemands(@CurrentUser() user: any) {
    return this.demandsService.findByUser(user.sub);
  }

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() dto: CreateDemandDto,
    @CurrentUser() user: any,
  ) {
    return this.demandsService.create(dto, user.sub);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDemandDto,
    @CurrentUser() user: any,
  ) {
    return this.demandsService.update(id, dto, user.sub);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  delete(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.demandsService.delete(id, user.sub);
  }
}
