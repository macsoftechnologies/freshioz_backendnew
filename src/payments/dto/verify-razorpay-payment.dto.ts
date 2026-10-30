import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderDto } from '../../orders/dto/create-order.dto';

export class VerifyRazorpayPaymentDto {
  @ApiProperty({ example: 'order_DBJOWzybf0sJbb' })
  @IsNotEmpty()
  @IsString()
  razorpayOrderId!: string;

  @ApiProperty({ example: 'pay_DBJPHBmErOX5QC' })
  @IsNotEmpty()
  @IsString()
  razorpayPaymentId!: string;

  @ApiProperty({ example: '9a918a09f874288b698ab...' })
  @IsNotEmpty()
  @IsString()
  razorpaySignature!: string;

  @ApiProperty({ type: CreateOrderDto })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateOrderDto)
  orderPayload!: CreateOrderDto;
}
