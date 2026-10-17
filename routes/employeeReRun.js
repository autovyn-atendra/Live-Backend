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
    if (typeof d === 'string') {
        const s = d.trim();
        const m = s.match(/^(\d{4}-\d{2}-\d{2})/);
        if (m) return m[1];
        const dt = new Date(s);
        if (isNaN(dt.getTime())) return null;
        return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, '0')}-${String(dt.getUTCDate()).padStart(2, '0')}`;
    }
    if (d instanceof Date) {
        if (isNaN(d.getTime())) return null;
        return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
    }
    return null;
}

function toSqlDate(d) {
    return fmtDate(d);
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
ORDER BY UTD DESC
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
em.EMPCODE,
em.LOCATION,
ISNULL(em.EMPTYPE, 1) AS EMPTYPE,
ISNULL(em.PAY_CODE, em.EMPCODE) AS PAY_CODE,
ISNULL(em.ISRW, 0) AS ISRW,
em.CURRENTJOINDATE,
em.LASTWOR_DATE,
em.EMP_SHIFT,
em.WEEKLYOFF,
em.DIVISION,
ISNULL(em.Relaxation_Type, 0) AS Relaxation_Type
FROM EMPLOYEEMASTER em
LEFT JOIN emp_atnrun ea
ON ea.Emp_Code COLLATE database_default = em.EMPCODE COLLATE database_default
AND ea.Rerun = :month
WHERE em.LOCATION = :location
AND (
    ea.Rerun = :month 
    OR ISNULL(em.ISRW, 0) = 0
    OR EXISTS (
        SELECT 1 FROM attendancetable a 
        WHERE a.Emp_Code COLLATE database_default = em.EMPCODE COLLATE database_default 
          AND a.dateoffice >= :startDateSql AND a.dateoffice <= :endDateSql
    )
)
AND (
    :employeeTypeCodes = ''
    OR (',' + :employeeTypeCodes + ',') LIKE '%,' + CAST(ISNULL(em.EMPTYPE, 1) AS VARCHAR) + ',%'
)
AND (
    (:endDateSql IS NOT NULL AND CAST(em.CURRENTJOINDATE AS DATE) <= :endDateSql)
    OR (:endDateSql IS NULL AND CAST(em.CURRENTJOINDATE AS DATE) <= EOMONTH(DATEFROMPARTS(:year, :month, 1)))
)
AND (
    em.LASTWOR_DATE IS NULL
    OR (:startDateSql IS NOT NULL AND CAST(em.LASTWOR_DATE AS DATE) >= :startDateSql)
    OR (:startDateSql IS NULL AND CAST(em.LASTWOR_DATE AS DATE) >= DATEFROMPARTS(:year, :month, 1))
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

function parsePunchDate(val) {
    if (!val) return null;
    if (val instanceof Date) {
        return isNaN(val.getTime()) ? null : val;
    }
    const d = new Date(val);
    if (isNaN(d.getTime())) return null;
    return d;
}

function minutesToHHMM(totalMinutes) {
    if (!totalMinutes || isNaN(totalMinutes) || Number(totalMinutes) <= 0) return '0.00';
    const mins = Math.round(Number(totalMinutes));
    const hours = Math.floor(mins / 60);
    const remainderMinutes = mins % 60;
    return `${hours}.${String(remainderMinutes).padStart(2, '0')}`;
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
        const inTime = in1 instanceof Date ? in1 : new Date(typeof in1 === 'string' && in1.includes(' ') && !in1.includes('T') ? in1.replace(' ', 'T') : in1);
        if (!isNaN(inTime.getTime()) && inTime > shiftStartDate) {
            lateMinutes = Math.floor((inTime - shiftStartDate) / 60000);
        }
    }
    if (in1 && out1) {
        const inTime = in1 instanceof Date ? in1 : new Date(typeof in1 === 'string' && in1.includes(' ') && !in1.includes('T') ? in1.replace(' ', 'T') : in1);
        const outTime = out1 instanceof Date ? out1 : new Date(typeof out1 === 'string' && out1.includes(' ') && !out1.includes('T') ? out1.replace(' ', 'T') : out1);
        if (!isNaN(inTime.getTime()) && !isNaN(outTime.getTime()) && inTime.getTime() !== outTime.getTime()) {
            let diffMs = outTime.getTime() - inTime.getTime();
            if (diffMs < 0 && isNight) {
                diffMs += 24 * 60 * 60000;
            }
            workMinutes = Math.max(0, Math.floor(diffMs / 60000));
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
        shiftDurationHours: minutesToHHMM(shiftTotalMinutes),
        workMinutes,
        workHoursDecimal: minutesToHHMM(workMinutes),
        lateMinutes,
        earlyMinutes
    };
}
function isWeeklyOff(date, weeklyOff, policyWeeklyOffDays = 'sunday') {
    const dayOfWeek = new Date(date).getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayOfWeek];

    // 1. Employee-level Weekly Off (0 = Sunday, 1 = Monday, ..., 6 = Saturday; 7 = None)
    if (weeklyOff !== null && weeklyOff !== undefined && String(weeklyOff).trim() !== '' && String(weeklyOff).trim() !== '7') {
        return dayOfWeek === Number(weeklyOff);
    }

    // 2. Policy-level Weekly Off (e.g. 'sunday' or 'sunday,saturday')
    if (policyWeeklyOffDays && typeof policyWeeklyOffDays === 'string') {
        const pDays = policyWeeklyOffDays.toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
        if (pDays.length > 0) {
            return pDays.includes(dayName);
        }
    }

    // 3. Default fallback: Sunday (0)
    return dayOfWeek === 0;
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
function resolveStatusForDay(punchRow, shiftStart, shiftEnd, statusRules, relaxationType = 0, ruleUsageCounts = null) {
    const absentRule = statusRules.find(r => (r.desc_code || '').trim().toUpperCase() === 'A' || r.Absent === 1 || r.Absent === true);
    const absentCode = absentRule?.desc_code || 'A';
    const presentRule = statusRules.find(r => r.Present === 1 || r.Present === true || (r.desc_code || '').trim().toUpperCase() === 'P');
    const presentCode = presentRule?.desc_code || 'P';
    const halfRule = statusRules.find(r => r.HalfDay === 1 || r.HalfDay === true || r.half === '1' || ['HD', 'HLF'].includes((r.desc_code || '').trim().toUpperCase()));
    const halfCode = halfRule?.desc_code || 'HD';

    const rType = Number(relaxationType) || 0;

    // ⭐ Rule 1: Relaxation_Type = 2 (Punch check hi nahi karna, Direct Present)
    if (rType === 2) {
        return { status: presentCode, remark: 'Relaxation Type 2 (Direct Present without punch)' };
    }

    // 1. Agar koi punch nahi mila -> Absent (A)
    if (!punchRow || !punchRow.in1) {
        return { status: absentCode, remark: 'No punch recorded' };
    }

    const inTime = punchRow.in1 instanceof Date ? punchRow.in1 : new Date(typeof punchRow.in1 === 'string' && punchRow.in1.includes(' ') && !punchRow.in1.includes('T') ? punchRow.in1.replace(' ', 'T') : punchRow.in1);
    const outTime = punchRow.out1 ? (punchRow.out1 instanceof Date ? punchRow.out1 : new Date(typeof punchRow.out1 === 'string' && punchRow.out1.includes(' ') && !punchRow.out1.includes('T') ? punchRow.out1.replace(' ', 'T') : punchRow.out1)) : null;

    // Single punch check
    const isSinglePunch = !outTime ||
        (punchRow.punch_count && Number(punchRow.punch_count) <= 1) ||
        inTime.getTime() === outTime.getTime();

    // ⭐ Rule 2: Relaxation_Type = 1 (Shift me 1 bar bhi punch in hai to Present mark karna hai)
    if (rType === 1) {
        return { status: presentCode, remark: 'Relaxation Type 1 (At least 1 punch recorded - Present)' };
    }

    // ⭐ Rule 3: Single punch mila to Absent (A)
    if (isSinglePunch) {
        return { status: absentCode, remark: 'Single punch only (Punch-out missing) - Marked Absent' };
    }

    // 2. Both punches exist: Check shift duration and worked hours
    const shiftTotalMinutes = (shiftStart && shiftEnd) ? Math.floor((shiftEnd - shiftStart) / 60000) : 540;
    const workMinutes = Math.floor((outTime - inTime) / 60000);

    const fullThreshold = shiftTotalMinutes > 0 ? shiftTotalMinutes : 540;
    const halfThreshold = Math.min(270, Math.floor(fullThreshold / 2));

    if (workMinutes < halfThreshold) {
        return { status: absentCode, remark: `Worked less than half-day threshold (${minutesToHHMM(workMinutes)} < ${minutesToHHMM(halfThreshold)})` };
    }

    const lateMinutes = (shiftStart && inTime > shiftStart) ? Math.floor((inTime - shiftStart) / 60000) : 0;
    const earlyMinutes = (shiftEnd && outTime < shiftEnd) ? Math.floor((shiftEnd - outTime) / 60000) : 0;

    // Evaluate against policy status rules (sorted by priority_code ASC, then UTD)
    const sortedRules = [...statusRules].sort((a, b) => {
        const pA = a.priority_code != null ? Number(a.priority_code) : 999;
        const pB = b.priority_code != null ? Number(b.priority_code) : 999;
        if (pA !== pB) return pA - pB;
        return (Number(a.UTD) || 0) - (Number(b.UTD) || 0);
    });

    for (const rule of sortedRules) {
        const rCode = (rule.desc_code || '').trim().toUpperCase();
        if (rCode === 'A' || rule.Absent === 1) continue;

        const maxLate = rule.late_come != null && rule.late_come !== '' ? Number(rule.late_come) : 0;
        const maxEarly = rule.early_go != null && rule.early_go !== '' ? Number(rule.early_go) : 0;
        const allowDays = rule.allow_days != null && rule.allow_days !== '' ? Number(rule.allow_days) : 31;
        const usedCount = ruleUsageCounts ? (ruleUsageCounts.get(rCode) || 0) : 0;

        const isHalfDayRule = rule.HalfDay === 1 || ['HD', 'HLF'].includes(rCode);

        if (!isHalfDayRule) {
            // Full-day presence rule (e.g. 'P', 'P5')
            if (workMinutes >= (fullThreshold - maxLate - maxEarly)) {
                if (lateMinutes <= maxLate && earlyMinutes <= maxEarly) {
                    if (usedCount < allowDays) {
                        if (ruleUsageCounts) ruleUsageCounts.set(rCode, usedCount + 1);
                        return {
                            status: rule.desc_code,
                            rule: rule,
                            remark: `Matched rule ${rule.desc_code} (Late: ${lateMinutes}m <= ${maxLate}m, Day ${usedCount + 1}/${allowDays})`
                        };
                    }
                }
            }
        } else {
            // Half day rule (e.g. 'HLF', 'HD')
            if (workMinutes >= halfThreshold) {
                const hMaxLate = maxLate > 0 ? maxLate : 270;
                const hMaxEarly = maxEarly > 0 ? maxEarly : 270;
                if (lateMinutes <= hMaxLate && earlyMinutes <= hMaxEarly) {
                    if (usedCount < allowDays) {
                        if (ruleUsageCounts) ruleUsageCounts.set(rCode, usedCount + 1);
                        return {
                            status: rule.desc_code,
                            rule: rule,
                            remark: `Matched half day rule ${rule.desc_code}`
                        };
                    }
                }
            }
        }
    }

    if (workMinutes >= fullThreshold) {
        return { status: presentCode, remark: `Full day present (Worked ${minutesToHHMM(workMinutes)} >= ${minutesToHHMM(fullThreshold)})` };
    } else if (workMinutes >= halfThreshold) {
        return { status: halfCode, remark: `Half day (Worked ${minutesToHHMM(workMinutes)} >= ${minutesToHHMM(halfThreshold)})` };
    } else {
        return { status: absentCode, remark: `Worked less than half-day threshold (${minutesToHHMM(workMinutes)} < ${minutesToHHMM(halfThreshold)})` };
    }
}
/* ==========================================================================
HELPER: bulk raw punch data for up to 100 employees in 1 query
========================================================================== */
async function getBulkRawPunches(sequelize, payCodes, startDate, endDate) {
    if (!payCodes || !payCodes.length) return new Map();
    const payCodesList = payCodes.map(p => `'${String(p).trim()}'`).join(',');
    const [rows] = await sequelize.query(`
