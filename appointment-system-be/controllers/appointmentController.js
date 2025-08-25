const { Appointment, User, AppointmentParticipants } = require('../models');
const { validateWorkingHours } = require("../utils/timezoneUtils");
const moment = require("moment-timezone");

// GET all appointments
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      include: [{ model: User, as: 'creator' }]
    });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET appointment by ID (include participants)
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        { model: User, as: 'creator' },
        { model: User, as: 'participants' }
      ]
    });
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE appointment
exports.createAppointment = async (req, res) => {
  try {
    const { title, start, end, participants } = req.body;

    // Ambil user id dari JWT
    const creatorId = req.user.sub; // hasil decode JWT

    // Buat appointment dengan creator_id
    const appointment = await Appointment.create({
      title,
      start,
      end,
      creator_id: creatorId, // <<-- wajib diisi
    });

    // Kalau ada participants, tambahkan ke relasi
    if (participants && participants.length > 0) {
      const users = await User.findAll({
        where: { id: participants },
      });
      await appointment.setParticipants(users);
    }

    res.status(201).json(appointment);
  } catch (err) {
    console.error("Create Appointment Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE appointment
exports.updateAppointment = async (req, res) => {
  try {
    const [updated] = await Appointment.update(req.body, {
      where: { id: req.params.id }
    });
    if (!updated) return res.status(404).json({ message: "Appointment not found" });
    res.json({ message: "Appointment updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const deleted = await Appointment.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: "Appointment not found" });
    res.json({ message: "Appointment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyAppointments = async (req, res) => {
  try {
    const userId = req.user.sub; // dari JWT
    // console.log(req.user)
    // Ambil appointments yg dibuat user atau dia jadi participant
    const appointments = await Appointment.findAll({
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "username", "name", "preferred_timezone"]
        },
        {
          model: User,
          as: "participants",
          attributes: ["id", "username", "name", "preferred_timezone"],
          through: { attributes: [] } // hilangkan kolom join
        }
      ],
      where: {
        // Sequelize OR condition
        [require("sequelize").Op.or]: [
          { creator_id: userId },
          { "$participants.id$": userId }
        ]
      },
      distinct: true // supaya ga duplikat kalau user creator sekaligus participant
    });

    res.json(appointments);
  } catch (err) {
    console.error("Error in getMyAppointments:", err);
    res.status(500).json({ message: "Failed to get appointments" });
  }
};