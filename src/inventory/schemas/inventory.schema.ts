import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InventoryItemResponseDto {
  @ApiProperty({ example: 'inv_12345' })
  id!: string;

  @ApiProperty({ example: 'WH_HEBBAL_01' })
  warehouseId!: string;

  @ApiPropertyOptional({ example: 'Bengaluru North Hub' })
  warehouseName?: string;

  @ApiProperty({ example: 'PRD_TOMATO_01' })
  productId!: string;

  @ApiPropertyOptional({ example: 'Fresh Country Tomatoes' })
  productName?: string;

  @ApiProperty({ example: 85.5 })
  currentQty!: number;

  @ApiProperty({ example: 12.0 })
  reservedQty!: number;

  @ApiProperty({ example: 73.5, description: 'Available quantity (current - reserved)' })
  availableQty!: number;

  @ApiProperty({ example: 'kg' })
  unit!: string;

  @ApiProperty({ example: '15/10/2026, 05:30:00 IST' })
  updatedAtFormatted!: string;
}
