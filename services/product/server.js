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
  res.status(200).json({ status: 'ok', service: 'product' });
});

// Temporary product data
let products = [
  { id: 1, name: 'Sample Product', price: 99.99 }
];

app.get('/products', (req, res) => {
  res.json(products);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  logger.info({ message: `Product service running on port ${PORT}` });
});
