import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

import app from '../src/app.js';

const adminCredentials = {
  email: 'admin@partypops.com',
  password: 'Admin@123',
};

test('admin can create a product through protected admin API', async () => {
  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send(adminCredentials)
    .expect(200);

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
      image: 'https://example.com/balloons.jpg',
    })
    .expect(201);

  assert.equal(createResponse.body.product.name, 'Birthday Balloon Pack');
});

test('guest cannot access admin listing without auth', async () => {
  await request(app)
    .get('/api/admin/products')
    .expect(401);
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
