-- CreateTable
CREATE TABLE "warehouses" (
    "id" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "openTime" TEXT NOT NULL DEFAULT '05:00',
    "cutoffTime" TEXT NOT NULL DEFAULT '21:00',
    "capacityTons" DOUBLE PRECISION NOT NULL DEFAULT 40,
    "managerName" TEXT,
    "managerPhone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roles" TEXT[],
    "assignedWarehouseId" TEXT DEFAULT 'ALL',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "dateJoined" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT '🌱',
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "units" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "isBulk" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kannadaName" TEXT,
    "categoryId" TEXT NOT NULL,
    "retailUnit" TEXT NOT NULL DEFAULT '1 kg',
    "retailPrice" DOUBLE PRECISION NOT NULL DEFAULT 40.0,
    "retailMarketPrice" DOUBLE PRECISION NOT NULL DEFAULT 55.0,
    "bulkMinQty" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bulkDiscountPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "origin" TEXT DEFAULT 'APMC Mandi',
    "shelfLife" TEXT DEFAULT '3-5 Days',
    "desc" TEXT,
    "image" TEXT NOT NULL,
    "badge" TEXT DEFAULT 'Harvested Today at Dawn',
    "tags" TEXT[],
    "gstPercent" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_price_history" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "retailPrice" DOUBLE PRECISION NOT NULL,
    "retailMarketPrice" DOUBLE PRECISION NOT NULL,
    "bulkMinQty" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bulkDiscountPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "gstPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "effectiveBulkRate" DOUBLE PRECISION,
    "publishedById" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_price_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "societies" (
    "id" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'APARTMENT',
    "address" TEXT NOT NULL,
    "imageUrl" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "warehouseId" TEXT,
    "secretaryName" TEXT,
    "secretaryPhone" TEXT,
    "totalFloors" INTEGER DEFAULT 1,
    "totalUnits" INTEGER DEFAULT 10,
    "deliveryMode" TEXT NOT NULL DEFAULT 'SOCIETY_DESK',
    "status" TEXT NOT NULL DEFAULT 'APPROVED',
    "commissionType" TEXT NOT NULL DEFAULT 'PERCENTAGE',
    "commissionValue" DOUBLE PRECISION NOT NULL DEFAULT 3.5,
    "balanceEarned" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "totalOrdersDelivered" INTEGER NOT NULL DEFAULT 0,
    "bankName" TEXT,
    "accountHolder" TEXT,
    "accountNumber" TEXT,
    "ifscCode" TEXT,
    "branch" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "societies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT NOT NULL DEFAULT 'Freshioz@123',
    "societyId" TEXT,
    "flatNo" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE_VERIFIED',
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "userPhone" TEXT NOT NULL,
    "societyId" TEXT,
    "societyName" TEXT,
    "flatNo" TEXT,
    "warehouseId" TEXT,
    "warehouseCode" TEXT,
    "orderType" TEXT NOT NULL DEFAULT 'RETAIL',
    "subtotal" DOUBLE PRECISION NOT NULL,
    "bulkSavings" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "deliveryFee" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "gstAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "deliveryDate" TEXT NOT NULL,
    "deliverySlot" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'CONFIRMED',
    "paymentMethod" TEXT NOT NULL DEFAULT 'UPI',
    "paymentStatus" TEXT NOT NULL DEFAULT 'PAID',
    "codCollectedAmount" DOUBLE PRECISION DEFAULT 0.0,
    "codCollectedAt" TIMESTAMP(3),
    "codCollectedBy" TEXT,
    "societyCommissionEarned" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "deliveredAt" TIMESTAMP(3),
    "orderPlacedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "qty" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "effectivePrice" DOUBLE PRECISION,
    "totalPrice" DOUBLE PRECISION,
    "isBulkApplied" BOOLEAN NOT NULL DEFAULT false,
    "bulkDiscountPercent" DOUBLE PRECISION DEFAULT 0,
    "bulkSavings" DOUBLE PRECISION DEFAULT 0,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "society_payouts" (
    "id" TEXT NOT NULL,
    "societyId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentMethod" TEXT NOT NULL DEFAULT 'NEFT_IMPS',
    "transactionRef" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "notes" TEXT,
    "authorizedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "society_payouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inbound_leads" (
    "id" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "societyName" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "contactRole" TEXT,
    "flatCount" INTEGER,
    "clusterZone" TEXT,
    "address" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW_LEAD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inbound_leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouse_inventory" (
    "id" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "currentQty" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reservedQty" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unit" TEXT NOT NULL DEFAULT 'kg',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "warehouse_inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendors" (
    "id" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'COMMISSION_AGENT',
    "mandiLocation" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "bankName" TEXT,
    "accountHolder" TEXT,
    "accountNumber" TEXT,
    "ifscCode" TEXT,
    "upiId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procurement_bills" (
    "id" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "billNumber" TEXT NOT NULL,
    "vendorId" TEXT,
    "vendorName" TEXT NOT NULL,
    "mandiLocation" TEXT NOT NULL,
    "destinationWarehouseId" TEXT NOT NULL,
    "destinationName" TEXT NOT NULL,
    "paymentMode" TEXT NOT NULL DEFAULT 'IMPS_TRANSFER',
    "totalWeightKg" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "produceAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "transportAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalAmountPaid" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "receiptPhoto" TEXT,
    "procuredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "procuredBy" TEXT NOT NULL,
    "slot" TEXT NOT NULL DEFAULT 'Morning Fresh Slot',
    "items" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "procurement_bills_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "warehouses_uuid_key" ON "warehouses"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "warehouses_code_key" ON "warehouses"("code");

-- CreateIndex
CREATE UNIQUE INDEX "employees_uuid_key" ON "employees"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "products_uuid_key" ON "products"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "societies_uuid_key" ON "societies"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "users_uuid_key" ON "users"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "orders_uuid_key" ON "orders"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "inbound_leads_uuid_key" ON "inbound_leads"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "warehouse_inventory_warehouseId_productId_key" ON "warehouse_inventory"("warehouseId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "vendors_uuid_key" ON "vendors"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "procurement_bills_uuid_key" ON "procurement_bills"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "procurement_bills_billNumber_key" ON "procurement_bills"("billNumber");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_price_history" ADD CONSTRAINT "daily_price_history_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_price_history" ADD CONSTRAINT "daily_price_history_publishedById_fkey" FOREIGN KEY ("publishedById") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "societies" ADD CONSTRAINT "societies_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "societies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("phone") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "societies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "society_payouts" ADD CONSTRAINT "society_payouts_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "societies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_inventory" ADD CONSTRAINT "warehouse_inventory_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_inventory" ADD CONSTRAINT "warehouse_inventory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_bills" ADD CONSTRAINT "procurement_bills_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

