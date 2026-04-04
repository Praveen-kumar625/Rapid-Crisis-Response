const request = require('supertest');
const app = require('../app');
const db = require('../db');

describe('Health Check', () => {
    afterAll(async () => {
        await db.destroy(); // Close DB connection pool
    });

    it('should return 200 OK', async() => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status', 'OK');
    });
});
