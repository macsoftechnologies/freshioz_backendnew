import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PricingService } from './pricing.service';
import { BatchPricingDto } from './dto/batch-pricing.dto';
import { DailyPriceResponseDto } from './schemas/pricing.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Pricing')
@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @ApiOperation({ summary: 'Get published daily produce price sheet' })
  @ApiQuery({ name: 'date', required: false, description: 'Filter by date (DD/MM/YYYY)' })
  @ApiResponse({ status: 200, type: DailyPriceResponseDto })
  @Get()
  async getPrices(@Query('date') date?: string) {
    return this.pricingService.getPricesByDate(date);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'PROCUREMENT_OFFICER', 'WAREHOUSE_MANAGER')
  @ApiOperation({ summary: 'Batch publish daily prices' })
  @ApiResponse({ status: 201 })
  @Post('batch')
  async batchPublishBatch(@Body() body: any) {
    return this.pricingService.batchPublishPrices(body);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'PROCUREMENT_OFFICER', 'WAREHOUSE_MANAGER')
  @Post()
  async batchPublish(@Body() body: any) {
    return this.pricingService.batchPublishPrices(body);
  }
}
