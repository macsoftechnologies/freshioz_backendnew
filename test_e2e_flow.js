const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch(e) {
          resolve({ status: res.statusCode, text: body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('================================================================');
  console.log('🚀 FRESHIOZ COMPLETE AUTOMATED END-TO-END FLOW VERIFICATION');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}:`, details || '');
      failed++;
    }
  }

  try {
    // 1. Super Admin Authentication
    console.log('--- Phase 1: Super Admin Authentication ---');
    const loginRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      email: 'superadmin@gmail.com',
      password: '123456'
    });
    
    assert(loginRes.status === 200 || loginRes.status === 201, 'Super Admin Login', loginRes.data);
    const token = loginRes.data?.token;
    const authHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    // 2. Warehouse Hub Identification & Settings
    console.log('\n--- Phase 2: Warehouse Hub & Delivery Slots ---');
    const whRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/warehouses',
      method: 'GET',
      headers: authHeaders
    });
    assert(whRes.status === 200 && whRes.data.length > 0, 'Warehouse Hub Loaded', `Count: ${whRes.data?.length}`);
    const activeWh = whRes.data[0];
    console.log(`   🏢 Hub: ${activeWh.name} (Code: ${activeWh.code})`);
    console.log(`   🕒 Operating Slots: ${activeWh.slots?.map(s => s.label).join(' | ')}`);

    // 3. Resident Inbound Request Submission
    console.log('\n--- Phase 3: Inbound Lead Request (Storefront -> Sales Desk) ---');
    const leadCode = `LEAD-${Date.now().toString().slice(-4)}`;
    const leadRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/inbound-requests',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      societyName: `Autotest Community ${leadCode}`,
      contactName: 'Test Secretary',
      contactPhone: `99${Date.now().toString().slice(-8)}`,
      city: 'Visakhapatnam',
      notes: 'Automated test community request'
    });
    assert(leadRes.status === 200 || leadRes.status === 201, 'Inbound Resident Lead Created', leadRes.data?.id || leadRes.data);

    // 4. Sales Onboards & Super Admin Approves Community
    console.log('\n--- Phase 4: Society Onboarding & Approval (Sales -> Admin) ---');
    const socCode = `SOC-${Date.now().toString().slice(-5)}`;
    const socRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/societies',
      method: 'POST',
      headers: authHeaders
    }, {
      id: socCode,
      name: `Greenfields Residency ${socCode}`,
      type: 'APARTMENT',
      address: 'Sea Beach Road, Visakhapatnam',
      warehouseId: activeWh.id,
      secretaryName: 'RWA President',
      secretaryPhone: '9876543210',
      totalFloors: 10,
      totalUnits: 40,
      deliveryMode: 'SOCIETY_DESK',
      status: 'APPROVED',
      commissionType: 'PERCENTAGE',
      commissionValue: 3.5
    });
    assert(socRes.status === 200 || socRes.status === 201, 'Community Onboarded & Approved', socRes.data?.id);
    const testSociety = socRes.data;

    // 5. Master Produce Catalog check
    console.log('\n--- Phase 5: Master Catalog & Live Pricing ---');
    const catRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/catalog',
      method: 'GET'
    });
    assert(catRes.status === 200 && catRes.data?.products?.length > 0, 'Catalog Produce Items Live', `Total: ${catRes.data?.products?.length}`);
    const sampleProduct = catRes.data.products[0];
    console.log(`   🍎 Selected Produce: ${sampleProduct.name} (₹${sampleProduct.retailPrice}/${sampleProduct.retailUnit || 'kg'})`);

    // 6. Resident Order Placement (Frontend Flow)
    console.log('\n--- Phase 6: Resident Places Order (Frontend -> CONFIRMED) ---');
    const orderCode = `ORD-TEST-${Date.now().toString().slice(-4)}`;
    const orderPayload = {
      id: orderCode,
      userPhone: '9848022338',
      userName: 'Auto Test Resident',
      societyId: testSociety.id,
      societyName: testSociety.name,
      flatNo: 'Tower A - 302',
      warehouseId: activeWh.id,
      warehouseCode: activeWh.code,
      deliveryDate: 'Today (08/11/2026)',
      deliverySlot: 'Morning Fresh Slot (07:00 AM – 08:30 AM)',
      paymentMethod: 'PAY_ON_DELIVERY',
      paymentStatus: 'PENDING_COD',
      items: [
        {
          productId: sampleProduct.id,
          name: sampleProduct.name,
          qty: 3,
          unit: sampleProduct.retailUnit || '1 kg',
          price: sampleProduct.retailPrice || 40,
          total: (sampleProduct.retailPrice || 40) * 3
        }
      ],
      subtotal: (sampleProduct.retailPrice || 40) * 3,
      totalAmount: (sampleProduct.retailPrice || 40) * 3
    };

    const orderRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/orders',
      method: 'POST',
      headers: authHeaders
    }, orderPayload);

    assert(orderRes.status === 200 || orderRes.status === 201, 'Customer Order Created (CONFIRMED)', orderRes.data?.id);
    const createdOrder = orderRes.data;

    // 7. Warehouse Staff Inline Packing Flow
    console.log('\n--- Phase 7: Warehouse Crating & Packing Line (CONFIRMED -> PACKED) ---');
    const packRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/orders/${createdOrder.id}/status`,
      method: 'PATCH',
      headers: authHeaders
    }, {
      status: 'PACKED',
      packedBy: 'Warehouse Staff Packer 1'
    });
    assert(packRes.status === 200 && packRes.data?.status === 'PACKED', 'Order Inline Packed (PACKED)', packRes.data?.status);

    // 8. Driver Handover Dispatch Flow
    console.log('\n--- Phase 8: Batch Handover to Driver (PACKED -> OUT_FOR_DELIVERY) ---');
    const dispatchRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/orders/${createdOrder.id}/status`,
      method: 'PATCH',
      headers: authHeaders
    }, {
      status: 'OUT_FOR_DELIVERY',
      deliveryPartnerName: 'Ramesh Driver',
      deliveryPartnerPhone: '9876543213',
      vehicleNumber: 'AP-31-TR-9988'
    });
    assert(dispatchRes.status === 200 && dispatchRes.data?.status === 'OUT_FOR_DELIVERY', 'Batch Handover to Driver (OUT_FOR_DELIVERY)', dispatchRes.data?.status);

    // 9. Doorstep Delivery & COD Cash Collection
    console.log('\n--- Phase 9: Doorstep Delivery & COD Cash Handover (OUT_FOR_DELIVERY -> DELIVERED) ---');
    const deliverRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/orders/${createdOrder.id}/status`,
      method: 'PATCH',
      headers: authHeaders
    }, {
      status: 'DELIVERED',
      codCollectedAmount: createdOrder.totalAmount,
      codCollectedBy: 'Ramesh Driver',
      codReceivedMode: 'CASH'
    });
    assert(deliverRes.status === 200 && deliverRes.data?.status === 'DELIVERED', 'Doorstep Delivery Completed (DELIVERED)', deliverRes.data?.status);

    // 10. Safeguard Verification: DELIVERED Order MUST BE IMMUTABLE
    console.log('\n--- Phase 10: DELIVERED Immutable Safeguard Verification ---');
    const tamperRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/orders/${createdOrder.id}/status`,
      method: 'PATCH',
      headers: authHeaders
    }, {
      status: 'CANCELLED',
      reason: 'Attempted cancellation after verified delivery'
    });
    assert(tamperRes.status === 400, 'Tamper Attempt Strictly Rejected (400 Bad Request)', tamperRes.data?.message);
    console.log(`   🛡️ Safeguard Response: "${tamperRes.data?.message}"`);

    // 11. COD Cash Handover to Hub Cashier
    console.log('\n--- Phase 11: Cashier Settlement & Reconciliation ---');
    const settleRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/orders/${createdOrder.id}/settle-cod`,
      method: 'POST',
      headers: authHeaders
    });
    assert((settleRes.status === 200 || settleRes.status === 201) && (settleRes.data?.order?.codSettledToHub === true || settleRes.data?.success === true || settleRes.data?.codSettledToHub === true), 'Driver Cash Settled at Hub Cashier', settleRes.data);

    // Summary
    console.log('\n================================================================');
    console.log(`🏁 COMPLETE AUTOMATION TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('================================================================\n');

  } catch (err) {
    console.error('Fatal test error:', err);
  }
}

runTests();
