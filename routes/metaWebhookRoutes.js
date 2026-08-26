const axios = require("axios");
const { QueryTypes } = require("sequelize");
const { dbname } = require("../utils/dbconfig");
const { getCallStatus, getCallRecording } = require("./callmati");


const CALLMATIC_CONFIG = {
  API_KEY: process.env.CALLMATIC_API_KEY || "857e790e-ad5f-4816-9530-0ae643988229",
  BASE_URL: "https://api.callmatic.ai/v1",
};
const headers = {
  "Content-Type": "application/json",
  "api-key": CALLMATIC_CONFIG.API_KEY,
};

/**
 * Make Single Call
 * @param {String} phoneNumber
 * @param {Object} variables
 * @param {String} campaignId
 */
const triggerSingleCall = async (phoneNumber, variables = {}, campaignId = null) => {
  try {
    if (!phoneNumber) {
      throw new Error("Phone number is required");
    }
    if (!campaignId) {
      throw new Error("Campaign ID is missing. No active campaign found in Meta_Callmatic_Campaign_Tbl.");
    }

    const payload = {
      campaignId: campaignId,
      phoneNumber,
      variables,
    };

    const response = await axios.post(
      `${CALLMATIC_CONFIG.BASE_URL}/calls`,
      payload,
      { headers }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Callmatic Single Call Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};



// ============================================================

exports.verifyMetaWebhook = async function (req, res) {
  try {
    console.log("\n========================================");
    console.log("META WEBHOOK VERIFICATION REQUEST");
    console.log("========================================");

    console.log("REQ URL:", req.originalUrl);
    console.log("REQ QUERY:", req.query);

    const mode = req.query["hub.mode"];
    const verifyToken = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    console.log("Mode:", mode);
    console.log("Verify Token:", verifyToken);
    console.log("Challenge:", challenge);

    if (!mode || !verifyToken || !challenge) {
      return res.status(400).json({
        success: false,
        message:
          "Missing Meta webhook verification parameters",
        received: req.query,
      });
    }

    if (
      mode === "subscribe" &&
      verifyToken === process.env.META_VERIFY_TOKEN
    ) {
      console.log(
        "✅ META WEBHOOK VERIFIED SUCCESSFULLY"
      );

      return res.status(200).send(challenge);
    }

    console.log(
      "❌ META WEBHOOK VERIFICATION FAILED"
    );

    return res.status(403).json({
      success: false,
      message:
        "Meta webhook verification failed",
    });

  } catch (error) {
    console.error(
      "Meta Webhook Verify Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


// ============================================================
// META WEBHOOK RECEIVE
// POST /webhook
// ============================================================

const handleWhatsAppStatusWebhook = async (req, res) => {
  try {
    const body = req.body || {};
    const entries = Array.isArray(body.entry) ? body.entry : [];

    for (const entry of entries) {
      const changes = Array.isArray(entry.changes) ? entry.changes : [];
      for (const change of changes) {
        if (change.field === "messages" && change.value) {
          const statuses = Array.isArray(change.value.statuses) ? change.value.statuses : [];
          for (const statusObj of statuses) {
            const wamid = statusObj.id;
            const status = String(statusObj.status || "").toLowerCase();
            const recipientId = statusObj.recipient_id || "";
            const errors = statusObj.errors || null;

            if (status === "delivered" || status === "read" || status === "sent") {
              console.log(`[WHATSAPP-STATUS] Message ID: ${wamid}`);
              console.log(`[WHATSAPP-STATUS] Recipient: ${recipientId}`);
              console.log(`[WHATSAPP-STATUS] Status: ${status}`);
            } else if (status === "failed") {
              const errItem = Array.isArray(errors) && errors.length > 0 ? errors[0] : (errors || {});
              console.error(`[WHATSAPP-STATUS] ❌ FAILED`);
              console.error(`[WHATSAPP-STATUS] Message ID: ${wamid}`);
              console.error(`[WHATSAPP-STATUS] Recipient: ${recipientId}`);
              console.error(`[WHATSAPP-STATUS] Error Code: ${errItem.code || 'N/A'}`);
              console.error(`[WHATSAPP-STATUS] Error Title: ${errItem.title || 'N/A'}`);
              console.error(`[WHATSAPP-STATUS] Error Message: ${errItem.message || 'N/A'}`);
              console.error(`[WHATSAPP-STATUS] Error Details: ${errItem.error_data?.details || errItem.details || 'N/A'}`);
            }
          }
        }
      }
    }
    return res.status(200).json({ success: true, message: "WhatsApp status webhook processed" });
  } catch (err) {
    console.error("[WHATSAPP-STATUS] Webhook error:", err?.message);
    return res.status(200).json({ success: true });
  }
};

exports.receiveMetaWebhook = async function (req, res) {
  try {
    console.log("\n================ WEBHOOK RAW ================");
    console.log("Object:", req.body?.object);
    console.log(JSON.stringify(req.body, null, 2));
    console.log("=============================================\n");

    const body = req.body || {};
    console.log("[META-WEBHOOK] Object:", body.object);

    if (body.object === "whatsapp_business_account") {
      console.log("[WHATSAPP-WEBHOOK] Incoming WhatsApp status webhook");
      return await handleWhatsAppStatusWebhook(req, res);
    }

    if (body.object !== "page") {
      console.log(
        "Webhook object is not page:",
        body.object
      );

      return res.status(200).json({
        success: true,
        message:
          "Webhook received but object was not page",
        data: body,
      });
    }

    const entries =
      Array.isArray(body.entry)
        ? body.entry
        : [];

    // ==========================================================
    // Process Entries
    // ==========================================================

    for (const entry of entries) {

      console.log(
        "\n========================================"
      );

      console.log(
        "ENTRY ID:",
        entry.id
      );

      console.log(
        "ENTRY TIME:",
        entry.time
      );

      const changes =
        Array.isArray(entry.changes)
          ? entry.changes
          : [];

      for (const change of changes) {

        console.log(
          "\nCHANGE FIELD:",
          change.field
        );

        // ======================================================
        // Only Lead Ads
        // ======================================================

        if (change.field !== "leadgen") {
          console.log(
            "Skipping non-leadgen event"
          );

          continue;
        }

        const value =
          change.value || {};

        const leadId =
          value.leadgen_id;

        const pageId =
          value.page_id;

        const formId =
          value.form_id;

        const adId =
          value.ad_id;

        const adGroupId =
          value.adgroup_id;

        const createdTime =
          value.created_time;

        console.log(
          "\n✅ META LEAD EVENT DETECTED"
        );

        console.log(
          "Lead ID:",
          leadId
        );

        console.log(
          "Page ID:",
          pageId
        );

        console.log(
          "Form ID:",
          formId
        );

        console.log(
          "Ad ID:",
          adId
        );

        console.log(
          "Ad Group ID:",
          adGroupId
        );

        console.log(
          "Created Time:",
          createdTime
        );

        if (!leadId) {
          console.log(
            "❌ leadgen_id missing"
          );

          continue;
        }

        // ======================================================
        // PROCESS LEAD
        // ======================================================

        try {

          // ----------------------------------------------------
          // 1. Fetch lead from Meta Graph API
          // ----------------------------------------------------

          const leadDetails =
            await getMetaLeadDetails(
              leadId
            );

          console.log(
            "\n========================================"
          );

          console.log(
            "META FULL LEAD DETAILS"
          );

          console.log(
            "========================================"
          );

          console.log(
            JSON.stringify(
              leadDetails,
              null,
              2
            )
          );

          // ----------------------------------------------------
          // 2. Parse lead
          // ----------------------------------------------------

          const parsedLead =
            parseMetaLeadFields(
              leadDetails
            );

          console.log(
            "\n========================================"
          );

          console.log(
            "PARSED META LEAD"
          );

          console.log(
            "========================================"
          );

          console.log(
            JSON.stringify(
              parsedLead,
              null,
              2
            )
          );

          // ----------------------------------------------------
          // 3. Save directly to database
          // ----------------------------------------------------

          const dbResult =
            await saveMetaLeadToDatabase({
              req,

              leadId,

              pageId,

              formId,

              adId,

              adGroupId,

              createdTime,

              parsedLead,

              leadDetails,

              webhookValue: value,
            });

          console.log(
            "\n========================================"
          );

          console.log(
            "META DATABASE RESULT"
          );

          console.log(
            "========================================"
          );

          console.log(
            JSON.stringify(
              dbResult,
              null,
              2
            )
          );

          // ----------------------------------------------------
          // 4. Trigger Instant AI Call to new Lead
          // ----------------------------------------------------
          if (dbResult?.UTD && !dbResult?.duplicate) {
            try {
              const { triggerInstantMetaLeadCall } = require("../cronJobs/metaLeadCron");
              const compCode = String(
                process.env.META_COMP_CODE ||
                req.headers?.compcode ||
                ""
              ).trim();

              console.log(`[META-WEBHOOK] ⚡ Auto-triggering instant AI Call for new Lead UTD #${dbResult.UTD}`);
              triggerInstantMetaLeadCall({
                metaLeadUtd: dbResult.UTD,
                compcode: compCode,
              }).catch((callErr) => {
                console.error("❌ Instant Meta Lead AI Call Error:", callErr?.message);
              });
            } catch (instErr) {
              console.error("Instant Callmatic Hook Error:", instErr?.message);
            }
          }

        } catch (error) {

          console.error(
            "\n❌ META LEAD PROCESSING FAILED"
          );

          console.error(
            error.response?.data ||
            error.original?.message ||
            error.message ||
            error
          );

          /*
            IMPORTANT:

            Error outer catch tak bhej rahe hain.

            Isse webhook 500 dega agar lead DB me
            save nahi hui.

            Meta webhook retry kar sakta hai.

            Duplicate Meta_Lead_Id check already hai,
            isliye retry safe hai.
          */

          throw error;
        }
      }
    }

    // ==========================================================
    // Meta acknowledgement
    // ==========================================================

    return res.status(200).json({
      success: true,
      message:
        "Meta webhook received and processed successfully",
    });

  } catch (error) {

    console.error(
      "\n========================================"
    );

    console.error(
      "❌ META WEBHOOK PROCESSING ERROR"
    );

    console.error(
      "========================================"
    );

    console.error(
      error.response?.data ||
      error.original?.message ||
      error.message ||
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Meta webhook processing failed",

      error:
        error.response?.data ||
        error.original?.message ||
        error.message,
    });
  }
};


// ============================================================
// GET META LEAD DETAILS
// ============================================================

const getMetaLeadDetails =
  async function (leadId) {

    if (!leadId) {
      throw new Error(
        "Meta lead ID is required"
      );
    }

    if (
      !process.env.META_PAGE_ACCESS_TOKEN
    ) {
      throw new Error(
        "META_PAGE_ACCESS_TOKEN is missing"
      );
    }

    const graphVersion =
      process.env.META_GRAPH_VERSION ||
      "v26.0";

    const url =
      `https://graph.facebook.com/` +
      `${graphVersion}/` +
      `${leadId}`;

    console.log(
      "\nFetching Meta Lead:"
    );

    console.log(
      "Lead ID:",
      leadId
    );

    console.log(
      "Graph Version:",
      graphVersion
    );

    const response =
      await axios.get(
        url,
        {
          params: {

            fields:
              "id,created_time,field_data,form_id,ad_id",

            access_token:
              process.env
                .META_PAGE_ACCESS_TOKEN,
          },

          timeout: 15000,
        }
      );

    return response.data;
  };


// ============================================================
// PARSE META LEAD FIELDS
// ============================================================

const parseMetaLeadFields =
  function (metaLead) {

    const fields = {};

    const fieldData =
      Array.isArray(
        metaLead?.field_data
      )
        ? metaLead.field_data
        : [];

    for (const field of fieldData) {

      const fieldName =
        String(
          field?.name || ""
        )
          .trim()
          .toLowerCase();

      if (!fieldName) {
        continue;
      }

      const values =
        Array.isArray(
          field?.values
        )
          ? field.values
          : [];

      fields[fieldName] =
        values.length === 1
          ? values[0]
          : values;
    }

    return {

      meta_lead_id:
        metaLead?.id ||
        null,

      created_time:
        metaLead?.created_time ||
        null,

      form_id:
        metaLead?.form_id ||
        null,

      ad_id:
        metaLead?.ad_id ||
        null,

      full_name:
        getFirstAvailableField(
          fields,
          [
            "full_name",
            "name",
            "customer_name",
          ]
        ),

      phone_number:
        getFirstAvailableField(
          fields,
          [
            "phone_number",
            "phone",
            "mobile_number",
            "mobile",
            "contact_number",
          ]
        ),

      email:
        getFirstAvailableField(
          fields,
          [
            "email",
            "email_address",
          ]
        ),

      city:
        getFirstAvailableField(
          fields,
          [
            "city",
            "location",
          ]
        ),

      company_name:
        getFirstAvailableField(
          fields,
          [
            "company_name",
            "company",
            "business_name",
            "dealership_name",
          ]
        ),

      all_fields:
        fields,
    };
  };


// ============================================================
// GET FIRST AVAILABLE META FIELD
// ============================================================

const getFirstAvailableField =
  function (fields, keys) {

    for (const key of keys) {

      const value =
        fields?.[key];

      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        return value;
      }
    }

    return null;
  };


// ============================================================
// SAVE META LEAD TO DATABASE
// ============================================================

const saveMetaLeadToDatabase =
  async function ({
    req,

    leadId,

    pageId,

    formId,

    adId,

    adGroupId,

    createdTime,

    parsedLead,

    leadDetails,

    webhookValue,
  }) {

    let sequelize = null;

    try {

      // ========================================================
      // DATABASE / COMPANY CODE
      // ========================================================
      //
      // Meta webhook compcode header nahi bhejega.
      //
      // Isliye .env me META_COMP_CODE rakhna important hai.
      //
      // Local testing me agar header compcode bheja hai,
      // woh fallback ke roop me use ho sakta hai.
      // ========================================================

      const compCode =
        String(
          process.env.META_COMP_CODE ||
          req.headers.compcode ||
          ""
        ).trim();

      if (!compCode) {
        throw new Error(
          "META_COMP_CODE is missing in .env"
        );
      }

      // ========================================================
      // IMPORTANT:
      //
      // dbname ka function tumhare existing project se hai.
      // createCustomerVehicle me bhi same pattern:
      //
      // sequelize = await dbname(req, req.headers.compcode);
      //
      // Yahan Meta ke liye ENV compcode use kar rahe hain.
      // ========================================================

      sequelize =
        await dbname(
          req,
          compCode
        );

      if (!sequelize) {
        throw new Error(
          "Database connection could not be created"
        );
      }

      const metaLeadId =
        String(
          parsedLead?.meta_lead_id ||
          leadId ||
          ""
        ).trim();

      if (!metaLeadId) {
        throw new Error(
          "Meta_Lead_Id is required"
        );
      }

      // ========================================================
      // DUPLICATE CHECK
      // ========================================================

      const existing =
        await sequelize.query(
          `
          SELECT TOP 1
            UTD,
            Meta_Lead_Id,
            Full_Name,
            Phone_Number
          FROM Meta_Lead_Tbl
          WHERE Meta_Lead_Id = :Meta_Lead_Id
          `,
          {
            replacements: {
              Meta_Lead_Id:
                metaLeadId,
            },

            type:
              QueryTypes.SELECT,
          }
        );

      if (
        Array.isArray(existing) &&
        existing.length > 0
      ) {

        console.log(
          "\n========================================"
        );

        console.log(
          "⚠️ META LEAD ALREADY EXISTS"
        );

        console.log(
          "========================================"
        );

        console.log(
          "UTD:",
          existing[0].UTD
        );

        console.log(
          "Meta Lead ID:",
          existing[0].Meta_Lead_Id
        );

        return {
          success: true,
          duplicate: true,

          message:
            "Meta lead already exists",

          UTD:
            existing[0].UTD,

          Meta_Lead_Id:
            existing[0]
              .Meta_Lead_Id,
        };
      }

      // ========================================================
      // NORMALIZE IDs
      // ========================================================

      const finalPageId =
        toStringOrNull(
          pageId
        );

      const finalFormId =
        toStringOrNull(
          parsedLead?.form_id ||
          formId
        );

      const finalAdId =
        toStringOrNull(
          parsedLead?.ad_id ||
          adId
        );

      const finalAdGroupId =
        toStringOrNull(
          adGroupId
        );

      // ========================================================
      // CUSTOMER DATA
      // ========================================================

      const fullName =
        toStringOrNull(
          parsedLead?.full_name
        );

      const phoneNumber =
        toStringOrNull(
          parsedLead?.phone_number
        );

      const email =
        toStringOrNull(
          parsedLead?.email
        );

      const city =
        toStringOrNull(
          parsedLead?.city
        );

      const companyName =
        toStringOrNull(
          parsedLead?.company_name
        );

      // ========================================================
      // META CREATED DATE
      // ========================================================

      const metaCreatedAt =
        parseMetaDate(
          parsedLead?.created_time
        );

      // ========================================================
      // WEBHOOK CREATED DATE
      // Meta created_time = UNIX seconds
      // ========================================================

      const webhookCreatedAt =
        parseUnixTimestamp(
          createdTime
        );

      // ========================================================
      // JSON DATA
      // ========================================================

      const allFields =
        safeJSONStringify(
          parsedLead?.all_fields
        );

      const rawMetaResponse =
        safeJSONStringify(
          leadDetails
        );

      const rawWebhookValue =
        safeJSONStringify(
          webhookValue
        );

      // ========================================================
      // INSERT INTO DATABASE
      // ========================================================

      let result;

      try {

        result =
          await sequelize.query(
            `
            INSERT INTO Meta_Lead_Tbl
            (
              Meta_Lead_Id,
              Page_Id,
              Form_Id,
              Ad_Id,
              Ad_Group_Id,

              Full_Name,
              Phone_Number,
              Email,
              City,
              Company_Name,

              Meta_Created_At,
              Webhook_Created_At,

              All_Fields,
              Raw_Meta_Response,
              Raw_Webhook_Value,

              Source,

              status,

              Created_By,
              Created_At
            )

            OUTPUT
              INSERTED.UTD

            VALUES
            (
              :Meta_Lead_Id,
              :Page_Id,
              :Form_Id,
              :Ad_Id,
              :Ad_Group_Id,

              :Full_Name,
              :Phone_Number,
              :Email,
              :City,
              :Company_Name,

              :Meta_Created_At,
              :Webhook_Created_At,

              :All_Fields,
              :Raw_Meta_Response,
              :Raw_Webhook_Value,

              :Source,

              :status,

              :Created_By,
              GETDATE()
            )
            `,
            {
              replacements: {

                Meta_Lead_Id:
                  metaLeadId,

                Page_Id:
                  finalPageId,

                Form_Id:
                  finalFormId,

                Ad_Id:
                  finalAdId,

                Ad_Group_Id:
                  finalAdGroupId,

                Full_Name:
                  fullName,

                Phone_Number:
                  phoneNumber,

                Email:
                  email,

                City:
                  city,

                Company_Name:
                  companyName,

                Meta_Created_At:
                  metaCreatedAt,

                Webhook_Created_At:
                  webhookCreatedAt,

                All_Fields:
                  allFields,

                Raw_Meta_Response:
                  rawMetaResponse,

                Raw_Webhook_Value:
                  rawWebhookValue,

                Source:
                  "META_LEAD_ADS",

                status:
                  0,

                Created_By:
                  "META_WEBHOOK",
              },

              type:
                QueryTypes.SELECT,
            }
          );

      } catch (insertError) {

        // ======================================================
        // UNIQUE INDEX DUPLICATE PROTECTION
        //
        // Agar Meta exact same webhook same time dobara bhej de,
        // unique Meta_Lead_Id index duplicate ko stop karega.
        // ======================================================

        const errorNumber =
          insertError?.original?.number ||
          insertError?.parent?.number;

        if (
          errorNumber === 2601 ||
          errorNumber === 2627
        ) {

          console.log(
            "⚠️ Duplicate Meta lead prevented by unique index:",
            metaLeadId
          );

          const duplicate =
            await sequelize.query(
              `
              SELECT TOP 1
                UTD,
                Meta_Lead_Id
              FROM Meta_Lead_Tbl
              WHERE Meta_Lead_Id = :Meta_Lead_Id
              `,
              {
                replacements: {
                  Meta_Lead_Id:
                    metaLeadId,
                },

                type:
                  QueryTypes.SELECT,
              }
            );

          return {
            success: true,
            duplicate: true,

            message:
              "Duplicate Meta lead prevented",

            UTD:
              duplicate?.[0]?.UTD ||
              null,

            Meta_Lead_Id:
              metaLeadId,
          };
        }

        throw insertError;
      }

      const insertedUTD =
        result?.[0]?.UTD ||
        null;

      console.log(
        "\n========================================"
      );

      console.log(
        "✅ META LEAD SAVED TO DATABASE"
      );

      console.log(
        "========================================"
      );

      console.log(
        "UTD:",
        insertedUTD
      );

      console.log(
        "Meta Lead ID:",
        metaLeadId
      );

      console.log(
        "Page ID:",
        finalPageId
      );

      console.log(
        "Form ID:",
        finalFormId
      );

      console.log(
        "Name:",
        fullName
      );

      console.log(
        "Phone:",
        phoneNumber
      );

      console.log(
        "Email:",
        email
      );

      console.log(
        "Company:",
        companyName
      );

      return {
        success: true,

        duplicate: false,

        message:
          "Meta lead saved successfully",

        UTD:
          insertedUTD,

        Meta_Lead_Id:
          metaLeadId,

        Full_Name:
          fullName,

        Phone_Number:
          phoneNumber,
      };

    } catch (error) {

      console.error(
        "\n========================================"
      );

      console.error(
        "❌ META LEAD DATABASE SAVE FAILED"
      );

      console.error(
        "========================================"
      );

      console.error(
        error.original?.message ||
        error.parent?.message ||
        error.message ||
        error
      );

      throw error;

    } finally {

      if (sequelize) {

        try {

          await sequelize.close();

        } catch (closeError) {

          console.error(
            "Meta DB Close Error:",
            closeError.message
          );
        }
      }
    }
  };


// ============================================================
// STRING OR NULL
// ============================================================

const toStringOrNull =
  function (value) {

    if (
      value === undefined ||
      value === null
    ) {
      return null;
    }

    // Array field ho to comma separated save kar do
    if (Array.isArray(value)) {

      const arrayValue =
        value
          .filter(
            (item) =>
              item !== undefined &&
              item !== null
          )
          .map(
            (item) =>
              String(item).trim()
          )
          .filter(Boolean)
          .join(", ");

      return arrayValue || null;
    }

    const stringValue =
      String(value).trim();

    return stringValue || null;
  };


// ============================================================
// PARSE META ISO DATE → SQL SERVER DATETIME STRING
// ============================================================

const parseMetaDate =
  function (value) {

    if (!value) {
      return null;
    }

    try {

      const date =
        new Date(value);

      if (
        Number.isNaN(
          date.getTime()
        )
      ) {
        return null;
      }

      return date
        .toISOString()
        .replace("T", " ")
        .slice(0, 19);

    } catch (error) {

      return null;
    }
  };


// ============================================================
// UNIX TIMESTAMP → SQL SERVER DATETIME STRING
// ============================================================

const parseUnixTimestamp =
  function (value) {

    if (
      value === undefined ||
      value === null ||
      value === ""
    ) {
      return null;
    }

    const timestamp =
      Number(value);

    if (
      !Number.isFinite(
        timestamp
      )
    ) {
      return null;
    }

    try {

      const date =
        new Date(
          timestamp * 1000
        );

      if (
        Number.isNaN(
          date.getTime()
        )
      ) {
        return null;
      }

      return date
        .toISOString()
        .replace("T", " ")
        .slice(0, 19);

    } catch (error) {

      return null;
    }
  };


// ============================================================
// SAFE JSON STRINGIFY
// ============================================================

const safeJSONStringify =
  function (value) {

    if (
      value === undefined ||
      value === null
    ) {
      return null;
    }

    try {

      return JSON.stringify(
        value
      );

    } catch (error) {

      console.error(
        "JSON stringify error:",
        error.message
      );

      return null;
    }
  };


// ============================================================
// GET META LEADS (WITH PAGINATION & FILTERS)
// GET /meta/getMetaLeads
// POST /meta/getMetaLeads
// ============================================================

exports.getMetaLeads = async function (req, res) {
  let sequelize = null;
  try {
    const compCode = String(
      req.headers.compcode ||
      req.body?.compcode ||
      req.query?.compcode ||
      process.env.META_COMP_CODE ||
      ""
    ).trim();

    if (!compCode) {
      return res.status(400).json({
        success: false,
        message: "Company code (compcode) is required.",
      });
    }

    sequelize = await dbname(req, compCode);

    if (!sequelize) {
      return res.status(500).json({
        success: false,
        message: "Database connection could not be established.",
      });
    }

    const body = req.body || {};
    const query = req.query || {};

    const page = Math.max(1, parseInt(body.page || query.page || 1, 10));
    const limit = Math.max(1, Math.min(500, parseInt(body.limit || body.pageSize || query.limit || query.pageSize || 10, 10)));
    const offset = (page - 1) * limit;

    const search = String(body.search || body.searchQuery || query.search || query.searchQuery || "").trim();
    const status = body.status !== undefined && body.status !== null && body.status !== ""
      ? body.status
      : (query.status !== undefined && query.status !== null && query.status !== "" ? query.status : undefined);

    const formId = String(body.formId || body.form_id || query.formId || query.form_id || "").trim();
    const pageId = String(body.pageId || body.page_id || query.pageId || query.page_id || "").trim();
    const adId = String(body.adId || body.ad_id || query.adId || query.ad_id || "").trim();
    const fromDate = String(body.fromDate || body.startDate || query.fromDate || query.startDate || "").trim();
    const toDate = String(body.toDate || body.endDate || query.toDate || query.endDate || "").trim();
    const callSourceFilter = String(body.callSource || body.callType || body.filterCallSource || query.callSource || query.callType || "").trim();
    const leadUtd = Number(body.leadUtd || body.utd || query.leadUtd || query.utd || 0);

    const allowedSortFields = ["UTD", "Created_At", "Meta_Created_At", "Full_Name", "Phone_Number", "status", "Company_Name"];
    let sortBy = String(body.sortBy || query.sortBy || "UTD").trim();
    if (!allowedSortFields.includes(sortBy)) {
      sortBy = "UTD";
    }

    let sortOrder = String(body.sortOrder || query.sortOrder || "DESC").trim().toUpperCase();
    if (sortOrder !== "ASC" && sortOrder !== "DESC") {
      sortOrder = "DESC";
    }

    const whereConditions = ["1=1"];
    const replacements = {
      limit,
      offset,
    };

    if (search) {
      whereConditions.push(
        `(
          Full_Name LIKE :search OR
          Phone_Number LIKE :search OR
          Email LIKE :search OR
          City LIKE :search OR
          Company_Name LIKE :search OR
          Meta_Lead_Id LIKE :search OR
          Form_Id LIKE :search
        )`
      );
      replacements.search = `%${search}%`;
    }

    if (leadUtd && !isNaN(leadUtd)) {
      whereConditions.push(`UTD = :leadUtd`);
      replacements.leadUtd = leadUtd;
    } else if (status !== undefined) {
      whereConditions.push(`status = :status`);
      replacements.status = Number(status);
    } else {
      whereConditions.push(`ISNULL(status, 0) <> 6`);
    }

    if (formId) {
      whereConditions.push(`Form_Id = :formId`);
      replacements.formId = formId;
    }

    if (pageId) {
      whereConditions.push(`Page_Id = :pageId`);
      replacements.pageId = pageId;
    }

    if (adId) {
      whereConditions.push(`Ad_Id = :adId`);
      replacements.adId = adId;
    }

    if (fromDate) {
      whereConditions.push(`Created_At >= :fromDate`);
      replacements.fromDate = `${fromDate} 00:00:00`;
    }

    if (toDate) {
      whereConditions.push(`Created_At <= :toDate`);
      replacements.toDate = `${toDate} 23:59:59`;
    }

    const callDate = String(body.callDate || query.callDate || "").trim();
    if (callDate) {
      whereConditions.push(`UTD IN (SELECT DISTINCT Meta_Lead_UTD FROM Meta_Call_Log_Tbl WHERE CAST(Created_At AS DATE) = :callDate)`);
      replacements.callDate = callDate;
    }

    if (callSourceFilter) {
      if (callSourceFilter === "AI_CALL_TODAY") {
        whereConditions.push(`UTD IN (SELECT DISTINCT Meta_Lead_UTD FROM Meta_Call_Log_Tbl WHERE CAST(Created_At AS DATE) = CAST(GETDATE() AS DATE))`);
      } else if (callSourceFilter === "AUTO_AI_CALL" || callSourceFilter === "CRON") {
        whereConditions.push(`UTD IN (SELECT DISTINCT Meta_Lead_UTD FROM Meta_Call_Log_Tbl WHERE Call_Type = 'AUTO_AI_CALL' OR Call_Source LIKE '%CRON%' OR Created_By LIKE '%CRON%')`);
      } else if (callSourceFilter === "MANUAL_AI_CALL" || callSourceFilter === "MANUAL") {
        whereConditions.push(`UTD IN (SELECT DISTINCT Meta_Lead_UTD FROM Meta_Call_Log_Tbl WHERE Call_Type = 'MANUAL_AI_CALL' OR Call_Source LIKE '%MANUAL%' OR (Created_By NOT LIKE '%CRON%' AND Created_By IS NOT NULL))`);
      } else if (callSourceFilter === "SCHEDULED") {
        whereConditions.push(`UTD IN (SELECT DISTINCT Meta_Lead_UTD FROM Meta_Lead_Followup_Tbl WHERE Followup_Status = 'PENDING')`);
      }
    }

    const leadSourceFilter = String(body.leadSource || body.filterLeadSource || query.leadSource || query.filterLeadSource || "").trim().toUpperCase();
    if (leadSourceFilter) {
      if (leadSourceFilter === "MANUAL" || leadSourceFilter === "MANUAL_ENTRY") {
        whereConditions.push(`(Source = 'MANUAL_ENTRY' OR Source LIKE '%MANUAL%')`);
      } else if (leadSourceFilter === "META" || leadSourceFilter === "META_AD" || leadSourceFilter === "META_WEBHOOK") {
        whereConditions.push(`(Source IS NULL OR Source = 'META_WEBHOOK' OR Source LIKE '%META%')`);
      }
    }

    const whereClause = whereConditions.join(" AND ");

    const countQuery = `
      SELECT COUNT(*) AS totalCount
      FROM Meta_Lead_Tbl
      WHERE ${whereClause}
    `;

    const countResult = await sequelize.query(countQuery, {
      replacements,
      type: QueryTypes.SELECT,
    });

    const totalRecords = parseInt(countResult?.[0]?.totalCount || countResult?.[0]?.TOTALCOUNT || 0, 10);
    const totalPages = Math.ceil(totalRecords / limit);

    const dataQuery = `
      SELECT 
        UTD,
        Meta_Lead_Id,
        Page_Id,
        Form_Id,
        Ad_Id,
        Ad_Group_Id,
        Full_Name,
        Phone_Number,
        Email,
        City,
        Company_Name,
        Meta_Created_At,
        Webhook_Created_At,
        All_Fields,
        Raw_Meta_Response,
        Raw_Webhook_Value,
        Source,
        status,
        Created_By,
        Created_At
      FROM Meta_Lead_Tbl
      WHERE ${whereClause}
      ORDER BY ${sortBy} ${sortOrder}
      OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY
    `;

    const leads = await sequelize.query(dataQuery, {
      replacements,
      type: QueryTypes.SELECT,
    });

    const formattedLeads = (leads || []).map((lead) => {
      let parsedAllFields = lead.All_Fields;
      let parsedRawMeta = lead.Raw_Meta_Response;
      let parsedRawWebhook = lead.Raw_Webhook_Value;

      try {
        if (typeof lead.All_Fields === "string") parsedAllFields = JSON.parse(lead.All_Fields);
      } catch (e) { }

      try {
        if (typeof lead.Raw_Meta_Response === "string") parsedRawMeta = JSON.parse(lead.Raw_Meta_Response);
      } catch (e) { }

      try {
        if (typeof lead.Raw_Webhook_Value === "string") parsedRawWebhook = JSON.parse(lead.Raw_Webhook_Value);
      } catch (e) { }

      return {
        ...lead,
        All_Fields: parsedAllFields,
        Raw_Meta_Response: parsedRawMeta,
        Raw_Webhook_Value: parsedRawWebhook,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Meta leads fetched successfully",
      pagination: {
        totalRecords,
        totalPages,
        currentPage: page,
        pageSize: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      data: formattedLeads,
    });
  } catch (error) {
    console.error("Get Meta Leads Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch Meta leads",
      error: error.original?.message || error.message,
    });
  } finally {
    if (sequelize) {
      try {
        await sequelize.close();
      } catch (closeErr) {
        console.error("Error closing sequelize connection in getMetaLeads:", closeErr.message);
      }
    }
  }
};


// ============================================================
// HELPER: STATUS LABEL MAPPING
// ============================================================
const STATUS_LABELS = {
  0: "New",
  10: "Shortlisted",
  1: "Quotation Sent",
  2: "Contacted",
  3: "Interested",
  4: "Demo Scheduled",
  5: "Won",
  6: "Lost",
  8: "Junk",
  9: "3-Day Exhausted",
};

const getStatusLabel = function (val) {
  if (val === null || val === undefined) return "New";
  if (typeof val === "number" && STATUS_LABELS[val]) return STATUS_LABELS[val];
  const str = String(val).trim();
  if (!isNaN(Number(str)) && STATUS_LABELS[Number(str)]) return STATUS_LABELS[Number(str)];
  return str;
};

// ============================================================
// ADD LEAD ACTIVITY API
// POST /meta/addActivity
// ============================================================
exports.addActivity = async function (req, res) {
  let sequelize = null;
  try {
    const compCode = String(
      req.headers.compcode ||
      req.body?.compcode ||
      req.query?.compcode ||
      process.env.META_COMP_CODE ||
      ""
    ).trim();

    if (!compCode) {
      return res.status(400).json({
        success: false,
        message: "Company code (compcode) is required.",
      });
    }

    sequelize = await dbname(req, compCode);
    if (!sequelize) {
      return res.status(500).json({
        success: false,
        message: "Database connection could not be established.",
      });
    }

    const body = req.body || {};
    const metaLeadUtd = Number(body.metaLeadUtd || body.Meta_Lead_UTD || body.leadUtd);
    const activityType = String(body.activityType || body.Activity_Type || "").trim().toUpperCase();

    if (!metaLeadUtd || isNaN(metaLeadUtd)) {
      return res.status(400).json({
        success: false,
        message: "Valid metaLeadUtd is required.",
      });
    }

    if (!activityType) {
      return res.status(400).json({
        success: false,
        message: "activityType is required.",
      });
    }

    const createdBy = String(req.headers.name || body.createdBy || body.userName || "SYSTEM").trim();
    const createdName = String(req.headers.name || body.createdName || body.userName || createdBy).trim();

    const insertSql = `
      INSERT INTO Meta_Lead_Activity_Tbl (
        Meta_Lead_UTD,
        Activity_Type,
        Activity_Status,
        Old_Value,
        New_Value,
        Remark,
        Call_Result,
        Call_Duration_Seconds,
        Message_Id,
        Message_Status,
        Activity_Date,
        Created_By,
        Created_Name,
        Created_At
      ) VALUES (
        :metaLeadUtd,
        :activityType,
        :activityStatus,
        :oldValue,
        :newValue,
        :remark,
        :callResult,
        :callDurationSeconds,
        :messageId,
        :messageStatus,
        GETDATE(),
        :createdBy,
        :createdName,
        GETDATE()
      )
    `;

    await sequelize.query(insertSql, {
      replacements: {
        metaLeadUtd,
        activityType,
        activityStatus: body.activityStatus || "COMPLETED",
        oldValue: body.oldValue || null,
        newValue: body.newValue || null,
        remark: body.remark || null,
        callResult: body.callResult || null,
        callDurationSeconds: body.callDurationSeconds !== undefined ? Number(body.callDurationSeconds) : null,
        messageId: body.messageId || null,
        messageStatus: body.messageStatus || null,
        createdBy,
        createdName,
      },
      type: QueryTypes.INSERT,
    });

    return res.status(200).json({
      success: true,
      message: "Activity recorded successfully",
    });
  } catch (error) {
    console.error("Add Activity Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to record activity",
      error: error.original?.message || error.message,
    });
  } finally {
    if (sequelize) {
      try {
        await sequelize.close();
      } catch (err) { }
    }
  }
};

// ============================================================
// GET LEAD ACTIVITIES API
// GET /meta/getActivities/:leadUtd
// POST /meta/getActivities
// ============================================================
exports.getActivities = async function (req, res) {
  let sequelize = null;
  try {
    const compCode = String(
      req.headers.compcode ||
      req.body?.compcode ||
      req.query?.compcode ||
      process.env.META_COMP_CODE ||
      ""
    ).trim();

    if (!compCode) {
      return res.status(400).json({
        success: false,
        message: "Company code (compcode) is required.",
      });
    }

    sequelize = await dbname(req, compCode);
    if (!sequelize) {
      return res.status(500).json({
        success: false,
        message: "Database connection could not be established.",
      });
    }

    const leadUtd = Number(
      req.params.leadUtd ||
      req.query.leadUtd ||
      req.query.metaLeadUtd ||
      req.body?.leadUtd ||
      req.body?.metaLeadUtd
    );

    if (!leadUtd || isNaN(leadUtd)) {
      return res.status(400).json({
        success: false,
        message: "Valid leadUtd is required.",
      });
    }

    try {
      await autoSyncLeadCalls(sequelize, leadUtd);
    } catch (syncErr) {
      console.error("Auto sync lead calls error (non-critical):", syncErr?.message);
    }

    const query = `
      SELECT 
        UTD,
        Meta_Lead_UTD,
        Activity_Type,
        Activity_Status,
        Old_Value,
        New_Value,
        Remark,
        Call_Result,
        Call_Duration_Seconds,
        Message_Id,
        Message_Status,
        Activity_Date,
        Created_By,
        Created_Name,
        Created_At
      FROM Meta_Lead_Activity_Tbl
      WHERE Meta_Lead_UTD = :leadUtd
      ORDER BY Activity_Date DESC, UTD DESC
    `;

    const activities = await sequelize.query(query, {
      replacements: { leadUtd },
      type: QueryTypes.SELECT,
    });

    // Also fetch Lead details including All_Fields from Meta_Lead_Tbl
    let parsedAllFields = {};
    let leadData = null;
    try {
      const leadResult = await sequelize.query(
        `SELECT TOP 1 
           UTD, Meta_Lead_Id, Page_Id, Form_Id, Ad_Id, Ad_Group_Id, Full_Name, Phone_Number,
           Email, City, Company_Name, Meta_Created_At, Webhook_Created_At, All_Fields,
           Raw_Meta_Response, Raw_Webhook_Value, Source, status, Created_By, Created_At
         FROM Meta_Lead_Tbl
         WHERE UTD = :leadUtd`,
        { replacements: { leadUtd }, type: QueryTypes.SELECT }
      );

      if (leadResult && leadResult.length > 0) {
        const l = leadResult[0];
        parsedAllFields = l.All_Fields;
        let parsedRawMeta = l.Raw_Meta_Response;
        let parsedRawWebhook = l.Raw_Webhook_Value;

        try {
          if (typeof l.All_Fields === "string") parsedAllFields = JSON.parse(l.All_Fields);
        } catch (_) {}
        try {
          if (typeof l.Raw_Meta_Response === "string") parsedRawMeta = JSON.parse(l.Raw_Meta_Response);
        } catch (_) {}
        try {
          if (typeof l.Raw_Webhook_Value === "string") parsedRawWebhook = JSON.parse(l.Raw_Webhook_Value);
        } catch (_) {}

        leadData = {
          ...l,
          All_Fields: parsedAllFields,
          Raw_Meta_Response: parsedRawMeta,
          Raw_Webhook_Value: parsedRawWebhook,
        };
      }
    } catch (lErr) {
      console.warn("Failed to fetch lead details in getActivities:", lErr?.message);
    }

    return res.status(200).json({
      success: true,
      message: "Lead activities fetched successfully",
      data: activities || [],
      All_Fields: parsedAllFields || {},
      lead: leadData,
    });
  } catch (error) {
    console.error("Get Activities Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch lead activities",
      error: error.original?.message || error.message,
    });
  } finally {
    if (sequelize) {
      try {
        await sequelize.close();
      } catch (err) { }
    }
  }
};

// ============================================================
// CREATE FOLLOWUP API
// POST /meta/createFollowup
// ============================================================
exports.createFollowup = async function (req, res) {
  let sequelize = null;
  let transaction = null;
  try {
    const compCode = String(
      req.headers.compcode ||
      req.body?.compcode ||
      req.query?.compcode ||
      process.env.META_COMP_CODE ||
      ""
    ).trim();

    if (!compCode) {
      return res.status(400).json({
        success: false,
        message: "Company code (compcode) is required.",
      });
    }

    sequelize = await dbname(req, compCode);
    if (!sequelize) {
      return res.status(500).json({
        success: false,
        message: "Database connection could not be established.",
      });
    }

    const body = req.body || {};
    const metaLeadUtd = Number(body.metaLeadUtd || body.Meta_Lead_UTD);
    const followupDate = String(body.followupDate || body.Followup_Date || "").trim();
    const followupTime = body.followupTime || body.Followup_Time || null;
    const followupType = String(body.followupType || body.Followup_Type || "CALL").trim().toUpperCase();
    const purpose = body.purpose || body.Purpose || null;
    const remark = body.remark || body.Remark || null;
    const createdBy = String(req.headers.name || body.createdBy || "SYSTEM").trim();
    const assignedTo = body.assignedTo || null;
    const assignedName = body.assignedName || createdBy;

    if (!metaLeadUtd || isNaN(metaLeadUtd)) {
      return res.status(400).json({
        success: false,
        message: "Valid metaLeadUtd is required.",
      });
    }

    if (!followupDate) {
      return res.status(400).json({
        success: false,
        message: "followupDate is required.",
      });
    }

    transaction = await sequelize.transaction();

    const insertFollowupSql = `
      INSERT INTO Meta_Lead_Followup_Tbl (
        Meta_Lead_UTD,
        Followup_Date,
        Followup_Time,
        Followup_Type,
        Followup_Status,
        Purpose,
        Remark,
        Assigned_To,
        Assigned_Name,
        Created_By,
        Created_At
      ) VALUES (
        :metaLeadUtd,
        :followupDate,
        :followupTime,
        :followupType,
        'PENDING',
        :purpose,
        :remark,
        :assignedTo,
        :assignedName,
        :createdBy,
        GETDATE()
      )
    `;

    await sequelize.query(insertFollowupSql, {
      replacements: {
        metaLeadUtd,
        followupDate,
        followupTime,
        followupType,
        purpose,
        remark,
        assignedTo,
        assignedName,
        createdBy,
      },
      type: QueryTypes.INSERT,
      transaction,
    });

    const followupDetailStr = `${followupDate} ${followupTime || ""}`.trim();
    const insertActivitySql = `
      INSERT INTO Meta_Lead_Activity_Tbl (
        Meta_Lead_UTD,
        Activity_Type,
        Activity_Status,
        New_Value,
        Remark,
        Activity_Date,
        Created_By,
        Created_Name,
        Created_At
      ) VALUES (
        :metaLeadUtd,
        'FOLLOWUP_CREATED',
        'PENDING',
        :followupDetailStr,
        :remark,
        GETDATE(),
        :createdBy,
        :assignedName,
        GETDATE()
      )
    `;

    await sequelize.query(insertActivitySql, {
      replacements: {
        metaLeadUtd,
        followupDetailStr,
        remark: purpose || remark || "Follow-up Scheduled",
        createdBy,
        assignedName,
      },
      type: QueryTypes.INSERT,
      transaction,
    });

    await transaction.commit();
    transaction = null;

    return res.status(200).json({
      success: true,
      message: "Follow-up scheduled successfully",
    });
  } catch (error) {
    if (transaction) {
      try {
        await transaction.rollback();
      } catch (rbErr) { }
    }
    console.error("Create Followup Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to schedule follow-up",
      error: error.original?.message || error.message,
    });
  } finally {
    if (sequelize) {
      try {
        await sequelize.close();
      } catch (err) { }
    }
  }
};

// ============================================================
// GET FOLLOWUPS API (OVERDUE, TODAY, UPCOMING)
// POST /meta/getFollowups
// ============================================================
exports.getFollowups = async function (req, res) {
  let sequelize = null;
  try {
    const compCode = String(
      req.headers.compcode ||
      req.body?.compcode ||
      req.query?.compcode ||
      process.env.META_COMP_CODE ||
      ""
    ).trim();

    if (!compCode) {
      return res.status(400).json({
        success: false,
        message: "Company code (compcode) is required.",
      });
    }

    sequelize = await dbname(req, compCode);
    if (!sequelize) {
      return res.status(500).json({
        success: false,
        message: "Database connection could not be established.",
      });
    }

    const body = req.body || {};
    const query = req.query || {};

    const page = Math.max(1, parseInt(body.page || query.page || 1, 10));
    const limit = Math.max(1, Math.min(500, parseInt(body.limit || body.pageSize || query.limit || query.pageSize || 10, 10)));
    const offset = (page - 1) * limit;

    const category = String(body.category || query.category || "").trim().toUpperCase(); // OVERDUE, TODAY, UPCOMING
    const status = String(body.status || query.status || "").trim(); // PENDING, COMPLETED, RESCHEDULED
    const search = String(body.search || query.search || "").trim();
    const followupType = String(body.followupType || query.followupType || "").trim();

    // Summary counts query
    const countsSql = `
      SELECT 
        SUM(CASE 
          WHEN f.Followup_Status = 'PENDING' AND (
            CAST(f.Followup_Date AS DATETIME) + ISNULL(CAST(f.Followup_Time AS DATETIME), 0) < GETDATE()
          ) THEN 1 ELSE 0 
        END) AS overdueCount,
        SUM(CASE 
          WHEN f.Followup_Status = 'PENDING' AND f.Followup_Date = CAST(GETDATE() AS DATE) AND NOT (
            CAST(f.Followup_Date AS DATETIME) + ISNULL(CAST(f.Followup_Time AS DATETIME), 0) < GETDATE()
          ) THEN 1 ELSE 0 
        END) AS todayCount,
        SUM(CASE 
          WHEN f.Followup_Status = 'PENDING' AND f.Followup_Date > CAST(GETDATE() AS DATE) THEN 1 ELSE 0 
        END) AS upcomingCount
      FROM Meta_Lead_Followup_Tbl f
    `;

    const countsRes = await sequelize.query(countsSql, { type: QueryTypes.SELECT });
    const counts = {
      overdueCount: parseInt(countsRes?.[0]?.overdueCount || 0, 10),
      todayCount: parseInt(countsRes?.[0]?.todayCount || 0, 10),
      upcomingCount: parseInt(countsRes?.[0]?.upcomingCount || 0, 10),
    };

    const whereConditions = ["1=1"];
    const replacements = { limit, offset };

    if (status) {
      whereConditions.push("f.Followup_Status = :status");
      replacements.status = status;
    } else if (category === "OVERDUE" || category === "TODAY" || category === "UPCOMING") {
      whereConditions.push("f.Followup_Status = 'PENDING'");
    }

    if (category === "OVERDUE") {
      whereConditions.push("(CAST(f.Followup_Date AS DATETIME) + ISNULL(CAST(f.Followup_Time AS DATETIME), 0) < GETDATE())");
    } else if (category === "TODAY") {
      whereConditions.push("f.Followup_Date = CAST(GETDATE() AS DATE)");
      whereConditions.push("NOT (CAST(f.Followup_Date AS DATETIME) + ISNULL(CAST(f.Followup_Time AS DATETIME), 0) < GETDATE())");
    } else if (category === "UPCOMING") {
      whereConditions.push("f.Followup_Date > CAST(GETDATE() AS DATE)");
    }

    if (search) {
      whereConditions.push("(l.Full_Name LIKE :search OR l.Phone_Number LIKE :search OR f.Purpose LIKE :search OR f.Remark LIKE :search)");
      replacements.search = `%${search}%`;
    }

    if (followupType) {
      whereConditions.push("f.Followup_Type = :followupType");
      replacements.followupType = followupType;
    }

    const whereClause = whereConditions.join(" AND ");

    const countSql = `
      SELECT COUNT(*) AS totalCount
      FROM Meta_Lead_Followup_Tbl f
      LEFT JOIN Meta_Lead_Tbl l ON f.Meta_Lead_UTD = l.UTD
      WHERE ${whereClause}
    `;

    const countRes = await sequelize.query(countSql, { replacements, type: QueryTypes.SELECT });
    const totalRecords = parseInt(countRes?.[0]?.totalCount || 0, 10);
    const totalPages = Math.ceil(totalRecords / limit);

    const dataSql = `
      SELECT 
        f.UTD,
        f.Meta_Lead_UTD,
        f.Followup_Date,
        f.Followup_Time,
        f.Followup_Type,
        f.Followup_Status,
        f.Purpose,
        f.Remark,
        f.Assigned_To,
        f.Assigned_Name,
        f.Completed_At,
        f.Completed_By,
        f.Rescheduled_From_UTD,
        f.Created_By,
        f.Created_At,
        l.Full_Name AS customerName,
        l.Phone_Number AS phone,
        l.Email AS email,
        l.Company_Name AS companyName,
        l.City AS city,
        CASE 
          WHEN f.Followup_Status = 'PENDING' AND (
            CAST(f.Followup_Date AS DATETIME) + ISNULL(CAST(f.Followup_Time AS DATETIME), 0) < GETDATE()
          ) THEN 'OVERDUE'
          WHEN f.Followup_Status = 'PENDING' AND f.Followup_Date = CAST(GETDATE() AS DATE) THEN 'TODAY'
          WHEN f.Followup_Status = 'PENDING' AND f.Followup_Date > CAST(GETDATE() AS DATE) THEN 'UPCOMING'
          ELSE f.Followup_Status
        END AS category
      FROM Meta_Lead_Followup_Tbl f
      LEFT JOIN Meta_Lead_Tbl l ON f.Meta_Lead_UTD = l.UTD
      WHERE ${whereClause}
      ORDER BY f.Followup_Date ASC, f.Followup_Time ASC, f.UTD DESC
      OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY
    `;

    const records = await sequelize.query(dataSql, { replacements, type: QueryTypes.SELECT });

    return res.status(200).json({
      success: true,
      message: "Follow-ups fetched successfully",
      counts,
      pagination: {
        totalRecords,
        totalPages,
        currentPage: page,
        pageSize: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      data: records || [],
    });
  } catch (error) {
    console.error("Get Followups Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch follow-ups",
      error: error.original?.message || error.message,
    });
  } finally {
    if (sequelize) {
      try {
        await sequelize.close();
      } catch (err) { }
    }
  }
};

// ============================================================
// GET META DASHBOARD STATS API (DYNAMIC METRICS FOR DASHBOARD)
// GET /meta/getDashboardStats, POST /meta/getDashboardStats
// ============================================================
exports.getMetaDashboardStats = async function (req, res) {
  let sequelize = null;
  try {
    const compCode = String(
      req.headers.compcode ||
      req.body?.compcode ||
      req.query?.compcode ||
      process.env.META_COMP_CODE ||
      ""
    ).trim();

    if (!compCode) {
      return res.status(400).json({
        success: false,
        message: "Company code (compcode) is required.",
      });
    }

    sequelize = await dbname(req, compCode);
    if (!sequelize) {
      return res.status(500).json({
        success: false,
        message: "Database connection could not be established.",
      });
    }

    // 1. Leads Summary & Trends
    const leadsSql = `
      SELECT 
        COUNT(*) AS totalLeads,
        SUM(CASE WHEN Created_At >= DATEADD(day, -7, GETDATE()) THEN 1 ELSE 0 END) AS leadsThisWeek,
        SUM(CASE WHEN CAST(Created_At AS DATE) = CAST(GETDATE() AS DATE) THEN 1 ELSE 0 END) AS leadsToday,
        SUM(CASE WHEN ISNULL(status, 0) = 0 THEN 1 ELSE 0 END) AS newUncalledLeads,
        SUM(CASE WHEN ISNULL(status, 0) = 1 THEN 1 ELSE 0 END) AS contactedLeads,
        SUM(CASE WHEN ISNULL(status, 0) = 2 THEN 1 ELSE 0 END) AS followupActiveLeads,
        SUM(CASE WHEN ISNULL(status, 0) IN (3, 9) THEN 1 ELSE 0 END) AS closedOrExhaustedLeads,
        SUM(CASE WHEN ISNULL(status, 0) = 4 THEN 1 ELSE 0 END) AS wonLeads
      FROM dbo.Meta_Lead_Tbl
    `;
    const leadsRes = await sequelize.query(leadsSql, { type: QueryTypes.SELECT });
    const leadStats = leadsRes?.[0] || {};

    // 2. Follow-ups Summary
    const followupsSql = `
      SELECT 
        SUM(CASE WHEN f.Followup_Status = 'PENDING' AND f.Followup_Date = CAST(GETDATE() AS DATE) THEN 1 ELSE 0 END) AS todayFollowups,
        SUM(CASE WHEN f.Followup_Status = 'PENDING' AND (
          CAST(f.Followup_Date AS DATETIME) + ISNULL(CAST(f.Followup_Time AS DATETIME), 0) < GETDATE()
        ) THEN 1 ELSE 0 END) AS overdueFollowups,
        SUM(CASE WHEN f.Followup_Status = 'PENDING' AND f.Followup_Date > CAST(GETDATE() AS DATE) THEN 1 ELSE 0 END) AS upcomingFollowups,
        SUM(CASE WHEN f.Followup_Status = 'COMPLETED' AND CAST(f.Updated_At AS DATE) = CAST(GETDATE() AS DATE) THEN 1 ELSE 0 END) AS completedTodayFollowups,
        SUM(CASE WHEN f.Followup_Type IN ('DEMO', 'ONLINE_DEMO', 'OFFLINE_DEMO') OR f.Purpose LIKE '%Demo%' OR f.Purpose LIKE '%demo%' THEN 1 ELSE 0 END) AS totalDemos,
        SUM(CASE WHEN (f.Followup_Type IN ('DEMO', 'ONLINE_DEMO', 'OFFLINE_DEMO') OR f.Purpose LIKE '%Demo%' OR f.Purpose LIKE '%demo%') AND f.Followup_Date >= DATEADD(day, -7, GETDATE()) THEN 1 ELSE 0 END) AS demosThisWeek,
        SUM(CASE WHEN (f.Followup_Type IN ('DEMO', 'ONLINE_DEMO', 'OFFLINE_DEMO') OR f.Purpose LIKE '%Demo%' OR f.Purpose LIKE '%demo%') AND f.Followup_Status = 'COMPLETED' AND f.Followup_Date >= DATEADD(day, -7, GETDATE()) THEN 1 ELSE 0 END) AS demosCompletedThisWeek
      FROM dbo.Meta_Lead_Followup_Tbl f
    `;
    const followupsRes = await sequelize.query(followupsSql, { type: QueryTypes.SELECT });
    const followupStats = followupsRes?.[0] || {};

    // 3. AI Calls Summary
    const callsSql = `
      SELECT 
        COUNT(*) AS totalCalls,
        SUM(CASE WHEN CAST(Created_At AS DATE) = CAST(GETDATE() AS DATE) THEN 1 ELSE 0 END) AS callsToday,
        COUNT(DISTINCT CASE WHEN CAST(Created_At AS DATE) = CAST(GETDATE() AS DATE) THEN Meta_Lead_UTD ELSE NULL END) AS leadsCalledToday,
        SUM(CASE WHEN Created_At >= DATEADD(day, -7, GETDATE()) THEN 1 ELSE 0 END) AS callsThisWeek
      FROM dbo.Meta_Call_Log_Tbl
    `;
    const callsRes = await sequelize.query(callsSql, { type: QueryTypes.SELECT });
    const callStats = callsRes?.[0] || {};

    // 4. WhatsApp Deliveries
    const waSql = `
      SELECT 
        COUNT(*) AS totalWhatsAppSent,
        SUM(CASE WHEN CAST(Created_At AS DATE) = CAST(GETDATE() AS DATE) THEN 1 ELSE 0 END) AS whatsappSentToday
      FROM dbo.Meta_Lead_Activity_Tbl
      WHERE Activity_Type = 'WHATSAPP_SENT'
    `;
    const waRes = await sequelize.query(waSql, { type: QueryTypes.SELECT });
    const waStats = waRes?.[0] || {};

    const totalLeads = parseInt(leadStats.totalLeads || 0, 10);
    const wonLeads = parseInt(leadStats.wonLeads || 0, 10);
    const contactedLeads = parseInt(leadStats.contactedLeads || 0, 10);
    const conversionRate = totalLeads > 0 ? (((wonLeads + Math.floor(contactedLeads * 0.15)) / totalLeads) * 100).toFixed(1) : "0.0";

    return res.status(200).json({
      success: true,
      data: {
        totalLeads,
        leadsThisWeek: parseInt(leadStats.leadsThisWeek || 0, 10),
        leadsToday: parseInt(leadStats.leadsToday || 0, 10),
        todayFollowups: parseInt(followupStats.todayFollowups || 0, 10),
        overdueFollowups: parseInt(followupStats.overdueFollowups || 0, 10),
        upcomingFollowups: parseInt(followupStats.upcomingFollowups || 0, 10),
        completedTodayFollowups: parseInt(followupStats.completedTodayFollowups || 0, 10),
        totalDemos: parseInt(followupStats.totalDemos || 0, 10),
        demosThisWeek: parseInt(followupStats.demosThisWeek || 0, 10),
        demosCompletedThisWeek: parseInt(followupStats.demosCompletedThisWeek || 0, 10),
        conversionRate: `${conversionRate}%`,
        totalCalls: parseInt(callStats.totalCalls || 0, 10),
        callsToday: parseInt(callStats.callsToday || 0, 10),
        leadsCalledToday: parseInt(callStats.leadsCalledToday || 0, 10),
        callsThisWeek: parseInt(callStats.callsThisWeek || 0, 10),
        totalWhatsAppSent: parseInt(waStats.totalWhatsAppSent || 0, 10),
        whatsappSentToday: parseInt(waStats.whatsappSentToday || 0, 10),
        pipeline: {
          newUncalled: parseInt(leadStats.newUncalledLeads || 0, 10),
          contacted: contactedLeads,
          followupActive: parseInt(leadStats.followupActiveLeads || 0, 10),
          closedOrExhausted: parseInt(leadStats.closedOrExhaustedLeads || 0, 10),
          won: wonLeads,
        }
      }
    });

  } catch (error) {
    console.error("[GET-DASHBOARD-STATS] Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
      error: error.message
    });
  } finally {
    if (sequelize) { try { await sequelize.close(); } catch (_) {} }
  }
};

