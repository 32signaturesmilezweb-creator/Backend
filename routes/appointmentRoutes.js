const express = require("express");
const router = express.Router();

const {
  createAppointment,
  getAppointments,
  updateAppointmentStatus
} = require("../controllers/appointmentController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", createAppointment);
router.get("/", protect, getAppointments);
router.put("/:id/status", protect, updateAppointmentStatus);

module.exports = router;