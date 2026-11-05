const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanDatabase() {
  console.log('====================================================');
  console.log('🚀 FRESHIOZ PRODUCTION DATABASE CLEANUP');
  console.log('Preserving ONLY: Categories, Units, Products & SuperAdmin');
  console.log('====================================================\n');

  try {
    // 1. Transactional & customer order records
    const reviews = await prisma.review.deleteMany({});
    console.log(`✓ Deleted Reviews: ${reviews.count}`);

    const orderItems = await prisma.orderItem.deleteMany({});
    console.log(`✓ Deleted Order Items: ${orderItems.count}`);

    const orders = await prisma.order.deleteMany({});
    console.log(`✓ Deleted Orders: ${orders.count}`);

    const payouts = await prisma.societyPayout.deleteMany({});
    console.log(`✓ Deleted Society Payouts: ${payouts.count}`);

    const discounts = await prisma.customerDiscount.deleteMany({});
    console.log(`✓ Deleted Customer Discounts: ${discounts.count}`);

    // 2. Inventory, bills & procurement
    const inventory = await prisma.warehouseInventory.deleteMany({});
    console.log(`✓ Deleted Warehouse Inventory: ${inventory.count}`);

    const priceHistory = await prisma.dailyPriceHistory.deleteMany({});
    console.log(`✓ Deleted Daily Price History: ${priceHistory.count}`);

    const bills = await prisma.procurementBill.deleteMany({});
    console.log(`✓ Deleted Procurement Bills: ${bills.count}`);

    const vendors = await prisma.vendor.deleteMany({});
    console.log(`✓ Deleted Vendors: ${vendors.count}`);

    // 3. Leads & customer accounts
    const leads = await prisma.inboundLead.deleteMany({});
    console.log(`✓ Deleted Inbound Society Leads: ${leads.count}`);

    const users = await prisma.user.deleteMany({});
    console.log(`✓ Deleted Customer Users: ${users.count}`);

    // 4. Test staff & drivers (preserving SuperAdmin)
    const employees = await prisma.employee.deleteMany({
      where: {
        NOT: {
          OR: [
            { email: 'superadmin@gmail.com' },
            { roles: { has: 'SUPER_ADMIN' } }
          ]
        }
      }
    });
    console.log(`✓ Deleted Test Employees & Drivers: ${employees.count}`);

    // 5. Test societies & warehouses
    const societies = await prisma.society.deleteMany({});
    console.log(`✓ Deleted Societies: ${societies.count}`);

    const warehouses = await prisma.warehouse.deleteMany({});
    console.log(`✓ Deleted Warehouses: ${warehouses.count}`);

    console.log('\n====================================================');
    console.log('📊 VERIFICATION OF PRESERVED LIVE DATA:');
    console.log('====================================================');
    const catCount = await prisma.category.count();
    const unitCount = await prisma.unit.count();
    const prodCount = await prisma.product.count();
    const admins = await prisma.employee.findMany({
      select: { id: true, name: true, email: true, roles: true }
    });

    console.log(`• Categories:     ${catCount} preserved`);
    console.log(`• Units:          ${unitCount} preserved`);
    console.log(`• Master Products:${prodCount} preserved`);
    console.log(`• Super Admin:    ${admins.map(a => `${a.name} (${a.email})`).join(', ')}`);
    console.log('====================================================');
    console.log('🎉 Database is 100% clean, fresh, and production-ready!');
    console.log('====================================================');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error cleaning database:', err);
    process.exit(1);
  }
}

cleanDatabase();
