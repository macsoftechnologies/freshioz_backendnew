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
var CatalogService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const delivery_constants_1 = require("./delivery.constants");
function parseTargetDeliveryDateRange(dateStr) {
    if (dateStr) {
        let year, month, day;
        if (dateStr.includes('/')) {
            const [d, m, y] = dateStr.split('/').map(Number);
            day = d;
            month = m;
            year = y;
        }
        else if (dateStr.includes('-')) {
            const parts = dateStr.split('-').map(Number);
            if (parts[0] > 1000) {
                [year, month, day] = parts;
            }
            else {
                [day, month, year] = parts;
            }
        }
        else {
            const parsed = new Date(dateStr);
            year = parsed.getFullYear();
            month = parsed.getMonth() + 1;
            day = parsed.getDate();
        }
        const start = new Date(year, month - 1, day, 0, 0, 0, 0);
        const end = new Date(year, month - 1, day, 23, 59, 59, 999);
        const d = new Date(year, month - 1, day);
        return { start, end, dateObj: d };
    }
    const now = new Date();
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    const istNow = new Date(utcMs + 5.5 * 3600000);
    const daysToAdd = istNow.getHours() >= 21 ? 2 : 1;
    const d = new Date(istNow);
    d.setDate(d.getDate() + daysToAdd);
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
    const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
    return { start, end, dateObj: d };
}
let CatalogService = CatalogService_1 = class CatalogService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(CatalogService_1.name);
    }
    async getPublicCatalog(targetDate) {
        const { start, end, dateObj } = parseTargetDeliveryDateRange(targetDate);
        try {
            const [categories, units, products, societies, warehouses, historyEntries] = await Promise.all([
                this.prisma.category.findMany({
                    where: { status: 'ACTIVE' },
                    orderBy: { sortOrder: 'asc' },
                    select: { id: true, name: true, slug: true, icon: true, description: true, sortOrder: true },
                }),
                this.prisma.unit.findMany({
                    where: { status: 'ACTIVE' },
                    orderBy: { createdAt: 'asc' },
                    select: { id: true, name: true, label: true, isBulk: true, description: true },
                }),
                this.prisma.product.findMany({
                    where: { status: 'ACTIVE' },
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true, name: true, kannadaName: true, categoryId: true,
                        category: { select: { name: true } },
                        retailUnit: true, retailPrice: true, retailMarketPrice: true,
                        bulkMinQty: true, bulkDiscountPercent: true, gstPercent: true,
                        origin: true, shelfLife: true, desc: true, image: true, badge: true,
                        tags: true, inStock: true, status: true,
                    },
                }),
                this.prisma.society.findMany({
                    where: { status: 'APPROVED' },
                    orderBy: { name: 'asc' },
                    select: {
                        id: true, name: true, type: true, address: true, imageUrl: true,
                        lat: true, lng: true, warehouseId: true, deliveryMode: true, status: true,
                    },
                }),
                this.prisma.warehouse.findMany({
                    where: { status: 'ACTIVE' },
                    select: {
                        id: true, code: true, name: true, location: true, lat: true, lng: true,
                        openTime: true, cutoffTime: true, status: true,
                    },
                }),
                this.prisma.dailyPriceHistory.findMany({
                    where: {
                        publishedAt: {
                            lte: end,
                        },
                    },
                    orderBy: [
                        { publishedAt: 'desc' },
                        { id: 'desc' },
                    ],
                }),
            ]);
            if (products && products.length > 0) {
                const historyMap = new Map();
                for (const h of historyEntries) {
                    if (!historyMap.has(h.productId)) {
                        historyMap.set(h.productId, h);
                    }
                }
                return {
                    categories,
                    units,
                    products: products.map(({ category, ...p }) => {
                        const h = historyMap.get(p.id);
                        return {
                            ...p,
                            category: category?.name ?? 'Vegetables',
                            retailPrice: h ? h.retailPrice : p.retailPrice,
                            retailMarketPrice: h ? h.retailMarketPrice : p.retailMarketPrice,
                            bulkMinQty: h ? h.bulkMinQty : p.bulkMinQty,
                            bulkDiscountPercent: h ? h.bulkDiscountPercent : p.bulkDiscountPercent,
                            gstPercent: h ? h.gstPercent : p.gstPercent,
                            hasCustomDailyPrice: Boolean(h),
                        };
                    }),
                    societies,
                    warehouses,
                    deliveryConfig: delivery_constants_1.DELIVERY_CONFIG,
                    activeDeliveryDate: dateObj.toISOString().slice(0, 10),
                    syncedAt: new Date().toISOString(),
                };
            }
        }
        catch (err) {
            this.logger.warn(`PostgreSQL query for public catalog failed: ${err.message}. Serving resilient baseline catalog.`);
        }
        return this.getFallbackCatalog(dateObj);
    }
    getFallbackCatalog(dateObj) {
        const categories = [
            { id: 'VEGETABLES', name: 'Fresh Vegetables', slug: 'vegetables', icon: '🥦', description: 'Daily farm-fresh kitchen essentials and root vegetables', sortOrder: 1 },
            { id: 'FRUITS', name: 'Fresh Fruits', slug: 'fruits', icon: '🍎', description: 'Sweet, tree-ripened orchard and citrus fruits', sortOrder: 2 },
        ];
        const units = [
            { id: 'kg', name: 'Kilogram', label: 'kg', isBulk: false, description: 'Standard metric weight' },
            { id: 'g', name: 'Gram', label: 'g', isBulk: false, description: 'Smaller consumer portions' },
            { id: 'bunch', name: 'Bunch', label: 'bunch', isBulk: false, description: 'Fresh leafy greens and herbs' },
            { id: 'piece', name: 'Piece', label: 'pc', isBulk: false, description: 'Single unit produce' },
        ];
        const products = [
            {
                id: 'PRD_VEG_TOMATO_DESI',
                name: 'Desi Country Tomato (Nati Tomato)',
                kannadaName: 'ನಾಟಿ ಟೊಮೆಟೊ',
                categoryId: 'VEGETABLES',
                category: 'Vegetables',
                retailUnit: '1 kg',
                retailPrice: 32.0,
                retailMarketPrice: 45.0,
                bulkMinQty: 5.0,
                bulkDiscountPercent: 12.0,
                origin: 'Kolar APMC Mandi',
                shelfLife: '4-5 Days',
                desc: 'Sun-ripened, tangy country tomatoes harvested at dawn. Ideal for rasam, curries, and dal.',
                image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600',
                badge: 'Harvested Today at Dawn',
                tags: ['Daily Essential', 'Farm Fresh', 'Bestseller'],
                gstPercent: 0.0,
                status: 'ACTIVE',
                inStock: true,
                hasCustomDailyPrice: false,
            },
            {
                id: 'PRD_VEG_TOMATO_HYBRID',
                name: 'Hybrid Cooking Tomato (Firm Grade-A)',
                kannadaName: 'ಹೈಬ್ರಿಡ್ ಟೊಮೆಟೊ',
                categoryId: 'VEGETABLES',
                category: 'Vegetables',
                retailUnit: '1 kg',
                retailPrice: 28.0,
                retailMarketPrice: 40.0,
                bulkMinQty: 5.0,
                bulkDiscountPercent: 10.0,
                origin: 'Madanapalle Mandi Yard',
                shelfLife: '5-7 Days',
                desc: 'Firm, fleshy hybrid tomatoes with thick skins and longer shelf life. Perfect for slicing and gravies.',
                image: 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=600',
                badge: 'Kitchen Staple',
                tags: ['Gravy Special', 'Long Shelf Life'],
                gstPercent: 0.0,
                status: 'ACTIVE',
                inStock: true,
                hasCustomDailyPrice: false,
            },
            {
                id: 'PRD_VEG_ONION_NASHIK',
                name: 'Fresh Red Onion (Nashik Quality)',
                kannadaName: 'ಈರುಳ್ಳಿ',
                categoryId: 'VEGETABLES',
                category: 'Vegetables',
                retailUnit: '1 kg',
                retailPrice: 38.0,
                retailMarketPrice: 50.0,
                bulkMinQty: 5.0,
                bulkDiscountPercent: 10.0,
                origin: 'Lasalgaon Mandi, Nashik',
                shelfLife: '10-14 Days',
                desc: 'Pungent, dry-skinned medium red onions with tight layers. A must-have base for Indian cuisine.',
                image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600',
                badge: 'Grade-A Medium',
                tags: ['Daily Essential', 'Storable'],
                gstPercent: 0.0,
                status: 'ACTIVE',
                inStock: true,
                hasCustomDailyPrice: false,
            },
            {
                id: 'PRD_VEG_POTATO_JYOTI',
                name: 'New Crop Jyoti Potato (Mud-Free)',
                kannadaName: 'ಆಲೂಗಡ್ಡೆ',
                categoryId: 'VEGETABLES',
                category: 'Vegetables',
                retailUnit: '1 kg',
                retailPrice: 30.0,
                retailMarketPrice: 42.0,
                bulkMinQty: 5.0,
                bulkDiscountPercent: 10.0,
                origin: 'Hassan APMC Mandi',
                shelfLife: '12-15 Days',
                desc: 'Clean, thin-skinned golden potatoes. Great for boiling, curries, roasting, and shallow frying.',
                image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600',
                badge: 'Zero Dirt / Mud-Free',
                tags: ['Curry Special', 'All-Rounder'],
                gstPercent: 0.0,
                status: 'ACTIVE',
                inStock: true,
                hasCustomDailyPrice: false,
            },
            {
                id: 'PRD_VEG_CAPSICUM',
                name: 'Crisp Green Capsicum (Bell Pepper)',
                kannadaName: 'ದಪ್ಪ ಮೆಣಸಿನಕಾಯಿ',
                categoryId: 'VEGETABLES',
                category: 'Vegetables',
                retailUnit: '500 g',
                retailPrice: 35.0,
                retailMarketPrice: 48.0,
                bulkMinQty: 3.0,
                bulkDiscountPercent: 8.0,
                origin: 'Hosur Greenhouse Polyhouses',
                shelfLife: '4-6 Days',
                desc: 'Crunchy, thick-walled dark green bell peppers. Ideal for stir-fries, fried rice, and salads.',
                image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600',
                badge: 'Greenhouse Fresh',
                tags: ['Crunchy', 'Salad & Fry'],
                gstPercent: 0.0,
                status: 'ACTIVE',
                inStock: true,
                hasCustomDailyPrice: false,
            },
            {
                id: 'PRD_VEG_BHINDI',
                name: "Tender Green Lady's Finger (Bhindi / Okra)",
                kannadaName: 'ಬೆಂಡೆಕಾಯಿ',
                categoryId: 'VEGETABLES',
                category: 'Vegetables',
                retailUnit: '500 g',
                retailPrice: 32.0,
                retailMarketPrice: 44.0,
                bulkMinQty: 3.0,
                bulkDiscountPercent: 10.0,
                origin: 'Malur Agri Belt',
                shelfLife: '3-4 Days',
                desc: 'Crisp, fiber-free tender bhindi that snaps easily at the tip. Perfect for crispy dry bhindi fry.',
                image: 'https://images.unsplash.com/photo-1627885934571-3315a676ebf6?w=600',
                badge: 'Snaps at Tip (Tender)',
                tags: ['Tender Grade', 'Fry Special'],
                gstPercent: 0.0,
                status: 'ACTIVE',
                inStock: true,
                hasCustomDailyPrice: false,
            },
            {
                id: 'PRD_VEG_CARROT_OOTY',
                name: 'Ooty Tender Carrot (English Orange)',
                kannadaName: 'ಕ್ಯಾರೆಟ್',
                categoryId: 'VEGETABLES',
                category: 'Vegetables',
                retailUnit: '500 g',
                retailPrice: 36.0,
                retailMarketPrice: 50.0,
                bulkMinQty: 3.0,
                bulkDiscountPercent: 8.0,
                origin: 'Ooty Hill Harvest',
                shelfLife: '6-8 Days',
                desc: 'Naturally sweet, crunchy hill carrots with high juice content and vibrant color. Delicious raw.',
                image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600',
                badge: 'Ooty Hill High',
                tags: ['Sweet', 'Juice & Salad'],
                gstPercent: 0.0,
                status: 'ACTIVE',
                inStock: true,
                hasCustomDailyPrice: false,
            },
            {
                id: 'PRD_VEG_CAULIFLOWER',
                name: 'Farm Cauliflower (Tight White Curd)',
                kannadaName: 'ಹೂಕೋಸು',
                categoryId: 'VEGETABLES',
                category: 'Vegetables',
                retailUnit: '1 pc',
                retailPrice: 38.0,
                retailMarketPrice: 55.0,
                bulkMinQty: 3.0,
                bulkDiscountPercent: 10.0,
                origin: 'Chikkaballapur Farms',
                shelfLife: '3-5 Days',
                desc: 'Pristine, compact white curd with crisp florets protected by fresh outer leaves. Worm-checked.',
                image: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=600',
                badge: 'Compact White Head',
                tags: ['Pristine Curd', 'Curry Favorite'],
                gstPercent: 0.0,
                status: 'ACTIVE',
                inStock: true,
                hasCustomDailyPrice: false,
            },
            {
                id: 'PRD_FRU_BANANA_ROBUSTA',
                name: 'Robusta Golden Banana (Premium Table Grade)',
                kannadaName: 'ಬಾಳೆಹಣ್ಣು',
                categoryId: 'FRUITS',
                category: 'Fruits',
                retailUnit: '1 kg',
                retailPrice: 42.0,
                retailMarketPrice: 58.0,
                bulkMinQty: 3.0,
                bulkDiscountPercent: 10.0,
                origin: 'Nanjangud / Trichy Orchards',
                shelfLife: '3-5 Days',
                desc: 'Naturally ripened, sweet golden table bananas. Calcium-carbide free ethylene chamber ripened.',
                image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600',
                badge: 'Naturally Ripened',
                tags: ['Carb-Free Ethylene', 'Daily Breakfast'],
                gstPercent: 0.0,
                status: 'ACTIVE',
                inStock: true,
                hasCustomDailyPrice: false,
            },
            {
                id: 'PRD_FRU_APPLE_SHIMLA',
                name: 'Royal Delicious Shimla Apple',
                kannadaName: 'ಸೇಬು',
                categoryId: 'FRUITS',
                category: 'Fruits',
                retailUnit: '4 pcs',
                retailPrice: 148.0,
                retailMarketPrice: 185.0,
                bulkMinQty: 2.0,
                bulkDiscountPercent: 8.0,
                origin: 'Kinnaur / Kotgarh Valley, HP',
                shelfLife: '8-12 Days',
                desc: 'Crisp, juicy red apples with mild sweetness and aromatic flavor straight from Himalayan valley orchards.',
                image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600',
                badge: 'Himalayan Orchard Pick',
                tags: ['Juicy & Crisp', 'Direct Cold Chain'],
                gstPercent: 0.0,
                status: 'ACTIVE',
                inStock: true,
                hasCustomDailyPrice: false,
            },
            {
                id: 'PRD_FRU_ORANGE_MOSAMBI',
                name: 'Nagpur Sweet Orange (Mosambi / Mandarin)',
                kannadaName: 'ಕಿತ್ತಳೆ',
                categoryId: 'FRUITS',
                category: 'Fruits',
                retailUnit: '1 kg',
                retailPrice: 75.0,
                retailMarketPrice: 95.0,
                bulkMinQty: 3.0,
                bulkDiscountPercent: 10.0,
                origin: 'Nagpur Citrus Belt',
                shelfLife: '5-7 Days',
                desc: 'Juicy, thin-skinned citrus loaded with natural vitamin C and balanced acidity. Perfect for fresh morning juice.',
                image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=600',
                badge: 'High Juice Yield',
                tags: ['Vitamin-C Rich', 'Juicing Special'],
                gstPercent: 0.0,
                status: 'ACTIVE',
                inStock: true,
                hasCustomDailyPrice: false,
            },
            {
                id: 'PRD_FRU_POMEGRANATE_BHAGAWA',
                name: 'Ruby Red Pomegranate (Bhagawa Anaar)',
                kannadaName: 'ದಾಳಿಂಬೆ',
                categoryId: 'FRUITS',
                category: 'Fruits',
                retailUnit: '1 kg',
                retailPrice: 165.0,
                retailMarketPrice: 210.0,
                bulkMinQty: 2.0,
                bulkDiscountPercent: 8.0,
                origin: 'Solapur Bhagawa Groves',
                shelfLife: '7-10 Days',
                desc: 'Plump ruby-red arils with soft seeds and intense sweet nectar. Rich in iron and antioxidants.',
                image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600',
                badge: 'Deep Ruby Arils',
                tags: ['Antioxidant Powerhouse', 'Soft Seed'],
                gstPercent: 0.0,
                status: 'ACTIVE',
                inStock: true,
                hasCustomDailyPrice: false,
            },
            {
                id: 'PRD_FRU_TENDER_COCONUT',
                name: 'Pollachi Tender Coconut (Elaneer / Kobbari)',
                kannadaName: 'ಎಳನೀರು',
                categoryId: 'FRUITS',
                category: 'Fruits',
                retailUnit: '1 pc',
                retailPrice: 55.0,
                retailMarketPrice: 70.0,
                bulkMinQty: 4.0,
                bulkDiscountPercent: 10.0,
                origin: 'Pollachi Coconut Farms, TN',
                shelfLife: '5-7 Days',
                desc: 'Heavy tender coconuts containing 400ml+ sweet electrolyte water with soft creamy malai.',
                image: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=600',
                badge: '400ml+ Sweet Water',
                tags: ['Natural Electrolytes', 'Fresh Malai'],
                gstPercent: 0.0,
                status: 'ACTIVE',
                inStock: true,
                hasCustomDailyPrice: false,
            },
        ];
        const societies = [
            {
                id: 'SOC_APARTMENT_707',
                name: 'Apartment-707',
                type: 'APARTMENT',
                address: 'Haralur Main Road, HSR Extension, Bengaluru',
                imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600',
                lat: 12.9081,
                lng: 77.6534,
                warehouseId: 'WH_CENTRAL_01',
                deliveryMode: 'DOORSTEP',
                status: 'APPROVED',
            },
            {
                id: 'SOC_GREEN_GLEN',
                name: 'Green Glen Residency',
                type: 'GATED_COMMUNITY',
                address: 'Bellandur Outer Ring Road, Bengaluru',
                imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600',
                lat: 12.9260,
                lng: 77.6762,
                warehouseId: 'WH_CENTRAL_01',
                deliveryMode: 'DOORSTEP',
                status: 'APPROVED',
            },
            {
                id: 'SOC_PRESTIGE_LAKESIDE',
                name: 'Prestige Lakeside Habitat',
                type: 'GATED_COMMUNITY',
                address: 'Varthur Main Road, Whitefield, Bengaluru',
                imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600',
                lat: 12.9515,
                lng: 77.7410,
                warehouseId: 'WH_EAST_02',
                deliveryMode: 'DOORSTEP',
                status: 'APPROVED',
            },
        ];
        const warehouses = [
            {
                id: 'WH_CENTRAL_01',
                code: 'WH-BLR-SOUTH',
                name: 'Freshioz Regional Hub South (HSR & Kudlu Gate)',
                location: 'Kudlu Gate, Bengaluru South',
                lat: 12.8890,
                lng: 77.6410,
                openTime: '04:00 AM',
                cutoffTime: '09:00 PM',
                status: 'ACTIVE',
            },
            {
                id: 'WH_EAST_02',
                code: 'WH-BLR-EAST',
                name: 'Freshioz Regional Hub East (Whitefield & Kadugodi)',
                location: 'Kadugodi Industrial Area, Whitefield',
                lat: 12.9980,
                lng: 77.7550,
                openTime: '04:00 AM',
                cutoffTime: '09:00 PM',
                status: 'ACTIVE',
            },
        ];
        return {
            categories,
            units,
            products,
            societies,
            warehouses,
            deliveryConfig: delivery_constants_1.DELIVERY_CONFIG,
            activeDeliveryDate: dateObj.toISOString().slice(0, 10),
            syncedAt: new Date().toISOString(),
        };
    }
};
exports.CatalogService = CatalogService;
exports.CatalogService = CatalogService = CatalogService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CatalogService);
//# sourceMappingURL=catalog.service.js.map