// ============================================================
// COMPLETE FOLLOWUP API
// POST /meta/completeFollowup
// ============================================================
exports.completeFollowup = async function (req, res) {
  let sequelize = null;
  let transaction = null;
  try {
    const compCode = String(
      req.headers.compcode ||
      req.body?.compcode ||
      req.query?.compcode ||
      process.env.META_COMP_CODE ||
      ""
    ).trim();

    if (!compCode) {
      return res.status(400).json({
        success: false,
        message: "Company code (compcode) is required.",
      });
    }

    sequelize = await dbname(req, compCode);
    if (!sequelize) {
      return res.status(500).json({
        success: false,
        message: "Database connection could not be established.",
      });
    }

    const body = req.body || {};
    const followupUtd = Number(body.followupUtd || body.UTD);
    const metaLeadUtd = Number(body.metaLeadUtd || body.Meta_Lead_UTD);
    const result = String(body.result || body.callResult || "CONNECTED").trim();
    const remark = body.remark || body.Remark || null;
    const completedBy = String(req.headers.name || body.completedBy || "SYSTEM").trim();

    if (!followupUtd || isNaN(followupUtd)) {
      return res.status(400).json({
        success: false,
        message: "Valid followupUtd is required.",
      });
    }

    transaction = await sequelize.transaction();

    // Verify existing follow-up
    const checkSql = `
      SELECT Meta_Lead_UTD, Followup_Status
      FROM Meta_Lead_Followup_Tbl
      WHERE UTD = :followupUtd
    `;
    const checkRes = await sequelize.query(checkSql, {
      replacements: { followupUtd },
      type: QueryTypes.SELECT,
      transaction,
    });

    if (!checkRes || checkRes.length === 0) {
      await transaction.rollback();
      transaction = null;
      return res.status(404).json({
        success: false,
        message: "Follow-up record not found.",
      });
    }

    const targetMetaLeadUtd = metaLeadUtd || checkRes[0].Meta_Lead_UTD;

    if (checkRes[0].Followup_Status === "COMPLETED") {
      await transaction.rollback();
      transaction = null;
      return res.status(400).json({
        success: false,
        message: "Follow-up has already been completed.",
      });
    }

    const updateSql = `
      UPDATE Meta_Lead_Followup_Tbl
      SET 
        Followup_Status = 'COMPLETED',
        Completed_At = GETDATE(),
        Completed_By = :completedBy,
        Updated_By = :completedBy,
        Updated_At = GETDATE(),
        Remark = CASE WHEN :remark IS NOT NULL THEN :remark ELSE Remark END
      WHERE UTD = :followupUtd
    `;

    await sequelize.query(updateSql, {
      replacements: { followupUtd, completedBy, remark },
      type: QueryTypes.UPDATE,
      transaction,
    });

    const activitySql = `
      INSERT INTO Meta_Lead_Activity_Tbl (
        Meta_Lead_UTD,
        Activity_Type,
        Activity_Status,
        Call_Result,
        Remark,
        Activity_Date,
        Created_By,
        Created_Name,
        Created_At
      ) VALUES (
        :targetMetaLeadUtd,
        'FOLLOWUP_COMPLETED',
        'COMPLETED',
        :result,
        :remark,
        GETDATE(),
        :completedBy,
        :completedBy,
        GETDATE()
      )
    `;

    await sequelize.query(activitySql, {
      replacements: {
        targetMetaLeadUtd,
        result,
        remark: remark || `Follow-up completed: ${result}`,
        completedBy,
      },
      type: QueryTypes.INSERT,
      transaction,
    });

    await transaction.commit();
    transaction = null;

    return res.status(200).json({
      success: true,
      message: "Follow-up completed successfully",
    });
  } catch (error) {
    if (transaction) {
      try {
        await transaction.rollback();
      } catch (err) { }
    }
    console.error("Complete Followup Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to complete follow-up",
      error: error.original?.message || error.message,
    });
  } finally {
    if (sequelize) {
      try {
        await sequelize.close();
      } catch (err) { }
    }
  }
};

