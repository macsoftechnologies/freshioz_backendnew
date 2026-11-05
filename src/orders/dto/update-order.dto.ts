import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';

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

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  codSettledToHub?: boolean;

  @ApiPropertyOptional({ example: 'Hub Cashier Desk' })
  @IsOptional()
  @IsString()
  codSettledBy?: string;

  @ApiPropertyOptional({ example: 'CASH', enum: ['CASH', 'UPI_QR'] })
  @IsOptional()
  @IsString()
  codReceivedMode?: string;

  @ApiPropertyOptional({ example: 'pay_ABC1234567' })
  @IsOptional()
  @IsString()
  razorpayPaymentId?: string;

  @ApiPropertyOptional({ example: 'Resident not available / Door locked' })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({ example: 'Resident not available / Door locked' })
  @IsOptional()
  @IsString()
  cancelledReason?: string;

  @ApiPropertyOptional({ example: 'FRZ_LOT_101' })
  @IsOptional()
  @IsString()
  deliveryLotId?: string;

  @ApiPropertyOptional({ example: 'FRZ_EMP_105' })
  @IsOptional()
  @IsString()
  deliveryPartnerId?: string;

  @ApiPropertyOptional({ example: 'Ravi Kumar' })
  @IsOptional()
  @IsString()
  deliveryPartnerName?: string;

  @ApiPropertyOptional({ example: '9876543216' })
  @IsOptional()
  @IsString()
  deliveryPartnerPhone?: string;

  @ApiPropertyOptional({ example: 'KA-04-E-5581' })
  @IsOptional()
  @IsString()
  vehicleNumber?: string;

  @ApiPropertyOptional({ example: 'Warehouse Dispatch Lead' })
  @IsOptional()
  @IsString()
  dispatchedBy?: string;
}


