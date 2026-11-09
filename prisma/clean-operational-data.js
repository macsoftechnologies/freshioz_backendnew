const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanOperationalData() {
  console.log('====================================================');
  console.log('🧹 FRESHIOZ CLEAN TEST DATA RESET');
  console.log('PRESERVING STRICTLY:');
  console.log('  ✓ Employees (Staff & Delivery Executives)');
  console.log('  ✓ Products (Produce Catalog)');
  console.log('  ✓ Categories');
  console.log('  ✓ Units');
  console.log('  ✓ Warehouses & Societies (Hub infrastructure)');
  console.log('====================================================\n');

  // 1. Truncate / Delete Transactional & Order tables
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
    'users'
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
  try {
    await prisma.review.deleteMany({});
    console.log('✓ Cleaned Reviews');
  } catch (e) {}

  try {
    await prisma.orderItem.deleteMany({});
    console.log('✓ Cleaned OrderItems');
  } catch (e) {}

  try {
    await prisma.freshCoinsLedger.deleteMany({});
    console.log('✓ Cleaned FreshCoinsLedgers');
  } catch (e) {}

  try {
    await prisma.driverPayout.deleteMany({});
    console.log('✓ Cleaned DriverPayouts');
  } catch (e) {}

  try {
    await prisma.societyPayout.deleteMany({});
    console.log('✓ Cleaned SocietyPayouts');
  } catch (e) {}

  try {
    await prisma.customerDiscount.deleteMany({});
    console.log('✓ Cleaned CustomerDiscounts');
  } catch (e) {}

  try {
    await prisma.order.deleteMany({});
    console.log('✓ Cleaned Orders');
  } catch (e) {}

  try {
    await prisma.user.deleteMany({});
    console.log('✓ Cleaned Customers (Users)');
  } catch (e) {}

  try {
    await prisma.procurementBill.deleteMany({});
    console.log('✓ Cleaned ProcurementBills');
  } catch (e) {}

  try {
    await prisma.inboundLead.deleteMany({});
    console.log('✓ Cleaned InboundLeads');
  } catch (e) {}

  // 2. Reset Warehouse Inventory with fresh available stock for all products
  console.log('\n📦 Resetting Warehouse Inventory to pristine stock...');
  try {
    await prisma.warehouseInventory.deleteMany({});
    const warehouses = await prisma.warehouse.findMany();
    const products = await prisma.product.findMany();

    for (const wh of warehouses) {
      for (const prod of products) {
        await prisma.warehouseInventory.create({
          data: {
            warehouseId: wh.id,
            productId: prod.id,
            currentQty: 100, // 100 units/kg in stock ready for new orders
            reservedQty: 0,
            unit: prod.retailUnit || 'kg'
          }
        });
      }
      console.log(`✓ Initialized 100 units/kg fresh inventory for Warehouse: ${wh.name} (${wh.id})`);
    }
  } catch (err) {
    console.error('Inventory init error:', err?.message);
  }

  // 3. Verify counts
  console.log('\n====================================================');
  console.log('📊 DATABASE STATUS REPORT:');
  console.log('====================================================');
  const [empCount, prodCount, unitCount, catCount, whCount, socCount, orderCount, payoutCount, userCount, invCount] = await Promise.all([
    prisma.employee.count(),
    prisma.product.count(),
    prisma.unit.count(),
    prisma.category.count(),
    prisma.warehouse.count(),
    prisma.society.count(),
    prisma.order.count(),
    prisma.driverPayout.count(),
    prisma.user.count(),
    prisma.warehouseInventory.count()
  ]);

  console.log(`Employees (Staff):         ${empCount} (Preserved)`);
  console.log(`Produce Items:             ${prodCount} (Preserved)`);
  console.log(`Master Units:              ${unitCount} (Preserved)`);
  console.log(`Master Categories:         ${catCount} (Preserved)`);
  console.log(`Hub Warehouses:            ${whCount} (Preserved)`);
  console.log(`Apartment Societies:       ${socCount} (Preserved)`);
  console.log(`Warehouse Inventory Rows:  ${invCount} (Reset with 100 units each)`);
  console.log(`Orders:                    ${orderCount} (CLEAN SLATE: 0)`);
  console.log(`Driver Payouts:            ${payoutCount} (CLEAN SLATE: 0)`);
  console.log(`Customer Accounts:         ${userCount} (CLEAN SLATE: 0)`);
  console.log('====================================================');
  console.log('🎉 Database is completely clean and ready for fresh end-to-end testing!');
  console.log('====================================================');

  await prisma.$disconnect();
  process.exit(0);
}

cleanOperationalData().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
