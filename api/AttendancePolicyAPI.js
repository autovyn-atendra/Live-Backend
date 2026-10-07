const express = require("express");
const router = express.Router();
const admin = require("../routes/AttendancePolicy");


router.post("/saveAttendancePolicy", admin.saveAttendancePolicy)
router.post("/updateAttendancePolicy", admin.updateAttendancePolicy)
router.post("/getAttendancePolicyById", admin.getAttendancePolicyById)
router.post("/deleteAttendancePolicy", admin.deleteAttendancePolicy)
router.post("/getAttendancePolicies", admin.getAttendancePolicies)
router.post("/getAttendancePolicyHistory", admin.getAttendancePolicyHistory)
router.post("/all", admin.findAll);
router.post("/getShifts", admin.getShifts);


module.exports = router;