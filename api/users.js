const express = require("express");
const router = express.Router();
const user = require("../routes/user");
const multer = require("multer");
const bodyParser = require("body-parser");

const excelUpload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fieldSize: 100 * 1024 * 1024, // 100 MB in bytes
    },
}).fields([{ name: "excel", maxCount: 1 }]);
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fieldSize: 100 * 1024 * 1024, // 100 MB in bytes
    },
}).any();

router.get("/importformatapprovalmatrix", user.importformatapprovalmatrix);
router.post("/excelimportapprovalmatrix", excelUpload, user.excelimportapprovalmatrix);

router.get("/importformatuser", user.importformatuser);
router.post("/excelimportuser", excelUpload, user.excelimportuser);


router.get("/importformatuserrights", user.importformatuserrights);
router.post("/excelimportuserrights", excelUpload, user.excelimportuserrights);

router.get("/rightsupdateformat", user.rightsupdateformat);

router.post("/login", user.login);
router.post("/", user.insertData);

router.post("/savedealerrights", user.savedealerrights);
router.post("/findDealerRights", user.findDealerRights);


router.post("/savewhatsapprights", user.savewhatsapprights);
router.post("/saveWhatsappRights1", user.saveWhatsappRights1);
router.get("/findWhatsappRights", user.findWhatsappRights);
// router.post("/findDealerRights", user.findDealerRights);

router.post("/update", user.updateData);
router.post("/updateDataforuser", user.updateDataforuser);
router.post("/all", user.findAll);
router.post("/getyear", user.getyear);
router.post("/approvalmatrix", user.approvalmatrix);
router.post("/findMatrixEmployees", user.findMatrixEmployees);
router.post("/BranchApi", user.BranchApi);
router.post("/approvalmatrixfindOne", user.approvalmatrixfindOne);

router.post("/BranchNameAndDepartmentapprovalmatrixfindOne", user.BranchNameAndDepartmentapprovalmatrixfindOne);
router.post("/BranchNameAndDepartmentapprovalmatrixsave", user.BranchNameAndDepartmentapprovalmatrixsave);


router.post("/approvalmatrixfindOneByLocation", user.approvalmatrixfindOneByLocation);
router.post("/approvalmatrixByLocation", user.approvalmatrixByLocation);
router.post("/approvalmatrixTransfer", user.approvalmatrixTransfer);
router.post("/findAllEmployee", user.findAllEmployee);
router.post("/MandatoryFields", user.MandatoryFields);
router.post("/MandatoryFieldsUpdate", user.MandatoryFieldsUpdate);
router.post("/whatsappmsg", user.whatsappmsg);
router.post("/whatsAppMsgAttachement", upload, user.whatsAppMsgAttachement);
router.post("/ranawhatsapp", user.ranawhatsapp);
router.post("/passwordChange", user.passwordChange);
router.post("/dbauthenticate", user.dbauthenticate);
router.post("/Alldbauthenticate", user.Alldbauthenticate);
router.post("/StatementAccNo", user.StatementAccNo);
router.post("/GetStatement", user.GetStatement);
router.post("/ApprovalMatrixImport", user.ApprovalMatrixImport);
router.post("/MobileRightsUpdate", user.MobileRightsUpdate);
router.post("/SaveTemplateMobileRights", user.SaveTemplateMobileRights);
router.post("/MobileRightsGet", user.MobileRightsGet);
router.get("/MobileRightsDownload", user.MobileRightsDownload);
router.post("/MobileRightsAddExtra", user.MobileRightsAddExtra);
router.post("/MobileRightsRemoveExtra", user.MobileRightsRemoveExtra);
router.post("/MessageHistory", user.MessageHistory);
router.post("/findCompanyRights", user.findCompanyRights);
router.post("/saveCompanyRights", user.saveCompanyRights);
router.post("/addrelease", user.addrelease);
router.post("/updaterelease", user.updaterelease);
router.post("/findrelease", user.findrelease);
router.post("/findreleaseforlogin", user.findreleaseforlogin);
router.post("/ViewEmpData", user.ViewEmpData);
router.post("/userrightsreport", user.userrightsreport);
router.post("/userrightsreportexcelupdate", excelUpload, user.userrightsreportexcelupdate);
router.post("/SaveYoutubeUrl", user.SaveYoutubeUrl);
router.post("/FindYoutubeUrls", user.FindYoutubeUrls);
router.post("/UploadHelpPdf", upload, user.UploadHelpPdf);
router.post("/myshortcuts", user.myshortcuts);
router.post("/getMyShortcuts", user.getMyShortcuts);


