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
  res.status(200).json({ status: 'ok', service: 'cart' });
});

// Temporary cart data
let carts = {};

// Get cart for a user
app.get('/cart', (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    logger.warn({ message: 'Missing userId for cart retrieval', path: '/cart', status: 400 });
    return res.status(400).json({ error: 'userId is required' });
  }
  const cart = carts[userId] || [];
  logger.info({ message: 'Get cart requested', userId, path: '/cart', status: 200 });
  res.json(cart);
});

// Add item to cart
app.post('/cart/add', express.json(), (req, res) => {
  const { userId, productId, quantity } = req.body;
  if (!userId || !productId || typeof quantity !== 'number') {
    logger.warn({ message: 'Invalid cart add data', path: '/cart/add', status: 400 });
    return res.status(400).json({ error: 'userId, productId, and quantity are required' });
  }
  if (!carts[userId]) carts[userId] = [];
  const existing = carts[userId].find(item => item.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    carts[userId].push({ productId, quantity });
  }
  logger.info({ message: 'Item added to cart', userId, productId, quantity, path: '/cart/add', status: 200 });
  res.json(carts[userId]);
});

// Update item quantity
app.put('/cart/update', express.json(), (req, res) => {
  const { userId, productId, quantity } = req.body;
  if (!userId || !productId || typeof quantity !== 'number') {
    logger.warn({ message: 'Invalid cart update data', path: '/cart/update', status: 400 });
    return res.status(400).json({ error: 'userId, productId, and quantity are required' });
  }
  const cart = carts[userId];
  if (!cart) {
    logger.warn({ message: 'Cart not found for update', userId, path: '/cart/update', status: 404 });
    return res.status(404).json({ error: 'Cart not found' });
  }
  const item = cart.find(i => i.productId === productId);
  if (!item) {
    logger.warn({ message: 'Product not found in cart for update', userId, productId, path: '/cart/update', status: 404 });
    return res.status(404).json({ error: 'Product not found in cart' });
  }
  item.quantity = quantity;
  logger.info({ message: 'Cart item updated', userId, productId, quantity, path: '/cart/update', status: 200 });
  res.json(cart);
});

// Remove item from cart
app.delete('/cart/remove', express.json(), (req, res) => {
  const { userId, productId } = req.body;
  if (!userId || !productId) {
    logger.warn({ message: 'Invalid cart remove data', path: '/cart/remove', status: 400 });
    return res.status(400).json({ error: 'userId and productId are required' });
  }
  const cart = carts[userId];
  if (!cart) {
    logger.warn({ message: 'Cart not found for remove', userId, path: '/cart/remove', status: 404 });
    return res.status(404).json({ error: 'Cart not found' });
  }
  const index = cart.findIndex(i => i.productId === productId);
  if (index === -1) {
    logger.warn({ message: 'Product not found in cart for remove', userId, productId, path: '/cart/remove', status: 404 });
    return res.status(404).json({ error: 'Product not found in cart' });
  }
  cart.splice(index, 1);
  logger.info({ message: 'Cart item removed', userId, productId, path: '/cart/remove', status: 200 });
  res.json(cart);
});

// Clear cart for user
app.delete('/cart/clear', express.json(), (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    logger.warn({ message: 'Missing userId for cart clear', path: '/cart/clear', status: 400 });
    return res.status(400).json({ error: 'userId is required' });
  }
  carts[userId] = [];
  logger.info({ message: 'Cart cleared', userId, path: '/cart/clear', status: 200 });
  res.json([]);
});

// Export app and resetCarts for testing
function resetCarts() {
  carts = {};
}

if (require.main === module) {
  const PORT = process.env.PORT || 3002;
  app.listen(PORT, () => {
    logger.info({ message: `Cart service running on port ${PORT}` });
  });
} else {
  app.resetCarts = resetCarts;
  module.exports = app;
}
