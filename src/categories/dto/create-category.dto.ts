import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateCategoryDto {
  @ApiPropertyOptional({ example: 'CAT_VEG', description: 'Unique category identifier (auto-generated if omitted)' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ example: 'Fresh Vegetables', description: 'Human-readable category title' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'vegetables', description: 'URL slug (auto-derived if omitted)' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ example: '🥬', description: 'Category emoji icon or icon identifier' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ example: 'Farm fresh leafy greens, root veggies and daily essentials', description: 'Category description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'ACTIVE', enum: ['ACTIVE', 'INACTIVE'] })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: 1, description: 'Display sort order' })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}
