

// cronJobs/cronJobs.js
const cron           = require("node-cron");
const { dbname }     = require("../utils/dbconfig");
const { QueryTypes } = require("sequelize");

// ============================================================
// ⚙️  SYSTEM SETTINGS
// ============================================================
const SYSTEM_SETTINGS = {
  TIMEZONE      : "Asia/Kolkata",
  SCH_TYPE      : "servicereminder",
  APPT_SCHEDULE : "*/15 * * * *",
  FINAL_STATUSES: [
    "completed", "call-transferred", "transferred",
    "failed", "no-answer", "no_answer", "busy", "answered",
  ],
  SAFETY_SKIP_DELAY_MS : 300,
  FALLBACK_MAX_ATTEMPTS: 3,

  // ✅ Channel constants — ek jagah define karo
  CHANNEL_AUTO_AI  : "AI_CALL",         // Cron/auto se jaane wali call
  CHANNEL_MANUAL_AI: "MANUAL_AI_CALL",  // Manual trigger se jaane wali call

  // ✅ Webhook mein dono channels match karein
  WEBHOOK_CHANNELS : ["AI_CALL", "MANUAL_AI_CALL"],
};

// ============================================================
// 🔧 GENERIC HELPERS
// ============================================================
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    const parts = String(dateStr).split("-");
    if (parts.length !== 3) return String(dateStr);
    const [y, mo, d] = parts;
    if (!y || !mo || !d) return String(dateStr);
    return `${d.padStart(2, "0")}/${mo.padStart(2, "0")}/${y}`;
  } catch (_) { return String(dateStr); }
};

const ddmmyyyyToYYYYMMDD = (dateStr) => {
  if (!dateStr) return null;
  try {
    const str = String(dateStr).trim();
    const m1  = str.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
    if (m1)
      return `${m1[3]}-${m1[2].padStart(2, "0")}-${m1[1].padStart(2, "0")}`;
    const m2 = str.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
    if (m2)
      return `${m2[1]}-${m2[2].padStart(2, "0")}-${m2[3].padStart(2, "0")}`;
    return null;
  } catch (_) { return null; }
};

