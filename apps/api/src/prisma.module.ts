import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // voliteľné – ak chceš, aby bol dostupný všade bez importu
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
