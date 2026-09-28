// const { dbname } = require("../utils/dbconfig");
// const { Sequelize, DataTypes, literal,QueryTypes  } = require("sequelize");
// const { _VecvPurc } = require("../models/VecvPurc");
// const { _VecvSale } = require("../models/VecvSale");
// const { _VecvWart } = require("../models/VecvWart");


// const axios = require('axios');
// const https = require("https");


// require('dotenv').config();

// const fs = require('fs');
// function getLoginUserId(req, body) {
//   return req.user?.id || body.Created_By || null;
// }

// const httpsAgent = new https.Agent({
//     rejectUnauthorized: false,
//     secureProtocol: "TLSv1_2_method",
//     keepAlive: true,
// });
// // 9160

// let G_variable = '5040';

// async function invnoarray(objects) {
//     try {
//         const invoiceNumbersArray = objects.map(bill => bill.InvoiceNo);
//         return invoiceNumbersArray;
//     } catch (e) { console.log(e) }
// }
// async function PurchOrdNoarray(objects) {
//     try {
//         const invoiceNumbersArray = objects.map(bill => bill.PurchOrdNo);
//         return invoiceNumbersArray;
//     } catch (e) { console.log(e) }
// }
// async function ZsalesOrderNoarray(objects) {
//     try {
//         const invoiceNumbersArray = objects.map(bill => bill.ZsalesOrderNo);
//         return invoiceNumbersArray;
//     } catch (e) { console.log(e) }
// }
// function removeObjectsFromArray(array1, array2) {
//     const invoiceNumbersToRemove = array2.map(obj => obj.InvoiceNo);
//     const newArray1 = array1.filter(obj => !invoiceNumbersToRemove.includes(obj.InvoiceNo));
//     return newArray1;
// }
// function removeObjectspurch(array1, array2) {
//     const invoiceNumbersToRemove = array2.map(obj => obj.PurchOrdNo);
//     console.log(invoiceNumbersToRemove)
//     const newArray1 = array1.filter(obj => !invoiceNumbersToRemove.includes(obj.PurchOrdNo));
//     return newArray1;
// }
// function removeObjectsWart(array1, array2) {
//     const invoiceNumbersToRemove = array2.map(obj => obj.ZsalesOrderNo);
//     console.log(invoiceNumbersToRemove)
//     const newArray1 = array1.filter(obj => !invoiceNumbersToRemove.includes(obj.ZsalesOrderNo));
//     return newArray1;
// }
// async function getdatasale(data, compcode) {
//     let sequelize;

//     try {
//         if (!data || data.length === 0) {
//             return "No data received from SAP";
//         }

//         // DEMOT database connect
//         sequelize = await dbname(null, compcode);
//         // Invoice list with quotes
//         const invoiceList = data
//             .map(x => `'${String(x.InvoiceNo).replace(/'/g, "''")}'`)
//             .join(",");

//         const [existing] = await sequelize.query(`
//             SELECT DISTINCT InvoiceNo
//             FROM dbo.VecvSale
//             WHERE InvoiceNo IN (${invoiceList})
//         `);

//         const newData = removeObjectsFromArray(data, existing);

//         console.log("SAP Records      :", data.length);
//         console.log("Already Exists   :", existing.length);
//         console.log("New Records      :", newData.length);

//         return await saleData(newData, compcode);

//     } catch (err) {
//         console.error("getdatasale Error:", err);
//         return {
//             success: false,
//             message: err.message
//         };
//     } finally {
//         if (sequelize) await sequelize.close();
//     }
// }
// const path = require('path')



// async function getdatapurchase(data, compcode) {
//     let sequelize;

//     try {
//         if (!Array.isArray(data) || data.length === 0) {
//             return "No Purchase data received from SAP";
//         }

//         sequelize = await dbname(null, compcode);

//         const purchaseNumbers = data
//             .map((x) => x.PurchOrdNo)
//             .filter(Boolean);

//         if (purchaseNumbers.length === 0) {
//             return "Purchase Order Number not found.";
//         }

//         const purchaseList = purchaseNumbers
//             .map((po) => `'${String(po).replace(/'/g, "''")}'`)
//             .join(",");

//         const [existing] = await sequelize.query(`
//             SELECT DISTINCT PurchOrdNo
//             FROM dbo.Vecv_Purc WITH (NOLOCK)
//             WHERE PurchOrdNo IN (${purchaseList})
//         `);

//         const newData = removeObjectspurch(data, existing);

//         console.log("========== PURCHASE SUMMARY ==========");
//         console.log("SAP Records      :", data.length);
//         console.log("Already Exists   :", existing.length);
//         console.log("New Records      :", newData.length);

//         if (!newData.length) {
//             return "0 new purchase records.";
//         }

//         return await purchaseData(newData, compcode);

//     } catch (error) {
//         console.error("Purchase Sync Error:", error.message);

//         return {
//             success: false,
//             message: error.message
//         };
//     } finally {
//         if (sequelize) await sequelize.close();
//     }
// }


// async function getdatawarranty(data, compcode) {
//     let sequelize;

//     try {
//         if (!Array.isArray(data) || data.length === 0) {
//             return "No Warranty data received from SAP";
//         }

//         sequelize = await dbname(null, compcode);

//         const salesOrders = data
//             .map((x) => x.ZsalesOrderNo)
//             .filter(Boolean);

//         if (!salesOrders.length) {
//             return "Sales Order Number not found.";
//         }

//         const warrantyList = salesOrders
//             .map((x) => `'${String(x).replace(/'/g, "''")}'`)
//             .join(",");

//         const [existing] = await sequelize.query(`
//             SELECT DISTINCT ZsalesOrderNo
//             FROM dbo.VecvWart WITH (NOLOCK)
//             WHERE ZsalesOrderNo IN (${warrantyList})
//         `);

//         const newData = removeObjectsWart(data, existing);

//         console.log("========== WARRANTY SUMMARY ==========");
//         console.log("SAP Records      :", data.length);
//         console.log("Already Exists   :", existing.length);
//         console.log("New Records      :", newData.length);

//         if (!newData.length) {
//             return "0 new warranty records.";
//         }

//         return await warrantyData(newData, compcode);

//     } catch (error) {
//         console.error("Warranty Sync Error:", error.message);

//         return {
//             success: false,
//             message: error.message
//         };
//     } finally {
//         if (sequelize) await sequelize.close();
//     }
// }
// // function trimData(dataArray) {
// // return dataArray.map(item => {
// // const trimmedItem = {};
// // for (const key in item) {
// // trimmedItem[key] = item[key].toString().trim();
// // }
// // return trimmedItem;
// // });
// // }
// async function trimData(dataArray) {
//     return dataArray.map((item) => {
//         const trimmedItem = {};

//         Object.keys(item).forEach((key) => {
//             const value = item[key];

//             if (value === null || value === undefined) {
//                 trimmedItem[key] = null;
//             }
//             // Decimal field should remain number
//             else if (key === "Zquant") {
//                 trimmedItem[key] = Number(value);
//             }
//             else if (typeof value === "string") {
//                 trimmedItem[key] = value.trim();
//             }
//             else {
//                 trimmedItem[key] = value;
//             }
//         });

//         return trimmedItem;
//     });
// }




// async function warrantyData(newData, compcode) {

//     let sequelize;

//     try {

//         sequelize = await dbname(null, compcode);


//         const VecvWart = _VecvWart(sequelize, DataTypes);

//         const trimmedData = await trimData(newData);

//         const CHUNK_SIZE = 200;
//         let inserted = 0;

//         for (let i = 0; i < trimmedData.length; i += CHUNK_SIZE) {

//             const chunk = trimmedData.slice(i, i + CHUNK_SIZE);

//             await VecvWart.bulkCreate(chunk, {
//                 validate: false,
//                 hooks: false,
//                 returning: false
//             });

//             inserted += chunk.length;
//             console.log(`Warranty Inserted ${inserted}/${trimmedData.length}`);
//         }

//         return `${inserted} warranty records inserted`;

//     } catch (error) {

//         console.error("Warranty Insert Error:", error.parent?.message || error.message);

//         throw error;

//     } finally {

//         if (sequelize) await sequelize.close();
//     }
// }


// async function purchaseData(newData, compcode) {
//     let sequelize;

//     try {
//         sequelize = await dbname(null, compcode);

//         const VecvPurc = _VecvPurc(sequelize, DataTypes);

//         const trimmedData = await trimData(newData);

//         const CHUNK_SIZE = 200;
//         let inserted = 0;

//         for (let i = 0; i < trimmedData.length; i += CHUNK_SIZE) {

//             const chunk = trimmedData.slice(i, i + CHUNK_SIZE);

//             await VecvPurc.bulkCreate(chunk, {
//                 validate: false,
//                 hooks: false,
//                 returning: false
//             });

//             inserted += chunk.length;
//             console.log(`Purchase Inserted ${inserted}/${trimmedData.length}`);
//         }

//         return `${inserted} purchase records inserted`;

//     } catch (error) {

//         console.error("Purchase Insert Error:", error.parent?.message || error.message);

//         throw error;

//     } finally {

