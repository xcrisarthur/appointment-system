const express = require("express");
const router = express.Router();
const appointmentParticipantController = require("../controllers/appointmentParticipantController");

// CREATE participant
router.post("/", appointmentParticipantController.addParticipant);

// READ all participants of specific appointment
router.get("/:id", appointmentParticipantController.getParticipants);

// DELETE participant
router.delete("/:id/:userId", appointmentParticipantController.removeParticipant);

module.exports = router;