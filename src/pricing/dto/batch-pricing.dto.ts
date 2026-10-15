import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductPriceItemDto {
  @ApiProperty({ example: 'FRZ_PRD_101' })
  @IsNotEmpty()
  @IsString()
  productId!: string;

  @ApiProperty({ example: 34 })
  @IsNumber()
  retailPrice!: number;

  @ApiProperty({ example: 48 })
  @IsNumber()
  retailMarketPrice!: number;

  @ApiPropertyOptional({ example: 5, default: 0 })
  @IsOptional()
  @IsNumber()
  bulkMinQty?: number;

  @ApiPropertyOptional({ example: 10, default: 0 })
  @IsOptional()
  @IsNumber()
  bulkDiscountPercent?: number;

  @ApiPropertyOptional({ example: 0, default: 0 })
  @IsOptional()
  @IsNumber()
  gstPercent?: number;
}

export class BatchPricingDto {
  @ApiPropertyOptional({ example: '15/10/2026', description: 'Pricing effective date in DD/MM/YYYY' })
  @IsOptional()
  @IsString()
  date?: string;

  @ApiPropertyOptional({ example: 'FRZ_EMP_101' })
  @IsOptional()
  @IsString()
  publishedById?: string;

  @ApiProperty({ type: [ProductPriceItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductPriceItemDto)
  prices!: ProductPriceItemDto[];
}
