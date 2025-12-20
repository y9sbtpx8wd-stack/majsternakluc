import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma.module';
import { UserService } from './user.service';
import { UsersController } from './users.controller';

@Module({
  imports: [PrismaModule],
  providers: [UserService],
  controllers: [UsersController],
  exports: [UserService],
})
export class UsersModule {}
