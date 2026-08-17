// / controllers/insuranceRenual.controller.js
const ExcelJS = require("exceljs");
const { DataTypes,Op } = require("sequelize");
const  { dbname } =require('../utils/dbconfig')
const xlsx = require("xlsx");
const { Insu_Renewal, insuRenewalSchema } = require("../models/excelImport");
const Sequelize = require("sequelize");
const { Insu_Renewal_Mst } = require("../models/InsuRenewalMst")
const axios = require("axios");
const FormData = require("form-data");



exports.downloadInsuranceRenualSampleExcel = async (req, res) => {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("INSURANCE_RENUAL");
 

  // Freeze header row
  ws.views = [{ state: "frozen", ySplit: 1 }];

  // Only headers (NO ROWS)
  ws.columns = [
    { header: "CUST NAME", key: "CUST_NAME", width: 22 },
    { header: "CUST MOB NO", key: "MOBILE_NO", width: 16 },
    { header: "POLICY NAME", key: "POLICY_NAME", width: 22 },
    { header: "POLICY NUMBER", key: "POLICY_NUMBER", width: 16 },
    { header: "VEHICAL REG NO", key: "VEHICAL_REG_NO", width: 18 },
    { header: "MODEL NAME", key: "MODEL_NAME", width: 18 },
    { header: "POLICY START DATE", key: "POLICY_START_DATE", width: 18 },
    { header: "POLICY END DATE", key: "POLICY_END_DATE", width: 18 },
  ];

  // Header styling (green background + white bold text)
  const headerRow = ws.getRow(1);
  headerRow.height = 20;

  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF0B6A45" }, // dark green
    };
    cell.border = {
      top: { style: "thin", color: { argb: "FFBFBFBF" } },
      left: { style: "thin", color: { argb: "FFBFBFBF" } },
      bottom: { style: "thin", color: { argb: "FFBFBFBF" } },
      right: { style: "thin", color: { argb: "FFBFBFBF" } },
    };
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="INSURANCE_RENUAL_TEMPLATE.xlsx"'
  );

  await wb.xlsx.write(res);
  res.end();
};


exports.importInsuRenewalExcel = async function (req, res, next) {
  const sequelize = await dbname(req, req.headers.compcode);

  try {
    const InsuRenewal = Insu_Renewal(sequelize, DataTypes);
    const InsuRenewalMst = Insu_Renewal_Mst(sequelize, DataTypes);

    const excelFile = req.files?.["excel"]?.[0] || req.file;
    if (!excelFile) return res.status(400).send({ Message: "No file uploaded" });

    const workbook = xlsx.read(excelFile.buffer, { type: "buffer", cellDates: true });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    if (!sheet) return res.status(400).send({ Message: "Worksheet not found" });

    const sheetHeaders = (xlsx.utils.sheet_to_json(sheet, { header: 1 })[0] || []).map(h => String(h || "").trim());

    const expectedHeaders = [
      "CUST NAME",
      "CUST MOB NO",
      "POLICY NAME",
      "POLICY NUMBER",
      "VEHICAL REG NO",
      "MODEL NAME",
      "POLICY START DATE",
      "POLICY END DATE",
    ];

    const isHeadersMatch =
      sheetHeaders.length === expectedHeaders.length &&
      sheetHeaders.every((h, i) => h === expectedHeaders[i]);

    if (!isHeadersMatch) {
      return res.status(400).send({
        Message: "Invalid Excel format! Please upload the file with the correct template.",
        ExpectedHeaders: expectedHeaders,
        FoundHeaders: sheetHeaders,
      });
    }

    const rows = xlsx.utils.sheet_to_json(sheet, { defval: "" });
    if (!rows.length) {
      return res.status(400).send({ Message: "No data found in Excel or Invalid format" });
    }

    // ===== helpers =====
    const pad2 = (x) => String(x).padStart(2, "0");

    function excelSerialToDate(n) {
      if (typeof n !== "number") return null;
      const utc_days = Math.floor(n - 25569);
      const utc_value = utc_days * 86400;
      const d = new Date(utc_value * 1000);
      return isNaN(d.getTime()) ? null : d;
    }

    function toDbDateOnly(v) {
      if (!v) return null;

      if (v instanceof Date) {
        if (isNaN(v.getTime())) return null;
        return `${v.getFullYear()}-${pad2(v.getMonth() + 1)}-${pad2(v.getDate())}`;
      }

      if (typeof v === "number") {
        const d = excelSerialToDate(v);
        return d ? `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}` : null;
      }

      if (typeof v === "string") {
        const s = v.trim();
        if (!s) return null;

        let m = s.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
        if (m) return `${m[3]}-${pad2(m[2])}-${pad2(m[1])}`;

        m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (m) return `${m[3]}-${pad2(m[2])}-${pad2(m[1])}`;

        m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
        if (m) return `${m[1]}-${pad2(m[2])}-${pad2(m[3])}`;

        const asNum = Number(s);
        if (!Number.isNaN(asNum) && asNum > 20000) {
          const d = excelSerialToDate(asNum);
          return d ? `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}` : null;
        }
      }
      return null;
    }

    const clean = (v) => {
      if (v === null || v === undefined || v === "") return null;
      const s = String(v).trim();
      return s === "" ? null : s;
    };

    const cleanMob = (v) => {
      const s = clean(v);
      if (!s) return null;
      const digits = s.replace(/\D/g, "");
      return digits === "" ? null : digits;
    };

    const cleanRegNo = (v) => {
      const s = clean(v);
      if (!s) return null;
      return s.toUpperCase();
    };

    const data = rows.map((r) => ({
      CUST_NAME: clean(r["CUST NAME"]),
      CUST_MOB_NO: cleanMob(r["CUST MOB NO"]),
      POLICY_NAME: clean(r["POLICY NAME"]),
      POLICY_NUMBER: clean(r["POLICY NUMBER"]),
      VEHICAL_REG_NO: cleanRegNo(r["VEHICAL REG NO"]),
      MODEL_NAME: clean(r["MODEL NAME"]),
      POLICY_START_DATE: toDbDateOnly(r["POLICY START DATE"]),
      POLICY_END_DATE: toDbDateOnly(r["POLICY END DATE"]),
    }));

    const CorrectData = [];
    const ErroredData = [];
    let updatedVehicles = 0;

    await sequelize.transaction(async (t) => {
      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const excelRowNo = i + 2;

        try {
          const regNo = row.VEHICAL_REG_NO ? String(row.VEHICAL_REG_NO).trim().toUpperCase() : null;
          let tranId = null;

          if (regNo) {
            // ✅ MASTER check by VEHICAL_REG_NO
            const mstExisting = await InsuRenewalMst.findOne({
              attributes: ["UTD"],
              where: { VEHICAL_REG_NO: regNo },
              raw: true,
              transaction: t,
            });

            if (mstExisting) {
              tranId = mstExisting.UTD;
            } else {
              const mstNew = await InsuRenewalMst.create(
                {
                  VEHICAL_REG_NO: regNo,
                  EXPORT_TYPE: 1,
                  CREATED_AT: Sequelize.literal("GETDATE()"),
                },
                {
                  transaction: t,
                  validate: false,
                  fields: ["VEHICAL_REG_NO", "EXPORT_TYPE", "CREATED_AT"],
                }
              );

              // ✅ safe UTD extraction
              tranId = mstNew?.UTD ?? mstNew?.dataValues?.UTD ?? null;
            }

            // ✅ DETAIL export_type logic same as before
            const detailCount = await InsuRenewal.count({
              where: { VEHICAL_REG_NO: regNo },
              transaction: t,
            });

            if (detailCount > 0) {
              await InsuRenewal.update(
                { EXPORT_TYPE: 33 },
                { where: { VEHICAL_REG_NO: regNo }, transaction: t }
              );
              updatedVehicles += 1;
            }
          }

          // ✅ Insert latest detail row
          const insertObj = {
            ...row,
            TRAN_ID: tranId, // may be ignored by model -> we'll force update below
            EXPORT_TYPE: 1,
            CREATED_AT: Sequelize.literal("GETDATE()"),
          };

          const created = await InsuRenewal.create(insertObj, {
            transaction: t,
            validate: false,
            fields: [
              "CUST_NAME",
              "CUST_MOB_NO",
              "POLICY_NAME",
              "POLICY_NUMBER",
              "VEHICAL_REG_NO",
              "MODEL_NAME",
              "POLICY_START_DATE",
              "POLICY_END_DATE",
              "CREATED_AT",
              "EXPORT_TYPE",
              "TRAN_ID",
            ],
          });

          // ✅ FIX: force set TRAN_ID via raw SQL (works even if model doesn't have TRAN_ID)
          if (tranId) {
            const utd = created?.UTD ?? created?.dataValues?.UTD;
            if (utd) {
              await sequelize.query(
                "UPDATE dbo.INSU_RENEWAL SET TRAN_ID = :tranId WHERE UTD = :utd",
                {
                  replacements: { tranId, utd },
                  transaction: t,
                }
              );
            }
          }

          CorrectData.push({ ...insertObj, Excel_Row: excelRowNo });
        } catch (e) {
          ErroredData.push({ ...row, Excel_Row: excelRowNo, rejectionReasons: e.message });
        }
      }
    });

    const workbook1 = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook1, xlsx.utils.json_to_sheet(CorrectData || []), "Imported Data");
    xlsx.utils.book_append_sheet(workbook1, xlsx.utils.json_to_sheet(ErroredData || []), "Non Imported Data");

    const buffer = xlsx.write(workbook1, { type: "buffer", bookType: "xlsx" });
    const base64File = Buffer.from(buffer).toString("base64");

    return res.status(200).json({
      Type: CorrectData.length > 0 ? "success" : "warning",
      Inserted: CorrectData.length,
      UpdatedVehiclesTo33: updatedVehicles,
      NonInserted: ErroredData.length,
      Total: data.length,
      Message: CorrectData.length > 0 ? `${CorrectData.length} Records Processed` : "Data Is Not Valid To Import",
      File: base64File,
      FileName: "insu_renewal_import_result.xlsx",
    });
  } catch (error) {
    console.error("Error during file import:", error);
    return res.status(500).json({ Message: "An error occurred during file import.", Error: error.message });
  } finally {
    await sequelize.close();
  }
};

