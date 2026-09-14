const express = require("express");
const multer = require("multer");
const router = express.Router();
const AIImage = require("../routes/AI_Image_Route");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: (AIImage.AI_IMAGE_CONFIG.MAX_MB || 10) * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowed = AIImage.AI_IMAGE_CONFIG.ALLOWED_MIME_TYPES;
    if (allowed && allowed.has(String(file.mimetype || "").toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported image format. Please upload a JPEG, PNG, or WebP image."));
    }
  },
});

// AI Vision Health Status
router.get("/health", AIImage.imageVisionHealthHandler);

// Primary Vehicle Odometer Extraction
router.post("/odometer", upload.single("image"), AIImage.extractOdometerHandler);

// Generic Vision Endpoint (Alias)
router.post("/analyze", upload.single("image"), AIImage.extractOdometerHandler);

module.exports = router;
