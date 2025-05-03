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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info({ message: `Auth service running on port ${PORT}` });
});
