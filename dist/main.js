"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const path_1 = require("path");
const fs = require("fs");
async function bootstrap() {
    const uploadsDir = (0, path_1.join)(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useStaticAssets(uploadsDir, { prefix: '/uploads' });
    const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
        'https://freshioz.com',
        'https://www.freshioz.com',
        'https://api.freshioz.com',
    ];
    if (process.env.FRONTEND_URL)
        allowedOrigins.push(process.env.FRONTEND_URL);
    if (process.env.ADMIN_URL)
        allowedOrigins.push(process.env.ADMIN_URL);
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin ||
                allowedOrigins.includes(origin) ||
                /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) ||
                /^https:\/\/([a-zA-Z0-9-]+\.)?freshioz(z)?\.com$/.test(origin)) {
                callback(null, true);
            }
            else {
                callback(new Error(`Origin ${origin} blocked by CORS policy`), false);
            }
        },
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: false,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Freshioz Enterprise API')
        .setDescription('Farm-to-Fork Direct Supply Chain Backend for Bengaluru APMC Mandi, Warehouses, Society Desks & Resident Orders.\n' +
        'Dates formatted in DD/MM/YYYY and Indian Standard Time (IST).')
        .setVersion('1.0.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT Bearer token',
        in: 'header',
    }, 'JWT-auth')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        customSiteTitle: 'Freshioz API Documentation',
    });
    const PORT = process.env.PORT || 5000;
    await app.listen(PORT);
    console.log(`\n==================================================`);
    console.log(`🚀 Freshioz NestJS Backend running on: http://localhost:${PORT}/api`);
    console.log(`📖 Swagger API Documentation: http://localhost:${PORT}/api/docs`);
    console.log(`⏰ Timezone: Asia/Kolkata (IST) | Date Format: DD/MM/YYYY`);
    console.log(`==================================================\n`);
}
bootstrap();
//# sourceMappingURL=main.js.map