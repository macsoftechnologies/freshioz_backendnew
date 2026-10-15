import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateOrderStatusDto {
  @ApiPropertyOptional({ example: 'DELIVERED', enum: ['CONFIRMED', 'PACKED', 'DISPATCHED', 'DELIVERED', 'CANCELLED'] })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: 'PAID', enum: ['PAID', 'PENDING_COD', 'COLLECTED'] })
  @IsOptional()
  @IsString()
  paymentStatus?: string;

  @ApiPropertyOptional({ example: 252 })
  @IsOptional()
  @IsNumber()
  codCollectedAmount?: number;

  @ApiPropertyOptional({ example: 'Ravi Kumar (Delivery Executive)' })
  @IsOptional()
  @IsString()
  codCollectedBy?: string;
}
