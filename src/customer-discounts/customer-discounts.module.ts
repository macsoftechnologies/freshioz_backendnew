import { Module } from '@nestjs/common';
import { CustomerDiscountsController } from './customer-discounts.controller';
import { CustomerDiscountsService } from './customer-discounts.service';

@Module({
  controllers: [CustomerDiscountsController],
  providers: [CustomerDiscountsService],
  exports: [CustomerDiscountsService],
})
export class CustomerDiscountsModule {}
