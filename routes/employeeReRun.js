const fs = require("fs");
const path = require("path");
const { dbname } = require("../utils/dbconfig");
const SchedulerLogger = require("../utils/schedulerLogger");

function writeDailySchedulerLog(logData) {
    try {
        const today = new Date().toISOString().split("T")[0];
        const logDir = path.join(__dirname, "..", "scheduler_logs");
        if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
        const filePath = path.join(logDir, `${today}.txt`);
        fs.appendFileSync(filePath, JSON.stringify(logData) + "\n");
    } catch (err) {
        console.error("TXT log failed:", err.message);
    }
}

function fmtDate(d) {
    if (!d) return null;
    const dt = new Date(d);
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}

function toSqlDate(d) {
    if (!d) return null;
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return null;
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}

async function getCustomMonthDynamic(sequelize, date) {
    if (!date) {
        throw new Error("Date is required");
    }
    const d = new Date(date);
    if (isNaN(d.getTime())) {
        throw new Error(`Invalid date received: ${date}`);
    }
    const formattedDate = d.toISOString().split("T")[0];
    const query = `
SELECT Misc_Code, Misc_Dtl1, Misc_Dtl2
FROM Misc_Mst
WHERE Misc_Type = 25
AND TRY_CONVERT(DATE, Misc_Dtl1, 103) <= :date
AND TRY_CONVERT(DATE, Misc_Dtl2, 103) >= :date
`;
    const [rows] = await sequelize.query(query, {
        replacements: { date: formattedDate }
    });
    if (rows.length > 0) {
        const row = rows[0];
        const customMonth = row.Misc_Code.toString().padStart(2, "0");
        const [, , year] = row.Misc_Dtl2.split("/");
        const customYear = parseInt(year);
        return { customMonth, customYear };
    } else {
        const month = d.getMonth() + 1;
        const year = d.getFullYear();
        return {
            customMonth: month.toString().padStart(2, "0"),
            customYear: year,
        };
    }
}

/* ==========================================================================
HELPER: active attendance policies
========================================================================== */
async function getActiveAttendancePolicies(sequelize) {
    const [policies] = await sequelize.query(`
SELECT * FROM attendance_policies_table
WHERE export_type < 3
AND is_active = 1
AND CAST(GETDATE() AS DATE) BETWEEN effective_from AND effective_to
`);
    return policies;
}

/* ==========================================================================
HELPER: status rules for a policy (P / HLF / A / WO thresholds)
========================================================================== */
async function getStatusRulesForPolicy(sequelize, policyUTD) {
    const [rules] = await sequelize.query(`
SELECT sr.*, ans.Present, ans.Absent, ans.HalfDay, ans.WeekOff, ans.Value
FROM attendance_status_rules_table sr
LEFT JOIN Employee_AtnStatus ans
ON ans.Status = sr.desc_code
AND CAST(GETDATE() AS DATE) BETWEEN ans.ValidFrom AND ans.ValidTo
WHERE sr.policy_utd = :policyUTD
AND sr.export_type < 3
`, { replacements: { policyUTD } });
    return rules;
}

/* ==========================================================================
LOCATION LOCK CHECK
========================================================================== */
async function isLocationLocked(sequelize, location, Month, Year) {
    const [miscRow] = await sequelize.query(`
SELECT Join_Date FROM misc_mst
WHERE misc_type = 85 AND misc_code = :location
`, { replacements: { location } });
    const joinDate = miscRow[0]?.Join_Date ? new Date(miscRow[0].Join_Date) : null;
    if (joinDate && (joinDate.getMonth() + 1) === Number(Month) && joinDate.getFullYear() === Number(Year)) {
        return true;
    }
    return false;
}

/* ==========================================================================
HELPER: logProcess
========================================================================== */
async function logProcess(sequelize, payload) {
    try {
        await sequelize.query(`
INSERT INTO Attendance_RunLog
(Loc_Code, SalMnth, SalYear, Action_Type, Status, Remark, Emp_Count, Created_By, Created_On)
VALUES
(:Loc_Code, :SalMnth, :SalYear, :Action_Type, :Status, :Remark, :Emp_Count, :Created_By, GETDATE())
`, { replacements: payload });
    } catch (err) {
        console.error("logProcess failed:", err.message);
    }
}