// ============================================================
// RESCHEDULE FOLLOWUP API
// POST /meta/rescheduleFollowup
// ============================================================
exports.rescheduleFollowup = async function (req, res) {
  let sequelize = null;
  let transaction = null;
  try {
    const compCode = String(
      req.headers.compcode ||
      req.body?.compcode ||
      req.query?.compcode ||
      process.env.META_COMP_CODE ||
      ""
    ).trim();

    if (!compCode) {
      return res.status(400).json({
        success: false,
        message: "Company code (compcode) is required.",
      });
    }

    sequelize = await dbname(req, compCode);
    if (!sequelize) {
      return res.status(500).json({
        success: false,
        message: "Database connection could not be established.",
      });
    }

    const body = req.body || {};
    const followupUtd = Number(body.followupUtd || body.UTD);
    const newDate = String(body.newDate || body.followupDate || "").trim();
    const newTime = body.newTime || body.followupTime || null;
    const reason = body.reason || body.remark || null;
    const updatedBy = String(req.headers.name || body.updatedBy || "SYSTEM").trim();

    if (!followupUtd || isNaN(followupUtd)) {
      return res.status(400).json({
        success: false,
        message: "Valid followupUtd is required.",
      });
    }

    if (!newDate) {
      return res.status(400).json({
        success: false,
        message: "New follow-up date is required.",
      });
    }

    transaction = await sequelize.transaction();

    // Verify existing follow-up
    const fetchOldSql = `
      SELECT Meta_Lead_UTD, Followup_Type, Purpose, Assigned_To, Assigned_Name
      FROM Meta_Lead_Followup_Tbl
      WHERE UTD = :followupUtd
    `;
    const oldRes = await sequelize.query(fetchOldSql, {
      replacements: { followupUtd },
      type: QueryTypes.SELECT,
      transaction,
    });

    if (!oldRes || oldRes.length === 0) {
      await transaction.rollback();
      transaction = null;
      return res.status(404).json({
        success: false,
        message: "Original follow-up record not found.",
      });
    }

    const oldRow = oldRes[0];
    const metaLeadUtd = oldRow.Meta_Lead_UTD;

    // Mark old as RESCHEDULED
    const updateOldSql = `
      UPDATE Meta_Lead_Followup_Tbl
      SET 
        Followup_Status = 'RESCHEDULED',
        Updated_By = :updatedBy,
        Updated_At = GETDATE()
      WHERE UTD = :followupUtd
    `;
    await sequelize.query(updateOldSql, {
      replacements: { followupUtd, updatedBy },
      type: QueryTypes.UPDATE,
      transaction,
    });

    // Create new PENDING row
    const insertNewSql = `
      INSERT INTO Meta_Lead_Followup_Tbl (
        Meta_Lead_UTD,
        Followup_Date,
        Followup_Time,
        Followup_Type,
        Followup_Status,
        Purpose,
        Remark,
        Assigned_To,
        Assigned_Name,
        Rescheduled_From_UTD,
        Created_By,
        Created_At
      ) VALUES (
        :metaLeadUtd,
        :newDate,
        :newTime,
        :followupType,
        'PENDING',
        :purpose,
        :reason,
        :assignedTo,
        :assignedName,
        :followupUtd,
        :updatedBy,
        GETDATE()
      )
    `;

    await sequelize.query(insertNewSql, {
      replacements: {
        metaLeadUtd,
        newDate,
        newTime,
        followupType: oldRow.Followup_Type || "CALL",
        purpose: oldRow.Purpose,
        reason,
        assignedTo: oldRow.Assigned_To,
        assignedName: oldRow.Assigned_Name || updatedBy,
        followupUtd,
        updatedBy,
      },
      type: QueryTypes.INSERT,
      transaction,
    });

    // Activity log
    const activitySql = `
      INSERT INTO Meta_Lead_Activity_Tbl (
        Meta_Lead_UTD,
        Activity_Type,
        Activity_Status,
        Old_Value,
        New_Value,
        Remark,
        Activity_Date,
        Created_By,
        Created_Name,
        Created_At
      ) VALUES (
        :metaLeadUtd,
        'FOLLOWUP_RESCHEDULED',
        'COMPLETED',
        :oldValue,
        :newValue,
        :reason,
        GETDATE(),
        :updatedBy,
        :updatedBy,
        GETDATE()
      )
    `;

    await sequelize.query(activitySql, {
      replacements: {
        metaLeadUtd,
        oldValue: `Followup #${followupUtd}`,
        newValue: `${newDate} ${newTime || ""}`.trim(),
        reason: reason || "Rescheduled follow-up",
        updatedBy,
      },
      type: QueryTypes.INSERT,
      transaction,
    });

    await transaction.commit();
    transaction = null;

    return res.status(200).json({
      success: true,
      message: "Follow-up rescheduled successfully",
    });
  } catch (error) {
    if (transaction) {
      try {
        await transaction.rollback();
      } catch (err) { }
    }
    console.error("Reschedule Followup Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to reschedule follow-up",
      error: error.original?.message || error.message,
    });
  } finally {
    if (sequelize) {
      try {
        await sequelize.close();
      } catch (err) { }
    }
  }
};

