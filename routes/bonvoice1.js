const axios = require("axios");
const crypto = require("crypto");
const { dbname } = require("../utils/dbconfig");
const { QueryTypes } = require("sequelize");

// ===================== CONFIG =====================
const BONVOICE_CONFIG = {
  BASE_URL: process.env.BONVOICE_BASE_URL || "https://voiceai.bonvoice.com/api/v1",
  PUBLIC_BASE_URL:
    process.env.BONVOICE_PUBLIC_BASE_URL || "https://voiceai.bonvoice.com/api/public",
  TOKEN: process.env.BONVOICE_TOKEN || "cm_live_d082244083cd123e48c32b228bdaab7334aade3e8341b785",
};

if (!BONVOICE_CONFIG.TOKEN) {
  console.warn("[Bonvoice] BONVOICE_TOKEN missing. Set process.env.BONVOICE_TOKEN");
}

const client = axios.create({
  baseURL: BONVOICE_CONFIG.BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${BONVOICE_CONFIG.TOKEN}`,
  },
  timeout: 30000,
});

function toBonvoiceError(err, fallbackMsg) {
  const data = err?.response?.data;
  const status = err?.response?.status;
  const msg = data?.message || err?.message || fallbackMsg;
  const e = new Error(msg);
  e.status = status;
  e.data = data;
  return e;
}

// ===================== LEAD =====================

/**
 * POST /api/v1/leads
 * Creates a lead. If payload.triggerCall=true then call is initiated immediately.
 * ✅ Bonvoice automatically sends webhook when call completes
 */
async function createLead(payload = {}) {
  try {
    const res = await client.post("/leads", payload);
    return res.data;
  } catch (err) {
    throw toBonvoiceError(err, "Bonvoice createLead failed");
  }
}

/**
 * ✅ MAIN FUNCTION: Create lead + trigger call
 * Bonvoice automatically sends webhook after call completes
 * (callId usually null in response; webhook me milega)
 */
async function createLeadAndCall({
  name,
  phone,
  email,
  college,
  company,
  program,
  column1,      // ✅ Custom field 1
  column2,      // ✅ Custom field 2
  column3,      // ✅ Custom field 3
  promptName,   // Bonvoice prompt name
} = {}) {
  if (!phone) throw new Error("phone is required");

  console.log("[BONVOICE API] Creating lead with call trigger:", {
    name,
    phone,
    program,
    column1,
    column2,
    column3,
    promptName,
  });

  // ✅ triggerCall: true = Bonvoice automatically करेगा call initiate
  // ✅ Webhook automatically आएगा जब call complete हो
  return createLead({
    name: name ?? null,
    phone,
    email: email ?? null,
    college: college ?? null,
    company: company ?? null,
    program: program ?? null,
    column1: column1 ?? null,      // ✅ Custom data
    column2: column2 ?? null,      // ✅ Custom data
    column3: column3 ?? null,      // ✅ Custom data
    triggerCall: true,             // ✅ Automatically trigger call
    ...(promptName ? { promptName } : {}),
  });
}

// ===================== CALL =====================

/**
 * POST /api/v1/leads/:leadId/call
 * Trigger call for existing leadId (manual)
 * Webhook आएगा जब call complete हो
 */
async function triggerSingleCall(leadId, options = {}) {
  if (!leadId) throw new Error("leadId is required");

  const body = {};
  if (options.promptName) body.promptName = options.promptName;
  if (options.program !== undefined) body.program = options.program;

  try {
    console.log("[BONVOICE API] Triggering call for leadId:", leadId);
    const res = await client.post(`/leads/${leadId}/call`, body);
    return res.data;
  } catch (err) {
    throw toBonvoiceError(err, "Bonvoice triggerSingleCall failed");
  }
}

/**
 * 2-step helper (agar callId immediately chahiye):
 * create lead (triggerCall=false) -> trigger call manually
 */
async function createLeadThenTriggerCall(leadPayload = {}, callOptions = {}) {
  const lead = await createLead({ ...leadPayload, triggerCall: false });
  const leadId = lead?.leadId;
  if (!leadId) throw new Error("Lead created but leadId missing in response");

  const call = await triggerSingleCall(leadId, callOptions);
  return {
    leadId,
    callId: call?.callId || null,
    lead,
    call,
  };
}

/**
 * ✅ Batch calls - Bonvoice automatically भेजेगा webhook for each call
 * Input format:
 * [
 *   { leadPayload: {...}, callOptions: {...} },
 *   ...
 * ]
 */
async function triggerBatchCalls(leads = [], { concurrency = 10 } = {}) {
  if (!Array.isArray(leads) || !leads.length) {
    throw new Error("leads array must have at least 1 entry");
  }
  if (leads.length > 200) {
    throw new Error("leads array must have <= 200 entries");
  }

  console.log("[BONVOICE API] Triggering batch calls:", leads.length);

  const results = new Array(leads.length);
  let idx = 0;

  const worker = async () => {
    while (idx < leads.length) {
      const current = idx++;
      const item = leads[current];

      try {
        const leadData = await createLeadAndCall(item);
        results[current] = {
          ok: true,
          leadId: leadData?.leadId,
          phone: item.phone,
          data: leadData,
        };
        console.log(`[BONVOICE API] Lead ${current + 1} created`, {
          leadId: leadData?.leadId,
          phone: item.phone,
        });
      } catch (e) {
        results[current] = {
          ok: false,
          phone: item.phone,
          error: e.message,
          status: e.status,
        };
        console.error(`[BONVOICE API] Lead ${current + 1} failed:`, e.message);
      }
    }
  };

  const workers = Array.from(
    { length: Math.min(concurrency, leads.length) },
    worker
  );

  await Promise.all(workers);
  return results;
}

// ===================== READ =====================

/**
 * GET /api/v1/leads/:leadId
 * Returns lead + latestCall (transcript/summary/recording_url etc)
 */
async function getLead(leadId) {
  if (!leadId) throw new Error("leadId is required");
  try {
    const res = await client.get(`/leads/${leadId}`);
    return res.data;
  } catch (err) {
    throw toBonvoiceError(err, "Bonvoice getLead failed");
  }
}

/**
 * Get latest call status using lead data
 */
async function getLatestCallStatus(leadId) {
  const lead = await getLead(leadId);
  return {
    leadId: lead.id,
    leadStatus: lead.leadStatus,
    conversionScore: lead.conversionScore,
    latestCall: lead.latestCall || null,
  };
}

/**
 * GET /api/public/recordings/:callId (public, no auth)
 * Streams MP3 to Express response. Supports Call ID, Lead ID, and Direct URL!
 */
async function getCallRecording(idOrUrl, res) {
  if (!idOrUrl) throw new Error("callId is required");

  // Case 1: Direct full URL
  if (String(idOrUrl).startsWith("http://") || String(idOrUrl).startsWith("https://")) {
    try {
      const response = await axios.get(idOrUrl, { responseType: "stream", timeout: 30000 });
      res.setHeader("Content-Type", response.headers["content-type"] || "audio/mpeg");
      response.data.pipe(res);
      return;
    } catch (urlErr) {
      throw toBonvoiceError(urlErr, "Bonvoice recording URL download failed");
    }
  }

  // Case 2: Try direct recording ID
  try {
    const response = await axios.get(
      `${BONVOICE_CONFIG.PUBLIC_BASE_URL}/recordings/${idOrUrl}`,
      { responseType: "stream", timeout: 30000 }
    );
    res.setHeader("Content-Type", response.headers["content-type"] || "audio/mpeg");
    response.data.pipe(res);
    return;
  } catch (directErr) {
    // If direct recording ID failed (e.g. 404), it might be a Lead ID (e.g. 1022997)
    console.log(`[BONVOICE] Direct recording failed for ${idOrUrl}, checking if it is a Lead ID...`);
  }

  // Case 3: Lookup by Lead ID to resolve the actual recording_url / callId
  try {
    const lead = await getLead(idOrUrl);
    const recUrl = lead?.latestCall?.recording_url || (lead?.latestCall?.id ? `${BONVOICE_CONFIG.PUBLIC_BASE_URL}/recordings/${lead.latestCall.id}` : null);
    if (!recUrl) {
      throw new Error(`No recording found for Bonvoice lead #${idOrUrl}`);
    }

    const response = await axios.get(recUrl, { responseType: "stream", timeout: 30000 });
    res.setHeader("Content-Type", response.headers["content-type"] || "audio/mpeg");
    response.data.pipe(res);
  } catch (err) {
    throw toBonvoiceError(err, "Bonvoice recording download failed");
  }
}

