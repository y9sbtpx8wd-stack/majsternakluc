import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma.service';
import * as os from 'os';
import { performance } from 'perf_hooks';

@Injectable()
export class MonitoringCron {
  constructor(private prisma: PrismaService) {}

  private async measureLatency() {
    const start = performance.now();
    await fetch('https://api.ipify.org?format=json');
    return Math.round(performance.now() - start);
  }

  @Cron('*/15 * * * * *') // každých 15 sekúnd
  async handleMonitoring() {
    const cpu = Math.round(100 - (os.freemem() / os.totalmem()) * 100);
    const ram = Math.round(((os.totalmem() - os.freemem()) / os.totalmem()) * 100);
    const latency = await this.measureLatency();

    await this.prisma.monitoring.create({
      data: { cpu, ram, latency },
    });

    console.log('Monitoring updated:', { cpu, ram, latency });
  }
}
