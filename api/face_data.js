// routes/employee.routes.js

const express = require("express");
const router  = express.Router();
const ctrl    = require("../routes/face_data");

// ✅ Sabhi employees with face + doc
router.post("/face-data/all",        ctrl.getEmployeesWithFaceData);

// ✅ Single employee by EMPCODE
router.post("/face-data/by-code",    ctrl.getEmployeeFaceDataByCode);

module.exports = router;