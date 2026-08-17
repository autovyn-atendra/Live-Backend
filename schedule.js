const schedule = require("node-schedule");
const moment = require("moment");
const { dbname } = require("./utils/dbconfig");
const { SendWhatsAppMessgae } = require("./routes/user");
const axios = require("axios");
const nodemailer = require("nodemailer");
const SchedulerLogger = require("./utils/schedulerLogger");
const fs = require("fs");
const path = require("path");

function writeDailySchedulerLog(logData) {
  try {
    const today = new Date().toISOString().split("T")[0];
    const logDir = path.join(__dirname, "scheduler_logs");

    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const filePath = path.join(logDir, `${today}.txt`);

    fs.appendFileSync(filePath, JSON.stringify(logData) + "\n");

  } catch (err) {
    console.error("TXT log failed:", err.message);
  }
}



// Helper: case-insensitive getter for DB row properties
function getField(row, name) {
  if (row == null) return null;
  if (name in row) return row[name];
  const lower = name.toLowerCase();
  const upper = name.toUpperCase();
  for (const k of Object.keys(row)) {
    if (k === name || k === lower || k === upper) return row[k];
    if (k.toLowerCase() === lower) return row[k];
  }
  return null;
}

// Helper: clean date -> "YYYY-MM-DD HH:MM:SS" (no timezone)
function cleanDate(d) {
  if (!d) return null;
  const dt = new Date(d);
  if (isNaN(dt)) return null;
  return dt.toISOString().replace("T", " ").substring(0, 19);
}

function getCustomMonth(date) {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();

  if (day >= 26) {
    return {
      customMonth: (month + 1 > 12 ? 1 : month + 1).toString().padStart(2, "0"),
      customYear: month + 1 > 12 ? year + 1 : year,
    };
  } else {
    return {
      customMonth: month.toString().padStart(2, "0"),
      customYear: year,
    };
  }
}

async function recalcNextMonths(sequelize, empCode, startMonth, startYear, t) {

  // console.log("===== recalcNextMonths START =====");
  // console.log("EmpCode:", empCode, "Start:", startMonth, startYear);

   let m = Number(startMonth);
  let y = Number(startYear);

  while (true) {

    // console.log("\n---- Checking Month:", m, "Year:", y, "----");

    // Get current month closing
    const [current] = await sequelize.query(`
      SELECT Cl_Bal
      FROM Leave_BAL
      WHERE Emp_Code = '${empCode}'
        AND Leave_Type = '9'
        AND Leave_Mnth = ${m}
        AND Leave_Yr = ${y}
    `, { transaction: t });

    if (!current.length) {
      console.log("❌ No current month record found. Breaking loop.");
      break;
    }

    const prevClosing = Number(current[0].Cl_Bal || 0);
    // console.log("Current Month Closing (Cl_Bal):", prevClosing);

    // Calculate next month
    let nextM = m + 1;
    let nextY = y;
    if (nextM > 12) { 
      nextM = 1; 
      nextY++; 
    }

    // console.log("Next Month:", nextM, "Next Year:", nextY);

    // Check if next month row exists
    const [nextRows] = await sequelize.query(`
      SELECT Op_Bal, Gen_Lev, Avail_Lev
      FROM Leave_BAL
      WHERE Emp_Code = '${empCode}'
        AND Leave_Type = '9'
        AND Leave_Mnth = ${nextM}
        AND Leave_Yr = ${nextY}
    `, { transaction: t });

    if (!nextRows.length) {
      console.log("❌ Next month record not found. Stopping chain.");
      break; // stop chain
    }

    const gen = Number(nextRows[0].Gen_Lev || 0);
    const avail = Number(nextRows[0].Avail_Lev || 0);

    console.log("Next Month Gen_Lev:", gen);
    console.log("Next Month Avail_Lev:", avail);

    const newClosing = prevClosing + gen - avail;

    // console.log("Calculated New Closing:", newClosing);

    // Update next month
    await sequelize.query(`
      UPDATE Leave_BAL
      SET Op_Bal = ${prevClosing},
          Cl_Bal = ${newClosing}
      WHERE Emp_Code = '${empCode}'
        AND Leave_Type = '9'
        AND Leave_Mnth = ${nextM}
        AND Leave_Yr = ${nextY}
    `, { transaction: t });

    // console.log("✅ Updated Month:", nextM, nextY, 
    //             "| New Op_Bal:", prevClosing, 
    //             "| New Cl_Bal:", newClosing);

    // Move forward
    m = nextM;
    y = nextY;
  }

  // console.log("===== recalcNextMonths END =====\n");
}



// async function shortenURL(longUrl) {
//   try {
//     const response = await axios.get(
//       `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`
//     );
//     console.log("TinyURL API response:", response.data);
//     return response.data;
//   } catch (err) {
//     console.error("URL shortening failed:", err.message);
//     return longUrl;
//   }
// }

// async function shortenURL(longUrl) {
//   try {
//     const response = await axios.post("https://cleanuri.com/api/v1/shorten", {
//       url: longUrl,
//     });
//     console.log("CleanURI API response:", response.data);
//     return response.data.result_url; // shortened URL
//   } catch (err) {
//     console.error("URL shortening failed:", err.message);
//     return longUrl; // fallback to original
//   }
// }

async function sendEmail(toEmail, subject, htmlContent) {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "AUTOVYN.MAILER@gmail.com",
        pass: "lamdgvthpjetawtr",
      },
    });

    let mailOptions = {
      from: "AUTOVYN.MAILER@gmail.com",
      to: toEmail,
      subject: subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error occurred while sending email:", error);
    throw error;
  }
}


//created by lakhan for de-allot chassis
schedule.scheduleJob("00 8 * * *", async () => {
  console.log("Running scheduled job for deallotment...");
  const sequelize1 = await dbname(
    {
      query: "",
      headers: {
        compcode: "DBCON",
        name: "schedualer",
      },
    },
    "DBCON"
  );

  const [Dlr_data] = await sequelize1.query(
    `select * from DLR_SCH WHERE SCH_TYPE = 'De-Allot' and export_type<3`
  );

  console.log("dlr_data", Dlr_data);

  for (const dealer of Dlr_data) {
    const compcode = dealer.Dlr_Id;
    const logger = new SchedulerLogger(
      sequelize1,   // DBCON connection
      "De-Allot",
      compcode
    );


    console.log(`⏳ Processing dealer: ${compcode}`);

    const sequelize = await dbname(
      {
        query: "",
        headers: {
          compcode: compcode,
          name: "schedualer",
        },
      },
      compcode
    );
    try {
      const [COMP_KEYDATA] = await sequelize.query(
        `select Auto_DeAllot_Days,safe_allot_per from COMP_KEYDATA`
      );
      console.log(COMP_KEYDATA, "COMP_KEYDATA");

      await sequelize.query(
        `update RTL_MST set Extend_Flag = null where Extend_Flag = '1' and export_Type<3`
      );

      const Auto_DeAllot_Days = COMP_KEYDATA[0].Auto_DeAllot_Days;
      const DeAllot_Reminder_Days = COMP_KEYDATA[0].Auto_DeAllot_Days - 1;
      console.log(Auto_DeAllot_Days, "Auto_DeAllot_Days");
      console.log(DeAllot_Reminder_Days, "DeAllot_Reminder_Days");
      console.log(
        " COMP_KEYDATA[0].safe_allot_per",
        COMP_KEYDATA[0].safe_allot_per
      );
      let result = [];

      if (
        COMP_KEYDATA[0].safe_allot_per !== null &&
        COMP_KEYDATA[0].safe_allot_per !== undefined &&
        COMP_KEYDATA[0].safe_allot_per !== 0
      ) {
        console.log("running");
        const safe_allot_per = COMP_KEYDATA[0].safe_allot_per / 100;
        console.log("safe_allot_per", safe_allot_per);
        [result] = await sequelize.query(`
          SELECT
    c.Customer_Name,
    c.Booking_Id,
    c.Booking_Date,
    DATEDIFF(day, c.Booking_Date, GETDATE()) AS Days_Since_Booking,
    c.Emp_Code,
    r.modl_var
FROM Chas_Alot c
JOIN RTL_MST r
    ON c.Booking_ID = r.Tran_Id AND r.Export_Type < 3

WHERE
    DATEDIFF(day, c.Booking_Date, GETDATE()) >= ${DeAllot_Reminder_Days}
    AND c.Appr_1_stat = 1
    And R.tran_type = 1
    AND c.DeAlot_Date IS NULL
    AND c.Export_Type < 3
    And R.Enq_stat = 4
    AND (
        (
            ISNULL(r.Total_Amt, 0)
        ) * ${safe_allot_per}
    )
    >=
    ISNULL((
        SELECT ISNULL(SUM(a.Post_Amt), 0) AS Total_Amt
FROM ACNT_POST a
WHERE
  a.Ledg_Ac = r.Ledg_code
  AND a.Loc_Code = r.Loc_code
  AND a.Export_Type IN (0,1,2)
  AND a.Acnt_Type = 1
    ), 0);

          `);
      } else {
        [result] = await sequelize.query(`
            select c.Customer_Name,c.Booking_Id, c.Booking_Date,DATEDIFF(day, c.Booking_Date, GETDATE()) AS Days_Since_Booking,c.Emp_Code FROM Chas_Alot c
JOIN RTL_MST r
    ON c.Booking_ID = r.Tran_Id AND r.Export_Type < 3

WHERE
    DATEDIFF(day, c.Booking_Date, GETDATE()) >= ${DeAllot_Reminder_Days}
    AND c.Appr_1_stat = 1
    And R.tran_type = 1
    AND c.DeAlot_Date IS NULL
    AND c.Export_Type < 3
    And R.Enq_stat = 4
        `);
      }

      console.log("result", result);

      for (const item of result) {
        const days = moment().diff(moment(item.Booking_Date), "days");

        const [executer_info] = await sequelize.query(`
        SELECT EMPFIRSTNAME + ' ' + EMPLASTNAME AS full_name, MOBILE_NO
        FROM EMPLOYEEMASTER
        WHERE EMPCODE = '${item.Emp_Code}'
      `);

        const [vehicle_info] = await sequelize.query(`
        SELECT Alot_chas, Allot_branch
        FROM RTL_MST
        WHERE Enq_Stat = 4 AND Alot_chas IS NOT NULL AND Tran_Id = '${item.Booking_Id}'
      `);

        const [company_info] = await sequelize.query(
          `SELECT Comp_Name FROM comp_mst`
        );

        if (days === DeAllot_Reminder_Days) {
          await SendWhatsAppMessgae(
            compcode,
            executer_info[0].MOBILE_NO,
            "chassis_deallotment_reminder2",
            [
              { type: "text", text: executer_info[0]?.full_name || "UnKnown" },
              { type: "text", text: item?.Customer_Name || "UnKnown" },
              {
                type: "text",
                text: vehicle_info[0]?.Allot_branch || "UnKnown",
              },
              { type: "text", text: vehicle_info[0]?.Alot_chas || "UnKnown" },
              { type: "text", text: company_info[0]?.Comp_Name || "UnKnown" },
            ]
          );
          logger.addImpact("WHATSAPP_REMINDER", item.Booking_Id, 1);
        }
      };


      const autoDeAllotEntries = result.filter((item) => {
        const days = moment().diff(moment(item.Booking_Date), "days");
        return days >= Auto_DeAllot_Days;
      });

      // console.log("autoDeAllotEntries", autoDeAllotEntries);

      if (autoDeAllotEntries.length === 0) {
        console.log(
          "❌ No entries for exact Auto_DeAllot_Days. Skipping approver notification."
        );
        logger.addSkip(1);
        continue;
      }

      console.log(
        "✅ Found entries for Auto_DeAllot_Days, proceeding to notify approvers."
      );

      const empMap = new Map();

      for (const item of result) {
        if (!empMap.has(item.Emp_Code)) {
          empMap.set(item.Emp_Code, item);
        }
      }
      console.log("empMap", empMap);

      const approverMap = new Map();

      for (const [empCode, item] of empMap.entries()) {
        const CheckApprovalquery = `
    SELECT TOP 1 approver1_A
    FROM Approval_Matrix
    WHERE empcode = '${empCode}'
    AND module_code = 'Lead_Management'
  `;
        const CheckApproval = await sequelize.query(CheckApprovalquery);
        const approverEmpCode = CheckApproval[0][0]?.approver1_A;

        if (approverEmpCode && !approverMap.has(approverEmpCode)) {
          approverMap.set(approverEmpCode, empCode);
        }
      }
      console.log("approverMap", approverMap);

      for (const [approverEmpCode] of approverMap.entries()) {
        const ApproverDetailsQuery = `
    SELECT
  (e.EMPFIRSTNAME + ' ' + e.EMPLASTNAME) AS fullName,
  e.MOBILE_NO,
  e.CORPORATEMAILID,
  (
    SELECT top 1 multi_loc
    FROM user_tbl u
    WHERE u.empcode = e.empcode AND u.export_type < 3
  ) AS multi_loc
FROM EMPLOYEEMASTER e
WHERE e.empcode = '${approverEmpCode}'
  `;
        const ApproverDetails = await sequelize.query(ApproverDetailsQuery);
        const { MOBILE_NO: approverMobile, fullName: approverName, multi_loc: LocCode } =
          ApproverDetails[0][0] || {};
        const [company_info] = await sequelize.query(
          `SELECT Comp_Name FROM comp_mst`
        );
        const [deAllot_days] = await sequelize.query(
          `SELECT Auto_DeAllot_Days FROM COMP_KEYDATA`
        );

        const encodedCompCode = Buffer.from(compcode).toString("base64");
        const encodedApprCode = Buffer.from(approverEmpCode).toString("base64");
        const encodedLocCode = Buffer.from(LocCode).toString("base64");
        const approvalLink = `https://erp.autovyn.com/autovyn/preSales/quotation/De-Allot?compcode=${encodedCompCode}&ApprCode=${encodedApprCode}&LocCode=${encodedLocCode}`;
        // const approvalLink = `http://localhost:3000/autovyn/preSales/quotation/De-Allot?compcode=${encodedCompCode}&ApprCode=${encodedApprCode}&LocCode=${encodedLocCode}`;
        // const shortLink = await shortenURL(approvalLink);

        console.log("Sending message to Approver:", approverName);

        await SendWhatsAppMessgae(
          compcode,
          approverMobile,
          "pending_chassis_alert",
          [
            { type: "text", text: approverName || "Unknown" },
            { type: "text", text: deAllot_days[0]?.Auto_DeAllot_Days || "0" },
            { type: "text", text: approvalLink },
            { type: "text", text: company_info[0]?.Comp_Name || "Company" },
          ]
        );
        logger.addImpact("WHATSAPP_APPROVER", approverEmpCode, 1);


        const subject = "Pending Chassis Alert";
        const to = ApproverDetails[0][0].CORPORATEMAILID;

        const htmlContent = `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
              <title>Pending Chassis Alert</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  background-color: #f9f9f9;
                  padding: 20px;
                }
                .container {
                  max-width: 600px;
                  background-color: #ffffff;
                  border-radius: 8px;
                  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                  padding: 30px;
                  margin: auto;
                }
                h2 {
                  color: #d32f2f;
                }
                a {
                  color: #1565c0;
                  text-decoration: none;
                  font-weight: bold;
                }
                .footer {
                  margin-top: 30px;
                  font-size: 0.9em;
                  color: #777;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h2>Pending Chassis Alert</h2>
                <p>Dear ${approverName},</p>
                <p>Please see the list of allotted chassis that are older than ${Auto_DeAllot_Days} day(s) from the allotment date.</p>
                <p>Please review the list and take action at the earliest.</p>
                <p>
                  <strong>Click the link below to view full details:</strong><br />
                  <a href="${approvalLink}" target="_blank">${approvalLink}</a>
                </p>
                <div class="footer">
                  <p>Thank you,<br>
                  <strong>${company_info[0]?.Comp_Name} Team</strong><br>
                  </p>
                </div>
              </div>
            </body>
          </html>
          `;
        if (to) {
          await sendEmail(to, subject, htmlContent);
          logger.addImpact("EMAIL_SENT", approverEmpCode, 1);

        }
      }
    } catch (err) {
      logger.setError(err);
      console.error("Deallotment job failed:", err.message);
    }
    try {
      await logger.save();
      writeDailySchedulerLog(logger.toJSON());
    } catch (logErr) {
      console.error("⚠️ Logger failed but scheduler continues:", logErr.message);
    }

  }
});
//plan date remainder...

