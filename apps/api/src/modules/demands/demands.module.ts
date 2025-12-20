import { Module } from '@nestjs/common';
import { DemandsService } from './demands.service';
import { DemandsController } from './demands.controller';
import { PrismaModule } from '../../prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [DemandsService],
  controllers: [DemandsController],
  exports: [DemandsService],
})
export class DemandsModule {}
