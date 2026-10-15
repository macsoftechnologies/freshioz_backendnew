import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class UpdateSocietyDto {
  @ApiProperty({ example: 'FRZ_SOC_01' })
  @IsNotEmpty()
  @IsString()
  id!: string;

  @ApiPropertyOptional({ example: 'Greenfield Heights Apartment' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'APARTMENT' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ example: 'Thanisandra Main Road, Bengaluru' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'APPROVED' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: 'FRZ_WH_01' })
  @IsOptional()
  @IsString()
  warehouseId?: string;

  @ApiPropertyOptional({ example: 3.5 })
  @IsOptional()
  @IsNumber()
  commissionValue?: number;

  @ApiPropertyOptional({ example: 'PERCENTAGE' })
  @IsOptional()
  @IsString()
  commissionType?: string;

  @ApiPropertyOptional({ example: 'Rajesh Pillai' })
  @IsOptional()
  @IsString()
  secretaryName?: string;

  @ApiPropertyOptional({ example: '9845011999' })
  @IsOptional()
  @IsString()
  secretaryPhone?: string;

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