schedule.scheduleJob("00 8 * * *", async () => {
  console.log("📅 Running scheduled job for plan date remainder...");

  const sequelize1 = await dbname(
    {
      query: "",
      headers: {
        compcode: "DBCON",
        name: "schedualer",
      },
    },
    "DBCON"
  );

  const [Dlr_data] = await sequelize1.query(`
    SELECT * FROM DLR_SCH 
    WHERE SCH_TYPE = 'Enq-Follow-up' 
      AND export_type < 3
  `);

  if (!Dlr_data.length) {
    console.log("No dealers found with Next Plan Date schedule.");
    return;
  }


  for (const dealer of Dlr_data) {
    const compcode = dealer.Dlr_Id;
    const logger = new SchedulerLogger(
      sequelize1,
      "Enq-Follow-up",
      compcode
    );

    console.log(`⏳ Processing dealer: ${compcode}`);

    const sequelize = await dbname(
      {
        query: "",
        headers: {
          compcode: compcode,
          name: "schedualer",
        },
      },
      compcode
    );

    try {
      const [result] = await sequelize.query(`
       

  WITH LatestByTran AS (
    SELECT *,
           ROW_NUMBER() OVER (PARTITION BY Tran_Id ORDER BY SNo DESC) AS rn
    FROM Enq_Dtl
)
SELECT 
e.Tran_Id,
          e.Plan_date,
          e.Cust_Rep,
          r.Ledg_Name AS Customer_Name,
          r.Ledg_Add1,
          r.DSE_Gen,
          r.Ph1,
          r.Email_Id,
          r.Cust_Id,
          r.Ledg_Code,
          r.Tran_Id as Enq_id,
          r.Modl_Code,
          r.Modl_Var,
          r.color,
          r.Allot_Modl_Code,
          r.Book_Date,
          r.Reg_Date,
          r.Total_Amt
FROM LatestByTran e
JOIN RTL_MST r ON CAST(e.Tran_Id AS VARCHAR) = r.Tran_Id
WHERE e.rn = 1 and r.export_type <33
   
  AND CAST(e.Plan_date AS DATE) = CAST(GETDATE() AS DATE);

       
      `);

      if (!result.length) {
        console.log(` No today's plans for dealer: ${compcode}`);
        continue;
      }

      for (const item of result) {
        try {
          const [[executer_info]] = await sequelize.query(`
            SELECT EMPFIRSTNAME + ' ' + EMPLASTNAME AS full_name, MOBILE_NO
            FROM EMPLOYEEMASTER
            WHERE EMPCODE = '${item.DSE_Gen}'
          `);

          const [[company_info]] = await sequelize.query(`
            SELECT Comp_Name FROM comp_mst
          `);

          const [[color_code]] = await sequelize.query(`
            SELECT CAST(Misc_Code AS VARCHAR) AS value, Misc_Name AS label 
            FROM Misc_Mst 
            WHERE Misc_Type = 10 AND Misc_Code = '${item.color}'
          `);

          const [[model_group]] = await sequelize.query(`
            SELECT Misc_Name AS label, CAST(Misc_Code AS VARCHAR) AS value 
            FROM Misc_mst 
            WHERE Misc_type = 14 AND Misc_Code = '${item.Modl_Code}'
          `);

          if (!executer_info) {
            console.warn(`⚠️ No executive info for DSE_Gen: ${item.DSE_Gen}`);
            continue;
          }

          if (!color_code || !model_group) {
            console.warn("⚠️ Color or model group missing for:", item);
            continue;
          }

          console.log(`📨 Notifying ${executer_info.full_name} and customer ${item.Customer_Name}`);
          console.log(executer_info.full_name, "executer_info.full_name",
            item.Customer_Name, "item.Customer_Name",
            model_group.label, "model_group.label ",
            color_code.label, "color_code.label",
            item.Allot_Modl_Code, "item.Allot_Modl_Code ",
            company_info?.Comp_Name, " text: company_info?.Comp_Name "

          )

          // Send to Executive
          try {
            console.log("hello1")
            await SendWhatsAppMessgae(
              compcode,
              executer_info.MOBILE_NO,
              "plan_date_reminder_executer2",
              [
                { type: "text", text: executer_info.full_name || "UnKnown" },
                { type: "text", text: item.Customer_Name || "UnKnown" },
                { type: "text", text: item.Ph1 || "UnKnown" },
                { type: "text", text: model_group.label },
                { type: "text", text: color_code.label },
                { type: "text", text: item.Allot_Modl_Code },
                { type: "text", text: company_info?.Comp_Name || "UnKnown" },
              ]
            );
          } catch (execErr) {
            console.error("❌ Failed to send message to executive:", execErr.message);
          }
          logger.addImpact("WHATSAPP_EXECUTER", item.Tran_Id, 1);


          // Send to Customer
          try {
            console.log("hello2")
            await SendWhatsAppMessgae(
              compcode,
              item.Ph1,
              "plan_date_reminder_customer2",
              [
                { type: "text", text: item.Customer_Name || "UnKnown" },
                { type: "text", text: model_group.label },
                { type: "text", text: item.Allot_Modl_Code },
                { type: "text", text: color_code.label },
                { type: "text", text: executer_info.full_name || "UnKnown" },
                { type: "text", text: executer_info.MOBILE_NO || "UnKnown" },
                { type: "text", text: company_info?.Comp_Name || "UnKnown" },
                { type: "text", text: company_info?.Comp_Name || "UnKnown" },
              ]
            );
            logger.addImpact("WHATSAPP_CUSTOMER", item.Tran_Id, 1);

          } catch (custErr) {
            logger.setError(custErr);
            console.error("❌ Failed to send message to customer:", custErr.message);
          }

        } catch (innerErr) {
          logger.setError(innerErr);
          console.error("🔥 Error processing individual plan:", innerErr.message);
        }
      }
    } catch (err) {
      logger.setError(err);
      console.error(`❌ Plan date message failed for dealer ${compcode}:`, err.message);
    }
    try {
      await logger.save();
      writeDailySchedulerLog(logger.toJSON());
    } catch (logErr) {
      console.error("⚠️ Logger failed but scheduler continues:", logErr.message);
    }


  }
});

// Due to by executer plan date remainder...

schedule.scheduleJob("00 8 * * *", async () => {
  console.log("📅 Running scheduled job for plan date reminder...");

  const sequelize1 = await dbname(
    {
      query: "",
      headers: {
        compcode: "DBCON",
        name: "scheduler",
      },
    },
    "DBCON"
  );

  const [Dlr_data] = await sequelize1.query(`
    SELECT * FROM DLR_SCH
    WHERE SCH_TYPE = 'Enq-Follow-up'
      AND export_type < 3
  `);

  if (!Dlr_data.length) {
    console.log("🚫 No dealers found with a valid schedule.");
    return;
  }

  for (const dealer of Dlr_data) {
    const compcode = dealer.Dlr_Id;
    const logger = new SchedulerLogger(
      sequelize1,
      "Enq-Follow-up-Approver",
      compcode
    );

    // const compcode = 'arora';
    console.log(`⏳ Processing dealer: ${compcode}`);

    const sequelize = await dbname(
      {
        query: "",
        headers: {
          compcode: compcode,
          name: "scheduler",
        },
      },
      compcode
    );

    try {
      const [result] = await sequelize.query(`
       WITH LatestByTran AS (
    SELECT *,
           ROW_NUMBER() OVER (PARTITION BY Tran_Id ORDER BY SNo DESC) AS rn
    FROM Enq_Dtl
)
SELECT DISTINCT
    r.DSE_Gen
FROM LatestByTran e
JOIN RTL_MST r ON CAST(e.Tran_Id AS VARCHAR) = r.Tran_Id
WHERE
    e.rn = 1
    AND r.export_type < 33
    AND CAST(e.Plan_date AS DATE) >= CAST(DATEADD(DAY, -3, GETDATE()) AS DATE)
    AND CAST(e.Plan_date AS DATE) < CAST(GETDATE() AS DATE)
      `);

      if (!result.length) {
        console.log(`📭 No plan dates for dealer: ${compcode}`);
        continue;
      }

      for (const item of result) {
        try {
          const dse_Code = item.DSE_Gen;

          const [isApprovalRequired] = await sequelize.query(
            `SELECT Allot_Chassis_Appr FROM COMP_KEYDATA`
          );

          if (isApprovalRequired[0].Allot_Chassis_Appr == 1) {
            const CheckApprovalquery = `
              SELECT TOP 1 approver1_A
              FROM Approval_Matrix
              WHERE empcode = '${dse_Code}'
              AND module_code = 'Lead_Management'
            `;

            const [CheckApproval] = await sequelize.query(CheckApprovalquery);

            if (!CheckApproval.length) {
              console.warn(`⚠️ No approver mapped for user: ${dse_Code}`);
              continue;
            }

            const ApproverEmpCode = CheckApproval[0].approver1_A;

            const ApproverDetailsQuery = `
              SELECT
                (EMPFIRSTNAME + ' ' + EMPLASTNAME) AS fullName,
                MOBILE_NO , empcode
              FROM EMPLOYEEMASTER
              WHERE empcode = '${ApproverEmpCode}'
            `;

            const [ApproverDetails] = await sequelize.query(ApproverDetailsQuery);

            if (!ApproverDetails.length) {
              console.warn(`⚠️ Approver details not found for: ${ApproverEmpCode}`);
              continue;
            }

            const { MOBILE_NO: approverMobile, fullName: approverName, empcode: approverCode } = ApproverDetails[0];

            const [[company_info]] = await sequelize.query(`SELECT Comp_Name FROM comp_mst`);


            // Encode URL for approval link
            const encodedCompCode = Buffer.from(compcode.toString()).toString("base64");
            const encodedTranId = Buffer.from(approverCode.toString()).toString("base64");
            const approvalLink = `https://erp.autovyn.com/backend/quotation/renderGetAllPlanDateCustomers?compcode=${encodedCompCode}&Appr_id=${encodedTranId}`;
            // const shortLink = await shortenURL(approvalLink);

            // Send WhatsApp message to approver
            console.log(`📨 Sending message to approver ${approverName}`);

            await SendWhatsAppMessgae(
              compcode,
              approverMobile,
              "plan_date_reminder_approver1",
              [
                { type: "text", text: approverName || "UnKnown" },
                { type: "text", text: approvalLink },
                { type: "text", text: company_info?.Comp_Name || "UnKnown" },
              ]
            );
            logger.addImpact("WHATSAPP_APPROVER", ApproverEmpCode, 1);

          }
        } catch (itemErr) {
          logger.setError(itemErr);

          console.error(`❌ Error processing item for ${compcode}:`, itemErr.message);
        }
      }
    } catch (dealerErr) {
      logger.setError(dealerErr);

      console.error(`❌ Failed processing dealer ${compcode}:`, dealerErr.message);
    }
    try {
      await logger.save();
      writeDailySchedulerLog(logger.toJSON());
    } catch (logErr) {
      console.error("⚠️ Logger failed but scheduler continues:", logErr.message);
    }

  }
});

// Generate auto bookin in lead management 


