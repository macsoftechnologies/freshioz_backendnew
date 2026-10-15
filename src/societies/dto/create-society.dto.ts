import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateSocietyDto {
  @ApiPropertyOptional({ example: 'FRZ_SOC_01' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ example: 'Greenfield Heights Apartment' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: 'APARTMENT', default: 'APARTMENT' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({ example: 'Thanisandra Main Road, Bengaluru' })
  @IsNotEmpty()
  @IsString()
  address!: string;

  @ApiPropertyOptional({ example: 13.0645 })
  @IsOptional()
  @IsNumber()
  lat?: number;

  @ApiPropertyOptional({ example: 77.6321 })
  @IsOptional()
  @IsNumber()
  lng?: number;

  @ApiPropertyOptional({ example: 'FRZ_WH_01' })
  @IsOptional()
  @IsString()
  warehouseId?: string;

  @ApiPropertyOptional({ example: 'Rajesh Pillai' })
  @IsOptional()
  @IsString()
  secretaryName?: string;

  @ApiPropertyOptional({ example: '9845011999' })
  @IsOptional()
  @IsString()
  secretaryPhone?: string;

  @ApiPropertyOptional({ example: 14 })
  @IsOptional()
  @IsNumber()
  totalFloors?: number;

  @ApiPropertyOptional({ example: 280 })
  @IsOptional()
  @IsNumber()
  totalUnits?: number;

  @ApiPropertyOptional({ example: 'APPROVED', default: 'APPROVED' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: 'PERCENTAGE', default: 'PERCENTAGE' })
  @IsOptional()
  @IsString()
  commissionType?: string;

  @ApiPropertyOptional({ example: 3.5, default: 3.5 })
  @IsOptional()
  @IsNumber()
  commissionValue?: number;

  @ApiPropertyOptional({ example: 'HDFC Bank' })
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiPropertyOptional({ example: 'Greenfield Residents Welfare Association' })
  @IsOptional()
  @IsString()
  accountHolder?: string;

  @ApiPropertyOptional({ example: '50100445566778' })
  @IsOptional()
  @IsString()
  accountNumber?: string;

  @ApiPropertyOptional({ example: 'HDFC0001234' })
  @IsOptional()
  @IsString()
  ifscCode?: string;
}
