import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AdjustStockDto {
  @ApiProperty({ example: 'WH_HEBBAL_01' })
  @IsNotEmpty()
  @IsString()
  warehouseId!: string;

  @ApiProperty({ example: 'PRD_TOMATO_01' })
  @IsNotEmpty()
  @IsString()
  productId!: string;

  @ApiProperty({ example: 50, description: 'Quantity to add (positive) or subtract (negative), or set' })
  @IsNumber()
  qty!: number;

  @ApiPropertyOptional({ example: 'ADD', enum: ['ADD', 'SET', 'REDUCE'], default: 'SET' })
  @IsOptional()
  @IsString()
  action?: 'ADD' | 'SET' | 'REDUCE';

  @ApiPropertyOptional({ example: 'Morning Mandi Receipt batch #8841' })
  @IsOptional()
  @IsString()
  remarks?: string;
}
