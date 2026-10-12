const { dbname } = require("../utils/dbconfig");

exports.getDashboardData = async (req, res) => {
  const sequelize = await dbname(req, req.headers.compcode);
  try {
    const { Loc_code, selectedDate, shiftstarttime, dept_code, from_date, to_date } = req.body;

    // ── DATE ──
    let date = selectedDate;
    if (!date) {
      const today = new Date();
      date = today.toISOString().split("T")[0];
    }

    // ── DATE RANGE (DAY-WISE ATTENDANCE) ──
    let startDate = from_date;
    let endDate = to_date || date;
    if (!startDate) {
      const d = new Date(endDate);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      startDate = `${y}-${m}-01`;
    }
    if (new Date(startDate) > new Date(endDate)) {
      const tmp = startDate;
      startDate = endDate;
      endDate = tmp;
    }

    // ── LOCATION FILTER (Supports array, comma-separated string, or single branch) ──
    let locFilter = "";
    const locInput = Loc_code || req.body.login_loc || req.body.loc_code;
    if (locInput) {
      const locArray = Array.isArray(locInput)
        ? locInput
        : String(locInput).split(",").map(s => s.trim()).filter(Boolean);
      if (locArray.length > 0) {
        const locValues = locArray.map(l => `'${String(l).replace(/'/g, "''")}'`).join(",");
        locFilter = `AND EM.LOCATION IN (${locValues})`;
      }
    }

    // ── SHIFT FILTER ──
    let shiftFilter = "";
    if (shiftstarttime !== undefined && shiftstarttime !== null && shiftstarttime !== "") {
      shiftFilter = `AND AT.SHIFTSTARTTIME = '${shiftstarttime}'`;
    }

    // ── SHIFT START EXPRESSION ──
    const shiftStartExpr = `
      DATEADD(
        MINUTE,
        (FLOOR(AT.SHIFTSTARTTIME) * 60) + ROUND((AT.SHIFTSTARTTIME - FLOOR(AT.SHIFTSTARTTIME)) * 60, 0),
        CAST(AT.DATEOFFICE AS DATETIME)
      )
    `;

    // ── DEPT FILTER (for employee list) ──
    let deptFilter = "";
    if (dept_code && dept_code !== "") {
      deptFilter = `AND EM.Division = '${dept_code}'`;
    }

    // ════════════════════════════════════════
    // QUERY 1 — SHIFT DROPDOWN
    // ════════════════════════════════════════
    const shiftQuery = `
      SELECT DISTINCT
        AT.SHIFTSTARTTIME,
        AT.SHIFTENDTIME,
        AT.SHIFT
     FROM attendancetable AT WITH (NOLOCK)
INNER JOIN EmployeeMaster EM WITH (NOLOCK)
  ON AT.Emp_Code = EM.EmpCode
 AND EM.LASTWOR_DATE IS NULL
WHERE CAST(AT.DATEOFFICE AS DATE) = :selectedDate
  ${locFilter}
      ORDER BY AT.SHIFTSTARTTIME
    `;

    // ════════════════════════════════════════
    // QUERY 2 — DAY-WISE ATTENDANCE GRAPH DATA
    // Dynamically generates all dates between :startDate and :endDate
    // ════════════════════════════════════════
    const graphQuery = `
;WITH DateRange AS (
    SELECT CAST(:startDate AS DATE) AS dt
    UNION ALL
    SELECT DATEADD(DAY, 1, dt) FROM DateRange WHERE dt < CAST(:endDate AS DATE)
),
AT_DEDUP AS (
    SELECT
        AT.*,
        M.Assessable_Column,
        ROW_NUMBER() OVER (
            PARTITION BY AT.Emp_Code, CAST(AT.DATEOFFICE AS DATE)
            ORDER BY 
                CASE WHEN ISNULL(M.Assessable_Column, 0) >= 1 THEN 0 ELSE 1 END,
                CASE WHEN AT.IN1 IS NOT NULL THEN 0 ELSE 1 END,
                CASE WHEN UPPER(LTRIM(RTRIM(ISNULL(AT.flag, '')))) = 'P' OR UPPER(LTRIM(RTRIM(ISNULL(AT.status, '')))) = 'P' THEN 0 ELSE 1 END,
                AT.DATEOFFICE DESC
        ) AS rn
    FROM attendancetable AT WITH (NOLOCK)
    LEFT JOIN Misc_Mst M WITH (NOLOCK)
        ON AT.mipunch_reason = M.Misc_Code AND M.Misc_Type = 92 AND (ISNULL(M.Export_Type, 0) < 3)
    WHERE CAST(AT.DATEOFFICE AS DATE) BETWEEN :startDate AND :endDate
    ${shiftFilter}
),
STATUS_CALC AS (
    SELECT
        DR.dt AS DATE_LABEL,
        CASE
            WHEN ISNULL(AT.Assessable_Column, 0) >= 1 THEN 'LEAVE'
            WHEN UPPER(LTRIM(RTRIM(ISNULL(AT.STATUS, '')))) = 'WO' OR UPPER(LTRIM(RTRIM(ISNULL(AT.FLAG, '')))) = 'WO' THEN 'WEEKLY OFF'
            WHEN AT.Emp_Code IS NULL THEN 'ABSENT'
            WHEN DR.dt = CAST(GETDATE() AS DATE) THEN
                CASE WHEN UPPER(LTRIM(RTRIM(ISNULL(AT.FLAG, '')))) = 'P' THEN 'PRESENT' ELSE 'ABSENT' END
            ELSE
                CASE WHEN UPPER(LTRIM(RTRIM(ISNULL(AT.STATUS, '')))) = 'P' THEN 'PRESENT' ELSE 'ABSENT' END
        END AS PUNCH_STATUS
    FROM DateRange DR
    CROSS JOIN EmployeeMaster EM
    LEFT JOIN AT_DEDUP AT
        ON LTRIM(RTRIM(CONVERT(varchar(50), AT.Emp_Code))) = LTRIM(RTRIM(CONVERT(varchar(50), EM.EmpCode)))
       AND CAST(AT.DATEOFFICE AS DATE) = DR.dt
       AND AT.rn = 1
    WHERE
        EM.LASTWOR_DATE IS NULL AND CAST(EM.CURRENTJOINDATE AS DATE) <= :endDate
        ${locFilter}
        ${deptFilter}
)
SELECT
    DATE_LABEL,
    DATENAME(WEEKDAY, DATE_LABEL) AS DAY_NAME,
    COUNT(CASE WHEN PUNCH_STATUS = 'PRESENT' THEN 1 END) AS PRESENT,
    COUNT(CASE WHEN PUNCH_STATUS = 'ABSENT' THEN 1 END) AS ABSENT,
    COUNT(CASE WHEN PUNCH_STATUS = 'LEAVE' THEN 1 END) AS ON_LEAVE,
    COUNT(CASE WHEN PUNCH_STATUS = 'WEEKLY OFF' THEN 1 END) AS WEEKLY_OFF,
    COUNT(*) AS TOTAL
FROM STATUS_CALC
GROUP BY DATE_LABEL
ORDER BY DATE_LABEL ASC
OPTION (MAXRECURSION 366);
`;
    console.log("🔥 graphQuery:", graphQuery);
    // ════════════════════════════════════════
    // QUERY 3 — DEPARTMENT STATS BLOCKS
    // ════════════════════════════════════════
    //     const deptStatsQuery = `
    //   SELECT
    //     MM.Misc_Code AS DEPT_CODE,
    //     MM.Misc_Name AS DEPT_NAME,

    //     COUNT(AT.Emp_Code) AS TOTAL,

    //     COUNT(
    //       CASE
    //         -- Today
    //         WHEN CAST(AT.DATEOFFICE AS DATE) = :selectedDate
    //              AND AT.FLAG = 'P'
    //         THEN 1

    //         -- Previous Days
    //         WHEN CAST(AT.DATEOFFICE AS DATE) <> :selectedDate
    //              AND AT.IN1 IS NOT NULL
    //              AND AT.IN1 <= ${shiftStartExpr}
    //         THEN 1
    //       END
    //     ) AS ON_TIME,

    //     COUNT(
    //       CASE
    //         -- Today
    //         WHEN CAST(AT.DATEOFFICE AS DATE) = :selectedDate
    //         THEN NULL

    //         -- Previous Days
    //         WHEN CAST(AT.DATEOFFICE AS DATE) <> :selectedDate
    //              AND AT.IN1 IS NOT NULL
    //              AND AT.IN1 > ${shiftStartExpr}
    //         THEN 1
    //       END
    //     ) AS LATE,

    //     COUNT(
    //       CASE
    //         WHEN AT.LEAVEVALUE > 0
    //              OR AT.STATUS IN ('L','HD')
    //         THEN 1
    //       END
    //     ) AS ON_LEAVE

    //   FROM MISC_MST MM

    //   LEFT JOIN EmployeeMaster EM
    //     ON EM.Division = MM.Misc_Code

    //   LEFT JOIN attendancetable AT
    //     ON AT.Emp_Code = EM.EmpCode
    //    AND CAST(AT.DATEOFFICE AS DATE) = :selectedDate
    //    ${shiftFilter}

    //   WHERE
    //     MM.Misc_Type = 68
    //     AND ISNULL(MM.Export_Type,0) < 3
    //     ${locFilter}

    //   GROUP BY
    //     MM.Misc_Code,
    //     MM.Misc_Name

    //   ORDER BY
    //     MM.Misc_Name
    // `;
    const deptStatsQuery = `
  ;WITH AT_DEDUP AS (
    SELECT
      AT.*,
      M.Assessable_Column,
      ROW_NUMBER() OVER (
        PARTITION BY AT.Emp_Code, CAST(AT.DATEOFFICE AS DATE)
        ORDER BY 
          CASE WHEN ISNULL(M.Assessable_Column, 0) >= 1 THEN 0 ELSE 1 END,
          CASE WHEN AT.IN1 IS NOT NULL THEN 0 ELSE 1 END,
          CASE WHEN UPPER(LTRIM(RTRIM(ISNULL(AT.flag, '')))) = 'P' OR UPPER(LTRIM(RTRIM(ISNULL(AT.status, '')))) = 'P' THEN 0 ELSE 1 END,
          AT.DATEOFFICE DESC
      ) AS rn
    FROM attendancetable AT WITH (NOLOCK)
    LEFT JOIN Misc_Mst M WITH (NOLOCK)
      ON AT.mipunch_reason = M.Misc_Code AND M.Misc_Type = 92 AND (ISNULL(M.Export_Type, 0) < 3)
    WHERE CAST(AT.DATEOFFICE AS DATE) = :selectedDate
    ${shiftFilter}
  )
  SELECT
    MM.Misc_Code AS DEPT_CODE,
    MM.Misc_Name AS DEPT_NAME,

    COUNT(EM.EmpCode) AS TOTAL,

    COUNT(
      CASE
        WHEN ISNULL(AT.Assessable_Column, 0) >= 1 THEN NULL
        WHEN UPPER(LTRIM(RTRIM(ISNULL(AT.STATUS, '')))) = 'WO' OR UPPER(LTRIM(RTRIM(ISNULL(AT.FLAG, '')))) = 'WO' THEN NULL
        WHEN :selectedDate = CAST(GETDATE() AS DATE)
             AND UPPER(LTRIM(RTRIM(ISNULL(AT.FLAG, '')))) = 'P'
        THEN 1
        WHEN :selectedDate <> CAST(GETDATE() AS DATE)
             AND UPPER(LTRIM(RTRIM(ISNULL(AT.STATUS, '')))) = 'P'
        THEN 1
      END
    ) AS PRESENT,

    COUNT(
      CASE
        WHEN ISNULL(AT.Assessable_Column, 0) >= 1 THEN NULL
        WHEN UPPER(LTRIM(RTRIM(ISNULL(AT.STATUS, '')))) = 'WO' OR UPPER(LTRIM(RTRIM(ISNULL(AT.FLAG, '')))) = 'WO' THEN NULL
        WHEN :selectedDate = CAST(GETDATE() AS DATE)
             AND (UPPER(LTRIM(RTRIM(ISNULL(AT.FLAG, '')))) <> 'P' OR AT.Emp_Code IS NULL)
        THEN 1
        WHEN :selectedDate <> CAST(GETDATE() AS DATE)
             AND (UPPER(LTRIM(RTRIM(ISNULL(AT.STATUS, '')))) <> 'P' OR AT.Emp_Code IS NULL)
        THEN 1
      END
    ) AS ABSENT,

    COUNT(
      CASE
        WHEN ISNULL(AT.Assessable_Column, 0) >= 1 THEN 1
      END
    ) AS ON_LEAVE

  FROM MISC_MST MM
  LEFT JOIN EmployeeMaster EM
    ON EM.Division = MM.Misc_Code
   AND EM.LASTWOR_DATE IS NULL
  LEFT JOIN AT_DEDUP AT
    ON LTRIM(RTRIM(CONVERT(varchar(50), AT.Emp_Code))) = LTRIM(RTRIM(CONVERT(varchar(50), EM.EmpCode)))
   AND AT.rn = 1
  WHERE
    MM.Misc_Type = 68
    AND ISNULL(MM.Export_Type,0) < 3
    ${locFilter}
  GROUP BY MM.Misc_Code, MM.Misc_Name
  ORDER BY MM.Misc_Name
`;
    // ════════════════════════════════════════
    // QUERY 4 — EMPLOYEE LIST (Right Panel)
    // Runs only when dept_code is passed
    // ════════════════════════════════════════
    const employeeQuery = `
;WITH AT_DEDUP AS (
    SELECT
      AT.*,
      M.Assessable_Column,
      M.Misc_Name AS LEAVE_NAME,
      ROW_NUMBER() OVER (
        PARTITION BY AT.Emp_Code, CAST(AT.DATEOFFICE AS DATE)
        ORDER BY 
          CASE WHEN ISNULL(M.Assessable_Column, 0) >= 1 THEN 0 ELSE 1 END,
          CASE WHEN AT.IN1 IS NOT NULL THEN 0 ELSE 1 END,
          CASE WHEN UPPER(LTRIM(RTRIM(ISNULL(AT.flag, '')))) = 'P' OR UPPER(LTRIM(RTRIM(ISNULL(AT.status, '')))) = 'P' THEN 0 ELSE 1 END,
          AT.DATEOFFICE DESC
      ) AS rn
    FROM attendancetable AT WITH (NOLOCK)
    LEFT JOIN Misc_Mst M WITH (NOLOCK)
      ON AT.mipunch_reason = M.Misc_Code AND M.Misc_Type = 92 AND (ISNULL(M.Export_Type, 0) < 3)
    WHERE CAST(AT.DATEOFFICE AS DATE) = :selectedDate
    ${shiftFilter}
)
SELECT
    EM.EmpCode                                        AS EMP_CODE,
    EM.EmpFirstName                                   AS EMP_NAME,
    EM.EMPLOYEEDesignation                            AS DESIGNATION,
    EM.EmployeeType                                   AS EMPLOYEE_TYPE,
    DEPT.Misc_Name                                    AS DEPARTMENT,

    CONVERT(VARCHAR(8), AT.IN1, 108)                  AS LOGIN_TIME,
    CONVERT(VARCHAR(8), AT.OUT1, 108)                 AS LOGOUT_TIME,
    AT.STATUS                                         AS ATTENDANCE_STATUS,

    CASE
        WHEN ISNULL(AT.Assessable_Column, 0) >= 1 THEN 'LEAVE'
        WHEN UPPER(LTRIM(RTRIM(ISNULL(AT.STATUS, '')))) = 'WO' OR UPPER(LTRIM(RTRIM(ISNULL(AT.FLAG, '')))) = 'WO' THEN 'WEEKLY OFF'
        WHEN AT.Emp_Code IS NULL THEN 'ABSENT'

        -- Aaj ki date ho to live FLAG se dekho
        WHEN CAST(GETDATE() AS DATE) = :selectedDate THEN
            CASE WHEN UPPER(LTRIM(RTRIM(ISNULL(AT.FLAG, '')))) = 'P' THEN 'PRESENT' ELSE 'ABSENT' END

        -- Purani date ho to finalized STATUS se dekho
        ELSE
            CASE WHEN UPPER(LTRIM(RTRIM(ISNULL(AT.STATUS, '')))) = 'P' THEN 'PRESENT' ELSE 'ABSENT' END
    END                                                AS PUNCH_STATUS,

    ED.DOC_PATH                                       AS PHOTO_PATH

FROM EmployeeMaster EM

LEFT JOIN AT_DEDUP AT
       ON LTRIM(RTRIM(CONVERT(varchar(50), AT.Emp_Code))) = LTRIM(RTRIM(CONVERT(varchar(50), EM.EmpCode)))
      AND AT.rn = 1

LEFT JOIN MISC_MST DEPT
       ON DEPT.Misc_Type = 68
      AND DEPT.Misc_Code = EM.Division
      AND ISNULL(DEPT.Export_Type,0) < 3

LEFT JOIN EMP_DOCS ED
       ON ED.EMP_CODE = EM.EmpCode
      AND ED.columndoc_type = 'EMPLOYEE'
      AND ED.Seq_No = 1
      AND ISNULL(ED.export_type,0) < 3

WHERE 1=1
    AND EM.LASTWOR_DATE IS NULL AND CAST(EM.CURRENTJOINDATE AS DATE) <= :selectedDate
    ${locFilter}
    ${deptFilter}

ORDER BY EM.EmpFirstName
`;


    // ════════════════════════════════════════
    // QUERY 5 — PENDING LEAVE LIST
    // ════════════════════════════════════════
    const pendingLeaveListQuery = `
  SELECT
    EM.EmpCode                                      AS EMP_CODE,
    CONCAT(EM.EmpFirstName, ' ', EM.EmpLastName)     AS EMP_NAME,
    DEPT.Misc_Name                                  AS DEPARTMENT,

    CAST(AT.DATEOFFICE AS DATE)                     AS LEAVE_DATE,
    AT.Leave_applied_on                             AS APPLIED_ON,
     LM.Misc_Name                                   AS LEAVE_TYPE,
    'Pending'                                       AS STATUS

  FROM attendancetable AT
  INNER JOIN EmployeeMaster EM
    ON EM.EmpCode = AT.Emp_Code

  LEFT JOIN MISC_MST DEPT
    ON DEPT.Misc_Type = 68
    AND DEPT.Misc_Code = EM.Division

    -- Leave Type Join
  LEFT JOIN MISC_MST LM
    ON LM.Misc_Type = 92
    AND LM.Assessable_Column IN (1,2,3)
    AND LM.Misc_Code = AT.mipunch_reason


  WHERE
    CAST(AT.DATEOFFICE AS DATE) = :selectedDate
    ${locFilter}
    ${shiftFilter}

    -- Only leave records
    AND AT.Leave_applied_on IS NOT NULL

    -- Pending logic
    AND (
      (AT.Appr_1_Stat IS NULL AND AT.Appr_2_Stat IS NULL AND AT.Appr_3_Stat IS NULL)
      OR
      (AT.Appr_1_Stat = 1 AND (AT.Appr_2_Code IS NOT NULL AND AT.Appr_2_Stat IS NULL))
      OR
      (AT.Appr_2_Stat = 1 AND (AT.Appr_3_Code IS NOT NULL AND AT.Appr_3_Stat IS NULL))
    )

    -- Exclude final approved/rejected
    AND ISNULL(AT.MAN_APPR,'N') <> 'Y'
    AND ISNULL(AT.MAN_REJ,'N') <> 'Y'

  ORDER BY EM.EmpFirstName
`;

    // ════════════════════════════════════════
    // RUN ALL QUERIES IN PARALLEL
    // ════════════════════════════════════════
    const replacements = {
      selectedDate: date,
      startDate: startDate,
      endDate: endDate,
    };

    // const [
    //   [shifts],
    //   [graphData],
    //   [deptStats],
    //   [employees],
    //   [pendingLeaves]
    // ] = await Promise.all([
    //   sequelize.query(shiftQuery, { replacements }),
    //   sequelize.query(graphQuery, { replacements }),
    //   sequelize.query(deptStatsQuery, { replacements }),
    //   // Only run employee query if dept_code is provided, else return []
    //   dept_code && dept_code !== ""
    //     ? sequelize.query(employeeQuery, { replacements })
    //     : Promise.resolve([[]]),
    //   sequelize.query(pendingLeaveListQuery, { replacements })
    // ]);

    const [
      [shifts],
      [graphData],
      [deptStats],
      [employees],
      [pendingLeaves]
    ] = await Promise.all([
      sequelize.query(shiftQuery, { replacements }),
      sequelize.query(graphQuery, { replacements }),
      sequelize.query(deptStatsQuery, { replacements }),
      sequelize.query(employeeQuery, { replacements }),   // 🔴 pehle conditional tha, ab hamesha chalega
      sequelize.query(pendingLeaveListQuery, { replacements })
    ]);
    // ── Attach full photo URL to employees ──
    const BASE_URL = process.env.DOC_BASE_URL || "";
    const employeeList = employees.map(emp => ({
      ...emp,
      PHOTO_URL: emp.PHOTO_PATH ? `${BASE_URL}${emp.PHOTO_PATH}` : null,
    }));
    const employeesData = {
      all: employeeList,
      present: employeeList.filter(e => e.PUNCH_STATUS === "PRESENT"),
      absent: employeeList.filter(e => e.PUNCH_STATUS === "ABSENT"),
    };

    // ── SEND SINGLE RESPONSE ──
    res.json({
      success: true,
      date: date,
      result: {
        shifts,         // → Shift dropdown
        graphData,      // → Bar chart (8 days On-Time vs Late)
        deptStats,      // → Department blocks
        employees: employeesData, // → Right panel (only when dept_code passed)
        pendingLeaves
      },
    });

  } catch (err) {
    console.error("❌ getDashboardData Error:", err);
    res.status(500).json({ success: false, error: err.message });
  } finally {
    if (sequelize) await sequelize.close();
  }
};

