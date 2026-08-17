const fs = require("fs");
const path = require("path");

const logRequests = (req, res, next) => {
    const compCode = req.headers.compcode || "defaultDB"; // Extract database from headers
    const date = new Date().toISOString().split("T")[0];
    const logDir = `logs/${compCode}`;
    const logFilePath = `${logDir}/${date}.log`;

    // Ensure log directory exists
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }

    const requestLog = {
        timestamp: new Date().toISOString(),
        url: req.originalUrl,
        body: req.body,
        compcode: req.headers.compcode || "N/A",
        user:req.headers.name|| "N/A",
        queries: [], // To store Sequelize queries
    };

    // Capture Sequelize queries
    const logQuery = (query) => {
        requestLog.queries.push(query);
    };

    req.logQuery = logQuery; // Attach to req so it can be used in route handlers

    // Capture response data
    const originalSend = res.send;
    res.send = function (data) {
        // const responseLog = {
        //     response: data,
        //     status: res.statusCode,
        // };

        const logEntry = {
            request: requestLog,
            // response: responseLog,
        };

        fs.appendFileSync(logFilePath, JSON.stringify(logEntry) + "\n");

        originalSend.apply(res, arguments);
    };

    next();
};

module.exports = logRequests;

