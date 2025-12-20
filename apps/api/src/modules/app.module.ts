import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ListingsModule } from './listings/listings.module';
import { DemandsModule } from './demands/demands.module';
import { ChatModule } from '../chat/chat.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from '../prisma.module';
import { ReviewsModule } from './reviews/reviews.module';
import { FilterModule } from './filter/filter.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    ListingsModule,
    DemandsModule,
    ReviewsModule,
    FilterModule,
    ChatModule,
  ],
})
export class AppModule {}
