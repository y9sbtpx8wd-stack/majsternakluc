import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma.module';
import { UserService } from '../users/user.service';
import { UsersController } from '../users/users.controller';

@Module({
  imports: [PrismaModule],
  providers: [UserService],
  controllers: [UsersController],
})
export class UsersModule {}

