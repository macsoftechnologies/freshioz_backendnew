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
exports.InboundRequestsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const date_utils_1 = require("../common/date-utils");
let InboundRequestsService = class InboundRequestsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const leads = await this.prisma.inboundLead.findMany({
            orderBy: { createdAt: 'desc' },
        });
        const unreadCount = leads.filter(l => l.status === 'NEW_LEAD').length;
        const formattedLeads = leads.map(l => ({
            ...l,
            createdDateIST: (0, date_utils_1.formatDateIST)(l.createdAt),
            createdTimeIST: (0, date_utils_1.formatTimeIST)(l.createdAt),
        }));
        return {
            leads: formattedLeads,
            unreadCount,
        };
    }
    async create(body) {
        const { id, societyName, contactName, contactPhone, contactRole, flatCount, clusterZone, address } = body;
        const newLead = await this.prisma.inboundLead.create({
            data: {
                id: id || `FRZ_LEAD_${Date.now()}`,
                societyName,
                contactName,
                contactPhone,
                contactRole: contactRole || 'Resident',
                flatCount: flatCount ? parseInt(flatCount) : null,
                clusterZone: clusterZone || 'Bangalore East',
                address: address || null,
                status: 'NEW_LEAD',
            },
        });
        return {
            ...newLead,
            createdDateIST: (0, date_utils_1.formatDateIST)(newLead.createdAt),
            createdTimeIST: (0, date_utils_1.formatTimeIST)(newLead.createdAt),
        };
    }
    async updateStatus(id, status) {
        const existing = await this.prisma.inboundLead.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException('Lead not found');
        const updated = await this.prisma.inboundLead.update({
            where: { id },
            data: { status },
        });
        return {
            ...updated,
            createdDateIST: (0, date_utils_1.formatDateIST)(updated.createdAt),
            createdTimeIST: (0, date_utils_1.formatTimeIST)(updated.createdAt),
        };
    }
};
exports.InboundRequestsService = InboundRequestsService;
exports.InboundRequestsService = InboundRequestsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InboundRequestsService);
//# sourceMappingURL=inbound-requests.service.js.map