SELECT
    LTRIM(RTRIM(cardno)) AS cardno,
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
        const dStr = typeof r.punch_date === 'string' && r.punch_date.length >= 10
            ? r.punch_date.slice(0, 10)
            : fmtDate(r.punch_date);
        punchMap.set(`${String(r.cardno).trim()}_${dStr}`, r);
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
        in1: minTime ? toSqlDateTimeIn(minTime) : null,
        out1: maxTime ? toSqlDateTimeOut(maxTime) : null,
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

function toSqlDateTime(val, roundType = null) {
    if (val == null || val === '') return null;

    const pad = n => String(n).padStart(2, '0');
    let year, month, day, hour, min, sec;

    // 1. String input: original date/time preserve karein
    if (typeof val === 'string') {
        const s = val.trim();

        // YYYY-MM-DD HH:mm:ss or YYYY-MM-DDTHH:mm:ss
        // Z ya timezone offset ho tab bhi original time preserve hoga
        const match = s.match(
            /^(\d{4}-\d{2}-\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/
        );

        if (match) {
            year = parseInt(match[1].slice(0, 4), 10);
            month = parseInt(match[1].slice(5, 7), 10) - 1;
            day = parseInt(match[1].slice(8, 10), 10);
            hour = parseInt(match[2], 10);
            min = parseInt(match[3], 10);
            sec = parseInt(match[4] || '0', 10);
        } else {
            // Other valid date strings
            const d = new Date(s);
            if (isNaN(d.getTime())) return null;
            year = d.getUTCFullYear();
            month = d.getUTCMonth();
            day = d.getUTCDate();
            hour = d.getUTCHours();
            min = d.getUTCMinutes();
            sec = d.getUTCSeconds();
        }
    } else if (val instanceof Date) {
        // 2. Date object: UTC components use karein,
        // taaki server/browser timezone conversion na ho
        if (isNaN(val.getTime())) return null;
        year = val.getUTCFullYear();
        month = val.getUTCMonth();
        day = val.getUTCDate();
        hour = val.getUTCHours();
        min = val.getUTCMinutes();
        sec = val.getUTCSeconds();
    } else {
        return null;
    }

    // in1 ke liye second ko :00 par floor karna hai
    // out1 ke liye agar second > 0 hai toh next minute (:00) par round up karna hai
    if (roundType === 'IN') {
        sec = 0;
    } else if (roundType === 'OUT') {
        if (sec > 0) {
            min += 1;
            sec = 0;
        }
    }

    const dt = new Date(Date.UTC(year, month, day, hour, min, sec));
    return (
        `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())} ` +
        `${pad(dt.getUTCHours())}:${pad(dt.getUTCMinutes())}:${pad(dt.getUTCSeconds())}`
    );
}

function toSqlDateTimeIn(val) {
    return toSqlDateTime(val, 'IN');
}

function toSqlDateTimeOut(val) {
    return toSqlDateTime(val, 'OUT');
}


const clampDec52 = (val, defaultVal = '0') => {
    if (val == null || isNaN(val)) return defaultVal;
    const n = Number(val);
    const clamped = Math.min(999.99, Math.max(0, n));
    return clamped.toFixed(2);
};

function generateEmployeeUpdateStatements(empCode, dayUpdates) {
    if (!dayUpdates || !dayUpdates.length) return [];
    return dayUpdates.map(u => {
        const in1Sql = u.in1 ? `'${toSqlDateTimeIn(u.in1)}'` : 'NULL';
        const out1Sql = u.out1 ? `'${toSqlDateTimeOut(u.out1)}'` : 'NULL';
        const statusSql = `'${(u.status || '').replace(/'/g, "''")}'`;
        const nightShiftSql = u.nightShift ? 1 : 0;
        const hoursWorkedSql = u.hoursWorked != null ? clampDec52(u.hoursWorked, 'NULL') : 'NULL';
        const lateArrivalSql = clampDec52(u.lateArrival, '0');
        const earlyDepartureSql = clampDec52(u.earlyDeparture, '0');
        const totalLossHrsSql = clampDec52(u.totalLossHrs, '0');
        const presentValueSql = clampDec52(u.presentValue, '0');
        const absentValueSql = clampDec52(u.absentValue, '0');
        const leaveValueSql = clampDec52(u.leaveValue, '0');
        const woValueSql = clampDec52(u.woValue, '0');
        const holidayValueSql = clampDec52(u.holidayValue, '0');

        let bmSet = '';
        if (u.bmIn) bmSet += `, BM_IN1 = '${toSqlDateTimeIn(u.bmIn)}'`;
        if (u.bmOut) bmSet += `, BM_OUT1 = '${toSqlDateTimeOut(u.bmOut)}'`;

        return `UPDATE attendancetable SET in1 = ${in1Sql}, out1 = ${out1Sql}${bmSet}, status = ${statusSql}, NightShift = ${nightShiftSql}, hoursworked = ${hoursWorkedSql}, latearrival = ${lateArrivalSql}, earlydeparture = ${earlyDepartureSql}, totallosshrs = ${totalLossHrsSql}, presentvalue = ${presentValueSql}, absentvalue = ${absentValueSql}, leavevalue = ${leaveValueSql}, wo_value = ${woValueSql}, holiday_value = ${holidayValueSql} WHERE Emp_Code = '${empCode}' AND dateoffice = '${u.dateStr}';`;
    });
}

function generateBatchAttendanceUpdateStatements(dayUpdatesList, batchSize = 500) {
    if (!dayUpdatesList || !dayUpdatesList.length) return [];
    const statements = [];
    for (let i = 0; i < dayUpdatesList.length; i += batchSize) {
        const slice = dayUpdatesList.slice(i, i + batchSize);
        const rowsSql = slice.map(u => {
            const in1Sql = u.in1 ? `'${toSqlDateTimeIn(u.in1)}'` : 'NULL';
            const out1Sql = u.out1 ? `'${toSqlDateTimeOut(u.out1)}'` : 'NULL';
            const bmInSql = u.bmIn ? `'${toSqlDateTimeIn(u.bmIn)}'` : 'NULL';
            const bmOutSql = u.bmOut ? `'${toSqlDateTimeOut(u.bmOut)}'` : 'NULL';
            const statusSql = `'${(u.status || '').replace(/'/g, "''")}'`;
            const nightShiftSql = u.nightShift ? 1 : 0;
            const hoursWorkedSql = u.hoursWorked != null ? clampDec52(u.hoursWorked, 'NULL') : 'NULL';
            const lateArrivalSql = clampDec52(u.lateArrival, '0');
            const earlyDepartureSql = clampDec52(u.earlyDeparture, '0');
            const totalLossHrsSql = clampDec52(u.totalLossHrs, '0');
            const presentValueSql = clampDec52(u.presentValue, '0');
            const absentValueSql = clampDec52(u.absentValue, '0');
            const leaveValueSql = clampDec52(u.leaveValue, '0');
            const woValueSql = clampDec52(u.woValue, '0');
            const holidayValueSql = clampDec52(u.holidayValue, '0');

            return `('${u.empCode}', '${u.dateStr}', ${in1Sql}, ${out1Sql}, ${bmInSql}, ${bmOutSql}, ${statusSql}, ${nightShiftSql}, ${hoursWorkedSql}, ${lateArrivalSql}, ${earlyDepartureSql}, ${totalLossHrsSql}, ${presentValueSql}, ${absentValueSql}, ${leaveValueSql}, ${woValueSql}, ${holidayValueSql})`;
        }).join(',\n');

        const updateSql = `UPDATE A
SET 
    in1 = V.v_in1,
    out1 = V.v_out1,
    BM_IN1 = CASE WHEN V.v_bmIn IS NOT NULL THEN V.v_bmIn ELSE A.BM_IN1 END,
    BM_OUT1 = CASE WHEN V.v_bmOut IS NOT NULL THEN V.v_bmOut ELSE A.BM_OUT1 END,
    status = V.v_status,
    NightShift = V.v_nightShift,
    hoursworked = V.v_hoursWorked,
    latearrival = V.v_lateArrival,
    earlydeparture = V.v_earlyDeparture,
    totallosshrs = V.v_totalLossHrs,
    presentvalue = V.v_presentValue,
    absentvalue = V.v_absentValue,
    leavevalue = V.v_leaveValue,
    wo_value = V.v_woValue,
    holiday_value = V.v_holidayValue
FROM attendancetable A
JOIN (VALUES
${rowsSql}
) AS V(v_empCode, v_dateStr, v_in1, v_out1, v_bmIn, v_bmOut, v_status, v_nightShift, v_hoursWorked, v_lateArrival, v_earlyDeparture, v_totalLossHrs, v_presentValue, v_absentValue, v_leaveValue, v_woValue, v_holidayValue)
ON A.Emp_Code = V.v_empCode AND A.dateoffice = V.v_dateStr;`;
        statements.push(updateSql);
    }
    return statements;
}

async function getBulkAttendanceShifts(sequelize, empCodes, startDate, endDate) {
    if (!empCodes || !empCodes.length) return new Map();
    const empCodesList = empCodes.map(e => `'${String(e).trim()}'`).join(',');
    const [rows] = await sequelize.query(`
SELECT 
    LTRIM(RTRIM(A.Emp_Code)) AS Emp_Code,
    CAST(A.dateoffice AS DATE) AS dateoffice,
    A.shiftstarttime,
    A.shiftendtime,
    RTRIM(A.status) AS current_status,
    A.in1 AS atn_in1,
    A.out1 AS atn_out1,
    A.in2,
    A.out2,
    A.BM_IN1,
    A.BM_OUT1,
    A.App_in1,
    A.App_out1,
    A.mp_in1,
    A.mp_out1,
    A.in1mannual,
    A.out1mannual,
    A.MAN_APPR,
    A.MAN_REJ,
    A.Appr_1_Stat,
    A.mipunch_reason,
    A.leavevalue,
    A.leavetype,
    A.leavecode,
    A.firsthalfleavecode,
    A.secondhalfleavecode,
    A.Short_Lev,
    M.Misc_Abbr AS mispunch_abbr,
    M.Misc_Name AS mispunch_name,
    M.Misc_Dtl1 AS mispunch_dtl1,
    M.Misc_Dtl2 AS mispunch_dtl2,
    M.Misc_Dtl3 AS mispunch_dtl3
FROM attendancetable A
LEFT JOIN Misc_Mst M
  ON M.Misc_Code = A.mipunch_reason 
 AND M.Misc_Type = 92
 AND M.Assessable_Column IS NULL
 AND ISNULL(M.Export_Type, 0) < 3
WHERE A.Emp_Code IN (${empCodesList})
  AND CAST(A.dateoffice AS DATE) >= :startDate
  AND CAST(A.dateoffice AS DATE) <= :endDate
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
            shiftendtime: r.shiftendtime,
            current_status: r.current_status,
            atn_in1: r.atn_in1,
            atn_out1: r.atn_out1,
            in2: r.in2,
            out2: r.out2,
            BM_IN1: r.BM_IN1,
            BM_OUT1: r.BM_OUT1,
            App_in1: r.App_in1,
            App_out1: r.App_out1,
            mp_in1: r.mp_in1,
            mp_out1: r.mp_out1,
            in1mannual: r.in1mannual,
            out1mannual: r.out1mannual,
            MAN_APPR: r.MAN_APPR,
            MAN_REJ: r.MAN_REJ,
            Appr_1_Stat: r.Appr_1_Stat,
            mipunch_reason: r.mipunch_reason,
            mispunch_name: r.mispunch_name,
            mispunch_dtl1: r.mispunch_dtl1,
            mispunch_dtl2: r.mispunch_dtl2,
            mispunch_dtl3: r.mispunch_dtl3,
            leavevalue: r.leavevalue,
            leavetype: r.leavetype,
            leavecode: r.leavecode,
            firsthalfleavecode: r.firsthalfleavecode,
            secondhalfleavecode: r.secondhalfleavecode
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
        startDate = new Date(Date.UTC(year, month - 1, 1));
        endDate = new Date(Date.UTC(year, month, 0));
    }
    const today = new Date();
    const todayUtc = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
    // Agar endDate future ki hai to sirf aaj (today) tak hi dates process hon
    const effectiveEndDate = endDate > todayUtc ? todayUtc : endDate;

    const monthDates = [];
    for (
        let d = new Date(startDate);
        d <= effectiveEndDate;
        d.setUTCDate(d.getUTCDate() + 1)
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
    const Dlr_data = [{ "Dlr_Id": "demot" }];
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
                const processedEmpCodes = new Set();
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
                        const allEmployees = await getFilteredAtnEmployees(sequelize, policy, location, currentMonth, currentYear, startDate, cycleEndDate || endDate);
                        const employees = allEmployees.filter(emp => !processedEmpCodes.has(String(emp.EMPCODE).trim()));
                        if (allEmployees.length > employees.length) {
                            console.log(`ℹ️ Location ${location}: ${allEmployees.length - employees.length} employees already processed by previous active policy - skipped duplicate.`);
                        }
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
                                if (!emp.PAY_CODE && Number(emp.Relaxation_Type) !== 2) continue;
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
                            const chunkAllDayUpdates = [];

                            await runWithConcurrency(empChunk, 10, async (employee) => {
                                try {
                                    if (!employee.PAY_CODE && Number(employee.Relaxation_Type) !== 2) {
                                        logger.addSkip(1);
                                        return;
                                    }

                                    const empCodeTrimmed = String(employee.EMPCODE).trim();
                                    const empPayCodeTrimmed = employee.PAY_CODE ? String(employee.PAY_CODE).trim() : '';
                                    const mShift = shiftMap.get(String(employee.EMP_SHIFT));
                                    const fallbackStart = mShift ? parseShiftTime(mShift.start) : null;
                                    const fallbackEnd = mShift ? parseShiftTime(mShift.end) : null;

                                    const dayEvaluations = [];
                                    const ruleUsageCounts = new Map();
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
                                            dayEvaluations.push({ dateStr, type: 'OUT_OF_SERVICE' });
                                            continue;
                                        }
                                        if (employee.LASTWOR_DATE && isAfterLastWorkingDate(dateStr, employee.LASTWOR_DATE)) {
                                            dayEvaluations.push({ dateStr, type: 'OUT_OF_SERVICE' });
                                            continue;
                                        }
                                        if (isWeeklyOff(dateStr, employee.WEEKLYOFF, policy.weekly_off_days)) {
                                            const sundayBmIn = parsePunchDate(punch?.in1) || parsePunchDate(atnShift?.BM_IN1);
                                            const sundayBmOut = parsePunchDate(punch?.out1) || parsePunchDate(atnShift?.BM_OUT1);
                                            dayEvaluations.push({
                                                dateStr,
                                                type: 'WO',
                                                bmIn: sundayBmIn,
                                                bmOut: sundayBmOut
                                            });
                                            continue;
                                        }
                                        // In-memory holiday check (0 DB queries)
                                        const holiday = checkEmployeeHolidayInMemory(holidays, employee, dateStr);
                                        if (holiday) {
                                            const holBmIn = parsePunchDate(punch?.in1) || parsePunchDate(atnShift?.BM_IN1);
                                            const holBmOut = parsePunchDate(punch?.out1) || parsePunchDate(atnShift?.BM_OUT1);
                                            dayEvaluations.push({
                                                dateStr,
                                                type: 'HOLIDAY',
                                                bmIn: holBmIn,
                                                bmOut: holBmOut
                                            });
                                            continue;
                                        }

                                        // ⭐ Determine In & Out Punches based on:
                                        // 1. BM (Raw Machine Punch OR attendancetable BM_IN1/BM_OUT1)
                                        // 2. Mobile App (App_in1 / App_out1)
                                        // 3. Miss Punch (mp_in1 / mp_out1) - Only if approved
                                        // IN = Earliest (sabse chhota) of valid candidates
                                        // OUT = Latest (sabse bada) of valid candidates
                                        // Agar candidate nahi mila, toh existing in1 / in2 preserve rahega (dateStr validate karke)

                                        const isApproved = Boolean(
                                            atnShift && (
                                                (atnShift.MAN_APPR === 'Y' || atnShift.MAN_APPR === 'y' || atnShift.MAN_APPR === '1' || atnShift.MAN_APPR === 1 || atnShift.Appr_1_Stat === 1) &&
                                                atnShift.MAN_REJ !== 'Y' && atnShift.MAN_REJ !== 'y' && atnShift.MAN_REJ !== '1' && atnShift.MAN_REJ !== 1
                                            )
                                        );

                                        const isMissPunchUnapproved = Boolean(atnShift?.mipunch_reason && !isApproved);

                                        // Raw / Biometric Punches
                                        const bmIn = parsePunchDate(punch?.in1) || parsePunchDate(atnShift?.BM_IN1);
                                        const bmOut = parsePunchDate(punch?.out1) || parsePunchDate(atnShift?.BM_OUT1);

                                        // Mobile App punches
                                        const appIn = parsePunchDate(atnShift?.App_in1);
                                        const appOut = parsePunchDate(atnShift?.App_out1);

                                        // Miss punch (Only valid if APPROVED!)
                                        const mpIn = isApproved ? parsePunchDate(atnShift?.mp_in1) : null;
                                        const mpOut = isApproved ? parsePunchDate(atnShift?.mp_out1) : null;

                                        // IN Candidates: Sabse chhota / earliest punch for this date
                                        const inCandidates = [];
                                        if (bmIn) inCandidates.push(bmIn);
                                        if (appIn && (nightShift || fmtDate(appIn) === dateStr)) inCandidates.push(appIn);
                                        if (mpIn && (nightShift || fmtDate(mpIn) === dateStr)) inCandidates.push(mpIn);

                                        // in1: Sabse pehle / chhota timestamp. Agar candidate nahi mila toh existing in1 / in2 (agar dateStr se match ho aur unapproved MP na ho)
                                        let effectiveIn = null;
                                        if (inCandidates.length > 0) {
                                            effectiveIn = new Date(Math.min(...inCandidates.map(d => d.getTime())));
                                        } else if (!isMissPunchUnapproved) {
                                            const exIn = parsePunchDate(atnShift?.atn_in1);
                                            if (exIn && (nightShift || fmtDate(exIn) === dateStr)) {
                                                effectiveIn = exIn;
                                            } else if (atnShift?.in2 && (nightShift || fmtDate(parsePunchDate(atnShift.in2)) === dateStr)) {
                                                effectiveIn = parsePunchDate(atnShift.in2);
                                            }
                                        }

                                        // OUT Candidates: Sabse baad / latest punch for this date
                                        const outCandidates = [];
                                        if (bmOut) outCandidates.push(bmOut);
                                        if (appOut && (nightShift || fmtDate(appOut) === dateStr)) outCandidates.push(appOut);
                                        if (mpOut && (nightShift || fmtDate(mpOut) === dateStr)) outCandidates.push(mpOut);

                                        // out1: Sabse baad / bada timestamp. Agar candidate nahi mila toh existing out1 / out2 (agar dateStr se match ho aur unapproved MP na ho)
                                        let effectiveOut = null;
                                        if (outCandidates.length > 0) {
                                            effectiveOut = new Date(Math.max(...outCandidates.map(d => d.getTime())));
                                        } else if (!isMissPunchUnapproved) {
                                            const exOut = parsePunchDate(atnShift?.atn_out1);
                                            if (exOut && (nightShift || fmtDate(exOut) === dateStr)) {
                                                effectiveOut = exOut;
                                            } else if (atnShift?.out2 && (nightShift || fmtDate(parsePunchDate(atnShift.out2)) === dateStr)) {
                                                effectiveOut = parsePunchDate(atnShift.out2);
                                            }
                                        }

                                        // Approved Full-day Leave check: If employee has full-day approved leave and no punch, preserve leave
                                        const isFullDayLeave = atnShift && (
                                            ['PL', 'EL', 'CL', 'ML', 'SL', 'L'].includes(String(atnShift.current_status).trim().toUpperCase()) ||
                                            (atnShift.leavevalue != null && Number(atnShift.leavevalue) >= 1)
                                        );
                                        if (isFullDayLeave && !effectiveIn) {
                                            continue;
                                        }

                                        // Effective Punch Strings for duration, status, and DB updates (Without UTC/USA timezone shift)
                                        const effectiveInStr = effectiveIn ? toSqlDateTimeIn(effectiveIn) : null;
                                        const effectiveOutStr = effectiveOut ? toSqlDateTimeOut(effectiveOut) : null;

                                        const hasIn = Boolean(effectiveIn);
                                        const hasOut = Boolean(effectiveOut);
                                        const isSameInOut = hasIn && hasOut && effectiveIn.getTime() === effectiveOut.getTime();
                                        const punchCount = (hasIn && hasOut && !isSameInOut) ? 2 : ((hasIn || hasOut) ? 1 : 0);

                                        const effectivePunchObj = (hasIn || hasOut) ? {
                                            in1: effectiveInStr,
                                            out1: effectiveOutStr,
                                            punch_count: punchCount
                                        } : null;

                                        const durationInfo = calculateShiftAndWorkDuration(
                                            dateStr,
                                            sStart,
                                            sEnd,
                                            effectiveInStr,
                                            effectiveOutStr
                                        );

                                        // Approved Miss Punch without biometric/app punches (e.g. Tour / Outdoor approved)
                                        const isApprovedFullDayMissPunch = Boolean(
                                            isApproved &&
                                            atnShift &&
                                            atnShift.mipunch_reason &&
                                            atnShift.mispunch_name &&
                                            !hasIn &&
                                            !hasOut
                                        );

                                        const isApprovedHalfDayLeave = Boolean(
                                            atnShift && (
                                                Number(atnShift.Short_Lev) === 0.5 ||
                                                (atnShift.mispunch_abbr && ['HPL', 'FHCL', 'HHCL', 'HHSL', 'HLWP', 'HWO'].includes(String(atnShift.mispunch_abbr).trim().toUpperCase())) ||
                                                atnShift.firsthalfleavecode ||
                                                atnShift.secondhalfleavecode ||
                                                (atnShift.leavevalue != null && Number(atnShift.leavevalue) > 0 && Number(atnShift.leavevalue) < 1) ||
                                                ['HPL', 'HEL', 'HCL', 'HSL'].includes(String(atnShift.current_status).trim().toUpperCase()) ||
                                                String(atnShift.mipunch_reason).trim() === '120'
                                            ) && (isApproved || atnShift.MAN_APPR === 'Y' || Number(atnShift.leavevalue) > 0)
                                        );

                                        let finalStatus = 'A';
                                        let hoursWorked = durationInfo ? durationInfo.workHoursDecimal : '0.00';
                                        let lateArrival = durationInfo ? durationInfo.lateMinutes : 0;
                                        let earlyDeparture = durationInfo ? durationInfo.earlyMinutes : 0;
                                        let totalLossHrs = durationInfo ? minutesToHHMM(lateArrival + earlyDeparture) : '0.00';
                                        let presentValue = 0.0;
                                        let absentValue = 0.0;
                                        let leaveValue = 0.0;

                                        if (isApprovedFullDayMissPunch) {
                                            finalStatus = 'P';
                                            hoursWorked = durationInfo ? durationInfo.shiftDurationHours : '8.00';
                                            lateArrival = 0;
                                            earlyDeparture = 0;
                                            totalLossHrs = '0.00';
                                        } else if (isApprovedHalfDayLeave) {
                                            const halfDayLeaveCode = (
                                                atnShift.mispunch_abbr ||
                                                (String(atnShift.mipunch_reason).trim() === '120' ? 'HPL' : '') ||
                                                atnShift.firsthalfleavecode ||
                                                atnShift.secondhalfleavecode ||
                                                'HPL'
                                            ).trim().toUpperCase();
                                            finalStatus = halfDayLeaveCode;

                                            // Worked duration check: at least 4:30 hours (270 mins) or half of shift
                                            const halfThresholdMins = durationInfo ? Math.min(270, Math.floor(durationInfo.shiftDurationMinutes / 2)) : 270;
                                            const workedHalfDay = Boolean(durationInfo && hasIn && hasOut && !isSameInOut && durationInfo.workMinutes >= halfThresholdMins);

                                            hoursWorked = durationInfo ? durationInfo.workHoursDecimal : '0.00';
                                            lateArrival = durationInfo ? durationInfo.lateMinutes : 0;
                                            earlyDeparture = durationInfo ? durationInfo.earlyMinutes : 0;
                                            totalLossHrs = durationInfo ? minutesToHHMM(lateArrival + earlyDeparture) : '0.00';

                                            const rType = Number(employee.Relaxation_Type) || 0;
                                            if (rType === 2) {
                                                lateArrival = 0;
                                                earlyDeparture = 0;
                                                totalLossHrs = '0.00';
                                            } else if (rType === 1) {
                                                earlyDeparture = 0;
                                                totalLossHrs = minutesToHHMM(lateArrival);
                                            }

                                            if (workedHalfDay) {
                                                // Half Day Present + Half Day Leave (status = 'P', presentvalue = 1.0, leavevalue = 0.5, absentvalue = 0.0, earlydeparture calculated)
                                                finalStatus = 'P';
                                                presentValue = 1.0;
                                                leaveValue = 0.5;
                                                absentValue = 0.0;
                                            } else {
                                                // Half Day Leave + Half Day Absent (punches missing or worked < 4:30 hrs)
                                                finalStatus = halfDayLeaveCode;
                                                presentValue = 0.0;
                                                leaveValue = 0.5;
                                                absentValue = 0.5;
                                            }
                                        } else if (isApproved && atnShift?.mipunch_reason && (hasIn || hasOut)) {
                                            // Approved regular miss punch (e.g. Tour / Outdoor / MisPunch reason = 1) with punches
                                            if (hasIn && hasOut && !isSameInOut) {
                                                hoursWorked = durationInfo.workHoursDecimal;
                                                lateArrival = durationInfo.lateMinutes;
                                                earlyDeparture = durationInfo.earlyMinutes;
                                                totalLossHrs = minutesToHHMM(lateArrival + earlyDeparture);
                                                const fullThresholdMins = durationInfo.shiftDurationMinutes > 0 ? durationInfo.shiftDurationMinutes : 540;
                                                const halfThresholdMins = Math.min(270, Math.floor(fullThresholdMins / 2));
                                                if (durationInfo.workMinutes >= fullThresholdMins) {
                                                    finalStatus = 'P';
                                                } else if (durationInfo.workMinutes >= halfThresholdMins) {
                                                    finalStatus = 'HD';
                                                } else {
                                                    finalStatus = 'A';
                                                }
                                            } else {
                                                // Single punch approved under miss punch
                                                if (hasIn) {
                                                    lateArrival = Math.max(0, Math.floor((effectiveIn - durationInfo.shiftStartDate) / 60000));
                                                    totalLossHrs = minutesToHHMM(lateArrival);
                                                }
                                                hoursWorked = durationInfo.shiftDurationHours;
                                                finalStatus = 'P';
                                            }
                                        } else {
                                            // Normal policy evaluation
                                            const statusResult = resolveStatusForDay(
                                                effectivePunchObj,
                                                durationInfo.shiftStartDate,
                                                durationInfo.shiftEndDate,
                                                statusRules,
                                                employee.Relaxation_Type,
                                                ruleUsageCounts
                                            );
                                            finalStatus = (statusResult.status || '').trim().toUpperCase();

                                            const rType = Number(employee.Relaxation_Type) || 0;
                                            if (rType === 2) {
                                                lateArrival = 0;
                                                earlyDeparture = 0;
                                                totalLossHrs = '0.00';
                                                if (!hasIn || !hasOut || isSameInOut) {
                                                    hoursWorked = durationInfo.shiftDurationHours;
                                                }
                                            } else if (rType === 1) {
                                                earlyDeparture = 0;
                                                totalLossHrs = minutesToHHMM(lateArrival);
                                                if (!hasOut || isSameInOut) {
                                                    hoursWorked = durationInfo.shiftDurationHours;
                                                }
                                            }
                                        }

                                        // ⭐ Calculate presentvalue, absentvalue, leavevalue based on status and leave (if not already handled by isApprovedHalfDayLeave)
                                        if (!isApprovedHalfDayLeave) {
                                            const matchedRule = statusRules.find(r => (r.desc_code || '').trim().toUpperCase() === finalStatus);
                                            const hasCustomVal = matchedRule?.PresentValue != null || matchedRule?.AbsentValue != null;
                                            const isPresent = finalStatus === 'P' || Boolean(matchedRule?.Present);
                                            const isAbsent = finalStatus === 'A' || Boolean(matchedRule?.Absent);
                                            const isHalfDay = ['HD', 'HLF', 'PHD', 'P1F', 'P2F', 'HPL', 'FHCL', 'HHCL', 'HHSL', 'HLWP', 'HWO'].includes(finalStatus) || Boolean(matchedRule?.HalfDay);

                                            if (hasCustomVal) {
                                                presentValue = matchedRule?.PresentValue != null ? Number(matchedRule.PresentValue) : (isAbsent ? 0.0 : 1.0);
                                                absentValue = matchedRule?.AbsentValue != null ? Number(matchedRule.AbsentValue) : (presentValue >= 1 ? 0.0 : Number((1.0 - presentValue).toFixed(2)));
                                                leaveValue = 0.0;
                                            } else if (isPresent) {
                                                presentValue = 1.0;
                                                absentValue = 0.0;
                                                leaveValue = 0.0;
                                            } else if (isHalfDay) {
                                                // Check if employee has half-day PL / Leave on this date
                                                const hasHalfDayLeave = Boolean(
                                                    atnShift && (
                                                        atnShift.firsthalfleavecode ||
                                                        atnShift.secondhalfleavecode ||
                                                        atnShift.leavecode ||
                                                        atnShift.leavetype ||
                                                        (atnShift.leavevalue != null && Number(atnShift.leavevalue) > 0) ||
                                                        ['HPL', 'HEL', 'PL', 'EL', 'CL', 'SL'].includes(String(atnShift.current_status).trim().toUpperCase())
                                                    )
                                                );

                                                if (hasHalfDayLeave) {
                                                    // Half Day Present + Half Day Leave (1.0 Present, 0.5 Leave, 0 Absent)
                                                    presentValue = 1.0;
                                                    leaveValue = 0.5;
                                                    absentValue = 0.0;
                                                } else {
                                                    // Normal Half Day: Half Day Present + Half Day Absent (0.5 Present, 0.5 Absent, 0 Leave)
                                                    presentValue = 0.5;
                                                    absentValue = 0.5;
                                                    leaveValue = 0.0;
                                                }
                                            } else if (isAbsent) {
                                                presentValue = 0.0;
                                                absentValue = 1.0;
                                                leaveValue = 0.0;
                                                hoursWorked = '0.00';
                                                lateArrival = 0;
                                                earlyDeparture = 0;
                                                totalLossHrs = '0.00';
                                            } else {
                                                if (matchedRule?.Value != null && Number(matchedRule.Value) > 0) {
                                                    presentValue = Number(matchedRule.Value);
                                                    absentValue = presentValue >= 1 ? 0.0 : Number((1.0 - presentValue).toFixed(2));
                                                } else {
                                                    presentValue = 1.0;
                                                    absentValue = 0.0;
                                                }
                                                leaveValue = 0.0;
                                            }
                                        }

                                        dayEvaluations.push({
                                            dateStr,
                                            type: 'WORKING',
                                            isAbsent: finalStatus === 'A',
                                            data: {
                                                dateStr,
                                                in1: effectiveInStr,
                                                out1: effectiveOutStr,
                                                bmIn: bmIn ? toSqlDateTimeIn(bmIn) : null,
                                                bmOut: bmOut ? toSqlDateTimeOut(bmOut) : null,
                                                status: finalStatus,
                                                nightShift: durationInfo ? durationInfo.isNightShift : false,
                                                hoursWorked: hoursWorked,
                                                lateArrival: lateArrival,
                                                earlyDeparture: earlyDeparture,
                                                totalLossHrs: totalLossHrs,
                                                presentValue: presentValue,
                                                absentValue: absentValue,
                                                leaveValue: leaveValue,
                                                woValue: 0.0,
                                                holidayValue: 0.0
                                            }
                                        });
                                    }

                                    // ⭐ Sandwich Policy and Final Updates Resolution
                                    const dayUpdates = [];
                                    const isSandwichEnabled = Number(policy.enable_sandwich_policy) === 1;

                                    for (let idx = 0; idx < dayEvaluations.length; idx++) {
                                        const item = dayEvaluations[idx];
                                        if (item.type === 'OUT_OF_SERVICE') {
                                            continue;
                                        }
                                        if (item.type === 'WORKING') {
                                            dayUpdates.push(item.data);
                                            logger.addImpact("ATTENDANCE_UPDATED", employee.EMPCODE, item.data.status);
                                            continue;
                                        }

                                        let isSandwich = false;
                                        if (isSandwichEnabled) {
                                            // Find preceding working day
                                            let prevIsAbsent = false;
                                            let foundPrev = false;
                                            for (let i = idx - 1; i >= 0; i--) {
                                                const prev = dayEvaluations[i];
                                                if (prev.type === 'OUT_OF_SERVICE') break;
                                                if (prev.type === 'WORKING') {
                                                    foundPrev = true;
                                                    prevIsAbsent = Boolean(prev.isAbsent);
                                                    break;
                                                }
                                            }

                                            // Find succeeding working day
                                            let nextIsAbsent = false;
                                            let foundNext = false;
                                            for (let i = idx + 1; i < dayEvaluations.length; i++) {
                                                const next = dayEvaluations[i];
                                                if (next.type === 'OUT_OF_SERVICE') break;
                                                if (next.type === 'WORKING') {
                                                    foundNext = true;
                                                    nextIsAbsent = Boolean(next.isAbsent);
                                                    break;
                                                }
                                            }

                                            if (foundPrev && foundNext && prevIsAbsent && nextIsAbsent) {
                                                isSandwich = true;
                                            }
                                        }

                                        const inStr = item.bmIn ? toSqlDateTimeIn(item.bmIn) : null;
                                        const outStr = item.bmOut ? toSqlDateTimeOut(item.bmOut) : null;

                                        if (item.type === 'WO') {
                                            if (isSandwich) {
                                                // Sandwich WO: wo_value = 0, presentvalue = 0, absentvalue = 1, status = 'A'
                                                dayUpdates.push({
                                                    dateStr: item.dateStr,
                                                    in1: inStr,
                                                    out1: outStr,
                                                    bmIn: inStr,
                                                    bmOut: outStr,
                                                    status: 'A',
                                                    nightShift: false,
                                                    hoursWorked: '0.00',
                                                    lateArrival: 0,
                                                    earlyDeparture: 0,
                                                    totalLossHrs: '0.00',
                                                    presentValue: 0.0,
                                                    absentValue: 1.0,
                                                    leaveValue: 0.0,
                                                    woValue: 0.0,
                                                    holidayValue: 0.0
                                                });
                                                logger.addImpact("ATTENDANCE_UPDATED", employee.EMPCODE, 'A');
                                            } else {
                                                // Normal WO: wo_value = 1, presentvalue = 1, absentvalue = 0, status = 'WO'
                                                dayUpdates.push({
                                                    dateStr: item.dateStr,
                                                    in1: inStr,
                                                    out1: outStr,
                                                    bmIn: inStr,
                                                    bmOut: outStr,
                                                    status: 'WO',
                                                    nightShift: false,
                                                    hoursWorked: '0.00',
                                                    lateArrival: 0,
                                                    earlyDeparture: 0,
                                                    totalLossHrs: '0.00',
                                                    presentValue: 1.0,
                                                    absentValue: 0.0,
                                                    leaveValue: 0.0,
                                                    woValue: 1.0,
                                                    holidayValue: 0.0
                                                });
                                                logger.addImpact("ATTENDANCE_UPDATED", employee.EMPCODE, 'WO');
                                            }
                                        } else if (item.type === 'HOLIDAY') {
                                            if (isSandwich) {
                                                // Sandwich Holiday: holiday_value = 0, presentvalue = 0, absentvalue = 1, status = 'A'
                                                dayUpdates.push({
                                                    dateStr: item.dateStr,
                                                    in1: inStr,
                                                    out1: outStr,
                                                    bmIn: inStr,
                                                    bmOut: outStr,
                                                    status: 'A',
                                                    nightShift: false,
                                                    hoursWorked: '0.00',
                                                    lateArrival: 0,
                                                    earlyDeparture: 0,
                                                    totalLossHrs: '0.00',
                                                    presentValue: 0.0,
                                                    absentValue: 1.0,
                                                    leaveValue: 0.0,
                                                    woValue: 0.0,
                                                    holidayValue: 0.0
                                                });
                                                logger.addImpact("ATTENDANCE_UPDATED", employee.EMPCODE, 'A');
                                            } else {
                                                // Normal Holiday: holiday_value = 1, presentvalue = 1, absentvalue = 0, status = 'H'
                                                dayUpdates.push({
                                                    dateStr: item.dateStr,
                                                    in1: inStr,
                                                    out1: outStr,
                                                    bmIn: inStr,
                                                    bmOut: outStr,
                                                    status: 'H',
                                                    nightShift: false,
                                                    hoursWorked: '0.00',
                                                    lateArrival: 0,
                                                    earlyDeparture: 0,
                                                    totalLossHrs: '0.00',
                                                    presentValue: 1.0,
                                                    absentValue: 0.0,
                                                    leaveValue: 0.0,
                                                    woValue: 0.0,
                                                    holidayValue: 1.0
                                                });
                                                logger.addImpact("ATTENDANCE_UPDATED", employee.EMPCODE, 'H');
                                            }
                                        }
                                    }

                                    // Collect daily updates for single VALUES batch execution
                                    if (dayUpdates.length > 0) {
                                        for (const du of dayUpdates) {
                                            chunkAllDayUpdates.push({ ...du, empCode: employee.EMPCODE });
                                        }
                                        chunkProcessedEmpCodes.push(`'${employee.EMPCODE}'`);
                                    }
                                } catch (empErr) {
                                    console.log(`❌ Failed EMP:${employee.EMPCODE} Policy:${policy.UTD} - ${empErr.message}`);
                                    logger.setError(empErr);
                                }
                            });

                            // ⭐ ULTRA-FAST: Execute all updates for the entire chunk in 1 Single Transaction via VALUES batch
                            if (chunkAllDayUpdates.length > 0) {
                                const valueStatements = generateBatchAttendanceUpdateStatements(chunkAllDayUpdates, 500);
                                chunkStatements.push(...valueStatements);
                                chunkStatements.push(`UPDATE EMPLOYEEMASTER SET ISRW = 1 WHERE EMPCODE IN (${chunkProcessedEmpCodes.join(',')});`);
                                let chunkTx = null;
                                try {
                                    const tSqlStart = Date.now();
                                    chunkTx = await sequelize.transaction();
                                    const tTx = Date.now() - tSqlStart;

                                    const tQueryStart = Date.now();
                                    const batchSql = `SET NOCOUNT ON;\n` + chunkStatements.join('\n');
                                    await sequelize.query(batchSql, { transaction: chunkTx });
                                    const tQuery = Date.now() - tQueryStart;

                                    const tCommitStart = Date.now();
                                    await chunkTx.commit();
                                    const tCommit = Date.now() - tCommitStart;

                                    locationEmpCount += chunkProcessedEmpCodes.length;
                                    totalProcessedEmployees += chunkProcessedEmpCodes.length;
                                    for (const code of chunkProcessedEmpCodes) {
                                        processedEmpCodes.add(String(code).trim());
                                    }

                                    const chunkDuration = Date.now() - chunkStartTime;
                                    console.log(`📍 [Loc ${location}] Batch ${Math.min(b + CHUNK_SIZE, employees.length)}/${employees.length} done (${chunkProcessedEmpCodes.length} updated in ${chunkDuration}ms | ${chunkAllDayUpdates.length} daily records via VALUES batch, Query: ${tQuery}ms)`);
                                } catch (txErr) {
                                    if (chunkTx) {
                                        try {
                                            await chunkTx.rollback();
                                        } catch (rbErr) {
                                            // Connection already in Final/closed state, ignore rollback error
                                        }
                                    }
                                    console.error(`❌ Batch update failed for chunk in Loc ${location}:`, txErr.message);
                                    logger.setError(txErr);
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

}


