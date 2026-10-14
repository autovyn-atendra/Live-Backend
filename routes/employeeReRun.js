const fs = require("fs");
const path = require("path");
const { getAttendancePool } = require("../utils/attendancePool");
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
SELECT Misc_Code, Misc_Dtl1, Misc_Dtl2, Misc_Abbr
FROM Misc_Mst
WHERE Misc_Type = 25
AND ISNULL(Export_Type, 0) < 3
AND TRY_CONVERT(DATE, Misc_Dtl1, 103) <= :date
AND TRY_CONVERT(DATE, Misc_Dtl2, 103) >= :date
`;
    const [rows] = await sequelize.query(query, {
        replacements: { date: formattedDate }
    });
    if (rows.length > 0) {
        const row = rows[0];
        const customMonth = row.Misc_Code.toString().padStart(2, "0");
        const customYear = row.Misc_Abbr ? parseInt(row.Misc_Abbr) : (row.Misc_Dtl2 ? parseInt(row.Misc_Dtl2.split("/")[2]) : d.getFullYear());
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
WHERE ISNULL(export_type, 0) < 3
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

//TEST THIS FUNCTION
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
async function getFilteredAtnEmployees(sequelize, policy, location, month, year, startDate, endDate) {
    const employeeTypeCodes = mapEmployeeTypesToCodes(policy.employee_types);
    const startDateSql = toSqlDate(startDate);
    const endDateSql = toSqlDate(endDate);

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
AND (
    (:endDateSql IS NOT NULL AND CAST(em.CURRENTJOINDATE AS DATE) <= :endDateSql)
    OR (:endDateSql IS NULL AND CAST(em.CURRENTJOINDATE AS DATE) <= EOMONTH(DATEFROMPARTS(:year, :month, 1)))   -- TEST THIS
)
AND (
    em.LASTWOR_DATE IS NULL
    OR (:startDateSql IS NOT NULL AND CAST(em.LASTWOR_DATE AS DATE) >= :startDateSql)
    OR (:startDateSql IS NULL AND CAST(em.LASTWOR_DATE AS DATE) >= DATEFROMPARTS(:year, :month, 1)) -- TEST THIS
)
`, {
        replacements: { month, year, location, employeeTypeCodes, startDateSql, endDateSql }
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
function parseShiftTime(val) {
    if (val === null || val === undefined || val === '') return null;
    let str = String(val).trim();
    if (!str) return null;
    if (str.includes(':')) {
        const [h, m = '0'] = str.split(':');
        const hours = parseInt(h, 10);
        const minutes = parseInt(m, 10) || 0;
        return {
            hours,
            minutes,
            timeStr: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`,
            totalMinutes: hours * 60 + minutes
        };
    }
    if (str.includes('.')) {
        const [hPart, mPart] = str.split('.');
        const hours = parseInt(hPart, 10);
        const minutes = mPart.length === 1 ? parseInt(mPart, 10) * 10 : parseInt(mPart.slice(0, 2), 10);
        return {
            hours,
            minutes,
            timeStr: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`,
            totalMinutes: hours * 60 + minutes
        };
    }
    const hours = parseInt(str, 10);
    return {
        hours,
        minutes: 0,
        timeStr: `${String(hours).padStart(2, '0')}:00`,
        totalMinutes: hours * 60
    };
}

function normalizeShiftTime(value) {
    const parsed = parseShiftTime(value);
    return parsed ? parsed.timeStr : null;
}

function calculateShiftAndWorkDuration(dateStr, sStart, sEnd, in1, out1) {
    if (!sStart || !sEnd) return null;
    const shiftStartDate = new Date(`${dateStr}T${sStart.timeStr}:00`);
    let shiftEndDate = new Date(`${dateStr}T${sEnd.timeStr}:00`);
    let isNight = false;
    if (shiftEndDate <= shiftStartDate || sStart.hours >= 15) {
        if (shiftEndDate <= shiftStartDate) {
            shiftEndDate.setDate(shiftEndDate.getDate() + 1);
        }
        isNight = true;
    }
    const shiftTotalMinutes = Math.floor((shiftEndDate - shiftStartDate) / 60000);
    let workMinutes = 0;
    let lateMinutes = 0;
    let earlyMinutes = 0;

    if (in1) {
        const inTime = new Date(in1);
        if (inTime > shiftStartDate) {
            lateMinutes = Math.floor((inTime - shiftStartDate) / 60000);
        }
    }
    if (in1 && out1) {
        const inTime = new Date(in1);
        const outTime = new Date(out1);
        if (inTime.getTime() !== outTime.getTime()) {
            workMinutes = Math.max(0, Math.floor((outTime - inTime) / 60000));
            if (outTime < shiftEndDate) {
                earlyMinutes = Math.floor((shiftEndDate - outTime) / 60000);
            }
        }
    }

    return {
        shiftStart: sStart.timeStr,
        shiftEnd: sEnd.timeStr,
        shiftStartDate,
        shiftEndDate,
        isNightShift: isNight,
        shiftDurationMinutes: shiftTotalMinutes,
        shiftDurationHours: Number((shiftTotalMinutes / 60).toFixed(2)),
        workMinutes,
        workHoursDecimal: Number((workMinutes / 60).toFixed(2)),
        lateMinutes,
        earlyMinutes
    };
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
    const jStr = fmtDate(joiningDate);
    return jStr ? dateStr < jStr : false;
}
function isAfterLastWorkingDate(dateStr, lastWorkingDate) {
    if (!lastWorkingDate) return false;
    const lStr = fmtDate(lastWorkingDate);
    return lStr ? dateStr > lStr : false;
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
    const absentRule = statusRules.find(r => r.desc_code === 'A');
    const absentCode = absentRule?.desc_code || 'A';
    const presentRule = statusRules.find(r => r.Present === 1 || r.Present === true || r.desc_code === 'P');
    const presentCode = presentRule?.desc_code || 'P';

    // 1. Agar koi punch nahi mila -> Absent (A)
    if (!punchRow || !punchRow.in1) {
        return { status: absentCode, remark: 'No punch recorded' };
    }

    const inTime = new Date(punchRow.in1);
    const outTime = punchRow.out1 ? new Date(punchRow.out1) : null;

    // 2. Single Punch Check: Out punch missing ho ya sirf 1 hi punch hua ho -> Absent (A)
    const isSinglePunch = !outTime || 
                          (punchRow.punch_count && Number(punchRow.punch_count) <= 1) || 
                          inTime.getTime() === outTime.getTime();

    if (isSinglePunch) {
        return { status: absentCode, remark: 'Single punch only (Punch-out missing) - Marked Absent' };
    }

    // 3. Perfect Attendance: Shift se pehle/time par aaye AND shift ke baad/time par gaye -> Direct P
    if (inTime <= shiftStart && outTime >= shiftEnd) {
        return { status: presentCode, remark: 'On time full shift' };
    }

    // 4. Late Arrival aur Early Departure Policy Evaluation
    const lateMinutes = Math.max(0, Math.floor((inTime - shiftStart) / 60000));
    const earlyMinutes = Math.max(0, Math.floor((shiftEnd - outTime) / 60000));

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
                remark: `On time within grace (late:${lateMinutes}m, early:${earlyMinutes}m)`
            };
        }
    }

    return {
        status: presentCode,
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

/* ==========================================================================
HELPER: bulk raw punch data for NIGHT-SHIFT employees in 1 single query
========================================================================== */
async function getBulkNightRawPunches(sequelize, payCodes, startDate, endDate) {
    if (!payCodes || !payCodes.length) return new Map();
    const payCodesList = payCodes.map(p => `'${String(p).trim()}'`).join(',');
    const [rows] = await sequelize.query(`
SELECT
    RTRIM(cardno) AS cardno,
    officepunch
FROM (
    SELECT cardno, officepunch
    FROM machinerawpunch
    WHERE cardno IN (${payCodesList})
      AND officepunch >= :startDate
      AND officepunch < DATEADD(DAY, 2, :endDate)
    UNION ALL
    SELECT cardno, officepunch
    FROM facemachinerawpunch
    WHERE cardno IN (${payCodesList})
      AND officepunch >= :startDate
      AND officepunch < DATEADD(DAY, 2, :endDate)
) AS P
ORDER BY officepunch ASC
`, {
        replacements: {
            startDate: toSqlDate(startDate),
            endDate: toSqlDate(endDate)
        }
    });

    const map = new Map();
    for (const r of rows) {
        if (!map.has(r.cardno)) map.set(r.cardno, []);
        map.get(r.cardno).push(new Date(r.officepunch));
    }
    return map;
}

function resolveNightShiftPunchInMemory(timestamps, shiftStart, shiftEnd) {
    if (!timestamps || !timestamps.length) return { in1: null, out1: null, punch_count: 0, NightShift: 1 };
    let minTime = null;
    let maxTime = null;
    let count = 0;
    const startMs = shiftStart.getTime();
    const endMs = shiftEnd.getTime();
    for (const dt of timestamps) {
        const ms = dt.getTime();
        if (ms >= startMs && ms < endMs) {
            count++;
            if (!minTime || ms < minTime.getTime()) minTime = dt;
            if (!maxTime || ms > maxTime.getTime()) maxTime = dt;
        }
    }
    return {
        in1: minTime ? minTime.toISOString() : null,
        out1: maxTime ? maxTime.toISOString() : null,
        punch_count: count,
        NightShift: 1
    };
}

async function ensureAttendanceIndex(sequelize) {
    try {
        // 1. attendancetable index
        const [idxRows] = await sequelize.query(`
            SELECT name FROM sys.indexes 
            WHERE name = 'IX_attendancetable_Emp_dateoffice' AND object_id = OBJECT_ID('attendancetable')
        `);
        if (idxRows.length === 0) {
            console.log("⚡ Auto-creating index on attendancetable(Emp_Code, dateoffice)...");
            await sequelize.query(`
                CREATE NONCLUSTERED INDEX IX_attendancetable_Emp_dateoffice 
                ON attendancetable (Emp_Code, dateoffice) include(status, presentvalue, absentvalue, holiday_value, wo_value, leavevalue, in1, out1)
            `);
            console.log("⚡ Index IX_attendancetable_Emp_dateoffice created successfully!");
        }

        // 2. machinerawpunch index (CRITICAL for scanning 6M+ rows in milliseconds)
        const [mIdxRows] = await sequelize.query(`
            SELECT name FROM sys.indexes 
            WHERE name = 'IX_machinerawpunch_cardno_officepunch' AND object_id = OBJECT_ID('machinerawpunch')
        `);
        if (mIdxRows.length === 0) {
            console.log("⚡ Auto-creating index on machinerawpunch(cardno, officepunch)...");
            await sequelize.query(`
                CREATE NONCLUSTERED INDEX IX_machinerawpunch_cardno_officepunch 
                ON machinerawpunch (cardno, officepunch)
            `);
            console.log("⚡ Index IX_machinerawpunch_cardno_officepunch created successfully!");
        }

        // 3. facemachinerawpunch index
        const [fIdxRows] = await sequelize.query(`
            SELECT name FROM sys.indexes 
            WHERE name = 'IX_facemachinerawpunch_cardno_officepunch' AND object_id = OBJECT_ID('facemachinerawpunch')
        `);
        if (fIdxRows.length === 0) {
            console.log("⚡ Auto-creating index on facemachinerawpunch(cardno, officepunch)...");
            await sequelize.query(`
                CREATE NONCLUSTERED INDEX IX_facemachinerawpunch_cardno_officepunch 
                ON facemachinerawpunch (cardno, officepunch)
            `);
            console.log("⚡ Index IX_facemachinerawpunch_cardno_officepunch created successfully!");
        }
    } catch (err) {
        // Non-fatal if index already exists or permission restricted
        console.error("Index ensure warning:", err.message);
    }
}

/* ==========================================================================
HELPER: Concurrent Worker Pool for processing items with limit
========================================================================== */
async function runWithConcurrency(items, limit, asyncFn) {
    if (!items || !items.length) return;
    let index = 0;
    const workerCount = Math.min(limit, items.length);
    const workers = new Array(workerCount).fill(0).map(async () => {
        while (index < items.length) {
            const currentIndex = index++;
            await asyncFn(items[currentIndex], currentIndex);
        }
    });
    await Promise.all(workers);
}

/* ==========================================================================
BATCH STATEMENTS GENERATOR: attendancetable updates for an employee
========================================================================== */
function toSqlDateTime(isoString) {
    if (!isoString) return null;
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return null;
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function generateEmployeeUpdateStatements(empCode, dayUpdates) {
    if (!dayUpdates || !dayUpdates.length) return [];
    return dayUpdates.map(u => {
        const in1Sql = u.in1 ? `'${toSqlDateTime(u.in1)}'` : 'NULL';
        const out1Sql = u.out1 ? `'${toSqlDateTime(u.out1)}'` : 'NULL';
        const statusSql = `'${(u.status || '').replace(/'/g, "''")}'`;
        const nightShiftSql = u.nightShift ? 1 : 0;
        const hoursWorkedSql = u.hoursWorked != null ? u.hoursWorked : 'NULL';
        const lateArrivalSql = u.lateArrival != null ? u.lateArrival : '0';
        const earlyDepartureSql = u.earlyDeparture != null ? u.earlyDeparture : '0';
        const totalLossHrsSql = u.totalLossHrs != null ? u.totalLossHrs : '0';
        return `UPDATE attendancetable SET in1 = ${in1Sql}, out1 = ${out1Sql}, status = ${statusSql}, NightShift = ${nightShiftSql}, hoursworked = ${hoursWorkedSql}, latearrival = ${lateArrivalSql}, earlydeparture = ${earlyDepartureSql}, totallosshrs = ${totalLossHrsSql} WHERE Emp_Code = '${empCode}' AND dateoffice = '${u.dateStr}';`;
    });
}

async function getBulkAttendanceShifts(sequelize, empCodes, startDate, endDate) {
    if (!empCodes || !empCodes.length) return new Map();
    const empCodesList = empCodes.map(e => `'${String(e).trim()}'`).join(',');
    const [rows] = await sequelize.query(`
SELECT 
    LTRIM(RTRIM(Emp_Code)) AS Emp_Code,
    CAST(dateoffice AS DATE) AS dateoffice,
    shiftstarttime,
    shiftendtime
FROM attendancetable
WHERE Emp_Code IN (${empCodesList})
  AND CAST(dateoffice AS DATE) >= :startDate
  AND CAST(dateoffice AS DATE) <= :endDate
`, {
        replacements: {
            startDate: toSqlDate(startDate),
            endDate: toSqlDate(endDate)
        }
    });

    const atnShiftMap = new Map();
    for (const r of rows) {
        const dStr = typeof r.dateoffice === 'string' && r.dateoffice.length >= 10
            ? r.dateoffice.slice(0, 10)
            : fmtDate(r.dateoffice);
        atnShiftMap.set(`${r.Emp_Code}_${dStr}`, {
            shiftstarttime: r.shiftstarttime,
            shiftendtime: r.shiftendtime
        });
    }
    return atnShiftMap;
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
    const yearStr = year ? String(year) : null;
    const [rows] = await sequelize.query(`
SELECT TOP 1
TRY_CONVERT(DATE, Misc_Dtl1, 103) AS Month_Start_Date,
TRY_CONVERT(DATE, Misc_Dtl2, 103) AS Month_End_Date,
Misc_Dtl1,
Misc_Dtl2,
Misc_Code,
Misc_Abbr
FROM Misc_Mst
WHERE Misc_Type = 25
AND ISNULL(Export_Type, 0) < 3
AND Misc_Code = :month
AND (Misc_Abbr = :yearStr OR Misc_Abbr IS NULL OR :yearStr IS NULL)
AND TRY_CONVERT(DATE, Misc_Dtl1, 103) IS NOT NULL
AND TRY_CONVERT(DATE, Misc_Dtl2, 103) IS NOT NULL
ORDER BY 
    CASE 
        WHEN Misc_Abbr = :yearStr THEN 0
        WHEN YEAR(TRY_CONVERT(DATE, Misc_Dtl2, 103)) = :year THEN 1
        WHEN YEAR(TRY_CONVERT(DATE, Misc_Dtl1, 103)) = :year THEN 1
        ELSE 2 
    END,
    TRY_CONVERT(DATE, Misc_Dtl2, 103) DESC
`, {
        replacements: { month, year, yearStr }
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
        endDate: effectiveEndDate,
        cycleEndDate: endDate
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
async function GenerateAttendanceStatus(options = {}) {
    console.log("Running scheduled job for attendance status generation...");
    const results = [];
    const sequelize1 = await getAttendancePool("DBCON");
    const Dlr_data = [{ "Dlr_Id": "devteam" }];
    for (const dealer of Dlr_data) {
        const compcode = dealer.Dlr_Id;
        const logger = new SchedulerLogger(sequelize1, "attendancepolicy", compcode);
        let sequelize;
        try {
            sequelize = await getAttendancePool(compcode);

            let currentMonth;
            let currentYear;

            // Mode 1: Agar explicitly month & year aaye (e.g. Misc_Code = 9, Misc_Abbr = '2026')
            const inputMonth = options?.Misc_Code || options?.month || options?.customMonth;
            const inputYear = options?.Misc_Abbr || options?.year || options?.customYear;

            if (inputMonth && inputYear) {
                currentMonth = Number(inputMonth);
                currentYear = Number(inputYear);
                console.log(`Dealer: ${compcode} | Explicit params -> Misc_Code: ${currentMonth} | Misc_Abbr: ${currentYear}`);
            } else {
                // Mode 2: Agar na aaye, to current date (refDate) se dynamically lena
                const refDate = options?.date || options?.refDate ? new Date(options?.date || options?.refDate) : new Date();
                const { customMonth, customYear } = await getCustomMonthDynamic(sequelize, refDate);
                currentMonth = Number(customMonth);
                currentYear = Number(customYear);
                console.log(`Dealer: ${compcode} | Dynamic current date -> Custom Month: ${currentMonth} | Custom Year: ${currentYear}`);
            }

            console.log(`Dealer: ${compcode} | Final Month: ${currentMonth} | Final Year: ${currentYear}`);

            // ⭐ OPTIMIZATION 1: Pre-fetch month dates ONCE per run
            const {
                monthDates,
                startDate,
                endDate,
                cycleEndDate
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
                        const employees = await getFilteredAtnEmployees(sequelize, policy, location, currentMonth, currentYear, startDate, cycleEndDate || endDate);
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
                            const empCodesChunk = empChunk.map(e => String(e.EMPCODE).trim());

                            // ⭐ Fetch exact daily shifts directly from attendancetable
                            const attendanceShiftsMap = await getBulkAttendanceShifts(
                                sequelize,
                                empCodesChunk,
                                startDate,
                                endDate
                            );

                            const dayShiftPayCodes = [];
                            const nightShiftPayCodes = [];
                            for (const emp of empChunk) {
                                if (Number(emp.ISRW) !== 0 || !emp.PAY_CODE) continue;
                                const empCodeTrimmed = String(emp.EMPCODE).trim();

                                // Check if employee has night shift from attendancetable or master
                                let hasNight = false;
                                for (const dStr of monthDates) {
                                    const atnShift = attendanceShiftsMap.get(`${empCodeTrimmed}_${dStr}`);
                                    if (atnShift && atnShift.shiftstarttime != null && atnShift.shiftendtime != null) {
                                        const s1 = parseShiftTime(atnShift.shiftstarttime);
                                        const s2 = parseShiftTime(atnShift.shiftendtime);
                                        if (s1 && s2 && (s1.totalMinutes > 0 || s2.totalMinutes > 0)) {
                                            if (isNightShift(s1.timeStr, s2.timeStr)) {
                                                hasNight = true;
                                                break;
                                            }
                                        }
                                    }
                                }

                                if (!hasNight) {
                                    const mShift = shiftMap.get(String(emp.EMP_SHIFT));
                                    if (mShift) {
                                        const sStart = normalizeShiftTime(mShift.start);
                                        const sEnd = normalizeShiftTime(mShift.end);
                                        if (sStart && sEnd && isNightShift(sStart, sEnd)) {
                                            hasNight = true;
                                        }
                                    }
                                }

                                if (hasNight) {
                                    nightShiftPayCodes.push(emp.PAY_CODE);
                                } else {
                                    dayShiftPayCodes.push(emp.PAY_CODE);
                                }
                            }

                            // 1 single query fetches all punches for all day-shift employees in this chunk
                            const bulkPunches = await getBulkRawPunches(
                                sequelize,
                                [...new Set(dayShiftPayCodes)],
                                startDate,
                                endDate
                            );

                            // 1 single query fetches raw punch timestamps for night-shift employees in this chunk
                            const bulkNightPunches = nightShiftPayCodes.length > 0
                                ? await getBulkNightRawPunches(sequelize, [...new Set(nightShiftPayCodes)], startDate, endDate)
                                : new Map();

                            // ⭐ OPTIMIZATION: Process in-memory & execute in 1 single Chunk Transaction
                            const chunkStartTime = Date.now();
                            const chunkStatements = [];
                            const chunkProcessedEmpCodes = [];

                            await runWithConcurrency(empChunk, 10, async (employee) => {
                                try {
                                    if (Number(employee.ISRW) !== 0) {
                                        logger.addSkip(1);
                                        return;
                                    }
                                    if (!employee.PAY_CODE) {
                                        logger.addSkip(1);
                                        return;
                                    }

                                    const empCodeTrimmed = String(employee.EMPCODE).trim();
                                    const empPayCodeTrimmed = String(employee.PAY_CODE).trim();
                                    const mShift = shiftMap.get(String(employee.EMP_SHIFT));
                                    const fallbackStart = mShift ? parseShiftTime(mShift.start) : null;
                                    const fallbackEnd = mShift ? parseShiftTime(mShift.end) : null;

                                    const dayUpdates = [];
                                    for (const dateStr of monthDates) {
                                        // 1. Shift Time from attendancetable (fallback to Misc_Mst)
                                        const atnShift = attendanceShiftsMap.get(`${empCodeTrimmed}_${dateStr}`);
                                        let sStart = null;
                                        let sEnd = null;

                                        if (atnShift && atnShift.shiftstarttime != null && atnShift.shiftendtime != null) {
                                            const p1 = parseShiftTime(atnShift.shiftstarttime);
                                            const p2 = parseShiftTime(atnShift.shiftendtime);
                                            if (p1 && p2 && (p1.totalMinutes > 0 || p2.totalMinutes > 0)) {
                                                sStart = p1;
                                                sEnd = p2;
                                            }
                                        }

                                        if (!sStart || !sEnd) {
                                            sStart = fallbackStart;
                                            sEnd = fallbackEnd;
                                        }

                                        if (!sStart || !sEnd) {
                                            continue;
                                        }

                                        const nightShift = isNightShift(sStart.timeStr, sEnd.timeStr);

                                        let punch = null;
                                        if (nightShift) {
                                            const shiftStart = new Date(`${dateStr}T${sStart.timeStr}:00`);
                                            let shiftEnd = new Date(`${dateStr}T${sEnd.timeStr}:00`);
                                            if (shiftEnd <= shiftStart) {
                                                shiftEnd.setDate(shiftEnd.getDate() + 1);
                                            }
                                            const rawTimes = bulkNightPunches.get(empPayCodeTrimmed) || [];
                                            punch = resolveNightShiftPunchInMemory(rawTimes, shiftStart, shiftEnd);
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

                                        // ⭐ Calculate exact shift duration and actual work duration
                                        const durationInfo = calculateShiftAndWorkDuration(
                                            dateStr,
                                            sStart,
                                            sEnd,
                                            punch?.in1,
                                            punch?.out1
                                        );

                                        const statusResult = resolveStatusForDay(
                                            punch,
                                            durationInfo.shiftStartDate,
                                            durationInfo.shiftEndDate,
                                            statusRules
                                        );

                                        dayUpdates.push({
                                            dateStr,
                                            in1: punch?.in1 || null,
                                            out1: punch?.out1 || null,
                                            status: statusResult.status,
                                            nightShift: durationInfo.isNightShift,
                                            hoursWorked: durationInfo.workHoursDecimal,
                                            lateArrival: durationInfo.lateMinutes,
                                            earlyDeparture: durationInfo.earlyMinutes,
                                            totalLossHrs: Number(((durationInfo.lateMinutes + durationInfo.earlyMinutes) / 60).toFixed(2))
                                        });
                                        logger.addImpact("ATTENDANCE_UPDATED", employee.EMPCODE, statusResult.status);
                                    }

                                    // Collect update statements for single batch execution
                                    if (dayUpdates.length > 0) {
                                        const empStmts = generateEmployeeUpdateStatements(employee.EMPCODE, dayUpdates);
                                        chunkStatements.push(...empStmts);
                                        chunkProcessedEmpCodes.push(`'${employee.EMPCODE}'`);
                                    }
                                } catch (empErr) {
                                    console.log(`❌ Failed EMP:${employee.EMPCODE} Policy:${policy.UTD} - ${empErr.message}`);
                                    logger.setError(empErr);
                                }
                            });

                            // ⭐ ULTRA-FAST: Execute all updates for the entire chunk in 1 Single Transaction
                            if (chunkStatements.length > 0) {
                                chunkStatements.push(`UPDATE EMPLOYEEMASTER SET ISRW = 1 WHERE EMPCODE IN (${chunkProcessedEmpCodes.join(',')});`);
                                const chunkTx = await sequelize.transaction();
                                try {
                                    await sequelize.query(chunkStatements.join('\n'), { transaction: chunkTx });
                                    await chunkTx.commit();
                                    locationEmpCount += chunkProcessedEmpCodes.length;
                                    totalProcessedEmployees += chunkProcessedEmpCodes.length;
                                } catch (txErr) {
                                    if (!chunkTx.finished) await chunkTx.rollback();
                                    console.error(`❌ Batch update failed for chunk in Loc ${location}:`, txErr.message);
                                    logger.setError(txErr);
                                }
                            }

                            // ⭐ Chunk Progress Logging
                            const chunkDuration = Date.now() - chunkStartTime;
                            console.log(`📍 [Loc ${location}] Batch ${Math.min(b + CHUNK_SIZE, employees.length)}/${employees.length} done (${chunkProcessedEmpCodes.length} updated in ${chunkDuration}ms)`);
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


