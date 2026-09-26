const express = require("express");
const router = express.Router();
const {
  renderGetTodayPlanDateCustomers,
//   renderGetAllPlanDateCustomers,
  runPlanDateReminder
} = require("../schedular/leadmanagementSchedular");

// 1. SSR HTML Report Page for DSE (Scheduled Follow-up Customers)
router.get("/renderGetTodayPlanDateCustomers", renderGetTodayPlanDateCustomers);
router.get("/runPlanDateReminder", runPlanDateReminder);
// 2. SSR HTML Report Page for Approver (Missed Follow-up Customers)
// router.get("/renderGetAllPlanDateCustomers", renderGetAllPlanDateCustomers);

module.exports = router;
