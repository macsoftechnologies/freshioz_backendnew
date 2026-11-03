const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function importData() {
  const filePath = path.resolve(__dirname, '../prisma/master-data.json');
  if (!fs.existsSync(filePath)) {
    console.error(`Master data file not found at: ${filePath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw);

  console.log(`Starting master data sync (Exported at: ${data.exportedAt})...`);

  // 1. Categories
  console.log(`1. Syncing ${data.categories.length} Categories...`);
  for (const cat of data.categories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: cat,
      create: cat,
    });
  }

  // 2. Units
  console.log(`2. Syncing ${data.units.length} Units...`);
  for (const u of data.units) {
    await prisma.unit.upsert({
      where: { id: u.id },
      update: u,
      create: u,
    });
  }

  // 3. Products
  console.log(`3. Syncing ${data.products.length} Products...`);
  for (const p of data.products) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: p,
      create: p,
    });
  }

  // 4. Payment Settings
  if (Array.isArray(data.paymentSettings)) {
    console.log(`4. Syncing Payment Settings...`);
    for (const ps of data.paymentSettings) {
      await prisma.paymentSetting.upsert({
        where: { id: ps.id },
        update: ps,
        create: ps,
      });
    }
  }

  console.log('==================================================');
  console.log('✅ LIVE DATABASE MASTER SYNC COMPLETED SUCCESSFULLY!');
  console.log(`📦 Categories: ${data.categories.length}`);
  console.log(`📏 Units:      ${data.units.length}`);
  console.log(`🥬 Products:   ${data.products.length}`);
  console.log('==================================================');
}

importData()
  .catch((e) => {
    console.error('Import failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
