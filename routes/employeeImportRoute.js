const { dbname } = require("../utils/dbconfig");
const { DataTypes } = require("sequelize");
const xlsx = require("xlsx");
const ExcelJS = require("exceljs");
const { _Employeemaster } = require("../models/Employeemaster");

// Helper function to format Date
function formatDate(date) {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  if (d.getFullYear() <= 1900) return null;
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

const monthMap = {
  jan: 1, "jan.": 1, january: 1,
  feb: 2, "feb.": 2, february: 2,
  mar: 3, "mar.": 3, march: 3,
  apr: 4, "apr.": 4, april: 4,
  may: 5,
  jun: 6, "jun.": 6, june: 6,
  jul: 7, "jul.": 7, july: 7,
  aug: 8, "aug.": 8, august: 8,
  sep: 9, "sep.": 9, sept: 9, "sept.": 9, september: 9,
  oct: 10, "oct.": 10, october: 10,
  nov: 11, "nov.": 11, november: 11,
  dec: 12, "dec.": 12, december: 12
};

function formatResultDate(yyyy, mm, dd) {
  if (!yyyy || !mm || !dd || isNaN(yyyy) || isNaN(mm) || isNaN(dd)) {
    return { date: null, displayDate: null, displayShort: null, invalid: true, is1900: false };
  }
  // User requested: 01/01/1900 agar aata hai to use null kar do aur data insert hone do
  if (Number(yyyy) <= 1900 || (Number(yyyy) === 1900 && Number(mm) === 1 && Number(dd) === 1)) {
    return { date: null, displayDate: null, displayShort: null, invalid: false, is1900: true };
  }
  if (yyyy < 1900 || yyyy > 2100 || mm < 1 || mm > 12 || dd < 1 || dd > 31) {
    return { date: null, displayDate: null, displayShort: null, invalid: true, is1900: false };
  }
  const testDate = new Date(yyyy, mm - 1, dd);
  if (testDate.getFullYear() !== yyyy || testDate.getMonth() !== mm - 1 || testDate.getDate() !== dd) {
    return { date: null, displayDate: null, displayShort: null, invalid: true, is1900: false };
  }

  const pad = (n) => String(n).padStart(2, "0");
  const sqlDate = `${yyyy}-${pad(mm)}-${pad(dd)}`;
  const displayDate = `${pad(dd)}/${pad(mm)}/${yyyy}`;
  const displayShort = `${pad(dd)}/${pad(mm)}/${String(yyyy).slice(-2)}`;
  return { date: sqlDate, displayDate, displayShort, invalid: false, is1900: false };
}

/**
 * Resolves a 2-digit year using a 100-year window ending at the current date.
 * If 2000 + yy is in the future compared to today, it belongs to the previous century (1900 + yy).
 * If 2000 + yy is today or in the past, it belongs to 2000 + yy.
 * Example (Assuming current date is 02/10/2026):
 * - 01/07/26 -> 01/07/2026 (July 2026 is before October 2026)
 * - 02/12/26 -> 02/12/1926 (December 2026 is after October 2026 -> future -> 1926)
 * - 01/07/27 -> 01/07/1927 (2027 is after 2026 -> future -> 1927)
 * - 15/08/98 -> 15/08/1998 (2098 is future -> 1998)
 * - 10/05/15 -> 10/05/2015 (2015 is past -> 2015)
 */
function resolveTwoDigitYear(twoDigitYear, month, day) {
  const numYear = parseInt(twoDigitYear, 10);
  if (isNaN(numYear)) return null;
  if (numYear >= 100) return numYear; // Already 4 digits

  const now = new Date();
  const currentFullYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1 to 12
  const currentDay = now.getDate();

  const candidateYear2000 = 2000 + numYear;

  // 1. Candidate year is strictly in the future -> 1900s
  if (candidateYear2000 > currentFullYear) {
    return 1900 + numYear;
  }

  // 2. Candidate year is strictly in the past -> 2000s
  if (candidateYear2000 < currentFullYear) {
    return candidateYear2000;
  }

  // 3. Candidate year is the current year (e.g. 26 when current is 2026):
  const m = parseInt(month, 10) || 1;
  const d = parseInt(day, 10) || 1;

  if (m > currentMonth) {
    // Month is in future -> 1900s
    return 1900 + numYear;
  } else if (m < currentMonth) {
    // Month is in past -> 2000s
    return candidateYear2000;
  } else {
    // Same month -> compare day
    if (d > currentDay) {
      // Day is in future -> 1900s
      return 1900 + numYear;
    } else {
      // Day is today or past -> 2000s
      return candidateYear2000;
    }
  }
}

// Comprehensive date parsing: accepts DD/MM/YYYY, DD/MM/YY, DD-MM-YYYY, DD-MM-YY,
// YYYY-MM-DD, YYYY/MM/DD, Excel serial numbers, text months (01-Jan-26, 15-Apr-98), and JS Date objects
function parseExcelDate(value) {
  if (value === null || value === undefined || value === "") {
    return { date: null, displayDate: null, displayShort: null, invalid: false, is1900: false };
  }

  // 1. If Date object
  if (value instanceof Date) {
    if (isNaN(value.getTime())) return { date: null, displayDate: null, displayShort: null, invalid: true, is1900: false };
    const fy = value.getFullYear();
    const fm = value.getMonth() + 1;
    const fd = value.getDate();
    if (fy <= 1900) {
      return { date: null, displayDate: null, displayShort: null, invalid: false, is1900: true };
    }
    return formatResultDate(fy, fm, fd);
  }

  let strOriginal = String(value).replace(/^['"\s]+|['"\s]+$/g, "").trim();
  if (!strOriginal) return { date: null, displayDate: null, displayShort: null, invalid: false, is1900: false };

  // Strip time part first if present (e.g. '01/01/1900 00:00:00' or '1900-01-01T00:00:00.000Z')
  let strWithoutTime = strOriginal.replace(/T.*$/i, "").replace(/\s+\d{1,2}:\d{2}(:\d{2})?.*$/, "").trim();

  // Treat placeholder strings and 1900-01-01 / 01/01/1900 variants as null
  const cleanLower = strWithoutTime.toLowerCase().trim();
  const withoutSeparators = cleanLower.replace(/[\s\-_.\/\\]/g, "");
  if (
    !withoutSeparators ||
    /^0+$/.test(withoutSeparators) ||
    ["na", "n/a", "null", "nil", "none", "nan", "undefined", "notavailable", "notapplicable", "01011900", "19000101", "111900", "010100", "1100"].includes(cleanLower) ||
    ["na", "n/a", "null", "nil", "none", "nan", "undefined", "01011900", "19000101", "111900", "010100", "1100"].includes(withoutSeparators)
  ) {
    return { date: null, displayDate: null, displayShort: null, invalid: false, is1900: true };
  }

  // 2. Excel numeric serial date (e.g. 45427 or 45427.0 or 32998, 0 or 1 = 01/01/1900)
  if (!isNaN(strOriginal) && !/[a-zA-Z]/.test(strOriginal) && !strOriginal.includes("/") && !strOriginal.includes("-")) {
    const num = parseFloat(strOriginal);
    if (num <= 1) {
      // Excel 0 or 1 represents 01/01/1900 -> treat as null
      return { date: null, displayDate: null, displayShort: null, invalid: false, is1900: true };
    }
    if (num > 1 && num < 100000) {
      // 25569 = days between 1900-01-01 and 1970-01-01
      const date = new Date(Math.round((num - 25569) * 86400 * 1000));
      const fy = date.getUTCFullYear();
      const fm = date.getUTCMonth() + 1;
      const fd = date.getUTCDate();
      if (fy <= 1900) {
        return { date: null, displayDate: null, displayShort: null, invalid: false, is1900: true };
      }
      return formatResultDate(fy, fm, fd);
    }
  }

  // 3. String date: normalized delimiters to dash
  const normalized = strWithoutTime.replace(/[\s\-_.\/]+/g, "-");
  const parts = normalized.split("-").filter(Boolean);

  if (parts.length === 3) {
    let [p0, p1, p2] = parts.map((p) => p.trim());
    let dd, mm, yyyy;

    const mKey1 = p1.toLowerCase();
    const mKey0 = p0.toLowerCase();

    if (monthMap[mKey1]) {
      // e.g. 01-Jan-26 or 01-Jan-2026
      mm = monthMap[mKey1];
      dd = parseInt(p0, 10);
      let rawY = parseInt(p2, 10);
      yyyy = rawY > 1000 ? rawY : resolveTwoDigitYear(rawY, mm, dd);
    } else if (monthMap[mKey0]) {
      // e.g. Jan-01-26 or Jan-01-2026
      mm = monthMap[mKey0];
      dd = parseInt(p1, 10);
      let rawY = parseInt(p2, 10);
      yyyy = rawY > 1000 ? rawY : resolveTwoDigitYear(rawY, mm, dd);
    } else if (p0.length === 4) {
      // YYYY-MM-DD
      yyyy = parseInt(p0, 10);
      mm = parseInt(p1, 10);
      dd = parseInt(p2, 10);
    } else {
      // DD-MM-YYYY, DD-MM-YY, MM-DD-YYYY, MM-DD-YY
      let v0 = parseInt(p0, 10);
      let v1 = parseInt(p1, 10);
      let v2 = parseInt(p2, 10);

      // Determine day and month
      if (v0 > 12 && v1 <= 12) {
        dd = v0;
        mm = v1;
      } else if (v0 <= 12 && v1 > 12) {
        dd = v1;
        mm = v0;
      } else {
        // Standard Indian / UK format: DD/MM
        dd = v0;
        mm = v1;
      }

      // Determine year (preserving 4-digit years or applying 100-year sliding window for 2-digit years)
      if (v2 > 1000) {
        yyyy = v2;
      } else {
        yyyy = resolveTwoDigitYear(v2, mm, dd);
      }
    }

    if (yyyy <= 1900) {
      return { date: null, displayDate: null, displayShort: null, invalid: false, is1900: true };
    }

    const res = formatResultDate(yyyy, mm, dd);
    if (res.is1900) return { date: null, displayDate: null, displayShort: null, invalid: false, is1900: true };
    if (!res.invalid) return res;
  }

  // Fallback to native JS Date
  const parsedNative = new Date(strOriginal);
  if (!isNaN(parsedNative.getTime())) {
    const fy = parsedNative.getFullYear();
    const fm = parsedNative.getMonth() + 1;
    const fd = parsedNative.getDate();
    if (fy <= 1900) {
      return { date: null, displayDate: null, displayShort: null, invalid: false, is1900: true };
    }
    return formatResultDate(fy, fm, fd);
  }

  return { date: null, displayDate: null, displayShort: null, invalid: true, is1900: false };
}

function validateIFSC(ifsc) {
  if (!ifsc) return false;
  return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(String(ifsc).trim().toUpperCase());
}


async function isEmpCodeRangeConfigured(sequelize) {
const [prefixData] = await sequelize.query(
`SELECT TOP 1 RANGE_NAME, RANGE_CODE
FROM GODOWN_MST
WHERE ISNULL(EXPORT_TYPE, 0) < 3 ORDER BY RANGE_CODE DESC`
);
return !!(
prefixData.length &&
prefixData[0].RANGE_NAME &&
prefixData[0].RANGE_CODE !== null &&
prefixData[0].RANGE_CODE !== undefined
);
}


async function generateNextEmployeeCode(sequelize) {
// Get last RANGE_CODE
const [rangeData] = await sequelize.query(
`SELECT MAX(RANGE_CODE) as RANGE_CODEDATA
FROM GODOWN_MST
WHERE ISNULL(EXPORT_TYPE, 0) < 3`
);

// Get prefix
const [prefixData] = await sequelize.query(
`SELECT TOP 1 RANGE_NAME
FROM GODOWN_MST
WHERE ISNULL(EXPORT_TYPE, 0) < 3 ORDER BY RANGE_CODE DESC`
);

const lastNumber = parseInt(rangeData[0].RANGE_CODEDATA) || 0;
const prefix = prefixData[0].RANGE_NAME.toUpperCase();
const newNumber = lastNumber + 1;

// Update GODOWN_MST with incremented RANGE_CODE
await sequelize.query(
`UPDATE GODOWN_MST SET RANGE_CODE = ${newNumber}
WHERE RANGE_NAME = '${prefix}' AND ISNULL(EXPORT_TYPE,0) < 3`
);

return prefix + newNumber;
}


function formatUserFriendlyErrorMessage(error) {
  if (!error) return "An unexpected error occurred during import.";

  const rawMsg = error.original?.message || error.message || String(error);

  // 1. Invalid column name in database table
  if (/Invalid column name/i.test(rawMsg)) {
    const match = rawMsg.match(/Invalid column name '([^']+)'/i);
    return match
      ? `Database Column Error: Column '${match[1]}' is invalid or missing in database. Please check your Excel column headers.`
      : "Database Column Error: A column name in Excel does not match the database schema.";
  }

  // 2. Cannot insert NULL into column
  if (/Cannot insert the value NULL into column/i.test(rawMsg)) {
    const match = rawMsg.match(/column '([^']+)'/i);
    return match
      ? `Missing Required Value: Database column '${match[1]}' cannot be empty. Please ensure all required fields are filled.`
      : "Missing Required Value: A mandatory database column was left blank in Excel.";
  }

  // 3. String or binary data would be truncated
  if (/String or binary data would be truncated/i.test(rawMsg)) {
    return "Data Length Error: One or more cell values in your Excel exceed the maximum allowed length. Please shorten long fields.";
  }

  // 4. Duplicate key / PRIMARY KEY constraint
  if (/duplicate key/i.test(rawMsg) || /PRIMARY KEY/i.test(rawMsg) || /unique constraint/i.test(rawMsg)) {
    const match = rawMsg.match(/The duplicate key value is \(([^)]+)\)/i);
    return match
      ? `Duplicate Record Error: Record with key (${match[1]}) already exists in database.`
      : "Duplicate Record Error: A record with this code/key already exists in the database.";
  }

  // 5. Conversion failed (date/datetime/int)
  if (/Conversion failed/i.test(rawMsg) || /converting date/i.test(rawMsg)) {
    return "Data Format Error: Failed to convert date or number. Please check date (DD/MM/YYYY) and numeric values in Excel.";
  }

  // 6. Foreign key violation
  if (/FOREIGN KEY constraint/i.test(rawMsg)) {
    return "Reference Error: One or more referenced codes do not exist in master tables. Please check your data.";
  }

  // 7. Timeout
  if (/timeout/i.test(rawMsg) || /ETIMEDOUT/i.test(rawMsg)) {
    return "Database Timeout: The request took too long to complete. Please try importing in smaller batches.";
  }

  // Clean raw message fallback
  const cleanFirstLine = rawMsg.split("\n")[0].replace(/^Error:\s*/i, "").trim();
  return cleanFirstLine ? `Import Error: ${cleanFirstLine}` : "Error during import. Please check file format and data.";
}

