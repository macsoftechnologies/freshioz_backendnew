import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateLeadDto {
  @ApiPropertyOptional({ example: 'FRZ_LEAD_01' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ example: 'Prestige Falcon City' })
  @IsNotEmpty()
  @IsString()
  societyName!: string;

  @ApiProperty({ example: 'Anita Deshmukh' })
  @IsNotEmpty()
  @IsString()
  contactName!: string;

  @ApiProperty({ example: '9845022334' })
  @IsNotEmpty()
  @IsString()
  contactPhone!: string;

  @ApiPropertyOptional({ example: 'Apartment Committee Member' })
  @IsOptional()
  @IsString()
  contactRole?: string;

  @ApiPropertyOptional({ example: 450 })
  @IsOptional()
  @IsNumber()
  flatCount?: number;

  @ApiPropertyOptional({ example: 'Kanakapura Road' })
  @IsOptional()
  @IsString()
  clusterZone?: string;

  @ApiPropertyOptional({ example: 'Kanakapura Main Road, Bengaluru' })
  @IsOptional()
  @IsString()
  address?: string;
}
