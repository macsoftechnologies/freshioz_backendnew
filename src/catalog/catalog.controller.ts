import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';

@ApiTags('Catalog')
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @ApiOperation({ summary: 'Get public read-only catalog (allow-listed without PII or banking fields)' })
  @ApiResponse({ status: 200, description: 'Public catalog retrieved successfully' })
  @Get()
  async getPublicCatalog() {
    return this.catalogService.getPublicCatalog();
  }
}
