import { ApiProperty } from '@nestjs/swagger';

export class LeadSchema {
  @ApiProperty({ example: 'FRZ_LEAD_01' })
  id!: string;

  @ApiProperty({ example: 'Prestige Falcon City' })
  societyName!: string;

  @ApiProperty({ example: 'Anita Deshmukh' })
  contactName!: string;

  @ApiProperty({ example: '9845022334' })
  contactPhone!: string;

  @ApiProperty({ example: 'Apartment Committee Member', required: false })
  contactRole?: string;

  @ApiProperty({ example: 450, required: false })
  flatCount?: number;

  @ApiProperty({ example: 'Kanakapura Road', required: false })
  clusterZone?: string;

  @ApiProperty({ example: 'Kanakapura Main Road, Bengaluru', required: false })
  address?: string;

  @ApiProperty({ example: 'NEW_LEAD', enum: ['NEW_LEAD', 'VERIFIED', 'ONBOARDED', 'DROPPED'] })
  status!: string;

  @ApiProperty({ example: '14/10/2026' })
  createdDateIST!: string;

  @ApiProperty({ example: '08:45 PM IST' })
  createdTimeIST!: string;
}

export class InboundLeadsResponseSchema {
  @ApiProperty({ type: [LeadSchema] })
  leads!: LeadSchema[];

  @ApiProperty({ example: 3 })
  unreadCount!: number;
}
