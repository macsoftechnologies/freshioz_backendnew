import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';

export class HealthQueryDto {
  @ApiPropertyOptional({ example: true, description: 'Optional deep check including database connectivity' })
  @IsOptional()
  @IsBoolean()
  deep?: boolean;
}