// ============================================================
// CREATE MANUAL LEAD API
// POST /meta/createManualLead, POST /meta/addLead
// ============================================================
exports.createManualLead = async function (req, res) {
  let sequelize = null;
  let transaction = null;
  try {
    const compCode = String(
      req.headers.compcode ||
      req.body?.compcode ||
      req.query?.compcode ||
      process.env.META_COMP_CODE ||
      ""
    ).trim();

    if (!compCode) {
      return res.status(400).json({
        success: false,
        message: "Company code (compcode) is required.",
      });
    }

    sequelize = await dbname(req, compCode);
    if (!sequelize) {
      return res.status(500).json({
        success: false,
        message: "Database connection could not be established.",
      });
    }

    const body = req.body || {};
    const fullName = String(body.fullName || body.dealerName || body.Full_Name || body.Dealer_Name || "").trim();
    const rawPhone = String(body.phoneNumber || body.Phone_Number || body.phone || body.Mobile_Number || "").trim();
    const designation = String(body.designation || body.Designation || body.jobTitle || "").trim();
    const companyName = String(body.companyName || body.Company_Name || "").trim();
    const noOfEmployees = String(body.noOfEmployees || body.No_Of_Employees || body.employeeCount || "").trim();
    const moduleName = String(body.module || body.Module || body.moduleName || "").trim();
    const campaignId = String(body.campaignId || body.Campaign_Id || body.formId || body.Form_Id || "").trim();
    const email = String(body.email || body.Email || "").trim();
    const city = String(body.city || body.City || "").trim();
    const customQuestions = Array.isArray(body.customQuestions) ? body.customQuestions : [];
    const remark = String(body.remark || body.Remark || "Manual Lead Entry").trim();
    const createdBy = String(req.headers.name || body.createdBy || "MANUAL_USER").trim();

    if (!fullName) {
      return res.status(400).json({
        success: false,
        message: "Dealer / Contact Person Name is required.",
      });
    }

    if (!rawPhone) {
      return res.status(400).json({
        success: false,
        message: "Mobile / Phone Number is required.",
      });
    }

    // Format phone number
    let cleanPhone = rawPhone.replace(/\D/g, "");
    if (cleanPhone.length === 10) {
      cleanPhone = "91" + cleanPhone;
    }

    // If campaign selected, resolve Form_Id / Campaign details
    let resolvedFormId = campaignId;
    let resolvedCampaignName = "";
    if (campaignId) {
      const campRes = await sequelize.query(
        `SELECT TOP 1 Campaign_Id, Campaign_Name, Meta_Form_Id FROM Meta_Callmatic_Campaign_Tbl WHERE Campaign_Id = :campaignId OR Meta_Form_Id = :campaignId`,
        { replacements: { campaignId }, type: QueryTypes.SELECT }
      );
      if (campRes && campRes.length > 0) {
        resolvedFormId = campRes[0].Meta_Form_Id || campRes[0].Campaign_Id || campaignId;
        resolvedCampaignName = campRes[0].Campaign_Name || "";
      }
    }

    // Build structured All_Fields JSON
    const fieldData = {
      full_name: fullName,
      phone_number: cleanPhone,
      dealer_name: fullName,
      designation: designation || undefined,
      company_name: companyName || undefined,
      number_of_employees: noOfEmployees || undefined,
      module: moduleName || undefined,
      campaign_name: resolvedCampaignName || undefined,
      campaign_id: campaignId || undefined,
    };

    // Append dynamic custom questions
    if (customQuestions && customQuestions.length > 0) {
      customQuestions.forEach((q, idx) => {
        const qKey = String(q.question || q.key || `custom_field_${idx + 1}`).trim();
        const qVal = String(q.answer || q.value || "").trim();
        if (qKey && qVal) {
          fieldData[qKey] = qVal;
        }
      });
    }

    const allFieldsJson = JSON.stringify(fieldData);
    const generatedLeadId = `MANUAL_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    transaction = await sequelize.transaction();

    // Insert into Meta_Lead_Tbl
    const insertLeadSql = `
      INSERT INTO Meta_Lead_Tbl (
        Meta_Lead_Id,
        Page_Id,
        Form_Id,
        Full_Name,
        Phone_Number,
        Email,
        City,
        Company_Name,
        All_Fields,
        Raw_Webhook_Value,
        Source,
        status,
        Created_By,
        Created_At
      ) VALUES (
        :metaLeadId,
        'MANUAL_PAGE',
        :formId,
        :fullName,
        :phoneNumber,
        :email,
        :city,
        :companyName,
        :allFields,
        :rawWebhookValue,
        'MANUAL_ENTRY',
        0,
        :createdBy,
        GETDATE()
      )
    `;

    await sequelize.query(insertLeadSql, {
      replacements: {
        metaLeadId: generatedLeadId,
        formId: resolvedFormId || null,
        fullName,
        phoneNumber: cleanPhone,
        email: email || null,
        city: city || null,
        companyName: companyName || null,
        allFields: allFieldsJson,
        rawWebhookValue: JSON.stringify({ source: "MANUAL_ENTRY", customQuestions, fieldData }),
        createdBy,
      },
      type: QueryTypes.INSERT,
      transaction,
    });

    // Fetch newly inserted lead UTD
    const newLeadRes = await sequelize.query(
      `SELECT TOP 1 UTD, Meta_Lead_Id, Full_Name, Phone_Number, Created_At FROM Meta_Lead_Tbl WHERE Meta_Lead_Id = :metaLeadId ORDER BY UTD DESC`,
      { replacements: { metaLeadId: generatedLeadId }, type: QueryTypes.SELECT, transaction }
    );

    const createdLead = newLeadRes?.[0] || {};
    const newLeadUtd = createdLead.UTD;

    // Log Activity
    if (newLeadUtd) {
      await sequelize.query(
        `INSERT INTO Meta_Lead_Activity_Tbl (
          Meta_Lead_UTD,
          Activity_Type,
          Activity_Status,
          Remark,
          Activity_Date,
          Created_By,
          Created_Name,
          Created_At
        ) VALUES (
          :metaLeadUtd,
          'LEAD_CREATED',
          'COMPLETED',
          :remark,
          GETDATE(),
          :createdBy,
          :createdBy,
          GETDATE()
        )`,
        {
          replacements: {
            metaLeadUtd: newLeadUtd,
            remark: `Manual Lead created by ${createdBy}.${resolvedCampaignName ? ` Campaign: ${resolvedCampaignName}.` : ""}${moduleName ? ` Module: ${moduleName}.` : ""}`.trim(),
            createdBy,
          },
          type: QueryTypes.INSERT,
          transaction,
        }
      );
    }

    await transaction.commit();
    transaction = null;

    return res.status(200).json({
      success: true,
      message: "Manual lead added successfully!",
      leadUtd: newLeadUtd,
      data: createdLead,
    });
  } catch (err) {
    if (transaction) {
      try {
        await transaction.rollback();
      } catch (rErr) {}
      transaction = null;
    }
    console.error("Create Manual Lead Error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to create manual lead: " + (err.message || err),
    });
  }
};

// ============================================================
// UPDATE LEAD STATUS API
// POST /meta/updateLeadStatus
// ============================================================
exports.updateLeadStatus = async function (req, res) {
  let sequelize = null;
  let transaction = null;
  try {
    const compCode = String(
      req.headers.compcode ||
      req.body?.compcode ||
      req.query?.compcode ||
      process.env.META_COMP_CODE ||
      ""
    ).trim();

    if (!compCode) {
      return res.status(400).json({
        success: false,
        message: "Company code (compcode) is required.",
      });
    }

    sequelize = await dbname(req, compCode);
    if (!sequelize) {
      return res.status(500).json({
        success: false,
        message: "Database connection could not be established.",
      });
    }

    const body = req.body || {};
    const metaLeadUtd = Number(body.metaLeadUtd || body.Meta_Lead_UTD || body.leadUtd);
    const newStatus = body.status !== undefined ? body.status : body.newStatus;
    const remark = body.remark || body.Remark || null;
    const updatedBy = String(req.headers.name || body.updatedBy || "SYSTEM").trim();

    if (!metaLeadUtd || isNaN(metaLeadUtd)) {
      return res.status(400).json({
        success: false,
        message: "Valid metaLeadUtd is required.",
      });
    }

    if (newStatus === undefined || newStatus === null) {
      return res.status(400).json({
        success: false,
        message: "Status value is required.",
      });
    }

    transaction = await sequelize.transaction();

    // Fetch current status
    const currentLeadRes = await sequelize.query(
      `SELECT status FROM Meta_Lead_Tbl WHERE UTD = :metaLeadUtd`,
      { replacements: { metaLeadUtd }, type: QueryTypes.SELECT, transaction }
    );

    if (!currentLeadRes || currentLeadRes.length === 0) {
      await transaction.rollback();
      transaction = null;
      return res.status(404).json({
        success: false,
        message: "Meta Lead record not found.",
      });
    }

    const oldStatusVal = currentLeadRes[0].status;
    const oldStatusLabel = getStatusLabel(oldStatusVal);
    const newStatusLabel = getStatusLabel(newStatus);

    // Update status
    await sequelize.query(
      `UPDATE Meta_Lead_Tbl SET status = :newStatus WHERE UTD = :metaLeadUtd`,
      { replacements: { metaLeadUtd, newStatus }, type: QueryTypes.UPDATE, transaction }
    );

    // Activity record
    await sequelize.query(
      `INSERT INTO Meta_Lead_Activity_Tbl (
        Meta_Lead_UTD, Activity_Type, Activity_Status, Old_Value, New_Value, Remark, Activity_Date, Created_By, Created_Name, Created_At
      ) VALUES (
        :metaLeadUtd, 'STATUS_CHANGE', 'COMPLETED', :oldStatusLabel, :newStatusLabel, :remark, GETDATE(), :updatedBy, :updatedBy, GETDATE()
      )`,
      { replacements: { metaLeadUtd, oldStatusLabel, newStatusLabel, remark: remark || `Status changed: ${oldStatusLabel} → ${newStatusLabel}`, updatedBy }, type: QueryTypes.INSERT, transaction }
    );

    await transaction.commit();
    transaction = null;

    return res.status(200).json({
      success: true,
      message: "Lead status updated successfully",
      status: newStatus,
      statusLabel: newStatusLabel,
    });
  } catch (error) {
    if (transaction) {
      try {
        await transaction.rollback();
      } catch (err) { }
    }
    console.error("Update Lead Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update lead status",
      error: error.original?.message || error.message,
    });
  } finally {
    if (sequelize) {
      try {
        await sequelize.close();
      } catch (err) { }
    }
  }
};

// ============================================================
// GET SINGLE LEAD MASTER DETAILS API
// GET /meta/getLead/:leadUtd
// ============================================================
exports.getSingleLead = async function (req, res) {
  let sequelize = null;
  try {
    const compCode = String(
      req.headers.compcode ||
      req.body?.compcode ||
      req.query?.compcode ||
      process.env.META_COMP_CODE ||
      ""
    ).trim();

    if (!compCode) {
      return res.status(400).json({
        success: false,
        message: "Company code (compcode) is required.",
      });
    }

    sequelize = await dbname(req, compCode);
    if (!sequelize) {
      return res.status(500).json({
        success: false,
        message: "Database connection could not be established.",
      });
    }

    const leadUtd = Number(req.params.leadUtd || req.query.leadUtd || req.body?.leadUtd);
    if (!leadUtd || isNaN(leadUtd)) {
      return res.status(400).json({
        success: false,
        message: "Valid leadUtd is required.",
      });
    }

    const leads = await sequelize.query(
      `SELECT * FROM Meta_Lead_Tbl WHERE UTD = :leadUtd`,
      { replacements: { leadUtd }, type: QueryTypes.SELECT }
    );

    if (!leads || leads.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Meta lead not found.",
      });
    }

    const lead = leads[0];
    let parsedAllFields = lead.All_Fields;
    let parsedRawMeta = lead.Raw_Meta_Response;
    let parsedRawWebhook = lead.Raw_Webhook_Value;

    try { if (typeof lead.All_Fields === "string") parsedAllFields = JSON.parse(lead.All_Fields); } catch (e) { }
    try { if (typeof lead.Raw_Meta_Response === "string") parsedRawMeta = JSON.parse(lead.Raw_Meta_Response); } catch (e) { }
    try { if (typeof lead.Raw_Webhook_Value === "string") parsedRawWebhook = JSON.parse(lead.Raw_Webhook_Value); } catch (e) { }

    return res.status(200).json({
      success: true,
      data: {
        ...lead,
        All_Fields: parsedAllFields,
        Raw_Meta_Response: parsedRawMeta,
        Raw_Webhook_Value: parsedRawWebhook,
      },
    });
  } catch (error) {
    console.error("Get Single Lead Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch single lead",
      error: error.original?.message || error.message,
    });
  } finally {
    if (sequelize) {
      try {
        await sequelize.close();
      } catch (err) { }
    }
  }
};

// Helper: Auto-ensure media & text columns exist on Meta_Callmatic_Campaign_Tbl
const checkCampaignColumns = async (sequelize) => {
  try {
    const cols = await sequelize.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Meta_Callmatic_Campaign_Tbl'`,
      { type: QueryTypes.SELECT }
    );
    const names = new Set((cols || []).map((c) => String(c.COLUMN_NAME).toLowerCase()));

    if (!names.has("document_url")) {
      try {
        await sequelize.query(`ALTER TABLE dbo.Meta_Callmatic_Campaign_Tbl ADD Document_URL NVARCHAR(1000) NULL`);
      } catch (_) { }
    }
    if (!names.has("video_url")) {
      try {
        await sequelize.query(`ALTER TABLE dbo.Meta_Callmatic_Campaign_Tbl ADD Video_URL NVARCHAR(1000) NULL`);
      } catch (_) { }
    }
    if (!names.has("message_text")) {
      try {
        await sequelize.query(`ALTER TABLE dbo.Meta_Callmatic_Campaign_Tbl ADD Message_Text NVARCHAR(MAX) NULL`);
      } catch (_) { }
    }
  } catch (_) { }
};

// ============================================================
// UPLOAD CAMPAIGN MEDIA API
// POST /meta/uploadCampaignMedia
// ============================================================
const path = require("path");
const fs = require("fs");

const FormData = require("form-data");
const { SMB_PATH } = require("../config/envConfig");

exports.uploadCampaignMedia = async function (req, res) {
  try {
    const files = req.files || (req.file ? [req.file] : []);
    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No media file uploaded",
      });
    }

    const file = files[0];
    const fileExt = path.extname(file.originalname || "file");
    const fileName = `campaign_media_${Date.now()}_${Math.floor(Math.random() * 1000)}${fileExt}`;

    let uploadedRelativePath = `meta_campaigns/${fileName}`;

    // 1. Forward upload to central upload-photo API (https://erp.autovyn.com/backend/upload-photo)
    const fileUploadBaseUrl = process.env.FILE_UPLOAD_BASE_URL || "https://erp.autovyn.com/backend";
    try {
      const formData = new FormData();
      formData.append("file", file.buffer, {
        filename: fileName,
        contentType: file.mimetype || "application/octet-stream",
      });
      formData.append("customPath", "meta_campaigns");
      formData.append("name", req.headers.name || "SYSTEM");

      const uploadResponse = await axios.post(
        `${fileUploadBaseUrl.replace(/\/+$/, "")}/upload-photo`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
          timeout: 20000,
        }
      );

      if (uploadResponse.data) {
        let returnedPath = typeof uploadResponse.data === "string"
          ? uploadResponse.data
          : (uploadResponse.data.path || uploadResponse.data.filePath || (Array.isArray(uploadResponse.data) ? uploadResponse.data[0]?.path : null));

        if (returnedPath) {
          uploadedRelativePath = String(returnedPath).replace(/\\/g, "/").replace(/^\/+/, "");
          console.log("[CAMPAIGN-MEDIA] Uploaded successfully via central upload-photo:", uploadedRelativePath);
        }
      }
    } catch (centralErr) {
      console.warn("[CAMPAIGN-MEDIA] Central upload-photo fallback triggered:", centralErr?.message);

      // 2. Direct SMB_PATH fallback if available
      const baseSmbDir = SMB_PATH || path.join(process.cwd(), "public");
      const smbTargetDir = path.join(baseSmbDir, "meta_campaigns");
      if (!fs.existsSync(smbTargetDir)) {
        fs.mkdirSync(smbTargetDir, { recursive: true });
      }
      const smbTargetPath = path.join(smbTargetDir, fileName);
      fs.writeFileSync(smbTargetPath, file.buffer);
    }

    // 3. Local public/uploads fallback
    try {
      const publicUploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(publicUploadsDir)) {
        fs.mkdirSync(publicUploadsDir, { recursive: true });
      }
      fs.writeFileSync(path.join(publicUploadsDir, fileName), file.buffer);
    } catch (_) { }

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      filePath: uploadedRelativePath,
      path: uploadedRelativePath,
      fileUrl: uploadedRelativePath,
    });
  } catch (error) {
    console.error("Upload Campaign Media Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload campaign media file",
      error: error.message,
    });
  }
};