schedule.scheduleJob("*/30 * * * *", async () => {
  console.log("🚀 Auto-Book Scheduler Started");

  const sequelizeMain = await dbname({ headers: { compcode: "DBCON" } }, "DBCON");

  const [dealers] = await sequelizeMain.query(`
    SELECT Dlr_Id FROM DLR_SCH
    WHERE export_type < 3 AND SCH_TYPE = 'Auto-Book'
  `);

  for (const dealer of dealers) {
    const compcode = dealer.Dlr_Id;
    const logger = new SchedulerLogger(
      sequelizeMain,
      "Auto-Book",
      compcode
    );

    console.log(`🏢 Processing Dealer: ${compcode}`);

    const sequelize = await dbname(
      {
        query: "",
        headers: {
          compcode: compcode,
          name: "scheduler",
        },
      },
      compcode
    );

    try {
      const [COMP_KEYDATA] = await sequelize.query(
        `select Auto_booking from COMP_KEYDATA`
      );

      const Auto_booking = COMP_KEYDATA[0].Auto_booking || 0;

      if (Number(Auto_booking) !== 1) {
        console.log(`⏭ Auto-Booking disabled for dealer ${compcode}`);
        await sequelize.close();
        continue;
      }


      const [rows] = await sequelize.query(`
        SELECT DISTINCT r.Tran_Id, r.Inv_No, r.inv_date, r.Loc_Code,ISNULL(ape.NC_ChasNo,''),
        ap.Ledg_Ac AS Ledg_Code, ap.Post_Amt,r.ph1,r.pan_no
        FROM Acnt_Post_Ext ape
        JOIN acnt_post ap ON ap.Acnt_Id = ape.Acnt_Id AND ap.Seq_No = 2
        JOIN RTL_MST r ON r.Loc_Code = ap.Loc_Code AND r.Inv_No = ape.NC_FileNo 
        WHERE r.tran_type = 1
        AND r.export_type < 3
        AND r.enq_stat not in (4,6,7,2,5) and isnull(r.ledg_code,0) = 0
        AND ape.Export_Type < 3
        AND NC_FileNo NOT LIKE '%[^0-9]%'
        AND (ISNULL(ape.NC_InvNo,'') <> '' or  ISNULL(ape.NC_ChasNo,'')<>'')
      `);

      if (!rows.length) {
        console.log(`📭 No records for ${compcode}`);
        continue;
      }

      for (const row of rows) {
        let t; // Declare transaction variable outside try-catch

        try {
          const { Tran_Id: tran_id, Inv_No, Ledg_Code, Post_Amt: Book_Amt, Loc_Code: loc_code, inv_date, ph1, pan_no } = row;

          console.log({ tran_id, Inv_No, Ledg_Code, Book_Amt, loc_code });

          // 🔹 Generate Booking No
          const [[prefix]] = await sequelize.query(
            `SELECT TOP 1 booking_no_prefix FROM Doc_prefix WHERE Loc_Code = :loc_code`,
            { replacements: { loc_code } }
          );

          const [[seqRes]] = await sequelize.query(
            `SELECT MAX(CAST(RIGHT(Book_No,4) AS INT)) AS last_id
             FROM rtl_mst WHERE Loc_code = :loc_code`,
            { replacements: { loc_code } }
          );

          const nextSeq = (seqRes.last_id || 0) + 1;
          const Book_No = `${prefix.booking_no_prefix}/${String(nextSeq).padStart(4, "0")}`;
          console.log(Book_No, "book_no");

          // 🔹 Begin transaction
          t = await sequelize.transaction();

          const [checkLedg] = await sequelize.query(
            `SELECT TOP 1 1 
             FROM rtl_mst 
             WHERE Ledg_Code = :Ledg_Code 
               AND tran_id <> :tran_id`,
            {
              replacements: { Ledg_Code, tran_id },
              transaction: t,
            }
          );

          const isAroraTest = compcode?.toLowerCase().startsWith("aroratest");

          if (!isAroraTest && checkLedg.length > 0) {
            console.log(`⏭ Skipped Tran ${tran_id} — Ledger already used`);
            logger.addSkip(1);
            await t.rollback();
            continue; // skip this row safely
          }

          const [checkRecipt] = await sequelize.query(`
            SELECT TOP 1 1
            FROM Acnt_Post_Ext
            WHERE NC_FileNo = :Inv_No
              AND Loc_Code = :loc_code
              AND (
                   (ISNULL(NC_ChasNo,'') <> '' AND NC_ChasNo = :ph1)
                OR (ISNULL(NC_InvNo,'')  <> '' AND NC_InvNo  = :pan_no)
              )
          `, {
            replacements: { Inv_No, loc_code, ph1, pan_no },
            transaction: t
          });

          if (checkRecipt.length === 0) {
            console.log(`⏭ Skipped Tran ${tran_id} — Receipt not created`);
            logger.addSkip(1);
            await t.rollback();
            continue;
          }


          // 🔹 Update Booking
          await sequelize.query(
            `UPDATE RTL_MST
             SET Book_Date = GETDATE(),
                 Book_Rem = 'Auto-Book',
                 Book_No = :Book_No,
                 Ledg_Code = :Ledg_Code,
                 Enq_Stat = 6,
                 Book_Amt = :Book_Amt
             WHERE tran_id = :tran_id AND Tran_type = 1 AND Loc_code = :loc_code and export_type <3`,
            { replacements: { Book_No, Ledg_Code, Book_Amt, tran_id, loc_code }, transaction: t }
          );
          logger.addImpact("RTL_MST", tran_id, 1);
          // 🔹 Fetch Receipts
          const [receipts] = await sequelize.query(
            `SELECT CAST(a.Export_Type AS INT) AS Export_Type,
                    CAST(a.Acnt_Date AS DATE) AS Acnt_Date,
                    a.Post_Amt,
                    m.Misc_Name AS mode_of_payment
             FROM ACNT_POST a
             JOIN misc_mst m ON a.Cost_Cntr = m.Misc_Code
             WHERE a.Ledg_Ac = :Ledg_Code
               AND a.Loc_Code = :loc_code
               AND a.Export_Type < 33
               AND a.Acnt_Type = 1
               AND m.Misc_Type = 39
               union all
               SELECT CAST(a.Export_Type AS INT) AS Export_Type,
                    CAST(a.Acnt_Date AS DATE) AS Acnt_Date,
                    a.Post_Amt,
                    'JV-BAL-TRF'AS mode_of_payment
             FROM ACNT_POST a
             WHERE a.Ledg_Ac = :Ledg_Code
               AND a.Loc_Code = :loc_code
                AND a.Export_Type < 33
               AND a.Acnt_Type = 3
                and IsNull(Rect_type,0)=4
               `,
            { replacements: { Ledg_Code, loc_code }, transaction: t }
          );

          console.log("Receipts found:", receipts);

          // 🔹 Insert Refund Booking Entries - Fixed MERGE query
          let sNo = 1;
          for (const r of receipts) {
            console.log(`Inserting receipt ${sNo}:`, {
              Tran_Id: tran_id,
              book_date: r.Acnt_Date,
              book_mode: r.mode_of_payment,
              book_Amt: r.Post_Amt,
              Export_Type: r.Export_Type
            });

            // Try a simpler INSERT/UPDATE approach instead of MERGE
            // First check if record exists
            const [existing] = await sequelize.query(
              `SELECT COUNT(*) as count FROM rtl_booking 
               WHERE Tran_Id = :Tran_Id AND SNo = :SNo`,
              {
                replacements: {
                  Tran_Id: tran_id,
                  SNo: sNo
                },
                transaction: t
              }
            );

            if (existing[0].count > 0) {
              // Update existing
              await sequelize.query(
                `UPDATE rtl_booking 
                 SET Tran_Type = :Tran_Type,
                     book_date = :book_date,
                     book_mode = :book_mode,
                     book_Amt = :book_Amt,
                     Loc_Code = :Loc_Code,
                     Export_Type = :Export_Type,
                     ServerId = :ServerId
                 WHERE Tran_Id = :Tran_Id AND SNo = :SNo`,
                {
                  replacements: {
                    Tran_Id: tran_id,
                    Tran_Type: 1,
                    SNo: sNo,
                    book_date: r.Acnt_Date,
                    book_mode: r.mode_of_payment,
                    book_Amt: r.Post_Amt,
                    Loc_Code: loc_code,
                    Export_Type: r.Export_Type,
                    ServerId: 1
                  },
                  transaction: t,
                }
              );
              logger.addImpact("rtl_booking", tran_id, 1);
            } else {
              // Insert new
              await sequelize.query(
                `INSERT INTO rtl_booking (
                  Tran_Id, Tran_Type, SNo, book_date, book_mode, book_Amt,
                  Loc_Code, Export_Type, ServerId
                ) VALUES (
                  :Tran_Id, :Tran_Type, :SNo, :book_date, :book_mode, :book_Amt,
                  :Loc_Code, :Export_Type, :ServerId
                )`,
                {
                  replacements: {
                    Tran_Id: tran_id,
                    Tran_Type: 1,
                    SNo: sNo,
                    book_date: r.Acnt_Date,
                    book_mode: r.mode_of_payment,
                    book_Amt: r.Post_Amt,
                    Loc_Code: loc_code,
                    Export_Type: r.Export_Type,
                    ServerId: 1
                  },
                  transaction: t,
                }
              );
              logger.addImpact("rtl_booking", tran_id, 1);

            }
            sNo++;
          }

          await t.commit();
          console.log(`✅ Booking Completed: ${tran_id}`);

        } catch (err) {
          logger.setError(err);

          console.error(`❌ Transaction Error for Tran_Id ${row.Tran_Id}:`, err);

          // Only rollback if transaction exists
          if (t) {
            try {
              // Check if transaction is still active
              if (!t.finished) {
                await t.rollback();
                console.log(`🔄 Transaction rolled back for ${row.Tran_Id}`);
              } else {
                console.log(`ℹ️ Transaction already finished for ${row.Tran_Id}`);
              }
            } catch (rollbackErr) {
              console.error(`❌ Rollback failed for ${row.Tran_Id}:`, rollbackErr.message);
            }
          }
        }
      }

    } catch (err) {
      logger.setError(err);
      console.log(`💥 Dealer Error ${compcode}:`, err.message);
    } finally {
      await sequelize.close();
      console.log(`🔌 Connection closed for ${compcode}`);
    }
    try {
      await logger.save();
      writeDailySchedulerLog(logger.toJSON());
    } catch (logErr) {
      console.error("⚠️ Logger failed but scheduler continues:", logErr.message);
    }

  }

  console.log("🏁 Scheduler Finished");
});

// auto close previous gatepass request
schedule.scheduleJob("5 0 * * *", async () => {
  console.log("🚀 Auto-close Scheduler Started");

  const sequelizeMain = await dbname({ headers: { compcode: "DBCON" } }, "DBCON");

  const [dealers] = await sequelizeMain.query(`
    SELECT Dlr_Id FROM DLR_SCH
    WHERE export_type < 3 AND SCH_TYPE = 'Auto-close-prev-gp'
  `);

  for (const dealer of dealers) {
    const compcode = dealer.Dlr_Id;
    const logger = new SchedulerLogger(
      sequelizeMain,
      "Auto-close-prev-gp",
      compcode
    );

    console.log(`🏢 Processing Dealer: ${compcode}`);

    const sequelize = await dbname(
      {
        query: "",
        headers: {
          compcode: compcode,
          name: "scheduler",
        },
      },
      compcode
    );

    try {
      const [COMP_KEYDATA] = await sequelize.query(
        `select Auto_close_GP from COMP_KEYDATA`
      );

      const Auto_close_GP = COMP_KEYDATA[0].Auto_close_GP || 0;

      if (Number(Auto_close_GP) !== 1) {
        console.log(`⏭ Auto-close disabled for dealer ${compcode}`);
        await sequelize.close();
        continue;
      }


      const [rows] = await sequelize.query(`
       select * from dig_gp
        WHERE IS_ACTIVE = 1
          AND CAST(REQ_DATE AS DATE) <= CAST(DATEADD(DAY, -1, GETDATE()) AS DATE);
      `);

      console.log(rows)

      if (!rows.length) {
        console.log(`📭 No records for ${compcode}`);
        continue;
      }
      else {
        await sequelize.query(`UPDATE DIG_GP
          SET CLOSE_DATE = GETDATE(),
              CLOSE_REM  = 'auto-close',
              IS_ACTIVE  = 0,
              IS_CLOSE   = 1
          WHERE IS_ACTIVE = 1
            AND CAST(REQ_DATE AS DATE) <= CAST(DATEADD(DAY, -1, GETDATE()) AS DATE)`)
        logger.addImpact("DIG_GP", null, rows.length);
      }

    } catch (err) {

      logger.setError(err);

      console.log(`💥 Dealer Error ${compcode}:`, err.message);
    } finally {
      await sequelize.close();
      console.log(`🔌 Connection closed for ${compcode}`);
    }
    try {
      await logger.save();
      writeDailySchedulerLog(logger.toJSON());
    } catch (logErr) {
      console.error("⚠️ Logger failed but scheduler continues:", logErr.message);
    }

  }

  console.log("🏁 Scheduler Finished");
});



// Leave auto reject
schedule.scheduleJob("15 8 * * *", async () => {

  const sequelize1 = await dbname(
    {
      query: "",
      headers: {
        compcode: "DBCON",
        name: "scheduler",
      },
    },
    "DBCON"
  );

  const [Dlr_data] = await sequelize1.query(`
    SELECT * FROM DLR_SCH
    WHERE SCH_TYPE = 'Pyr-Auto-Rej'
      AND export_type < 3
  `);

  if (!Dlr_data.length) {
    console.log("🚫 No dealers found with a valid schedule.");
    return;
  }

  for (const dealer of Dlr_data) {
    const compcode = dealer.Dlr_Id;
    const logger = new SchedulerLogger(
      sequelize1,
      "Pyr-Auto-Rej",
      compcode
    );


    // const compcode = 'arora';
    console.log(`⏳ Processing dealer: ${compcode}`);

    const sequelize = await dbname(
      {
        query: "",
        headers: {
          compcode: compcode,
          name: "scheduler",
        },
      },
      compcode
    );

    const [COMP_KEYDATA] = await sequelize.query(
      `select Lev_Auto_Rej from COMP_KEYDATA`
    );

    const Lev_Auto_Rej = COMP_KEYDATA[0].Lev_Auto_Rej || 7;

    try {
      const [result] = await sequelize.query(`
       select * from attendancetable where mipunch_reason in (4,5,6,9,10,104,120,121)
        and MAN_APPR <> 'Y' AND DATEDIFF(DAY, CAST(Leave_applied_on AS DATE),CAST(GETDATE() AS DATE)) > ${Lev_Auto_Rej} 
      `);

      if (!result.length) {
        console.log(`📭 No plan dates for dealer: ${compcode}`);
        continue;
      }
      console.log("result", result.length)

      for (const raw of result) {
        const t = await sequelize.transaction();
        try {

          // Normalized access
          const data = raw; // we'll use getField for fields

          // 2️⃣ detect miss-punch type
          const mp_in = getField(data, "mp_in1");
          const mp_out = getField(data, "mp_out1");

          let caseType = "";
          if (mp_in && !mp_out) caseType = "PUNCH_IN_MISS";
          else if (!mp_in && mp_out) caseType = "PUNCH_OUT_MISS";
          else if (mp_in && mp_out) caseType = "BOTH_MISS";
          else caseType = "LEAVE_CASE";

          console.log("🧠 Miss-Punch Type Detected:", caseType);

          // earliest helper (handles string/Date)
          function earliest(a, b) {
            if (a && b) return new Date(a) < new Date(b) ? a : b;
            return a || b || null;
          }

          // compute new IN1 / OUT1 based on BM_ and APP_ fields
          const bmIn = getField(data, "BM_IN1");
          const appIn = getField(data, "App_in1");
          const bmOut = getField(data, "BM_OUT1");
          const appOut = getField(data, "App_out1");

          let newIN1 = getField(data, "in1") || null;
          let newOUT1 = getField(data, "out1") || null;

          let cnewIN1 = getField(data, "in1") || null;
          let cnewOUT1 = getField(data, "out1") || null;

          let cnewIN2 = getField(data, "in2") || null;
          let cnewOUT2 = getField(data, "out2") || null;

          if (caseType === "PUNCH_IN_MISS" || caseType === "BOTH_MISS") {
            newIN1 = earliest(bmIn, appIn);
          }
          if (caseType === "PUNCH_OUT_MISS" || caseType === "BOTH_MISS") {
            newOUT1 = earliest(bmOut, appOut);
          }

          // Clean datetime strings for SQL (no timezone)
          const clean_in1 = cleanDate(newIN1);
          const clean_out1 = cleanDate(newOUT1);
          const clean_cin1 = cleanDate(cnewIN1);
          const clean_cout1 = cleanDate(cnewOUT1);
          const clean_cin2 = cleanDate(cnewIN2);
          const clean_cout2 = cleanDate(cnewOUT2);
          const clean_dateoffice = cleanDate(getField(data, "dateoffice"));
          const clean_Appr_1_date = cleanDate(getField(data, "Appr_1_date"));
          const clean_Appr_2_date = cleanDate(getField(data, "Appr_2_date"));
          const clean_Appr_3_date = cleanDate(getField(data, "Appr_3_date"));
          const clean_mp_in1 = cleanDate(getField(data, "mp_in1"));
          const clean_mp_out1 = cleanDate(getField(data, "mp_out1"));

          await sequelize.query(
            `
  INSERT INTO pyr_Rej_req (
    EMPCODE, DATEOFFICE, STATUS, MAN_APPR, In1Mannual, Man_Recomend, MAN_REJ,
    Mipunch_Reason, MI_Remark, Spl_Remark, 
    Appr_1_Code, Appr_2_Code, Appr_3_Code,
    Appr_1_Stat, Appr_2_Stat, Appr_3_Stat,
    Appr_1_Rem, Appr_2_Rem, Appr_3_Rem,
    Appr_1_Date, Appr_2_Date, Appr_3_Date,
    MI_TYPE, MIS_ENTERBY, SHORT_LEV,
    IN2, IN1, OUT1, MP_IN1, MP_OUT1,
    Created_By, Created_At,out1mannual,out2,export_type
  )
  VALUES (
    :Emp_Code, :dateoffice, :status, :MAN_APPR, :in1mannual, :Man_Recomend, :MAN_REJ,
    :mipunch_reason, :MI_Remark, :SPL_REMARK,
    :Appr_1_Code, :Appr_2_Code, :Appr_3_Code,
    :Appr_1_Stat, :Appr_2_Stat, :Appr_3_Stat,
    :Appr_1_Rem, :Appr_2_Rem, :Appr_3_Rem,
    :Appr_1_date, :Appr_2_date, :Appr_3_date,
    :Mi_Type, :Mis_Enterby, :Short_Lev,
    :in2, :in1, :out1, :mp_in1, :mp_out1,
    :Created_By, GETDATE(),:out1mannual,:out2,1
  )
  `,
            {
              replacements: {
                Emp_Code: data.Emp_Code?.trim(),
                dateoffice: clean_dateoffice,
                status: data.status,
                MAN_APPR: data.MAN_APPR,
                in1mannual: data.in1mannual,
                Man_Recomend: data.Man_Recomend,
                MAN_REJ: data.MAN_REJ,

                mipunch_reason: data.mipunch_reason,
                MI_Remark: data.MI_Remark,
                SPL_REMARK: data.SPL_REMARK,

                Appr_1_Code: data.Appr_1_Code,
                Appr_2_Code: data.Appr_2_Code,
                Appr_3_Code: data.Appr_3_Code,

                Appr_1_Stat: data.Appr_1_Stat,
                Appr_2_Stat: data.Appr_2_Stat,
                Appr_3_Stat: data.Appr_3_Stat,

                Appr_1_Rem: data.Appr_1_Rem,
                Appr_2_Rem: data.Appr_2_Rem,
                Appr_3_Rem: data.Appr_3_Rem,

                Appr_1_date: clean_Appr_1_date,
                Appr_2_date: clean_Appr_2_date,
                Appr_3_date: clean_Appr_3_date,

                Mi_Type: data.Mi_Type,           // EXACT same as your object
                Mis_Enterby: data.Mis_Enterby,
                Short_Lev: data.Short_Lev,
                out1mannual: data.out1mannual,

                in2: clean_cin2,
                in1: clean_cin1,
                out1: clean_cout1,
                out2: clean_cout2,

                mp_in1: clean_mp_in1,
                mp_out1: clean_mp_out1,
                Created_By: data.Canc_By,
              },
              transaction: t
            }
          );
          logger.addImpact("pyr_Rej_req", data.UTD, 1);



          console.log("✅ Inserted in pyr_Rej_req");

          // 5️⃣ Update attendancetable with cleaned IN/OUT and reset fields
          await sequelize.query(
            `
      UPDATE attendancetable
      SET 
        Canc_Fin = null,
        Status = 'A',
        IN1 = :in1,
        OUT1 = :out1,
        Man_Appr = NULL,
        In1Mannual = NULL,
        Man_Recomend = NULL,
        Man_Rej = NULL,
        Mipunch_Reason = NULL,
        MI_Remark = NULL,
        SPL_REMARK = NULL,
        Appr_1_Code = NULL,
        Appr_2_Code = NULL,
        Appr_3_Code = NULL,
        Appr_3_Stat = NULL,
        Appr_2_Stat = NULL,
        Appr_1_Stat = NULL,
        Appr_1_Rem = NULL,
        Appr_2_Rem = NULL,
        Appr_3_Rem = NULL,
        APPR_1_DATE = NULL,
        APPR_2_DATE = NULL,
        APPR_3_DATE = NULL,
        Mis_Enterby = NULL,
        in2 = :in1,
        out2 = :out1,
        Leave_applied_on= NULL,
        Mispunch_applied_on = NULL,
        Mispunch_out_applied_on = Null,
        SHORT_LEV = NULL
      WHERE UTD = :UTD 
      `,
            {
              replacements: {
                in1: clean_in1,
                out1: clean_out1,
                UTD: getField(data, "UTD"),
                empCode: getField(data, "Emp_Code"),
              },
              transaction: t
            }
          );
          logger.addImpact("attendancetable", data.UTD, 1);

          await t.commit();
          console.log(`✅ Transaction committed for dealer: ${compcode}`);


        } catch (itemErr) {
          logger.setError(itemErr);

          await t.rollback();   // <-- Important!
          console.error(`❌ Error processing item for ${compcode}:`, itemErr.message);
          continue; // next row
        }
      }
    } catch (dealerErr) {
      logger.setError(dealerErr);

      console.error(`❌ Failed processing dealer ${compcode}:`, dealerErr.message);
    }
    try {
      await logger.save();
      writeDailySchedulerLog(logger.toJSON());
    } catch (logErr) {
      console.error("⚠️ Logger failed but scheduler continues:", logErr.message);
    }


  }
});

 // laps comp off balance
