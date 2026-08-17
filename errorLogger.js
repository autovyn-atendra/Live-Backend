const fs = require("fs");
const nodemailer = require("nodemailer"); // ❗ REQUIRED
const getISTTime = () => {
    return new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour12: false,
    });
};
const getISTDate = () => {
    return new Date().toLocaleDateString("en-CA", {
        timeZone: "Asia/Kolkata",
    }); // format: YYYY-MM-DD
};

async function sendEmail1(to, cc, subject, htmlBody) {
    try {
        console.log("📨 Sending Email...");
        console.log({ to, cc, subject });

        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "AUTOVYN.MAILER@gmail.com",
                pass: "lamdgvthpjetawtr",
            },
        });

        // 🔥 VERIFY CONNECTION
        await transporter.verify();
        console.log("✅ SMTP Connected");

        let mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            cc,
            subject,
            html: htmlBody,
        };

        const info = await transporter.sendMail(mailOptions);

        console.log("✅ Email sent:", info.response);

    } catch (error) {
        console.error("❌ Email Error FULL:", error);
    }
}


// ---------------- ERROR TRACKER ----------------
const errorStore = {};
const ERROR_LIMIT = 5;
const TIME_WINDOW = 10 * 60 * 1000;

function trackError(errorKey) {
    const now = Date.now();

    if (!errorStore[errorKey]) {
        errorStore[errorKey] = [];
    }

    errorStore[errorKey].push(now);

    errorStore[errorKey] = errorStore[errorKey].filter(
        time => now - time <= TIME_WINDOW
    );

    if (errorStore[errorKey].length >= ERROR_LIMIT) {
        errorStore[errorKey] = [];
        return true;
    }

    return false;
}


const errorLogger = async (err, req) => {
    try {
        const compCode = req.headers.compcode || "defaultDB";
        const date = getISTDate();
        const logDir = `logs/${compCode}`;
        const logFilePath = `${logDir}/${date}_error.log`;

        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }

        // add code for send mail
        // ✅ FIX: extract proper error message
        const errorMessage =
            err?.parent?.message ||
            err?.message ||
            "Unknown error";
        
        // ✅ UNIQUE KEY (VERY IMPORTANT)
        const errorKey = `${req.originalUrl}__${err.sql || errorMessage}`;

        // ✅ CHECK REPEATED ERROR
        const shouldSendEmail = trackError(errorKey);

        if (shouldSendEmail) {
            console.log("📧 Sending alert email...");

            // const devMail = "manish@autovyn.com,lakhan@autovyn.com";
            const devMail = "";
            const prodMail = "manish@autovyn.com,lakhan@autovyn.com,dinesh@autovyn.com";

            // ✅ Correct condition
            const ActualMail =
                process.env.NODE_ENV == "DEV" ? devMail : prodMail;

            const safeSQL = err?.sql
                ? err.sql.length > 1000
                    ? err.sql.substring(0, 1000) + "... (truncated)"
                    : err.sql
                : "No SQL Available";

                let safeBody = "No body Available";

                try {
                    if (req?.body) {
                        const bodyString =
                            typeof req.body === "string"
                                ? req.body
                                : JSON.stringify(req.body);
                    
                        safeBody =
                            bodyString.length > 1000
                                ? bodyString.substring(0, 1000) + "... (truncated)"
                                : bodyString;
                    }
                } catch (e) {
                    safeBody = "Body parse failed";
                }

                console.log(ActualMail, "ActualMail")

            if(ActualMail && ActualMail != ''){
                console.log(ActualMail, "ActualMail1")
            await sendEmail1(
                ActualMail,
                "",
                "🚨 Repeated Error Alert",
                `
      <h3>Repeated Error Detected</h3>
      <p><b>URL:</b> ${req.originalUrl}</p>
      <p><b>Error:</b> ${errorMessage}</p>
      <p><b>Method:</b> ${req.method}</p>
      <p><b>Time:</b> ${getISTTime()}</p>
      <p><b>Company Name:</b> ${req.headers.compcode || req.headers.Comp_Code || req.headers.CompCode || "N/A"}</p>
      <p><b>User Name:</b> ${req.headers.name || "N/A"} </p>
      <p><b>Reqest body</b> ${safeBody || "N/A"} </p>
      <hr/>

    <p><b>SQL:</b></p>
    <pre>${safeSQL}</pre>
    `
            );
        }
        }
        // end code for send mail option

        const errorLog = {
            timestamp: getISTTime(),
            url: req.originalUrl,
            method: req.method,
            request: req.logData || {},
            body: req.body || {},
            compcode: req.headers.compcode || "N/A",
            user:req.headers.name|| "N/A",
            parent: err.parent,
            sql: err.sql,
            error: {
                message: err.message,
                name: err.name,
                // ✅ Sequelize main error
                parent: err.parent?.message,
                sqlMessage: err.parent?.sqlMessage,
                // ✅ AggregateError details
                errors: err.errors?.map(e => ({
                    message: e.message,
                    code: e.code,
                    number: e.number
                })),
                sql: err.sql,
                stack: err.stack,
                status: err.status || 500,
            }
        };

        fs.appendFileSync(logFilePath, JSON.stringify(errorLog) + "\n");
        console.log("✅ error saved");
    } catch (e) {
        console.error("❌ Logging failed:", e);
    }
};


module.exports = errorLogger