const buildSlots = (reminderDateStr, slotTimes = {}) => {
  let baseDate;
  if (reminderDateStr && String(reminderDateStr).trim() !== "") {
    baseDate = new Date(String(reminderDateStr).trim());
  } else {
    baseDate = new Date();
  }
  if (isNaN(baseDate.getTime())) baseDate = new Date();

  const toDDMMYYYY = (dt) => {
    const dd   = String(dt.getDate()).padStart(2, "0");
    const mm   = String(dt.getMonth() + 1).padStart(2, "0");
    const yyyy = dt.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const slotDate = toDDMMYYYY(baseDate);
  return {
    slot1_date: slotDate, slot1_time: slotTimes.slot1 || "",
    slot2_date: slotDate, slot2_time: slotTimes.slot2 || "",
    slot3_date: slotDate, slot3_time: slotTimes.slot3 || "",
  };
};

const getISTNow = () => {
  const now       = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  return new Date(now.getTime() + istOffset - (now.getTimezoneOffset() * 60000));
};

const parseTime12 = (timeStr) => {
  if (!timeStr) return null;
  const m = String(timeStr).trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return null;
  let hours     = parseInt(m[1]);
  const minutes = parseInt(m[2]);
  const period  = m[3].toUpperCase();
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours  = 0;
  return { hours, minutes };
};

const isAppointmentTimeNow = (apptDateStr, apptTimeStr) => {
  if (!apptDateStr || !apptTimeStr) return false;
  try {
    const apptDate = new Date(String(apptDateStr).trim());
    if (isNaN(apptDate.getTime())) return false;
    const parsed = parseTime12(apptTimeStr);
    if (!parsed) return false;
    const istNow   = getISTNow();
    const todayStr =
      `${istNow.getFullYear()}-` +
      `${String(istNow.getMonth() + 1).padStart(2, "0")}-` +
      `${String(istNow.getDate()).padStart(2, "0")}`;
    const apptStr  =
      `${apptDate.getFullYear()}-` +
      `${String(apptDate.getMonth() + 1).padStart(2, "0")}-` +
      `${String(apptDate.getDate()).padStart(2, "0")}`;
    if (todayStr !== apptStr) return false;
    const nowMinutes = istNow.getHours() * 60 + istNow.getMinutes();
    const startMin   = parsed.hours * 60 + parsed.minutes - 5;
    const endMin     = parsed.hours * 60 + parsed.minutes + 10;
    return nowMinutes >= startMin && nowMinutes <= endMin;
  } catch (_) { return false; }
};

const normalizeCallStatus = (rawStatus) => {
  const s = String(rawStatus || "").toLowerCase().trim();
  if (["completed", "completed-call", "call-completed", "ended", "transferred", "call-transferred"].includes(s)) return "COMPLETED";
  if (s === "answered") return "ANSWERED";
  if (["failed", "canceled", "cancelled"].includes(s)) return "FAILED";
  if (["no-answer", "no_answer"].includes(s)) return "NO_ANSWER";
  if (s === "busy") return "BUSY";
  return "INITIATED";
};

// ============================================================
// ✅ COLUMN CHECK HELPER
// ============================================================
const checkColumns = async (sequelize) => {
  try {
    const cols = await sequelize.query(
      `SELECT COLUMN_NAME
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_NAME = 'Srv_Reminder_Tbl'
         AND COLUMN_NAME IN (
           'Daily_Attempt_Count',
           'Reminder_Channel',
           'Last_Reminder_At',
           'Updated_At',
           'AI_Call_ID'
         )`,
      { type: QueryTypes.SELECT }
    );
    const existing = cols.map((c) => c.COLUMN_NAME);
    return {
      hasDailyAttempt   : existing.includes("Daily_Attempt_Count"),
      hasReminderChannel: existing.includes("Reminder_Channel"),
      hasLastReminderAt : existing.includes("Last_Reminder_At"),
      hasUpdatedAt      : existing.includes("Updated_At"),
      hasAiCallId       : existing.includes("AI_Call_ID"),
    };
  } catch (_) {
    return {
      hasDailyAttempt   : false,
      hasReminderChannel: false,
      hasLastReminderAt : false,
      hasUpdatedAt      : false,
      hasAiCallId       : false,
    };
  }
};

// ============================================================
// ✅ LOCATION CONFIG FETCHER
// ============================================================
const getLocationConfig = async (sequelize, locCode, cache) => {
  const rawKey   =
    locCode !== null && locCode !== undefined
      ? String(locCode).trim()
      : "";
  const cacheKey = rawKey || "__GLOBAL__";

  if (cache.has(cacheKey)) return cache.get(cacheKey);

  try {
    const rows = await sequelize.query(
      `SELECT TOP 1 *
       FROM dbo.Srv_Reminder_Config_Tbl
       WHERE status = 1
         AND (
               CAST(Loc_Code AS VARCHAR(50)) = :locCode
               OR Loc_Code IS NULL
             )
       ORDER BY
         CASE WHEN CAST(Loc_Code AS VARCHAR(50)) = :locCode THEN 0 ELSE 1 END,
         UTD DESC`,
      { replacements: { locCode: rawKey }, type: QueryTypes.SELECT }
    );

    const config = rows?.[0] || null;
    cache.set(cacheKey, config);

    if (config) {
      console.log(
        `[CONFIG] Loc_Code: ${rawKey || "GLOBAL"} → UTD: ${config.UTD}` +
        ` | ${config.Service_Center_Name}`
      );
    } else {
      console.warn(
        `[CONFIG] ⚠️ No active config | Loc_Code: ${rawKey || "GLOBAL"}`
      );
    }

    return config;
  } catch (err) {
    console.error(`[CONFIG] Error Loc_Code=${rawKey}:`, err?.message);
    cache.set(cacheKey, null);
    return null;
  }
};

// ============================================================
// ✅ SERVICE EXECUTIVE RESOLVER
//   Priority 1 → row.srv_exec_mobile  (Srv_Cust_Vehi_Tbl)
//   Priority 2 → config.Sales_Exec_Number (Srv_Reminder_Config_Tbl)
// ============================================================
const resolveServiceExecutive = (row, config) => {
  let execName    = row?.srv_exec_name
    ? String(row.srv_exec_name).trim()     : "";
  let execEmpCode = row?.srv_exec_Emp_Code
    ? String(row.srv_exec_Emp_Code).trim() : "";
  let execMobile  = row?.srv_exec_mobile
    ? String(row.srv_exec_mobile).trim()   : "";
  let execSource  = "Not_Found";

  if (execMobile !== "") {
    execSource = "Srv_Cust_Vehi_Tbl";
  } else {
    const cfgExecMobile = config?.Sales_Exec_Number
      ? String(config.Sales_Exec_Number).trim()
      : "";
    if (cfgExecMobile !== "") {
      execMobile = cfgExecMobile;
      execSource = "Config_Table";
    }
  }

  return {
    execName,
    execEmpCode,
    execMobile,
    execSource,
    finalTransferNumber: execMobile || "",
  };
};

// ============================================================
// SMART SUMMARY PARSER
// ============================================================
const parseAppointmentFromSummary = (summary, variables) => {
  if (!summary) return null;
  const text = String(summary).trim();
  console.log("[PARSER] Summary:", text);

  const result = {
    slotNumber     : null,
    appointmentDate: null,
    appointmentTime: null,
    rawDateFound   : null,
  };

  const slotPatterns = [
    /(?:स्लॉट|slot)\s*[-–—]?\s*([123])/i,
    /slot\s+number\s*([123])/i,
    /([123])(?:st|nd|rd)?\s+slot/i,
    /slot\s*([123])/i,
  ];

  for (const pat of slotPatterns) {
    const m = text.match(pat);
    if (m) {
      result.slotNumber = parseInt(m[1], 10);
      console.log("[PARSER] Slot found:", result.slotNumber);
      break;
    }
  }

  const allDates = [];
  let m1;
  const re1 = /(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/g;
  while ((m1 = re1.exec(text)) !== null)
    allDates.push(
      `${m1[3]}-${m1[2].padStart(2, "0")}-${m1[1].padStart(2, "0")}`
    );
  let m2;
  const re2 = /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/g;
  while ((m2 = re2.exec(text)) !== null)
    allDates.push(
      `${m2[1]}-${m2[2].padStart(2, "0")}-${m2[3].padStart(2, "0")}`
    );
  const uniqueDates = [...new Set(allDates)];
  console.log("[PARSER] Dates found:", uniqueDates);

  if (result.slotNumber && variables) {
    const slotDateVar = variables?.[`slot${result.slotNumber}_date`];
    const slotTimeVar = variables?.[`slot${result.slotNumber}_time`];
    if (slotDateVar) {
      result.appointmentDate = ddmmyyyyToYYYYMMDD(slotDateVar);
      result.appointmentTime = slotTimeVar || null;
      result.rawDateFound    = slotDateVar;
      console.log(
        `[PARSER] Slot ${result.slotNumber} → ${result.appointmentDate}` +
        ` ${result.appointmentTime}`
      );
    } else if (uniqueDates.length >= result.slotNumber) {
      result.appointmentDate = uniqueDates[result.slotNumber - 1];
      result.rawDateFound    = result.appointmentDate;
    } else if (uniqueDates.length > 0) {
      result.appointmentDate = uniqueDates[0];
      result.rawDateFound    = uniqueDates[0];
    }
  } else if (uniqueDates.length > 0) {
    result.appointmentDate = uniqueDates[0];
    result.rawDateFound    = uniqueDates[0];
  }

  if (!result.appointmentTime) {
    const timeMatch = text.match(/(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm))/i);
    if (timeMatch)
      result.appointmentTime = timeMatch[1].toUpperCase();
  }

  if (result.appointmentDate) {
    const d = new Date(result.appointmentDate);
    if (isNaN(d.getTime())) {
      console.warn("[PARSER] Invalid date:", result.appointmentDate);
      result.appointmentDate = null;
    }
  }

  console.log("[PARSER] Result:", JSON.stringify(result));
  return result.appointmentDate ? result : null;
};

// ============================================================
// TRANSCRIPT PARSER (fallback)
// ============================================================
const parseFromTranscript = (transcriptJson, variables) => {
  if (!transcriptJson) return null;
  try {
    const transcript =
      typeof transcriptJson === "string"
        ? JSON.parse(transcriptJson)
        : Array.isArray(transcriptJson)
        ? transcriptJson
        : [];
    if (!Array.isArray(transcript)) return null;

    for (const msg of transcript) {
      if (String(msg?.sender || "").toLowerCase() !== "bot") continue;
      const text = String(msg?.text || "").trim();
      if (!text) continue;

      const slotPatterns = [
        /slot\s*[-–]?\s*(\d)/i,
        /स्लॉट\s*(\d)/i,
        /(\d)\s*(?:st|nd|rd)?\s*slot/i,
      ];
      let slotNum = null;
      for (const pat of slotPatterns) {
        const m = text.match(pat);
        if (m) { slotNum = parseInt(m[1]); break; }
      }

      if (slotNum && variables?.[`slot${slotNum}_date`]) {
        const appointmentDate = ddmmyyyyToYYYYMMDD(
          variables[`slot${slotNum}_date`]
        );
        if (appointmentDate) {
          console.log(`[TRANSCRIPT] Slot ${slotNum} → ${appointmentDate}`);
          return {
            slotNumber     : slotNum,
            appointmentDate: appointmentDate,
            appointmentTime: variables[`slot${slotNum}_time`] || null,
            rawDateFound   : variables[`slot${slotNum}_date`],
            source         : "transcript",
          };
        }
      }
    }
  } catch (e) { console.warn("[TRANSCRIPT] Parse error:", e?.message); }
  return null;
};

// ============================================================
// STEP 1 — ACTIVE DEALERS FETCH
// ============================================================
const getActiveDealers = async () => {
  let sequelize1;
  try {
    sequelize1 = await dbname(
      { query: "", headers: { compcode: "DBCON", name: "scheduler" } },
      "DBCON"
    );
    const dealers = await sequelize1.query(
      `SELECT DISTINCT LTRIM(RTRIM(Dlr_Id)) AS Dlr_Id
       FROM DLR_SCH
       WHERE LTRIM(RTRIM(UPPER(SCH_TYPE))) = UPPER(:schType)
         AND export_type < 3
         AND Dlr_Id IS NOT NULL
         AND LTRIM(RTRIM(Dlr_Id)) <> ''`,
      {
        replacements: { schType: SYSTEM_SETTINGS.SCH_TYPE },
        type: QueryTypes.SELECT,
      }
    );
    console.log(`[CRON] Dealers found: ${dealers?.length || 0}`);
    return dealers || [];
  } catch (err) {
    console.error("[CRON] DBCON error:", err?.message);
    return [];
  } finally {
    if (sequelize1) { try { await sequelize1.close(); } catch (_) {} }
  }
};

// ============================================================
// STEP 2 — PENDING REMINDERS FETCH
// ✅ FIX: Call_Status = 'INITIATED' wale skip nahi hone chahiye
//         agar unka callId kho gaya — isliye sirf FAILED/NO_ANSWER/BUSY
//         ko retry karo. INITIATED already chal raha hai.
// ============================================================
const getPendingReminders = async (compcode, attemptNumber = 1) => {
  let sequelize;
  try {
    sequelize = await dbname(
      { query: "", headers: { compcode, name: "scheduler" } },
      compcode
    );
    console.log(
      `[CRON] [${compcode}] DB connected ✅ | Attempt: ${attemptNumber}`
    );

    const cols = await checkColumns(sequelize);
    console.log(`[CRON] [${compcode}] Columns:`, JSON.stringify(cols));

    const dailyAttemptSelect = cols.hasDailyAttempt
      ? `ISNULL(r.Daily_Attempt_Count, 0)  AS Daily_Attempt_Count,`
      : `0                                  AS Daily_Attempt_Count,`;

    // ── DEBUG: Aaj ke sabhi reminders ────────────────────
    const debugRows = await sequelize.query(
      `SELECT
         r.UTD,
         r.Reminder_Status,
         ${
           cols.hasReminderChannel
             ? "r.Reminder_Channel,"
             : `'${SYSTEM_SETTINGS.CHANNEL_AUTO_AI}' AS Reminder_Channel,`
         }
         r.Call_Status,
         r.Service_Status,
         r.Loc_Code,
         r.status                                                    AS row_status,
         CONVERT(varchar(10), r.Reminder_Date, 23)                  AS Reminder_Date,
         CONVERT(date, GETDATE())                                    AS Today,
         CASE WHEN CAST(r.Reminder_Date AS DATE) = CONVERT(date, GETDATE())
              THEN 'YES' ELSE 'NO' END                              AS Is_Today
       FROM dbo.Srv_Reminder_Tbl r
       WHERE r.status = 1
       ORDER BY r.UTD DESC`,
      { type: QueryTypes.SELECT }
    );

    console.log(
      `[CRON] [${compcode}] Total active reminders: ${debugRows.length}`
    );
    debugRows.forEach((r) => {
      console.log(
        `  UTD:${r.UTD} | Status:${r.Reminder_Status}` +
        ` | Date:${r.Reminder_Date} | IsToday:${r.Is_Today}` +
        ` | Loc:${r.Loc_Code} | Channel:${r.Reminder_Channel}` +
        ` | CallStatus:${r.Call_Status}`
      );
    });

    // ── MAIN QUERY ────────────────────────────────────────
    // ✅ FIX 1: Reminder_Channel filter HATA diya
    //           Dono channel (AI_CALL + MANUAL_AI_CALL) eligible
    // ✅ FIX 2: srv_exec fields added
    const rows = await sequelize.query(
      `SELECT
         r.UTD                                                        AS Reminder_UTD,
         r.Cust_Vehi_UTD,
         r.Loc_Code,
         r.Reminder_Status,
         r.Service_Status,
         r.Call_Status,
         r.Reminder_Count,
         ${dailyAttemptSelect}
         CONVERT(varchar(10), r.Reminder_Date,  23)                  AS Reminder_Date,
         CONVERT(varchar(10), r.Final_Due_Date, 23)                  AS Final_Due_Date,
         CONVERT(varchar(10), r.Followup_Date,  23)                  AS Followup_Date,
         c.Cust_Name,
         c.Cust_Mob,
         c.Model_Name,
         c.srv_exec_name,
         c.srv_exec_Emp_Code,
         c.srv_exec_mobile,
         m.Veh_Reg_No,
         m.UTD                                                        AS Mst_Vehi_UTD
       FROM dbo.Srv_Reminder_Tbl r
       INNER JOIN dbo.Srv_Cust_Vehi_Tbl c ON c.UTD = r.Cust_Vehi_UTD
       LEFT  JOIN dbo.Srv_Mst_Vehi_Tbl  m ON m.UTD = c.Tran_id
       WHERE r.status              = 1
         AND r.Reminder_Status     = 'PENDING'
         AND ISNULL(r.Service_Status, '') <> 'COMPLETED'
         AND CAST(r.Reminder_Date AS DATE) = CONVERT(date, GETDATE())
         AND (
               r.Call_Status IS NULL
               OR r.Call_Status IN ('FAILED', 'NO_ANSWER', 'BUSY')
             )
         AND c.Cust_Mob IS NOT NULL
         AND LTRIM(RTRIM(c.Cust_Mob)) <> ''
       ORDER BY r.UTD ASC`,
      { type: QueryTypes.SELECT }
    );

    console.log(
      `[CRON] [${compcode}] ✅ Reminders eligible for calling: ${rows?.length || 0}`
    );

    // ── Debug breakdown jab rows = 0 ──────────────────────
    if (rows.length === 0 && debugRows.length > 0) {
      const todayRows    = debugRows.filter((r) => r.Is_Today === "YES");
      const pendingToday = todayRows.filter(
        (r) => r.Reminder_Status === "PENDING"
      );
      console.log(`[CRON] [${compcode}] ⚠️ Debug breakdown:`);
      console.log(`  Total active    : ${debugRows.length}`);
      console.log(`  Is Today        : ${todayRows.length}`);
      console.log(`  PENDING + Today : ${pendingToday.length}`);

      if (pendingToday.length > 0) {
        console.log(`  Why skipped?`);
        pendingToday.forEach((r) => {
          const reasons = [];
          if (r.Call_Status === "INITIATED")
            reasons.push("Call already INITIATED — waiting for webhook");
          if (!reasons.length)
            reasons.push(`Call_Status: ${r.Call_Status}`);
          console.log(
            `    UTD:${r.UTD} | Loc:${r.Loc_Code}` +
            ` | Channel:${r.Reminder_Channel}` +
            ` | CallStatus:${r.Call_Status}` +
            ` | Reason: ${reasons.join(", ")}`
          );
        });
      }
    }

    return { rows: rows || [], sequelize, cols };
  } catch (err) {
    console.error(`[CRON] [${compcode}] Error:`, err?.message);
    console.error(`[CRON] [${compcode}] Stack:`, err?.stack);
    if (sequelize) { try { await sequelize.close(); } catch (_) {} }
    return { rows: [], sequelize: null, cols: {} };
  }
};

// ============================================================
// CALL TRIGGER
// ✅ FIX: Reminder_Channel = 'AI_CALL' (auto cron se)
//         MANUAL_AI_CALL sirf manual trigger se
//         channel param se control hoga
// ============================================================
const triggerCallForReminder = async (
  sequelize,
  row,
  attemptNumber = 1,
  cols          = {},
  config,
  // ✅ NEW param: default AI_CALL, manual se MANUAL_AI_CALL pass karo
  reminderChannel = SYSTEM_SETTINGS.CHANNEL_AUTO_AI
) => {
  const { triggerSingleCall } = require("../routes/callmati");

  const reminderUTD = row.Reminder_UTD;
  const phoneNumber = String(row.Cust_Mob || "").trim();

  const slots = buildSlots(row.Reminder_Date, {
    slot1: config.Slot1_Time,
    slot2: config.Slot2_Time,
    slot3: config.Slot3_Time,
  });

  // ✅ Service Executive resolve — priority based
  const {
    execName,
    execEmpCode,
    execMobile,
    execSource,
    finalTransferNumber,
  } = resolveServiceExecutive(row, config);

  console.log(
    `[CRON] Exec resolve → UTD:${reminderUTD}` +
    ` | Mobile:${execMobile || "N/A"} | Source:${execSource}`
  );

  const variables = {
    callee_name           : String(row.Cust_Name  || "Customer").trim(),
    vehicle_model         : String(row.Model_Name || "").trim(),
    vehicle_number        : String(row.Veh_Reg_No || "").trim(),
    showroom_name         : config.Service_Center_Name    || "",
    service_center_name   : config.Service_Center_Name    || "",
    service_center_address: config.Service_Center_Address || "",
    working_hours         : config.Working_Hours          || "",
    slot1_date            : slots.slot1_date,
    slot1_time            : slots.slot1_time,
    slot2_date            : slots.slot2_date,
    slot2_time            : slots.slot2_time,
    slot3_date            : slots.slot3_date,
    slot3_time            : slots.slot3_time,
    callback_date         : formatDate(row.Followup_Date || row.Reminder_Date) || "",
    callback_time         : config.Callback_Time || "",
    transferNumber        : finalTransferNumber,
    exec_name             : execName    || "",
    exec_emp_code         : execEmpCode || "",
  };

  const campaignId = config.Campaign_Id;

  console.log(
    `[CRON] 📞 Calling: ${phoneNumber} | ${row.Veh_Reg_No}` +
    ` | UTD: ${reminderUTD} | Loc: ${row.Loc_Code}` +
    ` | Attempt: ${attemptNumber} | Channel: ${reminderChannel}`
  );

  let callResult, callId, calledPhone;

  try {
    callResult = await triggerSingleCall(phoneNumber, variables, campaignId);
    console.log(`[CRON] Raw callResult:`, JSON.stringify(callResult));

    callId =
      callResult?.callId                   ||
      callResult?.data?.callId             ||
      callResult?.data?.data?.callId       ||
      callResult?.call_id                  ||
      callResult?.data?.call_id            ||
      callResult?.id                       ||
      callResult?.data?.id                 ||
      callResult?.calls?.[0]?.callId       ||
      callResult?.data?.calls?.[0]?.callId ||
      null;

    calledPhone =
      callResult?.phoneNumber             ||
      callResult?.data?.phoneNumber       ||
      callResult?.data?.data?.phoneNumber ||
      callResult?.phone_number            ||
      callResult?.data?.phone_number      ||
      phoneNumber;

    console.log(
      `[CRON] ✅ Call OK | UTD: ${reminderUTD}` +
      ` | callId: ${callId} | Channel: ${reminderChannel}`
    );
  } catch (callErr) {
    console.error(
      `[CRON] ❌ Call FAILED | UTD: ${reminderUTD} | ${callErr?.message}`
    );

    // ── Call fail → FAILED update ─────────────────────────
    try {
      const failClauses = ["Call_Status = 'FAILED'"];
      const failReplace = { UTD: Number(reminderUTD) };

      // ✅ FIX: Channel correct rakho fail hone par bhi
      if (cols.hasReminderChannel) {
        failClauses.push("Reminder_Channel = :reminderChannel");
        failReplace.reminderChannel = reminderChannel;
      }
      if (cols.hasDailyAttempt) {
        failClauses.push(
          "Daily_Attempt_Count = ISNULL(Daily_Attempt_Count, 0) + 1"
        );
      }
      if (cols.hasUpdatedAt) {
        failClauses.push("Updated_At = GETDATE()");
      }

      await sequelize.query(
        `UPDATE dbo.Srv_Reminder_Tbl
         SET ${failClauses.join(", ")}
         WHERE UTD = :UTD`,
        { replacements: failReplace, type: QueryTypes.UPDATE }
      );
    } catch (_) {}

    throw callErr;
  }

  // ── call_Id_dtl save ──────────────────────────────────────
  if (callId) {
    try {
      await sequelize.query(
        `INSERT INTO dbo.call_Id_dtl (mob_no, call_id, call_type)
         VALUES (:mob_no, :call_id, :call_type)`,
        {
          replacements: {
            mob_no   : calledPhone || phoneNumber,
            call_id  : String(callId),
            call_type: reminderChannel, // ✅ AI_CALL or MANUAL_AI_CALL
          },
          type: QueryTypes.INSERT,
        }
      );
      console.log(
        `[CRON] call_Id_dtl saved ✅ | callId: ${callId}` +
        ` | type: ${reminderChannel}`
      );
    } catch (logErr) {
      console.error(`[CRON] call_Id_dtl save failed: ${logErr?.message}`);
    }
  }

  // ── Reminder → INITIATED ──────────────────────────────────
  // ✅ FIX: reminderChannel param use karo, hardcode nahi
  try {
    const updateClauses = [
      "Reminder_Count = ISNULL(Reminder_Count, 0) + 1",
      "Call_Status    = 'INITIATED'",
    ];
    const updateReplace = {
      UTD             : Number(reminderUTD),
      reminderChannel : reminderChannel,
    };

    if (cols.hasReminderChannel) {
      updateClauses.push("Reminder_Channel = :reminderChannel");
    }
    if (cols.hasDailyAttempt) {
      updateClauses.push(
        "Daily_Attempt_Count = ISNULL(Daily_Attempt_Count, 0) + 1"
      );
    }
    if (cols.hasLastReminderAt) {
      updateClauses.push("Last_Reminder_At = GETDATE()");
    }
    if (cols.hasUpdatedAt) {
      updateClauses.push("Updated_At = GETDATE()");
    }
    if (cols.hasAiCallId && callId) {
      updateClauses.push("AI_Call_ID = :callId");
      updateReplace.callId = String(callId);
    }

    await sequelize.query(
      `UPDATE dbo.Srv_Reminder_Tbl
       SET ${updateClauses.join(", ")}
       WHERE UTD = :UTD`,
      { replacements: updateReplace, type: QueryTypes.UPDATE }
    );

    console.log(
      `[CRON] Reminder INITIATED ✅ UTD: ${reminderUTD}` +
      ` | callId: ${callId} | Channel: ${reminderChannel}`
    );
  } catch (updateErr) {
    console.error(`[CRON] Reminder update failed: ${updateErr?.message}`);
  }

  return { callResult, callId, calledPhone, variables, reminderUTD };
};

// ============================================================
// DEALER PROCESS
// ============================================================
const processDealer = async (compcode, attemptNumber = 1) => {
  const result = {
    compcode, attemptNumber,
    totalFound : 0,
    callSuccess: 0,
    callFailed : 0,
    skipped    : 0,
    errors     : [],
  };

  console.log(
    `\n[CRON] ════ Dealer: ${compcode} | Attempt: ${attemptNumber} ════`
  );

  const { rows, sequelize, cols } = await getPendingReminders(
    compcode,
    attemptNumber
  );
  result.totalFound = rows.length;

  if (rows.length === 0) {
    console.log(
      `[CRON] [${compcode}] Koi pending reminder nahi | Attempt: ${attemptNumber} ✅`
    );
    if (sequelize) { try { await sequelize.close(); } catch (_) {} }
    return result;
  }

  const configCache = new Map();

  try {
    for (const row of rows) {
      const phoneNumber = String(row.Cust_Mob || "").trim();
      const vehicleNo   = row.Veh_Reg_No || "N/A";
      const reminderUTD = row.Reminder_UTD;

      // ── Phone validation ─────────────────────────────────
      if (!phoneNumber || phoneNumber.length < 10) {
        console.warn(
          `[CRON] SKIP — Invalid mobile: ${phoneNumber} | UTD: ${reminderUTD}`
        );
        result.skipped++;
        result.errors.push({
          Reminder_UTD: reminderUTD,
          reason      : "Invalid mobile",
        });
        continue;
      }

      // ── Location config fetch ─────────────────────────────
      const config = await getLocationConfig(
        sequelize,
        row.Loc_Code,
        configCache
      );

      if (!config) {
        console.warn(
          `[CRON] SKIP — No active config | Loc_Code: ${row.Loc_Code}` +
          ` | UTD: ${reminderUTD}`
        );
        result.skipped++;
        result.errors.push({
          Reminder_UTD: reminderUTD,
          reason      : `No active Reminder_Config for Loc_Code ${row.Loc_Code}`,
        });
        await new Promise((r) =>
          setTimeout(r, SYSTEM_SETTINGS.SAFETY_SKIP_DELAY_MS)
        );
        continue;
      }

      if (!config.Campaign_Id || !String(config.Campaign_Id).trim()) {
        console.warn(
          `[CRON] SKIP — Campaign_Id missing | Loc_Code: ${row.Loc_Code}` +
          ` | UTD: ${reminderUTD}`
        );
        result.skipped++;
        result.errors.push({
          Reminder_UTD: reminderUTD,
          reason      : `Campaign_Id missing for Loc_Code ${row.Loc_Code}`,
        });
        await new Promise((r) =>
          setTimeout(r, SYSTEM_SETTINGS.SAFETY_SKIP_DELAY_MS)
        );
        continue;
      }

      // ── Max attempts check ───────────────────────────────
      const dailyAttempts = Number(row.Daily_Attempt_Count || 0);
      const maxAttempts   = Number(
        config.Max_Attempts_Per_Day || SYSTEM_SETTINGS.FALLBACK_MAX_ATTEMPTS
      );

      if (dailyAttempts >= maxAttempts) {
        console.log(
          `[CRON] SKIP — Max attempts (${dailyAttempts}/${maxAttempts}) reached` +
          ` | UTD: ${reminderUTD}`
        );
        result.skipped++;
        continue;
      }

      // ── Trigger call ─────────────────────────────────────
      // ✅ FIX: Cron se jaane wali calls = AI_CALL channel
      try {
        await triggerCallForReminder(
          sequelize,
          row,
          attemptNumber,
          cols,
          config,
          SYSTEM_SETTINGS.CHANNEL_AUTO_AI  // ✅ "AI_CALL"
        );
        result.callSuccess++;
      } catch (err) {
        result.callFailed++;
        result.errors.push({
          Reminder_UTD: reminderUTD,
          Veh_Reg_No  : vehicleNo,
          phoneNumber,
          reason      : err?.message || "Call error",
        });
      }

      // ── Inter-call delay ─────────────────────────────────
      const delayMs =
        Number(config.Call_Delay_Ms) > 0 ? Number(config.Call_Delay_Ms) : 2000;
      await new Promise((r) => setTimeout(r, delayMs));
    }
  } finally {
    if (sequelize) { try { await sequelize.close(); } catch (_) {} }
  }

  return result;
};

// ============================================================
// MAIN SCHEDULER
// ============================================================
const runServiceReminderScheduler = async (attemptNumber = 1) => {
  const startTime = new Date();
  console.log(`\n${"═".repeat(60)}`);
  console.log(
    `[CRON] 🚀 STARTED — ${startTime.toLocaleString("en-IN")}` +
    ` | Attempt: ${attemptNumber}`
  );
  console.log(`${"═".repeat(60)}`);

  const summary = {
    startTime, attemptNumber,
    endTime     : null,
    durationSec : 0,
    totalDealers: 0,
    grandTotal  : 0,
    grandSuccess: 0,
    grandFailed : 0,
    grandSkipped: 0,
    dealerResults: [],
  };

  try {
    const dealers        = await getActiveDealers();
    summary.totalDealers = dealers.length;

    if (dealers.length === 0) {
      console.log("[CRON] ⚠️ Koi active dealer nahi mila");
      summary.endTime     = new Date();
      summary.durationSec = (
        (summary.endTime - startTime) / 1000
      ).toFixed(2);
      return summary;
    }

    for (const dealer of dealers) {
      const compcode = String(dealer.Dlr_Id).trim();
      try {
        const result = await processDealer(compcode, attemptNumber);
        summary.grandTotal   += result.totalFound;
        summary.grandSuccess += result.callSuccess;
        summary.grandFailed  += result.callFailed;
        summary.grandSkipped += result.skipped;
        summary.dealerResults.push(result);

        console.log(
          `\n[CRON] ── ${compcode} | Attempt ${attemptNumber} Summary ──`
        );
        console.log(`  Found   : ${result.totalFound}`);
        console.log(`  Success : ${result.callSuccess}`);
        console.log(`  Failed  : ${result.callFailed}`);
        console.log(`  Skipped : ${result.skipped}`);
      } catch (err) {
        console.error(`[CRON] ${compcode} error:`, err?.message);
        summary.dealerResults.push({ compcode, error: err?.message });
      }
    }
  } catch (err) {
    console.error("[CRON] Global error:", err?.message);
  }

  summary.endTime     = new Date();
  summary.durationSec = ((summary.endTime - startTime) / 1000).toFixed(2);

  console.log(`\n${"═".repeat(60)}`);
  console.log(
    `[CRON] ✅ COMPLETED | Attempt: ${attemptNumber}` +
    ` | Duration: ${summary.durationSec}s`
  );
  console.log(
    `[CRON] Total: ${summary.grandTotal}` +
    ` | Success: ${summary.grandSuccess}`
  );
  console.log(`${"═".repeat(60)}\n`);

  return summary;
};

// ============================================================
// APPOINTMENT CALL SCHEDULER
// ============================================================
const runAppointmentCallScheduler = async () => {
  console.log(
    `\n[APPT] 🔔 Appointment call check — ${new Date().toLocaleString("en-IN")}`
  );

  let sequeliaDbcon;
  const summary = { checked: 0, called: 0, skipped: 0, errors: [] };

  try {
    sequeliaDbcon = await dbname(
      { query: "", headers: { compcode: "DBCON", name: "scheduler" } },
      "DBCON"
    );

    const dealers = await sequeliaDbcon.query(
      `SELECT DISTINCT LTRIM(RTRIM(Dlr_Id)) AS Dlr_Id
       FROM DLR_SCH
       WHERE LTRIM(RTRIM(UPPER(SCH_TYPE))) = UPPER(:schType)
         AND export_type < 3 AND Dlr_Id IS NOT NULL`,
      {
        replacements: { schType: SYSTEM_SETTINGS.SCH_TYPE },
        type: QueryTypes.SELECT,
      }
    );

    if (!dealers || dealers.length === 0) return summary;

    for (const dealer of dealers) {
      const compcode = String(dealer.Dlr_Id).trim();
      let sequelize;

      try {
        sequelize = await dbname(
          { query: "", headers: { compcode, name: "scheduler" } },
          compcode
        );

        const cols        = await checkColumns(sequelize);
        const configCache = new Map();

        const dailyAttemptSelect = cols.hasDailyAttempt
          ? `ISNULL(r.Daily_Attempt_Count, 0) AS Daily_Attempt_Count,`
          : `0                                 AS Daily_Attempt_Count,`;

        const apptRows = await sequelize.query(
          `SELECT
             r.UTD                                                    AS Reminder_UTD,
             r.Cust_Vehi_UTD,
             r.Loc_Code,
             r.Call_Status,
             r.Reminder_Count,
             ${dailyAttemptSelect}
             CONVERT(varchar(10), r.Appointment_Date, 23)            AS Appointment_Date,
             r.Appointment_Time,
             CONVERT(varchar(10), r.Reminder_Date,    23)            AS Reminder_Date,
             CONVERT(varchar(10), r.Followup_Date,    23)            AS Followup_Date,
             c.Cust_Name,
             c.Cust_Mob,
             c.Model_Name,
             c.srv_exec_name,
             c.srv_exec_Emp_Code,
             c.srv_exec_mobile,
             m.Veh_Reg_No
           FROM dbo.Srv_Reminder_Tbl r
           INNER JOIN dbo.Srv_Cust_Vehi_Tbl c ON c.UTD = r.Cust_Vehi_UTD
           LEFT  JOIN dbo.Srv_Mst_Vehi_Tbl  m ON m.UTD = c.Tran_id
           WHERE r.status               = 1
             AND r.Reminder_Status      = 'PENDING'
             AND r.Appointment_Status   = 'SCHEDULED'
             AND r.Appointment_Date    IS NOT NULL
             AND r.Appointment_Time    IS NOT NULL
             AND CAST(r.Appointment_Date AS DATE) = CONVERT(date, GETDATE())
             AND (r.Call_Status IS NULL OR r.Call_Status NOT IN ('INITIATED'))
             AND c.Cust_Mob IS NOT NULL`,
          { type: QueryTypes.SELECT }
        );

        console.log(
          `[APPT] [${compcode}] Appointment reminders: ${apptRows?.length || 0}`
        );

        for (const row of apptRows) {
          summary.checked++;

          if (!isAppointmentTimeNow(row.Appointment_Date, row.Appointment_Time)) {
            console.log(
              `[APPT] UTD: ${row.Reminder_UTD} | ${row.Appointment_Date}` +
              ` ${row.Appointment_Time} — Not yet time`
            );
            summary.skipped++;
            continue;
          }

          const config = await getLocationConfig(
            sequelize,
            row.Loc_Code,
            configCache
          );

          if (!config || !config.Campaign_Id) {
            console.warn(
              `[APPT] SKIP — No config/Campaign_Id | Loc: ${row.Loc_Code}` +
              ` | UTD: ${row.Reminder_UTD}`
            );
            summary.skipped++;
            summary.errors.push({
              UTD   : row.Reminder_UTD,
              reason: "No active config / Campaign_Id missing",
            });
            continue;
          }

          console.log(
            `[APPT] ✅ Time match! UTD: ${row.Reminder_UTD} — Calling`
          );
          try {
            // ✅ Appointment calls = AI_CALL (auto triggered)
            await triggerCallForReminder(
              sequelize,
              row,
              1,
              cols,
              config,
              SYSTEM_SETTINGS.CHANNEL_AUTO_AI // ✅ "AI_CALL"
            );
            summary.called++;
          } catch (err) {
            summary.errors.push({
              UTD   : row.Reminder_UTD,
              reason: err?.message,
            });
          }

          const delayMs =
            Number(config.Call_Delay_Ms) > 0
              ? Number(config.Call_Delay_Ms)
              : 2000;
          await new Promise((r) => setTimeout(r, delayMs));
        }
      } catch (compErr) {
        console.error(`[APPT] ${compcode} error:`, compErr?.message);
      } finally {
        if (sequelize) { try { await sequelize.close(); } catch (_) {} }
      }
    }
  } catch (err) {
    console.error("[APPT] Global error:", err?.message);
  } finally {
    if (sequeliaDbcon) {
      try { await sequeliaDbcon.close(); } catch (_) {}
    }
  }

  console.log(
    `[APPT] Summary: Checked: ${summary.checked}` +
    ` | Called: ${summary.called} | Skipped: ${summary.skipped}`
  );
  return summary;
};

// ============================================================
// WEBHOOK PROCESSOR
// ✅ FIX: Dono channels (AI_CALL + MANUAL_AI_CALL) match karo
// ============================================================
const processWebhookUpdates = async () => {
  let sequeliaDbcon;
  const summary = {
    totalProcessed : 0,
    updated        : 0,
    appointmentSet : 0,
    followupCreated: 0,
    skipped        : 0,
    failed         : 0,
    errors         : [],
  };

  try {
    sequeliaDbcon = await dbname(
      { query: "", headers: { compcode: "DBCON", name: "scheduler" } },
      "DBCON"
    );

    const dealers = await sequeliaDbcon.query(
      `SELECT DISTINCT LTRIM(RTRIM(Dlr_Id)) AS Dlr_Id
       FROM DLR_SCH
       WHERE LTRIM(RTRIM(UPPER(SCH_TYPE))) = UPPER(:schType)
         AND export_type < 3 AND Dlr_Id IS NOT NULL`,
      {
        replacements: { schType: SYSTEM_SETTINGS.SCH_TYPE },
        type: QueryTypes.SELECT,
      }
    );

    if (!dealers || dealers.length === 0) {
      console.log("[WEBHOOK] No dealers found");
      return summary;
    }

    for (const dealer of dealers) {
      const compcode = String(dealer.Dlr_Id).trim();
      let sequelize;

      try {
        sequelize = await dbname(
          { query: "", headers: { compcode, name: "scheduler" } },
          compcode
        );

        const cols        = await checkColumns(sequelize);
        const configCache = new Map();

        const dailyAttemptSelect = cols.hasDailyAttempt
          ? `ISNULL(r.Daily_Attempt_Count, 0) AS Daily_Attempt_Count,`
          : `0                                 AS Daily_Attempt_Count,`;

        // ✅ FIX: Webhook query mein dono channels match karo
        // AI_CALL + MANUAL_AI_CALL dono ka status update hoga
        const webhookChannels = SYSTEM_SETTINGS.WEBHOOK_CHANNELS
          .map((c) => `'${c}'`)
          .join(", ");

        const pendingCalls = await sequelize.query(
          `SELECT
             wd.id                                                    AS wd_id,
             wd.call_id,
             wd.phone_number                                          AS mob_no,
             wd.status                                                AS call_status,
             wd.duration,
             wd.summary                                               AS summaryText,
             wd.transcript,
             r.UTD                                                    AS Reminder_UTD,
             r.Cust_Vehi_UTD,
             r.Loc_Code,
             r.Call_Status                                            AS Current_Call_Status,
             r.Reminder_Status,
             r.Appointment_Date,
             r.Appointment_Status,
             r.Service_Rule_UTD,
             ${dailyAttemptSelect}
             c.Cust_Name,
             c.Cust_Mob,
             c.Model_Name,
             m.Veh_Reg_No,
             CONVERT(varchar(10), r.Reminder_Date,  23)              AS Reminder_Date,
             CONVERT(varchar(10), r.Final_Due_Date, 23)              AS Final_Due_Date
           FROM dbo.call_webhook_dtl wd
           INNER JOIN dbo.Srv_Cust_Vehi_Tbl c
             ON LTRIM(RTRIM(ISNULL(c.Cust_Mob, '')))
              = LTRIM(RTRIM(ISNULL(wd.phone_number, '')))
           INNER JOIN dbo.Srv_Reminder_Tbl r
             ON r.Cust_Vehi_UTD = c.UTD
            AND r.status        = 1
            AND r.Call_Status   = 'INITIATED'
            -- ✅ FIX: AI_CALL + MANUAL_AI_CALL dono match karo
            AND r.Reminder_Channel IN (${webhookChannels})
           LEFT JOIN dbo.Srv_Mst_Vehi_Tbl m ON m.UTD = c.Tran_id
           WHERE wd.phone_number IS NOT NULL
             AND LTRIM(RTRIM(wd.phone_number)) <> ''
             AND LOWER(LTRIM(RTRIM(wd.status))) NOT IN
                 ('initiated', 'ringing', 'queued', 'answered', 'in-progress', 'in_progress', 'ongoing', 'active', 'started', '')
           ORDER BY wd.id DESC`,
          { type: QueryTypes.SELECT }
        );

        console.log(
          `[WEBHOOK] [${compcode}] Pending: ${pendingCalls?.length || 0}`
        );
        if (!pendingCalls || pendingCalls.length === 0) continue;

        const processedUTDs = new Set();

        for (const callRow of pendingCalls) {
          const callId        = callRow.call_id;
          const reminderUTD   = callRow.Reminder_UTD;
          const rawStatus     = callRow.call_status;
          const summaryText   = callRow.summaryText || null;
          const transcriptRaw = callRow.transcript  || null;
          const dailyAttempts = Number(callRow.Daily_Attempt_Count || 0);

          if (!reminderUTD) { summary.skipped++; continue; }
          if (processedUTDs.has(Number(reminderUTD))) {
            console.log(
              `[WEBHOOK] UTD ${reminderUTD} already processed — skip`
            );
            continue;
          }

          summary.totalProcessed++;

          try {
            console.log(
              `\n[WEBHOOK] callId: ${callId} | UTD: ${reminderUTD}` +
              ` | status: ${rawStatus} | attempts: ${dailyAttempts}`
            );

            const newCallStatus = normalizeCallStatus(rawStatus);
            console.log(`[WEBHOOK] ${rawStatus} → ${newCallStatus}`);

            const config = await getLocationConfig(
              sequelize,
              callRow.Loc_Code,
              configCache
            );
            const maxAttempts = Number(
              config?.Max_Attempts_Per_Day ||
              SYSTEM_SETTINGS.FALLBACK_MAX_ATTEMPTS
            );

            const slots = buildSlots(callRow.Reminder_Date, {
              slot1: config?.Slot1_Time,
              slot2: config?.Slot2_Time,
              slot3: config?.Slot3_Time,
            });

            const reconstructedVars = {
              slot1_date: slots.slot1_date, slot1_time: slots.slot1_time,
              slot2_date: slots.slot2_date, slot2_time: slots.slot2_time,
              slot3_date: slots.slot3_date, slot3_time: slots.slot3_time,
            };

            let parsed = parseAppointmentFromSummary(
              summaryText,
              reconstructedVars
            );
            if (!parsed && transcriptRaw) {
              console.log(`[WEBHOOK] Transcript se try...`);
              parsed = parseFromTranscript(transcriptRaw, reconstructedVars);
            }
            console.log(`[WEBHOOK] Parsed:`, JSON.stringify(parsed));

            // ── SET clauses ──────────────────────────────────
            const setClauses   = [`Call_Status = :newCallStatus`];
            const replacements = {
              UTD          : Number(reminderUTD),
              newCallStatus: newCallStatus,
            };

            if (cols.hasUpdatedAt) {
              setClauses.push("Updated_At = GETDATE()");
            }

            if (parsed && parsed.appointmentDate) {
              setClauses.push(
                `Appointment_Date   = CONVERT(date, :Appointment_Date, 23)`
              );
              setClauses.push(`Appointment_Status = 'SCHEDULED'`);
              setClauses.push(`Customer_Response  = :Customer_Response`);
              setClauses.push(`Reminder_Status    = 'CLOSED'`);
              replacements.Appointment_Date  = parsed.appointmentDate;
              replacements.Customer_Response = summaryText
                ? summaryText.substring(0, 500)
                : "Appointment booked via AI call";

              if (parsed.appointmentTime) {
                setClauses.push(
                  `Appointment_Time = CONVERT(time(0), :Appointment_Time)`
                );
                replacements.Appointment_Time = parsed.appointmentTime;
              }
              if (parsed.slotNumber) {
                setClauses.push(`Contacted_By = :Contacted_By`);
                replacements.Contacted_By = `AI_SLOT_${parsed.slotNumber}`;
              }

              summary.appointmentSet++;
              console.log(
                `[WEBHOOK] ✅ Appointment SET: ${parsed.appointmentDate}` +
                ` ${parsed.appointmentTime || ""}`
              );
            } else if (
              summaryText &&
              ["COMPLETED", "ANSWERED"].includes(newCallStatus)
            ) {
              setClauses.push(`Customer_Response = :Customer_Response`);
              replacements.Customer_Response = summaryText.substring(0, 500);
            }

            // ── Max attempts reset ───────────────────────────
            if (
              ["NO_ANSWER", "BUSY", "FAILED"].includes(newCallStatus) &&
              cols.hasDailyAttempt &&
              dailyAttempts >= maxAttempts
            ) {
              setClauses.push(`Daily_Attempt_Count = 0`);
              console.log(
                `[WEBHOOK] Max attempts (${dailyAttempts}/${maxAttempts}) — Reset`
              );
            }

            await sequelize.query(
              `UPDATE dbo.Srv_Reminder_Tbl
               SET ${setClauses.join(", ")}
               WHERE UTD = :UTD`,
              { replacements, type: QueryTypes.UPDATE }
            );

            processedUTDs.add(Number(reminderUTD));
            console.log(
              `[WEBHOOK] ✅ Updated UTD: ${reminderUTD} | ${newCallStatus}`
            );
            summary.updated++;

            // ── Next day followup ────────────────────────────
            if (
              ["NO_ANSWER", "BUSY", "FAILED"].includes(newCallStatus) &&
              dailyAttempts >= maxAttempts
            ) {
              try {
                const tomorrow    = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                const tomorrowStr = tomorrow.toISOString().split("T")[0];

                const existing = await sequelize.query(
                  `SELECT COUNT(*) AS cnt
                   FROM dbo.Srv_Reminder_Tbl
                   WHERE Cust_Vehi_UTD   = :cvUTD
                     AND Reminder_Status = 'PENDING'
                     AND status          = 1
                     AND CAST(Reminder_Date AS DATE) > CAST(GETDATE() AS DATE)`,
                  {
                    replacements: { cvUTD: callRow.Cust_Vehi_UTD },
                    type: QueryTypes.SELECT,
                  }
                );

                if (Number(existing?.[0]?.cnt || 0) === 0) {
                  await sequelize.query(
                    `INSERT INTO dbo.Srv_Reminder_Tbl
                       (Cust_Vehi_UTD, Service_Rule_UTD, Loc_Code,
                        Reminder_Date, Reminder_Type, Reminder_Status,
                        status, Created_At)
                     SELECT :cvUTD, Service_Rule_UTD, Loc_Code,
                       CONVERT(date, :tomorrowDate, 23),
                       'FOLLOWUP', 'PENDING', 1, GETDATE()
                     FROM dbo.Srv_Reminder_Tbl WHERE UTD = :reminderUTD`,
                    {
                      replacements: {
                        cvUTD       : callRow.Cust_Vehi_UTD,
                        tomorrowDate: tomorrowStr,
                        reminderUTD : Number(reminderUTD),
                      },
                      type: QueryTypes.INSERT,
                    }
                  );
                  summary.followupCreated++;
                  console.log(
                    `[WEBHOOK] 📅 Followup created | ${tomorrowStr}`
                  );
                } else {
                  console.log(`[WEBHOOK] Followup already exists — skip`);
                }
              } catch (fErr) {
                console.error(
                  `[WEBHOOK] Followup error: ${fErr?.message}`
                );
              }
            }
          } catch (rowErr) {
            console.error(
              `[WEBHOOK] Error UTD: ${reminderUTD} | ${rowErr?.message}`
            );
            summary.failed++;
            summary.errors.push({
              callId,
              reminderUTD,
              reason: rowErr?.message,
            });
          }

          await new Promise((r) => setTimeout(r, 500));
        }
      } catch (compErr) {
        console.error(`[WEBHOOK] ${compcode} error:`, compErr?.message);
      } finally {
        if (sequelize) { try { await sequelize.close(); } catch (_) {} }
      }
    }
  } catch (err) {
    console.error("[WEBHOOK] Global error:", err?.message);
  } finally {
    if (sequeliaDbcon) {
      try { await sequeliaDbcon.close(); } catch (_) {}
    }
  }

  console.log(`[WEBHOOK] Summary:`, JSON.stringify(summary));
  return summary;
};

// ============================================================
// CRON REGISTER
// ============================================================
const startServiceReminderCron = () => {
  console.log("\n[CRON] ══════════════════════════════════════════");
  console.log("[CRON] Service Reminder Cron registered ✅");
  console.log("[CRON] Attempt 1 : 09:00 AM daily");
  console.log("[CRON] Attempt 2 : 12:00 PM daily");
  console.log("[CRON] Attempt 3 : 03:00 PM daily");
  console.log("[CRON] Webhook   : Every 10 minutes");
  console.log("[CRON] Appt Call : Every 15 minutes");
  console.log(`[CRON] Timezone  : ${SYSTEM_SETTINGS.TIMEZONE}`);
  console.log("[CRON] ✅ Channel: AI_CALL        → Cron/Auto calls");
  console.log("[CRON] ✅ Channel: MANUAL_AI_CALL → Manual trigger calls");
  console.log("[CRON] ✅ Webhook: Both channels matched");
  console.log("[CRON] ✅ transferNumber priority:");
  console.log("[CRON]    Priority 1 → Srv_Cust_Vehi_Tbl.srv_exec_mobile");
  console.log("[CRON]    Priority 2 → Config.Sales_Exec_Number");
  console.log("[CRON] ══════════════════════════════════════════\n");

  // ── Attempt 1: 9 AM ──────────────────────────────────────
  cron.schedule(
    "54 15 * * *",
    async () => {
      console.log(`\n[CRON] ⏰ Attempt 1 — 9:00 AM`);
      try { await runServiceReminderScheduler(1); }
      catch (err) { console.error("[CRON] Attempt 1 error:", err?.message); }
    },
    { timezone: SYSTEM_SETTINGS.TIMEZONE }
  );

  // ── Attempt 2: 12 PM ─────────────────────────────────────
  cron.schedule(
    "0 12 * * *",
    async () => {
      console.log(`\n[CRON] ⏰ Attempt 2 — 12:00 PM`);
      try { await runServiceReminderScheduler(2); }
      catch (err) { console.error("[CRON] Attempt 2 error:", err?.message); }
    },
    { timezone: SYSTEM_SETTINGS.TIMEZONE }
  );

  // ── Attempt 3: 3 PM ──────────────────────────────────────
  cron.schedule(
    "0 15 * * *",
    async () => {
      console.log(`\n[CRON] ⏰ Attempt 3 — 3:00 PM`);
      try { await runServiceReminderScheduler(3); }
      catch (err) { console.error("[CRON] Attempt 3 error:", err?.message); }
    },
    { timezone: SYSTEM_SETTINGS.TIMEZONE }
  );

  // ── Webhook: every 10 min ─────────────────────────────────
  cron.schedule(
    "*/10 * * * *",
    async () => {
      console.log(
        `\n[WEBHOOK-CRON] 🔄 ${new Date().toLocaleString("en-IN")}`
      );
      try {
        const result = await processWebhookUpdates();
        console.log(
          `[WEBHOOK-CRON] ✅ Processed: ${result.totalProcessed}` +
          ` | Updated: ${result.updated}` +
          ` | Appointments: ${result.appointmentSet}` +
          ` | Followups: ${result.followupCreated}`
        );
      } catch (err) {
        console.error("[WEBHOOK-CRON] Error:", err?.message);
      }
    },
    { timezone: SYSTEM_SETTINGS.TIMEZONE }
  );

  // ── Appointment calls: every 15 min ──────────────────────
  cron.schedule(
    SYSTEM_SETTINGS.APPT_SCHEDULE,
    async () => {
      try { await runAppointmentCallScheduler(); }
      catch (err) { console.error("[APPT-CRON] Error:", err?.message); }
    },
    { timezone: SYSTEM_SETTINGS.TIMEZONE }
  );
};

// ============================================================
// EXPORTS
// ============================================================
module.exports = {
  startServiceReminderCron,
  runServiceReminderScheduler,
  runAppointmentCallScheduler,
  processWebhookUpdates,
  processDealer,
  parseAppointmentFromSummary,
  getLocationConfig,
  resolveServiceExecutive,
};