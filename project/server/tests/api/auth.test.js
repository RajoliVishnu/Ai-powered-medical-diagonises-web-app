import request from 'supertest';
import { app } from '../../index.js';

describe('Authentication API', () => {
  test('should register new user', async () => {
    const userData = {
      email: `test_${Date.now()}@example.com`,
      password: 'password123',
      name: 'Test User'
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
  }, 10000);

  test('should login user', async () => {
    // First register a user
    const userData = {
      email: `login_test_${Date.now()}@example.com`,
      password: 'password123',
      name: 'Test User'
    };

    await request(app).post('/api/auth/register').send(userData);

    // Then try to login
    const loginData = {
      email: userData.email,
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/auth/login')
      .send(loginData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  }, 10000);
});