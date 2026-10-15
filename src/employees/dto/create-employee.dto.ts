import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsOptional, IsArray } from 'class-validator';

export class CreateEmployeeDto {
  @ApiPropertyOptional({ example: 'FRZ_EMP_102' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ example: 'Ravi Sharma' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ example: '9845099887' })
  @IsNotEmpty()
  @IsString()
  phone!: string;

  @ApiProperty({ example: 'salesperson@freshioz.com' })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({ example: 'admin123', default: 'Freshioz@123' })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ example: ['SALES_OFFICER'], isArray: true })
  @IsArray()
  roles!: string[];

  @ApiPropertyOptional({ example: 'ALL', default: 'ALL' })
  @IsOptional()
  @IsString()
  assignedWarehouseId?: string;

  @ApiPropertyOptional({ example: 'ACTIVE', default: 'ACTIVE' })
  @IsOptional()
  @IsString()
  status?: string;
}
