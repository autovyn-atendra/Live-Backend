const express = require("express");
const router = express.Router();
const eicherController = require("../routes/eicher");

router.post("/sync", eicherController.syncVecvData);

router.post("/datarefresh",     eicherController.datarefresh);
router.post("/runSchedulerNow", eicherController.runSchedulerNow);
router.post("/startScheduler",  eicherController.startScheduler);
router.post("/stopScheduler",   eicherController.stopScheduler);

router.post(
  "/eicher-config/create",
  eicherController.createEicherConfig
);



// ── Get All / Filter ────────────────────────────────────
router.get(
  "/eicher-config/list",
  eicherController.getEicherConfig
);

// ── Get By UTD ──────────────────────────────────────────
router.get(
  "/eicher-config/:UTD",
  eicherController.getEicherConfig
);

router.put("/config/:UTD",          eicherController.updateEicherConfig);
router.patch("/config/status/:UTD", eicherController.activeInactiveEicherConfig);
router.get("/godown", eicherController.getGodownMst);

module.exports = router;