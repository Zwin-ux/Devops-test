const request = require('supertest');
const express = require('express');
const winston = require('winston');

// Minimal mock of the actual service
const app = express();
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

describe('GET /health', () => {
  it('should return 200 OK and status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
