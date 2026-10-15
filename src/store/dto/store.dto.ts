import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateFreshiozStoreDto {
  @ApiPropertyOptional()
  @IsOptional()
  warehouses?: any[];

  @ApiPropertyOptional()
  @IsOptional()
  products?: any[];

  @ApiPropertyOptional()
  @IsOptional()
  societies?: any[];

  @ApiPropertyOptional()
  @IsOptional()
  orders?: any[];

  @ApiPropertyOptional()
  @IsOptional()
  vendors?: any[];

  @ApiPropertyOptional()
  @IsOptional()
  procurementLogs?: any[];

  @ApiPropertyOptional()
  @IsOptional()
  warehouseInventory?: any;

  @ApiPropertyOptional()
  @IsOptional()
  societyRequests?: any[];

  @ApiPropertyOptional()
  @IsOptional()
  categories?: any[];

  @ApiPropertyOptional()
  @IsOptional()
  units?: any[];

  @ApiPropertyOptional()
  @IsOptional()
  employees?: any[];

  @ApiPropertyOptional()
  @IsOptional()
  withdrawals?: any[];
}
