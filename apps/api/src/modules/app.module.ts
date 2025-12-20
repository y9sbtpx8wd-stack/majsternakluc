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
import { AdminModule } from '../modules/admin/admin.module';
import { InvoiceModule } from '../modules/invoice/invoice.module';
import { StripeModule } from '../modules/stripe/stripe.module';

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
    AdminModule,
    InvoiceModule,
    StripeModule,
  ],
})
export class AppModule {}
