import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { WarehousesModule } from './warehouses/warehouses.module';
import { EmployeesModule } from './employees/employees.module';
import { ProductsModule } from './products/products.module';
import { PricingModule } from './pricing/pricing.module';
import { SocietiesModule } from './societies/societies.module';
import { InboundRequestsModule } from './inbound-requests/inbound-requests.module';
import { VendorsModule } from './vendors/vendors.module';
import { ProcurementModule } from './procurement/procurement.module';
import { InventoryModule } from './inventory/inventory.module';
import { OrdersModule } from './orders/orders.module';
import { HealthModule } from './health/health.module';
import { StoreModule } from './store/store.module';
import { UploadsModule } from './uploads/uploads.module';
import { CategoriesModule } from './categories/categories.module';
import { UnitsModule } from './units/units.module';
import { CatalogModule } from './catalog/catalog.module';
import { ReviewsModule } from './reviews/reviews.module';
import { CustomerDiscountsModule } from './customer-discounts/customer-discounts.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    WarehousesModule,
    EmployeesModule,
    CategoriesModule,
    UnitsModule,
    ProductsModule,
    PricingModule,
    SocietiesModule,
    InboundRequestsModule,
    VendorsModule,
    ProcurementModule,
    InventoryModule,
    OrdersModule,
    HealthModule,
    StoreModule,
    UploadsModule,
    CatalogModule,
    ReviewsModule,
    CustomerDiscountsModule,
  ],
})
export class AppModule {}
