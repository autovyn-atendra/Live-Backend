const fs = require("fs");
const path = require("path");
const moment = require("moment");
const { dbname } = require("../utils/dbconfig");
const { SendWhatsAppMessgae } = require("../routes/user");
const SchedulerLogger = require("../utils/schedulerLogger");

/**
 * Append log entry into daily TXT file
 */
function writeDailySchedulerLog(logData) {
  try {
    const today = new Date().toISOString().split("T")[0];
    const logDir = path.join(__dirname, "../scheduler_logs");

    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const filePath = path.join(logDir, `${today}.txt`);
    fs.appendFileSync(filePath, JSON.stringify(logData) + "\n");
  } catch (err) {
    console.error("TXT log failed:", err.message);
  }
}

/**
 * Decode Base64 string or return as-is if already plain text
 */
function safeDecode(val) {
  if (!val) return "";
  try {
    const decoded = Buffer.from(val, "base64").toString("utf-8");
    // Verify if decoded string looks valid, else return original
    if (decoded && /^[\w\-@.:\/ ]+$/.test(decoded)) {
      return decoded;
    }
    return val;
  } catch (_) {
    return val;
  }
}

/**
 * Core Scheduler: Runs plan date reminder for Today's Scheduled Enquiries
 * - Customer: Receives individual WhatsApp message for their enquiry (as before)
 * - DSE (Sales Executive): Grouped per DSE, receives ONE WhatsApp message with a summary and a link
 *   which opens a Server-Side Rendered (SSR) page listing all today's follow-up customers!
 */
