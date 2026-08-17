// api/demoCarAppointment.js

const express = require("express");
const router = express.Router();
const controller = require("../routes/demoCarAppointment");

router.post("/create",     controller.createAppointment);
router.post("/getAll",     controller.getAllAppointments);
router.get("/getOne",     controller.getOneAppointment);
router.put("/update",     controller.updateAppointment);

module.exports = router;