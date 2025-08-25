const { User } = require('../models');
const { isWithinWorkingHours } = require('../utils/timezone');

/**
 * Middleware untuk validasi jam kerja (08:00–17:00 semua peserta)
 */
async function checkWorkingHours(req, res, next) {
  try {
    const { start, end, participants } = req.body;

    if (!start || !end || !participants || participants.length === 0) {
      return res.status(400).json({ error: 'start, end, and participants are required' });
    }

    // Ambil user peserta dari DB
    const users = await User.findAll({ where: { id: participants } });

    if (users.length !== participants.length) {
      return res.status(400).json({ error: 'Some participants not found' });
    }

    // Validasi timezone working hours
    const valid = isWithinWorkingHours(start, end, users);

    if (!valid) {
      return res.status(400).json({
        error: 'Appointment must be scheduled within 08:00–17:00 for all participants'
      });
    }

    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Working hours validation failed' });
  }
}

module.exports = checkWorkingHours;
