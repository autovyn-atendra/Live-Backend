// cronJobs/metaLeadCron.js
const cron           = require("node-cron");
const axios          = require("axios");
const { dbname }     = require("../utils/dbconfig");
const { QueryTypes } = require("sequelize");


// ============================================================
// ⚙️  SYSTEM SETTINGS FOR META LEADS
// ============================================================
const META_CRON_SETTINGS = {
  TIMEZONE            : "Asia/Kolkata",
  SCH_TYPE            : "metalead",
  MAX_DAILY_ATTEMPTS  : 3,
  CALL_CHANNEL        : "META_LEAD_AUTO",
  CALLMATIC_API_KEY   : process.env.CALLMATIC_API_KEY || "857e790e-ad5f-4816-9530-0ae643988229",
  CALLMATIC_BASE_URL  : "https://api.callmatic.ai/v1",
};

/**
 * Single Callmatic Call Helper
 */
const triggerSingleCall = async (phoneNumber, variables = {}, campaignId = null) => {
  try {
    if (!phoneNumber) throw new Error("Phone number is required");
    if (!campaignId) throw new Error("Campaign ID is missing");

    const payload = { campaignId, phoneNumber, variables };
    const response = await axios.post(
      `${META_CRON_SETTINGS.CALLMATIC_BASE_URL}/calls`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": META_CRON_SETTINGS.CALLMATIC_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("[META-CALLMATIC-ERROR]:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Format Phone Number helper
 */
const formatPhoneNumber = (rawPhone) => {
  let formatted = String(rawPhone || "").trim().replace(/[^\d+]/g, "");
  if (formatted.startsWith("0")) formatted = formatted.substring(1);
  if (formatted.length === 10) formatted = `+91${formatted}`;
  else if (formatted.length === 12 && formatted.startsWith("91")) formatted = `+${formatted}`;
  return formatted;
};

// ============================================================
// ⚡ INSTANT CALL TRIGGER (Called immediately when a Meta Lead is saved)
// ============================================================
async function triggerInstantMetaLeadCall({ metaLeadUtd, compcode, callType = "AUTO_AI_CALL", callSource = "CRON_SCHEDULER", createdBy = "AUTO_CRON" }) {
  let sequelize;
  try {
    const finalCompcode = compcode || process.env.META_COMP_CODE || "DB001";
    console.log(`\n[META-INSTANT-CALL] 🚀 Triggering call for Lead UTD #${metaLeadUtd} | Type: ${callType} | Source: ${callSource} | Comp: ${finalCompcode}`);

    sequelize = await dbname(
      { query: "", headers: { compcode: finalCompcode, name: "metaLeadCron" } },
      finalCompcode
    );

    // 1. Fetch Lead Details
    const leads = await sequelize.query(
      `SELECT TOP 1 UTD, Meta_Lead_Id, Full_Name, Phone_Number, Form_Id, Page_Id, Company_Name
       FROM dbo.Meta_Lead_Tbl
       WHERE UTD = :metaLeadUtd`,
      { replacements: { metaLeadUtd }, type: QueryTypes.SELECT }
    );

    if (!leads || leads.length === 0) {
      console.warn(`[META-INSTANT-CALL] ⚠️ Lead UTD #${metaLeadUtd} not found or inactive.`);
      return { success: false, reason: "Lead not found" };
    }

    const lead = leads[0];
    const rawPhone = lead.Phone_Number;
    if (!rawPhone) {
      console.warn(`[META-INSTANT-CALL] ⚠️ Phone number missing for Lead UTD #${metaLeadUtd}`);
      return { success: false, reason: "Phone number missing" };
    }

    const formattedPhone = formatPhoneNumber(rawPhone);

    // 2. Fetch Active Campaign matching Form_Id or Latest Active
    let campResult = null;
    if (lead.Form_Id) {
      campResult = await sequelize.query(
        `SELECT TOP 1 Campaign_Id, Campaign_Name, Meta_Form_Id, Meta_Form_Name, Sales_Executive_Number
         FROM dbo.Meta_Callmatic_Campaign_Tbl
         WHERE Is_Active = 1 AND Meta_Form_Id = :formId
         ORDER BY UTD DESC`,
        { replacements: { formId: lead.Form_Id }, type: QueryTypes.SELECT }
      );
    }

    if (!campResult || campResult.length === 0) {
      campResult = await sequelize.query(
        `SELECT TOP 1 Campaign_Id, Campaign_Name, Meta_Form_Id, Meta_Form_Name, Sales_Executive_Number
         FROM dbo.Meta_Callmatic_Campaign_Tbl
         WHERE Is_Active = 1
         ORDER BY UTD DESC`,
        { type: QueryTypes.SELECT }
      );
    }

    if (!campResult || campResult.length === 0 || !campResult[0].Campaign_Id) {
      console.warn(`[META-INSTANT-CALL] ⚠️ No active Callmatic campaign found in Meta_Callmatic_Campaign_Tbl.`);
      return { success: false, reason: "No active campaign" };
    }

    const camp = campResult[0];
    const campaignId = camp.Campaign_Id;
    const campaignName = camp.Campaign_Name || "Default Meta Campaign";
    const metaFormId = camp.Meta_Form_Id || lead.Form_Id || "";
    const metaFormName = camp.Meta_Form_Name || "";
    const campaignTransferNumber = camp.Sales_Executive_Number || camp.Transfer_Number || null;

    // 3. Prepare Call Variables
    const companyName = lead.Company_Name || "AUTOVYN";
    const calleeName = lead.Full_Name || "Customer";
    const transferNumber = campaignTransferNumber || process.env.META_TRANSFER_NUMBER || "9876543210";

    const variables = {
      company_name: companyName,
      callee_phone_number: formattedPhone,
      callee_name: calleeName,
      transferNumber: transferNumber,
    };

    // 4. Execute Single AI Call
    const callResult = await triggerSingleCall(formattedPhone, variables, campaignId);
    const callId = callResult?.callId || callResult?.id || callResult?.data?.callId || null;

    console.log(`[META-INSTANT-CALL] ✅ AI Call Executed | Lead UTD: #${metaLeadUtd} | Phone: ${formattedPhone} | Call ID: ${callId}`);

    // 5. Insert Log Record into Meta_Call_Log_Tbl
    try {
      await sequelize.query(
        `INSERT INTO dbo.Meta_Call_Log_Tbl (
           Meta_Lead_UTD, Meta_Lead_Id, Call_Id, Call_Type, Call_Source,
           Campaign_Id, Campaign_Name, Meta_Form_Id, Meta_Form_Name, Phone_Number, Created_By, Created_At
         ) VALUES (
           :metaLeadUtd, :metaLeadId, :callId, :callType, :callSource,
           :campaignId, :campaignName, :metaFormId, :metaFormName, :phone, :createdBy, GETDATE()
         )`,
        {
          replacements: {
            metaLeadUtd: lead.UTD,
            metaLeadId: lead.Meta_Lead_Id || "",
            callId: String(callId || ""),
            callType,
            callSource,
            campaignId: String(campaignId),
            campaignName,
            metaFormId: String(metaFormId),
            metaFormName,
            phone: formattedPhone,
            createdBy,
          },
          type: QueryTypes.INSERT,
        }
      );
    } catch (logErr) {
      console.error("[META-INSTANT-CALL] Call Log Insert Error:", logErr?.message);
    }

    // 6. Insert Activity Record into Meta_Lead_Activity_Tbl
    try {
      await sequelize.query(
        `INSERT INTO dbo.Meta_Lead_Activity_Tbl (
           Meta_Lead_UTD, Activity_Type, Title, Description, Created_By, Created_At
         ) VALUES (
           :metaLeadUtd, 'CALL_INITIATED', 'Instant AI Call Initiated', :desc, 'AUTO_LEAD_CALLER', GETDATE()
         )`,
        {
          replacements: {
            metaLeadUtd: lead.UTD,
            desc: `Instant Callmatic AI Call triggered to ${formattedPhone}. Call ID: ${callId || "N/A"}`,
          },
          type: QueryTypes.INSERT,
        }
      );
    } catch (actErr) {
      console.error("[META-INSTANT-CALL] Activity Insert Error:", actErr?.message);
    }

    // 7. Update Meta_Lead_Tbl
    try {
      await sequelize.query(
        `UPDATE dbo.Meta_Lead_Tbl
         SET Call_Status = 'INITIATED',
             Call_Count = ISNULL(Call_Count, 0) + 1,
             Last_Call_At = GETDATE(),
             Updated_At = GETDATE()
         WHERE UTD = :metaLeadUtd`,
        { replacements: { metaLeadUtd: lead.UTD }, type: QueryTypes.UPDATE }
      );
    } catch (updErr) {
      console.error("[META-INSTANT-CALL] Meta Lead Update Error:", updErr?.message);
    }

    return { success: true, callId, callResult };
  } catch (err) {
    console.error(`[META-INSTANT-CALL] ❌ Failed for Lead UTD #${metaLeadUtd}:`, err?.message);
    return { success: false, error: err?.message };
  } finally {
    if (sequelize) { try { await sequelize.close(); } catch (_) {} }
  }
}

// ============================================================
// 🔄 PERIODIC UNCALLED LEADS AUTO-CALL SCHEDULER
// ============================================================
async function processMetaLeadDealer(compcode) {
  let sequelize;
  const result = { compcode, totalFound: 0, callSuccess: 0, callFailed: 0, skipped: 0 };

  try {
    sequelize = await dbname(
      { query: "", headers: { compcode, name: "metaLeadCron" } },
      compcode
    );

    // Fetch uncalled or failed Meta leads created in last 7 days that haven't reached max daily attempts
    let rows = [];
    try {
      rows = await sequelize.query(
        `SELECT TOP 10 UTD, Meta_Lead_Id, Full_Name, Phone_Number, Form_Id, Page_Id, Company_Name
         FROM dbo.Meta_Lead_Tbl
         WHERE status = 0
           AND Phone_Number IS NOT NULL AND LTRIM(RTRIM(Phone_Number)) <> ''
           AND Created_At >= DATEADD(day, -7, GETDATE())
         ORDER BY UTD DESC`,
        {
          type: QueryTypes.SELECT,
        }
      );
    } catch (qErr) {
      console.error(`[META-AUTO-CALL] Fetch leads error:`, qErr?.message);
    }

    result.totalFound = rows.length;
    if (rows.length === 0) return result;

    console.log(`[META-AUTO-CALL] [${compcode}] Found ${rows.length} pending Meta leads for auto-calling.`);

    for (const row of rows) {
      try {
        const callRes = await triggerInstantMetaLeadCall({
          metaLeadUtd: row.UTD,
          compcode,
          callType: "AUTO_AI_CALL",
          callSource: "CRON_RETRY_SCHEDULER",
          createdBy: "AUTO_CRON",
        });
        if (callRes.success) result.callSuccess++;
        else result.callFailed++;
      } catch (callErr) {
        result.callFailed++;
      }

      // Inter-call delay (2 seconds)
      await new Promise((r) => setTimeout(r, 2000));
    }
  } catch (err) {
    console.error(`[META-AUTO-CALL] [${compcode}] Error:`, err?.message);
  } finally {
    if (sequelize) { try { await sequelize.close(); } catch (_) {} }
  }

  return result;
}

/**
 * ⏰ PROCESS DUE SCHEDULED FOLLOWUP CALLS FROM META_LEAD_FOLLOWUP_TBL
 */
async function processScheduledFollowupCalls(compcode) {
  let sequelize;
  const finalCompcode = compcode || String(process.env.META_COMP_CODE).trim();

  try {
    sequelize = await dbname(
      { query: "", headers: { compcode: finalCompcode, name: "metaLeadCron" } },
      finalCompcode
    );

    // Fetch pending follow-ups due up to current date & time
    const dueFollowups = await sequelize.query(
      `SELECT TOP 10 
          f.UTD AS Followup_UTD,
          f.Meta_Lead_UTD,
          f.Followup_Date,
          f.Followup_Time,
          f.Purpose
       FROM dbo.Meta_Lead_Followup_Tbl f
       INNER JOIN dbo.Meta_Lead_Tbl l ON l.UTD = f.Meta_Lead_UTD
       WHERE f.Followup_Status = 'PENDING'
         AND ISNULL(l.status, 0) NOT IN (3, 9) -- Exclude exhausted/closed leads
         AND CAST(CONCAT(f.Followup_Date, ' ', ISNULL(NULLIF(LTRIM(RTRIM(f.Followup_Time)), ''), '00:00:00')) AS DATETIME) <= GETDATE()
       ORDER BY f.UTD ASC`,
      { type: QueryTypes.SELECT }
    );

    if (!dueFollowups || dueFollowups.length === 0) return;

    console.log(`[META-SCHEDULED-CALL] [${finalCompcode}] Found ${dueFollowups.length} due scheduled follow-up calls to trigger.`);

    for (const item of dueFollowups) {
      try {
        await triggerInstantMetaLeadCall({
          metaLeadUtd: item.Meta_Lead_UTD,
          compcode: finalCompcode,
          callType: "AUTO_AI_CALL",
          callSource: "CRON_SCHEDULED_CALLBACK",
          createdBy: "AUTO_CRON",
        });
        
        // Mark follow-up as COMPLETED
        await sequelize.query(
          `UPDATE dbo.Meta_Lead_Followup_Tbl
           SET Followup_Status = 'COMPLETED',
               Remark = CONCAT(ISNULL(Remark, ''), ' [Auto Scheduled Call Executed at ', GETDATE(), ']')
           WHERE UTD = :followupUtd`,
          { replacements: { followupUtd: item.Followup_UTD }, type: QueryTypes.UPDATE }
        );

        console.log(`[META-SCHEDULED-CALL] [${finalCompcode}] ✅ Triggered scheduled call for Lead #${item.Meta_Lead_UTD} (Followup UTD #${item.Followup_UTD})`);
      } catch (err) {
        console.error(`[META-SCHEDULED-CALL] [${finalCompcode}] ❌ Failed scheduled call for Lead #${item.Meta_Lead_UTD}:`, err?.message);
      }

      await new Promise((r) => setTimeout(r, 2000));
    }
  } catch (err) {
    console.error(`[META-SCHEDULED-CALL] [${finalCompcode}] Error:`, err?.message);
  } finally {
    if (sequelize) { try { await sequelize.close(); } catch (_) {} }
  }
}

/**
 * Run Auto Call Scheduler across all dealers
 */
async function runMetaLeadAutoCallScheduler() {
  console.log("Running scheduled job for Meta Lead Auto-Call...");

  let sequelize1 = null;
  try {
    sequelize1 = await dbname(
      { query: "", headers: { compcode: "DBCON", name: "schedualer" } },
      "DBCON"
    );
  } catch (err) {
    console.error("[META-CRON] DBCON Connection Error:", err?.message);
  }

  let Dlr_data = [];
  if (sequelize1) {
    try {
      const [rows] = await sequelize1.query(
        `SELECT Dlr_Id FROM DLR_SCH WHERE SCH_TYPE = 'metalead' AND export_type < 3`
      );
      if (Array.isArray(rows) && rows.length > 0) {
        Dlr_data = rows;
      }
    } catch (e) {
      console.warn("[META-CRON] Query DLR_SCH fallback to default compcode:", e?.message);
    }
  }

  if (Dlr_data.length === 0) {
    const defaultCompcode = String(process.env.META_COMP_CODE || "autovyn").trim();
    Dlr_data = [{ Dlr_Id: defaultCompcode }];
  }

  for (const dealer of Dlr_data) {
    const compcode = dealer.Dlr_Id;

    try {
      await processScheduledFollowupCalls(compcode);
      await processMetaLeadDealer(compcode);
    } catch (err) {
      console.error(`Meta Lead Auto-Call job failed for ${compcode}:`, err?.message);
    }
  }

  if (sequelize1) {
    try {
      await sequelize1.close();
    } catch (_) {}
  }
}

// ============================================================
// 🔄 WEBHOOK CALL SYNC SCHEDULER FOR META LEADS
// ============================================================
async function processMetaLeadWebhookUpdates() {
  let sequelize;
  const compCode = String(process.env.META_COMP_CODE || "DB001").trim();

  try {
    sequelize = await dbname(
      { query: "", headers: { compcode: compCode, name: "metaLeadCron" } },
      compCode
    );

    // Fetch call logs with Call_Id
    const pendingLogs = await sequelize.query(
      `SELECT TOP 20 log.UTD AS Log_UTD, log.Meta_Lead_UTD, log.Call_Id, log.Phone_Number
       FROM dbo.Meta_Call_Log_Tbl log
       WHERE log.Call_Id IS NOT NULL
       ORDER BY log.UTD DESC`,
      { type: QueryTypes.SELECT }
    );

    if (!pendingLogs || pendingLogs.length === 0) return;

    const { autoSyncLeadCalls } = require("../routes/metaWebhookRoutes");

    for (const item of pendingLogs) {
      if (typeof autoSyncLeadCalls === "function") {
        await autoSyncLeadCalls(sequelize, item.Meta_Lead_UTD);
      }
      await new Promise((r) => setTimeout(r, 500));
    }
  } catch (err) {
    console.error("[META-WEBHOOK-SYNC] Error:", err?.message);
  } finally {
    if (sequelize) { try { await sequelize.close(); } catch (_) {} }
  }
}

// ============================================================
// 🚀 MAIN META LEAD CRON REGISTER
// ============================================================
const startMetaLeadCron = () => {
  console.log("\n[META-CRON] ══════════════════════════════════════════");
  console.log("[META-CRON] Meta Lead Auto-Call & Sync Cron Registered ✅");
  console.log("[META-CRON] Instant Trigger   : On New Webhook Lead Arrival");
  console.log("[META-CRON] Scheduled & Retry: Every 5 Minutes");
  console.log("[META-CRON] 3-Day Rule Limit  : Max 3 Attempts across 3 Days");
  console.log("[META-CRON] Webhook Sync     : Every 3 Minutes");
  console.log(`[META-CRON] Timezone         : ${META_CRON_SETTINGS.TIMEZONE}`);
  console.log("[META-CRON] ══════════════════════════════════════════\n");

  // ── Retry Uncalled Leads Every 5 Minutes ─────────────────
  cron.schedule(
    "*/5 * * * *",
    async () => {
      try { await runMetaLeadAutoCallScheduler(); }
      catch (err) { console.error("[META-AUTO-CALL-CRON] Error:", err?.message); }
    },
    { timezone: META_CRON_SETTINGS.TIMEZONE }
  );

  // ── Sync Webhook Call Responses Every 3 Minutes ───────────
  cron.schedule(
    "*/3 * * * *",
    async () => {
      try { await processMetaLeadWebhookUpdates(); }
      catch (err) { console.error("[META-SYNC-CRON] Error:", err?.message); }
    },
    { timezone: META_CRON_SETTINGS.TIMEZONE }
  );
};

module.exports = {
  startMetaLeadCron,
  triggerInstantMetaLeadCall,
  runMetaLeadAutoCallScheduler,
  processScheduledFollowupCalls,
  processMetaLeadWebhookUpdates,
};
