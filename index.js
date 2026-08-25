const logRequests = require("./logRequests");
const swaggerUi = require("swagger-ui-express");
const { urlencoded } = require("body-parser");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const filesystem = require("fs");

const { authenticateUser } = require("./middleware/auth");
const cors = require("cors");

const user = require("./api/users");
const indexApi = require("./api/indexApi");
const branch = require("./api/branch");
const demoCarAppointment = require("./api/demoCarAppointment");
const demoCarSchedular = require("./api/DemoCarAppointmentsSchedularApi")
const serviceReminder= require("./api/serviceReminder")
const excelrouter = require("./api/excel")
const faceData = require("./api/face_data")
const metaWebhookapi = require("./api/metaWebhookapi");

const { startServiceReminderCron } = require("./cronJobs/cronJobs");
const { startMetaLeadCron } = require("./cronJobs/metaLeadCron");
const aiRoutes = require("./api/aiRoutes");
const {
  renderServiceAppointmentPage,
  getAppointmentFormDetails,
  saveCustomerAppointment,
} = require("./routes/GetCallRecordings");



const errorLogger = require("./errorLogger");


const { apiModules } = require("./utils/apiModules");
const { PORT } = require("./config/envConfig");
const basicAuth = require("express-basic-auth");

const port = PORT;
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");

app.use(cors({ origin: true }));
app.use(cookieParser())

app.use(bodyParser.json({ limit: "100mb" })); // Adjust the limit as needed
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true })); // Adjust the limit as needed
app.use(express.urlencoded({ extended: false }));
app.use(logRequests);
startServiceReminderCron();
startMetaLeadCron();

app.use((req, res, next) => {
  const originalJson = res.json;

  res.json = function (data) {
    try {
      if (!res.locals.errorLogged) {

        if (data && (data.success == false || data.error || data.Status == false || data.status == false)) {
          res.locals.errorLogged = true;
          // const err = new Error(data.error || data.message || data.Message || "Unknown error");
          let err;

          if (data.err || data.error) {
            // 🔥 USE ORIGINAL ERROR OBJECT
            err = data.err || data.error;
          } else {
            err = new Error(data.error || data.message || data.Message || "Unknown error");
          }
          // ✅ ONLY LOG — NO RESPONSE
          errorLogger(err, req);
        }
      }
    } catch (e) {
      console.error("Logging wrapper failed:", e);
    }

    return originalJson.call(this, data);
  };

  next();
});

// ── Public Unauthenticated Service Appointment Routes (HTML & AJAX) ──
app.get("*/service-appointment*", renderServiceAppointmentPage);
app.get("*/get-appointment-details*", getAppointmentFormDetails);
app.post("*/get-appointment-details*", getAppointmentFormDetails);
app.post("*/save-appointment-details*", saveCustomerAppointment);

app.use("/meta", metaWebhookapi);
apiModules.forEach((module) => {
  const filePath = path.join(__dirname, `swagger/${module}.json`);
  try {
    if (filesystem.existsSync(filePath)) {
      app.use(
        `/backend/api-docs/${module}`, // ✅ Ensure `/backend` is part of the route
        basicAuth({
          users: { admin: "vyn@#$4748" },
          challenge: true,
          unauthorizedResponse: "Unauthorized Access",
        }),
        swaggerUi.serve,
        (req, res, next) => {
          const swaggerDocument = require(filePath);
          swaggerUi.setup(swaggerDocument, {
            swaggerOptions: {
              url: `/backend/api-docs/${module}`, // ✅ Forces Swagger to keep the correct path
              validatorUrl: null, // Optional: Remove validator errors
            },
          })(req, res, next);
        }
      );
    }
  } catch (error) {
    console.log(error);
  }
});

// Your other API routes
app.use((req, res, next) => {
  authenticateUser(req, res, next);
});

//APies
app.use("/", indexApi);
app.use("/branch", branch);
app.use("/users", user);
app.use("/demo-car-appointment", demoCarAppointment);
app.use("/check-schedular",demoCarSchedular)
app.use("/Crm", serviceReminder);
app.use("/service-appointment", serviceReminder);
app.use("/backend/service-appointment", serviceReminder);
app.use("/backend/Crm", serviceReminder);
app.use("/excel",excelrouter);
app.use("/employee",faceData);
// app.use("/call",GetCallRecordings)
app.use("/ai", aiRoutes);




app.all("*", async (req, res) => {
  res.status(401).send({
    Status: false,
    Message: "Invalid Request",
  });
});
app.use((err, req, res, next) => {
  console.error("🔥 Global Error:", err);
  // ✅ Log error
  errorLogger(err, req);

  // ✅ Prevent crash if already sent
  if (res.headersSent) {
    return next(err);
  }
  // ✅ Send response ONLY ONCE
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    // optional (for debugging only)
    error: err.original || err.parent || err,
  });
});
// On local/dev startup: scan config-*.json bundles and merge into config.json
if (process.env.NODE_ENV !== 'production') {
  require('./utils/mergeConfigs').mergeAllBundles();
}
app.listen(port, function (err) {
  if (err) {
    console.log("ERROR!", err);
    return;
  }
  console.log(`server started on port ${port}`);
});
