const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// PLACE ORDER
// PLACE ORDER
router.post('/', verifyToken, async (req, res) => {
  const { address_id, coupon_code } = req.body;
  try {
    // get address
    const [addresses] = await db.query(
      'SELECT * FROM addresses WHERE id = ? AND user_id = ?',
      [address_id, req.user.id]
    );
    if (addresses.length === 0) {
      return res.status(400).json({ message: 'Please select a delivery address' });
    }
    const address = addresses[0];

    // get cart
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

    // calculate subtotal
    const subtotal = cartItems.reduce((sum, item) => sum + (item.quantity * parseFloat(item.price)), 0);

    // validate coupon if provided
    let discount = 0;
    let appliedCoupon = null;

    if (coupon_code) {
      const [coupons] = await db.query(
        'SELECT * FROM coupons WHERE code = ? AND is_active = true',
        [coupon_code.toUpperCase()]
      );
      if (coupons.length > 0) {
        const coupon = coupons[0];
        if (
          (!coupon.expires_at || new Date(coupon.expires_at) >= new Date()) &&
          coupon.used_count < coupon.max_uses &&
          subtotal >= coupon.min_order
        ) {
          if (coupon.type === 'percent') {
            discount = (subtotal * coupon.value) / 100;
          } else {
            discount = coupon.value;
          }
          discount = Math.min(discount, subtotal);
          appliedCoupon = coupon;
        }
      }
    }

    const total = subtotal - discount;

    // create order
    const [order] = await db.query(
      `INSERT INTO orders 
        (user_id, total_amount, delivery_name, delivery_phone, delivery_address, 
        delivery_city, delivery_state, delivery_pincode, coupon_code, discount_amount) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id, total,
        address.name, address.phone, address.address_line,
        address.city, address.state, address.pincode,
        appliedCoupon ? appliedCoupon.code : null,
        discount
      ]
    );

    // create order items and reduce stock
    for (const item of cartItems) {
      await db.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)',
        [order.insertId, item.product_id, item.quantity, item.price]
      );
      await db.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    // increment coupon usage
    if (appliedCoupon) {
      await db.query(
        'UPDATE coupons SET used_count = used_count + 1 WHERE id = ?',
        [appliedCoupon.id]
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
      o.delivery_name, o.delivery_phone, o.delivery_address,
      o.delivery_city, o.delivery_state, o.delivery_pincode,
      o.coupon_code, o.discount_amount,
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