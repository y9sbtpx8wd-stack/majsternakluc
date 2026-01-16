import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaService } from '../prisma.service';
import { MonitoringCron } from './monitoring.cron';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [MonitoringCron, PrismaService],
  exports: [MonitoringCron],
})
export class CronModule {}
