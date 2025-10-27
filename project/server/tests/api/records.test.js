import request from 'supertest';
import { app } from '../../index.js';

describe('Medical Records API', () => {
  let token;

  beforeAll(async () => {
    // Register a test user and get token
    const userData = {
      email: `records_test_${Date.now()}@example.com`,
      password: 'password123',
      name: 'Records Test User'
    };

    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(userData);

    token = registerResponse.body.token;
  }, 15000);

  test('should get medical records', async () => {
    const response = await request(app)
      .get('/api/records')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('items');
    expect(Array.isArray(response.body.items)).toBe(true);
  }, 10000);

  test('should create medical record', async () => {
    const recordData = {
      title: 'Test Record',
      type: 'consultation',
      description: 'Test description'
    };

    const response = await request(app)
      .post('/api/records')
      .set('Authorization', `Bearer ${token}`)
      .send(recordData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('item');
    expect(response.body.item).toHaveProperty('id');
  }, 10000);
});