//         if (sequelize) await sequelize.close();
//     }
// }



// async function saleData(newData, compcode) {


//     let sequelize;

//     try {

//         sequelize = await dbname(null, compcode);

//         const VecvSale = _VecvSale(sequelize, DataTypes);

//         const trimmedData = await trimData(newData);

//         const CHUNK_SIZE = 200;
//         let inserted = 0;

//         for (let i = 0; i < trimmedData.length; i += CHUNK_SIZE) {

//             const chunk = trimmedData.slice(i, i + CHUNK_SIZE);

//             await VecvSale.bulkCreate(chunk, {
//                 validate: false,
//                 hooks: false,
//                 returning: false
//             });

//             inserted += chunk.length;

//             console.log(`Sales Inserted ${inserted}/${trimmedData.length}`);
//         }

//         return `${inserted} sales records inserted`;

//     } catch (error) {

//         console.error("Sale Insert Error:", error.parent?.message || error.message);

//         throw error;

//     } finally {

//         if (sequelize) await sequelize.close();
//     }
// }



// async function myTasksale(item, start, end, compcode) {
//     let date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
//     let datastart = date;

//     if (start && end) {
//         datastart = start;
//         date = end;
//     }

//     console.log("Vehicle Sales task at", new Date());

//     // SAP Filter
//     const filter =
//         `PostingDate ge '${datastart}' and PostingDate le '${date}' and CompanyCode eq '${G_variable}' and SalesType eq '${item}' and Vbeln eq ' '`;

//     // HTTPS URL (SAP URL)
//     const url =
//         `https://udaanmobility.vecv.net/sap/opu/odata/sap/ZAPI_SALES_DATA_SRV_01/ItOutputSet?$filter=${encodeURIComponent(filter)}`;

//     console.log("URL =>", url);
//     console.log("USERNAME =>", process.env.EICHERAPI_USERNAME);

//     try {
//         const response = await axios({
//             method: "GET",
//             url,
//             httpsAgent,
//             timeout: 120000,
//             proxy: false,
//             auth: {
//                 username: process.env.EICHERAPI_USERNAME,
//                 password: process.env.EICHERAPI_PASSWORD,
//             },
//             headers: {
//                 Accept: "application/json, application/xml, application/atom+xml",
//                 "User-Agent": "Autovyn-Eicher-API/1.0",
//             },
//             maxBodyLength: Infinity,
//             maxContentLength: Infinity,
//             validateStatus: (status) => status >= 200 && status < 500,
//         });

//         console.log("STATUS =>", response.status);
//         console.log("CONTENT-TYPE =>", response.headers["content-type"]);

//         // ---------------- JSON Response ----------------
//         if (response.headers["content-type"]?.includes("application/json")) {

//             const xmlData = response.data?.d?.results || [];

//             console.log("TOTAL JSON RECORDS =>", xmlData.length);

//             if (!xmlData.length) {
//                 return {
//                     success: false,
//                     message: "No records found from SAP."
//                 };
//             }

//             return await getdatasale(xmlData, compcode);
//         }

//         // ---------------- XML Response ----------------
//         if (typeof response.data === "string") {

//             console.log("SAP returned XML response.");
//             console.log(response.data.substring(0, 500));

//             return {
//                 success: true,
//                 message: "SAP returned XML response. XML parsing required.",
//                 xml: response.data
//             };
//         }

//         return {
//             success: false,
//             message: "Unknown response received from SAP.",
//             data: response.data
//         };

//     } catch (error) {

//         console.error("========== SALES API ERROR ==========");
//         console.error("Code:", error.code);
//         console.error("Message:", error.message);
//         console.error("Status:", error.response?.status);
//         console.error("Data:", error.response?.data);

//         return {
//             success: false,
//             error: error.code || "UNKNOWN_ERROR",
//             message: error.message || "Request failed"
//         };
//     }
// }

// async function myTaskPurchase(item, start, end, compcode) {

//     let date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
//     let datastart = date;

//     if (start && end) {
//         datastart = start;
//         date = end;
//     }

//     console.log("Purchase task at", new Date());

//     const filter =
//         `GrDate ge '${datastart}' and GrDate le '${date}' and PurchType eq '${item}' and CompanyCode eq '${G_variable}'`;

//     const url =
//         `https://udaanmobility.vecv.net/sap/opu/odata/sap/ZODATA_PURCHASE_SRV/ItOutputSet?$format=json&$filter=${encodeURIComponent(filter)}`;

//     console.log("URL =>", url);

//     try {

//         const response = await axios({
//             method: "GET",
//             url,
//             httpsAgent,
//             timeout: 120000,
//             proxy: false,
//             auth: {
//                 username: process.env.EICHERAPI_USERNAME,
//                 password: process.env.EICHERAPI_PASSWORD
//             },
//             headers: {
//                 Accept: "application/json"
//             }
//         });

//         const records = response.data?.d?.results || [];

//         console.log("Purchase Records :", records.length);

//         return await getdatapurchase(records, compcode);

//     } catch (error) {

//         console.error("Purchase API Error:", error.response?.status, error.message);

//         return {
//             success: false,
//             message: error.message
//         };
//     }
// }



// async function myTaskwarranty(start, end, compcode) {

//     let date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
//     let datastart = date;

//     if (start && end) {
//         datastart = start;
//         date = end;
//     }

//     console.log("Warranty task at", new Date());

//     const filter =
//         `Zdate ge '${datastart}' and Zdate le '${date}' and ZclaimNo eq '' and Zbukrs eq 'C001'`;

//     const url =
//         `https://udaanmobility.vecv.net/sap/opu/odata/sap/ZAPI_WARRANTY_DETAILS_SRV/ET_DATASet?$format=json&$filter=${encodeURIComponent(filter)}`;

//     console.log("URL =>", url);

//     try {

//         const response = await axios({
//             method: "GET",
//             url,
//             httpsAgent,
//             timeout: 120000,
//             proxy: false,
//             auth: {
//                 username: process.env.EICHERAPI_USERNAME,
//                 password: process.env.EICHERAPI_PASSWORD
//             },
//             headers: {
//                 Accept: "application/json"
//             }
//         });

//         const records = response.data?.d?.results || [];

//         console.log("Warranty Records :", records.length);

//         return await getdatawarranty(records, compcode);

//     } catch (error) {

//         console.error("Warranty API Error:", error.response?.status, error.message);

//         return {
//             success: false,
//             message: error.message
//         };
//     }
// }

// // Schedule the task to run every 1 hour (adjust the interval as needed)
// // const intervalInMilliseconds = 60 * 2000; // 1 minute
// // const scheduler = setInterval(alltask, intervalInMilliseconds);

// let sequence = 1, loopcomplete = 0;

// async function alltask(req) {
//      const compcode = req.headers.compcode?.trim();

//         if (!compcode) {
//             return res.status(400).json({
//                 success: false,
//                 message: "compcode header is required."
//             });
//         }

//     console.log("Company Code :", G_variable);

//     if (sequence) {

//         loopcomplete = 0;

//         console.log(await myTasksale("01"));
//         console.log(await myTasksale("03"));
//         console.log(await myTasksale("04"));

//         console.log(await myTaskPurchase("1"));
//         console.log(await myTaskPurchase("2"));

//         // console.log(await myTaskwarranty());

//         let sequelize;

//         try {

//             sequelize = await dbname(null, compcode);

//             const [rows] = await sequelize.query(`EXEC EicherApiToDmsRowData`);

//             console.log("Procedure Executed.", rows.length);

//         } catch (error) {

//             console.error("Procedure Error :", error.message);

//         } finally {

//             if (sequelize) await sequelize.close();
//         }

//         loopcomplete = 1;
//     }

//     setTimeout(alltask, 30 * 5000);
// }
// // alltask();


// exports.datarefresh = async function (req, res) {
//     const data = req.body;
//     let message = 'Enter date';

//     if (!req.body.startDate || req.body.startDate == '') {
//         return res.send({ message: message });
//     }
//     if (!req.body.endDate || req.body.endDate == '') {
//         return res.send({ message: message });
//     }
//     console.log('Received data:', data);
//     const loopIteration = async () => {
//         console.log(`Loop iteration , Flag:`);
//         await new Promise(resolve => setTimeout(resolve, 3000));
//     };
//     while (loopcomplete !== 1) {
//         await loopIteration();
//     }
//     console.log('loop nikl gya ')
//     const start = data.startDate.split("-").join("");
//     const end = data.endDate.split("-").join("");
//     try {
//         switch (data.buttonId) {
//             case 'VEHICLE_PURCHASE':
//                 message = await myTaskPurchase('1', start, end, compcode)
//                 sequence = 1;
//                 break;
//             case 'SPARE_PARTS_PURCHASE':
//                 message = await myTaskPurchase('2', start, end, compcode);
//                 sequence = 1;
//                 break;
//             case 'Vehicle_Sales':
//                 message = await myTasksale('01', start, end, compcode);
//                 sequence = 1;
//                 break;
//             case 'Counter_Sales':
//                 message = await myTasksale('04', start, end, compcode)
//                 sequence = 1;
//                 break;
//             case 'Workshop_Sales':
//                 message = await myTasksale('03', start, end, compcode);
//                 sequence = 1;
//                 break;
//             case 'warranty':
//                 message = await myTaskwarranty(start, end, compcode);
//                 sequence = 1;
//                 break;
//             default:
//                 sequence = 1;
//                 console.log("Unknown button clicked");
//         }
//         console.log("message:", message);
//         res.send({ message: message });

