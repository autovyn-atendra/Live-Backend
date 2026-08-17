// schedulers/demoCarAppointmentScheduler.js

const { QueryTypes } = require("sequelize");
const { dbname } = require("../utils/dbconfig");
const { SendWhatsAppMessgae } = require("./user");


// ============================================================
// MAIN SCHEDULER FUNCTION
// ============================================================
async function DemoCarAppointmentScheduler() {
  console.log("\n==============================================");
  console.log("🚗 Demo Car Appointment Scheduler Started");
  console.log("==============================================");

  let sequelize1;

  try {
    // ============================================================
    // 1. CONNECT TO DBCON DATABASE
    // ============================================================
    sequelize1 = await dbname(
      {
        query: "",
        headers: {
          compcode: "DBCON",
          name: "scheduler",
        },
      },
      "DBCON"
    );

    // ============================================================
    // 2. GET COMPANIES FROM DLR_SCH
    // Dlr_Id hi compcode hoga
    // ============================================================
    const [Dlr_data] = await sequelize1.query(
      `
      SELECT DISTINCT
          Dlr_Id
      FROM DLR_SCH
      WHERE SCH_TYPE = 'democarappointment'
        AND export_type < 3
        AND Dlr_Id IS NOT NULL
      `,
      {
        type: QueryTypes.SELECT,
      }
    );

    console.log("Dlr_data:", Dlr_data);

    // Agar koi company nahi mili
    if (!Dlr_data || Dlr_data.length === 0) {
      console.log(
        "⚠️ No active companies found for Demo Car Appointment Scheduler"
      );

      return {
        success: true,
        message: "No companies found",
        companiesProcessed: 0,
      };
    }

    console.log(
      `🏢 Total Companies Found: ${Dlr_data.length}`
    );

    // ============================================================
    // 3. PROCESS EACH COMPANY
    // ============================================================
    const companyResults = [];

    for (const dealer of Dlr_data) {
      const compcode = String(dealer.Dlr_Id).trim();

      console.log("\n----------------------------------------------");
      console.log(`🏢 Processing Company: ${compcode}`);
      console.log("----------------------------------------------");

      let sequelize;

      try {
        // ============================================================
        // 4. COMPANY DATABASE CONNECTION
        // Dlr_Id = compcode
        // ============================================================
        sequelize = await dbname(
          {
            query: "",
            headers: {
              compcode,
              name: "scheduler",
            },
          },
          compcode
        );

        // ============================================================
        // 5. CURRENT DATE
        // ============================================================
        const today = new Date()
          .toISOString()
          .split("T")[0];

        console.log(
          `📅 [${compcode}] Checking appointments for: ${today}`
        );

        // ============================================================
        // 6. GET TODAY'S PENDING APPOINTMENTS
        // status = 0 => Pending
        // ============================================================
        const appointments = await sequelize.query(
          `
          SELECT
              d.UTD,
              d.CustomerName,

              d.Mob_Number AS Customer_Mobile,

              d.Enq_No,

              d.Model_Name,

              d.Model_Group,

              CONVERT(
                varchar,
                d.[Date],
                23
              ) AS Appointment_Date,

              CONVERT(
                varchar,
                d.[Time],
                108
              ) AS Appointment_Time,

              d.status,

              d.DSE,

              -- ==========================================
              -- DSE NAME
              -- ==========================================
              LTRIM(
                RTRIM(
                  ISNULL(e.EMPFIRSTNAME, '') + ' ' +
                  ISNULL(e.EMPLASTNAME, '')
                )
              ) AS DSE_Name,

              -- ==========================================
              -- DSE MOBILE
              -- ==========================================
              ISNULL(
                e.MOBILENO,
                ''
              ) AS DSE_Mobile,

              -- ==========================================
              -- CAR MODEL / VARIANT
              -- ==========================================
              ISNULL(
                (
                  SELECT TOP 1
                      mm.Misc_Name
                  FROM Misc_Mst mm
                  WHERE mm.Misc_Code = d.Model_Name
                ),
                'N/A'
              ) AS Model_Variant

          FROM Demo_Car_Appointment d

          LEFT JOIN EMPLOYEEMASTER e
              ON LTRIM(
                   RTRIM(
                     CAST(
                       d.DSE AS VARCHAR(100)
                     )
                   )
                 )
               =
                 LTRIM(
                   RTRIM(
                     CAST(
                       e.EMPCODE AS VARCHAR(100)
                     )
                   )
                 )

          WHERE
              CAST(
                d.[Date] AS DATE
              ) = CAST(
                GETDATE() AS DATE
              )

              AND d.status = 0

          ORDER BY
              d.DSE ASC,
              d.[Time] ASC
          `,
          {
            type: QueryTypes.SELECT,
          }
        );

        console.log(
          `📊 [${compcode}] Pending Appointments: ${appointments.length}`
        );

        // ============================================================
        // 7. NO PENDING APPOINTMENTS
        // ============================================================
        if (!appointments.length) {
          console.log(
            `ℹ️ [${compcode}] No pending appointments for today`
          );

          companyResults.push({
            compcode,
            success: true,
            totalPending: 0,
            totalDSE: 0,
            notificationSummary: {
              sent: 0,
              failed: 0,
              skipped: 0,
            },
            message: "No pending appointments for today",
          });

          continue;
        }

        // ============================================================
        // 8. GROUP APPOINTMENTS DSE WISE
        // ============================================================
        const dseMap = {};

        for (const appt of appointments) {
          const dseCode = String(
            appt.DSE || ""
          ).trim();

          // DSE nahi hai to skip
          if (!dseCode) {
            console.warn(
              `⚠️ [${compcode}] Skipping UTD ${appt.UTD} - No DSE`
            );

            continue;
          }

          // DSE first time mila
          if (!dseMap[dseCode]) {
            dseMap[dseCode] = {
              DSE: dseCode,

              DSE_Name:
                String(
                  appt.DSE_Name || ""
                ).trim() || "Unknown",

              DSE_Mobile:
                String(
                  appt.DSE_Mobile || ""
                ).trim(),

              Total_Appointments: 0,

              Customers: [],
            };
          }

          // Appointment count
          dseMap[dseCode].Total_Appointments++;

          // Customer data
          dseMap[dseCode].Customers.push({
            UTD: appt.UTD,

            CustomerName:
              appt.CustomerName || "N/A",

            Customer_Mobile:
              appt.Customer_Mobile || "N/A",

            Appointment_Date:
              appt.Appointment_Date || today,

            Appointment_Time:
              appt.Appointment_Time || "N/A",

            Model_Variant:
              appt.Model_Variant || "N/A",

            Model_Name:
              appt.Model_Name,

            Model_Group:
              appt.Model_Group,

            Enq_No:
              appt.Enq_No || "N/A",
          });
        }

        // Object ko Array mein convert
        const dseList = Object.values(dseMap);

        console.log(
          `👨‍💼 [${compcode}] Total DSE: ${dseList.length}`
        );

        // ============================================================
        // 9. SEND WHATSAPP NOTIFICATIONS
        // ============================================================
        const notificationResults = [];

        for (const dse of dseList) {
          // ==========================================================
          // DSE MOBILE NOT AVAILABLE
          // ==========================================================
          if (!dse.DSE_Mobile) {
            console.warn(
              `⚠️ [${compcode}] No mobile for DSE: ${dse.DSE_Name} (${dse.DSE})`
            );

            notificationResults.push({
              DSE: dse.DSE,

              DSE_Name:
                dse.DSE_Name,

              DSE_Mobile:
                dse.DSE_Mobile,

              status: "skipped",

              reason:
                "No DSE mobile number",
            });

            continue;
          }

          // ==========================================================
          // SEND MESSAGE FOR EACH CUSTOMER
          // ==========================================================
          for (const customer of dse.Customers) {
            try {
              console.log(
                `📨 [${compcode}] Sending WhatsApp`
              );

              console.log(
                `   DSE: ${dse.DSE_Name}`
              );

              console.log(
                `   Mobile: ${dse.DSE_Mobile}`
              );

              console.log(
                `   Customer: ${customer.CustomerName}`
              );

              // ========================================================
              // SEND WHATSAPP
              // ========================================================
              await SendWhatsAppMessgae(
                compcode,

                dse.DSE_Mobile,

                "demo_car_appointment_reminder",

                [
                  // 1. DSE Name
                  {
                    type: "text",
                    text:
                      dse.DSE_Name ||
                      "Unknown",
                  },

                  // 2. Customer Name
                  {
                    type: "text",
                    text:
                      customer.CustomerName ||
                      "Unknown",
                  },

                  // 3. Customer Mobile
                  {
                    type: "text",
                    text:
                      customer.Customer_Mobile ||
                      "N/A",
                  },

                  // 4. Car Model / Variant
                  {
                    type: "text",
                    text:
                      customer.Model_Variant ||
                      "N/A",
                  },

                  // 5. Appointment Date
                  {
                    type: "text",
                    text:
                      customer.Appointment_Date ||
                      today,
                  },
                ]
              );

              console.log(
                `✅ WhatsApp sent successfully`
              );

              notificationResults.push({
                UTD:
                  customer.UTD,

                DSE:
                  dse.DSE,

                DSE_Name:
                  dse.DSE_Name,

                DSE_Mobile:
                  dse.DSE_Mobile,

                CustomerName:
                  customer.CustomerName,

                Customer_Mobile:
                  customer.Customer_Mobile,

                status:
                  "sent",
              });

            } catch (whatsappErr) {
              console.error(
                `❌ WhatsApp failed`
              );

              console.error(
                `DSE: ${dse.DSE_Name}`
              );

              console.error(
                `Customer: ${customer.CustomerName}`
              );

              console.error(
                whatsappErr.message
              );

              notificationResults.push({
                UTD:
                  customer.UTD,

                DSE:
                  dse.DSE,

                DSE_Name:
                  dse.DSE_Name,

                DSE_Mobile:
                  dse.DSE_Mobile,

                CustomerName:
                  customer.CustomerName,

                status:
                  "failed",

                error:
                  whatsappErr.message,
              });
            }
          }
        }

        // ============================================================
        // 10. NOTIFICATION SUMMARY
        // ============================================================
        const sentCount =
          notificationResults.filter(
            (r) =>
              r.status === "sent"
          ).length;

        const failedCount =
          notificationResults.filter(
            (r) =>
              r.status === "failed"
          ).length;

        const skippedCount =
          notificationResults.filter(
            (r) =>
              r.status === "skipped"
          ).length;

        console.log(
          `\n📊 [${compcode}] Notification Summary:`
        );

        console.log(
          `   ✅ Sent: ${sentCount}`
        );

        console.log(
          `   ❌ Failed: ${failedCount}`
        );

        console.log(
          `   ⚠️ Skipped: ${skippedCount}`
        );

        // ============================================================
        // 11. COMPANY RESULT
        // ============================================================
        companyResults.push({
          compcode,

          success: true,

          date: today,

          totalPending:
            appointments.length,

          totalDSE:
            dseList.length,

          notificationSummary: {
            sent:
              sentCount,

            failed:
              failedCount,

            skipped:
              skippedCount,
          },

          notificationResults,
        });

      } catch (companyError) {
        console.error(
          `❌ [${compcode}] Scheduler failed:`,
          companyError.message
        );

        companyResults.push({
          compcode,

          success: false,

          error:
            companyError.message,
        });

      } finally {
        // ============================================================
        // CLOSE COMPANY DB
        // ============================================================
        if (sequelize) {
          await sequelize.close();

          console.log(
            `🔌 [${compcode}] DB Connection closed`
          );
        }
      }
    }

    // ============================================================
    // 12. FINAL SCHEDULER RESULT
    // ============================================================
    console.log("\n==============================================");
    console.log("✅ Demo Car Appointment Scheduler Completed");
    console.log("==============================================");

    return {
      success: true,

      companiesProcessed:
        Dlr_data.length,

      companyResults,
    };

  } catch (error) {
    console.error(
      "\n❌ Demo Car Appointment Scheduler Error:",
      error
    );

    return {
      success: false,

      message:
        "Demo Car Appointment Scheduler Failed",

      error:
        error.message,
    };

  } finally {
    // ============================================================
    // CLOSE DBCON CONNECTION
    // ============================================================
    if (sequelize1) {
      await sequelize1.close();

      console.log(
        "🔌 DBCON Connection closed"
      );
    }
  }
}

