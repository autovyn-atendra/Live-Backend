// const axios = require("axios");

// // ============================================================
// // META WEBHOOK VERIFY
// // GET /webhook
// // ============================================================

// exports.verifyMetaWebhook = async function (req, res) {
//   try {
//     console.log("\n========================================");
//     console.log("META WEBHOOK VERIFICATION REQUEST");
//     console.log("========================================");

//     console.log("REQ URL:", req.originalUrl);
//     console.log("REQ QUERY:", req.query);

//     const mode =
//       req.query["hub.mode"];

//     const verifyToken =
//       req.query["hub.verify_token"];

//     const challenge =
//       req.query["hub.challenge"];

//     console.log("Mode:", mode);
//     console.log("Verify Token:", verifyToken);
//     console.log("Challenge:", challenge);

//     // --------------------------------------------------------
//     // Required parameters check
//     // --------------------------------------------------------

//     if (!mode || !verifyToken || !challenge) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Missing Meta webhook verification parameters",
//         received: req.query,
//       });
//     }

//     // --------------------------------------------------------
//     // Verify token
//     // --------------------------------------------------------

//     if (
//       mode === "subscribe" &&
//       verifyToken === process.env.META_VERIFY_TOKEN
//     ) {
//       console.log(
//         "✅ META WEBHOOK VERIFIED SUCCESSFULLY"
//       );

//       /*
//         Meta ko challenge exactly as response dena hota hai.
//       */
//       return res.status(200).send(challenge);
//     }

//     console.log(
//       "❌ META WEBHOOK VERIFICATION FAILED"
//     );

//     return res.status(403).json({
//       success: false,
//       message:
//         "Meta webhook verification failed",
//     });

//   } catch (error) {
//     console.error(
//       "Meta Webhook Verify Error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//       error: error.message,
//     });
//   }
// };


// // ============================================================
// // META WEBHOOK RECEIVE
// // POST /webhook
// // ============================================================

// exports.receiveMetaWebhook = async function (req, res) {
//   try {
//     console.log("\n\n");
//     console.log("========================================");
//     console.log("META WEBHOOK RECEIVED");
//     console.log("========================================");

//     console.log(
//       JSON.stringify(req.body, null, 2)
//     );

//     const body = req.body || {};

//     // --------------------------------------------------------
//     // Meta Page webhook check
//     // --------------------------------------------------------

//     if (body.object !== "page") {
//       console.log(
//         "Webhook object is not page:",
//         body.object
//       );

//       return res.status(200).json({
//         success: true,
//         message:
//           "Webhook received but object was not page",
//         data: body,
//       });
//     }

//     const entries =
//       Array.isArray(body.entry)
//         ? body.entry
//         : [];

//     // --------------------------------------------------------
//     // Process entries
//     // --------------------------------------------------------

//     for (const entry of entries) {

//       console.log(
//         "\n========================================"
//       );

//       console.log(
//         "ENTRY ID:",
//         entry.id
//       );

//       console.log(
//         "ENTRY TIME:",
//         entry.time
//       );

//       const changes =
//         Array.isArray(entry.changes)
//           ? entry.changes
//           : [];

//       for (const change of changes) {

//         console.log(
//           "\nCHANGE FIELD:",
//           change.field
//         );

//         // ----------------------------------------------------
//         // Only Lead Ads webhook
//         // ----------------------------------------------------

//         if (change.field !== "leadgen") {
//           console.log(
//             "Skipping non-leadgen event"
//           );

//           continue;
//         }

//         const value =
//           change.value || {};

//         const leadId =
//           value.leadgen_id;

//         const pageId =
//           value.page_id;

//         const formId =
//           value.form_id;

//         const adId =
//           value.ad_id;

//         const adGroupId =
//           value.adgroup_id;

//         const createdTime =
//           value.created_time;

//         console.log(
//           "\n✅ META LEAD EVENT DETECTED"
//         );

//         console.log(
//           "Lead ID:",
//           leadId
//         );

//         console.log(
//           "Page ID:",
//           pageId
//         );

//         console.log(
//           "Form ID:",
//           formId
//         );

//         console.log(
//           "Ad ID:",
//           adId
//         );

//         console.log(
//           "Ad Group ID:",
//           adGroupId
//         );

//         console.log(
//           "Created Time:",
//           createdTime
//         );

//         // ----------------------------------------------------
//         // leadgen_id required
//         // ----------------------------------------------------

//         if (!leadId) {
//           console.log(
//             "❌ leadgen_id missing"
//           );

//           continue;
//         }

//         // ----------------------------------------------------
//         // META GRAPH API
//         // Fetch actual customer lead information
//         // ----------------------------------------------------

//         try {

//           const leadDetails =
//             await getMetaLeadDetails(
//               leadId
//             );

//           console.log(
//             "\n========================================"
//           );

//           console.log(
//             "META FULL LEAD DETAILS"
//           );

//           console.log(
//             "========================================"
//           );

//           console.log(
//             JSON.stringify(
//               leadDetails,
//               null,
//               2
//             )
//           );

