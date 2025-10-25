import request from 'supertest';
import { app } from '../../index.js';
import { getDatabase } from '../../lib/db.js';

describe('Medical Records API Endpoints', () => {
  let authToken;
  let userId;

  beforeEach(async () => {
    // Clear database
    const db = await getDatabase();
    db.data.users = [];
    db.data.records = [];
    await db.write();

    // Create test user
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

  describe('GET /api/records', () => {
    beforeEach(async () => {
      // Create test medical records
      const db = await getDatabase();
      db.data.records.push(
        {
          id: 'record1',
          userId,
          type: 'diagnosis',
          data: { condition: 'Hypertension', severity: 'moderate' },
          createdAt: new Date().toISOString()
        },
        {
          id: 'record2',
          userId,
          type: 'prescription',
          data: { medication: 'Lisinopril', dosage: '10mg' },
          createdAt: new Date().toISOString()
        }
      );
      await db.write();
    });

    test('should retrieve user medical records', async () => {
      const response = await request(app)
        .get('/api/records')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('items');
      expect(response.body.items).toHaveLength(2);
    });

    test('should require authentication', async () => {
      const response = await request(app)
        .get('/api/records');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/records', () => {
    test('should create new medical record', async () => {
      const recordData = {
        type: 'diagnosis',
        data: {
          condition: 'Diabetes',
          severity: 'mild',
          symptoms: ['frequent urination', 'increased thirst']
        }
      };

      const response = await request(app)
        .post('/api/records')
        .set('Authorization', `Bearer ${authToken}`)
        .send(recordData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('record');
      expect(response.body.record.type).toBe('diagnosis');
    });

    test('should validate required fields', async () => {
      const incompleteData = {
        // Missing type and data
      };

      const response = await request(app)
        .post('/api/records')
        .set('Authorization', `Bearer ${authToken}`)
        .send(incompleteData);

      expect(response.status).toBe(400);
    });
  });
});