//     } catch (error) {
//         // Log the error for debugging purposes
//         console.error('Error:', error);

//         // Return an error response
//         res.status(500).json({ success: false, message: 'An error occurred while processing the request.' });
//     }
// }


// exports.syncVecvData = async (req, res) => {
//     try {
//         const { buttonId, startDate, endDate } = req.body;

//         // Header se Company Code
//         const compcode = req.headers.compcode?.trim();

//         if (!compcode) {
//             return res.status(400).json({
//                 success: false,
//                 message: "compcode header is required."
//             });
//         }

//         if (!buttonId || !startDate || !endDate) {
//             return res.status(400).json({
//                 success: false,
//                 message: "buttonId, startDate and endDate are required."
//             });
//         }

//         const start = startDate.replace(/-/g, "");
//         const end = endDate.replace(/-/g, "");

//         let result;

//         switch (buttonId) {
//             case "VEHICLE_PURCHASE":
//                 result = await myTaskPurchase("1", start, end, compcode);
//                 break;

//             case "SPARE_PARTS_PURCHASE":
//                 result = await myTaskPurchase("2", start, end, compcode);
//                 break;

//             case "Vehicle_Sales":
//                 result = await myTasksale("01", start, end, compcode);
//                 break;

//             case "Workshop_Sales":
//                 result = await myTasksale("03", start, end, compcode);
//                 break;

//             case "Counter_Sales":
//                 result = await myTasksale("04", start, end, compcode);
//                 break;

//             case "warranty":
//                 result = await myTaskwarranty(start, end, compcode);
//                 break;

//             default:
//                 return res.status(400).json({
//                     success: false,
//                     message: "Invalid buttonId."
//                 });
//         }

//         if (typeof result === "object" && result.success === false) {
//             return res.status(500).json(result);
//         }

//         return res.status(200).json({
//             success: true,
//             compcode,
//             buttonId,
//             startDate,
//             endDate,
//             message: result
//         });

//     } catch (error) {
//         console.error("Eicher Sync Error:", error);

//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };




// // ══════════════════════════════════════════════════════════
// // ✅ CREATE - Eicher Config
// // ══════════════════════════════════════════════════════════
// exports.createEicherConfig = async function (req, res) {
//   let sequelize;

//   try {
//     sequelize = await dbname(
//       req,
//       req.headers.compcode
//     );

//     const body = req.body || {};

//     // ── Required Field Validations ──────────────────────────
//     if (!body.User_Name) {
//       return res.status(400).send({
//         success: false,
//         message: "User_Name is required",
//       });
//     }

//     // ── Optional Field Validations ──────────────────────────
//     if (body.Godw_Code !== undefined && body.Godw_Code !== null) {
//       const godwCode = parseInt(body.Godw_Code);
//       if (isNaN(godwCode) || godwCode < 0) {
//         return res.status(400).send({
//           success: false,
//           message: "Godw_Code must be a valid non-negative number",
//         });
//       }
//     }

//     // ── Duplicate Check (same DBM_Code + User_Name) ─────────
//     const existing = await sequelize.query(
//       `SELECT TOP 1 UTD, User_Name, DBM_Code
//        FROM Vecv_Config
//        WHERE User_Name = :User_Name
//          AND DBM_Code  = :DBM_Code`,
//       {
//         replacements: {
//           User_Name: String(body.User_Name).trim(),
//           DBM_Code: body.DBM_Code
//             ? String(body.DBM_Code).trim()
//             : null,
//         },
//         type: QueryTypes.SELECT,
//       }
//     );

//     if (existing.length > 0) {
//       return res.status(409).send({
//         success: false,
//         message: "Eicher config with same User_Name and DBM_Code already exists",
//         data: {
//           UTD: existing[0].UTD,
//           User_Name: existing[0].User_Name,
//           DBM_Code: existing[0].DBM_Code,
//         },
//       });
//     }

//     // ── Insert Query ────────────────────────────────────────
//     const result = await sequelize.query(
//       `INSERT INTO Vecv_Config
//       (
//         DBM_Code,
//         User_Name,
//         User_Pass,
//         Godw_Code,
//         Created_By,
//         Created_At
//       )
//       OUTPUT INSERTED.UTD
//       VALUES
//       (
//         :DBM_Code,
//         :User_Name,
//         :User_Pass,
//         :Godw_Code,
//         :Created_By,
//         GETDATE()
//       )`,
//       {
//         replacements: {
//           DBM_Code: body.DBM_Code
//             ? String(body.DBM_Code).trim()
//             : null,
//           User_Name: String(body.User_Name).trim(),
//           User_Pass: body.User_Pass
//             ? String(body.User_Pass).trim()
//             : null,
//           Godw_Code: body.Godw_Code !== undefined
//             ? parseInt(body.Godw_Code)
//             : null,
//           Created_By: getLoginUserId(req, body),
//         },
//         type: QueryTypes.SELECT,
//       }
//     );

//     return res.status(200).send({
//       success: true,
//       message: "Eicher config created successfully",
//       data: {
//         UTD: result[0]?.UTD,
//       },
//     });
//   } catch (error) {
//     console.error("Create Eicher Config Error:", error);

//     return res.status(500).send({
//       success: false,
//       message: "Internal Server Error",
//       error: error.message,
//     });
//   } finally {
//     if (sequelize) {
//       await sequelize.close();
//     }
//   }
// };


// // ══════════════════════════════════════════════════════════
// // ✅ GET - Eicher Config
// // ══════════════════════════════════════════════════════════
// exports.getEicherConfig = async function (req, res) {
//   let sequelize;

//   try {
//     sequelize = await dbname(
//       req,
//       req.headers.compcode
//     );

//     const query  = req.query  || {};
//     const params = req.params || {};

//     // ── UTD se single record ────────────────────────────────
//     if (params.UTD || query.UTD) {
//       const UTD = parseInt(params.UTD || query.UTD);

//       if (isNaN(UTD) || UTD <= 0) {
//         return res.status(400).send({
//           success: false,
//           message: "UTD must be a valid positive number",
//         });
//       }

//       const record = await sequelize.query(
//         `SELECT
//             UTD,
//             DBM_Code,
//             User_Name,
//             User_Pass,
//             Godw_Code,
//             Created_By,
//             Created_At
//          FROM Vecv_Config
//          WHERE UTD = :UTD`,
//         {
//           replacements: { UTD },
//           type: QueryTypes.SELECT,
//         }
//       );

//       if (record.length === 0) {
//         return res.status(404).send({
//           success: false,
//           message: "Eicher config not found",
//         });
//       }

//       return res.status(200).send({
//         success: true,
//         message: "Eicher config fetched successfully",
//         data: record[0],
//       });
//     }

//     // ── Filters with All Records ────────────────────────────
//     let whereClause = `WHERE 1=1`;
//     const replacements = {};

//     if (query.DBM_Code) {
//       whereClause += ` AND DBM_Code = :DBM_Code`;
//       replacements.DBM_Code = String(query.DBM_Code).trim();
//     }

//     if (query.User_Name) {
//       whereClause += ` AND User_Name LIKE :User_Name`;
//       replacements.User_Name = `%${String(query.User_Name).trim()}%`;
//     }

//     if (query.Godw_Code) {
//       const godwCode = parseInt(query.Godw_Code);
//       if (isNaN(godwCode) || godwCode < 0) {
//         return res.status(400).send({
//           success: false,
//           message: "Godw_Code must be a valid non-negative number",
//         });
//       }
//       whereClause += ` AND Godw_Code = :Godw_Code`;
//       replacements.Godw_Code = godwCode;
//     }

//     const records = await sequelize.query(
//       `SELECT
//           UTD,
//           DBM_Code,
//           User_Name,
//           User_Pass,
//           Godw_Code,
//           Created_By,
//           Created_At
//        FROM Vecv_Config
//        ${whereClause}
//        ORDER BY UTD DESC`,
//       {
//         replacements,
//         type: QueryTypes.SELECT,
//       }
//     );

//     return res.status(200).send({
//       success: true,
//       message: "Eicher config list fetched successfully",
//       total: records.length,
//       data: records,
//     });
//   } catch (error) {
//     console.error("Get Eicher Config Error:", error);

//     return res.status(500).send({
//       success: false,
//       message: "Internal Server Error",
//       error: error.message,
//     });
//   } finally {
//     if (sequelize) {
//       await sequelize.close();
//     }
//   }
// };


const { dbname } = require("../utils/dbconfig");
const { Sequelize, DataTypes, literal, QueryTypes } = require("sequelize");
const { _VecvPurc } = require("../models/VecvPurc");
const { _VecvSale } = require("../models/VecvSale");
const { _VecvWart } = require("../models/VecvWart");

