import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ListingsModule } from './listings/listings.module';
import { DemandsModule } from './demands/demands.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true // pre MVP, neskôr vypnúť
    }),
    AuthModule,
    UsersModule,
    ListingsModule,
    DemandsModule
  ]
})
export class AppModule {}
