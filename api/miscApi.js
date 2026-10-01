// routes/miscRoutes.js
const express    = require("express");
const router     = express.Router();
const miscCtrl   = require("../routes/miscRoute");



router.get("/misc_types",     miscCtrl.getMiscType);
router.post("/status",        miscCtrl.toggleMiscStatus);
router.put("/status",         miscCtrl.toggleMiscStatus);
router.post("/toggle_status", miscCtrl.toggleMiscStatus);
router.get("/:Misc_Type",     miscCtrl.getMiscData);
router.get("/",               miscCtrl.getMiscData);
router.post("/create",        miscCtrl.createMiscData);
router.post("/update",        miscCtrl.updateMiscData);
router.put("/update",         miscCtrl.updateMiscData);
router.put("/:Misc_Type/:Misc_Code", miscCtrl.updateMiscData);
router.post("/transfer",      miscCtrl.transferMiscData);
router.post("/save_mobile_rights", miscCtrl.saveMobileRights);

module.exports = router;