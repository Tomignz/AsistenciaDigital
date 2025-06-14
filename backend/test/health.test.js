const request = require('supertest');
const express = require('express');
const app = express();
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

describe('Health check', () => {
  it('returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