const axios = require('axios');
const https = require("https");

require('dotenv').config();

const fs = require('fs');
const path = require('path');

function getLoginUserId(req, body) {
    return req.user?.id || body.Created_By || null;
}

const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
    secureProtocol: "TLSv1_2_method",
    keepAlive: true,
});

// ════════════════════════════════════════════════════════
// ✅ Har Dealer ki DB se Vecv_Config fetch karo
// ════════════════════════════════════════════════════════
async function getActiveVecvConfigs(sequelize) {
    try {
        const configs = await sequelize.query(
            `SELECT 
                UTD,
                DBM_Code,
                User_Name,
                User_Pass,
                Godw_Code,
                Export_Type
             FROM dbo.Vecv_Config
             WHERE (Export_Type IS NULL OR Export_Type < 33)
               AND DBM_Code IS NOT NULL
               AND User_Name IS NOT NULL`,
            { type: QueryTypes.SELECT }
        );
        return configs;
    } catch (err) {
        console.error("getActiveVecvConfigs Error:", err.message);
        return [];
    }
}

// ════════════════════════════════════════════════════════
// ✅ Helper Functions
// ════════════════════════════════════════════════════════
function removeObjectsFromArray(array1, array2) {
    const invoiceNumbersToRemove = array2.map(obj => obj.InvoiceNo);
    return array1.filter(obj => !invoiceNumbersToRemove.includes(obj.InvoiceNo));
}

function removeObjectspurch(array1, array2) {
    const invoiceNumbersToRemove = array2.map(obj => obj.PurchOrdNo);
    return array1.filter(obj => !invoiceNumbersToRemove.includes(obj.PurchOrdNo));
}

function removeObjectsWart(array1, array2) {
    const invoiceNumbersToRemove = array2.map(obj => obj.ZsalesOrderNo);
    return array1.filter(obj => !invoiceNumbersToRemove.includes(obj.ZsalesOrderNo));
}

// ════════════════════════════════════════════════════════
// ✅ trimData
// ════════════════════════════════════════════════════════
async function trimData(dataArray) {
    return dataArray.map((item) => {
        const trimmedItem = {};
        Object.keys(item).forEach((key) => {
            const value = item[key];
            if (value === null || value === undefined) {
                trimmedItem[key] = null;
            } else if (key === "Zquant") {
                trimmedItem[key] = Number(value);
            } else if (typeof value === "string") {
                trimmedItem[key] = value.trim();
            } else {
                trimmedItem[key] = value;
            }
        });
        return trimmedItem;
    });
}

// ════════════════════════════════════════════════════════
// ✅ getdatasale
// ════════════════════════════════════════════════════════
async function getdatasale(data, compcode) {
    let sequelize;
    try {
        if (!data || data.length === 0) {
            return "No data received from SAP";
        }

        sequelize = await dbname(null, compcode);

        const invoiceList = data
            .map(x => `'${String(x.InvoiceNo).replace(/'/g, "''")}'`)
            .join(",");

        const [existing] = await sequelize.query(`
            SELECT DISTINCT InvoiceNo
            FROM dbo.VecvSale
            WHERE InvoiceNo IN (${invoiceList})
        `);

        const newData = removeObjectsFromArray(data, existing);

        console.log("SAP Records      :", data.length);
        console.log("Already Exists   :", existing.length);
        console.log("New Records      :", newData.length);

        return await saleData(newData, compcode);

    } catch (err) {
        console.error("getdatasale Error:", err);
        return { success: false, message: err.message };
    } finally {
        if (sequelize) await sequelize.close();
    }
}

// ════════════════════════════════════════════════════════
// ✅ getdatapurchase
// ════════════════════════════════════════════════════════
async function getdatapurchase(data, compcode) {
    let sequelize;
    try {
        if (!Array.isArray(data) || data.length === 0) {
            return "No Purchase data received from SAP";
        }

        sequelize = await dbname(null, compcode);

        const purchaseNumbers = data.map((x) => x.PurchOrdNo).filter(Boolean);

        if (purchaseNumbers.length === 0) {
            return "Purchase Order Number not found.";
        }

        const purchaseList = purchaseNumbers
            .map((po) => `'${String(po).replace(/'/g, "''")}'`)
            .join(",");

        const [existing] = await sequelize.query(`
            SELECT DISTINCT PurchOrdNo
            FROM dbo.Vecv_Purc WITH (NOLOCK)
            WHERE PurchOrdNo IN (${purchaseList})
        `);

        const newData = removeObjectspurch(data, existing);

        console.log("========== PURCHASE SUMMARY ==========");
        console.log("SAP Records      :", data.length);
        console.log("Already Exists   :", existing.length);
        console.log("New Records      :", newData.length);

        if (!newData.length) {
            return "0 new purchase records.";
        }

        return await purchaseData(newData, compcode);

    } catch (error) {
        console.error("Purchase Sync Error:", error.message);
        return { success: false, message: error.message };
    } finally {
        if (sequelize) await sequelize.close();
    }
}

// ════════════════════════════════════════════════════════
// ✅ getdatawarranty
// ════════════════════════════════════════════════════════
async function getdatawarranty(data, compcode) {
    let sequelize;
    try {
        if (!Array.isArray(data) || data.length === 0) {
            return "No Warranty data received from SAP";
        }

        sequelize = await dbname(null, compcode);

        const salesOrders = data.map((x) => x.ZsalesOrderNo).filter(Boolean);

        if (!salesOrders.length) {
            return "Sales Order Number not found.";
        }

        const warrantyList = salesOrders
            .map((x) => `'${String(x).replace(/'/g, "''")}'`)
            .join(",");

        const [existing] = await sequelize.query(`
            SELECT DISTINCT ZsalesOrderNo
            FROM dbo.VecvWart WITH (NOLOCK)
            WHERE ZsalesOrderNo IN (${warrantyList})
        `);

        const newData = removeObjectsWart(data, existing);

        console.log("========== WARRANTY SUMMARY ==========");
        console.log("SAP Records      :", data.length);
        console.log("Already Exists   :", existing.length);
        console.log("New Records      :", newData.length);

        if (!newData.length) {
            return "0 new warranty records.";
        }

        return await warrantyData(newData, compcode);

    } catch (error) {
        console.error("Warranty Sync Error:", error.message);
        return { success: false, message: error.message };
    } finally {
        if (sequelize) await sequelize.close();
    }
}

// ════════════════════════════════════════════════════════
// ✅ Bulk Insert - warrantyData
// ════════════════════════════════════════════════════════
async function warrantyData(newData, compcode) {
    let sequelize;
    try {
        sequelize = await dbname(null, compcode);
        const VecvWart = _VecvWart(sequelize, DataTypes);
        const trimmedData = await trimData(newData);
        const CHUNK_SIZE = 200;
        let inserted = 0;

        for (let i = 0; i < trimmedData.length; i += CHUNK_SIZE) {
            const chunk = trimmedData.slice(i, i + CHUNK_SIZE);
            await VecvWart.bulkCreate(chunk, {
                validate: false,
                hooks: false,
                returning: false
            });
            inserted += chunk.length;
            console.log(`Warranty Inserted ${inserted}/${trimmedData.length}`);
        }

        return `${inserted} warranty records inserted`;

    } catch (error) {
        console.error("Warranty Insert Error:", error.parent?.message || error.message);
        throw error;
    } finally {
        if (sequelize) await sequelize.close();
    }
}

// ════════════════════════════════════════════════════════
// ✅ Bulk Insert - purchaseData
// ════════════════════════════════════════════════════════
async function purchaseData(newData, compcode) {
    let sequelize;
    try {
        sequelize = await dbname(null, compcode);
        const VecvPurc = _VecvPurc(sequelize, DataTypes);
        const trimmedData = await trimData(newData);
        const CHUNK_SIZE = 200;
        let inserted = 0;

        for (let i = 0; i < trimmedData.length; i += CHUNK_SIZE) {
            const chunk = trimmedData.slice(i, i + CHUNK_SIZE);
            await VecvPurc.bulkCreate(chunk, {
                validate: false,
                hooks: false,
                returning: false
            });
            inserted += chunk.length;
            console.log(`Purchase Inserted ${inserted}/${trimmedData.length}`);
        }

        return `${inserted} purchase records inserted`;

    } catch (error) {
        console.error("Purchase Insert Error:", error.parent?.message || error.message);
        throw error;
    } finally {
        if (sequelize) await sequelize.close();
    }
}

// ════════════════════════════════════════════════════════
// ✅ Bulk Insert - saleData
// ════════════════════════════════════════════════════════
async function saleData(newData, compcode) {
    let sequelize;
    try {
        sequelize = await dbname(null, compcode);
        const VecvSale = _VecvSale(sequelize, DataTypes);
        const trimmedData = await trimData(newData);
        const CHUNK_SIZE = 200;
        let inserted = 0;

        for (let i = 0; i < trimmedData.length; i += CHUNK_SIZE) {
            const chunk = trimmedData.slice(i, i + CHUNK_SIZE);
            await VecvSale.bulkCreate(chunk, {
                validate: false,
                hooks: false,
                returning: false
            });
            inserted += chunk.length;
            console.log(`Sales Inserted ${inserted}/${trimmedData.length}`);
        }

        return `${inserted} sales records inserted`;

    } catch (error) {
        console.error("Sale Insert Error:", error.parent?.message || error.message);
        throw error;
    } finally {
        if (sequelize) await sequelize.close();
    }
}

