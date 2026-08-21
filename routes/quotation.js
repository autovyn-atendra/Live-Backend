const { dbname } = require("../utils/dbconfig");
const { triggerSingleCall } = require("./callmati");
const { startCallStatusPoller } = require("./GetCallRecordings");

const checkColumns = async (sequelize) => {
  try {
    const cols = await sequelize.query(
      `SELECT COLUMN_NAME
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_NAME = 'Srv_Reminder_Tbl'`,
      { type: sequelize.constructor.QueryTypes?.SELECT || "SELECT" }
    );
    const names = new Set((cols || []).map((c) => String(c.COLUMN_NAME).toLowerCase()));

    // Auto-add missing columns if DB user has ALTER permissions
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
    if (!names.has("whatsapp_sent")) {
      try {
        await sequelize.query(`ALTER TABLE dbo.Srv_Reminder_Tbl ADD WhatsApp_Sent INT DEFAULT 0 NULL`);
        names.add("whatsapp_sent");
      } catch (_) {}
    }

    return {
      hasAICallID: names.has("ai_call_id"),
      hasReminderChannel: names.has("reminder_channel"),
      hasWhatsAppSent: names.has("whatsapp_sent"),
      hasUpdatedAt: names.has("updated_at"),
    };
  } catch (_) {
    return {
      hasAICallID: false,
      hasReminderChannel: false,
      hasWhatsAppSent: false,
      hasUpdatedAt: false,
    };
  }
};

