import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsIn } from 'class-validator';

export class UpdatePaymentSettingsDto {
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  razorpayEnabled?: boolean;

  @ApiPropertyOptional({ example: 'TEST', enum: ['TEST', 'LIVE'] })
  @IsOptional()
  @IsString()
  @IsIn(['TEST', 'LIVE'])
  activeMode?: 'TEST' | 'LIVE';

  @ApiPropertyOptional({ example: 'rzp_test_1234567890abcdef' })
  @IsOptional()
  @IsString()
  testKeyId?: string;

  @ApiPropertyOptional({ example: 'secret_key_testing_xyz' })
  @IsOptional()
  @IsString()
  testKeySecret?: string;

  @ApiPropertyOptional({ example: 'rzp_live_1234567890abcdef' })
  @IsOptional()
  @IsString()
  liveKeyId?: string;

  @ApiPropertyOptional({ example: 'secret_key_production_xyz' })
  @IsOptional()
  @IsString()
  liveKeySecret?: string;

  @ApiPropertyOptional({ example: 'whsec_abcdef123456' })
  @IsOptional()
  @IsString()
  webhookSecret?: string;
}