exports.excelimportFinal = async function (req, res) {
  // =========================================================================
  // 1. FAST FILE & HEADER VALIDATION (In-Memory, Zero DB Connection/Transaction)
  // =========================================================================
  const excelFile = req.files?.["excel"]?.[0];
  if (!excelFile || !excelFile.buffer || excelFile.buffer.length === 0) {
    return res.status(400).send({ Message: "No file uploaded. Please select a valid Excel file to import." });
  }

  // File extension & mime validation
  const allowedExtensions = [".xlsx", ".xls"];
  const allowedMimeTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
    "application/octet-stream"
  ];
  const originalName = excelFile.originalname || "";
  const dotIndex = originalName.lastIndexOf(".");
  const fileExt = dotIndex !== -1 ? originalName.substring(dotIndex).toLowerCase() : "";
  const isExtensionValid = allowedExtensions.includes(fileExt);
  const isMimeTypeValid = !excelFile.mimetype || allowedMimeTypes.includes(excelFile.mimetype);

  if (!isExtensionValid || !isMimeTypeValid) {
    return res.status(400).send({
      Message: "Unsupported file format. Please upload a valid Excel file (.xlsx or .xls) only."
    });
  }

  let workbook;
  try {
    workbook = xlsx.read(excelFile.buffer, {
      type: "buffer",
      cellDates: false,
      cellNF: true,
      cellText: true
    });
  } catch (readErr) {
    return res.status(400).send({
      Message: "Failed to read Excel file. The file may be corrupted, invalid, or password protected."
    });
  }

  if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
    return res.status(400).send({ Message: "The uploaded Excel file contains no worksheets." });
  }

  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const allRows = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: "" });

  if (!allRows || !allRows.length) {
    return res.status(400).send({ Message: "The uploaded Excel sheet is empty. Please provide an Excel file with data." });
  }

  // 2. Locate header row dynamically (Search first 25 rows for EmpName / EMPFIRSTNAME / Employee Name)
  const empNameHeaderAliases = new Set([
    "EMPNAME", "EMPFIRSTNAME", "EMPLOYEE NAME", "EMPLOYEE_NAME",
    "EMP NAME", "EMP_NAME", "NAME"
  ]);

  let headerIdx = -1;
  for (let i = 0; i < Math.min(allRows.length, 25); i++) {
    const row = allRows[i];
    if (Array.isArray(row) && row.some(cell => {
      const str = String(cell || "").trim().toUpperCase();
      return empNameHeaderAliases.has(str) || str === "EMPCODE";
    })) {
      headerIdx = i;
      break;
    }
  }

  if (headerIdx === -1) {
    return res.status(400).send({
      Message: "Missing required column 'EmpName' (Employee Name) in Excel. Please check column headers or use the download template."
    });
  }

  const headers = allRows[headerIdx].map(h => String(h || "").trim());
  const hasEmpNameInHeaders = headers.some(h => empNameHeaderAliases.has(h.toUpperCase()));
  if (!hasEmpNameInHeaders) {
    return res.status(400).send({
      Message: "Missing required column 'EmpName' (Employee Name) in Excel headers. Please include the Employee Name column."
    });
  }

  // 3. Extract data rows while immediately skipping reference guide tables and empty rows
  const rawData = [];
  const refDropdownWords = new Set([
    "MALE", "FEMALE", "REGULAR", "CASUAL", "APPRENTICE",
    "BANK TRANSFER", "CHEQUE", "CASH", "NEFT", "OTHER", "SALARY HOLD"
  ]);

  for (let i = headerIdx + 1; i < allRows.length; i++) {
    const row = allRows[i];
    if (!Array.isArray(row)) continue;

    // Check if user left the reference guide table at the bottom (Row 7+ in template)
    const isRefTable = row.some(cell => {
      const val = String(cell || "").toLowerCase().trim();
      return val.includes("shift timing") ||
             val.includes("shfit timing") ||
             val.includes("only for refrence") ||
             val.includes("only for reference") ||
             val.includes("copy these headings");
    });
    const isHeaderes2 = String(row[0] || "").trim().toUpperCase() === "GENDER" &&
                        String(row[1] || "").trim().toUpperCase() === "EMPTYPE";

    if (isRefTable || isHeaderes2) {
      break; // Reference guide reached, stop reading completely
    }

    // Check if row has any non-empty cell
    const hasContent = row.some(cell => cell !== null && cell !== undefined && String(cell).trim() !== "");
    if (!hasContent) continue;

    const rowObj = {};
    headers.forEach((h, colIdx) => {
      if (!h) return;
      const cleanH = String(h || "").trim();
      const isDateCol = /dob|birth|join|joning|doj/i.test(cleanH);

      const cellAddress = xlsx.utils.encode_cell({ r: i, c: colIdx });
      const cell = sheet ? sheet[cellAddress] : null;

      const isDateValue = cell && cell.w && /^\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4}/.test(String(cell.w).trim());

      // For date columns or formatted date values: ALWAYS prefer formatted text (cell.w) from Excel
      // (e.g. '10/1/1996', '15/06/26', '10/8/2025', '1/2/2023') to prevent Excel's internal numeric serial conversion
      // from swapping Day and Month when regional settings differ.
      if ((isDateCol || isDateValue) && cell && cell.w !== undefined && String(cell.w).trim() !== "") {
        rowObj[h] = String(cell.w).trim();
      } else {
        rowObj[h] = row[colIdx] !== undefined ? row[colIdx] : "";
      }
    });

    // Check for real employee identity fields
    const empNameVal = String(
      rowObj.EmpName || rowObj.EMPFIRSTNAME || rowObj["Employee Name"] || rowObj["EMPLOYEE NAME"] || ""
    ).trim();
    const empCodeVal = String(
      rowObj.EMPCODE || rowObj.EmpCode || rowObj["Emp Code"] || ""
    ).trim();
    const mobileVal = String(
      rowObj.PERSONAL_MOBILE_NUMBER || rowObj.MOBILE_NO || rowObj["Personal Mobile Number"] || rowObj["Mobile No"] || ""
    ).trim();
    const aadharVal = String(rowObj.AADHAR_CARD || rowObj.UID_NO || "").trim();
    const panVal = String(rowObj.PANNO || "").trim();

    // Skip reference guide option rows if header row was omitted or deleted
    if (refDropdownWords.has(empNameVal.toUpperCase()) && !mobileVal && !empCodeVal && !aadharVal && !panVal) {
      continue;
    }

    // Skip ghost/blank rows with zero employee identifiers
    if (!empNameVal && !empCodeVal && !mobileVal && !aadharVal && !panVal) {
      continue;
    }

    rawData.push(rowObj);
  }

  // FAST RETURN (< 10ms): If empty sheet or empty template was uploaded
  if (!rawData.length) {
    return res.status(400).send({
      Message: "No employee data found in Excel. Please fill employee details below the header row."
    });
  }

  // =========================================================================
  // 2. DATABASE PROCESSING (Only Executed When Real Data Exists)
  // =========================================================================
  let sequelize = null;
  let t = null;

  try {
    sequelize = await dbname(req, req.headers.compcode);
    t = await sequelize.transaction();

    const EmployeeMaster = _Employeemaster(sequelize, DataTypes);
    const { user, branch } = req.body;
    const locCode = branch ?? user?.branch ?? 1;
    const changedByUser = req.headers?.name || user?.name || "SYSTEM";

    // Determine logged-in User_Code
    let userCode = req.headers?.user_code || req.headers?.usercode || req.body?.user_code || req.body?.user?.user_code;
    if (!userCode && req.headers?.name) {
      const userRec = await sequelize.query(
        `SELECT TOP 1 User_Code FROM User_Tbl WHERE User_Name = :name AND ISNULL(Export_Type, 0) < 5`,
        { replacements: { name: req.headers.name }, type: sequelize.QueryTypes.SELECT }
      );
      userCode = userRec[0]?.User_Code;
    }
    userCode = Number(userCode || 0);

    // ===== Column mapping dictionary with extensive aliases =====
    const keyMap = {
      // Employee Name
      EmpName: "EMPFIRSTNAME",
      EMPNAME: "EMPFIRSTNAME",
      EMPFIRSTNAME: "EMPFIRSTNAME",
      "Employee Name": "EMPFIRSTNAME",
      "EMPLOYEE NAME": "EMPFIRSTNAME",
      "Employee_Name": "EMPFIRSTNAME",
      "EMPLOYEE_NAME": "EMPFIRSTNAME",
      "Emp Name": "EMPFIRSTNAME",
      "EMP NAME": "EMPFIRSTNAME",
      "Emp_Name": "EMPFIRSTNAME",
      "EMP_NAME": "EMPFIRSTNAME",
      Name: "EMPFIRSTNAME",
      NAME: "EMPFIRSTNAME",

      // Gender & Types
      GENDER: "GENDER",
      Gender: "GENDER",
      gender: "GENDER",
      EMPTYPE: "EMPTYPE",
      EmpType: "EMPTYPE",
      emptype: "EMPTYPE",
      "Employee Type": "EMPTYPE",
      "EMPLOYEE TYPE": "EMPTYPE",
      CHANNEL: "CHANNEL",
      Channel: "CHANNEL",
      CLUSTER: "CLUSTER",
      Cluster: "CLUSTER",
      LOCATION: "LOCATION",
      Location: "LOCATION",
      location: "LOCATION",
      SECTION: "SECTION",
      Section: "SECTION",
      Department: "DIVISION",
      DEPARTMENT: "DIVISION",
      department: "DIVISION",
      DIVISION: "DIVISION",
      Division: "DIVISION",
      division: "DIVISION",
      EMPLOYEEDESIGNATION: "EMPLOYEEDESIGNATION",
      Designation: "EMPLOYEEDESIGNATION",
      DESIGNATION: "EMPLOYEEDESIGNATION",
      designation: "EMPLOYEEDESIGNATION",

      // Punch / Pay Code
      Punch_code: "PAY_CODE",
      PUNCH_CODE: "PAY_CODE",
      Punch_Code: "PAY_CODE",
      "Punch Code": "PAY_CODE",
      "PUNCH CODE": "PAY_CODE",
      PunchCode: "PAY_CODE",
      PUNCHCODE: "PAY_CODE",
      punch_code: "PAY_CODE",
      punchcode: "PAY_CODE",
      PAY_CODE: "PAY_CODE",
      PAYCODE: "PAY_CODE",
      Pay_Code: "PAY_CODE",
      "Pay Code": "PAY_CODE",
      "PAY CODE": "PAY_CODE",
      pay_code: "PAY_CODE",
      paycode: "PAY_CODE",
      MSPIN: "MSPIN",
      Mspin: "MSPIN",

      // Mobile Number (Personal)
      PERSONAL_MOBILE_NUMBER: "MOBILE_NO",
      Personal_Mobile_Number: "MOBILE_NO",
      "Personal Mobile Number": "MOBILE_NO",
      "PERSONAL MOBILE NUMBER": "MOBILE_NO",
      Personal_Mobile_No: "MOBILE_NO",
      "Personal Mobile No": "MOBILE_NO",
      "PERSONAL MOBILE NO": "MOBILE_NO",
      PERSONAL_MOBILE_NO: "MOBILE_NO",
      PERSONAL_MOBILE: "MOBILE_NO",
      Personal_Mobile: "MOBILE_NO",
      MOBILE_NO: "MOBILE_NO",
      Mobile_No: "MOBILE_NO",
      mobile_no: "MOBILE_NO",
      "Mobile No": "MOBILE_NO",
      "MOBILE NO": "MOBILE_NO",
      "Mobile Number": "MOBILE_NO",
      "MOBILE NUMBER": "MOBILE_NO",
      Mobile: "MOBILE_NO",
      MOBILE: "MOBILE_NO",

      // Official Number
      OFFICIAL_MOBILE_NUMBER: "Official_number",
      Official_Mobile_Number: "Official_number",
      "Official Mobile Number": "Official_number",
      "OFFICIAL MOBILE NUMBER": "Official_number",
      OFFICIAL_MOBILE_NO: "Official_number",
      Official_Mobile_No: "Official_number",
      "Official Mobile No": "Official_number",
      "OFFICIAL MOBILE NO": "Official_number",
      OFFICIAL_MOBILE: "Official_number",
      Official_Mobile: "Official_number",
      Official_number: "Official_number",
      Official_Number: "Official_number",
      OFFICIAL_NUMBER: "Official_number",
      "Official Number": "Official_number",
      "OFFICIAL NUMBER": "Official_number",
      Official_no: "Official_number",
      Official_No: "Official_number",
      OFFICIAL_NO: "Official_number",
      "Official No": "Official_number",
      "OFFICIAL NO": "Official_number",
      OfficialNumber: "Official_number",
      OFFICIALNUMBER: "Official_number",

      // DOB
      DOB: "DOB",
      "Date of Birth": "DOB",
      "DATE OF BIRTH": "DOB",
      Date_of_Birth: "DOB",
      DATE_OF_BIRTH: "DOB",
      dob: "DOB",

      // Joining Date
      DATE_OF_JONING: "CURRENTJOINDATE",
      DATE_OF_JOINING: "CURRENTJOINDATE",
      "DATE OF JONING": "CURRENTJOINDATE",
      "DATE OF JOINING": "CURRENTJOINDATE",
      "Date of Joining": "CURRENTJOINDATE",
      "Date of Joning": "CURRENTJOINDATE",
      "Joining Date": "CURRENTJOINDATE",
      "JOINING DATE": "CURRENTJOINDATE",
      Joining_Date: "CURRENTJOINDATE",
      JOINING_DATE: "CURRENTJOINDATE",
      CURRENTJOINDATE: "CURRENTJOINDATE",
      DOJ: "CURRENTJOINDATE",
      doj: "CURRENTJOINDATE",

      // Identity & Address
      AADHAR_CARD: "UID_NO",
      Aadhar_Card: "UID_NO",
      "Aadhar Card": "UID_NO",
      "AADHAR CARD": "UID_NO",
      UID_NO: "UID_NO",
      PANNO: "PANNO",
      "PAN NO": "PANNO",
      "Pan No": "PANNO",
      "PAN No": "PANNO",
      "PAN Number": "PANNO",
      PERMANENTADDRESS1: "PERMANENTADDRESS1",
      "Permanent Address": "PERMANENTADDRESS1",

      // Religion
      RELEGION: "RELCODE",
      RELIGION: "RELCODE",
      Religion: "RELCODE",
      Relegion: "RELCODE",
      religion: "RELCODE",
      relegion: "RELCODE",
      RELCODE: "RELCODE",
      relcode: "RELCODE",

      // Statutory PF/ESI/LWF
      pfper: "pfper",
      "PF Y/N": "PFNO",
      PF_Y_N: "PFNO",
      pfnumber: "pfnumber",
      "ESI Y/N": "ESINO",
      ESI_Y_N: "ESINO",
      "LWF Y/N": "LWFNO",
      LWF_Y_N: "LWFNO",
      "Professional Tax Y/N": "pro_tax",
      Professional_Tax_Y_N: "pro_tax",

      // Banking
      PAYMENTMODE: "PAYMENTMODE",
      "Payment Mode": "PAYMENTMODE",
      BANK_NAME: "BANKNAME",
      BANKNAME: "BANKNAME",
      "Bank Name": "BANKNAME",
      BANKACCOUNTNO: "BANKACCOUNTNO",
      "Bank Account No": "BANKACCOUNTNO",
      "BANK ACCOUNT NO": "BANKACCOUNTNO",
      "Bank Account Number": "BANKACCOUNTNO",
      "BANK ACCOUNT NUMBER": "BANKACCOUNTNO",
      "Account No": "BANKACCOUNTNO",
      "ACCOUNT NO": "BANKACCOUNTNO",
      "Account Number": "BANKACCOUNTNO",
      "ACCOUNT NUMBER": "BANKACCOUNTNO",
      "Bank_Account_No": "BANKACCOUNTNO",
      "BANK_ACCOUNT_NO": "BANKACCOUNTNO",
      "bank_account_no": "BANKACCOUNTNO",
      "account_no": "BANKACCOUNTNO",
      "accountno": "BANKACCOUNTNO",
      AccountNo: "BANKACCOUNTNO",
      BANKACCOUNTNUMBER: "BANKACCOUNTNO",
      ifsc_code: "ifsc_code",
      "IFSC Code": "ifsc_code",
      "IFSC CODE": "ifsc_code",
      IFSC_CODE: "ifsc_code",

      // Misc
      WEEKLYOFF: "WEEKLYOFF",
      "Weekly Off": "WEEKLYOFF",
      "WEEKLY OFF": "WEEKLYOFF",
      EMP_SHIFT: "EMP_SHIFT",
      "Emp Shift": "EMP_SHIFT",
      "EMP SHIFT": "EMP_SHIFT",
      EMPCODE: "EMPCODE",
      EmpCode: "EMPCODE",
      PDIST: "PDIST",
      "Permanent District": "PDIST",
      CDIST: "CDIST",
      "Current District": "CDIST",
      PCITY: "PCITY",
      "Permanent City": "PCITY",
      CCITY: "CCITY",
      "Current City": "CCITY",
      Marital_Status: "Marital_Status",
      "Marital Status": "Marital_Status",
      MARITALSTATUS: "Marital_Status",
      "MARITAL STATUS": "Marital_Status",
      GRADE: "GRADE",
      Grade: "GRADE",
      Punch_Type: "Punch_Type",
      "Punch Type": "Punch_Type",
      PUNCH_TYPE: "Punch_Type"
    };

    const renameKeys = (obj) => {
      return Object.keys(obj).reduce((acc, key) => {
        const cleanKey = String(key || "").trim();
        const newKey = keyMap[cleanKey] || keyMap[cleanKey.toUpperCase()] || cleanKey;
        if (newKey === "CURRENTJOINDATE" || newKey === "DOB") {
          if (obj[key] !== "" && obj[key] !== null && obj[key] !== undefined) {
            const rawStr = String(obj[key]).trim();
            const parsed = parseExcelDate(obj[key]);
            const rawClean = rawStr.replace(/[\s\-_.\/\\]/g, "").toLowerCase();
            const is1900Val =
              parsed.is1900 ||
              parsed.date === "1900-01-01" ||
              ["01011900", "19000101", "111900", "010100", "1100"].includes(rawClean) ||
              rawStr === "01/01/1900" ||
              rawStr === "1900-01-01" ||
              rawStr === "01-01-1900" ||
              rawStr === "1/1/1900";

            if (is1900Val) {
              acc[newKey] = null;
              acc[newKey + "_INVALID_FORMAT"] = false;
              acc[newKey + "_RAW"] = obj[key];
              acc["_was1900_" + newKey] = true;
            } else {
              acc[newKey] = parsed.date;
              acc[newKey + "_INVALID_FORMAT"] = parsed.invalid;
              acc[newKey + "_RAW"] = obj[key];
            }
          } else {
            acc[newKey] = null;
            acc[newKey + "_INVALID_FORMAT"] = false;
          }
        } else {
          let value = obj[key];
          if (value !== null && value !== undefined) {
            let strVal = String(value).trim();
            const withoutSeps = strVal.replace(/[\s\-_.\/\\]/g, "");
            if (
              withoutSeps === "" ||
              ["na", "n/a", "null", "nil", "none", "01011900", "19000101", "111900", "010100", "1100"].includes(strVal.toLowerCase()) ||
              ["na", "n/a", "null", "nil", "none", "01011900", "19000101", "111900", "010100", "1100"].includes(withoutSeps.toLowerCase()) ||
              strVal === "01/01/1900" || strVal === "1900-01-01" || strVal === "01-01-1900" || strVal === "1/1/1900"
            ) {
              value = null;
            } else if (newKey === "UID_NO") {
              value = strVal.replace(/\D/g, "");
            } else if (newKey === "BANKACCOUNTNO") {
              let bVal = strVal.replace(/\.0+$/, "").replace(/[\s\-_.\/\\]/g, "");
              if (
                bVal === "" ||
                bVal === "0" ||
                /^0+$/.test(bVal) ||
                ["na", "n/a", "null", "nil", "none", "cash", "cheque", "hold", "pending"].includes(bVal.toLowerCase())
              ) {
                value = null;
              } else {
                value = bVal;
              }
            } else {
              value = strVal;
            }
          }
          acc[newKey] = (value === "" || value === null || value === undefined) ? null : String(value).trim();
        }
        return acc;
      }, {});
    };

    const data = rawData.map(renameKeys);

    // Preprocess Mobile & Official numbers across all rows
    data.forEach(row => {
      // 1. Mobile number sanitization
      const rawMobile = row.MOBILE_NO !== null && row.MOBILE_NO !== undefined ? String(row.MOBILE_NO).trim() : "";
      const isMobileZero = rawMobile === "0" || rawMobile === "0000000000" || /^0+$/.test(rawMobile);
      if (isMobileZero) {
        row.MOBILE_NO = null;
        row._hadZeroMobile = true;
      }

      // 2. Official number sanitization
      const rawOfficial = row.Official_number !== null && row.Official_number !== undefined ? String(row.Official_number).trim() : "";
      const isOfficialZero = rawOfficial === "0" || rawOfficial === "0000000000" || /^0+$/.test(rawOfficial);
      if (isOfficialZero) {
        row.Official_number = null;
      }

      // If Official_number is provided, duplicates are allowed!
      if (row.Official_number) {
        row.Official_number = String(row.Official_number).trim().replace(/\D/g, "");
        if (!row.MOBILE_NO) {
          row.MOBILE_NO = row.Official_number;
          row._isOfficialMobile = true;
        }
        row._allowDuplicateMobile = true;
      }

      if (row.MOBILE_NO) {
        row.MOBILE_NO = String(row.MOBILE_NO).trim().replace(/\D/g, "");
      }

      // 3. Bank Account sanitization
      if (row.BANKACCOUNTNO !== null && row.BANKACCOUNTNO !== undefined) {
        let cleanBank = String(row.BANKACCOUNTNO).trim().replace(/\.0+$/, "").replace(/[\s\-_.\/\\]/g, "");
        const isDummyBank =
          !cleanBank ||
          cleanBank === "0" ||
          /^0+$/.test(cleanBank) ||
          ["NA", "N/A", "NULL", "NIL", "NONE", "CASH", "CHEQUE", "HOLD", "PENDING"].includes(cleanBank.toUpperCase());
        if (isDummyBank) {
          row.BANKACCOUNTNO = null;
        } else {
          row.BANKACCOUNTNO = cleanBank;
        }
      }
    });

    // Staging table insertion (EMPLOYEEMATER_ROW_DATA)
    try {
      const [tableExists] = await sequelize.query(
        `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'EMPLOYEEMATER_ROW_DATA'`
      );
      if (tableExists.length > 0) {
        const [rowCols] = await sequelize.query(
          `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'EMPLOYEEMATER_ROW_DATA'`
        );
        const colSet = new Set(rowCols.map(c => c.COLUMN_NAME.toUpperCase()));

        for (const rawRow of data) {
          const insertCols = [
            "EMPCODE", "EmpName", "GENDER", "EMPTYPE", "CHANNEL", "CLUSTER",
            "LOCATION", "SECTION", "Department", "EMPLOYEEDESIGNATION", "Punch_code",
            "MSPIN", "MOBILE_NO", "DOB", "DATE_OF_JONING", "AADHAR_CARD", "PANNO",
            "PERMANENTADDRESS1", "RELEGION", "pfper", "PF_Y_N", "pfnumber", "ESI_Y_N",
            "LWF_Y_N", "Professional_Tax_Y_N", "PAYMENTMODE", "BANK_NAME", "BANKACCOUNTNO",
            "ifsc_code", "WEEKLYOFF", "EMP_SHIFT"
          ];
          const optCols = ["PCITY", "PDIST", "CCITY", "CDIST", "GRADE", "MARITALSTATUS", "Punch_Type", "Official_number"];
          optCols.forEach(oc => {
            if (colSet.has(oc.toUpperCase())) insertCols.push(oc);
          });
          insertCols.push("Created_By", "Created_At");

          const replacements = {
            EMPCODE: rawRow.EMPCODE || null,
            EmpName: rawRow.EMPFIRSTNAME || rawRow.EmpName || null,
            GENDER: rawRow.GENDER || null,
            EMPTYPE: isNaN(rawRow.EmpType || rawRow.EMPTYPE) ? null : Number(rawRow.EmpType || rawRow.EMPTYPE),
            CHANNEL: isNaN(rawRow.CHANNEL) ? 1 : Number(rawRow.CHANNEL) || 1,
            CLUSTER: isNaN(rawRow.CLUSTER) ? 1 : Number(rawRow.CLUSTER) || 1,
            LOCATION: rawRow.LOCATION ? String(rawRow.LOCATION).slice(0, 30) : null,
            SECTION: rawRow.SECTION ? String(rawRow.SECTION).slice(0, 25) : null,
            Department: rawRow.DIVISION ? String(rawRow.DIVISION).slice(0, 30) : (rawRow.Department ? String(rawRow.Department).slice(0, 30) : null),
            EMPLOYEEDESIGNATION: rawRow.EMPLOYEEDESIGNATION ? String(rawRow.EMPLOYEEDESIGNATION).slice(0, 200) : null,
            Punch_code: rawRow.PAY_CODE ? String(rawRow.PAY_CODE).slice(0, 30) : (rawRow.Punch_code ? String(rawRow.Punch_code).slice(0, 30) : null),
            MSPIN: rawRow.MSPIN ? String(rawRow.MSPIN).slice(0, 50) : null,
            MOBILE_NO: rawRow.MOBILE_NO ? String(rawRow.MOBILE_NO).slice(0, 15) : null,
            Official_number: rawRow.Official_number ? String(rawRow.Official_number).slice(0, 20) : null,
            DOB: (rawRow._was1900_DOB || rawRow.DOB === "1900-01-01" || rawRow.DOB === "01/01/1900") ? null : (rawRow.DOB || null),
            DATE_OF_JONING: (rawRow._was1900_CURRENTJOINDATE || rawRow.CURRENTJOINDATE === "1900-01-01" || rawRow.CURRENTJOINDATE === "01/01/1900") ? null : (rawRow.CURRENTJOINDATE || null),
            AADHAR_CARD: rawRow.UID_NO ? String(rawRow.UID_NO).slice(0, 30) : null,
            PANNO: rawRow.PANNO ? String(rawRow.PANNO).slice(0, 25) : null,
            PERMANENTADDRESS1: rawRow.PERMANENTADDRESS1 ? String(rawRow.PERMANENTADDRESS1).slice(0, 250) : null,
            RELEGION: isNaN(rawRow.RELCODE) ? null : Number(rawRow.RELCODE),
            pfper: isNaN(rawRow.pfper) ? null : parseFloat(rawRow.pfper),
            PF_Y_N: isNaN(rawRow.PFNO) ? null : Number(rawRow.PFNO),
            pfnumber: rawRow.pfnumber ? String(rawRow.pfnumber).slice(0, 30) : null,
            ESI_Y_N: isNaN(rawRow.ESINO) ? null : Number(rawRow.ESINO),
            LWF_Y_N: isNaN(rawRow.LWFNO) ? null : Number(rawRow.LWFNO),
            Professional_Tax_Y_N: isNaN(rawRow.pro_tax) ? null : Number(rawRow.pro_tax),
            PAYMENTMODE: rawRow.PAYMENTMODE ? String(rawRow.PAYMENTMODE).slice(0, 15) : null,
            BANK_NAME: rawRow.BANKNAME ? String(rawRow.BANKNAME).slice(0, 100) : (rawRow.BANK_NAME ? String(rawRow.BANK_NAME).slice(0, 100) : null),
            BANKACCOUNTNO: rawRow.BANKACCOUNTNO ? String(rawRow.BANKACCOUNTNO).slice(0, 100) : null,
            ifsc_code: rawRow.ifsc_code ? String(rawRow.ifsc_code).slice(0, 100) : null,
            WEEKLYOFF: rawRow.WEEKLYOFF ? String(rawRow.WEEKLYOFF).slice(0, 15) : null,
            EMP_SHIFT: rawRow.EMP_SHIFT ? String(rawRow.EMP_SHIFT).slice(0, 30) : null,
            PCITY: rawRow.PCITY ? String(rawRow.PCITY).slice(0, 100) : null,
            PDIST: rawRow.PDIST ? String(rawRow.PDIST).slice(0, 100) : null,
            CCITY: rawRow.CCITY ? String(rawRow.CCITY).slice(0, 100) : null,
            CDIST: rawRow.CDIST ? String(rawRow.CDIST).slice(0, 100) : null,
            GRADE: rawRow.GRADE ? String(rawRow.GRADE).slice(0, 50) : null,
            MARITALSTATUS: rawRow.Marital_Status ? String(rawRow.Marital_Status).slice(0, 50) : null,
            Punch_Type: rawRow.Punch_Type ? String(rawRow.Punch_Type).slice(0, 50) : null,
            Created_By: changedByUser
          };

          const colListSql = insertCols.map(c => `[${c}]`).join(", ");
          const paramListSql = insertCols.map(c => c === "Created_At" ? "GETDATE()" : `:${c}`).join(", ");

          await sequelize.query(
            `INSERT INTO [dbo].[EMPLOYEEMATER_ROW_DATA] (${colListSql}) VALUES (${paramListSql})`,
            { replacements, transaction: t }
          );
        }
      }
    } catch (stagingErr) {
      console.warn("Could not insert into EMPLOYEEMATER_ROW_DATA staging:", stagingErr.message);
    }

    // Mandatory Fields Configuration from Mand_Mst
    const isBypassed = userCode === 1;
    let mandRows = [];
    if (!isBypassed) {
      const rawMandRows = await sequelize.query(
        `SELECT LTRIM(RTRIM(field_name)) AS field_name, field_Abbr, IsMandtory 
         FROM Mand_Mst 
         WHERE misc_name = 'EMPLOYEEMASTER' 
           AND (IsMandtory = '1' OR IsMandtory = 1) 
           AND ISNULL(Export_Type, 0) < 3`,
        { type: sequelize.QueryTypes.SELECT }
      );
      const seenMand = new Set();
      for (const mr of rawMandRows) {
        const fn = String(mr.field_name || "").toUpperCase().trim();
        if (fn && !seenMand.has(fn)) {
          seenMand.add(fn);
          mandRows.push(mr);
        }
      }

      // Check if any mandatory column is completely missing from the Excel header
      const mappedHeaderKeys = new Set(
        headers.map(h => {
          const cleanH = String(h || "").trim();
          return (keyMap[cleanH] || keyMap[cleanH.toUpperCase()] || cleanH).toUpperCase();
        })
      );

      const missingMandatoryHeaders = [];
      for (const mf of mandRows) {
        const colUpper = String(mf.field_name || "").toUpperCase().trim();
        if (!mappedHeaderKeys.has(colUpper)) {
          let found = false;
          if (colUpper === "EMPFIRSTNAME" && (mappedHeaderKeys.has("EMPNAME") || mappedHeaderKeys.has("EMPLOYEENAME"))) found = true;
          if (colUpper === "DIVISION" && (mappedHeaderKeys.has("DEPARTMENT") || mappedHeaderKeys.has("DIVISION"))) found = true;
          if (colUpper === "PAY_CODE" && (mappedHeaderKeys.has("PUNCH_CODE") || mappedHeaderKeys.has("PAY_CODE"))) found = true;
          if (colUpper === "UID_NO" && (mappedHeaderKeys.has("AADHAR_CARD") || mappedHeaderKeys.has("UID_NO"))) found = true;
          if (colUpper === "CURRENTJOINDATE" && (mappedHeaderKeys.has("DATE_OF_JONING") || mappedHeaderKeys.has("DATE_OF_JOINING") || mappedHeaderKeys.has("CURRENTJOINDATE"))) found = true;
          if (colUpper === "MOBILE_NO" && (mappedHeaderKeys.has("PERSONAL_MOBILE_NUMBER") || mappedHeaderKeys.has("MOBILE_NO"))) found = true;
          if (colUpper === "EMPLOYEEDESIGNATION" && (mappedHeaderKeys.has("DESIGNATION") || mappedHeaderKeys.has("EMPLOYEEDESIGNATION"))) found = true;
          if (colUpper === "RELCODE" && (mappedHeaderKeys.has("RELEGION") || mappedHeaderKeys.has("RELIGION") || mappedHeaderKeys.has("RELCODE"))) found = true;

          if (!found) {
            missingMandatoryHeaders.push(mf.field_Abbr || mf.field_name);
          }
        }
      }

      if (missingMandatoryHeaders.length > 0) {
        await t.rollback();
        await sequelize.close();
        return res.status(400).send({
          Message: `Missing mandatory column(s) in Excel: [${missingMandatoryHeaders.join(", ")}]. Please include all required columns and try again.`
        });
      }
    }

    // Within-Excel duplicate counts
    const mobileCounts = {}, aadharCounts = {}, bankCounts = {}, panCounts = {};
    data.forEach(row => {
      if (row.MOBILE_NO && !row._allowDuplicateMobile) {
        mobileCounts[row.MOBILE_NO] = (mobileCounts[row.MOBILE_NO] || 0) + 1;
      }
      if (row.UID_NO) aadharCounts[row.UID_NO] = (aadharCounts[row.UID_NO] || 0) + 1;
      if (row.BANKACCOUNTNO) bankCounts[row.BANKACCOUNTNO] = (bankCounts[row.BANKACCOUNTNO] || 0) + 1;
      if (row.PANNO) panCounts[row.PANNO] = (panCounts[row.PANNO] || 0) + 1;
    });

    // Existing DB records mapping
    const existingRecords = await EmployeeMaster.findAll({ raw: true });
    const existingByEmpCode = {};
    const uidOwner = {};
    const bankOwnerActive = {};
    const panOwner = {};
    const mobileOwnerActive = {};

    existingRecords.forEach(e => {
      if (e.EMPCODE) existingByEmpCode[e.EMPCODE] = e;
      if (e.UID_NO) {
        const cleanUid = String(e.UID_NO).trim().replace(/\D/g, "");
        if (cleanUid && cleanUid.length === 12) {
          uidOwner[cleanUid] = e.EMPCODE;
        }
      }
      if (e.BANKACCOUNTNO && (e.LASTWOR_DATE === null || e.LASTWOR_DATE === undefined)) {
        let cleanDbBank = String(e.BANKACCOUNTNO).trim().replace(/\.0+$/, "").replace(/[\s\-_.\/\\]/g, "");
        const isDummyDbBank =
          !cleanDbBank ||
          cleanDbBank === "0" ||
          /^0+$/.test(cleanDbBank) ||
          ["NA", "N/A", "NULL", "NIL", "NONE", "CASH", "CHEQUE", "HOLD", "PENDING"].includes(cleanDbBank.toUpperCase());
        if (!isDummyDbBank) {
          bankOwnerActive[cleanDbBank] = e.EMPCODE;
        }
      }
      if (e.PANNO) {
        const cleanPan = String(e.PANNO).trim().toUpperCase();
        if (/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(cleanPan)) {
          panOwner[cleanPan] = e.EMPCODE;
        }
      }
      if (e.MOBILE_NO && (e.LASTWOR_DATE === null || e.LASTWOR_DATE === undefined)) {
        mobileOwnerActive[e.MOBILE_NO] = e.EMPCODE;
      }
    });

    const ErroredData = [];
    const CorrectData = [];
    const UpdatedData = [];
    const manualEmpCodesUsedThisBatch = new Set();

    const HISTORY_FIELDS = [
      "EMPCODE", "EMPFIRSTNAME", "GENDER", "EmpType", "CHANNEL", "CLUSTER",
      "LOCATION", "SECTION", "DIVISION", "EMPLOYEEDESIGNATION", "PAY_CODE",
      "MSPIN", "MOBILE_NO", "DOB", "CURRENTJOINDATE", "UID_NO", "PANNO",
      "PERMANENTADDRESS1", "RELCODE", "pfper", "PFNO", "pfnumber", "ESINO",
      "LWFNO", "pro_tax", "PAYMENTMODE", "BANKNAME", "BANKACCOUNTNO",
      "ifsc_code", "WEEKLYOFF", "EMP_SHIFT"
    ];

    // Pre-load MISC_MST lookups
    const miscTypes = [68, 95, 81, 85, 627, 626, 90, 8, 2, 1, 657, 654, 672, 662];
    const miscData = await sequelize.query(
      `SELECT MISC_TYPE, MISC_CODE, LTRIM(RTRIM(MISC_NAME)) as MISC_NAME 
       FROM MISC_MST 
       WHERE MISC_TYPE IN (:types) AND ISNULL(EXPORT_TYPE, 0) < 3`,
      { replacements: { types: miscTypes }, type: sequelize.QueryTypes.SELECT }
    );

    const miscMap = {};
    const maxMiscCode = {};

    miscTypes.forEach(tType => {
      miscMap[tType] = {};
      maxMiscCode[tType] = 0;
    });

    const maxCodesData = await sequelize.query(
      `SELECT MISC_TYPE, ISNULL(MAX(TRY_CAST(MISC_CODE AS INT)), 0) as maxCode 
       FROM MISC_MST 
       WHERE MISC_TYPE IN (:types) 
       GROUP BY MISC_TYPE`,
      { replacements: { types: miscTypes }, type: sequelize.QueryTypes.SELECT }
    );
    maxCodesData.forEach(mc => {
      maxMiscCode[mc.MISC_TYPE] = Number(mc.maxCode) || 0;
    });

    miscData.forEach(m => {
      if (m.MISC_NAME) {
        if (!miscMap[m.MISC_TYPE]) miscMap[m.MISC_TYPE] = {};
        miscMap[m.MISC_TYPE][m.MISC_NAME.trim().toUpperCase()] = m.MISC_CODE;
      }
    });

    // Resolve or Auto-Create in MISC_MST (Only called for VALID rows!)
    async function resolveOrAddMisc(miscType, rawVal) {
      if (rawVal === null || rawVal === undefined) return null;
      const originalTyped = String(rawVal).trim();
      if (!originalTyped) return null;

      const upper = originalTyped.toUpperCase();

      if (miscMap[miscType] && miscMap[miscType][upper] !== undefined) {
        return { code: miscMap[miscType][upper], name: originalTyped };
      }

      const newCode = (maxMiscCode[miscType] || 0) + 1;
      maxMiscCode[miscType] = newCode;

      await sequelize.query(
        `INSERT INTO MISC_MST (MISC_TYPE, MISC_CODE, MISC_NAME, EXPORT_TYPE, ServerId, LOC_CODE)
         VALUES (:type, :code, :name, 1, 1, :locCode)`,
        {
          replacements: {
            type: miscType,
            code: newCode,
            name: originalTyped,
            locCode: locCode || 1
          },
          transaction: t
        }
      );

      if (!miscMap[miscType]) miscMap[miscType] = {};
      miscMap[miscType][upper] = newCode;

      return { code: newCode, name: originalTyped };
    }

    const allowedPaymentModes = new Set(["BANK TRANSFER", "CHEQUE", "CASH", "NEFT", "OTHER", "SALARY HOLD"]);
    const weeklyOffMap = { SUNDAY: 0, MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3, THURSDAY: 4, FRIDAY: 5, SATURDAY: 6 };
    const relCodeMap = {
      HINDU: 1, HINDUS: 1, "1": 1,
      MUSLIMS: 2, MUSLIM: 2, ISLAM: 2, "2": 2,
      SIKH: 3, SIKHS: 3, "3": 3,
      CHRISTIAN: 4, CHRISTIANS: 4, "4": 4,
      JAIN: 5, JAINS: 5, "5": 5,
      BUDDHA: 6, BUDDHIST: 6, BUDDHISM: 6, "6": 6,
      PERSIANS: 7, PERSIAN: 7, PARSI: 7, PARSIS: 7, "7": 7
    };

    // Calculate max SRNO
    let abcd;
    {
      const MaxxSRNo = await sequelize.query(`SELECT ISNULL(MAX(srno)+1, 1) as srno FROM employeemaster`);
      abcd = MaxxSRNo[0][0]?.srno || 1;
    }

    // Pre-fetch GODOWN_MST code generation configuration ONCE before row loop
    const [rangePrefixData] = await sequelize.query(
      `SELECT TOP 1 RANGE_NAME, RANGE_CODE
       FROM GODOWN_MST
       WHERE ISNULL(EXPORT_TYPE, 0) < 3 ORDER BY RANGE_CODE DESC`
    );
    const rangeConfigured = !!(
      rangePrefixData.length &&
      rangePrefixData[0].RANGE_NAME &&
      rangePrefixData[0].RANGE_CODE !== null &&
      rangePrefixData[0].RANGE_CODE !== undefined
    );
    const currentGodownPrefix = rangeConfigured ? String(rangePrefixData[0].RANGE_NAME).toUpperCase() : null;
    let currentGodownRangeCode = 0;
    if (rangeConfigured) {
      const [maxRangeData] = await sequelize.query(
        `SELECT MAX(RANGE_CODE) as RANGE_CODEDATA FROM GODOWN_MST WHERE ISNULL(EXPORT_TYPE, 0) < 3`
      );
      currentGodownRangeCode = parseInt(maxRangeData[0]?.RANGE_CODEDATA) || 0;
    }
    const initialGodownRangeCode = currentGodownRangeCode;

    // =========================================================================
    // STEP 4: Process Each Row for EMPLOYEEMASTER
    // =========================================================================
    for (const row of data) {
      const rejectionReasons = [];
      const targetEmpCode = row.EMPCODE ? String(row.EMPCODE).trim() : null;
      const existingRecordForEmpCode = targetEmpCode ? existingByEmpCode[targetEmpCode] : null;
      const isUpdateRow = !!existingRecordForEmpCode;

      // ----- Mandatory Fields Check -----
      if (!isUpdateRow && !isBypassed) {
        if (mandRows.length > 0) {
          for (const mf of mandRows) {
            const col = mf.field_name;
            if (col === "MOBILE_NO" && (row._hadZeroMobile || row._allowDuplicateMobile)) {
              continue;
            }
            if ((col === "CURRENTJOINDATE" || col === "DATE_OF_JONING" || col === "DATE_OF_JOINING" || col === "DOJ") && row._was1900_CURRENTJOINDATE) {
              continue;
            }
            if ((col === "DOB" || col === "Date_of_Birth" || col === "DATE_OF_BIRTH") && row._was1900_DOB) {
              continue;
            }
            let val = row[col];
            if (col === "EMPFIRSTNAME" && !val) val = row.EmpName;
            if (col === "DIVISION" && !val) val = row.Department;
            if (col === "PAY_CODE" && !val) val = row.Punch_code;
            if (col === "UID_NO" && !val) val = row.AADHAR_CARD;
            if (col === "CURRENTJOINDATE" && !val) val = row.DATE_OF_JONING;

            if (val === null || val === undefined || String(val).trim() === "") {
              rejectionReasons.push(`${mf.field_Abbr || col} is required`);
            }
          }
        } else {
          // Standard defaults if Mand_Mst has no rows
          if (!row.LOCATION) rejectionReasons.push("Location is required");
          if (!row.EMPFIRSTNAME) rejectionReasons.push("Employee Name is required");
          if (!row.MOBILE_NO && !row._hadZeroMobile && !row._allowDuplicateMobile) {
            rejectionReasons.push("Mobile number is required");
          }
        }
      }

      // ----- Format Validations -----
      if (row.MOBILE_NO && !/^\d{10}$/.test(row.MOBILE_NO)) {
        rejectionReasons.push(`Invalid Mobile Number: ${row.MOBILE_NO}`);
      }

      if (row.DOB_INVALID_FORMAT) {
        rejectionReasons.push(`Invalid DOB format: ${row.DOB_RAW}. Use DD/MM/YYYY, DD-MM-YYYY or DD.MM.YYYY`);
      } else if (row.DOB && isNaN(new Date(row.DOB).getTime())) {
        rejectionReasons.push(`Invalid DOB: ${row.DOB}`);
      }

      if (row.CURRENTJOINDATE_INVALID_FORMAT) {
        rejectionReasons.push(`Invalid Joining Date format: ${row.CURRENTJOINDATE_RAW}. Use DD/MM/YYYY, DD-MM-YYYY or DD.MM.YYYY`);
      } else if (row.CURRENTJOINDATE && isNaN(new Date(row.CURRENTJOINDATE).getTime())) {
        rejectionReasons.push(`Invalid Joining Date: ${row.CURRENTJOINDATE}`);
      }

      if (row.UID_NO && !/^\d{12}$/.test(row.UID_NO)) rejectionReasons.push(`Invalid Aadhar Number: ${row.UID_NO}`);
      if (row.PANNO && !/^[A-Z]{5}[0-9]{4}[A-Z]$/i.test(row.PANNO)) rejectionReasons.push(`Invalid PAN No.: ${row.PANNO}`);

      // ----- DB Duplicate Checks -----
      if (row.UID_NO) {
        const owner = uidOwner[row.UID_NO];
        if (owner && owner !== targetEmpCode) {
          rejectionReasons.push(`Aadhar Number already exists (${owner}): ${row.UID_NO}`);
        }
      }
      if (row.BANKACCOUNTNO) {
        const owner = bankOwnerActive[row.BANKACCOUNTNO];
        if (owner && owner !== targetEmpCode) {
          rejectionReasons.push(`Bank Account Number already exists for an active employee (${owner}): ${row.BANKACCOUNTNO}`);
        }
      }
      if (row.PANNO) {
        const owner = panOwner[row.PANNO];
        if (owner && owner !== targetEmpCode) {
          rejectionReasons.push(`PAN Number already exists (${owner}): ${row.PANNO}`);
        }
      }
      if (row.MOBILE_NO && !row._allowDuplicateMobile) {
        const owner = mobileOwnerActive[row.MOBILE_NO];
        if (owner && owner !== targetEmpCode) {
          rejectionReasons.push(`Mobile Number already exists for an active employee (${owner}): ${row.MOBILE_NO}`);
        }
      }

      // ----- IFSC Validation -----
      if (row.ifsc_code) {
        if (!validateIFSC(row.ifsc_code)) {
          row.ifsc_code = null;
          row._ifscRemark = "IFSC this employee null then after check";
        } else {
          row.ifsc_code = String(row.ifsc_code).trim().toUpperCase();
        }
      }

      // ----- Within-Excel Duplicate Checks -----
      if (row.MOBILE_NO && !row._allowDuplicateMobile && mobileCounts[row.MOBILE_NO] > 1) {
        rejectionReasons.push(`Duplicate Mobile Number in Excel: ${row.MOBILE_NO}`);
      }
      if (row.UID_NO && aadharCounts[row.UID_NO] > 1) rejectionReasons.push(`Duplicate Aadhar Number in Excel: ${row.UID_NO}`);
      if (row.BANKACCOUNTNO && bankCounts[row.BANKACCOUNTNO] > 1) rejectionReasons.push(`Duplicate Bank Account Number in Excel: ${row.BANKACCOUNTNO}`);
      if (row.PANNO && panCounts[row.PANNO] > 1) rejectionReasons.push(`Duplicate PAN Number in Excel: ${row.PANNO}`);

      // ----- EMPTYPE Normalization -----
      if (row.EMPTYPE) {
        const type = String(row.EMPTYPE).trim().toUpperCase();
        if (type === "REGULAR" || type === "1") row.EmpType = 1;
        else if (type === "CASUAL" || type === "2") row.EmpType = 2;
        else if (type === "APPRENTICE" || type === "3") row.EmpType = 3;
        else rejectionReasons.push(`Invalid Employee Type: ${row.EMPTYPE}`);
      }

      // ----- GENDER Normalization -----
      if (row.GENDER) {
        const gender = String(row.GENDER).trim().toLowerCase();
        if (gender === "male") row.GENDER = "Male";
        else if (gender === "female") row.GENDER = "Female";
        else if (gender === "other") row.GENDER = "Other";
        else rejectionReasons.push(`Invalid Gender: ${row.GENDER}`);
      }

      // ----- PAYMENTMODE Normalization -----
      if (row.PAYMENTMODE) {
        const pm = String(row.PAYMENTMODE).trim().toUpperCase();
        if (!allowedPaymentModes.has(pm)) rejectionReasons.push(`Invalid Payment Mode: ${row.PAYMENTMODE}`);
        else row.PAYMENTMODE = pm;
      }

      // ----- PF / ESI / LWF / Professional Tax Normalization -----
      if (!row.PFNO && row.pfnumber) row.PFNO = 1;
      if (row.PFNO !== null && row.PFNO !== undefined) {
        const type = String(row.PFNO).trim().toUpperCase();
        if (type === "Y" || type === "YES" || type === "1") row.PFNO = 1;
        else if (type === "N" || type === "NO" || type === "0") row.PFNO = 0;
        else rejectionReasons.push(`Invalid PF Y/N: ${row.PFNO}`);
      }

      if (!row.ESINO && row.esinumber) row.ESINO = 1;
      if (row.ESINO !== null && row.ESINO !== undefined) {
        const type = String(row.ESINO).trim().toUpperCase();
        if (type === "Y" || type === "YES" || type === "1") row.ESINO = 1;
        else if (type === "N" || type === "NO" || type === "0") row.ESINO = 0;
        else rejectionReasons.push(`Invalid ESI Y/N: ${row.ESINO}`);
      }

      if (row.LWFNO !== null && row.LWFNO !== undefined) {
        const type = String(row.LWFNO).trim().toUpperCase();
        if (type === "Y" || type === "YES" || type === "1") row.LWFNO = 1;
        else if (type === "N" || type === "NO" || type === "0") row.LWFNO = 0;
        else rejectionReasons.push(`Invalid LWFNO Y/N: ${row.LWFNO}`);
      }

      if (row.pro_tax !== null && row.pro_tax !== undefined) {
        const type = String(row.pro_tax).trim().toUpperCase();
        if (type === "Y" || type === "YES" || type === "1") row.pro_tax = 1;
        else if (type === "N" || type === "NO" || type === "0") row.pro_tax = 0;
        else rejectionReasons.push(`Invalid Professional Tax Y/N: ${row.pro_tax}`);
      }

      // ----- WEEKLYOFF Normalization -----
      if (row.WEEKLYOFF) {
        const day = String(row.WEEKLYOFF).trim().toUpperCase();
        if (weeklyOffMap.hasOwnProperty(day)) row.WEEKLYOFF = weeklyOffMap[day];
        else if (!isNaN(day) && Number(day) >= 0 && Number(day) <= 6) row.WEEKLYOFF = Number(day);
        else rejectionReasons.push(`Invalid WEEKLYOFF: ${row.WEEKLYOFF}`);
      }

      // ----- RELIGION Normalization -----
      if (row.RELCODE !== null && row.RELCODE !== undefined && String(row.RELCODE).trim() !== "") {
        const rel = String(row.RELCODE).trim().toUpperCase();
        if (relCodeMap[rel] !== undefined) row.RELCODE = relCodeMap[rel];
        else if (!isNaN(rel) && Number(rel) >= 1 && Number(rel) <= 7) row.RELCODE = Number(rel);
        else rejectionReasons.push(`Invalid RELIGION: ${row.RELCODE}`);
      } else {
        row.RELCODE = null;
      }

      delete row.DOB_INVALID_FORMAT;
      delete row.DOB_RAW;
      delete row.CURRENTJOINDATE_INVALID_FORMAT;
      delete row.CURRENTJOINDATE_RAW;

      const enteredEmpCode = row.EMPCODE;
      const uniqueReasons = Array.from(new Set(rejectionReasons.map(r => String(r || "").trim()))).filter(Boolean);

      // ===== CRITICAL OPTIMIZATION: If row has errors, record it and SKIP immediately! =====
      // NEVER run resolveOrAddMisc or DB operations for rejected rows.
      if (uniqueReasons.length) {
        const allReasons = row._ifscRemark ? [...uniqueReasons, row._ifscRemark] : uniqueReasons;
        ErroredData.push({ ...row, EMPCODE: enteredEmpCode, rejectionReasons: allReasons.join(", ") });
        continue;
      }

      // =======================================================================
      // STEP 5: Resolve / Auto-Create MISC_MST Values (ONLY for VALID Rows)
      // =======================================================================
      // 1. EMPLOYEEDESIGNATION (Misc_Type: 95) -> Stores Misc_Name in EMPLOYEEMASTER
      if (row.EMPLOYEEDESIGNATION) {
        const resDesig = await resolveOrAddMisc(95, row.EMPLOYEEDESIGNATION);
        if (resDesig) {
          row.EMPLOYEEDESIGNATION = resDesig.name;
          row.EMPLOYEEDESIGNATION_CODE = resDesig.code;
        }
      }

      // 2. BANKNAME (Misc_Type: 8) -> Stores Bank Name in EMPLOYEEMASTER
      if (row.BANKNAME) {
        const resBank = await resolveOrAddMisc(8, row.BANKNAME);
        if (resBank) {
          row.BANKNAME = resBank.name;
          row.BANKNAME_CODE = resBank.code;
        }
      }

      // 3. Other Misc fields -> Store Misc_Code in EMPLOYEEMASTER
      const miscFieldsToResolve = [
        { field: "DIVISION", type: 68 },          // Department/Division
        { field: "SECTION", type: 81 },           // Section
        { field: "LOCATION", type: 85 },          // Location
        { field: "CHANNEL", type: 627 },         // Channel
        { field: "CLUSTER", type: 626 },         // Cluster
        { field: "EMP_SHIFT", type: 90 },         // Shift
        { field: "PDIST", type: 2 },              // Permanent District
        { field: "CDIST", type: 2 },              // Current District
        { field: "PCITY", type: 1 },              // Permanent City
        { field: "CCITY", type: 1 },              // Current City
        { field: "Marital_Status", type: 657 },   // Marital Status
        { field: "GRADE", type: 672 },            // Grade
        { field: "Punch_Type", type: 662 },       // Punch Type
      ];

      for (const mf of miscFieldsToResolve) {
        if (row[mf.field]) {
          const resMisc = await resolveOrAddMisc(mf.type, row[mf.field]);
          if (resMisc) {
            row[`${mf.field}_NAME`] = resMisc.name;
            row[mf.field] = resMisc.code;
            if (mf.field === "Marital_Status") {
              row.MARITALSTATUS = resMisc.name;
            }
          }
        }
      }

      // 4. pfper (PF percentage, Misc_Type: 654)
      if (row.pfper !== null && row.pfper !== undefined && row.pfper !== "") {
        const resPf = await resolveOrAddMisc(654, row.pfper);
        if (resPf) {
          row.pfper_NAME = resPf.name;
          const numPf = parseFloat(String(row.pfper).replace(/%/g, "").trim());
          row.pfper = !isNaN(numPf) ? numPf : resPf.code;
        }
      }

      // =======================================================================
      // STEP 6: Execute UPDATE or INSERT
      // =======================================================================
      if (isUpdateRow) {
        // ----- UPDATE PATH -----
        const skipKeys = new Set([
          "EMPCODE", "SRNO", "CREATED_ON", "CREATED_BY",
          "Inserted_By", "ServerId", "Export_Type", "ENTERED_EMPCODE",
          "Official_number", "_hadZeroMobile", "_isOfficialMobile", "_allowDuplicateMobile",
          "EMPLOYEEDESIGNATION_CODE", "BANKNAME_CODE", "rejectionReasons"
        ]);
        const updateFields = {};
        for (const [k, v] of Object.entries(row)) {
          if (skipKeys.has(k)) continue;
          if (k.startsWith("_") || k.endsWith("_NAME") || (k.endsWith("_CODE") && k !== "PAY_CODE")) continue;
          if (v === null || v === undefined) {
            if (k === "ifsc_code" && row._ifscRemark) {
              updateFields[k] = null;
            } else if (k === "DOB" && row._was1900_DOB) {
              updateFields[k] = null;
            } else if (k === "CURRENTJOINDATE" && row._was1900_CURRENTJOINDATE) {
              updateFields[k] = null;
            }
            continue;
          }
          if (k === "DOB" && (v === "1900-01-01" || v === "01/01/1900" || row._was1900_DOB)) {
            updateFields[k] = null;
            continue;
          }
          if (k === "CURRENTJOINDATE" && (v === "1900-01-01" || v === "01/01/1900" || row._was1900_CURRENTJOINDATE)) {
            updateFields[k] = null;
            continue;
          }
          updateFields[k] = v;
        }

        if (Object.keys(updateFields).length === 0) {
          ErroredData.push({
            ...row,
            EMPCODE: enteredEmpCode,
            rejectionReasons: "No fields to update were provided"
          });
          continue;
        }

        const oldSnapshot = existingRecordForEmpCode;

        await EmployeeMaster.update(updateFields, {
          where: { EMPCODE: targetEmpCode },
          transaction: t,
        });

        // Insert Snapshot into EmployeeMasterHistory table (if exists)
        try {
          const historyReplacements = { changedBy: changedByUser, locCode: locCode || 1 };
          HISTORY_FIELDS.forEach(col => {
            historyReplacements[col] = oldSnapshot[col] !== undefined ? oldSnapshot[col] : null;
          });
          const historyCols = HISTORY_FIELDS.join(", ");
          const historyParams = HISTORY_FIELDS.map(c => `:${c}`).join(", ");

          await sequelize.query(
            `INSERT INTO EmployeeMasterHistory (${historyCols}, ChangedBy, LOC_CODE)
             VALUES (${historyParams}, :changedBy, :locCode)`,
            {
              replacements: historyReplacements,
              transaction: t,
            }
          );
        } catch (histErr) {
          console.warn("EmployeeMasterHistory snapshot warning:", histErr.message);
        }

        UpdatedData.push({
          ...row,
          DOB: (row._was1900_DOB || row.DOB === "1900-01-01" || row.DOB === "01/01/1900") ? null : (row.DOB || null),
          CURRENTJOINDATE: (row._was1900_CURRENTJOINDATE || row.CURRENTJOINDATE === "1900-01-01" || row.CURRENTJOINDATE === "01/01/1900") ? null : (row.CURRENTJOINDATE || null),
          EMPCODE: targetEmpCode,
          ENTERED_EMPCODE: enteredEmpCode,
          rejectionReasons: row._ifscRemark || null
        });
      } else {
        // ----- INSERT PATH -----
        let empCode;

        // Auto-generate code using pre-fetched GODOWN_MST sequence
        if (rangeConfigured) {
          currentGodownRangeCode++;
          empCode = currentGodownPrefix + currentGodownRangeCode;
        }

        // If RANGE_CODE/RANGE_NAME not configured in GODOWN_MST -> fall back to entered EMPCODE
        if (!empCode) {
          if (!enteredEmpCode) {
            ErroredData.push({
              ...row,
              EMPCODE: enteredEmpCode,
              rejectionReasons: "Employee code range not configured (GODOWN_MST) and no EMPCODE provided in sheet"
            });
            continue;
          }

          const candidateEmpCode = String(enteredEmpCode).trim();

          // Must not already exist in DB
          if (existingByEmpCode[candidateEmpCode]) {
            ErroredData.push({
              ...row,
              EMPCODE: enteredEmpCode,
              rejectionReasons: `EMPCODE already exists: ${candidateEmpCode}`
            });
            continue;
          }

          // Must not collide with another row earlier in this same file
          if (manualEmpCodesUsedThisBatch.has(candidateEmpCode)) {
            ErroredData.push({
              ...row,
              EMPCODE: enteredEmpCode,
              rejectionReasons: `Duplicate EMPCODE in Excel: ${candidateEmpCode}`
            });
            continue;
          }

          manualEmpCodesUsedThisBatch.add(candidateEmpCode);
          empCode = candidateEmpCode;
        }

        // Clean row for insertion into EmployeeMaster
        const insertRow = { ...row };
        if (insertRow._was1900_DOB || insertRow.DOB === "1900-01-01" || insertRow.DOB === "01/01/1900") {
          insertRow.DOB = null;
        }
        if (insertRow._was1900_CURRENTJOINDATE || insertRow.CURRENTJOINDATE === "1900-01-01" || insertRow.CURRENTJOINDATE === "01/01/1900") {
          insertRow.CURRENTJOINDATE = null;
        }
        delete insertRow.Official_number;
        delete insertRow._hadZeroMobile;
        delete insertRow._isOfficialMobile;
        delete insertRow._allowDuplicateMobile;
        delete insertRow.EMPLOYEEDESIGNATION_CODE;
        delete insertRow.BANKNAME_CODE;
        delete insertRow.rejectionReasons;
        Object.keys(insertRow).forEach(k => {
          if (k.startsWith("_") || k.endsWith("_NAME") || (k.endsWith("_CODE") && k !== "PAY_CODE")) {
            delete insertRow[k];
          }
        });

        CorrectData.push({
          ...insertRow,
          DOB: (insertRow._was1900_DOB || insertRow.DOB === "1900-01-01" || insertRow.DOB === "01/01/1900") ? null : (insertRow.DOB || null),
          CURRENTJOINDATE: (insertRow._was1900_CURRENTJOINDATE || insertRow.CURRENTJOINDATE === "1900-01-01" || insertRow.CURRENTJOINDATE === "01/01/1900") ? null : (insertRow.CURRENTJOINDATE || null),
          SRNO: abcd++,
          CHANNEL: row.CHANNEL ? row.CHANNEL : 1,
          CLUSTER: row.CLUSTER ? row.CLUSTER : 1,
          Export_Type: 1,
          CREATED_ON: formatDate(new Date()),
          CREATED_BY: changedByUser,
          Inserted_By: 'Excel-import-Final',
          ServerId: 1,
          EMPCODE: empCode,
          ENTERED_EMPCODE: enteredEmpCode || null,
          rejectionReasons: row._ifscRemark || null,
        });
      }
    }

    // Update GODOWN_MST once after all rows processed (transaction-safe)
    if (rangeConfigured && currentGodownRangeCode > initialGodownRangeCode) {
      await sequelize.query(
        `UPDATE GODOWN_MST SET RANGE_CODE = :newCode
         WHERE RANGE_NAME = :prefix AND ISNULL(EXPORT_TYPE,0) < 3`,
        {
          replacements: {
            newCode: currentGodownRangeCode,
            prefix: currentGodownPrefix
          },
          transaction: t
        }
      );
    }

    if (CorrectData.length > 0) {
      await EmployeeMaster.bulkCreate(CorrectData, { transaction: t });
    }

    await t.commit();

    const formatRowDatesForClient = (r) => {
      const copy = { ...r };
      const dateKeys = ["DOB", "CURRENTJOINDATE", "DATE_OF_JONING", "DATE_OF_JOINING", "DOJ", "Date_of_Birth"];
      dateKeys.forEach(k => {
        if (copy[k] !== undefined && copy[k] !== null && copy[k] !== "") {
          const rawStr = String(copy[k]).trim();
          const cleanStr = rawStr.replace(/[\s\-_.\/\\]/g, "").toLowerCase();
          if (
            copy["_was1900_" + k] ||
            rawStr === "01/01/1900" ||
            rawStr === "1900-01-01" ||
            rawStr === "01-01-1900" ||
            rawStr === "1/1/1900" ||
            ["01011900", "19000101", "111900", "010100", "1100"].includes(cleanStr)
          ) {
            copy[k] = null;
          } else {
            const p = parseExcelDate(copy[k]);
            if (p.is1900 || !p.displayDate || p.date === "1900-01-01") {
              copy[k] = null;
            } else {
              copy[k] = p.displayDate;
            }
          }
        } else if (copy[k] !== undefined) {
          copy[k] = null;
        }
      });
      return copy;
    };

    return res.status(200).send({
      ErroredData: ErroredData.map(formatRowDatesForClient),
      CorrectData: CorrectData.map(formatRowDatesForClient),
      UpdatedData: UpdatedData.map(formatRowDatesForClient),
      Message: `${CorrectData.length} inserted, ${UpdatedData.length} updated, ${ErroredData.length} skipped`,
    });

  } catch (error) {
    if (t) {
      try {
        await t.rollback();
      } catch (rbErr) {
        console.warn("Rollback warning:", rbErr.message);
      }
    }
    console.error("Error during employee import:", error);
    const friendlyMessage = formatUserFriendlyErrorMessage(error);
    return res.status(500).send({ Message: friendlyMessage, Error: error.message });
  } finally {
    if (sequelize) {
      try {
        await sequelize.close();
      } catch (closeErr) {
        console.warn("Sequelize close warning:", closeErr.message);
      }
    }
  }
};

