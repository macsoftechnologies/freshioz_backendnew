import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderItemResponseDto {
  @ApiProperty({ example: 'item_123' })
  id!: string;

  @ApiProperty({ example: 'PRD_TOMATO_01' })
  productId!: string;

  @ApiProperty({ example: 'Fresh Country Tomatoes (Nati Tomato)' })
  name!: string;

  @ApiProperty({ example: '1 kg' })
  unit!: string;

  @ApiProperty({ example: 2 })
  qty!: number;

  @ApiProperty({ example: 40 })
  price!: number;

  @ApiPropertyOptional({ example: 36 })
  effectivePrice?: number;

  @ApiPropertyOptional({ example: 72 })
  totalPrice?: number;

  @ApiPropertyOptional({ example: true })
  isBulkApplied?: boolean;
}

export class OrderResponseDto {
  @ApiProperty({ example: 'FRZ-ORD-8891' })
  id!: string;

  @ApiProperty({ example: '9876543210' })
  userPhone!: string;

  @ApiProperty({ example: 'Karthik Rao' })
  userName!: string;

  @ApiPropertyOptional({ example: 'Prestige Falcon City' })
  societyName?: string;

  @ApiProperty({ example: 'Tower 4 - Flat 802' })
  flatNo!: string;

  @ApiProperty({ example: 252 })
  totalAmount!: number;

  @ApiProperty({ example: 280 })
  subtotal!: number;

  @ApiProperty({ example: 28 })
  bulkSavings!: number;

  @ApiProperty({ example: '16/10/2026', description: 'Strict DD/MM/YYYY date' })
  deliveryDate!: string;

  @ApiProperty({ example: 'Morning 06:00 AM - 08:30 AM' })
  deliverySlot!: string;

  @ApiProperty({ example: 'CONFIRMED' })
  status!: string;

  @ApiProperty({ example: 'UPI' })
  paymentMethod!: string;

  @ApiProperty({ example: 'PAID' })
  paymentStatus!: string;

  @ApiProperty({ type: [OrderItemResponseDto] })
  items!: OrderItemResponseDto[];

  @ApiProperty({ example: '15/10/2026, 05:30:00 IST' })
  orderPlacedAtFormatted!: string;
}
