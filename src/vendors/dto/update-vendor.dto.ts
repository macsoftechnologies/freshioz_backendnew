import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class UpdateVendorDto {
  @ApiPropertyOptional({ example: 'FRZ_VND_01' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ example: 'Kolar Agro Mandi Commission Agents' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: '9845066778' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'COMMISSION_AGENT' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 'Kolar APMC Mandi Yard, Gate 2' })
  @IsOptional()
  @IsString()
  mandiLocation?: string;

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

  @ApiPropertyOptional({ example: 'ACTIVE' })
  @IsOptional()
  @IsString()
  status?: string;
}
