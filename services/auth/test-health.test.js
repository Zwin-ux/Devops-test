const request = require('supertest');
const app = require('./server'); // Export app from server.js for testing

describe('Auth Service Endpoints', () => {
  beforeEach(() => {
    // Reset in-memory users if possible
    if (app.resetUsers) app.resetUsers();
  });

  describe('GET /health', () => {
    it('should return 200 OK and status ok', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });

  describe('POST /register', () => {
    it('should register a new user', async () => {
      const res = await request(app).post('/register').send({ username: 'alice', password: 'pw' });
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('User registered');
    });
    it('should not register duplicate user', async () => {
      await request(app).post('/register').send({ username: 'bob', password: 'pw' });
      const res = await request(app).post('/register').send({ username: 'bob', password: 'pw' });
      expect(res.statusCode).toBe(409);
      expect(res.body.error).toBe('User already exists');
    });
    it('should require username and password', async () => {
      const res = await request(app).post('/register').send({ username: '' });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Username and password required');
    });
  });

  describe('POST /login', () => {
    beforeEach(async () => {
      await request(app).post('/register').send({ username: 'charlie', password: 'pw' });
    });
    it('should login with correct credentials', async () => {
      const res = await request(app).post('/login').send({ username: 'charlie', password: 'pw' });
      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();
    });
    it('should not login with wrong password', async () => {
      const res = await request(app).post('/login').send({ username: 'charlie', password: 'wrong' });
      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe('Invalid credentials');
    });
    it('should not login with unknown user', async () => {
      const res = await request(app).post('/login').send({ username: 'nope', password: 'pw' });
      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe('Invalid credentials');
    });
  });

  describe('POST /refresh', () => {
    let token;
    beforeEach(async () => {
      await request(app).post('/register').send({ username: 'dave', password: 'pw' });
      const res = await request(app).post('/login').send({ username: 'dave', password: 'pw' });
      token = res.body.token;
    });
    it('should refresh a valid token', async () => {
      const res = await request(app).post('/refresh').send({ token });
      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.token).not.toBe(token);
    });
    it('should not refresh with missing token', async () => {
      const res = await request(app).post('/refresh').send({ });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Token required');
    });
    it('should not refresh with invalid token', async () => {
      const res = await request(app).post('/refresh').send({ token: 'badtoken' });
      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe('Invalid token');
    });
  });
});
