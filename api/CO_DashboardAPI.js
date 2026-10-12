const express = require("express");
const router = express.Router();
const employee = require("../routes/CO_Dashboard");

router.post("/getDashboardData", employee.getDashboardData);
router.post("/getEmployeesByType", employee.getEmployeesByType);
router.post("/getEmployeeDetails", employee.getEmployeeDetails);
router.post("/getEmployeeHistory", employee.getEmployeeHistory);
router.post("/getCeoSalaryDashboard", employee.getCeoSalaryDashboard);
router.post("/CeoSalaryDashboard", employee.getCeoSalaryDashboard);

module.exports = router;
