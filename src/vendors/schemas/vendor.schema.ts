import { ApiProperty } from '@nestjs/swagger';

export class VendorSchema {
  @ApiProperty({ example: 'FRZ_VND_01' })
  id!: string;

  @ApiProperty({ example: 'Kolar Agro Mandi Commission Agents' })
  name!: string;

  @ApiProperty({ example: '9845066778' })
  phone!: string;

  @ApiProperty({ example: 'COMMISSION_AGENT' })
  category!: string;

  @ApiProperty({ example: 'Kolar APMC Mandi Yard, Gate 2' })
  mandiLocation!: string;

  @ApiProperty({ example: 13.1362, required: false })
  lat?: number;

  @ApiProperty({ example: 78.1292, required: false })
  lng?: number;

  @ApiProperty({ example: 'State Bank of India', required: false })
  bankName?: string;

  @ApiProperty({ example: 'Kolar Agro Trading Co', required: false })
  accountHolder?: string;

  @ApiProperty({ example: '30112233445', required: false })
  accountNumber?: string;

  @ApiProperty({ example: 'SBIN0001234', required: false })
  ifscCode?: string;

  @ApiProperty({ example: 'kolaragro@sbi', required: false })
  upiId?: string;

  @ApiProperty({ example: 'ACTIVE' })
  status!: string;

  @ApiProperty({ example: '14/10/2026' })
  formattedCreatedAt!: string;

  @ApiProperty({ example: '05:30 AM IST' })
  formattedTime!: string;
}
