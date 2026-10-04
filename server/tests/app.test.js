import request from 'supertest';
import app from '../src/app.js';

describe('API Integration Tests', () => {
  describe('GET /api/health', () => {
    it('should return 200 with status ok and service name', async () => {
      const res = await request(app).get('/api/health');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: 'ok',
        service: 'shopsphere-api',
      });
    });
  });

  describe('404 Route Handler', () => {
    it('should return 404 and error message for non-existent routes', async () => {
      const res = await request(app).get('/api/does-not-exist');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Route not found: /api/does-not-exist');
    });
  });

  describe('POST /api/auth/register validation', () => {
    it('should return 400 when required fields are missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'Name, email and password are required');
    });
  });
});