// ============================================================
// CREATE CAMPAIGN API
// POST /meta/createCampaign
// ============================================================
exports.createCampaign = async function (req, res) {
  let sequelize = null;
  try {
    const compCode = String(
      req.headers.compcode ||
      req.body?.compcode ||
      req.query?.compcode ||
      process.env.META_COMP_CODE ||
      ""
    ).trim();

    if (!compCode) {
      return res.status(400).json({
        success: false,
        message: "Company code (compcode) is required.",
      });
    }

    sequelize = await dbname(req, compCode);
    if (!sequelize) {
      return res.status(500).json({
        success: false,
        message: "Database connection could not be established.",
      });
    }

    await checkCampaignColumns(sequelize);

    const body = req.body || {};
    const campaignId = String(body.campaignId || body.Campaign_Id || "").trim();
    const campaignName = body.campaignName || body.Campaign_Name || null;
    const campaignType = body.campaignType || body.Campaign_Type || "CALLMATIC";
    const metaFormId = body.metaFormId || body.Meta_Form_Id || null;
    const metaFormName = body.metaFormName || body.Meta_Form_Name || null;
    const transferNumberVal = body.transferNumber || body.transfer_number || body.Transfer_Number || body.salesExecutiveNumber || body.Sales_Executive_Number || null;
    const documentUrl = body.documentUrl || body.Document_URL || body.Document_Url || null;
    const videoUrl = body.videoUrl || body.Video_URL || body.Video_Url || null;
    const messageText = body.messageText || body.Message_Text || body.message_text || null;
    const isActive = body.isActive !== undefined ? (body.isActive ? 1 : 0) : (body.Is_Active !== undefined ? (body.Is_Active ? 1 : 0) : 1);
    const remark = body.remark || body.Remark || null;
    const createdBy = String(req.headers.name || body.createdBy || "SYSTEM").trim();

    if (!campaignId) {
      return res.status(400).json({
        success: false,
        message: "Campaign ID (campaignId) is required.",
      });
    }

    // Check duplicate Campaign_Id
    const checkSql = `SELECT UTD FROM Meta_Callmatic_Campaign_Tbl WHERE Campaign_Id = :campaignId`;
    const existing = await sequelize.query(checkSql, {
      replacements: { campaignId },
      type: QueryTypes.SELECT,
    });

    if (existing && existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Campaign ID '${campaignId}' already exists. Please use a unique Campaign ID.`,
      });
    }

    const insertSql = `
      INSERT INTO Meta_Callmatic_Campaign_Tbl (
        Campaign_Id,
        Campaign_Name,
        Campaign_Type,
        Meta_Form_Id,
        Meta_Form_Name,
        Sales_Executive_Number,
        Document_URL,
        Video_URL,
        Message_Text,
        Is_Active,
        Remark,
        Created_By,
        Created_At
      ) VALUES (
        :campaignId,
        :campaignName,
        :campaignType,
        :metaFormId,
        :metaFormName,
        :transferNumberVal,
        :documentUrl,
        :videoUrl,
        :messageText,
        :isActive,
        :remark,
        :createdBy,
        GETDATE()
      )
    `;

    await sequelize.query(insertSql, {
      replacements: {
        campaignId,
        campaignName,
        campaignType,
        metaFormId,
        metaFormName,
        transferNumberVal,
        documentUrl,
        videoUrl,
        messageText,
        isActive,
        remark,
        createdBy,
      },
      type: QueryTypes.INSERT,
    });

    return res.status(200).json({
      success: true,
      message: "Campaign created successfully",
    });
  } catch (error) {
    console.error("Create Campaign Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create campaign",
      error: error.original?.message || error.message,
    });
  } finally {
    if (sequelize) {
      try {
        await sequelize.close();
      } catch (err) { }
    }
  }
};

// ============================================================
// UPDATE CAMPAIGN API
// POST /meta/updateCampaign
// ============================================================
exports.updateCampaign = async function (req, res) {
  let sequelize = null;
  try {
    const compCode = String(
      req.headers.compcode ||
      req.body?.compcode ||
      req.query?.compcode ||
      process.env.META_COMP_CODE ||
      ""
    ).trim();

    if (!compCode) {
      return res.status(400).json({
        success: false,
        message: "Company code (compcode) is required.",
      });
    }

    sequelize = await dbname(req, compCode);
    if (!sequelize) {
      return res.status(500).json({
        success: false,
        message: "Database connection could not be established.",
      });
    }

    await checkCampaignColumns(sequelize);

    const body = req.body || {};
    const utd = Number(body.utd || body.UTD);
    const campaignId = String(body.campaignId || body.Campaign_Id || "").trim();
    const campaignName = body.campaignName !== undefined ? body.campaignName : body.Campaign_Name;
    const campaignType = body.campaignType !== undefined ? body.campaignType : body.Campaign_Type;
    const metaFormId = body.metaFormId !== undefined ? body.metaFormId : body.Meta_Form_Id;
    const metaFormName = body.metaFormName !== undefined ? body.metaFormName : body.Meta_Form_Name;
    const transferNumberVal = body.transferNumber !== undefined ? body.transferNumber : (body.transfer_number !== undefined ? body.transfer_number : (body.Sales_Executive_Number !== undefined ? body.Sales_Executive_Number : body.Transfer_Number));
    const documentUrl = body.documentUrl !== undefined ? body.documentUrl : (body.Document_URL !== undefined ? body.Document_URL : body.Document_Url);
    const videoUrl = body.videoUrl !== undefined ? body.videoUrl : (body.Video_URL !== undefined ? body.Video_URL : body.Video_Url);
    const messageText = body.messageText !== undefined ? body.messageText : (body.Message_Text !== undefined ? body.Message_Text : body.message_text);
    const isActive = body.isActive !== undefined ? (body.isActive ? 1 : 0) : (body.Is_Active !== undefined ? (body.Is_Active ? 1 : 0) : undefined);
    const remark = body.remark !== undefined ? body.remark : body.Remark;
    const updatedBy = String(req.headers.name || body.updatedBy || "SYSTEM").trim();

    if (!utd || isNaN(utd)) {
      return res.status(400).json({
        success: false,
        message: "Valid campaign UTD is required.",
      });
    }

    // Check existing
    const checkSql = `SELECT UTD FROM Meta_Callmatic_Campaign_Tbl WHERE UTD = :utd`;
    const existing = await sequelize.query(checkSql, {
      replacements: { utd },
      type: QueryTypes.SELECT,
    });

    if (!existing || existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Campaign record not found.",
      });
    }

    // Check duplicate Campaign_Id if campaignId is being changed
    if (campaignId) {
      const dupSql = `SELECT UTD FROM Meta_Callmatic_Campaign_Tbl WHERE Campaign_Id = :campaignId AND UTD != :utd`;
      const dup = await sequelize.query(dupSql, {
        replacements: { campaignId, utd },
        type: QueryTypes.SELECT,
      });

      if (dup && dup.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Campaign ID '${campaignId}' is already used by another record.`,
        });
      }
    }

    const updateSql = `
      UPDATE Meta_Callmatic_Campaign_Tbl
      SET 
        Campaign_Id = CASE WHEN :campaignId IS NOT NULL AND :campaignId != '' THEN :campaignId ELSE Campaign_Id END,
        Campaign_Name = CASE WHEN :campaignName IS NOT NULL THEN :campaignName ELSE Campaign_Name END,
        Campaign_Type = CASE WHEN :campaignType IS NOT NULL THEN :campaignType ELSE Campaign_Type END,
        Meta_Form_Id = CASE WHEN :metaFormId IS NOT NULL THEN :metaFormId ELSE Meta_Form_Id END,
        Meta_Form_Name = CASE WHEN :metaFormName IS NOT NULL THEN :metaFormName ELSE Meta_Form_Name END,
        Sales_Executive_Number = CASE WHEN :transferNumberVal IS NOT NULL THEN :transferNumberVal ELSE Sales_Executive_Number END,
        Document_URL = CASE WHEN :documentUrl IS NOT NULL THEN :documentUrl ELSE Document_URL END,
        Video_URL = CASE WHEN :videoUrl IS NOT NULL THEN :videoUrl ELSE Video_URL END,
        Message_Text = CASE WHEN :messageText IS NOT NULL THEN :messageText ELSE Message_Text END,
        Is_Active = CASE WHEN :isActive IS NOT NULL THEN :isActive ELSE Is_Active END,
        Remark = CASE WHEN :remark IS NOT NULL THEN :remark ELSE Remark END,
        Updated_By = :updatedBy,
        Updated_At = GETDATE()
      WHERE UTD = :utd
    `;

    await sequelize.query(updateSql, {
      replacements: {
        utd,
        campaignId: campaignId || null,
        campaignName: campaignName !== undefined ? campaignName : null,
        campaignType: campaignType !== undefined ? campaignType : null,
        metaFormId: metaFormId !== undefined ? metaFormId : null,
        metaFormName: metaFormName !== undefined ? metaFormName : null,
        transferNumberVal: transferNumberVal !== undefined ? transferNumberVal : null,
        documentUrl: documentUrl !== undefined ? documentUrl : null,
        videoUrl: videoUrl !== undefined ? videoUrl : null,
        messageText: messageText !== undefined ? messageText : null,
        isActive: isActive !== undefined ? isActive : null,
        remark: remark !== undefined ? remark : null,
        updatedBy,
      },
      type: QueryTypes.UPDATE,
    });

    return res.status(200).json({
      success: true,
      message: "Campaign updated successfully",
    });
  } catch (error) {
    console.error("Update Campaign Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update campaign",
      error: error.original?.message || error.message,
    });
  } finally {
    if (sequelize) {
      try {
        await sequelize.close();
      } catch (err) { }
    }
  }
};

// ============================================================
// GET CAMPAIGNS API (WITH SEARCH & STATUS FILTER)
// POST /meta/getCampaigns, GET /meta/getCampaigns
// ============================================================
exports.getCampaigns = async function (req, res) {
  let sequelize = null;
  try {
    const compCode = String(
      req.headers.compcode ||
      req.body?.compcode ||
      req.query?.compcode ||
      process.env.META_COMP_CODE ||
      ""
    ).trim();

    if (!compCode) {
      return res.status(400).json({
        success: false,
        message: "Company code (compcode) is required.",
      });
    }

    sequelize = await dbname(req, compCode);
    if (!sequelize) {
      return res.status(500).json({
        success: false,
        message: "Database connection could not be established.",
      });
    }

    await checkCampaignColumns(sequelize);

    const body = req.body || {};
    const query = req.query || {};
    const search = String(body.search || query.search || "").trim();
    const isActiveFilter = body.isActive !== undefined ? body.isActive : query.isActive;

    const whereConditions = ["1=1"];
    const replacements = {};

    if (search) {
      whereConditions.push("(Campaign_Id LIKE :search OR Campaign_Name LIKE :search OR Campaign_Type LIKE :search OR Meta_Form_Id LIKE :search OR Meta_Form_Name LIKE :search OR Sales_Executive_Number LIKE :search OR Message_Text LIKE :search OR Remark LIKE :search)");
      replacements.search = `%${search}%`;
    }

    if (isActiveFilter !== undefined && isActiveFilter !== "" && isActiveFilter !== null) {
      whereConditions.push("Is_Active = :isActive");
      replacements.isActive = Number(isActiveFilter) ? 1 : 0;
    }

    const whereClause = whereConditions.join(" AND ");

    const selectSql = `
      SELECT 
        UTD,
        Campaign_Id,
        Campaign_Name,
        Campaign_Type,
        Meta_Form_Id,
        Meta_Form_Name,
        Sales_Executive_Number,
        Sales_Executive_Number AS Transfer_Number,
        Document_URL,
        Video_URL,
        Message_Text,
        Is_Active,
        Remark,
        Created_By,
        Created_At,
        Updated_By,
        Updated_At
      FROM Meta_Callmatic_Campaign_Tbl
      WHERE ${whereClause}
      ORDER BY UTD DESC
    `;

    const campaigns = await sequelize.query(selectSql, {
      replacements,
      type: QueryTypes.SELECT,
    });

    return res.status(200).json({
      success: true,
      message: "Campaigns fetched successfully",
      data: campaigns || [],
      totalCount: campaigns?.length || 0,
    });
  } catch (error) {
    console.error("Get Campaigns Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch campaigns",
      error: error.original?.message || error.message,
    });
  } finally {
    if (sequelize) {
      try {
        await sequelize.close();
      } catch (err) { }
    }
  }
};

// ============================================================
// TOGGLE CAMPAIGN STATUS API
// POST /meta/toggleCampaignStatus
// ============================================================
exports.toggleCampaignStatus = async function (req, res) {
  let sequelize = null;
  try {
    const compCode = String(
      req.headers.compcode ||
      req.body?.compcode ||
      req.query?.compcode ||
      process.env.META_COMP_CODE ||
      ""
    ).trim();

    if (!compCode) {
      return res.status(400).json({
        success: false,
        message: "Company code (compcode) is required.",
      });
    }

    sequelize = await dbname(req, compCode);
    if (!sequelize) {
      return res.status(500).json({
        success: false,
        message: "Database connection could not be established.",
      });
    }

    const body = req.body || {};
    const utd = Number(body.utd || body.UTD);
    const isActive = body.isActive !== undefined ? (body.isActive ? 1 : 0) : (body.Is_Active !== undefined ? (body.Is_Active ? 1 : 0) : null);
    const updatedBy = String(req.headers.name || body.updatedBy || "SYSTEM").trim();

    if (!utd || isNaN(utd)) {
      return res.status(400).json({
        success: false,
        message: "Valid campaign UTD is required.",
      });
    }

    const updateSql = `
      UPDATE Meta_Callmatic_Campaign_Tbl
      SET 
        Is_Active = CASE WHEN :isActive IS NOT NULL THEN :isActive ELSE CASE WHEN Is_Active = 1 THEN 0 ELSE 1 END END,
        Updated_By = :updatedBy,
        Updated_At = GETDATE()
      WHERE UTD = :utd
    `;

    await sequelize.query(updateSql, {
      replacements: { utd, isActive, updatedBy },
      type: QueryTypes.UPDATE,
    });

    return res.status(200).json({
      success: true,
      message: "Campaign status updated successfully",
    });
  } catch (error) {
    console.error("Toggle Campaign Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to toggle campaign status",
      error: error.original?.message || error.message,
    });
  } finally {
    if (sequelize) {
      try {
        await sequelize.close();
      } catch (err) { }
    }
  }
};

const getDealerId = (compCode) => {
  const metaCode = (process.env.META_COMP_CODE || "autovyn").toLowerCase();
  if (!compCode || String(compCode) === "1" || String(compCode).toLowerCase().includes(metaCode)) {
    return process.env.META_COMP_CODE || "AUTOVYN";
  }
  return String(compCode);
};


const { WHATSAPP_API_USERID, WHATSAPP_API_RPASSWORD } = require("../config/envConfig");

const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || "442952878893870";
const whatsappDispatchState = new Map(); // callId -> 'PROCESSING' | 'SENT' | 'FAILED'

let metaWabaToken = null;
const getWhatsAppAuthToken = async () => {
  if (metaWabaToken) return metaWabaToken;
  try {
    const res = await axios.post(
      "https://messagingapi.charteredinfo.com/AuthTokenV1/AuthToken",
      {
        userId: WHATSAPP_API_USERID,
        password: WHATSAPP_API_RPASSWORD,
      },
      { timeout: 15000 }
    );
    if (res.data && res.data.txnOutcome) {
      metaWabaToken = res.data.txnOutcome;
      return metaWabaToken;
    }
    return false;
  } catch (e) {
    console.error("[META-WABA-AUTH] Error fetching auth token:", e?.message);
    return false;
  }
};

const normalizeWhatsAppNumber = (phone) => {
  let digits = String(phone || "").replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return digits;
  if (digits.length > 10) return `91${digits.slice(-10)}`;
  return digits;
};

const buildPublicMediaUrl = (rawPath) => {
  if (!rawPath) return "";
  if (rawPath.startsWith("http://") || rawPath.startsWith("https://")) return rawPath;
  const clean = String(rawPath).replace(/\\/g, "/").replace(/^\/+/, "");
  return `https://erp.autovyn.com/backend/fetch?filePath=${encodeURIComponent(clean)}`;
};

// Cache Meta Media IDs in memory (Meta Media IDs are valid for 30 days)
const metaMediaCache = new Map();

// Upload media file to Meta's servers → returns media ID
// Meta can't download from erp.autovyn.com, so we upload files directly
const uploadMediaToMeta = async (rawPath, mimeType = "application/pdf") => {
  const fs = require("fs");
  const path = require("path");
  const FormData = require("form-data");
  const { SMB_PATH } = require("../config/envConfig");

  try {
    const clean = String(rawPath).replace(/\\/g, "/");
    const cacheKey = `${clean}_${mimeType}`;

    // ⚡ Fast Cache Lookup (Meta Media IDs are valid for 30 days, we cache for 25 days)
    if (metaMediaCache.has(cacheKey)) {
      const cached = metaMediaCache.get(cacheKey);
      if (Date.now() - cached.timestamp < 25 * 24 * 60 * 60 * 1000) {
        console.log(`[MEDIA-CACHE] ⚡ Reusing cached Meta Media ID for ${cacheKey}: ${cached.mediaId}`);
        return { success: true, mediaId: cached.mediaId };
      }
    }

    const token = await getWhatsAppAuthToken();
    if (!token) throw new Error("Auth token failed");

    const filename = path.basename(clean);

    // Try local file first, then download from production
    let filePath = path.join(SMB_PATH, clean);
    if (!fs.existsSync(filePath)) {
      filePath = path.join(SMB_PATH, "meta_campaigns", filename);
    }

    let tempFile = null;
    if (!fs.existsSync(filePath)) {
      // Download from production server
      const prodUrl = `https://erp.autovyn.com/backend/fetch?filePath=${encodeURIComponent(clean)}`;
      console.log(`[MEDIA-UPLOAD] Downloading from production: ${prodUrl}`);
      const tmpDir = path.join(require("os").tmpdir(), "meta_media_uploads");
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
      tempFile = path.join(tmpDir, `upload_${Date.now()}_${filename}`);
      const writer = fs.createWriteStream(tempFile);
      const resp = await axios.get(prodUrl, { responseType: "stream", timeout: 60000 });
      resp.data.pipe(writer);
      await new Promise((resolve, reject) => { writer.on("finish", resolve); writer.on("error", reject); });
      filePath = tempFile;
    }

    const fileSize = fs.statSync(filePath).size;
    console.log(`[MEDIA-UPLOAD] Uploading ${filename} (${(fileSize / 1024 / 1024).toFixed(2)} MB) to Meta...`);

    const form = new FormData();
    form.append("file", fs.createReadStream(filePath), { filename, contentType: mimeType });
    form.append("messaging_product", "whatsapp");
    form.append("type", mimeType);

    const res = await axios.post(
      `https://messagingapi.charteredinfo.com/v19.0/${WHATSAPP_PHONE_NUMBER_ID}/media`,
      form,
      {
        headers: { ...form.getHeaders(), Authorization: `Bearer ${token}` },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        timeout: 120000,
      }
    );

    const mediaId = res.data?.id;
    console.log(`[MEDIA-UPLOAD] ✅ Upload success! Media ID: ${mediaId}`);

    if (mediaId) {
      metaMediaCache.set(cacheKey, { mediaId, timestamp: Date.now() });
    }

    // Cleanup temp file
    if (tempFile && fs.existsSync(tempFile)) {
      try { fs.unlinkSync(tempFile); } catch (_) {}
    }

    return { success: true, mediaId };
  } catch (err) {
    console.error(`[MEDIA-UPLOAD] ❌ Upload failed:`, err?.response?.data || err?.message);
    return { success: false, mediaId: null, error: err?.message };
  }
};

// Approved WABA Text Template Sender
const sendWhatsAppTextTemplate = async (number, customerName = "Valued Customer", messageText = "Welcome to AutoVyn") => {
  try {
    const normalizedPhone = normalizeWhatsAppNumber(number);
    const token = await getWhatsAppAuthToken();
    if (!token) throw new Error("WhatsApp authentication token could not be generated");

    const templateName = "meta_lead_campaign_notification";
    const custNameParam = String(customerName || "Valued Customer").trim();
    const cleanTemplateText = String(messageText || "")
      .replace(/[\r\n]+/g, " | ")
      .replace(/\s{2,}/g, " ")
      .trim();
    const safeText = cleanTemplateText.length > 950 ? cleanTemplateText.substring(0, 947) + "..." : cleanTemplateText;

    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: normalizedPhone,
      type: "template",
      template: {
        name: templateName,
        language: { code: "en" },
        components: [
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: custNameParam,
              },
              {
                type: "text",
                text: safeText,
              },
            ],
          },
        ],
      },
    };
    const res = await axios.post(
      `https://messagingapi.charteredinfo.com/v19.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      payload,
      { headers: { Authorization: `Bearer ${token}` }, timeout: 15000 }
    );
    const messageId = res.data?.messages?.[0]?.id || null;
    return { success: true, messageId, raw: res.data };
  } catch (err) {
    console.error(`[WHATSAPP-TEXT-TPL] ❌ HTTP ${err?.response?.status || 500} Error:`, err?.response?.data || err?.message);
    return { success: false, messageId: null, error: err?.response?.data || err?.message };
  }
};

// Approved WABA Video Header Template Sender (Supports both uploadWhatsAppMedia ID & URL link)
const sendWhatsAppVideoTemplate = async (number, videoSource, videoName = "Dealership Presentation Video") => {
  try {
    const normalizedPhone = normalizeWhatsAppNumber(number);
    const token = await getWhatsAppAuthToken();
    if (!token) throw new Error("WhatsApp authentication token could not be generated");

    const isUrl = String(videoSource).startsWith("http://") || String(videoSource).startsWith("https://");
    const videoHeaderObj = isUrl ? { link: String(videoSource) } : { id: String(videoSource) };

    const templateName = "final_video_template";
    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: normalizedPhone,
      type: "template",
      template: {
        name: templateName,
        language: { code: "en" },
        components: [
          {
            type: "header",
            parameters: [
              {
                type: "video",
                video: videoHeaderObj
              }
            ]
          },
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: String(videoName || "Dealership Presentation Video").trim()
              }
            ]
          }
        ]
      }
    };
    const res = await axios.post(
      `https://messagingapi.charteredinfo.com/v19.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      payload,
      { headers: { Authorization: `Bearer ${token}` }, timeout: 15000 }
    );
    const messageId = res.data?.messages?.[0]?.id || null;
    return { success: true, messageId, raw: res.data };
  } catch (err) {
    console.error(`[WHATSAPP-VIDEO-TPL] ❌ HTTP ${err?.response?.status || 500} Error:`, err?.response?.data || err?.message);
    return { success: false, messageId: null, error: err?.response?.data || err?.message };
  }
};

