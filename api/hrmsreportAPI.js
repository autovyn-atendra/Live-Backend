const express = require('express');
const router = express.Router();
const hrmsreport = require('../routes/hrmsreport');



router.post('/getAttendanceStatusDashboard',hrmsreport.getAttendanceStatusDashboard)
router.post("/getDashboardData", hrmsreport.getDashboardData);

module.exports = router;