/* ==========================================================================
HELPER: employees to process — from emp_atnrun (Rerun = month),
filtered by ONE location (not the whole policy list) + employee_types
========================================================================== */
const EMP_TYPE_MAP = {
    regular: "1",
    casual: "2",
    apprentice: "3",
};
function mapEmployeeTypesToCodes(employeeTypesStr) {
    if (!employeeTypesStr) return "";
    return employeeTypesStr
        .split(",")
        .map(t => t.trim().toLowerCase())
        .map(t => EMP_TYPE_MAP[t] || t)
        .join(",");
}
async function getFilteredAtnEmployees(sequelize, policy, location, month, year) {
    const employeeTypeCodes = mapEmployeeTypesToCodes(policy.employee_types);
    const [employees] = await sequelize.query(`
SELECT DISTINCT
ea.Emp_Code AS EMPCODE,
em.LOCATION,
em.EMPTYPE,
em.PAY_CODE,
em.ISRW,
em.CURRENTJOINDATE,
em.LASTWOR_DATE,
em.EMP_SHIFT,
em.WEEKLYOFF,
em.DIVISION
FROM emp_atnrun ea
INNER JOIN EMPLOYEEMASTER em
ON em.EMPCODE COLLATE database_default =
ea.Emp_Code COLLATE database_default
WHERE (ea.Rerun = :month OR ISNULL(em.ISRW, 0) = 0)
-- ⭐ single location now (locked/unlocked per location)
AND em.LOCATION = :location
AND (',' + :employeeTypeCodes + ',')
LIKE '%,' + CAST(em.EMPTYPE AS VARCHAR) + ',%'
AND CAST(em.CURRENTJOINDATE AS DATE)
<= EOMONTH(DATEFROMPARTS(:year, :month, 1))
AND (
em.LASTWOR_DATE IS NULL
OR CAST(em.LASTWOR_DATE AS DATE)
>= DATEFROMPARTS(:year, :month, 1)
)
`, {
        replacements: { month, year, location, employeeTypeCodes }
    });
    return employees;
}
async function getAllShifts(sequelize) {
    const [rows] = await sequelize.query(`
SELECT Misc_Code, Misc_Name, Misc_Add1, Misc_Add2
FROM Misc_Mst
WHERE Misc_Type = 90
`);
    const shiftMap = new Map();
    for (const shift of rows) {
        shiftMap.set(String(shift.Misc_Code), {
            code: shift.Misc_Code,
            name: shift.Misc_Name,
            start: shift.Misc_Add1,
            end: shift.Misc_Add2
        });
    }
    return shiftMap;
}
function normalizeShiftTime(value) {
    if (value === null || value === undefined) return null;
    let str = String(value).trim();
    if (!str) return null;
    if (str.includes(".")) {
        const parts = str.split(".");
        const hh = String(parts[0]).padStart(2, "0");
        const mm = String(parts[1] || "0").padStart(2, "0");
        return `${hh}:${mm}`;
    }
    if (str.includes(":")) {
        const [hh, mm = "0"] = str.split(":");
        return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
    }
    return `${String(str).padStart(2, "0")}:00`;
}
function isWeeklyOff(date, weeklyOff) {
    if (weeklyOff === null || weeklyOff === undefined || String(weeklyOff) === "7") {
        return false;
    }
    const dayOfWeek = new Date(date).getDay();
    return dayOfWeek === Number(weeklyOff);
}
async function getAllHolidaysForMonth(sequelize, startDate, endDate) {
    const [rows] = await sequelize.query(`
SELECT
Holiday_Code, Holiday_Name, CAST(Rec_Date AS DATE) AS Rec_Date, Half_Holiday, Holiday_Val,
Rel_Code, Loc_Code, Dept_Code
FROM HolidayList
WHERE CAST(Rec_Date AS DATE) >= :startDate
AND CAST(Rec_Date AS DATE) <= :endDate
AND ISNULL(Export_Type, 0) < 3
`, {
        replacements: {
            startDate: toSqlDate(startDate),
            endDate: toSqlDate(endDate)
        }
    });
    return rows;
}
function checkEmployeeHolidayInMemory(holidays, employee, dateStr) {
    if (!holidays || !holidays.length) return null;
    for (const h of holidays) {
        const hDate = fmtDate(h.Rec_Date);
        if (hDate !== dateStr) continue;

        if (h.Rel_Code !== null && h.Rel_Code !== undefined) {
            if (employee.EMPTYPE === null || employee.EMPTYPE === undefined) continue;
            const relList = (',' + String(h.Rel_Code).replace(/\s+/g, '') + ',');
            if (!relList.includes(',' + String(employee.EMPTYPE) + ',')) continue;
        }

        if (h.Loc_Code !== null && h.Loc_Code !== undefined) {
            if (employee.LOCATION === null || employee.LOCATION === undefined) continue;
            const locList = (',' + String(h.Loc_Code).replace(/\s+/g, '') + ',');
            if (!locList.includes(',' + String(employee.LOCATION) + ',')) continue;
        }

        if (h.Dept_Code !== null && h.Dept_Code !== undefined) {
            if (employee.DIVISION === null || employee.DIVISION === undefined) continue;
            const deptList = (',' + String(h.Dept_Code).replace(/\s+/g, '') + ',');
            if (!deptList.includes(',' + String(employee.DIVISION) + ',')) continue;
        }

        return h;
    }
    return null;
}
function isBeforeJoiningDate(dateStr, joiningDate) {
    if (!joiningDate) return false;
    return new Date(dateStr) < new Date(joiningDate);
}
function isAfterLastWorkingDate(dateStr, lastWorkingDate) {
    if (!lastWorkingDate) return false;
    return new Date(dateStr) > new Date(lastWorkingDate);
}
/* ==========================================================================
HELPER: raw punch data (machine + face) for an employee for a month
Used ONLY for non-night-shift employees.
========================================================================== */
async function getRawPunchesForMonth(
    sequelize,
    payCode,
    startDate,
    endDate
) {
    let rows = [];
    try {
        [rows] = await sequelize.query(`
SELECT
CAST(officepunch AS DATE) AS punch_date,
MIN(officepunch) AS in1,
MAX(officepunch) AS out1,
COUNT(*) AS punch_count
FROM (
SELECT officepunch
FROM machinerawpunch
WHERE cardno = :payCode
AND officepunch >= CAST(:startDate AS DATE)
AND officepunch < DATEADD(DAY, 1, CAST(:endDate AS DATE))
UNION ALL
SELECT officepunch
FROM facemachinerawpunch
WHERE cardno = :payCode
AND officepunch >= CAST(:startDate AS DATE)
AND officepunch < DATEADD(DAY, 1, CAST(:endDate AS DATE))
) AS combined
GROUP BY CAST(officepunch AS DATE)
ORDER BY CAST(officepunch AS DATE)
`, {
            replacements: {
                payCode,
                startDate: toSqlDate(startDate),
                endDate: toSqlDate(endDate)
            }
        });
    } catch (error) {
        console.error(
            `❌ getRawPunchesForMonth failed | PAYCODE:${payCode}`,
            error
        );
        throw error;
    }
    return rows;
}
/* ==========================================================================
CORE LOGIC: match punch-in/out against policy status_rules
========================================================================== */
function resolveStatusForDay(punchRow, shiftStart, shiftEnd, statusRules) {
    if (!punchRow || !punchRow.in1) {
        const absentRule = statusRules.find(r => r.desc_code === 'A');
        return { status: absentRule?.desc_code || 'A', remark: 'No punch recorded' };
    }
    const inTime = new Date(punchRow.in1);
    const outTime = punchRow.out1 ? new Date(punchRow.out1) : null;
    const lateMinutes = Math.floor((inTime - shiftStart) / 60000);
    const earlyMinutes = outTime ? Math.floor((shiftEnd - outTime) / 60000) : 0;
    const sortedRules = [...statusRules].sort(
        (a, b) => (parseInt(a.priority_code) || 99) - (parseInt(b.priority_code) || 99)
    );
    for (const rule of sortedRules) {
        const lateAllowed = parseInt(rule.late_come) || 0;
        const earlyAllowed = parseInt(rule.early_go) || 0;
        const halfThreshold = parseInt(rule.half_val) || 0;
        if (halfThreshold > 0 && (lateMinutes > halfThreshold || earlyMinutes > halfThreshold)) {
            if (rule.HalfDay || rule.half) {
                return {
                    status: rule.desc_code,
                    remark: `Late by ${lateMinutes}min / Early-go ${earlyMinutes}min (Half-day threshold: ${halfThreshold})`
                };
            }
        }
        if (lateMinutes <= lateAllowed && earlyMinutes <= earlyAllowed && rule.Present) {
            return {
                status: rule.desc_code,
                remark: `On time (late:${lateMinutes}m, early:${earlyMinutes}m)`
            };
        }
    }
    const presentRule = statusRules.find(r => r.Present === 1 || r.Present === true);
    return {
        status: presentRule?.desc_code || 'P',
        remark: `Fallback present (late:${lateMinutes}m, early:${earlyMinutes}m) - no rule matched`
    };
}
/* ==========================================================================
HELPER: bulk raw punch data for up to 100 employees in 1 query
========================================================================== */
async function getBulkRawPunches(sequelize, payCodes, startDate, endDate) {
    if (!payCodes || !payCodes.length) return new Map();
    const payCodesList = payCodes.map(p => `'${String(p).trim()}'`).join(',');
    const [rows] = await sequelize.query(`
SELECT
    RTRIM(cardno) AS cardno,
    CAST(officepunch AS DATE) AS punch_date,
    MIN(officepunch) AS in1,
    MAX(officepunch) AS out1,
    COUNT(*) AS punch_count
FROM (
    SELECT cardno, officepunch
    FROM machinerawpunch
    WHERE cardno IN (${payCodesList})
    AND officepunch >= :startDate
    AND officepunch < DATEADD(DAY, 1, :endDate)
    UNION ALL
    SELECT cardno, officepunch
    FROM facemachinerawpunch
    WHERE cardno IN (${payCodesList})
    AND officepunch >= :startDate
    AND officepunch < DATEADD(DAY, 1, :endDate)
) AS combined
GROUP BY cardno, CAST(officepunch AS DATE)
`, {
        replacements: {
            startDate: toSqlDate(startDate),
            endDate: toSqlDate(endDate)
        }
    });

    const punchMap = new Map();
    for (const r of rows) {
        const dt = new Date(r.punch_date);
        const dStr = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
        punchMap.set(`${r.cardno}_${dStr}`, r);
    }
    return punchMap;
}