exports.makeServiceReminderCall = async function (req, res) {
  let sequelize;

  try {
    sequelize = await dbname(req, req.headers.compcode);

    const { reminder_utd } = req.body;

    // ── Validation ───────────────────────────────────────────
    if (!reminder_utd || isNaN(Number(reminder_utd))) {
      return res.status(400).send({
        success: false,
        message: "reminder_utd is required and must be a valid number",
        example: { reminder_utd: 142 },
      });
    }

    const cleanReminderUTD = Number(reminder_utd);
    console.log("[AI-CALL] cleanReminderUTD:", cleanReminderUTD);

    // Check available columns on Srv_Reminder_Tbl
    const cols = await checkColumns(sequelize);

    // ════════════════════════════════════════════════════════
    // STEP 1 — Reminder + Customer + Vehicle + Exec data fetch
    // ════════════════════════════════════════════════════════
    let mainRow;

    try {
      const aiCallIdSelect = cols.hasAICallID ? "r.AI_Call_ID," : "NULL AS AI_Call_ID,";

      const mainResult = await sequelize.query(
        `SELECT TOP 1
           r.UTD                                                     AS Reminder_UTD,
           r.Cust_Vehi_UTD,
           r.Service_Rule_UTD,
           r.Loc_Code,
           r.Reminder_Type,
           r.Reminder_Status,
           r.Service_Status,
           r.Call_Status,
           r.Reminder_Count,
           r.Next_Service_KM,
           r.Last_Service_KM                                         AS R_Last_Service_KM,
           r.Avg_Daily_KM                                            AS R_Avg_Daily_KM,
           r.Current_KM                                              AS R_Current_KM,
           ${aiCallIdSelect}
           CONVERT(varchar(10), r.Reminder_Date,     23)             AS Reminder_Date,
           CONVERT(varchar(10), r.Final_Due_Date,    23)             AS Final_Due_Date,
           CONVERT(varchar(10), r.Followup_Date,     23)             AS Followup_Date,
           CONVERT(varchar(10), r.Last_Service_Date, 23)             AS R_Last_Service_Date,
           c.UTD                                                     AS Cust_UTD,
           c.Cust_Name,
           c.Cust_Mob,
           c.Model_Name,
           c.Loc_Code                                                AS C_Loc_Code,
           c.Tran_id,
           c.Last_Service_KM                                         AS C_Last_Service_KM,
           CONVERT(varchar(10), c.Last_Service_Date, 23)             AS C_Last_Service_Date,
           c.srv_exec_name,
           c.srv_exec_Emp_Code,
           c.srv_exec_mobile,
           m.Veh_Reg_No,
           m.UTD                                                     AS Mst_Vehi_UTD
         FROM dbo.Srv_Reminder_Tbl r
         INNER JOIN dbo.Srv_Cust_Vehi_Tbl c
           ON c.UTD = r.Cust_Vehi_UTD
         LEFT JOIN dbo.Srv_Mst_Vehi_Tbl m
           ON m.UTD = c.Tran_id
         WHERE r.UTD    = :cleanReminderUTD
           AND r.status = 1`,
        {
          replacements: { cleanReminderUTD },
          type: sequelize.constructor.QueryTypes?.SELECT || "SELECT",
        }
      );

      if (!mainResult || mainResult.length === 0) {
        return res.status(404).send({
          success: false,
          message: `Reminder not found for UTD: ${cleanReminderUTD}`,
          hint   : "Srv_Reminder_Tbl me ye UTD exist nahi karta ya status=0 hai",
        });
      }

      mainRow = mainResult[0];

      if (mainRow.Reminder_Status !== "PENDING") {
        return res.status(400).send({
          success       : false,
          message       : `Reminder UTD ${cleanReminderUTD} ka status PENDING nahi hai`,
          current_status: mainRow.Reminder_Status,
          hint          : "Sirf PENDING reminders pe call ho sakti hai",
          reminderInfo  : {
            Reminder_UTD   : mainRow.Reminder_UTD,
            Reminder_Status: mainRow.Reminder_Status,
            Call_Status    : mainRow.Call_Status,
            Veh_Reg_No     : mainRow.Veh_Reg_No,
            Cust_Name      : mainRow.Cust_Name,
          },
        });
      }
    } catch (e1) {
      console.error("[AI-CALL] STEP1 ERROR :", e1?.message);
      console.error("[AI-CALL] STEP1 STACK :", e1?.stack);
      return res.status(500).send({
        success: false,
        message: "Reminder/Vehicle query failed",
        error  : e1?.message,
      });
    }

    // ════════════════════════════════════════════════════════
    // STEP 2 — Mobile number validate
    // ════════════════════════════════════════════════════════
    if (!mainRow.Cust_Mob || String(mainRow.Cust_Mob).trim() === "") {
      return res.status(400).send({
        success     : false,
        message     : "Customer mobile number not found in DB for this reminder",
        reminderInfo: {
          Reminder_UTD: mainRow.Reminder_UTD,
          Veh_Reg_No  : mainRow.Veh_Reg_No,
          Cust_Name   : mainRow.Cust_Name,
        },
      });
    }

    // ════════════════════════════════════════════════════════
    // STEP 3 — Location-wise ACTIVE Config fetch
    //   (Srv_Reminder_Config_Tbl → status = 1, Loc_Code wise)
    // ════════════════════════════════════════════════════════
    const locCode = mainRow.Loc_Code || mainRow.C_Loc_Code;
    let configRow = null;

    try {
      const configResult = await sequelize.query(
        `SELECT TOP 1
           UTD,
           Loc_Code,
           Service_Center_Name,
           Service_Center_Address,
           Working_Hours,
           Sales_Exec_Number,
           Slot1_Time,
           Slot2_Time,
           Slot3_Time,
           Callback_Time,
           Campaign_Id,
           Max_Attempts_Per_Day,
           Call_Delay_Ms
         FROM dbo.Srv_Reminder_Config_Tbl
         WHERE Loc_Code = :Loc_Code
           AND status   = 1
         ORDER BY UTD DESC`,
        {
          replacements: { Loc_Code: locCode },
          type: sequelize.constructor.QueryTypes?.SELECT || "SELECT",
        }
      );

      console.log(
        "[AI-CALL] STEP3 Config result:",
        JSON.stringify(configResult?.[0], null, 2)
      );

      if (configResult && configResult.length > 0) {
        configRow = configResult[0];
      }
    } catch (cfgErr) {
      console.error("[AI-CALL] STEP3 Config fetch failed:", cfgErr?.message);
    }

    if (!configRow) {
      return res.status(400).send({
        success: false,
        message: `Active config not found for Loc_Code: ${locCode}`,
        hint   : "Srv_Reminder_Config_Tbl me is Loc_Code ke liye status=1 wala row add karo",
      });
    }

    if (!configRow.Campaign_Id || String(configRow.Campaign_Id).trim() === "") {
      return res.status(400).send({
        success: false,
        message: `Campaign_Id config table me set nahi hai (Loc_Code: ${locCode})`,
      });
    }

    const Campain_ID = String(configRow.Campaign_Id).trim();

    // ════════════════════════════════════════════════════════
    // STEP 4 — Service Executive resolve
    //   Priority 1 → Srv_Cust_Vehi_Tbl (srv_exec_mobile)
    //   Priority 2 → Config table (Sales_Exec_Number) — Loc_Code wise
    // ════════════════════════════════════════════════════════
    let execName    = mainRow.srv_exec_name     ? String(mainRow.srv_exec_name).trim()     : "";
    let execEmpCode = mainRow.srv_exec_Emp_Code ? String(mainRow.srv_exec_Emp_Code).trim() : "";
    let execMobile  = mainRow.srv_exec_mobile   ? String(mainRow.srv_exec_mobile).trim()   : "";

    let execSource = "Not_Found";

    // ✅ Priority 1 — Srv_Cust_Vehi_Tbl me number hai to wahi use karo
    if (execMobile !== "") {
      execSource = "Srv_Cust_Vehi_Tbl";
      console.log("[AI-CALL] STEP4 — Exec mobile found in Srv_Cust_Vehi_Tbl:", execMobile);
    }
    // ✅ Priority 2 — Nahi mila to Config table (Sales_Exec_Number) se lo
    else {
      const cfgExecMobile = configRow.Sales_Exec_Number
        ? String(configRow.Sales_Exec_Number).trim()
        : "";

      if (cfgExecMobile !== "") {
        execMobile  = cfgExecMobile;
        execSource  = "Config_Table";
        console.log(
          "[AI-CALL] STEP4 — Exec mobile not found in Srv_Cust_Vehi_Tbl, using Config Sales_Exec_Number:",
          execMobile
        );
      } else {
        console.warn(
          "[AI-CALL] STEP4 ⚠️ Exec mobile not found in Srv_Cust_Vehi_Tbl NOR in Config_Table (Loc_Code:",
          locCode,
          ")"
        );
      }
    }

    const finalTransferNumber = execMobile || "";

    // ════════════════════════════════════════════════════════
    // STEP 5 — Date / Time helpers (values from Config table)
    // ════════════════════════════════════════════════════════
    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      try {
        const parts = String(dateStr).split("-");
        if (parts.length !== 3) return String(dateStr);
        const [y, mo, d] = parts;
        if (!y || !mo || !d) return String(dateStr);
        return `${d.padStart(2, "0")}/${mo.padStart(2, "0")}/${y}`;
      } catch (_) {
        return String(dateStr);
      }
    };

    const buildSlotDate = (reminderDateStr) => {
      let baseDate;
      if (reminderDateStr && String(reminderDateStr).trim() !== "") {
        baseDate = new Date(String(reminderDateStr).trim());
      } else {
        baseDate = new Date();
      }
      if (isNaN(baseDate.getTime())) baseDate = new Date();

      const dd   = String(baseDate.getDate()).padStart(2, "0");
      const mm   = String(baseDate.getMonth() + 1).padStart(2, "0");
      const yyyy = baseDate.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    };

    const slotDate = buildSlotDate(mainRow.Reminder_Date);

    const slots = {
      slot1_date: slotDate,
      slot1_time: configRow.Slot1_Time || "10:30 AM",
      slot2_date: slotDate,
      slot2_time: configRow.Slot2_Time || "01:30 PM",
      slot3_date: slotDate,
      slot3_time: configRow.Slot3_Time || "04:30 PM",
    };

    const callbackTime = configRow.Callback_Time || "10:30 AM";

    // ════════════════════════════════════════════════════════
    // STEP 6 — Variables build (Config table driven)
    // ════════════════════════════════════════════════════════
    const variables = {
      callee_name           : String(mainRow.Cust_Name  || "Customer").trim(),
      vehicle_model         : String(mainRow.Model_Name || "").trim(),
      vehicle_number        : String(mainRow.Veh_Reg_No || "").trim(),
      showroom_name         : configRow.Service_Center_Name    || "",
      service_center_name   : configRow.Service_Center_Name    || "",
      service_center_address: configRow.Service_Center_Address || "",
      working_hours         : configRow.Working_Hours          || "09:00 AM - 06:00 PM",
      slot1_date            : slots.slot1_date,
      slot1_time            : slots.slot1_time,
      slot2_date            : slots.slot2_date,
      slot2_time            : slots.slot2_time,
      slot3_date            : slots.slot3_date,
      slot3_time            : slots.slot3_time,
      callback_date         : formatDate(mainRow.Followup_Date || mainRow.Reminder_Date) || "",
      callback_time         : callbackTime,
      transferNumber        : finalTransferNumber,
      exec_name             : execName    || "",
      exec_emp_code         : execEmpCode || "",
    };

    // ════════════════════════════════════════════════════════
    // STEP 7 — AI Call trigger
    // ════════════════════════════════════════════════════════
    const phoneNumber = String(mainRow.Cust_Mob).trim();

    // ✅ Call type — ye function MANUAL call ke liye hai
    const CALL_CHANNEL = "MANUAL_AI_CALL"; // ✅ MANUAL trigger identifier

    let callResult;
    try {
      callResult = await triggerSingleCall(phoneNumber, variables, Campain_ID);
      console.log(
        "[AI-CALL] triggerSingleCall RAW result:",
        JSON.stringify(callResult, null, 2)
      );
    } catch (callErr) {
      return res.status(502).send({
        success: false,
        message: "AI Call API failed",
        error  : {
          message: callErr?.message,
          status : callErr?.response?.status,
          detail : callErr?.response?.data || null,
        },
        debug: { phoneNumber, Campain_ID, variables },
      });
    }

    // ════════════════════════════════════════════════════════
    // callId extract — double nested handle
    // ════════════════════════════════════════════════════════
    const callId =
      callResult?.callId               ||
      callResult?.data?.callId         ||
      callResult?.data?.data?.callId   ||
      callResult?.calls?.[0]?.callId   ||
      null;

    const calledPhone =
      callResult?.phoneNumber               ||
      callResult?.data?.phoneNumber         ||
      callResult?.data?.data?.phoneNumber   ||
      callResult?.calls?.[0]?.phoneNumber   ||
      phoneNumber;

    // ════════════════════════════════════════════════════════
    // STEP 8 — Call log save (call_Id_dtl table)
    // ════════════════════════════════════════════════════════
    if (callId) {
      try {
        await sequelize.query(
          `INSERT INTO dbo.call_Id_dtl (mob_no, call_id, call_type)
           VALUES (:mob_no, :call_id, :call_type)`,
          {
            replacements: {
              mob_no   : calledPhone,
              call_id  : callId,
              call_type: CALL_CHANNEL,
            },
            type: sequelize.constructor.QueryTypes?.INSERT || "INSERT",
          }
        );
        console.log(
          "[AI-CALL] ✅ Call log saved in call_Id_dtl | callId:",
          callId,
          "| call_type:",
          CALL_CHANNEL
        );
      } catch (logErr) {
        console.error(
          "[AI-CALL] Call log save failed (non-critical):",
          logErr?.message
        );
      }
    } else {
      console.warn("[AI-CALL] ⚠️ No callId received — call_Id_dtl log skip");
    }

    // ════════════════════════════════════════════════════════
    // STEP 9 — Reminder table update
    // ════════════════════════════════════════════════════════
    try {
      const updateClauses = [
        "Reminder_Count   = ISNULL(Reminder_Count, 0) + 1",
        "Last_Reminder_At = GETDATE()",
        "Call_Status      = 'INITIATED'",
      ];
      const replacements = { UTD: Number(mainRow.Reminder_UTD) };

      if (cols.hasReminderChannel) {
        updateClauses.push("Reminder_Channel = :Reminder_Channel");
        replacements.Reminder_Channel = CALL_CHANNEL;
      }
      if (cols.hasAICallID) {
        updateClauses.push("AI_Call_ID = :AI_Call_ID");
        replacements.AI_Call_ID = callId || null;
      }
      if (cols.hasWhatsAppSent) {
        updateClauses.push("WhatsApp_Sent = 0");
      }
      if (cols.hasUpdatedAt) {
        updateClauses.push("Updated_At = GETDATE()");
      }

      await sequelize.query(
        `UPDATE dbo.Srv_Reminder_Tbl
         SET ${updateClauses.join(", ")}
         WHERE UTD = :UTD`,
        {
          replacements,
          type: sequelize.constructor.QueryTypes?.UPDATE || "UPDATE",
        }
      );

      console.log("[AI-CALL] ✅ Reminder updated");
      console.log("[AI-CALL]    Reminder UTD     :", mainRow.Reminder_UTD);
      console.log("[AI-CALL]    AI_Call_ID       :", callId || "NULL");
      console.log("[AI-CALL]    Reminder_Channel :", CALL_CHANNEL);
    } catch (updateErr) {
      console.error(
        "[AI-CALL] Reminder update failed (non-critical):",
        updateErr?.message
      );
    }

    // ════════════════════════════════════════════════════════
    // STEP 9.5 — Auto Background Poller launch for auto WhatsApp dispatch
    // ════════════════════════════════════════════════════════
    if (callId && mainRow.Reminder_UTD) {
      const compCodeVal = req?.headers?.compcode || req?.body?.compcode || mainRow.Loc_Code;
      startCallStatusPoller(compCodeVal, mainRow.Reminder_UTD, callId, mainRow.Cust_Vehi_UTD, calledPhone);
    }

    // ════════════════════════════════════════════════════════
    // STEP 10 — Success Response
    // ════════════════════════════════════════════════════════
    return res.status(200).send({
      success  : true,
      message  : "AI Call Triggered Successfully",
      data     : callResult,
      variables: variables,
      slots    : slots,
      reminder : {
        Reminder_UTD     : mainRow.Reminder_UTD,
        AI_Call_ID       : callId || null,
        Cust_Name        : mainRow.Cust_Name,
        Cust_Mob         : mainRow.Cust_Mob,
        Veh_Reg_No       : mainRow.Veh_Reg_No,
        Model_Name       : mainRow.Model_Name,
        Reminder_Date    : mainRow.Reminder_Date,
        Final_Due_Date   : mainRow.Final_Due_Date,
        Followup_Date    : mainRow.Followup_Date,
        Call_Triggered_To: calledPhone,
        callId           : callId           || null,
        Reminder_Channel : CALL_CHANNEL,
        Call_Status      : "INITIATED",
      },
      serviceExecutive: {
        exec_name      : execName          || null,
        exec_emp_code  : execEmpCode       || null,
        exec_mobile    : execMobile        || null,
        transfer_number: finalTransferNumber,
        source         : execSource, // "Srv_Cust_Vehi_Tbl" | "Config_Table" | "Not_Found"
      },
      callInfo: {
        call_channel: CALL_CHANNEL,
        call_type   : "MANUAL",
        campaign_id : Campain_ID,
      },
      config: {
        Loc_Code               : configRow.Loc_Code,
        Service_Center_Name    : configRow.Service_Center_Name,
        Service_Center_Address : configRow.Service_Center_Address,
        Working_Hours          : configRow.Working_Hours,
        Max_Attempts_Per_Day   : configRow.Max_Attempts_Per_Day,
        Call_Delay_Ms          : configRow.Call_Delay_Ms,
      },
    });

  } catch (err) {
    console.error("[AI-CALL] GLOBAL ERROR:");
    console.error("  message:", err?.message);
    console.error("  stack  :", err?.stack);

    return res.status(500).send({
      success: false,
      message: err?.message || "Error Occurred While Triggering AI Call",
      debug  : {
        status: err?.response?.status || null,
        detail: err?.response?.data   || null,
      },
    });
  } finally {
    if (sequelize) {
      try {
        await sequelize.close();
      } catch (_) {}
    }
  }
};