schedule.scheduleJob("45 19 * * *", async () => {
const schedulerStartTime = new Date();
let totalDealers = 0;
let totalLapsedRecords = 0;
let totalErrors = 0;
  console.log("🚀 Scheduler Started...");

  const sequelize1 = await dbname(
    {
      query: "",
      headers: { compcode: "DBCON", name: "scheduler" },
    },
    "DBCON"
  );

  console.log("🔍 Fetching Dealers...");

  const [Dlr_data] = await sequelize1.query(`
    SELECT * FROM DLR_SCH
    WHERE SCH_TYPE = 'comp-off-laps'
      AND export_type < 3
  `);

  console.log(`📦 Dealers Found: ${Dlr_data.length}`);

  if (!Dlr_data.length) return console.log("🚫 No dealers found.");

  for (const dealer of Dlr_data) {
    totalDealers++;
    const compcode = dealer.Dlr_Id;
      const logger = new SchedulerLogger(
    sequelize1,
    "comp-off-laps",
    compcode
  );
    console.log(`\n============================================`);
    console.log(`⏳ Processing Dealer: ${compcode}`);
    console.log(`============================================`);

    const sequelize = await dbname(
      {
        query: "",
        headers: { compcode: compcode, name: "scheduler" },
      },
      compcode
    );

    const [COMP_KEYDATA] = await sequelize.query(`select laps_days from COMP_KEYDATA`);
    const laps_days = COMP_KEYDATA[0]?.laps_days || 30;

    console.log(`📌 LAPS Days for ${compcode}: ${laps_days}`);

    try {
      const [result1] = await sequelize.query(`select * from COMP_OFF_DTL where laps_date is null and export_type < 3 and APPR_STAT = 0 and DATEDIFF(DAY, CAST([DATE] AS DATE), CAST(GETDATE() AS DATE)) >= 
         (select top 1 iif(ISNULL(laps_days,0) = 0,365,ISNULL(laps_days,0)) from COMP_KEYDATA)`)

         await sequelize.query(
          `
          UPDATE COMP_OFF_DTL
          SET laps_date = DATEADD(DAY, :laps_days, [DATE])
          WHERE laps_date IS NULL
            AND APPR_STAT = 0
            and export_type < 3
            AND DATEDIFF(DAY, CAST([DATE] AS DATE), CAST(GETDATE() AS DATE)) >= 
                (SELECT TOP 1 IIF(ISNULL(laps_days,0)=0,365,ISNULL(laps_days,0)) FROM COMP_KEYDATA)
          `,
          {
            replacements: { laps_days },
          }
        );
        logger.addImpact("COMP_OFF_DTL_LAPS_DATE", null, result1.length);


      const [result] = await sequelize.query(`
       select a.UTD,a.* from COMP_OFF_DTL a
        where a.CO_TYPE = '9' 
          and (ISNULL(a.CO_BAL,0) - ISNULL(a.CO_RESERVED,0)) > 0
          and ISNULL(a.CO_RESERVED,0) = 0
          and a.export_type < 3
         and DATEDIFF(DAY, CAST(a.[DATE] AS DATE), CAST(GETDATE() AS DATE)) >= 
         (select top 1 iif(ISNULL(laps_days,0) = 0,365,ISNULL(laps_days,0)) from COMP_KEYDATA)
      `);

      

      console.log(`📄 Records found: ${result.length}`);
      console.log("results", result);

      if (!result.length) continue;

      for (const raw of result) {
        console.log(`\n➡️ Processing UTD: ${raw.UTD}, Emp: ${raw.EMPCODE}`);
        const freeBal = raw.CO_BAL - (raw.CO_RESERVED || 0);

        const t = await sequelize.transaction();
        try {
          console.log(`📝 Updating COMP_OFF_DTL For Lapsing...`);

          await sequelize.query(
            `UPDATE COMP_OFF_DTL 
                SET 
                  LAPS_VAL = ISNULL(LAPS_VAL,0) + (CO_BAL - ISNULL(CO_RESERVED,0)),
                  CO_BAL = ISNULL(CO_RESERVED,0),
                  laps_date = DATEADD(DAY, :laps_days, [DATE])
                WHERE UTD = :UTD
                  and (ISNULL(CO_BAL,0) - ISNULL(CO_RESERVED,0)) > 0`,
            {
              replacements: { UTD: raw.UTD,laps_days: laps_days },
              transaction: t
            }
          );
          totalLapsedRecords++;
          logger.addImpact("COMP_OFF_DTL", raw.UTD, 1);

          console.log(`✔️ Lapsing update done for UTD ${raw.UTD}`);

          // CUSTOM MONTH LOGIC
          const data = raw;

          const monthTo = getCustomMonth(data.DATE);
          console.log("🗓 Custom Month Output:", monthTo);

          const query1 = `
            SELECT Misc_Dtl1, Misc_Dtl2 
            FROM misc_mst 
            WHERE Misc_Type = 25 AND Misc_Code = ${monthTo.customMonth}
          `;
          console.log("🔍 Checking custom month entry:", query1);

          const result5 = await sequelize.query(query1);

          const miscDtl1 = result5[0][0]?.Misc_Dtl1;
          const miscDtl2 = result5[0][0]?.Misc_Dtl2;

          let month, year;

          if (miscDtl1 && miscDtl2) {
            console.log("📌 Using custom cycle month");
            year = monthTo.customYear;
            month = monthTo.customMonth;
          } else {
            const dt = new Date(data.DATE);
            month = dt.getMonth() + 1;
            year = dt.getFullYear();
            console.log(`📌 Using normal calendar month: ${month}-${year}`);
          }
          const formatDateOnly = (dt) => {
            return new Date(dt).toISOString().slice(0, 10);
          };
          const comp = compcode
      console.log("comp",comp)
          if ((comp === 'mlapl' || comp === 'mtest') ) {
      console.log("comp1",comp)
      await sequelize.query(`INSERT INTO dbo.GLB_LEAVE_BAL (EMPCODE, DATEOFFICE, LEAVE_TYPE, LEAVE_VAL, TRAN_TYPE, CREATED_AT, CREATED_BY) 
        VALUES ('${data.EMPCODE}', '${formatDateOnly(data.DATE)}', 9, ${freeBal}, 3, GETDATE(), '${data.EMPCODE}')`) 
    }

          // UPDATE Leave_BAL
          console.log(`📝 Updating Leave_BAL for Emp ${data.EMPCODE}, Month ${month}-${year}`);

          await sequelize.query(
            `
            UPDATE Leave_BAL
            SET 
              Gen_Lev = ISNULL(Gen_Lev,0) - :coBal,
              Cl_Bal = ISNULL(Op_Bal,0) + (ISNULL(Gen_Lev,0) - :coBal) - ISNULL(Avail_Lev,0)
            WHERE 
              Emp_Code = :candCode 
              AND Leave_Type = '9' 
              AND Leave_Mnth = :month 
              AND Leave_Yr = :year
            `,
            {
              replacements: {
              coBal: freeBal,
              candCode: data.EMPCODE,
              month,
              year,
            },
              transaction: t
            }
          );
          logger.addImpact("Leave_BAL", raw.UTD, 1);

          console.log(`✔️ Leave_BAL Updated`);

          console.log("🔁 Calling recalcNextMonths...");
          await recalcNextMonths(sequelize, data.EMPCODE, month, year, t);

          await t.commit();
          console.log(`✅ UTD ${raw.UTD} Completed Successfully`);

        } catch (itemErr) {
          totalErrors++;
          logger.setError(itemErr);
          await t.rollback();
          console.error(`❌ ERROR at UTD ${raw.UTD}:`, itemErr);
        }
      }

    } catch (dealerErr) {
      totalErrors++;
      logger.setError(dealerErr);
      console.error(`❌ Dealer Processing Failed (${compcode}):`, dealerErr);
    } finally {
  try {
    await logger.save();
    writeDailySchedulerLog(logger.toJSON());
  } catch (logErr) {
    console.error("⚠️ Logger failed but scheduler continues:", logErr.message);
  }

  await sequelize.close();
  console.log(`🔌 Connection closed for ${compcode}`);
}

  }
const schedulerEndTime = new Date();

const durationMs = schedulerEndTime - schedulerStartTime;
const durationSec = Math.floor(durationMs / 1000);

const startTimeStr = schedulerStartTime.toLocaleString();
const endTimeStr = schedulerEndTime.toLocaleString();
const durationStr = `${durationSec} sec`;

const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const statusText =
  totalErrors > 0
    ? "Completed With Errors ⚠️"
    : "SUCCESS ✅";

// 🔹 Admin number (jo bhi fixed number hai)
const adminMobile = "8949764086";

await SendWhatsAppMessgae(
  "mlapl", // ya fixed compcode
  adminMobile,
  "comp_off_laps_scheduler_report",
  [
    { type: "text", text: startTimeStr },
    { type: "text", text: endTimeStr },
    { type: "text", text: durationStr },
    { type: "text", text: totalDealers.toString() },
    { type: "text", text: totalLapsedRecords.toString() },
    { type: "text", text: totalErrors.toString() },
    { type: "text", text: timezone },
    { type: "text", text: statusText },
  ]
);

  console.log("\n🎉 Scheduler Finished");

});

// // carry forward leave balance
schedule.scheduleJob("30 8 * * *", async () => {

  console.log("🚀 Scheduler Started...");

  const sequelize1 = await dbname(
    {
      query: "",
      headers: { compcode: "DBCON", name: "scheduler" },
    },
    "DBCON"
  );

  console.log("🔍 Fetching Dealers...");

  const [Dlr_data] = await sequelize1.query(`
    SELECT * FROM DLR_SCH
    WHERE SCH_TYPE = 'carry-Forw'
      AND export_type < 3
  `);

  console.log(`📦 Dealers Found: ${Dlr_data.length}`);

  if (!Dlr_data.length) return console.log("🚫 No dealers found.");

  const today = new Date().toISOString().split("T")[0];
  // Format: YYYY-MM-DD

  for (const dealer of Dlr_data) {
    const compcode = dealer.Dlr_Id;
    const sch_date = dealer.sch_date;   // already string like '2025-11-25'
    const Forw_Mnth = dealer.Forw_Mnth;
    // Extract day from sch_date
    const sch_day = sch_date.split("-")[2];  // "25"
    const logger = new SchedulerLogger(
      sequelize1,
      "carry-Forw",
      compcode
    );


    // Extract today's day
    const now = new Date();
    const today_day = String(now.getDate()).padStart(2, "0");

    console.log(`Dealer: ${compcode}, Sch_Day: ${sch_day}, Today_Day: ${today_day}`);

    // Compare only DAY (DD)
    if (sch_day !== today_day) {
      console.log("⏭️ Day not matched → Skipping...");
      logger.addSkip(1);
      continue;
    }

    console.log("✅ sch_date matched → Running Carry Forward Job...");

    const sequelize = await dbname(
      { query: "", headers: { compcode: compcode, name: "scheduler" } },
      compcode
    );
    let t;
    try {
      t = await sequelize.transaction();
      await carryForwardAllLeaves(sequelize, t, dealer.sch_leave_type, sch_date, Forw_Mnth, logger);
      await t.commit();
      console.log(`✔️ Dealer ${compcode} Carry Forward Completed`);
    } catch (err) {
      if (t) await t.rollback();
      logger.setError(err);
    }
    try {
      await logger.save();
      writeDailySchedulerLog(logger.toJSON());
    } catch (logErr) {
      console.error("⚠️ Logger failed but scheduler continues:", logErr.message);
    }


  }

  console.log("\n🎉 Scheduler Finished");
});