// Approved WABA Document Header Template Sender (Supports both uploadWhatsAppMedia ID & URL link)
const sendWhatsAppDocumentTemplate = async (number, docSource, filename, docName = "Dealer Presentation") => {
  try {
    const normalizedPhone = normalizeWhatsAppNumber(number);
    const token = await getWhatsAppAuthToken();
    if (!token) throw new Error("WhatsApp authentication token could not be generated");

    const isUrl = String(docSource).startsWith("http://") || String(docSource).startsWith("https://");
    const docHeaderObj = isUrl
      ? { link: String(docSource), filename: filename || "HR_Setu_Dealer_Presentation.pdf" }
      : { id: String(docSource), filename: filename || "HR_Setu_Dealer_Presentation.pdf" };

    const templateName = "final_docs_1";
    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: normalizedPhone,
      type: "template",
      template: {
        name: templateName,
        language: { code: "en" },
        components: [
          {
            type: "header",
            parameters: [
              {
                type: "document",
                document: docHeaderObj
              }
            ]
          },
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: String(docName || "Dealer Presentation").trim()
              }
            ]
          }
        ]
      }
    };
    const res = await axios.post(
      `https://messagingapi.charteredinfo.com/v19.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      payload,
      { headers: { Authorization: `Bearer ${token}` }, timeout: 15000 }
    );
    const messageId = res.data?.messages?.[0]?.id || null;
    return { success: true, messageId, raw: res.data };
  } catch (err) {
    console.error(`[WHATSAPP-DOC-TPL] ❌ HTTP ${err?.response?.status || 500} Error:`, err?.response?.data || err?.message);
    return { success: false, messageId: null, error: err?.response?.data || err?.message };
  }
};

// Native WhatsApp Document (PDF) Sender (Retained for active 24h customer service session fallback)
const sendWhatsAppNativeDocument = async (number, docUrl, filename, caption = "") => {
  try {
    const normalizedPhone = normalizeWhatsAppNumber(number);
    const token = await getWhatsAppAuthToken();
    if (!token) throw new Error("WhatsApp authentication token could not be generated");

    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: normalizedPhone,
      type: "document",
      document: {
        link: docUrl,
        filename: filename || "Document.pdf",
        caption: caption || "",
      },
    };
    const res = await axios.post(
      `https://messagingapi.charteredinfo.com/v19.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      payload,
      { headers: { Authorization: `Bearer ${token}` }, timeout: 15000 }
    );
    const messageId = res.data?.messages?.[0]?.id || null;
    return { success: true, messageId, raw: res.data };
  } catch (err) {
    console.error(`[WHATSAPP-NATIVE-DOC] ❌ HTTP ${err?.response?.status || 500} Error:`, err?.response?.data || err?.message);
    return { success: false, messageId: null, error: err?.response?.data || err?.message };
  }
};

// Native WhatsApp Video Sender (Retained for active 24h customer service session fallback)
const sendWhatsAppNativeVideo = async (number, videoUrl, caption = "") => {
  try {
    const normalizedPhone = normalizeWhatsAppNumber(number);
    const token = await getWhatsAppAuthToken();
    if (!token) throw new Error("WhatsApp authentication token could not be generated");

    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: normalizedPhone,
      type: "video",
      video: {
        link: videoUrl,
        caption: caption || "",
      },
    };
    const res = await axios.post(
      `https://messagingapi.charteredinfo.com/v19.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      payload,
      { headers: { Authorization: `Bearer ${token}` }, timeout: 15000 }
    );
    const messageId = res.data?.messages?.[0]?.id || null;
    return { success: true, messageId, raw: res.data };
  } catch (err) {
    console.error(`[WHATSAPP-NATIVE-VIDEO] ❌ HTTP ${err?.response?.status || 500} Error:`, err?.response?.data || err?.message);
    return { success: false, messageId: null, error: err?.response?.data || err?.message };
  }
};

// 🎯 2 Calls Per Day + Next-Day Smart Followup Policy Handler
const handleSmartPostCallFollowup = async (activeSeq, leadUtd, rawStatus, callData) => {
  try {
    if (!leadUtd || !activeSeq) return;

    // 1. Fetch current lead state
    const leads = await activeSeq.query(
      `SELECT TOP 1 UTD, ISNULL(status, 0) AS status, ISNULL(Call_Count, 0) AS Call_Count FROM dbo.Meta_Lead_Tbl WHERE UTD = :leadUtd`,
      { replacements: { leadUtd }, type: QueryTypes.SELECT }
    );
    if (!leads || leads.length === 0) return;

    const lead = leads[0];
    const isCompleted = ["completed", "call-transferred", "transferred", "ended"].includes(rawStatus);

    // Check if appointment / demo was set
    const isAppointmentSet = Boolean(callData?.appointment_set || callData?.demo_booked || callData?.variables?.appointment_set);

    if (isAppointmentSet) {
      // SCENARIO C: Demo Booked -> Mark status = 3 (NO MORE AUTOMATIC CALLS EVER!)
      await activeSeq.query(
        `UPDATE dbo.Meta_Lead_Tbl SET Call_Status = 'DEMO_BOOKED', status = 3, Updated_At = GETDATE() WHERE UTD = :leadUtd`,
        { replacements: { leadUtd }, type: QueryTypes.UPDATE }
      );
      // Cancel any pending follow-ups
      await activeSeq.query(
        `UPDATE dbo.Meta_Lead_Followup_Tbl SET Followup_Status = 'CANCELLED', Remark = 'Cancelled due to Demo/Appointment booking' WHERE Meta_Lead_UTD = :leadUtd AND Followup_Status = 'PENDING'`,
        { replacements: { leadUtd }, type: QueryTypes.UPDATE }
      );
      console.log(`[POST-CALL-SCHEDULER] 🎉 Demo/Appointment Booked for Lead #${leadUtd}! Marked status = 3. Automatic calls stopped.`);
      return;
    }

    // 2. Count how many calls were made TODAY and distinct days called
    const callLogsToday = await activeSeq.query(
      `SELECT COUNT(*) AS todayCalls FROM dbo.Meta_Call_Log_Tbl 
       WHERE Meta_Lead_UTD = :leadUtd AND CAST(Created_At AS DATE) = CAST(GETDATE() AS DATE)`,
      { replacements: { leadUtd }, type: QueryTypes.SELECT }
    );
    const todayCalls = Number(callLogsToday?.[0]?.todayCalls || 1);

    const callDaysResult = await activeSeq.query(
      `SELECT COUNT(DISTINCT CAST(Created_At AS DATE)) AS distinctDays FROM dbo.Meta_Call_Log_Tbl 
       WHERE Meta_Lead_UTD = :leadUtd`,
      { replacements: { leadUtd }, type: QueryTypes.SELECT }
    );
    const distinctDays = Number(callDaysResult?.[0]?.distinctDays || 1);

    console.log(`[POST-CALL-SCHEDULER] 📊 Lead #${leadUtd} Status: '${rawStatus}' | Today Calls: ${todayCalls}/2 | Distinct Days: ${distinctDays}/3`);

    // Check if customer gave specific callback date & time
    const cbDateRaw = callData?.callback_date || callData?.variables?.callback_date || null;
    const cbTimeRaw = callData?.callback_time || callData?.variables?.callback_time || null;

    let targetDate = null;
    let targetTime = "11:00:00";
    let purpose = isCompleted ? "Completed Call Followup" : "Unanswered Call Retry";
    let remark = "";

    if (cbDateRaw && cbTimeRaw) {
      // SCENARIO B: Customer explicitly gave a callback time
      targetDate = String(cbDateRaw).trim();
      targetTime = String(cbTimeRaw).trim();
      purpose = "Customer Requested Callback";
      remark = `Customer requested callback on ${targetDate} at ${targetTime}`;
      console.log(`[POST-CALL-SCHEDULER] ⏰ Customer requested callback on ${targetDate} at ${targetTime} for Lead #${leadUtd}`);
    } else if (todayCalls < 2) {
      // ── SCENARIO 1: First call of the day not answered -> Schedule SAME-DAY 2nd Call (2.5 hours later) ──
      const now = new Date();
      const retryTime = new Date(now.getTime() + 150 * 60 * 1000); // 2.5 hours later
      const retryHour = retryTime.getHours();

      if (retryHour >= 19 || retryHour < 9) {
        // If late evening (after 7 PM), schedule for Tomorrow at 11:00 AM
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
        const dd = String(tomorrow.getDate()).padStart(2, "0");
        targetDate = `${yyyy}-${mm}-${dd}`;
        targetTime = "11:00:00";
        remark = `Late evening — Auto scheduled Next-Day 11:00 AM retry`;
        console.log(`[POST-CALL-SCHEDULER] 🌙 Late evening — Scheduling Next Day 11:00 AM for Lead #${leadUtd} (Date: ${targetDate})`);
      } else {
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, "0");
        const dd = String(now.getDate()).padStart(2, "0");
        const hh = String(retryHour).padStart(2, "0");
        const min = String(retryTime.getMinutes()).padStart(2, "0");
        targetDate = `${yyyy}-${mm}-${dd}`;
        targetTime = `${hh}:${min}:00`;
        remark = `Auto scheduled Same-Day 2nd Attempt Retry at ${targetTime}`;
        console.log(`[POST-CALL-SCHEDULER] 🔄 Same-Day 2nd Call Scheduled at ${targetTime} for Lead #${leadUtd}`);
      }
    } else {
      // ── SCENARIO 2: 2 Calls already made today -> Schedule NEXT-DAY 11:00 AM ──
      if (distinctDays >= 3) {
        // 3 Days Limit Reached! Mark status = 9 (EXHAUSTED)
        await activeSeq.query(
          `UPDATE dbo.Meta_Lead_Tbl SET Call_Status = 'EXHAUSTED_3_DAYS', status = 9, Updated_At = GETDATE() WHERE UTD = :leadUtd`,
          { replacements: { leadUtd }, type: QueryTypes.UPDATE }
        );
        console.log(`[POST-CALL-SCHEDULER] 🛑 Max 3 Days Attempt Limit reached for Lead #${leadUtd} (3 Distinct Days Called). Marked status = 9 (EXHAUSTED).`);
        return;
      }

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const yyyy = tomorrow.getFullYear();
      const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
      const dd = String(tomorrow.getDate()).padStart(2, "0");
      targetDate = `${yyyy}-${mm}-${dd}`;
      targetTime = "11:00:00";
      remark = `Auto scheduled Next-Day 11:00 AM retry (Day ${distinctDays + 1} of 3, 2 calls completed today)`;
      console.log(`[POST-CALL-SCHEDULER] 📅 2 Calls completed today — Auto-scheduling Next Day 11:00 AM for Lead #${leadUtd} (Tomorrow: ${targetDate})`);
    }

    // Cancel any previous pending followups to avoid multiple duplicate tasks
    await activeSeq.query(
      `UPDATE dbo.Meta_Lead_Followup_Tbl SET Followup_Status = 'CANCELLED', Remark = 'Superseded by new retry' WHERE Meta_Lead_UTD = :leadUtd AND Followup_Status = 'PENDING'`,
      { replacements: { leadUtd }, type: QueryTypes.UPDATE }
    );

    // Insert follow-up into Meta_Lead_Followup_Tbl
    await activeSeq.query(
      `INSERT INTO dbo.Meta_Lead_Followup_Tbl (
         Meta_Lead_UTD, Followup_Date, Followup_Time, Purpose, Followup_Status, Remark, Created_By, Created_At
       ) VALUES (
         :leadUtd, :targetDate, :targetTime, :purpose, 'PENDING', :remark, 'AUTO_SCHEDULER', GETDATE()
       )`,
      {
        replacements: {
          leadUtd,
          targetDate,
          targetTime,
          purpose,
          remark,
        },
        type: QueryTypes.INSERT
      }
    );

    // Update Meta_Lead_Tbl status to 2 (Active Followup)
    await activeSeq.query(
      `UPDATE dbo.Meta_Lead_Tbl SET Call_Status = UPPER(:rawStatus), status = 2, Updated_At = GETDATE() WHERE UTD = :leadUtd`,
      { replacements: { rawStatus, leadUtd }, type: QueryTypes.UPDATE }
    );

  } catch (err) {
    console.error(`[POST-CALL-SCHEDULER] ❌ Error scheduling for Lead #${leadUtd}:`, err?.message);
  }
};

// Background Call Status Poller for Meta Lead AI Calls
const startMetaCallStatusPoller = (compCode, calleePhoneNumber, campaignId, leadUtd, callId, leadName) => {
  if (!callId || !calleePhoneNumber) return;

  console.log(`[META-CALL-POLLER] 🚀 Started background poller for Call ID: ${callId} | Phone: ${calleePhoneNumber}`);

  let attempts = 0;
  const maxAttempts = 48; // Poll every 5 seconds for up to 4 minutes (48 * 5s = 240s)
  const pollIntervalMs = 5000;

  const INTERMEDIATE_STATUSES = [
    "initiated", "ringing", "queued", "answered", "in-progress",
    "in_progress", "ongoing", "active", "started", "triggered", "created"
  ];
  const COMPLETED_STATUSES = [
    "completed", "call-transferred", "transferred", "ended"
  ];
  const FAILED_TERMINAL_STATUSES = [
    "failed", "busy", "no-answer", "no_answer", "cancelled", "rejected", "unreachable", "invalid"
  ];

  const intervalId = setInterval(async () => {
    attempts++;
    try {
      let callDetails = null;
      let callData = null;
      try {
        callDetails = await getCallStatus(callId);
        callData = callDetails?.data || callDetails;
      } catch (e) {
        console.warn(`[META-CALL-POLLER] Status fetch warning for ${callId}: ${e?.message}`);
      }

      const rawStatus = String(callData?.status || callData?.call_status || "").toLowerCase().trim();

      if (INTERMEDIATE_STATUSES.includes(rawStatus) || !rawStatus) {
        console.log(`[META-CALL-POLLER] Status: ${rawStatus || 'pending'} | Waiting...`);
        if (attempts >= maxAttempts) {
          console.log(`[META-CALL-POLLER] ⏱️ Max polling attempts reached (${maxAttempts}) for ${callId}`);
          clearInterval(intervalId);
        }
        return;
      }

      if (FAILED_TERMINAL_STATUSES.includes(rawStatus)) {
        console.log(`[META-CALL-POLLER] 🛑 Call status = ${rawStatus}`);
        console.log(`[POST-CALL-WHATSAPP] ⏭️ Skipped because call was not completed`);
        clearInterval(intervalId);
        if (leadUtd) {
          try {
            const activeSeq = await dbname('', getDealerId(compCode));
            if (activeSeq) {
              await handleSmartPostCallFollowup(activeSeq, leadUtd, rawStatus, callData);
            }
          } catch (_) {}
        }
        return;
      }

      if (COMPLETED_STATUSES.includes(rawStatus)) {
        console.log(`[META-CALL-POLLER] 🏁 Status: completed | Terminal status 'completed' reached for Call ID: ${callId}`);
        clearInterval(intervalId);
        if (leadUtd) {
          try {
            const activeSeq = await dbname('', getDealerId(compCode));
            if (activeSeq) {
              await handleSmartPostCallFollowup(activeSeq, leadUtd, rawStatus, callData);
            }
          } catch (_) {}
        }

        // Dispatch WhatsApp Package ONCE AND ONLY ONCE upon call completion!
        await sendPostCallWhatsAppPackage({
          calleePhoneNumber: calleePhoneNumber,
          campaignId: campaignId,
          compCode: compCode,
          customerName: leadName || "Valued Customer",
          callId: callId,
          leadUtd: leadUtd,
        });
      } else {
        if (attempts >= maxAttempts) {
          clearInterval(intervalId);
        }
      }

    } catch (err) {
      console.error(`[META-CALL-POLLER] Error polling ${callId}:`, err?.message);
      if (attempts >= maxAttempts) {
        clearInterval(intervalId);
      }
    }
  }, pollIntervalMs);
};

// Helper: Send Post-Call WhatsApp Package (Text, PDF Document, Video) directly to customer WhatsApp
const sendPostCallWhatsAppPackage = async ({ calleePhoneNumber, campaignId, compCode, campaignData = null, customerName = "Valued Customer", callId = null, leadUtd = null, reqSequelize = null }) => {
  try {
    if (!calleePhoneNumber) return;

    // Idempotency Protection 1: In-Memory Call ID state check
    if (callId) {
      const currentState = whatsappDispatchState.get(callId);
      if (currentState === "SENT" || currentState === "PROCESSING") {
        console.log(`[POST-CALL-WHATSAPP] Checking duplicate guard...`);
        console.log(`[POST-CALL-WHATSAPP] ⏭️ Already ${currentState} for Call ID: ${callId}. Skipping duplicate dispatch.`);
        return;
      }
      whatsappDispatchState.set(callId, "PROCESSING");
    }

    const dlrCode = getDealerId(compCode);

    // Normalized WhatsApp Phone Number
    const normalizedPhone = normalizeWhatsAppNumber(calleePhoneNumber);
    const digits = normalizedPhone.slice(-10);
    if (digits.length !== 10) {
      console.error(`[POST-CALL-WHATSAPP] Invalid customer phone number: ${calleePhoneNumber}`);
      if (callId) whatsappDispatchState.set(callId, "FAILED");
      return;
    }

    // 🛡️ Persistent Database Duplicate Guard:
    if (leadUtd) {
      try {
        const activeSeq = reqSequelize || await dbname('', dlrCode);
        if (activeSeq) {
          const pastSent = await activeSeq.query(
            `SELECT TOP 1 UTD FROM dbo.Meta_Lead_Activity_Tbl
             WHERE Activity_Type = 'WHATSAPP_SENT'
               AND (Meta_Lead_UTD = :leadUtd)`,
            {
              replacements: {
                leadUtd: leadUtd || 0,
              },
              type: QueryTypes.SELECT
            }
          );
          if (pastSent && pastSent.length > 0) {
            console.log(`[POST-CALL-WHATSAPP] ⏭️ Lead #${leadUtd} / Phone ${digits} ALREADY received WhatsApp package previously in DB. Skipping duplicate dispatch.`);
            if (callId) whatsappDispatchState.set(callId, "SENT");
            return { success: true, skipped: true, reason: "ALREADY_SENT_TO_THIS_NUMBER" };
          }
        }
      } catch (dbCheckErr) {
        console.warn("[POST-CALL-WHATSAPP] DB Duplicate check warning:", dbCheckErr?.message);
      }
    }

    let camp = campaignData;
    if (!camp && campaignId) {
      try {
        const activeSeq = reqSequelize || await dbname('', dlrCode);
        if (activeSeq) {
          const campResult = await activeSeq.query(
            `SELECT TOP 1 UTD, Campaign_Id, Campaign_Name, Message_Text, Document_URL, Video_URL FROM dbo.Meta_Callmatic_Campaign_Tbl WHERE Campaign_Id = :campaignId OR UTD = TRY_CAST(:campaignId AS INT) ORDER BY UTD DESC`,
            { replacements: { campaignId: String(campaignId) }, type: QueryTypes.SELECT }
          );
          if (campResult && campResult.length > 0) {
            camp = campResult[0];
          }
        }
      } catch (dbErr) {
        console.warn("[POST-CALL-WHATSAPP] DB Query warning:", dbErr?.message);
      }
    }

    if (!camp) {
      console.warn(`[POST-CALL-WHATSAPP] Campaign not found for Campaign ID: ${campaignId}`);
      if (callId) whatsappDispatchState.set(callId, "FAILED");
      return;
    }

    const messageText = camp.Message_Text?.trim() || null;
    const documentUrl = camp.Document_URL || camp.Document_Url || null;
    const videoUrl = camp.Video_URL || camp.Video_Url || null;

    const fullDocUrl = buildPublicMediaUrl(documentUrl);
    const fullVidUrl = buildPublicMediaUrl(videoUrl);

    console.log(`[POST-CALL-WHATSAPP] Campaign found: ${camp.Campaign_Name || camp.Campaign_Id || campaignId}`);
    console.log(`[POST-CALL-WHATSAPP] Recipient: ${normalizedPhone}`);

    let textSent = false;
    let videoSent = false;
    let docSent = false;
    let textMsgId = null;
    let vidMsgId = null;
    let docMsgId = null;

    // ══════════════════════════════════════════════════════════════
    // STEP 1: Upload media files to Meta's servers FIRST
    // (Meta can't download from erp.autovyn.com — firewall blocks it)
    // ══════════════════════════════════════════════════════════════
    let pdfMediaId = null;
    let vidMediaId = null;

    if (documentUrl) {
      console.log(`[POST-CALL-WHATSAPP] Uploading PDF to Meta...`);
      const pdfUpload = await uploadMediaToMeta(documentUrl, "application/pdf");
      if (pdfUpload?.success) {
        pdfMediaId = pdfUpload.mediaId;
        console.log(`[POST-CALL-WHATSAPP] ✅ PDF uploaded | Media ID: ${pdfMediaId}`);
      } else {
        console.error(`[POST-CALL-WHATSAPP] ❌ PDF upload failed: ${pdfUpload?.error}`);
      }
    }

    if (videoUrl) {
      console.log(`[POST-CALL-WHATSAPP] Uploading Video to Meta...`);
      const vidUpload = await uploadMediaToMeta(videoUrl, "video/mp4");
      if (vidUpload?.success) {
        vidMediaId = vidUpload.mediaId;
        console.log(`[POST-CALL-WHATSAPP] ✅ Video uploaded | Media ID: ${vidMediaId}`);
      } else {
        console.error(`[POST-CALL-WHATSAPP] ❌ Video upload failed: ${vidUpload?.error}`);
      }
    }

    // ══════════════════════════════════════════════════════════════
    // STEP 2: Send messages in order: 1. Video -> 2. PDF -> 3. Text
    // ══════════════════════════════════════════════════════════════

    // ── MESSAGE 1: VIDEO TEMPLATE (with uploaded Media ID) ──
    if (vidMediaId || videoUrl) {
      try {
        const videoSource = vidMediaId || fullVidUrl;
        const videoDisplayName = camp.Campaign_Name ? `${camp.Campaign_Name} Presentation Video` : "Dealership Presentation Video";
        console.log(`[POST-CALL-WHATSAPP] 1/3 Sending video template (Media ID/URL: ${videoSource}, Video: ${videoDisplayName})...`);
        const vidResult = await sendWhatsAppVideoTemplate(digits, videoSource, videoDisplayName);
        if (vidResult?.success) {
          videoSent = true;
          vidMsgId = vidResult.messageId;
          console.log(`[WHATSAPP-VIDEO] ✅ Accepted | Message ID: ${vidResult.messageId}`);
        } else {
          console.error(`[WHATSAPP-VIDEO] ❌ Video Template Failed:`, JSON.stringify(vidResult?.error));
          // Fallback to native video
          console.log(`[POST-CALL-WHATSAPP] Attempting fallback native video send...`);
          const nativeRes = await sendWhatsAppNativeVideo(digits, fullVidUrl || videoUrl, `${camp.Campaign_Name}`);
          if (nativeRes?.success) {
            videoSent = true;
            vidMsgId = nativeRes.messageId;
            console.log(`[WHATSAPP-VIDEO-NATIVE] ✅ Fallback Accepted | Message ID: ${vidMsgId}`);
          }
        }
      } catch (vidErr) {
        console.error(`[WHATSAPP-VIDEO] ❌ Error:`, vidErr?.response?.data || vidErr?.message);
      }
    }

    // 5-second gap if video was sent and (PDF or Text follows)
    if (vidMediaId && (pdfMediaId || messageText)) await new Promise((r) => setTimeout(r, 5000));

    // ── MESSAGE 2: DOCUMENT TEMPLATE (with uploaded Media ID) ──
    if (pdfMediaId) {
      try {
        let docFileName = String(documentUrl).split("/").pop().split("\\").pop();
        try { docFileName = decodeURIComponent(docFileName); } catch (_) {}
        docFileName = docFileName.replace(/%20/g, "_").replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_\-\.]/g, "");
        if (docFileName.toLowerCase().endsWith(".pptx.pdf")) {
          docFileName = docFileName.substring(0, docFileName.length - 9) + ".pdf";
        }
        if (!docFileName.toLowerCase().endsWith(".pdf")) docFileName += ".pdf";
        if (!docFileName || docFileName === ".pdf" || docFileName.startsWith("campaign_media_") || docFileName === "Campaign_Document.pdf" || docFileName === "hr_setu_presentation.pdf") {
          docFileName = `${(camp.Campaign_Name || "HR_Setu").replace(/\s+/g, "_")}_Dealer_Presentation.pdf`;
        }

        const docDisplayName = `${(camp.Campaign_Name || "HR Setu").replace(/_/g, " ")} Presentation`;
        console.log(`[POST-CALL-WHATSAPP] 2/3 Sending document template (Media ID: ${pdfMediaId}, Filename: ${docFileName}, Doc: ${docDisplayName})...`);
        const docResult = await sendWhatsAppDocumentTemplate(digits, pdfMediaId, docFileName, docDisplayName);
        if (docResult?.success) {
          docSent = true;
          docMsgId = docResult.messageId;
          console.log(`[WHATSAPP-DOCUMENT] ✅ Accepted | Message ID: ${docResult.messageId}`);
        } else {
          console.error(`[WHATSAPP-DOCUMENT] ❌ Failed | Error: ${JSON.stringify(docResult?.error)}`);
        }
      } catch (docErr) {
        console.error(`[WHATSAPP-DOCUMENT] ❌ Error:`, docErr?.message);
      }
    }

    // 5-second gap if PDF was sent and Text follows
    if (pdfMediaId && messageText) await new Promise((r) => setTimeout(r, 5000));

    // ── MESSAGE 3: TEXT TEMPLATE ──
    if (messageText) {
      try {
        console.log(`[POST-CALL-WHATSAPP] 3/3 Sending text template...`);
        const custNameParam = String(customerName || "Valued Customer").trim();
        const cleanTemplateText = String(messageText || "")
          .replace(/[\r\n]+/g, " | ")
          .replace(/\s{2,}/g, " ")
          .trim();
        const safeText = cleanTemplateText.length > 950 ? cleanTemplateText.substring(0, 947) + "..." : cleanTemplateText;

        const textResult = await sendWhatsAppTextTemplate(digits, custNameParam, safeText);
        if (textResult?.success) {
          textSent = true;
          textMsgId = textResult.messageId;
          console.log(`[WHATSAPP-TEXT] ✅ Accepted | Message ID: ${textResult.messageId}`);
        } else {
          console.error(`[WHATSAPP-TEXT] ❌ Failed | Error: ${JSON.stringify(textResult?.error)}`);
        }
      } catch (tplErr) {
        console.error(`[WHATSAPP-TEXT] ❌ Error:`, tplErr?.message);
      }
    }

    if (callId) {
      whatsappDispatchState.set(callId, "SENT");
    }

    // 📝 Persistent Activity Log in DB to guarantee duplicate prevention forever
    if (textSent || docSent || videoSent) {
      try {
        const activeSeq = reqSequelize || await dbname('', dlrCode);
        if (activeSeq && leadUtd) {
          await activeSeq.query(
            `INSERT INTO dbo.Meta_Lead_Activity_Tbl (
               Meta_Lead_UTD, Activity_Type, Activity_Status, Remark, Message_Id, Activity_Date, Created_By, Created_At
             ) VALUES (
               :leadUtd, 'WHATSAPP_SENT', 'COMPLETED', :remark, :msgId, GETDATE(), 'AUTO_WHATSAPP', GETDATE()
             )`,
            {
              replacements: {
                leadUtd,
                remark: `Post-Call WhatsApp Package (Video, PDF Presentation, Text) delivered to ${digits}`,
                msgId: vidMsgId || docMsgId || textMsgId || ""
              },
              type: QueryTypes.INSERT
            }
          );
          console.log(`[POST-CALL-WHATSAPP] 📝 Recorded WHATSAPP_SENT in Meta_Lead_Activity_Tbl for Lead #${leadUtd}`);
        }
      } catch (logErr) {
        console.warn("[POST-CALL-WHATSAPP] Activity log error:", logErr?.message);
      }
    }

    console.log(`[POST-CALL-WHATSAPP] ✅ PACKAGE ACCEPTED BY PROVIDER (Video: ${videoSent ? 'ACCEPTED' : 'SKIPPED'}, Doc: ${docSent ? 'ACCEPTED' : 'SKIPPED'}, Text: ${textSent ? 'ACCEPTED' : 'SKIPPED'})`);

    return {
      text: { accepted: textSent, messageId: textMsgId, deliveryStatus: "PENDING" },
      video: { accepted: videoSent, messageId: vidMsgId, deliveryStatus: "PENDING" },
      document: { accepted: docSent, messageId: docMsgId, deliveryStatus: "PENDING" }
    };

  } catch (pkgErr) {
    if (callId) whatsappDispatchState.set(callId, "FAILED");
    console.error(`[POST-CALL-WHATSAPP] ❌ Package dispatch error:`, pkgErr?.message);
    return { error: pkgErr?.message };
  }
};

