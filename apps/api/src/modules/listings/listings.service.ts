import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Listing } from './listing.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ListingsService {
  constructor(@InjectRepository(Listing) private repo: Repository<Listing>) {}

  findAll() { return this.repo.find(); }
  create(dto: Partial<Listing>) { return this.repo.save(this.repo.create(dto)); }
}
