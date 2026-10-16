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

const PRODUCTS = [
  // ================= 10 FRESH VEGETABLES =================
  {
    id: 'PRD_VEG_TOMATO_DESI',
    name: 'Desi Country Tomato (Nati Tomato)',
    kannadaName: null,
    categoryId: 'VEGETABLES',
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
    inStock: true
  },
  {
    id: 'PRD_VEG_TOMATO_HYBRID',
    name: 'Hybrid Cooking Tomato (Firm Grade-A)',
    kannadaName: null,
    categoryId: 'VEGETABLES',
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
    inStock: true
  },
  {
    id: 'PRD_VEG_ONION_NASHIK',
    name: 'Fresh Red Onion (Nashik Quality)',
    kannadaName: null,
    categoryId: 'VEGETABLES',
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
    inStock: true
  },
  {
    id: 'PRD_VEG_POTATO_JYOTI',
    name: 'New Crop Jyoti Potato (Mud-Free)',
    kannadaName: null,
    categoryId: 'VEGETABLES',
    retailUnit: '1 kg',
    retailPrice: 30.0,
    retailMarketPrice: 42.0,
    bulkMinQty: 5.0,
    bulkDiscountPercent: 10.0,
    origin: 'Hassan APMC Mandi',
    shelfLife: '12-15 Days',
    desc: 'Clean, thin-skinned golden potatoes. Great for boiling, curries, roasting, and shallow frying.',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600',
    badge: 'Mud-Free & Clean',
    tags: ['Daily Essential', 'Kid Favorite'],
    gstPercent: 0.0,
    status: 'ACTIVE',
    inStock: true
  },
  {
    id: 'PRD_VEG_CAPSICUM_GREEN',
    name: 'Crisp Green Capsicum (Bell Pepper)',
    kannadaName: null,
    categoryId: 'VEGETABLES',
    retailUnit: '500 g',
    retailPrice: 34.0,
    retailMarketPrice: 45.0,
    bulkMinQty: 2.0,
    bulkDiscountPercent: 10.0,
    origin: 'Hosur Polyhouse Farms',
    shelfLife: '4-6 Days',
    desc: 'Thick-walled, crunchy green bell peppers with a sweet herbaceous flavor. Perfect for stir-fries and noodles.',
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600',
    badge: 'Polyhouse Fresh',
    tags: ['Crunchy', 'Salad & Stir Fry'],
    gstPercent: 0.0,
    status: 'ACTIVE',
    inStock: true
  },
  {
    id: 'PRD_VEG_BHINDI_OKRA',
    name: "Tender Green Lady's Finger (Bhindi / Okra)",
    kannadaName: null,
    categoryId: 'VEGETABLES',
    retailUnit: '500 g',
    retailPrice: 26.0,
    retailMarketPrice: 38.0,
    bulkMinQty: 2.0,
    bulkDiscountPercent: 12.0,
    origin: 'Chikkaballapur Farms',
    shelfLife: '3-4 Days',
    desc: 'Super tender, easy-to-snap small green bhendi without seeds hardening. Ideal for crispy bhindi fry.',
    image: 'https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?w=600',
    badge: 'Tender & Snap-Fresh',
    tags: ['Fiber Rich', 'Fry Special'],
    gstPercent: 0.0,
    status: 'ACTIVE',
    inStock: true
  },
  {
    id: 'PRD_VEG_CARROT_OOTY',
    name: 'Ooty Tender Carrot (English Orange)',
    kannadaName: null,
    categoryId: 'VEGETABLES',
    retailUnit: '500 g',
    retailPrice: 36.0,
    retailMarketPrice: 50.0,
    bulkMinQty: 2.0,
    bulkDiscountPercent: 10.0,
    origin: 'Ooty Hill Farms',
    shelfLife: '6-8 Days',
    desc: 'Freshly pulled hill carrots with sweet crunch and bright orange hue. Excellent for salads, juicing and halwa.',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600',
    badge: 'Crunchy & Sweet',
    tags: ['Salad Essential', 'Juicing Special'],
    gstPercent: 0.0,
    status: 'ACTIVE',
    inStock: true
  },
  {
    id: 'PRD_VEG_CAULIFLOWER_WHOLE',
    name: 'Farm Cauliflower (Tight White Curd)',
    kannadaName: null,
    categoryId: 'VEGETABLES',
    retailUnit: '1 pc',
    retailPrice: 35.0,
    retailMarketPrice: 48.0,
    bulkMinQty: 3.0,
    bulkDiscountPercent: 15.0,
    origin: 'Malur APMC Yard',
    shelfLife: '4-5 Days',
    desc: 'Compact, snow-white cauliflower head enveloped with fresh protective leaves. Zero pesticide odor.',
    image: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=600',
    badge: 'Tight White Curd',
    tags: ['Curry Special', 'Farm Harvest'],
    gstPercent: 0.0,
    status: 'ACTIVE',
    inStock: true
  },
  {
    id: 'PRD_VEG_BOTTLE_GOURD',
    name: 'Tender Bottle Gourd (Sorakaya / Lauki)',
    kannadaName: null,
    categoryId: 'VEGETABLES',
    retailUnit: '1 pc',
    retailPrice: 28.0,
    retailMarketPrice: 40.0,
    bulkMinQty: 3.0,
    bulkDiscountPercent: 10.0,
    origin: 'Local Mandi Belts',
    shelfLife: '5-7 Days',
    desc: 'Light green, seedless tender bottle gourd with high water content. Perfect for cooling curries and juices.',
    image: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=600',
    badge: 'Cooling & Hydrating',
    tags: ['Juicing Essential', 'Weight Care'],
    gstPercent: 0.0,
    status: 'ACTIVE',
    inStock: true
  },
  {
    id: 'PRD_VEG_GREEN_PEAS',
    name: 'Fresh Green Peas (Ooty Sweet Matar)',
    kannadaName: null,
    categoryId: 'VEGETABLES',
    retailUnit: '500 g',
    retailPrice: 48.0,
    retailMarketPrice: 65.0,
    bulkMinQty: 2.0,
    bulkDiscountPercent: 12.0,
    origin: 'Ooty Hill Valleys',
    shelfLife: '4-5 Days',
    desc: 'Plump, naturally sweet green pea pods harvested fresh from mountain soil. Ideal for pulav and curries.',
    image: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=600',
    badge: 'Sweet Mountain Pods',
    tags: ['Protein Rich', 'Pulav Special'],
    gstPercent: 0.0,
    status: 'ACTIVE',
    inStock: true
  },

  // ================= 10 FRESH FRUITS =================
  {
    id: 'PRD_FRT_BANANA_ROBUSTA',
    name: 'Robusta Golden Banana (Premium Table Grade)',
    kannadaName: null,
    categoryId: 'FRUITS',
    retailUnit: '1 kg',
    retailPrice: 38.0,
    retailMarketPrice: 55.0,
    bulkMinQty: 3.0,
    bulkDiscountPercent: 10.0,
    origin: 'Andhra Cauvery Basin',
    shelfLife: '3-5 Days',
    desc: 'Naturally ripened, sweet, nutrient-rich golden bananas without carbide treatment.',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600',
    badge: 'Naturally Ripened',
    tags: ['Energy Booster', 'Daily Breakfast'],
    gstPercent: 0.0,
    status: 'ACTIVE',
    inStock: true
  },
  {
    id: 'PRD_FRT_APPLE_SHIMLA',
    name: 'Royal Delicious Shimla Apple',
    kannadaName: null,
    categoryId: 'FRUITS',
    retailUnit: '1 kg',
    retailPrice: 145.0,
    retailMarketPrice: 180.0,
    bulkMinQty: 3.0,
    bulkDiscountPercent: 12.0,
    origin: 'Kinnaur & Shimla Orchards',
    shelfLife: '10-14 Days',
    desc: 'Crisp, aromatic red apples directly harvested from Himachal high-altitude orchards.',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600',
    badge: 'Sweet & Crunchy',
    tags: ['Antioxidant Rich', 'Premium Quality'],
    gstPercent: 0.0,
    status: 'ACTIVE',
    inStock: true
  },
  {
    id: 'PRD_FRT_ORANGE_NAGPUR',
    name: 'Nagpur Sweet Orange (Mosambi / Mandarin)',
    kannadaName: null,
    categoryId: 'FRUITS',
    retailUnit: '1 kg',
    retailPrice: 58.0,
    retailMarketPrice: 80.0,
    bulkMinQty: 3.0,
    bulkDiscountPercent: 12.0,
    origin: 'Nagpur Citrus Belt',
    shelfLife: '7-9 Days',
    desc: 'Juicy, thin-skinned citrus packed with immunity-boosting Vitamin C. Perfect for fresh breakfast juice.',
    image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=600',
    badge: 'High Vitamin C',
    tags: ['Juicing Special', 'Immunity Boost'],
    gstPercent: 0.0,
    status: 'ACTIVE',
    inStock: true
  },
  {
    id: 'PRD_FRT_POMEGRANATE_RUBY',
    name: 'Ruby Red Pomegranate (Bhagawa Anaar)',
    kannadaName: null,
    categoryId: 'FRUITS',
    retailUnit: '1 kg',
    retailPrice: 148.0,
    retailMarketPrice: 190.0,
    bulkMinQty: 3.0,
    bulkDiscountPercent: 10.0,
    origin: 'Solapur Orchards',
    shelfLife: '10-12 Days',
    desc: 'Plump deep ruby-red pearls bursting with sweet juice. Rich in iron and dietary antioxidants.',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600',
    badge: 'Deep Red Pearls',
    tags: ['Iron Rich', 'Heart Health'],
    gstPercent: 0.0,
    status: 'ACTIVE',
    inStock: true
  },
  {
    id: 'PRD_FRT_GUAVA_PINK',
    name: 'Taiwan Pink Guava (Seeded & Crisp)',
    kannadaName: null,
    categoryId: 'FRUITS',
    retailUnit: '1 kg',
    retailPrice: 65.0,
    retailMarketPrice: 90.0,
    bulkMinQty: 3.0,
    bulkDiscountPercent: 10.0,
    origin: 'Ananthapur Orchards',
    shelfLife: '4-6 Days',
    desc: 'Fragrant guava with a delightful blush pink interior and crunchy, mildly sweet flesh.',
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600',
    badge: 'Pink Flesh',
    tags: ['Vitamin C Rich', 'Digestive Health'],
    gstPercent: 0.0,
    status: 'ACTIVE',
    inStock: true
  },
  {
    id: 'PRD_FRT_PAPAYA_RED_LADY',
    name: 'Sweet Papaya (Honey Drop / Red Lady)',
    kannadaName: null,
    categoryId: 'FRUITS',
    retailUnit: '1 pc',
    retailPrice: 45.0,
    retailMarketPrice: 65.0,
    bulkMinQty: 3.0,
    bulkDiscountPercent: 15.0,
    origin: 'Chittoor Riverbed Farms',
    shelfLife: '3-5 Days',
    desc: 'Vibrant salmon-orange flesh, luscious and sweet with velvety texture. Excellent for digestive wellness.',
    image: 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=600',
    badge: 'Tree Ripened',
    tags: ['Gut Friendly', 'Dessert Special'],
    gstPercent: 0.0,
    status: 'ACTIVE',
    inStock: true
  },
  {
    id: 'PRD_FRT_GRAPES_GREEN',
    name: 'Kashmir Seedless Green Grapes (Sonaka)',
    kannadaName: null,
    categoryId: 'FRUITS',
    retailUnit: '500 g',
    retailPrice: 68.0,
    retailMarketPrice: 90.0,
    bulkMinQty: 2.0,
    bulkDiscountPercent: 10.0,
    origin: 'Nashik Vineyard Valley',
    shelfLife: '5-7 Days',
    desc: 'Long, crisp green seedless grapes with an exquisite sweet-tart balance. Washed and packed carefully.',
    image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600',
    badge: 'Crisp & Juicy',
    tags: ['Kid Friendly', 'Snack Special'],
    gstPercent: 0.0,
    status: 'ACTIVE',
    inStock: true
  },
  {
    id: 'PRD_FRT_PINEAPPLE_QUEEN',
    name: 'Queen Pineapple (Whole Golden Sweet)',
    kannadaName: null,
    categoryId: 'FRUITS',
    retailUnit: '1 pc',
    retailPrice: 52.0,
    retailMarketPrice: 75.0,
    bulkMinQty: 3.0,
    bulkDiscountPercent: 12.0,
    origin: 'Vazhakulam, Kerala',
    shelfLife: '5-7 Days',
    desc: 'Golden-yellow aromatic Queen pineapple with a deep honey aroma and tender edible core.',
    image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600',
    badge: 'Honey Aroma',
    tags: ['Tropical Delight', 'Refreshing'],
    gstPercent: 0.0,
    status: 'ACTIVE',
    inStock: true
  },
  {
    id: 'PRD_FRT_TENDER_COCONUT',
    name: 'Pollachi Tender Coconut (Elaneer / Kobbari)',
    kannadaName: null,
    categoryId: 'FRUITS',
    retailUnit: '1 pc',
    retailPrice: 46.0,
    retailMarketPrice: 60.0,
    bulkMinQty: 5.0,
    bulkDiscountPercent: 10.0,
    origin: 'Pollachi Coconut Groves',
    shelfLife: '6-8 Days',
    desc: 'Heavy green tender coconut packed with over 400ml of sweet, natural electrolyte-rich water.',
    image: 'https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?w=600',
    badge: '400ml+ Water',
    tags: ['Natural Electrolytes', 'Cooling'],
    gstPercent: 0.0,
    status: 'ACTIVE',
    inStock: true
  },
  {
    id: 'PRD_FRT_WATERMELON_KIRAN',
    name: 'Sweet Striped Watermelon (Kiran Quality)',
    kannadaName: null,
    categoryId: 'FRUITS',
    retailUnit: '1 pc',
    retailPrice: 68.0,
    retailMarketPrice: 95.0,
    bulkMinQty: 2.0,
    bulkDiscountPercent: 10.0,
    origin: 'Bellary Riverbed Farms',
    shelfLife: '7-10 Days',
    desc: 'Dark striped green watermelon (approx 2.5-3kg) with sweet deep red flesh and high hydration value.',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600',
    badge: 'Deep Red & Sweet',
    tags: ['Summer Hydration', 'Party Favorite'],
    gstPercent: 0.0,
    status: 'ACTIVE',
    inStock: true
  }
];

