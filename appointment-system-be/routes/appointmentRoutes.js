const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const authMiddleware = require("../middleware/authMiddleware");

// GET /api/appointments/me
router.get("/me", authMiddleware, appointmentController.getMyAppointments);

// CREATE appointment (butuh login)
router.post("/", authMiddleware, appointmentController.createAppointment);

// READ all appointments (optional: bisa tanpa login)
router.get("/", authMiddleware, appointmentController.getAppointments);

// READ one appointment
router.get("/:id", authMiddleware, appointmentController.getAppointmentById);

// UPDATE appointment
router.put("/:id", authMiddleware, appointmentController.updateAppointment);

// DELETE appointment
router.delete("/:id", authMiddleware, appointmentController.deleteAppointment);



module.exports = router;
