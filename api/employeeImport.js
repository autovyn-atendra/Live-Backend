const express = require("express");
const multer = require("multer");
const employee = require("../routes/employeeImportRoute");

const router = express.Router();

const excelUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fieldSize: 100 * 1024 * 1024, // 100 MB in bytes
  },
}).fields([{ name: "excel", maxCount: 1 }]);


router.post("/excelimportFinal", excelUpload, employee.excelimportFinal);
router.get("/importformat", employee.importformat);

module.exports = router;