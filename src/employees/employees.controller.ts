import { Controller, Get, Post, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeSchema } from './schemas/employee.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Employees')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @ApiOperation({ summary: 'List all employees and operations roles (Super Admin only)' })
  @ApiResponse({ status: 200, type: [EmployeeSchema] })
  @Get()
  async findAll() {
    return this.employeesService.findAll();
  }

  @ApiOperation({ summary: 'Get employee details by ID' })
  @ApiResponse({ status: 200, type: EmployeeSchema })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.employeesService.findOne(id);
  }

  @ApiOperation({ summary: 'Create new employee' })
  @ApiResponse({ status: 201, type: EmployeeSchema })
  @Post()
  async create(@Body() body: CreateEmployeeDto) {
    return this.employeesService.create(body);
  }

  @ApiOperation({ summary: 'Update employee details or role assignment' })
  @ApiResponse({ status: 200, type: EmployeeSchema })
  @Put(':id')
  async updateWithParam(@Param('id') id: string, @Body() body: any) {
    return this.employeesService.update(id, body);
  }

  @Put()
  async update(@Body() body: UpdateEmployeeDto) {
    return this.employeesService.update(body.id, body);
  }
}