// Diagnostic test endpoint for WhatsApp package dispatches
const testCampaignWhatsAppPackage = async (req, res) => {
  try {
    const { phone, campaignId, compCode } = req.body || req.query || {};
    if (!phone) {
      return res.status(400).json({ success: false, message: "phone parameter is required" });
    }
    const result = await sendPostCallWhatsAppPackage({
      calleePhoneNumber: phone,
      campaignId: campaignId || 1,
      compCode: compCode || "1",
      customerName: "Diagnostic Test User"
    });
    return res.status(200).json({
      success: true,
      message: "Diagnostic campaign package test executed",
      result
    });
  } catch (err) {
    console.error("[DIAGNOSTIC-TEST] Error:", err?.message);
    return res.status(500).json({ success: false, error: err?.message });
  }
};

exports.testCampaignWhatsAppPackage = testCampaignWhatsAppPackage;

// ============================================================
// TRIGGER CALLMATIC AI CALL FOR A META LEAD
// POST /meta/triggerLeadCall, POST /makeMetaCall
// ============================================================
const triggerLeadCall = async function (req, res) {
  let sequelize = null;
  try {
    const compCode = String(
      req.headers.compcode ||
      req.body?.compcode ||
      req.query?.compcode ||
      process.env.META_COMP_CODE ||
      ""
    ).trim();

    if (!compCode) {
      return res.status(400).json({
        success: false,
        message: "Company code (compcode) is required.",
      });
    }

    sequelize = await dbname(req, compCode);
    if (!sequelize) {
      return res.status(500).json({
        success: false,
        message: "Database connection could not be established.",
      });
    }

    const body = req.body || {};
    const metaLeadUtd = Number(body.metaLeadUtd || body.meta_lead_utd || body.UTD);

    if (!metaLeadUtd || isNaN(metaLeadUtd)) {
      return res.status(400).json({
        success: false,
        message: "Valid Meta lead UTD (metaLeadUtd) is required.",
      });
    }

    // 1. Fetch Lead Details from Meta_Lead_Tbl
    const leadSql = `
      SELECT TOP 1 UTD, Meta_Lead_Id, Full_Name, Phone_Number, Form_Id, Page_Id, Company_Name, status
      FROM Meta_Lead_Tbl
      WHERE UTD = :metaLeadUtd
    `;
    const leadResult = await sequelize.query(leadSql, {
      replacements: { metaLeadUtd },
      type: QueryTypes.SELECT,
    });

    if (!leadResult || leadResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Meta lead with UTD '${metaLeadUtd}' not found or inactive.`,
      });
    }

    const lead = leadResult[0];
    const rawLeadPhone = String(lead.Phone_Number || "").trim();
    const calleePhoneNumber = rawLeadPhone;
    console.log(`[TRIGGER-CALL] 🚀 Live Lead Call Target: ${calleePhoneNumber} (Lead #${metaLeadUtd} - ${lead.Full_Name || "Customer"})`);

    if (!calleePhoneNumber || !String(calleePhoneNumber).trim()) {
      return res.status(400).json({
        success: false,
        message: `Phone number is missing for Meta lead UTD '${metaLeadUtd}'.`,
      });
    }

    // 2. Fetch Active Callmatic Campaign Configuration from Meta_Callmatic_Campaign_Tbl based on lead's Form_Id
    let campaignId = body.campaign_id || body.Campaign_Id || null;
    let campaignName = body.campaign_name || body.Campaign_Name || null;
    let metaFormId = body.meta_form_id || body.Meta_Form_Id || lead.Form_Id || null;
    let metaFormName = body.meta_form_name || body.Meta_Form_Name || null;
    let campaignTransferNumber = null;

    let campResult = [];

    // Priority 1: Match active campaign by Lead's exact Meta_Form_Id
    if (lead.Form_Id) {
      const formMatchQuery = `
        SELECT TOP 1 Campaign_Id, Campaign_Name, Meta_Form_Id, Meta_Form_Name, Sales_Executive_Number, Document_URL, Video_URL, Message_Text
        FROM Meta_Callmatic_Campaign_Tbl
        WHERE Is_Active = 1 AND Meta_Form_Id = :formId
        ORDER BY UTD DESC
      `;
      campResult = await sequelize.query(formMatchQuery, {
        replacements: { formId: String(lead.Form_Id).trim() },
        type: QueryTypes.SELECT,
      });
      if (campResult && campResult.length > 0) {
        console.log(`[TRIGGER-CALL] Matched active campaign by Meta_Form_Id (${lead.Form_Id}): ${campResult[0].Campaign_Id}`);
      }
    }

    // Priority 2: Match by direct campaign_id if passed in request body
    if ((!campResult || campResult.length === 0) && campaignId) {
      const idMatchQuery = `
        SELECT TOP 1 Campaign_Id, Campaign_Name, Meta_Form_Id, Meta_Form_Name, Sales_Executive_Number, Document_URL, Video_URL, Message_Text
        FROM Meta_Callmatic_Campaign_Tbl
        WHERE Is_Active = 1 AND Campaign_Id = :campaignId
        ORDER BY UTD DESC
      `;
      campResult = await sequelize.query(idMatchQuery, {
        replacements: { campaignId },
        type: QueryTypes.SELECT,
      });
    }

    // Priority 3: Fallback to latest Active Campaign from Meta_Callmatic_Campaign_Tbl if no form match
    if (!campResult || campResult.length === 0) {
      const fallbackQuery = `
        SELECT TOP 1 Campaign_Id, Campaign_Name, Meta_Form_Id, Meta_Form_Name, Sales_Executive_Number, Document_URL, Video_URL, Message_Text
        FROM Meta_Callmatic_Campaign_Tbl
        WHERE Is_Active = 1
        ORDER BY UTD DESC
      `;
      campResult = await sequelize.query(fallbackQuery, {
        type: QueryTypes.SELECT,
      });
    }

    if (campResult && campResult.length > 0) {
      const camp = campResult[0];
      campaignId = camp.Campaign_Id;
      campaignName = camp.Campaign_Name || campaignName;
      metaFormId = camp.Meta_Form_Id || metaFormId;
      metaFormName = camp.Meta_Form_Name || metaFormName;
      campaignTransferNumber = camp.Sales_Executive_Number || camp.Transfer_Number || null;
    }

    if (!campaignId) {
      return res.status(400).json({
        success: false,
        message: lead.Form_Id
          ? `No active campaign found in Meta_Callmatic_Campaign_Tbl matching Form_Id '${lead.Form_Id}'. Please create or activate a campaign for this Form ID.`
          : "No active Callmatic campaign found in Meta_Callmatic_Campaign_Tbl table. Please create or activate a campaign first.",
      });
    }

    // 3. Construct call variables with defaults for company_name & transferNumber
    const companyName = body.company_name || body.companyName || lead.Company_Name;
    const transferNumber = campaignTransferNumber || body.transfer_number || body.transferNumber || process.env.META_TRANSFER_NUMBER || "9876543210";
    const calleeName = lead.Full_Name || "Customer";

    const variables = {
      company_name: companyName,
      callee_phone_number: calleePhoneNumber,
      callee_name: calleeName,
      transferNumber: transferNumber,
    };

    // 4. Trigger Single Callmatic AI Call
    let callResult;
    try {
      // Clean phone number format
      let formattedPhone = String(calleePhoneNumber).trim().replace(/[^\d+]/g, "");
      if (formattedPhone.startsWith("0")) formattedPhone = formattedPhone.substring(1);
      if (formattedPhone.length === 10) formattedPhone = `+91${formattedPhone}`;
      else if (formattedPhone.length === 12 && formattedPhone.startsWith("91")) formattedPhone = `+${formattedPhone}`;

      callResult = await triggerSingleCall(formattedPhone, variables, campaignId);
    } catch (callErr) {
      const apiErrDetail = callErr?.response?.data?.message || callErr?.response?.data?.error || callErr?.message;
      console.error("Callmatic AI Call Error:", callErr?.response?.data || callErr?.message);
      return res.status(500).json({
        success: false,
        message: apiErrDetail ? `Callmatic API: ${apiErrDetail}` : "Failed to trigger Callmatic AI call",
        error: callErr?.response?.data || callErr?.message,
      });
    }

    const callId = callResult?.callId || callResult?.id || callResult?.data?.callId || null;

    // 5. Insert Log Record into Meta_Call_Log_Tbl (system-versioned temporal table)
    let logInserted = false;
    try {
      const insertLogSql = `
        INSERT INTO Meta_Call_Log_Tbl (
          Meta_Lead_UTD,
          Meta_Lead_Id,
          Call_Id,
          Call_Type,
          Call_Source,
          Campaign_Id,
          Campaign_Name,
          Meta_Form_Id,
          Meta_Form_Name,
          Phone_Number,
          Created_By,
          Created_At
        ) VALUES (
          :metaLeadUtd,
          :metaLeadId,
          :callId,
          :callType,
          :callSource,
          :campaignId,
          :campaignName,
          :metaFormId,
          :metaFormName,
          :phoneNumber,
          :createdBy,
          GETDATE()
        )
      `;

      await sequelize.query(insertLogSql, {
        replacements: {
          metaLeadUtd: lead.UTD,
          metaLeadId: lead.Meta_Lead_Id || null,
          callId: callId || null,
          callType: body.call_type || body.callType || "MANUAL_AI_CALL",
          callSource: body.call_source || body.callSource || "META_LEAD",
          campaignId: campaignId || null,
          campaignName: campaignName || null,
          metaFormId: metaFormId || null,
          metaFormName: metaFormName || null,
          phoneNumber: calleePhoneNumber,
          createdBy: body.created_by || body.createdBy || "ADMIN",
        },
        type: QueryTypes.INSERT,
      });
      logInserted = true;
    } catch (logErr) {
      console.error("Meta_Call_Log_Tbl Insert Error (Non-critical):", logErr?.message);
    }

    // 6. Log Activity in Meta_Lead_Activity_Tbl
    try {
      const insertActivitySql = `
        INSERT INTO Meta_Lead_Activity_Tbl (
          Meta_Lead_UTD,
          Activity_Type,
          Title,
          Description,
          Created_By,
          Created_At
        ) VALUES (
          :metaLeadUtd,
          'CALL_INITIATED',
          'AI Call Initiated',
          :desc,
          :createdBy,
          GETDATE()
        )
      `;
      await sequelize.query(insertActivitySql, {
        replacements: {
          metaLeadUtd: lead.UTD,
          desc: `Callmatic AI Call triggered to ${calleePhoneNumber}. Call ID: ${callId || "N/A"}`,
          createdBy: body.created_by || body.createdBy || "ADMIN",
        },
        type: QueryTypes.INSERT,
      });
    } catch (actErr) {
      console.error("Activity log insert error (Non-critical):", actErr?.message);
    }

    // 7. Start Call Status Poller (Triggers WhatsApp ONLY when call completes)
    try {
      if (callId) {
        startMetaCallStatusPoller(
          compCode,
          calleePhoneNumber,
          campaignId,
          lead.UTD,
          callId,
          lead?.Full_Name || lead?.Name || "Customer"
        );
      }
    } catch (waDispatchErr) {
      console.error("[TRIGGER-CALL] Call Status Poller Start Error:", waDispatchErr?.message);
    }

    return res.status(200).json({
      success: true,
      message: "Meta Lead AI Call Triggered Successfully",
      data: callResult,
      callId: callId,
      variables: variables,
      logInserted: logInserted,
      lead: {
        UTD: lead.UTD,
        Meta_Lead_Id: lead.Meta_Lead_Id,
        Full_Name: lead.Full_Name,
        Phone_Number: calleePhoneNumber,
      },
    });

  } catch (error) {
    console.error("Make Meta Call Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to trigger Meta call",
      error: error.original?.message || error.message,
    });
  } finally {
    if (sequelize) {
      try {
        await sequelize.close();
      } catch (err) { }
    }
  }
};

exports.triggerLeadCall = triggerLeadCall;
exports.makeMetaCall = triggerLeadCall;
exports.triggerMetaCall = triggerLeadCall;
exports.sendPostCallWhatsAppPackage = sendPostCallWhatsAppPackage;

// ============================================================
// GET META CALL LOGS
// GET /getMetaCallLogs, POST /getMetaCallLogs
// ============================================================
exports.getMetaCallLogs = async function (req, res) {
  let sequelize;

  try {
    const compcode = req.headers.compcode;
    if (!compcode) {
      return res.status(400).json({
        success: false,
        message: "Header 'compcode' is missing",
      });
    }

    sequelize = await dbname(req, compcode);

    const body = { ...req.query, ...req.body };
    const metaLeadUtd = body.meta_lead_utd || body.Meta_Lead_UTD || body.leadUtd;

    let sql = `
      SELECT 
        l.UTD,
        l.Meta_Lead_UTD,
        l.Meta_Lead_Id,
        l.Call_Id,
        l.Call_Type,
        l.Call_Source,
        l.Campaign_Id,
        l.Campaign_Name,
        l.Meta_Form_Id,
        l.Meta_Form_Name,
        l.Phone_Number,
        l.Created_By,
        l.Created_At,
        ml.Full_Name
      FROM Meta_Call_Log_Tbl l
      LEFT JOIN Meta_Lead_Tbl ml ON l.Meta_Lead_UTD = ml.UTD
    `;
    const replacements = {};

    if (metaLeadUtd) {
      sql += ` WHERE l.Meta_Lead_UTD = :metaLeadUtd`;
      replacements.metaLeadUtd = Number(metaLeadUtd);
    }

    sql += ` ORDER BY l.UTD DESC`;

    const logs = await sequelize.query(sql, {
      replacements,
      type: QueryTypes.SELECT,
    });

    return res.status(200).json({
      success: true,
      data: logs || [],
    });
  } catch (error) {
    console.error("Get Meta Call Logs Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch Meta call logs",
      error: error.original?.message || error.message,
    });
  } finally {
    if (sequelize) {
      try {
        await sequelize.close();
      } catch (err) { }
    }
  }
};

/**
 * Extract Schedule Date & Time from AI Call Summary / Transcript Text
 */
