import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({ example: 'ok' })
  status!: string;

  @ApiProperty({ example: 'Freshioz Enterprise NestJS API' })
  service!: string;

  @ApiProperty({ example: '15/10/2026, 05:30:00 IST' })
  serverTimeIST!: string;

  @ApiProperty({ example: 'connected' })
  database!: string;
}