// ============================================================
// EXPORT
// ============================================================
module.exports = {
  DemoCarAppointmentScheduler,
};
// // schedulers/demoCarAppointmentScheduler.js

// const { QueryTypes } = require("sequelize");
// const { dbname } = require("../utils/dbconfig");


// // ============================================================
// // Helper - Message Format
// // ============================================================
// const buildDSEMessage = (dse) => {
//   let message = `🚗 *Demo Car Appointment - Today's Schedule*\n\n`;
//   message += `👤 *DSE:* ${dse.DSE_Name}\n`;
//   message += `📱 *DSE Mobile:* ${dse.DSE_Mobile}\n`;
//   message += `📊 *Total Appointments:* ${dse.Total_Appointments}\n`;
//   message += `${"─".repeat(30)}\n\n`;

//   dse.Customers.forEach((customer, index) => {
//     message += `*Appointment ${index + 1}:*\n`;
//     message += `👤 Customer: ${customer.CustomerName}\n`;
//     message += `📱 Mobile: ${customer.Customer_Mobile || "N/A"}\n`;
//     message += `🚘 Car: ${customer.Model_Variant || "N/A"}\n`;
//     message += `📅 Date: ${customer.Appointment_Date}\n`;
//     message += `📝 Enq No: ${customer.Enq_No || "N/A"}\n`;

