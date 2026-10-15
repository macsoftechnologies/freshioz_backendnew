import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEmail, IsArray } from 'class-validator';

export class UpdateEmployeeDto {
  @ApiProperty({ example: 'FRZ_EMP_102' })
  @IsNotEmpty()
  @IsString()
  id!: string;

  @ApiPropertyOptional({ example: 'Ravi Sharma' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: '9845099887' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'salesperson@freshioz.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'newPassword123' })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({ example: ['SALES_OFFICER'] })
  @IsOptional()
  @IsArray()
  roles?: string[];

  @ApiPropertyOptional({ example: 'FRZ_WH_01' })
  @IsOptional()
  @IsString()
  assignedWarehouseId?: string;

  @ApiPropertyOptional({ example: 'ACTIVE' })
  @IsOptional()
  @IsString()
  status?: string;
}