async function ensureAttendanceIndex(sequelize) {
    try {
        const [idxRows] = await sequelize.query(`
            SELECT name FROM sys.indexes 
            WHERE name = 'IX_attendancetable_Emp_dateoffice' AND object_id = OBJECT_ID('attendancetable')
        `);
        if (idxRows.length === 0) {
            console.log("⚡ Auto-creating index on attendancetable(Emp_Code, dateoffice)...");
            await sequelize.query(`
                CREATE NONCLUSTERED INDEX IX_attendancetable_Emp_dateoffice 
                ON attendancetable (Emp_Code, dateoffice)
            `);
            console.log("⚡ Index IX_attendancetable_Emp_dateoffice created successfully!");
        }
    } catch (err) {
        // Non-fatal if index already exists or permission restricted
    }
}

/* ==========================================================================
BATCH UPDATE: attendancetable in1/out1/status/NightShift for an employee (all dates at once)
========================================================================== */
async function batchUpdateAttendanceForEmployee(sequelize, empCode, dayUpdates, transaction) {
    if (!dayUpdates || !dayUpdates.length) return;
    function toSqlDateTime(isoString) {
        if (!isoString) return null;
        const d = new Date(isoString);
        if (isNaN(d.getTime())) return null;
        const pad = n => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }

    const statements = dayUpdates.map(u => {
        const in1Sql = u.in1 ? `'${toSqlDateTime(u.in1)}'` : 'NULL';
        const out1Sql = u.out1 ? `'${toSqlDateTime(u.out1)}'` : 'NULL';
        const statusSql = `'${(u.status || '').replace(/'/g, "''")}'`;
        const nightShiftSql = u.nightShift ? 1 : 0;
        return `UPDATE attendancetable SET in1 = ${in1Sql}, out1 = ${out1Sql}, status = ${statusSql}, NightShift = ${nightShiftSql} WHERE Emp_Code = '${empCode}' AND dateoffice = '${u.dateStr}';`;
    }).join('\n');

    await sequelize.query(statements, { transaction });
}
function isNightShift(shiftStart, shiftEnd) {
    if (!shiftStart || !shiftEnd) return false;
    const [startHour, startMinute] = shiftStart.split(":").map(Number);
    const [endHour, endMinute] = shiftEnd.split(":").map(Number);
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    if (startMinutes >= 15 * 60) return true;
    if (endMinutes <= startMinutes) return true;
    return false;
}
async function getMonthDates(sequelize, year, month) {
    console.log(`Fetching month dates for ${year}-${month} from misc_mst...`);
    const [rows] = await sequelize.query(`
SELECT TOP 1
TRY_CONVERT(DATE, Misc_Dtl1, 103) AS Month_Start_Date,
TRY_CONVERT(DATE, Misc_Dtl2, 103) AS Month_End_Date
FROM misc_mst
WHERE Misc_Type = 25
AND Misc_Code = :month
AND TRY_CONVERT(DATE, Misc_Dtl1, 103) IS NOT NULL
AND TRY_CONVERT(DATE, Misc_Dtl2, 103) IS NOT NULL
ORDER BY 
    CASE 
        WHEN YEAR(TRY_CONVERT(DATE, Misc_Dtl2, 103)) = :year THEN 0
        WHEN YEAR(TRY_CONVERT(DATE, Misc_Dtl1, 103)) = :year THEN 0
        ELSE 1 
    END,
    TRY_CONVERT(DATE, Misc_Dtl2, 103) DESC
`, {
        replacements: { month, year }
    });
    console.log(rows, "rows for month dates");
    let startDate;
    let endDate;
    if (
        rows?.[0]?.Month_Start_Date &&
        rows?.[0]?.Month_End_Date
    ) {
        startDate = new Date(rows[0].Month_Start_Date);
        endDate = new Date(rows[0].Month_End_Date);

        // Agar misc_mst me pichle saal ki entry ho to use current/requested year se align karein
        if (year && endDate.getFullYear() < year) {
            const yearDiff = year - endDate.getFullYear();
            startDate.setFullYear(startDate.getFullYear() + yearDiff);
            endDate.setFullYear(endDate.getFullYear() + yearDiff);
        }
    } else {
        // Calendar month fallback
        startDate = new Date(year, month - 1, 1);
        endDate = new Date(year, month, 0);
    }
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    // Agar endDate future ki hai to sirf aaj (today) tak hi dates process hon
    const effectiveEndDate = endDate > today ? today : endDate;

    const monthDates = [];
    for (
        let d = new Date(startDate);
        d <= effectiveEndDate;
        d.setDate(d.getDate() + 1)
    ) {
        monthDates.push(fmtDate(new Date(d)));
    }
    return {
        monthDates,
        startDate,
        endDate: effectiveEndDate
    };
}
/* ==========================================================================
NIGHT SHIFT PUNCH — bucket punches by SHIFT-START DATE, not calendar date.
date 22-08-2026 → window [22-08 17:00, 23-08 05:00) → in=22 17:00 out=23 05:00
date 23-08-2026 → window [23-08 17:00, 24-08 05:00) → in=23 17:02 out=24 05:02
Windows never overlap between consecutive dates, so no double counting.
========================================================================== */
async function getNightShiftPunchForDate(sequelize, payCode, attendanceDate, shiftStartStr, shiftEndStr) {
    const shiftStart = new Date(`${attendanceDate}T${shiftStartStr}:00`);
    let shiftEnd = new Date(`${attendanceDate}T${shiftEndStr}:00`);
    if (shiftEnd <= shiftStart) {
        shiftEnd.setDate(shiftEnd.getDate() + 1);
    }
    const pad = n => String(n).padStart(2, "0");
    const toSqlDateTime = d =>
        `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
    const shiftStartSql = toSqlDateTime(shiftStart);
    const shiftEndSql = toSqlDateTime(shiftEnd);
    const [rows] = await sequelize.query(`
SELECT
MIN(officepunch) AS in1,
MAX(officepunch) AS out1,
COUNT(*) AS punch_count
FROM (
SELECT officepunch FROM machinerawpunch
WHERE cardno = :payCode AND officepunch >= :shiftStart AND officepunch < :shiftEnd
UNION ALL
SELECT officepunch FROM facemachinerawpunch
WHERE cardno = :payCode AND officepunch >= :shiftStart AND officepunch < :shiftEnd
) P
`, {
        replacements: { payCode, shiftStart: shiftStartSql, shiftEnd: shiftEndSql }
    });
    return {
        in1: rows[0]?.in1 || null,
        out1: rows[0]?.out1 || null,
        punch_count: rows[0]?.punch_count || 0,
        dateoffice: attendanceDate,
        NightShift: 1
    };
}
/* ==========================================================================
MAIN SCHEDULER: GenerateAttendanceStatus
========================================================================== */
async function GenerateAttendanceStatus() {
    console.log("Running scheduled job for attendance status generation...");
    const results = [];
    const sequelize1 = await dbname(
        { query: "", headers: { compcode: "DBCON", name: "schedualer" } },
        "DBCON"
    );
    const Dlr_data = [{ "Dlr_Id": "devteam" }];
    for (const dealer of Dlr_data) {
        const compcode = dealer.Dlr_Id;
        const logger = new SchedulerLogger(sequelize1, "attendancepolicy", compcode);
        let sequelize;
        try {
            sequelize = await dbname(
                { query: "", headers: { compcode, name: "schedualer" } },
                compcode
            );
            const refDate = new Date();
            const { customMonth, customYear } = await getCustomMonthDynamic(sequelize, refDate);
            const currentMonth = Number(customMonth);
            const currentYear = Number(customYear);
            console.log(`Dealer: ${compcode} | Custom Month: ${currentMonth} | Custom Year: ${currentYear}`);

            // ⭐ OPTIMIZATION 1: Pre-fetch month dates ONCE per run
            const {
                monthDates,
                startDate,
                endDate
            } = await getMonthDates(
                sequelize,
                currentYear,
                currentMonth
            );
            console.log(`Processing date range: ${fmtDate(startDate)} to ${fmtDate(endDate)} (${monthDates.length} days)`);

            // ⭐ Ensure high-performance index on attendancetable(Emp_Code, dateoffice) exists
            await ensureAttendanceIndex(sequelize);

            // ⭐ OPTIMIZATION 2: Pre-fetch all shifts and month holidays in-memory (0 DB calls in loop)
            const shiftMap = await getAllShifts(sequelize);
            const holidays = await getAllHolidaysForMonth(sequelize, startDate, endDate);

            let totalProcessedEmployees = 0;
            let activePolicyCount = 0;
            try {
                const policies = await getActiveAttendancePolicies(sequelize);
                activePolicyCount = policies.length;
                if (!policies.length) {
                    console.log(`✅ No active attendance policies for ${compcode}.`);
                    logger.addSkip(1);
                    results.push({
                        compcode,
                        status: "SKIPPED",
                        message: "No active attendance policies found"
                    });
                    continue;
                }
                for (const policy of policies) {
                    if (!policy.is_active) {
                        logger.addSkip(1);
                        continue;
                    }
                    const statusRules = await getStatusRulesForPolicy(sequelize, policy.UTD);
                    if (!statusRules.length) {
                        console.log(`⚠️ No status rules for policy ${policy.UTD} - skipping`);
                        logger.addSkip(1);
                        continue;
                    }
                    const locations = (policy.location || "")
                        .split(",")
                        .map(l => l.trim())
                        .filter(Boolean);
                    for (const location of locations) {
                        const locked = await isLocationLocked(sequelize, location, currentMonth, currentYear);
                        if (locked) {
                            await logProcess(sequelize, {
                                Loc_Code: location,
                                SalMnth: currentMonth,
                                SalYear: currentYear,
                                Action_Type: "ATTN_RERUN",
                                Status: "FAIL",
                                Remark: "Attendance already locked",
                                Emp_Count: 0,
                                Created_By: "SCHEDULER"
                            });
                            logger.addSkip(1);
                            console.log(`🔒 Location ${location} locked for ${currentMonth}/${currentYear} - skipping`);
                            continue;
                        }
                        const employees = await getFilteredAtnEmployees(sequelize, policy, location, currentMonth, currentYear);
                        if (!employees.length) {
                            logger.addSkip(1);
                            continue;
                        }
                        console.log(`📍 Location ${location}: ${employees.length} employees to process`);
                        let locationEmpCount = 0;

                        // ⭐ OPTIMIZATION: Process in batches of 100 with bulk raw punch pre-fetching
                        const CHUNK_SIZE = 100;
                        for (let b = 0; b < employees.length; b += CHUNK_SIZE) {
                            const empChunk = employees.slice(b, b + CHUNK_SIZE);

                            const dayShiftPayCodes = [];
                            for (const emp of empChunk) {
                                if (Number(emp.ISRW) !== 0 || !emp.PAY_CODE) continue;
                                const shift = shiftMap.get(String(emp.EMP_SHIFT));
                                if (!shift) continue;
                                const sStart = normalizeShiftTime(shift.start);
                                const sEnd = normalizeShiftTime(shift.end);
                                if (!sStart || !sEnd) continue;
                                if (!isNightShift(sStart, sEnd)) {
                                    dayShiftPayCodes.push(emp.PAY_CODE);
                                }
                            }

                            // 1 single query fetches all punches for all 100 employees in this chunk
                            const bulkPunches = await getBulkRawPunches(
                                sequelize,
                                [...new Set(dayShiftPayCodes)],
                                startDate,
                                endDate
                            );

                            for (const employee of empChunk) {
                                try {
                                    if (Number(employee.ISRW) !== 0) {
                                        logger.addSkip(1);
                                        continue;
                                    }
                                    if (!employee.PAY_CODE) {
                                        logger.addSkip(1);
                                        continue;
                                    }
                                    const shift = shiftMap.get(String(employee.EMP_SHIFT));
                                    if (!shift) {
                                        logger.addSkip(1);
                                        continue;
                                    }
                                    const shiftStartStr = normalizeShiftTime(shift.start);
                                    const shiftEndStr = normalizeShiftTime(shift.end);
                                    if (!shiftStartStr || !shiftEndStr) {
                                        logger.addSkip(1);
                                        continue;
                                    }
                                    const nightShift = isNightShift(shiftStartStr, shiftEndStr);
                                    const empPayCodeTrimmed = String(employee.PAY_CODE).trim();

                                    const dayUpdates = [];
                                    for (const dateStr of monthDates) {
                                        let punch = null;
                                        if (nightShift) {
                                            punch = await getNightShiftPunchForDate(
                                                sequelize, employee.PAY_CODE, dateStr, shiftStartStr, shiftEndStr
                                            );
                                        } else {
                                            punch = bulkPunches.get(`${empPayCodeTrimmed}_${dateStr}`) || null;
                                        }
                                        if (employee.CURRENTJOINDATE && isBeforeJoiningDate(dateStr, employee.CURRENTJOINDATE)) {
                                            continue;
                                        }
                                        if (employee.LASTWOR_DATE && isAfterLastWorkingDate(dateStr, employee.LASTWOR_DATE)) {
                                            continue;
                                        }
                                        if (isWeeklyOff(dateStr, employee.WEEKLYOFF)) {
                                            continue;
                                        }
                                        // In-memory holiday check (0 DB queries)
                                        const holiday = checkEmployeeHolidayInMemory(holidays, employee, dateStr);
                                        if (holiday) {
                                            continue;
                                        }
                                        const shiftStart = new Date(`${dateStr}T${shiftStartStr}:00`);
                                        let shiftEnd = new Date(`${dateStr}T${shiftEndStr}:00`);
                                        if (nightShift && shiftEnd <= shiftStart) {
                                            shiftEnd.setDate(shiftEnd.getDate() + 1);
                                        }
                                        const statusResult = resolveStatusForDay(punch, shiftStart, shiftEnd, statusRules);
                                        dayUpdates.push({
                                            dateStr,
                                            in1: punch?.in1 || null,
                                            out1: punch?.out1 || null,
                                            status: statusResult.status,
                                            nightShift
                                        });
                                        logger.addImpact("ATTENDANCE_UPDATED", employee.EMPCODE, statusResult.status);
                                    }

                                    // ⭐ Fast indexed batch update per employee
                                    if (dayUpdates.length > 0) {
                                        const empTx = await sequelize.transaction();
                                        try {
                                            await batchUpdateAttendanceForEmployee(
                                                sequelize,
                                                employee.EMPCODE,
                                                dayUpdates,
                                                empTx
                                            );
                                            await sequelize.query(`
UPDATE EMPLOYEEMASTER SET ISRW = 1 WHERE EMPCODE = :empCode
`, { replacements: { empCode: employee.EMPCODE }, transaction: empTx });
                                            await empTx.commit();
                                            locationEmpCount++;
                                            totalProcessedEmployees++;
                                            console.log(`✅ ${employee.EMPCODE} (Loc ${location}) → ${dayUpdates.length} dates updated → ISRW = 1`);
                                        } catch (txErr) {
                                            if (!empTx.finished) await empTx.rollback();
                                            throw txErr;
                                        }
                                    }
                                } catch (empErr) {
                                    console.log(`❌ Failed EMP:${employee.EMPCODE} Policy:${policy.UTD} - ${empErr.message}`);
                                    logger.setError(empErr);
                                }
                            }
                        }
                    }
                }
                results.push({
                    compcode,
                    status: "SUCCESS",
                    policiesCount: activePolicyCount,
                    processedEmployees: totalProcessedEmployees
                });
            } catch (err) {
                logger.setError(err);
                console.error("Attendance Policy Generation job failed:", err.message);
                results.push({
                    compcode,
                    status: "FAILED",
                    error: err.message
                });
            } finally {
                if (sequelize) {
                    await sequelize.close();
                }
            }
            try {
                await logger.save();
                writeDailySchedulerLog(logger.toJSON());
            } catch (logErr) {
                console.error("Logger failed:", logErr.message);
            }
        } catch (dealerErr) {
            console.error(`Error processing dealer ${compcode}:`, dealerErr.message);
            results.push({
                compcode,
                status: "FAILED",
                error: dealerErr.message
            });
        }
    }
    if (sequelize1) {
        await sequelize1.close();
    }
    return {
        success: !results.some(r => r.status === "FAILED"),
        message: "Attendance status generation process completed",
        data: results
    };
}

module.exports = {
    GenerateAttendanceStatus,
    // GenerateCompOffScheduler,
    // runKpiReviewReminderScheduler,
    // runMetaLeadAutoCallScheduler,
    // processMetaLeadWebhookUpdates,
    // runInsuranceFollowupScheduler,
    // SyncMobileRightsScheduler,
    // SyncPreviousMonthRosterScheduler,
    // SyncEicherData,
    // runRosterScheduler
}