// ════════════════════════════════════════════════════════
// ✅ SAP API - Sales
// ════════════════════════════════════════════════════════
async function myTasksale(item, start, end, compcode, config) {
    let date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    let datastart = date;

    if (start && end) {
        datastart = start;
        date = end;
    }

    const G_variable = config.DBM_Code;
    const SAP_USER   = config.User_Name;
    const SAP_PASS   = config.User_Pass;

    console.log(`\n[Sales] DBM_Code: ${G_variable} | Comp_DB: ${compcode} | Type: ${item} | ${datastart} → ${date}`);

    const filter =
        `PostingDate ge '${datastart}' and PostingDate le '${date}' and CompanyCode eq '${G_variable}' and SalesType eq '${item}' and Vbeln eq ' '`;

    const url =
        `https://udaanmobility.vecv.net/sap/opu/odata/sap/ZAPI_SALES_DATA_SRV_01/ItOutputSet?$filter=${encodeURIComponent(filter)}`;

    console.log("URL =>", url);

    try {
        const response = await axios({
            method: "GET",
            url,
            httpsAgent,
            timeout: 120000,
            proxy: false,
            auth: {
                username: SAP_USER,
                password: SAP_PASS,
            },
            headers: {
                Accept: "application/json, application/xml, application/atom+xml",
                "User-Agent": "Autovyn-Eicher-API/1.0",
            },
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
            validateStatus: (status) => status >= 200 && status < 500,
        });

        console.log("STATUS =>", response.status);
        console.log("CONTENT-TYPE =>", response.headers["content-type"]);

        if (response.headers["content-type"]?.includes("application/json")) {
            const xmlData = response.data?.d?.results || [];
            console.log("TOTAL JSON RECORDS =>", xmlData.length);

            if (!xmlData.length) {
                return { success: false, message: "No records found from SAP." };
            }

            return await getdatasale(xmlData, compcode);
        }

        if (typeof response.data === "string") {
            console.log("SAP returned XML response.");
            return {
                success: true,
                message: "SAP returned XML response. XML parsing required.",
            };
        }

        return { success: false, message: "Unknown response received from SAP." };

    } catch (error) {
        console.error("SALES API ERROR:", error.code, error.message);
        return {
            success: false,
            error: error.code || "UNKNOWN_ERROR",
            message: error.message || "Request failed"
        };
    }
}

// ════════════════════════════════════════════════════════
// ✅ SAP API - Purchase
// ════════════════════════════════════════════════════════
async function myTaskPurchase(item, start, end, compcode, config) {
    let date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    let datastart = date;

    if (start && end) {
        datastart = start;
        date = end;
    }

    const G_variable = config.DBM_Code;
    const SAP_USER   = config.User_Name;
    const SAP_PASS   = config.User_Pass;

    console.log(`\n[Purchase] DBM_Code: ${G_variable} | Comp_DB: ${compcode} | Type: ${item} | ${datastart} → ${date}`);

    const filter =
        `GrDate ge '${datastart}' and GrDate le '${date}' and PurchType eq '${item}' and CompanyCode eq '${G_variable}'`;

    const url =
        `https://udaanmobility.vecv.net/sap/opu/odata/sap/ZODATA_PURCHASE_SRV/ItOutputSet?$format=json&$filter=${encodeURIComponent(filter)}`;

    console.log("URL =>", url);

    try {
        const response = await axios({
            method: "GET",
            url,
            httpsAgent,
            timeout: 120000,
            proxy: false,
            auth: {
                username: SAP_USER,
                password: SAP_PASS
            },
            headers: { Accept: "application/json" }
        });

        const records = response.data?.d?.results || [];
        console.log("Purchase Records :", records.length);

        return await getdatapurchase(records, compcode);

    } catch (error) {
        console.error("Purchase API Error:", error.response?.status, error.message);
        return { success: false, message: error.message };
    }
}

// ════════════════════════════════════════════════════════
// ✅ SAP API - Warranty
// ════════════════════════════════════════════════════════
async function myTaskwarranty(start, end, compcode, config) {
    let date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    let datastart = date;

    if (start && end) {
        datastart = start;
        date = end;
    }

    const SAP_USER = config.User_Name;
    const SAP_PASS = config.User_Pass;

    console.log(`\n[Warranty] CompCode: ${compcode} | ${datastart} → ${date}`);

    const filter =
        `Zdate ge '${datastart}' and Zdate le '${date}' and ZclaimNo eq '' and Zbukrs eq 'C001'`;

    const url =
        `https://udaanmobility.vecv.net/sap/opu/odata/sap/ZAPI_WARRANTY_DETAILS_SRV/ET_DATASet?$format=json&$filter=${encodeURIComponent(filter)}`;

    console.log("URL =>", url);

    try {
        const response = await axios({
            method: "GET",
            url,
            httpsAgent,
            timeout: 120000,
            proxy: false,
            auth: {
                username: SAP_USER,
                password: SAP_PASS
            },
            headers: { Accept: "application/json" }
        });

        const records = response.data?.d?.results || [];
        console.log("Warranty Records :", records.length);

        return await getdatawarranty(records, compcode);

    } catch (error) {
        console.error("Warranty API Error:", error.response?.status, error.message);
        return { success: false, message: error.message };
    }
}

// ════════════════════════════════════════════════════════════════════════
// ✅ MAIN SCHEDULER
// runPlanDateReminder jaisa pattern
// DBCON → DLR_SCH → Har Dealer ki DB → Vecv_Config → Tasks
// ════════════════════════════════════════════════════════════════════════
let schedulerRunning = false;

