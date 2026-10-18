"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const warehouses_module_1 = require("./warehouses/warehouses.module");
const employees_module_1 = require("./employees/employees.module");
const products_module_1 = require("./products/products.module");
const pricing_module_1 = require("./pricing/pricing.module");
const societies_module_1 = require("./societies/societies.module");
const inbound_requests_module_1 = require("./inbound-requests/inbound-requests.module");
const vendors_module_1 = require("./vendors/vendors.module");
const procurement_module_1 = require("./procurement/procurement.module");
const inventory_module_1 = require("./inventory/inventory.module");
const orders_module_1 = require("./orders/orders.module");
const health_module_1 = require("./health/health.module");
const store_module_1 = require("./store/store.module");
const uploads_module_1 = require("./uploads/uploads.module");
const categories_module_1 = require("./categories/categories.module");
const units_module_1 = require("./units/units.module");
const catalog_module_1 = require("./catalog/catalog.module");
const reviews_module_1 = require("./reviews/reviews.module");
const customer_discounts_module_1 = require("./customer-discounts/customer-discounts.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            warehouses_module_1.WarehousesModule,
            employees_module_1.EmployeesModule,
            categories_module_1.CategoriesModule,
            units_module_1.UnitsModule,
            products_module_1.ProductsModule,
            pricing_module_1.PricingModule,
            societies_module_1.SocietiesModule,
            inbound_requests_module_1.InboundRequestsModule,
            vendors_module_1.VendorsModule,
            procurement_module_1.ProcurementModule,
            inventory_module_1.InventoryModule,
            orders_module_1.OrdersModule,
            health_module_1.HealthModule,
            store_module_1.StoreModule,
            uploads_module_1.UploadsModule,
            catalog_module_1.CatalogModule,
            reviews_module_1.ReviewsModule,
            customer_discounts_module_1.CustomerDiscountsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map