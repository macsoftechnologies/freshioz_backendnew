import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsArray, ValidateNested, IsPositive, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
  @ApiProperty({ example: 'PRD_TOMATO_01' })
  @IsNotEmpty()
  @IsString()
  productId!: string;

  @ApiProperty({ example: 'Fresh Country Tomatoes (Nati Tomato)' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: '1 kg' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiProperty({ example: 2, default: 1 })
  @IsNotEmpty({ message: 'Quantity is required' })
  @IsNumber({}, { message: 'Quantity must be a valid number' })
  @IsPositive({ message: 'Quantity must be a positive number greater than zero' })
  @Min(0.01, { message: 'Quantity must be at least 0.01' })
  @Max(1000, { message: 'Quantity cannot exceed 1000 per line item' })
  qty!: number;

  @ApiPropertyOptional({ example: 40, description: 'Optional: Server fetches product retailPrice' })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({ example: 36 })
  @IsOptional()
  @IsNumber()
  effectivePrice?: number;

  @ApiPropertyOptional({ example: 72 })
  @IsOptional()
  @IsNumber()
  totalPrice?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  isBulkApplied?: boolean;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  bulkDiscountPercent?: number;

  @ApiPropertyOptional({ example: 8 })
  @IsOptional()
  @IsNumber()
  bulkSavings?: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: '9876543210' })
  @IsNotEmpty()
  @IsString()
  userPhone!: string;

  @ApiProperty({ example: 'Karthik Rao' })
  @IsNotEmpty()
  @IsString()
  userName!: string;

  @ApiProperty({ example: 'SOC_PRESTIGE_01' })
  @IsNotEmpty({ message: 'Society ID is required. Please select your society/hostel.' })
  @IsString()
  societyId!: string;

  @ApiPropertyOptional({ example: 'Prestige Falcon City' })
  @IsOptional()
  @IsString()
  societyName?: string;

  @ApiProperty({ example: 'Tower 4 - Flat 802' })
  @IsNotEmpty()
  @IsString()
  flatNo!: string;

  @ApiPropertyOptional({ example: 'WH_HEBBAL_01' })
  @IsOptional()
  @IsString()
  warehouseId?: string;

  @ApiPropertyOptional({ example: 'WH_HEBBAL' })
  @IsOptional()
  @IsString()
  warehouseCode?: string;

  @ApiPropertyOptional({ example: 'RETAIL', enum: ['RETAIL', 'BULK'] })
  @IsOptional()
  @IsString()
  orderType?: string;

  @ApiPropertyOptional({ example: 280, description: 'Calculated by server' })
  @IsOptional()
  @IsNumber()
  subtotal?: number;

  @ApiPropertyOptional({ example: 28, default: 0 })
  @IsOptional()
  @IsNumber()
  bulkSavings?: number;

  @ApiPropertyOptional({ example: 0, default: 0 })
  @IsOptional()
  @IsNumber()
  deliveryFee?: number;

  @ApiPropertyOptional({ example: 0, default: 0 })
  @IsOptional()
  @IsNumber()
  gstAmount?: number;

  @ApiPropertyOptional({ example: 252, description: 'Calculated by server' })
  @IsOptional()
  @IsNumber()
  totalAmount?: number;

  @ApiProperty({ example: '16/10/2026', description: 'Strict DD/MM/YYYY date' })
  @IsNotEmpty()
  @IsString()
  deliveryDate!: string;

  @ApiProperty({ example: 'Morning 06:00 AM - 08:30 AM' })
  @IsNotEmpty()
  @IsString()
  deliverySlot!: string;

  @ApiPropertyOptional({ example: 'UPI', enum: ['UPI', 'PAY_ON_DELIVERY'] })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ApiPropertyOptional({ example: 'PAID', enum: ['PAID', 'PENDING_COD'] })
  @IsOptional()
  @IsString()
  paymentStatus?: string;

  @ApiPropertyOptional({ example: 'order_DBJOWzybf0sJbb' })
  @IsOptional()
  @IsString()
  razorpayOrderId?: string;

  @ApiPropertyOptional({ example: 'pay_DBJPHBmErOX5QC' })
  @IsOptional()
  @IsString()
  razorpayPaymentId?: string;

  @ApiPropertyOptional({ example: 'REWARD-8821-1234' })
  @IsOptional()
  @IsString()
  discountCode?: string;

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @IsNumber()
  discountAmount?: number;

  @ApiProperty({ type: [CreateOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];
}
