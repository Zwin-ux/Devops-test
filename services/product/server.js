const express = require('express');
const winston = require('winston');
const promClient = require('prom-client');
const cors = require('cors');
const app = express();

// Enable CORS for all routes
app.use(cors());

// Winston logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console()
  ]
});

// Prometheus metrics
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics();
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
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
let nextId = 2;

// Get all products
app.get('/products', (req, res) => {
  logger.info({ message: 'Get products requested', path: '/products', status: 200 });
  res.json(products);
});

// Get product by id
app.get('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  if (!product) {
    logger.warn({ message: 'Product not found', id, path: '/products/:id', status: 404 });
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// Create product
app.post('/products', express.json(), (req, res) => {
  const { name, price } = req.body;
  if (!name || typeof price !== 'number') {
    logger.warn({ message: 'Invalid product data', path: '/products', status: 400 });
    return res.status(400).json({ error: 'Name and price are required' });
  }
  const product = { id: nextId++, name, price };
  products.push(product);
  logger.info({ message: 'Product created', product, path: '/products', status: 201 });
  res.status(201).json(product);
});

// Update product
app.put('/products/:id', express.json(), (req, res) => {
  const id = parseInt(req.params.id);
  const { name, price } = req.body;
  const product = products.find(p => p.id === id);
  if (!product) {
    logger.warn({ message: 'Product not found for update', id, path: '/products/:id', status: 404 });
    return res.status(404).json({ error: 'Product not found' });
  }
  if (name) product.name = name;
  if (typeof price === 'number') product.price = price;
  logger.info({ message: 'Product updated', product, path: '/products/:id', status: 200 });
  res.json(product);
});

// Delete product
app.delete('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index === -1) {
    logger.warn({ message: 'Product not found for deletion', id, path: '/products/:id', status: 404 });
    return res.status(404).json({ error: 'Product not found' });
  }
  const deleted = products.splice(index, 1)[0];
  logger.info({ message: 'Product deleted', deleted, path: '/products/:id', status: 200 });
  res.json(deleted);
});

// Export app and resetProducts for testing
function resetProducts() {
  products = [
    { id: 1, name: 'Sample Product', price: 99.99 }
  ];
  nextId = 2;
}

if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    logger.info({ message: `Product service running on port ${PORT}` });
  });
} else {
  app.resetProducts = resetProducts;
  module.exports = app;
}
