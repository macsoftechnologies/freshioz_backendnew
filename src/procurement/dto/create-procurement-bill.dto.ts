import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray } from 'class-validator';

export class ProcurementItemDto {
  @ApiProperty({ example: 'Country Tomatoes (Nati Tomato)' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ example: 25 })
  @IsNumber()
  qty!: number;

  @ApiProperty({ example: 28 })
  @IsNumber()
  rate!: number;

  @ApiPropertyOptional({ example: 'kg', default: 'kg' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({ example: 700 })
  @IsOptional()
  @IsNumber()
  total?: number;
}

export class CreateProcurementBillDto {
  @ApiPropertyOptional({ example: 'APMC/KLR/2026/8841' })
  @IsOptional()
  @IsString()
  billNumber?: string;

  @ApiPropertyOptional({ example: 'FRZ_VND_01' })
  @IsOptional()
  @IsString()
  vendorId?: string;

  @ApiProperty({ example: 'Kolar Agro Mandi Commission Agents' })
  @IsNotEmpty()
  @IsString()
  vendorName!: string;

  @ApiProperty({ example: 'Kolar APMC Mandi Yard' })
  @IsNotEmpty()
  @IsString()
  mandiLocation!: string;

  @ApiProperty({ example: 'FRZ_WH_01' })
  @IsNotEmpty()
  @IsString()
  destinationWarehouseId!: string;

  @ApiProperty({ example: 'Bengaluru North Hub (Hebbal)' })
  @IsNotEmpty()
  @IsString()
  destinationName!: string;

  @ApiPropertyOptional({ example: 'IMPS_TRANSFER', default: 'IMPS_TRANSFER' })
  @IsOptional()
  @IsString()
  paymentMode?: string;

  @ApiProperty({ example: 50 })
  @IsNumber()
  totalWeightKg!: number;

  @ApiProperty({ example: 1500 })
  @IsNumber()
  produceAmount!: number;

  @ApiPropertyOptional({ example: 250, default: 0 })
  @IsOptional()
  @IsNumber()
  transportAmount?: number;

  @ApiProperty({ example: 1750 })
  @IsNumber()
  totalAmountPaid!: number;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400' })
  @IsOptional()
  @IsString()
  receiptPhoto?: string;

  @ApiPropertyOptional({ example: 'Mohan Gowda' })
  @IsOptional()
  @IsString()
  procuredBy?: string;

  @ApiPropertyOptional({ example: 'Morning Fresh Slot', default: 'Morning Fresh Slot' })
  @IsOptional()
  @IsString()
  slot?: string;

  @ApiProperty({ type: [ProcurementItemDto] })
  @IsArray()
  items!: ProcurementItemDto[];
}
