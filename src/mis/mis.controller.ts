import { Controller, Get, Post, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MisService } from './mis.service';
import { MisQueryDto, ReconcileRiderCashDto } from './dto/mis-query.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Executive MIS & Analytics')
@Controller('mis')
export class MisController {
  constructor(private readonly misService: MisService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'WAREHOUSE_MANAGER')
  @Get('executive-summary')
  @ApiOperation({ summary: 'Consolidated executive MIS and cash flow analytics' })
  getExecutiveSummary(@Query() query: MisQueryDto) {
    return this.misService.getExecutiveSummary(query);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'WAREHOUSE_MANAGER')
  @Post('reconcile-rider-cash')
  @ApiOperation({ summary: 'Reconcile and vault rider cash-in-transit' })
  reconcileRiderCash(@Body() dto: ReconcileRiderCashDto) {
    return this.misService.reconcileRiderCash(dto);
  }
}

