const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get user settings
router.get('/', verifyToken, async (req, res) => {
  try {
    const [settings] = await pool.execute(
      'SELECT * FROM user_settings WHERE user_id = ?',
      [req.userId]
    );
    res.json(settings[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching settings' });
  }
});

// Update user settings
router.put('/', verifyToken, async (req, res) => {
  try {
    const { auto_save, dark_mode, show_marks, default_paper_type } = req.body;
    await pool.execute(
      `UPDATE user_settings 
       SET auto_save = ?, dark_mode = ?, show_marks = ?, default_paper_type = ?
       WHERE user_id = ?`,
      [auto_save, dark_mode, show_marks, default_paper_type, req.userId]
    );
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating settings' });
  }
});

module.exports = router; 