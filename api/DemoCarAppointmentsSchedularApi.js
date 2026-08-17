const express = require("express");
const router = express.Router();

const {
  DemoCarAppointmentScheduler,
} = require("../routes/DemoCarAppointmentsSchedular");

router.post(
  "/",
  DemoCarAppointmentScheduler
);

module.exports = router;