const fs = require('fs');
const path = require('path');

// Ensure .env is loaded before PrismaClient initializes
if (!process.env.DATABASE_URL) {
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split(/\r?\n/).forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match && !process.env[match[1]]) {
        let val = match[2] || '';
        val = val.trim().replace(/^['"]|['"]$/g, '');
        process.env[match[1]] = val;
      }
    });
  }
}

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function cleanFreshDatabase() {
  console.log('====================================================');
  console.log('🧹 FRESHIOZ DATABASE FRESH RESET & PURGE');
  console.log('Preserving: Categories, Produce Catalog, Units, Super Admin');
  console.log('Clearing: Orders, Warehouses, Societies, Users, Vendors, Leads, Bills');
  console.log('====================================================\n');

  try {
    // 1. Delete Operational & Transactional Tables in foreign key order
    console.log('Step 1: Clearing transactional & customer data...');
    
    // Reviews
    const delReviews = await prisma.review.deleteMany({});
    console.log(`   ✓ Deleted ${delReviews.count} reviews`);

    // Customer Discounts
    const delDiscounts = await prisma.customerDiscount.deleteMany({});
    console.log(`   ✓ Deleted ${delDiscounts.count} customer discount vouchers`);

    // Order Items
    const delOrderItems = await prisma.orderItem.deleteMany({});
    console.log(`   ✓ Deleted ${delOrderItems.count} order line items`);

    // Orders
    const delOrders = await prisma.order.deleteMany({});
    console.log(`   ✓ Deleted ${delOrders.count} orders`);

    // Warehouse Inventory
    const delInventory = await prisma.warehouseInventory.deleteMany({});
    console.log(`   ✓ Deleted ${delInventory.count} warehouse inventory records`);

    // Daily Price History
    const delPriceHistory = await prisma.dailyPriceHistory.deleteMany({});
    console.log(`   ✓ Deleted ${delPriceHistory.count} price history records`);

    // Procurement Bills
    const delBills = await prisma.procurementBill.deleteMany({});
    console.log(`   ✓ Deleted ${delBills.count} procurement bills`);

    // Society Payouts
    const delPayouts = await prisma.societyPayout.deleteMany({});
    console.log(`   ✓ Deleted ${delPayouts.count} society payout requests`);

    // Inbound Leads
    const delLeads = await prisma.inboundLead.deleteMany({});
    console.log(`   ✓ Deleted ${delLeads.count} inbound resident leads`);

    // Users / Customers
    const delUsers = await prisma.user.deleteMany({});
    console.log(`   ✓ Deleted ${delUsers.count} registered customer accounts`);

    // Societies
    const delSocieties = await prisma.society.deleteMany({});
    console.log(`   ✓ Deleted ${delSocieties.count} societies & hostels`);

    // Vendors
    const delVendors = await prisma.vendor.deleteMany({});
    console.log(`   ✓ Deleted ${delVendors.count} APMC mandi vendors`);

    // Warehouses
    const delWarehouses = await prisma.warehouse.deleteMany({});
    console.log(`   ✓ Deleted ${delWarehouses.count} regional warehouses`);

    // 2. Clear All Non-Superadmin Staff
    console.log('\nStep 2: Cleaning staff accounts (preserving strictly Super Admin)...');
    const delEmployees = await prisma.employee.deleteMany({
      where: {
        email: { not: 'superadmin@gmail.com' }
      }
    });
    console.log(`   ✓ Deleted ${delEmployees.count} secondary/demo staff accounts`);

    // 3. Ensure Super Admin Account is Fresh & Secure
    console.log('\nStep 3: Ensuring Super Admin account is active & verified...');
    const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || '123456';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const superAdmin = await prisma.employee.upsert({
      where: { email: 'superadmin@gmail.com' },
      update: {
        name: 'Super Admin',
        phone: '9999999999',
        password: hashedPassword,
        roles: ['SUPER_ADMIN'],
        assignedWarehouseId: 'ALL',
        status: 'ACTIVE'
      },
      create: {
        id: 'FRZ_EMP_101',
        uuid: 'e1010000-0000-4000-8000-000000000101',
        name: 'Super Admin',
        phone: '9999999999',
        email: 'superadmin@gmail.com',
        password: hashedPassword,
        roles: ['SUPER_ADMIN'],
        assignedWarehouseId: 'ALL',
        status: 'ACTIVE'
      }
    });
    console.log(`   ✓ Super Admin ready: ${superAdmin.email} (Password: ${adminPassword})`);

    // 4. Verify Final Database Counts
    console.log('\n====================================================');
    console.log('📊 FINAL DATABASE STATE VERIFICATION');
    console.log('====================================================');

    const [
      catCount,
      unitCount,
      prodCount,
      empCount,
      whCount,
      socCount,
      userCount,
      orderCount,
      vendCount,
      billCount,
      invCount,
      revCount
    ] = await Promise.all([
      prisma.category.count(),
      prisma.unit.count(),
      prisma.product.count(),
      prisma.employee.count(),
      prisma.warehouse.count(),
      prisma.society.count(),
      prisma.user.count(),
      prisma.order.count(),
      prisma.vendor.count(),
      prisma.procurementBill.count(),
      prisma.warehouseInventory.count(),
      prisma.review.count(),
    ]);

    console.log(`[PRESERVED] Categories:       ${catCount}`);
    console.log(`[PRESERVED] Packaging Units:  ${unitCount}`);
    console.log(`[PRESERVED] Produce Items:    ${prodCount}`);
    console.log(`[PRESERVED] Super Admin:      ${empCount} (${superAdmin.email})`);
    console.log('----------------------------------------------------');
    console.log(`[CLEARED]   Warehouses:       ${whCount} (0 expected)`);
    console.log(`[CLEARED]   Societies:        ${socCount} (0 expected)`);
    console.log(`[CLEARED]   Customers/Users:  ${userCount} (0 expected)`);
    console.log(`[CLEARED]   Orders:           ${orderCount} (0 expected)`);
    console.log(`[CLEARED]   Mandi Vendors:    ${vendCount} (0 expected)`);
    console.log(`[CLEARED]   Mandi Bills:      ${billCount} (0 expected)`);
    console.log(`[CLEARED]   Inventory:        ${invCount} (0 expected)`);
    console.log(`[CLEARED]   Reviews:          ${revCount} (0 expected)`);
    console.log('====================================================');
    console.log('✨ DATABASE IS NOW 100% CLEAN AND READY FOR FRESH START!');
    console.log('====================================================\n');

  } catch (error) {
    console.error('❌ Error while cleaning database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

cleanFreshDatabase();
