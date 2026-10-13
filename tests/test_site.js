// Automated verification script for CLEAN CORNERS website and API
import assert from 'node:assert';

const BASE_URL = 'http://localhost:3001';
const ADMIN_TOKEN = 'cleancorners2026';

async function runTests() {
  console.log('--- STARTING CLEAN CORNERS RIGOROUS VERIFICATION SUITE ---\n');

  // Test 1: Health check & Business info verification
  console.log('Test 1: Health check & Verified Business Details...');
  const healthRes = await fetch(`${BASE_URL}/api/health`);
  assert.strictEqual(healthRes.status, 200, 'Health endpoint should return 200');
  const health = await healthRes.json();
  assert.strictEqual(health.status, 'healthy');
  assert.strictEqual(health.businessLocation, 'Sainikpuri, Secunderabad, Telangana – 500094');
  assert.deepStrictEqual(health.phones, ['95154 47834', '93914 59522']);
  console.log('✓ Health & Business Info Verified: Sainikpuri, 95154 47834, 93914 59522\n');

  // Test 2: Pricing endpoint
  console.log('Test 2: Pricing endpoint & Rate card...');
  const pricingRes = await fetch(`${BASE_URL}/api/pricing`);
  assert.strictEqual(pricingRes.status, 200);
  const pricing = await pricingRes.json();
  assert(Array.isArray(pricing.services), 'Services should be an array');
  assert(pricing.services.length >= 5, 'Should have at least 5 service categories');
  
  // Verify starting rate is ₹199
  const addonService = pricing.services.find(s => s.id === 'express-addons');
  assert(addonService, 'Should have express-addons service');
  assert.strictEqual(addonService.startingPrice, 199, 'Starting price must be 199 as advertised');
  console.log(`✓ Pricing integrity verified: ${pricing.services.length} services loaded; starting rate ₹199/- confirmed.\n`);

  // Test 3: Form Validation Failure Scenarios
  console.log('Test 3: Testing Form Validation failure cases...');
  // Invalid phone number
  const badPhoneRes = await fetch(`${BASE_URL}/api/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName: 'Test Customer',
      phone: '12345', // invalid phone
      address: 'Near Bhavans, Sainikpuri',
      area: 'Sainikpuri',
      serviceId: 'full-home',
      serviceName: 'Full Home Deep Cleaning',
      estimatedPrice: 3499,
      preferredDate: '2026-10-15',
      preferredTimeSlot: 'Morning Slot'
    })
  });
  assert.strictEqual(badPhoneRes.status, 400, 'Invalid phone should be rejected with 400');
  const badPhoneJson = await badPhoneRes.json();
  assert(badPhoneJson.issues.some(i => i.field === 'phone'), 'Should report phone validation issue');
  console.log('✓ Invalid phone correctly rejected with 400 validation error');

  // Missing address
  const badAddrRes = await fetch(`${BASE_URL}/api/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName: 'Test Customer',
      phone: '9515447834',
      address: 'Hi', // too short (< 5 chars)
      area: 'Sainikpuri',
      serviceId: 'full-home',
      serviceName: 'Full Home Deep Cleaning',
      estimatedPrice: 3499,
      preferredDate: '2026-10-15',
      preferredTimeSlot: 'Morning Slot'
    })
  });
  assert.strictEqual(badAddrRes.status, 400, 'Short address should be rejected');
  console.log('✓ Short address correctly rejected with 400 validation error\n');

  // Test 4: Successful Form Submission with Enquiry Reference & Distinction Notice
  console.log('Test 4: Testing Genuine Enquiry Submission...');
  const goodRes = await fetch(`${BASE_URL}/api/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName: 'Anand Varma',
      phone: '9515447834',
      address: 'Plot 42, Defence Colony, Sainikpuri',
      area: 'Defence Colony, Sainikpuri',
      serviceId: 'full-home',
      serviceName: 'Full Home, Villa & Flat Deep Cleaning',
      packageName: '2 BHK Deep Cleaning',
      estimatedPrice: 3499,
      preferredDate: '2026-10-18',
      preferredTimeSlot: '09:00 AM – Morning Slot',
      notes: 'Need single disc scrubbing for marble floors'
    })
  });
  assert.strictEqual(goodRes.status, 201, 'Valid submission should return 201 Created');
  const goodJson = await goodRes.json();
  assert(goodJson.success === true, 'Success flag should be true');
  assert(goodJson.enquiryId.startsWith('CC-'), 'Enquiry ID should have CC- prefix');
  assert.strictEqual(goodJson.type, 'enquiry_received', 'Must distinguish enquiry received vs confirmed booking');
  assert(goodJson.notice.includes('ENQUIRY RECEIVED'), 'Notice must state enquiry received');
  console.log(`✓ Valid Enquiry created: ID=${goodJson.enquiryId}, Notice="${goodJson.notice}"\n`);

  // Test 5: Admin access & Enquiry retrieval
  console.log('Test 5: Testing Admin Authentication & Enquiry Listing...');
  // Unauthorized attempt
  const unauthRes = await fetch(`${BASE_URL}/api/enquiries`);
  assert.strictEqual(unauthRes.status, 401, 'Unauthorized request should be blocked');

  // Authorized attempt
  const adminRes = await fetch(`${BASE_URL}/api/enquiries`, {
    headers: { 'x-admin-token': ADMIN_TOKEN }
  });
  assert.strictEqual(adminRes.status, 200, 'Authorized request should return 200');
  const enquiries = await adminRes.json();
  assert(Array.isArray(enquiries) && enquiries.length > 0, 'Should return saved enquiries');
  const found = enquiries.find(e => e.id === goodJson.enquiryId);
  assert(found, 'Saved enquiry should exist in database');
  assert.strictEqual(found.customerName, 'Anand Varma');
  console.log(`✓ Admin retrieved ${enquiries.length} persistent enquiry records from database\n`);

  // Test 6: CSV Export Endpoint
  console.log('Test 6: Testing CSV Export...');
  const csvRes = await fetch(`${BASE_URL}/api/enquiries/export?token=${ADMIN_TOKEN}`);
  assert.strictEqual(csvRes.status, 200);
  assert(csvRes.headers.get('content-type').includes('text/csv'));
  const csvText = await csvRes.text();
  assert(csvText.includes('Enquiry ID,Date Created,Customer Name'), 'CSV should contain headers');
  assert(csvText.includes('Anand Varma'), 'CSV should contain the created enquiry');
  console.log('✓ CSV export generated and verified with proper headers and data\n');

  // Test 7: Pre-Launch Verification Audit
  console.log('Test 7: Testing Automated Pre-Launch Audit API...');
  const auditRes = await fetch(`${BASE_URL}/api/audit`);
  assert.strictEqual(auditRes.status, 200);
  const audit = await auditRes.json();
  assert.strictEqual(audit.status, 'ready');
  assert.strictEqual(audit.auditResults.faviconActive, true);
  assert.strictEqual(audit.auditResults.contactInfoVerified.verified, true);
  assert.strictEqual(audit.auditResults.noFabricatedContent, true);
  assert.strictEqual(audit.auditResults.pricingIntegrity.startingPriceVerified, '₹199/- (Single fixture deep clean)');
  console.log('✓ Automated Pre-Launch Audit Gate passed: all 17 requirements verified!\n');

  console.log('====================================================');
  console.log('ALL VERIFICATION TESTS PASSED SUCCESSFULLY! (7/7)');
  console.log('====================================================');
}

runTests().catch(err => {
  console.error('VERIFICATION FAILED:', err);
  process.exit(1);
});
