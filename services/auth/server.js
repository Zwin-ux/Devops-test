require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const winston = require('winston');

const app = express();
app.use(express.json());

// Winston logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console()
  ]
});

// Health check endpoint
app.get('/health', (req, res) => {
  logger.info({ message: 'Health check requested', path: '/health', status: 200 });
  res.status(200).json({ status: 'ok' });
});

// JWT Secret (TODO: Move to Kubernetes Secrets)
const JWT_SECRET = process.env.JWT_SECRET || 'development-secret';

// In-memory user store (for demo)
const users = {};

// Register endpoint
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    logger.warn({ message: 'Missing username or password', path: '/register', status: 400 });
    return res.status(400).json({ error: 'Username and password required' });
  }
  if (users[username]) {
    logger.warn({ message: 'User already exists', username, path: '/register', status: 409 });
    return res.status(409).json({ error: 'User already exists' });
  }
  users[username] = { password };
  logger.info({ message: 'User registered', username, path: '/register', status: 201 });
  res.status(201).json({ message: 'User registered' });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users[username];
  if (!user || user.password !== password) {
    logger.warn({ message: 'Invalid credentials', username, path: '/login', status: 401 });
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '15m' });
  logger.info({ message: 'User logged in', username, path: '/login', status: 200 });
  res.json({ token });
});

// Refresh endpoint
app.post('/refresh', (req, res) => {
  const { token } = req.body;
  if (!token) {
    logger.warn({ message: 'No token provided', path: '/refresh', status: 400 });
    return res.status(400).json({ error: 'Token required' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const newToken = jwt.sign({ username: decoded.username }, JWT_SECRET, { expiresIn: '15m' });
    logger.info({ message: 'Token refreshed', username: decoded.username, path: '/refresh', status: 200 });
    res.json({ token: newToken });
  } catch (err) {
    logger.warn({ message: 'Invalid token on refresh', path: '/refresh', status: 401 });
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Export app and resetUsers for testing
function resetUsers() {
  for (const k of Object.keys(users)) delete users[k];
}

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    logger.info({ message: `Auth service running on port ${PORT}` });
  });
} else {
  app.resetUsers = resetUsers;
  module.exports = app;
}