async function carryForwardAllLeaves(sequelize, t, sch_leave_type, sch_date, forwMonths, logger) {
  console.log("\n============================");
  console.log("🔁 Starting Carry Forward Job");
  console.log("============================\n");

  const today = new Date();

  const monthTo = getCustomMonth(sch_date);
  console.log("🗓 Custom Month Output:", monthTo);

  const query1 = `
    SELECT Misc_Dtl1, Misc_Dtl2 
    FROM misc_mst 
    WHERE Misc_Type = 25 AND Misc_Code = ${monthTo.customMonth}
  `;
  console.log("🔍 Checking custom month entry:", query1);

  const result5 = await sequelize.query(query1, { transaction: t });
  const miscDtl1 = result5[0][0]?.Misc_Dtl1;
  const miscDtl2 = result5[0][0]?.Misc_Dtl2;

  let prevMonth;
  let prevYear;

  if (miscDtl1 && miscDtl2) {
    console.log("📌 Using custom cycle month");
    prevYear = monthTo.customYear;
    prevMonth = monthTo.customMonth - 1;
  } else {
    prevMonth = today.getMonth(); // getMonth() returns 0-11 like before in your code, but original used it — keep consistent with your DB expectations
    prevYear = today.getFullYear();
    console.log(`📌 Using normal calendar month: ${prevMonth}-${prevYear}`);
  }

  // Adjust if zero (month 0 => previous year's December)
  if (prevMonth === 0) {
    prevMonth = 12;
    prevYear -= 1;
  }

  console.log(`📌 Carry Forward From (prev): ${prevMonth}-${prevYear}`);
  console.log(`📌 Months to forward (forwMonths): ${forwMonths}`);

  // Convert dealer leaveType string -> array
  const leaveTypes = sch_leave_type.split(",").map(x => x.trim());
  console.log("📜 Allowed Leave Types:", leaveTypes.join(", "));

  // Fetch only allowed leave types for previous month
  const [rows] = await sequelize.query(
    `
      SELECT Emp_Code, Leave_Type, Op_Bal, Gen_Lev, Avail_Lev, Cl_Bal
      FROM Leave_BAL
      WHERE Leave_Mnth = ${prevMonth}
        AND Leave_Yr = ${prevYear}
        AND Leave_Type IN (${leaveTypes.join(",")})
    `,
    { transaction: t }
  );

  console.log(`👥 Rows Found (Filtered): ${rows.length}`);

  if (!rows.length) {
    console.log("🚫 No Leave_BAL rows found for allowed leave types.");
    return;
  }

  for (const row of rows) {
    const emp = row.Emp_Code;
    const lType = row.Leave_Type;
    // start carryValue with previous month's closing balance
    let carryValue = Number(row.Cl_Bal ?? 0);

    console.log(`\n➡️ Emp: ${emp}, LeaveType: ${lType}, Initial Carry (prev Cl_Bal): ${carryValue}`);

    // iterate months 1..forwMonths, each time use previous computed Cl as Op_Bal for next
    for (let i = 1; i <= Number(forwMonths); i++) {
      // compute target month/year
      let targetMonth = prevMonth + i;
      let targetYear = prevYear;
      // handle year wrap
      while (targetMonth > 12) {
        targetMonth -= 12;
        targetYear += 1;
      }

      console.log(`➡️  Forwarding to: ${targetMonth}-${targetYear} (iteration ${i}) with Op_Bal = ${carryValue}`);

      // check if target row exists
      const [nextRows] = await sequelize.query(
        `
          SELECT Op_Bal, Gen_Lev, Avail_Lev
          FROM Leave_BAL
          WHERE Emp_Code = '${emp}'
            AND Leave_Type = '${lType}'
            AND Leave_Mnth = ${targetMonth}
            AND Leave_Yr = ${targetYear}
        `,
        { transaction: t }
      );

      if (!nextRows.length) {
        // insert with Op_Bal = carryValue, set Gen_Lev/Avail_Lev to 0 (or keep DB defaults)
        await sequelize.query(
          `
            INSERT INTO Leave_BAL
            (Emp_Code, Leave_Type, Leave_Mnth, Leave_Yr, Op_Bal, Gen_Lev, Avail_Lev, Cl_Bal)
            VALUES ('${emp}', '${lType}', ${targetMonth}, ${targetYear}, ${carryValue}, 0, 0, ${carryValue})
          `,
          { transaction: t }
        );
        // after insert, Gen_Lev and Avail_Lev are 0 so Cl_Bal equals Op_Bal (carryValue)
        console.log(`   ✳️ Inserted new row for ${targetMonth}-${targetYear} with Op_Bal=${carryValue}`);
      } else {
        // update existing Op_Bal to carryValue
        await sequelize.query(
          `
            UPDATE Leave_BAL
            SET Op_Bal = ${carryValue}
            WHERE Emp_Code = '${emp}'
              AND Leave_Type = '${lType}'
              AND Leave_Mnth = ${targetMonth}
              AND Leave_Yr = ${targetYear}
          `,
          { transaction: t }
        );
        console.log(`   ✳️ Updated Op_Bal for ${targetMonth}-${targetYear} to ${carryValue}`);
      }

      // fetch the (possibly new) values to compute Cl_Bal
      const [updated] = await sequelize.query(
        `
          SELECT Op_Bal, Gen_Lev, Avail_Lev
          FROM Leave_BAL
          WHERE Emp_Code = '${emp}'
            AND Leave_Type = '${lType}'
            AND Leave_Mnth = ${targetMonth}
            AND Leave_Yr = ${targetYear}
        `,
        { transaction: t }
      );

      const opBal = Number(updated[0].Op_Bal ?? 0);
      const genLev = Number(updated[0].Gen_Lev ?? 0);
      const availLev = Number(updated[0].Avail_Lev ?? 0);

      // compute closing balance for this month
      const newCl = opBal + genLev - availLev;

      // update Cl_Bal
      await sequelize.query(
        `
          UPDATE Leave_BAL
          SET Cl_Bal = ${newCl}
          WHERE Emp_Code = '${emp}'
            AND Leave_Type = '${lType}'
            AND Leave_Mnth = ${targetMonth}
            AND Leave_Yr = ${targetYear}
        `,
        { transaction: t }
      );

      console.log(`   ✅ Computed Cl_Bal for ${targetMonth}-${targetYear}: Op(${opBal}) + Gen(${genLev}) - Avail(${availLev}) = Cl(${newCl})`);
      logger.addImpact("Leave_BAL", emp, 1);

      // set carryValue for next iteration
      carryValue = newCl;
    } // end for months

    console.log(`✔️ Completed chained forward for Emp ${emp}, LeaveType ${lType}`);
  } // end for rows

  console.log("🎉 Carry Forward Job Completed Successfully");
}


async function sendEmail1(to, cc, subject, htmlBody, attachments) {
  try {
    console.log(to, cc, subject, htmlBody, attachments)
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "AUTOVYN.MAILER@gmail.com",
        pass: "lamdgvthpjetawtr",
      },
      tls: {
        rejectUnauthorized: false  // ← THIS IS THE FIX
      }
    });

    let mailOptions = {
      from: "AUTOVYN.MAILER@gmail.com",
      to: to,
      cc: cc,
      subject: subject,
      html: htmlBody,
      attachments: attachments
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error occurred while sending email:", error);
    throw error;
  }
}



function getMonthlyRange() {
  const today = new Date();

  // Yesterday
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  // 30 days before yesterday
  const past30 = new Date();
  past30.setDate(yesterday.getDate() - 30);

  const format = (d) => d.toISOString().slice(0, 10);

  return {
    datefrom: format(past30), // 30 days before yesterday
    dateto: format(yesterday), // yesterday (today excluded)
  };
}

// schedule.scheduleJob("0 * * * * *", async () => {
//   console.log("⏰ Running every minute for testing...");
// });

schedule.scheduleJob("0 10 * * *", async () => {
  // schedule.scheduleJob("0 * * * * *", async () => {
  console.log("📌 Running Scheduled Report Mail...");

  const { datefrom, dateto } = getMonthlyRange();
  console.log("Date Range:", datefrom, "to", dateto);

  const sequelize1 = await dbname(
    {
      query: "",
      headers: {
        compcode: "DBCON",
        name: "schedualer",
      },
    },
    "DBCON"
  );

  const [Dlr_data] = await sequelize1.query(
    `select * from DLR_SCH WHERE SCH_TYPE = 'SELF-LOAN' and export_type<3`
  );
  console.log("dlr_data", Dlr_data);

  for (const dealer of Dlr_data) {
    const compcode = dealer.Dlr_Id.toLowerCase();
    const logger = new SchedulerLogger(
      sequelize1,
      "SELF-LOAN",
      compcode
    );

    console.log(compcode, "compcode")
    await generateSelfLoanReport(compcode, datefrom, dateto, logger);
    try {
      await logger.save();
      writeDailySchedulerLog(logger.toJSON());
    } catch (logErr) {
      console.error("⚠️ Logger failed but scheduler continues:", logErr.message);
    }

  }

});


// ======================= Generate Report =======================

const ExcelJS = require("exceljs");
// const fs = require("fs");
// const path = require("path");

const generateSelfLoanReport = async (compcode, datefrom, dateto, logger) => {
  try {
    const sequelize = await dbname({ query: "", headers: { compcode } }, compcode);


    const [companyData] = await sequelize.query(`SELECT TOP 1 comp_name FROM Comp_Mst`);
    const companyName = companyData[0]?.comp_name || "Company";

    const query = `
      SELECT I.DMS_Inv as [DMS INVOICE], CONVERT(VARCHAR(10), I.INV_Date, 105) AS [INVOICE DATE],
             I.Cust_Id AS [CUSTOMER ID], I.Ledg_Name AS [Customer Name], I.Ph1 AS [PHONE NO], I.Pan_No AS [PAN NO], I.GST_No AS [GST NO],
             Fin.misc_name AS [Financier Name], Pay.misc_name AS [Finance Type],
             MG.misc_name AS [Model Group],
             (SELECT TOP 1 Modl_Name FROM Modl_Mst WHERE item_code = I.Modl_Code ORDER BY Modl_Name) AS [Model Name],
             Clr.misc_name AS [vehicle color], I.Chas_No, I.Engn_No,
              TL.EmpFirstName + ' ' + TL.EmpLastName AS Team_Leader,
              DSE.EmpFirstName + ' ' + DSE.EmpLastName AS DSE_Name,
             I.Spl_Rem as [SPL Remark], GD.Godw_Name AS [Location Name ], I.VIN, I.DO_AMT, I.Delv_Date as [Delivery Date]
      FROM ICM_MST I
      LEFT JOIN Misc_Mst Pay ON Pay.misc_code = I.Pymt_Mode AND Pay.misc_type = 18
      LEFT JOIN Misc_Mst Fin ON Fin.misc_code = I.Fin_Code AND Fin.misc_type = 8
      LEFT JOIN Misc_Mst MG ON MG.misc_code = I.Modl_Grp AND MG.misc_type = 14
      LEFT JOIN Misc_Mst Clr ON Clr.misc_code = I.Veh_Clr AND Clr.misc_type = 10
      LEFT JOIN EmployeeMaster TL ON TL.srno = I.ERP_TL
      LEFT JOIN EmployeeMaster DSE ON DSE.srno = I.ERP_DSE
      LEFT JOIN Godown_Mst GD ON GD.Godw_Code = I.Org_Loc
      WHERE I.Pymt_Mode = 6 AND I.Export_Type < 3
        AND CAST(I.INV_Date AS DATE) BETWEEN :datefrom AND :dateto
      ORDER BY I.INV_Date DESC
    `;

    // datefrom: '2025-01-01'
    const [rows] = await sequelize.query(query, { replacements: { datefrom, dateto } });
    console.log(rows, "rows")
    if (!rows.length) {
      console.log("No records found for self loan report");
      return;
    }

    // Create directory
    const exportDir = path.join(__dirname, "exports");

    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    // Excel generating
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Self Loan Report");

    worksheet.addRow([companyName]);
    worksheet.addRow(["Self Loan Report"]);
    worksheet.addRow(["Generated On:", new Date().toLocaleString()]);
    worksheet.addRow([]);

    const header = worksheet.addRow(Object.keys(rows[0]));
    header.font = { bold: true };

    rows.forEach(r => worksheet.addRow(Object.values(r)));

    const filename = path.join(exportDir, `SelfLoanReport_${Date.now()}.xlsx`);
    await workbook.xlsx.writeFile(filename);
    logger.addImpact("REPORT_GENERATED", null, rows.length);


    // Get email settings
    const emailQuery =
      `SELECT Mail_To, Mail_CC, Mail_Sub, Mail_body
       FROM Mail_Set
       WHERE Tran_Type = 101 AND Export_type < 3`;

    const [emailRows] = await sequelize.query(emailQuery);

    if (!emailRows.length) {
      console.log("No email config found in Mail_Set");
      return;
    }

    const mail = emailRows[0];
    console.log(mail, "mail")
    // Prepare email
    const to = mail.Mail_To;
    const cc = mail.Mail_CC || "";
    const subject = mail.Mail_Sub || "Daily Self Loan Report";
    const htmlBody = mail.Mail_body || "Please find attached Daily Self Loan Report.";

    const attachments = [
      { filename: "SelfLoanReport.xlsx", path: filename }
    ];

    // Send email
    await sendEmail1(to, cc, subject, htmlBody, attachments);
    logger.addImpact("EMAIL_SENT", null, 1);

    console.log("📤 Email sent with report:", filename);
  } catch (err) {
    logger.setError(err);

    console.log("❌ Self Loan Report Auto-Mail Error:", err.message);
  }
};


function formatDateLocal(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getMTDRange() {
  const now = new Date();

  const firstDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  return {
    datefrom: formatDateLocal(firstDay),
    dateto: formatDateLocal(today)
  };
}

function getYesterdayRange() {
  const now = new Date();

  const yesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1
  );

  return {
    datefrom: formatDateLocal(yesterday),
    dateto: formatDateLocal(yesterday)
  };
}

/* ---------------- SCHEDULER ---------------- */


