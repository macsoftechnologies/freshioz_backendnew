const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function exportData() {
  console.log('Exporting master data from local PostgreSQL database...');

  const categories = await prisma.category.findMany();
  const units = await prisma.unit.findMany();
  const products = await prisma.product.findMany();
  const paymentSettings = await prisma.paymentSetting.findMany();

  const data = {
    exportedAt: new Date().toISOString(),
    categories,
    units,
    products,
    paymentSettings,
  };

  const outputPath = path.resolve(__dirname, '../prisma/master-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');

  console.log(`✅ Successfully exported master data to: ${outputPath}`);
  console.log(`   - Categories: ${categories.length}`);
  console.log(`   - Units: ${units.length}`);
  console.log(`   - Products: ${products.length}`);
  console.log(`   - Payment Settings: ${paymentSettings.length}`);
}

exportData()
  .catch((e) => {
    console.error('Export failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
