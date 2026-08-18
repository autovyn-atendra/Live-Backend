const express = require("express");
const router = express.Router();

const MetaWebhookController = require(
  "../routes/metaWebhookRoutes"
);

// ============================================================
// META WEBHOOK VERIFY
// GET /webhook
// ============================================================

router.get(
  "/webhook",
  MetaWebhookController.verifyMetaWebhook
);

// ============================================================
// META WEBHOOK RECEIVE
// POST /webhook
// ============================================================

router.post(
  "/webhook",
  MetaWebhookController.receiveMetaWebhook
);

// ============================================================
// GET META LEADS (WITH PAGINATION & FILTERS)
// GET /getMetaLeads, POST /getMetaLeads, GET /leads, POST /leads
// ============================================================

router.get("/getMetaLeads", MetaWebhookController.getMetaLeads);
router.post("/getMetaLeads", MetaWebhookController.getMetaLeads);
router.get("/leads", MetaWebhookController.getMetaLeads);
router.post("/leads", MetaWebhookController.getMetaLeads);

module.exports = router;