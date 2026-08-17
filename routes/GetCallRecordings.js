// routes/GetCallRecordings.js

const { dbname } = require("../utils/dbconfig");
const { QueryTypes } = require("sequelize");
const { getCallStatus, getCallRecording } = require("./callmati");

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
      } catch (_) {}
    }
    if (!names.has("ai_call_id")) {
      try {
        await sequelize.query(`ALTER TABLE dbo.Srv_Reminder_Tbl ADD AI_Call_ID NVARCHAR(100) NULL`);
        names.add("ai_call_id");
      } catch (_) {}
    }
    if (!names.has("reminder_channel")) {
      try {
        await sequelize.query(`ALTER TABLE dbo.Srv_Reminder_Tbl ADD Reminder_Channel NVARCHAR(50) NULL`);
        names.add("reminder_channel");
      } catch (_) {}
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
const updateReminderFromCallDetails = async (sequelize, reminderUTD, callData, cvUTD) => {
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
      updateResult = await updateReminderFromCallDetails(sequelize, reminderUTD, callData, cvUTD);
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

    console.log(`[HISTORY] Vehicle: ${vehicleInfo?.Veh_Reg_No || vehicle_number} | Mobs: ${mobList.join(",")} | Cust_Vehi_UTDs: ${utdList.join(",")}`);

    // ============================================================
    // Collect Call IDs from ALL 3 SOURCES
    // ============================================================
    const allCallIdMap = new Map(); // call_id -> { call_id, channel }

    // Source 1: Srv_Reminder_Tbl directly by vehicle_number OR Cust_Vehi_UTD
    let remVehicleRows = [];
    const cleanVehicleCode = vehicle_number ? String(vehicle_number).trim().toUpperCase().replace(/[\s\-]/g, "") : "";

    if (cleanVehicleCode || utdList.length > 0) {
      try {
        remVehicleRows = await sequelize.query(
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
           )
             AND r.AI_Call_ID IS NOT NULL AND LTRIM(RTRIM(r.AI_Call_ID)) != ''
           ORDER BY r.UTD DESC`,
          { replacements: { cleanVehicleCode, utdList }, type: QueryTypes.SELECT }
        );
      } catch (remErr) {
        console.warn("[GetCallRecordings] Srv_Reminder_Tbl query failed (column missing fallback):", remErr?.message);
      }
    }

    for (const r of (remVehicleRows || [])) {
      const cId = String(r.AI_Call_ID).trim();
      if (cId && !allCallIdMap.has(cId)) {
        allCallIdMap.set(cId, { call_id: cId, channel: r.Reminder_Channel || "AI_CALL" });
      }
      if (r.Cust_Mob && !allMobs.has(String(r.Cust_Mob).trim())) {
        allMobs.add(String(r.Cust_Mob).trim());
      }
    }

    // Source 2: call_Id_dtl (All call types for all collected mobile numbers)
    const finalMobList = Array.from(allMobs);
    if (finalMobList.length > 0) {
      try {
        const logCallRows = await sequelize.query(
          `SELECT call_id, call_type, id
           FROM dbo.call_Id_dtl
           WHERE LTRIM(RTRIM(mob_no)) IN (:finalMobList)
             AND call_id IS NOT NULL AND LTRIM(RTRIM(call_id)) != ''
           ORDER BY id DESC`,
          { replacements: { finalMobList }, type: QueryTypes.SELECT }
        );

        for (const r of (logCallRows || [])) {
          const cId = String(r.call_id).trim();
          if (cId && !allCallIdMap.has(cId)) {
            allCallIdMap.set(cId, { call_id: cId, channel: r.call_type || "AI_CALL" });
          }
        }
      } catch (src2Err) {
        console.warn(`[HISTORY] call_Id_dtl table not found or query failed (skipping): ${src2Err?.message}`);
      }
    }

    // Source 3: call_webhook_dtl (All webhooks logged for all collected mobile numbers)
    if (finalMobList.length > 0) {
      try {
        const whCallRows = await sequelize.query(
          `SELECT call_id, id
           FROM dbo.call_webhook_dtl
           WHERE LTRIM(RTRIM(phone_number)) IN (:finalMobList)
             AND call_id IS NOT NULL AND LTRIM(RTRIM(call_id)) != ''
           ORDER BY id DESC`,
          { replacements: { finalMobList }, type: QueryTypes.SELECT }
        );

        for (const r of (whCallRows || [])) {
          const cId = String(r.call_id).trim();
          if (cId && !allCallIdMap.has(cId)) {
            allCallIdMap.set(cId, { call_id: cId, channel: "AI_CALL" });
          }
        }
      } catch (src3Err) {
        console.warn(`[HISTORY] call_webhook_dtl table not found or query failed (skipping): ${src3Err?.message}`);
      }
    }

    const uniqueCallList = Array.from(allCallIdMap.values());
    console.log(`[HISTORY] Total unique call_ids found across all tables: ${uniqueCallList.length}`);

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