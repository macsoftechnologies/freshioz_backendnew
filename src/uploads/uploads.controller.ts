import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as crypto from 'crypto';
import * as fs from 'fs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// Ensure uploads directory exists on server startup
const uploadsDir = join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configured multer disk storage with collision-safe unique filenames
const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const randomHex = crypto.randomBytes(8).toString('hex');
    const safeExt = extname(file.originalname).toLowerCase() || '.bin';
    const timestamp = Date.now();
    cb(null, `${timestamp}-${randomHex}${safeExt}`);
  },
});

// Allowed file types: images and PDF receipts/invoices (SVG removed for XSS prevention)
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf',
  ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new BadRequestException(
        `Unsupported file type: ${file.mimetype}. Allowed types: JPEG, PNG, WEBP, GIF, PDF`,
      ),
      false,
    );
  }
};

@ApiTags('File Uploads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('uploads')
export class UploadsController {
  @Post()
  @ApiOperation({ summary: 'Upload a single file (produce photo, mandi bill, society proof)' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'File successfully uploaded and stored in uploads folder' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
      fileFilter,
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    }),
  )
  uploadSingleFile(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('No file provided in the request payload');
    }

    const baseUrl = process.env.BACKEND_PUBLIC_URL || 'https://api.freshioz.com';
    return {
      url: `${baseUrl}/uploads/${file.filename}`,
      relativeUrl: `/uploads/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    };
  }

  @Post('multiple')
  @ApiOperation({ summary: 'Upload multiple files (up to 10)' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Files successfully uploaded and stored' })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage,
      fileFilter,
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    }),
  )
  uploadMultipleFiles(@UploadedFiles() files: any[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided in the request payload');
    }

    const baseUrl = process.env.BACKEND_PUBLIC_URL || 'https://api.freshioz.com';
    return files.map((file) => ({
      url: `${baseUrl}/uploads/${file.filename}`,
      relativeUrl: `/uploads/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    }));
  }
}
