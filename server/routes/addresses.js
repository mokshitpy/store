const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const { verifyToken } = require('../middleware/auth');

// GET all addresses of logged in user
router.get('/', verifyToken, async (req, res) => {
  try {
    const [addresses] = await db.query(
      'SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC',
      [req.user.id]
    );
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ADD new address
router.post('/', verifyToken, async (req, res) => {
  const { name, phone, address_line, city, state, pincode, is_default } = req.body;
  try {
    // if this is default, remove default from others first
    if (is_default) {
      await db.query(
        'UPDATE addresses SET is_default = false WHERE user_id = ?',
        [req.user.id]
      );
    }
    const [result] = await db.query(
      'INSERT INTO addresses (user_id, name, phone, address_line, city, state, pincode, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, name, phone, address_line, city, state, pincode, is_default || false]
    );
    res.status(201).json({ message: 'Address added', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// SET address as default
router.put('/:id/default', verifyToken, async (req, res) => {
  try {
    await db.query(
      'UPDATE addresses SET is_default = false WHERE user_id = ?',
      [req.user.id]
    );
    await db.query(
      'UPDATE addresses SET is_default = true WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    res.json({ message: 'Default address updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE address
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await db.query(
      'DELETE FROM addresses WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    res.json({ message: 'Address deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;