async function runVecvScheduler(param1 = null, param2 = null) {

    const isExpress = !!(
        param1 &&
        typeof param1 === "object" &&
        param1.headers &&
        param2 &&
        typeof param2.send === "function"
    );

    const req = isExpress ? param1 : null;
    const res = isExpress ? param2 : null;

    const singleCompCode = isExpress
        ? (req.query?.compcode || req.headers?.compcode || null)
        : null;

    const start = isExpress
        ? (req.query?.startDate || req.body?.startDate || null)
        : (typeof param1 === "string" ? param1 : null);

    const end = isExpress
        ? (req.query?.endDate || req.body?.endDate || null)
        : (typeof param2 === "string" ? param2 : null);

    if (schedulerRunning) {
        console.log("⚠️  Scheduler already running. Skipping this cycle.");
        if (isExpress) {
            return res.status(200).json({
                success: true,
                message: "Scheduler already running. Skipping this cycle.",
            });
        }
        return;
    }

    schedulerRunning = true;

    console.log("\n========================================");
    console.log("🚀 VECV Scheduler Started:", new Date().toLocaleString());
    console.log("========================================");

    const executionSummary = {
        dealersProcessed: 0,
        totalConfigsFound: 0,
        successConfigs: 0,
        failedConfigs: 0,
        errors: [],
    };

    let sequelize1;

    try {
        sequelize1 = await dbname(
            { query: "", headers: { compcode: "DBCON", name: "scheduler" } },
            "DBCON"
        );

        let Dlr_data = [];

        if (singleCompCode) {
            Dlr_data = [{ Dlr_Id: singleCompCode }];
            console.log(`\n🎯 Single Dealer Mode: ${singleCompCode}`);
        } else {

            // ✅ Fix 1: DISTINCT + LOWER se duplicates hatao
            [Dlr_data] = await sequelize1.query(
                `SELECT DISTINCT 
                    LOWER(LTRIM(RTRIM(Dlr_Id))) AS Dlr_Id
                 FROM DLR_SCH
                 WHERE SCH_TYPE = 'Vecv-Sync' 
                 AND export_type < 3
                 ORDER BY Dlr_Id`
            );

            console.log(`\n📋 Total Unique Dealers: ${Dlr_data.length}`);
        }

        if (!Dlr_data || !Dlr_data.length) {
            console.log("ℹ️  No active dealers found.");
            if (isExpress) {
                return res.status(200).json({
                    success: true,
                    message: "No active dealers found",
                    summary: executionSummary,
                });
            }
            return executionSummary;
        }

        // ── Har Dealer process karo ──────────────────────────
        for (const dealer of Dlr_data) {

            const compcode = dealer.Dlr_Id;

            console.log(`\n----------------------------------------`);
            console.log(`🏢 Processing Dealer: ${compcode}`);
            console.log(`----------------------------------------`);

            let dealerSequelize;

            try {
                // ✅ Fix 2: DB connect fail ho to quietly skip karo
                try {
                    dealerSequelize = await dbname(
                        { query: "", headers: { compcode, name: "scheduler" } },
                        compcode
                    );
                } catch (connectErr) {
                    // dbconfig mein registered nahi → skip
                    console.log(`⏭️  Skip ${compcode}: Not registered in dbconfig`);
                    continue;
                }

                const configs = await getActiveVecvConfigs(dealerSequelize);

                console.log(`📋 Vecv_Config found for ${compcode}: ${configs.length}`);

                if (!configs || configs.length === 0) {
                    console.log(`⏭️  Skip ${compcode}: No active Vecv_Config`);
                    continue;
                }

                executionSummary.dealersProcessed++;
                executionSummary.totalConfigsFound += configs.length;

                // ── Har Config ke liye tasks chalao ───────────
                for (const config of configs) {

                    const dbmCode = config.DBM_Code;

                    console.log(`\n🔧 DBM_Code: ${dbmCode} | User: ${config.User_Name}`);

                    const configLog = {
                        compcode,
                        DBM_Code: dbmCode,
                        User_Name: config.User_Name,
                        results: {},
                        errors: [],
                    };

                    try {
                        // ── Sales Tasks ────────────────────────
                        console.log("\n📦 [Vehicle Sales - 01]");
                        const sale01 = await myTasksale("01", start, end, compcode, config);
                        console.log("Result:", sale01);
                        configLog.results.sale_01 = sale01;

                        console.log("\n📦 [Workshop Sales - 03]");
                        const sale03 = await myTasksale("03", start, end, compcode, config);
                        console.log("Result:", sale03);
                        configLog.results.sale_03 = sale03;

                        console.log("\n📦 [Counter Sales - 04]");
                        const sale04 = await myTasksale("04", start, end, compcode, config);
                        console.log("Result:", sale04);
                        configLog.results.sale_04 = sale04;

                        // ── Purchase Tasks ─────────────────────
                        console.log("\n🛒 [Vehicle Purchase - 1]");
                        const purch1 = await myTaskPurchase("1", start, end, compcode, config);
                        console.log("Result:", purch1);
                        configLog.results.purchase_1 = purch1;

                        console.log("\n🛒 [Spare Parts Purchase - 2]");
                        const purch2 = await myTaskPurchase("2", start, end, compcode, config);
                        console.log("Result:", purch2);
                        configLog.results.purchase_2 = purch2;

                        // ✅ Fix 3: Warranty Task ADD KARO
                        console.log("\n🔰 [Warranty]");
                        const wart = await myTaskwarranty(start, end, compcode, config);
                        console.log("Result:", wart);
                        configLog.results.warranty = wart;

                        // ── Stored Procedure ───────────────────
                        // ✅ Fix 4: Procedure exist check karo
                        let procSequelize;
                        try {
                            procSequelize = await dbname(
                                { query: "", headers: { compcode, name: "scheduler" } },
                                compcode
                            );

                            const [procCheck] = await procSequelize.query(`
                                SELECT COUNT(*) AS cnt
                                FROM INFORMATION_SCHEMA.ROUTINES
                                WHERE ROUTINE_NAME = 'EicherApiToDmsRowData'
                                  AND ROUTINE_TYPE = 'PROCEDURE'
                            `);

                            if (procCheck[0]?.cnt > 0) {
                                const [rows] = await procSequelize.query(
                                    `EXEC EicherApiToDmsRowData`
                                );
                                console.log(`\n⚙️  Procedure Done. Rows: ${rows.length}`);
                                configLog.results.procedure = `${rows.length} rows`;
                            } else {
                                // ✅ Quietly skip - error nahi
                                console.log(`⚠️  Procedure not found in ${compcode}. Skipping.`);
                                configLog.results.procedure = "not found - skipped";
                            }

                        } catch (procErr) {
                            console.error(`Procedure Error:`, procErr.message);
                            configLog.errors.push({ procedure: procErr.message });
                        } finally {
                            if (procSequelize) {
                                try { await procSequelize.close(); } catch (_) {}
                            }
                        }

                        executionSummary.successConfigs++;

                    } catch (configErr) {
                        console.error(`❌ Config Error [${dbmCode}]:`, configErr.message);
                        configLog.errors.push({ general: configErr.message });
                        executionSummary.failedConfigs++;
                    }

                } // config loop

            } catch (dealerErr) {
                console.error(`❌ Dealer Error [${compcode}]:`, dealerErr.message);
                executionSummary.errors.push({ compcode, error: dealerErr.message });
            } finally {
                if (dealerSequelize) {
                    try { await dealerSequelize.close(); } catch (_) {}
                }
            }

        } // dealer loop

    } catch (globalErr) {
        executionSummary.errors.push({ global: globalErr.message });
        console.error("❌ Global Scheduler Error:", globalErr.message);

        if (isExpress) {
            return res.status(500).json({
                success: false,
                message: "Failed to run VECV Scheduler",
                error: globalErr.message,
                summary: executionSummary,
            });
        }
    } finally {
        if (sequelize1) {
            try { await sequelize1.close(); } catch (_) {}
        }
        schedulerRunning = false;
    }

    console.log("\n========================================");
    console.log("✅ VECV Scheduler Completed:", new Date().toLocaleString());
    console.log(`   Dealers Processed : ${executionSummary.dealersProcessed}`);
    console.log(`   Total Configs     : ${executionSummary.totalConfigsFound}`);
    console.log(`   Success           : ${executionSummary.successConfigs}`);
    console.log(`   Failed            : ${executionSummary.failedConfigs}`);
    console.log("========================================\n");

    if (isExpress) {
        return res.status(200).json({
            success: true,
            message: "VECV Scheduler executed successfully",
            summary: executionSummary,
        });
    }

    return executionSummary;
}

// ════════════════════════════════════════════════════════
// ✅ Auto Scheduler Loop - 150 seconds
// ════════════════════════════════════════════════════════
let schedulerTimer = null;

function startVecvSchedulerLoop() {
    console.log("⏰ VECV Scheduler Loop Started (every 150 seconds)");

    const loop = async () => {
        try {
            await runVecvScheduler();
        } catch (err) {
            console.error("Scheduler Loop Error:", err.message);
        } finally {
            // ✅ Run khatam hone ke baad reschedule
            schedulerTimer = setTimeout(loop, 150 * 1000);
        }
    };

    // First run immediately
    loop();
}

function stopVecvSchedulerLoop() {
    if (schedulerTimer) {
        clearTimeout(schedulerTimer);
        schedulerTimer = null;
        console.log("🛑 VECV Scheduler Loop Stopped.");
    }
}

// ════════════════════════════════════════════════════════
// ✅ syncVecvData - Manual Trigger (Express Route)
// ════════════════════════════════════════════════════════
exports.syncVecvData = async (req, res) => {
    try {
        const { buttonId, startDate, endDate } = req.body;
        const compcode = req.headers.compcode?.trim();

        if (!compcode) {
            return res.status(400).json({
                success: false,
                message: "compcode header is required."
            });
        }

        if (!buttonId || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "buttonId, startDate and endDate are required."
            });
        }

        const start = startDate.replace(/-/g, "");
        const end   = endDate.replace(/-/g, "");

        // ── Dealer ki DB se Config fetch karo ────────────────
        let dealerSequelize;
        let config;

        try {
            dealerSequelize = await dbname(
                { query: "", headers: { compcode, name: "manual-sync" } },
                compcode
            );

            const configs = await getActiveVecvConfigs(dealerSequelize);
            config = configs[0]; // First active config use karo

        } catch (cfgErr) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch config: " + cfgErr.message
            });
        } finally {
            if (dealerSequelize) await dealerSequelize.close();
        }

        if (!config) {
            return res.status(404).json({
                success: false,
                message: `No active Vecv_Config found for compcode: ${compcode}`
            });
        }

        console.log(`\n🔧 Manual Sync | compcode: ${compcode} | DBM_Code: ${config.DBM_Code} | buttonId: ${buttonId}`);

        let result;

        switch (buttonId) {
            case "VEHICLE_PURCHASE":
                result = await myTaskPurchase("1", start, end, compcode, config);
                break;
            case "SPARE_PARTS_PURCHASE":
                result = await myTaskPurchase("2", start, end, compcode, config);
                break;
            case "Vehicle_Sales":
                result = await myTasksale("01", start, end, compcode, config);
                break;
            case "Workshop_Sales":
                result = await myTasksale("03", start, end, compcode, config);
                break;
            case "Counter_Sales":
                result = await myTasksale("04", start, end, compcode, config);
                break;
            case "warranty":
                result = await myTaskwarranty(start, end, compcode, config);
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: "Invalid buttonId."
                });
        }

        if (typeof result === "object" && result?.success === false) {
            return res.status(500).json(result);
        }

        return res.status(200).json({
            success: true,
            compcode,
            DBM_Code: config.DBM_Code,
            buttonId,
            startDate,
            endDate,
            message: result
        });

    } catch (error) {
        console.error("Eicher Sync Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ════════════════════════════════════════════════════════
// ✅ datarefresh - Legacy Route
// ════════════════════════════════════════════════════════
exports.datarefresh = async function (req, res) {
    const data     = req.body;
    const compcode = req.headers.compcode?.trim();
    let message    = 'Enter date';

    if (!compcode) {
        return res.status(400).json({
            success: false,
            message: "compcode header is required."
        });
    }

    if (!req.body.startDate || req.body.startDate === '') {
        return res.send({ message });
    }
    if (!req.body.endDate || req.body.endDate === '') {
        return res.send({ message });
    }

    // ── Dealer ki DB se Config fetch karo ────────────────────
    let dealerSequelize;
    let config;

    try {
        dealerSequelize = await dbname(
            { query: "", headers: { compcode, name: "datarefresh" } },
            compcode
        );

        const configs = await getActiveVecvConfigs(dealerSequelize);
        config = configs[0];

    } catch (cfgErr) {
        return res.status(500).json({
            success: false,
            message: "Config fetch failed: " + cfgErr.message
        });
    } finally {
        if (dealerSequelize) await dealerSequelize.close();
    }

    if (!config) {
        return res.status(404).json({
            success: false,
            message: `No active Vecv_Config found for compcode: ${compcode}`
        });
    }

    const start = data.startDate.split("-").join("");
    const end   = data.endDate.split("-").join("");

    try {
        switch (data.buttonId) {
            case 'VEHICLE_PURCHASE':
                message = await myTaskPurchase('1', start, end, compcode, config);
                break;
            case 'SPARE_PARTS_PURCHASE':
                message = await myTaskPurchase('2', start, end, compcode, config);
                break;
            case 'Vehicle_Sales':
                message = await myTasksale('01', start, end, compcode, config);
                break;
            case 'Counter_Sales':
                message = await myTasksale('04', start, end, compcode, config);
                break;
            case 'Workshop_Sales':
                message = await myTasksale('03', start, end, compcode, config);
                break;
            case 'warranty':
                message = await myTaskwarranty(start, end, compcode, config);
                break;
            default:
                console.log("Unknown button clicked");
                message = "Unknown buttonId";
        }

        console.log("message:", message);
        res.send({ message });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while processing the request.'
        });
    }
};

