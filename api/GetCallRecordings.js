// routes/call.js

const express = require("express");
const { makeServiceReminderCall } = require("../routes/quotation");
const {
  GetCallRecordings,
  callWebhook,
  getVehicleCallHistory,
} = require("../routes/GetCallRecordings");
const {
  runServiceReminderScheduler,
  runAppointmentCallScheduler,
  processDealer,
  processWebhookUpdates,
} = require("../cronJobs/cronJobs");

const router = express.Router();

router.post("/makeServiceReminderCall",      makeServiceReminderCall);
router.post("/callWebhook",  callWebhook);

// ── NEW — Vehicle ki complete call history ─────────────────────
router.post("/call-history", getVehicleCallHistory);

router.get("/test-cron/run-all", async (req, res) => {
  try {
    const summary = await runServiceReminderScheduler(1);
    res.json({ success: true, summary });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/test-cron/dealer/:compcode", async (req, res) => {
  try {
    const result = await processDealer(req.params.compcode);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/test-webhook", async (req, res) => {
  const result = await processWebhookUpdates();
  res.json({ success: true, result });
});

router.get("/test-appt-call", async (req, res) => {
  try {
    const result = await runAppointmentCallScheduler();
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/GetCallRecordings/:callId", GetCallRecordings);

module.exports = router;