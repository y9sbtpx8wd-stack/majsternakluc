import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Demand} from '@prisma/client';

@Injectable()
export class DemandsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Demand[]> {
    return this.prisma.demand.findMany();
  }

  async findOne(id: number): Promise<Demand | null> {
    return this.prisma.demand.findUnique({ where: { id } });
  }
}
