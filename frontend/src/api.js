import axios from "axios";

const PRODUCT_API = process.env.REACT_APP_PRODUCT_API || "http://localhost:3001";
const CART_API = process.env.REACT_APP_CART_API || "http://localhost:3002";
const ORDER_API = process.env.REACT_APP_ORDER_API || "http://localhost:3003";
const AUTH_API = process.env.REACT_APP_AUTH_API || "http://localhost:3004";

// Product Service
export const getProducts = async () => {
  const res = await axios.get(`${PRODUCT_API}/products`);
  return res.data;
};

export const getProductById = async (id) => {
  const res = await axios.get(`${PRODUCT_API}/products/${id}`);
  return res.data;
};

// Cart Service
export const getCart = async (userId) => {
  const res = await axios.get(`${CART_API}/cart?userId=${userId}`);
  return res.data;
};

export const addToCart = async (userId, productId, quantity) => {
  const res = await axios.post(`${CART_API}/cart/add`, { userId, productId, quantity });
  return res.data;
};

export const updateCartItem = async (userId, productId, quantity) => {
  const res = await axios.put(`${CART_API}/cart/update`, { userId, productId, quantity });
  return res.data;
};

export const removeFromCart = async (userId, productId) => {
  const res = await axios.delete(`${CART_API}/cart/remove`, { data: { userId, productId } });
  return res.data;
};

export const clearCart = async (userId) => {
  const res = await axios.delete(`${CART_API}/cart/clear`, { data: { userId } });
  return res.data;
};

// Order Service
export const getOrders = async () => {
  const res = await axios.get(`${ORDER_API}/orders`);
  return res.data;
};

export const getOrderById = async (id) => {
  const res = await axios.get(`${ORDER_API}/orders/${id}`);
  return res.data;
};

export const createOrder = async (orderData) => {
  const res = await axios.post(`${ORDER_API}/orders`, orderData);
  return res.data;
};

export const updateOrder = async (id, orderData) => {
  const res = await axios.put(`${ORDER_API}/orders/${id}`, orderData);
  return res.data;
};

export const deleteOrder = async (id) => {
  const res = await axios.delete(`${ORDER_API}/orders/${id}`);
  return res.data;
};
