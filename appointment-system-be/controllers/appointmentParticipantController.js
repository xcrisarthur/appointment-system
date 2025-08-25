const { Appointment, AppointmentParticipants, User } = require('../models');

// Tambah peserta ke appointment
exports.addParticipant = async (req, res) => {
  try {
    const { appointmentId, userId } = req.body;

    // validasi
    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // insert
    const participant = await AppointmentParticipants.create({ appointment_id: appointmentId, user_id: userId });

    res.status(201).json({ message: 'Participant added', participant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Ambil semua peserta appointment
exports.getParticipants = async (req, res) => {
  try {
    const { id } = req.params; // appointment id

    const appointment = await Appointment.findByPk(id, {
      include: [
        {
          model: User,
          as: 'participants',
          attributes: ['id', 'name', 'username', 'preferred_timezone'],
          through: { attributes: [] } // hide pivot fields
        }
      ]
    });

    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    res.json({ participants: appointment.participants });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Hapus peserta
exports.removeParticipant = async (req, res) => {
  try {
    const { id, userId } = req.params;

    const deleted = await AppointmentParticipants.destroy({
      where: { appointment_id: id, user_id: userId }
    });

    if (!deleted) return res.status(404).json({ message: 'Participant not found' });

    res.json({ message: 'Participant removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