router.post("/getemployees", user.getemployees);
router.post("/GetUserRights", user.GetUserRights);
router.post("/getbankinguserrights", user.getbankinguserrights);
router.post("/updateDataForLeftEmployee", user.updateDataForLeftEmployee);
router.post("/ExpenseRightsAddExtra", user.ExpenseRightsAddExtra);
router.post("/ExpenseRightsRemoveExtra", user.ExpenseRightsRemoveExtra);
router.post("/whatsappRead", user.whatsappRead);
router.post("/AadhaarPanMessageHistory", user.AadhaarPanMessageHistory);


router.post("/InsertUserActHst", user.InsertUserActHst);
router.post("/GetPhyLocation", user.GetPhyLocation);
router.post("/GeoOffenceLocation", user.GeoOffenceLocation);
router.post("/AccountApiLogs", user.AccountApiLogs);

router.post("/uploadVideoImage", upload, user.uploadVideoImage);
router.get("/getUploadedFiles", user.getUploadedFiles);
router.post("/toggleActive", user.toggleActive);
router.post("/deactivateAll", user.deactivateAll);
router.get("/getLoginFiles", user.getLoginFiles)
router.post("/sendFestivalOtp", user.sendFestivalOtp)


router.post("/SaveTermsnCondition", user.SaveTermsnCondition)
router.post("/ViewTIDMst", user.ViewTIDMst)
router.post("/ShowTermHeadingData", user.ShowTermHeadingData)
router.post("/UpdateTermsnCondition", user.UpdateTermsnCondition)
router.post("/SaveDtlTermsnCondition", user.SaveDtlTermsnCondition)
router.post("/UpdateDtlTermsnCondition", user.UpdateDtlTermsnCondition)
router.post("/ViewTIDDtl", user.ViewTIDDtl)
router.post("/HRMSLeadMaxNo", user.HRMSLeadMaxNo)
router.post("/HRMSLeadSave", upload, user.HRMSLeadSave)
router.post("/HRMSLeadUpdate", upload, user.HRMSLeadUpdate)
router.post("/HRMSLeadView", user.HRMSLeadView)
router.post("/HRMSLeadDashboard", user.HRMSLeadDashboard)
router.post("/LeadImport", excelUpload, user.LeadImport);
router.get("/LeadFormat", user.LeadFormat); 

// ========== MASTER USER RIGHTS MANAGEMENT ========== //
router.post("/addName", user.addName);
router.post("/fetchList", user.fetchList);
router.post("/findRights", user.findRights);
router.post("/saveRights", user.saveRights);
router.post("/getRoleList", user.getRoleList);        
router.post("/applyRoleRights", user.applyRoleRights);
router.post("/getUserAppliedRoles", user.getUserAppliedRoles);

router.post("/ModuleInformationView", user.ModuleInformationView);
router.post("/GetActiveModuleReport", user.GetActiveModuleReport);
router.post("/SaveActiveModuleReport", user.SaveActiveModuleReport);

router.post("/:id", user.findOne);
router.post("/expense/:ExpenseId", user.findOneforexpense);

module.exports = router;


//ymYpswYiinkCjHGENPtEk9imLjlR3aJRHyM8E8SaxEM=