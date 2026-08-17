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

module.exports = router;