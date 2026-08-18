// routes/GetCallRecordings.js

const { dbname } = require("../utils/dbconfig");
const { QueryTypes } = require("sequelize");
const { getCallStatus, getCallRecording } = require("./callmati");
const { SendWhatsAppMessgae } = require("./user");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY || "autovyn_secret_key";

const generateAppointmentToken = (utd, vehicleNo, compcode) => {
  try {
    return jwt.sign(
      {
        utd: utd ? Number(utd) : null,
        vehicleNo: vehicleNo ? String(vehicleNo).trim() : "",
        compcode: compcode ? String(compcode).trim() : "",
        type: "APPOINTMENT_PUBLIC_ACCESS",
      },
      SECRET_KEY,
      { expiresIn: "30d" }
    );
  } catch (_) {
    const payload = JSON.stringify({ utd, vehicleNo, compcode, t: Date.now() });
    return Buffer.from(payload).toString("base64url");
  }
};

const verifyAppointmentToken = (token) => {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch (_) {
    try {
      const decoded = jwt.decode(token);
      if (decoded) return decoded;
    } catch (_) { }
    try {
      const str = Buffer.from(token, "base64url").toString("utf8");
      return JSON.parse(str);
    } catch (_) {
      return null;
    }
  }
};

// ════════════════════════════════════════════════════════════════
// Helpers
// ════════════════════════════════════════════════════════════════
const ddmmyyyyToYYYYMMDD = (dateStr) => {
  if (!dateStr) return null;
  try {
    const str = String(dateStr).trim();
    const m1 = str.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
    if (m1) return `${m1[3]}-${m1[2].padStart(2, "0")}-${m1[1].padStart(2, "0")}`;
    const m2 = str.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
    if (m2) return `${m2[1]}-${m2[2].padStart(2, "0")}-${m2[3].padStart(2, "0")}`;
    return null;
  } catch (_) { return null; }
};

const normalizeCallStatus = (rawStatus) => {
  const s = String(rawStatus || "").toLowerCase().trim();
  if (s === "completed") return "COMPLETED";
  if (s === "call-transferred") return "COMPLETED";
  if (s === "transferred") return "COMPLETED";
  if (s === "answered") return "ANSWERED";
  if (s === "failed") return "FAILED";
  if (s === "no-answer") return "NO_ANSWER";
  if (s === "no_answer") return "NO_ANSWER";
  if (s === "busy") return "BUSY";
  return "INITIATED";
};

const resolveCompCode = (rawCode) => {
  if (rawCode !== undefined && rawCode !== null && String(rawCode).trim().length > 0) {
    return String(rawCode).trim();
  }
  return "";
};

// ── Timestamp → readable time ─────────────────────────────────
const formatTimestamp = (ts) => {
  if (!ts) return "";
  try {
    const date = new Date(Number(ts) * 1000);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  } catch (_) { return ""; }
};