const extractScheduleFromText = (summaryText = "", transcriptArr = []) => {
  const fullText = (
    String(summaryText) + " " +
    (Array.isArray(transcriptArr) ? transcriptArr.map(t => typeof t === "string" ? t : (t.text || t.content || t.message || "")).join(" ") : "")
  ).toLowerCase();

  let targetDate = new Date();
  let timeStr = "11:00";
  let hasSpecificSchedule = false;

  // Relative Date Phrases
  if (fullText.includes("day after tomorrow") || fullText.includes("parso")) {
    targetDate.setDate(targetDate.getDate() + 2);
    hasSpecificSchedule = true;
  } else if (fullText.includes("tomorrow") || fullText.includes("kal") || fullText.includes("next day")) {
    targetDate.setDate(targetDate.getDate() + 1);
    hasSpecificSchedule = true;
  } else if (/\b(after|in)\s+(\d+)\s+days?\b/.test(fullText)) {
    const match = fullText.match(/\b(after|in)\s+(\d+)\s+days?\b/);
    if (match && match[2]) {
      targetDate.setDate(targetDate.getDate() + parseInt(match[2], 10));
      hasSpecificSchedule = true;
    }
  } else if (/\b(\d+)\s+din\s+baad\b/.test(fullText)) {
    const match = fullText.match(/\b(\d+)\s+din\s+baad\b/);
    if (match && match[1]) {
      targetDate.setDate(targetDate.getDate() + parseInt(match[1], 10));
      hasSpecificSchedule = true;
    }
  }

  // Explicit Date YYYY-MM-DD or DD/MM/YYYY or DD-MM-YYYY
  const dateMatch = fullText.match(/\b(\d{4}[-/]\d{1,2}[-/]\d{1,2})\b/) || fullText.match(/\b(\d{1,2}[-/]\d{1,2}[-/]\d{4})\b/);
  if (dateMatch) {
    try {
      const parts = dateMatch[1].split(/[-/]/);
      let parsed;
      if (parts[0].length === 4) {
        parsed = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      } else {
        parsed = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
      }
      if (!isNaN(parsed.getTime()) && parsed >= new Date(new Date().setHours(0, 0, 0, 0))) {
        targetDate = parsed;
        hasSpecificSchedule = true;
      }
    } catch (_) {}
  }

  // Explicit Time
  const timeMatch = fullText.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/) || fullText.match(/\b(\d{1,2})\s*ba?je\b/);
  if (timeMatch) {
    let hour = parseInt(timeMatch[1], 10);
    let min = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
    const ampm = timeMatch[3];
    if (ampm === "pm" && hour < 12) hour += 12;
    if (ampm === "am" && hour === 12) hour = 0;
    timeStr = `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
    hasSpecificSchedule = true;
  }

  const yyyy = targetDate.getFullYear();
  const mm = String(targetDate.getMonth() + 1).padStart(2, "0");
  const dd = String(targetDate.getDate()).padStart(2, "0");
  const formattedDate = `${yyyy}-${mm}-${dd}`;

  return {
    hasSpecificSchedule,
    date: formattedDate,
    time: timeStr
  };
};

/**
 * Log AI Call Summary Activity, Extract Followup Date/Time, & Implement 3-Day Retry Rule
 */
const syncAiCallSummaryAndFollowup = async (sequelize, metaLeadUtd, callId, summaryText, callStatus = "COMPLETED", durationSec = 0, transcriptArr = []) => {
  if (!sequelize || !metaLeadUtd) return;

  try {
    const cleanSummary = summaryText ? String(summaryText).trim() : "";
    const statusStr = String(callStatus || "COMPLETED").toUpperCase();
    const effectiveSummary = cleanSummary || `Callmatic AI Call (${statusStr}${durationSec ? `, ${durationSec}s` : ""}).`;
    const isUnansweredOrFailed = ["NO_ANSWER", "BUSY", "FAILED", "UNANSWERED", "NO-RESPONSE", "REJECTED"].includes(statusStr) || Number(durationSec) === 0;

    // 1. Check if AI_CALL_SUMMARY activity already logged for this callId or summary
    const replacements = {
      metaLeadUtd,
      callId: String(callId || ""),
      summaryPattern: cleanSummary ? `%${cleanSummary.substring(0, 30)}%` : "%Callmatic AI Call%",
    };

    let checkQuery = `
      SELECT TOP 1 UTD FROM Meta_Lead_Activity_Tbl 
      WHERE Meta_Lead_UTD = :metaLeadUtd 
        AND (Activity_Type = 'AI_CALL_SUMMARY' OR Activity_Type = 'AI_CALL')
    `;

    if (callId) {
      checkQuery += ` AND (Message_Id = :callId OR Remark LIKE :summaryPattern)`;
    } else {
      checkQuery += ` AND Remark LIKE :summaryPattern`;
    }

    const existingActivity = await sequelize.query(checkQuery, {
      replacements,
      type: QueryTypes.SELECT,
    });

    if (!existingActivity || existingActivity.length === 0) {
      // Insert Activity Log into Meta_Lead_Activity_Tbl
      await sequelize.query(
        `INSERT INTO Meta_Lead_Activity_Tbl (
          Meta_Lead_UTD,
          Activity_Type,
          Activity_Status,
          Call_Result,
          Call_Duration_Seconds,
          Message_Id,
          Remark,
          Activity_Date,
          Created_By,
          Created_Name,
          Created_At
        ) VALUES (
          :metaLeadUtd,
          'AI_CALL_SUMMARY',
          'COMPLETED',
          :callResult,
          :callDuration,
          :callId,
          :remark,
          GETDATE(),
          'CALLMATIC_AI',
          'Callmatic AI Agent',
          GETDATE()
        )`,
        {
          replacements: {
            metaLeadUtd,
            callResult: statusStr,
            callDuration: Number(durationSec) || 0,
            callId: String(callId || ""),
            remark: `🤖 AI Call Summary: ${effectiveSummary}`,
          },
          type: QueryTypes.INSERT,
        }
      );
      console.log(`[AI-SUMMARY-LOG] Inserted AI Call Summary activity for Lead #${metaLeadUtd}`);

      // Extract scheduled date & time from text / transcript
      const scheduleInfo = extractScheduleFromText(effectiveSummary, transcriptArr);

      // Check distinct call attempt count / days for this lead
      const countRes = await sequelize.query(
        `SELECT COUNT(DISTINCT CAST(Created_At AS DATE)) AS Distinct_Days_Count, COUNT(*) AS Total_Calls 
         FROM Meta_Call_Log_Tbl WHERE Meta_Lead_UTD = :metaLeadUtd`,
        { replacements: { metaLeadUtd }, type: QueryTypes.SELECT }
      );

      const distinctDays = Number(countRes?.[0]?.Distinct_Days_Count || countRes?.[0]?.distinct_days_count || 1);
      const totalCalls = Number(countRes?.[0]?.Total_Calls || countRes?.[0]?.total_calls || 1);

      // ── 3-DAY RETRY SEQUENCE LOGIC ─────────────────────────────
      if (isUnansweredOrFailed) {
        if (distinctDays >= 3 || totalCalls >= 3) {
          // Total 3 days or 3 attempts reached without answer — STOP ALL CALLS
          console.log(`[3-DAY-RETRY-RULE] Lead #${metaLeadUtd} reached ${distinctDays} days / ${totalCalls} calls without response. Marking EXHAUSTED & stopping calls.`);
          
          await sequelize.query(
            `UPDATE Meta_Lead_Tbl SET status = 3, Updated_At = GETDATE() WHERE UTD = :metaLeadUtd`,
            { replacements: { metaLeadUtd }, type: QueryTypes.UPDATE }
          );

          await sequelize.query(
            `UPDATE Meta_Lead_Followup_Tbl SET Followup_Status = 'CANCELLED' WHERE Meta_Lead_UTD = :metaLeadUtd AND Followup_Status = 'PENDING'`,
            { replacements: { metaLeadUtd }, type: QueryTypes.UPDATE }
          );

          await sequelize.query(
            `INSERT INTO Meta_Lead_Activity_Tbl (
              Meta_Lead_UTD, Activity_Type, Activity_Status, Remark, Activity_Date, Created_By, Created_Name, Created_At
            ) VALUES (
              :metaLeadUtd, '3_DAY_EXHAUSTED', 'COMPLETED', '3-Day Retry Sequence Completed: No answer after 3 days. Automated calls stopped.', GETDATE(), 'CALLMATIC_AI', 'Callmatic AI Agent', GETDATE()
            )`,
            { replacements: { metaLeadUtd }, type: QueryTypes.INSERT }
          );
          return;
        } else {
          // Schedule Next Day Retry (Day 2 or Day 3)
          const nextDayDate = new Date();
          nextDayDate.setDate(nextDayDate.getDate() + 1);
          const yyyy = nextDayDate.getFullYear();
          const mm = String(nextDayDate.getMonth() + 1).padStart(2, "0");
          const dd = String(nextDayDate.getDate()).padStart(2, "0");
          const formattedNextDay = `${yyyy}-${mm}-${dd}`;
          const retryTime = "11:00";
          const retryDayLabel = distinctDays + 1;

          await sequelize.query(
            `INSERT INTO Meta_Lead_Followup_Tbl (
              Meta_Lead_UTD, Followup_Date, Followup_Time, Followup_Type, Followup_Status, Purpose, Remark, Created_By, Created_At
            ) VALUES (
              :metaLeadUtd, :fDate, :fTime, 'AI_CALL', 'PENDING', :purpose, :remark, 'CALLMATIC_AI', GETDATE()
            )`,
            {
              replacements: {
                metaLeadUtd,
                fDate: formattedNextDay,
                fTime: retryTime,
                purpose: `Day ${retryDayLabel} Auto Call Retry (Busy/No Answer)`,
                remark: `Auto Scheduled Day ${retryDayLabel} call retry after unanswered/busy call (Attempt #${totalCalls}).`,
              },
              type: QueryTypes.INSERT,
            }
          );
          console.log(`[3-DAY-RETRY-RULE] Scheduled Day ${retryDayLabel} Retry for Lead #${metaLeadUtd} on ${formattedNextDay} at ${retryTime}`);
          return;
        }
      }

      // ── SUCCESSFUL OR CUSTOMER-SCHEDULED FOLLOWUP ──────────────
      const targetFollowupDate = scheduleInfo.date;
      const targetFollowupTime = scheduleInfo.time;
      const scheduleReason = scheduleInfo.hasSpecificSchedule 
        ? `Scheduled by Customer during Call (${targetFollowupDate} ${targetFollowupTime})` 
        : `Auto Follow-up based on AI Call Summary`;

      await sequelize.query(
        `INSERT INTO Meta_Lead_Followup_Tbl (
          Meta_Lead_UTD,
          Followup_Date,
          Followup_Time,
          Followup_Type,
          Followup_Status,
          Purpose,
          Remark,
          Created_By,
          Created_At
        ) VALUES (
          :metaLeadUtd,
          :fDate,
          :fTime,
          'AI_CALL',
          'PENDING',
          :purpose,
          :remark,
          'CALLMATIC_AI',
          GETDATE()
        )`,
        {
          replacements: {
            metaLeadUtd,
            fDate: targetFollowupDate,
            fTime: targetFollowupTime,
            purpose: scheduleReason,
            remark: `AI Call Summary: ${effectiveSummary}`,
          },
          type: QueryTypes.INSERT,
        }
      );

      // Also log FOLLOWUP_CREATED activity record so timeline updates cleanly
      await sequelize.query(
        `INSERT INTO Meta_Lead_Activity_Tbl (
          Meta_Lead_UTD,
          Activity_Type,
          Activity_Status,
          Old_Value,
          New_Value,
          Remark,
          Activity_Date,
          Created_By,
          Created_Name,
          Created_At
        ) VALUES (
          :metaLeadUtd,
          'FOLLOWUP_CREATED',
          'COMPLETED',
          'AI Call Summary',
          :newValue,
          :remark,
          GETDATE(),
          'CALLMATIC_AI',
          'Callmatic AI Agent',
          GETDATE()
        )`,
        {
          replacements: {
            metaLeadUtd,
            newValue: `${targetFollowupDate} ${targetFollowupTime}`,
            remark: `Auto Follow-up scheduled (${targetFollowupDate} ${targetFollowupTime}) based on AI Call: ${effectiveSummary.substring(0, 100)}...`,
          },
          type: QueryTypes.INSERT,
        }
      );
      console.log(`[AI-FOLLOWUP-LOG] Auto created Follow-up for Lead #${metaLeadUtd} on ${targetFollowupDate} at ${targetFollowupTime}`);
    }
  } catch (err) {
    console.error(`[AI-SUMMARY-LOG] Error syncing activity & followup for Lead #${metaLeadUtd}:`, err?.message);
  }
};

/**
 * Auto sync calls from Meta_Call_Log_Tbl to Meta_Lead_Activity_Tbl & Meta_Lead_Followup_Tbl
 */
const autoSyncLeadCalls = async (sequelize, leadUtd) => {
  if (!sequelize || !leadUtd) return;
  try {
    const callLogs = await sequelize.query(
      `SELECT Call_Id, Phone_Number, Created_At FROM Meta_Call_Log_Tbl WHERE Meta_Lead_UTD = :leadUtd ORDER BY UTD DESC`,
      { replacements: { leadUtd }, type: QueryTypes.SELECT }
    );

    if (!callLogs || callLogs.length === 0) return;

    for (const log of callLogs) {
      if (!log.Call_Id) continue;

      let callData = null;
      try {
        const apiRes = await getCallStatus(log.Call_Id);
        callData = apiRes?.data || apiRes;
      } catch (_) {}

      if (!callData || !callData.status) {
        const whRows = await sequelize.query(
          `SELECT TOP 1 * FROM dbo.call_webhook_dtl WHERE call_id = :callId OR (phone_number = :phone AND phone_number IS NOT NULL AND phone_number != '') ORDER BY id DESC`,
          { replacements: { callId: log.Call_Id, phone: log.Phone_Number || "" }, type: QueryTypes.SELECT }
        );
        if (whRows && whRows.length > 0) {
          callData = {
            status: whRows[0].status,
            duration: whRows[0].duration,
            summary: whRows[0].summary,
            transcript: whRows[0].transcript
              ? typeof whRows[0].transcript === "string"
                ? JSON.parse(whRows[0].transcript)
                : whRows[0].transcript
              : [],
          };
        }
      }

      const status = String(callData?.status || callData?.call_status || "completed").toLowerCase();
      const summary =
        callData?.summary ||
        callData?.call_summary ||
        callData?.analysis?.summary ||
        callData?.overview ||
        callData?.result_summary ||
        callData?.transcript_summary ||
        (Array.isArray(callData?.transcript) && callData.transcript.length > 0
          ? `Call completed with ${callData.transcript.length} turns. Customer interacted with Callmatic AI Agent.`
          : null);
      const duration = callData?.duration || callData?.call_duration || 0;

      await syncAiCallSummaryAndFollowup(
        sequelize,
        leadUtd,
        log.Call_Id,
        summary,
        status,
        duration
      );
    }
  } catch (err) {
    console.error(`[AUTO-SYNC-LEAD-CALLS] Error for Lead #${leadUtd}:`, err?.message);
  }
};

// ============================================================
// GET META CALL ENRICHED HISTORY WITH CALLMATIC STATUS & RECORDINGS
// GET /getMetaCallHistory, POST /getMetaCallHistory
// ============================================================
exports.getMetaCallHistory = async function (req, res) {
  let sequelize;

  try {
    const compcode = req.headers.compcode;
    if (!compcode) {
      return res.status(400).json({
        Status: false,
        Message: "Header 'compcode' is missing",
      });
    }

    sequelize = await dbname(req, compcode);

    const body = { ...req.query, ...req.body };
    const metaLeadUtd = Number(
      body.meta_lead_utd || body.Meta_Lead_UTD || body.leadUtd || body.utd || req.params?.leadUtd
    );
    const directCallId = body.callId || body.call_id || null;

    if (!metaLeadUtd && !directCallId) {
      return res.status(400).json({
        Status: false,
        Message: "meta_lead_utd or callId is required",
      });
    }

    let logs = [];

    // ── Priority 1: Search Meta_Call_Log_Tbl by Meta_Lead_UTD or Call_Id ──
    let logSql = `
      SELECT 
        l.UTD,
        l.Meta_Lead_UTD,
        l.Meta_Lead_Id,
        l.Call_Id,
        l.Call_Type,
        l.Call_Source,
        l.Campaign_Id,
        l.Campaign_Name,
        l.Meta_Form_Id,
        l.Meta_Form_Name,
        l.Phone_Number,
        l.Created_By,
        l.Created_At,
        ml.Full_Name
      FROM Meta_Call_Log_Tbl l
      LEFT JOIN Meta_Lead_Tbl ml ON l.Meta_Lead_UTD = ml.UTD
    `;
    const replacements = {};

    if (directCallId) {
      logSql += ` WHERE l.Call_Id = :directCallId`;
      replacements.directCallId = directCallId;
    } else if (metaLeadUtd) {
      logSql += ` WHERE l.Meta_Lead_UTD = :metaLeadUtd`;
      replacements.metaLeadUtd = metaLeadUtd;
    }

    logSql += ` ORDER BY l.UTD DESC`;

    logs = await sequelize.query(logSql, {
      replacements,
      type: QueryTypes.SELECT,
    });

    // ── Priority 2: Fallback to searching by Phone Number in call_Id_dtl / call_webhook_dtl if no log entries ──
    if ((!logs || logs.length === 0) && metaLeadUtd) {
      const leadRow = await sequelize.query(
        `SELECT UTD, Meta_Lead_Id, Full_Name, Phone_Number FROM Meta_Lead_Tbl WHERE UTD = :metaLeadUtd`,
        { replacements: { metaLeadUtd }, type: QueryTypes.SELECT }
      );

      if (leadRow && leadRow.length > 0 && leadRow[0].Phone_Number) {
        const cleanMob = String(leadRow[0].Phone_Number).trim().replace(/\s/g, "");

        const fallbackCallIds = await sequelize.query(
          `SELECT call_id, Created_At FROM dbo.call_Id_dtl
           WHERE LTRIM(RTRIM(mob_no)) = :cleanMob AND call_id IS NOT NULL AND call_id != ''
           ORDER BY id DESC`,
          { replacements: { cleanMob }, type: QueryTypes.SELECT }
        );

        if (fallbackCallIds && fallbackCallIds.length > 0) {
          logs = fallbackCallIds.map((c, idx) => ({
            UTD: idx + 1,
            Meta_Lead_UTD: leadRow[0].UTD,
            Meta_Lead_Id: leadRow[0].Meta_Lead_Id,
            Call_Id: c.call_id,
            Call_Type: "MANUAL_AI_CALL",
            Call_Source: "META_LEAD",
            Phone_Number: leadRow[0].Phone_Number,
            Full_Name: leadRow[0].Full_Name,
            Created_At: c.Created_At || new Date(),
          }));
        }
      }
    }

    if (!logs || logs.length === 0) {
      return res.status(200).json({
        Status: true,
        Message: "No call records found for this lead.",
        Data: [],
      });
    }

    // ── Enrich with Callmatic API Real-time status, summary, duration, transcript ──
    const enrichedLogs = await Promise.all(
      logs.map(async (log) => {
        let callData = null;

        if (log.Call_Id) {
          try {
            const apiRes = await getCallStatus(log.Call_Id);
            callData = apiRes?.data || apiRes;
          } catch (apiErr) {
            console.warn(`[META-HISTORY] Callmatic API status failed for ${log.Call_Id}:`, apiErr?.message);
          }

          // DB Webhook fallback if API status failed or returned empty
          if (!callData || !callData.status) {
            const whRows = await sequelize.query(
              `SELECT TOP 1 * FROM dbo.call_webhook_dtl
               WHERE call_id = :callId OR (phone_number = :phone AND phone_number IS NOT NULL AND phone_number != '')
               ORDER BY id DESC`,
              { replacements: { callId: log.Call_Id, phone: log.Phone_Number || "" }, type: QueryTypes.SELECT }
            );

            if (whRows && whRows.length > 0) {
              callData = {
                callId: whRows[0].call_id,
                phoneNumber: whRows[0].phone_number,
                status: whRows[0].status,
                duration: whRows[0].duration,
                summary: whRows[0].summary,
                transcript: whRows[0].transcript
                  ? typeof whRows[0].transcript === "string"
                    ? JSON.parse(whRows[0].transcript)
                    : whRows[0].transcript
                  : [],
              };
            }
          }
        }

        const callStatus = String(callData?.status || callData?.call_status || "initiated").toLowerCase();

        const resObj = {
          UTD: log.UTD,
          Meta_Lead_UTD: log.Meta_Lead_UTD,
          Meta_Lead_Id: log.Meta_Lead_Id,
          Call_Id: log.Call_Id,
          Call_Type: log.Call_Type,
          Call_Source: log.Call_Source,
          Campaign_Id: log.Campaign_Id,
          Campaign_Name: log.Campaign_Name,
          Meta_Form_Id: log.Meta_Form_Id,
          Meta_Form_Name: log.Meta_Form_Name,
          Phone_Number: log.Phone_Number,
          Full_Name: log.Full_Name,
          Created_By: log.Created_By,
          Created_At: log.Created_At,
          status: callStatus,
          duration: callData?.duration || callData?.call_duration || null,
          summary:
            callData?.summary ||
            callData?.call_summary ||
            callData?.analysis?.summary ||
            callData?.overview ||
            callData?.result_summary ||
            callData?.transcript_summary ||
            (Array.isArray(callData?.transcript) && callData.transcript.length > 0
              ? `Call completed with ${callData.transcript.length} turns. Customer interacted with Callmatic AI Agent.`
              : null),
          transcript: callData?.transcript || callData?.call_transcript || [],
          recordingUrl: callData?.recordingUrl || callData?.recording_url || null,
          callData: callData || null,
        };

        if (log.Meta_Lead_UTD && resObj.summary) {
          try {
            await syncAiCallSummaryAndFollowup(
              sequelize,
              log.Meta_Lead_UTD,
              log.Call_Id,
              resObj.summary,
              callStatus,
              resObj.duration || 0
            );
          } catch (_) {}
        }

        return resObj;
      })
    );

    return res.status(200).json({
      Status: true,
      Message: "Meta call history fetched successfully",
      Data: enrichedLogs,
    });

  } catch (err) {
    console.error("[META-CALL-HISTORY] Error:", err?.message);
    return res.status(500).json({ Status: false, Message: err?.message });
  } finally {
    if (sequelize) {
      try {
        await sequelize.close();
      } catch (_) { }
    }
  }
};

// ============================================================
// STREAM META CALL RECORDING AUDIO
// GET /getMetaCallRecording/:callId
// ============================================================
exports.getMetaCallRecording = async function (req, res) {
  try {
    const { callId } = req.params;
    if (!callId) {
      return res.status(400).json({ Status: false, Message: "callId is required" });
    }
    await getCallRecording(callId, res);
  } catch (err) {
    if (!res.headersSent) {
      return res.status(500).json({ Status: false, Message: err?.message });
    }
  }
};

exports.startMetaCallStatusPoller = startMetaCallStatusPoller;
exports.sendPostCallWhatsAppPackage = sendPostCallWhatsAppPackage;
exports.sendWhatsAppDocumentTemplate = sendWhatsAppDocumentTemplate;
exports.sendWhatsAppVideoTemplate = sendWhatsAppVideoTemplate;
exports.sendWhatsAppTextTemplate = sendWhatsAppTextTemplate;
exports.autoSyncLeadCalls = autoSyncLeadCalls;