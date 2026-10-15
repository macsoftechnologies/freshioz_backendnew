import { Module } from '@nestjs/common';
import { InboundRequestsController } from './inbound-requests.controller';
import { InboundRequestsService } from './inbound-requests.service';

@Module({
  controllers: [InboundRequestsController],
  providers: [InboundRequestsService],
  exports: [InboundRequestsService],
})
export class InboundRequestsModule {}
