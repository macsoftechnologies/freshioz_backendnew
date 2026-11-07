const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanDatabase() {
  console.log('====================================================');
  console.log('🚀 FRESHIOZ COMPLETE DATABASE RESET');
  console.log('PRESERVING STRICTLY ONLY:');
  console.log('  1. Employees');
  console.log('  2. Categories');
  console.log('  3. Units');
  console.log('  4. Produce (Products)');
  console.log('====================================================\n');

  // Try PostgreSQL TRUNCATE CASCADE first for instant atomic cleanup
  const tablesToTruncate = [
    'reviews',
    'order_items',
    'fresh_coins_ledgers',
    'customer_discounts',
    'orders',
    'society_payouts',
    'users',
    'societies',
    'warehouse_inventory',
    'procurement_bills',
    'inbound_leads',
    'daily_price_history'
  ];

  for (const table of tablesToTruncate) {
    try {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
      console.log(`✓ Truncated table: "${table}"`);
    } catch (err) {
      // Table might not exist yet or relation is different - fallback silently
    }
  }

  // Sequential individual deletes with try/catch so one missing table NEVER blocks the rest
  const steps = [
    { name: 'Reviews', fn: () => prisma.review?.deleteMany({}) },
    { name: 'Order Items', fn: () => prisma.orderItem?.deleteMany({}) },
    { name: 'FreshCoins Ledgers', fn: () => prisma.freshCoinsLedger?.deleteMany({}) },
    { name: 'Customer Discounts', fn: () => prisma.customerDiscount?.deleteMany({}) },
    { name: 'Orders', fn: () => prisma.order?.deleteMany({}) },
    { name: 'Society Payouts', fn: () => prisma.societyPayout?.deleteMany({}) },
    { name: 'Users (Customers)', fn: () => prisma.user?.deleteMany({}) },
    { name: 'Societies', fn: () => prisma.society?.deleteMany({}) },
    { name: 'Warehouse Inventory', fn: () => prisma.warehouseInventory?.deleteMany({}) },
    { name: 'Procurement Bills', fn: () => prisma.procurementBill?.deleteMany({}) },
    { name: 'Inbound Leads', fn: () => prisma.inboundLead?.deleteMany({}) },
    { name: 'Daily Price History', fn: () => prisma.dailyPriceHistory?.deleteMany({}) },
  ];

  for (const step of steps) {
    try {
      if (step.fn) {
        const res = await step.fn();
        if (res && res.count !== undefined) {
          console.log(`✓ Cleaned ${step.name}: ${res.count} records removed`);
        }
      }
    } catch (err) {
      console.log(`   (Skipped ${step.name}: ${err?.message?.split('\n')[0] || 'table not found'})`);
    }
  }

  console.log('\n====================================================');
  console.log('📊 VERIFICATION OF PRESERVED DATA (EXACTLY 4):');
  console.log('====================================================');
  try {
    const empCount = await prisma.employee.count();
    const catCount = await prisma.category.count();
    const unitCount = await prisma.unit.count();
    const prodCount = await prisma.product.count();

    console.log(`1. Employees:  ${empCount} preserved`);
    console.log(`2. Categories: ${catCount} preserved`);
    console.log(`3. Units:      ${unitCount} preserved`);
    console.log(`4. Produce:    ${prodCount} preserved`);
  } catch (err) {
    console.error('Count verification error:', err?.message);
  }

  console.log('====================================================');
  console.log('🎉 Everything else wiped! Clean slate ready for fresh testing.');
  console.log('====================================================');

  await prisma.$disconnect();
  process.exit(0);
}

cleanDatabase();