// ════════════════════════════════════════════════════════
// ✅ runSchedulerNow - Manual API Trigger
// ════════════════════════════════════════════════════════
exports.runSchedulerNow = async (req, res) => {
    return await runVecvScheduler(req, res);
};

// ════════════════════════════════════════════════════════
// ✅ Start/Stop Scheduler APIs
// ════════════════════════════════════════════════════════
exports.startScheduler = (req, res) => {
    startVecvSchedulerLoop();
    return res.status(200).json({
        success: true,
        message: "VECV Scheduler started successfully."
    });
};

exports.stopScheduler = (req, res) => {
    stopVecvSchedulerLoop();
    return res.status(200).json({
        success: true,
        message: "VECV Scheduler stopped successfully."
    });
};

// ════════════════════════════════════════════════════════
// ✅ Config CRUD - createEicherConfig
// ════════════════════════════════════════════════════════
exports.createEicherConfig = async function (req, res) {
    let sequelize;
    try {
        sequelize = await dbname(req, req.headers.compcode);
        const body = req.body || {};

        if (!body.User_Name) {
            return res.status(400).send({
                success: false,
                message: "User_Name is required",
            });
        }

        if (body.Godw_Code !== undefined && body.Godw_Code !== null) {
            const godwCode = parseInt(body.Godw_Code);
            if (isNaN(godwCode) || godwCode < 0) {
                return res.status(400).send({
                    success: false,
                    message: "Godw_Code must be a valid non-negative number",
                });
            }
        }

        const existing = await sequelize.query(
            `SELECT TOP 1 UTD, User_Name, DBM_Code
             FROM Vecv_Config
             WHERE User_Name = :User_Name AND DBM_Code = :DBM_Code`,
            {
                replacements: {
                    User_Name: String(body.User_Name).trim(),
                    DBM_Code: body.DBM_Code ? String(body.DBM_Code).trim() : null,
                },
                type: QueryTypes.SELECT,
            }
        );

        if (existing.length > 0) {
            return res.status(409).send({
                success: false,
                message: "Eicher config with same User_Name and DBM_Code already exists",
                data: {
                    UTD: existing[0].UTD,
                    User_Name: existing[0].User_Name,
                    DBM_Code: existing[0].DBM_Code,
                },
            });
        }

        const result = await sequelize.query(
            `INSERT INTO Vecv_Config
                (DBM_Code, User_Name, User_Pass, Godw_Code, Export_Type, Created_By, Created_At)
             OUTPUT INSERTED.UTD
             VALUES
                (:DBM_Code, :User_Name, :User_Pass, :Godw_Code, :Export_Type, :Created_By, GETDATE())`,
            {
                replacements: {
                    DBM_Code:    body.DBM_Code    ? String(body.DBM_Code).trim()  : null,
                    User_Name:   String(body.User_Name).trim(),
                    User_Pass:   body.User_Pass   ? String(body.User_Pass).trim() : null,
                    Godw_Code:   body.Godw_Code   !== undefined ? parseInt(body.Godw_Code)   : null,
                    Export_Type: body.Export_Type !== undefined ? parseInt(body.Export_Type) : null,
                    Created_By:  getLoginUserId(req, body),
                },
                type: QueryTypes.SELECT,
            }
        );

        return res.status(200).send({
            success: true,
            message: "Eicher config created successfully",
            data: { UTD: result[0]?.UTD },
        });

    } catch (error) {
        console.error("Create Eicher Config Error:", error);
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    } finally {
        if (sequelize) await sequelize.close();
    }
};

// ════════════════════════════════════════════════════════
// ✅ Config CRUD - getEicherConfig
// ════════════════════════════════════════════════════════
exports.getEicherConfig = async function (req, res) {
    let sequelize;
    try {
        sequelize = await dbname(req, req.headers.compcode);
        const query  = req.query  || {};
        const params = req.params || {};

        // ── Base SELECT Query ─────────────────────────────────
        const baseSelect = `
            SELECT 
                V.UTD,
                V.DBM_Code,
                V.User_Name,
                V.User_Pass,
                V.Godw_Code,
                V.Export_Type,
                V.Created_By,
                V.Created_At,
                (
                    SELECT TOP 1 G.Godw_Name 
                    FROM Godown_Mst G 
                    WHERE G.Godw_Code = V.Godw_Code
                ) AS Godw_Name
            FROM Vecv_Config V
        `;

        // ── Single Record by UTD ──────────────────────────────
        if (params.UTD || query.UTD) {
            const UTD = parseInt(params.UTD || query.UTD);

            if (isNaN(UTD) || UTD <= 0) {
                return res.status(400).send({
                    success: false,
                    message: "UTD must be a valid positive number",
                });
            }

            const record = await sequelize.query(
                `${baseSelect} WHERE V.UTD = :UTD`,
                {
                    replacements: { UTD },
                    type: QueryTypes.SELECT,
                }
            );

            if (!record || record.length === 0) {
                return res.status(404).send({
                    success: false,
                    message: "Eicher config not found",
                });
            }

            return res.status(200).send({
                success: true,
                message: "Eicher config fetched successfully",
                data: record[0],
            });
        }

        // ── Multiple Records with Filters ─────────────────────
        let whereClause    = `WHERE 1=1`;
        const replacements = {};

        if (query.DBM_Code) {
            whereClause += ` AND V.DBM_Code = :DBM_Code`;
            replacements.DBM_Code = String(query.DBM_Code).trim();
        }

        if (query.User_Name) {
            whereClause += ` AND V.User_Name LIKE :User_Name`;
            replacements.User_Name = `%${String(query.User_Name).trim()}%`;
        }

        if (query.Godw_Code) {
            const godwCode = parseInt(query.Godw_Code);
            if (isNaN(godwCode) || godwCode < 0) {
                return res.status(400).send({
                    success: false,
                    message: "Godw_Code must be a valid non-negative number",
                });
            }
            whereClause += ` AND V.Godw_Code = :Godw_Code`;
            replacements.Godw_Code = godwCode;
        }

        if (query.Export_Type !== undefined && query.Export_Type !== "") {
            const exportType = parseInt(query.Export_Type);
            if (isNaN(exportType)) {
                return res.status(400).send({
                    success: false,
                    message: "Export_Type must be a valid number",
                });
            }
            whereClause += ` AND V.Export_Type = :Export_Type`;
            replacements.Export_Type = exportType;
        }

        // ── Godw_Name filter ──────────────────────────────────
        if (query.Godw_Name) {
            whereClause += ` AND (
                SELECT TOP 1 G.Godw_Name 
                FROM Godown_Mst G 
                WHERE G.Godw_Code = V.Godw_Code
            ) LIKE :Godw_Name`;
            replacements.Godw_Name = `%${String(query.Godw_Name).trim()}%`;
        }

        const records = await sequelize.query(
            `${baseSelect}
             ${whereClause}
             ORDER BY V.UTD DESC`,
            {
                replacements,
                type: QueryTypes.SELECT,
            }
        );

        return res.status(200).send({
            success: true,
            message: "Eicher config list fetched successfully",
            total: records.length,
            data: records,
        });

    } catch (error) {
        console.error("Get Eicher Config Error:", error);
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    } finally {
        if (sequelize) await sequelize.close();
    }
};


