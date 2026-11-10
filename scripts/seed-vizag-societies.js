const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedVizagSocieties() {
  console.log('🌱 Seeding 5 Hostels and 5 Apartments in Visakhapatnam...');

  const warehouse = await prisma.warehouse.findFirst({
    where: {
      OR: [
        { name: { contains: 'Vizag', mode: 'insensitive' } },
        { location: { contains: 'Visakhapatnam', mode: 'insensitive' } }
      ]
    }
  }) || await prisma.warehouse.findFirst();

  const warehouseId = warehouse ? warehouse.id : 'WH_VIZAG_01';
  console.log(`Using Warehouse: ${warehouse?.name || 'Default'} (${warehouseId})`);

  const societies = [
    // 5 Hostels
    {
      id: 'FRZ_VZ_HST_01',
      name: 'Sri Krishna Luxury Men & Women Hostel',
      type: 'HOSTEL',
      address: 'Plot 42, Sector 3, MVP Colony, Visakhapatnam - 530017',
      imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=500',
      lat: 17.7420,
      lng: 83.3320,
      secretaryName: 'K. Narayana Rao',
      secretaryPhone: '9848123001',
      totalFloors: 4,
      totalUnits: 35
    },
    {
      id: 'FRZ_VZ_HST_02',
      name: 'Sai Balaji Executive Student Stay & Hostel',
      type: 'HOSTEL',
      address: 'Near Gitam University Road, Rushikonda, Visakhapatnam - 530045',
      imageUrl: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=500',
      lat: 17.7820,
      lng: 83.3850,
      secretaryName: 'M. Srinivasulu',
      secretaryPhone: '9848123002',
      totalFloors: 5,
      totalUnits: 50
    },
    {
      id: 'FRZ_VZ_HST_03',
      name: 'Venkateswara Working Women Hostel',
      type: 'HOSTEL',
      address: 'D.No 8-1-12, Siripuram Junction, Visakhapatnam - 530003',
      imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500',
      lat: 17.7215,
      lng: 83.3150,
      secretaryName: 'P. Lakshmi Devi',
      secretaryPhone: '9848123003',
      totalFloors: 4,
      totalUnits: 28
    },
    {
      id: 'FRZ_VZ_HST_04',
      name: 'Smriti Youth Living & Co-living Hostel',
      type: 'HOSTEL',
      address: 'Behind Rythu Bazaar, Madhurawada, Visakhapatnam - 530048',
      imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500',
      lat: 17.8080,
      lng: 83.3550,
      secretaryName: 'Ch. Satyanarayana',
      secretaryPhone: '9848123004',
      totalFloors: 4,
      totalUnits: 40
    },
    {
      id: 'FRZ_VZ_HST_05',
      name: 'Ananda PG & Hostel Accommodations',
      type: 'HOSTEL',
      address: '48-12-5, Dwaraka Nagar Main Road, Visakhapatnam - 530016',
      imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500',
      lat: 17.7285,
      lng: 83.3080,
      secretaryName: 'V. Rama Krishna',
      secretaryPhone: '9848123005',
      totalFloors: 3,
      totalUnits: 24
    },
    // 5 Apartments
    {
      id: 'FRZ_VZ_APT_01',
      name: 'Sea Pearl Ocean Heights Apartments',
      type: 'APARTMENT',
      address: "Beach Road, Lawson's Bay Colony, Visakhapatnam - 530017",
      imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500',
      lat: 17.7340,
      lng: 83.3420,
      secretaryName: 'R. V. Subba Rao',
      secretaryPhone: '9848123006',
      totalFloors: 10,
      totalUnits: 80
    },
    {
      id: 'FRZ_VZ_APT_02',
      name: 'Green Meadows Luxury Apartments',
      type: 'APARTMENT',
      address: 'Sector 9, MVP Colony, Visakhapatnam - 530017',
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500',
      lat: 17.7470,
      lng: 83.3360,
      secretaryName: 'D. Chandra Sekhar',
      secretaryPhone: '9848123007',
      totalFloors: 8,
      totalUnits: 64
    },
    {
      id: 'FRZ_VZ_APT_03',
      name: 'Silver Oaks Residency',
      type: 'APARTMENT',
      address: 'Opposite Diamond Park, Seethammadhara, Visakhapatnam - 530013',
      imageUrl: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=500',
      lat: 17.7410,
      lng: 83.3180,
      secretaryName: 'G. Prasad Varma',
      secretaryPhone: '9848123008',
      totalFloors: 6,
      totalUnits: 48
    },
    {
      id: 'FRZ_VZ_APT_04',
      name: 'Royal Palms Elite Residences',
      type: 'APARTMENT',
      address: 'Near Midhilapuri Vuda Colony, Madhurawada, Visakhapatnam - 530041',
      imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500',
      lat: 17.8140,
      lng: 83.3610,
      secretaryName: 'K. Bhaskar Reddy',
      secretaryPhone: '9848123009',
      totalFloors: 12,
      totalUnits: 96
    },
    {
      id: 'FRZ_VZ_APT_05',
      name: 'Kailasagiri Hill View Heights',
      type: 'APARTMENT',
      address: 'Hill Crest Road, Pothinamallayya Palem, Visakhapatnam - 530041',
      imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=500',
      lat: 17.7950,
      lng: 83.3480,
      secretaryName: 'B. Appala Raju',
      secretaryPhone: '9848123010',
      totalFloors: 7,
      totalUnits: 56
    }
  ];

  for (const s of societies) {
    await prisma.society.upsert({
      where: { id: s.id },
      update: {
        name: s.name,
        type: s.type,
        address: s.address,
        imageUrl: s.imageUrl,
        lat: s.lat,
        lng: s.lng,
        warehouseId: warehouseId,
        secretaryName: s.secretaryName,
        secretaryPhone: s.secretaryPhone,
        totalFloors: s.totalFloors,
        totalUnits: s.totalUnits,
        deliveryMode: 'SOCIETY_DESK',
        status: 'APPROVED',
        commissionType: 'PERCENTAGE',
        commissionValue: 3.5
      },
      create: {
        id: s.id,
        name: s.name,
        type: s.type,
        address: s.address,
        imageUrl: s.imageUrl,
        lat: s.lat,
        lng: s.lng,
        warehouseId: warehouseId,
        secretaryName: s.secretaryName,
        secretaryPhone: s.secretaryPhone,
        totalFloors: s.totalFloors,
        totalUnits: s.totalUnits,
        deliveryMode: 'SOCIETY_DESK',
        status: 'APPROVED',
        commissionType: 'PERCENTAGE',
        commissionValue: 3.5,
        balanceEarned: 0.0,
        totalOrdersDelivered: 0
      }
    });
    console.log(`  ✓ ${s.type}: ${s.name} (${s.id}) -> APPROVED`);
  }

  const total = await prisma.society.count();
  console.log(`\n🎉 Done! Total societies in database: ${total}`);
  await prisma.$disconnect();
}

seedVizagSocieties().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