schedule.scheduleJob("00 10 * * *", async () => {
  console.log("📌 Running Scheduled Report Mail...");

  const mtdRange = getMTDRange();
  const yesterdayRange = getYesterdayRange();

  console.log("MTD:", mtdRange);
  console.log("Yesterday:", yesterdayRange);

  const sequelize1 = await dbname(
    {
      query: "",
      headers: {
        compcode: "DBCON",
        name: "schedualer",
      },
    },
    "DBCON"
  );

  const [dlrData] = await sequelize1.query(`
    SELECT *
    FROM DLR_SCH
    WHERE SCH_TYPE = 'AVG-DISCOUNT'
      AND export_type < 3
  `);

  for (const dealer of dlrData) {
    const compcode = dealer.Dlr_Id.toLowerCase();
    const logger = new SchedulerLogger(
      sequelize1,
      "AVG-DISCOUNT",
      compcode
    );

    await generateAvgDiscountReport(compcode, mtdRange, yesterdayRange, logger);
    try {
      await logger.save();
      writeDailySchedulerLog(logger.toJSON());
    } catch (logErr) {
      console.error("⚠️ Logger failed but scheduler continues:", logErr.message);
    }


  }
});

/* ---------------- MAIN REPORT FUNCTION ---------------- */

const generateAvgDiscountReport = async (
  compcode,
  mtdRange,
  yesterdayRange,
  logger
) => {
  try {
    const sequelize = await dbname(
      { query: "", headers: { compcode } },
      compcode
    );

    const [companyData] = await sequelize.query(
      `SELECT TOP 1 comp_name FROM Comp_Mst`
    );
    const companyName = companyData[0]?.comp_name || "Company";

    const query = `
  WITH TotalCountCTE AS (
    SELECT
      im.LOC_CODE,
      im.MODL_GRP,
      COUNT(*) AS total_count
    FROM ICM_MST im
    WHERE im.Export_Type < 3
      AND im.MODL_GRP IS NOT NULL
      AND im.MODL_GRP != 0
      AND im.VEH_DEL = 1
      AND im.DELV_DATE IS NOT NULL
      AND im.DELV_DATE BETWEEN :datefrom AND :dateto
    GROUP BY im.LOC_CODE, im.MODL_GRP
  ),
  DiscountCTE AS (
    SELECT
      x.LOC_CODE,
      x.MODL_GRP,
      COUNT(DISTINCT CASE
        WHEN x.MSIL_DISC = 0
        AND x.VEH_DEL = 1
        AND x.DELV_DATE IS NOT NULL
        THEN x.TRAN_ID
      END) AS zero_discount_count,
      SUM(CASE
        WHEN x.MSIL_DISC != 0
        AND x.VEH_DEL = 1
        AND x.DELV_DATE IS NOT NULL
        AND x.rn = 1
        THEN x.MSIL_DISC
        ELSE 0
      END) AS total_dd_with_gst
    FROM (
      SELECT
        im.LOC_CODE,
        im.MODL_GRP,
        im.TRAN_ID,
        im.VEH_DEL,
        im.DELV_DATE,
        id.MSIL_DISC,
        ROW_NUMBER() OVER(PARTITION BY im.TRAN_ID ORDER BY id.MSIL_DISC DESC) AS rn
      FROM ICM_MST im
      JOIN ICM_DTL id ON id.TRAN_ID = im.TRAN_ID
      WHERE im.Export_Type < 3
        AND im.MODL_GRP IS NOT NULL
        AND im.MODL_GRP != 0
        AND im.DELV_DATE BETWEEN :datefrom AND :dateto
    ) x
    GROUP BY x.LOC_CODE, x.MODL_GRP
  ),
  GSTCTE AS (
    SELECT
      im.LOC_CODE,
      im.MODL_GRP,
      MAX(COALESCE(dr.CGST_Perc, 0) + COALESCE(dr.SGST_Perc, 0) + COALESCE(dr.IGST_Perc, 0) + COALESCE(dr.Cess_Perc, 0)) AS total_gst_perc
    FROM ICM_MST im
    JOIN DMS_ROW_DATA dr ON dr.BILL_NO = im.DMS_INV
    WHERE im.Export_Type < 3
      AND im.VEH_DEL = 1
      AND im.DELV_DATE IS NOT NULL
      AND im.DELV_DATE BETWEEN :datefrom AND :dateto
    GROUP BY im.LOC_CODE, im.MODL_GRP
  ),
  LocationTotalsCTE AS (
    SELECT
      tc.LOC_CODE,
      SUM(tc.total_count) AS location_total_count,
      SUM(COALESCE(dc.zero_discount_count, 0)) AS location_zero_discount_count,
      SUM(COALESCE(dc.total_dd_with_gst, 0)) AS location_total_dd_with_gst,
      CASE
        WHEN SUM(tc.total_count) > 0 AND SUM(COALESCE(dc.total_dd_with_gst, 0)) > 0
        THEN ROUND(SUM(COALESCE(dc.total_dd_with_gst, 0)) / SUM(tc.total_count), 2)
        ELSE 0
      END AS location_avg_dd_with_gst,
   CASE
  WHEN SUM(tc.total_count) > 0
  THEN ROUND(
    SUM(
      (
        CASE
          WHEN tc.total_count > 0
               AND dc.total_dd_with_gst > 0
          THEN
            (
              (dc.total_dd_with_gst /
               (1 + COALESCE(gst.total_gst_perc, 0) / 100.0)
              ) / tc.total_count
            ) * tc.total_count
          ELSE 0
        END
      )
    ) / SUM(tc.total_count),
    2
  )
  ELSE 0
END AS location_avg_dd_without_gst


    FROM TotalCountCTE tc
    LEFT JOIN DiscountCTE dc ON dc.LOC_CODE = tc.LOC_CODE AND dc.MODL_GRP = tc.MODL_GRP
    LEFT JOIN GSTCTE gst ON gst.LOC_CODE = tc.LOC_CODE AND gst.MODL_GRP = tc.MODL_GRP
    GROUP BY tc.LOC_CODE
  )
  SELECT
    gm.Godw_Name AS location_name,
    gm.BR_REGION,
    (
       SELECT MISC_NAME 
       FROM MISC_MST 
       WHERE MISC_TYPE = 91 
         AND MISC_CODE = gm.BR_REGION
         AND Export_Type < 3
    ) AS region_name,
    mm.Misc_Name AS model_name,
    tc.total_count AS total_count,
    COALESCE(dc.zero_discount_count, 0) AS zero_discount,
    COALESCE(dc.total_dd_with_gst, 0) AS total_dd_with_gst,
    CASE
      WHEN tc.total_count > 0 AND dc.total_dd_with_gst > 0
      THEN ROUND(dc.total_dd_with_gst / tc.total_count, 2)
      ELSE 0
    END AS avg_dd_with_gst,
    CASE
      WHEN tc.total_count > 0 AND dc.total_dd_with_gst > 0
      THEN ROUND(
    ( dc.total_dd_with_gst /
      (1 + COALESCE(gst.total_gst_perc, 0) / 100.0)
    ) / tc.total_count,
    2
  )
  ELSE 0
END AS avg_dd_without_gst,
    lt.location_total_count,
    lt.location_zero_discount_count,
    lt.location_total_dd_with_gst,
    lt.location_avg_dd_with_gst,
    lt.location_avg_dd_without_gst
  FROM TotalCountCTE tc
  LEFT JOIN DiscountCTE dc ON dc.LOC_CODE = tc.LOC_CODE AND dc.MODL_GRP = tc.MODL_GRP
  LEFT JOIN GSTCTE gst ON gst.LOC_CODE = tc.LOC_CODE AND gst.MODL_GRP = tc.MODL_GRP
  LEFT JOIN Godown_Mst gm ON gm.Godw_Code = tc.LOC_CODE
  LEFT JOIN MISC_MST mm ON mm.MISC_Code = tc.MODL_GRP
    AND mm.MISC_type = 14
    AND mm.Export_Type < 3
  LEFT JOIN LocationTotalsCTE lt ON lt.LOC_CODE = tc.LOC_CODE
  ORDER BY gm.Godw_Name, mm.Misc_Name;
`;


    const [mtdRows] = await sequelize.query(query, {
      replacements: mtdRange
    });

    const [yesterdayRows] = await sequelize.query(query, {
      replacements: yesterdayRange
    });

    if (!mtdRows.length && !yesterdayRows.length) return;

    const exportDir = path.join(__dirname, "exports");
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    const workbook = new ExcelJS.Workbook();

    buildAvgDiscountSheet(
      workbook,
      "MTD Report",
      mtdRows,
      companyName,
      mtdRange.datefrom,
      mtdRange.dateto
    );

    buildAvgDiscountSheet(
      workbook,
      "Yesterday Report",
      yesterdayRows,
      companyName,
      yesterdayRange.datefrom,
      yesterdayRange.dateto
    );

    const filename = path.join(
      exportDir,
      `AverageDiscountReport_${Date.now()}.xlsx`
    );

    await workbook.xlsx.writeFile(filename);
    logger.addImpact("REPORT_GENERATED", null, (mtdRows.length + yesterdayRows.length));

    const [emailRows] = await sequelize.query(`
      SELECT Mail_To, Mail_CC, Mail_Sub, Mail_body
      FROM Mail_Set
      WHERE Tran_Type = 102
        AND Export_type < 3
    `);

    if (!emailRows.length) return;

    const mail = emailRows[0];

    await sendEmail1(
      mail.Mail_To,
      mail.Mail_CC || "",
      mail.Mail_Sub || "Average Discount Report",
      mail.Mail_body || "Please find attached report.",
      [{ filename: path.basename(filename), path: filename }]
    );
    logger.addImpact("EMAIL_SENT", null, 1);

    console.log("📤 Email sent:", filename);

  } catch (err) {
    logger.setError(err);
    console.log("❌ Error:", err);
  }
};

/* ---------------- SHEET BUILDER ---------------- */

const formatDateDMY = (dateStr) => {
  if (!dateStr) return "";
  const [yyyy, mm, dd] = dateStr.split("-");
  return `${dd}-${mm}-${yyyy}`;
};


const buildAvgDiscountSheet = (
  workbook,
  sheetName,
  rows,
  companyName,
  datefrom,
  dateto
) => {
  const ws = workbook.addWorksheet(sheetName);

  const TOTAL_COLUMNS = 6;

  /* ---------- COMPANY HEADER ---------- */
  ws.mergeCells(1, 1, 1, TOTAL_COLUMNS);
  ws.mergeCells(2, 1, 2, TOTAL_COLUMNS);
  ws.mergeCells(3, 1, 3, TOTAL_COLUMNS);

  ws.getRow(1).getCell(1).value = companyName;
  ws.getRow(2).getCell(1).value = "Average Discount Report";
  ws.getRow(3).getCell(1).value =
    `Period: ${formatDateDMY(datefrom)} to ${formatDateDMY(dateto)}`;


  [1, 2, 3].forEach(rowNum => {
    ws.getRow(rowNum).getCell(1).alignment = {
      horizontal: "center",
      vertical: "middle"
    };
    ws.getRow(rowNum).font = {
      bold: true,
      size: rowNum === 1 ? 14 : 12
    };
  });

  ws.addRow([]);

  /* ---------- TABLE HEADER ---------- */
  const headerRow = ws.addRow([
    "Model",
    "Total Count",
    "Zero Discount",
    "Total DD With GST",
    "Average DD With GST",
    "Average DD Without GST"
  ]);

  headerRow.eachCell(cell => {
    cell.font = { bold: true };
    cell.alignment = { horizontal: "center" };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFEFEFEF" }
    };
    cell.border = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" }
    };
  });

  /* ---------- GROUP DATA ---------- */
  /* ---------- GROUP DATA ---------- */

const grouped = {};


rows.forEach(r => {

 

  const channel = r.channel || "ARENA"; 

  const region = r.region_name || "Unknown Region";

  const topKey = `${region}`;

  if (!grouped[topKey]) {
    grouped[topKey] = {};
  }

  if (!grouped[topKey][r.location_name]) {
    grouped[topKey][r.location_name] = {
      total: r,
      models: []
    };
  }

  grouped[topKey][r.location_name].models.push(r);
});

Object.entries(grouped).forEach(([topGroup, locations]) => {

  ws.addRow([]);

  // 🟢 Arena / Nexa / LCV + Region Header
  const groupHeader = ws.addRow([topGroup]);
  ws.mergeCells(ws.lastRow.number, 1, ws.lastRow.number, TOTAL_COLUMNS);

  groupHeader.font = { bold: true, size: 13 };
  groupHeader.alignment = { horizontal: "left" };
  groupHeader.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFCE4D6" }
  };

  Object.values(locations).forEach(g => {

    ws.addRow([]);

    // 🔵 Location TOTAL Row (UNCHANGED LOGIC)
    const totalRow = ws.addRow([
      `${g.total.location_name} - TOTAL`,
      g.total.location_total_count,
      g.total.location_zero_discount_count,
      g.total.location_total_dd_with_gst,
      g.total.location_avg_dd_with_gst,
      g.total.location_avg_dd_without_gst
    ]);

    totalRow.eachCell(cell => {
      cell.font = { bold: true };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFDDEBF7" }
      };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" }
      };
    });

    // ⚪ Model rows (UNCHANGED)
    g.models.forEach(m => {
      ws.addRow([
        m.model_name,
        m.total_count,
        m.zero_discount,
        m.total_dd_with_gst,
        m.avg_dd_with_gst,
        m.avg_dd_without_gst
      ]);
    });

  });

});
  /* ---------- COLUMN WIDTHS ---------- */
  ws.columns = [
    { width: 30 }, // Model (larger)
    { width: 15 },
    { width: 15 },
    { width: 20 },
    { width: 22 },
    { width: 24 }
  ];
};


schedule.scheduleJob("00 19 * * *", async () => {
  console.log("📌 Running IN/OUT Time Report...");

  const sequelize1 = await dbname(
    {
      query: "",
      headers: {
        compcode: "DBCON",
        name: "scheduler",
      },
    },
    "DBCON"
  );

  const [dlrData] = await sequelize1.query(`
    SELECT *
    FROM DLR_SCH
    WHERE SCH_TYPE = 'IN_OUT-REPORT'
    AND export_type < 3
  `);

  for (const dealer of dlrData) {
    const compcode = dealer.Dlr_Id.toLowerCase();
    const logger = new SchedulerLogger(
      sequelize1,
      "IN_OUT-REPORT",
      compcode
    );

    await generateInOutReport(compcode, logger);

    try {
      await logger.save();
      writeDailySchedulerLog(logger.toJSON());
    } catch (logErr) {
      console.error("⚠️ Logger failed but scheduler continues:", logErr.message);
    }
  }
});



