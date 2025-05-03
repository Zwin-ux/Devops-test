const request = require('supertest');
const express = require('express');
const winston = require('winston');

const app = express();
app.get('/health', (req, res) => res.status(200).json({ status: 'ok', service: 'product' }));

describe('GET /health', () => {
  it('should return 200 OK and status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('product');
  });
});
