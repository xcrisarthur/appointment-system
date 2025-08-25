const jwt = require('jsonwebtoken');
const { User } = require('../models');

const signToken = (user) => {
  const payload = {
    sub: user.id,
    username: user.username,
    name: user.name,
    preferred_timezone: user.preferred_timezone,
  };
  const expiresIn = process.env.JWT_EXPIRES_IN || '1h';
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

exports.login = async (req, res) => {
  try {
    const { username, name, preferred_timezone } = req.body || {};
    if (!username) return res.status(400).json({ error: 'username is required' });

    // cari user
    let user = await User.findOne({ where: { username } });

    // auto-register sederhana jika belum ada
    if (!user) {
      user = await User.create({
        username,
        name: name || username,
        preferred_timezone: preferred_timezone || 'Asia/Jakarta',
      });
    }

    const token = signToken(user);

    // opsional info kedaluwarsa untuk front-end
    const decoded = jwt.decode(token);
    return res.json({
      token,
      token_type: 'Bearer',
      expires_at: decoded?.exp ? new Date(decoded.exp * 1000) : null,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        preferred_timezone: user.preferred_timezone,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Login failed' });
  }
};