//     if (index < dse.Customers.length - 1) {
//       message += `\n${"─".repeat(20)}\n\n`;
//     }
//   });

//   return message.trim();
// };

// // ============================================================
// // MAIN SCHEDULER FUNCTION
// // ============================================================
// exports.getTodayPendingDemoCarAppointments = async function (req, res) {
//   let sequelize;

//   try {
//     const compcode = req.headers.compcode;

//     // ✅ Validation
//     if (!compcode) {
//       return res.status(400).send({
//         success: false,
//         message: "compcode is required in headers",
//       });
//     }

//     // ✅ DB Connection
//     sequelize = await dbname(
//       {
//         query: "",
//         headers: {
//           compcode,
//           name: "scheduler",
//         },
//       },
//       compcode
//     );

//     const today = new Date().toISOString().split("T")[0];
//     console.log(`\n📅 [${compcode}] Checking appointments for: ${today}`);

//     // ============================================================
//     // ✅ SQL Query
//     // ============================================================
//     const appointments = await sequelize.query(
//       `
//       SELECT
//           d.UTD,
//           d.CustomerName,
//           d.Mob_Number                          AS Customer_Mobile,
//           d.Enq_No,
//           d.Model_Name,
//           d.Model_Group,
//           CONVERT(varchar, d.[Date], 23)        AS Appointment_Date,
//           d.status,
//           d.DSE,