exports.getAttendanceStatusDashboard = async function (req, res) {
  const sequelize = await dbname(req, req.headers.compcode);
  try {
    const data = req.body;
    const selectedDate = data.selectedDate;
    const region = data.region;
    const channel = data.channel;
    const Cluster = data.Cluster;
    const location = data.location;
    const section = data.section;
    const department = data.department;
    const designation = data.designation;
    const emptype = data.emptype;
    const empcode = data.empcode;
    const LeftEmp = data.LeftEmp;
    const user_location = data.user_location;
    if (!selectedDate) {
      return res.status(400).json({
        success: false,
        message: "selectedDate is required",
      });
    }
    /*
    ---------------------------------------------------------
    EMPLOYEE FILTER
    Same logic as attendanceReport
    ---------------------------------------------------------
    */
    let employeeWhere = `
EM.EXPORT_TYPE < 3
`;
    const replacements = {
      selectedDate,
    };
    if (region) {
      employeeWhere += `
AND EM.SAL_REGION IN (${region})
`;
    }
    if (channel) {
      employeeWhere += `
AND EM.CHANNEL IN (${channel})
`;
    }
    if (Cluster) {
      employeeWhere += `
AND EM.CLUSTER IN (${Cluster})
`;
    }
    if (parseInt(user_location)) {
      if (location) {
        employeeWhere += `
AND EM.LOCATION IN (${location})
`;
      }
    } else {
      if (location) {
        employeeWhere += `
AND EM.LOCATION IN (
SELECT MISC_CODE
FROM MISC_MST
WHERE MISC_TYPE = 85
AND MISC_HOD IN (${location})
)
`;
      }
    }
    if (section) {
      employeeWhere += `
AND EM.SECTION IN (${section})
`;
    }
    if (department) {
      employeeWhere += `
AND EM.DIVISION IN (${department})
`;
    }
    if (designation) {
      const desigList = designation
        .split(",")
        .map((d) => `'${d.trim().replace(/'/g, "''")}'`)
        .join(",");
      employeeWhere += `
AND EM.EMPLOYEEDESIGNATION IN (${desigList})
`;
    }
    if (emptype) {
      employeeWhere += `
AND EM.EMPTYPE IN (${emptype})
`;
    }
    if (empcode) {
      const empList = empcode
        .split(",")
        .map((e) => `'${e.trim().replace(/'/g, "''")}'`)
        .join(",");
      employeeWhere += `
AND EM.EMPCODE IN (${empList})
`;
    }
    /*
    Same Left Employee logic as attendanceReport
    */
    if (LeftEmp == 1) {
      employeeWhere += `
AND (
EM.LASTWOR_DATE IS NULL
OR EM.LASTWOR_DATE > @SelectedDate
)
AND CAST(EM.CURRENTJOINDATE AS DATE) <= @SelectedDate
`;
    } else {
      employeeWhere += `
AND EM.LASTWOR_DATE IS NULL AND CAST(EM.CURRENTJOINDATE AS DATE) <= @SelectedDate
`;
    }
    /*
    ---------------------------------------------------------
    LOCATION FROM FRONTEND
    
    Your current frontend sends:
    Loc_code: ["1","2","3"]
    ---------------------------------------------------------
    */
    let attendanceLocationFilter = "";
    const locInput = data.Loc_code || data.login_loc || data.loc_code;
    if (locInput) {
      const locArray = Array.isArray(locInput)
        ? locInput
        : String(locInput).split(",").map(s => s.trim()).filter(Boolean);
      if (locArray.length > 0) {
        const locList = locArray
          .map((x) => `'${String(x).replace(/'/g, "''")}'`)
          .join(",");
        attendanceLocationFilter = `
AND EM.LOCATION IN (${locList})
`;
      }
    }
    /*
    ---------------------------------------------------------
    DEPARTMENT FROM CURRENT DASHBOARD
    ---------------------------------------------------------
    */
    if (data.dept_code) {
      employeeWhere += `
AND EM.DIVISION = '${String(data.dept_code).replace(/'/g, "''")}'
`;
    }
    /*
    ---------------------------------------------------------
    SHIFT FILTER
    
    If dashboard sends Shift, compare against attendance shift.
    ---------------------------------------------------------
    */
    let shiftFilter = "";
    if (
      data.shiftstarttime !== undefined &&
      data.shiftstarttime !== null &&
      data.shiftstarttime !== ""
    ) {
      shiftFilter = `
AND ISNULL(AT.SHIFTSTARTTIME, 0) = ${Number(
        data.shiftstarttime
      )}
`;
    }
    /*
    ---------------------------------------------------------
    IMPORTANT
    
    Shiftstarttime is decimal style:
    
    9.30 = 09:30
    10.00 = 10:00
    9.45 = 09:45
    
    So DON'T convert it as decimal hours.
    
    9.30 means 9 hours + 30 minutes.
    ---------------------------------------------------------
    */
    const query = `
DECLARE @SelectedDate DATE = :selectedDate;
;WITH AT_DEDUP AS (
    SELECT
        A.Emp_Code,
        A.dateoffice,
        A.mipunch_reason,
        A.flag,
        A.status,
        A.IN1,
        A.IN2,
        A.OUT1,
        A.SHIFTSTARTTIME,
        A.PRESENTVALUE,
        A.ABSENTVALUE,
        A.WO_VALUE,
        M.Assessable_Column,
        M.Misc_Name AS LEAVE_NAME,
        ROW_NUMBER() OVER (
            PARTITION BY A.Emp_Code, CAST(A.dateoffice AS DATE)
            ORDER BY
                CASE WHEN ISNULL(M.Assessable_Column, 0) >= 1 THEN 0 ELSE 1 END,
                CASE WHEN A.IN1 IS NOT NULL THEN 0 ELSE 1 END,
                CASE WHEN UPPER(LTRIM(RTRIM(ISNULL(A.flag, '')))) = 'P' OR UPPER(LTRIM(RTRIM(ISNULL(A.status, '')))) = 'P' THEN 0 ELSE 1 END,
                A.dateoffice DESC
        ) AS rn
    FROM attendancetable A WITH (NOLOCK)
    LEFT JOIN Misc_Mst M WITH (NOLOCK)
        ON A.mipunch_reason = M.Misc_Code
       AND M.Misc_Type = 92
       AND (ISNULL(M.Export_Type, 0) < 3)
    WHERE CAST(A.dateoffice AS DATE) = @SelectedDate
    ${shiftFilter}
),
EmployeeData AS
(
    SELECT
        EM.EMPCODE,
        CONCAT(
            ISNULL(EM.TITLE, ''),
            ' ',
            ISNULL(EM.EMPFIRSTNAME, ''),
            ' ',
            ISNULL(EM.EMPLASTNAME, '')
        ) AS EmployeeName,
        EM.SAL_REGION,
        EM.CHANNEL,
        EM.CLUSTER,
        EM.LOCATION,
        (
            SELECT TOP 1 MISC_NAME
            FROM MISC_MST
            WHERE MISC_TYPE = 85
            AND MISC_CODE = EM.LOCATION
        ) AS LOCATION_NAME,
        EM.SECTION,
        EM.DIVISION,
        (
            SELECT TOP 1 MISC_NAME
            FROM MISC_MST
            WHERE MISC_TYPE = 68
            AND MISC_CODE = EM.DIVISION
            AND ISNULL(EXPORT_TYPE, 0) < 3
        ) AS DEPARTMENT_NAME,
        EM.EMPLOYEEDESIGNATION,
        AT.DATEOFFICE,
        AT.STATUS,
        AT.FLAG,
        AT.IN1,
        AT.IN2,
        AT.OUT1,
        AT.SHIFTSTARTTIME,
        AT.PRESENTVALUE,
        AT.ABSENTVALUE,
        AT.WO_VALUE,
        AT.Assessable_Column,
        AT.LEAVE_NAME,

        DATEADD(
            MINUTE,
            (
                FLOOR(ISNULL(AT.SHIFTSTARTTIME, 0)) * 60
                +
                ROUND(
                    (
                        ISNULL(AT.SHIFTSTARTTIME, 0)
                        -
                        FLOOR(ISNULL(AT.SHIFTSTARTTIME, 0))
                    ) * 100,
                    0
                )
            ),
            CAST(@SelectedDate AS DATETIME)
        ) AS ShiftStartDateTime
    FROM EMPLOYEEMASTER EM WITH (NOLOCK)
    LEFT JOIN AT_DEDUP AT
        ON LTRIM(RTRIM(CONVERT(varchar(50), AT.Emp_Code))) = LTRIM(RTRIM(CONVERT(varchar(50), EM.EMPCODE)))
       AND AT.rn = 1
    WHERE
        ${employeeWhere}
        ${attendanceLocationFilter}
),
StatusData AS
(
    SELECT
        *,
        CASE
            -- 1. Leave: Assessable_Column me 1 ya usase jyada ho
            WHEN ISNULL(Assessable_Column, 0) >= 1 THEN 'LEAVE'

            -- 2. Weekly Off
            WHEN UPPER(LTRIM(RTRIM(ISNULL(STATUS, '')))) = 'WO' OR UPPER(LTRIM(RTRIM(ISNULL(FLAG, '')))) = 'WO' THEN 'WEEKLY OFF'

            -- 3. Aaj ki date: flag se lena hai
            WHEN @SelectedDate = CAST(GETDATE() AS DATE) THEN
                CASE
                    WHEN UPPER(LTRIM(RTRIM(ISNULL(FLAG, '')))) = 'P' THEN
                        CASE
                            WHEN IN1 IS NOT NULL AND CAST(IN1 AS TIME) < CAST(ShiftStartDateTime AS TIME) THEN 'EARLY'
                            WHEN IN1 IS NOT NULL AND CAST(IN1 AS TIME) = CAST(ShiftStartDateTime AS TIME) THEN 'ONTIME'
                            WHEN IN1 IS NOT NULL AND CAST(IN1 AS TIME) > CAST(ShiftStartDateTime AS TIME) THEN 'LATE'
                            ELSE 'PRESENT'
                        END
                    ELSE 'ABSENT'
                END

            -- 4. Aaj se pehle ka: status se lena hai
            ELSE
                CASE
                    WHEN UPPER(LTRIM(RTRIM(ISNULL(STATUS, '')))) = 'P' THEN
                        CASE
                            WHEN IN1 IS NOT NULL AND CAST(IN1 AS TIME) < CAST(ShiftStartDateTime AS TIME) THEN 'EARLY'
                            WHEN IN1 IS NOT NULL AND CAST(IN1 AS TIME) = CAST(ShiftStartDateTime AS TIME) THEN 'ONTIME'
                            WHEN IN1 IS NOT NULL AND CAST(IN1 AS TIME) > CAST(ShiftStartDateTime AS TIME) THEN 'LATE'
                            ELSE 'PRESENT'
                        END
                    ELSE 'ABSENT'
                END
        END AS AttendanceStatus
    FROM EmployeeData
)
SELECT
    EMPCODE,
    EmployeeName,
    SAL_REGION,
    CHANNEL,
    CLUSTER,
    LOCATION,LOCATION_NAME,
    SECTION,
    DIVISION,
    DEPARTMENT_NAME,
    EMPLOYEEDESIGNATION,
    DATEOFFICE,
    STATUS,
    FLAG,
    IN1,
    IN2,
    OUT1,
    SHIFTSTARTTIME,
    ShiftStartDateTime,
    AttendanceStatus,
    LEAVE_NAME
FROM StatusData
ORDER BY
    DIVISION,
    EmployeeName;
`;

    console.log(query, "query")
    const [rows] = await sequelize.query(query, {
      replacements,
    });
    /*
    ---------------------------------------------------------
    SUMMARY
    ---------------------------------------------------------
    */
    const summary = {
      total: rows.length,
      ontime: rows.filter(
        (x) => x.AttendanceStatus === "ONTIME"
      ).length,
      early: rows.filter(
        (x) => x.AttendanceStatus === "EARLY"
      ).length,
      late: rows.filter(
        (x) => x.AttendanceStatus === "LATE"
      ).length,
      absent: rows.filter(
        (x) => x.AttendanceStatus === "ABSENT"
      ).length,
      onLeave: rows.filter(
        (x) => x.AttendanceStatus === "LEAVE"
      ).length,
      weeklyOff: rows.filter(
        (x) => x.AttendanceStatus === "WEEKLY OFF"
      ).length,
    };
    /*
    ---------------------------------------------------------
    DEPARTMENT WISE
    ---------------------------------------------------------
    */
    const departmentMap = {};
    rows.forEach((row) => {
      const department =
        row.DEPARTMENT_NAME ||
        row.DIVISION ||
        "Unknown";
      if (!departmentMap[department]) {
        departmentMap[department] = {
          department,
          total: 0,
          ontime: 0,
          early: 0,
          late: 0,
          absent: 0,
          onLeave: 0,
          weeklyOff: 0,
        };
      }
      const item = departmentMap[department];
      item.total++;
      switch (row.AttendanceStatus) {
        case "ONTIME":
          item.ontime++;
          break;
        case "EARLY":
          item.early++;
          break;
        case "LATE":
          item.late++;
          break;
        case "ABSENT":
          item.absent++;
          break;
        case "LEAVE":
          item.onLeave++;
          break;
        case "WEEKLY OFF":
          item.weeklyOff++;
          break;
      }
    });
    const departmentData =
      Object.values(departmentMap);
    /*
    ---------------------------------------------------------
    STATUS DETAIL
    ---------------------------------------------------------
    */
    const statusData = [
      {
        status: "On Time",
        count: summary.ontime,
      },
      {
        status: "Early Coming",
        count: summary.early,
      },
      {
        status: "Late Coming",
        count: summary.late,
      },
      {
        status: "Absent",
        count: summary.absent,
      },
      {
        status: "On Leave",
        count: summary.onLeave,
      },
      {
        status: "Weekly Off",
        count: summary.weeklyOff,
      },
    ];

    const locationMap = {};
    rows.forEach((row) => {
      const location =
        row.LOCATION_NAME ||
        row.LOCATION ||
        "Unknown";
      if (!locationMap[location]) {
        locationMap[location] = {
          location,
          total: 0,
          ontime: 0,
          early: 0,
          late: 0,
          absent: 0,
          onLeave: 0,
          weeklyOff: 0,
        };
      }
      const item = locationMap[location];
      item.total++;
      switch (row.AttendanceStatus) {
        case "ONTIME":
          item.ontime++;
          break;
        case "EARLY":
          item.early++;
          break;
        case "LATE":
          item.late++;
          break;
        case "ABSENT":
          item.absent++;
          break;
        case "LEAVE":
          item.onLeave++;
          break;
        case "WEEKLY OFF":
          item.weeklyOff++;
          break;
      }
    });
    const locationData = Object.values(locationMap);
    return res.status(200).json({
      success: true,
      result: {
        date: selectedDate,
        summary,
        statusData,
        departmentData,
        employees: rows,
        locationData,
      },
    });
  } catch (error) {
    console.error(
      "getAttendanceStatusDashboard ERROR:",
      error
    );
    return res.status(500).json({
      success: false,
      message: "Error fetching attendance status dashboard",
      error: error.message,
    });
  } finally {
    if (sequelize) await sequelize.close();
  }
};