//           // --------------------------------------------------
//           // Parsed version for easy understanding
//           // --------------------------------------------------

//           const parsedLead =
//             parseMetaLeadFields(
//               leadDetails
//             );

//           console.log(
//             "\n========================================"
//           );

//           console.log(
//             "PARSED META LEAD"
//           );

//           console.log(
//             "========================================"
//           );

//           console.log(
//             JSON.stringify(
//               parsedLead,
//               null,
//               2
//             )
//           );

//         } catch (error) {

//           console.error(
//             "\n❌ META LEAD FETCH FAILED"
//           );

//           console.error(
//             error.response?.data ||
//             error.message
//           );
//         }
//       }
//     }

//     // --------------------------------------------------------
//     // Meta acknowledgement
//     // --------------------------------------------------------

//     return res.status(200).json({
//       success: true,
//       message:
//         "Meta webhook received successfully",
//     });

//   } catch (error) {

//     console.error(
//       "Meta Webhook Receive Error:",
//       error.response?.data ||
//       error.message
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Meta webhook processing failed",
//       error:
//         error.response?.data ||
//         error.message,
//     });
//   }
// };


// // ============================================================
// // GET META LEAD DETAILS
// // ============================================================

// const getMetaLeadDetails =
//   async function (leadId) {

//     if (!leadId) {
//       throw new Error(
//         "Meta lead ID is required"
//       );
//     }

//     if (
//       !process.env.META_PAGE_ACCESS_TOKEN
//     ) {
//       throw new Error(
//         "META_PAGE_ACCESS_TOKEN is missing"
//       );
//     }

//     const graphVersion =
//       process.env.META_GRAPH_VERSION ||
//       "v26.0";

//     const url =
//       `https://graph.facebook.com/` +
//       `${graphVersion}/` +
//       `${leadId}`;

//     console.log(
//       "\nFetching Meta Lead:"
//     );

//     console.log(
//       "Lead ID:",
//       leadId
//     );

//     console.log(
//       "Graph Version:",
//       graphVersion
//     );

//     const response =
//       await axios.get(
//         url,
//         {
//           params: {

//             fields:
//               "id,created_time,field_data,form_id,ad_id",

//             access_token:
//               process.env
//                 .META_PAGE_ACCESS_TOKEN,
//           },

//           timeout: 15000,
//         }
//       );

//     return response.data;
//   };


// // ============================================================
// // PARSE META FIELD DATA
// // ============================================================

// const parseMetaLeadFields =
//   function (metaLead) {

//     const fields = {};

//     const fieldData =
//       Array.isArray(
//         metaLead?.field_data
//       )
//         ? metaLead.field_data
//         : [];

//     for (const field of fieldData) {

//       const fieldName =
//         String(
//           field?.name || ""
//         )
//           .trim()
//           .toLowerCase();

//       if (!fieldName) {
//         continue;
//       }

//       const values =
//         Array.isArray(
//           field.values
//         )
//           ? field.values
//           : [];

//       /*
//         Agar single value hai:
//         "Rahul Sharma"

//         Multiple hai:
//         ["A", "B"]
//       */

//       fields[fieldName] =
//         values.length === 1
//           ? values[0]
//           : values;
//     }

//     return {

//       meta_lead_id:
//         metaLead?.id || null,

//       created_time:
//         metaLead?.created_time ||
//         null,

//       form_id:
//         metaLead?.form_id ||
//         null,

//       ad_id:
//         metaLead?.ad_id ||
//         null,

//       full_name:
//         fields.full_name ||
//         fields.name ||
//         null,

//       first_name:
//         fields.first_name ||
//         null,

//       last_name:
//         fields.last_name ||
//         null,

//       phone_number:
//         fields.phone_number ||
//         fields.phone ||
//         fields.mobile_number ||
//         null,

//       email:
//         fields.email ||
//         fields.email_address ||
//         null,

//       city:
//         fields.city ||
//         null,

//       all_fields:
//         fields,
//     };
//   };



const axios = require("axios");
const { QueryTypes } = require("sequelize");
const { dbname } = require("../utils/dbconfig");


// ============================================================
// IMPORTANT
// Apne existing controller se dbname ka EXACT import use karo.
//
// Example ONLY:
// const { dbname } = require("../utils/dbconfig");
//
// Ya:
// const dbname = require("../utils/dbname");
//
// Tumhare project me jo already working hai wahi use karna.
// ============================================================

// const { dbname } = require("YOUR_EXISTING_DB_CONFIG_PATH");


// ============================================================
// META WEBHOOK VERIFY
// GET /webhook
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

exports.receiveMetaWebhook = async function (req, res) {
  try {
    console.log("\n\n");
    console.log("========================================");
    console.log("META WEBHOOK RECEIVED");
    console.log("========================================");

    console.log(
      JSON.stringify(req.body, null, 2)
    );

    const body = req.body || {};

    // ==========================================================
    // Only Meta Page webhook
    // ==========================================================

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