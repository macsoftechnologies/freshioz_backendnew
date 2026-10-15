import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateWarehouseDto {
  @ApiPropertyOptional({ example: 'FRZ_WH_01' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ example: 'WH-BLR-NORTH' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ example: 'Bengaluru North Hub (Hebbal)' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ example: 'Hebbal Ring Road, Bengaluru' })
  @IsNotEmpty()
  @IsString()
  location!: string;

  @ApiPropertyOptional({ example: 13.0358 })
  @IsOptional()
  @IsNumber()
  lat?: number;

  @ApiPropertyOptional({ example: 77.5970 })
  @IsOptional()
  @IsNumber()
  lng?: number;

  @ApiPropertyOptional({ example: '05:00', default: '05:00' })
  @IsOptional()
  @IsString()
  openTime?: string;

  @ApiPropertyOptional({ example: '21:00', default: '21:00' })
  @IsOptional()
  @IsString()
  cutoffTime?: string;

  @ApiPropertyOptional({ example: 45, default: 40 })
  @IsOptional()
  @IsNumber()
  capacityTons?: number;

  @ApiPropertyOptional({ example: 'Suresh Kumar' })
  @IsOptional()
  @IsString()
  managerName?: string;

  @ApiPropertyOptional({ example: '9845012345' })
  @IsOptional()
  @IsString()
  managerPhone?: string;

  @ApiPropertyOptional({ example: 'ACTIVE', default: 'ACTIVE' })
  @IsOptional()
  @IsString()
  status?: string;
}
