import { appData } from '../utils/store.js';

export const createOrder = (req, res) => {
  const { items, shippingAddress } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Your cart is empty.' });
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const order = {
    id: `ord-${Date.now()}`,
    userId: req.user.id,
    items,
    total,
    status: 'Confirmed',
    shippingAddress,
    createdAt: new Date().toISOString(),
  };

  appData.orders.push(order);
  res.status(201).json({ message: 'Order created successfully.', order });
};

export const getOrders = (req, res) => {
  const orders = req.user.role === 'admin' ? appData.orders : appData.orders.filter((order) => order.userId === req.user.id);
  res.json({ orders });
};
