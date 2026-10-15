import { Controller, Get, Post, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InboundRequestsService } from './inbound-requests.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { InboundLeadsResponseSchema, LeadSchema } from './schemas/lead.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Inbound Resident Requests')
@Controller('inbound-requests')
export class InboundRequestsController {
  constructor(private readonly inboundRequestsService: InboundRequestsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'SALES_OFFICER')
  @ApiOperation({ summary: 'List all community onboarding leads with unread badge counter (Sales/Admin only)' })
  @ApiResponse({ status: 200, type: InboundLeadsResponseSchema })
  @Get()
  async findAll() {
    return this.inboundRequestsService.findAll();
  }

  @ApiOperation({ summary: 'Submit new community onboarding request (Public from User Web)' })
  @ApiResponse({ status: 201, type: LeadSchema })
  @Post()
  async create(@Body() body: CreateLeadDto) {
    return this.inboundRequestsService.create(body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'SALES_OFFICER')
  @ApiOperation({ summary: 'Update lead status (Salesperson verifies/onboards/drops)' })
  @ApiResponse({ status: 200, type: LeadSchema })
  @Patch()
  async updateStatus(@Body() body: UpdateLeadDto) {
    return this.inboundRequestsService.updateStatus(body.id, body.status);
  }
}