exports.getInsuRenewalByDateRange = async function (req, res, next) {
  const sequelize = await dbname(req, req.headers.compcode);

  try {
    const InsuRenewal = Insu_Renewal(sequelize, DataTypes);

    const pad2 = (x) => String(x).padStart(2, "0");

    // Frontend se DD/MM/YYYY (recommended) aayega, but DD-MM-YYYY & YYYY-MM-DD bhi accept
    function toDbDateOnly(v) {
      if (!v) return null;
      const s = String(v).trim();
      if (!s) return null;

      // DD/MM/YYYY
      let m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (m) return `${m[3]}-${pad2(m[2])}-${pad2(m[1])}`;

      // DD-MM-YYYY
      m = s.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
      if (m) return `${m[3]}-${pad2(m[2])}-${pad2(m[1])}`;

      // YYYY-MM-DD / YYYY-M-D
      m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
      if (m) return `${m[1]}-${pad2(m[2])}-${pad2(m[3])}`;

      return null;
    }

    // Display dd/mm/yyyy (DATEONLY string safe; datetime also supported)
    function toDisplayDDMMYYYY(v) {
      if (!v) return null;

      if (typeof v === "string") {
        const m = v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (m) return `${m[3]}/${m[2]}/${m[1]}`;
      }

      const d = v instanceof Date ? v : new Date(v);
      if (isNaN(d.getTime())) return null;
      return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
    }

    // ✅ Only 2 fields from frontend
    const { fromDate, toDate } = req.body;

    const from = toDbDateOnly(fromDate);
    const to = toDbDateOnly(toDate);

    if (!from || !to) {
      return res.status(400).json({
        ok: false,
        Message: "fromDate & toDate required (send DD/MM/YYYY)",
        Example: { fromDate: "26/07/2026", toDate: "27/07/2026" },
      });
    }

    // (optional) if from > to then swap
    const fromFinal = from <= to ? from : to;
    const toFinal = from <= to ? to : from;

    // ✅ No conversion error: convert CREATED_AT to DATE inside SQL
    const dateWhere = Sequelize.where(
      Sequelize.fn("CONVERT", Sequelize.literal("date"), Sequelize.col("CREATED_AT")),
      { [Op.between]: [fromFinal, toFinal] }
    );

    // ✅ ONLY EXPORT_TYPE = 1
    const rows = await InsuRenewal.findAll({
      where: {
        [Op.and]: [
          dateWhere,
          { EXPORT_TYPE: 1 },
        ],
      },
      order: [["UTD", "DESC"]],
      raw: true,
    });

    const data = rows.map((r) => ({
      ...r,
      POLICY_START_DATE: toDisplayDDMMYYYY(r.POLICY_START_DATE),
      POLICY_END_DATE: toDisplayDDMMYYYY(r.POLICY_END_DATE),
      CREATED_AT: toDisplayDDMMYYYY(r.CREATED_AT),
      VALIDFROM: toDisplayDDMMYYYY(r.VALIDFROM),
      VALIDTO: toDisplayDDMMYYYY(r.VALIDTO),
    }));

    return res.json({
      ok: true,
      fromDate: fromFinal,
      toDate: toFinal,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("Date filter error:", error);
    return res.status(500).json({ ok: false, Message: error.message });
  } finally {
    await sequelize.close();
  }
};

exports.getInsuRenewalReminders = async function (req, res, next) {
  const sequelize = await dbname(req, req.headers.compcode);

  try {
    const InsuRenewal = Insu_Renewal(sequelize, DataTypes);

    // helper functions INSIDE controller
    const ymd = (d = new Date()) => {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    };

    const addDaysYMD = (baseYmd, days) => {
      const d = new Date(`${baseYmd}T00:00:00`);
      d.setDate(d.getDate() + Number(days));
      return ymd(d);
    };

    const diffDays = (fromYmd, toYmd) => {
      const a = new Date(`${fromYmd}T00:00:00`);
      const b = new Date(`${toYmd}T00:00:00`);
      return Math.round((b - a) / (1000 * 60 * 60 * 24));
    };

    const parseDays = (value, defaultVal) => {
      if (value === null || value === undefined) return defaultVal;
      const s = String(value).trim();
      if (!s) return defaultVal;
      const n = parseInt(s, 10);
      return Number.isFinite(n) ? n : defaultVal;
    };

    // ✅ Custom from/to date parser (accepts DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD) -> YYYY-MM-DD
    const toDbDateOnly = (v) => {
      if (!v) return null;
      const s = String(v).trim();
      if (!s) return null;

      const pad2 = (x) => String(x).padStart(2, "0");

      // DD/MM/YYYY
      let m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (m) return `${m[3]}-${pad2(m[2])}-${pad2(m[1])}`;

      // DD-MM-YYYY
      m = s.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
      if (m) return `${m[3]}-${pad2(m[2])}-${pad2(m[1])}`;

      // YYYY-MM-DD / YYYY-M-D
      m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
      if (m) return `${m[1]}-${pad2(m[2])}-${pad2(m[3])}`;

      return null;
    };

    // 1) Read config from COMP_KEYDATA
    const [keyRow] = await sequelize.query(
      `SELECT TOP 1 INSU_BEFORE_DAYS, INSU_AFTER_DAYS
       FROM dbo.COMP_KEYDATA`,
      { type: sequelize.QueryTypes.SELECT }
    );

    const beforeDays = parseDays(keyRow?.INSU_BEFORE_DAYS, 0);
    const afterDays = parseDays(keyRow?.INSU_AFTER_DAYS, 0);

    const today = ymd();
    const beforeTo = addDaysYMD(today, beforeDays);
    const afterFrom = addDaysYMD(today, -afterDays);
    const yesterday = addDaysYMD(today, -1);

    // ✅ ONLY EXPORT_TYPE = 1
    const baseWhere = { EXPORT_TYPE: 1 };

    // ✅ Custom filter inputs (optional)
    const customFromRaw = req.body?.fromDate;
    const customToRaw = req.body?.toDate;

    let customFrom = toDbDateOnly(customFromRaw);
    let customTo = toDbDateOnly(customToRaw);

    const useCustom = !!(customFrom && customTo);

    // swap if from > to
    if (useCustom && customFrom > customTo) {
      const tmp = customFrom;
      customFrom = customTo;
      customTo = tmp;
    }

    let beforeRows = [];
    let afterRows = [];

    if (useCustom) {
      // ✅ ONLY show data by POLICY_END_DATE between fromDate and toDate
      const allRows = await InsuRenewal.findAll({
        where: {
          ...baseWhere,
          POLICY_END_DATE: { [Op.between]: [customFrom, customTo] },
        },
        raw: true,
      });

      // split into before/after based on today (messages same)
      beforeRows = allRows
        .filter((r) => r.POLICY_END_DATE >= today)
        .sort((a, b) => String(a.POLICY_END_DATE).localeCompare(String(b.POLICY_END_DATE)));

      afterRows = allRows
        .filter((r) => r.POLICY_END_DATE < today)
        .sort((a, b) => String(b.POLICY_END_DATE).localeCompare(String(a.POLICY_END_DATE)));
    } else {
      // 2) Before reminder (expiring soon)
      beforeRows = await InsuRenewal.findAll({
        where: {
          ...baseWhere,
          POLICY_END_DATE: { [Op.between]: [today, beforeTo] },
        },
        order: [["POLICY_END_DATE", "ASC"]],
        raw: true,
      });

      // 3) After reminder (recently expired)
      afterRows = await InsuRenewal.findAll({
        where: {
          ...baseWhere,
          POLICY_END_DATE: { [Op.between]: [afterFrom, yesterday] },
        },
        order: [["POLICY_END_DATE", "DESC"]],
        raw: true,
      });
    }

    const beforeReminders = beforeRows.map((r) => {
      const daysLeft = diffDays(today, r.POLICY_END_DATE);
      return {
        type: "BEFORE_EXPIRY",
        days: daysLeft,
        message: `Your policy is going to expire in ${daysLeft} day(s). Please renew it.`,
        data: r,
      };
    });

    const afterReminders = afterRows.map((r) => {
      const daysAgo = diffDays(r.POLICY_END_DATE, today);
      return {
        type: "AFTER_EXPIRY",
        days: daysAgo,
        message: `Your policy has expired ${daysAgo} day(s) ago. Please renew it.`,
        data: r,
      };
    });

    return res.json({
      ok: true,
      config: { beforeDays, afterDays },
      range: useCustom
        ? { customFrom, customTo, today }
        : { today, beforeReminderTo: beforeTo, afterReminderFrom: afterFrom, afterReminderTo: yesterday },
      counts: { before: beforeReminders.length, after: afterReminders.length },
      beforeReminders,
      afterReminders,
    });
  } catch (err) {
    return res.status(500).json({ ok: false, Message: err.message });
  } finally {
    await sequelize.close();
  }
};


exports.getVehicleByRegNo = async (req, res) => {
  const sequelize = await dbname(req, req.headers.compcode);
  try {
    const InsuRenewal = Insu_Renewal(sequelize, DataTypes);
    const InsuRenewalMst = Insu_Renewal_Mst(sequelize, DataTypes);

  const regNoRaw = req.body?.RegNo || req.query?.RegNo;   // ✅ POST body OR GET query
const regNo = String(regNoRaw || "").trim().toUpperCase();

if (!regNo) {
  return res.status(400).json({ Status: false, Message: "RegNo required" });
}

    // 1) MASTER check
    const mst = await InsuRenewalMst.findOne({
      where: { VEHICAL_REG_NO: regNo },
      raw: true,
    });

    // 2) DETAIL latest row
    // First try: EXPORT_TYPE = 1 (because import logic marks old as 33 and latest stays 1)
    let detail = await InsuRenewal.findOne({
      where: { VEHICAL_REG_NO: regNo, EXPORT_TYPE: 1 },
      order: [["UTD", "DESC"]],
      raw: true,
    });

    // Fallback (optional): temporal ALL, latest by VALIDFROM
    // NOTE: Sequelize model se FOR SYSTEM_TIME ALL direct possible nahi; raw query best.
    if (!detail) {
      const [rows] = await sequelize.query(
        `
        SELECT TOP 1 *
        FROM dbo.INSU_RENEWAL FOR SYSTEM_TIME ALL
        WHERE VEHICAL_REG_NO = :regNo
        ORDER BY VALIDFROM DESC
        `,
        { replacements: { regNo } }
      );
      detail = rows?.[0] || null;
    }

    if (!mst && !detail) {
      return res.json({ Status: true, Result: [], Message: "New vehicle" });
    }

    // ✅ Frontend-friendly mapping (aapke page ke names)
    const resultObj = {
      VehicleId: mst?.UTD ?? null,
      RegNo: regNo,

      OwnerName: detail?.CUST_NAME ?? "",
      MobileNo: detail?.CUST_MOB_NO ? String(detail.CUST_MOB_NO) : "",
      ModelVariant: detail?.MODEL_NAME ?? "",

      PolicyNo: detail?.POLICY_NUMBER ? String(detail.POLICY_NUMBER) : "",
      PolicyName: detail?.POLICY_NAME ?? "",
      PolicyStartDate: detail?.POLICY_START_DATE ?? "",
      PolicyExpiryDate: detail?.POLICY_END_DATE ?? "",

      // Optional: previous show karna ho toh same data se fill kar lo
      PrevPolicyNo: detail?.POLICY_NUMBER ? String(detail.POLICY_NUMBER) : "",
      PrevExpiryDate: detail?.POLICY_END_DATE ?? "",
      PrevInsuranceCo: "", // INSU_RENEWAL me column nahi hai
    };

    return res.json({
      Status: true,
      Result: [resultObj],
      Message: "Vehicle found",
    });
  } catch (e) {
    return res.status(500).json({ Status: false, Message: e.message });
  } finally {
    await sequelize.close();
  }
};



exports.getInsuranceAndPaymentDropdowns = async (req, res) => {
  const sequelize = await dbname(req, req.headers.compcode);

  try {
    // ✅ Only active rows (aapke data me Export_Type=33 bhi hai, usko ignore)
    const rows = await sequelize.query(
  `
  SELECT
    UTD,
    Misc_Type,
    Misc_Code,
    Misc_Name,
    Misc_Abbr,
    Misc_Add1, Misc_Add2, Misc_Add3,
    Misc_Dtl1, Misc_Dtl2, Misc_Dtl3,
    Misc_Num1, MISC_NUM2,
    Export_Type
  FROM dbo.MISC_MST
  WHERE Misc_Type IN (9, 18)
    AND ISNULL(Export_Type, 1) <> 33     -- ✅ 33 exclude, baaki sab include
  ORDER BY Misc_Type, Misc_Code
  `,
  { type: Sequelize.QueryTypes.SELECT }
);
    const toOption = (r) => ({
      // ✅ dropdown label = Misc_Name
      label: String(r.Misc_Name ?? ""),

      /**
       * ✅ dropdown value:
       * Payment mode me usually abbr use hota hai (CASH/NEFT/RTGS...) so conditional UI easy rahe
       * Insurance me abbr mostly blank hota hai so name as value.
       */
      value: String(r.Misc_Abbr || r.Misc_Name || r.Misc_Code || r.UTD),

      // ✅ if you ever need to save code/id in backend
      code: r.Misc_Code,
      utd: r.UTD,

      // ✅ full row for auto-fill if needed
      meta: r,
    });

    const insuranceCompanies = rows
      .filter((r) => Number(r.Misc_Type) === 9)
      .map(toOption);

    const paymentModes = rows
      .filter((r) => Number(r.Misc_Type) === 18)
      .map(toOption);

    return res.json({
      Status: true,
      Message: "Dropdowns loaded",
      Result: { insuranceCompanies, paymentModes },
    });
  } catch (e) {
    return res.status(500).json({ Status: false, Message: e.message });
  } finally {
    await sequelize.close();
  }
};


exports.SaveInsuranceRenewal = async (req, res) => {
  const sequelize = await dbname(req, req.headers.compcode);

  try {
    const InsuRenewal = Insu_Renewal(sequelize, DataTypes);
    const InsuRenewalMst = Insu_Renewal_Mst(sequelize, DataTypes);

    const b = req.body || {};

    const regNo = String(b.RegNo || "").trim().toUpperCase();
    if (!regNo) return res.status(400).json({ Status: false, Message: "RegNo required" });

    // multer file
const file = req.file;
if (!file) return res.status(400).json({ Status: false, Message: "PaymentProof file required" });


const compCode = String(req.headers.compcode || "").split("-")[0];
if (!compCode) return res.status(400).json({ Status: false, Message: "compcode header required" });

// ✅ Upload to SMB/central server
const uploaded = await uploadPaymentProofSMB(file, compCode);
const docUrl = uploaded.url; // ✅ full clickable url

    // numeric safe (BIGINT me string bhi chal jayega)
    const onlyDigits = (v) => {
      const s = String(v ?? "").replace(/\D/g, "");
      return s ? s : null;
    };

    // ---- transaction ----
    let created = null;

    await sequelize.transaction(async (t) => {
      // 1) master ensure
      let mst = await InsuRenewalMst.findOne({
        where: { VEHICAL_REG_NO: regNo },
        transaction: t,
      });

      if (!mst) {
        mst = await InsuRenewalMst.create(
          {
            VEHICAL_REG_NO: regNo,
            EXPORT_TYPE: 1,
            CREATED_AT: Sequelize.literal("GETDATE()"),
          },
          { transaction: t, validate: false }
        );
      }
      const tranId = mst?.UTD ?? mst?.dataValues?.UTD ?? null;

      // 2) old active -> 33 (ONLY active)
      await InsuRenewal.update(
        { EXPORT_TYPE: 33 },
        { where: { VEHICAL_REG_NO: regNo, EXPORT_TYPE: 1 }, transaction: t }
      );

      // 3) insert new active row -> 1
      const insertObj = {
        VEHICAL_REG_NO: regNo,

        CUST_NAME: String(b.OwnerName || "").trim(),
        CUST_MOB_NO: onlyDigits(b.MobileNo),
        MODEL_NAME: String(b.ModelVariant || "").trim() || null,

        POLICY_NAME: String(b.PolicyName || "").trim(),
        POLICY_NUMBER: onlyDigits(b.PolicyNo),

        POLICY_START_DATE: b.PolicyStartDate || null,
        POLICY_END_DATE: b.PolicyExpiryDate || null,

        INSU_TYPE: b.InsuranceCo || null,
        PREMIUM_AMOUNT: b.PremiumAmount || null,

        PAYMENT_MODE: b.PaymentMode || null,
        PAYMENT_DATE: b.PaymentDate || null,
        PAYMENT_AMOUNT: b.Amount || null,
        UTR: b.UTR || null,
        CHEQUE_NO: b.ChequeNo || null,
        BANK_NAME: b.BankName || null,
        REMARKS: b.Remarks || null,

        DOC_PATH: docUrl,

        TRAN_ID: tranId,
        EXPORT_TYPE: 1,
        CREATED_AT: Sequelize.literal("GETDATE()"),
      };

      created = await InsuRenewal.create(insertObj, {
        transaction: t,
        validate: false,
        fields: [
          "VEHICAL_REG_NO",
          "CUST_NAME",
          "CUST_MOB_NO",
          "MODEL_NAME",
          "POLICY_NAME",
          "POLICY_NUMBER",
          "POLICY_START_DATE",
          "POLICY_END_DATE",
          "INSU_TYPE",
          "PREMIUM_AMOUNT",
          "PAYMENT_MODE",
          "PAYMENT_DATE",
          "PAYMENT_AMOUNT",
          "UTR",
          "CHEQUE_NO",
          "BANK_NAME",
          "REMARKS",
          "DOC_PATH",
          "TRAN_ID",
          "EXPORT_TYPE",
          "CREATED_AT",
        ],
      });
    });

    return res.json({
      Status: true,
      Message: "Saved. Old active marked 33, new active set to 1.",
      Result: { UTD: created?.UTD, VEHICAL_REG_NO: regNo },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ Status: false, Message: e.message });
  } finally {
    await sequelize.close();
  }
};


const FILE_UPLOAD_BASE_URL = "https://erp.autovyn.com/backend";

async function uploadPaymentProofSMB(file, compCode) {
  const customPath = `${compCode}/insurance/`; // ✅ aap folder name change kar sakte ho

  // unique filename
  const original = String(file.originalname || "proof.png").replace(/\s+/g, "_");
  const filename = `${Date.now()}_${original}`;

  const formData = new FormData();
  formData.append("photo", file.buffer, filename);
  formData.append("customPath", customPath);

  await axios.post(`${FILE_UPLOAD_BASE_URL}/upload-photo`, formData, {
    headers: formData.getHeaders(),
    maxBodyLength: Infinity,
  });

  const storedPath = `${customPath}${filename}`;

  // ✅ clickable url (DOC_PATH me yahi jayega)
  const url = `${FILE_UPLOAD_BASE_URL}/${storedPath}`;

  return { storedPath, url };
}



// ============================================================
// GET ALL Insurance Renewals (with pagination + filters)
// POST /insurance-renewal/getAll
// ============================================================
exports.getAllInsuranceRenewals = async (req, res) => {
  const sequelize = await dbname(req, req.headers.compcode);

  try {
    const b = req.body || {};

    // ── Pagination ──────────────────────────────────────────
    const page     = Math.max(1, parseInt(b.page)     || 1);
    const pageSize = Math.max(1, parseInt(b.pageSize) || 10);
    const offset   = (page - 1) * pageSize;

    // ── Filters ─────────────────────────────────────────────
    const search      = String(b.search      || "").trim();
    const regNo       = String(b.regNo       || "").trim().toUpperCase();
    const exportType  = b.exportType  !== undefined ? parseInt(b.exportType)  : 1; // default active
    const insuType    = String(b.insuType    || "").trim();
    const paymentMode = String(b.paymentMode || "").trim();

    // ── Date helpers ─────────────────────────────────────────
    const pad2 = (x) => String(x).padStart(2, "0");

    const toDbDate = (v) => {
      if (!v) return null;
      const s = String(v).trim();

      // DD/MM/YYYY
      let m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (m) return `${m[3]}-${pad2(m[2])}-${pad2(m[1])}`;

      // DD-MM-YYYY
      m = s.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
      if (m) return `${m[3]}-${pad2(m[2])}-${pad2(m[1])}`;

      // YYYY-MM-DD
      m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
      if (m) return `${m[1]}-${pad2(m[2])}-${pad2(m[3])}`;

      return null;
    };

    const toDisplay = (v) => {
      if (!v) return null;
      if (typeof v === "string") {
        const m = v.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (m) return `${m[3]}/${m[2]}/${m[1]}`;
      }
      const d = v instanceof Date ? v : new Date(v);
      if (isNaN(d.getTime())) return null;
      return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
    };

    // Policy expiry date range filter
    const policyFrom = toDbDate(b.policyFrom);
    const policyTo   = toDbDate(b.policyTo);

    // Created date range filter
    const createdFrom = toDbDate(b.createdFrom);
    const createdTo   = toDbDate(b.createdTo);

    // ── Build WHERE clause ───────────────────────────────────
    const whereParts  = [];
    const replacements = {};

    // EXPORT_TYPE filter (default = 1 active only)
    if (exportType !== null && exportType !== undefined && !isNaN(exportType)) {
      whereParts.push(`IR.EXPORT_TYPE = :exportType`);
      replacements.exportType = exportType;
    }

    // Search (CUST_NAME, VEHICAL_REG_NO, POLICY_NAME, POLICY_NUMBER, MODEL_NAME, CUST_MOB_NO)
    if (search) {
      whereParts.push(`(
        IR.CUST_NAME       LIKE :search OR
        IR.VEHICAL_REG_NO  LIKE :search OR
        IR.POLICY_NAME     LIKE :search OR
        CAST(IR.POLICY_NUMBER AS NVARCHAR) LIKE :search OR
        IR.MODEL_NAME      LIKE :search OR
        CAST(IR.CUST_MOB_NO AS NVARCHAR) LIKE :search
      )`);
      replacements.search = `%${search}%`;
    }

    // RegNo exact filter
    if (regNo) {
      whereParts.push(`IR.VEHICAL_REG_NO = :regNo`);
      replacements.regNo = regNo;
    }

    // Insurance type filter
    if (insuType) {
      whereParts.push(`IR.INSU_TYPE = :insuType`);
      replacements.insuType = insuType;
    }

    // Payment mode filter
    if (paymentMode) {
      whereParts.push(`IR.PAYMENT_MODE = :paymentMode`);
      replacements.paymentMode = paymentMode;
    }

    // Policy expiry date range
    if (policyFrom && policyTo) {
      whereParts.push(`IR.POLICY_END_DATE BETWEEN :policyFrom AND :policyTo`);
      replacements.policyFrom = policyFrom;
      replacements.policyTo   = policyTo;
    } else if (policyFrom) {
      whereParts.push(`IR.POLICY_END_DATE >= :policyFrom`);
      replacements.policyFrom = policyFrom;
    } else if (policyTo) {
      whereParts.push(`IR.POLICY_END_DATE <= :policyTo`);
      replacements.policyTo = policyTo;
    }

    // Created date range
    if (createdFrom && createdTo) {
      whereParts.push(`CONVERT(date, IR.CREATED_AT) BETWEEN :createdFrom AND :createdTo`);
      replacements.createdFrom = createdFrom;
      replacements.createdTo   = createdTo;
    } else if (createdFrom) {
      whereParts.push(`CONVERT(date, IR.CREATED_AT) >= :createdFrom`);
      replacements.createdFrom = createdFrom;
    } else if (createdTo) {
      whereParts.push(`CONVERT(date, IR.CREATED_AT) <= :createdTo`);
      replacements.createdTo = createdTo;
    }

    const whereSQL = whereParts.length
      ? `WHERE ${whereParts.join(" AND ")}`
      : "";

    // ── COUNT query ──────────────────────────────────────────
    const countSQL = `
      SELECT COUNT(*) AS total
      FROM dbo.INSU_RENEWAL IR
      ${whereSQL}
    `;

    const [countResult] = await sequelize.query(countSQL, {
      replacements,
      type: Sequelize.QueryTypes.SELECT,
    });

    const totalRecords = parseInt(countResult?.total || 0);
    const totalPages   = Math.ceil(totalRecords / pageSize) || 1;

    // ── DATA query (with pagination) ─────────────────────────
    replacements.offset   = offset;
    replacements.pageSize = pageSize;

    const dataSQL = `
      SELECT
        -- ── Identity ──────────────────────────────────────
        IR.UTD,
        IR.TRAN_ID,
        IR.EXPORT_TYPE,

        -- ── Customer ──────────────────────────────────────
        IR.CUST_NAME,
        IR.CUST_MOB_NO,

        -- ── Vehicle ───────────────────────────────────────
        IR.VEHICAL_REG_NO,
        IR.MODEL_NAME,

        -- ── Policy ────────────────────────────────────────
        IR.POLICY_NAME,
        IR.POLICY_NUMBER,
        IR.POLICY_START_DATE,
        IR.POLICY_END_DATE,

        -- ── Insurance ─────────────────────────────────────
        IR.INSU_TYPE,
        IR.PREMIUM_AMOUNT,

        -- ── Payment ───────────────────────────────────────
        IR.PAYMENT_MODE,
        IR.PAYMENT_DATE,
        IR.PAYMENT_AMOUNT,
        IR.UTR,
        IR.CHEQUE_NO,
        IR.BANK_NAME,

        -- ── Misc ──────────────────────────────────────────
        IR.REMARKS,
        IR.DOC_PATH,
        IR.CREATED_AT,

        -- ── Computed: Days to expiry ──────────────────────
        DATEDIFF(day, CAST(GETDATE() AS date), IR.POLICY_END_DATE) AS DAYS_TO_EXPIRY,

        -- ── Expiry Status ─────────────────────────────────
        CASE
          WHEN IR.POLICY_END_DATE < CAST(GETDATE() AS date) THEN 'EXPIRED'
          WHEN IR.POLICY_END_DATE = CAST(GETDATE() AS date) THEN 'EXPIRING_TODAY'
          WHEN DATEDIFF(day, CAST(GETDATE() AS date), IR.POLICY_END_DATE) <= 30 THEN 'EXPIRING_SOON'
          ELSE 'ACTIVE'
        END AS EXPIRY_STATUS,

        -- ── MST info ──────────────────────────────────────
        MST.UTD            AS MST_UTD,
        MST.VEHICAL_REG_NO AS MST_REG_NO

      FROM dbo.INSU_RENEWAL IR
      LEFT JOIN dbo.INSU_RENEWAL_MST MST
        ON MST.UTD = IR.TRAN_ID
      ${whereSQL}
      ORDER BY IR.UTD DESC
      OFFSET :offset ROWS
      FETCH NEXT :pageSize ROWS ONLY
    `;

    const rows = await sequelize.query(dataSQL, {
      replacements,
      type: Sequelize.QueryTypes.SELECT,
    });

    // ── Format dates for display ─────────────────────────────
    const data = rows.map((r) => ({
      // Identity
      UTD        : r.UTD,
      TRAN_ID    : r.TRAN_ID,
      EXPORT_TYPE: r.EXPORT_TYPE,

      // Customer
      CUST_NAME  : r.CUST_NAME   || null,
      CUST_MOB_NO: r.CUST_MOB_NO ? String(r.CUST_MOB_NO) : null,

      // Vehicle
      VEHICAL_REG_NO: r.VEHICAL_REG_NO || null,
      MODEL_NAME    : r.MODEL_NAME      || null,

      // Policy
      POLICY_NAME      : r.POLICY_NAME       || null,
      POLICY_NUMBER    : r.POLICY_NUMBER     ? String(r.POLICY_NUMBER) : null,
      POLICY_START_DATE: toDisplay(r.POLICY_START_DATE),
      POLICY_END_DATE  : toDisplay(r.POLICY_END_DATE),

      // Insurance
      INSU_TYPE     : r.INSU_TYPE      || null,
      PREMIUM_AMOUNT: r.PREMIUM_AMOUNT != null ? parseFloat(r.PREMIUM_AMOUNT) : null,

      // Payment
      PAYMENT_MODE  : r.PAYMENT_MODE   || null,
      PAYMENT_DATE  : toDisplay(r.PAYMENT_DATE),
      PAYMENT_AMOUNT: r.PAYMENT_AMOUNT != null ? parseFloat(r.PAYMENT_AMOUNT) : null,
      UTR           : r.UTR            || null,
      CHEQUE_NO     : r.CHEQUE_NO      || null,
      BANK_NAME     : r.BANK_NAME      || null,

      // Misc
      REMARKS   : r.REMARKS    || null,
      DOC_PATH  : r.DOC_PATH   || null,
      CREATED_AT: toDisplay(r.CREATED_AT),

      // Computed
      DAYS_TO_EXPIRY: r.DAYS_TO_EXPIRY != null ? parseInt(r.DAYS_TO_EXPIRY) : null,
      EXPIRY_STATUS : r.EXPIRY_STATUS  || null,

      // MST
      MST_UTD   : r.MST_UTD    || null,
      MST_REG_NO: r.MST_REG_NO || null,
    }));

    // ── Summary stats ────────────────────────────────────────
    const statsSQL = `
      SELECT
        COUNT(*)                                                        AS total,
        SUM(CASE WHEN POLICY_END_DATE < CAST(GETDATE() AS date)  THEN 1 ELSE 0 END) AS expired,
        SUM(CASE WHEN POLICY_END_DATE = CAST(GETDATE() AS date)  THEN 1 ELSE 0 END) AS expiring_today,
        SUM(CASE WHEN DATEDIFF(day, CAST(GETDATE() AS date), POLICY_END_DATE)
                      BETWEEN 1 AND 30                                THEN 1 ELSE 0 END) AS expiring_soon,
        SUM(CASE WHEN POLICY_END_DATE > DATEADD(day,30,CAST(GETDATE() AS date)) THEN 1 ELSE 0 END) AS active,
        SUM(ISNULL(PREMIUM_AMOUNT, 0))                                  AS total_premium,
        SUM(ISNULL(PAYMENT_AMOUNT, 0))                                  AS total_payment
      FROM dbo.INSU_RENEWAL
      WHERE EXPORT_TYPE = 1
    `;

    const [stats] = await sequelize.query(statsSQL, {
      type: Sequelize.QueryTypes.SELECT,
    });

    return res.json({
      success     : true,
      Message     : "Insurance renewals fetched successfully",
      pagination  : {
        currentPage : page,
        pageSize,
        totalPages,
        totalRecords,
      },
      summary: {
        total         : parseInt(stats?.total          || 0),
        expired       : parseInt(stats?.expired        || 0),
        expiring_today: parseInt(stats?.expiring_today || 0),
        expiring_soon : parseInt(stats?.expiring_soon  || 0),
        active        : parseInt(stats?.active         || 0),
        total_premium : parseFloat(stats?.total_premium || 0),
        total_payment : parseFloat(stats?.total_payment || 0),
      },
      data,
    });
  } catch (e) {
    console.error("getAllInsuranceRenewals Error:", e);
    return res.status(500).json({ success: false, Message: e.message });
  } finally {
    await sequelize.close();
  }
};


// ============================================================
// GET ONE Insurance Renewal by UTD
// POST /insurance-renewal/getOne
// Body: { UTD: 5 }
// ============================================================
exports.getInsuranceRenewalById = async (req, res) => {
  const sequelize = await dbname(req, req.headers.compcode);

  try {
    const UTD = parseInt(req.body?.UTD || req.query?.UTD);
    if (!UTD || isNaN(UTD)) {
      return res.status(400).json({ success: false, Message: "UTD required (integer)" });
    }

    // ── Date display helper ──────────────────────────────────
    const pad2 = (x) => String(x).padStart(2, "0");

    const toDisplay = (v) => {
      if (!v) return null;
      if (typeof v === "string") {
        const m = v.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (m) return `${m[3]}/${m[2]}/${m[1]}`;
      }
      const d = v instanceof Date ? v : new Date(v);
      if (isNaN(d.getTime())) return null;
      return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
    };

    // ── Main detail query ────────────────────────────────────
    const sql = `
      SELECT
        -- ── Identity ──────────────────────────────────────
        IR.UTD,
        IR.TRAN_ID,
        IR.EXPORT_TYPE,

        -- ── Customer ──────────────────────────────────────
        IR.CUST_NAME,
        IR.CUST_MOB_NO,

        -- ── Vehicle ───────────────────────────────────────
        IR.VEHICAL_REG_NO,
        IR.MODEL_NAME,

        -- ── Policy ────────────────────────────────────────
        IR.POLICY_NAME,
        IR.POLICY_NUMBER,
        IR.POLICY_START_DATE,
        IR.POLICY_END_DATE,

        -- ── Insurance ─────────────────────────────────────
        IR.INSU_TYPE,
        IR.PREMIUM_AMOUNT,

        -- ── Payment ───────────────────────────────────────
        IR.PAYMENT_MODE,
        IR.PAYMENT_DATE,
        IR.PAYMENT_AMOUNT,
        IR.UTR,
        IR.CHEQUE_NO,
        IR.BANK_NAME,

        -- ── Misc ──────────────────────────────────────────
        IR.REMARKS,
        IR.DOC_PATH,
        IR.CREATED_AT,
        IR.VALIDFROM,
        IR.VALIDTO,

        -- ── Computed ──────────────────────────────────────
        DATEDIFF(day, CAST(GETDATE() AS date), IR.POLICY_END_DATE) AS DAYS_TO_EXPIRY,

        CASE
          WHEN IR.POLICY_END_DATE < CAST(GETDATE() AS date) THEN 'EXPIRED'
          WHEN IR.POLICY_END_DATE = CAST(GETDATE() AS date) THEN 'EXPIRING_TODAY'
          WHEN DATEDIFF(day, CAST(GETDATE() AS date), IR.POLICY_END_DATE) <= 30 THEN 'EXPIRING_SOON'
          ELSE 'ACTIVE'
        END AS EXPIRY_STATUS,

        -- ── MST Info ──────────────────────────────────────
        MST.UTD            AS MST_UTD,
        MST.VEHICAL_REG_NO AS MST_REG_NO,
        MST.CREATED_AT     AS MST_CREATED_AT,
        MST.EXPORT_TYPE    AS MST_EXPORT_TYPE

      FROM dbo.INSU_RENEWAL IR
      LEFT JOIN dbo.INSU_RENEWAL_MST MST
        ON MST.UTD = IR.TRAN_ID
      WHERE IR.UTD = :UTD
    `;

    const [row] = await sequelize.query(sql, {
      replacements: { UTD },
      type        : Sequelize.QueryTypes.SELECT,
    });

    if (!row) {
      return res.status(404).json({
        success: false,
        Message: `No record found with UTD = ${UTD}`,
      });
    }

    // ── History: same RegNo ke saare records ─────────────────
    let history = [];
    if (row.VEHICAL_REG_NO) {
      const histSQL = `
        SELECT
          UTD,
          POLICY_NAME,
          POLICY_NUMBER,
          POLICY_START_DATE,
          POLICY_END_DATE,
          INSU_TYPE,
          PREMIUM_AMOUNT,
          PAYMENT_MODE,
          PAYMENT_AMOUNT,
          PAYMENT_DATE,
          DOC_PATH,
          EXPORT_TYPE,
          CREATED_AT
        FROM dbo.INSU_RENEWAL
        WHERE VEHICAL_REG_NO = :regNo
          AND UTD            <> :UTD
        ORDER BY UTD DESC
      `;

      const histRows = await sequelize.query(histSQL, {
        replacements: { regNo: row.VEHICAL_REG_NO, UTD },
        type        : Sequelize.QueryTypes.SELECT,
      });

      history = histRows.map((h) => ({
        UTD              : h.UTD,
        POLICY_NAME      : h.POLICY_NAME       || null,
        POLICY_NUMBER    : h.POLICY_NUMBER     ? String(h.POLICY_NUMBER) : null,
        POLICY_START_DATE: toDisplay(h.POLICY_START_DATE),
        POLICY_END_DATE  : toDisplay(h.POLICY_END_DATE),
        INSU_TYPE        : h.INSU_TYPE         || null,
        PREMIUM_AMOUNT   : h.PREMIUM_AMOUNT    != null ? parseFloat(h.PREMIUM_AMOUNT) : null,
        PAYMENT_MODE     : h.PAYMENT_MODE      || null,
        PAYMENT_AMOUNT   : h.PAYMENT_AMOUNT    != null ? parseFloat(h.PAYMENT_AMOUNT) : null,
        PAYMENT_DATE     : toDisplay(h.PAYMENT_DATE),
        DOC_PATH         : h.DOC_PATH          || null,
        EXPORT_TYPE      : h.EXPORT_TYPE,
        CREATED_AT       : toDisplay(h.CREATED_AT),
        IS_ACTIVE        : h.EXPORT_TYPE === 1,
      }));
    }

    // ── Format main record ───────────────────────────────────
    const data = {
      // Identity
      UTD        : row.UTD,
      TRAN_ID    : row.TRAN_ID    || null,
      EXPORT_TYPE: row.EXPORT_TYPE,
      IS_ACTIVE  : row.EXPORT_TYPE === 1,

      // Customer
      CUST_NAME  : row.CUST_NAME   || null,
      CUST_MOB_NO: row.CUST_MOB_NO ? String(row.CUST_MOB_NO) : null,

      // Vehicle
      VEHICAL_REG_NO: row.VEHICAL_REG_NO || null,
      MODEL_NAME    : row.MODEL_NAME      || null,

      // Policy
      POLICY_NAME      : row.POLICY_NAME       || null,
      POLICY_NUMBER    : row.POLICY_NUMBER     ? String(row.POLICY_NUMBER) : null,
      POLICY_START_DATE: toDisplay(row.POLICY_START_DATE),
      POLICY_END_DATE  : toDisplay(row.POLICY_END_DATE),

      // Insurance
      INSU_TYPE     : row.INSU_TYPE      || null,
      PREMIUM_AMOUNT: row.PREMIUM_AMOUNT != null ? parseFloat(row.PREMIUM_AMOUNT) : null,

      // Payment
      PAYMENT_MODE  : row.PAYMENT_MODE   || null,
      PAYMENT_DATE  : toDisplay(row.PAYMENT_DATE),
      PAYMENT_AMOUNT: row.PAYMENT_AMOUNT != null ? parseFloat(row.PAYMENT_AMOUNT) : null,
      UTR           : row.UTR            || null,
      CHEQUE_NO     : row.CHEQUE_NO      || null,
      BANK_NAME     : row.BANK_NAME      || null,

      // Misc
      REMARKS   : row.REMARKS    || null,
      DOC_PATH  : row.DOC_PATH   || null,
      CREATED_AT: toDisplay(row.CREATED_AT),
      VALIDFROM : toDisplay(row.VALIDFROM),
      VALIDTO   : toDisplay(row.VALIDTO),

      // Computed
      DAYS_TO_EXPIRY: row.DAYS_TO_EXPIRY != null ? parseInt(row.DAYS_TO_EXPIRY) : null,
      EXPIRY_STATUS : row.EXPIRY_STATUS  || null,

      // MST
      master: {
        MST_UTD        : row.MST_UTD         || null,
        MST_REG_NO     : row.MST_REG_NO      || null,
        MST_CREATED_AT : toDisplay(row.MST_CREATED_AT),
        MST_EXPORT_TYPE: row.MST_EXPORT_TYPE || null,
      },

      // History (same vehicle ke previous renewals)
      history,
      historyCount: history.length,
    };

    return res.json({
      success: true,
      Message: "Record fetched successfully",
      data,
    });
  } catch (e) {
    console.error("getInsuranceRenewalById Error:", e);
    return res.status(500).json({ success: false, Message: e.message });
  } finally {
    await sequelize.close();
  }
};