//           -- DSE Name
//           LTRIM(RTRIM(
//             ISNULL(e.EMPFIRSTNAME, '') + ' ' +
//             ISNULL(e.EMPLASTNAME,  '')
//           ))                                    AS DSE_Name,

//           -- DSE Mobile
//           ISNULL(e.MOBILENO, '')               AS DSE_Mobile,

//           -- Car Variant
//           ISNULL(
//             (
//               SELECT TOP 1 mm.Misc_Name
//               FROM Misc_Mst mm
//               WHERE mm.Misc_Code = d.Model_Name
//             ),
//             'N/A'
//           )                                     AS Model_Variant

//       FROM Demo_Car_Appointment d

//       LEFT JOIN EMPLOYEEMASTER e
//           ON LTRIM(RTRIM(CAST(d.DSE     AS VARCHAR(100))))
//            = LTRIM(RTRIM(CAST(e.EMPCODE AS VARCHAR(100))))

//       WHERE
//           CAST(d.[Date] AS DATE) = CAST(GETDATE() AS DATE)
//           AND d.status = 0

//       ORDER BY
//           d.DSE  ASC,
//           d.[Date] ASC
//       `,
//       { type: QueryTypes.SELECT }
//     );

//     console.log(`[${compcode}] Pending Appointments: ${appointments.length}`);

//     // ✅ Koi nahi mila
//     if (!appointments.length) {
//       return res.status(200).send({
//         success:      true,
//         date:         today,
//         totalPending: 0,
//         totalDSE:     0,
//         dseList:      [],
//         message:      "No pending appointments for today",
//       });
//     }

//     // ============================================================
//     // ✅ DSE wise Group karo
//     // ============================================================
//     const dseMap = {};

//     for (const appt of appointments) {
//       const dseCode = String(appt.DSE || "").trim();

//       if (!dseCode) {
//         console.warn(`⚠️ Skipping UTD ${appt.UTD} - No DSE`);
//         continue;
//       }

//       if (!dseMap[dseCode]) {
//         dseMap[dseCode] = {
//           DSE:                dseCode,
//           DSE_Name:           String(appt.DSE_Name   || "").trim() || "Unknown",
//           DSE_Mobile:         String(appt.DSE_Mobile || "").trim(),
//           Total_Appointments: 0,
//           Customers:          [],
//         };
//       }

//       dseMap[dseCode].Total_Appointments++;
//       dseMap[dseCode].Customers.push({
//         UTD:              appt.UTD,
//         CustomerName:     appt.CustomerName     || "N/A",
//         Customer_Mobile:  appt.Customer_Mobile  || "N/A",
//         Appointment_Date: appt.Appointment_Date || today,
//         Model_Variant:    appt.Model_Variant    || "N/A",
//         Model_Name:       appt.Model_Name,
//         Model_Group:      appt.Model_Group,
//         Enq_No:           appt.Enq_No           || "N/A",
//       });
//     }