// ===================== WEBHOOK SIGNATURE VERIFY =====================

/**
 * Bonvoice webhook signature verify (HMAC-SHA256)
 * signature header: X-Bonvoice-Signature: sha256=<hex>
 *
 * IMPORTANT: rawBody must be Buffer (express.raw())
 */
function verifyWebhook(rawBody, signature, secret) {
  if (!rawBody || !signature || !secret) return false;
  try {
    const cleanSig = String(signature).replace(/^sha256=/i, "").trim();
    const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
    const sigBuf = Buffer.from(cleanSig, "hex");
    const expBuf = Buffer.from(expected, "hex");
    if (sigBuf.length !== expBuf.length) return false;
    return crypto.timingSafeEqual(sigBuf, expBuf);
  } catch (e) {
    return false;
  }
}

// ===================== WEBHOOK HANDLER =====================

/**
 * Main Bonvoice Webhook Handler
 * Receives call completion webhook, enriches data, saves to dbo.call_webhook_dtl,
 * and syncs with Meta_Call_Log_Tbl, Meta_Lead_Activity_Tbl, and FOLLOWUP_DETAILS.
 */
async function bonvoiceWebhook(req, res) {
  let sequelize;

  const pick = (...vals) =>
    vals.find((v) => v !== undefined && v !== null && v !== "");

  try {
    // 1. Resolve Company Code dynamically
    const compcode = String(
      req.query?.compcode ||
      req.headers?.compcode ||
      req.body?.compcode ||
      process.env.META_COMP_CODE ||
      "autovyn"
    ).trim().toLowerCase();
    req.headers.compcode = compcode;

    console.log("[BONVOICE] ====== WEBHOOK RECEIVED ======");
    console.log("[BONVOICE] Time:", new Date().toISOString());
    console.log("[BONVOICE] CompCode:", compcode);

    // 2. Parse JSON body (Buffer or Object)
    const rawBody = req.body;
    let body;
    if (Buffer.isBuffer(rawBody)) {
      try {
        body = JSON.parse(rawBody.toString("utf8"));
      } catch (e) {
        return res
          .status(400)
          .json({ Status: false, Message: "Invalid JSON body in raw buffer" });
      }
    } else if (typeof rawBody === "string") {
      try {
        body = JSON.parse(rawBody);
      } catch (e) {
        body = {};
      }
    } else {
      body = req.body || {};
    }

    // Normalize payload if wrapped in { data: {...} }
    const payload =
      body &&
      typeof body === "object" &&
      body.data &&
      typeof body.data === "object"
        ? body.data
        : body;

    console.log("[BONVOICE] PARSED PAYLOAD:", JSON.stringify(payload, null, 2));

    // 3. Webhook Signature Verification (Optional via env)
    const enableVerification =
      String(process.env.BONVOICE_VERIFY || "").toLowerCase() === "true";
    let signatureVerified = false;

    if (enableVerification) {
      const signature =
        req.headers["x-bonvoice-signature"] ||
        req.headers["x-webhook-signature"] ||
        req.headers["x-signature"] ||
        null;

      const secret =
        process.env.BONVOICE_WEBHOOK_SECRET ||
        "663e4efc73b2fe6d11e8ed0df6e5a5952dae40a6e04393e9";

      if (!secret) {
        return res.status(500).json({
          Status: false,
          Message: "BONVOICE_WEBHOOK_SECRET missing in env",
        });
      }

      if (!signature) {
        return res.status(401).json({
          Status: false,
          Message: "Unauthorized - No signature provided",
        });
      }

      const bodyBuffer = Buffer.isBuffer(rawBody)
        ? rawBody
        : Buffer.from(JSON.stringify(req.body));

      signatureVerified = verifyWebhook(bodyBuffer, signature, secret);
      if (!signatureVerified) {
        return res.status(401).json({
          Status: false,
          Message: "Unauthorized - Invalid signature",
        });
      }
      console.log("[BONVOICE] Signature verified successfully");
    } else {
      console.log("[BONVOICE] Verification DISABLED");
    }

    // 4. Event filter
    const eventName = pick(payload?.event, body?.event);
    if (eventName && eventName !== "call.completed") {
      console.log("[BONVOICE] Non call.completed event ignored:", eventName);
      return res
        .status(200)
        .json({ Status: true, Message: "Event ignored", event: eventName });
    }

    // 5. Connect to Database
    sequelize = await dbname(req, compcode);
    if (!sequelize) {
      return res.status(500).json({
        Status: false,
        Message: `Database connection failed for compcode '${compcode}'`,
      });
    }

    // 6. Extract Call ID & Lead ID
    let rawCallId = pick(
      payload?.call?.id,
      payload?.call?.callId,
      payload?.callId,
      payload?.call_id,
      payload?.id,
      body?.callId,
      body?.call_id,
      payload?.lead?.latestCall?.id
    );

    let rawLeadId = pick(
      payload?.lead?.id,
      payload?.lead?.leadId,
      payload?.lead?.lead_id,
      payload?.leadId,
      payload?.lead_id,
      body?.leadId,
      body?.lead_id
    );

    let effectivePayload = payload;

    // 7. Auto-Enrichment if details are minimal or missing
    if (rawLeadId && (!rawCallId || !effectivePayload?.call?.summary || !effectivePayload?.call?.recording_url)) {
      try {
        console.log(`[BONVOICE] Enriching call data via GET /leads/${rawLeadId}...`);
        const leadRes = await getLead(String(rawLeadId).trim());
        if (leadRes) {
          if (!rawCallId && leadRes.latestCall?.id) {
            rawCallId = leadRes.latestCall.id;
          }
          effectivePayload = {
            ...effectivePayload,
            lead: {
              ...effectivePayload?.lead,
              ...leadRes,
            },
            call: {
              ...effectivePayload?.call,
              ...leadRes?.latestCall,
            },
          };
          console.log(`[BONVOICE] Enriched successfully for Lead #${rawLeadId}`);
        }
      } catch (enrichErr) {
        console.warn(`[BONVOICE] Enrichment for Lead #${rawLeadId} warning:`, enrichErr.message);
      }
    }

    // If still missing leadId but we have callId, check DB mapping
    if (!rawLeadId && rawCallId) {
      try {
        const mapRows = await sequelize.query(
          `SELECT TOP 1 lead_id, phone_number, callee_name, campaign_id
           FROM dbo.call_webhook_dtl
           WHERE call_id = :callId
           ORDER BY created_at DESC`,
          {
            replacements: { callId: String(rawCallId).trim() },
            type: QueryTypes.SELECT,
          }
        );
        if (mapRows?.[0]?.lead_id) {
          rawLeadId = mapRows[0].lead_id;
        }
      } catch (_) {}
    }

    const lead = effectivePayload?.lead || {};
    const call = effectivePayload?.call || {};

    const call_id = rawCallId ? String(rawCallId).trim() : null;
    const lead_id = rawLeadId ? String(rawLeadId).trim() : null;

    if (!call_id && !lead_id) {
      return res.status(400).json({
        Status: false,
        Message: "Neither call_id nor lead_id found in webhook payload",
      });
    }

    const campaign_id =
      pick(call?.prompt_name, call?.promptName, effectivePayload?.promptName, lead?.programInterestedIn) ||
      null;

    const status =
      pick(call?.status, lead?.latestCall?.status, effectivePayload?.status, body?.status) ||
      "completed";

    const phone_number =
      pick(lead?.phone, lead?.phoneNumber, lead?.mobile, effectivePayload?.phone, body?.phone) ||
      null;

    const durationSeconds =
      pick(
        call?.duration_seconds,
        call?.durationSeconds,
        call?.duration,
        call?.talk_time,
        call?.recording_duration,
        lead?.latestCall?.duration_seconds,
        lead?.latestCall?.duration,
        effectivePayload?.duration,
        body?.duration
      ) || null;

    let calculatedDuration = durationSeconds !== null && !isNaN(durationSeconds) ? Number(durationSeconds) : null;
    const callStartTime = pick(call?.started_at, call?.start_time, lead?.latestCall?.start_time) || null;
    const callEndTime = pick(call?.ended_at, call?.end_time, lead?.latestCall?.end_time, triggered_at) || null;

    if ((calculatedDuration === null || calculatedDuration === 0) && callStartTime && callEndTime) {
      const s = new Date(callStartTime).getTime();
      const e = new Date(callEndTime).getTime();
      if (!isNaN(s) && !isNaN(e) && e > s) {
        calculatedDuration = Math.round((e - s) / 1000);
      }
    }

    const recording_url =
      pick(call?.recording_url, call?.recordingUrl, lead?.latestCall?.recording_url, effectivePayload?.recording_url) ||
      (call_id ? `${BONVOICE_CONFIG.PUBLIC_BASE_URL}/recordings/${call_id}` : null);

    const triggered_at =
      pick(effectivePayload?.timestamp, body?.timestamp, call?.timestamp, lead?.createdAt) ||
      new Date().toISOString();

    const summary = pick(call?.summary, lead?.latestCall?.summary, effectivePayload?.summary) || null;
    const rawTranscript = pick(call?.transcript, lead?.latestCall?.transcript, effectivePayload?.transcript) || null;
    const transcript = typeof rawTranscript === "object" ? JSON.stringify(rawTranscript) : rawTranscript;

    const category =
      pick(call?.classification, lead?.classification, lead?.latestCall?.classification, call?.category, effectivePayload?.category) ||
      null;

    const callee_name =
      pick(lead?.name, effectivePayload?.name, effectivePayload?.callee_name, body?.name) ||
      null;

    const data = {
      call_id: call_id || (lead_id ? `lead_${lead_id}` : null),
      lead_id: lead_id,
      campaign_id: campaign_id ? String(campaign_id).substring(0, 100) : null,
      direction: "outbound",
      phone_number: phone_number ? String(phone_number).substring(0, 15) : null,
      callee_name: callee_name ? String(callee_name).substring(0, 100) : null,
      status: String(status).substring(0, 30),
      duration: calculatedDuration,
      summary: summary ? String(summary).substring(0, 8000) : null,
      transcript: transcript ? String(transcript).substring(0, 8000) : null,
      category: category ? String(category).substring(0, 100) : null,
      recording_url: recording_url ? String(recording_url).substring(0, 500) : null,
      triggered_at: triggered_at,
      start_time: callStartTime,
      end_time: callEndTime,
      compcode: compcode,
    };

    console.log("[BONVOICE] Extracted Data to Save:", {
      call_id: data.call_id,
      lead_id: data.lead_id,
      phone_number: data.phone_number,
      callee_name: data.callee_name,
      status: data.status,
      duration: data.duration,
      category: data.category,
      recording_url: data.recording_url,
    });

    // 8. MERGE into dbo.call_webhook_dtl (matching by call_id OR lead_id)
    const mergeSql = `
      MERGE dbo.call_webhook_dtl AS T
      USING (SELECT :call_id AS call_id, :lead_id AS lead_id) AS S
      ON (S.call_id IS NOT NULL AND S.call_id <> '' AND T.call_id = S.call_id)
         OR (S.lead_id IS NOT NULL AND S.lead_id <> '' AND T.lead_id = S.lead_id)
      WHEN MATCHED THEN
        UPDATE SET
          call_id       = ISNULL(NULLIF(:call_id, ''), T.call_id),
          lead_id       = ISNULL(NULLIF(:lead_id, ''), T.lead_id),
          campaign_id   = ISNULL(:campaign_id, T.campaign_id),
          direction     = ISNULL(:direction, T.direction),
          phone_number  = ISNULL(:phone_number, T.phone_number),
          status        = ISNULL(:status, T.status),
          duration      = ISNULL(:duration, T.duration),
          summary       = ISNULL(:summary, T.summary),
          transcript    = ISNULL(:transcript, T.transcript),
          callee_name   = ISNULL(:callee_name, T.callee_name),
          category      = ISNULL(:category, T.category),
          recording_url = ISNULL(:recording_url, T.recording_url),
          triggered_at  = ISNULL(:triggered_at, T.triggered_at),
          start_time    = ISNULL(:start_time, T.start_time),
          end_time      = ISNULL(:end_time, T.end_time),
          compcode      = ISNULL(:compcode, T.compcode)
      WHEN NOT MATCHED THEN
        INSERT (call_id, lead_id, campaign_id, direction, phone_number, status, duration,
                summary, transcript, callee_name, category, recording_url,
                triggered_at, start_time, end_time, created_at, compcode)
        VALUES (:call_id, :lead_id, :campaign_id, :direction, :phone_number, :status, :duration,
                :summary, :transcript, :callee_name, :category, :recording_url,
                :triggered_at, :start_time, :end_time, GETDATE(), :compcode);
    `;

    await sequelize.query(mergeSql, {
      replacements: {
        call_id: data.call_id,
        lead_id: data.lead_id || null,
        campaign_id: data.campaign_id || null,
        direction: data.direction || null,
        phone_number: data.phone_number || null,
        status: data.status || null,
        duration: data.duration,
        summary: data.summary,
        transcript: data.transcript,
        callee_name: data.callee_name,
        category: data.category,
        recording_url: data.recording_url,
        triggered_at: data.triggered_at || null,
        start_time: data.start_time || null,
        end_time: data.end_time || null,
        compcode: data.compcode || null,
      },
    });

    console.log("[BONVOICE] call_webhook_dtl MERGE completed successfully");

    // 9. Sync with Meta CRM (Meta_Call_Log_Tbl & Activities/Followups)
    let metaLeadUtd = null;
    try {
      // Find matching log in Meta_Call_Log_Tbl
      const logRows = await sequelize.query(
        `SELECT TOP 1 UTD, Meta_Lead_UTD, Call_Id, Phone_Number
         FROM Meta_Call_Log_Tbl
         WHERE Call_Id = :callId
            OR Call_Id = :leadId
            OR (Phone_Number = :phone AND Created_At >= DATEADD(HOUR, -24, GETDATE()))
         ORDER BY UTD DESC`,
        {
          replacements: {
            callId: data.call_id || "",
            leadId: data.lead_id || "",
            phone: data.phone_number || "",
          },
          type: QueryTypes.SELECT,
        }
      );

      if (logRows && logRows.length > 0) {
        metaLeadUtd = logRows[0].Meta_Lead_UTD;
        const logUtd = logRows[0].UTD;

        // Update Meta_Call_Log_Tbl row
        await sequelize.query(
          `UPDATE Meta_Call_Log_Tbl
           SET
             Call_Status = :status,
             Duration = :duration,
             Recording_URL = :recUrl,
             Summary = :summary,
             Transcription = :transcript,
             Category = :category,
             Updated_At = GETDATE()
           WHERE UTD = :logUtd`,
          {
            replacements: {
              status: data.status,
              duration: data.duration,
              recUrl: data.recording_url,
              summary: data.summary,
              transcript: data.transcript,
              category: data.category,
              logUtd,
            },
            type: QueryTypes.UPDATE,
          }
        );
        console.log(`[BONVOICE] Meta_Call_Log_Tbl UTD #${logUtd} updated.`);

        // Sync activity and auto follow-up
        try {
          const metaRoutes = require("./metaWebhookRoutes");
          if (metaRoutes?.syncAiCallSummaryAndFollowup && metaLeadUtd) {
            await metaRoutes.syncAiCallSummaryAndFollowup(
              sequelize,
              metaLeadUtd,
              data.call_id || data.lead_id,
              data.summary,
              data.status,
              data.duration
            );
          }
          if (metaRoutes?.sendPostCallWhatsAppPackage && metaLeadUtd) {
            await metaRoutes.sendPostCallWhatsAppPackage(
              sequelize,
              metaLeadUtd,
              data.call_id || data.lead_id,
              data.summary,
              data.status
            );
          }
        } catch (syncErr) {
          console.warn("[BONVOICE] Meta CRM sync warning:", syncErr.message);
        }
      }
    } catch (metaErr) {
      console.warn("[BONVOICE] Meta_Call_Log_Tbl lookup error:", metaErr.message);
    }

    // 10. Sync with Legacy FOLLOWUP_DETAILS (if used)
    let tranId = null;
    if (data.lead_id) {
      try {
        const followupRows = await sequelize.query(
          `SELECT TOP 1 lead_id, TRAN_ID
           FROM dbo.FOLLOWUP_DETAILS
           WHERE bonvoice_lead_id = :leadId
           ORDER BY CREATED_AT DESC`,
          {
            replacements: { leadId: data.lead_id },
            type: QueryTypes.SELECT,
          }
        );

        tranId = followupRows?.[0]?.TRAN_ID ? String(followupRows[0].TRAN_ID).trim() : null;

        if (tranId) {
          const followupStatus =
            data.category && String(data.category).toLowerCase() === "hot"
              ? "INTERESTED"
              : "CALL_COMPLETED";

          await sequelize.query(
            `UPDATE dbo.FOLLOWUP_DETAILS
             SET
               FOLLOWUP_STATUS = :status,
               FOLLOWUP_DATE = GETDATE(),
               BONVOICE_LEAD_ID = :leadId
             WHERE TRAN_ID = :tranId`,
            {
              replacements: {
                status: followupStatus,
                tranId,
                leadId: data.lead_id,
              },
              type: QueryTypes.UPDATE,
            }
          );
          console.log("[BONVOICE] FOLLOWUP_DETAILS updated for TRAN_ID:", tranId);
        }
      } catch (fuErr) {
        console.warn("[BONVOICE] FOLLOWUP_DETAILS update failed:", fuErr.message);
      }
    }

    console.log("[BONVOICE] ====== WEBHOOK PROCESSED SUCCESSFULLY ======");

    return res.status(200).json({
      Status: true,
      Message: "Webhook processed - data saved to call_webhook_dtl & Meta logs",
      verified: enableVerification ? signatureVerified : false,
      callId: data.call_id,
      leadId: data.lead_id,
      metaLeadUtd: metaLeadUtd || null,
      tranId: tranId || null,
      saved: true,
      data_saved: {
        call_id: data.call_id,
        lead_id: data.lead_id,
        phone_number: data.phone_number,
        callee_name: data.callee_name,
        status: data.status,
        duration: data.duration,
        category: data.category,
        recording_url: data.recording_url,
        summary: data.summary,
      },
    });
  } catch (err) {
    console.error("[BONVOICE] ERROR:", err.message);
    console.error("[BONVOICE] STACK:", err.stack);
    return res.status(500).json({
      Status: false,
      Message: err.message,
      error: err?.original?.message,
    });
  } finally {
    if (sequelize) {
      try {
        await sequelize.close();
      } catch (_) {}
    }
  }
}

// ===================== EXPORTS =====================
module.exports = {
  // lead
  createLead,
  createLeadAndCall,           // ✅ MAIN - Auto trigger call + webhook
  createLeadThenTriggerCall,   // Manual 2-step

  // call
  triggerSingleCall,
  triggerBatchCalls,           // ✅ Batch with auto webhook

  // read
  getLead,
  getLatestCallStatus,
  getCallRecording,

  // webhook
  verifyWebhook,
  bonvoiceWebhook,
};
