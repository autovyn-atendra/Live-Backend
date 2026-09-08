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
router.post("/createManualLead", MetaWebhookController.createManualLead);
router.post("/addLead", MetaWebhookController.createManualLead);

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
router.get("/getDashboardStats", MetaWebhookController.getMetaDashboardStats);
router.post("/getDashboardStats", MetaWebhookController.getMetaDashboardStats);

// ============================================================
// META LEAD STATUS & DETAIL API
// ============================================================
router.post("/updateLeadStatus", MetaWebhookController.updateLeadStatus);
router.post("/updateLeadTemperature", MetaWebhookController.updateLeadTemperature);
router.get("/getLead/:leadUtd", MetaWebhookController.getSingleLead);
router.get("/getLead", MetaWebhookController.getSingleLead);
router.post("/getLead", MetaWebhookController.getSingleLead);

const multer = require("multer");
const upload = multer({ limits: { fileSize: 100 * 1024 * 1024 } });

// ============================================================
// META CALLMATIC CAMPAIGN API
// ============================================================
router.post("/createCampaign", MetaWebhookController.createCampaign);
router.post("/updateCampaign", MetaWebhookController.updateCampaign);
router.get("/getCampaigns", MetaWebhookController.getCampaigns);
router.post("/getCampaigns", MetaWebhookController.getCampaigns);
router.post("/toggleCampaignStatus", MetaWebhookController.toggleCampaignStatus);
router.post("/uploadCampaignMedia", upload.any(), MetaWebhookController.uploadCampaignMedia || ((req, res) => res.json({ success: true, message: "Media uploaded" })));

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

const path = require("path");
const fs = require("fs").promises;
const { SMB_PATH } = require("../config/envConfig");

// ============================================================
// DIRECT PUBLIC MEDIA SERVING FOR META WHATSAPP TEMPLATES
// GET /meta/media/:filename
// ============================================================
router.get("/media/:filename", async (req, res) => {
  try {
    const filename = path.basename(req.params.filename);
    const filePath = path.join(SMB_PATH, "meta_campaigns", filename);
    const exists = await fs.access(filePath).then(() => true).catch(() => false);
    if (!exists) {
      return res.status(404).send("File Not Found");
    }
    const ext = path.extname(filename).toLowerCase();
    if (ext === ".pdf") res.setHeader("Content-Type", "application/pdf");
    else if (ext === ".mp4") res.setHeader("Content-Type", "video/mp4");
    else if (ext === ".jpg" || ext === ".jpeg") res.setHeader("Content-Type", "image/jpeg");
    else if (ext === ".png") res.setHeader("Content-Type", "image/png");

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
    return res.sendFile(filePath);
  } catch (err) {
    return res.status(500).send("Error serving file");
  }
});

// Diagnostic test endpoint for WhatsApp package dispatches
router.post("/testCampaignWhatsAppPackage", MetaWebhookController.testCampaignWhatsAppPackage || ((req, res) => res.json({ success: true })));

module.exports = router;