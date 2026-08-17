
const sql = require("mssql");
const { Sequelize, DataTypes, literal, QueryTypes } = require("sequelize");
const { dbname } = require("../utils/dbconfig");


async function getMiscOptions(req, miscType, compcode) {
  const sequelize = await dbname(req, compcode);
  try {
    let query = `
      SELECT Misc_Name AS label, CAST(Misc_Code AS VARCHAR) AS value
      FROM Misc_Mst
      WHERE Misc_Type = '${miscType}' AND Export_Type < 3
    `;

    const result = await sequelize.query(query);
    return result[0];
  } catch (err) {
    console.error("Error in getMiscOptions:", err);
    return [];
  }
}


async function getValueLabelOptions(req, value, label, tablename, whereCondition, compcode) {
  const sequelize = await dbname(req, compcode);
  if (!sequelize) {
    console.error("Database connection failed");
    return [];
  }

  try {
    // Check if Export_Type column exists
    const [columns] = await sequelize.query(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = '${tablename}' AND COLUMN_NAME = 'Export_Type'
      `);

    // Start building the query
    let query = `
        SELECT ${label} AS label, CAST(${value} AS VARCHAR) AS value
        FROM ${tablename}
      `;

    // Prepare conditions
    const conditions = [];

    if (whereCondition && whereCondition.trim() !== "") {
      conditions.push(whereCondition);
    }

    if (columns.length > 0) {
      conditions.push("Export_Type < 3");
    }

    // Add WHERE clause if any condition exists
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    console.log(query, 'Final SQL Query');
    const [result] = await sequelize.query(query);
    return result;

  } catch (err) {
    console.error("Error in getValueLabelOptions:", err);
    return [];
  }
}


async function getSubGroups(req, value, compcode) {
  const sequelize = await dbname(req, compcode);
  if (!sequelize) {
    console.error("Database connection failed");
    return [];
  }

  try {
    // Check if Export_Type column exists
    const [result] = await sequelize.query(`
        DECLARE @ParentGroup INT = ${value}; -- root or desired parent group

WITH GroupHierarchy AS (
    -- Anchor: direct children
    SELECT
        group_code AS child_group,
        sub_group  AS parent_group
    FROM grup_mst
    WHERE sub_group = @ParentGroup

    UNION ALL

    -- Recursive: children of children
    SELECT
        g.group_code AS child_group,
        g.sub_group  AS parent_group
    FROM grup_mst g
    INNER JOIN GroupHierarchy gh
        ON g.sub_group = gh.child_group
)
-- Add the parent group itself, then aggregate everything
SELECT STRING_AGG(CAST(child_group AS VARCHAR(MAX)), ',') AS child_group_list
FROM (
    SELECT child_group FROM GroupHierarchy
    UNION ALL
    SELECT @ParentGroup AS child_group
) AS AllGroups;
      `);

    return result;

  } catch (err) {
    console.error("Error in getValueLabelOptions:", err);
    return [];
  }
}

// function toSqlSmallDateTime(val) {
//   if (!val) return null;
//   if (!(val instanceof Date)) return val;

//   const pad = n => n.toString().padStart(2, "0");

//   return (
//     val.getUTCFullYear() + "-" +
//     pad(val.getUTCMonth() + 1) + "-" +
//     pad(val.getUTCDate()) + " " +
//     pad(val.getUTCHours()) + ":" +
//     pad(val.getUTCMinutes()) + ":" +
//     pad(val.getUTCSeconds())
//   );
// }

// Utility function to safely format SQL dates
function toSqlSmallDateTime(val) {
  if (!val) return null;

  const d = val instanceof Date ? val : new Date(val);
  if (isNaN(d.getTime())) return null;

  const pad = n => n.toString().padStart(2, "0");
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ` +
    `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
}

// Improved logging function with better error handling
async function AttenDataLogs({
  req,
  sequelize,
  compcode,
  empCode,
  mpDate,
  logsType,
  insertedBy = null,
  transaction = null // ✅ Add transaction parameter
}) {
  let localSequelize;
  let t;

  try {
    if (!empCode || !mpDate) return;

    // Get sequelize
    localSequelize = await dbname(req, req.headers.compcode);

    // 🔥 Use existing transaction if provided, otherwise create new
    t = transaction ? transaction : await localSequelize.transaction();
    const shouldCommit = !transaction; // Only commit if we created the transaction

    // STEP 1: fetch attendance
    const rows = await localSequelize.query(
      `SELECT * FROM attendancetable
       WHERE Emp_Code = :empCode
         AND DateOffice = :mpDate`,
      {
        replacements: { empCode, mpDate },
        type: localSequelize.QueryTypes.SELECT,
        transaction: t
      }
    );

    if (!rows || rows.length === 0) {
      if (shouldCommit) await t.rollback();
      return;
    }

    const raw = rows[0];

    // STEP 2: build payload (same as before)
    const logPayload = {
      ...raw,
      Emp_Code: raw.Emp_Code?.trim?.() ?? raw.Emp_Code,
      status: raw.status?.trim?.() ?? raw.status,
      flag: raw.flag?.trim?.() ?? raw.flag,
      Inserted_by: insertedBy ?? empCode ?? null,
      Inserted_At: new Date(),
      Logs_Type: logsType
    };

    const smalldatetimeFields = [
      "dateoffice", "BM_IN1", "BM_OUT1", "in1", "in2", "out1", "out2",
      "lunchstarttime", "lunchendtime",
      "againstdate1", "againstdate2",
      "App_in1", "App_out1",
      "Device_in1", "Device_Out1",
      "mp_in1", "mp_out1",
      "Canc_1_Date", "Canc_2_Date", "Canc_3_Date",
      "Mispunch_applied_on", "Leave_applied_on",
      "Appr_1_date", "Appr_2_date", "Appr_3_date",
      "Canc_Date", "Inserted_At"
    ];

    for (const f of smalldatetimeFields) {
      if (!(f in logPayload)) continue;

      const v = logPayload[f];
      if (v === "" || v === " " || v === 0 || v === "0") {
        logPayload[f] = null;
        continue;
      }
      logPayload[f] = toSqlSmallDateTime(v);
    }

    logPayload.Inserted_At = new Date().toLocaleString("sv-SE", {
      timeZone: "Asia/Kolkata"
    });
    // STEP 3: insert log
    const columns = Object.keys(logPayload).join(", ");
    const values = Object.keys(logPayload).map(k => `:${k}`).join(", ");

    const insertLogQuery = `
      INSERT INTO attendancetable_log (${columns})
      VALUES (${values})
    `;

    await localSequelize.query(insertLogQuery, {
      replacements: logPayload,
      transaction: t
    });

    // 🔥 Only commit if we created the transaction
    if (shouldCommit) {
      await t.commit();
    }

  } catch (err) {
    if (!t.finished) await t.rollback();
    console.error("AttenDataLogs failed:", err.message);
    throw err;
  } finally {
    if (!t.finished) await t.rollback();
  }
}


async function saveEmpAtnrunTemp(
  month,
  empcode,
  sequelize,
  compcode,
  createdByOverride = null
) {
  try {

    if (month == 5) {
      return {
        success: true,
        message: "Month 5 skipped"
      };
    }

    if (!month || !empcode) {
      return {
        success: false,
        message: "month and empcode are required"
      };
    }

    const intMonth = parseInt(month, 10);

    // ==========================================
    // CHECK DUPLICATE
    // ==========================================

    const [exists] = await sequelize.query(
      `
      SELECT TOP 1 Emp_Code
      FROM Emp_Atnrun_Temp
      WHERE Emp_Code = :empcode
        AND Rerun = :month
        AND Type = 'AUTO'
      `,
      {
        replacements: {
          empcode,
          month: intMonth
        }
      }
    );

    if (exists.length > 0) {
      return {
        success: true,
        message: "Already exists"
      };
    }

    // ==========================================
    // INSERT
    // ==========================================

    await sequelize.query(
      `
      INSERT INTO Emp_Atnrun_Temp
      (
        Emp_Code,
        Rerun,
        Type,
        Seq_No,
        Loc_Code,
        Created_by
      )
      VALUES
      (
        :empcode,
        :month,
        'AUTO',
        1,
        1,
        :createdBy
      )
      `,
      {
        replacements: {
          empcode,
          month: intMonth,
          createdBy: createdByOverride || empcode
        }
      }
    );

    return {
      success: true,
      message: "Data saved successfully"
    };

  } catch (err) {

    console.log(
      "Error in saveEmpAtnrunTemp :",
      err
    );

    return {
      success: false,
      message: err.message
    };

  }
}

module.exports = {
  getMiscOptions,
  getValueLabelOptions,
  getSubGroups,
  AttenDataLogs,
  saveEmpAtnrunTemp
};