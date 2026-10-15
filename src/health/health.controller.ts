import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { HealthResponseDto } from './schemas/health.schema';
import { toISTFullString } from '../common/date-utils';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'System health check & database liveness' })
  @ApiResponse({ status: 200, type: HealthResponseDto })
  async check() {
    let dbStatus = 'connected';
    let latencyMs = 0;
    let tableCounts: any = {};
    const start = Date.now();
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      latencyMs = Date.now() - start;
      const [categories, units, warehouses, products, societies, orders, users, employees] = await Promise.all([
        this.prisma.category.count(),
        this.prisma.unit.count(),
        this.prisma.warehouse.count(),
        this.prisma.product.count(),
        this.prisma.society.count(),
        this.prisma.order.count(),
        this.prisma.user.count(),
        this.prisma.employee.count(),
      ]);
      tableCounts = { categories, units, warehouses, products, societies, orders, users, employees };
    } catch (e: any) {
      dbStatus = `disconnected: ${e.message}`;
    }

    return {
      status: 'ok',
      service: 'Freshioz Enterprise NestJS API',
      serverTimeIST: toISTFullString(new Date()),
      database: dbStatus,
      databaseLatencyMs: latencyMs,
      tableCounts,
    };
  }
}