const generateInOutReport = async (compcode, logger) => {
  try {
    const sequelize = await dbname(
      { query: "", headers: { compcode } },
      compcode
    );

    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    const startDate = firstDay.toLocaleDateString("en-CA");
    const endDate = today.toLocaleDateString("en-CA");

    const displayDate =
      `${firstDay.toLocaleDateString("en-GB").replace(/\//g, "-")} TO ` +
      `${today.toLocaleDateString("en-GB").replace(/\//g, "-")}`;

    const [companyData] = await sequelize.query(
      `SELECT TOP 1 comp_name FROM Comp_Mst`
    );

    const companyName = companyData[0]?.comp_name || "Company";

    /* ---------------- COMMON SHIFT CONVERSION ---------------- */

    const shiftEndTime = `
      TIMEFROMPARTS(
        FLOOR(AT.SHIFTENDTIME),
        (AT.SHIFTENDTIME - FLOOR(AT.SHIFTENDTIME)) * 100,
        0,0,0
      )
    `;

    const shiftStartTime = `
      TIMEFROMPARTS(
        FLOOR(AT.SHIFTSTARTTIME),
        (AT.SHIFTSTARTTIME - FLOOR(AT.SHIFTSTARTTIME)) * 100,
        0,0,0
      )
    `;

    /* ---------------- IN QUERY (ALL SHIFTS) ---------------- */

    const inTimeQuery = `
    SELECT
      AT.Emp_Code,
      EM.EmpFirstName,
      EM.EMPLOYEEDesignation,
      LOC.Misc_Name AS Location_Name,
      DIVI.Misc_Name AS Department_Name,
      CAST(AT.DATEOFFICE AS DATE) AS DATEOFFICE,
      CONVERT(VARCHAR(5), ${shiftStartTime}, 108) + ' - ' +
      CONVERT(VARCHAR(5), ${shiftEndTime}, 108) AS SHIFT_TIME,
      CONVERT(VARCHAR(8), AT.IN1, 108) AS IN_TIME,
      CONVERT(VARCHAR(8), AT.OUT1, 108) AS OUT_TIME
    FROM attendancetable AT
    INNER JOIN EmployeeMaster EM ON AT.Emp_Code = EM.EmpCode
    LEFT JOIN MISC_MST LOC ON LOC.Misc_Type = 85 AND LOC.Misc_Code = EM.Location
    LEFT JOIN MISC_MST DIVI ON DIVI.Misc_Type = 68 AND DIVI.Misc_Code = EM.Division
    WHERE CAST(AT.DATEOFFICE AS DATE) BETWEEN :startDate AND :endDate
      AND AT.IN1 IS NOT NULL
      AND CAST(AT.IN1 AS TIME) BETWEEN
            DATEADD(MINUTE, -5, ${shiftStartTime})
        AND ${shiftStartTime}
    ORDER BY AT.Emp_Code
    `;

    /* ---------------- OUT QUERY (ALL SHIFTS) ---------------- */

    const outTimeQuery = `
    SELECT
      AT.Emp_Code,
      EM.EmpFirstName,
      EM.EMPLOYEEDesignation,
      LOC.Misc_Name AS Location_Name,
      DIVI.Misc_Name AS Department_Name,
      CAST(AT.DATEOFFICE AS DATE) AS DATEOFFICE,
      CONVERT(VARCHAR(5), ${shiftStartTime}, 108) + ' - ' +
      CONVERT(VARCHAR(5), ${shiftEndTime}, 108) AS SHIFT_TIME,
      CONVERT(VARCHAR(8), AT.IN1, 108) AS IN_TIME,
      CONVERT(VARCHAR(8), AT.OUT1, 108) AS OUT_TIME
    FROM attendancetable AT
    INNER JOIN EmployeeMaster EM ON AT.Emp_Code = EM.EmpCode
    LEFT JOIN MISC_MST LOC ON LOC.Misc_Type = 85 AND LOC.Misc_Code = EM.Location
    LEFT JOIN MISC_MST DIVI ON DIVI.Misc_Type = 68 AND DIVI.Misc_Code = EM.Division
    WHERE CAST(AT.DATEOFFICE AS DATE) BETWEEN :startDate AND :endDate
      AND AT.OUT1 IS NOT NULL
      AND CAST(AT.OUT1 AS TIME) BETWEEN
            ${shiftEndTime}
        AND DATEADD(MINUTE, 5, ${shiftEndTime})
    ORDER BY AT.Emp_Code
    `;

    const [inRows] = await sequelize.query(inTimeQuery, {
      replacements: { startDate, endDate },
    });

    const [outRows] = await sequelize.query(outTimeQuery, {
      replacements: { startDate, endDate },
    });

    if (!inRows.length && !outRows.length) return;

    const exportDir = path.join(__dirname, "exports");
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    const workbook = new ExcelJS.Workbook();

    buildInOutSheet(workbook, "IN TIME REPORT", inRows, companyName, displayDate);
    buildInOutSheet(workbook, "OUT TIME REPORT", outRows, companyName, displayDate);

    const filename = path.join(
      exportDir,
      `InOutReport_${Date.now()}.xlsx`
    );

    await workbook.xlsx.writeFile(filename);

    logger.addImpact("REPORT_GENERATED", null, inRows.length + outRows.length);

    /* ----------- EMAIL ----------- */

    const [emailRows] = await sequelize.query(`
      SELECT Mail_To, Mail_CC, Mail_Sub, Mail_body
      FROM Mail_Set
      WHERE Tran_Type = 103
      AND Export_type < 3
    `);

    if (!emailRows.length) return;

    const mail = emailRows[0];

    await sendEmail1(
      mail.Mail_To,
      mail.Mail_CC || "",
      mail.Mail_Sub || "IN OUT Time Report",
      mail.Mail_body || "Please find attached IN/OUT report.",
      [{ filename: path.basename(filename), path: filename }]
    );

    logger.addImpact("EMAIL_SENT", null, 1);

    console.log("📤 IN/OUT Email sent:", filename);

  } catch (err) {
    logger.setError(err);
    console.log("❌ Error:", err);
  }
};




const buildInOutSheet = (workbook, sheetName, rows, companyName, date) => {
const ws = workbook.addWorksheet(sheetName);

/* ================= HEADER SECTION ================= */

// Merge across all 8 columns
ws.mergeCells(1, 1, 1, 9);
ws.mergeCells(2, 1, 2, 9);


ws.getCell("A1").value = companyName.toUpperCase();
ws.getCell("A2").value = `IN / OUT TIME REPORT (${date})`;

ws.getRow(1).font = { bold: true, size: 16 };
ws.getRow(2).font = { bold: true, size: 12 };

ws.getRow(1).alignment = { horizontal: "center", vertical: "middle" };
ws.getRow(2).alignment = { horizontal: "center", vertical: "middle" };

ws.getRow(1).height = 25;
ws.getRow(2).height = 20;

// Blank row after header
ws.addRow([]);

/* ================= COLUMN HEADER ================= */

const header = ws.addRow([
"Emp Code",
"Employee Name",
"Designation",
"Location",
"Department",
"Date",
"Shift Time",
"IN Time",
"OUT Time"
]);

header.eachCell(cell => {
cell.font = { bold: true };
cell.alignment = { horizontal: "center", vertical: "middle" };
cell.border = {
top: { style: "thin" },
bottom: { style: "thin" },
left: { style: "thin" },
right: { style: "thin" }
};
});

/* ================= DATA ROWS ================= */

rows.forEach(r => {
ws.addRow([
r.Emp_Code,
r.EmpFirstName,
r.EMPLOYEEDesignation,
r.Location_Name,
r.Department_Name,
r.DATEOFFICE
? new Date(r.DATEOFFICE).toLocaleDateString("en-GB").replace(/\//g, "-")
: "",
r.SHIFT_TIME || "",
r.IN_TIME || "",
r.OUT_TIME || ""
]);
});

/* ================= COLUMN WIDTH ================= */

ws.columns = [
{ width: 15 },
{ width: 25 },
{ width: 22 },
{ width: 20 },
{ width: 20 },
{ width: 15 },
{ width: 15 },
{ width: 15 },
{ width: 15 }
];

};



schedule.scheduleJob("00 23 * * *", async () => {
  console.log("📌 Running Pending Vehicle IN Scheduler...");

  try {
    const sequelize1 = await dbname(
      {
        query: "",
        headers: {
          compcode: "DBCON",
          name: "pending-chas-trf",
        },
      },
      "DBCON"
    );

    const [dealerList] = await sequelize1.query(`
        SELECT *
        FROM DLR_SCH
        WHERE SCH_TYPE = 'PENDING-TRF-IN'
          AND export_type < 3
    `);

    for (const dealer of dealerList) {
      const compcode = dealer.Dlr_Id.toLowerCase();
      await generatePendingTrfReport(compcode);
    }

  } catch (err) {
    console.log("❌ Scheduler Error:", err);
  }
});


const generatePendingTrfReport = async (compcode) => {
  try {

    const sequelize = await dbname(
      { query: "", headers: { compcode } },
      compcode
    );

    /* ================= COMPANY NAME ================= */

    const [companyData] = await sequelize.query(
      `SELECT TOP 1 comp_name FROM Comp_Mst`
    );

    const companyName = companyData[0]?.comp_name || "Company";

    /* ================= FETCH DATA ================= */

    const [rows] = await sequelize.query(`
      SELECT
          c.TRAN_ID,
          c.TRF_NO,
          c.DOC_Date,
          c.Veh_Modl AS MODEL_CODE,
          c.Color,
          c.VIN,
          c.Chas_No,
          c.Engn_No,
          c.Driver,
          c.Driver_Mob,
          c.Out_Time,
         (
        SELECT MISC_NAME
        FROM MISC_MST
        WHERE MISC_TYPE = 631
          AND MISC_CODE = c.Loc_Code
          AND Export_Type < 3
    ) AS From_Location_Name,

    -- TO LOCATION
    (
        SELECT MISC_NAME
        FROM MISC_MST
        WHERE MISC_TYPE = 631
          AND MISC_CODE = c.TRF_TO
          AND Export_Type < 3
    ) AS To_Location_Name
      FROM CHAS_TRF c
      WHERE c.Export_Type < 3
        AND c.ITEM_TYPE = 10
        AND (c.TRF_IN IS NULL OR c.TRF_IN = 0)
        AND c.TRFIN_Date IS NULL
        AND c.TRFIN_USER IS NULL
      ORDER BY c.DOC_Date DESC
    `);

    if (!rows.length) {
      console.log("✅ No Pending Vehicles");
      return;
    }

    /* ================= CREATE EXCEL ================= */

    const workbook = new ExcelJS.Workbook();

    const today = new Date()
      .toLocaleDateString("en-GB")
      .replace(/\//g, "-");

    buildPendingTrfSheet(
      workbook,
      "Pending TRF IN",
      rows,
      companyName,
      today
    );

    const exportDir = path.join(__dirname, "exports");

    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    const filename = path.join(
      exportDir,
      `Pending_TRF_IN_${Date.now()}.xlsx`
    );

    await workbook.xlsx.writeFile(filename);

    /* ================= SEND MAIL ================= */

    const [emailRows] = await sequelize.query(`
      SELECT Mail_To, Mail_CC, Mail_Sub, Mail_body
      FROM Mail_Set
      WHERE Tran_Type = 104
        AND Export_type < 3
    `);

    if (!emailRows.length) return;

    const mail = emailRows[0];

    await sendEmail1(
      mail.Mail_To,
      mail.Mail_CC || "",
      mail.Mail_Sub || `Pending Vehicle Transfer IN Report (${today})`,
      mail.Mail_body || "Please find attached pending vehicle transfer IN report.",
      [{ filename: path.basename(filename), path: filename }]
    );

    console.log("📤 Pending TRF Email Sent:", compcode);

  } catch (err) {
    console.log("❌ Error:", err);
  }
};


const buildPendingTrfSheet = (
  workbook,
  sheetName,
  rows,
  companyName,
  date
) => {

  const ws = workbook.addWorksheet(sheetName);

  /* ================= HEADER ================= */

  ws.mergeCells(1, 1, 1, 10);
  ws.mergeCells(2, 1, 2, 10);

  ws.getCell("A1").value = companyName.toUpperCase();
  ws.getCell("A2").value = `PENDING VEHICLE TRANSFER IN REPORT `;

  ws.getRow(1).font = { bold: true, size: 16 };
  ws.getRow(2).font = { bold: true, size: 12 };

  ws.getRow(1).alignment = { horizontal: "center", vertical: "middle" };
  ws.getRow(2).alignment = { horizontal: "center", vertical: "middle" };

  ws.getRow(1).height = 25;
  ws.getRow(2).height = 20;

  ws.addRow([]);

  /* ================= COLUMN HEADER ================= */

  const header = ws.addRow([
    "TRF NO",
    "DOC DATE",
    "MODEL CODE",
    "COLOR",
    "VIN",
    "CHASSIS NO",
    "ENGINE NO",
    "DRIVER NAME",
    "DRIVER MOBILE NO", 
    "OUT DATE",
    "OUT TIME",
    "FROM LOCATION",
    "TO LOCATION"
  ]);

  header.eachCell(cell => {
    cell.font = { bold: true };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" }
    };
  });

  /* ================= DATA ================= */

  rows.forEach(r => {

      const formattedDocDate = r.DOC_Date
    ? new Date(r.DOC_Date)
        .toLocaleDateString("en-GB")
        .replace(/\//g, "-")
    : "";
    const formattedTime = r.Out_Time
      ? new Date(r.Out_Time).toLocaleTimeString("en-US")
      : "";

  ws.addRow([
    r.TRF_NO,
    formattedDocDate,
    r.MODEL_CODE,
    r.Color,
    r.VIN,
    r.Chas_No,
    r.Engn_No,
    r.Driver,
    r.Driver_Mob || "",
    formattedDocDate,           // OUT DATE (from DOC_Date)
    formattedTime,
    r.From_Location_Name,       // FROM LOCATION
    r.To_Location_Name          // TO LOCATION
  ]);
});

  /* ================= COLUMN WIDTH ================= */

ws.columns = [
  { width: 15 },
  { width: 15 },
  { width: 18 },
  { width: 15 },
  { width: 25 },
  { width: 22 },
  { width: 20 },
  { width: 25 },
  { width: 18 }, 
  { width: 15 },
  { width: 15 },
  { width: 22 },
  { width: 22 }
];
};


schedule.scheduleJob("00 12 * * *", async () => {

  console.log("📌 Running Employee Duplicate Scheduler...");

  try {

    const sequelize1 = await dbname(
      { query: "", headers: { compcode: "DBCON" } },
      "DBCON"
    );

    const [dlrData] = await sequelize1.query(`
      SELECT Dlr_Id
      FROM DLR_SCH
      WHERE SCH_TYPE = 'EMP_DUPLICATE_REPORT'
      AND export_type < 3
    `);

    const attachments = [];

   let mailBody = `
<p>Dear Sir,</p>

<p>The following dealers have <b>duplicate employee records</b> detected in the system:</p>

`;

    for (const dealer of dlrData) {

      const compcode = dealer.Dlr_Id.toLowerCase();

      const result = await generateEmployeeDuplicateReport(compcode);

      if (!result) continue;

      attachments.push(result.file);

     mailBody += `
<p><b>Dealer ID :</b> ${dealer.Dlr_Id}</p>
<ul>
${result.fields.map(f => `<li>${f}</li>`).join("")}
</ul>
`;

    }

    if (!attachments.length) {

      console.log("✅ No duplicates found.");

      return;

    }

   mailBody += `
<p>Please check the attached reports for complete details.</p>

<p>
Regards,<br>
<b>TEAM AUTOVYN</b>
</p>
`;

   await sendEmail1(
  ["yuvraj@autovyn.com", "gopal@autovyn.com", "pulkit@autovyn.com"],
  "",
  "Employee Duplicate Report",
  mailBody,
  attachments
);

    console.log("📤 Duplicate Report Mail Sent");

  } catch (err) {

    console.log("❌ Scheduler Error:", err);

  }

});


const generateEmployeeDuplicateReport = async (compcode) => {

  const sequelize = await dbname(
    { query: "", headers: { compcode } },
    compcode
  );

  const fields = [
    { name: "EMPCODE", title: "Duplicate Employee Code", sheet: "Duplicate Emp Code" },
    { name: "MOBILE_NO", title: "Duplicate Mobile Numbers", sheet: "Duplicate Mobile" },
    { name: "PANNO", title: "Duplicate PAN Numbers", sheet: "Duplicate PAN" },
    { name: "BANKACCOUNTNO", title: "Duplicate Bank Accounts", sheet: "Duplicate Bank Acc" },
    { name: "UID_NO", title: "Duplicate Aadhaar Numbers", sheet: "Duplicate Aadhaar" },
    { name: "Android_ID", title: "Duplicate Android IDs", sheet: "Duplicate Android ID" },
    { name: "PASSPORTNO", title: "Duplicate Passport Numbers", sheet: "Duplicate Passport" },
    { name: "DRIVINGLIC_ISSUEPALACE", title: "Duplicate Driving Licenses", sheet: "Duplicate DL" }
  ];

  const workbook = new ExcelJS.Workbook();

  let duplicateFields = [];

  for (const field of fields) {

    const query = `
    SELECT 
      EM.EMPCODE,
      EM.LOCATION AS LOCATION_CODE,
      GM.Godw_Name AS LOCATION_NAME,
      EM.EMPFIRSTNAME,
      EM.EMPLASTNAME,
      EM.MOBILE_NO,
      EM.PANNO,
      EM.UID_NO,
      EM.EMPLOYEEDESIGNATION,
      EM.BANKACCOUNTNO,
      EM.PAYMENTMODE,
      EM.BANKNAME,
      EM.ifsc_code,
      EM.Android_ID,
      EM.PASSPORTNO,
      EM.DRIVINGLIC_ISSUEPALACE
    FROM EMPLOYEEMASTER EM
    LEFT JOIN Godown_Mst GM 
      ON GM.Godw_Code = EM.LOCATION
      AND ISNULL(GM.export_type,0) < 3
    WHERE EM.${field.name} IN
    (
      SELECT ${field.name}
      FROM EMPLOYEEMASTER
      WHERE ${field.name} IS NOT NULL
      AND LTRIM(RTRIM(${field.name})) <> ''
      AND LASTWOR_DATE IS NULL
      GROUP BY ${field.name}
      HAVING COUNT(*) > 1
    )
    AND EM.${field.name} IS NOT NULL
    AND LTRIM(RTRIM(EM.${field.name})) <> ''
    AND EM.LASTWOR_DATE IS NULL
    ORDER BY LTRIM(RTRIM(EM.${field.name}))
    `;

    const data = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT
    });

    if (data.length > 0) {
      duplicateFields.push(field.title);
    }

    const sheet = workbook.addWorksheet(field.sheet);

    sheet.views = [{ state: "frozen", ySplit: 3 }];

 if (data.length === 0) {

  const titleRow = sheet.addRow([field.title]);

  titleRow.font = { bold: true, size: 16 };

  // merge across reasonable width when no data
  sheet.mergeCells(1, 1, 1, 10);

  titleRow.alignment = {
    horizontal: "center",
    vertical: "middle"
  };

  sheet.addRow([]);

  const noDataRow = sheet.addRow(["No Duplicate Records Found"]);

  sheet.mergeCells(3, 1, 3, 10);

  noDataRow.alignment = {
    horizontal: "center"
  };

  continue;
}

    let columns = Object.keys(data[0]);

    columns = [
      field.name,
      ...columns.filter(col => col !== field.name)
    ];

    // Title
    const titleRow = sheet.addRow([field.title]);

    titleRow.font = { bold: true, size: 16 };

    sheet.mergeCells(1, 1, 1, columns.length);

    titleRow.alignment = {
      horizontal: "center",
      vertical: "middle"
    };

    sheet.addRow([]);

    // Header
    const headerRow = sheet.addRow(columns);

    headerRow.eachCell((cell) => {

      cell.font = {
        bold: true,
        size: 12
      };

      cell.alignment = {
        horizontal: "center",
        vertical: "middle"
      };

      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD9D9D9" }
      };

      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" }
      };

    });

    // Increase duplicate column width
    const duplicateColumnIndex = columns.indexOf(field.name) + 1;
    sheet.getColumn(duplicateColumnIndex).width = 35;

    let currentDuplicate = null;

    for (const row of data) {

      const duplicateValue = String(row[field.name]).trim().toUpperCase();

      if (currentDuplicate !== duplicateValue) {

        if (currentDuplicate !== null) {
          sheet.addRow([]);
        }

        currentDuplicate = duplicateValue;
      }

      const rowData = columns.map(col => row[col]);

      const excelRow = sheet.addRow(rowData);

      const cell = excelRow.getCell(duplicateColumnIndex);

      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFF0000" }
      };

      cell.font = {
        color: { argb: "FFFFFFFF" },
        bold: true
      };

    }

  }

  if (!duplicateFields.length) {
    return null;
  }

  const exportDir = path.join(__dirname, "exports");

  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  const filename = path.join(
    exportDir,
    `EmployeeDuplicateReport_${compcode}_${Date.now()}.xlsx`
  );

  await workbook.xlsx.writeFile(filename);

  return {
    file: {
      filename: path.basename(filename),
      path: filename
    },
    fields: duplicateFields
  };

};