// ════════════════════════════════════════════════════════
// ✅ Config CRUD - updateEicherConfig
// ════════════════════════════════════════════════════════
exports.updateEicherConfig = async function (req, res) {
    let sequelize;
    try {
        sequelize = await dbname(req, req.headers.compcode);
        const body   = req.body   || {};
        const params = req.params || {};
        const query  = req.query  || {};

        // ── UTD required ──────────────────────────────────────
        const UTD = parseInt(params.UTD || query.UTD || body.UTD);

        if (!UTD || isNaN(UTD) || UTD <= 0) {
            return res.status(400).send({
                success: false,
                message: "UTD is required and must be a valid positive number",
            });
        }

        // ── Record exist karta hai? ───────────────────────────
        const existing = await sequelize.query(
            `SELECT TOP 1 UTD, DBM_Code, User_Name, Export_Type
             FROM Vecv_Config
             WHERE UTD = :UTD`,
            {
                replacements: { UTD },
                type: QueryTypes.SELECT,
            }
        );

        if (!existing || existing.length === 0) {
            return res.status(404).send({
                success: false,
                message: `Eicher config with UTD ${UTD} not found`,
            });
        }

        // ── Godw_Code validation ──────────────────────────────
        if (body.Godw_Code !== undefined && body.Godw_Code !== null) {
            const godwCode = parseInt(body.Godw_Code);
            if (isNaN(godwCode) || godwCode < 0) {
                return res.status(400).send({
                    success: false,
                    message: "Godw_Code must be a valid non-negative number",
                });
            }
        }

        // ── Dynamic SET clause build karo ────────────────────
        const setClauses  = [];
        const replacements = { UTD };

        if (body.DBM_Code !== undefined) {
            setClauses.push(`DBM_Code = :DBM_Code`);
            replacements.DBM_Code = body.DBM_Code
                ? String(body.DBM_Code).trim()
                : null;
        }

        if (body.User_Name !== undefined) {
            if (!body.User_Name || !String(body.User_Name).trim()) {
                return res.status(400).send({
                    success: false,
                    message: "User_Name cannot be empty",
                });
            }
            setClauses.push(`User_Name = :User_Name`);
            replacements.User_Name = String(body.User_Name).trim();
        }

        if (body.User_Pass !== undefined) {
            setClauses.push(`User_Pass = :User_Pass`);
            replacements.User_Pass = body.User_Pass
                ? String(body.User_Pass).trim()
                : null;
        }

        if (body.Godw_Code !== undefined) {
            setClauses.push(`Godw_Code = :Godw_Code`);
            replacements.Godw_Code = body.Godw_Code !== null
                ? parseInt(body.Godw_Code)
                : null;
        }

        if (body.Export_Type !== undefined) {
            setClauses.push(`Export_Type = :Export_Type`);
            replacements.Export_Type = body.Export_Type !== null
                ? parseInt(body.Export_Type)
                : null;
        }

        // ── Kuch update karne ko nahi hai? ────────────────────
        if (setClauses.length === 0) {
            return res.status(400).send({
                success: false,
                message: "No fields provided to update",
            });
        }

        // ── UPDATE Query ──────────────────────────────────────
        await sequelize.query(
            `UPDATE Vecv_Config
             SET ${setClauses.join(", ")}
             WHERE UTD = :UTD`,
            {
                replacements,
                type: QueryTypes.UPDATE,
            }
        );

        // ── Updated record fetch karo ─────────────────────────
        const updated = await sequelize.query(
            `SELECT UTD, DBM_Code, User_Name, User_Pass,
                    Godw_Code, Export_Type, Created_By, Created_At
             FROM Vecv_Config
             WHERE UTD = :UTD`,
            {
                replacements: { UTD },
                type: QueryTypes.SELECT,
            }
        );

        return res.status(200).send({
            success: true,
            message: "Eicher config updated successfully",
            data: updated[0],
        });

    } catch (error) {
        console.error("Update Eicher Config Error:", error);
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    } finally {
        if (sequelize) await sequelize.close();
    }
};

// ════════════════════════════════════════════════════════
// ✅ Config CRUD - activeInactiveEicherConfig
// Export_Type:
//   Active   → 1
//   Inactive → 33
// ════════════════════════════════════════════════════════
exports.activeInactiveEicherConfig = async function (req, res) {
    let sequelize;
    try {
        sequelize = await dbname(req, req.headers.compcode);
        const body   = req.body   || {};
        const params = req.params || {};
        const query  = req.query  || {};

        // ── UTD required ──────────────────────────────────────
        const UTD = parseInt(params.UTD || query.UTD || body.UTD);

        if (!UTD || isNaN(UTD) || UTD <= 0) {
            return res.status(400).send({
                success: false,
                message: "UTD is required and must be a valid positive number",
            });
        }

        // ── Status required ───────────────────────────────────
        // status: "active" ya "inactive"
        const status = String(body.status || query.status || "").toLowerCase().trim();

        if (!status || !["active", "inactive"].includes(status)) {
            return res.status(400).send({
                success: false,
                message: "status is required. Valid values: 'active' or 'inactive'",
            });
        }

        // ── Export_Type set karo ──────────────────────────────
        const Export_Type = status === "active" ? 1 : 33;

        // ── Record exist karta hai? ───────────────────────────
        const existing = await sequelize.query(
            `SELECT TOP 1 UTD, DBM_Code, User_Name, Export_Type
             FROM Vecv_Config
             WHERE UTD = :UTD`,
            {
                replacements: { UTD },
                type: QueryTypes.SELECT,
            }
        );

        if (!existing || existing.length === 0) {
            return res.status(404).send({
                success: false,
                message: `Eicher config with UTD ${UTD} not found`,
            });
        }

        const currentStatus = existing[0].Export_Type === 33
            ? "inactive"
            : "active";

        // ── Already same status hai? ──────────────────────────
        if (currentStatus === status) {
            return res.status(200).send({
                success: true,
                message: `Config is already ${status}`,
                data: {
                    UTD,
                    DBM_Code:    existing[0].DBM_Code,
                    User_Name:   existing[0].User_Name,
                    Export_Type: existing[0].Export_Type,
                    status:      currentStatus,
                },
            });
        }

        // ── UPDATE Export_Type ────────────────────────────────
        await sequelize.query(
            `UPDATE Vecv_Config
             SET Export_Type = :Export_Type
             WHERE UTD = :UTD`,
            {
                replacements: { Export_Type, UTD },
                type: QueryTypes.UPDATE,
            }
        );

        return res.status(200).send({
            success: true,
            message: `Eicher config marked as ${status} successfully`,
            data: {
                UTD,
                DBM_Code:    existing[0].DBM_Code,
                User_Name:   existing[0].User_Name,
                Export_Type,
                status,
            },
        });

    } catch (error) {
        console.error("Active/Inactive Eicher Config Error:", error);
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    } finally {
        if (sequelize) await sequelize.close();
    }
};


exports.getGodownMst = async function (req, res) {
    let sequelize;
    try {
        sequelize = await dbname(req, req.headers.compcode);
        const query  = req.query  || {};
        const params = req.params || {};

        // ── Single Record by Godw_Code ────────────────────────
        if (params.Godw_Code || query.Godw_Code) {
            const Godw_Code = parseInt(params.Godw_Code || query.Godw_Code);

            if (isNaN(Godw_Code) || Godw_Code <= 0) {
                return res.status(400).send({
                    success: false,
                    message: "Godw_Code must be a valid positive number",
                });
            }

            const record = await sequelize.query(
                `SELECT DISTINCT Godw_Code, Godw_Name 
                 FROM Godown_Mst 
                 WHERE Godw_Code = :Godw_Code`,
                {
                    replacements: { Godw_Code },
                    type: QueryTypes.SELECT,
                }
            );

            if (!record || record.length === 0) {
                return res.status(404).send({
                    success: false,
                    message: "Godown not found",
                });
            }

            return res.status(200).send({
                success: true,
                message: "Godown fetched successfully",
                data: record[0],
            });
        }

        // ── Multiple Records with Filters ─────────────────────
        let whereClause    = `WHERE 1=1`;
        const replacements = {};

        if (query.Godw_Name) {
            whereClause += ` AND Godw_Name LIKE :Godw_Name`;
            replacements.Godw_Name = `%${String(query.Godw_Name).trim()}%`;
        }

        const records = await sequelize.query(
            `SELECT DISTINCT Godw_Code, Godw_Name 
             FROM Godown_Mst
             ${whereClause}
             ORDER BY Godw_Code ASC`,
            {
                replacements,
                type: QueryTypes.SELECT,
            }
        );

        return res.status(200).send({
            success: true,
            message: "Godown list fetched successfully",
            total: records.length,
            data: records,
        });

    } catch (error) {
        console.error("Get Godown Mst Error:", error);
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    } finally {
        if (sequelize) await sequelize.close();
    }
};

// ════════════════════════════════════════════════════════
// ✅ Exports
// ════════════════════════════════════════════════════════
exports.startVecvSchedulerLoop = startVecvSchedulerLoop;

exports.stopVecvSchedulerLoop  = stopVecvSchedulerLoop;
exports.runVecvScheduler       = runVecvScheduler;