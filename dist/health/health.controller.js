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
    liveness() {
        return {
            status: 'UP',
            uptimeSeconds: Math.floor(process.uptime()),
            timestampIST: (0, date_utils_1.toISTFullString)(new Date()),
        };
    }
    async readiness() {
        const start = Date.now();
        try {
            await this.prisma.$queryRaw `SELECT 1`;
            return {
                status: 'READY',
                database: 'connected',
                latencyMs: Date.now() - start,
                timestampIST: (0, date_utils_1.toISTFullString)(new Date()),
            };
        }
        catch (e) {
            throw new common_1.ServiceUnavailableException({
                status: 'NOT_READY',
                database: 'disconnected',
                error: 'Database connection check failed',
                timestampIST: (0, date_utils_1.toISTFullString)(new Date()),
            });
        }
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
            dbStatus = 'disconnected';
        }
        return {
            status: dbStatus === 'connected' ? 'ok' : 'degraded',
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
    (0, common_1.Get)('live'),
    (0, swagger_1.ApiOperation)({ summary: 'Process liveness probe (Container / PM2 heartbeat)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'API application process is alive and responding' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "liveness", null);
__decorate([
    (0, common_1.Get)('ready'),
    (0, swagger_1.ApiOperation)({ summary: 'Readiness probe (Verifies PostgreSQL database connectivity)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Database is connected and ready to serve traffic' }),
    (0, swagger_1.ApiResponse)({ status: 503, description: 'Database connection failed' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "readiness", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Comprehensive system health and entity counts' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: health_schema_1.HealthResponseDto }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "check", null);
exports.HealthController = HealthController = __decorate([
    (0, swagger_1.ApiTags)('Health & Monitoring'),
    (0, common_1.Controller)('health'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HealthController);
//# sourceMappingURL=health.controller.js.map