//     const dseList = Object.values(dseMap);

//     // ============================================================
//     // ✅ WhatsApp Notifications bhejo
//     // ============================================================
//     const notificationResults = [];

//     for (const dse of dseList) {

//       // Mobile nahi hai → skip
//       if (!dse.DSE_Mobile) {
//         console.warn(`⚠️ No mobile for DSE: ${dse.DSE_Name} (${dse.DSE})`);
//         notificationResults.push({
//           DSE:      dse.DSE,
//           DSE_Name: dse.DSE_Name,
//           status:   "skipped",
//           reason:   "No mobile number",
//         });
//         continue;
//       }

//       // ✅ Har customer ke liye WhatsApp bhejo
//       for (const customer of dse.Customers) {
//         try {
//           console.log(
//             `📨 Sending WhatsApp to DSE: ${dse.DSE_Name} (${dse.DSE_Mobile}) for Customer: ${customer.CustomerName}`
//           );

//           // ✅ SendWhatsAppMessgae call
//           await SendWhatsAppMessgae(
//             compcode,
//             dse.DSE_Mobile,
//             "demo_car_appointment_reminder", // ✅ Template name
//             [
//               // 1. DSE Name
//               {
//                 type: "text",
//                 text: dse.DSE_Name || "Unknown",
//               },
//               // 2. Customer Name
//               {
//                 type: "text",
//                 text: customer.CustomerName || "Unknown",
//               },
//               // 3. Customer Mobile
//               {
//                 type: "text",
//                 text: customer.Customer_Mobile || "N/A",
//               },
//               // 4. Car Model/Variant
//               {
//                 type: "text",
//                 text: customer.Model_Variant || "N/A",
//               },
//               // 5. Appointment Date
//               {
//                 type: "text",
//                 text: customer.Appointment_Date || today,
//               },
//               // // 6. Enquiry No
//               // {
//               //   type: "text",
//               //   text: customer.Enq_No || "N/A",
//               // },
//             ]
//           );

//           console.log(
//             `✅ WhatsApp sent → DSE: ${dse.DSE_Name} | Customer: ${customer.CustomerName}`
//           );

//           notificationResults.push({
//             DSE:          dse.DSE,
//             DSE_Name:     dse.DSE_Name,
//             DSE_Mobile:   dse.DSE_Mobile,
//             CustomerName: customer.CustomerName,
//             status:       "sent",
//           });

//         } catch (whatsappErr) {
//           console.error(
//             `❌ WhatsApp failed → DSE: ${dse.DSE_Name} | Customer: ${customer.CustomerName}`,
//             whatsappErr.message
//           );

//           notificationResults.push({
//             DSE:          dse.DSE,
//             DSE_Name:     dse.DSE_Name,
//             DSE_Mobile:   dse.DSE_Mobile,
//             CustomerName: customer.CustomerName,
//             status:       "failed",
//             error:        whatsappErr.message,
//           });
//         }
//       }
//     }

//     // ============================================================
//     // ✅ Summary Log
//     // ============================================================
//     const sentCount   = notificationResults.filter((r) => r.status === "sent").length;
//     const failedCount = notificationResults.filter((r) => r.status === "failed").length;
//     const skippedCount = notificationResults.filter((r) => r.status === "skipped").length;

//     console.log(`\n📊 [${compcode}] Notification Summary:`);
//     console.log(`  ✅ Sent:    ${sentCount}`);
//     console.log(`  ❌ Failed:  ${failedCount}`);
//     console.log(`  ⚠️ Skipped: ${skippedCount}`);

//     // ============================================================
//     // ✅ Response
//     // ============================================================
//     return res.status(200).send({
//       success:      true,
//       date:         today,
//       totalPending: appointments.length,
//       totalDSE:     dseList.length,
//       dseList,
//       notificationSummary: {
//         sent:    sentCount,
//         failed:  failedCount,
//         skipped: skippedCount,
//       },
//       notificationResults,
//     });

//   } catch (error) {
//     console.error("\n❌ Scheduler Error:", error);
//     return res.status(500).send({
//       success: false,
//       message: "Internal Server Error",
//       error:   error.message,
//     });

//   } finally {
//     if (sequelize) {
//       await sequelize.close();
//       console.log(`🔌 DB Connection closed.`);
//     }
//   }
// };