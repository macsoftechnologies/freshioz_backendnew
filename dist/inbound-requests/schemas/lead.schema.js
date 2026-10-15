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
exports.InboundLeadsResponseSchema = exports.LeadSchema = void 0;
const swagger_1 = require("@nestjs/swagger");
class LeadSchema {
}
exports.LeadSchema = LeadSchema;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'FRZ_LEAD_01' }),
    __metadata("design:type", String)
], LeadSchema.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Prestige Falcon City' }),
    __metadata("design:type", String)
], LeadSchema.prototype, "societyName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Anita Deshmukh' }),
    __metadata("design:type", String)
], LeadSchema.prototype, "contactName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '9845022334' }),
    __metadata("design:type", String)
], LeadSchema.prototype, "contactPhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Apartment Committee Member', required: false }),
    __metadata("design:type", String)
], LeadSchema.prototype, "contactRole", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 450, required: false }),
    __metadata("design:type", Number)
], LeadSchema.prototype, "flatCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Kanakapura Road', required: false }),
    __metadata("design:type", String)
], LeadSchema.prototype, "clusterZone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Kanakapura Main Road, Bengaluru', required: false }),
    __metadata("design:type", String)
], LeadSchema.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'NEW_LEAD', enum: ['NEW_LEAD', 'VERIFIED', 'ONBOARDED', 'DROPPED'] }),
    __metadata("design:type", String)
], LeadSchema.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '14/10/2026' }),
    __metadata("design:type", String)
], LeadSchema.prototype, "createdDateIST", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '08:45 PM IST' }),
    __metadata("design:type", String)
], LeadSchema.prototype, "createdTimeIST", void 0);
class InboundLeadsResponseSchema {
}
exports.InboundLeadsResponseSchema = InboundLeadsResponseSchema;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [LeadSchema] }),
    __metadata("design:type", Array)
], InboundLeadsResponseSchema.prototype, "leads", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], InboundLeadsResponseSchema.prototype, "unreadCount", void 0);
//# sourceMappingURL=lead.schema.js.map