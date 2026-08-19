const { QueryTypes } = require("sequelize");
const { dbname } = require("../utils/dbconfig");
const XLSX = require("xlsx");

// ============================================================
// CONSTANTS
// ============================================================
const ACTIVE_EXPORT_TYPE = 1;
const VALID_RULE_TYPES = new Set([
  "WHICHEVER_FIRST",
  "KM_ONLY",
  "DAYS_ONLY",
]);

async function safeRollback(transaction) {
  try {
    if (transaction) await transaction.rollback();
  } catch (e) {
    console.error("[ROLLBACK ERROR]", e?.message);
  }
}

const ACTIVE_STATUS = 1;
// const VALID_RULE_TYPES  = new Set(["WHICHEVER_FIRST", "KM_ONLY", "DAYS_ONLY"]);
const DEFAULT_RULE_TYPE = "WHICHEVER_FIRST";


// ============================================================
// HELPERS
// ============================================================

const convertDate = (dateStr) => {
  if (dateStr === undefined || dateStr === null || dateStr === "") {
    return null;
  }

  const value = String(dateStr).trim();

  if (!value) return null;

  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  // DD-MM-YYYY
  if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
    const [day, month, year] = value.split("-");
    return `${year}-${month}-${day}`;
  }

  // DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    const [day, month, year] = value.split("/");
    return `${year}-${month}-${day}`;
  }

  return null;
};

const isValidDate = (dateValue) => {
  if (!dateValue) return false;

  const date = new Date(`${dateValue}T00:00:00Z`);

  return !Number.isNaN(date.getTime());
};

const getTodayDate = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const normalizeVehicleNumber = (vehicleNumber) => {
  if (!vehicleNumber) return null;

  return String(vehicleNumber)
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "");
};

const normalizeModelName = (modelName) => {
  if (!modelName) return null;

  return String(modelName).trim().replace(/\s+/g, " ");
};

const toNumberOrNull = (value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : null;
};

const toIntegerOrNull = (value) => {
  const numberValue = toNumberOrNull(value);

  if (numberValue === null) return null;

  return Math.trunc(numberValue);
};

const isNonNegativeNumber = (value) => {
  const numberValue = Number(value);

  return Number.isFinite(numberValue) && numberValue >= 0;
};

const addDays = (dateValue, days) => {
  if (!dateValue || days === null || days === undefined) {
    return null;
  }

  const formattedDate = convertDate(dateValue);

  if (!formattedDate || !isValidDate(formattedDate)) {
    return null;
  }

  const [year, month, day] = formattedDate
    .split("-")
    .map(Number);

  const date = new Date(
    Date.UTC(year, month - 1, day)
  );

  date.setUTCDate(date.getUTCDate() + Number(days));

  return date.toISOString().slice(0, 10);
};

const getEarlierDate = (firstDate, secondDate) => {
  if (!firstDate) return secondDate || null;
  if (!secondDate) return firstDate || null;

  return firstDate <= secondDate
    ? firstDate
    : secondDate;
};

const getLoginUserId = (req, body = {}) => {
  return (
    body.Created_By ||
    body.Updated_By ||
    req?.user?.UTD ||
    req?.user?.userId ||
    null
  );
};

// helper: normalize Loc_Code to array of trimmed strings
const toLocCodeArray = (val) => {
  if (val == null) return [];
  if (Array.isArray(val)) {
    return val
      .flat()
      .map((v) => String(v).trim())
      .filter((v) => Boolean(v) && v !== "all" && v !== "ALL");
  }
  const s = String(val).trim();
  if (!s || s === "all" || s === "ALL") return [];
  return s
    .split(/[,\s]+/)
    .map((x) => x.trim())
    .filter((x) => Boolean(x) && x !== "all" && x !== "ALL");
};



// SQL Server me NULL date ko safely convert karne ke liye.
const nullableDateExpression = (replacementName) => {
  return `
    CASE
      WHEN :${replacementName} IS NULL THEN NULL
      ELSE CONVERT(date, :${replacementName}, 23)
    END
  `;
};

// ============================================================
// REMINDER CALCULATION
// ============================================================

const calculateReminderData = ({ customer, rule }) => {
  const lastServiceDate = convertDate(
    customer.Last_Service_Date
  );

  const lastServiceKM = toNumberOrNull(
    customer.Last_Service_KM
  );

  const currentKM = toNumberOrNull(
    customer.Current_KM
  );

  const avgDailyKM = toNumberOrNull(
    customer.Avg_Daily_KM
  );

  const intervalKM = toNumberOrNull(
    rule.Service_Interval_KM
  );

  const intervalDays = toNumberOrNull(
    rule.Service_Interval_Days
  );

  let nextServiceKM = null;
  let dateBasedDueDate = null;
  let kmBasedDueDate = null;

  if (
    lastServiceKM !== null &&
    intervalKM !== null
  ) {
    nextServiceKM = lastServiceKM + intervalKM;
  }

  if (
    lastServiceDate &&
    intervalDays !== null
  ) {
    dateBasedDueDate = addDays(
      lastServiceDate,
      intervalDays
    );
  }

  if (
    nextServiceKM !== null &&
    currentKM !== null &&
    avgDailyKM !== null &&
    avgDailyKM > 0
  ) {
    const remainingKM = nextServiceKM - currentKM;

    if (remainingKM <= 0) {
      kmBasedDueDate = getTodayDate();
    } else {
      const expectedDays = Math.ceil(
        remainingKM / avgDailyKM
      );

      kmBasedDueDate = addDays(
        getTodayDate(),
        expectedDays
      );
    }
  }

  const ruleType = String(
    rule.Rule_Type || "WHICHEVER_FIRST"
  )
    .trim()
    .toUpperCase();

  let finalDueDate = null;

  if (ruleType === "KM_ONLY") {
    finalDueDate = kmBasedDueDate;
  } else if (ruleType === "DAYS_ONLY") {
    finalDueDate = dateBasedDueDate;
  } else {
    finalDueDate = getEarlierDate(
      dateBasedDueDate,
      kmBasedDueDate
    );
  }

  return {
    lastServiceDate,
    lastServiceKM,
    currentKM,
    avgDailyKM,
    intervalKM,
    intervalDays,
    nextServiceKM,
    dateBasedDueDate,
    kmBasedDueDate,
    finalDueDate,
  };
};

const buildReminderItems = (rule, finalDueDate) => {
  const reminderMap = new Map();

  const beforeDays1 = toIntegerOrNull(
    rule.Reminder_Before_Days_1
  );

  const beforeDays2 = toIntegerOrNull(
    rule.Reminder_Before_Days_2
  );

  const overdueDays = toIntegerOrNull(
    rule.Overdue_Reminder_Days
  );

  if (beforeDays1 !== null && beforeDays1 >= 0) {
    const type = `${beforeDays1}_DAYS_BEFORE`;

    reminderMap.set(type, {
      type,
      date: addDays(finalDueDate, -beforeDays1),
    });
  }

  if (beforeDays2 !== null && beforeDays2 >= 0) {
    const type = `${beforeDays2}_DAYS_BEFORE`;

    reminderMap.set(type, {
      type,
      date: addDays(finalDueDate, -beforeDays2),
    });
  }

  if (Number(rule.Reminder_On_Due_Date) === 1) {
    reminderMap.set("DUE_TODAY", {
      type: "DUE_TODAY",
      date: finalDueDate,
    });
  }

  if (overdueDays !== null && overdueDays >= 0) {
    const type = `OVERDUE_${overdueDays}_DAYS`;

    reminderMap.set(type, {
      type,
      date: addDays(finalDueDate, overdueDays),
    });
  }

  return Array.from(reminderMap.values()).filter(
    (item) => item.date
  );
};

// ============================================================
// 1. CREATE CUSTOMER VEHICLE
// ============================================================

exports.createCustomerVehicle = async function (req, res) {
  let sequelize;

  try {
    sequelize = await dbname(
      req,
      req.headers.compcode
    );

    const body = req.body || {};

    if (!body.Loc_Code) {
      return res.status(400).send({
        success: false,
        message: "Loc_Code is required",
      });
    }

    if (!body.Veh_Reg_No) {
      return res.status(400).send({
        success: false,
        message: "Veh_Reg_No is required",
      });
    }

    if (!body.Cust_Name) {
      return res.status(400).send({
        success: false,
        message: "Cust_Name is required",
      });
    }

    if (!body.Cust_Mob) {
      return res.status(400).send({
        success: false,
        message: "Cust_Mob is required",
      });
    }

    if (!body.Model_Name) {
      return res.status(400).send({
        success: false,
        message: "Model_Name is required",
      });
    }

    const lastServiceDate = convertDate(
      body.Last_Service_Date
    );

    if (
      body.Last_Service_Date &&
      !lastServiceDate
    ) {
      return res.status(400).send({
        success: false,
        message:
          "Invalid Last_Service_Date. Use YYYY-MM-DD or DD-MM-YYYY or DD/MM/YYYY",
      });
    }

    const lastServiceKM = toIntegerOrNull(
      body.Last_Service_KM
    );

    const currentKM = toIntegerOrNull(
      body.Current_KM
    );

    const avgDailyKM = toNumberOrNull(
      body.Avg_Daily_KM
    );

    // ══════════════════════════════════════════════════════════
    // ✅ NEW FIELDS: Service_Interval_KM & Service_Interval_Days
    // ══════════════════════════════════════════════════════════
    const serviceIntervalKM = toIntegerOrNull(
      body.Service_Interval_KM
    );

    const serviceIntervalDays = toIntegerOrNull(
      body.Service_Interval_Days
    );

    if (
      body.Last_Service_KM !== undefined &&
      !isNonNegativeNumber(body.Last_Service_KM)
    ) {
      return res.status(400).send({
        success: false,
        message:
          "Last_Service_KM must be a valid non-negative number",
      });
    }

    if (
      body.Current_KM !== undefined &&
      !isNonNegativeNumber(body.Current_KM)
    ) {
      return res.status(400).send({
        success: false,
        message:
          "Current_KM must be a valid non-negative number",
      });
    }

    if (
      body.Avg_Daily_KM !== undefined &&
      !isNonNegativeNumber(body.Avg_Daily_KM)
    ) {
      return res.status(400).send({
        success: false,
        message:
          "Avg_Daily_KM must be a valid non-negative number",
      });
    }

    // ══════════════════════════════════════════════════════════
    // ✅ NEW VALIDATION: Service_Interval_KM & Service_Interval_Days
    // ══════════════════════════════════════════════════════════
    if (
      body.Service_Interval_KM !== undefined &&
      !isNonNegativeNumber(body.Service_Interval_KM)
    ) {
      return res.status(400).send({
        success: false,
        message:
          "Service_Interval_KM must be a valid non-negative number",
      });
    }

    if (
      body.Service_Interval_Days !== undefined &&
      !isNonNegativeNumber(body.Service_Interval_Days)
    ) {
      return res.status(400).send({
        success: false,
        message:
          "Service_Interval_Days must be a valid non-negative number",
      });
    }

    if (
      lastServiceKM !== null &&
      currentKM !== null &&
      currentKM < lastServiceKM
    ) {
      return res.status(400).send({
        success: false,
        message:
          "Current_KM cannot be less than Last_Service_KM",
      });
    }

    const vehicleNumber = normalizeVehicleNumber(
      body.Veh_Reg_No
    );

    const modelName = normalizeModelName(
      body.Model_Name
    );

    const existing = await sequelize.query(
      `SELECT TOP 1
          UTD,
          Veh_Reg_No
       FROM Srv_Cust_Vehi_Tbl
       WHERE Loc_Code = :Loc_Code
         AND UPPER(
           REPLACE(
             REPLACE(Veh_Reg_No, ' ', ''),
             '-',
             ''
           )
         ) = :Veh_Reg_No`,
      {
        replacements: {
          Loc_Code: body.Loc_Code,
          Veh_Reg_No: vehicleNumber,
        },
        type: QueryTypes.SELECT,
      }
    );

    if (existing.length > 0) {
      return res.status(409).send({
        success: false,
        message:
          "Vehicle registration number already exists",
        data: {
          UTD: existing[0].UTD,
          Veh_Reg_No: existing[0].Veh_Reg_No,
        },
      });
    }

    const result = await sequelize.query(
      `INSERT INTO Srv_Cust_Vehi_Tbl
      (
        Loc_Code,
        Veh_Reg_No,
        Cust_Name,
        Cust_Mob,
        Model_Name,
        Last_Service_Date,
        Last_Service_KM,
        Avg_Daily_KM,
        Current_KM,
        Service_Interval_KM,
        Service_Interval_Days,
        status,
        Created_By,
        Created_At
      )
      OUTPUT INSERTED.UTD
      VALUES
      (
        :Loc_Code,
        :Veh_Reg_No,
        :Cust_Name,
        :Cust_Mob,
        :Model_Name,
        ${nullableDateExpression("Last_Service_Date")},
        :Last_Service_KM,
        :Avg_Daily_KM,
        :Current_KM,
        :Service_Interval_KM,
        :Service_Interval_Days,
        :status,
        :Created_By,
        GETDATE()
      )`,
      {
        replacements: {
          Loc_Code: String(body.Loc_Code).trim(),
          Veh_Reg_No: vehicleNumber,
          Cust_Name: String(body.Cust_Name).trim(),
          Cust_Mob: String(body.Cust_Mob).trim(),
          Model_Name: modelName,
          Last_Service_Date: lastServiceDate,
          Last_Service_KM: lastServiceKM,
          Avg_Daily_KM: avgDailyKM,
          Current_KM: currentKM,
          Service_Interval_KM: serviceIntervalKM,
          Service_Interval_Days: serviceIntervalDays,
          status: Number(body.status ?? 0),
          Created_By: getLoginUserId(req, body),
        },
        type: QueryTypes.SELECT,
      }
    );

    return res.status(200).send({
      success: true,
      message:
        "Customer vehicle created successfully",
      data: {
        UTD: result[0]?.UTD,
      },
    });
  } catch (error) {
    console.error(
      "Create Customer Vehicle Error:",
      error
    );

    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  } finally {
    if (sequelize) {
      await sequelize.close();
    }
  }
};

// ============================================================
// 2. GET ALL CUSTOMER VEHICLES
// ============================================================
 
