import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRazorpayOrderDto {
  @ApiProperty({ example: 450.5, description: 'Order total amount in INR' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  amount!: number;

  @ApiPropertyOptional({ example: 'INR', default: 'INR' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ example: 'rcpt_1730000000' })
  @IsOptional()
  @IsString()
  receipt?: string;

  @ApiPropertyOptional({ example: { societyId: 'FRZ_SOC_01' } })
  @IsOptional()
  notes?: Record<string, any>;
}
