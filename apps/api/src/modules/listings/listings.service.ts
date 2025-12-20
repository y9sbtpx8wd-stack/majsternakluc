import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.listing.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.listing.findUnique({
      where: { id },
    });
  }

  findByUser(userId: string) {
    return this.prisma.listing.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  create(dto: CreateListingDto, userId: string) {
    return this.prisma.listing.create({
      data: {
        title: dto.title,
        description: dto.description ?? null,
        pricePerHour: dto.pricePerHour ?? null,
        photos: dto.photos ?? [],
        userId,
      },
    });
  }

  update(id: string, dto: UpdateListingDto, userId: string) {
    return this.prisma.listing.update({
      where: { id },
      data: {
        ...(dto.title !== undefined ? { title: dto.title } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.pricePerHour !== undefined ? { pricePerHour: dto.pricePerHour } : {}),
        ...(dto.photos !== undefined ? { photos: dto.photos } : {}),
        ...(dto.isPublished !== undefined ? { isPublished: dto.isPublished } : {}),
        userId,
      },
    });
  }

  delete(id: string, userId: string) {
    // prípadne môžeš neskôr doplniť check, či listing patrí userovi
    return this.prisma.listing.delete({
      where: { id },
    });
  }
}


