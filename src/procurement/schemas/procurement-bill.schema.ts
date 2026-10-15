import { ApiProperty } from '@nestjs/swagger';

export class ProcurementBillSchema {
  @ApiProperty({ example: 'FRZ_BILL_01' })
  id!: string;

  @ApiProperty({ example: 'APMC/KLR/2026/8841' })
  billNumber!: string;

  @ApiProperty({ example: 'Kolar Agro Mandi Commission Agents' })
  vendorName!: string;

  @ApiProperty({ example: 'Kolar APMC Mandi Yard' })
  mandiLocation!: string;

  @ApiProperty({ example: 'FRZ_WH_01' })
  destinationWarehouseId!: string;

  @ApiProperty({ example: 'Bengaluru North Hub (Hebbal)' })
  destinationName!: string;

  @ApiProperty({ example: 'IMPS_TRANSFER' })
  paymentMode!: string;

  @ApiProperty({ example: 50 })
  totalWeightKg!: number;

  @ApiProperty({ example: 1500 })
  produceAmount!: number;

  @ApiProperty({ example: 250 })
  transportAmount!: number;

  @ApiProperty({ example: 1750 })
  totalAmountPaid!: number;

  @ApiProperty({ example: 'Mohan Gowda' })
  procuredBy!: string;

  @ApiProperty({ example: 'Morning Fresh Slot' })
  slot!: string;

  @ApiProperty({ example: '14/10/2026' })
  procuredAtFormatted!: string;

  @ApiProperty({ example: '05:30 AM IST' })
  procuredAtTime!: string;

  @ApiProperty({ example: '14/10/2026, 05:30 AM IST' })
  createdAtFormatted!: string;

  @ApiProperty({ example: [] })
  items!: any[];
}

export { ProcurementBillSchema as ProcurementBillResponseDto };