// ── ISO string → readable datetime ───────────────────────────
const formatISO = (isoStr) => {
  if (!isoStr) return null;
  try {
    const d = new Date(isoStr);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (_) { return isoStr; }
};

// ── Transcript → WhatsApp style chat ─────────────────────────
const buildChatTranscript = (transcript) => {
  if (!transcript || !Array.isArray(transcript)) return [];

  return transcript.map((msg) => {
    const sender = String(msg?.sender || "").toLowerCase();
    const text = String(msg?.text || "").replace(/`/g, "").trim();
    const time = formatTimestamp(msg?.timestamp);
    const isBot = sender === "bot";

    return {
      sender: isBot ? "🤖 AutoVyn AI" : "👤 Customer",
      side: isBot ? "left" : "right",
      message: text,
      time: time,
      raw_sender: sender,
    };
  });
};

// ════════════════════════════════════════════════════════════════
// ✅ NEW: Safe truncate helper — Unicode-safe (surrogate pairs avoid)
// ════════════════════════════════════════════════════════════════
const safeTruncate = (str, maxLen) => {
  if (!str) return null;
  const s = String(str).trim();
  if (s.length <= maxLen) return s;
  // Array.from se emoji/unicode surrogate pairs sahi se cut honge
  return Array.from(s).slice(0, maxLen).join("");
};

// ════════════════════════════════════════════════════════════════
// parseAppointmentFromSummary
// ════════════════════════════════════════════════════════════════
const parseAppointmentFromSummary = (summaryText, variables) => {
  if (!summaryText) return null;

  const text = String(summaryText).trim();
  const result = {
    slotNumber: null, appointmentDate: null,
    appointmentTime: null, rawDateFound: null, source: "summary",
  };

  const slotPatterns = [
    /(?:स्लॉट|slot)\s*[-–—]?\s*([123])/i,
    /slot\s+number\s*([123])/i,
    /([123])(?:st|nd|rd)?\s+slot/i,
    /slot\s*([123])/i,
  ];

  for (const pat of slotPatterns) {
    const m = text.match(pat);
    if (m) { result.slotNumber = parseInt(m[1], 10); break; }
  }

  const allDates = [];
  let m1, m2;
  const re1 = /(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/g;
  while ((m1 = re1.exec(text)) !== null) {
    allDates.push(`${m1[3]}-${m1[2].padStart(2, "0")}-${m1[1].padStart(2, "0")}`);
  }
  const re2 = /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/g;
  while ((m2 = re2.exec(text)) !== null) {
    allDates.push(`${m2[1]}-${m2[2].padStart(2, "0")}-${m2[3].padStart(2, "0")}`);
  }

  const uniqueDates = [...new Set(allDates)];

  if (result.slotNumber && variables) {
    const slotDateVar = variables?.[`slot${result.slotNumber}_date`];
    const slotTimeVar = variables?.[`slot${result.slotNumber}_time`];
    if (slotDateVar) {
      result.appointmentDate = ddmmyyyyToYYYYMMDD(slotDateVar);
      result.appointmentTime = slotTimeVar || null;
      result.rawDateFound = slotDateVar;
    } else if (uniqueDates.length > 0) {
      result.appointmentDate = uniqueDates[0];
      result.rawDateFound = uniqueDates[0];
    }
  } else if (uniqueDates.length > 0) {
    result.appointmentDate = uniqueDates[0];
    result.rawDateFound = uniqueDates[0];
  }

  if (!result.appointmentTime) {
    const timeMatch = text.match(/(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm))/i);
    if (timeMatch) result.appointmentTime = timeMatch[1].toUpperCase();
  }

  if (result.appointmentDate) {
    const d = new Date(result.appointmentDate);
    if (isNaN(d.getTime())) result.appointmentDate = null;
  }

  return result.appointmentDate ? result : null;
};

const parseFromTranscript = (transcriptJson, variables) => {
  if (!transcriptJson) return null;
  try {
    const transcript = typeof transcriptJson === "string"
      ? JSON.parse(transcriptJson)
      : (Array.isArray(transcriptJson) ? transcriptJson : []);

    for (const msg of transcript) {
      if (String(msg?.sender || "").toLowerCase() !== "bot") continue;
      const text = String(msg?.text || "").trim();

      let slotNum = null;
      const slotPatterns = [/slot\s*[-–]?\s*(\d)/i, /स्लॉट\s*(\d)/i];
      for (const pat of slotPatterns) {
        const m = text.match(pat);
        if (m) { slotNum = parseInt(m[1]); break; }
      }

      if (slotNum && variables?.[`slot${slotNum}_date`]) {
        const appointmentDate = ddmmyyyyToYYYYMMDD(variables[`slot${slotNum}_date`]);
        if (appointmentDate) {
          return {
            slotNumber: slotNum, appointmentDate,
            appointmentTime: variables[`slot${slotNum}_time`] || null,
            rawDateFound: variables[`slot${slotNum}_date`], source: "transcript",
          };
        }
      }
    }
  } catch (_) { }
  return null;
};

// ════════════════════════════════════════════════════════════════
// parseCallbackFromSummary — Summary / Transcript se Callback Date & Time Extract
// ════════════════════════════════════════════════════════════════
const parseCallbackFromSummary = (summaryText, variables, transcript) => {
  if (!summaryText && !transcript && !variables) return null;
  const text = `${summaryText || ""} ${typeof transcript === 'string' ? transcript : JSON.stringify(transcript || [])}`;

  let callbackDate = null;
  let callbackTime = null;

  if (variables && variables.callback_date) {
    const rawCb = String(variables.callback_date).trim();
    callbackDate = ddmmyyyyToYYYYMMDD(rawCb) || rawCb;
    callbackTime = variables.callback_time || null;
  }

  if (!callbackDate && /कल|tomorrow|next day/i.test(text)) {
    const tmr = new Date();
    tmr.setDate(tmr.getDate() + 1);
    callbackDate = tmr.toISOString().split("T")[0];
  }

  if (!callbackDate) {
    const m1 = text.match(/(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/);
    if (m1) callbackDate = `${m1[3]}-${m1[2].padStart(2, "0")}-${m1[1].padStart(2, "0")}`;
  }

  if (!callbackTime) {
    const timeMatch = text.match(/(\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm))/i);
    if (timeMatch) {
      callbackTime = timeMatch[1].toUpperCase();
    } else {
      const hindiTime = text.match(/(\d{1,2})\s*बजे/i);
      if (hindiTime) {
        let hr = parseInt(hindiTime[1], 10);
        if (hr < 8) hr += 12;
        callbackTime = `${String(hr).padStart(2, "0")}:00`;
      }
    }
  }

  if (callbackDate) {
    return { callbackDate, callbackTime };
  }
  return null;
};
 
// ════════════════════════════════════════════════════════════════
// Dynamic column checker & auto-migration for Srv_Reminder_Tbl
// ════════════════════════════════════════════════════════════════
const checkReminderCols = async (sequelize) => {
  try {
    const cols = await sequelize.query(
      `SELECT COLUMN_NAME
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_NAME = 'Srv_Reminder_Tbl'`,
      { type: sequelize.constructor.QueryTypes?.SELECT || "SELECT" }
    );
    const names = new Set((cols || []).map((c) => String(c.COLUMN_NAME).toLowerCase()));

    // Auto-add missing columns if DB user has ALTER permissions
    if (!names.has("daily_attempt_count")) {
      try {
        await sequelize.query(`ALTER TABLE dbo.Srv_Reminder_Tbl ADD Daily_Attempt_Count INT DEFAULT 0 NULL`);
        names.add("daily_attempt_count");
      } catch (_) { }
    }
    if (!names.has("ai_call_id")) {
      try {
        await sequelize.query(`ALTER TABLE dbo.Srv_Reminder_Tbl ADD AI_Call_ID NVARCHAR(100) NULL`);
        names.add("ai_call_id");
      } catch (_) { }
    }
    if (!names.has("reminder_channel")) {
      try {
        await sequelize.query(`ALTER TABLE dbo.Srv_Reminder_Tbl ADD Reminder_Channel NVARCHAR(50) NULL`);
        names.add("reminder_channel");
      } catch (_) { }
    }

    return {
      hasDailyAttempt: names.has("daily_attempt_count"),
      hasAICallID: names.has("ai_call_id"),
      hasReminderChannel: names.has("reminder_channel"),
      hasUpdatedAt: names.has("updated_at"),
    };
  } catch (_) {
    return {
      hasDailyAttempt: false,
      hasAICallID: false,
      hasReminderChannel: false,
      hasUpdatedAt: false,
    };
  }
};

// ════════════════════════════════════════════════════════════════
// ✅ UPDATED: updateReminderFromCallDetails
// ════════════════════════════════════════════════════════════════
const updateReminderFromCallDetails = async (sequelize, reminderUTD, callData, cvUTD, req) => {
  const status = callData?.status || null;
  const insights = callData?.insights || [];
  const transcript = callData?.transcript || [];
  const variables = callData?.variables || {};

  const cols = await checkReminderCols(sequelize);

  const summaryInsight = insights.find(
    (i) => i?.actionType === "SUMMARIZE" || i?.type === "SUMMARIZE"
  );
  const summaryText = summaryInsight?.output?.summary
    || summaryInsight?.summary
    || callData?.summary
    || null;

  const newCallStatus = normalizeCallStatus(status);

  console.log(`[UPDATE] UTD: ${reminderUTD} | ${status} → ${newCallStatus}`);
  console.log(`[UPDATE] Summary: ${summaryText}`);

  let parsed = parseAppointmentFromSummary(summaryText, variables);
  if (!parsed) parsed = parseFromTranscript(transcript, variables);
  const callbackInfo = parseCallbackFromSummary(summaryText, variables, transcript);

  const CUSTOMER_RESPONSE_MAX_LEN = 400;

  const setClauses = [`Call_Status = :newCallStatus`];
  const replacements = { UTD: Number(reminderUTD), newCallStatus };

  if (parsed && parsed.appointmentDate) {
    setClauses.push(`Appointment_Date   = CONVERT(date, :Appointment_Date, 23)`);
    setClauses.push(`Appointment_Status = 'SCHEDULED'`);
    setClauses.push(`Customer_Response  = :Customer_Response`);
    setClauses.push(`Reminder_Status    = 'CLOSED'`);
    replacements.Appointment_Date = parsed.appointmentDate;
    replacements.Customer_Response = safeTruncate(summaryText, CUSTOMER_RESPONSE_MAX_LEN)
      || "Appointment booked";
    if (parsed.appointmentTime) {
      setClauses.push(`Appointment_Time = CONVERT(time(0), :Appointment_Time)`);
      replacements.Appointment_Time = parsed.appointmentTime;
    }
    if (parsed.slotNumber) {
      setClauses.push(`Contacted_By = :Contacted_By`);
      replacements.Contacted_By = `AI_SLOT_${parsed.slotNumber}`;
    }
    console.log(`[UPDATE] ✅ Appointment: ${parsed.appointmentDate} ${parsed.appointmentTime || ""}`);
  } else if (callbackInfo && callbackInfo.callbackDate) {
    setClauses.push(`Followup_Date     = CONVERT(date, :Followup_Date, 23)`);
    setClauses.push(`Reminder_Date     = CONVERT(date, :Followup_Date, 23)`);
    setClauses.push(`Reminder_Type     = 'FOLLOWUP'`);
    setClauses.push(`Reminder_Status   = 'PENDING'`);
    setClauses.push(`Customer_Response = :Customer_Response`);
    if (cols.hasDailyAttempt) {
      setClauses.push(`Daily_Attempt_Count = 0`);
    }
    replacements.Followup_Date = callbackInfo.callbackDate;
    replacements.Customer_Response = safeTruncate(summaryText, CUSTOMER_RESPONSE_MAX_LEN)
      || `Followup scheduled for ${callbackInfo.callbackDate}`;
    console.log(`[UPDATE] 📅 Auto Followup Extracted & Scheduled: ${callbackInfo.callbackDate} ${callbackInfo.callbackTime || ""}`);
  } else if (summaryText && ["COMPLETED", "ANSWERED"].includes(newCallStatus)) {
    setClauses.push(`Customer_Response = :Customer_Response`);
    replacements.Customer_Response = safeTruncate(summaryText, CUSTOMER_RESPONSE_MAX_LEN);
  }

  if (cols.hasUpdatedAt) {
    setClauses.push(`Updated_At = GETDATE()`);
  }

  const updateQuery = `UPDATE dbo.Srv_Reminder_Tbl SET ${setClauses.join(", ")} WHERE UTD = :UTD`;

  try {
    await sequelize.query(updateQuery, {
      replacements,
      type: QueryTypes.UPDATE,
    });
  } catch (updateErr) {
    const isTruncationError =
      updateErr?.message?.includes("would be truncated") ||
      updateErr?.original?.message?.includes("would be truncated");

    if (isTruncationError && replacements.Customer_Response) {
      console.warn(
        `[UPDATE] ⚠️ Truncation error — retrying with shorter Customer_Response | UTD: ${reminderUTD}`
      );
      replacements.Customer_Response = safeTruncate(replacements.Customer_Response, 100);

      try {
        await sequelize.query(updateQuery, {
          replacements,
          type: QueryTypes.UPDATE,
        });
        console.log(`[UPDATE] ✅ Retry successful with shorter text | UTD: ${reminderUTD}`);
      } catch (retryErr) {
        replacements.Customer_Response = null;
        await sequelize.query(updateQuery, {
          replacements,
          type: QueryTypes.UPDATE,
        });
        console.log(`[UPDATE] ✅ Saved without Customer_Response | UTD: ${reminderUTD}`);
      }
    } else {
      throw updateErr;
    }
  }

  // ── call_webhook_dtl save/update ──────────────────────────────
  try {
    const existing = await sequelize.query(
      `SELECT COUNT(*) AS cnt FROM dbo.call_webhook_dtl WHERE call_id = :callId`,
      { replacements: { callId: callData?.callId || "" }, type: QueryTypes.SELECT }
    );

    const safeSummary = safeTruncate(summaryText, 2000);

    if (Number(existing?.[0]?.cnt || 0) === 0) {
      await sequelize.query(
        `INSERT INTO dbo.call_webhook_dtl
           (call_id, phone_number, status, duration, summary, transcript, triggered_at)
         VALUES (:call_id, :phone_number, :status, :duration, :summary, :transcript, :triggered_at)`,
        {
          replacements: {
            call_id: callData?.callId || null,
            phone_number: callData?.phoneNumber || null,
            status: status,
            duration: callData?.duration || null,
            summary: safeSummary,
            transcript: JSON.stringify(transcript),
            triggered_at: callData?.triggeredAt || callData?.triggerTime || null,
          },
          type: QueryTypes.INSERT,
        }
      );
    } else {
      await sequelize.query(
        `UPDATE dbo.call_webhook_dtl
         SET status = :status, summary = :summary, duration = :duration
         WHERE call_id = :callId`,
        {
          replacements: {
            callId: callData?.callId || "",
            status: status,
            summary: safeSummary,
            duration: callData?.duration || null,
          },
          type: QueryTypes.UPDATE,
        }
      );
    }
  } catch (wErr) {
    console.error(`[UPDATE] call_webhook_dtl error: ${wErr?.message}`);
  }

  // ── BUSY/NO_ANSWER/FAILED → Check 3 Attempts & Next Day Fallback ─────────────────
  if (["BUSY", "NO_ANSWER", "FAILED"].includes(newCallStatus) && (cvUTD || reminderUTD)) {
    try {
      if (cols.hasDailyAttempt) {
        const curRows = await sequelize.query(
          `SELECT ISNULL(Daily_Attempt_Count, 0) AS attempts, Cust_Vehi_UTD FROM dbo.Srv_Reminder_Tbl WHERE UTD = :reminderUTD`,
          { replacements: { reminderUTD: Number(reminderUTD) }, type: QueryTypes.SELECT }
        );

        const attemptsDone = Number(curRows?.[0]?.attempts || 0);
        const targetCvUTD = cvUTD || curRows?.[0]?.Cust_Vehi_UTD;

        // Agar din me 3 attempts complete ho gaye hain, to auto next day reschedule karo
        if (attemptsDone >= 3 && targetCvUTD) {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const tomorrowStr = tomorrow.toISOString().split("T")[0];

          const reschedClauses = [
            "Reminder_Date = CONVERT(date, :tomorrowStr, 23)",
            "Followup_Date = CONVERT(date, :tomorrowStr, 23)",
            "Reminder_Status = 'PENDING'",
            "Call_Status = NULL",
            "Daily_Attempt_Count = 0",
          ];
          if (cols.hasUpdatedAt) reschedClauses.push("Updated_At = GETDATE()");

          await sequelize.query(
            `UPDATE dbo.Srv_Reminder_Tbl
             SET ${reschedClauses.join(", ")}
             WHERE UTD = :reminderUTD`,
            { replacements: { tomorrowStr, reminderUTD: Number(reminderUTD) }, type: QueryTypes.UPDATE }
          );
          console.log(`[UPDATE] 🔄 3 Call Attempts reached today — Rescheduled for Tomorrow: ${tomorrowStr} (UTD: ${reminderUTD})`);
        }
      }
    } catch (fErr) {
      console.error(`[UPDATE] 3-Attempt Reschedule error: ${fErr?.message}`);
    }
  }

  // ── AUTOMATED WHATSAPP NOTIFICATION ON CALL COMPLETION ─────────────────────
  if (["COMPLETED", "ANSWERED"].includes(newCallStatus) && reminderUTD) {
    try {
      const custRows = await sequelize.query(
        `SELECT TOP 1
           c.Cust_Name,
           c.Cust_Mob,
           COALESCE(m.Veh_Reg_No, c.Veh_Reg_No, '') AS Veh_Reg_No,
           c.Model_Name,
           r.Appointment_Date,
           r.Appointment_Time,
           r.Loc_Code,
           COALESCE(mm1.Misc_Name, mm2.Misc_Name, '') AS Loc_Name,
           COALESCE(mm1.Misc_Add1, mm2.Misc_Add1, '') AS Loc_Address
         FROM dbo.Srv_Reminder_Tbl r
         INNER JOIN dbo.Srv_Cust_Vehi_Tbl c ON c.UTD = r.Cust_Vehi_UTD
         LEFT  JOIN dbo.Srv_Mst_Vehi_Tbl  m ON m.UTD = c.Tran_id
         LEFT  JOIN dbo.Misc_Mst mm1
                ON mm1.Misc_Type = 85
               AND LTRIM(RTRIM(CAST(mm1.Misc_Code AS NVARCHAR(50)))) = LTRIM(RTRIM(CAST(r.Loc_Code AS NVARCHAR(50))))
         LEFT  JOIN dbo.Misc_Mst mm2
                ON mm2.Misc_Type = 85
               AND LTRIM(RTRIM(CAST(mm2.Misc_Code AS NVARCHAR(50)))) = LTRIM(RTRIM(CAST(c.Loc_Code AS NVARCHAR(50))))
         WHERE r.UTD = :reminderUTD`,
        { replacements: { reminderUTD: Number(reminderUTD) }, type: QueryTypes.SELECT }
      );

      if (custRows && custRows.length > 0 && custRows[0].Cust_Mob) {
        const cd = custRows[0];
        const compCodeStr = resolveCompCode(
          req?.headers?.compcode ||
          req?.body?.compcode ||
          req?.query?.compcode ||
          callData?.compcode ||
          callData?.variables?.compcode ||
          cd?.Comp_Code
        );
        const targetMob = String(cd.Cust_Mob).trim();
        const param1_CustName = cd.Cust_Name?.trim() || "Customer";
        const param2_Vehicle = cd.Veh_Reg_No?.trim() || cd.Model_Name?.trim() || "Vehicle";
        const param3_Center = cd.Loc_Name?.trim() || "Auto-Vyn Service Center";
        const param4_Address = cd.Loc_Address?.trim() || "Service Center Address";
        const apptToken = generateAppointmentToken(reminderUTD, cd.Veh_Reg_No, compCodeStr);
        const param5_Link = `https://erp.autovyn.com/autovyn/CRM/customer_vehicle/service-appointment?token=${apptToken}&utd=${reminderUTD}&vehicleNo=${encodeURIComponent(cd.Veh_Reg_No || "")}&compcode=${compCodeStr}`;
        const param6_Company = cd.Loc_Name?.trim() || "Auto-Vyn Service Center";

        console.log(`[WHATSAPP] 📲 Sending Post-Call WhatsApp Reminder to ${targetMob} (compCode: ${compCodeStr}) for UTD ${reminderUTD}`);
        console.log("p5", param5_Link);

        const waRes = await SendWhatsAppMessgae(
          compCodeStr,
          targetMob,
          "service_appointment_reminder",
          [
            // 1. Customer Name {{1}}
            { type: "text", text: param1_CustName },
            // 2. Vehicle / Model Variant {{2}}
            { type: "text", text: param2_Vehicle },
            // 3. Service Center Name {{3}}
            { type: "text", text: param3_Center },
            // 4. Service Center Address {{4}}
            { type: "text", text: param4_Address },
            // 5. View Appointment Details Link {{5}}
            { type: "text", text: param5_Link },
            // 6. Regards / Company Name {{6}}
            { type: "text", text: param6_Company },
          ],
          "DONTCHECK"
        );

        console.log(`[WHATSAPP] ✅ Post-Call WhatsApp message result:`, waRes);
      }
    } catch (waErr) {
      console.error(`[WHATSAPP] ⚠️ Post-Call WhatsApp message error:`, waErr?.message || waErr);
    }
  }

  return { newCallStatus, summaryText, parsed, callbackInfo, appointmentSet: !!(parsed?.appointmentDate) };
};

// ════════════════════════════════════════════════════════════════
// callWebhook — vehicle_number/mobile_number/callId se process
// ════════════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════════════
// callWebhook — vehicle_number/mobile_number/reminder_utd/callId se process
// ════════════════════════════════════════════════════════════════
exports.callWebhook = async (req, res) => {
  let sequelize;

  try {
    const { vehicle_number, mobile_number, reminder_utd, callId: directCallId } = req.body;

    console.log("\n[WEBHOOK] Request:", JSON.stringify(req.body));

    if (!vehicle_number && !mobile_number && !reminder_utd && !directCallId) {
      return res.status(400).json({
        Status: false,
        Message: "vehicle_number, mobile_number, reminder_utd, ya callId required hai",
      });
    }

    sequelize = await dbname(req, req.headers.compcode);

    let callId = directCallId || null;
    let reminderUTD = reminder_utd ? Number(reminder_utd) : null;
    let cvUTD = null;
    let searchMob = mobile_number ? String(mobile_number).trim() : null;

    // ── Priority 1: Search by reminder_utd if provided ──
    if (reminderUTD) {
      const rRows = await sequelize.query(
        `SELECT TOP 1 r.UTD AS Reminder_UTD, r.Cust_Vehi_UTD, r.AI_Call_ID, c.Cust_Mob
         FROM dbo.Srv_Reminder_Tbl r
         INNER JOIN dbo.Srv_Cust_Vehi_Tbl c ON c.UTD = r.Cust_Vehi_UTD
         WHERE r.UTD = :reminderUTD AND r.status = 1`,
        { replacements: { reminderUTD }, type: QueryTypes.SELECT }
      );

      if (rRows && rRows.length > 0) {
        cvUTD = rRows[0].Cust_Vehi_UTD;
        if (rRows[0].AI_Call_ID) {
          callId = rRows[0].AI_Call_ID;
          console.log(`[WEBHOOK] Found AI_Call_ID from Srv_Reminder_Tbl (UTD ${reminderUTD}): ${callId}`);
        }
        if (rRows[0].Cust_Mob) {
          searchMob = String(rRows[0].Cust_Mob).trim();
        }
      }
    }

    // ── Priority 2: Search by vehicle_number if callId not found ──
    if (!callId && vehicle_number) {
      const cleanVehicle = String(vehicle_number).trim().toUpperCase().replace(/[\s\-]/g, "");
      console.log(`[WEBHOOK] Vehicle search: ${cleanVehicle}`);

      const reminderRows = await sequelize.query(
        `SELECT TOP 1 r.UTD AS Reminder_UTD, r.Cust_Vehi_UTD, r.AI_Call_ID, c.Cust_Mob
         FROM dbo.Srv_Reminder_Tbl r
         INNER JOIN dbo.Srv_Cust_Vehi_Tbl c ON c.UTD = r.Cust_Vehi_UTD
         LEFT  JOIN dbo.Srv_Mst_Vehi_Tbl  m ON m.UTD = c.Tran_id
         WHERE REPLACE(REPLACE(UPPER(LTRIM(RTRIM(ISNULL(m.Veh_Reg_No,'')))), ' ', ''), '-', '') = :cleanVehicle
           AND r.status = 1
         ORDER BY r.UTD DESC`,
        { replacements: { cleanVehicle }, type: QueryTypes.SELECT }
      );

      if (reminderRows && reminderRows.length > 0) {
        reminderUTD = reminderRows[0].Reminder_UTD;
        cvUTD = reminderRows[0].Cust_Vehi_UTD;
        if (reminderRows[0].AI_Call_ID) {
          callId = reminderRows[0].AI_Call_ID;
          console.log(`[WEBHOOK] Found AI_Call_ID from Vehicle search (UTD ${reminderUTD}): ${callId}`);
        }
        if (reminderRows[0].Cust_Mob) {
          searchMob = String(reminderRows[0].Cust_Mob).trim();
        }
      }
    }

    // ── Priority 3: Search by mobile_number if callId not found ──
    if (!callId && searchMob) {
      const cleanMob = searchMob.replace(/\s/g, "");

      if (!reminderUTD) {
        const rr = await sequelize.query(
          `SELECT TOP 1 r.UTD AS Reminder_UTD, r.Cust_Vehi_UTD, r.AI_Call_ID
           FROM dbo.Srv_Reminder_Tbl r
           INNER JOIN dbo.Srv_Cust_Vehi_Tbl c ON c.UTD = r.Cust_Vehi_UTD
           WHERE LTRIM(RTRIM(ISNULL(c.Cust_Mob,''))) = :cleanMob AND r.status = 1
           ORDER BY r.UTD DESC`,
          { replacements: { cleanMob }, type: QueryTypes.SELECT }
        );
        if (rr && rr.length > 0) {
          reminderUTD = rr[0].Reminder_UTD;
          cvUTD = rr[0].Cust_Vehi_UTD;
          if (rr[0].AI_Call_ID) {
            callId = rr[0].AI_Call_ID;
          }
        }
      }

      // ── Priority 4: Fallback to call_Id_dtl / call_webhook_dtl by phone number ──
      if (!callId) {
        console.log(`[WEBHOOK] AI_Call_ID not in Srv_Reminder_Tbl. Searching latest call by phone: ${cleanMob}`);

        const r1 = await sequelize.query(
          `SELECT TOP 1 call_id FROM dbo.call_Id_dtl
           WHERE LTRIM(RTRIM(mob_no)) = :cleanMob
           ORDER BY id DESC`,
          { replacements: { cleanMob }, type: QueryTypes.SELECT }
        );
        if (r1 && r1.length > 0 && r1[0].call_id) {
          callId = r1[0].call_id;
          console.log(`[WEBHOOK] Found callId from call_Id_dtl: ${callId}`);
        }

        if (!callId) {
          const r2 = await sequelize.query(
            `SELECT TOP 1 call_id FROM dbo.call_webhook_dtl
             WHERE LTRIM(RTRIM(phone_number)) = :cleanMob
             ORDER BY id DESC`,
            { replacements: { cleanMob }, type: QueryTypes.SELECT }
          );
          if (r2 && r2.length > 0 && r2[0].call_id) {
            callId = r2[0].call_id;
            console.log(`[WEBHOOK] Found callId from call_webhook_dtl: ${callId}`);
          }
        }
      }
    }

    if (!callId) {
      return res.status(404).json({
        Status: false,
        Message: "No call records found.",
        debug: { vehicle_number, mobile_number, reminder_utd, reminderUTD, searchMob },
      });
    }

    console.log(`[WEBHOOK] Final callId: ${callId} | UTD: ${reminderUTD}`);

    let callDetails = null;
    let callData = null;

    try {
      callDetails = await getCallStatus(callId);
      callData = callDetails?.data || callDetails;
    } catch (apiErr) {
      console.warn(`[WEBHOOK] Callmati API getCallStatus failed for ${callId}: ${apiErr?.message}`);
    }

    // Fallback: If Callmati API didn't return data, fetch latest record from call_webhook_dtl
    if (!callData || !callData.status) {
      const whRows = await sequelize.query(
        `SELECT TOP 1 * FROM dbo.call_webhook_dtl
         WHERE call_id = :callId OR (phone_number = :searchMob AND phone_number IS NOT NULL AND phone_number != '')
         ORDER BY id DESC`,
        { replacements: { callId: callId || "", searchMob: searchMob || "" }, type: QueryTypes.SELECT }
      );
      if (whRows && whRows.length > 0) {
        callData = {
          callId: whRows[0].call_id,
          phoneNumber: whRows[0].phone_number,
          status: whRows[0].status,
          duration: whRows[0].duration,
          summary: whRows[0].summary,
          transcript: whRows[0].transcript ? (typeof whRows[0].transcript === 'string' ? JSON.parse(whRows[0].transcript) : whRows[0].transcript) : [],
        };
        callDetails = { Status: true, data: callData };
      }
    }

    const status = String(callData?.status || "").toLowerCase();

    if (["initiated", "ringing", "queued"].includes(status)) {
      return res.status(200).json({
        Status: true,
        Message: `Call in progress (${status})`,
        Data: callDetails,
      });
    }

    let updateResult = null;
    if (reminderUTD) {
      updateResult = await updateReminderFromCallDetails(sequelize, reminderUTD, callData, cvUTD, req);
    }

    return res.status(200).json({
      Status: true,
      Result: "Webhook Processed Successfully",
      callId: callId,
      reminderUTD: reminderUTD,
      Data: callDetails,
      DBUpdate: reminderUTD ? {
        reminderUTD: reminderUTD,
        newCallStatus: updateResult?.newCallStatus || null,
        appointmentSet: updateResult?.appointmentSet || false,
        appointmentDate: updateResult?.parsed?.appointmentDate || null,
        appointmentTime: updateResult?.parsed?.appointmentTime || null,
        summary: updateResult?.summaryText || null,
      } : null,
    });

  } catch (err) {
    console.error("[WEBHOOK] Error:", err?.message);
    return res.status(500).json({ Status: false, Message: err?.message });
  } finally {
    if (sequelize) { try { await sequelize.close(); } catch (_) { } }
  }
};

// ════════════════════════════════════════════════════════════════
// getVehicleCallHistory — vehicle_number/mobile_number se saari call history
// WhatsApp style transcript ke saath (all call sources included)
// ════════════════════════════════════════════════════════════════
exports.getVehicleCallHistory = async (req, res) => {
  let sequelize;

  try {
    const { vehicle_number, mobile_number } = req.body;

    console.log("\n[HISTORY] Request:", JSON.stringify(req.body));

    if (!vehicle_number && !mobile_number) {
      return res.status(400).json({
        Status: false,
        Message: "vehicle_number or mobile_number are required",
      });
    }

    sequelize = await dbname(req, req.headers.compcode);

    const allMobs = new Set();
    const custVehiUTDs = new Set();
    let vehicleInfo = null;

    if (vehicle_number) {
      const cleanVehicle = String(vehicle_number).trim().toUpperCase().replace(/[\s\-]/g, "");

      // 1. Fetch vehicle info & ALL associated customer records / mobiles
      let vRows = await sequelize.query(
        `SELECT
           m.Veh_Reg_No,
           c.Cust_Name,
           c.Cust_Mob,
           c.Model_Name,
           c.UTD AS Cust_Vehi_UTD
         FROM dbo.Srv_Mst_Vehi_Tbl m
         INNER JOIN dbo.Srv_Cust_Vehi_Tbl c ON c.Tran_id = m.UTD
         WHERE REPLACE(REPLACE(UPPER(LTRIM(RTRIM(ISNULL(m.Veh_Reg_No,'')))), ' ', ''), '-', '')
           = :cleanVehicle`,
        { replacements: { cleanVehicle }, type: QueryTypes.SELECT }
      );

      if (!vRows || vRows.length === 0) {
        vRows = await sequelize.query(
          `SELECT
             c.Veh_Reg_No,
             c.Cust_Name,
             c.Cust_Mob,
             c.Model_Name,
             c.UTD AS Cust_Vehi_UTD
           FROM dbo.Srv_Cust_Vehi_Tbl c
           WHERE REPLACE(REPLACE(UPPER(LTRIM(RTRIM(ISNULL(c.Veh_Reg_No,'')))), ' ', ''), '-', '') = :cleanVehicle`,
          { replacements: { cleanVehicle }, type: QueryTypes.SELECT }
        );
      }

      if (vRows && vRows.length > 0) {
        vehicleInfo = vRows[0];
        for (const v of vRows) {
          if (v.Cust_Mob) allMobs.add(String(v.Cust_Mob).trim());
          if (v.Cust_Vehi_UTD) custVehiUTDs.add(v.Cust_Vehi_UTD);
        }
      }
    } else if (mobile_number) {
      const cleanMob = String(mobile_number).trim().replace(/\s/g, "");
      allMobs.add(cleanMob);

      const vRows = await sequelize.query(
        `SELECT TOP 1
           m.Veh_Reg_No,
           c.Cust_Name,
           c.Cust_Mob,
           c.Model_Name,
           c.UTD AS Cust_Vehi_UTD
         FROM dbo.Srv_Cust_Vehi_Tbl c
         LEFT JOIN dbo.Srv_Mst_Vehi_Tbl m ON m.UTD = c.Tran_id
         WHERE LTRIM(RTRIM(ISNULL(c.Cust_Mob,''))) = :cleanMob`,
        { replacements: { cleanMob }, type: QueryTypes.SELECT }
      );

      if (vRows && vRows.length > 0) {
        vehicleInfo = vRows[0];
        if (vRows[0].Cust_Vehi_UTD) custVehiUTDs.add(vRows[0].Cust_Vehi_UTD);
      }
    }

    const mobList = Array.from(allMobs);
    const utdList = Array.from(custVehiUTDs);
    const finalMobList = Array.from(allMobs);

    console.log(`[HISTORY] Vehicle: ${vehicleInfo?.Veh_Reg_No || vehicle_number} | Mobs: ${finalMobList.join(",")} | Cust_Vehi_UTDs: ${utdList.join(",")}`);

    // ============================================================
    // Collect Call IDs strictly from Srv_Reminder_Tbl for this vehicle's reminders
    // (Prevents fetching unrelated calls made to the same mobile number for other purposes)
    // ============================================================
    const allCallIdMap = new Map(); // call_id -> { call_id, channel }
    const cleanVehicleCode = vehicle_number ? String(vehicle_number).trim().toUpperCase().replace(/[\s\-]/g, "") : "";

    if (cleanVehicleCode || utdList.length > 0 || finalMobList.length > 0) {
      try {
        const remVehicleRows = await sequelize.query(
          `SELECT DISTINCT r.AI_Call_ID, r.Reminder_Channel, r.UTD AS Reminder_UTD, c.Cust_Mob
           FROM dbo.Srv_Reminder_Tbl r
           LEFT JOIN dbo.Srv_Cust_Vehi_Tbl c ON c.UTD = r.Cust_Vehi_UTD
           LEFT JOIN dbo.Srv_Mst_Vehi_Tbl m ON m.UTD = c.Tran_id
           WHERE (
             ( :cleanVehicleCode != '' AND (
               REPLACE(REPLACE(UPPER(LTRIM(RTRIM(ISNULL(m.Veh_Reg_No,'')))), ' ', ''), '-', '') = :cleanVehicleCode
               OR REPLACE(REPLACE(UPPER(LTRIM(RTRIM(ISNULL(c.Veh_Reg_No,'')))), ' ', ''), '-', '') = :cleanVehicleCode
             ) )
             ${utdList.length > 0 ? "OR r.Cust_Vehi_UTD IN (:utdList)" : ""}
             ${finalMobList.length > 0 && !cleanVehicleCode && utdList.length === 0 ? "OR LTRIM(RTRIM(c.Cust_Mob)) IN (:finalMobList)" : ""}
           )
             AND r.AI_Call_ID IS NOT NULL AND LTRIM(RTRIM(r.AI_Call_ID)) != ''
           ORDER BY r.UTD DESC`,
          { replacements: { cleanVehicleCode, utdList, finalMobList }, type: QueryTypes.SELECT }
        );

        for (const r of (remVehicleRows || [])) {
          const cId = String(r.AI_Call_ID).trim();
          if (cId && !allCallIdMap.has(cId)) {
            allCallIdMap.set(cId, { call_id: cId, channel: r.Reminder_Channel || "AI_CALL" });
          }
        }
      } catch (remErr) {
        console.warn("[GetCallRecordings] Srv_Reminder_Tbl query warning:", remErr?.message);
      }
    }

    const uniqueCallList = Array.from(allCallIdMap.values());
    console.log(`[HISTORY] Total unique call_ids found in Srv_Reminder_Tbl for this vehicle: ${uniqueCallList.length}`);

    if (uniqueCallList.length === 0) {
      return res.status(200).json({
        Status: true,
        Message: "Koi call history nahi mili",
        vehicleInfo: vehicleInfo,
        totalCalls: 0,
        calls: [],
      });
    }

    const defaultMob = vehicleInfo?.Cust_Mob || finalMobList[0] || "";
    const callHistories = [];
    let callNumber = 1;

    for (const item of uniqueCallList) {
      const cId = item.call_id;
      if (!cId) continue;

      try {
        console.log(`[HISTORY] Processing call ${callNumber}: ${cId}`);

        let callData = null;
        let callDetails = null;

        // Try 1: Callmati API getCallStatus
        try {
          callDetails = await getCallStatus(cId);
          callData = callDetails?.data || callDetails;
        } catch (apiErr) {
          console.warn(`[HISTORY] Callmati API getCallStatus warning for ${cId}: ${apiErr?.message}`);
        }

        // Try 2: Fallback to call_webhook_dtl if API didn't return complete data
        if (!callData || !callData.status) {
          const dbWh = await sequelize.query(
            `SELECT TOP 1 * FROM dbo.call_webhook_dtl WHERE call_id = :cId ORDER BY id DESC`,
            { replacements: { cId }, type: QueryTypes.SELECT }
          );

          if (dbWh && dbWh.length > 0) {
            const wh = dbWh[0];
            let parsedTranscript = [];
            if (wh.transcript) {
              try {
                parsedTranscript = typeof wh.transcript === 'string' ? JSON.parse(wh.transcript) : wh.transcript;
              } catch (_) { parsedTranscript = []; }
            }
            callData = {
              callId: wh.call_id,
              phoneNumber: wh.phone_number || defaultMob,
              status: wh.status,
              duration: wh.duration,
              summary: wh.summary,
              transcript: parsedTranscript,
              triggeredAt: wh.triggered_at,
            };
          }
        }

        if (!callData) {
          const channelStr = String(item.channel || "").toUpperCase();
          const isManual = channelStr.includes("MANUAL");
          callHistories.push({
            Reminder: callNumber,
            _insertOrder: callNumber,
            callId: cId,
            status: "INITIATED",
            rawStatus: "INITIATED",
            phoneNumber: defaultMob,
            callChannel: isManual ? "MANUAL_CALL" : "AI_CALL",
            isManualCall: isManual,
            chat: { messages: [] },
          });
          callNumber++;
          continue;
        }

        const insights = callData?.insights || [];
        const summaryInsight = insights.find(
          (i) => i?.actionType === "SUMMARIZE" || i?.type === "SUMMARIZE"
        );
        const summaryText = summaryInsight?.output?.summary
          || summaryInsight?.summary
          || callData?.summary
          || null;

        const catInsight = insights.find(
          (i) => i?.actionType === "CATEGORIZATION_STATE_BASED"
        );
        const category = catInsight?.output?.category || null;

        const variables = callData?.variables || {};
        let parsed = parseAppointmentFromSummary(summaryText, variables);
        if (!parsed) parsed = parseFromTranscript(callData?.transcript || [], variables);

        const chatTranscript = buildChatTranscript(callData?.transcript || []);
        const transferInfo = callData?.transfree || callData?.transfer || null;

        const rawChannel = String(item.channel || "").trim().toUpperCase();
        let callChannel = "AI_CALL";
        if (rawChannel.includes("MANUAL")) {
          callChannel = "MANUAL_CALL";
        }

        const isManualCall = callChannel === "MANUAL_CALL";

        callHistories.push({
          Reminder: callNumber,
          _insertOrder: callNumber,
          callId: cId,
          status: normalizeCallStatus(callData?.status),
          rawStatus: callData?.status || null,
          direction: callData?.direction || "OUTBOUND",
          phoneNumber: callData?.phoneNumber || defaultMob,
          duration: callData?.duration ? `${callData.duration} sec` : null,
          durationSec: callData?.duration || null,
          callChannel: callChannel,
          isManualCall: isManualCall,
          triggeredAt: formatISO(callData?.triggeredAt || callData?.triggerTime),
          startTime: formatISO(callData?.startTime),
          endTime: formatISO(callData?.endTime),
          uploadTime: formatISO(callData?.uploadTime),

          appointmentSet: !!(parsed?.appointmentDate),
          appointmentDate: parsed?.appointmentDate || null,
          appointmentTime: parsed?.appointmentTime || null,
          appointmentSlot: parsed?.slotNumber ? `Slot ${parsed.slotNumber}` : null,

          summary: summaryText,
          category: category,

          transferInfo: transferInfo ? {
            transferredTo: transferInfo?.[0]?.phoneNumber || null,
            transferStatus: transferInfo?.[0]?.status || null,
            transferTime: formatISO(transferInfo?.[0]?.startTime),
          } : null,

          chat: {
            totalMessages: chatTranscript.length,
            botMessages: chatTranscript.filter(m => m.raw_sender === "bot").length,
            humanMessages: chatTranscript.filter(m => m.raw_sender === "human").length,
            messages: chatTranscript,
          },

          slotsOffered: {
            slot1: `${variables?.slot1_date || ""} ${variables?.slot1_time || ""}`.trim() || null,
            slot2: `${variables?.slot2_date || ""} ${variables?.slot2_time || ""}`.trim() || null,
            slot3: `${variables?.slot3_date || ""} ${variables?.slot3_time || ""}`.trim() || null,
          },
        });

        callNumber++;

      } catch (apiErr) {
        console.error(`[HISTORY] callId ${cId} error: ${apiErr?.message}`);
        callHistories.push({
          Reminder: callNumber,
          _insertOrder: callNumber,
          callId: cId,
          status: "API_ERROR",
          error: apiErr?.message,
          callChannel: String(item.channel || "").toUpperCase().includes("MANUAL") ? "MANUAL_CALL" : "AI_CALL",
          chat: { messages: [] },
        });
        callNumber++;
      }
    }


    // ── Sort callHistories: Latest call first (time-wise) ──────────────────────
    // Priority: triggeredAt > startTime > endTime > uploadTime > no-timestamp
    callHistories.sort((a, b) => {
      const getTimestamp = (item) => {
        const t = item.triggeredAt || item.startTime || item.endTime || item.uploadTime;
        if (!t) return null;
        const ms = new Date(t).getTime();
        return isNaN(ms) ? null : ms;
      };

      const timeA = getTimestamp(a);
      const timeB = getTimestamp(b);

      // Both have timestamps → latest first
      if (timeA !== null && timeB !== null) {
        return timeB - timeA;
      }

      // Only A has timestamp → A comes first
      if (timeA !== null && timeB === null) return -1;

      // Only B has timestamp → B comes first
      if (timeA === null && timeB !== null) return 1;

      // Neither has timestamp → preserve original insertion order (callNumber)
      return (a._insertOrder || 0) - (b._insertOrder || 0);
    });

    // Re-index Reminder sequence after sorting (Reminder 1 = Latest Call)
    callHistories.forEach((item, idx) => {
      item.Reminder = idx + 1;
      delete item._insertOrder; // cleanup internal field
    });


    const stats = {
      totalCalls: callHistories.length,
      completedCalls: callHistories.filter(c => c.status === "COMPLETED").length,
      busyCalls: callHistories.filter(c => c.status === "BUSY").length,
      noAnswerCalls: callHistories.filter(c => c.status === "NO_ANSWER").length,
      failedCalls: callHistories.filter(c => c.status === "FAILED").length,
      appointmentsSet: callHistories.filter(c => c.appointmentSet).length,
      totalDurationSec: callHistories.reduce((sum, c) => sum + (c.durationSec || 0), 0),
      aiCalls: callHistories.filter(c => c.callChannel === "AI_CALL").length,
      manualCalls: callHistories.filter(c => c.callChannel === "MANUAL_CALL").length,
    };

    return res.status(200).json({
      Status: true,
      vehicleInfo: vehicleInfo ? {
        Veh_Reg_No: vehicleInfo.Veh_Reg_No || null,
        Cust_Name: vehicleInfo.Cust_Name || null,
        Cust_Mob: vehicleInfo.Cust_Mob || defaultMob,
        Model_Name: vehicleInfo.Model_Name || null,
      } : null,
      stats: stats,
      totalCalls: callHistories.length,
      calls: callHistories,
    });

  } catch (err) {
    console.error("[HISTORY] Error:", err?.message);
    return res.status(500).json({ Status: false, Message: err?.message });
  } finally {
    if (sequelize) { try { await sequelize.close(); } catch (_) { } }
  }
};

// ════════════════════════════════════════════════════════════════
// GetCallRecordings — existing
// ════════════════════════════════════════════════════════════════
// -----------------------------------------------------
// Controller: GET /call/recordings/:callId
// -----------------------------------------------------
exports.GetCallRecordings = async (req, res) => {
  try {
    const { callId } = req.params;

    if (!callId) {
      return res.status(400).json({
        Status: false,
        Message: "callId is required",
      });
    }

    // getCallRecording khud hi response handle karta hai (stream ya error json)
    await getCallRecording(callId, res);
  } catch (err) {
    // headers already sent ho chuke ho sakte hain (stream case me),
    // isliye check zaroori hai
    if (!res.headersSent) {
      return res.status(500).json({ Status: false, Message: err?.message });
    }
  }
};

exports.getCallStatus = getCallStatus;

// ════════════════════════════════════════════════════════════════
// getAppointmentFormDetails — Customer Link Click Se Vehicle & Appointment Details Load
// ════════════════════════════════════════════════════════════════
exports.getAppointmentFormDetails = async (req, res) => {
  let sequelize;
  try {
    const tokenParam = req.query.token || req.body.token || null;
    const tokenData = verifyAppointmentToken(tokenParam);

    const utd = req.query.utd || req.body.utd || tokenData?.utd || null;
    const vehicleNo = req.query.vehicleNo || req.body.vehicleNo || tokenData?.vehicleNo || null;
    const targetComp = resolveCompCode(req.headers.compcode || req.query.compcode || req.body.compcode || tokenData?.compcode);

    if (!utd && !vehicleNo && !tokenParam) {
      return res.status(400).json({ Status: false, Message: "utd, vehicleNo, ya token required hai" });
    }

    sequelize = await dbname(req, targetComp);

    const cleanVehicle = vehicleNo ? String(vehicleNo).trim().toUpperCase().replace(/[\s\-]/g, "") : "";

    const rows = await sequelize.query(
      `SELECT TOP 1
         r.UTD AS utd,
         r.Cust_Vehi_UTD,
         r.Appointment_Date,
         r.Appointment_Time,
         r.Appointment_Status,
         r.Appointment_Remark,
         r.Customer_Response,
         r.Reminder_Status,
         r.Loc_Code,
         r.AI_Call_ID,
         c.Cust_Name,
         c.Cust_Mob,
         COALESCE(m.Veh_Reg_No, c.Veh_Reg_No, '') AS Veh_Reg_No,
         c.Model_Name,
         COALESCE(mm1.Misc_Name, mm2.Misc_Name, '') AS Loc_Name,
         COALESCE(mm1.Misc_Add1, mm2.Misc_Add1, '') AS Loc_Address
       FROM dbo.Srv_Reminder_Tbl r
       INNER JOIN dbo.Srv_Cust_Vehi_Tbl c ON c.UTD = r.Cust_Vehi_UTD
       LEFT  JOIN dbo.Srv_Mst_Vehi_Tbl  m ON m.UTD = c.Tran_id
       LEFT  JOIN dbo.Misc_Mst mm1
              ON mm1.Misc_Type = 85
             AND LTRIM(RTRIM(CAST(mm1.Misc_Code AS NVARCHAR(50)))) = LTRIM(RTRIM(CAST(r.Loc_Code AS NVARCHAR(50))))
       LEFT  JOIN dbo.Misc_Mst mm2
              ON mm2.Misc_Type = 85
             AND LTRIM(RTRIM(CAST(mm2.Misc_Code AS NVARCHAR(50)))) = LTRIM(RTRIM(CAST(c.Loc_Code AS NVARCHAR(50))))
       WHERE (
         (:utd IS NOT NULL AND r.UTD = :utd)
         OR (:cleanVehicle != '' AND (
           REPLACE(REPLACE(UPPER(LTRIM(RTRIM(ISNULL(m.Veh_Reg_No,'')))), ' ', ''), '-', '') = :cleanVehicle
           OR REPLACE(REPLACE(UPPER(LTRIM(RTRIM(ISNULL(c.Veh_Reg_No,'')))), ' ', ''), '-', '') = :cleanVehicle
         ))
       )
       ORDER BY r.UTD DESC`,
      { replacements: { utd: utd ? Number(utd) : null, cleanVehicle }, type: QueryTypes.SELECT }
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ Status: false, Message: "Vehicle / Appointment Record nahi mila" });
    }

    const item = rows[0];

    // Check for AI slots / summary from call_webhook_dtl if AI_Call_ID is present
    let extractedSlots = [];
    if (item.AI_Call_ID) {
      try {
        const whRows = await sequelize.query(
          `SELECT TOP 1 summary, transcript FROM dbo.call_webhook_dtl WHERE call_id = :callId ORDER BY id DESC`,
          { replacements: { callId: item.AI_Call_ID }, type: QueryTypes.SELECT }
        );
        if (whRows && whRows.length > 0) {
          const sumText = whRows[0].summary || "";
          const parsed = parseAppointmentFromSummary(sumText, {});
          if (parsed && parsed.appointmentDate) {
            extractedSlots.push({
              slot: "Recommended Slot",
              date: parsed.appointmentDate,
              time: parsed.appointmentTime || "10:00:00",
            });
          }
        }
      } catch (_) { }
    }

    return res.status(200).json({
      Status: true,
      data: {
        utd: item.utd,
        custName: item.Cust_Name || "Customer",
        custMob: item.Cust_Mob || "",
        vehicleNo: item.Veh_Reg_No || "",
        modelName: item.Model_Name || "",
        modelVariant: item.Model_Variant || "",
        serviceCenter: item.Loc_Name || "Auto-Vyn Service Center",
        serviceAddress: item.Loc_Address || "Main Workshop",
        appointmentDate: item.Appointment_Date
          ? (typeof item.Appointment_Date === "string"
            ? item.Appointment_Date.split("T")[0].split(" ")[0]
            : (item.Appointment_Date instanceof Date
              ? item.Appointment_Date.toISOString().split("T")[0]
              : String(item.Appointment_Date)))
          : "",
        appointmentTime: item.Appointment_Time || "",
        appointmentStatus: item.Appointment_Status || "PENDING",
        appointmentRemark: item.Appointment_Remark || "",
        customerResponse: item.Customer_Response || "",
        extractedSlots: extractedSlots,
      },
    });

  } catch (err) {
    console.error("[APPOINTMENT-FORM] Error:", err?.message);
    return res.status(500).json({ Status: false, Message: err?.message });
  } finally {
    if (sequelize) { try { await sequelize.close(); } catch (_) { } }
  }
};

