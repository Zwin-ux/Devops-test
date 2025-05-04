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
  res.status(200).json({ status: 'ok', service: 'order' });
});

// Temporary order data
let orders = [];
let nextId = 1;

// Get all orders
app.get('/orders', (req, res) => {
  logger.info({ message: 'Get orders requested', path: '/orders', status: 200 });
  res.json(orders);
});

// Get order by id
app.get('/orders/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const order = orders.find(o => o.id === id);
  if (!order) {
    logger.warn({ message: 'Order not found', id, path: '/orders/:id', status: 404 });
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

// Create order
app.post('/orders', express.json(), (req, res) => {
  const { userId, items, status } = req.body;
  if (!userId || !Array.isArray(items)) {
    logger.warn({ message: 'Invalid order data', path: '/orders', status: 400 });
    return res.status(400).json({ error: 'userId and items are required' });
  }
  const order = { id: nextId++, userId, items, status: status || 'pending', createdAt: new Date().toISOString() };
  orders.push(order);
  logger.info({ message: 'Order created', order, path: '/orders', status: 201 });
  res.status(201).json(order);
});

// Update order
app.put('/orders/:id', express.json(), (req, res) => {
  const id = parseInt(req.params.id);
  const { status, items } = req.body;
  const order = orders.find(o => o.id === id);
  if (!order) {
    logger.warn({ message: 'Order not found for update', id, path: '/orders/:id', status: 404 });
    return res.status(404).json({ error: 'Order not found' });
  }
  if (status) order.status = status;
  if (Array.isArray(items)) order.items = items;
  logger.info({ message: 'Order updated', order, path: '/orders/:id', status: 200 });
  res.json(order);
});

// Delete order
app.delete('/orders/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = orders.findIndex(o => o.id === id);
  if (index === -1) {
    logger.warn({ message: 'Order not found for deletion', id, path: '/orders/:id', status: 404 });
    return res.status(404).json({ error: 'Order not found' });
  }
  const deleted = orders.splice(index, 1)[0];
  logger.info({ message: 'Order deleted', deleted, path: '/orders/:id', status: 200 });
  res.json(deleted);
});

// Export app and resetOrders for testing
function resetOrders() {
  orders = [];
  nextId = 1;
}

if (require.main === module) {
  const PORT = process.env.PORT || 3003;
  app.listen(PORT, () => {
    logger.info({ message: `Order service running on port ${PORT}` });
  });
} else {
  app.resetOrders = resetOrders;
  module.exports = app;
}