schedule.scheduleJob("00 10 * * *", async () => {

  console.log("📌 Running Employee Continuous Absent Scheduler...");

  try {

    const sequelize1 = await dbname(
      { query: "", headers: { compcode: "DBCON" } },
      "DBCON"
    );

    const [dealerList] = await sequelize1.query(`
      SELECT Dlr_Id
      FROM DLR_SCH
      WHERE SCH_TYPE = 'EMP_ABSENT'
      AND export_type < 3
    `);

    for (const dealer of dealerList) {

      const compcode = dealer.Dlr_Id.toLowerCase();
      await generateAbsentEmployeeReport(compcode);

    }

  } catch (err) {

    console.log("❌ Scheduler Error:", err);

  }

});



const generateAbsentEmployeeReport = async (compcode) => {

  try {

    const sequelize = await dbname(
      { query: "", headers: { compcode } },
      compcode
    );



    /* ================= COMPANY NAME ================= */

    const [companyData] = await sequelize.query(`
      SELECT TOP 1 comp_name FROM Comp_Mst
    `);

    const companyName = companyData[0]?.comp_name || "Company";



    /* ================= ABSENT DATA ================= */

    const [rows] = await sequelize.query(`

SELECT 
    EM.EMPCODE,
    CONCAT(ISNULL(EM.EMPFIRSTNAME,''),' ',ISNULL(EM.EMPLASTNAME,'')) AS EMP_NAME,

   EM.LOCATION AS LOCATION_CODE,
M85.Misc_Name AS LOCATION,
    M81.Misc_Name AS SECTION,
    EM.EMPLOYEEDESIGNATION AS DESIGNATION,
    M627.Misc_Name AS CHANNEL,
    M626.Misc_Name AS CLUSTER,

    M68.Misc_Name AS DEPARTMENT,

    CASE 
        WHEN EM.EmpType = 1 THEN 'Regular'
        WHEN EM.EmpType = 2 THEN 'Casual'
        WHEN EM.EmpType = 3 THEN 'Apprentice'
        ELSE ''
    END AS EMPLOYEE_TYPE,

    CAST(EM.CURRENTJOINDATE AS DATE) AS JOINING_DATE,

    EM.MOBILENO,
    EM.CORPORATEMAILID,

    EM.PAY_CODE AS PUNCHCODE,

    M90.ShiftName AS EMP_SHIFT,

    M625.Misc_Name AS CATEGORY,
    M628.Misc_Name AS COSTCENTRE,

    MIN(A.dateoffice) AS From_Date,
    MAX(A.dateoffice) AS To_Date,
    COUNT(*) AS Absent_Days

FROM attendancetable A

INNER JOIN EMPLOYEEMASTER EM
ON EM.EMPCODE = A.Emp_Code
AND EM.LASTWOR_DATE IS NULL

OUTER APPLY (SELECT TOP 1 Misc_Name FROM Misc_Mst WHERE Misc_Type=85 AND Misc_Code=EM.LOCATION) M85
OUTER APPLY (SELECT TOP 1 Misc_Name FROM Misc_Mst WHERE Misc_Type=81 AND Misc_Code=EM.SECTION) M81
OUTER APPLY (SELECT TOP 1 Misc_Name FROM Misc_Mst WHERE Misc_Type=627 AND Misc_Code=EM.CHANNEL) M627
OUTER APPLY (SELECT TOP 1 Misc_Name FROM Misc_Mst WHERE Misc_Type=626 AND Misc_Code=EM.CLUSTER) M626
OUTER APPLY (SELECT TOP 1 Misc_Name FROM Misc_Mst WHERE Misc_Type=68 AND Misc_Code=EM.DIVISION) M68
OUTER APPLY (SELECT TOP 1 CONCAT(Misc_Add1,'-',Misc_Add2) AS ShiftName FROM Misc_Mst WHERE Misc_Type=90 AND Misc_Code=EM.EMP_SHIFT) M90
OUTER APPLY (SELECT TOP 1 Misc_Name FROM Misc_Mst WHERE Misc_Type=625 AND Misc_Code=EM.CATEGORY) M625
OUTER APPLY (SELECT TOP 1 Misc_Name FROM Misc_Mst WHERE Misc_Type=628 AND Misc_Code=EM.COSTCENTRE) M628

WHERE
A.MAN_APPR IS NULL
AND A.dateoffice BETWEEN DATEADD(DAY,-30, DATEADD(DAY,-1,CAST(GETDATE() AS DATE))) AND DATEADD(DAY,-1,CAST(GETDATE() AS DATE))

GROUP BY
EM.EMPCODE,
EM.EMPFIRSTNAME,
EM.EMPLASTNAME,
EM.LOCATION,
M85.Misc_Name,
M85.Misc_Name,
M81.Misc_Name,
EM.EMPLOYEEDESIGNATION,
M627.Misc_Name,
M626.Misc_Name,
M68.Misc_Name,
EM.EmpType,
EM.CURRENTJOINDATE,
EM.MOBILENO,
EM.CORPORATEMAILID,
EM.PAY_CODE,
M90.ShiftName,
M625.Misc_Name,
M628.Misc_Name

HAVING 
COUNT(*) >= 3
AND SUM(CASE WHEN A.status <> 'A' THEN 1 ELSE 0 END) = 0
AND MAX(A.dateoffice) = DATEADD(DAY,-1,CAST(GETDATE() AS DATE))

ORDER BY LOCATION, EM.EMPCODE

    `);



    if (!rows.length) {

      console.log("✅ No employees absent continuously.");
      return;

    }



    /* ================= MAIL SETTINGS ================= */

    const [emailRows] = await sequelize.query(`
      SELECT Mail_To, Mail_CC, Mail_Sub, Mail_body,TERMS5
      FROM Mail_Set
      WHERE Tran_Type = 105
      AND Export_type < 3
    `);

    if (!emailRows.length) return;



    const today = new Date();
    const todayFormatted = today.toLocaleDateString("en-GB").replace(/\//g, "-");



    for (const mail of emailRows) {

      let filteredRows = rows;

if (mail.TERMS5 && mail.TERMS5.trim() !== "" && mail.TERMS5.trim() !== "0") {

  const locCodes = mail.TERMS5
    .split(",")
    .map(l => l.trim());

  filteredRows = rows.filter(r =>
    locCodes.includes(String(r.LOCATION_CODE))
  );

}

if (!filteredRows.length) continue;

      const workbook = new ExcelJS.Workbook();
      const ws = workbook.addWorksheet("Absent Employees");



      /* ================= TITLE ================= */

      ws.mergeCells(1, 1, 1, 19);
      ws.mergeCells(2, 1, 2, 19);
      ws.mergeCells(3, 1, 3, 19);

      ws.getCell("A1").value = companyName.toUpperCase();
      ws.getCell("A2").value = "EMPLOYEE CONTINUOUS ABSENT REPORT (LAST 3 DAYS)";
      ws.getCell("A3").value = `DATE : ${todayFormatted}`;

      ws.getRow(1).font = { bold: true, size: 16 };
      ws.getRow(2).font = { bold: true, size: 12 };
      ws.getRow(3).font = { bold: true, size: 11 };

      ws.getRow(1).alignment = { horizontal: "center" };
      ws.getRow(2).alignment = { horizontal: "center" };
      ws.getRow(3).alignment = { horizontal: "center" };

      ws.addRow([]);



      /* ================= HEADER ================= */

      const header = ws.addRow([
        "EMP CODE",
        "EMPLOYEE NAME",
        "LOCATION",
        "SECTION",
        "DESIGNATION",
        "CHANNEL",
        "CLUSTER",
        "DEPARTMENT",
        "EMP TYPE",
        "JOINING DATE",
        "MOBILE NO",
        "CORPORATE EMAIL",
        "PUNCH CODE",
        "SHIFT",
        "FROM DATE",
        "TO DATE",
        "ABSENT DAYS"
      ]);



      header.eachCell(cell => {

        cell.font = { bold: true };

        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" }
        };

      });



      /* ================= DATA ================= */

      filteredRows.forEach(r => {

        const fromDate = new Date(r.From_Date)
          .toLocaleDateString("en-GB")
          .replace(/\//g, "-");

        const toDate = new Date(r.To_Date)
          .toLocaleDateString("en-GB")
          .replace(/\//g, "-");

    ws.addRow([
  r.EMPCODE,
  r.EMP_NAME,
  r.LOCATION,
  r.SECTION,
  r.DESIGNATION,
  r.CHANNEL,
  r.CLUSTER,
  r.DEPARTMENT,
  r.EMPLOYEE_TYPE,
  r.JOINING_DATE,
  r.MOBILENO,
  r.CORPORATEMAILID,
  r.PUNCHCODE,
  r.EMP_SHIFT,
  fromDate,
  toDate,
  r.Absent_Days
]);

      });



      ws.columns = [
        { width: 14 },
        { width: 28 },
        { width: 20 },
        { width: 20 },
        { width: 25 },
        { width: 20 },
        { width: 20 },
        { width: 22 },
        { width: 18 },
        { width: 16 },
        { width: 15 },
        { width: 30 },
        { width: 15 },
        { width: 15 },
        { width: 14 },
        { width: 14 },
        { width: 12 }
      ];



      /* ================= SAVE FILE ================= */

      const exportDir = path.join(__dirname, "exports");

      if (!fs.existsSync(exportDir)) {

        fs.mkdirSync(exportDir, { recursive: true });

      }

      const filename = path.join(
        exportDir,
        `Employee_Absent_${Date.now()}.xlsx`
      );

      await workbook.xlsx.writeFile(filename);



      /* ================= SEND MAIL ================= */

      await sendEmail1(
        mail.Mail_To,
        mail.Mail_CC || "",
        mail.Mail_Sub || `Employee Absent Report (${todayFormatted})`,
        mail.Mail_body || "Please find attached employee absent report.",
        [{ filename: path.basename(filename), path: filename }]
      );

      console.log("📧 Absent Employee Report Sent:", compcode);

    }

  } catch (err) {

    console.log("❌ Error:", err);

  }

};