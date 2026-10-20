import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

process.env.ADMIN_GATE_PIN ||= 'test-admin-gate-pin';
const { default: app } = await import('../src/app.js');

const adminCredentials = {
  email: 'admin@partypops.com',
  password: 'Admin@123',
};

const getAdminGateToken = async () => {
  const response = await request(app)
    .post('/api/auth/admin-gate')
    .send({ pin: process.env.ADMIN_GATE_PIN })
    .expect(200);
  return response.body.gateToken;
};

const loginAdmin = async () => {
  const gateToken = await getAdminGateToken();
  return request(app)
    .post('/api/auth/login')
    .set('X-Admin-Gate-Token', gateToken)
    .send({ ...adminCredentials, portal: 'admin' })
    .expect(200);
};

test('demo product catalog includes expanded products across store categories', async () => {
  const response = await request(app)
    .get('/api/products')
    .expect(200);

  assert.ok(response.body.total >= 24, 'demo catalog should provide at least 24 products');
  for (const category of ['Balloons', 'Decorations', 'Cake Toppers', 'Tableware', 'Return Gifts', 'Accessories']) {
    assert.ok(
      response.body.items.filter((product) => product.category === category).length >= 4,
      `${category} should have at least four products`,
    );
  }
  for (const amount of [9, 19, 29, 49, 59, 99, 149]) {
    assert.equal(
      response.body.items.filter((product) => product.budgetAmount === amount).length,
      10,
      `Under ₹${amount} should have ten products`,
    );
  }
});

test('admin can create a product through protected admin API', async () => {
  const loginResponse = await loginAdmin();

  assert.ok(loginResponse.body.token, 'should return a JWT token');

  const createResponse = await request(app)
    .post('/api/admin/products')
    .set('Authorization', `Bearer ${loginResponse.body.token}`)
    .send({
      name: 'Birthday Balloon Pack',
      sku: 'BP-1001',
      category: 'Balloons',
      price: 599,
      stock: 12,
      description: 'Premium party balloon kit',
      image: 'data:image/png;base64,aGVsbG8=',
    })
    .expect(201);

  assert.equal(createResponse.body.product.name, 'Birthday Balloon Pack');
  assert.equal(createResponse.body.product.image, 'data:image/png;base64,aGVsbG8=');

  const productId = createResponse.body.product.id;
  const updateResponse = await request(app)
    .put(`/api/admin/products/${productId}`)
    .set('Authorization', `Bearer ${loginResponse.body.token}`)
    .send({ price: 699, wholesalePrice: 499, stock: 20 })
    .expect(200);
  assert.equal(updateResponse.body.product.price, 699);
  assert.equal(updateResponse.body.product.stock, 20);

  await request(app)
    .delete(`/api/admin/products/${productId}`)
    .set('Authorization', `Bearer ${loginResponse.body.token}`)
    .expect(200);
});

test('guest cannot access admin listing without auth', async () => {
  await request(app)
    .get('/api/admin/products')
    .expect(401);
});

test('public registration cannot create an admin account', async () => {
  const response = await request(app)
    .post('/api/auth/register')
    .send({
      role: 'admin',
      fullName: 'Untrusted Admin Request',
      email: `untrusted-${Date.now()}@example.com`,
      password: 'Example@123',
    })
    .expect(201);

  assert.equal(response.body.user.role, 'retailer');
});

test('admin login is separate from customer login and rejects non-admin accounts', async () => {
  await request(app)
    .post('/api/auth/login')
    .send({ ...adminCredentials, portal: 'admin' })
    .expect(403);

  const gateToken = await getAdminGateToken();
  const email = `customer-${Date.now()}@example.com`;
  await request(app)
    .post('/api/auth/register')
    .send({
      fullName: 'Customer Login Test',
      email,
      password: 'Customer@123',
    })
    .expect(201);

  await request(app)
    .post('/api/auth/login')
    .set('X-Admin-Gate-Token', gateToken)
    .send({ email, password: 'Customer@123', portal: 'admin' })
    .expect(403);
});

test('admin gate rejects incorrect pins and issues a short-lived token for the correct pin', async () => {
  await request(app)
    .post('/api/auth/admin-gate')
    .send({ pin: 'wrong-pin' })
    .expect(401);

  const gateToken = await getAdminGateToken();
  await request(app)
    .post('/api/auth/login')
    .set('X-Admin-Gate-Token', gateToken)
    .send({ ...adminCredentials, portal: 'admin' })
    .expect(200);
});

test('admin dashboard reports live counts and supports wholesale approval', async () => {
  const loginResponse = await loginAdmin();
  const adminToken = loginResponse.body.token;

  const statsResponse = await request(app)
    .get('/api/admin/dashboard')
    .set('Authorization', `Bearer ${adminToken}`)
    .expect(200);
  assert.equal(typeof statsResponse.body.stats.products, 'number');
  assert.equal(typeof statsResponse.body.stats.users, 'number');
  assert.equal(typeof statsResponse.body.stats.orders, 'number');
  assert.equal(typeof statsResponse.body.stats.revenue, 'number');

  const usersResponse = await request(app)
    .get('/api/admin/users')
    .set('Authorization', `Bearer ${adminToken}`)
    .expect(200);
  const pendingWholesaler = usersResponse.body.users.find(
    (user) => user.role === 'wholesaler' && user.status === 'pending',
  );
  assert.ok(pendingWholesaler, 'demo data should include a pending wholesaler');
  assert.equal('password' in pendingWholesaler, false, 'admin user listing must not expose password hashes');

  const wholesaleEmail = `pending-${Date.now()}@example.com`;
  const wholesalePassword = 'Wholesale@123';
  const registrationResponse = await request(app)
    .post('/api/auth/register')
    .send({
      role: 'wholesaler',
      fullName: 'Pending Wholesale Test',
      companyName: 'Pending Test Company',
      email: wholesaleEmail,
      password: wholesalePassword,
    })
    .expect(201);
  await request(app)
    .get('/api/orders')
    .set('Authorization', `Bearer ${registrationResponse.body.token}`)
    .expect(403);
  await request(app)
    .post('/api/auth/login')
    .send({ email: wholesaleEmail, password: wholesalePassword })
    .expect(403);

  const pendingUserResponse = await request(app)
    .get('/api/admin/users')
    .set('Authorization', `Bearer ${adminToken}`)
    .expect(200);
  const registeredWholesaler = pendingUserResponse.body.users.find((user) => user.email === wholesaleEmail);

  const approvalResponse = await request(app)
    .patch(`/api/admin/users/${registeredWholesaler.id}/status`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ status: 'approved' })
    .expect(200);
  assert.equal(approvalResponse.body.user.status, 'approved');
  assert.equal('password' in approvalResponse.body.user, false);

  await request(app)
    .post('/api/auth/login')
    .send({ email: wholesaleEmail, password: wholesalePassword })
    .expect(200);
});

test('registration name and address are preserved through login', async () => {
  const email = `registered-${Date.now()}@example.com`;
  const profile = {
    role: 'retailer',
    fullName: 'Registered Test User',
    businessName: 'Test Retail Shop',
    businessAddress: 'Akabarpur, Ghaziabad',
    email,
    password: 'Example@123',
  };

  const registration = await request(app)
    .post('/api/auth/register')
    .send(profile)
    .expect(201);

  assert.equal(registration.body.user.fullName, profile.fullName);
  assert.equal(registration.body.user.businessAddress, profile.businessAddress);

  const login = await request(app)
    .post('/api/auth/login')
    .send({ email, password: profile.password })
    .expect(200);

  assert.equal(login.body.user.fullName, profile.fullName);
});
