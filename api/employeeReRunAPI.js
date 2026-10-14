const express = require("express");
const { GenerateAttendanceStatus } = require("../routes/employeeReRun");
const router = express.Router();


router.post("/GenerateAttendanceStatus", async (req, res) => {
    try {
        const result = await GenerateAttendanceStatus({ ...req.query, ...req.body });
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;


