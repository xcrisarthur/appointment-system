const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

// POST /api/auth/login
router.post('/login', login);

const auth = require('../middleware/authMiddleware');
router.get('/me', auth, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
