const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanOperationalData() {
  console.log('====================================================');
  console.log('🧹 FRESHIOZ CLEAN TEST DATA RESET');
  console.log('PRESERVING STRICTLY:');
  console.log('  ✓ Employees (Staff & Delivery Executives)');
  console.log('  ✓ Products (Produce Catalog)');
  console.log('  ✓ Master Units');
  console.log('  ✓ Master Categories');
  console.log('  ✓ Hub Warehouses');
  console.log('CLEANING EVERYTHING ELSE:');
  console.log('  • Orders & Items');
  console.log('  • Warehouse Inventory (Reset stock to 0)');
  console.log('  • Societies & Payouts');
  console.log('  • Mandi Vendors & Bills');
  console.log('  • Pricing Histories & Ledgers');
  console.log('  • Customer Accounts & Discounts');
  console.log('====================================================\n');

  // 1. Dissociate users from societies before wiping societies
  try {
    const userUpdate = await prisma.user.updateMany({ data: { societyId: null, flatNo: null } });
    console.log(`✓ Dissociated ${userUpdate.count} users from societies`);
  } catch (e) {
    console.warn('  User disassociation warning:', e.message);
  }

  // 2. Truncate / Delete Transactional & Order tables
  const tables = [
    'reviews',
    'order_items',
    'fresh_coins_ledgers',
    'customer_discounts',
    'orders',
    'driver_payouts',
    'society_payouts',
    'procurement_bills',
    'inbound_leads',
    'warehouse_inventory',
    'daily_price_histories',
    'vendors',
    'users',
    'societies'
  ];

  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
      console.log(`✓ Truncated: "${table}"`);
    } catch (err) {
      // Fallback to Prisma deleteMany if table or constraint differs
    }
  }

  // Sequential delete fallback
  try { await prisma.review.deleteMany({}); } catch (e) {}
  try { await prisma.orderItem.deleteMany({}); } catch (e) {}
  try { await prisma.freshCoinsLedger.deleteMany({}); } catch (e) {}
  try { await prisma.customerDiscount.deleteMany({}); } catch (e) {}
  try { await prisma.order.deleteMany({}); } catch (e) {}
  try { await prisma.driverPayout.deleteMany({}); } catch (e) {}
  try { await prisma.societyPayout.deleteMany({}); } catch (e) {}
  try { await prisma.procurementBill.deleteMany({}); } catch (e) {}
  try { await prisma.inboundLead.deleteMany({}); } catch (e) {}
  try { await prisma.warehouseInventory.deleteMany({}); } catch (e) {}
  try { await prisma.dailyPriceHistory.deleteMany({}); } catch (e) {}
  try { await prisma.vendor.deleteMany({}); } catch (e) {}
  try { await prisma.society.deleteMany({}); } catch (e) {}
  try { await prisma.user.deleteMany({}); } catch (e) {}

  // 3. Verify counts
  console.log('\n====================================================');
  console.log('📊 DATABASE STATUS REPORT:');
  console.log('====================================================');
  const [empCount, prodCount, unitCount, catCount, userCount, whCount, socCount, orderCount, payoutCount, invCount] = await Promise.all([
    prisma.employee.count(),
    prisma.product.count(),
    prisma.unit.count(),
    prisma.category.count(),
    prisma.user.count(),
    prisma.warehouse.count(),
    prisma.society.count(),
    prisma.order.count(),
    prisma.driverPayout.count(),
    prisma.warehouseInventory.count()
  ]);

  console.log(`Employees (Staff):         ${empCount} (Preserved)`);
  console.log(`Produce Items:             ${prodCount} (Preserved)`);
  console.log(`Master Units:              ${unitCount} (Preserved)`);
  console.log(`Master Categories:         ${catCount} (Preserved)`);
  console.log(`Hub Warehouses:            ${whCount} (Preserved)`);
  console.log(`Customer Accounts:         ${userCount} (CLEAN SLATE: 0)`);
  console.log(`Apartment Societies:       ${socCount} (CLEAN SLATE: 0)`);
  console.log(`Warehouse Inventory Rows:  ${invCount} (CLEAN SLATE: 0)`);
  console.log(`Orders:                    ${orderCount} (CLEAN SLATE: 0)`);
  console.log(`Driver Payouts:            ${payoutCount} (CLEAN SLATE: 0)`);
  console.log('====================================================');
  console.log('🎉 Clean slate ready for fresh testing.');
  console.log('====================================================');

  await prisma.$disconnect();
  process.exit(0);
}

cleanOperationalData().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
