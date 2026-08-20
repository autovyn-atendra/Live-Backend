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

// ============================================================
// META CRM ACTIVITIES API
// ============================================================
router.post("/addActivity", MetaWebhookController.addActivity);
router.get("/getActivities/:leadUtd", MetaWebhookController.getActivities);
router.get("/getActivities", MetaWebhookController.getActivities);
router.post("/getActivities", MetaWebhookController.getActivities);

// ============================================================
// META CRM FOLLOW-UPS API
// ============================================================
router.post("/createFollowup", MetaWebhookController.createFollowup);
router.get("/getFollowups", MetaWebhookController.getFollowups);
router.post("/getFollowups", MetaWebhookController.getFollowups);
router.post("/completeFollowup", MetaWebhookController.completeFollowup);
router.post("/rescheduleFollowup", MetaWebhookController.rescheduleFollowup);

// ============================================================
// META LEAD STATUS & DETAIL API
// ============================================================
router.post("/updateLeadStatus", MetaWebhookController.updateLeadStatus);
router.get("/getLead/:leadUtd", MetaWebhookController.getSingleLead);
router.get("/getLead", MetaWebhookController.getSingleLead);
router.post("/getLead", MetaWebhookController.getSingleLead);

// ============================================================
// META CALLMATIC CAMPAIGN API
// ============================================================
router.post("/createCampaign", MetaWebhookController.createCampaign);
router.post("/updateCampaign", MetaWebhookController.updateCampaign);
router.get("/getCampaigns", MetaWebhookController.getCampaigns);
router.post("/getCampaigns", MetaWebhookController.getCampaigns);
router.post("/toggleCampaignStatus", MetaWebhookController.toggleCampaignStatus);

// ============================================================
// META CALLMATIC AI CALL & LOGS API
// ============================================================
router.post("/makeMetaCall", MetaWebhookController.makeMetaCall);
router.post("/triggerMetaCall", MetaWebhookController.triggerMetaCall || MetaWebhookController.makeMetaCall);
router.post("/triggerLeadCall", MetaWebhookController.triggerLeadCall || MetaWebhookController.makeMetaCall);
router.get("/getMetaCallLogs", MetaWebhookController.getMetaCallLogs);
router.post("/getMetaCallLogs", MetaWebhookController.getMetaCallLogs);
router.get("/getMetaCallHistory/:leadUtd", MetaWebhookController.getMetaCallHistory);
router.get("/getMetaCallHistory", MetaWebhookController.getMetaCallHistory);
router.post("/getMetaCallHistory", MetaWebhookController.getMetaCallHistory);
router.get("/getMetaCallRecording/:callId", MetaWebhookController.getMetaCallRecording);

module.exports = router;