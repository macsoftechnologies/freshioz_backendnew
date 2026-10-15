"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const prisma_service_1 = require("../prisma/prisma.service");
const health_schema_1 = require("./schemas/health.schema");
const date_utils_1 = require("../common/date-utils");
let HealthController = class HealthController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async check() {
        let dbStatus = 'connected';
        let latencyMs = 0;
        let tableCounts = {};
        const start = Date.now();
        try {
            await this.prisma.$queryRaw `SELECT 1`;
            latencyMs = Date.now() - start;
            const [categories, units, warehouses, products, societies, orders, users, employees] = await Promise.all([
                this.prisma.category.count(),
                this.prisma.unit.count(),
                this.prisma.warehouse.count(),
                this.prisma.product.count(),
                this.prisma.society.count(),
                this.prisma.order.count(),
                this.prisma.user.count(),
                this.prisma.employee.count(),
            ]);
            tableCounts = { categories, units, warehouses, products, societies, orders, users, employees };
        }
        catch (e) {
            dbStatus = `disconnected: ${e.message}`;
        }
        return {
            status: 'ok',
            service: 'Freshioz Enterprise NestJS API',
            serverTimeIST: (0, date_utils_1.toISTFullString)(new Date()),
            database: dbStatus,
            databaseLatencyMs: latencyMs,
            tableCounts,
        };
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'System health check & database liveness' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: health_schema_1.HealthResponseDto }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "check", null);
exports.HealthController = HealthController = __decorate([
    (0, swagger_1.ApiTags)('Health'),
    (0, common_1.Controller)('health'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HealthController);
//# sourceMappingURL=health.controller.js.map