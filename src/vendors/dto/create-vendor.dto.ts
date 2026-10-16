import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateVendorDto {
  @ApiPropertyOptional({ example: 'FRZ_VND_01' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ example: 'Kolar Agro Mandi Commission Agents' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ example: '9845066778' })
  @IsNotEmpty()
  @IsString()
  phone!: string;

  @ApiPropertyOptional({ example: 'COMMISSION_AGENT', default: 'COMMISSION_AGENT' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ example: 'Kolar APMC Mandi Yard, Gate 2' })
  @IsNotEmpty()
  @IsString()
  mandiLocation!: string;

  @ApiPropertyOptional({ example: 13.1362 })
  @IsOptional()
  @IsNumber()
  lat?: number;

  @ApiPropertyOptional({ example: 78.1292 })
  @IsOptional()
  @IsNumber()
  lng?: number;

  @ApiPropertyOptional({ example: 'State Bank of India' })
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiPropertyOptional({ example: 'Kolar Agro Trading Co' })
  @IsOptional()
  @IsString()
  accountHolder?: string;

  @ApiPropertyOptional({ example: 'Manjunath Gowda' })
  @IsOptional()
  @IsString()
  contactPerson?: string;

  @ApiPropertyOptional({ example: '30112233445' })
  @IsOptional()
  @IsString()
  accountNumber?: string;

  @ApiPropertyOptional({ example: 'SBIN0001234' })
  @IsOptional()
  @IsString()
  ifscCode?: string;

  @ApiPropertyOptional({ example: 'kolaragro@sbi' })
  @IsOptional()
  @IsString()
  upiId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  bankDetails?: any;

  @ApiPropertyOptional({ example: 'ACTIVE', default: 'ACTIVE' })
  @IsOptional()
  @IsString()
  status?: string;
}
