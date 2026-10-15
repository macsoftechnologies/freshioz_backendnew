import { ApiProperty } from '@nestjs/swagger';

export class SocietySchema {
  @ApiProperty({ example: 'FRZ_SOC_01' })
  id!: string;

  @ApiProperty({ example: 'Greenfield Heights Apartment' })
  name!: string;

  @ApiProperty({ example: 'APARTMENT' })
  type!: string;

  @ApiProperty({ example: 'Thanisandra Main Road, Bengaluru' })
  address!: string;

  @ApiProperty({ example: 13.0645, required: false })
  lat?: number;

  @ApiProperty({ example: 77.6321, required: false })
  lng?: number;

  @ApiProperty({ example: 'FRZ_WH_01', required: false })
  warehouseId?: string;

  @ApiProperty({ example: 'Rajesh Pillai', required: false })
  secretaryName?: string;

  @ApiProperty({ example: '9845011999', required: false })
  secretaryPhone?: string;

  @ApiProperty({ example: 14 })
  totalFloors!: number;

  @ApiProperty({ example: 280 })
  totalUnits!: number;

  @ApiProperty({ example: 'APPROVED' })
  status!: string;

  @ApiProperty({ example: 'PERCENTAGE' })
  commissionType!: string;

  @ApiProperty({ example: 3.5 })
  commissionValue!: number;

  @ApiProperty({ example: 0 })
  balanceEarned!: number;

  @ApiProperty({ example: 0 })
  totalOrdersDelivered!: number;
}
