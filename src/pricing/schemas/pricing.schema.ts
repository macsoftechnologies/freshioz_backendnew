import { ApiProperty } from '@nestjs/swagger';

export class DailyPriceHistorySchema {
  @ApiProperty({ example: 'uuid-entry-1' })
  id!: string;

  @ApiProperty({ example: 'FRZ_PRD_101' })
  productId!: string;

  @ApiProperty({ example: 34 })
  retailPrice!: number;

  @ApiProperty({ example: 48 })
  retailMarketPrice!: number;

  @ApiProperty({ example: 5 })
  bulkMinQty!: number;

  @ApiProperty({ example: 10 })
  bulkDiscountPercent!: number;

  @ApiProperty({ example: '15/10/2026' })
  publishedDateIST!: string;

  @ApiProperty({ example: '06:00 AM IST' })
  publishedTimeIST!: string;
}

export class PricingDateResponseSchema {
  @ApiProperty({ example: '15/10/2026' })
  date!: string;

  @ApiProperty({ type: [DailyPriceHistorySchema] })
  entries!: any[];
}

export { PricingDateResponseSchema as DailyPriceResponseDto };

