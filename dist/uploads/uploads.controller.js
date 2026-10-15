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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const multer_1 = require("multer");
const path_1 = require("path");
const crypto = require("crypto");
const fs = require("fs");
const uploadsDir = (0, path_1.join)(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
const storage = (0, multer_1.diskStorage)({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const randomHex = crypto.randomBytes(8).toString('hex');
        const safeExt = (0, path_1.extname)(file.originalname).toLowerCase() || '.bin';
        const timestamp = Date.now();
        cb(null, `${timestamp}-${randomHex}${safeExt}`);
    },
});
const fileFilter = (req, file, cb) => {
    const allowedMimes = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
        'image/svg+xml',
        'application/pdf',
    ];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new common_1.BadRequestException(`Unsupported file type: ${file.mimetype}. Allowed types: JPEG, PNG, WEBP, GIF, SVG, PDF`), false);
    }
};
let UploadsController = class UploadsController {
    uploadSingleFile(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided in the request payload');
        }
        return {
            url: `/uploads/${file.filename}`,
            filename: file.filename,
            originalName: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
        };
    }
    uploadMultipleFiles(files) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('No files provided in the request payload');
        }
        return files.map((file) => ({
            url: `/uploads/${file.filename}`,
            filename: file.filename,
            originalName: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
        }));
    }
};
exports.UploadsController = UploadsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Upload a single file (produce photo, mandi bill, society proof)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'File successfully uploaded and stored in uploads folder' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage,
        fileFilter,
        limits: { fileSize: 15 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UploadsController.prototype, "uploadSingleFile", null);
__decorate([
    (0, common_1.Post)('multiple'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload multiple files (up to 10)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Files successfully uploaded and stored' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10, {
        storage,
        fileFilter,
        limits: { fileSize: 15 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], UploadsController.prototype, "uploadMultipleFiles", null);
exports.UploadsController = UploadsController = __decorate([
    (0, swagger_1.ApiTags)('File Uploads'),
    (0, common_1.Controller)('uploads')
], UploadsController);
//# sourceMappingURL=uploads.controller.js.map