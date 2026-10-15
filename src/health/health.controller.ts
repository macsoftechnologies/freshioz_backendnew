import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { HealthResponseDto } from './schemas/health.schema';
import { toISTFullString } from '../common/date-utils';

@ApiTags('Health & Monitoring')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('live')
  @ApiOperation({ summary: 'Process liveness probe (Container / PM2 heartbeat)' })
  @ApiResponse({ status: 200, description: 'API application process is alive and responding' })
  liveness() {
    return {
      status: 'UP',
      uptimeSeconds: Math.floor(process.uptime()),
      timestampIST: toISTFullString(new Date()),
    };
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness probe (Verifies PostgreSQL database connectivity)' })
  @ApiResponse({ status: 200, description: 'Database is connected and ready to serve traffic' })
  @ApiResponse({ status: 503, description: 'Database connection failed' })
  async readiness() {
    const start = Date.now();
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'READY',
        database: 'connected',
        latencyMs: Date.now() - start,
        timestampIST: toISTFullString(new Date()),
      };
    } catch (e) {
      throw new ServiceUnavailableException({
        status: 'NOT_READY',
        database: 'disconnected',
        error: 'Database connection check failed',
        timestampIST: toISTFullString(new Date()),
      });
    }
  }

  @Get()
  @ApiOperation({ summary: 'Comprehensive system health and entity counts' })
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
      dbStatus = 'disconnected';
    }

    return {
      status: dbStatus === 'connected' ? 'ok' : 'degraded',
      service: 'Freshioz Enterprise NestJS API',
      serverTimeIST: toISTFullString(new Date()),
      database: dbStatus,
      databaseLatencyMs: latencyMs,
      tableCounts,
    };
  }
}
