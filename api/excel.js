
const express = require("express");
const excel = require("../routes/excel");
const multer = require("multer");
const router = express.Router();
// const path = require("path");   // ✅ ADD THIS
// const fs = require("fs");

const excelUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // ✅ fileSize use karo (fieldSize nahi)
  },
}).fields([{ name: "excel", maxCount: 1 }]);

// // ✅ PaymentProof upload (diskStorage)
// const uploadDir = path.join(process.cwd(), "uploads", "insurance"); // ✅ FIX
// if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// const paymentStorage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadDir),
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname || "");
//      const regNo = String(req.body?.RegNo || "NA").trim().toUpperCase().replace(/\s+/g, "_");
//     cb(null, `${regNo}_${Date.now()}${ext}`);
//   },
// });


// ✅ PaymentProof upload -> memory (SMB upload API ko buffer chahiye)
const paymentUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});


router.get("/sampel", excel.downloadInsuranceRenualSampleExcel); // ✅ yaha multer ki need nahi
router.post("/import", excelUpload, excel.importInsuRenewalExcel); // ✅ yaha multer zaroori hai
router.post("/filter", excel.getInsuRenewalByDateRange);
router.post("/reminders", excel.getInsuRenewalReminders);
router.post("/getVehicleByRegNo", excel.getVehicleByRegNo)
router.post("/getInsuranceAndPaymentDropdowns", excel.getInsuranceAndPaymentDropdowns);
router.post( "/SaveInsuranceRenewal",paymentUpload.single("PaymentProof"),excel.SaveInsuranceRenewal );
router.post("/getAll",  excel.getAllInsuranceRenewals);   // ← NEW
router.post("/getOne",  excel.getInsuranceRenewalById);   // ← NEW
module.exports = router;
