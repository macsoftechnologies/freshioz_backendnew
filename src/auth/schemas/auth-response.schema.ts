import { ApiProperty } from '@nestjs/swagger';

export class AuthUserSchema {
  @ApiProperty({ example: 'FRZ_EMP_101' })
  id!: string;

  @ApiProperty({ example: 'Super Admin' })
  name!: string;

  @ApiProperty({ example: 'superadmin@gmail.com', required: false })
  email?: string;

  @ApiProperty({ example: '9999999999', required: false })
  phone?: string;

  @ApiProperty({ example: ['SUPER_ADMIN'], required: false })
  roles?: string[];

  @ApiProperty({ example: 'ALL', required: false })
  assignedWarehouseId?: string;

  @ApiProperty({ example: 'EMPLOYEE', enum: ['EMPLOYEE', 'CUSTOMER'] })
  type!: string;
}

export class AuthResponseSchema {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsIn...' })
  token!: string;

  @ApiProperty({ example: 'Bearer' })
  tokenType!: string;

  @ApiProperty({ example: '7d' })
  expiresIn!: string;

  @ApiProperty({ example: 'EMPLOYEE' })
  type!: string;

  @ApiProperty({ type: AuthUserSchema })
  user!: AuthUserSchema;
}