async function main() {
  console.log('🌱 Starting Freshioz Clean Database Seed & Reset...');

  // 1. Remove non-core / transactional records via foreign-key safe cascade or sequential deletes
  console.log('1. Clearing all transactional & operational tables...');
  try {
    await prisma.$executeRawUnsafe(`
      TRUNCATE TABLE 
        "order_items", 
        "orders", 
        "warehouse_inventory", 
        "daily_price_history", 
        "society_payouts", 
        "inbound_leads", 
        "procurement_bills", 
        "users", 
        "societies", 
        "vendors", 
        "warehouses" 
      CASCADE;
    `);
    console.log('   ✓ Cleared orders, inventory, procurement, societies, vendors & warehouses via TRUNCATE CASCADE');
  } catch (err) {
    console.log('   (Falling back to sequential deleteMany for operational tables)');
    await prisma.orderItem.deleteMany({});
    await prisma.dailyPriceHistory.deleteMany({});
    await prisma.warehouseInventory.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.societyPayout.deleteMany({});
    await prisma.inboundLead.deleteMany({});
    await prisma.procurementBill.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.society.deleteMany({});
    await prisma.vendor.deleteMany({});
    await prisma.warehouse.deleteMany({});
  }

  // 2. Remove non-superadmin employees (retaining strictly Super Admin)
  console.log('2. Preserving ONLY Super Admin role (removing all secondary employee accounts)...');
  await prisma.employee.deleteMany({
    where: {
      email: { not: 'superadmin@gmail.com' }
    }
  });

  const initialAdminPass = process.env.INITIAL_ADMIN_PASSWORD || '123456';
  const hashedPassword = await bcrypt.hash(initialAdminPass, 10);
  await prisma.employee.upsert({
    where: { email: 'superadmin@gmail.com' },
    update: {
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
  console.log('   ✓ Super Admin employee active: superadmin@gmail.com (Password: 123456)');

  // 3. Upsert Core Categories
  console.log('3. Preserving Core Categories (Vegetables & Fruits)...');
  const categories = [
    { id: 'VEGETABLES', name: 'Fresh Vegetables', slug: 'vegetables', icon: '🥦', description: 'Daily farm-fresh kitchen essentials and root vegetables' },
    { id: 'FRUITS', name: 'Fresh Fruits', slug: 'fruits', icon: '🍎', description: 'Sweet, tree-ripened orchard and citrus fruits' }
  ];

  for (const c of categories) {
    await prisma.category.upsert({
      where: { id: c.id },
      update: { name: c.name, slug: c.slug, icon: c.icon, description: c.description, status: 'ACTIVE' },
      create: { id: c.id, name: c.name, slug: c.slug, icon: c.icon, description: c.description, status: 'ACTIVE' }
    });
  }
  console.log('   ✓ Categories ready: Fresh Vegetables, Fresh Fruits');

  // 4. Upsert Standard Packaging Units
  console.log('4. Preserving Standard Produce Units...');
  const units = [
    { id: 'kg', name: 'Kilogram', label: 'kg', isBulk: false },
    { id: 'g', name: 'Gram', label: 'g', isBulk: false },
    { id: 'bunch', name: 'Bunch', label: 'bunch', isBulk: false },
    { id: 'piece', name: 'Piece', label: 'pc', isBulk: false },
    { id: 'box', name: 'Box', label: 'box', isBulk: true },
    { id: 'crate', name: 'Crate', label: 'crate', isBulk: true },
    { id: 'tones', name: 'Tons', label: 'tons', isBulk: true }
  ];

  for (const u of units) {
    await prisma.unit.upsert({
      where: { id: u.id },
      update: { name: u.name, label: u.label, isBulk: u.isBulk, status: 'ACTIVE' },
      create: { id: u.id, name: u.name, label: u.label, isBulk: u.isBulk, status: 'ACTIVE' }
    });
  }
  console.log('   ✓ Standard Units ready (kg, g, bunch, piece, box, crate, tons)');

  // 5. Seed / Preserve the 20 Curated Produce Items (10 Vegetables + 10 Fruits)
  console.log(`5. Seeding ${PRODUCTS.length} Curated Produce Items (10 Vegetables & 10 Fruits)...`);
  const validProductIds = PRODUCTS.map(p => p.id);

  // Clean out any historical or extraneous products not in curated produce list
  await prisma.product.deleteMany({
    where: {
      id: { notIn: validProductIds }
    }
  });

  for (const item of PRODUCTS) {
    await prisma.product.upsert({
      where: { id: item.id },
      update: {
        name: item.name,
        kannadaName: null,
        categoryId: item.categoryId,
        retailUnit: item.retailUnit,
        retailPrice: item.retailPrice,
        retailMarketPrice: item.retailMarketPrice,
        bulkMinQty: item.bulkMinQty,
        bulkDiscountPercent: item.bulkDiscountPercent,
        origin: item.origin,
        shelfLife: item.shelfLife,
        desc: item.desc,
        image: item.image,
        badge: item.badge,
        tags: item.tags,
        gstPercent: item.gstPercent,
        status: item.status,
        inStock: item.inStock
      },
      create: item
    });
  }
  // 6. Seed Primary Regional Warehouses (Agri-Logistics Hubs)
  console.log('6. Seeding Primary Regional Agri-Logistics Hubs (Warehouses)...');
  const warehouses = [
    {
      id: 'WH_BLR_SOUTH',
      code: 'WH-01',
      name: 'Freshioz Regional Hub South (HSR & Kudlu Gate)',
      location: 'Kudlu Gate, Bengaluru South',
      lat: 12.8893,
      lng: 77.6394,
      openTime: '05:00',
      cutoffTime: '21:00',
      capacityTons: 50.0,
      managerName: 'Ramesh Kumar',
      managerPhone: '9845012345',
      status: 'ACTIVE'
    },
    {
      id: 'WH_BLR_EAST',
      code: 'WH-02',
      name: 'Freshioz Regional Hub East (Whitefield & Kadugodi)',
      location: 'Kadugodi Industrial Area, Whitefield',
      lat: 12.9982,
      lng: 77.7609,
      openTime: '05:00',
      cutoffTime: '21:00',
      capacityTons: 60.0,
      managerName: 'Suresh Babu',
      managerPhone: '9845067890',
      status: 'ACTIVE'
    }
  ];

  for (const wh of warehouses) {
    await prisma.warehouse.upsert({
      where: { id: wh.id },
      update: wh,
      create: wh
    });
  }
  console.log('   ✓ Warehouses ready: WH-01 (South Bengaluru), WH-02 (East Bengaluru)');

  // 7. Seed Grounded Societies & Gated Communities Pre-Linked to Warehouses
  console.log('7. Seeding Active Apartment Communities & Societies...');
  const societies = [
    {
      id: 'SOC_707',
      name: 'Apartment-707',
      type: 'APARTMENT',
      address: '707, 24th Main, HSR Sector 2, Bengaluru',
      lat: 12.9121,
      lng: 77.6446,
      warehouseId: 'WH_BLR_SOUTH',
      secretaryName: 'Society Manager',
      secretaryPhone: '9988776655',
      totalFloors: 14,
      totalUnits: 120,
      deliveryMode: 'SOCIETY_DESK',
      status: 'APPROVED',
      commissionType: 'PERCENTAGE',
      commissionValue: 3.5
    },
    {
      id: 'SOC_GREEN_GLEN',
      name: 'Green Glen Residency',
      type: 'GATED_COMMUNITY',
      address: 'Green Glen Layout, Bellandur, Bengaluru',
      lat: 12.9299,
      lng: 77.6748,
      warehouseId: 'WH_BLR_SOUTH',
      secretaryName: 'Operations Desk',
      secretaryPhone: '9988776656',
      totalFloors: 18,
      totalUnits: 240,
      deliveryMode: 'SOCIETY_DESK',
      status: 'APPROVED',
      commissionType: 'PERCENTAGE',
      commissionValue: 3.5
    },
    {
      id: 'SOC_PRESTIGE_LAKESIDE',
      name: 'Prestige Lakeside Habitat',
      type: 'GATED_COMMUNITY',
      address: 'Varthur Main Road, Gunjur, Whitefield, Bengaluru',
      lat: 12.9515,
      lng: 77.7423,
      warehouseId: 'WH_BLR_EAST',
      secretaryName: 'Estate Office',
      secretaryPhone: '9988776657',
      totalFloors: 24,
      totalUnits: 800,
      deliveryMode: 'SOCIETY_DESK',
      status: 'APPROVED',
      commissionType: 'PERCENTAGE',
      commissionValue: 3.5
    }
  ];

  for (const soc of societies) {
    await prisma.society.upsert({
      where: { id: soc.id },
      update: soc,
      create: soc
    });
  }
  console.log('   ✓ Societies ready: Apartment-707, Green Glen Residency, Prestige Lakeside Habitat');

  // 8. Seed Verified Mandi Vendors
  console.log('8. Seeding APMC Mandi Commission Vendors...');
  const vendors = [
    {
      id: 'VND_MANDI_01',
      name: 'Kolar APMC Tomato Mandi Yard',
      phone: '9880011223',
      category: 'COMMISSION_AGENT',
      mandiLocation: 'Kolar APMC Mandi, Yard #14',
      lat: 13.1367,
      lng: 78.1347,
      status: 'ACTIVE'
    },
    {
      id: 'VND_MANDI_02',
      name: 'Malur Greens Agri Farmers Cooperative',
      phone: '9880044556',
      category: 'FARMER_FPO',
      mandiLocation: 'Malur Mandi Yard, Bengaluru Rural',
      lat: 13.0041,
      lng: 77.9404,
      status: 'ACTIVE'
    }
  ];

  for (const vnd of vendors) {
    await prisma.vendor.upsert({
      where: { id: vnd.id },
      update: vnd,
      create: vnd
    });
  }
  console.log('   ✓ Vendors ready: Kolar APMC Mandi, Malur Greens Cooperative');

  console.log('\n🎉 Industry Standard Database seed completed successfully! Warehouses, Societies, Vendors, Categories, Units, Products & Super Admin are active.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
