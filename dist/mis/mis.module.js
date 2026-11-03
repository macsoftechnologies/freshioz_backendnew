"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MisModule = void 0;
const common_1 = require("@nestjs/common");
const mis_controller_1 = require("./mis.controller");
const mis_service_1 = require("./mis.service");
const prisma_module_1 = require("../prisma/prisma.module");
let MisModule = class MisModule {
};
exports.MisModule = MisModule;
exports.MisModule = MisModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [mis_controller_1.MisController],
        providers: [mis_service_1.MisService],
        exports: [mis_service_1.MisService],
    })
], MisModule);
//# sourceMappingURL=mis.module.js.map