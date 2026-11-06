const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanDatabase() {
  console.log('====================================================');
  console.log('🚀 FRESHIOZ COMPLETE DATABASE CLEANUP');
  console.log('PRESERVING:');
  console.log('  1. Employees (All Admin / Staff logins)');
  console.log('  2. Categories');
  console.log('  3. Units');
  console.log('  4. Warehouses');
  console.log('  5. Products Catalog');
  console.log('  6. System Configuration (Payment, Coins, Delivery Settings)');
  console.log('====================================================\n');

  try {
    // 1. Delete Reviews
    const reviews = await prisma.review.deleteMany({});
    console.log(`✓ Deleted Reviews: ${reviews.count}`);

    // 2. Delete Order Items
    const orderItems = await prisma.orderItem.deleteMany({});
    console.log(`✓ Deleted Order Items: ${orderItems.count}`);

    // 3. Delete FreshCoins Ledgers
    const coinsLedger = await prisma.freshCoinsLedger.deleteMany({});
    console.log(`✓ Deleted FreshCoins Ledgers: ${coinsLedger.count}`);

    // 4. Delete Customer Discounts
    const discounts = await prisma.customerDiscount.deleteMany({});
    console.log(`✓ Deleted Customer Discounts: ${discounts.count}`);

    // 5. Delete Orders
    const orders = await prisma.order.deleteMany({});
    console.log(`✓ Deleted Orders: ${orders.count}`);

    // 6. Delete Society Payouts
    const payouts = await prisma.societyPayout.deleteMany({});
    console.log(`✓ Deleted Society Payouts: ${payouts.count}`);

    // 7. Delete Users (Customers)
    const users = await prisma.user.deleteMany({});
    console.log(`✓ Deleted Customer Users: ${users.count}`);

    // 8. Delete Societies
    const societies = await prisma.society.deleteMany({});
    console.log(`✓ Deleted Societies: ${societies.count}`);

    // 9. Delete Warehouse Inventory
    const inventory = await prisma.warehouseInventory.deleteMany({});
    console.log(`✓ Deleted Warehouse Inventory: ${inventory.count}`);

    // 10. Delete Procurement Bills
    const bills = await prisma.procurementBill.deleteMany({});
    console.log(`✓ Deleted Procurement Bills: ${bills.count}`);

    // 11. Delete Vendors
    const vendors = await prisma.vendor.deleteMany({});
    console.log(`✓ Deleted Vendors: ${vendors.count}`);

    // 12. Delete Inbound Leads
    const leads = await prisma.inboundLead.deleteMany({});
    console.log(`✓ Deleted Inbound Leads: ${leads.count}`);

    // 13. Delete Daily Price History
    const priceHistory = await prisma.dailyPriceHistory.deleteMany({});
    console.log(`✓ Deleted Daily Price History: ${priceHistory.count}`);

    console.log('\n====================================================');
    console.log('📊 VERIFICATION OF PRESERVED DATA:');
    console.log('====================================================');
    const empCount = await prisma.employee.count();
    const catCount = await prisma.category.count();
    const unitCount = await prisma.unit.count();
    const whCount = await prisma.warehouse.count();
    const prodCount = await prisma.product.count();

    console.log(`• Employees:  ${empCount} preserved`);
    console.log(`• Categories: ${catCount} preserved`);
    console.log(`• Units:      ${unitCount} preserved`);
    console.log(`• Warehouses: ${whCount} preserved`);
    console.log(`• Products:   ${prodCount} preserved`);
    console.log('====================================================');
    console.log('🎉 Database is freshly cleaned and ready for testing!');
    console.log('====================================================');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error cleaning database:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDatabase();
