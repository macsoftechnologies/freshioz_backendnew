import { ApiProperty } from '@nestjs/swagger';

export class StoreStateResponseDto {
  @ApiProperty()
  warehouses!: any[];

  @ApiProperty()
  products!: any[];

  @ApiProperty()
  societies!: any[];

  @ApiProperty()
  orders!: any[];

  @ApiProperty()
  vendors!: any[];

  @ApiProperty()
  procurementLogs!: any[];

  @ApiProperty()
  warehouseInventory!: any;

  @ApiProperty()
  societyRequests!: any[];

  @ApiProperty()
  categories!: any[];

  @ApiProperty()
  units!: any[];

  @ApiProperty()
  employees!: any[];

  @ApiProperty({ example: '15/10/2026, 05:30:00 IST' })
  syncedAtIST!: string;
}
