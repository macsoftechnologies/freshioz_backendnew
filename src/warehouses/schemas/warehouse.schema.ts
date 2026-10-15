import { ApiProperty } from '@nestjs/swagger';

export class WarehouseSchema {
  @ApiProperty({ example: 'FRZ_WH_01' })
  id!: string;

  @ApiProperty({ example: 'WH-BLR-NORTH' })
  code!: string;

  @ApiProperty({ example: 'Bengaluru North Hub (Hebbal)' })
  name!: string;

  @ApiProperty({ example: 'Hebbal Ring Road, Bengaluru' })
  location!: string;

  @ApiProperty({ example: 13.0358, required: false })
  lat?: number;

  @ApiProperty({ example: 77.5970, required: false })
  lng?: number;

  @ApiProperty({ example: '05:00' })
  openTime!: string;

  @ApiProperty({ example: '21:00' })
  cutoffTime!: string;

  @ApiProperty({ example: 45 })
  capacityTons!: number;

  @ApiProperty({ example: 'Suresh Kumar', required: false })
  managerName?: string;

  @ApiProperty({ example: '9845012345', required: false })
  managerPhone?: string;

  @ApiProperty({ example: 'ACTIVE' })
  status!: string;

  @ApiProperty({ example: '2026-10-14T00:00:00.000Z' })
  createdAt!: Date;
}
