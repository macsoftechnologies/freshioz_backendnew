import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Karthik Rao' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ example: '9876543210' })
  @IsNotEmpty()
  @IsString()
  phone!: string;

  @ApiProperty({ example: 'Secret@123' })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  password!: string;

  @ApiPropertyOptional({ example: 'karthik@example.com' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ example: 'SOC_PRESTIGE_01' })
  @IsOptional()
  @IsString()
  societyId?: string;

  @ApiPropertyOptional({ example: 'Prestige Falcon City' })
  @IsOptional()
  @IsString()
  societyName?: string;

  @ApiPropertyOptional({ example: 'Tower 4 - Flat 802' })
  @IsOptional()
  @IsString()
  flatNo?: string;
}

export class PartnerLoginDto {
  @ApiProperty({ example: 'SOC_PRESTIGE_01' })
  @IsNotEmpty()
  @IsString()
  societyId!: string;

  @ApiProperty({ example: '9845112233' })
  @IsNotEmpty()
  @IsString()
  phone!: string;

  @ApiProperty({ example: 'Freshioz@Society2026' })
  @IsNotEmpty()
  @IsString()
  password!: string;
}
