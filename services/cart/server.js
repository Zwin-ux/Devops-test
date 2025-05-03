const express = require('express');
const winston = require('winston');
const app = express();

// Winston logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console()
  ]
});

// Health check
app.get('/health', (req, res) => {
  logger.info({ message: 'Health check requested', path: '/health', status: 200 });
  res.status(200).json({ status: 'ok', service: 'cart' });
});

// Temporary cart data
let carts = [];

app.get('/cart', (req, res) => {
  res.json(carts);
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  logger.info({ message: `Cart service running on port ${PORT}` });
});
