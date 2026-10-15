import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateUnitDto {
  @ApiPropertyOptional({ example: 'UNIT_KG', description: 'Unique unit ID (auto-generated if omitted)' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ example: 'kg', description: 'Unit abbreviation or code (e.g., kg, pack, crate, tons)' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Kilogram (kg)', description: 'Human-readable unit display label' })
  @IsNotEmpty()
  @IsString()
  label: string;

  @ApiPropertyOptional({ example: false, description: 'True for wholesale/bulk packaging (crates, tons), false for retail' })
  @IsOptional()
  @IsBoolean()
  isBulk?: boolean;

  @ApiPropertyOptional({ example: 'Standard consumer weight metric', description: 'Operational notes' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'ACTIVE', enum: ['ACTIVE', 'INACTIVE'] })
  @IsOptional()
  @IsString()
  status?: string;
}
