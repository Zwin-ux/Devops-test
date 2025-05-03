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
  res.status(200).json({ status: 'ok', service: 'order' });
});

// Temporary order data
let orders = [];

app.get('/orders', (req, res) => {
  res.json(orders);
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  logger.info({ message: `Order service running on port ${PORT}` });
});
