const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// PLACE ORDER
router.post('/', verifyToken, async (req, res) => {
  try {
    // get user's cart
    const [cartItems] = await db.query(`
      SELECT ci.quantity, p.price, p.id as product_id, p.stock
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?
    `, [req.user.id]);

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // check stock
    for (const item of cartItems) {
      if (item.quantity > item.stock) {
        return res.status(400).json({ message: `Not enough stock for product ${item.product_id}` });
      }
    }

    // calculate total
    const total = cartItems.reduce((sum, item) => sum + (item.quantity * parseFloat(item.price)), 0);

    // create order
    const [order] = await db.query(
      'INSERT INTO orders (user_id, total_amount) VALUES (?, ?)',
      [req.user.id, total]
    );

    // create order items
    for (const item of cartItems) {
      await db.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)',
        [order.insertId, item.product_id, item.quantity, item.price]
      );
      // reduce stock
      await db.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    // clear cart
    await db.query('DELETE FROM cart_items WHERE user_id = ?', [req.user.id]);

    res.status(201).json({ message: 'Order placed successfully', order_id: order.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET USER'S OWN ORDERS
router.get('/my', verifyToken, async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT o.id, o.total_amount, o.status, o.created_at
      FROM orders o
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `, [req.user.id]);

    for (const order of orders) {
      const [items] = await db.query(`
        SELECT oi.quantity, oi.price_at_purchase, p.name
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `, [order.id]);
      order.items = items;
    }

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET ALL ORDERS (admin only)
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT o.id, o.total_amount, o.status, o.created_at,
      u.name as user_name, u.email as user_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);

    for (const order of orders) {
      const [items] = await db.query(`
        SELECT oi.quantity, oi.price_at_purchase, p.name
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `, [order.id]);
      order.items = items;
    }

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// UPDATE ORDER STATUS (admin only)
router.put('/:id/status', verifyAdmin, async (req, res) => {
  const { status } = req.body;
  try {
    await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Order status updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;