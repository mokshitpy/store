const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// VALIDATE coupon (user applies it in cart)
router.post('/validate', verifyToken, async (req, res) => {
  const { code, cart_total } = req.body;
  try {
    const [coupons] = await db.query(
      'SELECT * FROM coupons WHERE code = ?',
      [code.toUpperCase()]
    );

    if (coupons.length === 0) {
      return res.status(404).json({ message: 'Invalid coupon code' });
    }

    const coupon = coupons[0];

    if (!coupon.is_active) {
      return res.status(400).json({ message: 'This coupon is no longer active' });
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return res.status(400).json({ message: 'This coupon has expired' });
    }

    if (coupon.used_count >= coupon.max_uses) {
      return res.status(400).json({ message: 'This coupon has reached its usage limit' });
    }

    if (cart_total < coupon.min_order) {
      return res.status(400).json({
        message: `Minimum order of ₹${coupon.min_order} required for this coupon`
      });
    }

    // calculate discount
    let discount = 0;
    if (coupon.type === 'percent') {
      discount = (cart_total * coupon.value) / 100;
    } else {
      discount = coupon.value;
    }

    discount = Math.min(discount, cart_total);

    res.json({
      message: 'Coupon applied successfully',
      coupon_code: coupon.code,
      discount_amount: parseFloat(discount.toFixed(2)),
      final_total: parseFloat((cart_total - discount).toFixed(2))
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET all coupons (admin)
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const [coupons] = await db.query(
      'SELECT * FROM coupons ORDER BY created_at DESC'
    );
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// CREATE coupon (admin)
router.post('/', verifyAdmin, async (req, res) => {
  const { code, type, value, min_order, max_uses, expires_at } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO coupons (code, type, value, min_order, max_uses, expires_at) VALUES (?, ?, ?, ?, ?, ?)',
      [code.toUpperCase(), type, value, min_order || 0, max_uses || 100, expires_at || null]
    );
    res.status(201).json({ message: 'Coupon created', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// TOGGLE coupon active/inactive (admin)
router.put('/:id/toggle', verifyAdmin, async (req, res) => {
  try {
    await db.query(
      'UPDATE coupons SET is_active = NOT is_active WHERE id = ?',
      [req.params.id]
    );
    res.json({ message: 'Coupon status toggled' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE coupon (admin)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM coupons WHERE id = ?', [req.params.id]);
    res.json({ message: 'Coupon deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;