exports.getAllCustomerVehicles = async function (req, res) {
  let sequelize;

  try {
    sequelize = await dbname(req, req.headers.compcode);

    const body = req.body || {};
    const {
      page = 1,
      pageSize = 10,
      search,
      Loc_Code,
      Model_Name,
      status,
      emp_code,
      EMPCODE,
      empCode,
      user_code,
      User_Code,
      srv_exec_Emp_Code,
      emp_dms_code,
      Emp_Dms_Code,
      empDmsCode,
      dms_code,
    } = body;

    let userEmpCode = String(
      emp_code ||
      EMPCODE ||
      empCode ||
      user_code ||
      User_Code ||
      srv_exec_Emp_Code ||
      req?.headers?.emp_code ||
      req?.headers?.empcode ||
      req?.headers?.['emp-code'] ||
      req?.user?.EMPCODE ||
      req?.user?.emp_code ||
      ""
    ).trim();

    let empDmsCodeStr = String(
      emp_dms_code ||
      Emp_Dms_Code ||
      empDmsCode ||
      dms_code ||
      req?.headers?.emp_dms_code ||
      req?.headers?.empdmscode ||
      req?.headers?.['emp-dms-code'] ||
      req?.user?.emp_dms_code ||
      ""
    ).trim().toUpperCase();

    // Fallback: look up user_tbl if emp_code or emp_dms_code is missing
    const userIdForLookup =
      body.user_code ||
      body.User_Code ||
      body.user_id ||
      body.User_Id ||
      body.Created_By ||
      body.Updated_By ||
      req?.headers?.user_code ||
      req?.headers?.['user-code'] ||
      req?.headers?.user_id ||
      req?.user?.UTD ||
      req?.user?.userId ||
      (userEmpCode && userEmpCode !== "" ? userEmpCode : null);

    if (userIdForLookup && (!userEmpCode || !empDmsCodeStr)) {
      try {
        const userRows = await sequelize.query(
          `SELECT TOP 1 empcode, emp_dms_code 
           FROM dbo.user_tbl 
           WHERE (CAST(user_code AS VARCHAR(50)) = :uId OR CAST(empcode AS VARCHAR(50)) = :uId)
             AND (export_type < 3 OR export_type IS NULL)`,
          {
            replacements: { uId: String(userIdForLookup).trim() },
            type: QueryTypes.SELECT,
          }
        );
        if (userRows && userRows.length > 0) {
          if (!userEmpCode && userRows[0].empcode) {
            userEmpCode = String(userRows[0].empcode).trim();
          }
          if (!empDmsCodeStr && userRows[0].emp_dms_code) {
            empDmsCodeStr = String(userRows[0].emp_dms_code).trim().toUpperCase();
          }
        }
      } catch (lookupErr) {
        console.error("[CUSTOMER-VEHICLE USER LOOKUP ERROR]", lookupErr?.message);
      }
    }

    const isAdmin = empDmsCodeStr === "EDP";
    console.log("[CUSTOMER-VEHICLE ROLE CHECK]", { userEmpCode, empDmsCodeStr, isAdmin });

    const pageNum = Math.max(Number.parseInt(page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(Number.parseInt(pageSize, 10) || 10, 1),
      500
    );
    const offset = (pageNum - 1) * limit;

    // base where: active (Export_Type = 1 or NULL)
    let whereConditions = `
      WHERE (c.Export_Type = 1 OR c.Export_Type IS NULL)
    `;

    const replacements = {
      offset,
      limit,
    };

    // ── Employee Hierarchy Filter (Non-EDP Users) ──
    if (!isAdmin && userEmpCode) {
      whereConditions += `
        AND (
          c.srv_exec_Emp_Code = :userEmpCode
          OR emp.Reporting_1 = :userEmpCode
          OR emp.Reporting_2 = :userEmpCode
          OR emp.Reporting_3 = :userEmpCode
        )
      `;
      replacements.userEmpCode = userEmpCode;
    }

    // ── Loc_Code filter ──
    const locCodes = toLocCodeArray(Loc_Code);
    if (locCodes.length === 1) {
      whereConditions += `
        AND LTRIM(RTRIM(CAST(c.Loc_Code AS VARCHAR(50)))) = :Loc_Code
      `;
      replacements.Loc_Code = locCodes[0];
    } else if (locCodes.length > 1) {
      const locPlaceholders = locCodes.map((_, i) => `:locCode_${i}`).join(", ");
      whereConditions += `
        AND LTRIM(RTRIM(CAST(c.Loc_Code AS VARCHAR(50)))) IN (${locPlaceholders})
      `;
      locCodes.forEach((code, i) => {
        replacements[`locCode_${i}`] = code;
      });
    }

    // ── Model_Name filter ──
    if (Model_Name) {
      whereConditions += `
        AND UPPER(LTRIM(RTRIM(c.Model_Name))) =
            UPPER(LTRIM(RTRIM(:Model_Name)))
      `;
      replacements.Model_Name = String(Model_Name);
    }

    // ── Status filter ──
    if (status !== undefined && status !== null && status !== "") {
      whereConditions += `
        AND c.status = :status
      `;
      replacements.status = Number(status);
    }

    // ── Search filter ──
    if (search) {
      const raw = String(search).trim();
      const searchLike = `%${raw}%`;
      const searchNorm = `%${raw.replace(/[ \-\+\(\)]/g, "")}%`;
      const digitsOnly = raw.replace(/\D/g, "");
      const searchDigits = digitsOnly ? `%${digitsOnly}%` : searchNorm;
      const last10Digits = digitsOnly.length >= 10 ? `%${digitsOnly.slice(-10)}%` : searchDigits;

      whereConditions += `
        AND
        (
          UPPER(ISNULL(m.Veh_Reg_No, ISNULL(c.Veh_Reg_No, ''))) LIKE UPPER(:search)
          OR UPPER(REPLACE(REPLACE(ISNULL(m.Veh_Reg_No, ISNULL(c.Veh_Reg_No, '')), ' ', ''), '-', '')) LIKE UPPER(:searchNorm)
          OR UPPER(ISNULL(c.Cust_Name, '')) LIKE UPPER(:search)
          OR UPPER(CAST(ISNULL(c.Cust_Mob, '') AS VARCHAR(50))) LIKE UPPER(:search)
          OR REPLACE(REPLACE(REPLACE(REPLACE(CAST(ISNULL(c.Cust_Mob, '') AS VARCHAR(50)), ' ', ''), '-', ''), '+', ''), '(', '') LIKE :searchNorm
          OR REPLACE(REPLACE(REPLACE(REPLACE(CAST(ISNULL(c.Cust_Mob, '') AS VARCHAR(50)), ' ', ''), '-', ''), '+', ''), '(', '') LIKE :searchDigits
          OR REPLACE(REPLACE(REPLACE(REPLACE(CAST(ISNULL(c.Cust_Mob, '') AS VARCHAR(50)), ' ', ''), '-', ''), '+', ''), '(', '') LIKE :last10Digits
          OR UPPER(ISNULL(c.Model_Name, '')) LIKE UPPER(:search)
          OR UPPER(ISNULL(c.srv_exec_name, '')) LIKE UPPER(:search)
          OR UPPER(ISNULL(c.srv_exec_Emp_Code, '')) LIKE UPPER(:search)
          OR UPPER(CAST(ISNULL(c.srv_exec_mobile, '') AS VARCHAR(50))) LIKE UPPER(:search)
          OR REPLACE(REPLACE(REPLACE(REPLACE(CAST(ISNULL(c.srv_exec_mobile, '') AS VARCHAR(50)), ' ', ''), '-', ''), '+', ''), '(', '') LIKE :searchNorm
          OR REPLACE(REPLACE(REPLACE(REPLACE(CAST(ISNULL(c.srv_exec_mobile, '') AS VARCHAR(50)), ' ', ''), '-', ''), '+', ''), '(', '') LIKE :searchDigits
          OR REPLACE(REPLACE(REPLACE(REPLACE(CAST(ISNULL(c.srv_exec_mobile, '') AS VARCHAR(50)), ' ', ''), '-', ''), '+', ''), '(', '') LIKE :last10Digits
        )
      `;
      replacements.search = searchLike;
      replacements.searchNorm = searchNorm;
      replacements.searchDigits = searchDigits;
      replacements.last10Digits = last10Digits;
    }

    // ── COUNT ──
    const countResult = await sequelize.query(
      `SELECT COUNT(*) AS total
       FROM dbo.Srv_Cust_Vehi_Tbl c
       LEFT JOIN dbo.Srv_Mst_Vehi_Tbl m
         ON m.UTD = c.Tran_id
       LEFT JOIN dbo.EMPLOYEEMASTER emp
         ON emp.EMPCODE = c.srv_exec_Emp_Code
       ${whereConditions}`,
      {
        replacements,
        type: QueryTypes.SELECT,
      }
    );

    const totalRecords = Number(countResult?.[0]?.total || 0);

    // ── DATA ──
    const data = await sequelize.query(
      `SELECT
         c.UTD,
         c.Loc_Code,
         c.Tran_id,
         ISNULL(m.Veh_Reg_No, c.Veh_Reg_No) AS Veh_Reg_No,
         c.Cust_Name,
         c.Cust_Mob,
         c.Model_Name,
         CONVERT(varchar(10), c.Last_Service_Date, 23) AS Last_Service_Date,
         c.Last_Service_KM,
         c.Avg_Daily_KM,
         c.Current_KM,
         c.Service_Interval_KM,
         c.Service_Interval_Days,
         c.srv_exec_name,
         c.srv_exec_Emp_Code,
         c.srv_exec_mobile,
         c.Export_Type,
         c.status,
         c.Created_By,
         CONVERT(varchar(19), c.Created_At, 120) AS Created_At,
         c.Updated_By,
         CONVERT(varchar(19), c.Updated_At, 120) AS Updated_At
       FROM dbo.Srv_Cust_Vehi_Tbl c
       LEFT JOIN dbo.Srv_Mst_Vehi_Tbl m
         ON m.UTD = c.Tran_id
       LEFT JOIN dbo.EMPLOYEEMASTER emp
         ON emp.EMPCODE = c.srv_exec_Emp_Code
       ${whereConditions}
       ORDER BY c.UTD DESC
       OFFSET :offset ROWS
       FETCH NEXT :limit ROWS ONLY`,
      {
        replacements,
        type: QueryTypes.SELECT,
      }
    );

    const totalPages =
      totalRecords === 0 ? 0 : Math.ceil(totalRecords / limit);

    return res.status(200).send({
      success: true,
      data,
      pagination: {
        currentPage: pageNum,
        pageSize: limit,
        totalRecords,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });

  } catch (error) {
    console.error("Get Customer Vehicles Error:", error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  } finally {
    if (sequelize) {
      await sequelize.close();
    }
  }
};

// ============================================================
// 3. GET ONE CUSTOMER VEHICLE
// ============================================================

exports.getOneCustomerVehicle = async function (
  req,
  res
) {
  let sequelize;

  try {
    sequelize = await dbname(
      req,
      req.headers.compcode
    );

    const { UTD } = req.body || {};

    if (!UTD) {
      return res.status(400).send({
        success: false,
        message: "UTD is required",
      });
    }

    const result = await sequelize.query(
      `SELECT
        UTD,
        Loc_Code,
        Veh_Reg_No,
        Cust_Name,
        Cust_Mob,
        Model_Name,
        CONVERT(varchar(10), Last_Service_Date, 23)
          AS Last_Service_Date,
        Last_Service_KM,
        Avg_Daily_KM,
        Current_KM,
        status,
        Created_By,
        Created_At,
        Updated_By,
        Updated_At
       FROM Srv_Cust_Vehi_Tbl
       WHERE UTD = :UTD`,
      {
        replacements: {
          UTD: Number(UTD),
        },
        type: QueryTypes.SELECT,
      }
    );

    if (result.length === 0) {
      return res.status(404).send({
        success: false,
        message: "Customer vehicle not found",
      });
    }

    return res.status(200).send({
      success: true,
      data: result[0],
    });
  } catch (error) {
    console.error(
      "Get Customer Vehicle Error:",
      error
    );

    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  } finally {
    if (sequelize) {
      await sequelize.close();
    }
  }
};

// ============================================================
// 4. UPDATE CUSTOMER VEHICLE
// ============================================================

exports.bulkUpdateServiceExecutive = async function (req, res) {
  let sequelize;

  try {
    sequelize = await dbname(req, req.headers.compcode);

    const body = req.body || {};

    // ════════════════════════════════════════════════════════
    // VALIDATION
    // ════════════════════════════════════════════════════════

    if (!body.Loc_Code) {
      return res.status(400).send({
        success: false,
        message: "Loc_Code is required",
      });
    }

    // ✅ Selected UTDs required — sirf inhi rows update hongi
    const selectedUTDs = Array.isArray(body.selectedUTDs)
      ? body.selectedUTDs
        .map((v) => Number(v))
        .filter((v) => !isNaN(v) && v > 0)
      : [];

    if (selectedUTDs.length === 0) {
      return res.status(400).send({
        success: false,
        message: "selectedUTDs is required and must be a non-empty array of valid UTDs",
      });
    }

    // ── Teen mein se kam se kam ek field required ──────────
    const hasSrvExecName = body.srv_exec_name !== undefined;
    const hasSrvExecMobile = body.srv_exec_mobile !== undefined;
    const hasSrvExecEmpCode = body.srv_exec_Emp_Code !== undefined;

    if (!hasSrvExecName && !hasSrvExecMobile && !hasSrvExecEmpCode) {
      return res.status(400).send({
        success: false,
        message:
          "At least one field required: srv_exec_name, srv_exec_mobile, srv_exec_Emp_Code",
      });
    }

    // ── Business Rule ──────────────────────────────────────
    const empCode = body.srv_exec_Emp_Code
      ? String(body.srv_exec_Emp_Code).trim()
      : null;

    const execName = body.srv_exec_name
      ? String(body.srv_exec_name).trim()
      : null;

    const execMobile = body.srv_exec_mobile
      ? String(body.srv_exec_mobile).trim()
      : null;

    if (!empCode) {
      if (!execName) {
        return res.status(400).send({
          success: false,
          message: "srv_exec_name is required when srv_exec_Emp_Code is not provided",
        });
      }
      if (!execMobile) {
        return res.status(400).send({
          success: false,
          message: "srv_exec_mobile is required when srv_exec_Emp_Code is not provided",
        });
      }
    }

    // ── Mobile validate ────────────────────────────────────
    if (execMobile && !/^[0-9]{10,15}$/.test(execMobile)) {
      return res.status(400).send({
        success: false,
        message: "srv_exec_mobile must contain 10 to 15 digits",
      });
    }

    // ── Loc_Code normalize ─────────────────────────────────
    const locArr = Array.isArray(body.Loc_Code)
      ? body.Loc_Code
        .flat()
        .map((v) => String(v).trim())
        .filter(Boolean)
      : String(body.Loc_Code)
        .trim()
        .split(/[,\s]+/)
        .map((x) => x.trim())
        .filter(Boolean);

    if (locArr.length === 0) {
      return res.status(400).send({
        success: false,
        message: "Loc_Code is invalid or empty",
      });
    }

    const updatedBy =
      body.Updated_By ||
      req?.body?.user ||
      req?.user?.UTD ||
      req?.user?.userId ||
      null;

    // ════════════════════════════════════════════════════════
    // CHECK — Kitne records update honge
    // ✅ FIX: Sirf selected UTDs count karo
    // ════════════════════════════════════════════════════════
    const countReplace = {
      selectedUTDs,
    };

    let countWhere = `
      WHERE Export_Type = 1
        AND UTD IN (:selectedUTDs)
    `;

    // Loc_Code bhi match karo — safety check
    if (locArr.length === 1) {
      countWhere += ` AND Loc_Code = :Loc_Code`;
      countReplace.Loc_Code = locArr[0];
    } else {
      countWhere += ` AND Loc_Code IN (:Loc_Codes)`;
      countReplace.Loc_Codes = locArr;
    }

    const countResult = await sequelize.query(
      `SELECT COUNT(*) AS total
       FROM dbo.Srv_Cust_Vehi_Tbl
       ${countWhere}`,
      {
        replacements: countReplace,
        type: QueryTypes.SELECT,
      }
    );

    const totalRecords = Number(countResult?.[0]?.total || 0);

    if (totalRecords === 0) {
      return res.status(404).send({
        success: false,
        message: `No matching records found for selected UTDs and Loc_Code`,
        debug: {
          selectedUTDs,
          Loc_Code: locArr,
        },
      });
    }

    // ════════════════════════════════════════════════════════
    // BUILD UPDATE
    // ✅ FIX: WHERE mein UTD IN (:selectedUTDs) use karo
    // ════════════════════════════════════════════════════════
    const setClauses = [
      `srv_exec_name     = :srv_exec_name`,
      `srv_exec_mobile   = :srv_exec_mobile`,
      `srv_exec_Emp_Code = :srv_exec_Emp_Code`,
      `Updated_By        = :Updated_By`,
      `Updated_At        = GETDATE()`,
    ];

    const replacements = {
      srv_exec_name: execName || null,
      srv_exec_mobile: execMobile || null,
      srv_exec_Emp_Code: empCode || null,
      Updated_By: updatedBy,
      selectedUTDs,
    };

    // ✅ WHERE: sirf selected UTDs + Loc_Code safety
    let updateWhere = `
      WHERE Export_Type = 1
        AND UTD IN (:selectedUTDs)
    `;

    if (locArr.length === 1) {
      updateWhere += ` AND Loc_Code = :Loc_Code`;
      replacements.Loc_Code = locArr[0];
    } else {
      updateWhere += ` AND Loc_Code IN (:Loc_Codes)`;
      replacements.Loc_Codes = locArr;
    }

    // ════════════════════════════════════════════════════════
    // EXECUTE BULK UPDATE
    // ════════════════════════════════════════════════════════
    await sequelize.query(
      `UPDATE dbo.Srv_Cust_Vehi_Tbl
       SET ${setClauses.join(", ")}
       ${updateWhere}`,
      {
        replacements,
        type: QueryTypes.UPDATE,
      }
    );

    console.log(
      `[BULK UPDATE] UTDs: [${selectedUTDs.join(", ")}]` +
      ` | Loc_Code: ${locArr.join(", ")}` +
      ` | Records: ${totalRecords}` +
      ` | ExecName: ${execName || "NULL"}` +
      ` | EmpCode : ${empCode || "NULL"}` +
      ` | Mobile  : ${execMobile || "NULL"}`
    );

    // ════════════════════════════════════════════════════════
    // RESPONSE
    // ════════════════════════════════════════════════════════
    return res.status(200).send({
      success: true,
      message: `${totalRecords} record updated successfully`,
      updatedCount: totalRecords,
      updatedUTDs: selectedUTDs,
      Loc_Code: locArr,
      serviceExecutive: {
        srv_exec_name: execName || null,
        srv_exec_Emp_Code: empCode || null,
        srv_exec_mobile: execMobile || null,
      },
    });

  } catch (error) {
    console.error("Bulk Update Service Executive Error:", error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  } finally {
    if (sequelize) {
      await sequelize.close();
    }
  }
};


// ============================================================
// 1. CREATE SERVICE RULE
// ============================================================
exports.createServiceRule = async function (req, res) {
  let sequelize;

  try {
    sequelize = await dbname(req, req.headers.compcode);

    const body = req.body || {};

    // ── Validation ──────────────────────────────────────────
    const intervalKM = toIntegerOrNull(body.Service_Interval_KM);
    const intervalDays = toIntegerOrNull(body.Service_Interval_Days);

    if (intervalKM === null && intervalDays === null) {
      return res.status(400).json({
        success: false,
        message: "Service_Interval_KM or Service_Interval_Days is required",
      });
    }

    if (intervalKM !== null && intervalKM <= 0) {
      return res.status(400).json({
        success: false,
        message: "Service_Interval_KM must be greater than 0",
      });
    }

    if (intervalDays !== null && intervalDays <= 0) {
      return res.status(400).json({
        success: false,
        message: "Service_Interval_Days must be greater than 0",
      });
    }

    // ── Rule Type (Always WHICHEVER_FIRST) ───────────────────
    const ruleType = DEFAULT_RULE_TYPE;

    // ── Normalize ────────────────────────────────────────────
    const locCode = body.Loc_Code?.toString().trim() || null;

    // ── Duplicate Check ──────────────────────────────────────
    const existing = await sequelize.query(
      `SELECT TOP 1 UTD, Loc_Code
       FROM Srv_Model_Service_Rule_Tbl
       WHERE
         ISNULL(Loc_Code, '') = ISNULL(:Loc_Code, '')
         AND status            = :Active_Status`,
      {
        replacements: {
          Loc_Code: locCode,
          Active_Status: ACTIVE_STATUS,
        },
        type: QueryTypes.SELECT,
      }
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Active service rule already exists for this location",
        data: { UTD: existing[0].UTD },
      });
    }

    // ── Reminder Fields ──────────────────────────────────────
    const reminderBefore1 = toIntegerOrNull(body.Reminder_Before_Days_1);
    const reminderBefore2 = toIntegerOrNull(body.Reminder_Before_Days_2);
    const reminderOnDue = body.Reminder_On_Due_Date != null
      ? Number(body.Reminder_On_Due_Date)
      : 1;
    const overdueReminder = toIntegerOrNull(body.Overdue_Reminder_Days);

    // ── INSERT ───────────────────────────────────────────────
    const result = await sequelize.query(
      `INSERT INTO Srv_Model_Service_Rule_Tbl
      (
        Loc_Code,
        Service_Interval_KM,
        Service_Interval_Days,
        Rule_Type,
        Reminder_Before_Days_1,
        Reminder_Before_Days_2,
        Reminder_On_Due_Date,
        Overdue_Reminder_Days,
        status,
        Created_By,
        Created_At
      )
      OUTPUT INSERTED.UTD
      VALUES
      (
        :Loc_Code,
        :Service_Interval_KM,
        :Service_Interval_Days,
        :Rule_Type,
        :Reminder_Before_Days_1,
        :Reminder_Before_Days_2,
        :Reminder_On_Due_Date,
        :Overdue_Reminder_Days,
        :status,
        :Created_By,
        GETDATE()
      )`,
      {
        replacements: {
          Loc_Code: locCode,
          Service_Interval_KM: intervalKM,
          Service_Interval_Days: intervalDays,
          Rule_Type: ruleType,
          Reminder_Before_Days_1: reminderBefore1,
          Reminder_Before_Days_2: reminderBefore2,
          Reminder_On_Due_Date: reminderOnDue,
          Overdue_Reminder_Days: overdueReminder,
          status: Number(body.status ?? ACTIVE_STATUS),
          Created_By: getLoginUserId(req, body),
        },
        type: QueryTypes.SELECT, // MSSQL OUTPUT INSERTED ke saath SELECT chahiye
      }
    );

    const newUTD = result?.[0]?.UTD ?? null;

    return res.status(201).json({
      success: true,
      message: "Service rule created successfully",
      data: { UTD: newUTD },
    });

  } catch (error) {
    console.error("Create Service Rule Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  } finally {
    if (sequelize) await sequelize.close();
  }
};

// ============================================================
// 2. GET ALL SERVICE RULES
// ============================================================
exports.getAllServiceRules = async function (req, res) {
  let sequelize;

  try {
    sequelize = await dbname(req, req.headers.compcode);

    const {
      page = 1,
      pageSize = 10,
      search,
      Loc_Code,
      status,
    } = req.body || {};

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(pageSize, 10) || 10, 1), 500);
    const offset = (pageNum - 1) * limit;

    // ── Build WHERE ──────────────────────────────────────────
    let whereConditions = ` WHERE 1 = 1 `;
    const replacements = {};

    if (Loc_Code) {
      whereConditions += ` AND ISNULL(r.Loc_Code, '') = :Loc_Code `;
      replacements.Loc_Code = String(Loc_Code).trim();
    }

    if (status !== undefined && status !== null && status !== "") {
      whereConditions += ` AND r.status = :status `;
      replacements.status = Number(status);
    }

    if (search?.toString().trim()) {
      whereConditions += `
        AND (
          r.Rule_Type LIKE :search
          OR r.Loc_Code LIKE :search
        )
      `;
      replacements.search = `%${String(search).trim()}%`;
    }

    // ── Count ────────────────────────────────────────────────
    const countResult = await sequelize.query(
      `SELECT COUNT(*) AS total
       FROM Srv_Model_Service_Rule_Tbl r
       ${whereConditions}`,
      { replacements, type: QueryTypes.SELECT }
    );

    const totalRecords = Number(countResult[0]?.total || 0);
    const totalPages = totalRecords === 0
      ? 0
      : Math.ceil(totalRecords / limit);

    // ── Data ─────────────────────────────────────────────────
    const data = await sequelize.query(
      `SELECT
        r.UTD,
        r.Loc_Code,
        r.Service_Interval_KM,
        r.Service_Interval_Days,
        r.Rule_Type,
        r.Reminder_Before_Days_1,
        r.Reminder_Before_Days_2,
        r.Reminder_On_Due_Date,
        r.Overdue_Reminder_Days,
        r.status,
        r.Created_By,
        CONVERT(VARCHAR(19), r.Created_At, 120) AS Created_At,
        r.Updated_By,
        CONVERT(VARCHAR(19), r.Updated_At, 120) AS Updated_At
       FROM Srv_Model_Service_Rule_Tbl r
       ${whereConditions}
       ORDER BY r.UTD DESC
       OFFSET :offset ROWS
       FETCH NEXT :limit ROWS ONLY`,
      {
        replacements: { ...replacements, offset, limit },
        type: QueryTypes.SELECT,
      }
    );

    return res.status(200).json({
      success: true,
      data,
      pagination: {
        currentPage: pageNum,
        pageSize: limit,
        totalRecords,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });

  } catch (error) {
    console.error("Get Service Rules Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  } finally {
    if (sequelize) await sequelize.close();
  }
};

// ============================================================
// 3. GET ONE SERVICE RULE
// ============================================================
exports.getOneServiceRule = async function (req, res) {
  let sequelize;

  try {
    sequelize = await dbname(req, req.headers.compcode);

    const UTD = toIntegerOrNull(req.body?.UTD || req.params?.UTD);

    if (!UTD) {
      return res.status(400).json({
        success: false,
        message: "UTD is required",
      });
    }

    const result = await sequelize.query(
      `SELECT
        UTD,
        Loc_Code,
        Service_Interval_KM,
        Service_Interval_Days,
        Rule_Type,
        Reminder_Before_Days_1,
        Reminder_Before_Days_2,
        Reminder_On_Due_Date,
        Overdue_Reminder_Days,
        status,
        Created_By,
        CONVERT(VARCHAR(19), Created_At, 120) AS Created_At,
        Updated_By,
        CONVERT(VARCHAR(19), Updated_At, 120) AS Updated_At
       FROM Srv_Model_Service_Rule_Tbl
       WHERE UTD = :UTD`,
      {
        replacements: { UTD },
        type: QueryTypes.SELECT,
      }
    );

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Service rule not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: result[0],
    });

  } catch (error) {
    console.error("Get One Service Rule Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  } finally {
    if (sequelize) await sequelize.close();
  }
};

// ============================================================
// 4. UPDATE SERVICE RULE
// ============================================================
exports.updateServiceRule = async function (req, res) {
  let sequelize;

  try {
    sequelize = await dbname(req, req.headers.compcode);

    const body = req.body || {};
    const UTD = toIntegerOrNull(body.UTD);

    if (!UTD) {
      return res.status(400).json({
        success: false,
        message: "UTD is required",
      });
    }

    // ── Check exists ─────────────────────────────────────────
    const existing = await sequelize.query(
      `SELECT TOP 1 UTD FROM Srv_Model_Service_Rule_Tbl WHERE UTD = :UTD`,
      { replacements: { UTD }, type: QueryTypes.SELECT }
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Service rule not found",
      });
    }

    // ── Build SET ────────────────────────────────────────────
    const setClauses = [];
    const replacements = { UTD };

    const addField = (col, val) => {
      setClauses.push(`${col} = :${col}`);
      replacements[col] = val;
    };

    if (body.Model_Name !== undefined) {
      addField("Model_Name", normalizeModelName(body.Model_Name));
    }
    if (body.Loc_Code !== undefined) {
      addField("Loc_Code", body.Loc_Code?.toString().trim() || null);
    }
    if (body.Service_Interval_KM !== undefined) {
      addField("Service_Interval_KM", toIntegerOrNull(body.Service_Interval_KM));
    }
    if (body.Service_Interval_Days !== undefined) {
      addField("Service_Interval_Days", toIntegerOrNull(body.Service_Interval_Days));
    }
    if (body.Rule_Type !== undefined) {
      const rt = String(body.Rule_Type).trim().toUpperCase();
      if (!VALID_RULE_TYPES.has(rt)) {
        return res.status(400).json({
          success: false,
          message: "Rule_Type must be WHICHEVER_FIRST, KM_ONLY or DAYS_ONLY",
        });
      }
      addField("Rule_Type", rt);
    }
    if (body.Reminder_Before_Days_1 !== undefined) {
      addField("Reminder_Before_Days_1", toIntegerOrNull(body.Reminder_Before_Days_1));
    }
    if (body.Reminder_Before_Days_2 !== undefined) {
      addField("Reminder_Before_Days_2", toIntegerOrNull(body.Reminder_Before_Days_2));
    }
    if (body.Reminder_On_Due_Date !== undefined) {
      addField("Reminder_On_Due_Date", Number(body.Reminder_On_Due_Date));
    }
    if (body.Overdue_Reminder_Days !== undefined) {
      addField("Overdue_Reminder_Days", toIntegerOrNull(body.Overdue_Reminder_Days));
    }
    if (body.status !== undefined) {
      addField("status", Number(body.status));
    }

    if (setClauses.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    // Always update audit fields
    setClauses.push(`Updated_By = :Updated_By`);
    setClauses.push(`Updated_At = GETDATE()`);
    replacements.Updated_By = getLoginUserId(req, body);

    await sequelize.query(
      `UPDATE Srv_Model_Service_Rule_Tbl
       SET ${setClauses.join(", ")}
       WHERE UTD = :UTD`,
      { replacements, type: QueryTypes.UPDATE }
    );

    return res.status(200).json({
      success: true,
      message: "Service rule updated successfully",
      data: { UTD },
    });

  } catch (error) {
    console.error("Update Service Rule Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  } finally {
    if (sequelize) await sequelize.close();
  }
};

// const ACTIVE_STATUS = 0;


// ============================================================
// HELPER: Calculate reminder data (customer + rule se)
// ============================================================










exports.generateReminder = async function (req, res) {
  let sequelize;
  let transaction;

  // ============================================================
  // HELPER: SQL NULL-safe date expression
  // ============================================================
  const nullableDateExpression = (colName) => `
    CASE
      WHEN :${colName} IS NULL THEN NULL
      ELSE CONVERT(date, :${colName}, 23)
    END
  `;

  // ============================================================
  // HELPER: Calculate reminder dates
  // ============================================================
  const calculateReminderData = ({ customer, rule }) => {
    const lastServiceDateRaw = customer.Last_Service_Date
      ? String(customer.Last_Service_Date).trim()
      : null;

    const lastServiceKM = Number(customer.Last_Service_KM);
    const lastServiceKMValid = Number.isFinite(lastServiceKM) ? lastServiceKM : null;

    const avgDailyKM = Number(customer.Avg_Daily_KM);
    const avgDailyKMValid = Number.isFinite(avgDailyKM) && avgDailyKM > 0 ? avgDailyKM : null;

    const custIntervalKM = Number(customer.Service_Interval_KM);
    const custIntervalDays = Number(customer.Service_Interval_Days);
    const ruleIntervalKM = rule ? Number(rule.Service_Interval_KM) : NaN;
    const ruleIntervalDays = rule ? Number(rule.Service_Interval_Days) : NaN;

    // ✅ Customer ka interval priority pe hai, agar invalid/missing hai to rule se lo
    const intervalKM =
      Number.isFinite(custIntervalKM) && custIntervalKM > 0
        ? custIntervalKM
        : Number.isFinite(ruleIntervalKM) && ruleIntervalKM > 0
          ? ruleIntervalKM
          : 0;

    const intervalDays =
      Number.isFinite(custIntervalDays) && custIntervalDays > 0
        ? custIntervalDays
        : Number.isFinite(ruleIntervalDays) && ruleIntervalDays > 0
          ? ruleIntervalDays
          : 0;

    const lastServiceDate = lastServiceDateRaw
      ? new Date(lastServiceDateRaw + "T00:00:00")
      : null;

    const nextServiceKM =
      lastServiceKMValid !== null && intervalKM > 0
        ? lastServiceKMValid + intervalKM
        : null;

    let dateBasedDueDate = null;
    if (lastServiceDate && intervalDays > 0) {
      const d = new Date(lastServiceDate);
      d.setUTCDate(d.getUTCDate() + intervalDays);
      const y = d.getUTCFullYear();
      const m = String(d.getUTCMonth() + 1).padStart(2, "0");
      const day = String(d.getUTCDate()).padStart(2, "0");
      dateBasedDueDate = `${y}-${m}-${day}`;
    }

    let kmBasedDueDate = null;
    if (lastServiceDate && intervalKM > 0 && avgDailyKMValid) {
      const daysNeeded = intervalKM / avgDailyKMValid;
      const d = new Date(lastServiceDate);
      d.setUTCDate(d.getUTCDate() + Math.ceil(daysNeeded));
      const y = d.getUTCFullYear();
      const m = String(d.getUTCMonth() + 1).padStart(2, "0");
      const day = String(d.getUTCDate()).padStart(2, "0");
      kmBasedDueDate = `${y}-${m}-${day}`;
    }

    const ruleType = String(rule?.Rule_Type || "").trim().toUpperCase();
    let finalDueDate = null;

    if (ruleType === "WHICHEVER_FIRST" || ruleType === "") {
      const d1 = dateBasedDueDate ? new Date(dateBasedDueDate + "T00:00:00") : null;
      const d2 = kmBasedDueDate ? new Date(kmBasedDueDate + "T00:00:00") : null;
      if (d1 && d2) finalDueDate = d1 <= d2 ? dateBasedDueDate : kmBasedDueDate;
      else if (d1) finalDueDate = dateBasedDueDate;
      else if (d2) finalDueDate = kmBasedDueDate;
    } else if (ruleType === "KM_BASED") {
      finalDueDate = kmBasedDueDate || dateBasedDueDate;
    } else if (ruleType === "DATE_BASED" || ruleType === "DAY_BASED") {
      finalDueDate = dateBasedDueDate || kmBasedDueDate;
    } else {
      const d1 = dateBasedDueDate ? new Date(dateBasedDueDate + "T00:00:00") : null;
      const d2 = kmBasedDueDate ? new Date(kmBasedDueDate + "T00:00:00") : null;
      if (d1 && d2) finalDueDate = d1 <= d2 ? dateBasedDueDate : kmBasedDueDate;
      else finalDueDate = dateBasedDueDate || kmBasedDueDate;
    }

    return {
      lastServiceDate: lastServiceDateRaw,
      lastServiceKM: lastServiceKMValid ?? null,
      currentKM: Number(customer.Current_KM) || 0,
      avgDailyKM: avgDailyKMValid ?? null,
      intervalKM,
      intervalDays,
      nextServiceKM,
      dateBasedDueDate,
      kmBasedDueDate,
      finalDueDate,
    };
  };

  // ============================================================
  // ✅ HELPER: Sabhi stages banao — sorted by date ASC
  // ============================================================
  const buildAllReminderStages = (rule, finalDueDateStr) => {
    const items = [];
    if (!finalDueDateStr || !rule) return items;

    const dueDate = new Date(finalDueDateStr + "T00:00:00");

    const addDays = (days) => {
      const d = new Date(dueDate);
      d.setUTCDate(d.getUTCDate() + days);
      return d.toISOString().split("T")[0];
    };

    const reminderBefore1 = Number(rule.Reminder_Before_Days_1) || 0;
    const reminderBefore2 = Number(rule.Reminder_Before_Days_2) || 0;
    const reminderOnDue = Number(rule.Reminder_On_Due_Date);
    const overdueDays = Number(rule.Overdue_Reminder_Days) || 0;

    if (reminderBefore1 > 0) {
      items.push({
        type: `${reminderBefore1}_DAYS_BEFORE`,
        date: addDays(-reminderBefore1),
        order: 1,
      });
    }

    if (reminderBefore2 > 0) {
      items.push({
        type: `${reminderBefore2}_DAYS_BEFORE`,
        date: addDays(-reminderBefore2),
        order: 2,
      });
    }

    if (reminderOnDue === 1 || reminderOnDue === true || reminderOnDue === "1") {
      items.push({
        type: "DUE_TODAY",
        date: finalDueDateStr,
        order: 3,
      });
    }

    if (overdueDays > 0) {
      items.push({
        type: `OVERDUE_${overdueDays}_DAYS`,
        date: addDays(overdueDays),
        order: 4,
      });
    }

    // Deduplicate by type
    const seen = new Map();
    const uniqueItems = [];
    for (const item of items) {
      if (item.type && item.date && !seen.has(item.type)) {
        seen.set(item.type, true);
        uniqueItems.push(item);
      }
    }

    // ✅ Date ke hisab se sort karo — sabse pehle wala reminder upar aayega
    uniqueItems.sort((a, b) => {
      const da = new Date(a.date + "T00:00:00");
      const db = new Date(b.date + "T00:00:00");
      return da - db; // ASC — nearest date first
    });

    return uniqueItems;
  };

  // ============================================================
  // ✅ HELPER: Sirf PEHLA (nearest future/today) reminder select karo
  // ============================================================
  const pickNextReminderStage = (allStages, alreadyInsertedTypes) => {
    const insertedSet = new Set(
      (alreadyInsertedTypes || []).map((t) => String(t).trim().toUpperCase())
    );

    for (const stage of allStages) {
      const key = String(stage.type).trim().toUpperCase();
      if (!insertedSet.has(key)) {
        return stage;
      }
    }

    return null;
  };

  try {
    sequelize = await dbname(req, req.headers.compcode);

    const body = req.body || {};
    const customerVehicleUTD = Number(body.Cust_Vehi_UTD);

    // ============================================================
    // REQUEST VALIDATION
    // ============================================================
    if (
      !customerVehicleUTD ||
      !Number.isInteger(customerVehicleUTD) ||
      customerVehicleUTD <= 0
    ) {
      return res.status(400).send({
        success: false,
        message: "Valid Cust_Vehi_UTD is required",
      });
    }

    const createdBy = getLoginUserId(req, body);
    const reminderChannel = String(body.Reminder_Channel || "AI_CALL")
      .trim()
      .toUpperCase();

    transaction = await sequelize.transaction();

    // ============================================================
    // STEP 1: ACTIVE CUSTOMER VEHICLE
    // ============================================================
    const customerResult = await sequelize.query(
      `SELECT TOP 1
         c.UTD,
         c.Loc_Code,
         c.Tran_id,
         m.Veh_Reg_No,
         c.Cust_Name,
         c.Cust_Mob,
         c.Model_Name,
         c.Last_Service_Date,
         c.Last_Service_KM,
         c.Avg_Daily_KM,
         c.Current_KM,
         c.Service_Interval_KM,
         c.Service_Interval_Days,
         c.Export_Type,
         c.status,
         c.Created_By,
         c.Created_At,
         c.Updated_By,
         c.Updated_At
       FROM dbo.Srv_Cust_Vehi_Tbl c
       INNER JOIN dbo.Srv_Mst_Vehi_Tbl m
         ON m.UTD = c.Tran_id
       WHERE c.UTD            = :Cust_Vehi_UTD
         AND c.Export_Type    = :Active_Export_Type
         AND (m.Export_Type   = :Active_Export_Type OR m.Export_Type IS NULL)
       ORDER BY c.UTD DESC`,
      {
        replacements: {
          Cust_Vehi_UTD: customerVehicleUTD,
          Active_Export_Type: ACTIVE_EXPORT_TYPE,
        },
        type: QueryTypes.SELECT,
        transaction,
      }
    );

    if (customerResult.length === 0) {
      await safeRollback(transaction);
      return res.status(404).send({
        success: false,
        message:
          "Active customer vehicle record not found. The supplied record may be old, superseded or not mapped with vehicle master.",
      });
    }

    const customer = customerResult[0];

    if (!customer.Tran_id) {
      await safeRollback(transaction);
      return res.status(400).send({
        success: false,
        message: "Vehicle master mapping is missing. Tran_id is not available.",
      });
    }

    if (!customer.Veh_Reg_No) {
      await safeRollback(transaction);
      return res.status(400).send({
        success: false,
        message: "Vehicle Registration Number is missing in vehicle master.",
      });
    }

    if (!customer.Model_Name) {
      await safeRollback(transaction);
      return res.status(400).send({
        success: false,
        message: "Model_Name is missing in active customer vehicle record.",
      });
    }

    // ============================================================
    // ✅ STEP 1.5: CUSTOMER TABLE ME INTERVAL CHECK KARO
    // Agar Service_Interval_KM aur Service_Interval_Days
    // DONO customer record me nahi mile / invalid hain
    // TABHI rule table check karna hai
    // ============================================================
    const custIntervalKMNum = Number(customer.Service_Interval_KM);
    const custIntervalDaysNum = Number(customer.Service_Interval_Days);

    const custHasValidKM = Number.isFinite(custIntervalKMNum) && custIntervalKMNum > 0;
    const custHasValidDays = Number.isFinite(custIntervalDaysNum) && custIntervalDaysNum > 0;

    // ✅ Dono nahi mile — tabhi rule table jaana zaroori hai
    const customerIntervalMissing = !custHasValidKM && !custHasValidDays;

    console.log(
      `[REMINDER] Customer Interval Check → KM: ${custHasValidKM} | Days: ${custHasValidDays} | Rule Table Check Needed: ${customerIntervalMissing}`
    );

    // ============================================================
    // STEP 2: SERVICE RULE — ✅ SIRF LOCATION WISE (Model_Name filter NAHI)
    // ============================================================
    const ruleResult = await sequelize.query(
      `SELECT TOP 1
         UTD,
         Loc_Code,
         Model_Name,
         Service_Interval_KM,
         Service_Interval_Days,
         Rule_Type,
         Reminder_Before_Days_1,
         Reminder_Before_Days_2,
         Reminder_On_Due_Date,
         Overdue_Reminder_Days,
         status,
         Created_By,
         Created_At,
         Updated_By,
         Updated_At
       FROM dbo.Srv_Model_Service_Rule_Tbl
       WHERE (Loc_Code = :Loc_Code OR Loc_Code IS NULL OR LTRIM(RTRIM(Loc_Code)) = '')
         AND status = :Active_Status
       ORDER BY
         CASE
           WHEN Loc_Code = :Loc_Code THEN 1
           WHEN Loc_Code IS NULL OR LTRIM(RTRIM(Loc_Code)) = '' THEN 2
           ELSE 3
         END,
         UTD DESC`,
      {
        replacements: {
          Loc_Code: customer.Loc_Code,
          Active_Status: ACTIVE_STATUS,
        },
        type: QueryTypes.SELECT,
        transaction,
      }
    );

    let rule = ruleResult.length > 0 ? ruleResult[0] : null;

    // ============================================================
    // ✅ STEP 2.5: RULE & INTERVAL VALIDATION
    // ============================================================

    // If no rule found in Srv_Model_Service_Rule_Tbl
    if (!rule) {
      if (!customerIntervalMissing) {
        // Customer vehicle has valid intervals -> create default fallback rule wrapper
        rule = {
          UTD: 0,
          Loc_Code: customer.Loc_Code,
          Model_Name: customer.Model_Name,
          Service_Interval_KM: custHasValidKM ? custIntervalKMNum : 0,
          Service_Interval_Days: custHasValidDays ? custIntervalDaysNum : 0,
          Rule_Type: "WHICHEVER_FIRST",
          Reminder_Before_Days_1: 7,
          Reminder_Before_Days_2: 3,
          Reminder_On_Due_Date: 1,
          Overdue_Reminder_Days: 3,
          status: ACTIVE_STATUS,
        };
        console.log(
          `[REMINDER] Customer vehicle has intervals (KM: ${custIntervalKMNum}, Days: ${custIntervalDaysNum}) -> Created default rule object`
        );
      } else {
        await safeRollback(transaction);
        return res.status(404).send({
          success: false,
          message: `Service interval not found in customer vehicle record (Srv_Cust_Vehi_Tbl) nor in service rules (Srv_Model_Service_Rule_Tbl) for location: ${customer.Loc_Code}`,
          data: {
            Loc_Code: customer.Loc_Code,
            customer: {
              Service_Interval_KM: customer.Service_Interval_KM,
              Service_Interval_Days: customer.Service_Interval_Days,
            },
          },
        });
      }
    }

    // Case B: Rule mila, lekin customer interval bhi missing tha AND rule me bhi interval invalid hai
    if (customerIntervalMissing) {
      const ruleIntervalKMNum = Number(rule.Service_Interval_KM);
      const ruleIntervalDaysNum = Number(rule.Service_Interval_Days);

      const ruleHasValidKM = Number.isFinite(ruleIntervalKMNum) && ruleIntervalKMNum > 0;
      const ruleHasValidDays = Number.isFinite(ruleIntervalDaysNum) && ruleIntervalDaysNum > 0;

      if (!ruleHasValidKM && !ruleHasValidDays) {
        await safeRollback(transaction);
        return res.status(400).send({
          success: false,
          message:
            "Service interval (KM/Days) not found in customer record nor in location-based reminder rule.",
          data: {
            Loc_Code: customer.Loc_Code,
            rule: {
              UTD: rule.UTD,
              Service_Interval_KM: rule.Service_Interval_KM,
              Service_Interval_Days: rule.Service_Interval_Days,
            },
          },
        });
      }

      console.log(
        `[REMINDER] Customer interval missing → Using location rule's interval | UTD: ${rule.UTD}`
      );
    } else {
      console.log(
        `[REMINDER] Customer has own interval → Rule sirf reminder-day config ke liye use hoga | Rule UTD: ${rule.UTD}`
      );
    }

    // ============================================================
    // STEP 3: CALCULATE
    // ============================================================
    const calculated = calculateReminderData({ customer, rule });

    if (!calculated || !calculated.finalDueDate) {
      await safeRollback(transaction);
      return res.status(400).send({
        success: false,
        message:
          "Final due date could not be calculated. Check service rule and customer data.",
        data: {
          customer: {
            UTD: customer.UTD,
            Tran_id: customer.Tran_id,
            Veh_Reg_No: customer.Veh_Reg_No,
            Model_Name: customer.Model_Name,
            Last_Service_Date: customer.Last_Service_Date,
            Last_Service_KM: customer.Last_Service_KM,
            Current_KM: customer.Current_KM,
            Avg_Daily_KM: customer.Avg_Daily_KM,
            Service_Interval_KM: customer.Service_Interval_KM,
            Service_Interval_Days: customer.Service_Interval_Days,
          },
          rule: {
            UTD: rule.UTD,
            Loc_Code: rule.Loc_Code,
            Rule_Type: rule.Rule_Type,
            Service_Interval_KM: rule.Service_Interval_KM,
            Service_Interval_Days: rule.Service_Interval_Days,
          },
          calculation: calculated,
        },
      });
    }

    // ============================================================
    // STEP 4: SABHI STAGES BANAO (sorted by date ASC)
    // ============================================================
    const allStages = buildAllReminderStages(rule, calculated.finalDueDate);

    if (allStages.length === 0) {
      await safeRollback(transaction);
      return res.status(400).send({
        success: false,
        message: "No valid reminder stages configured in the location-based service rule.",
        data: {
          rule: {
            UTD: rule.UTD,
            Loc_Code: rule.Loc_Code,
            Reminder_Before_Days_1: rule.Reminder_Before_Days_1,
            Reminder_Before_Days_2: rule.Reminder_Before_Days_2,
            Reminder_On_Due_Date: rule.Reminder_On_Due_Date,
            Overdue_Reminder_Days: rule.Overdue_Reminder_Days,
          },
          finalDueDate: calculated.finalDueDate,
        },
      });
    }

    // ============================================================
    // STEP 5: ✅ ALREADY INSERTED TYPES CHECK
    // ============================================================
    const existingRemindersResult = await sequelize.query(
      `SELECT DISTINCT Reminder_Type
       FROM dbo.Srv_Reminder_Tbl
       WHERE Cust_Vehi_UTD    = :Cust_Vehi_UTD
         AND Service_Rule_UTD = :Service_Rule_UTD
         AND Final_Due_Date   = CONVERT(date, :Final_Due_Date, 23)`,
      {
        replacements: {
          Cust_Vehi_UTD: customerVehicleUTD,
          Service_Rule_UTD: rule.UTD,
          Final_Due_Date: calculated.finalDueDate,
        },
        type: QueryTypes.SELECT,
        transaction,
      }
    );

    const alreadyInsertedTypes = existingRemindersResult.map(
      (r) => r.Reminder_Type
    );

    // ============================================================
    // STEP 6: ✅ SIRF PEHLA (NEAREST) NEXT REMINDER PICK KARO
    // ============================================================
    const nextStage = pickNextReminderStage(allStages, alreadyInsertedTypes);

    if (!nextStage) {
      await safeRollback(transaction);
      return res.status(200).send({
        success: true,
        message: "All reminder stages already exist for this vehicle.",
        data: {
          customer: {
            UTD: customer.UTD,
            Veh_Reg_No: customer.Veh_Reg_No,
            Cust_Name: customer.Cust_Name,
            Model_Name: customer.Model_Name,
          },
          rule: {
            UTD: rule.UTD,
            Loc_Code: rule.Loc_Code,
            Rule_Type: rule.Rule_Type,
          },
          calculation: calculated,
          allStages,
          alreadyInsertedTypes,
          summary: {
            totalStages: allStages.length,
            inserted: 0,
            skipped: allStages.length,
          },
          insertedReminders: [],
          skippedReminders: alreadyInsertedTypes.map((t) => ({
            Reminder_Type: t,
            reason: "ALREADY_EXISTS",
          })),
        },
      });
    }

    console.log(
      `[REMINDER] Inserting stage: ${nextStage.type} | Date: ${nextStage.date} | Veh: ${customer.Veh_Reg_No} | Loc: ${customer.Loc_Code}`
    );

    // ============================================================
    // STEP 7: ✅ SIRF EK REMINDER INSERT KARO
    // ============================================================
    const inserted = await sequelize.query(
      `INSERT INTO dbo.Srv_Reminder_Tbl
      (
        Cust_Vehi_UTD,
        Service_Rule_UTD,
        Loc_Code,
        Last_Service_Date,
        Last_Service_KM,
        Current_KM,
        Avg_Daily_KM,
        Next_Service_KM,
        Date_Based_Due_Date,
        KM_Based_Due_Date,
        Final_Due_Date,
        Reminder_Date,
        Reminder_Type,
        Reminder_Channel,
        Reminder_Status,
        Reminder_Count,
        Service_Status,
        status,
        Created_By,
        Created_At
      )
      OUTPUT
        INSERTED.UTD,
        INSERTED.Cust_Vehi_UTD,
        INSERTED.Service_Rule_UTD,
        INSERTED.Reminder_Date,
        INSERTED.Reminder_Type,
        INSERTED.Reminder_Status
      SELECT
        :Cust_Vehi_UTD,
        :Service_Rule_UTD,
        :Loc_Code,
        ${nullableDateExpression("Last_Service_Date")},
        :Last_Service_KM,
        :Current_KM,
        :Avg_Daily_KM,
        :Next_Service_KM,
        ${nullableDateExpression("Date_Based_Due_Date")},
        ${nullableDateExpression("KM_Based_Due_Date")},
        ${nullableDateExpression("Final_Due_Date")},
        ${nullableDateExpression("Reminder_Date")},
        :Reminder_Type,
        :Reminder_Channel,
        :Reminder_Status,
        0,
        :Service_Status,
        :Status,
        :Created_By,
        GETDATE()
      WHERE NOT EXISTS
      (
        SELECT 1
        FROM dbo.Srv_Reminder_Tbl WITH (UPDLOCK, HOLDLOCK)
        WHERE Cust_Vehi_UTD    = :Cust_Vehi_UTD
          AND Service_Rule_UTD = :Service_Rule_UTD
          AND Final_Due_Date   = CONVERT(date, :Final_Due_Date, 23)
          AND Reminder_Type    = :Reminder_Type
      )`,
      {
        replacements: {
          Cust_Vehi_UTD: customerVehicleUTD,
          Service_Rule_UTD: (rule?.UTD && Number(rule.UTD) > 0) ? Number(rule.UTD) : null,
          Loc_Code: customer.Loc_Code,
          Last_Service_Date: calculated.lastServiceDate || null,
          Last_Service_KM: calculated.lastServiceKM ?? null,
          Current_KM: calculated.currentKM ?? null,
          Avg_Daily_KM: calculated.avgDailyKM ?? null,
          Next_Service_KM: calculated.nextServiceKM ?? null,
          Date_Based_Due_Date: calculated.dateBasedDueDate || null,
          KM_Based_Due_Date: calculated.kmBasedDueDate || null,
          Final_Due_Date: calculated.finalDueDate,
          Reminder_Date: nextStage.date,
          Reminder_Type: nextStage.type,
          Reminder_Channel: reminderChannel,
          Reminder_Status: "PENDING",
          Service_Status: "PENDING",
          Status: ACTIVE_STATUS,
          Created_By: createdBy,
        },
        type: QueryTypes.SELECT,
        transaction,
      }
    );

    await transaction.commit();
    transaction = null;

    // ============================================================
    // STEP 8: RESPONSE
    // ============================================================
    const wasInserted = inserted.length > 0;

    return res.status(200).send({
      success: true,
      message: wasInserted
        ? `Reminder generated: ${nextStage.type} for ${nextStage.date}`
        : "Reminder already exists (concurrent insert prevented)",
      data: {
        customer: {
          UTD: customer.UTD,
          Loc_Code: customer.Loc_Code,
          Tran_id: customer.Tran_id,
          Veh_Reg_No: customer.Veh_Reg_No,
          Cust_Name: customer.Cust_Name,
          Cust_Mob: customer.Cust_Mob,
          Model_Name: customer.Model_Name,
          Export_Type: customer.Export_Type,
          Service_Interval_KM: customer.Service_Interval_KM,
          Service_Interval_Days: customer.Service_Interval_Days,
        },
        rule: {
          UTD: rule.UTD,
          Loc_Code: rule.Loc_Code,
          Service_Interval_KM: rule.Service_Interval_KM,
          Service_Interval_Days: rule.Service_Interval_Days,
          Rule_Type: rule.Rule_Type,
          Reminder_Before_Days_1: rule.Reminder_Before_Days_1,
          Reminder_Before_Days_2: rule.Reminder_Before_Days_2,
          Reminder_On_Due_Date: rule.Reminder_On_Due_Date,
          Overdue_Reminder_Days: rule.Overdue_Reminder_Days,
        },
        intervalSource: customerIntervalMissing
          ? "LOCATION_RULE"
          : "CUSTOMER_RECORD",
        calculation: calculated,
        allStages,
        alreadyInsertedTypes,
        summary: {
          totalStages: allStages.length,
          inserted: wasInserted ? 1 : 0,
          skipped: wasInserted ? 0 : 1,
          pending: allStages.length - alreadyInsertedTypes.length - (wasInserted ? 1 : 0),
        },
        insertedReminder: wasInserted
          ? {
            UTD: inserted[0].UTD,
            Cust_Vehi_UTD: inserted[0].Cust_Vehi_UTD,
            Service_Rule_UTD: inserted[0].Service_Rule_UTD,
            Reminder_Type: inserted[0].Reminder_Type,
            Reminder_Date: inserted[0].Reminder_Date,
            Reminder_Status: inserted[0].Reminder_Status,
          }
          : null,
      },
    });

  } catch (error) {
    await safeRollback(transaction);
    console.error("Generate Reminder Error:", error);
    return res.status(500).send({
      success: false,
      message: "An error occurred while generating service reminders.",
      error: error.message,
    });
  } finally {
    if (sequelize) {
      await sequelize.close();
    }
  }
};


// ============================================================
// HELPER: calcReminderData
// ============================================================
const calcReminderData = (customer, rule) => {
  const lastServiceDateRaw = customer.Last_Service_Date
    ? String(customer.Last_Service_Date).trim().split("T")[0]
    : null;

  const lastServiceKM = Number(customer.Last_Service_KM);
  const lastValidKM = Number.isFinite(lastServiceKM) ? lastServiceKM : null;

  const avgDailyKM = Number(customer.Avg_Daily_KM);
  const avgValid =
    Number.isFinite(avgDailyKM) && avgDailyKM > 0 ? avgDailyKM : null;

  const cKM = Number(customer.Service_Interval_KM) || 0;
  const cDays = Number(customer.Service_Interval_Days) || 0;
  const rKM = Number(rule?.Service_Interval_KM) || 0;
  const rDays = Number(rule?.Service_Interval_Days) || 0;

  const intervalKM = cKM > 0 ? cKM : rKM > 0 ? rKM : 0;
  const intervalDays = cDays > 0 ? cDays : rDays > 0 ? rDays : 0;

  const lastServiceDate = lastServiceDateRaw
    ? new Date(lastServiceDateRaw + "T00:00:00")
    : null;

  const nextServiceKM =
    lastValidKM !== null && intervalKM > 0
      ? lastValidKM + intervalKM
      : null;

  let dateBasedDueDate = null;
  if (lastServiceDate && intervalDays > 0) {
    const d = new Date(lastServiceDate);
    d.setUTCDate(d.getUTCDate() + intervalDays);
    dateBasedDueDate = d.toISOString().split("T")[0];
  }

  let kmBasedDueDate = null;
  if (lastServiceDate && intervalKM > 0 && avgValid) {
    const daysNeeded = Math.ceil(intervalKM / avgValid);
    const d = new Date(lastServiceDate);
    d.setUTCDate(d.getUTCDate() + daysNeeded);
    kmBasedDueDate = d.toISOString().split("T")[0];
  }

  const ruleType = String(rule?.Rule_Type || "WHICHEVER_FIRST").trim().toUpperCase();
  let finalDueDate = null;

  if (ruleType === "KM_BASED") {
    finalDueDate = kmBasedDueDate || dateBasedDueDate;
  } else if (ruleType === "DATE_BASED" || ruleType === "DAY_BASED") {
    finalDueDate = dateBasedDueDate || kmBasedDueDate;
  } else {
    const d1 = dateBasedDueDate ? new Date(dateBasedDueDate + "T00:00:00") : null;
    const d2 = kmBasedDueDate ? new Date(kmBasedDueDate + "T00:00:00") : null;
    if (d1 && d2) finalDueDate = d1 <= d2 ? dateBasedDueDate : kmBasedDueDate;
    else if (d1) finalDueDate = dateBasedDueDate;
    else if (d2) finalDueDate = kmBasedDueDate;
  }

  return {
    lastServiceDate: lastServiceDateRaw,
    lastServiceKM: lastValidKM ?? null,
    avgDailyKM: avgValid ?? null,
    intervalKM,
    intervalDays,
    nextServiceKM,
    dateBasedDueDate,
    kmBasedDueDate,
    finalDueDate,
    currentKM: Number(customer.Current_KM) || 0,
  };
};

// ============================================================
// HELPER: Reminder stages banao (sorted ASC by date)
// ============================================================
const buildReminderStages = (rule, finalDueDateStr) => {
  if (!finalDueDateStr) return [];

  const addDays = (days) => {
    const d = new Date(finalDueDateStr + "T00:00:00");
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().split("T")[0];
  };

  const rb1 = Number(rule?.Reminder_Before_Days_1) || 0;
  const rb2 = Number(rule?.Reminder_Before_Days_2) || 0;
  const onDue = Number(rule?.Reminder_On_Due_Date);
  const ovd = Number(rule?.Overdue_Reminder_Days) || 0;

  const items = [];
  if (rb1 > 0) items.push({ type: `${rb1}_DAYS_BEFORE`, date: addDays(-rb1) });
  if (rb2 > 0) items.push({ type: `${rb2}_DAYS_BEFORE`, date: addDays(-rb2) });
  if (onDue === 1 || onDue === "1")
    items.push({ type: "DUE_TODAY", date: finalDueDateStr });
  if (ovd > 0)
    items.push({ type: `OVERDUE_${ovd}_DAYS`, date: addDays(ovd) });

  const seen = new Set();
  const unique = [];
  for (const it of items) {
    if (it.type && it.date && !seen.has(it.type)) {
      seen.add(it.type);
      unique.push(it);
    }
  }
  unique.sort(
    (a, b) =>
      new Date(a.date + "T00:00:00") - new Date(b.date + "T00:00:00")
  );
  return unique;
};
// ============================================================
// HELPER: Insert single reminder
// ============================================================
const insertSingleReminder = async (sequelize, params, transaction) => {
  const {
    customer,
    rule,
    calculated,
    reminderDate,
    reminderType,
    reminderStatus = "PENDING",
    serviceStatus = "PENDING",
    reminderChannel = "AI_CALL",
    createdBy = "SYSTEM",
    isFollowup = false,
  } = params;

  if (
    !customer?.UTD ||
    rule?.UTD === undefined ||
    rule?.UTD === null ||
    !calculated?.finalDueDate
  ) {
    console.error("[INSERT] Missing required params:", {
      customerUTD: customer?.UTD,
      ruleUTD: rule?.UTD,
      finalDueDate: calculated?.finalDueDate,
      reminderType,
      reminderDate,
    });
    return [];
  }

  const nullDate = (col) => `
    CASE WHEN :${col} IS NULL THEN NULL
         ELSE CONVERT(date, :${col}, 23) END
  `;

  // ── KEY: Followup/ReminderDate override → date+vehicle check ──
  // Normal → Final_Due_Date + Reminder_Type unique
  const notExistsClause = isFollowup
    ? `WHERE NOT EXISTS (
         SELECT 1 FROM dbo.Srv_Reminder_Tbl WITH (UPDLOCK, HOLDLOCK)
         WHERE Cust_Vehi_UTD  = :Cust_Vehi_UTD
           AND CAST(Reminder_Date AS DATE) = CONVERT(date, :Reminder_Date, 23)
           AND Reminder_Status = 'PENDING'
           AND status          = 1
       )`
    : `WHERE NOT EXISTS (
         SELECT 1 FROM dbo.Srv_Reminder_Tbl WITH (UPDLOCK, HOLDLOCK)
         WHERE Cust_Vehi_UTD   = :Cust_Vehi_UTD
           AND Reminder_Status = 'PENDING'
           AND status          = 1
       )`;

  try {
    const result = await sequelize.query(
      `INSERT INTO dbo.Srv_Reminder_Tbl
       (
         Cust_Vehi_UTD, Service_Rule_UTD, Loc_Code,
         Last_Service_Date, Last_Service_KM, Current_KM,
         Avg_Daily_KM, Next_Service_KM,
         Date_Based_Due_Date, KM_Based_Due_Date, Final_Due_Date,
         Reminder_Date, Reminder_Type, Reminder_Channel,
         Reminder_Status, Reminder_Count, Service_Status,
         status, Created_By, Created_At
       )
       OUTPUT
         INSERTED.UTD,
         INSERTED.Cust_Vehi_UTD,
         INSERTED.Service_Rule_UTD,
         CONVERT(varchar(10), INSERTED.Reminder_Date, 23) AS Reminder_Date,
         INSERTED.Reminder_Type,
         INSERTED.Reminder_Status
       SELECT
         :Cust_Vehi_UTD, :Service_Rule_UTD, :Loc_Code,
         ${nullDate("Last_Service_Date")},
         :Last_Service_KM, :Current_KM,
         :Avg_Daily_KM, :Next_Service_KM,
         ${nullDate("Date_Based_Due_Date")},
         ${nullDate("KM_Based_Due_Date")},
         ${nullDate("Final_Due_Date")},
         ${nullDate("Reminder_Date")},
         :Reminder_Type, :Reminder_Channel,
         :Reminder_Status, 0, :Service_Status,
         1, :Created_By, GETDATE()
       ${notExistsClause}`,
      {
        replacements: {
          Cust_Vehi_UTD: customer.UTD,
          Service_Rule_UTD: (rule?.UTD && Number(rule.UTD) > 0) ? Number(rule.UTD) : null,
          Loc_Code: customer.Loc_Code,
          Last_Service_Date: calculated.lastServiceDate || null,
          Last_Service_KM: calculated.lastServiceKM ?? null,
          Current_KM: calculated.currentKM ?? null,
          Avg_Daily_KM: calculated.avgDailyKM ?? null,
          Next_Service_KM: calculated.nextServiceKM ?? null,
          Date_Based_Due_Date: calculated.dateBasedDueDate || null,
          KM_Based_Due_Date: calculated.kmBasedDueDate || null,
          Final_Due_Date: calculated.finalDueDate,
          Reminder_Date: reminderDate || null,
          Reminder_Type: reminderType,
          Reminder_Channel: reminderChannel,
          Reminder_Status: reminderStatus,
          Service_Status: serviceStatus,
          Created_By: createdBy,
        },
        type: QueryTypes.SELECT,
        transaction,
      }
    );

    console.log(
      `[INSERT] ${reminderType} | CustUTD:${customer.UTD} | Date:${reminderDate} | Inserted:${result?.length}`
    );
    return result || [];
  } catch (err) {
    console.error("[INSERT] Error:", err.message);
    throw err;
  }
};


let isAutoGenRunning = false;

const autoGenerateRemindersForAll = async (sequelize, createdBy = "SYSTEM") => {
  if (isAutoGenRunning) {
    console.log("[AUTO-GEN] Auto-generation already in progress — skipping duplicate concurrent call");
    return { totalCustomers: 0, totalInserted: 0, totalSkipped: 0, totalFailed: 0, failedCustomers: [] };
  }

  isAutoGenRunning = true;
  const result = {
    totalCustomers: 0,
    processed: 0,
    totalInserted: 0,
    totalSkipped: 0,
    totalFailed: 0,
    failedCustomers: [],
  };

  try {
    // ══════════════════════════════════════════════════════════
    // ✅ STEP 1: SIRF ACTIVE VEHICLES (Export_Type = 1)
    // ══════════════════════════════════════════════════════════
    const customers = await sequelize.query(
      `SELECT
         c.UTD, c.Loc_Code, c.Tran_id,
         c.Cust_Name, c.Cust_Mob, c.Model_Name,
         CONVERT(varchar(10), c.Last_Service_Date, 23) AS Last_Service_Date,
         c.Last_Service_KM, c.Avg_Daily_KM, c.Current_KM,
         c.Service_Interval_KM, c.Service_Interval_Days,
         m.Veh_Reg_No
       FROM dbo.Srv_Cust_Vehi_Tbl c
       LEFT JOIN dbo.Srv_Mst_Vehi_Tbl m ON m.UTD = c.Tran_id
       WHERE (c.Export_Type IS NULL OR c.Export_Type = 1 OR c.Export_Type <> 33)
         AND c.Last_Service_Date IS NOT NULL
         AND NOT EXISTS (
           SELECT 1 FROM dbo.Srv_Reminder_Tbl r
           WHERE r.Cust_Vehi_UTD   = c.UTD
             AND r.Reminder_Status = 'PENDING'
             AND r.status          = 1
         )
       ORDER BY c.UTD ASC`,
      { type: QueryTypes.SELECT }
    );

    result.totalCustomers = customers.length;
    console.log(`[AUTO-GEN] Eligible (Export_Type=1) customers: ${customers.length}`);
    if (customers.length === 0) return result;

    // ══════════════════════════════════════════════════════════
    // STEP 2: LOCATION-WISE RULES FETCH KARO (Optional fallback)
    // ══════════════════════════════════════════════════════════
    let allRules = [];
    try {
      allRules = await sequelize.query(
        `SELECT UTD, Loc_Code, Model_Name,
           Service_Interval_KM, Service_Interval_Days,
           Rule_Type, Reminder_Before_Days_1, Reminder_Before_Days_2,
           Reminder_On_Due_Date, Overdue_Reminder_Days, status
         FROM dbo.Srv_Model_Service_Rule_Tbl
         WHERE status = ${ACTIVE_STATUS}
         ORDER BY
           CASE WHEN Loc_Code IS NOT NULL AND LTRIM(RTRIM(Loc_Code)) <> '' THEN 1 ELSE 2 END ASC,
           UTD DESC`,
        { type: QueryTypes.SELECT }
      );
    } catch (_) {}

    console.log(`[AUTO-GEN] Rules found in DB: ${allRules.length}`);

    // ── Location-wise rule map banao ─────────────────────────
    const ruleByLoc = new Map();
    let globalRule = null;

    for (const rule of allRules || []) {
      const lKey = String(rule.Loc_Code || "").trim().toUpperCase();
      if (lKey) {
        if (!ruleByLoc.has(lKey)) ruleByLoc.set(lKey, rule);
      } else {
        if (!globalRule) globalRule = rule;
      }
    }

    // ══════════════════════════════════════════════════════════
    // STEP 3: Har customer/vehicle process karo
    // ══════════════════════════════════════════════════════════
    for (const customer of customers) {
      try {
        result.processed++;

        const custIntervalKMNum = Number(customer.Service_Interval_KM);
        const custIntervalDaysNum = Number(customer.Service_Interval_Days);

        const custHasValidKM = Number.isFinite(custIntervalKMNum) && custIntervalKMNum > 0;
        const custHasValidDays = Number.isFinite(custIntervalDaysNum) && custIntervalDaysNum > 0;
        const hasCustomerInterval = custHasValidKM || custHasValidDays;

        const custLocKey = String(customer.Loc_Code || "").trim().toUpperCase();
        let rule = ruleByLoc.get(custLocKey) || globalRule || null;

        let effectiveIntervalKM;
        let effectiveIntervalDays;
        let intervalSource;

        if (hasCustomerInterval) {
          // ✅ 1. Primary Check: Customer vehicle record (Srv_Cust_Vehi_Tbl) has intervals!
          effectiveIntervalKM = customer.Service_Interval_KM;
          effectiveIntervalDays = customer.Service_Interval_Days;
          intervalSource = "CUSTOMER_RECORD";

          if (!rule) {
            rule = {
              UTD: 0,
              Loc_Code: customer.Loc_Code,
              Model_Name: customer.Model_Name,
              Service_Interval_KM: custHasValidKM ? custIntervalKMNum : 0,
              Service_Interval_Days: custHasValidDays ? custIntervalDaysNum : 0,
              Rule_Type: "WHICHEVER_FIRST",
              Reminder_Before_Days_1: 7,
              Reminder_Before_Days_2: 3,
              Reminder_On_Due_Date: 1,
              Overdue_Reminder_Days: 3,
              status: 1,
            };
          }
        } else {
          // ✅ 2. Secondary / Fallback Check: Customer vehicle lacks interval -> check Srv_Model_Service_Rule_Tbl
          if (!rule) {
            result.totalFailed++;
            result.failedCustomers.push({
              Cust_Vehi_UTD: customer.UTD,
              Cust_Name: customer.Cust_Name,
              Loc_Code: customer.Loc_Code,
              reason: `No interval in customer vehicle record and no rule found for Loc: "${custLocKey}"`,
            });
            continue;
          }

          effectiveIntervalKM = rule.Service_Interval_KM;
          effectiveIntervalDays = rule.Service_Interval_Days;
          intervalSource = "LOCATION_RULE";
        }

        const finalIntervalKMNum = Number(effectiveIntervalKM) || 0;
        const finalIntervalDaysNum = Number(effectiveIntervalDays) || 0;

        if (finalIntervalKMNum === 0 && finalIntervalDaysNum === 0) {
          result.totalFailed++;
          result.failedCustomers.push({
            Cust_Vehi_UTD: customer.UTD,
            Cust_Name: customer.Cust_Name,
            reason: `No interval defined (checked ${intervalSource})`,
          });
          continue;
        }

        // ── calcReminderData ko effective values ke sath call karo ──
        const customerForCalc = {
          ...customer,
          Service_Interval_KM: effectiveIntervalKM,
          Service_Interval_Days: effectiveIntervalDays,
        };

        const calculated = calcReminderData(customerForCalc, rule);

        if (!calculated.finalDueDate) {
          result.totalFailed++;
          result.failedCustomers.push({
            Cust_Vehi_UTD: customer.UTD,
            Cust_Name: customer.Cust_Name,
            reason: "Final due date could not be calculated",
          });
          continue;
        }

        const stages = buildReminderStages(rule, calculated.finalDueDate);
        if (!stages || stages.length === 0) {
          result.totalFailed++;
          result.failedCustomers.push({
            Cust_Vehi_UTD: customer.UTD,
            Cust_Name: customer.Cust_Name,
            reason: "No reminder stages configured",
          });
          continue;
        }

        const existingTypes = await sequelize.query(
          `SELECT DISTINCT Reminder_Type
           FROM dbo.Srv_Reminder_Tbl
           WHERE Cust_Vehi_UTD    = :Cust_Vehi_UTD
             AND ISNULL(Service_Rule_UTD, 0) = :Service_Rule_UTD
             AND Final_Due_Date   = CONVERT(date, :Final_Due_Date, 23)
             AND status           = 1`,
          {
            replacements: {
              Cust_Vehi_UTD: customer.UTD,
              Service_Rule_UTD: rule.UTD,
              Final_Due_Date: calculated.finalDueDate,
            },
            type: QueryTypes.SELECT,
          }
        );

        const insertedSet = new Set(
          existingTypes.map((r) => String(r.Reminder_Type).trim().toUpperCase())
        );

        let nextStage = null;
        for (const stage of stages) {
          if (!insertedSet.has(String(stage.type).trim().toUpperCase())) {
            nextStage = stage;
            break;
          }
        }

        if (!nextStage) {
          result.totalSkipped++;
          continue;
        }

        console.log(
          `[AUTO-GEN] Inserting: ${nextStage.type} @ ${nextStage.date} | CustUTD:${customer.UTD} | Source:${intervalSource}`
        );

        const tx = await sequelize.transaction();
        try {
          const insertResult = await insertSingleReminder(
            sequelize,
            {
              customer: { UTD: customer.UTD, Loc_Code: customer.Loc_Code },
              rule,
              calculated,
              reminderDate: nextStage.date,
              reminderType: nextStage.type,
              reminderStatus: "PENDING",
              serviceStatus: "PENDING",
              reminderChannel: "AI_CALL",
              createdBy,
              isFollowup: false,
            },
            tx
          );

          await tx.commit();

          if (insertResult && insertResult.length > 0) {
            result.totalInserted++;
            console.log(`[AUTO-GEN] ✅ Inserted UTD:${insertResult[0].UTD} | Source:${intervalSource}`);
          } else {
            result.totalSkipped++;
          }
        } catch (txErr) {
          await tx.rollback();
          result.totalFailed++;
          result.failedCustomers.push({
            Cust_Vehi_UTD: customer.UTD,
            Cust_Name: customer.Cust_Name,
            reason: `Insert error: ${txErr.message}`,
          });
        }
      } catch (custErr) {
        result.totalFailed++;
        result.failedCustomers.push({
          Cust_Vehi_UTD: customer.UTD,
          Cust_Name: customer.Cust_Name,
          reason: `Process error: ${custErr.message}`,
        });
      }
    }

    console.log(
      `[AUTO-GEN] Done — Inserted:${result.totalInserted} | Skipped:${result.totalSkipped} | Failed:${result.totalFailed}`
    );
    return result;
  } catch (err) {
    console.error("[AUTO-GEN] Fatal:", err.message);
    result.error = err.message;
    return result;
  } finally {
    isAutoGenRunning = false;
  }
};

// ============================================================
// Helper: Safe Rollback
// ============================================================

const generateNextReminderAfterUpdate = async (
  sequelize,
  { custVehiUTD, serviceRuleUTD, locCode, calculated, rule, reminderChannel = "AI_CALL", createdBy = "SYSTEM", transaction }
) => {
  try {
    if (!calculated?.finalDueDate) return null;

    const allStages = buildReminderStages(rule, calculated.finalDueDate);
    if (!allStages || allStages.length === 0) return null;

    const existingResult = await sequelize.query(
      `SELECT DISTINCT Reminder_Type
       FROM dbo.Srv_Reminder_Tbl
       WHERE Cust_Vehi_UTD    = :Cust_Vehi_UTD
         AND Service_Rule_UTD = :Service_Rule_UTD
         AND Final_Due_Date   = CONVERT(date, :Final_Due_Date, 23)
         AND status           = 1`,
      {
        replacements: {
          Cust_Vehi_UTD: custVehiUTD,
          Service_Rule_UTD: serviceRuleUTD,
          Final_Due_Date: calculated.finalDueDate,
        },
        type: QueryTypes.SELECT,
        transaction,
      }
    );

    const insertedSet = new Set(
      existingResult.map((r) => String(r.Reminder_Type).trim().toUpperCase())
    );

    console.log("[NEXT-REMINDER] Inserted:", [...insertedSet]);
    console.log("[NEXT-REMINDER] Stages:", allStages.map((s) => `${s.type}@${s.date}`));

    let nextStage = null;
    for (const stage of allStages) {
      if (!insertedSet.has(String(stage.type).trim().toUpperCase())) {
        nextStage = stage;
        break;
      }
    }

    if (!nextStage) {
      console.log("[NEXT-REMINDER] All stages done");
      return null;
    }

    const inserted = await insertSingleReminder(
      sequelize,
      {
        customer: { UTD: custVehiUTD, Loc_Code: locCode },
        rule,
        calculated,
        reminderDate: nextStage.date,
        reminderType: nextStage.type,
        reminderStatus: "PENDING",
        serviceStatus: "PENDING",
        reminderChannel,
        createdBy,
        isFollowup: false,
      },
      transaction
    );

    if (inserted && inserted.length > 0) {
      console.log("[NEXT-REMINDER] ✅ Created UTD:", inserted[0].UTD);
      return {
        UTD: inserted[0].UTD,
        Reminder_Date: inserted[0].Reminder_Date || nextStage.date,
        Reminder_Type: inserted[0].Reminder_Type || nextStage.type,
        Reminder_Status: "PENDING",
      };
    }

    return null;
  } catch (err) {
    console.error("[NEXT-REMINDER] Error:", err.message);
    return null;
  }
};

// ============================================================
// UPDATE REMINDER — COMPLETE FIXED
// ============================================================
exports.updateReminder = async function (req, res) {
  let sequelize;
  let transaction;

  try {
    sequelize = await dbname(req, req.headers.compcode);
    const body = req.body || {};

    if (!body.UTD) {
      return res.status(400).send({ success: false, message: "UTD is required" });
    }

    const reminderUTD = Number(body.UTD);
    if (isNaN(reminderUTD) || reminderUTD <= 0) {
      return res.status(400).send({
        success: false,
        message: "UTD must be a valid positive number",
      });
    }

    const createdBy = getLoginUserId(req, body);

    // ── Fetch existing reminder ──────────────────────────────
    const existing = await sequelize.query(
      `SELECT TOP 1
         r.UTD, r.Cust_Vehi_UTD, r.Service_Rule_UTD, r.Loc_Code,
         CONVERT(varchar(10), r.Last_Service_Date,   23) AS Last_Service_Date,
         r.Last_Service_KM, r.Avg_Daily_KM, r.Next_Service_KM, r.Current_KM,
         CONVERT(varchar(10), r.Date_Based_Due_Date, 23) AS Date_Based_Due_Date,
         CONVERT(varchar(10), r.KM_Based_Due_Date,   23) AS KM_Based_Due_Date,
         CONVERT(varchar(10), r.Final_Due_Date,      23) AS Final_Due_Date,
         CONVERT(varchar(10), r.Reminder_Date,       23) AS Reminder_Date,
         CONVERT(varchar(8),  r.Reminder_Time,      108) AS Reminder_Time,
         CONVERT(varchar(8),  r.Followup_Time,      108) AS Followup_Time,
         r.Reminder_Type, r.Reminder_Channel,
         r.Reminder_Status, r.Service_Status
       FROM dbo.Srv_Reminder_Tbl r
       WHERE r.UTD = :UTD`,
      { replacements: { UTD: reminderUTD }, type: QueryTypes.SELECT }
    );

    if (!existing || existing.length === 0) {
      return res.status(404).send({ success: false, message: "Reminder not found" });
    }

    const cur = existing[0];

    // ════════════════════════════════════════════════════════
    // ✅ TIME EXTRACT HELPER
    // ════════════════════════════════════════════════════════

    /**
     * Time validate karo — HH:MM format
     * @param {string} t 
     * @returns {string|null}
     */
    const validateTime = (t) => {
      if (!t || String(t).trim() === "") return null;
      const timeStr = String(t).trim();
      // HH:MM or HH:MM:SS format accept karo
      if (/^\d{2}:\d{2}(:\d{2})?$/.test(timeStr)) {
        return timeStr.substring(0, 5); // sirf HH:MM rakhho
      }
      return null;
    };

    /**
     * Body se time nikalo
     * Priority: Followup_Time > Reminder_Time > default
     */
    const extractFollowupTime = () => {
      // Option 1: Explicit Followup_Time
      if (body.Followup_Time) return validateTime(body.Followup_Time);
      // Option 2: Time body me alag field se
      if (body.callback_time) return validateTime(body.callback_time);
      // Option 3: Default time
      return "10:00";
    };

    const extractReminderTime = () => {
      if (body.Reminder_Time) return validateTime(body.Reminder_Time);
      if (body.Followup_Time) return validateTime(body.Followup_Time);
      return "10:00"; // Default morning time
    };

    /**
     * ✅ Kitne time baad reminder hoga — minutes mein calculate
     * @param {string} date   - YYYY-MM-DD
     * @param {string} time   - HH:MM
     * @returns {object}
     */
    const calcTimeUntilReminder = (date, time) => {
      if (!date) return { minutes: null, hours: null, display: "—" };
      try {
        const timeStr = time || "10:00";
        const reminderDT = new Date(`${date}T${timeStr}:00`);
        const now = new Date();
        const diffMs = reminderDT.getTime() - now.getTime();
        const diffMins = Math.round(diffMs / 60000);
        const diffHours = Math.round(diffMs / 3600000 * 10) / 10;
        const diffDays = Math.floor(diffMins / 1440);

        let display = "";
        if (diffMins < 0) display = `${Math.abs(diffMins)}m ago`;
        else if (diffMins < 60) display = `${diffMins} min`;
        else if (diffHours < 24) display = `${diffHours} hrs`;
        else display = `${diffDays} days`;

        return { minutes: diffMins, hours: diffHours, days: diffDays, display };
      } catch (_) {
        return { minutes: null, hours: null, display: "—" };
      }
    };

    // ── Business flags ────────────────────────────────────────
    const hasFollowupDate = !!(body.Followup_Date && String(body.Followup_Date).trim() !== "");

    const bodyReminderDate = body.Reminder_Date ? String(body.Reminder_Date).trim() : "";
    const curReminderDate = cur.Reminder_Date ? String(cur.Reminder_Date).trim() : "";

    const hasReminderDateOverride = !!(
      bodyReminderDate !== "" &&
      !hasFollowupDate &&
      bodyReminderDate !== curReminderDate
    );

    const serviceCompleted =
      body.Service_Status === "COMPLETED" ||
      cur.Service_Status === "COMPLETED";

    const willCloseFollowup = hasFollowupDate && !serviceCompleted;
    const willCloseReminderDate = hasReminderDateOverride && !serviceCompleted;
    const willClose = willCloseFollowup || willCloseReminderDate;

    // ✅ Time values extract karo
    const followupTime = extractFollowupTime();
    const reminderTime = extractReminderTime();
    const appointTime = validateTime(body.Appointment_Time) || "10:00";

    console.log("[UPDATE] Times extracted:", {
      followupTime,
      reminderTime,
      appointTime,
      bodyFollowupTime: body.Followup_Time,
      bodyReminderTime: body.Reminder_Time,
    });

    // ── Fetch Rule & Customer (same as before) ─────────────
    let rule = null;
    if (cur.Service_Rule_UTD) {
      const ruleById = await sequelize.query(
        `SELECT TOP 1 UTD, Loc_Code, Model_Name,
           Service_Interval_KM, Service_Interval_Days, Rule_Type,
           Reminder_Before_Days_1, Reminder_Before_Days_2,
           Reminder_On_Due_Date, Overdue_Reminder_Days, status
         FROM dbo.Srv_Model_Service_Rule_Tbl
         WHERE UTD = :Service_Rule_UTD`,
        { replacements: { Service_Rule_UTD: cur.Service_Rule_UTD }, type: QueryTypes.SELECT }
      );
      rule = ruleById[0] || null;
    }

    if (!rule) {
      const custForRule = await sequelize.query(
        `SELECT TOP 1 Model_Name, Loc_Code FROM dbo.Srv_Cust_Vehi_Tbl
         WHERE UTD = :Cust_Vehi_UTD AND Export_Type = 1`,
        { replacements: { Cust_Vehi_UTD: cur.Cust_Vehi_UTD }, type: QueryTypes.SELECT }
      );
      if (custForRule.length > 0) {
        const { Model_Name, Loc_Code } = custForRule[0];
        const ruleFallback = await sequelize.query(
          `SELECT TOP 1 UTD, Loc_Code, Model_Name,
             Service_Interval_KM, Service_Interval_Days, Rule_Type,
             Reminder_Before_Days_1, Reminder_Before_Days_2,
             Reminder_On_Due_Date, Overdue_Reminder_Days, status
           FROM dbo.Srv_Model_Service_Rule_Tbl
           WHERE UPPER(LTRIM(RTRIM(Model_Name))) = UPPER(LTRIM(RTRIM(:Model_Name)))
             AND (LTRIM(RTRIM(ISNULL(Loc_Code,''))) = LTRIM(RTRIM(ISNULL(:Loc_Code,''))) OR Loc_Code IS NULL OR LTRIM(RTRIM(Loc_Code))='')
           ORDER BY CASE WHEN LTRIM(RTRIM(ISNULL(Loc_Code,'')))=LTRIM(RTRIM(ISNULL(:Loc_Code,''))) THEN 1 ELSE 2 END ASC, UTD DESC`,
          { replacements: { Model_Name, Loc_Code }, type: QueryTypes.SELECT }
        );
        rule = ruleFallback[0] || null;
      }
    }

    const customerResult = await sequelize.query(
      `SELECT TOP 1 UTD, Loc_Code, Tran_id, Model_Name,
         Last_Service_Date, Last_Service_KM, Avg_Daily_KM, Current_KM,
         Service_Interval_KM, Service_Interval_Days
       FROM dbo.Srv_Cust_Vehi_Tbl
       WHERE UTD = :Cust_Vehi_UTD AND Export_Type = 1`,
      { replacements: { Cust_Vehi_UTD: cur.Cust_Vehi_UTD }, type: QueryTypes.SELECT }
    );

    const customerData = customerResult[0] || null;

    let calculated = null;
    if (customerData && rule) {
      const recalc = calcReminderData(customerData, rule);
      calculated = {
        ...recalc,
        lastServiceDate: cur.Last_Service_Date || recalc.lastServiceDate,
        lastServiceKM: cur.Last_Service_KM ?? recalc.lastServiceKM,
        avgDailyKM: cur.Avg_Daily_KM ?? recalc.avgDailyKM,
        nextServiceKM: cur.Next_Service_KM ?? recalc.nextServiceKM,
        dateBasedDueDate: cur.Date_Based_Due_Date || recalc.dateBasedDueDate,
        kmBasedDueDate: cur.KM_Based_Due_Date || recalc.kmBasedDueDate,
        finalDueDate: cur.Final_Due_Date || recalc.finalDueDate,
        currentKM: cur.Current_KM ?? recalc.currentKM,
      };
    } else if (cur.Final_Due_Date) {
      calculated = {
        lastServiceDate: cur.Last_Service_Date || null,
        lastServiceKM: cur.Last_Service_KM ?? null,
        avgDailyKM: cur.Avg_Daily_KM ?? null,
        nextServiceKM: cur.Next_Service_KM ?? null,
        dateBasedDueDate: cur.Date_Based_Due_Date || null,
        kmBasedDueDate: cur.KM_Based_Due_Date || null,
        finalDueDate: cur.Final_Due_Date,
        currentKM: cur.Current_KM ?? 0,
        intervalKM: 0,
        intervalDays: 0,
      };
    }

    const ruleForInsert = rule || {
      UTD: cur.Service_Rule_UTD || 0,
      Reminder_Before_Days_1: null,
      Reminder_Before_Days_2: null,
      Reminder_On_Due_Date: null,
      Overdue_Reminder_Days: null,
    };

    // ── Start Transaction ─────────────────────────────────────
    transaction = await sequelize.transaction();

    // ── STEP 1: Build SET clauses ─────────────────────────────
    const setClauses = [];
    const replacements = { UTD: reminderUTD, Updated_By: createdBy };

    const textFields = [
      "Reminder_Channel", "Call_Status", "Customer_Response",
      "Followup_Remark", "Contacted_By", "Appointment_Status",
      "Appointment_Remark", "Service_Status", "Service_Remark",
    ];

    textFields.forEach((field) => {
      if (body[field] !== undefined) {
        setClauses.push(`[${field}] = :${field}`);
        replacements[field] = body[field] === "" || body[field] === "null"
          ? null : String(body[field]).trim();
      }
    });

    ["Current_KM_Verified", "Service_Completed_KM", "Reminder_Count", "status"].forEach((field) => {
      if (body[field] !== undefined) {
        if (body[field] === null || body[field] === "") {
          setClauses.push(`[${field}] = :${field}`);
          replacements[field] = null;
        } else {
          const num = toIntegerOrNull(body[field]);
          if (num === null) throw new Error(`${field} must be a valid number`);
          setClauses.push(`[${field}] = :${field}`);
          replacements[field] = num;
        }
      }
    });

    const dateFields = ["Followup_Date", "Appointment_Date", "Service_Completed_Date"];
    if (!willClose && body.Reminder_Date !== undefined) {
      dateFields.push("Reminder_Date");
    }

    dateFields.forEach((field) => {
      if (body[field] !== undefined) {
        if (!body[field] || body[field] === "") {
          setClauses.push(`[${field}] = NULL`);
        } else {
          const dv = convertDate(body[field]);
          if (!dv) throw new Error(`${field} has invalid date format`);
          setClauses.push(`[${field}] = CONVERT(date, :${field}, 23)`);
          replacements[field] = dv;
        }
      }
    });

    // ✅ Appointment Time
    if (body.Appointment_Time !== undefined) {
      if (!body.Appointment_Time || body.Appointment_Time === "") {
        setClauses.push(`[Appointment_Time] = NULL`);
      } else {
        setClauses.push(`[Appointment_Time] = CONVERT(time(0), :Appointment_Time)`);
        replacements.Appointment_Time = appointTime || body.Appointment_Time;
      }
    }

    // ✅ Followup_Time save karo
    if (followupTime && hasFollowupDate) {
      setClauses.push(`[Followup_Time] = :Followup_Time`);
      replacements.Followup_Time = followupTime;

      // ✅ Time until reminder calculate karo
      const timeUntil = calcTimeUntilReminder(body.Followup_Date, followupTime);
      console.log("[TIME] Followup reminder in:", timeUntil.display,
        "| Date:", body.Followup_Date, "| Time:", followupTime);
    }

    // ✅ Reminder_Time save karo (jab Reminder_Date change ho)
    if (reminderTime && (hasReminderDateOverride || body.Reminder_Date)) {
      setClauses.push(`[Reminder_Time] = :Reminder_Time`);
      replacements.Reminder_Time = reminderTime;
    }

    if (body.incrementReminderCount === true) {
      setClauses.push(`[Reminder_Count]   = ISNULL(Reminder_Count, 0) + 1`);
      setClauses.push(`[Last_Reminder_At] = GETDATE()`);
    }

    // Reminder_Status
    if (willClose) {
      setClauses.push(`[Reminder_Status] = 'CLOSED'`);
    } else if (serviceCompleted && body.Service_Status === "COMPLETED") {
      setClauses.push(`[Reminder_Status] = 'COMPLETED'`);
    } else if (body.Reminder_Status !== undefined) {
      setClauses.push(`[Reminder_Status] = :Reminder_Status`);
      replacements.Reminder_Status = body.Reminder_Status === ""
        ? null : String(body.Reminder_Status).trim();
    }

    if (setClauses.length === 0) {
      await transaction.rollback();
      transaction = null;
      return res.status(400).send({ success: false, message: "No fields to update" });
    }

    setClauses.push(`[Updated_By] = :Updated_By`);
    setClauses.push(`[Updated_At] = GETDATE()`);

    const updateSQL = `
      UPDATE dbo.Srv_Reminder_Tbl
         SET ${setClauses.join(",\n             ")}
       WHERE UTD = :UTD
    `;

    await sequelize.query(updateSQL, {
      replacements,
      type: QueryTypes.UPDATE,
      transaction,
    });

    console.log("[STEP 1] ✅ Current reminder updated");

    // ── STEP 2: Next PENDING reminder create ──────────────────
    let nextReminderCreated = false;
    let nextReminderUTD = null;
    let nextReminderData = null;
    let followupCreated = false;
    let reminderDateCreated = false;

    const canCreateReminder = !!(calculated && calculated.finalDueDate);

    if (canCreateReminder) {

      const fetchNewReminder = async (utd) => {
        const nr = await sequelize.query(
          `SELECT TOP 1
             r.UTD, r.Cust_Vehi_UTD, r.Loc_Code,
             m.Veh_Reg_No, c.Cust_Name, c.Cust_Mob, c.Model_Name,
             CONVERT(varchar(10), r.Reminder_Date,  23) AS Reminder_Date,
             CONVERT(varchar(8),  r.Reminder_Time, 108) AS Reminder_Time,
             CONVERT(varchar(10), r.Final_Due_Date, 23) AS Final_Due_Date,
             r.Reminder_Type, r.Reminder_Status, r.Reminder_Channel,
             r.Call_Status, r.Service_Status,
             CONVERT(varchar(19), r.Created_At, 120) AS Created_At
           FROM dbo.Srv_Reminder_Tbl r
           INNER JOIN dbo.Srv_Cust_Vehi_Tbl c ON c.UTD = r.Cust_Vehi_UTD
           LEFT  JOIN dbo.Srv_Mst_Vehi_Tbl  m ON m.UTD = c.Tran_id
           WHERE r.UTD = :UTD`,
          { replacements: { UTD: utd }, type: QueryTypes.SELECT, transaction }
        );
        return nr[0] || null;
      };

      const fetchExistingPending = async (reminderDate) => {
        const ep = await sequelize.query(
          `SELECT TOP 1
             r.UTD, r.Cust_Vehi_UTD, r.Loc_Code,
             m.Veh_Reg_No, c.Cust_Name, c.Cust_Mob, c.Model_Name,
             CONVERT(varchar(10), r.Reminder_Date,  23) AS Reminder_Date,
             CONVERT(varchar(8),  r.Reminder_Time, 108) AS Reminder_Time,
             CONVERT(varchar(10), r.Final_Due_Date, 23) AS Final_Due_Date,
             r.Reminder_Type, r.Reminder_Status, r.Reminder_Channel,
             r.Call_Status, r.Service_Status,
             CONVERT(varchar(19), r.Created_At, 120) AS Created_At
           FROM dbo.Srv_Reminder_Tbl r
           INNER JOIN dbo.Srv_Cust_Vehi_Tbl c ON c.UTD = r.Cust_Vehi_UTD
           LEFT  JOIN dbo.Srv_Mst_Vehi_Tbl  m ON m.UTD = c.Tran_id
           WHERE r.Cust_Vehi_UTD  = :Cust_Vehi_UTD
             AND CAST(r.Reminder_Date AS DATE) = CONVERT(date, :Reminder_Date, 23)
             AND r.Reminder_Status = 'PENDING'
             AND r.status          = 1
             AND r.UTD            <> :CurrentUTD
           ORDER BY r.UTD DESC`,
          {
            replacements: {
              Cust_Vehi_UTD: cur.Cust_Vehi_UTD,
              Reminder_Date: reminderDate,
              CurrentUTD: reminderUTD,
            },
            type: QueryTypes.SELECT,
            transaction,
          }
        );
        return ep[0] || null;
      };

      // ── Case A: Followup_Date ──────────────────────────────
      if (willCloseFollowup) {
        const followupDate = convertDate(body.Followup_Date);
        if (!followupDate) throw new Error("Followup_Date has invalid date format");

        // ✅ Time calculate karo
        const timeUntil = calcTimeUntilReminder(body.Followup_Date, followupTime);
        console.log("[STEP 2A] Followup → Date:", followupDate,
          "| Time:", followupTime,
          "| Reminder in:", timeUntil.display);

        const newInserted = await insertSingleReminder(
          sequelize,
          {
            customer: { UTD: cur.Cust_Vehi_UTD, Loc_Code: cur.Loc_Code },
            rule: ruleForInsert,
            calculated,
            reminderDate: followupDate,
            reminderTime: followupTime,   // ✅ Time pass karo
            reminderType: "FOLLOWUP",
            reminderStatus: "PENDING",
            serviceStatus: "PENDING",
            reminderChannel: body.Reminder_Channel || cur.Reminder_Channel || "MANUAL_CALL",
            createdBy,
            isFollowup: true,
          },
          transaction
        );

        if (newInserted && newInserted.length > 0) {
          nextReminderUTD = newInserted[0].UTD;
          followupCreated = true;
          nextReminderCreated = true;
          nextReminderData = await fetchNewReminder(nextReminderUTD);
          console.log("[STEP 2A] ✅ Followup created UTD:", nextReminderUTD,
            "| Time:", followupTime, "| In:", timeUntil.display);
        } else {
          const ep = await fetchExistingPending(followupDate);
          if (ep) { nextReminderUTD = ep.UTD; nextReminderData = ep; }
        }

        // ── Case B: Reminder_Date override ────────────────────
      } else if (willCloseReminderDate) {
        const newReminderDate = convertDate(body.Reminder_Date);
        if (!newReminderDate) throw new Error("Reminder_Date has invalid date format");

        // ✅ Time calculate karo
        const timeUntil = calcTimeUntilReminder(body.Reminder_Date, reminderTime);
        console.log("[STEP 2B] Reminder_Date → Date:", newReminderDate,
          "| Time:", reminderTime,
          "| Reminder in:", timeUntil.display);

        const newInserted = await insertSingleReminder(
          sequelize,
          {
            customer: { UTD: cur.Cust_Vehi_UTD, Loc_Code: cur.Loc_Code },
            rule: ruleForInsert,
            calculated,
            reminderDate: newReminderDate,
            reminderTime: reminderTime,   // ✅ Time pass karo
            reminderType: "FOLLOWUP",
            reminderStatus: "PENDING",
            serviceStatus: "PENDING",
            reminderChannel: body.Reminder_Channel || cur.Reminder_Channel || "MANUAL_CALL",
            createdBy,
            isFollowup: true,
          },
          transaction
        );

        if (newInserted && newInserted.length > 0) {
          nextReminderUTD = newInserted[0].UTD;
          reminderDateCreated = true;
          nextReminderCreated = true;
          nextReminderData = await fetchNewReminder(nextReminderUTD);
          console.log("[STEP 2B] ✅ New reminder UTD:", nextReminderUTD,
            "| Time:", reminderTime, "| In:", timeUntil.display);
        } else {
          const ep = await fetchExistingPending(newReminderDate);
          if (ep) { nextReminderUTD = ep.UTD; nextReminderData = ep; }
        }

        // ── Case C & D: Service Complete / Normal ─────────────
      } else if ((serviceCompleted && body.Service_Status === "COMPLETED" && rule) || rule) {
        const nextGen = await generateNextReminderAfterUpdate(sequelize, {
          custVehiUTD: cur.Cust_Vehi_UTD,
          serviceRuleUTD: cur.Service_Rule_UTD,
          locCode: cur.Loc_Code,
          calculated,
          rule,
          reminderChannel: body.Reminder_Channel || cur.Reminder_Channel || "AI_CALL",
          createdBy,
          transaction,
        });

        if (nextGen) {
          nextReminderUTD = nextGen.UTD;
          nextReminderData = nextGen;
          nextReminderCreated = true;
        }
      }
    }

    // ── STEP 3: Fetch updated reminder ────────────────────────
    const updated = await sequelize.query(
      `SELECT TOP 1
         r.UTD, r.Cust_Vehi_UTD, r.Service_Rule_UTD, r.Loc_Code,
         m.Veh_Reg_No, c.Cust_Name, c.Cust_Mob, c.Model_Name,
         CONVERT(varchar(10), r.Reminder_Date,           23) AS Reminder_Date,
         CONVERT(varchar(8),  r.Reminder_Time,          108) AS Reminder_Time,
         CONVERT(varchar(10), r.Final_Due_Date,          23) AS Final_Due_Date,
         r.Reminder_Type, r.Reminder_Status, r.Reminder_Count,
         r.Call_Status, r.Customer_Response,
         CONVERT(varchar(10), r.Followup_Date,           23) AS Followup_Date,
         CONVERT(varchar(8),  r.Followup_Time,          108) AS Followup_Time,
         r.Followup_Remark, r.Current_KM_Verified, r.Contacted_By,
         CONVERT(varchar(10), r.Appointment_Date,        23) AS Appointment_Date,
         CONVERT(varchar(8),  r.Appointment_Time,       108) AS Appointment_Time,
         r.Appointment_Status, r.Appointment_Remark,
         r.Service_Status,
         CONVERT(varchar(10), r.Service_Completed_Date,  23) AS Service_Completed_Date,
         r.Service_Completed_KM, r.Service_Remark,
         r.status, r.Updated_By,
         CONVERT(varchar(19), r.Updated_At, 120) AS Updated_At
       FROM dbo.Srv_Reminder_Tbl r
       INNER JOIN dbo.Srv_Cust_Vehi_Tbl c ON c.UTD = r.Cust_Vehi_UTD
       LEFT  JOIN dbo.Srv_Mst_Vehi_Tbl  m ON m.UTD = c.Tran_id
       WHERE r.UTD = :UTD`,
      { replacements: { UTD: reminderUTD }, type: QueryTypes.SELECT, transaction }
    );

    await transaction.commit();
    transaction = null;
    console.log("[DONE] ✅ Committed");

    // ✅ Time info for response
    const nextReminderTimeInfo = nextReminderData
      ? calcTimeUntilReminder(
        nextReminderData.Reminder_Date,
        nextReminderData.Reminder_Time || reminderTime || "10:00"
      )
      : null;

    let message = "Reminder updated successfully";
    if (followupCreated) message = "Reminder closed & followup PENDING created";
    else if (reminderDateCreated) message = "Reminder closed & new PENDING created at updated date";
    else if (willClose && nextReminderData) message = "Reminder closed — existing PENDING found";
    else if (willClose) message = "Reminder closed successfully";
    else if (nextReminderCreated && serviceCompleted) message = "Service complete & next reminder generated";
    else if (nextReminderCreated) message = "Reminder updated & next stage auto-generated";

    return res.status(200).send({
      success: true,
      message,
      data: {
        updatedReminder: updated[0] || null,
        nextReminder: nextReminderData
          ? {
            ...nextReminderData,
            // ✅ Time info add karo response mein
            scheduledTime: nextReminderData.Reminder_Time || reminderTime || "10:00",
            timeUntilReminder: nextReminderTimeInfo,
          }
          : null,
        actions: {
          currentReminderClosed: willClose,
          willCloseFollowup,
          willCloseReminderDate,
          followupReminderCreated: followupCreated,
          reminderDateOverrideUsed: reminderDateCreated,
          nextReminderAutoCreated: nextReminderCreated,
          nextReminderUTD: nextReminderUTD || null,
          // ✅ Time details
          timeInfo: {
            followupTime: followupTime || null,
            reminderTime: reminderTime || null,
            appointmentTime: appointTime || null,
            nextReminderScheduledAt: nextReminderData?.Reminder_Date
              ? `${nextReminderData.Reminder_Date} ${reminderTime || "10:00"}`
              : null,
            timeUntilNextReminder: nextReminderTimeInfo?.display || null,
          },
        },
      },
    });

  } catch (error) {
    await safeRollback(transaction);
    console.error("[UPDATE REMINDER ERROR]", error);
    const isValidationError = error.message?.includes("must be") || error.message?.includes("invalid date");
    return res.status(isValidationError ? 400 : 500).send({
      success: false,
      message: isValidationError ? error.message : "Internal Server Error",
      error: isValidationError ? undefined : error.message,
    });
  } finally {
    if (sequelize) {
      try { await sequelize.close(); } catch (_) { }
    }
  }
};

// ============================================================
// GET ALL REMINDERS
// ============================================================
exports.getAllReminders = async function (req, res) {
  let sequelize;

  try {
    sequelize = await dbname(req, req.headers.compcode);
    const body = req.body || {};
    const createdBy = getLoginUserId(req, body);

    // ── Auto generate ────────────────────────────────────────
    let autoGenResult = {
      totalCustomers: 0,
      totalInserted: 0,
      totalSkipped: 0,
      totalFailed: 0,
      failedCustomers: [],
    };

    try {
      autoGenResult = await autoGenerateRemindersForAll(sequelize, createdBy);
    } catch (autoGenErr) {
      console.error("[AUTO-GEN] Error:", autoGenErr?.message);
    }

    // ── Filters ──────────────────────────────────────────────
    const {
      page = 1,
      pageSize = 10,
      search,
      Loc_Code,
      Reminder_Status,
      Reminder_Type,
      Service_Status,
      Appointment_Status,
      Call_Status,
      fromDate,
      toDate,
      dateField = "Reminder_Date", // ✅ old generic option (kept for backward compatibility)
      filterDateType,                       // ✅ NEW simple filter → "reminder" | "due"
      dueToday,
      overdue,
      upcoming,
      unknown,
      showClosed,
      emp_code,
      EMPCODE,
      empCode,
      user_code,
      User_Code,
      srv_exec_Emp_Code,
      emp_dms_code,
      Emp_Dms_Code,
      empDmsCode,
      dms_code,
    } = body;
    let userEmpCode = String(
      emp_code ||
      EMPCODE ||
      empCode ||
      user_code ||
      User_Code ||
      srv_exec_Emp_Code ||
      req?.headers?.emp_code ||
      req?.headers?.empcode ||
      req?.headers?.['emp-code'] ||
      req?.user?.EMPCODE ||
      req?.user?.emp_code ||
      ""
    ).trim();

    let empDmsCodeStr = String(
      emp_dms_code ||
      Emp_Dms_Code ||
      empDmsCode ||
      dms_code ||
      req?.headers?.emp_dms_code ||
      req?.headers?.empdmscode ||
      req?.headers?.['emp-dms-code'] ||
      req?.user?.emp_dms_code ||
      ""
    ).trim().toUpperCase();

    // Fallback: look up user_tbl if emp_code or emp_dms_code is missing
    const userIdForLookup =
      body.user_code ||
      body.User_Code ||
      body.user_id ||
      body.User_Id ||
      body.Created_By ||
      body.Updated_By ||
      req?.headers?.user_code ||
      req?.headers?.['user-code'] ||
      req?.headers?.user_id ||
      req?.user?.UTD ||
      req?.user?.userId ||
      (userEmpCode && userEmpCode !== "" ? userEmpCode : null);

    if (userIdForLookup && (!userEmpCode || !empDmsCodeStr)) {
      try {
        const userRows = await sequelize.query(
          `SELECT TOP 1 empcode, emp_dms_code 
           FROM dbo.user_tbl 
           WHERE (CAST(user_code AS VARCHAR(50)) = :uId OR CAST(empcode AS VARCHAR(50)) = :uId)
             AND (export_type < 3 OR export_type IS NULL)`,
          {
            replacements: { uId: String(userIdForLookup).trim() },
            type: QueryTypes.SELECT,
          }
        );
        if (userRows && userRows.length > 0) {
          if (!userEmpCode && userRows[0].empcode) {
            userEmpCode = String(userRows[0].empcode).trim();
          }
          if (!empDmsCodeStr && userRows[0].emp_dms_code) {
            empDmsCodeStr = String(userRows[0].emp_dms_code).trim().toUpperCase();
          }
        }
      } catch (lookupErr) {
        console.error("[REMINDER USER LOOKUP ERROR]", lookupErr?.message);
      }
    }

    const isAdmin = empDmsCodeStr === "EDP";
    console.log("[REMINDER ROLE CHECK]", { userEmpCode, empDmsCodeStr, isAdmin });

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(pageSize, 10) || 10, 1), 500);
    const offset = (pageNum - 1) * limit;

    // ── Conditions ───────────────────────────────────────────
    const conditions = [];
    const replacements = {};

    conditions.push(`r.status = 1`);

    // ── Employee Hierarchy Filter (Non-EDP Users) ──
    if (!isAdmin && userEmpCode) {
      conditions.push(`(
        c.srv_exec_Emp_Code = :userEmpCode
        OR emp.Reporting_1 = :userEmpCode
        OR emp.Reporting_2 = :userEmpCode
        OR emp.Reporting_3 = :userEmpCode
      )`);
      replacements.userEmpCode = userEmpCode;
    }

    if (Reminder_Status && String(Reminder_Status).trim() !== "") {
      conditions.push(`r.Reminder_Status = :Reminder_Status`);
      replacements.Reminder_Status = String(Reminder_Status).trim();
    } else if (showClosed === "closed") {
      conditions.push(`ISNULL(r.Reminder_Status, 'PENDING') = 'CLOSED'`);
    } else if (showClosed === "all") {
      // Allow both PENDING and CLOSED
    } else {
      // active (default): exclude CLOSED reminders
      conditions.push(`ISNULL(r.Reminder_Status, 'PENDING') <> 'CLOSED'`);
    }

    const locCodes = toLocCodeArray(Loc_Code);
    if (locCodes.length === 1) {
      const code = locCodes[0];
      const codeNum = Number(code);
      if (!isNaN(codeNum) && codeNum > 0) {
        conditions.push(`(
          LTRIM(RTRIM(CAST(COALESCE(r.Loc_Code, c.Loc_Code, '') AS VARCHAR(50)))) = :Loc_Code
          OR TRY_CAST(COALESCE(r.Loc_Code, c.Loc_Code, '') AS INT) = :Loc_Code_Int
        )`);
        replacements.Loc_Code = code;
        replacements.Loc_Code_Int = codeNum;
      } else {
        conditions.push(`LTRIM(RTRIM(CAST(COALESCE(r.Loc_Code, c.Loc_Code, '') AS VARCHAR(50)))) = :Loc_Code`);
        replacements.Loc_Code = code;
      }
    } else if (locCodes.length > 1) {
      const locPlaceholders = locCodes.map((_, i) => `:locCode_${i}`).join(", ");
      const locIntPlaceholders = locCodes.map((_, i) => `:locCodeInt_${i}`).join(", ");
      conditions.push(`(
        LTRIM(RTRIM(CAST(COALESCE(r.Loc_Code, c.Loc_Code, '') AS VARCHAR(50)))) IN (${locPlaceholders})
        OR TRY_CAST(COALESCE(r.Loc_Code, c.Loc_Code, '') AS INT) IN (${locIntPlaceholders})
      )`);
      locCodes.forEach((code, i) => {
        replacements[`locCode_${i}`] = code;
        replacements[`locCodeInt_${i}`] = Number(code) || 0;
      });
    }

    if (Reminder_Type && String(Reminder_Type).trim() !== "") {
      conditions.push(`r.Reminder_Type = :Reminder_Type`);
      replacements.Reminder_Type = String(Reminder_Type).trim();
    }

    if (Service_Status && String(Service_Status).trim() !== "") {
      conditions.push(`r.Service_Status = :Service_Status`);
      replacements.Service_Status = String(Service_Status).trim();
    }

    if (Appointment_Status && String(Appointment_Status).trim() !== "") {
      conditions.push(`r.Appointment_Status = :Appointment_Status`);
      replacements.Appointment_Status = String(Appointment_Status).trim();
    }

    if (Call_Status && String(Call_Status).trim() !== "") {
      conditions.push(`r.Call_Status = :Call_Status`);
      replacements.Call_Status = String(Call_Status).trim();
    }

    // ════════════════════════════════════════════════════════
    // ✅ NEW — Date range filter type resolve
    //    filterDateType priority:
    //      "due"      → r.Final_Due_Date
    //      "reminder" → r.Reminder_Date
    //    Agar filterDateType nahi diya to purana dateField
    //    generic mapping use hoga (backward compatible)
    // ════════════════════════════════════════════════════════
    const allowedDateFields = {
      Reminder_Date: "r.Reminder_Date",
      Final_Due_Date: "r.Final_Due_Date",
      Appointment_Date: "r.Appointment_Date",
      Service_Completed_Date: "r.Service_Completed_Date",
      Followup_Date: "r.Followup_Date",
      Last_Service_Date: "r.Last_Service_Date",
    };

    let selectedDateCol;
    let resolvedDateFieldName;

    const normalizedFilterType = filterDateType
      ? String(filterDateType).trim().toLowerCase()
      : "";

    if (normalizedFilterType === "due") {
      selectedDateCol = "r.Final_Due_Date";
      resolvedDateFieldName = "Final_Due_Date";
    } else if (normalizedFilterType === "reminder") {
      selectedDateCol = "r.Reminder_Date";
      resolvedDateFieldName = "Reminder_Date";
    } else {
      // fallback → purana generic dateField param
      resolvedDateFieldName = String(dateField).trim();
      selectedDateCol =
        allowedDateFields[resolvedDateFieldName] || "r.Reminder_Date";
    }

    if (fromDate && String(fromDate).trim() !== "") {
      const converted = convertDate(String(fromDate).trim());
      if (!converted) {
        return res.status(400).send({
          success: false,
          message: "Invalid fromDate format. Use YYYY-MM-DD",
        });
      }
      conditions.push(
        `(${selectedDateCol} IS NOT NULL AND CAST(${selectedDateCol} AS DATE) >= CONVERT(date, :fromDate, 23))`
      );
      replacements.fromDate = converted;
    }

    if (toDate && String(toDate).trim() !== "") {
      const converted = convertDate(String(toDate).trim());
      if (!converted) {
        return res.status(400).send({
          success: false,
          message: "Invalid toDate format. Use YYYY-MM-DD",
        });
      }
      conditions.push(
        `(${selectedDateCol} IS NOT NULL AND CAST(${selectedDateCol} AS DATE) <= CONVERT(date, :toDate, 23))`
      );
      replacements.toDate = converted;
    }

    // ── Due status ───────────────────────────────────────────
    const isTruthy = (v) =>
      v === true || v === 1 || v === "1" || v === "true";

    if (!Service_Status || String(Service_Status).trim() === "") {
      if (isTruthy(dueToday)) {
        conditions.push(`
          (r.Final_Due_Date IS NOT NULL
           AND CAST(r.Final_Due_Date AS DATE) = CONVERT(date, GETDATE())
           AND ISNULL(r.Service_Status, 'PENDING') <> 'COMPLETED')
        `);
      } else if (isTruthy(overdue)) {
        conditions.push(`
          (r.Final_Due_Date IS NOT NULL
           AND CAST(r.Final_Due_Date AS DATE) < CONVERT(date, GETDATE())
           AND ISNULL(r.Service_Status, 'PENDING') <> 'COMPLETED')
        `);
      } else if (isTruthy(upcoming)) {
        conditions.push(`
          (r.Final_Due_Date IS NOT NULL
           AND CAST(r.Final_Due_Date AS DATE) > CONVERT(date, GETDATE())
           AND ISNULL(r.Service_Status, 'PENDING') <> 'COMPLETED')
        `);
      } else if (isTruthy(unknown)) {
        conditions.push(`
          (r.Final_Due_Date IS NULL
           AND ISNULL(r.Service_Status, 'PENDING') <> 'COMPLETED')
        `);
      }
    }

    // ── Search ───────────────────────────────────────────────
    if (search && String(search).trim() !== "") {
      const s = String(search).trim();
      const sNorm = s.replace(/[ \-\+\(\)]/g, "");
      const digitsOnly = s.replace(/\D/g, "");
      const sDigits = digitsOnly ? `%${digitsOnly}%` : `%${sNorm}%`;

      conditions.push(`
        (
          REPLACE(REPLACE(ISNULL(m.Veh_Reg_No, ''), ' ', ''), '-', '') LIKE :searchVeh
          OR ISNULL(c.Cust_Name, '') LIKE :search
          OR CAST(ISNULL(c.Cust_Mob, '') AS VARCHAR(50)) LIKE :search
          OR REPLACE(REPLACE(REPLACE(REPLACE(CAST(ISNULL(c.Cust_Mob, '') AS VARCHAR(50)), ' ', ''), '-', ''), '+', ''), '(', '') LIKE :searchNorm
          OR REPLACE(REPLACE(REPLACE(REPLACE(CAST(ISNULL(c.Cust_Mob, '') AS VARCHAR(50)), ' ', ''), '-', ''), '+', ''), '(', '') LIKE :searchDigits
          OR ISNULL(c.Model_Name, '') LIKE :search
          OR ISNULL(r.Reminder_Type, '') LIKE :search
          OR ISNULL(r.Call_Status, '') LIKE :search
        )
      `);
      replacements.search = `%${s}%`;
      replacements.searchVeh = `%${s.toUpperCase().replace(/[\s-]/g, "")}%`;
      replacements.searchNorm = `%${sNorm}%`;
      replacements.searchDigits = sDigits;
    }

    const whereClause = `WHERE ${conditions.join("\n  AND ")}`;

    console.log("[GET ALL] WHERE:\n", whereClause);
    console.log("[GET ALL] Date filter applied on:", resolvedDateFieldName);
    console.log("[GET ALL] Replacements:", JSON.stringify(replacements, null, 2));

    // ══════════════════════════════════════════════════════════
    // ✅ Shared JOINs — Sirf Export_Type = 1 (Active) vehicles
    // ══════════════════════════════════════════════════════════
    const joins = `
      INNER JOIN dbo.Srv_Cust_Vehi_Tbl c 
        ON c.UTD = r.Cust_Vehi_UTD
       AND (c.Export_Type = 1 OR c.Export_Type IS NULL)
      LEFT  JOIN dbo.EMPLOYEEMASTER emp
        ON emp.EMPCODE = c.srv_exec_Emp_Code
      LEFT  JOIN dbo.Srv_Mst_Vehi_Tbl  m ON m.UTD = c.Tran_id
      LEFT  JOIN dbo.Misc_Mst mm1
        ON  mm1.Misc_Type = 85
        AND LTRIM(RTRIM(CAST(mm1.Misc_Code AS NVARCHAR(50))))
            = LTRIM(RTRIM(CAST(r.Loc_Code AS NVARCHAR(50))))
      LEFT  JOIN dbo.Misc_Mst mm2
        ON  mm2.Misc_Type = 85
        AND LTRIM(RTRIM(CAST(mm2.Misc_Code AS NVARCHAR(50))))
            = LTRIM(RTRIM(CAST(c.Loc_Code AS NVARCHAR(50))))
    `;

    // ── COUNT ────────────────────────────────────────────────
    const countResult = await sequelize.query(
      `SELECT COUNT(*) AS total
       FROM dbo.Srv_Reminder_Tbl r
       ${joins}
       ${whereClause}`,
      { replacements, type: QueryTypes.SELECT }
    );

    const totalRecords = Number(countResult[0]?.total || 0);
    const totalPages =
      totalRecords === 0 ? 0 : Math.ceil(totalRecords / limit);

    // ── SUMMARY ──────────────────────────────────────────────
    const summaryConditions = [`r.status = 1`, `r.Reminder_Status = 'PENDING'`];
    const summaryReplacements = {};

    if (!isAdmin && userEmpCode) {
      summaryConditions.push(`(
        c.srv_exec_Emp_Code = :userEmpCode
        OR emp.Reporting_1 = :userEmpCode
        OR emp.Reporting_2 = :userEmpCode
        OR emp.Reporting_3 = :userEmpCode
      )`);
      summaryReplacements.userEmpCode = userEmpCode;
    }

    if (Loc_Code && String(Loc_Code).trim() !== "") {
      summaryConditions.push(`ISNULL(r.Loc_Code, '') = :Loc_Code`);
      summaryReplacements.Loc_Code = String(Loc_Code).trim();
    }

    const summaryResult = await sequelize.query(
      `SELECT
         COUNT(*)                                                              AS total,
         SUM(CASE WHEN r.Reminder_Status = 'PENDING'   THEN 1 ELSE 0 END)    AS pending,
         SUM(CASE WHEN r.Service_Status  = 'COMPLETED' THEN 1 ELSE 0 END)    AS completed,
         SUM(CASE
               WHEN ISNULL(r.Service_Status, 'PENDING') <> 'COMPLETED'
                AND r.Final_Due_Date IS NOT NULL
                AND CAST(r.Final_Due_Date AS DATE) = CONVERT(date, GETDATE())
             THEN 1 ELSE 0 END)                                               AS dueToday,
         SUM(CASE
               WHEN ISNULL(r.Service_Status, 'PENDING') <> 'COMPLETED'
                AND r.Final_Due_Date IS NOT NULL
                AND CAST(r.Final_Due_Date AS DATE) < CONVERT(date, GETDATE())
             THEN 1 ELSE 0 END)                                               AS overdue,
         SUM(CASE
               WHEN ISNULL(r.Service_Status, 'PENDING') <> 'COMPLETED'
                AND r.Final_Due_Date IS NULL
             THEN 1 ELSE 0 END)                                               AS unknown,
         SUM(CASE
               WHEN ISNULL(r.Service_Status, 'PENDING') <> 'COMPLETED'
                AND r.Final_Due_Date IS NOT NULL
                AND CAST(r.Final_Due_Date AS DATE) > CONVERT(date, GETDATE())
             THEN 1 ELSE 0 END)                                               AS upcoming
       FROM dbo.Srv_Reminder_Tbl r
       ${joins}
       WHERE ${summaryConditions.join(" AND ")}`,
      { replacements: summaryReplacements, type: QueryTypes.SELECT }
    );

    const summary = summaryResult[0] || {};

    // ── DATA ─────────────────────────────────────────────────
    const data = await sequelize.query(
      `SELECT
         r.UTD,
         r.Cust_Vehi_UTD,
         r.Service_Rule_UTD,
         r.Loc_Code,
         COALESCE(mm1.Misc_Name, mm2.Misc_Name)                                AS Loc_Name,
         c.UTD                                                                  AS Cust_UTD,
         c.Tran_id,
         m.Veh_Reg_No,
         c.Cust_Name,
         c.Cust_Mob,
         c.Model_Name,
         CONVERT(varchar(10), r.Last_Service_Date,        23)                  AS Last_Service_Date,
         r.Last_Service_KM,
         r.Avg_Daily_KM,
         r.Next_Service_KM,
         r.Current_KM,
         CONVERT(varchar(10), r.Date_Based_Due_Date,      23)                  AS Date_Based_Due_Date,
         CONVERT(varchar(10), r.KM_Based_Due_Date,        23)                  AS KM_Based_Due_Date,
         CONVERT(varchar(10), r.Final_Due_Date,           23)                  AS Final_Due_Date,
         CONVERT(varchar(10), r.Reminder_Date,            23)                  AS Reminder_Date,
         r.Reminder_Type,
         r.Reminder_Channel,
         r.Reminder_Status,
         r.Reminder_Count,
         CONVERT(varchar(19), r.Last_Reminder_At,        120)                  AS Last_Reminder_At,
         r.Call_Status,
         r.Customer_Response,
         CONVERT(varchar(10), r.Followup_Date,            23)                  AS Followup_Date,
         r.Followup_Remark,
         r.Current_KM_Verified,
         r.Contacted_By,
         CONVERT(varchar(10), r.Appointment_Date,         23)                  AS Appointment_Date,
         CONVERT(varchar(8),  r.Appointment_Time,        108)                  AS Appointment_Time,
         r.Appointment_Status,
         r.Appointment_Remark,
         r.Service_Status,
         CONVERT(varchar(10), r.Service_Completed_Date,   23)                  AS Service_Completed_Date,
         r.Service_Completed_KM,
         r.Service_Remark,
         r.status,
         r.Created_By,
         CONVERT(varchar(19), r.Created_At,              120)                  AS Created_At,
         r.Updated_By,
         CONVERT(varchar(19), r.Updated_At,              120)                  AS Updated_At,
         CASE
           WHEN r.Service_Status = 'COMPLETED'                                 THEN 'COMPLETED'
           WHEN r.Final_Due_Date IS NULL                                       THEN 'UNKNOWN'
           WHEN CAST(r.Final_Due_Date AS DATE) = CONVERT(date, GETDATE())      THEN 'DUE_TODAY'
           WHEN CAST(r.Final_Due_Date AS DATE) < CONVERT(date, GETDATE())      THEN 'OVERDUE'
           ELSE 'UPCOMING'
         END                                                                    AS Due_Status,
         r.Next_Service_KM                                                      AS KM_Due_At,
         r.Last_Service_KM                                                      AS KM_Last,
         ISNULL(r.Next_Service_KM, 0) - ISNULL(r.Last_Service_KM, 0)           AS KM_Interval,
         CASE
           WHEN r.Final_Due_Date IS NULL THEN NULL
           ELSE DATEDIFF(day, CONVERT(date, GETDATE()), CAST(r.Final_Due_Date AS DATE))
         END                                                                     AS Days_Until_Due,
         CASE
           WHEN r.Reminder_Date IS NULL THEN NULL
           ELSE DATEDIFF(day, CONVERT(date, GETDATE()), CAST(r.Reminder_Date AS DATE))
         END                                                                     AS Days_Until_Reminder,
         CASE
           WHEN r.Date_Based_Due_Date IS NOT NULL
            AND r.KM_Based_Due_Date   IS NOT NULL
           THEN CASE
                  WHEN CAST(r.Date_Based_Due_Date AS DATE)
                       <= CAST(r.KM_Based_Due_Date AS DATE)
                  THEN 'DATE_BASED' ELSE 'KM_BASED'
                END
           WHEN r.Date_Based_Due_Date IS NOT NULL THEN 'DATE_BASED'
           WHEN r.KM_Based_Due_Date   IS NOT NULL THEN 'KM_BASED'
           ELSE NULL
         END                                                                     AS Final_Due_Based_On
       FROM dbo.Srv_Reminder_Tbl r
       ${joins}
       ${whereClause}
       ORDER BY
         CASE
           WHEN r.Service_Status = 'COMPLETED'                                 THEN 5
           WHEN r.Final_Due_Date IS NULL                                        THEN 4
           WHEN CAST(r.Final_Due_Date AS DATE) = CONVERT(date, GETDATE())       THEN 1
           WHEN CAST(r.Final_Due_Date AS DATE) < CONVERT(date, GETDATE())       THEN 2
           ELSE 3
         END ASC,
         CAST(r.Final_Due_Date AS DATE) ASC,
         r.UTD DESC
       OFFSET :offset ROWS
       FETCH NEXT :limit ROWS ONLY`,
      {
        replacements: { ...replacements, offset, limit },
        type: QueryTypes.SELECT,
      }
    );

    return res.status(200).send({
      success: true,
      data,
      pagination: {
        currentPage: pageNum,
        pageSize: limit,
        totalRecords,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      summary: {
        totalPending: Number(summary.pending || 0),
        completed: Number(summary.completed || 0),
        dueToday: Number(summary.dueToday || 0),
        overdue: Number(summary.overdue || 0),
        unknown: Number(summary.unknown || 0),
        upcoming: Number(summary.upcoming || 0),
      },
      appliedFilters: {
        dateFilterAppliedOn: resolvedDateFieldName, // ✅ "Reminder_Date" | "Final_Due_Date" etc.
        fromDate: fromDate || null,
        toDate: toDate || null,
      },
      autoGenerate: {
        totalCustomersChecked: autoGenResult.totalCustomers,
        newRemindersInserted: autoGenResult.totalInserted,
        alreadyExisted: autoGenResult.totalSkipped,
        failed: autoGenResult.totalFailed,
        failedCustomers: autoGenResult.failedCustomers?.slice(0, 5) || [],
      },
    });

  } catch (error) {
    console.error("[GET REMINDERS ERROR]", error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  } finally {
    if (sequelize) {
      try { await sequelize.close(); } catch (_) { }
    }
  }
};









// ============================================================
// GET ONE REMINDER (no change needed for intervals; uses stored values)
// ============================================================
exports.getOneReminder = async function (req, res) {
  let sequelize;

  try {
    sequelize = await dbname(req, req.headers.compcode);

    const { UTD } = req.body || {};
    if (!UTD) {
      return res.status(400).send({
        success: false,
        message: "UTD is required",
      });
    }

    const result = await sequelize.query(
      `SELECT TOP 1
         -- Core
         r.UTD,
         r.Cust_Vehi_UTD,
         r.Service_Rule_UTD,
         r.Loc_Code,

         -- Loc name from Misc_Mst (Type=85)
         COALESCE(mm1.Misc_Name, mm2.Misc_Name) AS Loc_Name,

         -- Veh_Reg_No master se
         m.Veh_Reg_No,
         c.Cust_Name,
         c.Cust_Mob,
         c.Model_Name,

         -- Service Info (calc me Current_KM ignore)
         CONVERT(varchar(10), r.Last_Service_Date, 23) AS Last_Service_Date,
         r.Last_Service_KM,
         r.Current_KM,
         r.Avg_Daily_KM,
         r.Next_Service_KM,

         -- Stored dates (FYI)
         CONVERT(varchar(10), r.Date_Based_Due_Date, 23) AS Date_Based_Due_Date_Stored,
         CONVERT(varchar(10), r.KM_Based_Due_Date,  23) AS KM_Based_Due_Date_Stored,
         CONVERT(varchar(10), r.Final_Due_Date,     23) AS Final_Due_Date_Stored,
         CONVERT(varchar(10), r.Reminder_Date,      23) AS Reminder_Date_Stored,

         -- Dynamic KM-based due
         CONVERT(varchar(10), km_due.KM_Due_Date_Calc, 23)      AS KM_Based_Due_Date,

         -- Final due (whichever first: date-based vs km-based)
         CONVERT(varchar(10), final_calc.Final_Due_Date_Calc, 23) AS Final_Due_Date,

         -- Reminder dates
         CONVERT(varchar(10), rd.Reminder_Date_Calc,  23)       AS Reminder_Date_Calc,
         CONVERT(varchar(10), rde.Reminder_Date_Effective, 23)  AS Reminder_Date,

         -- Meta + follow-up
         r.Reminder_Type,
         r.Reminder_Channel,
         r.Reminder_Status,
         r.Reminder_Count,
         CONVERT(varchar(19), r.Last_Reminder_At, 120) AS Last_Reminder_At,
         r.Call_Status,
         r.Customer_Response,
         CONVERT(varchar(10), r.Followup_Date, 23)       AS Followup_Date,
         r.Followup_Remark,
         r.Current_KM_Verified,
         r.Contacted_By,

         -- Appointment
         CONVERT(varchar(10), r.Appointment_Date, 23)    AS Appointment_Date,
         CONVERT(varchar(8),  r.Appointment_Time, 108)   AS Appointment_Time,
         r.Appointment_Status,
         r.Appointment_Remark,

         -- Service
         r.Service_Status,
         CONVERT(varchar(10), r.Service_Completed_Date, 23) AS Service_Completed_Date,
         r.Service_Completed_KM,
         r.Service_Remark,

         -- Audit
         r.status,
         r.Created_By,
         CONVERT(varchar(19), r.Created_At, 120) AS Created_At,
         r.Updated_By,
         CONVERT(varchar(19), r.Updated_At, 120) AS Updated_At,

         -- Due Status (Reminder effective ke hisaab se)
         CASE
           WHEN r.Service_Status = 'COMPLETED' THEN 'COMPLETED'
           WHEN rde.Reminder_Date_Effective = CONVERT(date, GETDATE()) THEN 'DUE_TODAY'
           WHEN rde.Reminder_Date_Effective < CONVERT(date, GETDATE()) THEN 'OVERDUE'
           ELSE 'UPCOMING'
         END AS Due_Status,

         -- KM summary
         r.Next_Service_KM                       AS KM_Due_At,
         r.Last_Service_KM                       AS KM_Last,
         (r.Next_Service_KM - r.Last_Service_KM) AS KM_Interval,

         -- Days display (UI rule)
         CASE
           WHEN rde.Reminder_Date_Effective = CONVERT(date, GETDATE()) THEN 0
           ELSE NULL
         END AS Days_Until_Reminder,

         CASE
           WHEN final_calc.Final_Due_Date_Calc IS NULL THEN NULL
           ELSE DATEDIFF(day, CONVERT(date, GETDATE()), final_calc.Final_Due_Date_Calc)
         END AS Days_Until_Due,

         -- Which date chosen for Final Due
         CASE
           WHEN final_calc.Final_Due_Date_Calc IS NULL THEN NULL
           WHEN r.Date_Based_Due_Date IS NOT NULL
            AND km_due.KM_Due_Date_Calc IS NOT NULL
           THEN CASE
                  WHEN CAST(r.Date_Based_Due_Date AS date) <= km_due.KM_Due_Date_Calc
                  THEN 'DATE_BASED'
                  ELSE 'KM_BASED'
                END
           WHEN r.Date_Based_Due_Date IS NOT NULL THEN 'DATE_BASED'
           ELSE 'KM_BASED'
         END AS Final_Due_Based_On

       FROM dbo.Srv_Reminder_Tbl r
       INNER JOIN dbo.Srv_Cust_Vehi_Tbl c
         ON c.UTD = r.Cust_Vehi_UTD
       LEFT JOIN dbo.Srv_Mst_Vehi_Tbl m
         ON m.UTD = c.Tran_id

       -- Branch/Misc name by Loc_Code (prefer r.Loc_Code, fallback c.Loc_Code)
       LEFT JOIN dbo.Misc_Mst mm1
         ON mm1.Misc_Type = 85
        AND LTRIM(RTRIM(CAST(mm1.Misc_Code AS NVARCHAR(50))))
            = LTRIM(RTRIM(CAST(r.Loc_Code  AS NVARCHAR(50))))
       LEFT JOIN dbo.Misc_Mst mm2
         ON mm2.Misc_Type = 85
        AND LTRIM(RTRIM(CAST(mm2.Misc_Code AS NVARCHAR(50))))
            = LTRIM(RTRIM(CAST(c.Loc_Code  AS NVARCHAR(50))))

       OUTER APPLY (
         SELECT
           CASE
             WHEN r.Avg_Daily_KM   IS NOT NULL
              AND r.Avg_Daily_KM    > 0
              AND r.Last_Service_KM IS NOT NULL
              AND r.Next_Service_KM IS NOT NULL
              AND r.Last_Service_Date IS NOT NULL
             THEN CEILING(
                    (CAST(r.Next_Service_KM AS FLOAT) - CAST(r.Last_Service_KM AS FLOAT))
                    / CAST(r.Avg_Daily_KM AS FLOAT)
                  )
             ELSE NULL
           END AS Days_To_KM_Due
       ) km_days

       OUTER APPLY (
         SELECT
           CASE
             WHEN km_days.Days_To_KM_Due IS NOT NULL
             THEN CAST(DATEADD(day, km_days.Days_To_KM_Due, CAST(r.Last_Service_Date AS date)) AS date)
             ELSE NULL
           END AS KM_Due_Date_Calc
       ) km_due

       OUTER APPLY (
         SELECT
           CASE
             WHEN r.Date_Based_Due_Date IS NOT NULL
              AND km_due.KM_Due_Date_Calc IS NOT NULL
             THEN
               CASE
                 WHEN CAST(r.Date_Based_Due_Date AS date) <= km_due.KM_Due_Date_Calc
                 THEN CAST(r.Date_Based_Due_Date AS date)
                 ELSE km_due.KM_Due_Date_Calc
               END

             WHEN r.Date_Based_Due_Date IS NOT NULL
              AND km_due.KM_Due_Date_Calc IS NULL
             THEN CAST(r.Date_Based_Due_Date AS date)

             WHEN r.Date_Based_Due_Date IS NULL
              AND km_due.KM_Due_Date_Calc IS NOT NULL
             THEN km_due.KM_Due_Date_Calc

             ELSE NULL
           END AS Final_Due_Date_Calc
       ) final_calc

       OUTER APPLY (
         SELECT
           CASE
             WHEN final_calc.Final_Due_Date_Calc IS NOT NULL
             THEN DATEADD(day, -60, final_calc.Final_Due_Date_Calc)
             ELSE NULL
           END AS Reminder_Date_Calc
       ) rd

       OUTER APPLY (
         SELECT
           COALESCE(CAST(r.Reminder_Date AS date), rd.Reminder_Date_Calc) AS Reminder_Date_Effective
       ) rde

       WHERE r.UTD = :UTD`,
      {
        replacements: { UTD: Number(UTD) },
        type: QueryTypes.SELECT,
      }
    );

    if (result.length === 0) {
      return res.status(404).send({
        success: false,
        message: "Reminder not found",
      });
    }

    return res.status(200).send({
      success: true,
      data: result[0],
    });
  } catch (error) {
    console.error("Get Reminder Error:", error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  } finally {
    if (sequelize) await sequelize.close();
  }
};


// ============================================================
// COMPLETE SERVICE
// ============================================================
exports.completeService = async function (req, res) {
  let sequelize;
  let transaction;

  try {
    sequelize = await dbname(req, req.headers.compcode);
    const body = req.body || {};

    const {
      Cust_Vehi_UTD,
      Service_Completed_Date,
      Service_Completed_KM,
      Service_Remark,
    } = body;

    // ✅ Validation
    if (!Cust_Vehi_UTD) {
      return res.status(400).send({
        success: false,
        message: "Cust_Vehi_UTD is required",
      });
    }

    const requestedUTD = Number(Cust_Vehi_UTD);

    if (!Number.isFinite(requestedUTD) || requestedUTD <= 0) {
      return res.status(400).send({
        success: false,
        message: "Cust_Vehi_UTD must be a valid positive number",
      });
    }

    const completedDate = convertDate(Service_Completed_Date);
    if (!completedDate) {
      return res.status(400).send({
        success: false,
        message: "Valid Service_Completed_Date is required",
      });
    }

    if (!isNonNegativeNumber(Service_Completed_KM)) {
      return res.status(400).send({
        success: false,
        message: "Service_Completed_KM must be a valid non-negative number",
      });
    }

    const completedKM = Math.trunc(Number(Service_Completed_KM));
    const updatedBy = getLoginUserId(req, body);

    transaction = await sequelize.transaction();

    // ══════════════════════════════════════════════════════════
    // ✅ STEP A: Pehle exact UTD + Export_Type=1 try karo
    // ══════════════════════════════════════════════════════════
    let customerResult = await sequelize.query(
      `SELECT TOP 1
         UTD,
         Tran_id,
         Current_KM,
         Last_Service_KM,
         Export_Type
       FROM dbo.Srv_Cust_Vehi_Tbl
       WHERE UTD         = :Cust_Vehi_UTD
         AND Export_Type = 1`,
      {
        replacements: { Cust_Vehi_UTD: requestedUTD },
        type: QueryTypes.SELECT,
        transaction,
      }
    );

    let effectiveUTD = requestedUTD;
    let fallbackUsed = false;

    // ══════════════════════════════════════════════════════════
    // ✅ STEP B: Agar nahi mila — check karo record exist karta hai kya
    // (shayad superseded ho gaya ho, Export_Type != 1)
    // ══════════════════════════════════════════════════════════
    if (customerResult.length === 0) {

      const staleRecord = await sequelize.query(
        `SELECT TOP 1 UTD, Tran_id, Export_Type
         FROM dbo.Srv_Cust_Vehi_Tbl
         WHERE UTD = :Cust_Vehi_UTD`,
        {
          replacements: { Cust_Vehi_UTD: requestedUTD },
          type: QueryTypes.SELECT,
          transaction,
        }
      );

      if (staleRecord.length === 0) {
        // Record bilkul exist hi nahi karta — galat ID
        await safeRollback(transaction);
        return res.status(404).send({
          success: false,
          message: `Customer vehicle record not found for Cust_Vehi_UTD: ${requestedUTD}`,
        });
      }

      console.warn(
        `[COMPLETE-SERVICE] Stale record found — UTD:${requestedUTD} | Export_Type:${staleRecord[0].Export_Type} | Tran_id:${staleRecord[0].Tran_id}`
      );

      // ── Tran_id ke through naya active record dhundo ────────
      const tranId = staleRecord[0].Tran_id;

      if (tranId) {
        const activeByTran = await sequelize.query(
          `SELECT TOP 1
             UTD, Tran_id, Current_KM, Last_Service_KM, Export_Type
           FROM dbo.Srv_Cust_Vehi_Tbl
           WHERE Tran_id    = :Tran_id
             AND Export_Type = 1
           ORDER BY UTD DESC`,
          {
            replacements: { Tran_id: tranId },
            type: QueryTypes.SELECT,
            transaction,
          }
        );

        if (activeByTran.length > 0) {
          customerResult = activeByTran;
          effectiveUTD = activeByTran[0].UTD;
          fallbackUsed = true;

          console.log(
            `[COMPLETE-SERVICE] ✅ Fallback success — Old UTD:${requestedUTD} → New Active UTD:${effectiveUTD}`
          );
        }
      }
    }

    if (customerResult.length === 0) {
      await safeRollback(transaction);
      return res.status(404).send({
        success: false,
        message:
          "Active customer vehicle not found. Record may be old/superseded and no active replacement found.",
        data: { requestedUTD },
      });
    }

    const currentCustomer = customerResult[0];

    // ✅ KM Validation
    if (
      currentCustomer.Last_Service_KM !== null &&
      completedKM < Number(currentCustomer.Last_Service_KM)
    ) {
      await safeRollback(transaction);
      return res.status(400).send({
        success: false,
        message: "Service_Completed_KM cannot be less than Last_Service_KM",
      });
    }

    if (
      currentCustomer.Current_KM !== null &&
      completedKM < Number(currentCustomer.Current_KM)
    ) {
      await safeRollback(transaction);
      return res.status(400).send({
        success: false,
        message: "Service_Completed_KM cannot be less than Current_KM",
      });
    }

    // ══════════════════════════════════════════════════════════
    // ✅ Step 1: Reminder Table update
    // Note: Reminder table me original requestedUTD hi use hoga
    // (kyunki reminder wahi purane UTD se linked hai)
    // ══════════════════════════════════════════════════════════
    await sequelize.query(
      `UPDATE dbo.Srv_Reminder_Tbl
       SET
         Reminder_Status = 'CLOSED',
         Appointment_Status =
           CASE
             WHEN Appointment_Status IS NOT NULL
             THEN 'COMPLETED'
             ELSE Appointment_Status
           END,
         Service_Status         = 'COMPLETED',
         Service_Completed_Date = CONVERT(date, :Service_Completed_Date, 23),
         Service_Completed_KM   = :Service_Completed_KM,
         Service_Remark         = :Service_Remark,
         Updated_By             = :Updated_By,
         Updated_At              = GETDATE()
       WHERE Cust_Vehi_UTD = :Requested_UTD
         AND ISNULL(Service_Status, 'PENDING') <> 'COMPLETED'`,
      {
        replacements: {
          Requested_UTD: requestedUTD,   // Original UTD jo reminder table me hai
          Service_Completed_Date: completedDate,
          Service_Completed_KM: completedKM,
          Service_Remark: Service_Remark || null,
          Updated_By: updatedBy,
        },
        type: QueryTypes.UPDATE,
        transaction,
      }
    );

    // ══════════════════════════════════════════════════════════
    // ✅ Step 2: Customer Vehicle table update
    // Note: Effective (active) UTD use hoga
    // ══════════════════════════════════════════════════════════
    await sequelize.query(
      `UPDATE dbo.Srv_Cust_Vehi_Tbl
       SET
         Last_Service_Date = CONVERT(date, :Service_Completed_Date, 23),
         Last_Service_KM   = :Service_Completed_KM,
         Current_KM        = :Service_Completed_KM,
         Updated_By        = :Updated_By,
         Updated_At        = GETDATE()
       WHERE UTD         = :Effective_UTD
         AND Export_Type = 1`,
      {
        replacements: {
          Effective_UTD: effectiveUTD,
          Service_Completed_Date: completedDate,
          Service_Completed_KM: completedKM,
          Updated_By: updatedBy,
        },
        type: QueryTypes.UPDATE,
        transaction,
      }
    );

    await transaction.commit();
    transaction = null;

    return res.status(200).send({
      success: true,
      message: "Service completed and customer vehicle updated successfully",
      data: {
        Requested_Cust_Vehi_UTD: requestedUTD,
        Effective_Cust_Vehi_UTD: effectiveUTD,
        Fallback_Used: fallbackUsed,
        Service_Completed_Date: completedDate,
        Service_Completed_KM: completedKM,
        Service_Remark: Service_Remark || null,
        Next_Step: "Please generate new reminder for next service",
      },
    });

  } catch (error) {
    await safeRollback(transaction);
    console.error("Complete Service Error:", error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  } finally {
    if (sequelize) await sequelize.close();
  }
};



exports.importCustomerVehicles = async function (req, res) {
  let sequelize;
  let transaction;

  // ========================================================
  // HELPERS
  // ========================================================

  const convertDate = (str) => {
    if (!str) return null;
    const s = String(str).trim();

    const m1 = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
    if (m1) {
      const da = String(m1[1]).padStart(2, "0");
      const mo = String(m1[2]).padStart(2, "0");
      let y = String(m1[3]);
      if (y.length === 2) y = `20${y}`;
      const dateCheck = new Date(`${y}-${mo}-${da}T00:00:00`);
      if (!Number.isNaN(dateCheck.getTime())) return `${y}-${mo}-${da}`;
    }

    const m2 = s.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
    if (m2) {
      const y = String(m2[1]);
      const mo = String(m2[2]).padStart(2, "0");
      const da = String(m2[3]).padStart(2, "0");
      const dateCheck = new Date(`${y}-${mo}-${da}T00:00:00`);
      if (!Number.isNaN(dateCheck.getTime())) return `${y}-${mo}-${da}`;
    }

    const d = new Date(s);
    if (!Number.isNaN(d.getTime())) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const da = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${da}`;
    }

    return null;
  };

  const parseExcelDate = (value) => {
    if (value === undefined || value === null || value === "") return null;

    if (value instanceof Date) {
      if (Number.isNaN(value.getTime())) return null;
      const y = value.getFullYear();
      const m = String(value.getMonth() + 1).padStart(2, "0");
      const d = String(value.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      const parsed = XLSX.SSF.parse_date_code(value);
      if (!parsed) return null;
      const y = String(parsed.y);
      const m = String(parsed.m).padStart(2, "0");
      const d = String(parsed.d).padStart(2, "0");
      return `${y}-${m}-${d}`;
    }

    return convertDate(String(value).trim());
  };

  const normalizeVehicleNumber = (value) => {
    if (value === undefined || value === null || value === "") return null;
    return String(value).trim().toUpperCase().replace(/[ -]/g, "");
  };

  const normalizeModelName = (value) => {
    if (value === undefined || value === null || value === "") return null;
    const s = String(value).trim();
    return s === "" ? null : s;
  };

  const normalizeMobileNumber = (value) => {
    if (value === undefined || value === null || value === "") return null;
    const stringValue = String(value).trim().replace(/\.0+$/, "");
    if (stringValue.toLowerCase().includes("e")) {
      const numericValue = Number(value);
      if (Number.isFinite(numericValue)) {
        return numericValue.toFixed(0).replace(/\D/g, "");
      }
    }
    return stringValue.replace(/\D/g, "");
  };

  const buildKey = (locCode, vehNorm) => `${locCode}|||${vehNorm}`;

  // ✅ Srv_Rmd_Row_Data mein row insert karna (success + failed dono)
  const insertRmdRowData = async (obj, seq, txn) => {
    try {
      await seq.query(
        `INSERT INTO dbo.Srv_Rmd_Row_Data
         (
           Loc_Code, Veh_Reg_No, Cust_Name, Cust_Mob,
           Model_Name, Last_Service_Date, Last_Service_KM,
           Avg_Daily_KM, Current_KM,
           Service_Interval_KM, Service_Interval_Days,
           srv_exec_Emp_Code, Status, Created_By, Created_At
         )
         VALUES
         (
           :Loc_Code, :Veh_Reg_No, :Cust_Name, :Cust_Mob,
           :Model_Name,
           CASE WHEN :Last_Service_Date IS NULL
                THEN NULL
                ELSE CONVERT(date, :Last_Service_Date, 23)
           END,
           :Last_Service_KM, :Avg_Daily_KM, :Current_KM,
           :Service_Interval_KM, :Service_Interval_Days,
           :srv_exec_Emp_Code, :Status, :Created_By, GETDATE()
         )`,
        {
          replacements: {
            Loc_Code: obj.Loc_Code || null,
            Veh_Reg_No: obj.Veh_Reg_No_Original || obj.Veh_Reg_No || null,
            Cust_Name: obj.Cust_Name || null,
            Cust_Mob: obj.Cust_Mob || null,
            Model_Name: obj.Model_Name || null,
            Last_Service_Date: obj.Last_Service_Date || null,
            Last_Service_KM: obj.Last_Service_KM ?? null,
            Avg_Daily_KM: obj.Avg_Daily_KM ?? null,
            Current_KM: obj.Current_KM ?? null,
            Service_Interval_KM: obj.Service_Interval_KM ?? null,
            Service_Interval_Days: obj.Service_Interval_Days ?? null,
            srv_exec_Emp_Code: obj.srv_exec_Emp_Code || null,
            Status: obj.rmd_status ?? 0,
            Created_By: obj.Created_By || null,
          },
          type: QueryTypes.INSERT,
          transaction: txn || null,
        }
      );
    } catch (rmdErr) {
      // Rmd insert fail hone par main flow block na ho
      console.error(
        `[RMD INSERT WARN] Row ${obj.Excel_Row} Rmd insert failed:`,
        rmdErr.message
      );
    }
  };

  try {
    sequelize = await dbname(req, req.headers.compcode);

    // ========================================================
    // FILE VALIDATION
    // ========================================================
    const excelFile = req.files?.excel?.[0];
    if (!excelFile) {
      return res.status(400).send({
        success: false,
        Message: "No Excel file uploaded",
      });
    }

    const user =
      req.body?.user ||
      req.body?.Created_By ||
      req?.user?.UTD ||
      req?.user?.userId ||
      null;

    const locCode = req.body?.Loc_Code || req.body?.branch || null;
    if (!locCode) {
      return res.status(400).send({
        success: false,
        Message: "Loc Code is required. Please provide Loc_Code in request.",
      });
    }

    // ========================================================
    // READ EXCEL
    // ========================================================
    const workbook = XLSX.read(excelFile.buffer, {
      type: "buffer",
      cellDates: true,
    });

    const sheetName = workbook.SheetNames?.[0];
    if (!sheetName) {
      return res.status(400).send({
        success: false,
        Message: "Excel file does not contain any sheet",
      });
    }

    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
      return res.status(400).send({
        success: false,
        Message: "Excel sheet not found",
      });
    }

    const sheetRows = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      defval: "",
      raw: false,
    });

    const sheetHeaders = (sheetRows[0] || []).map((h) =>
      String(h || "").trim()
    );

    // ✅ 3 new service executive columns added
    const expectedHeaders = [
      "Vehicle Registration No",
      "Customer Name",
      "Customer Mobile",
      "Model Name",
      "Last Service Date",
      "Last Service KM",
      "Average Daily KM",
      "Current KM",
      "Service Interval KM",
      "Service Interval Days",
      "Service Executive Name",      // ✅ NEW
      "Service Executive Emp Code",  // ✅ NEW
      "Service Executive Mobile",    // ✅ NEW
    ];

    const isHeadersMatch =
      sheetHeaders.length === expectedHeaders.length &&
      sheetHeaders.every((header, index) => header === expectedHeaders[index]);

    if (!isHeadersMatch) {
      return res.status(400).send({
        success: false,
        Message: "Invalid Excel format! Please upload the correct customer vehicle template.",
        ExpectedHeaders: expectedHeaders,
        ReceivedHeaders: sheetHeaders,
      });
    }

    const transformedData = XLSX.utils.sheet_to_json(sheet, {
      defval: "",
      raw: true,
      cellDates: true,
    });

    if (!transformedData.length) {
      return res.status(400).send({
        success: false,
        Message: "No data found in Excel or Excel format is invalid",
      });
    }

    // ========================================================
    // RENAME / SANITIZE
    // ========================================================
    const renameKeys = (obj) => {
      const keyMap = {
        "Vehicle Registration No": "Veh_Reg_No",
        "Customer Name": "Cust_Name",
        "Customer Mobile": "Cust_Mob",
        "Model Name": "Model_Name",
        "Last Service Date": "Last_Service_Date",
        "Last Service KM": "Last_Service_KM",
        "Average Daily KM": "Avg_Daily_KM",
        "Current KM": "Current_KM",
        "Service Interval KM": "Service_Interval_KM",
        "Service Interval Days": "Service_Interval_Days",
        "Service Executive Name": "srv_exec_name",      // ✅ NEW
        "Service Executive Emp Code": "srv_exec_Emp_Code",  // ✅ NEW
        "Service Executive Mobile": "srv_exec_mobile",    // ✅ NEW
      };

      return Object.keys(obj).reduce((acc, key) => {
        const newKey = keyMap[key] || key;
        const rawValue = obj[key];

        if (newKey === "Last_Service_Date") {
          acc[newKey] =
            rawValue === "" || rawValue === null || rawValue === undefined
              ? null
              : parseExcelDate(rawValue);

        } else if (newKey === "Cust_Mob") {
          acc[newKey] = normalizeMobileNumber(rawValue);

        } else if (newKey === "srv_exec_mobile") {
          // ✅ Mobile normalize karo
          acc[newKey] = normalizeMobileNumber(rawValue);

        } else if (newKey === "srv_exec_Emp_Code") {
          // ✅ Trim karo
          const trimmed = rawValue == null ? "" : String(rawValue).trim();
          acc[newKey] = trimmed === "" ? null : trimmed;

        } else if (newKey === "srv_exec_name") {
          // ✅ Trim karo
          const trimmed = rawValue == null ? "" : String(rawValue).trim();
          acc[newKey] = trimmed === "" ? null : trimmed;

        } else if (
          [
            "Last_Service_KM",
            "Avg_Daily_KM",
            "Current_KM",
            "Service_Interval_KM",
            "Service_Interval_Days",
          ].includes(newKey)
        ) {
          if (rawValue === "" || rawValue === null || rawValue === undefined) {
            acc[newKey] = null;
          } else {
            const numVal = Number(rawValue);
            acc[newKey] = Number.isFinite(numVal) ? numVal : null;
          }

        } else if (newKey === "Veh_Reg_No") {
          acc["Veh_Reg_No_Original"] =
            rawValue == null ? "" : String(rawValue).trim();
          acc[newKey] = normalizeVehicleNumber(rawValue);

        } else if (newKey === "Model_Name") {
          acc[newKey] = normalizeModelName(rawValue);

        } else if (typeof rawValue === "string") {
          const trimmed = rawValue.trim();
          acc[newKey] = trimmed === "" ? null : trimmed;

        } else {
          acc[newKey] = rawValue === "" ? null : rawValue;
        }

        return acc;
      }, {});
    };

    const prepared = transformedData.map((row, index) => {
      const t = renameKeys(row);
      t.Excel_Row = index + 2;
      t.Loc_Code = String(locCode).trim();
      return t;
    });

    // ========================================================
    // VALIDATION + EXCEL DUPLICATE CHECK
    // ========================================================
    const ErroredData = [];
    const ValidRows = [];
    const excelDuplicateKeys = new Set();

    prepared.forEach((obj, idx) => {
      const rejectionReasons = [];
      const rowLoc = String(obj.Loc_Code || "").trim();
      const vehNorm = normalizeVehicleNumber(obj.Veh_Reg_No);
      const dupKey = buildKey(rowLoc, vehNorm || "");

      // ── Required field validations ──
      if (!vehNorm)
        rejectionReasons.push("Vehicle Registration No is required");
      if (!obj.Cust_Name)
        rejectionReasons.push("Customer Name is required");
      if (!obj.Cust_Mob)
        rejectionReasons.push("Customer Mobile is required");
      if (!obj.Model_Name)
        rejectionReasons.push("Model Name is required");

      if (
        obj.Cust_Mob &&
        !/^[0-9]{10,15}$/.test(String(obj.Cust_Mob).trim())
      ) {
        rejectionReasons.push("Customer Mobile must contain 10 to 15 digits");
      }

      // ── Date validation ──
      const rawDateVal = transformedData[idx]["Last Service Date"];
      if (
        rawDateVal !== "" &&
        rawDateVal !== null &&
        rawDateVal !== undefined &&
        !obj.Last_Service_Date
      ) {
        rejectionReasons.push("Invalid Last Service Date");
      }

      // ── KM validations ──
      if (
        obj.Last_Service_KM !== null &&
        obj.Last_Service_KM !== undefined &&
        (!Number.isFinite(obj.Last_Service_KM) || obj.Last_Service_KM < 0)
      ) {
        rejectionReasons.push("Last Service KM must be a valid non-negative number");
      }

      if (
        obj.Avg_Daily_KM !== null &&
        obj.Avg_Daily_KM !== undefined &&
        (!Number.isFinite(obj.Avg_Daily_KM) || obj.Avg_Daily_KM < 0)
      ) {
        rejectionReasons.push("Average Daily KM must be a valid non-negative number");
      }

      if (
        obj.Current_KM !== null &&
        obj.Current_KM !== undefined &&
        (!Number.isFinite(obj.Current_KM) || obj.Current_KM < 0)
      ) {
        rejectionReasons.push("Current KM must be a valid non-negative number");
      }

      if (
        obj.Last_Service_KM !== null &&
        obj.Last_Service_KM !== undefined &&
        obj.Current_KM !== null &&
        obj.Current_KM !== undefined &&
        Number.isFinite(obj.Current_KM) &&
        Number.isFinite(obj.Last_Service_KM) &&
        obj.Current_KM < obj.Last_Service_KM
      ) {
        rejectionReasons.push("Current KM cannot be less than Last Service KM");
      }

      if (
        obj.Service_Interval_KM !== null &&
        obj.Service_Interval_KM !== undefined &&
        (!Number.isFinite(obj.Service_Interval_KM) || obj.Service_Interval_KM <= 0)
      ) {
        rejectionReasons.push("Service Interval KM must be a valid positive number");
      }

      if (
        obj.Service_Interval_Days !== null &&
        obj.Service_Interval_Days !== undefined &&
        (!Number.isFinite(obj.Service_Interval_Days) || obj.Service_Interval_Days <= 0)
      ) {
        rejectionReasons.push("Service Interval Days must be a valid positive number");
      }

      // ✅ Service Executive Validation
      // Rule: Agar Emp Code hai to name/mobile optional
      //       Agar Emp Code nahi hai to name AUR mobile dono required
      const hasEmpCode = !!obj.srv_exec_Emp_Code;
      const hasName = !!obj.srv_exec_name;
      const hasMobile = !!obj.srv_exec_mobile;

      if (!hasEmpCode) {
        // Emp Code nahi hai to name aur mobile dono required
        if (!hasName) {
          rejectionReasons.push(
            "Service Executive Name is required when Emp Code is not provided"
          );
        }
        if (!hasMobile) {
          rejectionReasons.push(
            "Service Executive Mobile is required when Emp Code is not provided"
          );
        }
      }

      // Agar mobile diya hai to validate karo
      if (
        hasMobile &&
        !/^[0-9]{10,15}$/.test(String(obj.srv_exec_mobile).trim())
      ) {
        rejectionReasons.push(
          "Service Executive Mobile must contain 10 to 15 digits"
        );
      }

      // ── Excel duplicate check ──
      if (vehNorm && excelDuplicateKeys.has(dupKey)) {
        rejectionReasons.push(`Duplicate vehicle ${vehNorm} in Excel file`);
      }
      if (vehNorm) excelDuplicateKeys.add(dupKey);

      if (rejectionReasons.length > 0) {
        ErroredData.push({
          UTD: null,
          Excel_Row: obj.Excel_Row,
          Loc_Code: rowLoc,
          Veh_Reg_No: obj.Veh_Reg_No_Original,
          Cust_Name: obj.Cust_Name,
          Cust_Mob: obj.Cust_Mob,
          Model_Name: obj.Model_Name,
          Last_Service_Date: obj.Last_Service_Date || null,
          Last_Service_KM: obj.Last_Service_KM ?? null,
          Avg_Daily_KM: obj.Avg_Daily_KM ?? null,
          Current_KM: obj.Current_KM ?? null,
          Service_Interval_KM: obj.Service_Interval_KM ?? null,
          Service_Interval_Days: obj.Service_Interval_Days ?? null,
          srv_exec_name: obj.srv_exec_name || null,  // ✅ NEW
          srv_exec_Emp_Code: obj.srv_exec_Emp_Code || null,  // ✅ NEW
          srv_exec_mobile: obj.srv_exec_mobile || null,  // ✅ NEW
          Export_Type: null,
          Import_Status: "Not Imported",
          rejectionReasons: rejectionReasons.join(" | "),
          // Rmd ke liye
          rmd_status: 2, // 2 = failed/rejected
          Created_By: user,
        });
      } else {
        ValidRows.push(obj);
      }
    });

    // ========================================================
    // TRANSACTION START
    // ========================================================
    transaction = await sequelize.transaction();

    // ✅ Failed rows ko Rmd table mein insert karo (transaction ke andar)
    for (const errRow of ErroredData) {
      await insertRmdRowData(
        { ...errRow, Veh_Reg_No_Original: errRow.Veh_Reg_No },
        sequelize,
        transaction
      );
    }

    // ── Koi valid row nahi ──
    if (ValidRows.length === 0) {
      await transaction.commit();

      const wb = XLSX.utils.book_new();
      const rejSheet = XLSX.utils.json_to_sheet(
        ErroredData.length
          ? ErroredData.map((item) => ({
            "Excel Row": item.Excel_Row,
            "Loc Code": item.Loc_Code,
            "Vehicle Registration No": item.Veh_Reg_No || "",
            "Customer Name": item.Cust_Name,
            "Customer Mobile": item.Cust_Mob,
            "Model Name": item.Model_Name,
            "Last Service Date": item.Last_Service_Date || "",
            "Last Service KM": item.Last_Service_KM ?? "",
            "Average Daily KM": item.Avg_Daily_KM ?? "",
            "Current KM": item.Current_KM ?? "",
            "Service Interval KM": item.Service_Interval_KM ?? "",
            "Service Interval Days": item.Service_Interval_Days ?? "",
            "Service Executive Name": item.srv_exec_name || "",  // ✅ NEW
            "Service Executive Emp Code": item.srv_exec_Emp_Code || "",  // ✅ NEW
            "Service Executive Mobile": item.srv_exec_mobile || "",  // ✅ NEW
            "Export Type": item.Export_Type ?? "",
            "Rejection Reason": item.rejectionReasons,
          }))
          : [{ Message: "No rejected records" }]
      );
      XLSX.utils.book_append_sheet(wb, rejSheet, "Non Imported Data");
      const bufferOnlyRej = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
      const base64FileOnlyRej = Buffer.from(bufferOnlyRej).toString("base64");

      return res.status(200).json({
        success: true,
        Type: "warning",
        Inserted: 0,
        Updated: 0,
        NonInserted: ErroredData.length,
        Total: prepared.length,
        Message: "Data is not valid to import",
        InsertedData: [],
        UpdatedData: [],
        ErroredData,
        File: base64FileOnlyRej,
        FileName: "customer_vehicle_import_result.xlsx",
      });
    }

    // ========================================================
    // MASTER LOOKUP
    // ========================================================
    const uniqueLocs = [
      ...new Set(ValidRows.map((r) => String(r.Loc_Code).trim())),
    ];
    const uniqueVehNorms = [
      ...new Set(
        ValidRows
          .map((r) => normalizeVehicleNumber(r.Veh_Reg_No))
          .filter(Boolean)
      ),
    ];

    const masterMap = new Map();

    if (uniqueVehNorms.length > 0) {
      const masterRows = await sequelize.query(
        `SELECT UTD, Loc_Code, Veh_Reg_No
         FROM dbo.Srv_Mst_Vehi_Tbl
         WHERE Loc_Code IN (:locs)
           AND UPPER(REPLACE(REPLACE(Veh_Reg_No, ' ', ''), '-', ''))
               IN (:vehnums)`,
        {
          replacements: { locs: uniqueLocs, vehnums: uniqueVehNorms },
          type: QueryTypes.SELECT,
          transaction,
        }
      );

      masterRows.forEach((m) => {
        const normVeh = normalizeVehicleNumber(m.Veh_Reg_No);
        const key = buildKey(String(m.Loc_Code).trim(), normVeh);
        masterMap.set(key, m.UTD);
      });
    }

    const needMasterKeys = new Map();
    ValidRows.forEach((r) => {
      const norm = normalizeVehicleNumber(r.Veh_Reg_No);
      const key = buildKey(r.Loc_Code, norm);
      if (!masterMap.has(key) && !needMasterKeys.has(key)) {
        needMasterKeys.set(key, {
          locCode: r.Loc_Code,
          vehOriginal: r.Veh_Reg_No_Original || r.Veh_Reg_No || norm,
        });
      }
    });

    // ── STEP 1: Missing Masters Insert ──
    for (const [key, { locCode: mLoc, vehOriginal }] of needMasterKeys.entries()) {
      console.log(`[MASTER INSERT] Loc: ${mLoc} | Veh: ${vehOriginal}`);

      const insertedMst = await sequelize.query(
        `INSERT INTO dbo.Srv_Mst_Vehi_Tbl
         (Loc_Code, Veh_Reg_No, Export_Type, Created_By, Created_At)
         OUTPUT
           INSERTED.UTD,
           INSERTED.Loc_Code,
           INSERTED.Veh_Reg_No
         VALUES
         (:Loc_Code, :Veh_Reg_No, 1, :Created_By, GETDATE())`,
        {
          replacements: {
            Loc_Code: mLoc,
            Veh_Reg_No: vehOriginal,
            Created_By: user,
          },
          type: QueryTypes.SELECT,
          transaction,
        }
      );

      if (!insertedMst || !insertedMst[0]) {
        throw new Error(
          `Master insert failed for Loc: ${mLoc}, Veh: ${vehOriginal}`
        );
      }

      const row = insertedMst[0];
      const normVeh = normalizeVehicleNumber(row.Veh_Reg_No);
      const mk = buildKey(String(row.Loc_Code).trim(), normVeh);
      masterMap.set(mk, row.UTD);

      console.log(`[MASTER INSERT SUCCESS] UTD: ${row.UTD} | Key: ${mk}`);
    }

    // ── STEP 2: Tran_id attach ──
    ValidRows.forEach((r) => {
      const norm = normalizeVehicleNumber(r.Veh_Reg_No);
      const mk = buildKey(r.Loc_Code, norm);
      r.Tran_id = masterMap.get(mk);

      if (!r.Tran_id) {
        console.warn(
          `[WARN] Tran_id not found for Loc: ${r.Loc_Code} | Veh: ${norm}`
        );
      }
    });

    // ── STEP 3: Existing Customer Records ──
    const uniqueTranIds = [
      ...new Set(ValidRows.map((r) => r.Tran_id).filter(Boolean)),
    ];

    const existingCustMap = new Map();

    if (uniqueTranIds.length > 0) {
      const existingCust = await sequelize.query(
        `WITH ranked AS (
           SELECT
             UTD, Loc_Code, Tran_id,
             ROW_NUMBER() OVER (
               PARTITION BY Loc_Code, Tran_id
               ORDER BY Created_At DESC, UTD DESC
             ) AS rn
           FROM dbo.Srv_Cust_Vehi_Tbl
           WHERE Loc_Code IN (:locs)
             AND Tran_id   IN (:tranids)
             AND (Export_Type IS NULL OR Export_Type <> 33)
         )
         SELECT UTD, Loc_Code, Tran_id
         FROM ranked
         WHERE rn = 1`,
        {
          replacements: { locs: uniqueLocs, tranids: uniqueTranIds },
          type: QueryTypes.SELECT,
          transaction,
        }
      );

      existingCust.forEach((c) => {
        const key = buildKey(
          String(c.Loc_Code).trim(),
          String(c.Tran_id)
        );
        existingCustMap.set(key, c.UTD);
      });
    }

    // ── STEP 4: INSERT / UPDATE ──
    const insertedData = [];
    const updatedData = [];

    // ✅ Common INSERT SQL — 3 new service executive columns added
    const insertSQL = `
      INSERT INTO dbo.Srv_Cust_Vehi_Tbl
      (
        Loc_Code, Tran_id, Veh_Reg_No,
        Cust_Name, Cust_Mob, Model_Name,
        Last_Service_Date, Last_Service_KM,
        Avg_Daily_KM, Current_KM,
        Service_Interval_KM, Service_Interval_Days,
        srv_exec_name, srv_exec_Emp_Code, srv_exec_mobile,
        Export_Type, status, Created_By, Created_At
      )
      OUTPUT
        INSERTED.UTD, INSERTED.Loc_Code, INSERTED.Tran_id,
        INSERTED.Veh_Reg_No, INSERTED.Cust_Name, INSERTED.Cust_Mob,
        INSERTED.Model_Name, INSERTED.Last_Service_Date,
        INSERTED.Last_Service_KM, INSERTED.Avg_Daily_KM,
        INSERTED.Current_KM,
        INSERTED.Service_Interval_KM, INSERTED.Service_Interval_Days,
        INSERTED.srv_exec_name, INSERTED.srv_exec_Emp_Code,
        INSERTED.srv_exec_mobile,
        INSERTED.Export_Type
      VALUES
      (
        :Loc_Code, :Tran_id, NULL,
        :Cust_Name, :Cust_Mob, :Model_Name,
        CASE WHEN :Last_Service_Date IS NULL
             THEN NULL
             ELSE CONVERT(date, :Last_Service_Date, 23)
        END,
        :Last_Service_KM, :Avg_Daily_KM, :Current_KM,
        :Service_Interval_KM, :Service_Interval_Days,
        :srv_exec_name, :srv_exec_Emp_Code, :srv_exec_mobile,
        1, :status, :Created_By, GETDATE()
      )`;

    for (const obj of ValidRows) {
      const rowKey = buildKey(obj.Loc_Code, String(obj.Tran_id));

      if (!obj.Tran_id) {
        const errObj = {
          UTD: null,
          Excel_Row: obj.Excel_Row,
          Loc_Code: obj.Loc_Code,
          Veh_Reg_No: obj.Veh_Reg_No_Original,
          Cust_Name: obj.Cust_Name,
          Cust_Mob: obj.Cust_Mob,
          Model_Name: obj.Model_Name,
          Last_Service_Date: obj.Last_Service_Date || null,
          Last_Service_KM: obj.Last_Service_KM ?? null,
          Avg_Daily_KM: obj.Avg_Daily_KM ?? null,
          Current_KM: obj.Current_KM ?? null,
          Service_Interval_KM: obj.Service_Interval_KM ?? null,
          Service_Interval_Days: obj.Service_Interval_Days ?? null,
          srv_exec_name: obj.srv_exec_name || null,  // ✅ NEW
          srv_exec_Emp_Code: obj.srv_exec_Emp_Code || null,  // ✅ NEW
          srv_exec_mobile: obj.srv_exec_mobile || null,  // ✅ NEW
          Export_Type: null,
          Import_Status: "Not Imported",
          rejectionReasons: "Master vehicle record not found or creation failed",
          rmd_status: 2,
          Created_By: user,
        };

        ErroredData.push(errObj);

        // ✅ Rmd mein bhi insert karo
        await insertRmdRowData(
          { ...errObj, Veh_Reg_No_Original: errObj.Veh_Reg_No },
          sequelize,
          transaction
        );
        continue;
      }

      const commonReplacements = {
        Loc_Code: obj.Loc_Code,
        Tran_id: obj.Tran_id,
        Cust_Name: String(obj.Cust_Name || "").trim(),
        Cust_Mob: String(obj.Cust_Mob || "").trim(),
        Model_Name: obj.Model_Name,
        Last_Service_Date: obj.Last_Service_Date || null,
        Last_Service_KM: obj.Last_Service_KM ?? null,
        Avg_Daily_KM: obj.Avg_Daily_KM ?? null,
        Current_KM: obj.Current_KM ?? null,
        Service_Interval_KM: obj.Service_Interval_KM ?? null,
        Service_Interval_Days: obj.Service_Interval_Days ?? null,
        srv_exec_name: obj.srv_exec_name || null,  // ✅ NEW
        srv_exec_Emp_Code: obj.srv_exec_Emp_Code || null,  // ✅ NEW
        srv_exec_mobile: obj.srv_exec_mobile || null,  // ✅ NEW
        status: 0,
        Created_By: user,
      };

      if (existingCustMap.has(rowKey)) {
        // ── UPDATE FLOW ──
        const oldUtd = existingCustMap.get(rowKey);

        await sequelize.query(
          `UPDATE dbo.Srv_Cust_Vehi_Tbl
           SET Export_Type = 33,
               Updated_By  = :Updated_By,
               Updated_At  = GETDATE()
           WHERE UTD = :UTD`,
          {
            replacements: { UTD: oldUtd, Updated_By: user },
            type: QueryTypes.UPDATE,
            transaction,
          }
        );

        const inserted = await sequelize.query(insertSQL, {
          replacements: commonReplacements,
          type: QueryTypes.SELECT,
          transaction,
        });

        const updRow = {
          UTD: inserted[0]?.UTD,
          Old_UTD: oldUtd,
          Excel_Row: obj.Excel_Row,
          Loc_Code: obj.Loc_Code,
          Tran_id: obj.Tran_id,
          Veh_Reg_No: obj.Veh_Reg_No_Original,
          Cust_Name: obj.Cust_Name,
          Cust_Mob: obj.Cust_Mob,
          Model_Name: obj.Model_Name,
          Last_Service_Date: obj.Last_Service_Date || null,
          Last_Service_KM: obj.Last_Service_KM ?? null,
          Avg_Daily_KM: obj.Avg_Daily_KM ?? null,
          Current_KM: obj.Current_KM ?? null,
          Service_Interval_KM: obj.Service_Interval_KM ?? null,
          Service_Interval_Days: obj.Service_Interval_Days ?? null,
          srv_exec_name: obj.srv_exec_name || null,  // ✅ NEW
          srv_exec_Emp_Code: obj.srv_exec_Emp_Code || null,  // ✅ NEW
          srv_exec_mobile: obj.srv_exec_mobile || null,  // ✅ NEW
          Export_Type: 1,
          Import_Status: "Updated",
          rejectionReasons: "",
          rmd_status: 1, // 1 = success
          Created_By: user,
        };

        updatedData.push(updRow);

        // ✅ Rmd mein bhi insert karo
        await insertRmdRowData(
          { ...updRow, Veh_Reg_No_Original: updRow.Veh_Reg_No },
          sequelize,
          transaction
        );

      } else {
        // ── INSERT FLOW ──
        const inserted = await sequelize.query(insertSQL, {
          replacements: commonReplacements,
          type: QueryTypes.SELECT,
          transaction,
        });

        const insRow = {
          UTD: inserted[0]?.UTD,
          Excel_Row: obj.Excel_Row,
          Loc_Code: obj.Loc_Code,
          Tran_id: obj.Tran_id,
          Veh_Reg_No: obj.Veh_Reg_No_Original,
          Cust_Name: obj.Cust_Name,
          Cust_Mob: obj.Cust_Mob,
          Model_Name: obj.Model_Name,
          Last_Service_Date: obj.Last_Service_Date || null,
          Last_Service_KM: obj.Last_Service_KM ?? null,
          Avg_Daily_KM: obj.Avg_Daily_KM ?? null,
          Current_KM: obj.Current_KM ?? null,
          Service_Interval_KM: obj.Service_Interval_KM ?? null,
          Service_Interval_Days: obj.Service_Interval_Days ?? null,
          srv_exec_name: obj.srv_exec_name || null,  // ✅ NEW
          srv_exec_Emp_Code: obj.srv_exec_Emp_Code || null,  // ✅ NEW
          srv_exec_mobile: obj.srv_exec_mobile || null,  // ✅ NEW
          Export_Type: 1,
          Import_Status: "Imported",
          rejectionReasons: "",
          rmd_status: 1, // 1 = success
          Created_By: user,
        };

        insertedData.push(insRow);

        // ✅ Rmd mein bhi insert karo
        await insertRmdRowData(
          { ...insRow, Veh_Reg_No_Original: insRow.Veh_Reg_No },
          sequelize,
          transaction
        );
      }
    }

    await transaction.commit();

    // ========================================================
    // RESULT EXCEL
    // ========================================================
    const resultWorkbook = XLSX.utils.book_new();
    const allSuccessData = [...insertedData, ...updatedData];

    const importedExcelData = allSuccessData.map((item) => ({
      UTD: item.UTD,
      ...(item.Old_UTD ? { "Old UTD": item.Old_UTD } : {}),
      "Excel Row": item.Excel_Row,
      "Loc Code": item.Loc_Code,
      "Tran Id (Master UTD)": item.Tran_id || "",
      "Vehicle Registration No": item.Veh_Reg_No || "",
      "Customer Name": item.Cust_Name,
      "Customer Mobile": item.Cust_Mob,
      "Model Name": item.Model_Name,
      "Last Service Date": item.Last_Service_Date || "",
      "Last Service KM": item.Last_Service_KM ?? "",
      "Average Daily KM": item.Avg_Daily_KM ?? "",
      "Current KM": item.Current_KM ?? "",
      "Service Interval KM": item.Service_Interval_KM ?? "",
      "Service Interval Days": item.Service_Interval_Days ?? "",
      "Service Executive Name": item.srv_exec_name || "",  // ✅ NEW
      "Service Executive Emp Code": item.srv_exec_Emp_Code || "",  // ✅ NEW
      "Service Executive Mobile": item.srv_exec_mobile || "",  // ✅ NEW
      "Export Type": item.Export_Type,
      Status: item.Import_Status,
    }));

    const erroredExcelData = ErroredData.map((item) => ({
      "Excel Row": item.Excel_Row,
      "Loc Code": item.Loc_Code,
      "Vehicle Registration No": item.Veh_Reg_No || "",
      "Customer Name": item.Cust_Name,
      "Customer Mobile": item.Cust_Mob,
      "Model Name": item.Model_Name,
      "Last Service Date": item.Last_Service_Date || "",
      "Last Service KM": item.Last_Service_KM ?? "",
      "Average Daily KM": item.Avg_Daily_KM ?? "",
      "Current KM": item.Current_KM ?? "",
      "Service Interval KM": item.Service_Interval_KM ?? "",
      "Service Interval Days": item.Service_Interval_Days ?? "",
      "Service Executive Name": item.srv_exec_name || "",  // ✅ NEW
      "Service Executive Emp Code": item.srv_exec_Emp_Code || "",  // ✅ NEW
      "Service Executive Mobile": item.srv_exec_mobile || "",  // ✅ NEW
      "Export Type": item.Export_Type ?? "",
      "Rejection Reason": item.rejectionReasons,
    }));

    const importedSheet = XLSX.utils.json_to_sheet(
      importedExcelData.length
        ? importedExcelData
        : [{ Message: "No records imported or updated" }]
    );
    XLSX.utils.book_append_sheet(resultWorkbook, importedSheet, "Imported Data");

    const rejectedSheet = XLSX.utils.json_to_sheet(
      erroredExcelData.length
        ? erroredExcelData
        : [{ Message: "No rejected records" }]
    );
    XLSX.utils.book_append_sheet(resultWorkbook, rejectedSheet, "Non Imported Data");

    const buffer = XLSX.write(resultWorkbook, { type: "buffer", bookType: "xlsx" });
    const base64File = Buffer.from(buffer).toString("base64");

    // ========================================================
    // RESPONSE
    // ========================================================
    const insertedCount = insertedData.length;
    const updatedCount = updatedData.length;
    const totalSuccess = allSuccessData.length;

    return res.status(200).json({
      success: true,
      Type: totalSuccess > 0 ? "success" : "warning",
      Inserted: insertedCount,
      Updated: updatedCount,
      NonInserted: ErroredData.length,
      Total: prepared.length,
      Message:
        totalSuccess > 0
          ? `${insertedCount} records inserted, ${updatedCount} records updated successfully`
          : "Data is not valid to import",
      InsertedData: insertedData,
      UpdatedData: updatedData,
      ErroredData,
      File: base64File,
      FileName: "customer_vehicle_import_result.xlsx",
    });

  } catch (error) {
    await safeRollback(transaction);
    console.error("Customer Vehicle Import Error:", error);
    return res.status(500).json({
      success: false,
      Message: "An error occurred during customer vehicle import.",
      error: error.message,
    });
  } finally {
    if (sequelize) {
      await sequelize.close();
    }
  }
};




// ============================================================
// HELPERS
// ============================================================



// ============================================================
// 1) SUMMARY (CARDS + BREAKDOWNS) — base filters only
//    Allowed filters: Loc_Code (single/array/comma-separated), Model_Name (optional)
//    Ignores: search, Reminder_Status, Service_Status, Appointment_Status,
//             fromDate, toDate, dueToday, overdue, unknown
// ============================================================

// ============================================================
exports.getDashboardSummary = async function (req, res) {
  let sequelize;
  try {
    const body = req.body || {};
    const { Loc_Code, Model_Name, showClosed = false } = body;
    sequelize = await dbname(req, req.headers.compcode);

    const createdBy = getLoginUserId(req, body);
    try {
      await autoGenerateRemindersForAll(sequelize, createdBy);
    } catch (autoGenErr) {
      console.error("[DASHBOARD SUMMARY AUTO-GEN] Error:", autoGenErr?.message);
    }

    const normalizedShowClosed = (() => {
      if (showClosed === "all" || showClosed === "ALL") return "all";
      if (
        showClosed === true ||
        showClosed === 1 ||
        showClosed === "1" ||
        showClosed === "true" ||
        showClosed === "closed"
      )
        return "closed";
      return "active";
    })();

    let whereBase = ` WHERE 1 = 1 `;
    const replBase = {};

    if (normalizedShowClosed === "active") {
      whereBase += ` AND ISNULL(r.status, 1) = 1 `;
    } else if (normalizedShowClosed === "closed") {
      whereBase += ` AND ISNULL(r.status, 1) = 0 `;
    }

    const locCodes = toLocCodeArray(Loc_Code);
    if (locCodes.length === 1) {
      whereBase += ` AND LTRIM(RTRIM(CAST(COALESCE(r.Loc_Code, c.Loc_Code, '') AS VARCHAR(50)))) = :Loc_Code `;
      replBase.Loc_Code = locCodes[0];
    } else if (locCodes.length > 1) {
      const locPlaceholders = locCodes.map((_, i) => `:locCode_${i}`).join(", ");
      whereBase += ` AND LTRIM(RTRIM(CAST(COALESCE(r.Loc_Code, c.Loc_Code, '') AS VARCHAR(50)))) IN (${locPlaceholders}) `;
      locCodes.forEach((code, i) => {
        replBase[`locCode_${i}`] = code;
      });
    }

    if (Model_Name) {
      whereBase += ` AND UPPER(LTRIM(RTRIM(c.Model_Name))) = UPPER(LTRIM(RTRIM(:Model_Name))) `;
      replBase.Model_Name = String(Model_Name);
    }

    const baseFrom = `
      FROM dbo.Srv_Reminder_Tbl r
      INNER JOIN dbo.Srv_Cust_Vehi_Tbl c 
        ON c.UTD = r.Cust_Vehi_UTD
       AND c.Export_Type = 1
      LEFT  JOIN dbo.Srv_Mst_Vehi_Tbl  m ON m.UTD = c.Tran_id
      LEFT  JOIN dbo.Misc_Mst mm
             ON mm.Misc_Type = 85
            AND LTRIM(RTRIM(CAST(mm.Misc_Code AS NVARCHAR(50)))) =
                LTRIM(RTRIM(CAST(r.Loc_Code  AS NVARCHAR(50))))
    `;

    const totalsRow = await sequelize.query(
      `SELECT
         COUNT(*) AS totalReminders,
         SUM(CASE WHEN ISNULL(r.Service_Status,'') = 'COMPLETED' THEN 1 ELSE 0 END) AS completedReminders,
         SUM(CASE WHEN (
                    r.Final_Due_Date IS NULL
                    OR LTRIM(RTRIM(CONVERT(varchar(50), r.Final_Due_Date))) = ''
                    OR CAST(r.Final_Due_Date AS DATE) = '1900-01-01'
                    OR LOWER(CONVERT(varchar(50), r.Final_Due_Date)) = 'null'
                    OR r.Reminder_Date IS NULL
                    OR r.Reminder_Status = 'UNKNOWN'
                  )
                  AND ISNULL(r.Service_Status,'') <> 'COMPLETED'
             THEN 1 ELSE 0 END) AS unknownReminders,
         SUM(CASE WHEN (
                    r.Final_Due_Date IS NOT NULL
                    AND LTRIM(RTRIM(CONVERT(varchar(50), r.Final_Due_Date))) <> ''
                    AND CAST(r.Final_Due_Date AS DATE) <> '1900-01-01'
                    AND LOWER(CONVERT(varchar(50), r.Final_Due_Date)) <> 'null'
                  )
                  AND CAST(r.Final_Due_Date AS DATE) = CONVERT(date, GETDATE())
                  AND ISNULL(r.Service_Status,'') <> 'COMPLETED'
             THEN 1 ELSE 0 END) AS dueTodayReminders,
         SUM(CASE WHEN (
                    r.Final_Due_Date IS NOT NULL
                    AND LTRIM(RTRIM(CONVERT(varchar(50), r.Final_Due_Date))) <> ''
                    AND CAST(r.Final_Due_Date AS DATE) <> '1900-01-01'
                    AND LOWER(CONVERT(varchar(50), r.Final_Due_Date)) <> 'null'
                  )
                  AND CAST(r.Final_Due_Date AS DATE) < CONVERT(date, GETDATE())
                  AND ISNULL(r.Service_Status,'') <> 'COMPLETED'
             THEN 1 ELSE 0 END) AS overdueReminders,
         SUM(CASE WHEN (
                    r.Final_Due_Date IS NOT NULL
                    AND LTRIM(RTRIM(CONVERT(varchar(50), r.Final_Due_Date))) <> ''
                    AND CAST(r.Final_Due_Date AS DATE) <> '1900-01-01'
                    AND LOWER(CONVERT(varchar(50), r.Final_Due_Date)) <> 'null'
                  )
                  AND CAST(r.Final_Due_Date AS DATE) > CONVERT(date, GETDATE())
                  AND ISNULL(r.Service_Status,'') <> 'COMPLETED'
             THEN 1 ELSE 0 END) AS upcomingReminders
       ${baseFrom}
       ${whereBase}`,
      { replacements: replBase, type: QueryTypes.SELECT }
    );

    const reminderStatus = await sequelize.query(
      `SELECT ISNULL(r.Reminder_Status, 'UNKNOWN') AS Reminder_Status, COUNT(*) AS cnt
       ${baseFrom} ${whereBase}
       GROUP BY ISNULL(r.Reminder_Status, 'UNKNOWN')
       ORDER BY cnt DESC`,
      { replacements: replBase, type: QueryTypes.SELECT }
    );

    const serviceStatus = await sequelize.query(
      `SELECT ISNULL(r.Service_Status, 'PENDING') AS Service_Status, COUNT(*) AS cnt
       ${baseFrom} ${whereBase}
       GROUP BY ISNULL(r.Service_Status, 'PENDING')
       ORDER BY cnt DESC`,
      { replacements: replBase, type: QueryTypes.SELECT }
    );

    const appointmentStatus = await sequelize.query(
      `SELECT ISNULL(r.Appointment_Status, 'NONE') AS Appointment_Status, COUNT(*) AS cnt
       ${baseFrom} ${whereBase}
       GROUP BY ISNULL(r.Appointment_Status, 'NONE')
       ORDER BY cnt DESC`,
      { replacements: replBase, type: QueryTypes.SELECT }
    );

    const channels = await sequelize.query(
      `SELECT ISNULL(r.Reminder_Channel, 'UNKNOWN') AS Reminder_Channel, COUNT(*) AS cnt
       ${baseFrom} ${whereBase}
       GROUP BY ISNULL(r.Reminder_Channel, 'UNKNOWN')
       ORDER BY cnt DESC`,
      { replacements: replBase, type: QueryTypes.SELECT }
    );

    const branches = await sequelize.query(
      `SELECT r.Loc_Code, COALESCE(mm.Misc_Name, r.Loc_Code) AS Loc_Name, COUNT(*) AS cnt
       ${baseFrom} ${whereBase}
       GROUP BY r.Loc_Code, COALESCE(mm.Misc_Name, r.Loc_Code)
       ORDER BY cnt DESC`,
      { replacements: replBase, type: QueryTypes.SELECT }
    );

    const topModels = await sequelize.query(
      `SELECT TOP 10 c.Model_Name, COUNT(*) AS cnt
       ${baseFrom} ${whereBase}
       AND c.Model_Name IS NOT NULL AND LTRIM(RTRIM(c.Model_Name)) <> ''
       GROUP BY c.Model_Name
       ORDER BY cnt DESC, c.Model_Name ASC`,
      { replacements: replBase, type: QueryTypes.SELECT }
    );

    // Vehicle totals
    let vehWhere = ` WHERE 1=1 `;
    const vehRepl = {};
    if (locCodes.length === 1) {
      vehWhere += ` AND m.Loc_Code = :Loc_Code `;
      vehRepl.Loc_Code = locCodes[0];
    } else if (locCodes.length > 1) {
      const lp = locCodes.map((_, i) => `:locCode_${i}`).join(", ");
      vehWhere += ` AND m.Loc_Code IN (${lp}) `;
      locCodes.forEach((c, i) => { vehRepl[`locCode_${i}`] = c; });
    }

    const totalMasterVehiclesActive = await sequelize.query(
      `SELECT COUNT(*) AS total
       FROM dbo.Srv_Mst_Vehi_Tbl m
       ${vehWhere}
       AND (m.Export_Type = 1 OR m.Export_Type IS NULL)`,
      { replacements: vehRepl, type: QueryTypes.SELECT }
    );

    let custVehWhere = ` WHERE c.Export_Type = 1 `;
    const custVehRepl = {};
    if (locCodes.length === 1) {
      custVehWhere += ` AND c.Loc_Code = :Loc_Code `;
      custVehRepl.Loc_Code = locCodes[0];
    } else if (locCodes.length > 1) {
      const lp = locCodes.map((_, i) => `:locCode_${i}`).join(", ");
      custVehWhere += ` AND c.Loc_Code IN (${lp}) `;
      locCodes.forEach((c, i) => { custVehRepl[`locCode_${i}`] = c; });
    }
    if (Model_Name) {
      custVehWhere += ` AND UPPER(LTRIM(RTRIM(c.Model_Name))) = UPPER(LTRIM(RTRIM(:Model_Name))) `;
      custVehRepl.Model_Name = String(Model_Name);
    }

    const totalActiveCustomerVehicles = await sequelize.query(
      `SELECT COUNT(*) AS total FROM dbo.Srv_Cust_Vehi_Tbl c ${custVehWhere}`,
      { replacements: custVehRepl, type: QueryTypes.SELECT }
    );

    return res.status(200).send({
      success: true,
      baseFilters: {
        Loc_Codes: locCodes,
        Model_Name: Model_Name || null,
        showClosed: normalizedShowClosed,
      },
      metrics: {
        totals: {
          totalReminders: Number(totalsRow?.[0]?.totalReminders || 0),
          dueToday: Number(totalsRow?.[0]?.dueTodayReminders || 0),
          overdue: Number(totalsRow?.[0]?.overdueReminders || 0),
          upcoming: Number(totalsRow?.[0]?.upcomingReminders || 0),
          completed: Number(totalsRow?.[0]?.completedReminders || 0),
          unknown: Number(totalsRow?.[0]?.unknownReminders || 0),
          totalMasterVehiclesActive: Number(totalMasterVehiclesActive?.[0]?.total || 0),
          totalActiveCustomerVehicles: Number(totalActiveCustomerVehicles?.[0]?.total || 0),
        },
        breakdowns: {
          reminderStatus,
          serviceStatus,
          appointmentStatus,
          channels,
          branches,
          topModels,
        },
      },
    });
  } catch (error) {
    console.error("Dashboard Summary Error:", error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  } finally {
    if (sequelize) await sequelize.close();
  }
};

// ============================================================
exports.getDashboardTable = async function (req, res) {
  let sequelize;
  try {
    sequelize = await dbname(req, req.headers.compcode);
    const body = req.body || {};

    const createdBy = getLoginUserId(req, body);
    try {
      await autoGenerateRemindersForAll(sequelize, createdBy);
    } catch (autoGenErr) {
      console.error("[DASHBOARD TABLE AUTO-GEN] Error:", autoGenErr?.message);
    }

    const {
      page = 1,
      pageSize = 10,
      search,
      Loc_Code,
      Model_Name,
      Reminder_Status,
      Service_Status,
      Appointment_Status,
      fromDate,
      toDate,
      dateFilterType = "due_date",
      dueToday,
      overdue,
      upcoming,   // ✅ NEW
      unknown,
      showClosed = false,
    } = body;

    const normalizedShowClosed = (() => {
      if (showClosed === "all" || showClosed === "ALL") return "all";
      if (
        showClosed === true ||
        showClosed === 1 ||
        showClosed === "1" ||
        showClosed === "true" ||
        showClosed === "closed"
      )
        return "closed";
      return "active";
    })();

    const allowedDateFilterTypes = ["due_date", "reminder_date"];
    const normalizedDateFilterType = allowedDateFilterTypes.includes(
      String(dateFilterType).toLowerCase().trim()
    )
      ? String(dateFilterType).toLowerCase().trim()
      : "due_date";

    const dateColumn =
      normalizedDateFilterType === "reminder_date"
        ? "r.Reminder_Date"
        : "r.Final_Due_Date";

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(pageSize, 10) || 10, 1), 500);
    const offset = (pageNum - 1) * limit;

    let where = ` WHERE 1 = 1 `;
    const repl = { offset, limit };

    // Status filter
    if (normalizedShowClosed === "active") {
      where += ` AND ISNULL(r.status, 1) = 1 `;
    } else if (normalizedShowClosed === "closed") {
      where += ` AND ISNULL(r.status, 1) = 0 `;
    }

    // Loc_Code
    const locCodes = toLocCodeArray(Loc_Code);
    if (locCodes.length === 1) {
      where += ` AND LTRIM(RTRIM(CAST(COALESCE(r.Loc_Code, c.Loc_Code, '') AS VARCHAR(50)))) = :Loc_Code `;
      repl.Loc_Code = locCodes[0];
    } else if (locCodes.length > 1) {
      const lp = locCodes.map((_, i) => `:locCode_${i}`).join(", ");
      where += ` AND LTRIM(RTRIM(CAST(COALESCE(r.Loc_Code, c.Loc_Code, '') AS VARCHAR(50)))) IN (${lp}) `;
      locCodes.forEach((code, i) => { repl[`locCode_${i}`] = code; });
    }

    // Model_Name
    if (Model_Name) {
      where += ` AND UPPER(LTRIM(RTRIM(c.Model_Name))) = UPPER(LTRIM(RTRIM(:Model_Name))) `;
      repl.Model_Name = String(Model_Name);
    }

    // Reminder_Status
    if (Reminder_Status) {
      where += ` AND ISNULL(r.Reminder_Status, 'UNKNOWN') = :Reminder_Status `;
      repl.Reminder_Status = String(Reminder_Status);
    }

    // Service_Status
    if (Service_Status) {
      where += ` AND ISNULL(r.Service_Status, 'PENDING') = :Service_Status `;
      repl.Service_Status = String(Service_Status);
    }

    // Appointment_Status
    if (Appointment_Status) {
      where += ` AND ISNULL(r.Appointment_Status, 'NONE') = :Appointment_Status `;
      repl.Appointment_Status = String(Appointment_Status);
    }

    // Date range
    if (fromDate) {
      const d = convertDate(fromDate);
      if (!d) return res.status(400).send({ success: false, message: "Invalid fromDate" });
      where += ` AND CAST(${dateColumn} AS DATE) >= CONVERT(date, :fromDate, 23) `;
      repl.fromDate = d;
    }

    if (toDate) {
      const d = convertDate(toDate);
      if (!d) return res.status(400).send({ success: false, message: "Invalid toDate" });
      where += ` AND CAST(${dateColumn} AS DATE) <= CONVERT(date, :toDate, 23) `;
      repl.toDate = d;
    }

    // dueToday
    if (dueToday === true || dueToday === 1 || dueToday === "1") {
      where += `
        AND r.Final_Due_Date IS NOT NULL
        AND LTRIM(RTRIM(CONVERT(varchar(50), r.Final_Due_Date))) <> ''
        AND CAST(r.Final_Due_Date AS DATE) <> '1900-01-01'
        AND LOWER(CONVERT(varchar(50), r.Final_Due_Date)) <> 'null'
        AND CAST(r.Final_Due_Date AS DATE) = CONVERT(date, GETDATE())
        AND ISNULL(r.Service_Status, 'PENDING') <> 'COMPLETED'
      `;
    }

    // overdue
    if (overdue === true || overdue === 1 || overdue === "1") {
      where += `
        AND r.Final_Due_Date IS NOT NULL
        AND LTRIM(RTRIM(CONVERT(varchar(50), r.Final_Due_Date))) <> ''
        AND CAST(r.Final_Due_Date AS DATE) <> '1900-01-01'
        AND LOWER(CONVERT(varchar(50), r.Final_Due_Date)) <> 'null'
        AND CAST(r.Final_Due_Date AS DATE) < CONVERT(date, GETDATE())
        AND ISNULL(r.Service_Status, 'PENDING') <> 'COMPLETED'
      `;
    }

    // ✅ upcoming (NEW - properly handled)
    if (upcoming === true || upcoming === 1 || upcoming === "1") {
      where += `
        AND r.Final_Due_Date IS NOT NULL
        AND LTRIM(RTRIM(CONVERT(varchar(50), r.Final_Due_Date))) <> ''
        AND CAST(r.Final_Due_Date AS DATE) <> '1900-01-01'
        AND LOWER(CONVERT(varchar(50), r.Final_Due_Date)) <> 'null'
        AND CAST(r.Final_Due_Date AS DATE) > CONVERT(date, GETDATE())
        AND ISNULL(r.Service_Status, 'PENDING') <> 'COMPLETED'
      `;
    }

    // unknown
    if (unknown === true || unknown === 1 || unknown === "1") {
      where += `
        AND (
          r.Final_Due_Date IS NULL
          OR LTRIM(RTRIM(CONVERT(varchar(50), r.Final_Due_Date))) = ''
          OR CAST(r.Final_Due_Date AS DATE) = '1900-01-01'
          OR LOWER(CONVERT(varchar(50), r.Final_Due_Date)) = 'null'
          OR r.Reminder_Date IS NULL
          OR r.Reminder_Status = 'UNKNOWN'
        )
        AND ISNULL(r.Service_Status, 'PENDING') <> 'COMPLETED'
      `;
    }

    // Search
    if (search) {
      const raw = String(search).trim();
      const searchLike = `%${raw}%`;
      const searchNorm = `%${raw.replace(/[ \-]/g, "")}%`;
      where += `
        AND (
          UPPER(m.Veh_Reg_No) LIKE UPPER(:search)
          OR UPPER(REPLACE(REPLACE(m.Veh_Reg_No, ' ', ''), '-', '')) LIKE UPPER(:searchNorm)
          OR UPPER(c.Cust_Name)  LIKE UPPER(:search)
          OR UPPER(c.Cust_Mob)   LIKE UPPER(:search)
          OR UPPER(c.Model_Name) LIKE UPPER(:search)
        )
      `;
      repl.search = searchLike;
      repl.searchNorm = searchNorm;
    }

    const baseFrom = `
      FROM dbo.Srv_Reminder_Tbl r
      INNER JOIN dbo.Srv_Cust_Vehi_Tbl c 
        ON c.UTD = r.Cust_Vehi_UTD
       AND c.Export_Type = 1
      LEFT  JOIN dbo.Srv_Mst_Vehi_Tbl  m ON m.UTD = c.Tran_id
      LEFT  JOIN dbo.Misc_Mst mm
             ON mm.Misc_Type = 85
            AND LTRIM(RTRIM(CAST(mm.Misc_Code AS NVARCHAR(50)))) =
                LTRIM(RTRIM(CAST(r.Loc_Code  AS NVARCHAR(50))))
    `;

    const countResult = await sequelize.query(
      `SELECT COUNT(*) AS total ${baseFrom} ${where}`,
      { replacements: repl, type: QueryTypes.SELECT }
    );
    const totalRecords = Number(countResult?.[0]?.total || 0);
    const totalPages = totalRecords === 0 ? 0 : Math.ceil(totalRecords / limit);

    const data = await sequelize.query(
      `SELECT
         r.UTD,
         r.Cust_Vehi_UTD,
         r.Service_Rule_UTD,
         r.Loc_Code,
         COALESCE(mm.Misc_Name, r.Loc_Code) AS Loc_Name,

         c.UTD      AS Cust_UTD,
         c.Tran_id,
         m.Veh_Reg_No,
         c.Cust_Name,
         c.Cust_Mob,
         c.Model_Name,

         CONVERT(varchar(10), r.Last_Service_Date,     23) AS Last_Service_Date,
         r.Last_Service_KM,
         r.Avg_Daily_KM,
         r.Next_Service_KM,
         r.Current_KM,

         CONVERT(varchar(10), r.Date_Based_Due_Date,   23) AS Date_Based_Due_Date,
         CONVERT(varchar(10), r.KM_Based_Due_Date,     23) AS KM_Based_Due_Date,
         CONVERT(varchar(10), r.Final_Due_Date,        23) AS Final_Due_Date,

         CONVERT(varchar(10), r.Reminder_Date,         23) AS Reminder_Date,
         r.Reminder_Type,
         r.Reminder_Channel,
         r.Reminder_Status,
         r.Reminder_Count,
         CONVERT(varchar(19), r.Last_Reminder_At, 120)     AS Last_Reminder_At,

         r.Call_Status,
         r.Customer_Response,
         CONVERT(varchar(10), r.Followup_Date,         23) AS Followup_Date,
         r.Followup_Remark,
         r.Current_KM_Verified,
         r.Contacted_By,

         CONVERT(varchar(10), r.Appointment_Date,      23) AS Appointment_Date,
         CONVERT(varchar(8),  r.Appointment_Time,     108) AS Appointment_Time,
         r.Appointment_Status,
         r.Appointment_Remark,

         r.Service_Status,
         CONVERT(varchar(10), r.Service_Completed_Date, 23) AS Service_Completed_Date,
         r.Service_Completed_KM,
         r.Service_Remark,

         r.status,
         r.Created_By,
         CONVERT(varchar(19), r.Created_At,  120) AS Created_At,
         r.Updated_By,
         CONVERT(varchar(19), r.Updated_At,  120) AS Updated_At,

         CASE
           WHEN ISNULL(r.Service_Status,'') = 'COMPLETED' THEN 'COMPLETED'
           WHEN (
             r.Final_Due_Date IS NULL
             OR LTRIM(RTRIM(CONVERT(varchar(50), r.Final_Due_Date))) = ''
             OR CAST(r.Final_Due_Date AS DATE) = '1900-01-01'
             OR LOWER(CONVERT(varchar(50), r.Final_Due_Date)) = 'null'
           ) THEN 'UNKNOWN'
           WHEN CAST(r.Final_Due_Date AS DATE) = CONVERT(date, GETDATE()) THEN 'DUE_TODAY'
           WHEN CAST(r.Final_Due_Date AS DATE) < CONVERT(date, GETDATE()) THEN 'OVERDUE'
           ELSE 'UPCOMING'
         END AS Due_Status,

         r.Next_Service_KM AS KM_Due_At,
         r.Last_Service_KM AS KM_Last,
         (ISNULL(r.Next_Service_KM, 0) - ISNULL(r.Last_Service_KM, 0)) AS KM_Interval,

         CASE
           WHEN (
             r.Final_Due_Date IS NULL
             OR LTRIM(RTRIM(CONVERT(varchar(50), r.Final_Due_Date))) = ''
             OR CAST(r.Final_Due_Date AS DATE) = '1900-01-01'
             OR LOWER(CONVERT(varchar(50), r.Final_Due_Date)) = 'null'
           ) THEN NULL
           ELSE DATEDIFF(day, CONVERT(date, GETDATE()), CAST(r.Final_Due_Date AS DATE))
         END AS Days_Until_Due,

         CASE
           WHEN r.Reminder_Date IS NULL THEN NULL
           ELSE DATEDIFF(day, CONVERT(date, GETDATE()), CAST(r.Reminder_Date AS DATE))
         END AS Days_Until_Reminder

       ${baseFrom}
       ${where}

       ORDER BY
         CASE
           WHEN ISNULL(r.Service_Status,'') = 'COMPLETED'                THEN 4
           WHEN (
             r.Final_Due_Date IS NULL
             OR LTRIM(RTRIM(CONVERT(varchar(50), r.Final_Due_Date))) = ''
             OR CAST(r.Final_Due_Date AS DATE) = '1900-01-01'
           )                                                              THEN 5
           WHEN CAST(r.Final_Due_Date AS DATE) = CONVERT(date, GETDATE()) THEN 1
           WHEN CAST(r.Final_Due_Date AS DATE) < CONVERT(date, GETDATE()) THEN 2
           ELSE                                                               3
         END ASC,
         CAST(r.Final_Due_Date AS DATE) ASC,
         r.UTD ASC

       OFFSET :offset ROWS
       FETCH NEXT :limit ROWS ONLY`,
      { replacements: repl, type: QueryTypes.SELECT }
    );

    return res.status(200).send({
      success: true,
      filtersApplied: {
        Loc_Codes: locCodes,
        Model_Name: Model_Name || null,
        Reminder_Status: Reminder_Status || null,
        Service_Status: Service_Status || null,
        Appointment_Status: Appointment_Status || null,
        dateFilterType: normalizedDateFilterType,
        dateFilterColumn:
          normalizedDateFilterType === "reminder_date"
            ? "Reminder_Date"
            : "Final_Due_Date",
        fromDate: fromDate || null,
        toDate: toDate || null,
        dueToday: !!(dueToday === true || dueToday === 1 || dueToday === "1"),
        overdue: !!(overdue === true || overdue === 1 || overdue === "1"),
        upcoming: !!(upcoming === true || upcoming === 1 || upcoming === "1"),
        unknown: !!(unknown === true || unknown === 1 || unknown === "1"),
        search: search || null,
        showClosed: normalizedShowClosed,
      },
      list: {
        data,
        pagination: {
          currentPage: pageNum,
          pageSize: limit,
          totalRecords,
          totalPages,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
      },
    });
  } catch (error) {
    console.error("Dashboard Table Error:", error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  } finally {
    if (sequelize) await sequelize.close();
  }
};



// ============================================================
// GET ALL — Jinke reminder/call ja chuka hai
// ============================================================
exports.getCalledReminders = async function (req, res) {
  let sequelize;

  try {
    sequelize = await dbname(req, req.headers.compcode);

    const body = req.body || {};

    // ============================================================
    // PAGINATION
    // ============================================================
    const page = Math.max(1, parseInt(body.page || req.query.page || 1));
    const pageSize = Math.min(500, Math.max(1, parseInt(body.pageSize || req.query.pageSize || 10)));
    const offset = (page - 1) * pageSize;

    // ============================================================
    // FILTERS
    // ============================================================
    const search = body.search || req.query.search || "";
    const fromDate = body.fromDate || req.query.fromDate || "";
    const toDate = body.toDate || req.query.toDate || "";

    // ── Loc_Code: single "3" ya multiple "3,2" dono handle ────
    const locCodeRaw = body.Loc_Code || req.query.Loc_Code || "";
    const locCodeList = locCodeRaw
      ? locCodeRaw
        .toString()
        .split(",")
        .map((x) => x.trim())
        .filter((x) => x !== "")
      : [];

    console.log("[CALLED-REMINDERS] Request:", {
      page, pageSize, search, fromDate, toDate,
      locCodes: locCodeList,
    });

    // ============================================================
    // WHERE CLAUSES
    // ============================================================
    const whereClauses = [];
    const replacements = {};

    // ── Base condition: Reminder ja chuka hai ──────────────────
    whereClauses.push(`(
      ISNULL(r.Reminder_Count, 0) > 0
      OR r.Call_Status      IS NOT NULL
      OR r.Last_Reminder_At IS NOT NULL
      OR r.Reminder_Channel IS NOT NULL
    )`);

    // ── Status = active ────────────────────────────────────────
    whereClauses.push(`r.status = 1`);

    // ── Search ─────────────────────────────────────────────────
    if (search.trim()) {
      whereClauses.push(`(
        c.Cust_Name     LIKE :search
        OR c.Cust_Mob   LIKE :search
        OR m.Veh_Reg_No LIKE :search
        OR c.Model_Name LIKE :search
      )`);
      replacements.search = `%${search.trim()}%`;
    }

    // ── Date filter ────────────────────────────────────────────
    if (fromDate.trim()) {
      whereClauses.push(
        `CAST(ISNULL(r.Last_Reminder_At, r.Reminder_Date) AS DATE) >= CONVERT(date, :fromDate, 23)`
      );
      replacements.fromDate = fromDate.trim();
    }
    if (toDate.trim()) {
      whereClauses.push(
        `CAST(ISNULL(r.Last_Reminder_At, r.Reminder_Date) AS DATE) <= CONVERT(date, :toDate, 23)`
      );
      replacements.toDate = toDate.trim();
    }

    // ── Location filter: single ya multiple ───────────────────
    if (locCodeList.length === 1) {
      whereClauses.push(`r.Loc_Code = :locCode`);
      replacements.locCode = locCodeList[0];
    } else if (locCodeList.length > 1) {
      const locPlaceholders = locCodeList
        .map((_, i) => `:locCode${i}`)
        .join(", ");
      whereClauses.push(`r.Loc_Code IN (${locPlaceholders})`);
      locCodeList.forEach((code, i) => {
        replacements[`locCode${i}`] = code;
      });
    }

    const whereSQL =
      whereClauses.length > 0
        ? `WHERE ${whereClauses.join("\n      AND ")}`
        : "";

    // ============================================================
    // COUNT QUERY → Unique Vehicles (Veh_Reg_No basis pe)
    // ============================================================
    const countResult = await sequelize.query(
      `
      SELECT COUNT(DISTINCT m.Veh_Reg_No) AS total
      FROM       dbo.Srv_Reminder_Tbl   r
      INNER JOIN dbo.Srv_Cust_Vehi_Tbl  c  ON c.UTD = r.Cust_Vehi_UTD
      LEFT  JOIN dbo.Srv_Mst_Vehi_Tbl   m  ON m.UTD = c.Tran_id
      ${whereSQL}
      `,
      { replacements, type: QueryTypes.SELECT }
    );

    const totalRecords = Number(countResult?.[0]?.total || 0);
    const totalPages = Math.ceil(totalRecords / pageSize);

    // ============================================================
    // MAIN DATA QUERY → One Row Per Veh_Reg_No
    // ============================================================
    /*
      Total_Reminders sahi karne ke liye:
      ─────────────────────────────────────────────────────────────
      PROBLEM:
        r.Reminder_Count  → sirf us ek reminder row ka count hai
        (e.g., row 1 ka count=2, row 2 ka count=3 → total=5 chahiye)

      SOLUTION:
        Step 1 (AllRows CTE):
          → Har Veh_Reg_No ke saare reminder rows lao
          → SUM(Reminder_Count) OVER PARTITION BY Veh_Reg_No
             = us vehicle ke saare reminders ka total
          → COUNT(r.UTD) OVER PARTITION BY Veh_Reg_No
             = us vehicle ke liye kitne reminder records hain

        Step 2 (RankedVehicles CTE):
          → ROW_NUMBER() se latest reminder row pick karo
          → Total_Reminders already computed hai AllRows se

        Step 3:
          → WHERE rn = 1 → sirf latest row lo
          → Total_Reminders, Total_Reminder_Records accurate honge
    */
    const rows = await sequelize.query(
      `
      WITH AllRows AS (
        SELECT
          r.UTD                                                       AS Reminder_UTD,
          r.Cust_Vehi_UTD,
          r.Loc_Code,
          r.Last_Reminder_At,
          r.Reminder_Date,
          r.Final_Due_Date,
          r.Last_Service_Date,
          r.Last_Service_KM,
          r.Next_Service_KM,
          r.Reminder_Channel,
          r.Reminder_Count,
          r.Service_Status,
          r.Service_Completed_Date,
          r.Call_Status,
          r.status,

          m.Veh_Reg_No,
          c.Cust_Name,
          c.Cust_Mob,
          c.Model_Name,
          mm.Misc_Name                                                AS Loc_Name,

          -- ✅ FIX: Veh_Reg_No ke saare reminder rows ka SUM
          -- Ye total reminders sent count hai (har row ka Reminder_Count jodo)
          SUM(ISNULL(r.Reminder_Count, 0)) OVER (
            PARTITION BY m.Veh_Reg_No
          )                                                           AS Total_Reminders,

          -- ✅ Kitne alag-alag reminder records hain is vehicle ke liye
          COUNT(r.UTD) OVER (
            PARTITION BY m.Veh_Reg_No
          )                                                           AS Total_Reminder_Records

        FROM       dbo.Srv_Reminder_Tbl   r
        INNER JOIN dbo.Srv_Cust_Vehi_Tbl  c  ON c.UTD        = r.Cust_Vehi_UTD
        LEFT  JOIN dbo.Srv_Mst_Vehi_Tbl   m  ON m.UTD        = c.Tran_id
        LEFT  JOIN dbo.Misc_Mst            mm ON mm.Misc_Code = r.Loc_Code
                                             AND mm.Misc_Type = 85
        ${whereSQL}
      ),

      RankedVehicles AS (
        SELECT
          Veh_Reg_No,
          Cust_Name,
          Cust_Mob,
          Model_Name,
          Cust_Vehi_UTD,
          Loc_Code,
          Loc_Name,

          -- Last Service
          CONVERT(varchar(10), Last_Service_Date,      23)           AS Last_Service_Date,
          Last_Service_KM,

          -- Next Service
          CONVERT(varchar(10), Final_Due_Date,         23)           AS Next_Service_Due_Date,
          Next_Service_KM,

          -- Reminder Info
          CONVERT(varchar(19), Last_Reminder_At,      120)           AS Last_Reminder_At,
          Reminder_Channel,

          -- ✅ Correct Total
          Total_Reminders,
          Total_Reminder_Records,

          -- Service
          Service_Status,
          CONVERT(varchar(10), Service_Completed_Date, 23)           AS Service_Completed_Date,

          -- Due Status
          CASE
            WHEN Service_Status = 'COMPLETED'
              THEN 'COMPLETED'
            WHEN Final_Due_Date IS NULL
              THEN 'UNKNOWN'
            WHEN CAST(Final_Due_Date AS DATE) < CONVERT(date, GETDATE())
              THEN 'OVERDUE'
            WHEN CAST(Final_Due_Date AS DATE) = CONVERT(date, GETDATE())
              THEN 'DUE_TODAY'
            ELSE 'UPCOMING'
          END                                                         AS Due_Status,

          -- Days Until Due
          DATEDIFF(
            day,
            CONVERT(date, GETDATE()),
            CAST(Final_Due_Date AS DATE)
          )                                                           AS Days_Until_Due,

          -- Latest reminder row per Veh_Reg_No
          ROW_NUMBER() OVER (
            PARTITION BY Veh_Reg_No
            ORDER BY Last_Reminder_At DESC, Reminder_UTD DESC
          )                                                           AS rn

        FROM AllRows
      )

      SELECT
        Veh_Reg_No,
        Cust_Name,
        Cust_Mob,
        Model_Name,
        Cust_Vehi_UTD,
        Loc_Code,
        Loc_Name,
        Last_Service_Date,
        Last_Service_KM,
        Next_Service_Due_Date,
        Next_Service_KM,
        Last_Reminder_At,
        Reminder_Channel,
        Total_Reminders,
        Total_Reminder_Records,
        Service_Status,
        Service_Completed_Date,
        Due_Status,
        Days_Until_Due

      FROM  RankedVehicles
      WHERE rn = 1

      ORDER BY Last_Reminder_At DESC

      OFFSET :offset ROWS FETCH NEXT :pageSize ROWS ONLY
      `,
      {
        replacements: { ...replacements, offset, pageSize },
        type: QueryTypes.SELECT,
      }
    );

    console.log(
      `[CALLED-REMINDERS] Found: ${rows.length} | Total Unique: ${totalRecords}`
    );

    // ============================================================
    // RESPONSE
    // ============================================================
    return res.status(200).send({
      success: true,
      message: `${totalRecords} unique vehicles found`,
      pagination: {
        page,
        pageSize,
        totalPages,
        totalRecords,
      },
      data: rows,
    });

  } catch (err) {
    console.error("[CALLED-REMINDERS] ERROR:", err?.message);
    console.error("[CALLED-REMINDERS] STACK:", err?.stack);

    return res.status(500).send({
      success: false,
      message: err?.message || "Internal Server Error",
      error: err?.message,
    });

  } finally {
    if (sequelize) {
      try { await sequelize.close(); } catch (_) { }
    }
  }
};




// ============================================================
// CREATE — Add a new reminder config
// ============================================================
exports.createReminderConfig = async (req, res) => {
  let sequelize;
  try {
    sequelize = await dbname(req, req.headers.compcode);

    const {
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
      Call_Delay_Ms,
    } = req.body;

    const userName = req.headers.name || "SYSTEM";

    // ── Validation ──────────────────────────────────────────
    if (!Service_Center_Name || !String(Service_Center_Name).trim()) {
      return res.status(400).json({
        success: false,
        message: "Service_Center_Name is required",
      });
    }

    // ── If an active config already exists for the same Loc_Code,
    //    mark all of them as Inactive before creating a new one ──
    if (Loc_Code) {
      const existingActive = await sequelize.query(
        `SELECT UTD
         FROM dbo.Srv_Reminder_Config_Tbl
         WHERE Loc_Code = :Loc_Code
           AND status   = 1`,
        { replacements: { Loc_Code }, type: QueryTypes.SELECT }
      );

      if (existingActive && existingActive.length > 0) {
        await sequelize.query(
          `UPDATE dbo.Srv_Reminder_Config_Tbl
           SET
             status     = 0,
             Updated_By = :Updated_By,
             Updated_At = GETDATE()
           WHERE Loc_Code = :Loc_Code
             AND status   = 1`,
          {
            replacements: { Loc_Code, Updated_By: userName },
            type: QueryTypes.UPDATE,
          }
        );

        console.log(
          `[CONFIG] CREATE | Loc_Code: ${Loc_Code} | ${existingActive.length} existing active config(s) marked as inactive`
        );
      }
    }

    // ── Insert the new config as Active ─────────────────────
    const result = await sequelize.query(
      `INSERT INTO dbo.Srv_Reminder_Config_Tbl
         (Loc_Code, Service_Center_Name, Service_Center_Address, Working_Hours,
          Sales_Exec_Number, Slot1_Time, Slot2_Time, Slot3_Time, Callback_Time,
          Campaign_Id, Max_Attempts_Per_Day, Call_Delay_Ms, status,
          Created_By, Created_At)
       OUTPUT INSERTED.UTD
       VALUES
         (:Loc_Code, :Service_Center_Name, :Service_Center_Address, :Working_Hours,
          :Sales_Exec_Number, :Slot1_Time, :Slot2_Time, :Slot3_Time, :Callback_Time,
          :Campaign_Id, :Max_Attempts_Per_Day, :Call_Delay_Ms, 1,
          :Created_By, GETDATE())`,
      {
        replacements: {
          Loc_Code: Loc_Code || null,
          Service_Center_Name: Service_Center_Name.trim(),
          Service_Center_Address: Service_Center_Address || null,
          Working_Hours: Working_Hours || "09:00 AM - 06:00 PM",
          Sales_Exec_Number: Sales_Exec_Number || null,
          Slot1_Time: Slot1_Time || null,
          Slot2_Time: Slot2_Time || null,
          Slot3_Time: Slot3_Time || null,
          Callback_Time: Callback_Time || null,
          Campaign_Id: Campaign_Id || null,
          Max_Attempts_Per_Day: Max_Attempts_Per_Day || 3,
          Call_Delay_Ms: Call_Delay_Ms || 2000,
          Created_By: userName,
        },
        type: QueryTypes.INSERT,
      }
    );

    const newUTD = result?.[0]?.[0]?.UTD || null;
    console.log(`[CONFIG] CREATE | New config created | UTD: ${newUTD} | Loc_Code: ${Loc_Code}`);

    return res.status(201).json({
      success: true,
      message: "Config created successfully",
      data: { UTD: newUTD },
    });

  } catch (err) {
    console.error("[CONFIG] CREATE | Error:", err?.message);
    return res.status(500).json({ success: false, message: err?.message });
  } finally {
    if (sequelize) { try { await sequelize.close(); } catch (_) { } }
  }
};

// ============================================================
// GET ALL — Fetch all configs with optional filters
// ============================================================
exports.getAllReminderConfigs = async (req, res) => {
  let sequelize;
  try {
    sequelize = await dbname(req, req.headers.compcode);

    const { status, Loc_Code } = req.query;

    const whereClauses = [];
    const replacements = {};

    // Filter by status (0 = Inactive, 1 = Active).
    // If not provided or "all", return all records.
    if (status !== undefined && status !== "" && status !== "all") {
      whereClauses.push("c.status = :status");
      replacements.status = Number(status);
    }

    // Filter by location code
    if (Loc_Code) {
      whereClauses.push("c.Loc_Code = :Loc_Code");
      replacements.Loc_Code = Loc_Code;
    }

    const whereSQL = whereClauses.length
      ? `WHERE ${whereClauses.join(" AND ")}`
      : "";

    const rows = await sequelize.query(
      `SELECT
         c.UTD,
         c.Loc_Code,
         mm.Misc_Name                              AS Loc_Name,
         c.Service_Center_Name,
         c.Service_Center_Address,
         c.Working_Hours,
         c.Sales_Exec_Number,
         c.Slot1_Time,
         c.Slot2_Time,
         c.Slot3_Time,
         c.Callback_Time,
         c.Campaign_Id,
         c.Max_Attempts_Per_Day,
         c.Call_Delay_Ms,
         c.status,
         c.Created_By,
         CONVERT(varchar(19), c.Created_At, 120)  AS Created_At,
         c.Updated_By,
         CONVERT(varchar(19), c.Updated_At, 120)  AS Updated_At
       FROM dbo.Srv_Reminder_Config_Tbl c
       LEFT JOIN dbo.Misc_Mst mm
         ON mm.Misc_Code = CAST(c.Loc_Code AS NVARCHAR(20))
        AND mm.Misc_Type = 85
       ${whereSQL}
       ORDER BY c.UTD DESC`,
      { replacements, type: QueryTypes.SELECT }
    );

    console.log(`[CONFIG] GET ALL | Total records found: ${rows.length}`);

    return res.status(200).json({
      success: true,
      totalRecords: rows.length,
      data: rows,
    });

  } catch (err) {
    console.error("[CONFIG] GET ALL | Error:", err?.message);
    return res.status(500).json({ success: false, message: err?.message });
  } finally {
    if (sequelize) { try { await sequelize.close(); } catch (_) { } }
  }
};

// ============================================================
// GET BY ID — Fetch a single config by UTD (used in edit form)
// ============================================================
exports.getReminderConfigById = async (req, res) => {
  let sequelize;
  try {
    sequelize = await dbname(req, req.headers.compcode);
    const { utd } = req.params;

    if (!utd) {
      return res.status(400).json({ success: false, message: "UTD is required" });
    }

    const rows = await sequelize.query(
      `SELECT
         c.*,
         mm.Misc_Name AS Loc_Name
       FROM dbo.Srv_Reminder_Config_Tbl c
       LEFT JOIN dbo.Misc_Mst mm
         ON mm.Misc_Code = CAST(c.Loc_Code AS NVARCHAR(20))
        AND mm.Misc_Type = 85
       WHERE c.UTD = :utd`,
      { replacements: { utd }, type: QueryTypes.SELECT }
    );

    if (!rows || rows.length === 0) {
      console.warn(`[CONFIG] GET BY ID | No config found for UTD: ${utd}`);
      return res.status(404).json({ success: false, message: "Config not found" });
    }

    console.log(`[CONFIG] GET BY ID | UTD: ${utd} | Found successfully`);

    return res.status(200).json({ success: true, data: rows[0] });

  } catch (err) {
    console.error("[CONFIG] GET BY ID | Error:", err?.message);
    return res.status(500).json({ success: false, message: err?.message });
  } finally {
    if (sequelize) { try { await sequelize.close(); } catch (_) { } }
  }
};

// ============================================================
// UPDATE — Update an existing config by UTD
// If status is being set to Active (1), all other active configs
// for the same Loc_Code will be automatically deactivated.
// ============================================================
exports.updateReminderConfig = async (req, res) => {
  let sequelize;
  try {
    sequelize = await dbname(req, req.headers.compcode);

    const {
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
      Call_Delay_Ms,
      status,
    } = req.body;

    const userName = req.headers.name || "SYSTEM";

    // ── Validate required field ──────────────────────────────
    if (!UTD) {
      return res.status(400).json({
        success: false,
        message: "UTD is required for update",
      });
    }

    // ── Check if the config exists ───────────────────────────
    const existing = await sequelize.query(
      `SELECT UTD, Loc_Code
       FROM dbo.Srv_Reminder_Config_Tbl
       WHERE UTD = :UTD`,
      { replacements: { UTD }, type: QueryTypes.SELECT }
    );

    if (!existing || existing.length === 0) {
      console.warn(`[CONFIG] UPDATE | No config found for UTD: ${UTD}`);
      return res.status(404).json({ success: false, message: "Config not found" });
    }

    const newStatus = status !== undefined ? Number(status) : 1;

    // ── If setting this config to Active and Loc_Code is provided,
    //    deactivate all other active configs for the same Loc_Code ──
    if (newStatus === 1 && Loc_Code) {
      const otherActive = await sequelize.query(
        `SELECT UTD
         FROM dbo.Srv_Reminder_Config_Tbl
         WHERE Loc_Code = :Loc_Code
           AND status   = 1
           AND UTD     <> :UTD`,
        { replacements: { Loc_Code, UTD }, type: QueryTypes.SELECT }
      );

      if (otherActive && otherActive.length > 0) {
        await sequelize.query(
          `UPDATE dbo.Srv_Reminder_Config_Tbl
           SET
             status     = 0,
             Updated_By = :Updated_By,
             Updated_At = GETDATE()
           WHERE Loc_Code = :Loc_Code
             AND status   = 1
             AND UTD     <> :UTD`,
          {
            replacements: { Loc_Code, UTD, Updated_By: userName },
            type: QueryTypes.UPDATE,
          }
        );

        console.log(
          `[CONFIG] UPDATE | Loc_Code: ${Loc_Code} | ${otherActive.length} other active config(s) marked as inactive`
        );
      }
    }

    // ── Update the current config ────────────────────────────
    await sequelize.query(
      `UPDATE dbo.Srv_Reminder_Config_Tbl
       SET
         Loc_Code               = :Loc_Code,
         Service_Center_Name    = :Service_Center_Name,
         Service_Center_Address = :Service_Center_Address,
         Working_Hours          = :Working_Hours,
         Sales_Exec_Number      = :Sales_Exec_Number,
         Slot1_Time             = :Slot1_Time,
         Slot2_Time             = :Slot2_Time,
         Slot3_Time             = :Slot3_Time,
         Callback_Time          = :Callback_Time,
         Campaign_Id            = :Campaign_Id,
         Max_Attempts_Per_Day   = :Max_Attempts_Per_Day,
         Call_Delay_Ms          = :Call_Delay_Ms,
         status                 = :status,
         Updated_By             = :Updated_By,
         Updated_At             = GETDATE()
       WHERE UTD = :UTD`,
      {
        replacements: {
          UTD,
          Loc_Code: Loc_Code || null,
          Service_Center_Name: Service_Center_Name?.trim() || "",
          Service_Center_Address: Service_Center_Address || null,
          Working_Hours: Working_Hours || "09:00 AM - 06:00 PM",
          Sales_Exec_Number: Sales_Exec_Number || null,
          Slot1_Time: Slot1_Time || null,
          Slot2_Time: Slot2_Time || null,
          Slot3_Time: Slot3_Time || null,
          Callback_Time: Callback_Time || null,
          Campaign_Id: Campaign_Id || null,
          Max_Attempts_Per_Day: Max_Attempts_Per_Day || 3,
          Call_Delay_Ms: Call_Delay_Ms || 2000,
          status: newStatus,
          Updated_By: userName,
        },
        type: QueryTypes.UPDATE,
      }
    );

    console.log(`[CONFIG] UPDATE | UTD: ${UTD} | Updated successfully | Status: ${newStatus}`);

    return res.status(200).json({
      success: true,
      message: "Config updated successfully",
    });

  } catch (err) {
    console.error("[CONFIG] UPDATE | Error:", err?.message);
    return res.status(500).json({ success: false, message: err?.message });
  } finally {
    if (sequelize) { try { await sequelize.close(); } catch (_) { } }
  }
};

// ============================================================
// TOGGLE STATUS — Flip config status between Active (1) and
// Inactive (0). If activating, all other active configs for
// the same Loc_Code will be automatically deactivated.
// ============================================================
exports.toggleReminderConfigStatus = async (req, res) => {
  let sequelize;
  try {
    sequelize = await dbname(req, req.headers.compcode);

    const { UTD, status } = req.body;
    const userName = req.headers.name || "SYSTEM";

    // ── Validate required field ──────────────────────────────
    if (!UTD) {
      return res.status(400).json({ success: false, message: "UTD is required" });
    }

    const newStatus = Number(status) === 1 ? 1 : 0;

    // ── Fetch the current config details ─────────────────────
    const current = await sequelize.query(
      `SELECT UTD, Loc_Code
       FROM dbo.Srv_Reminder_Config_Tbl
       WHERE UTD = :UTD`,
      { replacements: { UTD }, type: QueryTypes.SELECT }
    );

    if (!current || current.length === 0) {
      console.warn(`[CONFIG] TOGGLE | No config found for UTD: ${UTD}`);
      return res.status(404).json({ success: false, message: "Config not found" });
    }

    const locCode = current[0]?.Loc_Code;

    // ── If activating this config, deactivate all other active
    //    configs that share the same Loc_Code ─────────────────
    if (newStatus === 1 && locCode) {
      const otherActive = await sequelize.query(
        `SELECT UTD
         FROM dbo.Srv_Reminder_Config_Tbl
         WHERE Loc_Code = :locCode
           AND status   = 1
           AND UTD     <> :UTD`,
        { replacements: { locCode, UTD }, type: QueryTypes.SELECT }
      );

      if (otherActive && otherActive.length > 0) {
        await sequelize.query(
          `UPDATE dbo.Srv_Reminder_Config_Tbl
           SET
             status     = 0,
             Updated_By = :Updated_By,
             Updated_At = GETDATE()
           WHERE Loc_Code = :locCode
             AND status   = 1
             AND UTD     <> :UTD`,
          {
            replacements: { locCode, UTD, Updated_By: userName },
            type: QueryTypes.UPDATE,
          }
        );

        console.log(
          `[CONFIG] TOGGLE | Loc_Code: ${locCode} | ${otherActive.length} other active config(s) marked as inactive`
        );
      }
    }

    // ── Update the status of the requested config ────────────
    await sequelize.query(
      `UPDATE dbo.Srv_Reminder_Config_Tbl
       SET
         status     = :newStatus,
         Updated_By = :Updated_By,
         Updated_At = GETDATE()
       WHERE UTD = :UTD`,
      {
        replacements: { UTD, newStatus, Updated_By: userName },
        type: QueryTypes.UPDATE,
      }
    );

    console.log(
      `[CONFIG] TOGGLE | UTD: ${UTD} | Status changed to: ${newStatus === 1 ? "Active" : "Inactive"}`
    );

    return res.status(200).json({
      success: true,
      message: `Config ${newStatus === 1 ? "activated" : "deactivated"} successfully`,
    });

  } catch (err) {
    console.error("[CONFIG] TOGGLE | Error:", err?.message);
    return res.status(500).json({ success: false, message: err?.message });
  } finally {
    if (sequelize) { try { await sequelize.close(); } catch (_) { } }
  }
};

// ============================================================
// GET ACTIVE CONFIG BY LOC_CODE
// Internal utility function used by cron jobs.
// Not exposed as an HTTP route.
// Returns the active config for a given location code.
// Falls back to a global config (Loc_Code IS NULL) if no
// location-specific config is found.
// ============================================================
exports.getActiveConfigByLocCode = async (sequelize, locCode) => {
  try {
    const rows = await sequelize.query(
      `SELECT TOP 1 *
       FROM dbo.Srv_Reminder_Config_Tbl
       WHERE status = 1
         AND (Loc_Code = :locCode OR Loc_Code IS NULL)
       ORDER BY
         CASE WHEN Loc_Code = :locCode THEN 0 ELSE 1 END,
         UTD DESC`,
      { replacements: { locCode }, type: QueryTypes.SELECT }
    );

    if (!rows || rows.length === 0) {
      console.warn(`[CONFIG] GET ACTIVE | No active config found for Loc_Code: ${locCode}`);
      return null;
    }

    console.log(
      `[CONFIG] GET ACTIVE | Loc_Code: ${locCode} | Config UTD: ${rows[0]?.UTD}`
    );

    return rows[0];

  } catch (err) {
    console.error("[CONFIG] GET ACTIVE | Error:", err?.message);
    return null;
  }
};



exports.getEmployees = async function (req, res) {
  let sequelize;

  try {
    console.log("req.headers.compcode", req.headers.compcode);

    sequelize = await dbname(req, req.headers.compcode);

    const {
      search,
      Loc_Code,
    } = req.body || {};
const LOCATION = Loc_Code;
console.log("LOCATION",LOCATION)
    // ============================================================
    // BASE WHERE
    // Sirf active employees
    // ============================================================

    let whereConditions = `
      WHERE e.LASTWOR_DATE IS NULL
    `;

    const replacements = {};

    // ============================================================
    // LOCATION FILTER
    //
    // Supported:
    // LOCATION: 1
    // LOCATION: "1"
    // LOCATION: "1,2,3"
    // LOCATION: [1,2,3]
    // ============================================================

    if (
      LOCATION !== undefined &&
      LOCATION !== null &&
      LOCATION !== ""
    ) {
      let locationArray = [];

      if (Array.isArray(LOCATION)) {
        locationArray = LOCATION
          .flat()
          .map((value) => String(value).trim())
          .filter(Boolean);
      } else {
        locationArray = String(LOCATION)
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean);
      }

      // Duplicate location remove
      locationArray = [...new Set(locationArray)];

      // Single location
      if (locationArray.length === 1) {
        whereConditions += `
          AND CAST(e.LOCATION AS VARCHAR(50)) = :LOCATION
        `;

        replacements.LOCATION = locationArray[0];
      }

      // Multiple locations
      if (locationArray.length > 1) {
        whereConditions += `
          AND CAST(e.LOCATION AS VARCHAR(50)) IN (:LOCATIONS)
        `;

        replacements.LOCATIONS = locationArray;
      }
    }

    // ============================================================
    // SEARCH FILTER
    // ============================================================

    if (search) {
      const rawSearch = String(search).trim();

      if (rawSearch) {
        replacements.search = `%${rawSearch}%`;

        whereConditions += `
          AND (
            UPPER(ISNULL(e.EMPCODE, ''))
              LIKE UPPER(:search)

            OR UPPER(ISNULL(e.EMPFIRSTNAME, ''))
              LIKE UPPER(:search)

            OR UPPER(ISNULL(e.EMPLASTNAME, ''))
              LIKE UPPER(:search)

            OR UPPER(ISNULL(e.MOBILENO, ''))
              LIKE UPPER(:search)

            OR UPPER(
              LTRIM(RTRIM(ISNULL(e.EMPFIRSTNAME, '')))
              + ' ' +
              LTRIM(RTRIM(ISNULL(e.EMPLASTNAME, '')))
            ) LIKE UPPER(:search)
          )
        `;
      }
    }

    // ============================================================
    // EMPLOYEE DATA
    // ============================================================

    const data = await sequelize.query(
      `
      SELECT
        e.*,

        LTRIM(
          RTRIM(
            ISNULL(e.EMPFIRSTNAME, '') +
            CASE
              WHEN ISNULL(e.EMPLASTNAME, '') <> ''
                THEN ' ' + e.EMPLASTNAME
              ELSE ''
            END
          )
        ) AS FULL_NAME

      FROM dbo.EMPLOYEEMASTER AS e

      ${whereConditions}

      ORDER BY e.EMPCODE ASC
      `,
      {
        replacements,
        type: QueryTypes.SELECT,
      }
    );

    return res.status(200).send({
      success: true,
      totalRecords: data.length,
      data,
    });

  } catch (error) {
    console.error("Get Employees Error:", error);

    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });

  } finally {
    if (sequelize) {
      await sequelize.close();
    }
  }
};



exports.transferServiceExecutiveTasks = async function (req, res) {
  let sequelize;
  let transaction;

  try {
    sequelize = await dbname(req, req.headers.compcode);

    const body = req.body || {};

    // ════════════════════════════════════════════════════════
    // VALIDATION
    // ════════════════════════════════════════════════════════
    if (!body.from_Emp_Code && !body.from_exec_mobile) {
      return res.status(400).send({
        success: false,
        message: "from_Emp_Code or from_exec_mobile is required",
      });
    }

    if (!body.to_Emp_Code) {
      return res.status(400).send({
        success: false,
        message: "to_Emp_Code is required",
      });
    }

    if (
      body.from_Emp_Code &&
      body.to_Emp_Code &&
      String(body.from_Emp_Code).trim() === String(body.to_Emp_Code).trim()
    ) {
      return res.status(400).send({
        success: false,
        message: "from_Emp_Code and to_Emp_Code cannot be the same",
      });
    }

    if (!body.Loc_Code) {
      return res.status(400).send({
        success: false,
        message: "Loc_Code is required",
      });
    }

    // ✅ Selected UTDs validate karo
    const selectedCustVehiUTDs = Array.isArray(body.selectedCustVehiUTDs)
      ? body.selectedCustVehiUTDs
        .map((v) => Number(v))
        .filter((v) => !isNaN(v) && v > 0)
      : [];

    const selectedReminderUTDs = Array.isArray(body.selectedReminderUTDs)
      ? body.selectedReminderUTDs
        .map((v) => Number(v))
        .filter((v) => !isNaN(v) && v > 0)
      : [];

    if (selectedCustVehiUTDs.length === 0) {
      return res.status(400).send({
        success: false,
        message: "selectedCustVehiUTDs is required — please select at least one task",
      });
    }

    // ── Normalize ──────────────────────────────────────────
    const fromEmpCode = body.from_Emp_Code
      ? String(body.from_Emp_Code).trim()
      : null;

    const toEmpCode = String(body.to_Emp_Code).trim();
    const toExecName = body.to_exec_name
      ? String(body.to_exec_name).trim() : null;
    const toExecMobile = body.to_exec_mobile
      ? String(body.to_exec_mobile).trim() : null;

    if (toExecMobile && !/^[0-9]{10,15}$/.test(toExecMobile)) {
      return res.status(400).send({
        success: false,
        message: "to_exec_mobile must contain 10 to 15 digits",
      });
    }

    const locArr = Array.isArray(body.Loc_Code)
      ? body.Loc_Code.flat().map((v) => String(v).trim()).filter(Boolean)
      : String(body.Loc_Code).trim().split(/[,\s]+/).map((x) => x.trim()).filter(Boolean);

    if (locArr.length === 0) {
      return res.status(400).send({
        success: false,
        message: "Loc_Code is invalid or empty",
      });
    }

    const updatedBy =
      body.Updated_By ||
      req?.user?.UTD ||
      req?.user?.userId ||
      null;

    // ════════════════════════════════════════════════════════
    // STEP 1 — To Executive info fetch karo
    // ════════════════════════════════════════════════════════
    const empResult = await sequelize.query(
      `SELECT TOP 1
         EMPCODE,
         ISNULL(
           LTRIM(RTRIM(ISNULL(EMPFIRSTNAME, ''))) + ' ' +
           LTRIM(RTRIM(ISNULL(EMPLASTNAME,  ''))),
           ''
         ) AS FULL_NAME,
         ISNULL(MOBILENO, '') AS MOBILENO
       FROM dbo.EMPLOYEEMASTER
       WHERE LASTWOR_DATE IS NULL
         AND EMPCODE = :toEmpCode`,
      {
        replacements: { toEmpCode },
        type: QueryTypes.SELECT,
      }
    );

    if (!empResult || empResult.length === 0) {
      return res.status(404).send({
        success: false,
        message: `To Executive with EMPCODE ${toEmpCode} not found or inactive`,
      });
    }

    const toEmployee = empResult[0];

    const finalToExecName = toExecName || String(toEmployee.FULL_NAME || "").trim() || null;
    const finalToExecMobile = toExecMobile || String(toEmployee.MOBILENO || "").trim() || null;
    const finalToEmpCode = toEmployee.EMPCODE;

    console.log("[TRANSFER] To Executive:", {
      finalToEmpCode,
      finalToExecName,
      finalToExecMobile,
    });
    console.log("[TRANSFER] selectedCustVehiUTDs:", selectedCustVehiUTDs);
    console.log("[TRANSFER] selectedReminderUTDs :", selectedReminderUTDs);

    // ════════════════════════════════════════════════════════
    // STEP 2 — Verify karo ki selected UTDs is executive ke hain
    // ════════════════════════════════════════════════════════
    const verifyReplace = { selectedCustVehiUTDs };
    let verifyWhere = `
      WHERE Export_Type = 1
        AND UTD IN (:selectedCustVehiUTDs)
    `;

    if (fromEmpCode) {
      verifyWhere += ` AND srv_exec_Emp_Code = :fromEmpCode`;
      verifyReplace.fromEmpCode = fromEmpCode;
    }

    if (locArr.length === 1) {
      verifyWhere += ` AND Loc_Code = :Loc_Code`;
      verifyReplace.Loc_Code = locArr[0];
    } else {
      verifyWhere += ` AND Loc_Code IN (:Loc_Codes)`;
      verifyReplace.Loc_Codes = locArr;
    }

    const verifyResult = await sequelize.query(
      `SELECT COUNT(*) AS total
       FROM dbo.Srv_Cust_Vehi_Tbl
       ${verifyWhere}`,
      { replacements: verifyReplace, type: QueryTypes.SELECT }
    );

    const verifiedCount = Number(verifyResult?.[0]?.total || 0);

    if (verifiedCount === 0) {
      return res.status(404).send({
        success: false,
        message: "No matching records found for selected tasks and executive",
        debug: { selectedCustVehiUTDs, fromEmpCode, Loc_Code: locArr },
      });
    }

    // ════════════════════════════════════════════════════════
    // STEP 3 — Transaction: Update selected records only
    // ════════════════════════════════════════════════════════
    transaction = await sequelize.transaction();

    // ✅ UPDATE 1: Srv_Cust_Vehi_Tbl — sirf selected UTDs
    const updateCustReplace = {
      srv_exec_name: finalToExecName,
      srv_exec_mobile: finalToExecMobile,
      srv_exec_Emp_Code: finalToEmpCode,
      Updated_By: updatedBy,
      selectedCustVehiUTDs,
    };

    let updateCustWhere = `
      WHERE Export_Type = 1
        AND UTD IN (:selectedCustVehiUTDs)
    `;

    if (locArr.length === 1) {
      updateCustWhere += ` AND Loc_Code = :Loc_Code`;
      updateCustReplace.Loc_Code = locArr[0];
    } else {
      updateCustWhere += ` AND Loc_Code IN (:Loc_Codes)`;
      updateCustReplace.Loc_Codes = locArr;
    }

    await sequelize.query(
      `UPDATE dbo.Srv_Cust_Vehi_Tbl
       SET
         srv_exec_name     = :srv_exec_name,
         srv_exec_mobile   = :srv_exec_mobile,
         srv_exec_Emp_Code = :srv_exec_Emp_Code,
         Updated_By        = :Updated_By,
         Updated_At        = GETDATE()
       ${updateCustWhere}`,
      {
        replacements: updateCustReplace,
        type: QueryTypes.UPDATE,
        transaction,
      }
    );

    console.log(
      `[TRANSFER] ✅ Srv_Cust_Vehi_Tbl updated | ${selectedCustVehiUTDs.length} records`
    );

    // ✅ UPDATE 2: Srv_Reminder_Tbl — sirf selected reminder UTDs
    let transferredReminders = 0;

    if (selectedReminderUTDs.length > 0) {
      await sequelize.query(
        `UPDATE dbo.Srv_Reminder_Tbl
         SET
           Updated_By = :Updated_By,
           Updated_At = GETDATE()
         WHERE UTD IN (:selectedReminderUTDs)
           AND status          = 1
           AND Reminder_Status = 'PENDING'`,
        {
          replacements: {
            Updated_By: updatedBy,
            selectedReminderUTDs,
          },
          type: QueryTypes.UPDATE,
          transaction,
        }
      );

      transferredReminders = selectedReminderUTDs.length;
      console.log(
        `[TRANSFER] ✅ Srv_Reminder_Tbl updated | ${transferredReminders} reminders`
      );
    } else {
      // ✅ Fallback: Cust_Vehi_UTD ke basis par reminders update karo
      await sequelize.query(
        `UPDATE dbo.Srv_Reminder_Tbl
         SET
           Updated_By = :Updated_By,
           Updated_At = GETDATE()
         WHERE Cust_Vehi_UTD IN (:selectedCustVehiUTDs)
           AND status          = 1
           AND Reminder_Status = 'PENDING'`,
        {
          replacements: {
            Updated_By: updatedBy,
            selectedCustVehiUTDs,
          },
          type: QueryTypes.UPDATE,
          transaction,
        }
      );

      console.log(
        `[TRANSFER] ✅ Srv_Reminder_Tbl updated via Cust_Vehi_UTD`
      );
    }

    await transaction.commit();

    // ════════════════════════════════════════════════════════
    // RESPONSE
    // ════════════════════════════════════════════════════════
    return res.status(200).send({
      success: true,
      message:
        `${selectedCustVehiUTDs.length} vehicle(s) and ` +
        `${selectedReminderUTDs.length || transferredReminders} ` +
        `PENDING reminder(s) transferred successfully`,
      transferredVehicles: selectedCustVehiUTDs.length,
      transferredReminders: selectedReminderUTDs.length || transferredReminders,
      from: {
        emp_code: fromEmpCode || null,
      },
      to: {
        emp_code: finalToEmpCode,
        exec_name: finalToExecName,
        exec_mobile: finalToExecMobile,
      },
      transferredCustVehiUTDs: selectedCustVehiUTDs,
      transferredReminderUTDs: selectedReminderUTDs,
      Loc_Code: locArr,
    });

  } catch (error) {
    if (transaction) {
      try { await transaction.rollback(); } catch (_) { }
    }
    console.error("Transfer Service Executive Tasks Error:", error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  } finally {
    if (sequelize) {
      await sequelize.close();
    }
  }
};
exports.getPendingTasksByExecutive = async function (req, res) {
  let sequelize;

  try {
    sequelize = await dbname(req, req.headers.compcode);

    const body = req.body || {};

    if (!body.from_Emp_Code && !body.from_exec_mobile) {
      return res.status(400).send({
        success: false,
        message: "from_Emp_Code or from_exec_mobile is required",
      });
    }

    if (!body.Loc_Code) {
      return res.status(400).send({
        success: false,
        message: "Loc_Code is required",
      });
    }

    const locArr = Array.isArray(body.Loc_Code)
      ? body.Loc_Code.flat().map((v) => String(v).trim()).filter(Boolean)
      : String(body.Loc_Code).trim().split(/[,\s]+/).map((x) => x.trim()).filter(Boolean);

    const whereConditions = [`c.Export_Type = 1`, `r.status = 1`, `r.Reminder_Status = 'PENDING'`];
    const replacements = {};

    if (locArr.length === 1) {
      whereConditions.push(`c.Loc_Code = :Loc_Code`);
      replacements.Loc_Code = locArr[0];
    } else {
      whereConditions.push(`c.Loc_Code IN (:Loc_Codes)`);
      replacements.Loc_Codes = locArr;
    }

    if (body.from_Emp_Code) {
      whereConditions.push(`c.srv_exec_Emp_Code = :fromEmpCode`);
      replacements.fromEmpCode = String(body.from_Emp_Code).trim();
    } else {
      whereConditions.push(`LTRIM(RTRIM(c.srv_exec_mobile)) = :fromMobile`);
      replacements.fromMobile = String(body.from_exec_mobile).trim();
    }

    const data = await sequelize.query(
      `SELECT
         c.UTD                                          AS Cust_Vehi_UTD,
         c.Loc_Code,
         c.Cust_Name,
         c.Cust_Mob,
         c.srv_exec_name,
         c.srv_exec_Emp_Code,
         c.srv_exec_mobile,
         m.Veh_Reg_No,
         r.UTD                                          AS Reminder_UTD,
         r.Reminder_Status,
         CONVERT(varchar(10), r.Reminder_Date, 23)      AS Reminder_Date
       FROM dbo.Srv_Cust_Vehi_Tbl c
       LEFT  JOIN dbo.Srv_Mst_Vehi_Tbl m ON m.UTD = c.Tran_id
       INNER JOIN dbo.Srv_Reminder_Tbl  r ON r.Cust_Vehi_UTD = c.UTD
       WHERE ${whereConditions.join(" AND ")}
       ORDER BY r.Reminder_Date ASC`,
      { replacements, type: QueryTypes.SELECT }
    );

    return res.status(200).send({
      success: true,
      totalRecords: data.length,
      data,
    });

  } catch (error) {
    console.error("getPendingTasksByExecutive Error:", error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  } finally {
    if (sequelize) await sequelize.close();
  }
};



exports.getServiceDataByVehiNo = async function (req, res) {
  let sequelize;
  try {
    sequelize = await dbname(req, req.headers.compcode);

    const body = req.body || {};
    const headers = req.headers || {};
    const rawVehNo = String(body.Veh_Reg_No || body.veh_reg_no || req.query.Veh_Reg_No || "").trim();
    const Location = String(
      headers.loc_code || headers.branch || body.Location || body.Loc_Code || body.loc_code || req.query.Loc_Code || ""
    ).trim();

    if (!rawVehNo) {
      return res.status(400).json({ success: false, message: "Veh_Reg_No is required" });
    }

    const normVeh = rawVehNo.toUpperCase().replace(/[\s-]/g, "");

    const runQuery = async (useLocation, useLike) => {
      const vehCondition = useLike
        ? `UPPER(REPLACE(REPLACE(ISNULL(m.Veh_Reg_No, ISNULL(c.Veh_Reg_No, '')), ' ', ''), '-', '')) LIKE :searchVeh`
        : `UPPER(REPLACE(REPLACE(ISNULL(m.Veh_Reg_No, ISNULL(c.Veh_Reg_No, '')), ' ', ''), '-', '')) = :normVeh`;

      const locCondition = (useLocation && Location)
        ? `AND (LTRIM(RTRIM(CAST(ISNULL(m.Loc_Code, c.Loc_Code) AS VARCHAR(50)))) = :Location)`
        : ``;

      const replacements = {
        normVeh,
        searchVeh: `%${normVeh}%`,
        Location,
      };

      return await sequelize.query(
        `
        SELECT TOP 1
            c.UTD AS Cust_Vehi_UTD,
            ISNULL(c.Cust_Name, '') AS Cust_Name,
            ISNULL(c.Cust_Mob, '') AS Cust_Mob,
            ISNULL(c.Model_Name, '') AS Model_Name,
            CONVERT(varchar(10), c.Last_Service_Date, 23) AS Last_Service_Date,
            c.Last_Service_KM,
            c.Avg_Daily_KM,
            c.Current_KM,
            ISNULL(m.Veh_Reg_No, c.Veh_Reg_No) AS Veh_Reg_No,
            ISNULL(m.UTD, c.Tran_id) AS UTD,
            m.Service_Type,
            ISNULL(m.Loc_Code, c.Loc_Code) AS Loc_Code
        FROM dbo.Srv_Cust_Vehi_Tbl c
        LEFT JOIN dbo.Srv_Mst_Vehi_Tbl m
            ON m.UTD = c.Tran_id
        WHERE (${vehCondition})
          ${locCondition}
        ORDER BY 
            CASE WHEN (c.Export_Type = 1 OR c.Export_Type IS NULL) THEN 1 ELSE 2 END ASC,
            c.UTD DESC
        `,
        {
          replacements,
          type: QueryTypes.SELECT,
        }
      );
    };

    // Pass 1: Exact match with Location filter
    let rows = await runQuery(true, false);

    // Pass 2: Exact match WITHOUT Location filter
    if ((!rows || rows.length === 0) && Location) {
      rows = await runQuery(false, false);
    }

    // Pass 3: LIKE match with Location filter
    if (!rows || rows.length === 0) {
      rows = await runQuery(true, true);
    }

    // Pass 4: LIKE match WITHOUT Location filter
    if (!rows || rows.length === 0) {
      rows = await runQuery(false, true);
    }

    // Pass 5: Direct query on Srv_Mst_Vehi_Tbl alone if Srv_Cust_Vehi_Tbl has no row
    if (!rows || rows.length === 0) {
      rows = await sequelize.query(
        `
        SELECT TOP 1
            NULL AS Cust_Vehi_UTD,
            '' AS Cust_Name,
            '' AS Cust_Mob,
            '' AS Model_Name,
            NULL AS Last_Service_Date,
            NULL AS Last_Service_KM,
            NULL AS Avg_Daily_KM,
            NULL AS Current_KM,
            m.Veh_Reg_No,
            m.UTD,
            m.Service_Type,
            m.Loc_Code
        FROM dbo.Srv_Mst_Vehi_Tbl m
        WHERE UPPER(REPLACE(REPLACE(ISNULL(m.Veh_Reg_No, ''), ' ', ''), '-', '')) LIKE :searchVeh
        ORDER BY m.UTD DESC
        `,
        {
          replacements: { searchVeh: `%${normVeh}%` },
          type: QueryTypes.SELECT,
        }
      );
    }

    const vehicleData = rows?.[0] || null;

    if (!vehicleData) {
      return res.status(200).json({
        success: false,
        message: "No vehicle service data found for the given vehicle number",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      data: vehicleData,
      ...vehicleData,
    });
  } catch (e) {
    console.error("[getServiceDataByVehiNo Error]:", e);
    return res.status(500).json({ success: false, message: "Error fetching vehicle service data", error: e.message });
  } finally {
    if (sequelize) await sequelize.close();
  }
};





exports.saveNewVehicleServiceData = async function (req, res) {
  let sequelize;
  let t;

  try {
    sequelize = await dbname(req, req.headers.compcode);
    t = await sequelize.transaction();

    const body = req.body || {};
    const headers = req.headers || {};
    const {
      Veh_Reg_No,
      Cust_Name,
      Cust_Mob,
      Model_Name,
      Last_Service_Date,
      Last_Service_KM,
      Avg_Daily_KM,
      Current_KM,
      ServiceType,
    } = body;

    const name = headers.name || body.user || "SYSTEM";
    const Location = String(
      headers.loc_code || headers.branch || body.Location || body.Loc_Code || body.loc_code || ""
    ).trim();

    const toNull = (v) => {
      if (v === undefined || v === null) return null;
      if (typeof v === "string" && v.trim() === "") return null;
      return v;
    };

    const cleanVehNo = String(Veh_Reg_No || "").trim();
    if (!cleanVehNo) {
      await t.rollback();
      return res.status(400).json({ success: false, message: "Veh_Reg_No is required" });
    }
    if (!Location) {
      await t.rollback();
      return res.status(400).json({ success: false, message: "Location (loc_code/branch) is required in headers or body" });
    }

    const normVeh = cleanVehNo.toUpperCase().replace(/[\s-]/g, "");

    // ✅ Prevent duplicate MST
    const existMst = await sequelize.query(
      `
      SELECT TOP 1 UTD
      FROM Srv_Mst_Vehi_Tbl
      WHERE UPPER(REPLACE(REPLACE(Veh_Reg_No, ' ', ''), '-', '')) = :normVeh
        AND LTRIM(RTRIM(CAST(Loc_Code AS VARCHAR(50)))) = :Location
        AND ISNULL(Export_Type, 1) = 1
      `,
      { replacements: { normVeh, Location }, type: QueryTypes.SELECT, transaction: t }
    );

    if (existMst?.length > 0) {
      await t.rollback();
      return res.status(409).json({
        success: false,
        message: "Vehicle already exists. Please click Get Details and Update.",
      });
    }

    // 1) Insert MST
    const insertMst = await sequelize.query(
      `
      INSERT INTO Srv_Mst_Vehi_Tbl
        (Loc_Code, Veh_Reg_No, Export_Type, Service_Type, Created_By, Created_At)
      OUTPUT INSERTED.UTD
      VALUES
        (:Location, :cleanVehNo, 1, :ServiceType, :name, GETDATE())
      `,
      {
        replacements: {
          Location,
          cleanVehNo,
          ServiceType: toNull(ServiceType),
          name,
        },
        type: QueryTypes.SELECT,
        transaction: t,
      }
    );

    const mstUTD = insertMst?.[0]?.UTD;

    // 2) Insert CUST
    const insertCust = await sequelize.query(
      `
      INSERT INTO Srv_Cust_Vehi_Tbl
        (
          Loc_Code,
          Veh_Reg_No,
          Cust_Name,
          Cust_Mob,
          Model_Name,
          Last_Service_Date,
          Last_Service_KM,
          Avg_Daily_KM,
          Current_KM,
          status,
          Export_Type,
          Created_By,
          Created_At,
          Tran_id
        )
      OUTPUT INSERTED.UTD
      VALUES
        (
          :Location,
          NULL,
          :Cust_Name,
          :Cust_Mob,
          :Model_Name,
          ${nullableDateExpression("Last_Service_Date")},
          :Last_Service_KM,
          :Avg_Daily_KM,
          :Current_KM,
          0,
          1,
          :name,
          GETDATE(),
          :mstUTD
        )
      `,
      {
        replacements: {
          Location,
          Cust_Name: toNull(Cust_Name),
          Cust_Mob: toNull(Cust_Mob),
          Model_Name: toNull(Model_Name),
          Last_Service_Date: convertDate(Last_Service_Date) || null,
          Last_Service_KM: toIntegerOrNull(Last_Service_KM),
          Avg_Daily_KM: toIntegerOrNull(Avg_Daily_KM),
          Current_KM: toIntegerOrNull(Current_KM),
          name,
          mstUTD,
        },
        type: QueryTypes.SELECT,
        transaction: t,
      }
    );

    await t.commit();

    return res.status(200).json({
      success: true,
      message: "Saved successfully",
      UTD: mstUTD,
      Cust_Vehi_UTD_New: insertCust?.[0]?.UTD || null,
    });
  } catch (e) {
    if (t) await t.rollback();
    console.error("[saveNewVehicleServiceData Error]:", e);
    return res.status(500).json({ success: false, message: "Error saving data", error: e.message });
  } finally {
    if (sequelize) await sequelize.close();
  }
};







exports.saveOrUpdateServiceData = async function (req, res) {
  let sequelize;
  let t;

  try {
    sequelize = await dbname(req, req.headers.compcode);
    t = await sequelize.transaction();

    const body = req.body || {};
    const headers = req.headers || {};
    const {
      Veh_Reg_No,
      Cust_Name,
      Cust_Mob,
      Model_Name,
      Avg_Daily_KM,
      ServiceType,
      Current_Service_Date,
      Current_Service_KM,
      Remark,
    } = body;

    const name = headers.name || body.user || "SYSTEM";
    let Location = String(
      headers.loc_code || headers.branch || body.Location || body.Loc_Code || body.loc_code || ""
    ).trim();

    const toNull = (v) => {
      if (v === undefined || v === null) return null;
      if (typeof v === "string" && v.trim() === "") return null;
      return v;
    };

    const parseKm = (v) => {
      const s = String(v ?? "").trim().replace(/\D/g, "");
      if (!s) return NaN;
      const n = Number(s);
      return Number.isFinite(n) ? n : NaN;
    };

    const cleanVehNo = String(Veh_Reg_No || "").trim();
    if (!cleanVehNo) {
      await t.rollback();
      return res.status(400).json({ success: false, message: "Veh_Reg_No is required" });
    }
    if (!Current_Service_Date) {
      await t.rollback();
      return res.status(400).json({ success: false, message: "Current_Service_Date is required" });
    }
    if (Current_Service_KM === undefined || Current_Service_KM === null || Current_Service_KM === "") {
      await t.rollback();
      return res.status(400).json({ success: false, message: "Current_Service_KM is required" });
    }

    const normVeh = cleanVehNo.toUpperCase().replace(/[\s-]/g, "");

    // 1) Find existing MST UTD
    let mstUTD = null;
    let targetLocCode = Location;

    // Check MST with Location (if Location provided)
    if (Location) {
      const mstLocRows = await sequelize.query(
        `
        SELECT TOP 1 UTD, Loc_Code
        FROM dbo.Srv_Mst_Vehi_Tbl
        WHERE UPPER(REPLACE(REPLACE(ISNULL(Veh_Reg_No, ''), ' ', ''), '-', '')) = :normVeh
          AND LTRIM(RTRIM(CAST(Loc_Code AS VARCHAR(50)))) = :Location
        ORDER BY UTD DESC
        `,
        { replacements: { normVeh, Location }, type: QueryTypes.SELECT, transaction: t }
      );
      if (mstLocRows?.length > 0) {
        mstUTD = mstLocRows[0].UTD;
        targetLocCode = mstLocRows[0].Loc_Code || Location;
      }
    }

    // Check MST without Location filter
    if (!mstUTD) {
      const mstAnyRows = await sequelize.query(
        `
        SELECT TOP 1 UTD, Loc_Code
        FROM dbo.Srv_Mst_Vehi_Tbl
        WHERE UPPER(REPLACE(REPLACE(ISNULL(Veh_Reg_No, ''), ' ', ''), '-', '')) = :normVeh
        ORDER BY UTD DESC
        `,
        { replacements: { normVeh }, type: QueryTypes.SELECT, transaction: t }
      );
      if (mstAnyRows?.length > 0) {
        mstUTD = mstAnyRows[0].UTD;
        targetLocCode = mstAnyRows[0].Loc_Code || Location || "1";
      }
    }

    // Check CUST table fallback
    if (!mstUTD) {
      const custRows = await sequelize.query(
        `
        SELECT TOP 1 UTD, Tran_id, Loc_Code
        FROM dbo.Srv_Cust_Vehi_Tbl
        WHERE UPPER(REPLACE(REPLACE(ISNULL(Veh_Reg_No, ''), ' ', ''), '-', '')) = :normVeh
        ORDER BY UTD DESC
        `,
        { replacements: { normVeh }, type: QueryTypes.SELECT, transaction: t }
      );
      if (custRows?.length > 0) {
        mstUTD = custRows[0].Tran_id;
        targetLocCode = custRows[0].Loc_Code || Location || "1";
      }
    }

    if (!Location) {
      Location = targetLocCode || "1";
    }

    // If still no MST record exists, auto-create MST record seamlessly
    if (!mstUTD) {
      const newMst = await sequelize.query(
        `
        INSERT INTO dbo.Srv_Mst_Vehi_Tbl
          (Loc_Code, Veh_Reg_No, Export_Type, Service_Type, Created_By, Created_At)
        OUTPUT INSERTED.UTD
        VALUES
          (:Location, :cleanVehNo, 1, :ServiceType, :name, GETDATE())
        `,
        {
          replacements: {
            Location,
            cleanVehNo,
            ServiceType: toNull(ServiceType),
            name,
          },
          type: QueryTypes.SELECT,
          transaction: t,
        }
      );
      mstUTD = newMst?.[0]?.UTD;
    } else {
      // Update existing MST record's service type
      await sequelize.query(
        `
        UPDATE dbo.Srv_Mst_Vehi_Tbl
        SET Service_Type = ISNULL(:ServiceType, Service_Type),
            Updated_By = :name,
            Updated_At = GETDATE()
        WHERE UTD = :mstUTD
        `,
        {
          replacements: { ServiceType: toNull(ServiceType), name, mstUTD },
          type: QueryTypes.UPDATE,
          transaction: t,
        }
      );
    }

    // 2) Parse Current_Service_KM & prevLastKm validation
    const currSrvKm = parseKm(Current_Service_KM);
    const prevRows = await sequelize.query(
      `
      SELECT TOP 1 Last_Service_KM
      FROM dbo.Srv_Cust_Vehi_Tbl
      WHERE Tran_id = :mstUTD
      ORDER BY UTD DESC
      `,
      { replacements: { mstUTD }, type: QueryTypes.SELECT, transaction: t }
    );

    const prevLastKm = parseKm(prevRows?.[0]?.Last_Service_KM);

    if (!Number.isNaN(currSrvKm) && !Number.isNaN(prevLastKm) && currSrvKm <= prevLastKm) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: `Current Service KM (${currSrvKm}) must be greater than Last Service KM (${prevLastKm}).`,
      });
    }

    // 3) Archive old active rows -> 33
    await sequelize.query(
      `
      UPDATE dbo.Srv_Cust_Vehi_Tbl
      SET Export_Type = 33,
          Updated_By = :name,
          Updated_At = GETDATE()
      WHERE Tran_id = :mstUTD
        AND ISNULL(Export_Type, 1) = 1
      `,
      { replacements: { name, mstUTD }, type: QueryTypes.UPDATE, transaction: t }
    );

    // 4) Insert new active CUST row
    const convServiceDate = convertDate(Current_Service_Date) || null;
    const insertCust = await sequelize.query(
      `
      INSERT INTO dbo.Srv_Cust_Vehi_Tbl
        (
          Loc_Code,
          Veh_Reg_No,
          Cust_Name,
          Cust_Mob,
          Model_Name,
          Last_Service_Date,
          Last_Service_KM,
          Avg_Daily_KM,
          Current_KM,
          status,
          Export_Type,
          Created_By,
          Created_At,
          Tran_id
        )
      OUTPUT INSERTED.UTD
      VALUES
        (
          :Location,
          NULL,
          :Cust_Name,
          :Cust_Mob,
          :Model_Name,
          ${nullableDateExpression("Last_Service_Date")},
          :Last_Service_KM,
          :Avg_Daily_KM,
          :Current_KM,
          0,
          1,
          :name,
          GETDATE(),
          :mstUTD
        )
      `,
      {
        replacements: {
          Location,
          Cust_Name: toNull(Cust_Name),
          Cust_Mob: toNull(Cust_Mob),
          Model_Name: toNull(Model_Name),
          Last_Service_Date: convServiceDate,
          Last_Service_KM: !Number.isNaN(currSrvKm) ? currSrvKm : toIntegerOrNull(Current_KM),
          Avg_Daily_KM: toIntegerOrNull(Avg_Daily_KM),
          Current_KM: !Number.isNaN(currSrvKm) ? currSrvKm : toIntegerOrNull(Current_KM),
          name,
          mstUTD,
        },
        type: QueryTypes.SELECT,
        transaction: t,
      }
    );

    const newCustVehiUTD = insertCust?.[0]?.UTD || null;

    // 5) Reminder update (if matching pending reminder exists)
    await sequelize.query(
      `
      ;WITH Target AS (
        SELECT TOP 1 r.UTD
        FROM dbo.Srv_Reminder_Tbl r
        INNER JOIN dbo.Srv_Cust_Vehi_Tbl c ON c.UTD = r.Cust_Vehi_UTD
        LEFT JOIN dbo.Srv_Mst_Vehi_Tbl m ON m.UTD = c.Tran_id
        WHERE (
          UPPER(REPLACE(REPLACE(ISNULL(m.Veh_Reg_No, ISNULL(c.Veh_Reg_No, '')), ' ', ''), '-', '')) = :normVeh
        )
          AND r.Service_Completed_Date IS NULL
          AND r.Service_Completed_KM IS NULL
          AND (r.Service_Remark IS NULL OR LTRIM(RTRIM(r.Service_Remark)) = '')
        ORDER BY r.UTD DESC
      )
      UPDATE r
      SET r.Service_Completed_Date = ${nullableDateExpression("Service_Completed_Date")},
          r.Service_Completed_KM   = :Service_Completed_KM,
          r.Service_Remark         = :Service_Remark,
          r.Updated_By             = :name,
          r.Updated_At             = GETDATE()
      FROM dbo.Srv_Reminder_Tbl r
      INNER JOIN Target t2 ON t2.UTD = r.UTD
      `,
      {
        replacements: {
          normVeh,
          Service_Completed_Date: convServiceDate,
          Service_Completed_KM: !Number.isNaN(currSrvKm) ? currSrvKm : toIntegerOrNull(Current_KM),
          Service_Remark: toNull(Remark),
          name,
        },
        type: QueryTypes.UPDATE,
        transaction: t,
      }
    );

    await t.commit();

    return res.status(200).json({
      success: true,
      message: "Saved/Updated successfully",
      UTD: mstUTD,
      Cust_Vehi_UTD_New: newCustVehiUTD,
    });
  } catch (e) {
    if (t) await t.rollback();
    console.error("[saveOrUpdateServiceData Error]:", e);
    return res.status(500).json({ success: false, message: "Error saving service data", error: e.message });
  } finally {
    if (sequelize) await sequelize.close();
  }
};
