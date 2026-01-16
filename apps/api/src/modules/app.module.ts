import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ListingsModule } from './listings/listings.module';
import { DemandsModule } from './demands/demands.module';
import { ChatModule } from '../chat/chat.module';
import { ReviewsModule } from './reviews/reviews.module';
import { FilterModule } from './filter/filter.module';

import { AdminModule } from '../modules/admin/admin.module';
import { InvoiceModule } from '../modules/invoice/invoice.module';
import { StripeModule } from '../modules/stripe/stripe.module';

import { PrismaModule } from '../prisma.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from '../cron/cron.module';
import { UploadModule } from '../upload/upload.module';

import { AdminGateway } from './admin/admin.gateway';
import { RequestLoggerMiddleware } from './middleware/request-logger.middleware';
import { ErrorLoggerFilter } from './filters/error-logger.filter';
import { ThrottlerModule } from '@nestjs/throttler';


@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule,

    // tvoje moduly
    AuthModule,
    UsersModule,
    ListingsModule,
    DemandsModule,
    ReviewsModule,
    FilterModule,
    ChatModule,

    // admin + faktúry + stripe
    AdminModule,
    InvoiceModule,
    StripeModule,

    // cron + upload
    CronModule,
    UploadModule,

    ThrottlerModule.forRoot({ 
      ttl: 60, limit: 100, }),

  ],

  providers: [
    // 🔥 WebSocket gateway
    AdminGateway,

    // 🔥 Error filter (globálny)
    {
      provide: APP_FILTER,
      useClass: ErrorLoggerFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 🔥 Request logger middleware pre všetky route
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
