import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray } from 'class-validator';

export class CreateProductDto {
  @ApiPropertyOptional({ example: 'FRZ_PRD_101' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ example: 'Country Tomatoes (Nati Tomato)' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: 'ನಾಟಿ ಟೊಮೆಟೊ' })
  @IsOptional()
  @IsString()
  kannadaName?: string;

  @ApiPropertyOptional({ example: 'VEGETABLES', default: 'VEGETABLES' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ example: '1 kg', default: '1 kg' })
  @IsOptional()
  @IsString()
  retailUnit?: string;

  @ApiPropertyOptional({ example: 32, default: 40 })
  @IsOptional()
  @IsNumber()
  retailPrice?: number;

  @ApiPropertyOptional({ example: 45, default: 55 })
  @IsOptional()
  @IsNumber()
  retailMarketPrice?: number;

  @ApiPropertyOptional({ example: 5, default: 0 })
  @IsOptional()
  @IsNumber()
  bulkMinQty?: number;

  @ApiPropertyOptional({ example: 10, default: 0 })
  @IsOptional()
  @IsNumber()
  bulkDiscountPercent?: number;

  @ApiPropertyOptional({ example: 'Kolar APMC Mandi' })
  @IsOptional()
  @IsString()
  origin?: string;

  @ApiPropertyOptional({ example: '4-5 Days' })
  @IsOptional()
  @IsString()
  shelfLife?: string;

  @ApiPropertyOptional({ example: 'Freshly harvested country tomatoes with rich tangy flavor.' })
  @IsOptional()
  @IsString()
  desc?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ example: 'Harvested Today at Dawn' })
  @IsOptional()
  @IsString()
  badge?: string;

  @ApiPropertyOptional({ example: ['Salads', 'Curry Essential'] })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiPropertyOptional({ example: 0, default: 0 })
  @IsOptional()
  @IsNumber()
  gstPercent?: number;
}
