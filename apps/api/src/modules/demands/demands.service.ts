import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateDemandDto } from './dto/create-demand.dto';
import { UpdateDemandDto } from './dto/update-demand.dto';

@Injectable()
export class DemandsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.demand.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.demand.findUnique({
      where: { id },
    });
  }

  findByUser(userId: string) {
    return this.prisma.demand.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  create(dto: CreateDemandDto, userId: string) {
    return this.prisma.demand.create({
      data: {
        title: dto.title,
        description: dto.description,
        category: dto.category ?? null,
        location: dto.location ?? null,
        userId,
      },
    });
  }

  update(id: string, dto: UpdateDemandDto, userId: string) {
    return this.prisma.demand.update({
      where: { id },
      data: {
        ...(dto.title !== undefined ? { title: dto.title } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.category !== undefined ? { category: dto.category } : {}),
        ...(dto.location !== undefined ? { location: dto.location } : {}),
        ...(dto.isPublished !== undefined ? { isPublished: dto.isPublished } : {}),
        userId,
      },
    });
  }

  delete(id: string, userId: string) {
    return this.prisma.demand.delete({
      where: { id },
    });
  }
}