exports.importformat = async function (req, res) {
  const sequelize = await dbname(req, req.query.compcode);
  const flag = Number(req.query?.flag || 0);
  try {
    let reportName = "Employee Master Excel Import";
    let Headeres;
    if (flag === 1) {
      Headeres = [
        "EMPCODE",
        "EmpName",
        "GENDER",
        "EMPTYPE",
        "CHANNEL",
        "CLUSTER",
        "LOCATION",
        "SECTION",
        "Department",
        "EMPLOYEEDESIGNATION",
        "Punch_code",
        "MSPIN",
        "PERSONAL_MOBILE_NUMBER",
        "OFFICIAL_MOBILE_NUMBER",
        "DOB",
        "DATE_OF_JONING",
        "AADHAR_CARD",
        "PANNO",
        "PERMANENTADDRESS1",
        "RELEGION",
        "pfper",
        "PF Y/N",
        "pfnumber",
        "ESI Y/N",
        "LWF Y/N",
        "Professional Tax Y/N",
        "PAYMENTMODE",
        "BANK_NAME",
        "BANKACCOUNTNO",
        "ifsc_code",
        "WEEKLYOFF",
        "EMP_SHIFT",
        "PCITY",
        "PDIST",
        "CCITY",
        "CDIST",
        "GRADE",
        "MARITALSTATUS",
        "Punch_Type"
      ];
    } else {
      Headeres = [
        "EmpName",
        "GENDER",
        "EMPTYPE",
        "CHANNEL",
        "CLUSTER",
        "LOCATION",
        "SECTION",
        "Department",
        "EMPLOYEEDESIGNATION",
        "Punch_code",
        "MSPIN",
        "PERSONAL_MOBILE_NUMBER",
        "OFFICIAL_MOBILE_NUMBER",
        "DOB",
        "DATE_OF_JONING",
        "AADHAR_CARD",
        "PANNO",
        "PERMANENTADDRESS1",
        "RELEGION",
        "pfper",
        "PF Y/N",
        "pfnumber",
        "ESI Y/N",
        "LWF Y/N",
        "Professional Tax Y/N",
        "PAYMENTMODE",
        "BANK_NAME",
        "BANKACCOUNTNO",
        "ifsc_code",
        "WEEKLYOFF",
        "EMP_SHIFT",
        "PCITY",
        "PDIST",
        "CCITY",
        "CDIST",
        "GRADE",
        "MARITALSTATUS",
        "Punch_Type"
      ];
    }

    const Headeres2 = [
      "GENDER",
      "EMPTYPE",
      "CHANNEL",
      "CLUSTER",
      "LOCATION",
      "SECTION",
      "Department",
      "EMPLOYEEDESIGNATION",
      "RELEGION",
      "PAYMENTMODE",
      "WEEKLYOFF",
      "EMP_SHIFT",
      "Shfit timing (only for refrence)",
      "BANK_NAME",
      "CITY (PCITY/CCITY)",
      "DISTRICT (PDIST/CDIST)",
      "GRADE",
      "MARITAL STATUS",
      "PUNCH TYPE"
    ];

    const GENDERARRAY = ["MALE", "FEMALE"];
    const EMPTYPEARRAY = ["REGULAR", "CASUAL", "APPRENTICE"];
    const paymentModes = [
      "BANK TRANSFER",
      "CHEQUE",
      "CASH",
      "NEFT",
      "OTHER",
      "SALARY HOLD",
    ];
    const WeeklyOff = [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ];
    const relCode = [
      "HINDU",
      "MUSLIMS",
      "SIKH",
      "CHRISTIAN",
      "JAIN",
      "BUDDHA",
      "PERSIANS",
    ];

    const location = await sequelize.query(
      `select Misc_Name from misc_mst where misc_type = 85 and isnull(export_type, 0) < 3`
    );
    const locationArray = location[0]?.map((obj) => obj.Misc_Name);

    const designation = await sequelize.query(
      `select Misc_Name from misc_mst where misc_type = 95 and isnull(export_type, 0) < 3`
    );
    const designationArray = designation[0]?.map((obj) => obj.Misc_Name);

    const section = await sequelize.query(
      `select Misc_Name from misc_mst where misc_type = 81 and isnull(export_type, 0) < 3`
    );
    const sectionArray = section[0]?.map((obj) => obj.Misc_Name);

    const divison = await sequelize.query(
      `select Misc_Name from misc_mst where misc_type = 68 and isnull(export_type, 0) < 3`
    );
    const divisonArray = divison[0]?.map((obj) => obj.Misc_Name);

    const cluster = await sequelize.query(
      `select Misc_Name from misc_mst where misc_type = 626 and isnull(export_type, 0) < 3`
    );
    const clusterArray = cluster[0]?.map((obj) => obj.Misc_Name);

    const channel = await sequelize.query(
      `select Misc_Name from misc_mst where misc_type = 627 and isnull(export_type, 0) < 3`
    );
    const channelArray = channel[0]?.map((obj) => obj.Misc_Name);

    const emp_shift = await sequelize.query(
      `select Misc_Name, concat(misc_name ,' - ' , misc_add1 , ' - ' , misc_add2) as timimg from misc_mst where misc_type = 90 and isnull(export_type, 0) < 3`
    );

    const Bank = await sequelize.query(
      `select Misc_Name from misc_mst where misc_type = 8 and isnull(export_type, 0) < 3`
    );
    const BankArray = Bank[0]?.map((obj) => obj.Misc_Name);
    const emp_shiftArray = emp_shift[0]?.map((obj) => obj.Misc_Name);
    const shift_timingArray = emp_shift[0]?.map((obj) => obj.timimg);

    const city = await sequelize.query(
      `select Misc_Name from misc_mst where misc_type = 1 and isnull(export_type, 0) < 3`
    );
    const cityArray = city[0]?.map((obj) => obj.Misc_Name) || [];

    const district = await sequelize.query(
      `select Misc_Name from misc_mst where misc_type = 2 and isnull(export_type, 0) < 3`
    );
    const districtArray = district[0]?.map((obj) => obj.Misc_Name) || [];

    const grade = await sequelize.query(
      `select Misc_Name from misc_mst where misc_type = 672 and isnull(export_type, 0) < 3`
    );
    const gradeArray = grade[0]?.map((obj) => obj.Misc_Name) || [];

    const maritalStatus = await sequelize.query(
      `select Misc_Name from misc_mst where misc_type = 657 and isnull(export_type, 0) < 3`
    );
    const maritalStatusArray = maritalStatus[0]?.map((obj) => obj.Misc_Name) || [];

    const punchType = await sequelize.query(
      `select Misc_Name from misc_mst where misc_type = 662 and isnull(export_type, 0) < 3`
    );
    const punchTypeArray = punchType[0]?.map((obj) => obj.Misc_Name) || [];

    const twoDArray = [
      GENDERARRAY,
      EMPTYPEARRAY,
      channelArray,
      clusterArray,
      locationArray,
      sectionArray,
      divisonArray,
      designationArray,
      relCode,
      paymentModes,
      WeeklyOff,
      emp_shiftArray,
      shift_timingArray,
      BankArray,
      cityArray,
      districtArray,
      gradeArray,
      maritalStatusArray,
      punchTypeArray
    ];
    let maxLength = Math.max(0, ...twoDArray.map((arr) => arr ? arr.length : 0));

    twoDArray.forEach((arr) => {
      while (arr.length < maxLength) {
        arr.push(null);
      }
    });

    let transposedArray = [];
    for (let i = 0; i < maxLength; i++) {
      transposedArray.push(twoDArray.map((arr) => arr[i]));
    }

    const Company_Name = await sequelize.query(
      `select top 1 comp_name from Comp_Mst`
    );

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");
    worksheet.mergeCells("A1:E1");
    worksheet.getCell("A1").value = `${Company_Name[0][0]?.comp_name || 'Company'}`;
    worksheet.getCell("A1").alignment = { vertical: "middle", horizontal: "center" };
    worksheet.getCell("A1").font = { bold: true, size: 16 };

    worksheet.mergeCells("A2:E2");
    worksheet.getCell("A2").value = `${reportName}`;
    worksheet.getCell("A2").alignment = { vertical: "middle", horizontal: "center" };

    worksheet.mergeCells("A3:L3");
    let reportName1 = "COPY THESE HEADINGS IN A NEW EXCEL, THEN FILL DATA AND IMPORT THE NEW SHEET INTO WEB PORTAL";
    worksheet.getCell("A3").value = `${reportName1}`;

    const headerRow = worksheet.addRow(Headeres);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF006400" },
      };
    });

    worksheet.addRow();
    worksheet.addRow();
    const headerRow1 = worksheet.addRow(Headeres2);
    headerRow1.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF006400" },
      };
    });

    transposedArray?.forEach((item) => {
      worksheet.addRow(item);
    });

    res.status(200).setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="EmployeeMaster_Excel_Template.xlsx"'
    );
    return workbook.xlsx
      .write(res)
      .then(() => {
        res.end();
      })
      .catch((error) => {
        console.error("Error creating workbook:", error);
        res.status(500).send("Internal Server Error");
      });
  } catch (e) {
    console.error("Error in importformat:", e);
    return res.status(500).send({ Message: "Error generating format", Error: e.message });
  } finally {
    if (sequelize) {
      await sequelize.close();
    }
  }
};
