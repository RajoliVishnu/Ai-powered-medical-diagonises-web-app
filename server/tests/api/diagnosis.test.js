import request from 'supertest';
import { app } from '../../index.js';
import { getDatabase } from '../../lib/db.js';

describe('Diagnosis API Endpoints', () => {
  let authToken;
  let userId;

  beforeEach(async () => {
    // Clear database
    const db = await getDatabase();
    db.data.users = [];
    db.data.records = [];
    await db.write();

    // Create test user and get token
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    };

    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(userData);

    authToken = registerResponse.body.token;
    userId = registerResponse.body.user.id;
  });

  describe('POST /api/diagnosis/predict', () => {
    test('should predict diagnosis successfully', async () => {
      const diagnosisData = {
        diseaseType: 'cardiovascular',
        formData: {
          age: 45,
          gender: 'male',
          chestPain: 'severe',
          bloodPressure: 'high',
          cholesterol: 'high'
        }
      };

      const response = await request(app)
        .post('/api/diagnosis/predict')
        .set('Authorization', `Bearer ${authToken}`)
        .send(diagnosisData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('prediction');
      expect(response.body).toHaveProperty('recordId');
      expect(response.body.prediction).toHaveProperty('risk');
      expect(response.body.prediction).toHaveProperty('confidence');
    });

    test('should require authentication', async () => {
      const diagnosisData = {
        diseaseType: 'cardiovascular',
        formData: { age: 45 }
      };

      const response = await request(app)
        .post('/api/diagnosis/predict')
        .send(diagnosisData);

      expect(response.status).toBe(401);
    });

    test('should validate required fields', async () => {
      const incompleteData = {
        diseaseType: 'cardiovascular'
        // Missing formData
      };

      const response = await request(app)
        .post('/api/diagnosis/predict')
        .set('Authorization', `Bearer ${authToken}`)
        .send(incompleteData);

      expect(response.status).toBe(400);
    });

    test('should handle different disease types', async () => {
      const diseaseTypes = ['cardiovascular', 'diabetes', 'liver', 'kidney'];
      
      for (const diseaseType of diseaseTypes) {
        const diagnosisData = {
          diseaseType,
          formData: { age: 45, gender: 'male' }
        };

        const response = await request(app)
          .post('/api/diagnosis/predict')
          .set('Authorization', `Bearer ${authToken}`)
          .send(diagnosisData);

        expect(response.status).toBe(200);
        expect(response.body.prediction).toBeDefined();
      }
    });
  });

  describe('GET /api/diagnosis/history', () => {
    beforeEach(async () => {
      // Create some test diagnosis records
      const db = await getDatabase();
      db.data.records.push(
        {
          id: 'record1',
          userId,
          diseaseType: 'cardiovascular',
          formData: { age: 45 },
          prediction: { risk: 'medium', confidence: 75 },
          createdAt: new Date().toISOString()
        },
        {
          id: 'record2',
          userId,
          diseaseType: 'diabetes',
          formData: { age: 50 },
          prediction: { risk: 'low', confidence: 60 },
          createdAt: new Date().toISOString()
        }
      );
      await db.write();
    });

    test('should retrieve user diagnosis history', async () => {
      const response = await request(app)
        .get('/api/diagnosis/history')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('diagnoses');
      expect(response.body.diagnoses).toHaveLength(2);
    });

    test('should require authentication for history', async () => {
      const response = await request(app)
        .get('/api/diagnosis/history');

      expect(response.status).toBe(401);
    });
  });
});
