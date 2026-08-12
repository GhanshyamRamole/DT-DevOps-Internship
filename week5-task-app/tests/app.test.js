const request = require('supertest');
const createApp = require('../app');

const app = createApp();

describe('Sample App', () => {
    test('GET / returns a welcome message', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/Hello/);
    });

    test('GET /health returns status ok', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('ok');
    });

    test('GET /add correctly adds two numbers', async () => {
        const res = await request(app).get('/add?a=5&b=7');
        expect(res.statusCode).toBe(200);
        expect(res.body.result).toBe(12);
    });

    test('GET /add returns 400 for non-numeric input', async () => {
        const res = await request(app).get('/add?a=foo&b=7');
        expect(res.statusCode).toBe(400);
    });
});
