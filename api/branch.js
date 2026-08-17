const express = require("express");
const router = express.Router();
const branch = require("../routes/branch");

router.post("/", branch.insertData);
router.post("/update", branch.updateData);
router.post("/all", branch.findAll);
router.post("/onlybranch", branch.onlybranch);


router.post("/findAllBranchByEmpcode", branch.findAllBranchByEmpcode);
router.post("/findAllBranchListByEmpcode", branch.findAllBranchListByEmpcode);
router.post("/findPhysicalLocationByLocCode", branch.findPhysicalLocationByLocCode);
router.post("/findPhysicalLocationList", branch.findPhysicalLocationList);
router.post("/getHRLocation", branch.getHRLocation);
router.post("/getAccountingLocation", branch.getAccountingLocation);
router.post("/:id", branch.findOne);
module.exports = router;
