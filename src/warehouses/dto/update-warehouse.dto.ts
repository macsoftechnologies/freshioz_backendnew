import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class UpdateWarehouseDto {
  @ApiPropertyOptional({ example: 'FRZ_WH_01' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ example: 'Bengaluru North Hub (Hebbal)' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Hebbal Ring Road, Bengaluru' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: 13.0358 })
  @IsOptional()
  @IsNumber()
  lat?: number;

  @ApiPropertyOptional({ example: 77.5970 })
  @IsOptional()
  @IsNumber()
  lng?: number;

  @ApiPropertyOptional({ example: '05:00' })
  @IsOptional()
  @IsString()
  openTime?: string;

  @ApiPropertyOptional({ example: '21:30' })
  @IsOptional()
  @IsString()
  cutoffTime?: string;

  @ApiPropertyOptional({ example: 50 })
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

  @ApiPropertyOptional({ example: 'ACTIVE' })
  @IsOptional()
  @IsString()
  status?: string;
}
