import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SocietiesService } from './societies.service';
import { CreateSocietyDto } from './dto/create-society.dto';
import { UpdateSocietyDto } from './dto/update-society.dto';
import { SocietySchema } from './schemas/society.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Societies & Hostels')
@Controller('societies')
export class SocietiesController {
  constructor(private readonly societiesService: SocietiesService) {}

  @ApiOperation({ summary: 'List all onboarded communities, apartments, and hostels' })
  @ApiResponse({ status: 200, type: [SocietySchema] })
  @Get()
  async findAll() {
    return this.societiesService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List society commission payout records (Admin all, Partner own society)' })
  @ApiQuery({ name: 'societyId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @Get('payouts')
  async listPayouts(
    @Req() req: any,
    @Query('societyId') societyId?: string,
    @Query('status') status?: string,
  ) {
    const user = req.user;
    if (user?.type === 'PARTNER' || user?.roles?.includes('SOCIETY_PARTNER')) {
      const partnerSocId = user.societyId || user.id;
      return this.societiesService.listPayouts({ societyId: partnerSocId, status });
    }
    return this.societiesService.listPayouts({ societyId, status });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Approve society commission payout with UTR transaction ref (Super Admin only)' })
  @Post('payouts/:id/approve')
  async approvePayout(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body?: { transactionRef?: string },
  ) {
    return this.societiesService.approvePayout(id, req.user, body?.transactionRef);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Reject payout request and refund balance back to society (Super Admin only)' })
  @Post('payouts/:id/reject')
  async rejectPayout(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body?: { reason?: string },
  ) {
    return this.societiesService.rejectPayout(id, req.user, body?.reason);
  }

  @ApiOperation({ summary: 'Get single onboarded community by ID' })
  @ApiResponse({ status: 200, type: SocietySchema })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.societiesService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'SALES_OFFICER')
  @ApiOperation({ summary: 'Onboard a new community or hostel' })
  @ApiResponse({ status: 201, type: SocietySchema })
  @Post()
  async create(@Body() body: CreateSocietyDto) {
    return this.societiesService.create(body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'SALES_OFFICER')
  @ApiOperation({ summary: 'Approve or update society settings & commission by param ID' })
  @ApiResponse({ status: 200, type: SocietySchema })
  @Put(':id')
  async updateWithParam(@Req() req: any, @Param('id') id: string, @Body() body: UpdateSocietyDto) {
    return this.societiesService.update(id, body, req.user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'SALES_OFFICER')
  @ApiOperation({ summary: 'Approve or update society settings & commission' })
  @ApiResponse({ status: 200, type: SocietySchema })
  @Put()
  async update(@Req() req: any, @Body() body: UpdateSocietyDto) {
    return this.societiesService.update(body.id, body, req.user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SOCIETY_PARTNER', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Request society commission payout / withdrawal (Partner or Admin)' })
  @Post(':id/payout-request')
  async requestPayout(@Req() req: any, @Param('id') id: string, @Body() body: { amount: number }) {
    const user = req.user;
    if (user?.type === 'PARTNER' && user?.societyId && user.societyId !== id) {
      throw new ForbiddenException('Access denied. You can only request payouts for your assigned society.');
    }
    return this.societiesService.requestPayout(id, body.amount);
  }
}
