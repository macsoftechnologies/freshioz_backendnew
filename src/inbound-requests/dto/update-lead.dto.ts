import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateLeadDto {
  @ApiProperty({ example: 'FRZ_LEAD_01' })
  @IsNotEmpty()
  @IsString()
  id!: string;

  @ApiProperty({ example: 'VERIFIED', enum: ['NEW_LEAD', 'VERIFIED', 'ONBOARDED', 'DROPPED'] })
  @IsNotEmpty()
  @IsString()
  status!: string;
}
