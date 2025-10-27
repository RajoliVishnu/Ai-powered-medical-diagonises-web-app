import request from 'supertest';
import { app } from '../../index.js';

describe('Diagnosis API', () => {
  let token;
  let userId;

  beforeAll(async () => {
    // Register a test user and get token
    const userData = {
      email: `diagnosis_test_${Date.now()}@example.com`,
      password: 'password123',
      name: 'Diagnosis Test User'
    };

    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(userData);

    token = registerResponse.body.token;
    userId = registerResponse.body.user.id;
  }, 15000);

  test('should submit diagnosis', async () => {
    const diagnosisData = {
      diseaseType: 'heart',
      formData: {
        age: '45',
        sex: 'Male',
        chestPain: 'Typical Angina'
      }
    };

    const response = await request(app)
      .post('/api/diagnosis/predict')
      .set('Authorization', `Bearer ${token}`)
      .send(diagnosisData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('prediction');
    expect(response.body.prediction).toHaveProperty('risk');
    expect(response.body.prediction).toHaveProperty('confidence');
  }, 15000);

  test('should get diagnosis history', async () => {
    const response = await request(app)
      .get('/api/diagnosis/history')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('diagnoses');
    expect(Array.isArray(response.body.diagnoses)).toBe(true);
  }, 10000);
});