async function runPlanDateReminder(param1 = null, param2 = null) {
  // Support both:
  // 1) Express Route Handler: (req, res)
  // 2) Direct / Scheduler invocation: (singleCompCode, scheduledDate)
  const isExpress = !!(param1 && typeof param1 === "object" && param1.headers && param2 && typeof param2.send === "function");
  const req = isExpress ? param1 : null;
  const res = isExpress ? param2 : null;

  const singleCompCode = isExpress
    ? (req.query?.compcode || req.headers?.compcode || null)
    : (typeof param1 === "string" ? param1 : null);

  const planDateStr = isExpress
    ? (req.query?.date ? moment(req.query.date).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD"))
    : (param2 ? moment(param2).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD"));

  console.log("📅 Running plan date reminder (executer/customer)...", { singleCompCode, planDateStr, isExpress });

  const executionSummary = {
    dealersProcessed: 0,
    totalEnquiriesToday: 0,
    customerMessagesSent: 0,
    dseMessagesSent: 0,
    errors: [],
  };

  let sequelize1;
  try {
    sequelize1 = await dbname(
      { query: "", headers: { compcode: "DBCON", name: "schedualer" } },
      "DBCON"
    );

    let Dlr_data = [];
    if (singleCompCode) {
      Dlr_data = [{ Dlr_Id: singleCompCode }];
    } else {
      [Dlr_data] = await sequelize1.query(
        `SELECT * FROM DLR_SCH WHERE SCH_TYPE = 'Enq-Follow-up' AND export_type < 3`
      );
    }

    if (!Dlr_data || !Dlr_data.length) {
      console.log("ℹ️ No active dealers found with 'Enq-Follow-up' schedule.");
      if (isExpress) {
        return res.status(200).json({
          success: true,
          message: "No active dealers found with 'Enq-Follow-up' schedule",
          summary: executionSummary,
        });
      }
      return executionSummary;
    }

    for (const dealer of Dlr_data) {
      const compcode = dealer.Dlr_Id;
      executionSummary.dealersProcessed++;
      const logger = new SchedulerLogger(sequelize1, "Enq-Follow-up", compcode);

      let sequelize;
      try {
        sequelize = await dbname(
          { query: "", headers: { compcode, name: "schedualer" } },
          compcode
        );

        // Fetch scheduled plan follow-ups for the given date (default today)
        const [result] = await sequelize.query(`
          WITH LatestByTran AS (
            SELECT *, ROW_NUMBER() OVER (PARTITION BY Tran_Id ORDER BY SNo DESC) AS rn 
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
            r.Tran_Id AS Enq_id, 
            r.Modl_Code, 
            r.Modl_Var, 
            r.color,
            r.Allot_Modl_Code, 
            r.Book_Date, 
            r.Reg_Date, 
            r.Total_Amt,
            r.cost_modl_grp,
            r.cost_modl_varient
          FROM LatestByTran e
          JOIN RTL_MST r ON CAST(e.Tran_Id AS VARCHAR) = r.Tran_Id
          WHERE e.rn = 1 
            AND r.export_type < 33 
            AND CAST(e.Plan_date AS DATE) = CAST(:planDateStr AS DATE)
        `, { replacements: { planDateStr } });

        if (!result || !result.length) {
          console.log(`ℹ️ No plan dates for dealer ${compcode} on ${planDateStr}.`);
          logger.addSkip(1);
          continue;
        }

        executionSummary.totalEnquiriesToday += result.length;
        const [[company_info]] = await sequelize.query(`SELECT Comp_Name FROM comp_mst`);
        const companyName = company_info?.Comp_Name || "Autovyn";

        // Group enquiries by DSE (Executive)
        const dseGroups = new Map();

        // ════════════════════════════════════════════════════════════════
        // 1. CUSTOMER NOTIFICATIONS (Each customer gets individual alert)
        // ════════════════════════════════════════════════════════════════
        for (const item of result) {
          // Group for DSE batching later
          if (item.DSE_Gen) {
            if (!dseGroups.has(item.DSE_Gen)) {
              dseGroups.set(item.DSE_Gen, []);
            }
            dseGroups.get(item.DSE_Gen).push(item);
          }

          try {
            const [[executer_info]] = await sequelize.query(
              `SELECT (EMPFIRSTNAME + ' ' + ISNULL(EMPLASTNAME, '')) AS full_name, MOBILE_NO 
               FROM EMPLOYEEMASTER WHERE EMPCODE = :dseCode`,
              { replacements: { dseCode: item.DSE_Gen } }
            );

            let colorLabel = "";
            if (item.color) {
              const [[color_code]] = await sequelize.query(
                `SELECT CAST(Misc_Code AS VARCHAR) AS value, Misc_Name AS label 
                 FROM Misc_Mst WHERE Misc_Type = 10 AND Misc_Code = :colorCode`,
                { replacements: { colorCode: item.color } }
              );
              colorLabel = color_code?.label || "";
            }

            // Customer WhatsApp Reminder (As-is)
            if (item.Ph1) {
              await SendWhatsAppMessgae(
                compcode,
                item.Ph1,
                "plan_date_reminder_customer2",
                [
                  { type: "text", text: item.Customer_Name || "Customer" },
                  { type: "text", text: item.cost_modl_grp || "Vehicle" },
                  { type: "text", text: item.cost_modl_varient || "" },
                  { type: "text", text: colorLabel || "" },
                  { type: "text", text: executer_info?.full_name || "Sales Executive" },
                  { type: "text", text: executer_info?.MOBILE_NO || "" },
                  { type: "text", text: companyName },
                  { type: "text", text: companyName },
                ]
              );
              logger.addImpact("WHATSAPP_CUSTOMER", item.Tran_Id, 1);
              executionSummary.customerMessagesSent++;
            }
          } catch (innerErr) {
            logger.setError(innerErr);
            console.error(`Error notifying customer for lead ${item.Tran_Id}:`, innerErr.message);
          }
        }

        // ════════════════════════════════════════════════════════════════
        // 2. DSE / EXECUTIVE NOTIFICATIONS (1 WhatsApp message per DSE with Link)
        // ════════════════════════════════════════════════════════════════
        for (const [dseCode, items] of dseGroups.entries()) {
          try {
            const [[executer_info]] = await sequelize.query(
              `SELECT (EMPFIRSTNAME + ' ' + ISNULL(EMPLASTNAME, '')) AS full_name, MOBILE_NO 
               FROM EMPLOYEEMASTER WHERE EMPCODE = :dseCode`,
              { replacements: { dseCode } }
            );

            if (!executer_info || !executer_info.MOBILE_NO) {
              console.warn(`⚠️ Mobile number not found for DSE: ${dseCode}`);
              continue;
            }

            const encodedCompCode = Buffer.from(compcode.toString()).toString("base64");
            const encodedDseCode = Buffer.from(dseCode.toString()).toString("base64");
            const encodedDate = Buffer.from(planDateStr).toString("base64");

            // Server-Side Rendered Page Link (includes dynamic compcode, dse_code, and date)
            const baseUrl = process.env.BASE_URL || "https://erp.autovyn.com/backend";
            const ssrLink = `${baseUrl}/lead/renderGetTodayPlanDateCustomers?compcode=${encodedCompCode}&dse_code=${encodedDseCode}&date=${encodedDate}`;

            console.log(`📨 Sending Plan Date Report Link to DSE: ${executer_info.full_name} (${dseCode}), Total Leads: ${items.length}`);

            // Primary template: plan_date_reminder_executer1 (5 params)
            // Fallback template: plan_date_reminder_approver1 (3 params)
            try {
              await SendWhatsAppMessgae(
                compcode,
                executer_info.MOBILE_NO,
                "plan_date_reminder_executer1",
                [
                  { type: "text", text: executer_info.full_name || "Sales Executive" },
                  { type: "text", text: String(items.length) },
                  { type: "text", text: moment(planDateStr).format("DD-MM-YYYY") },
                  { type: "text", text: ssrLink },
                  { type: "text", text: companyName },
                ]
              );
              logger.addImpact("WHATSAPP_DSE_SUMMARY", dseCode, 1);
              executionSummary.dseMessagesSent++;
            } catch (tplErr) {
              console.warn(`⚠️ Primary DSE template plan_date_reminder_executer1 failed (${tplErr.message}), trying approver template fallback...`);
              await SendWhatsAppMessgae(
                compcode,
                executer_info.MOBILE_NO,
                "plan_date_reminder_approver1",
                [
                  { type: "text", text: executer_info.full_name || "Sales Executive" },
                  { type: "text", text: ssrLink },
                  { type: "text", text: companyName },
                ]
              );
              logger.addImpact("WHATSAPP_DSE_SUMMARY", dseCode, 1);
              executionSummary.dseMessagesSent++;
            }
          } catch (dseErr) {
            logger.setError(dseErr);
            console.error(`Error sending link to DSE ${dseCode}:`, dseErr.message);
          }
        }

      } catch (err) {
        logger.setError(err);
        executionSummary.errors.push({ compcode, error: err.message });
        console.error(`❌ Plan date reminder failed for dealer ${compcode}:`, err.message);
      } finally {
        if (sequelize) {
          try { await sequelize.close(); } catch (_) {}
        }
      }

      try {
        await logger.save();
        writeDailySchedulerLog(logger.toJSON());
      } catch (logErr) {
        console.error("Logger failed:", logErr.message);
      }
    }
  } catch (globalErr) {
    executionSummary.errors.push({ global: globalErr.message });
    console.error("Global scheduler error:", globalErr.message);
    if (isExpress) {
      return res.status(500).json({
        success: false,
        message: "Failed to run plan date reminder",
        error: globalErr.message,
        summary: executionSummary,
      });
    }
  } finally {
    if (sequelize1) {
      try { await sequelize1.close(); } catch (_) {}
    }
  }

  if (isExpress) {
    return res.status(200).json({
      success: true,
      message: "Plan date reminder executed successfully",
      summary: executionSummary,
    });
  }
  return executionSummary;
}

/**
 * Server-Side Rendered (SSR) HTML Page:
 * Displays today's scheduled customer follow-up list for a specific DSE
 * Route: GET /renderGetTodayPlanDateCustomers?compcode=...&dse_code=...
 */
async function renderGetTodayPlanDateCustomers(req, res) {
  let sequelize;
  try {
    const rawComp = req.query.compcode || req.headers.compcode;
    const rawDse = req.query.dse_code || req.query.DSE_Code || req.query.Appr_id || req.query.empcode;
    const rawDate = req.query.date || req.query.Date || req.query.plan_date;

    if (!rawComp || !rawDse) {
      return res.status(400).send(`
        <div style="font-family:sans-serif;padding:40px;text-align:center;color:#b91c1c;">
          <h2>Invalid Request</h2>
          <p>compcode and dse_code parameters are required.</p>
        </div>
      `);
    }

    const compcode = safeDecode(rawComp);
    const dseCode = safeDecode(rawDse);
    const targetDate = rawDate ? safeDecode(rawDate) : moment().format("YYYY-MM-DD");

    sequelize = await dbname(req, compcode);

    // ─── Fetch BranchDatalogo (favicon) from PrintHeader API ───────────────────
    let faviconUrl = "";
    try {
      const headerApiUrl = `https://erp.autovyn.com/backend/interview/PrintHeader`;
      const headerRes = await fetch(headerApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "compcode": compcode,
        },
        body: JSON.stringify({ multi_loc: "1" }),
      });
      if (headerRes.ok) {
        const headerJson = await headerRes.json();
        faviconUrl = headerJson?.BranchDatalogo || "";
      }
    } catch (faviconErr) {
      console.warn("Could not fetch PrintHeader for favicon:", faviconErr.message);
    }
    // ────────────────────────────────────────────────────────────────────────────

    // Fetch Follow-up Customers for this DSE on targetDate
    const [customerDetails] = await sequelize.query(
      `
      SELECT *
      FROM (
        SELECT
          ed.Cust_Rep,
          FORMAT(r.enquiry_date, 'dd-MM-yyyy') AS enquiry_date_ddmmyyyy,
          FORMAT(ed.Plan_date, 'dd-MM-yyyy') AS plan_date_ddmmyyyy,
          ISNULL(r.cust_feed, '') AS cust_feedback,
          M.Misc_Name AS color_lable,
          COALESCE(M2.Misc_Name, r.cost_modl_grp) AS modl_grp_lable,
          CONCAT(
            emp.EMPCODE, ' ',
            emp.EMPFIRSTNAME, ' ',
            ISNULL(emp.EMPLASTNAME, '')
          ) AS DSENAME,
          emp.MOBILE_NO AS DSEMOBILE_NO,
          emp.EMPCODE AS DSECODE,
          CASE
            WHEN r.Enq_Stat IN (0, 3) THEN 'Open Enquiry'
            WHEN r.Enq_Stat = 4 THEN 'Allotted Enquiry'
            WHEN r.Enq_Stat = 1 THEN 'Delivered Enquiry'
            WHEN r.Enq_Stat = 2 THEN 'Lost Enquiry'
            WHEN r.Enq_Stat = 5 THEN 'Cancelled Enquiry'
            WHEN r.Enq_Stat = 6 THEN 'Booked Enquiry'
            WHEN r.Enq_Stat = 7 THEN 'Invoiced Enquiry'
            WHEN r.Enq_Stat = 8 THEN 'Close Enquiry'
            ELSE 'Unknown'
          END AS enq_stat_label,
          g.Godw_Name AS Branch_Name,
          r.Prefix,
          r.INV_No,
          r.Ledg_Name,
          r.Ph1,
          r.Allot_Modl_Code,
          r.cost_modl_varient,
          r.Tran_Id,
          ROW_NUMBER() OVER (
            PARTITION BY ed.Tran_Id
            ORDER BY ed.SNo DESC
          ) AS rn
        FROM RTL_MST r
        INNER JOIN Enq_Dtl ed
          ON ed.Tran_Id = r.Tran_Id
          AND ed.export_type < 3
        LEFT JOIN Misc_Mst M
          ON M.Misc_Code = r.color
          AND M.Misc_Type = 10
          AND M.Misc_Name <> ''
        LEFT JOIN Misc_Mst M2
          ON M2.Misc_Code = r.Modl_Code
          AND M2.Misc_Type = 14
          AND M2.Misc_Name <> ''
        LEFT JOIN EmployeeMaster emp
          ON emp.empcode = r.DSE_Gen
        OUTER APPLY (
          SELECT TOP 1
            gm.Godw_Name
          FROM Godown_Mst gm
          WHERE gm.Godw_Code = r.Loc_code
            AND (gm.export_type < 3 OR gm.export_type = 50)
        ) g
        WHERE r.export_type < 33
          AND CAST(ed.Plan_date AS DATE) = CAST(:targetDate AS DATE)
          AND r.DSE_Gen = :dseCode
      ) final
      WHERE final.rn = 1
      ORDER BY final.Tran_Id DESC;
      `,
      { replacements: { dseCode, targetDate } }
    );

    const [[company]] = await sequelize.query(`SELECT Comp_Name FROM comp_mst`);
    const companyName = company?.Comp_Name || "Autovyn";

    const [[dseMaster]] = await sequelize.query(
      `SELECT (EMPFIRSTNAME + ' ' + ISNULL(EMPLASTNAME, '')) AS full_name, MOBILE_NO 
       FROM EMPLOYEEMASTER WHERE EMPCODE = :dseCode`,
      { replacements: { dseCode } }
    );
    const dseDisplayName = dseMaster?.full_name || customerDetails[0]?.DSENAME || dseCode;
    const dseMobile = dseMaster?.MOBILE_NO || customerDetails[0]?.DSEMOBILE_NO || "";

    const displayDateFormatted = moment(targetDate).format("DD-MMM-YYYY");

    // ─── Favicon tag (only if faviconUrl is available) ──────────────────────────
    const faviconTag = faviconUrl
      ? `<link rel="icon" type="image/png" href="${faviconUrl}" />`
      : `<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📋</text></svg>" />`;
    // ────────────────────────────────────────────────────────────────────────────

    let rowsHtml = "";
    if (!customerDetails.length) {
      rowsHtml = `
        <tr>
          <td colspan="12" style="text-align:center;padding:40px;color:#64748b;font-size:16px;">
            🎉 <strong>No pending follow-ups found for today!</strong>
          </td>
        </tr>
      `;
    } else {
      rowsHtml = customerDetails
        .map((row, index) => {
          const cleanPhone = String(row.Ph1 || "").replace(/\D/g, "").slice(-10);
          const callLink = cleanPhone
            ? `<a href="tel:${cleanPhone}" class="btn-action btn-call" title="Call">📞 ${cleanPhone}</a>`
            : row.Ph1 || "-";
          const waLink = cleanPhone
            ? `<a href="https://wa.me/91${cleanPhone}" target="_blank" class="btn-action btn-wa" title="WhatsApp">💬 Chat</a>`
            : "";

          let statusBadgeClass = "badge-open";
          if (row.enq_stat_label?.includes("Booked")) statusBadgeClass = "badge-booked";
          else if (row.enq_stat_label?.includes("Allotted")) statusBadgeClass = "badge-allotted";

          return `
            <tr class="data-row">
              <td style="font-weight:600;color:#0f172a;">${index + 1}</td>
              <td style="font-weight:600;">${row.Prefix ? row.Prefix + "/" : ""}${row.INV_No || "-"}</td>
              <td>${row.enquiry_date_ddmmyyyy || "-"}</td>
              <td><strong style="color:#0284c7;">${row.plan_date_ddmmyyyy || "Today"}</strong></td>
              <td style="font-weight:600;color:#1e293b;">${row.Ledg_Name || "Customer"}</td>
              <td>
                <div style="display:flex;align-items:center;gap:6px;">
                  ${callLink}
                  ${waLink}
                </div>
              </td>
              <td><span class="badge ${statusBadgeClass}">${row.enq_stat_label || "Open"}</span></td>
              <td>${row.modl_grp_lable || "-"}</td>
              <td>${row.Allot_Modl_Code || row.cost_modl_varient || "-"}</td>
              <td>${row.color_lable || "-"}</td>
              <td>${row.Branch_Name || "-"}</td>
              <td style="min-width:200px;max-width:300px;white-space:normal;color:#475569;font-size:13px;">
                ${row.Cust_Rep || row.cust_feedback || "<em>No remarks</em>"}
              </td>
            </tr>
          `;
        })
        .join("");
    }

    const htmlResponse = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Today's Plan Date Follow-ups - ${dseDisplayName}</title>
  ${faviconTag}
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #f8fafc;
      padding: 16px;
      margin: 0;
      color: #1e293b;
    }
    .header-card {
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
      color: white;
      border-radius: 12px;
      padding: 20px 24px;
      margin-bottom: 20px;
      box-shadow: 0 4px 12px rgba(30, 58, 138, 0.15);
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .header-logo {
      width: 52px;
      height: 52px;
      object-fit: contain;
      border-radius: 8px;
      background: rgba(255,255,255,0.15);
      padding: 4px;
      border: 1px solid rgba(255,255,255,0.3);
    }
    .header-card h1 {
      margin: 0 0 6px 0;
      font-size: 22px;
      font-weight: 700;
    }
    .header-card .sub-text {
      margin: 0;
      font-size: 14px;
      opacity: 0.9;
    }
    .stat-badge {
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      backdrop-filter: blur(4px);
    }
    .search-bar {
      margin-bottom: 16px;
      display: flex;
      gap: 12px;
      align-items: center;
    }
    .search-input {
      width: 100%;
      max-width: 400px;
      padding: 10px 16px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-size: 14px;
      outline: none;
      background: white;
      transition: all 0.2s ease;
    }
    .search-input:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }
    .table-container {
      max-height: 80vh;
      overflow: auto;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      background: white;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    table {
      border-collapse: collapse;
      width: 100%;
      min-width: 1200px;
      text-align: left;
    }
    th {
      position: sticky;
      top: 0;
      background: #f1f5f9;
      color: #334155;
      font-weight: 600;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 14px 16px;
      border-bottom: 2px solid #cbd5e1;
      z-index: 10;
    }
    td {
      padding: 12px 16px;
      border-bottom: 1px solid #f1f5f9;
      font-size: 14px;
      white-space: nowrap;
    }
    tr.data-row:nth-child(even) {
      background: #fafafa;
    }
    tr.data-row:hover {
      background: #f0f9ff;
    }
    .btn-action {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s;
    }
    .btn-call {
      background: #e0f2fe;
      color: #0369a1;
      border: 1px solid #bae6fd;
    }
    .btn-call:hover {
      background: #0284c7;
      color: white;
    }
    .btn-wa {
      background: #dcfce7;
      color: #15803d;
      border: 1px solid #bbf7d0;
    }
    .btn-wa:hover {
      background: #16a34a;
      color: white;
    }
    .badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
    }
    .badge-open {
      background: #e0f2fe;
      color: #0369a1;
    }
    .badge-booked {
      background: #dcfce7;
      color: #15803d;
    }
    .badge-allotted {
      background: #fef3c7;
      color: #b45309;
    }
    .footer {
      margin-top: 20px;
      font-size: 13px;
      text-align: center;
      color: #64748b;
    }
  </style>
</head>
<body>

  <div class="header-card">
    <div class="header-left">
      ${faviconUrl ? `<img src="${faviconUrl}" alt="${companyName} Logo" class="header-logo" onerror="this.style.display='none'" />` : ""}
      <div>
        <h1>📋 Follow-up Plan (${displayDateFormatted})</h1>
        <p class="sub-text">
          Executive: <strong>${dseDisplayName}</strong> ${dseMobile ? `(${dseMobile})` : ""} | Dealership: <strong>${companyName}</strong>
        </p>
      </div>
    </div>
    <div class="stat-badge">
      Total Follow-ups: <strong>${customerDetails.length}</strong>
    </div>
  </div>

  <div class="search-bar">
    <input 
      type="text" 
      id="filterInput" 
      class="search-input" 
      placeholder="🔍 Search by Customer Name, Phone, or Model..." 
      onkeyup="filterTable()" 
    />
  </div>

  <div class="table-container">
    <table id="followupTable">
      <thead>
        <tr>
          <th>#</th>
          <th>Enquiry No</th>
          <th>Enquiry Date</th>
          <th>Plan Date</th>
          <th>Customer Name</th>
          <th>Customer Phone</th>
          <th>Status</th>
          <th>Model Group</th>
          <th>Model Variant</th>
          <th>Color</th>
          <th>Branch</th>
          <th>Last Customer Feedback</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>
  </div>

  <div class="footer">
    ${faviconUrl ? `<img src="${faviconUrl}" alt="logo" style="height:20px;vertical-align:middle;margin-right:6px;border-radius:3px;" onerror="this.style.display='none'" />` : ""}
    Powered by <strong>${companyName}</strong> &bull; AutoVyn ERP System
  </div>

  <script>
    function filterTable() {
      const input = document.getElementById("filterInput");
      const filter = input.value.toLowerCase();
      const rows = document.querySelectorAll("#followupTable tbody tr.data-row");
      rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(filter) ? "" : "none";
      });
    }
  </script>
</body>
</html>
`;

    res.send(htmlResponse);
  } catch (err) {
    console.error("renderGetTodayPlanDateCustomers error:", err);
    res.status(500).send(`
      <div style="font-family:sans-serif;padding:40px;text-align:center;color:#b91c1c;">
        <h2>Something Went Wrong</h2>
        <p>${err.message}</p>
      </div>
    `);
  } finally {
    if (sequelize) await sequelize.close();
  }
}

/**
 * Server-Side Rendered (SSR) HTML Page:
 * Displays missed follow-up customers (past 3 days) for an Approver/Manager
 * Route: GET /renderGetAllPlanDateCustomers?compcode=...&Appr_id=...
 */

module.exports = {
  runPlanDateReminder,
  renderGetTodayPlanDateCustomers,

};