// ════════════════════════════════════════════════════════════════
// saveCustomerAppointment — Customer Form Submission Se Update & Save
// ════════════════════════════════════════════════════════════════
exports.saveCustomerAppointment = async (req, res) => {
  let sequelize;
  try {
    const tokenParam = req.body.token || req.query.token || null;
    const tokenData = verifyAppointmentToken(tokenParam);

    const utd = req.body.utd || req.query.utd || tokenData?.utd || null;
    const vehicleNo = req.body.vehicleNo || req.query.vehicleNo || tokenData?.vehicleNo || null;
    const targetComp = resolveCompCode(req.headers.compcode || req.body.compcode || req.query.compcode || tokenData?.compcode);
    const { appointment_date, appointment_time, appointment_remark, customer_response } = req.body;

    if (!utd && !vehicleNo && !tokenParam) {
      return res.status(400).json({ Status: false, Message: "utd, vehicleNo, ya token required hai" });
    }
    if (!appointment_date) {
      return res.status(400).json({ Status: false, Message: "Appointment Date required hai" });
    }

    sequelize = await dbname(req, targetComp);
    const cleanVehicle = vehicleNo ? String(vehicleNo).trim().toUpperCase().replace(/[\s\-]/g, "") : "";

    const setClauses = [
      `Appointment_Date = CONVERT(date, :appointment_date, 23)`,
      `Appointment_Status = 'SCHEDULED'`,
      `Reminder_Status = 'CLOSED'`,
      `Updated_At = GETDATE()`,
    ];
    const replacements = {
      utd: utd ? Number(utd) : null,
      cleanVehicle,
      appointment_date: String(appointment_date).trim(),
    };

    if (appointment_time) {
      setClauses.push(`Appointment_Time = CONVERT(time(0), :appointment_time)`);
      replacements.appointment_time = String(appointment_time).trim();
    }
    if (appointment_remark) {
      setClauses.push(`Appointment_Remark = :appointment_remark`);
      replacements.appointment_remark = String(appointment_remark).trim();
    }
    if (customer_response) {
      setClauses.push(`Customer_Response = :customer_response`);
      replacements.customer_response = String(customer_response).trim();
    }

    const updateQuery = `
      UPDATE dbo.Srv_Reminder_Tbl
      SET ${setClauses.join(", ")}
      WHERE (
        (:utd IS NOT NULL AND UTD = :utd)
        OR (:cleanVehicle != '' AND Cust_Vehi_UTD IN (
          SELECT UTD FROM dbo.Srv_Cust_Vehi_Tbl
          WHERE REPLACE(REPLACE(UPPER(LTRIM(RTRIM(ISNULL(Veh_Reg_No,'')))), ' ', ''), '-', '') = :cleanVehicle
        ))
      )`;

    await sequelize.query(updateQuery, { replacements, type: QueryTypes.UPDATE });

    // Fetch details for WhatsApp confirmation
    const updatedRows = await sequelize.query(
      `SELECT TOP 1
         c.Cust_Name,
         c.Cust_Mob,
         COALESCE(m.Veh_Reg_No, c.Veh_Reg_No, '') AS Veh_Reg_No,
         c.Model_Name,
         r.Appointment_Date,
         r.Appointment_Time,
         r.Loc_Code,
         COALESCE(mm1.Misc_Name, mm2.Misc_Name, '') AS Loc_Name,
         COALESCE(mm1.Misc_Add1, mm2.Misc_Add1, '') AS Loc_Address
       FROM dbo.Srv_Reminder_Tbl r
       INNER JOIN dbo.Srv_Cust_Vehi_Tbl c ON c.UTD = r.Cust_Vehi_UTD
       LEFT  JOIN dbo.Srv_Mst_Vehi_Tbl  m ON m.UTD = c.Tran_id
       LEFT  JOIN dbo.Misc_Mst mm1
              ON mm1.Misc_Type = 85
             AND LTRIM(RTRIM(CAST(mm1.Misc_Code AS NVARCHAR(50)))) = LTRIM(RTRIM(CAST(r.Loc_Code AS NVARCHAR(50))))
       LEFT  JOIN dbo.Misc_Mst mm2
              ON mm2.Misc_Type = 85
             AND LTRIM(RTRIM(CAST(mm2.Misc_Code AS NVARCHAR(50)))) = LTRIM(RTRIM(CAST(c.Loc_Code AS NVARCHAR(50))))
       WHERE (:utd IS NOT NULL AND r.UTD = :utd) OR (:cleanVehicle != '' AND REPLACE(REPLACE(UPPER(LTRIM(RTRIM(ISNULL(c.Veh_Reg_No,'')))), ' ', ''), '-', '') = :cleanVehicle)
       ORDER BY r.UTD DESC`,
      { replacements: { utd: utd ? Number(utd) : null, cleanVehicle }, type: QueryTypes.SELECT }
    );

    if (updatedRows && updatedRows.length > 0 && updatedRows[0].Cust_Mob) {
      const cd = updatedRows[0];
      const compCodeStr = resolveCompCode(req?.headers?.compcode || req?.body?.compcode || req?.query?.compcode);
      const targetMob = String(cd.Cust_Mob).trim();

      const p1 = cd.Cust_Name?.trim() || "Customer";
      const p2 = cd.Veh_Reg_No?.trim() || cd.Model_Name?.trim() || "Vehicle";
      const p3 = cd.Loc_Name?.trim() || "Auto-Vyn Service Center";
      const p4 = cd.Loc_Address?.trim() || "Main Workshop";
      const apptToken = generateAppointmentToken(cd.utd || utd, cd.Veh_Reg_No, compCodeStr);
      const p5 = `https://erp.autovyn.com/autovyn/CRM/customer_vehicle/service-appointment?token=${apptToken}&utd=${cd.utd || utd || ""}&vehicleNo=${encodeURIComponent(cd.Veh_Reg_No || "")}&compcode=${compCodeStr}`;
      const p6 = cd.Loc_Name?.trim() || "Auto-Vyn Service Center";

      console.log("p5", p5);

      try {
        const waRes = await SendWhatsAppMessgae(
          compCodeStr,
          targetMob,
          "service_appointment_reminder",
          [
            { type: "text", text: p1 },
            { type: "text", text: p2 },
            { type: "text", text: p3 },
            { type: "text", text: p4 },
            { type: "text", text: p5 },
            { type: "text", text: p6 },
          ],
          "DONTCHECK"
        );
        console.log(`[WHATSAPP] ✅ Appointment Update WhatsApp result:`, waRes);
      } catch (waErr) {
        console.error(`[WHATSAPP] ⚠️ WhatsApp send error:`, waErr?.message || waErr);
      }
    }

    return res.status(200).json({
      Status: true,
      Message: "Appointment confirmed & updated successfully!",
    });

  } catch (err) {
    console.error("[SAVE-APPOINTMENT] Error:", err?.message);
    return res.status(500).json({ Status: false, Message: err?.message });
  } finally {
    if (sequelize) { try { await sequelize.close(); } catch (_) { } }
  }
};