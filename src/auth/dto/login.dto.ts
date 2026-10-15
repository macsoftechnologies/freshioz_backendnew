import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @ApiPropertyOptional({ example: 'superadmin@gmail.com', description: 'Employee / Staff email' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ example: '9888888888', description: 'Customer phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: '123456', description: 'Account password or PIN' })
  @IsString()
  password!: string;
}
