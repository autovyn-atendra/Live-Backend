const express = require("express");
const multer = require("multer");
const { makeServiceReminderCall } = require("../routes/quotation");
const {
  GetCallRecordings,
  callWebhook,
  getVehicleCallHistory,
  getAppointmentFormDetails,
  saveCustomerAppointment,
} = require("../routes/GetCallRecordings");
const {
  runServiceReminderScheduler,
  runAppointmentCallScheduler,
  processDealer,
  processWebhookUpdates,
} = require("../cronJobs/cronJobs");


const router = express.Router();
const CRM = require("../routes/serviceReminder");

const excelUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB file limit
    fieldSize: 100 * 1024 * 1024,
  },
}).fields([
  {
    name: "excel",
    maxCount: 1,
  },
]);

// Customer Vehicle
router.post(
  "/customer-vehicle/create",
  CRM.createCustomerVehicle
);

router.post(
  "/customer-vehicle/import",
  excelUpload,
  CRM.importCustomerVehicles
);

router.post(
  "/customer-vehicle/getAll",
  CRM.getAllCustomerVehicles
);

router.post(
  "/customer-vehicle/getOne",
  CRM.getOneCustomerVehicle
);

router.put(
  "/bulkUpdateServiceExecutive",
  CRM.bulkUpdateServiceExecutive
);

// Service Rule
router.post(
  "/service-rule/create",
  CRM.createServiceRule
);

router.post(
  "/service-rule/getAll",
  CRM.getAllServiceRules
);

router.post(
  "/service-rule/getOne",
  CRM.getOneServiceRule
);

router.post(
  "/service-rule/update",
  CRM.updateServiceRule
);

// Reminder
router.post(
  "/reminder/generate",
  CRM.generateReminder
);

router.post(
  "/reminder/getAll",
  CRM.getAllReminders
);

router.post(
  "/reminder/getOne",
  CRM.getOneReminder
);

router.put(
  "/reminder/update",
  CRM.updateReminder
);

router.put(
  "/reminder/complete-service",
  CRM.completeService
);
router.post(
  "/getDashboardSummary",
 CRM.getDashboardSummary
)
router.post(
  "/getDashboardTable",
 CRM.getDashboardTable
)

router.post("/reminder/getCalledReminders",  CRM.getCalledReminders);


router.post("/createReminderConfig",              CRM.createReminderConfig);
router.get("/getAllReminderConfigs",                CRM.getAllReminderConfigs);
router.get("/getReminderConfigById/:utd",           CRM.getReminderConfigById);
router.put("/updateReminderConfig",                CRM.updateReminderConfig);
router.patch("/toggleReminderConfigStatus", CRM.toggleReminderConfigStatus);
router.post("/getEmployees",CRM.getEmployees)

router.post("/transferServiceExecutiveTasks", CRM.transferServiceExecutiveTasks);
router.post("/getPendingTasksByExecutive",   CRM.getPendingTasksByExecutive);



// routes/call.js


// const router = express.Router();

router.post("/makeServiceReminderCall",      makeServiceReminderCall);
router.post("/callWebhook",  callWebhook);

// ── NEW — Vehicle ki complete call history ─────────────────────
router.post("/call-history", getVehicleCallHistory);

// ── NEW — Customer Appointment Link Form (Fetch & Update) ──────
router.get("/get-appointment-details", getAppointmentFormDetails);
router.post("/get-appointment-details", getAppointmentFormDetails);
router.post("/save-appointment-details", saveCustomerAppointment);

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
router.post("/getServiceDataByVehiNo", CRM.getServiceDataByVehiNo);
router.post("/saveNewVehicleServiceData", CRM.saveNewVehicleServiceData);
router.post("/saveOrUpdateServiceData", CRM.saveOrUpdateServiceData);








module.exports = router;