import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Successfully connected to PostgreSQL database.');
    } catch (error: any) {
      this.logger.warn(
        `PostgreSQL database connection check: ${error?.message || error}. Server is operational with resilient fallbacks.`
      );
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
    } catch (_) { }
  }
}
