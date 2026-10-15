import { ApiProperty } from '@nestjs/swagger';

export class EmployeeSchema {
  @ApiProperty({ example: 'FRZ_EMP_102' })
  id!: string;

  @ApiProperty({ example: 'Ravi Sharma' })
  name!: string;

  @ApiProperty({ example: '9845099887' })
  phone!: string;

  @ApiProperty({ example: 'salesperson@freshioz.com' })
  email!: string;

  @ApiProperty({ example: ['SALES_OFFICER'] })
  roles!: string[];

  @ApiProperty({ example: 'ALL' })
  assignedWarehouseId!: string;

  @ApiProperty({ example: 'ACTIVE' })
  status!: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  dateJoined!: Date;
}
