const moment = require("moment");
const { dbname } = require("../utils/dbconfig");
const { SendWhatsAppMessgae } = require("../routes/user");
const nodemailer = require("nodemailer");
const SchedulerLogger = require("../utils/schedulerLogger");
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const { QueryTypes, Op, DataTypes } = require("sequelize");
const axios = require("axios");
const { SendInsuranceRenewalWhatsAppToCustomer, saveCallWebhookDetails } = require("./CRM");
const { triggerSingleCall, getCallStatus } = require("./callmatic");
const { _Employeemaster } = require("../models/Employeemaster");
const _MobileRights = require("../models/MobileRights");
const { startScheduler } = require("./EicherApi");
function writeDailySchedulerLog(logData) {
try {
const today = new Date().toISOString().split("T")[0];
const logDir = path.join(__dirname, "..", "scheduler_logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
const filePath = path.join(logDir, `${today}.txt`);
fs.appendFileSync(filePath, JSON.stringify(logData) + "
");
} catch (err) {
console.error("TXT log failed:", err.message);
}
}
function fmtDate(d) {
return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
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
// helper function to convert a date string to SQL datetime format
function toSqlDateTime(value) {
if (!value) return null;
const d = new Date(value);
if (isNaN(d.getTime())) return null;
const pad = (n) => String(n).padStart(2, "0");
return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
d.getDate()
)} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(
d.getSeconds()
)}`;
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
SELECT sr., ans.Present, ans.Absent, ans.HalfDay, ans.WeekOff, ans.Value
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
NEW — LOCATION LOCK CHECK
misc_type = 85 → per-location attendance lock marker (Join_Date column
holds the month/year that location was locked for).
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
logProcess — assumed to already exist in your codebase (you pasted a call
to it). Stub kept here ONLY so this file runs standalone; delete this stub
and import your real one if you already have it elsewhere.
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
em.WEEKLYOFF
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
async function getEmployeeShift(sequelize, empShift) {
if (!empShift) return null;
const [rows] = await sequelize.query(`
SELECT TOP 1
Misc_Code, Misc_Name, Misc_Add1, Misc_Add2
FROM Misc_Mst
WHERE Misc_Type = 90
AND Misc_Code = :empShift
`, { replacements: { empShift } });
if (!rows.length) return null;
const shift = rows[0];
return {
code: shift.Misc_Code,
name: shift.Misc_Name,
start: shift.Misc_Add1,
end: shift.Misc_Add2
};
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
async function isEmployeeHoliday(sequelize, employee, dateStr) {
const [rows] = await sequelize.query(`
SELECT TOP 1
Holiday_Code, Holiday_Name, Rec_Date, Half_Holiday, Holiday_Val
FROM HolidayList
WHERE CAST(Rec_Date AS DATE) = :dateStr
AND (
Rel_Code IS NULL
OR (',' + REPLACE(Rel_Code, ' ', '') + ',')
LIKE '%,' + CAST(:empType AS VARCHAR) + ',%'
)
AND (
Loc_Code IS NULL
OR (',' + REPLACE(Loc_Code, ' ', '') + ',')
LIKE '%,' + CAST(:location AS VARCHAR) + ',%'
)
AND (
Dept_Code IS NULL
OR (',' + REPLACE(Dept_Code, ' ', '') + ',')
LIKE '%,' + CAST(:department AS VARCHAR) + ',%'
)
AND ISNULL(Export_Type, 0) < 3
`, {
replacements: {
dateStr,
empType: employee.EMPTYPE,
location: employee.LOCATION,
department: employee.DIVISION
}
});
return rows.length > 0 ? rows[0] : null;
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
========================================================================== /
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
COUNT() AS punch_count
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
UPDATE: attendancetable in1/out1/status/NightShift for a specific emp+date
========================================================================== */
async function updateAttendanceForDay(sequelize, empCode, dateStr, in1, out1, statusResult, transaction, nightShiftFlag) {
const [existingRows] = await sequelize.query(`
SELECT Emp_Code, dateoffice, in1, out1, status
FROM attendancetable
WHERE Emp_Code = :empCode
AND CAST(dateoffice AS DATE) = :dateStr
`, { replacements: { empCode, dateStr }, transaction });
if (existingRows.length === 0) {
console.log(`⚠️ No attendance row for ${empCode} on ${dateStr} - skipping`);
return;
}
function toSqlDateTime(isoString) {
if (!isoString) return null;
const d = new Date(isoString);
if (isNaN(d.getTime())) return null;
const pad = n => String(n).padStart(2, '0');
return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}
await sequelize.query(`
UPDATE attendancetable
SET
in1 = :in1,
out1 = :out1,
status = :status,
NightShift = :nightShift
WHERE Emp_Code = :empCode
AND CAST(dateoffice AS DATE) = :dateStr
`, {
replacements: {
in1: toSqlDateTime(in1),
out1: toSqlDateTime(out1),
status: statusResult.status,
nightShift: nightShiftFlag ? 1 : 0,
empCode,
dateStr
},
type: sequelize.QueryTypes.UPDATE,
transaction
});
console.log(`✅ ${empCode} ${dateStr} → status=${statusResult.status} nightShift=${nightShiftFlag ? 1 : 0}`);
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
`, {
replacements: { month }
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
} else {
// Calendar month fallback
startDate = new Date(year, month - 1, 1);
endDate = new Date(year, month, 0);
}
const monthDates = [];
for (
let d = new Date(startDate);
d <= endDate;
d.setDate(d.getDate() + 1)
) {
monthDates.push(fmtDate(new Date(d)));
}
return {
monthDates,
startDate,
endDate
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
COUNT() AS punch_count
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
const sequelize1 = await dbname(
{ query: "", headers: { compcode: "DBCON", name: "schedualer" } },
"DBCON"
);
const Dlr_data = [{ "Dlr_Id": "autovyn" }];
for (const dealer of Dlr_data) {
const compcode = dealer.Dlr_Id;
const logger = new SchedulerLogger(sequelize1, "attendancepolicy", compcode);
const sequelize = await dbname(
{ query: "", headers: { compcode, name: "schedualer" } },
compcode
);
const refDate = new Date();
const { customMonth, customYear } = await getCustomMonthDynamic(sequelize, refDate);
const currentMonth = Number(customMonth);
const currentYear = Number(customYear);
console.log(currentMonth, "currentMonth", currentYear, "currentYear")
console.log(`Dealer: ${compcode}`, `Custom Month: ${currentMonth}`, `Custom Year: ${currentYear}`);
const t = await sequelize.transaction();
try {
const policies = await getActiveAttendancePolicies(sequelize);
if (!policies.length) {
console.log(`✅ No active attendance policies for ${compcode}.`);
logger.addSkip(1);
await t.commit();
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
// ⭐ NEW — split policy.location into individual locations and
// apply the lock check per location before touching employees there.
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
// const employees = await getFilteredAtnEmployees(sequelize, policy, location, currentMonth, currentYear);
// console.log(employees , "employees");
const employees = [{
EMPCODE: '20490008',
LOCATION: '1',
EMPTYPE: 1,
PAY_CODE: '20490008',
ISRW: 0,
CURRENTJOINDATE: '2016-10-26T00:00:00.000Z',
LASTWOR_DATE: null,
EMP_SHIFT: '16',
WEEKLYOFF: '1'
}]
if (!employees.length) {
logger.addSkip(1);
continue;
}
let locationEmpCount = 0;
for (const employee of employees) {
try {
console.log(`
========== PROCESSING EMPLOYEE ${employee.EMPCODE} (Loc ${location}) ==========`);
if (Number(employee.ISRW) !== 0) {
logger.addSkip(1);
continue;
}
if (!employee.PAY_CODE) {
logger.addSkip(1);
continue;
}
const shift = await getEmployeeShift(sequelize, employee.EMP_SHIFT);
if (!shift) {
logger.addSkip(1);
continue;
}
console.log(`Employee ${employee.EMPCODE} → Shift ${shift.code} (${shift.start} - ${shift.end})`);
const shiftStartStr = normalizeShiftTime(shift.start);
const shiftEndStr = normalizeShiftTime(shift.end);
if (!shiftStartStr || !shiftEndStr) {
logger.addSkip(1);
continue;
}
const nightShift = isNightShift(shiftStartStr, shiftEndStr);
// Non-night-shift punches fetched once for the whole month.
// Night-shift punches are fetched per-date (bucketed by shift start).
let punchMap = new Map();
const {
monthDates,
startDate,
endDate
} = await getMonthDates(
sequelize,
currentYear,
currentMonth
);
console.log(monthDates,
startDate,
endDate, "monthDates, startDate, endDate");
if (!nightShift) {
const punchDays = await getRawPunchesForMonth(
sequelize,
employee.PAY_CODE,
startDate,
endDate
);
for (const punch of punchDays) {
punchMap.set(
fmtDate(new Date(punch.punch_date)),
punch
);
}
}

let employeeProcessed = false;
for (const dateStr of monthDates) {
let punch = null;
if (nightShift) {
punch = await getNightShiftPunchForDate(
sequelize, employee.PAY_CODE, dateStr, shiftStartStr, shiftEndStr
);
} else {
punch = punchMap.get(dateStr) || null;
}
console.log(employee.CURRENTJOINDATE, "employee.CURRENTJOINDATE")
if (employee.CURRENTJOINDATE && isBeforeJoiningDate(dateStr, employee.CURRENTJOINDATE)) {
continue;
}
console.log(employee.LASTWOR_DATE, "employee.LASTWOR_DATE")
if (employee.LASTWOR_DATE && isAfterLastWorkingDate(dateStr, employee.LASTWOR_DATE)) {
continue;
}
if (isWeeklyOff(dateStr, employee.WEEKLYOFF)) {
continue;
}
const holiday = await isEmployeeHoliday(sequelize, employee, dateStr);
if (holiday) {
continue;
}
// shift window for THIS date (used by resolveStatusForDay)
const shiftStart = new Date(`${dateStr}T${shiftStartStr}:00`);
let shiftEnd = new Date(`${dateStr}T${shiftEndStr}:00`);
if (nightShift && shiftEnd <= shiftStart) {
shiftEnd.setDate(shiftEnd.getDate() + 1);
}
// ⭐ FIX — actually resolve status before updating
const statusResult = resolveStatusForDay(punch, shiftStart, shiftEnd, statusRules);
console.log(`Employee ${employee.EMPCODE} → Date ${dateStr} → Status: ${statusResult.status} (Remark: ${statusResult.remark})`);
// ⭐ FIX — single update call, nightShift passed as a value (never reassigned)
await updateAttendanceForDay(
sequelize,
employee.EMPCODE,
dateStr,
punch?.in1 || null,
punch?.out1 || null,
statusResult,
t,
nightShift
);
employeeProcessed = true;
logger.addImpact("ATTENDANCE_UPDATED", employee.EMPCODE, statusResult.status);
}
if (employeeProcessed) {
await sequelize.query(`
UPDATE EMPLOYEEMASTER SET ISRW = 1 WHERE EMPCODE = :empCode
`, { replacements: { empCode: employee.EMPCODE }, transaction: t });
locationEmpCount++;
console.log(`✅ ${employee.EMPCODE} POLICY COMPLETE → ISRW = 1`);
}
} catch (empErr) {
console.log(`❌ Failed EMP:${employee.EMPCODE} Policy:${policy.UTD} - ${empErr.message}`);
logger.setError(empErr);
}
}
// await logProcess(sequelize, {
// Loc_Code: location,
// SalMnth: currentMonth,
// SalYear: currentYear,
// Action_Type: "ATTN_RERUN",
// Status: "SUCCESS",
// Remark: `Processed ${locationEmpCount} employee(s)`,
// Emp_Count: locationEmpCount,
// Created_By: "SCHEDULER"
// });
}
}
await t.commit();
} catch (err) {
if (!t.finished) {
await t.rollback();
}
logger.setError(err);
console.error("Attendance Policy Generation job failed:", err.message);
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
}
if (sequelize1) {
await sequelize1.close();
}
}
// SCHEDULAR FOR COMPOFF GENERATE
async function getCurrentCustomMonth(sequelize, transaction) {
const [rows] = await sequelize.query(
`SELECT Misc_Code, Misc_Dtl1, Misc_Dtl2
FROM misc_mst
WHERE Misc_Type = 25
AND GETDATE() BETWEEN CONVERT(DATE, Misc_Dtl1, 103) AND CONVERT(DATE, Misc_Dtl2, 103)`,
{ transaction }
);
if (rows.length) {
const row = rows[0];
const [d1, m1, y1] = row.Misc_Dtl1.split("/");
const [d2, m2, y2] = row.Misc_Dtl2.split("/");
return {
customMonth: row.Misc_Code, // Leave_Mnth
customYear: y2, // closing side ka year
fromDate: `${y1}-${m1}-${d1}`,
toDate: `${y2}-${m2}-${d2}`
};
}
// 🔥 Fallback — misc_type=25 mein range nahi mili, calendar month use karo
console.log("⚠️ No misc_type=25 range found — falling back to calendar month");
const now = new Date();
const year = now.getFullYear();
const month = now.getMonth() + 1; // 1-12
const pad = (n) => String(n).padStart(2, "0");
const lastDay = new Date(year, month, 0).getDate(); // month ka last date
return {
customMonth: month,
customYear: year,
fromDate: `${year}-${pad(month)}-01`,
toDate: `${year}-${pad(month)}-${pad(lastDay)}`
};
}
async function generateCompOffLeaveBal(sequelize, transaction, empCodeFilter = null) {
const { customMonth, customYear, fromDate, toDate } = await getCurrentCustomMonth(sequelize, transaction);
console.log(customMonth, customYear, fromDate, toDate, "customMonth, customYear, fromDate, toDate")
const [keyRows] = await sequelize.query(
`SELECT CO_FULL_HOUR, CO_HALF_HOURS FROM COMP_KEYDATA`,
{ transaction }
);
const coFullHour = parseFloat(keyRows[0]?.CO_FULL_HOUR);
const coHalfHour = parseFloat(keyRows[0]?.CO_HALF_HOURS);
if (!coFullHour || !coHalfHour) {
throw new Error("CO_FULL_HOUR / CO_HALF_HOURS not configured in COMP_KEYDATA");
}
const whereEmp = empCodeFilter ? "AND EMP_CODE = :empCodeFilter" : "";
const [woData] = await sequelize.query(
`SELECT
EMP_CODE,
SUM(CASE
WHEN HOURSWORKED >= :coFullHour THEN 1
WHEN HOURSWORKED >= :coHalfHour THEN 0.5
ELSE 0
END) AS Total_CO
FROM attendancetable
WHERE DATEOFFICE BETWEEN :fromDate AND :toDate
AND STATUS = 'WO'
AND HOURSWORKED IS NOT NULL
${whereEmp}
GROUP BY EMP_CODE`,
{ replacements: { fromDate, toDate, coFullHour, coHalfHour, empCodeFilter }, transaction }
);
const results = [];
for (const emp of woData) {
if (!emp.Total_CO || emp.Total_CO <= 0) continue;
console.log(emp, "emp")
const empCode = emp.EMP_CODE.trim(); // 🔥 trailing spaces hata do (Emp_Code CHAR type lag raha hai)
const [existing] = await sequelize.query(
`SELECT Op_Bal, Gen_Lev, Avail_Lev, Cl_Bal
FROM Leave_BAL
WHERE Emp_Code = :empCode AND Leave_Type = 9
AND Leave_Mnth = :customMonth AND Leave_Yr = :customYear`,
{ replacements: { empCode, customMonth, customYear }, transaction }
);

if (existing.length) {
const opBal = parseFloat(existing[0].Op_Bal) || 0;
const availLev = parseFloat(existing[0].Avail_Lev) || 0;
const genLev = parseFloat(emp.Total_CO);
const clBal = opBal + genLev - availLev;
await sequelize.query(
`UPDATE Leave_BAL
SET Gen_Lev = :genLev, Cl_Bal = :clBal
WHERE Emp_Code = :empCode AND Leave_Type = 9
AND Leave_Mnth = :customMonth AND Leave_Yr = :customYear`,
{ replacements: { genLev, clBal, empCode, customMonth, customYear }, transaction }
);
results.push({ empCode, genLev, clBal, action: "updated" });
} else {
const [prevRow] = await sequelize.query(
`SELECT TOP 1 Cl_Bal FROM Leave_BAL
WHERE Emp_Code = :empCode AND Leave_Type = 9
ORDER BY Leave_Yr DESC, Leave_Mnth DESC`,
{ replacements: { empCode }, transaction }
);
const opBal = prevRow.length ? (parseFloat(prevRow[0].Cl_Bal) || 0) : 0;
const genLev = parseFloat(emp.Total_CO);
const clBal = opBal + genLev;
await sequelize.query(
`INSERT INTO Leave_BAL (Emp_Code, Leave_Type, Leave_Mnth, Leave_Yr, Op_Bal, Gen_Lev, Avail_Lev, Cl_Bal)
VALUES (:empCode, 9, :customMonth, :customYear, :opBal, :genLev, 0, :clBal)`,
{ replacements: { empCode, customMonth, customYear, opBal, genLev, clBal }, transaction }
);
results.push({ empCode, genLev, clBal, action: "inserted" });
}
}
return { customMonth, customYear, fromDate, toDate, coFullHour, coHalfHour, results };
}
async function GenerateCompOffScheduler() {
console.log("Running scheduled job for Comp-Off generation...");
const sequelize1 = await dbname(
{ query: "", headers: { compcode: "DBCON", name: "schedualer" } },
"DBCON"
);
const [Dlr_data] = await sequelize1.query(
`SELECT * FROM DLR_SCH WHERE SCH_TYPE = 'compoffpolicy' AND export_type < 3`
);
// const Dlr_data = [{ "Dlr_Id": "autovyn" }];
for (const dealer of Dlr_data) {
const compcode = dealer.Dlr_Id;
const logger = new SchedulerLogger(sequelize1, "compoffpolicy", compcode);
const sequelize = await dbname(
{ query: "", headers: { compcode, name: "schedualer" } },
compcode
);
const t = await sequelize.transaction();
try {
const { customMonth, customYear, fromDate, toDate, coFullHour, coHalfHour, results } =
await generateCompOffLeaveBal(sequelize, t);
if (!results.length) {
console.log(`✅ No Comp-Off eligible employees for ${compcode}.`);
logger.addSkip(1);
await t.commit();
continue;
}
results.forEach(r =>
logger.addImpact("COMPOFF_GENERATED", r.empCode, `Gen_Lev=${r.genLev}, Cl_Bal=${r.clBal}`)
);
console.log(
`✅ Comp-Off generated for ${compcode} | Month:${customMonth} Year:${customYear} | Full:${coFullHour}h Half:${coHalfHour}h | Emp count:${results.length}`
);
await t.commit();
} catch (err) {
if (!t.finished) {
await t.rollback();
}
logger.setError(err);
console.error(`Comp-Off Generation job failed for ${compcode}:`, err.message);
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
}
if (sequelize1) {
await sequelize1.close();
}
}

function isLastDayOfMonth(date) {
const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
return date.getDate() === lastDay;
}
function getKpiClosingInfo(frequency, date) {
const day = date.getDate();
const month = date.getMonth() + 1;
const year = date.getFullYear();
const isLastDay = isLastDayOfMonth(date); // USING THE HELPER FUNCTION
switch (String(frequency).toUpperCase()) {
case "WEEKLY": {
let periodKey = null;
let isClosingDay = false;
if (day === 7) {
periodKey = "W1";
isClosingDay = true;
}
else if (day === 14) {
periodKey = "W2";
isClosingDay = true;
}
else if (day === 21) {
periodKey = "W3";
isClosingDay = true;
}
else if (isLastDay) { // USING HELPER FUNCTION
periodKey = "W4";
isClosingDay = true;
}
return { isClosingDay, periodKey, month, year };
}
case "MONTHLY": {
return {
isClosingDay: isLastDay, // USING HELPER FUNCTION
periodKey: "M",
month,
year
};
}
case "QUARTERLY": {
const quarterEndMonths = [3, 6, 9, 12];
let periodKey = null;
let isClosingDay = false;
if (quarterEndMonths.includes(month) && isLastDay) { // USING HELPER FUNCTION
isClosingDay = true;
periodKey = "Q" + Math.ceil(month / 3);
}
return { isClosingDay, periodKey, month, year };
}
case "HALF_YEARLY": {
let periodKey = null;
let isClosingDay = false;
if (month === 6 && isLastDay) { // USING HELPER FUNCTION
periodKey = "H1";
isClosingDay = true;
}
if (month === 12 && isLastDay) { // USING HELPER FUNCTION
periodKey = "H2";
isClosingDay = true;
}
return { isClosingDay, periodKey, month, year };
}
case "YEARLY": {
return {
isClosingDay: month === 12 && day === 31,
periodKey: "Y",
month,
year
};
}
default:
return { isClosingDay: false, periodKey: null, month, year };
}
}

function getKpiPeriodLabel(frequency, periodKey, month, year) {
const monthNames = [
"January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"
];
const monthName = monthNames[month - 1];
if (frequency === "WEEKLY") {
return `Week ${periodKey.replace("W", "")} - ${monthName} ${year}`;
}
if (frequency === "MONTHLY") {
return `${monthName} ${year}`;
}
if (frequency === "QUARTERLY") {
const qMonths = {
"1": "Jan-Mar",
"2": "Apr-Jun",
"3": "Jul-Sep",
"4": "Oct-Dec"
};
const qNum = periodKey.replace("Q", "");
return `Quarter ${qNum} (${qMonths[qNum]}) - ${year}`;
}
if (frequency === "HALF_YEARLY") {
return periodKey === "H1"
? `Half Year 1 (Jan-Jun) - ${year}`
: `Half Year 2 (Jul-Dec) - ${year}`;
}
if (frequency === "YEARLY") {
return `Yearly - ${year}`;
}
return `${monthName} ${year}`;
}

async function runKpiReviewReminderScheduler() {
let sequelize1;
try {
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

const Dlr_data = await sequelize1.query(
`
SELECT DISTINCT Dlr_Id
FROM DLR_SCH
WHERE SCH_TYPE = 'kpireviewreminder'
AND export_type < 3
`,
{
type: QueryTypes.SELECT,
}
);
console.log("Dlr_data:", Dlr_data);
if (!Dlr_data || Dlr_data.length === 0) {
console.log("⚠️ No active companies found for KPI Review Reminder Scheduler");
return {
success: true,
message: "No companies found",
companiesProcessed: 0,
};
}
const companyResults = [];
for (const dealer of Dlr_data) {
const compcode = String(dealer.Dlr_Id).trim();
console.log("
----------------------------------------------");
console.log(`🏢 Processing Company: ${compcode}`);
console.log("----------------------------------------------");
let sequelize;
try {
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
const today = new Date();
console.log(` [${compcode}] Today: ${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`);
// ============================================================
// 6. GET COMPANY NAME
// ============================================================
const companyData = await sequelize.query(
`SELECT TOP 1 comp_name FROM Comp_Mst`,
{ type: QueryTypes.SELECT }
);
const companyName = companyData[0]?.comp_name || compcode;
console.log(`🏢 [${compcode}] Company: ${companyName}`);
// ============================================================
// 7. GET DISTINCT DESIGNATION + FREQUENCY FROM KPI_MST
// ============================================================
const designationFreqRows = await sequelize.query(
`
SELECT DISTINCT
DESIGNATION,
UPPER(LTRIM(RTRIM(FREQUENCY))) AS FREQUENCY
FROM KPI_MST
WHERE ISNULL(Export_Type, 1) = 1
AND ISNULL(LTRIM(RTRIM(FREQUENCY)), '') <> ''
`,
{ type: QueryTypes.SELECT }
);
console.log(` [${compcode}] Designation+Frequency combos: ${designationFreqRows.length}`);
if (!designationFreqRows.length) {
console.log(` [${compcode}] No KPI Master found`);
companyResults.push({
compcode,
success: true,
totalRemindersSent: 0,
message: "No KPI Master found",
});
continue;
}
const notificationResults = [];
let totalRemindersSent = 0;
let totalDataExistsSkip = 0;
let totalNoClosingDay = 0;
for (const row of designationFreqRows) {
const designationCode = row.DESIGNATION;
const frequency = row.FREQUENCY;
const closingInfo = getKpiClosingInfo(frequency, today);
if (!closingInfo.isClosingDay) {
console.log(` [${compcode}] Des:${designationCode}, Freq:${frequency} - Not closing day`);
totalNoClosingDay++;
continue;
}
const { periodKey, month, year } = closingInfo;
console.log(`
[${compcode}] Closing Day! Des:${designationCode}, Freq:${frequency}, Period:${periodKey}`);

const designationInfo = await sequelize.query(
`
SELECT TOP 1 Misc_Name FROM Misc_Mst
WHERE Misc_Type = 95 AND Misc_Code = :Designation
`,
{
replacements: { Designation: designationCode },
type: QueryTypes.SELECT,
}
);
const designationName = designationInfo[0]?.Misc_Name || "Designation";

const periodLabel = getKpiPeriodLabel(frequency, periodKey, month, year);
console.log(` [${compcode}] Period: ${periodLabel}`);
const existingData = await sequelize.query(
`
SELECT TOP 1 UTD, Export_Type, APPROVAL_STATUS
FROM KPI_REVIEW_POINTS
WHERE DESIGNATION = :Designation
AND [YEAR] = :Year
AND [MONTH] = :Month
AND FREQUENCY = :Frequency
AND PERIOD_KEY = :PeriodKey
AND LEVEL_TYPE = 'L1'
`,
{
replacements: {
Designation: designationCode,
Year: year,
Month: month,
Frequency: frequency,
PeriodKey: periodKey,
},
type: QueryTypes.SELECT,
}
);
if (existingData.length > 0) {
console.log(` [${compcode}] ${designationName} - ${periodLabel} ka data already exists. Skip.`);
totalDataExistsSkip++;
notificationResults.push({
Designation: designationName,
Period: periodLabel,
PeriodKey: periodKey,
status: "skipped",
reason: "Level 1 data already exists in KPI_REVIEW_POINTS",
});
continue;
}
console.log(` [${compcode}] ${designationName} - ${periodLabel} ka data PENDING. Reminder bhej rahe hain...`);
// ============================================================
// GET EMPLOYEES FOR THIS DESIGNATION
// ============================================================
const empRows = await sequelize.query(
`
SELECT EMPCODE, Reporting_1
FROM EMPLOYEEMASTER
WHERE ISNULL(Export_Type, 0) < 3
AND EMPLOYEEDESIGNATION = (
SELECT TOP 1 Misc_Name FROM Misc_Mst
WHERE Misc_Type = 95 AND Misc_Code = :Designation
)
`,
{
replacements: { Designation: designationCode },
type: QueryTypes.SELECT,
}
);
console.log(` [${compcode}] ${designationName} - Employees: ${empRows.length}`);
if (!empRows.length) {
console.log(` [${compcode}] No employees found for ${designationName}`);
continue;
}
// ============================================================
// GET UNIQUE REPORTING_1 CODES
// ============================================================
const reporting1Codes = [...new Set(
empRows
.map((e) => (e.Reporting_1 || "").toString().trim())
.filter(Boolean)
)];
console.log(` [${compcode}] Unique Reporting_1: ${reporting1Codes.length}`);
if (!reporting1Codes.length) {
console.log(` [${compcode}] No Reporting_1 found for ${designationName}`);
continue;
}
// ============================================================
// GET REPORTING_1 DETAILS
// ============================================================
const placeholders = reporting1Codes.map((c, i) => `:code${i}`).join(",");
const rep = {};
reporting1Codes.forEach((c, i) => { rep[`code${i}`] = c; });
const reporting1Details = await sequelize.query(
`
SELECT EMPCODE, MOBILE_NO, EMPFIRSTNAME, EMPLOYEEDESIGNATION
FROM EMPLOYEEMASTER
WHERE ISNULL(Export_Type, 0) < 3
AND EMPCODE IN (${placeholders})
`,
{
replacements: rep,
type: QueryTypes.SELECT,
}
);
console.log(` [${compcode}] Reporting_1 with mobile: ${reporting1Details.length}`);

const uniqueReporting1Details = [];
const seenMobileNumbers = new Set();
let duplicateCount = 0;
for (const r1 of reporting1Details) {
const mobileNumber = (r1.MOBILE_NO || "").toString().trim();
if (!mobileNumber) {
// Keep records without mobile for logging
uniqueReporting1Details.push(r1);
continue;
}
// Skip if this mobile number already exists
if (seenMobileNumbers.has(mobileNumber)) {
console.log(` [${compcode}] Duplicate mobile skipped: ${mobileNumber} (${r1.EMPFIRSTNAME})`);
duplicateCount++;
continue;
}
// Add to seen set
seenMobileNumbers.add(mobileNumber);
uniqueReporting1Details.push(r1);
}

// ============================================================
// SEND WHATSAPP
// ============================================================
for (const r1 of uniqueReporting1Details) {
if (!r1.MOBILE_NO) {
console.warn(`⚠️ [${compcode}] No mobile for: ${r1.EMPFIRSTNAME} (${r1.EMPCODE})`);
notificationResults.push({
EMPCODE: r1.EMPCODE,
Name: r1.EMPFIRSTNAME,
status: "skipped",
reason: "No mobile number",
});
continue;
}
try {
console.log(`📨 [${compcode}] Sending to: ${r1.EMPFIRSTNAME} (${r1.MOBILE_NO})`);
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const monthName = monthNames[month - 1];
await SendWhatsAppMessgae(
compcode,
r1.MOBILE_NO,
"kpi_review_reminder_msg",
[
{ type: "text", text: r1.EMPFIRSTNAME || "Reviewer" }, // {{1}} - Reviewer Name
{ type: "text", text: monthName }, // {{2}} - Month Name
{ type: "text", text: String(year) }, // {{3}} - Year
{ type: "text", text: periodLabel }, // {{4}} - Period Label
{ type: "text", text: companyName }, // {{5}} - Company Name
]
);
console.log(` [${compcode}] Sent to: ${r1.EMPFIRSTNAME}`);
totalRemindersSent++;
notificationResults.push({
EMPCODE: r1.EMPCODE,
Name: r1.EMPFIRSTNAME,
Mobile: r1.MOBILE_NO,
Designation: r1.EMPLOYEEDESIGNATION,
Period: periodLabel,
status: "sent",
});
} catch (whatsappErr) {
console.error(` [${compcode}] Failed for: ${r1.EMPFIRSTNAME}`, whatsappErr.message);
notificationResults.push({
EMPCODE: r1.EMPCODE,
Name: r1.EMPFIRSTNAME,
status: "failed",
error: whatsappErr.message,
});
}
}
}
// ============================================================
// 9. SUMMARY
// ============================================================
const sentCount = notificationResults.filter((r) => r.status === "sent").length;
const failedCount = notificationResults.filter((r) => r.status === "failed").length;
const skippedCount = notificationResults.filter((r) => r.status === "skipped").length;
companyResults.push({
compcode,
success: true,
totalRemindersSent,
totalDataExistsSkip,
totalNoClosingDay,
notificationSummary: {
sent: sentCount,
failed: failedCount,
skipped: skippedCount,
},
notificationResults,
});
} catch (companyError) {
console.error(` [${compcode}] Failed:`, companyError.message);
companyResults.push({
compcode,
success: false,
error: companyError.message,
});
} finally {
if (sequelize) {
await sequelize.close();
console.log(`🔌 [${compcode}] DB Closed`);
}
}
}

return {
success: true,
companiesProcessed: Dlr_data.length,
companyResults,
};
} catch (error) {
console.error("
Scheduler Error:", error);
return {
success: false,
message: "KPI Review Reminder Scheduler Failed",
error: error.message,
};
} finally {
if (sequelize1) {
await sequelize1.close();
console.log(" DBCON Closed");
}
}
}
// ============================================================
// ⚙️ SYSTEM SETTINGS FOR META LEADS
// ============================================================
const META_CRON_SETTINGS = {
TIMEZONE: "Asia/Kolkata",
SCH_TYPE: "metalead",
MAX_DAILY_ATTEMPTS: 3,
CALL_CHANNEL: "META_LEAD_AUTO",
CALLMATIC_API_KEY: process.env.CALLMATIC_API_KEY || "857e790e-ad5f-4816-9530-0ae643988229",
CALLMATIC_BASE_URL: "https://api.callmatic.ai/v1",
};
/**
Single Callmatic Call Helper
*/
const triggerSingleCall1 = async (phoneNumber, variables = {}, campaignId = null) => {
try {
if (!phoneNumber) throw new Error("Phone number is required");
if (!campaignId) throw new Error("Campaign ID is missing");
const payload = { campaignId, phoneNumber, variables };
const response = await axios.post(
`${META_CRON_SETTINGS.CALLMATIC_BASE_URL}/calls`,
payload,
{
headers: {
"Content-Type": "application/json",
"api-key": META_CRON_SETTINGS.CALLMATIC_API_KEY,
},
}
);
return response.data;
} catch (error) {
console.error("[META-CALLMATIC-ERROR]:", error.response?.data || error.message);
throw error;
}
};
/**
Format Phone Number helper
*/
const formatPhoneNumber = (rawPhone) => {
let formatted = String(rawPhone || "").trim().replace(/[^\d+]/g, "");
if (formatted.startsWith("0")) formatted = formatted.substring(1);
if (formatted.length === 10) formatted = `+91${formatted}`;
else if (formatted.length === 12 && formatted.startsWith("91")) formatted = `+${formatted}`;
return formatted;
};
// ============================================================
// ⚡ INSTANT CALL TRIGGER (Called immediately when a Meta Lead is saved)
// ============================================================
async function triggerInstantMetaLeadCall({ metaLeadUtd, compcode, callType = "AUTO_AI_CALL", callSource = "CRON_SCHEDULER", createdBy = "AUTO_CRON" }) {
let sequelize;
try {
const finalCompcode = compcode || process.env.META_COMP_CODE || "DB001";
console.log(`
[META-INSTANT-CALL] 🚀 Triggering call for Lead UTD #${metaLeadUtd} | Type: ${callType} | Source: ${callSource} | Comp: ${finalCompcode}`);
sequelize = await dbname(
{ query: "", headers: { compcode: finalCompcode, name: "metaLeadCron" } },
finalCompcode
);
// 1. Fetch Lead Details
const leads = await sequelize.query(
`SELECT TOP 1 UTD, Meta_Lead_Id, Full_Name, Phone_Number, Form_Id, Page_Id, Company_Name
FROM dbo.Meta_Lead_Tbl
WHERE UTD = :metaLeadUtd`,
{ replacements: { metaLeadUtd }, type: QueryTypes.SELECT }
);
if (!leads || leads.length === 0) {
console.warn(`[META-INSTANT-CALL] ⚠️ Lead UTD #${metaLeadUtd} not found or inactive.`);
return { success: false, reason: "Lead not found" };
}
const lead = leads[0];
const rawPhone = lead.Phone_Number;
if (!rawPhone) {
console.warn(`[META-INSTANT-CALL] ⚠️ Phone number missing for Lead UTD #${metaLeadUtd}`);
return { success: false, reason: "Phone number missing" };
}
const targetPhone = process.env.META_TEST_OVERRIDE_PHONE || rawPhone;
const formattedPhone = formatPhoneNumber(targetPhone);
if (process.env.META_TEST_OVERRIDE_PHONE) {
console.log(`[META-INSTANT-CALL] 🎯 Test Phone Override Active: Call targeted to ${formattedPhone} (Original Lead Phone: ${rawPhone})`);
} else {
console.log(`[META-INSTANT-CALL] 🚀 Live Call Target: ${formattedPhone} (Lead #${metaLeadUtd} - ${lead.Full_Name || "Customer"})`);
}
// 2. Fetch Active Campaign matching Form_Id or Latest Active
let campResult = null;
if (lead.Form_Id) {
campResult = await sequelize.query(
`SELECT TOP 1 Campaign_Id, Campaign_Name, Meta_Form_Id, Meta_Form_Name, Sales_Executive_Number
FROM dbo.Meta_Callmatic_Campaign_Tbl
WHERE Is_Active = 1 AND Meta_Form_Id = :formId
ORDER BY UTD DESC`,
{ replacements: { formId: lead.Form_Id }, type: QueryTypes.SELECT }
);
}
if (!campResult || campResult.length === 0) {
campResult = await sequelize.query(
`SELECT TOP 1 Campaign_Id, Campaign_Name, Meta_Form_Id, Meta_Form_Name, Sales_Executive_Number
FROM dbo.Meta_Callmatic_Campaign_Tbl
WHERE Is_Active = 1
ORDER BY UTD DESC`,
{ type: QueryTypes.SELECT }
);
}
if (!campResult || campResult.length === 0 || !campResult[0].Campaign_Id) {
console.warn(`[META-INSTANT-CALL] ⚠️ No active Callmatic campaign found in Meta_Callmatic_Campaign_Tbl.`);
return { success: false, reason: "No active campaign" };
}
const camp = campResult[0];
const campaignId = camp.Campaign_Id;
const campaignName = camp.Campaign_Name || "Default Meta Campaign";
const metaFormId = camp.Meta_Form_Id || lead.Form_Id || "";
const metaFormName = camp.Meta_Form_Name || "";
const campaignTransferNumber = camp.Sales_Executive_Number || camp.Transfer_Number || null;
// 3. Prepare Call Variables
const companyName = lead.Company_Name || "AUTOVYN";
const calleeName = lead.Full_Name || "Customer";
const transferNumber = campaignTransferNumber || process.env.META_TRANSFER_NUMBER || "9876543210";
const variables = {
company_name: companyName,
callee_phone_number: formattedPhone,
callee_name: calleeName,
transferNumber: transferNumber,
};
// 4. Execute Single AI Call
const callResult = await triggerSingleCall1(formattedPhone, variables, campaignId);
const callId = callResult?.callId || callResult?.id || callResult?.data?.callId || null;
console.log(`[META-INSTANT-CALL] ✅ AI Call Executed | Lead UTD: #${metaLeadUtd} | Phone: ${formattedPhone} | Call ID: ${callId}`);
if (callId) {
try {
const { startMetaCallStatusPoller } = require("../routes/metaWebhookRoutes");
if (typeof startMetaCallStatusPoller === "function") {
startMetaCallStatusPoller(
finalCompcode,
formattedPhone,
campaignId,
lead.UTD,
callId,
lead.Full_Name || "Valued Customer"
);
}
} catch (pollerErr) {
console.warn("[META-INSTANT-CALL] Poller launch warning:", pollerErr?.message);
}
}
// 5. Insert Log Record into Meta_Call_Log_Tbl
try {
await sequelize.query(
`INSERT INTO dbo.Meta_Call_Log_Tbl (
Meta_Lead_UTD, Meta_Lead_Id, Call_Id, Call_Type, Call_Source,
Campaign_Id, Campaign_Name, Meta_Form_Id, Meta_Form_Name, Phone_Number, Created_By, Created_At
) VALUES (
:metaLeadUtd, :metaLeadId, :callId, :callType, :callSource,
:campaignId, :campaignName, :metaFormId, :metaFormName, :phone, :createdBy, GETDATE()
)`,
{
replacements: {
metaLeadUtd: lead.UTD,
metaLeadId: lead.Meta_Lead_Id || "",
callId: String(callId || ""),
callType,
callSource,
campaignId: String(campaignId),
campaignName,
metaFormId: String(metaFormId),
metaFormName,
phone: formattedPhone,
createdBy,
},
type: QueryTypes.INSERT,
}
);
} catch (logErr) {
console.error("[META-INSTANT-CALL] Call Log Insert Error:", logErr?.message);
}
// 6. Insert Activity Record into Meta_Lead_Activity_Tbl
try {
await sequelize.query(
`INSERT INTO dbo.Meta_Lead_Activity_Tbl (
Meta_Lead_UTD, Activity_Type, Remark, Activity_Status, Created_By, Created_At
) VALUES (
:metaLeadUtd, 'CALL_INITIATED', :remark, 'COMPLETED', 'AUTO_LEAD_CALLER', GETDATE()
)`,
{
replacements: {
metaLeadUtd: lead.UTD,
remark: `Instant Callmatic AI Call triggered to ${formattedPhone}. Call ID: ${callId || "N/A"}`,
},
type: QueryTypes.INSERT,
}
);
} catch (actErr) {
console.error("[META-INSTANT-CALL] Activity Insert Error:", actErr?.message);
}
// 7. Update Meta_Lead_Tbl status to 1 (Called), Call_Status, Call_Count, and Last_Call_At
try {
await sequelize.query(
`UPDATE dbo.Meta_Lead_Tbl
SET status = 1,
Call_Status = 'INITIATED',
Call_Count = ISNULL(Call_Count, 0) + 1,
Last_Call_At = GETDATE(),
Updated_At = GETDATE()
WHERE UTD = :metaLeadUtd`,
{ replacements: { metaLeadUtd: lead.UTD }, type: QueryTypes.UPDATE }
);
} catch (updErr) {
console.error("[META-INSTANT-CALL] Meta Lead Update Error:", updErr?.message);
}
return { success: true, callId, callResult };
} catch (err) {
console.error(`[META-INSTANT-CALL] ❌ Failed for Lead UTD #${metaLeadUtd}:`, err?.message);
return { success: false, error: err?.message };
} finally {
if (sequelize) { try { await sequelize.close(); } catch (_) { } }
}
}
// ============================================================
// 🔄 PERIODIC UNCALLED LEADS AUTO-CALL SCHEDULER
// ============================================================
async function processMetaLeadDealer(compcode) {
let sequelize;
const result = { compcode, totalFound: 0, callSuccess: 0, callFailed: 0, skipped: 0 };
try {
sequelize = await dbname(
{ query: "", headers: { compcode, name: "metaLeadCron" } },
compcode
);
// Fetch uncalled Meta leads (status = 0) created in last 7 days
let rows = [];
try {
rows = await sequelize.query(
`SELECT TOP 10 UTD, Meta_Lead_Id, Full_Name, Phone_Number, Form_Id, Page_Id, Company_Name
FROM dbo.Meta_Lead_Tbl
WHERE ISNULL(status, 0) = 0
AND Phone_Number IS NOT NULL AND LTRIM(RTRIM(Phone_Number)) <> ''
AND (UTD = 306 OR Phone_Number LIKE '%6266899053')
ORDER BY UTD DESC`,
{
type: QueryTypes.SELECT,
}
);
} catch (qErr) {
console.error(`[META-AUTO-CALL] Fetch leads error:`, qErr?.message);
}
result.totalFound = rows.length;
if (rows.length === 0) return result;
console.log(`[META-AUTO-CALL] [${compcode}] Found ${rows.length} pending Meta leads for auto-calling.`);
for (const row of rows) {
try {
const callRes = await triggerInstantMetaLeadCall({
metaLeadUtd: row.UTD,
compcode,
callType: "AUTO_AI_CALL",
callSource: "CRON_RETRY_SCHEDULER",
createdBy: "AUTO_CRON",
});
if (callRes.success) result.callSuccess++;
else result.callFailed++;
} catch (callErr) {
result.callFailed++;
}
// Inter-call delay (2 seconds)
await new Promise((r) => setTimeout(r, 2000));
}
} catch (err) {
console.error(`[META-AUTO-CALL] [${compcode}] Error:`, err?.message);
} finally {
if (sequelize) { try { await sequelize.close(); } catch (_) { } }
}
return result;
}
/**
⏰ PROCESS DUE SCHEDULED FOLLOWUP CALLS FROM META_LEAD_FOLLOWUP_TBL
*/
async function processScheduledFollowupCalls(compcode) {
let sequelize;
const finalCompcode = compcode || String(process.env.META_COMP_CODE).trim();
try {
sequelize = await dbname(
{ query: "", headers: { compcode: finalCompcode, name: "metaLeadCron" } },
finalCompcode
);
// Fetch pending follow-ups due up to current date & time
const dueFollowups = await sequelize.query(
`SELECT TOP 10
f.UTD AS Followup_UTD,
f.Meta_Lead_UTD,
f.Followup_Date,
f.Followup_Time,
f.Purpose
FROM dbo.Meta_Lead_Followup_Tbl f
INNER JOIN dbo.Meta_Lead_Tbl l ON l.UTD = f.Meta_Lead_UTD
WHERE f.Followup_Status = 'PENDING'
AND ISNULL(l.status, 0) NOT IN (3, 9) -- Exclude exhausted/closed leads
AND (l.UTD = 306 OR l.Phone_Number LIKE '%6266899053')
AND CAST(CONCAT(f.Followup_Date, ' ', ISNULL(NULLIF(LTRIM(RTRIM(f.Followup_Time)), ''), '00:00:00')) AS DATETIME) <= GETDATE()
ORDER BY f.UTD ASC`,
{ type: QueryTypes.SELECT }
);
if (!dueFollowups || dueFollowups.length === 0) return;
console.log(`[META-SCHEDULED-CALL] [${finalCompcode}] Found ${dueFollowups.length} due scheduled follow-up calls to trigger.`);
for (const item of dueFollowups) {
try {
await triggerInstantMetaLeadCall({
metaLeadUtd: item.Meta_Lead_UTD,
compcode: finalCompcode,
callType: "AUTO_AI_CALL",
callSource: "CRON_SCHEDULED_CALLBACK",
createdBy: "AUTO_CRON",
});
// Mark follow-up as COMPLETED
await sequelize.query(
`UPDATE dbo.Meta_Lead_Followup_Tbl
SET Followup_Status = 'COMPLETED',
Remark = CONCAT(ISNULL(Remark, ''), ' [Auto Scheduled Call Executed at ', GETDATE(), ']')
WHERE UTD = :followupUtd`,
{ replacements: { followupUtd: item.Followup_UTD }, type: QueryTypes.UPDATE }
);
console.log(`[META-SCHEDULED-CALL] [${finalCompcode}] ✅ Triggered scheduled call for Lead #${item.Meta_Lead_UTD} (Followup UTD #${item.Followup_UTD})`);
} catch (err) {
console.error(`[META-SCHEDULED-CALL] [${finalCompcode}] ❌ Failed scheduled call for Lead #${item.Meta_Lead_UTD}:`, err?.message);
}
await new Promise((r) => setTimeout(r, 2000));
}
} catch (err) {
console.error(`[META-SCHEDULED-CALL] [${finalCompcode}] Error:`, err?.message);
} finally {
if (sequelize) { try { await sequelize.close(); } catch (_) { } }
}
}
/**
Run Auto Call Scheduler across all dealers
*/
async function runMetaLeadAutoCallScheduler() {
console.log("Running scheduled job for Meta Lead Auto-Call...");
let sequelize1 = null;
try {
sequelize1 = await dbname(
{ query: "", headers: { compcode: "DBCON", name: "schedualer" } },
"DBCON"
);
} catch (err) {
console.error("[META-CRON] DBCON Connection Error:", err?.message);
}
let Dlr_data = [];
if (sequelize1) {
try {
const [rows] = await sequelize1.query(
`SELECT Dlr_Id FROM DLR_SCH WHERE SCH_TYPE = 'metalead' AND export_type < 3`
);
if (Array.isArray(rows) && rows.length > 0) {
Dlr_data = rows;
}
} catch (e) {
console.warn("[META-CRON] Query DLR_SCH fallback to default compcode:", e?.message);
}
}
if (Dlr_data.length === 0) {
const defaultCompcode = String(process.env.META_COMP_CODE || "autovyn").trim();
Dlr_data = [{ Dlr_Id: defaultCompcode }];
}
for (const dealer of Dlr_data) {
const compcode = dealer.Dlr_Id;
try {
await processScheduledFollowupCalls(compcode);
await processMetaLeadDealer(compcode);
} catch (err) {
console.error(`Meta Lead Auto-Call job failed for ${compcode}:`, err?.message);
}
}
if (sequelize1) {
try {
await sequelize1.close();
} catch (_) { }
}
}
// ============================================================
// 🔄 WEBHOOK CALL SYNC SCHEDULER FOR META LEADS
// ============================================================
async function processMetaLeadWebhookUpdates() {
let sequelize;
const compCode = String(process.env.META_COMP_CODE || "DB001").trim();
try {
sequelize = await dbname(
{ query: "", headers: { compcode: compCode, name: "metaLeadCron" } },
compCode
);
// Fetch call logs with Call_Id
const pendingLogs = await sequelize.query(
`SELECT TOP 20 log.UTD AS Log_UTD, log.Meta_Lead_UTD, log.Call_Id, log.Phone_Number
FROM dbo.Meta_Call_Log_Tbl log
WHERE log.Call_Id IS NOT NULL
ORDER BY log.UTD DESC`,
{ type: QueryTypes.SELECT }
);
if (!pendingLogs || pendingLogs.length === 0) return;
const { autoSyncLeadCalls } = require("../routes/metaWebhookRoutes");
for (const item of pendingLogs) {
if (typeof autoSyncLeadCalls === "function") {
await autoSyncLeadCalls(sequelize, item.Meta_Lead_UTD);
}
await new Promise((r) => setTimeout(r, 500));
}
} catch (err) {
console.error("[META-WEBHOOK-SYNC] Error:", err?.message);
} finally {
if (sequelize) { try { await sequelize.close(); } catch (_) { } }
}
}

async function runInsuranceFollowupScheduler(targetCompcode = null) {
console.log("Running scheduled job for Insurance Followup Calling...");
// ─────────────────────────────────────────────
// ALL HELPER FUNCTIONS DEFINED INSIDE ASYNC
// ─────────────────────────────────────────────
function writeDailySchedulerLog(logData) {
try {
const today = new Date().toISOString().split("T")[0];
const logDir = path.join(__dirname, "../scheduler_logs");
if (!fs.existsSync(logDir)) {
fs.mkdirSync(logDir, { recursive: true });
}
const filePath = path.join(logDir, `${today}.txt`);
fs.appendFileSync(filePath, JSON.stringify(logData) + "
");
} catch (err) {
console.error("TXT log failed:", err.message);
}
}
const normalizeVehNo = (v) =>
String(v || "")
.toUpperCase()
.replace(/[^A-Z0-9]/g, "")
.trim();
const normalizePhone = (p) => {
if (!p) return "";
let s = String(p).trim().replace(/[\s-]/g, "");
if (/^\d{10}$/.test(s)) s = `+91${s}`;
if (/^91\d{10}$/.test(s)) s = `+${s}`;
return s;
};
const formatDateYYYYMMDD_to_DDMMYYYY = (dateStr) => {
if (!dateStr) return "";
const parts = String(dateStr).split("-");
if (parts.length !== 3) return String(dateStr);
const [y, m, d] = parts;
return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`;
};
const timeToAmPm = (hhmmss) => {
if (!hhmmss) return null;
const s = String(hhmmss).trim();
const match = s.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
if (!match) return s;
let h = parseInt(match[1], 10);
const min = match[2];
const ampm = h >= 12 ? "PM" : "AM";
h = h % 12;
if (h === 0) h = 12;
return `${h}:${min} ${ampm}`;
};
const toMDY = (d = new Date()) => {
const mm = d.getMonth() + 1;
const dd = d.getDate();
const yyyy = d.getFullYear();
return `${mm}/${dd}/${yyyy}`;
};
let sequelize1;
try {
sequelize1 = await dbname(
{ query: "", headers: { compcode: "DBCON", name: "schedualer" } },
"DBCON"
);
} catch (e) {
console.error("[INS-CRON] DBCON connection error:", e?.message);
}
// 1. Determine active dealers from DLR_SCH
let Dlr_data = [];
if (targetCompcode) {
Dlr_data = [{ Dlr_Id: String(targetCompcode).trim().toLowerCase() }];
} else if (sequelize1) {
try {
const [rows] = await sequelize1.query(
`SELECT DISTINCT LTRIM(RTRIM(Dlr_Id)) AS Dlr_Id
FROM DLR_SCH
WHERE SCH_TYPE = 'insuranceremider'
AND export_type < 3
AND Dlr_Id IS NOT NULL
AND LTRIM(RTRIM(Dlr_Id)) <> ''`
);
Dlr_data = rows || [];
} catch (e) {
console.error("[INS-CRON] DBCON DLR_SCH query error:", e?.message);
Dlr_data = [];
}
}
console.log(`[INS-CRON] Active dealers to process: ${Dlr_data.length}`);
const results = [];
// 2. Loop through each dealer
for (const dealer of Dlr_data) {
const compcode = dealer.Dlr_Id;
if (!compcode) continue;
const logger = new SchedulerLogger(sequelize1, compcode);
console.log(`
⏳ Processing dealer: ${compcode}`);
let sequelize;
try {
sequelize = await dbname(
{ query: "", headers: { compcode, name: "schedualer" } },
compcode
);
if (!sequelize) {
console.log(`⚠️ [${compcode}] Skipped: no database connection configured.`);
logger.addSkip(1);
continue;
}
// Fetch due followups
const now = new Date();
const pad2 = (n) => String(n).padStart(2, "0");
const currDate = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
const currTime = `${pad2(now.getHours())}:${pad2(now.getMinutes())}:${pad2(now.getSeconds())}`;
const rows = await sequelize.query(
`
SELECT
f.UTD AS FOLLOWUP_UTD,
f.TRAN_ID,
f.FOLLOWUP_STATUS,
CONVERT(varchar(10), f.FOLLOWUP_DATE, 23) AS FOLLOWUP_DATE,
CONVERT(varchar(8), f.FOLLOWUP_TIME, 108) AS FOLLOWUP_TIME,
f.CALL_ID,
m.UTD AS MST_UTD,
m.VEHICAL_REG_NO,
m.EXPORT_TYPE,
m.LOC_CODE,
r.UTD AS RENEWAL_UTD,
r.CUST_NAME,
r.CUST_MOB_NO,
r.POLICY_NAME,
CAST(r.POLICY_NUMBER AS varchar(100)) AS POLICY_NUMBER,
r.MODEL_NAME,
r.DSC_MOB_NO,
CONVERT(varchar(10), r.POLICY_END_DATE, 23) AS POLICY_END_DATE
FROM dbo.FOLLOWUP_DETAILS f
INNER JOIN dbo.INSU_RENEWAL_MST m ON m.UTD = f.TRAN_ID
OUTER APPLY (
SELECT TOP 1
rr.UTD, rr.CUST_NAME, rr.CUST_MOB_NO, rr.POLICY_NAME, rr.POLICY_NUMBER,
rr.MODEL_NAME, rr.POLICY_END_DATE, rr.DSC_MOB_NO
FROM dbo.INSU_RENEWAL rr
WHERE rr.TRAN_ID = m.UTD
OR (
m.VEHICAL_REG_NO IS NOT NULL
AND REPLACE(UPPER(rr.VEHICAL_REG_NO), ' ', '') = REPLACE(UPPER(m.VEHICAL_REG_NO), ' ', '')
)
ORDER BY rr.UTD DESC
) r
WHERE (m.EXPORT_TYPE = 1 OR m.EXPORT_TYPE IS NULL)
AND (f.CALL_ID IS NULL OR LTRIM(RTRIM(f.CALL_ID)) = '')
AND (
f.FOLLOWUP_STATUS IS NULL
OR LTRIM(RTRIM(UPPER(f.FOLLOWUP_STATUS))) IN ('PENDING','OPEN','PROMISED','CALLBACK')
)
AND r.CUST_MOB_NO IS NOT NULL
AND LTRIM(RTRIM(CAST(r.CUST_MOB_NO AS varchar(20)))) <> ''
-- DUE CONDITION (compared with current system date & time)
AND (
CAST(f.FOLLOWUP_DATE AS date) < CAST(:currDate AS date)
OR (
CAST(f.FOLLOWUP_DATE AS date) = CAST(:currDate AS date)
AND (
f.FOLLOWUP_TIME IS NULL
OR LTRIM(RTRIM(f.FOLLOWUP_TIME)) = ''
OR TRY_CONVERT(time(0), f.FOLLOWUP_TIME) IS NULL
OR TRY_CONVERT(time(0), f.FOLLOWUP_TIME) <= CAST(:currTime AS time(0))
)
)
)
ORDER BY f.UTD ASC
`,
{
replacements: { currDate, currTime },
type: QueryTypes.SELECT,
}
);
if (!rows || !rows.length) {
console.log(`✅ No due insurance followups for ${compcode}.`);
logger.addSkip(1);
continue;
}
console.log(`📞 Found ${rows.length} due followups for ${compcode}`);
for (const r of rows) {
try {
const phoneNumber = normalizePhone(r.CUST_MOB_NO);
if (!phoneNumber)
throw new Error(`Invalid customer mobile for TRAN_ID=${r.TRAN_ID}`);
// Fetch INSU_CALLING_CONFIG dynamically by LOC_CODE
const locCode = r.LOC_CODE != null ? Number(r.LOC_CODE) : null;
let cfg = null;
try {
const cfgRows = await sequelize.query(
`SELECT TOP 1
C.UTD,
C.INSU_COMPANY_NAME,
C.SALES_EXECUTIVE_NO,
C.SLOT1,
C.SLOT2,
C.SLOT3,
C.CAMPAIGN_ID,
CONVERT(varchar(8), C.CALLBACK_TIME) AS CALLBACK_TIME,
C.LOC_CODE,
C.STATUS
FROM dbo.INSU_CALLING_CONFIG C
WHERE (C.LOC_CODE = :locCode OR C.LOC_CODE IS NULL)
ORDER BY
CASE WHEN C.LOC_CODE = :locCode THEN 0 ELSE 1 END,
C.UTD DESC`,
{
replacements: { locCode: locCode != null ? Number(locCode) : null },
type: QueryTypes.SELECT,
}
);
cfg = cfgRows?.[0] || null;
} catch (cfgErr) {
console.error("[INS-CRON] getCallingConfig error:", cfgErr?.message);
}
// Build dynamic variables
const resolvedVehicleModel = (() => {
if (r.MODEL_NAME != null && String(r.MODEL_NAME).trim() !== "")
return String(r.MODEL_NAME).trim();
if (r.POLICY_NAME != null && String(r.POLICY_NAME).trim() !== "")
return String(r.POLICY_NAME).trim();
if (r.VEHICAL_REG_NO != null && String(r.VEHICAL_REG_NO).trim() !== "")
return normalizeVehNo(r.VEHICAL_REG_NO);
return null;
})();
const resolvedTransferNumber = (() => {
if (r.DSC_MOB_NO != null && String(r.DSC_MOB_NO).trim() !== "") {
return String(r.DSC_MOB_NO).trim();
}
if (cfg?.SALES_EXECUTIVE_NO != null && String(cfg.SALES_EXECUTIVE_NO).trim() !== "") {
return String(cfg.SALES_EXECUTIVE_NO).trim();
}
return null;
})();
const callbackDate = r.FOLLOWUP_DATE
? formatDateYYYYMMDD_to_DDMMYYYY(r.FOLLOWUP_DATE)
: toMDY(new Date());
const callbackTime = (() => {
if (r.FOLLOWUP_TIME && String(r.FOLLOWUP_TIME).trim() !== "") {
return timeToAmPm(r.FOLLOWUP_TIME);
}
if (cfg?.CALLBACK_TIME) {
return timeToAmPm(cfg.CALLBACK_TIME);
}
return "04:00 PM";
})();
const variables = {
showroom_name:
r.POLICY_NAME?.trim() ||
cfg?.INSU_COMPANY_NAME?.trim() ||
null,
vehicle_model: resolvedVehicleModel,
vehicle_number:
r.VEHICAL_REG_NO != null && String(r.VEHICAL_REG_NO).trim() !== ""
? normalizeVehNo(r.VEHICAL_REG_NO)
: null,
insurance_expiry_date:
formatDateYYYYMMDD_to_DDMMYYYY(r.POLICY_END_DATE) || null,
transferNumber: resolvedTransferNumber,
callback_date: callbackDate,
callback_time: callbackTime,
callee_name:
r.CUST_NAME != null && String(r.CUST_NAME).trim() !== ""
? String(r.CUST_NAME).trim()
: null,
};
const finalCampaignId = cfg?.CAMPAIGN_ID || null;
// Validate variables
const missing = [];
if (!variables.showroom_name)
missing.push("showroom_name (INSU_CALLING_CONFIG.INSU_COMPANY_NAME or POLICY_NAME)");
if (!variables.vehicle_model)
missing.push("vehicle_model (MODEL_NAME / POLICY_NAME / VEHICAL_REG_NO)");
if (!variables.vehicle_number)
missing.push("vehicle_number (INSU_RENEWAL_MST.VEHICAL_REG_NO)");
if (!variables.insurance_expiry_date)
missing.push("insurance_expiry_date (INSU_RENEWAL.POLICY_END_DATE)");
if (!variables.transferNumber)
missing.push("transferNumber (DSC_MOB_NO / INSU_CALLING_CONFIG.SALES_EXECUTIVE_NO)");
if (!variables.callback_time)
missing.push("callback_time (FOLLOWUP_DETAILS.FOLLOWUP_TIME or INSU_CALLING_CONFIG.CALLBACK_TIME)");
if (!variables.callee_name)
missing.push("callee_name (INSU_RENEWAL.CUST_NAME)");
if (!finalCampaignId)
missing.push("campaign_id (INSU_CALLING_CONFIG.CAMPAIGN_ID)");
if (missing.length) {
throw new Error(
`Missing dynamic config for FOLLOWUP_UTD=${r.FOLLOWUP_UTD} | LOC_CODE=${locCode} | Missing: ${missing.join(", ")}`
);
}
// Trigger call
const callResult = await triggerSingleCall(
phoneNumber,
variables,
finalCampaignId
);
const callId =
callResult?.callId || callResult?.calls?.[0]?.callId || null;
if (!callId)
throw new Error("Call triggered but callId not received from Callmatic");
// Update FOLLOWUP_DETAILS with callId
await sequelize.query(
`
UPDATE dbo.FOLLOWUP_DETAILS
SET
CALL_ID = :call_id,
FOLLOWUP_STATUS = 'AI_CALL_INITIATED',
LAST_FOLLOWUP_DATE = CAST(GETDATE() AS date)
WHERE UTD = :followup_utd
`,
{
replacements: {
call_id: String(callId),
followup_utd: Number(r.FOLLOWUP_UTD),
},
type: QueryTypes.UPDATE,
}
);
// Save call webhook log & call_Id_dtl
try {
if (callId && saveCallWebhookDetails) {
await saveCallWebhookDetails(sequelize, callId, {
status: "INITIATED",
phoneNumber,
calleeName: variables.callee_name || null,
campaignId: finalCampaignId,
triggeredAt: new Date(),
startTime: new Date(),
category: "INSURANCE_FOLLOWUP",
});
}
await sequelize.query(
`INSERT INTO dbo.call_Id_dtl (mob_no, call_id, call_type)
VALUES (:mob_no, :call_id, 'INSURANCE_FOLLOWUP')`,
{
replacements: {
mob_no: phoneNumber,
call_id: String(callId),
},
type: QueryTypes.INSERT,
}
);
} catch (_) { }
// Add Impact to SchedulerLogger
logger.addImpact("FOLLOWUP_DETAILS", r.FOLLOWUP_UTD, 1);
console.log(
`✅ Call initiated for ${compcode} | Cust:${r.CUST_NAME} | Phone:${phoneNumber} | CallID:${callId}`
);
// Auto WhatsApp on Call Completion
setImmediate(async () => {
try {
console.log(`[INS-CRON-WA] WhatsApp background monitoring started for callId: ${callId}`);
const checkCallStatus = async (cId, maxAttempts = 60) => {
let attempts = 0;
while (attempts < maxAttempts) {
try {
const statusResult = await getCallStatus(cId);
if (statusResult && sequelize && saveCallWebhookDetails) {
await saveCallWebhookDetails(sequelize, cId, {
...statusResult,
phoneNumber,
calleeName: variables.callee_name || null,
campaignId: finalCampaignId,
});
}
const st = String(statusResult?.status || "").toUpperCase();
if (["COMPLETED", "ENDED", "FINISHED", "FAILED", "BUSY", "NO_ANSWER", "CANCELED"].includes(st)) {
return { success: true, status: statusResult?.status, duration: statusResult?.duration };
}
await new Promise((resolve) => setTimeout(resolve, 2000));
attempts++;
} catch (checkErr) {
attempts++;
await new Promise((resolve) => setTimeout(resolve, 2000));
}
}
return { success: false, status: "TIMEOUT" };
};
if (callId) {
const callStatusResult = await checkCallStatus(callId);
if (!callStatusResult?.success) {
await new Promise((resolve) => setTimeout(resolve, 5000));
}
}
const effectiveCompCode = compcode || "DBCON";
const mstUtd = r.MST_UTD || r.TRAN_ID;
const reqObj = {
headers: { compcode: effectiveCompCode },
body: { tranIds: [Number(mstUtd)] },
};
let waResult;
const resObj = {
status: (code) => ({
send: (data) => { waResult = { statusCode: code, data }; return waResult; },
json: (data) => { waResult = { statusCode: code, data }; return waResult; },
}),
};
await SendInsuranceRenewalWhatsAppToCustomer(reqObj, resObj);
console.log(`[INS-CRON-WA] ✅ SendInsuranceRenewalWhatsAppToCustomer completed for MST_UTD=${mstUtd} (${effectiveCompCode})`);
} catch (waErr) {
console.error("[INS-CRON-WA] ❌ Auto-WhatsApp failed:", waErr?.message);
}
});
// Delay between calls
await new Promise((x) => setTimeout(x, '30000'));
} catch (callErr) {
logger.setError(callErr);
console.error(`Call failed for FOLLOWUP_UTD=${r.FOLLOWUP_UTD} (${compcode}):`, callErr.message);
}
}
} catch (err) {
logger.setError(err);
console.error(`Insurance Followup job failed for ${compcode}:`, err.message);
} finally {
if (sequelize) {
try {
await sequelize.close();
} catch (_) { }
}
}
try {
await logger.save();
writeDailySchedulerLog(logger.toJSON());
} catch (logErr) {
console.error("Logger failed:", logErr.message);
}
results.push(logger.toJSON());
}
// Close DBCON connection
if (sequelize1) {
try {
await sequelize1.close();
} catch (_) { }
}
console.log(`[INS-CRON] ══ SCHEDULER RUN COMPLETED ══`);
return targetCompcode ? (results[0] || null) : results;
}

async function SyncMobileRightsScheduler() {
console.log("Running scheduled job for mobile rights sync...");
const sequelize1 = await dbname(
{ query: "", headers: { compcode: "DBCON", name: "schedualer" } },
"DBCON"
);
const [Dlr_data] = await sequelize1.query(
`SELECT * FROM DLR_SCH WHERE SCH_TYPE = 'MobileRights' AND export_type < 3`
);
// const Dlr_data = [{ "Dlr_Id": "autovyn" }]; // jitne compcode hain unki list yaha daalo
for (const dealer of Dlr_data) {
const compcode = dealer.Dlr_Id;
const logger = new SchedulerLogger(sequelize1, "mobilerightssync", compcode);
const sequelize = await dbname(
{ query: "", headers: { compcode, name: "schedualer" } },
compcode
);
const t = await sequelize.transaction();
try {
const Employeemaster = _Employeemaster(sequelize, DataTypes);
const RightsTbl = _MobileRights(sequelize, DataTypes);
// 1️⃣ Jin employees ka MOBILE_RIGHTS = 0 hai (pending resync) — sirf active employees
const pendingEmployees = await Employeemaster.findAll({
where: {
[Op.or]: [
{ MOBILE_RIGHTS: 0 },
{ MOBILE_RIGHTS: null },
],
LASTWOR_DATE: null,
},
attributes: ["EMPCODE"],
raw: true,
transaction: t,
});
if (!pendingEmployees.length) {
console.log(`✅ No pending employees for mobile rights sync in ${compcode}.`);
logger.addSkip(1);
await t.commit();
continue;
}
// 2️⃣ Default rights template (Emp_Code = '0')
const defaultRights = await RightsTbl.findAll({
where: { Emp_Code: "0" },
raw: true,
transaction: t,
});
if (!defaultRights.length) {
console.log(`⚠️ No default mobile rights (Emp_Code=0) found for ${compcode} - skipping`);
logger.addSkip(1);
await t.commit();
continue;
}
let syncedCount = 0;
for (const emp of pendingEmployees) {
const empCode = emp.EMPCODE;
try {
// 3️⃣ Employee ke existing rights nikalo
const existingRights = await RightsTbl.findAll({
where: { Emp_Code: empCode },
raw: true,
transaction: t,
});
const existingKeySet = new Set(
existingRights.map((r) => `${r.Optn_Name}||${r.Module_Code}`)
);
// 4️⃣ Sirf missing rights nikalo (default me h, employee ke pass nhi)
const missingRights = defaultRights.filter(
(r) => !existingKeySet.has(`${r.Optn_Name}||${r.Module_Code}`)
);
if (missingRights.length > 0) {
const rightsToCreate = missingRights.map((r) => ({
Emp_Code: empCode,
Optn_Name: r.Optn_Name,
Module_Code: r.Module_Code,
USER_CODE: 1,
}));
await RightsTbl.bulkCreate(rightsToCreate, { transaction: t });
console.log(`➕ ${missingRights.length} missing right(s) added for ${empCode}`);
logger.addImpact("MOBILE_RIGHTS_ADDED", empCode, missingRights.length);
} else {
console.log(`✔️ ${empCode} already has all default rights — kuch add nhi karna`);
}
// 5️⃣ Sync ho gaya, flag wapas 1
await Employeemaster.update(
{ MOBILE_RIGHTS: 1 },
{ where: { EMPCODE: empCode }, transaction: t }
);
syncedCount++;
} catch (empErr) {
console.log(`❌ Failed EMP:${empCode} - ${empErr.message}`);
logger.setError(empErr);
}
}
await t.commit();
console.log(`✅ Mobile rights sync complete for ${compcode}. Synced: ${syncedCount}`);
} catch (err) {
if (!t.finished) {
await t.rollback();
}
logger.setError(err);
console.error("Mobile Rights Sync job failed:", err.message);
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
}
if (sequelize1) {
await sequelize1.close();
}
}
// =========================================================
// Get Previous Completed Custom Month
// =========================================================
async function getPreviousCustomMonthDynamic(sequelize, date) {
if (!date) {
throw new Error("Date is required");
}
const d = new Date(date);
if (isNaN(d.getTime())) {
throw new Error(`Invalid date received: ${date}`);
}
const formattedDate = d.toISOString().split("T")[0];
const query = `
SELECT TOP 1
Misc_Code,
Misc_Dtl1,
Misc_Dtl2,
TRY_CONVERT(DATE, Misc_Dtl1, 103) AS StartDate,
TRY_CONVERT(DATE, Misc_Dtl2, 103) AS EndDate
FROM Misc_Mst
WHERE Misc_Type = 25
AND Export_Type < 3
AND TRY_CONVERT(DATE, Misc_Dtl2, 103) < :date
ORDER BY TRY_CONVERT(DATE, Misc_Dtl2, 103) DESC
`;
const [rows] = await sequelize.query(query, {
replacements: {
date: formattedDate,
},
});
// =========================================================
// Custom month configuration found
// =========================================================
if (rows.length > 0) {
const row = rows[0];
const startDate = row.StartDate;
const endDate = row.EndDate;
const endDateObj = new Date(endDate);
return {
customMonth: row.Misc_Code.toString().padStart(2, "0"),
// Year EndDate se lenge
customYear: endDateObj.getFullYear(),
startDate,
endDate,
};
}
// =========================================================
// Fallback - Previous Calendar Month
// =========================================================
const previousMonthDate = new Date(
d.getFullYear(),
d.getMonth() - 1,
1
);
const fallbackStartDate = new Date(
previousMonthDate.getFullYear(),
previousMonthDate.getMonth(),
1
);
const fallbackEndDate = new Date(
previousMonthDate.getFullYear(),
previousMonthDate.getMonth() + 1,
0
);
return {
customMonth: String(previousMonthDate.getMonth() + 1).padStart(2, "0"),
customYear: previousMonthDate.getFullYear(),
startDate: fallbackStartDate,
endDate: fallbackEndDate,
};
}

// =========================================================
// Previous Month Roster Scheduler
// =========================================================
async function SyncPreviousMonthRosterScheduler() {
console.log(
"Running scheduled job for previous completed custom month roster sync..."
);
const sequelize1 = await dbname(
{
query: "",
headers: {
compcode: "DBCON",
name: "schedualer",
},
},
"DBCON"
);
// =========================================================
// Get all dealers
// =========================================================
const [Dlr_data] = await sequelize1.query(`
SELECT *
FROM DLR_SCH
WHERE SCH_TYPE = 'BackMonthRoster'
AND export_type < 3
`);
// Testing ke liye agar sirf ek company chalani ho:
// const Dlr_data = [{ Dlr_Id: "autovyn" }];
for (const dealer of Dlr_data) {
const compcode = dealer.Dlr_Id;
console.log(`
⏳ Processing dealer: ${compcode}`);
const logger = new SchedulerLogger(
sequelize1,
"previousmonthrostersync",
compcode
);
let sequelize;
let t;
try {
// =====================================================
// Company DB Connection
// =====================================================
sequelize = await dbname(
{
query: "",
headers: {
compcode,
name: "schedualer",
},
},
compcode
);
t = await sequelize.transaction();
// =====================================================
// 1. Get Previous COMPLETED Custom Month
// =====================================================
const today = new Date();
const customMonthData = await getPreviousCustomMonthDynamic(
sequelize,
today
);
const { customMonth, customYear, startDate, endDate } =
customMonthData;
console.log(`📅 Roster Sync Period | Company: ${compcode}`);
console.log(`📅 Custom Month: ${customMonth}/${customYear}`);
console.log(`📆 Date Range: ${startDate} -> ${endDate}`);
const startDateObj = new Date(startDate);
startDateObj.setHours(0, 0, 0, 0);
// =====================================================
// 2. Get Active Employees
// =====================================================
const [employees] = await sequelize.query(
`
SELECT
EMPCODE,
EMP_SHIFT,
Weeklyoff,
LOCATION
FROM EMPLOYEEMASTER
WHERE LASTWOR_DATE IS NULL
`,
{ transaction: t }
);
if (!employees.length) {
console.log(`⚠️ No active employees found for ${compcode}`);
logger.addSkip(1);
await t.commit();
continue;
}
console.log(`👨‍💼 Active Employees: ${employees.length}`);
let totalInserted = 0;
let totalMissing = 0;
let totalLocked = 0;
let totalLocationLocked = 0;
let totalComplete = 0;
// =====================================================
// 2A. UTD counter — company DB me IDENTITY nahi hai,
// isliye manually next value track karenge
// =====================================================
const [[{ maxUtd }]] = await sequelize.query(
`SELECT ISNULL(MAX(UTD), 0) AS maxUtd FROM attendancetable`,
{ transaction: t }
);
let nextUtd = maxUtd;
// =====================================================
// 2B. Location Join-Date Cache (misc_type = 85)
// Ek hi baar sab distinct locations ka Join_Date le lo,
// employee-loop me baar-baar query mat karo
// =====================================================
const distinctLocations = [
...new Set(
employees
.map((e) => e.LOCATION)
.filter((loc) => loc !== null && loc !== undefined)
),
];
const locationJoinDateMap = new Map();
if (distinctLocations.length > 0) {
const [locRows] = await sequelize.query(
`
SELECT
misc_code AS LocationCode,
MAX(Join_Date) AS Join_Date
FROM misc_mst
WHERE misc_Type = 85
AND Export_Type < 33
AND misc_code IN (:locations)
GROUP BY misc_code
`,
{
replacements: { locations: distinctLocations },
transaction: t,
}
);
for (const row of locRows) {
locationJoinDateMap.set(
String(row.LocationCode),
row.Join_Date ? new Date(row.Join_Date) : null
);
}
}
// =====================================================
// 3. Employee-wise Processing
// =====================================================
for (const emp of employees) {
const empCode = emp.EMPCODE;
try {
// =================================================
// 3A0. Location Join-Date Lock Check
//
// Agar location us custom month period ke andar ya
// baad me join hua hai, to roster generate mat karo
// =================================================
const locationJoinDate = locationJoinDateMap.get(
String(emp.LOCATION)
);
if (locationJoinDate && locationJoinDate >= startDateObj) {
console.log(
`🔒 ${empCode} (Location: ${emp.LOCATION}) locked — location joined on ${locationJoinDate.toISOString().split("T")[0]}, custom month period se pehle active nahi tha.`
);
totalLocationLocked++;
logger.addSkip(1);
continue;
}
// =================================================
// 3A. Attendance Lock Check (already processed)
//
// Emp_Atnrun me employee + custom month check
// =================================================
const [attendanceLock] = await sequelize.query(
`
SELECT TOP 1
Emp_Code,
Rerun,
Loc_Code
FROM Emp_Atnrun
WHERE Emp_Code = :empCode
AND Rerun = :customMonth
`,
{
replacements: {
empCode,
customMonth: Number(customMonth),
},
transaction: t,
}
);
if (attendanceLock.length > 0) {
console.log(
`🔒 ${empCode} attendance locked/processed for custom month ${customMonth}. Roster skipped.`
);
totalLocked++;
logger.addSkip(1);
continue;
}
// =================================================
// 3B. Existing Roster Dates
// =================================================
const [existingRoster] = await sequelize.query(
`
SELECT
CAST(dateoffice AS DATE) AS dateoffice
FROM attendancetable
WHERE emp_Code = :empCode
AND CAST(dateoffice AS DATE) >= :startDate
AND CAST(dateoffice AS DATE) <= :endDate
`,
{
replacements: { empCode, startDate, endDate },
transaction: t,
}
);
const existingDates = new Set(
existingRoster.map((row) => {
const d = new Date(row.dateoffice);
return [
d.getFullYear(),
String(d.getMonth() + 1).padStart(2, "0"),
String(d.getDate()).padStart(2, "0"),
].join("-");
})
);
// =================================================
// 3C. Generate Missing Dates
//
// Location join date ke baad wale dates hi generate
// karo agar join period ke beech me pada ho
// =================================================
const missingDates = [];
const currentDate = new Date(startDate);
const lastDate = new Date(endDate);
currentDate.setHours(0, 0, 0, 0);
lastDate.setHours(0, 0, 0, 0);
while (currentDate <= lastDate) {
const dateKey = [
currentDate.getFullYear(),
String(currentDate.getMonth() + 1).padStart(2, "0"),
String(currentDate.getDate()).padStart(2, "0"),
].join("-");
if (!existingDates.has(dateKey)) {
missingDates.push(new Date(currentDate));
}
currentDate.setDate(currentDate.getDate() + 1);
}
// =================================================
// 3D. Roster Complete
// =================================================
if (missingDates.length === 0) {
console.log(`✔️ ${empCode} roster complete`);
totalComplete++;
logger.addSkip(1);
continue;
}
console.log(
`⚠️ ${empCode} missing ${missingDates.length} roster date(s)`
);
console.log(
`Missing Dates:`,
missingDates.map((d) => d.toISOString().split("T")[0])
);
totalMissing += missingDates.length;
// =================================================
// 3E. Get Employee Shift
// =================================================
const [shiftRows] = await sequelize.query(
`
SELECT TOP 1
LTRIM(RTRIM(Misc_Add1)) AS ShiftStart,
LTRIM(RTRIM(Misc_Add2)) AS ShiftEnd
FROM Misc_Mst
WHERE CAST(Misc_Code AS VARCHAR) = :shift
AND Misc_Type = 90
AND Export_Type < 3
`,
{
replacements: { shift: emp.EMP_SHIFT },
transaction: t,
}
);
const shiftStart = shiftRows[0]?.ShiftStart || null;
const shiftEnd = shiftRows[0]?.ShiftEnd || null;
// =================================================
// 3F. Insert ONLY Missing Dates
// =================================================
for (const rosterDate of missingDates) {
const dayNumber = rosterDate.getDay();
const status =
String(dayNumber) === String(emp.Weeklyoff) ? "WO" : "A";
let shiftStartDateTime = null;
let shiftEndDateTime = null;
if (shiftStart) {
shiftStartDateTime = toSqlDateTime(
`${rosterDate.toISOString().split("T")[0]} ${shiftStart}`
);
}
if (shiftEnd) {
shiftEndDateTime = toSqlDateTime(
`${rosterDate.toISOString().split("T")[0]} ${shiftEnd}`
);
}
console.log("Roster Insert:", {
empCode,
rosterDate,
shiftStart,
shiftEnd,
shiftStartDateTime,
shiftEndDateTime,
});
nextUtd++; // pehle increment, fir use
await sequelize.query(
`
INSERT INTO attendancetable
(
emp_Code,
dateoffice,
shiftstarttime,
shiftendtime,
status,
flag,
wo_value,
UTD
)
VALUES
(
:empCode,
:dateoffice,
:shiftStart,
:shiftEnd,
:status,
:flag,
0.00,
:utd
)
`,
{
replacements: {
empCode,
dateoffice: toSqlDateTime(rosterDate),
shiftStart: shiftStartDateTime,
shiftEnd: shiftEndDateTime,
status,
flag: status,
utd: nextUtd,
},
type: sequelize.QueryTypes.INSERT,
transaction: t,
}
);
totalInserted++;
}
// =================================================
// Logger
// =================================================
logger.addImpact("ROSTER_ADDED", empCode, missingDates.length);
console.log(
`➕ ${missingDates.length} roster date(s) added for ${empCode}`
);
} catch (empErr) {
console.error(
`❌ Roster failed EMP:${empCode} - ${empErr.message}`
);
logger.setError(empErr);
}
}
// =====================================================
// 4. Commit
// =====================================================
await t.commit();

} catch (err) {
// =====================================================
// Rollback
// =====================================================
if (t && !t.finished) {
await t.rollback();
}
logger.setError(err);
console.error(
`❌ Previous Month Roster Scheduler failed for ${compcode}:`,
err.message
);
} finally {
// =====================================================
// Close Company DB
// =====================================================
if (sequelize) {
try {
await sequelize.close();
} catch (closeErr) {
console.error(`DB close failed for ${compcode}:`, closeErr.message);
}
}
}
// =======================================================
// Save Scheduler Logger
// =======================================================
try {
await logger.save();
writeDailySchedulerLog(logger.toJSON());
} catch (logErr) {
console.error(`Logger failed for ${compcode}:`, logErr.message);
}
}
// =========================================================
// Close DBCON
// =========================================================
if (sequelize1) {
await sequelize1.close();
}
console.log("✅ Previous completed custom month roster scheduler finished.");
}
async function SyncEicherData() {
try {
await startScheduler()
} catch (error) {
console.log("error found ")
}
}

async function runRosterScheduler(targetCompcode = null) {
console.log("Running scheduled job for Employee Roster Scheduler...");
// ─────────────────────────────────────────────
// ALL HELPER FUNCTIONS DEFINED INSIDE ASYNC
// ─────────────────────────────────────────────
function writeDailySchedulerLog(logData) {
try {
const today = new Date().toISOString().split("T")[0];
const logDir = path.join(__dirname, "../scheduler_logs");
if (!fs.existsSync(logDir)) {
fs.mkdirSync(logDir, { recursive: true });
}
const filePath = path.join(logDir, `${today}.txt`);
fs.appendFileSync(filePath, JSON.stringify(logData) + "
");
} catch (err) {
console.error("TXT log failed:", err.message);
}
}
const pad2 = (n) => String(n).padStart(2, "0");
const isValidTime = (val) => {
if (!val) return false;
const str = String(val).trim();
return str !== "" && str !== "0" && str !== "0.00" && str !== "null" && str !== "undefined";
};
let sequelize1;
try {
sequelize1 = await dbname(
{ query: "", headers: { compcode: "DBCON", name: "schedualer" } },
"DBCON"
);
} catch (e) {
console.error("[ROSTER-CRON] DBCON connection error:", e?.message);
}
// ═══════════════════════════════════════════════════════════════
// CONNECTION 1: Sequelize Connection for ENV compcode (Default_Mst)
// ═══════════════════════════════════════════════════════════════
const envCompCode = process.env.DEFAULT_COMP_CODE || "autovyn";
console.log(envCompCode, 'envCompCode')
let defaultShiftStart = "09.30";
let defaultShiftEnd = "18.30";
const formatShiftTime = (val, fallback) => {
if (!val) return fallback;
let s = String(val).trim();
if (!s || s === "null" || s === "undefined" || s === "0" || s === "0.00") return fallback;
s = s.replace(/:/g, ".").replace(/[^0-9.]/g, "");
return s || fallback;
};
let sequelizeEnv;
try {
sequelizeEnv = await dbname(
{ query: "", headers: { compcode: envCompCode, name: "schedualer" } },
envCompCode
);
if (sequelizeEnv) {
const [defRows] = await sequelizeEnv.query(`
SELECT TOP 1
LTRIM(RTRIM(CAST(misc_add1 AS VARCHAR(100)))) AS misc_add1,
LTRIM(RTRIM(CAST(misc_add2 AS VARCHAR(100)))) AS misc_add2,
LTRIM(RTRIM(CAST(misc_dtl1 AS VARCHAR(100)))) AS misc_dtl1,
LTRIM(RTRIM(CAST(misc_dtl2 AS VARCHAR(100)))) AS misc_dtl2
FROM Default_Mst
WHERE CAST(misc_type AS VARCHAR) = '1002' and Export_Type<33
ORDER BY
CASE
WHEN misc_add1 IS NOT NULL AND LTRIM(RTRIM(CAST(misc_add1 AS VARCHAR))) <> '' THEN 1
WHEN misc_dtl1 IS NOT NULL AND LTRIM(RTRIM(CAST(misc_dtl1 AS VARCHAR))) <> '' THEN 2
ELSE 3
END,
misc_code DESC
`);
console.log(defRows, 'defRows');
if (defRows && defRows.length > 0) {
const r = defRows[0];
const add1 = r.misc_add1 ?? r.Misc_Add1;
const add2 = r.misc_add2 ?? r.Misc_Add2;
const dtl1 = r.misc_dtl1 ?? r.Misc_Dtl1;
const dtl2 = r.misc_dtl2 ?? r.Misc_Dtl2;
if (isValidTime(add1)) defaultShiftStart = formatShiftTime(add1, "09.30");
else if (isValidTime(dtl1)) defaultShiftStart = formatShiftTime(dtl1, "09.30");
if (isValidTime(add2)) defaultShiftEnd = formatShiftTime(add2, "18.30");
else if (isValidTime(dtl2)) defaultShiftEnd = formatShiftTime(dtl2, "18.30");
}
}
} catch (defErr) {
console.warn(`[ROSTER-CRON] Warning: Could not read Default_Mst from ENV compcode (${envCompCode}):`, defErr?.message);
} finally {
if (sequelizeEnv) {
try { await sequelizeEnv.close(); } catch (_) { }
}
}
console.log(`[ROSTER-CRON] Fallback Shift from ENV (${envCompCode}).Default_Mst (1002): Start: "${defaultShiftStart}" | End: "${defaultShiftEnd}"`);
// Determine active dealers from DLR_SCH
let Dlr_data = [];
if (targetCompcode) {
Dlr_data = [{ Dlr_Id: String(targetCompcode).trim().toLowerCase() }];
} else if (sequelize1) {
try {
const [rows] = await sequelize1.query(
`SELECT DISTINCT LTRIM(RTRIM(Dlr_Id)) AS Dlr_Id
FROM DLR_SCH
WHERE SCH_TYPE = 'roster'
AND export_type < 3
AND Dlr_Id IS NOT NULL
AND LTRIM(RTRIM(Dlr_Id)) <> ''`
);
Dlr_data = rows || [];
} catch (e) {
console.error("[ROSTER-CRON] DBCON DLR_SCH query error:", e?.message);
Dlr_data = [];
}
}
console.log(`[ROSTER-CRON] Active dealers to process: ${Dlr_data.length}`);
const results = [];
// Loop through each dealer
for (const dealer of Dlr_data) {
const compcode = dealer.Dlr_Id;
if (!compcode) continue;
const logger = new SchedulerLogger(sequelize1, 'roster', compcode);
console.log(`
⏳ Processing dealer: ${compcode}`);
// ═══════════════════════════════════════════════════════════════
// CONNECTION 2: Sequelize Connection for Header/Target Compcode
// ═══════════════════════════════════════════════════════════════
let sequelize;
try {
sequelize = await dbname(
{ query: "", headers: { compcode, name: "schedualer" } },
compcode
);
if (!sequelize) {
console.log(`⚠️ [${compcode}] Skipped: no database connection configured.`);
logger.addSkip(1);
continue;
}
// Current Date in Asia/Kolkata (IST)
const now = new Date(new Date().toLocaleString("en-US", { timeZone: 'Asia/Kolkata' }));
const currYear = now.getFullYear();
const currMonth = now.getMonth() + 1; // 1 to 12
const currDay = now.getDate();
const currentDateStr = `${currYear}-${pad2(currMonth)}-${pad2(currDay)}`;
// 4. Company-wise Trigger Date Check via Misc_Mst (Misc_Type = 25)
// Misc_Dtl2 is End Date. Trigger Date is exactly (Misc_Dtl2 - 2 Days).
const [miscRows] = await sequelize.query(`
SELECT TOP 1
TRY_CONVERT(VARCHAR(10), TRY_CONVERT(DATE, Misc_Dtl1, 103), 23) AS StartDate,
TRY_CONVERT(VARCHAR(10), TRY_CONVERT(DATE, Misc_Dtl2, 103), 23) AS EndDate,
TRY_CONVERT(VARCHAR(10), DATEADD(DAY, -2, TRY_CONVERT(DATE, Misc_Dtl2, 103)), 23) AS TriggerDate
FROM Misc_Mst
WHERE Misc_Type = 25
AND Misc_Code = ${currMonth}
AND Misc_Abbr = '${currYear}'
AND Export_Type < 3
`);
let startDateStr = null;
let endDateStr = null;
let triggerDateStr = null;
if (miscRows && miscRows.length > 0 && miscRows[0].EndDate) {
startDateStr = miscRows[0].StartDate;
endDateStr = miscRows[0].EndDate;
triggerDateStr = miscRows[0].TriggerDate;
} else {
// Fallback: normal calendar month (Last Day - 2 Days)
const lastDay = new Date(currYear, currMonth, 0).getDate();
const triggerDay = lastDay - 2;
startDateStr = `${currYear}-${pad2(currMonth)}-01`;
endDateStr = `${currYear}-${pad2(currMonth)}-${pad2(lastDay)}`;
triggerDateStr = `${currYear}-${pad2(currMonth)}-${pad2(triggerDay)}`;
}
console.log(`📅 [${compcode}] Date Cycle: ${startDateStr} to ${endDateStr} | Trigger Date (End - 2 Days): ${triggerDateStr}`);
const isTriggerDay = currentDateStr === triggerDateStr;
console.log(isTriggerDay, "isTriggerDay", currentDateStr, triggerDateStr);
if (!isTriggerDay && !targetCompcode) {
console.log(`⏭️ [${compcode}] Trigger condition not met. Today (${currentDateStr}) != Trigger Date (${triggerDateStr}). Skipping.`);
logger.addSkip(1);
continue;
}
// 5. Read RSTR_ADV_MNTH from COMP_KEYDATA
let rstrAdvMonth = 0;
try {
const [keyDataRows] = await sequelize.query(
`SELECT TOP 1 ISNULL(RSTR_ADV_MNTH, 0) AS RSTR_ADV_MNTH FROM COMP_KEYDATA`
);
if (keyDataRows && keyDataRows.length > 0) {
const rawVal = keyDataRows[0]?.RSTR_ADV_MNTH ?? keyDataRows[0]?.rstr_adv_mnth;
console.log(rawVal, "rawVal");
rstrAdvMonth = Number(rawVal) || 0;
}
} catch (keyErr) {
console.warn(`⚠️ [${compcode}] Could not read RSTR_ADV_MNTH from COMP_KEYDATA (default 0):`, keyErr.message);
rstrAdvMonth = 0;
}
console.log(`⚙️ [${compcode}] RSTR_ADV_MNTH: ${rstrAdvMonth}`);
// Calculate Target Months:
// 0 = current month only
// 1 = current + next 1 month
// 2 = current + next 2 months
// 3 = current + next 3 months
const targetMonths = [];
const validAdvMonths = Math.max(0, Math.min(rstrAdvMonth, 12));
for (let offset = 0; offset <= validAdvMonths; offset++) {
const targetDate = new Date(currYear, (currMonth - 1) + offset, 1);
targetMonths.push({
month: targetDate.getMonth() + 1,
year: targetDate.getFullYear(),
});
}
console.log(
`📅 [${compcode}] Target Months (${targetMonths.length}):`,
targetMonths.map((m) => `${pad2(m.month)}/${m.year}`).join(", ")
);
// 6. Process each target month using exact CreateRoaster SQL logic with Default_Mst fallback
for (const target of targetMonths) {
const month = target.month;
const year = target.year;
console.log(`▶️ [${compcode}] Executing Roster Creation for ${pad2(month)}/${year}...`);
const query = `
DECLARE @Mnth INT = ${Number(month)};
DECLARE @Yr INT = ${Number(year)};
DECLARE @StartDate DATE;
DECLARE @EndDate DATE;
DECLARE @DefShiftStart VARCHAR(50) = '${defaultShiftStart}';
DECLARE @DefShiftEnd VARCHAR(50) = '${defaultShiftEnd}';
SELECT TOP 1
@StartDate = TRY_CONVERT(DATE, Misc_Dtl1, 103),
@EndDate = TRY_CONVERT(DATE, Misc_Dtl2, 103)
FROM Misc_Mst
WHERE Misc_Type = 25
AND Misc_Code = @Mnth
AND Misc_Abbr = '${year}'
AND Export_Type < 3;
-- Fallback to normal calendar month
IF @StartDate IS NULL OR @EndDate IS NULL
BEGIN
SET @StartDate = DATEFROMPARTS(@Yr, @Mnth, 1);
SET @EndDate = EOMONTH(@StartDate);
END;

IF OBJECT_ID('tempdb..#EmployeeStatus') IS NOT NULL DROP TABLE #EmployeeStatus;
;WITH EmployeeStatus AS
(
SELECT
EM.EMPCODE,
LTRIM(RTRIM(
ISNULL(EM.EMPFIRSTNAME, '') + ' ' +
ISNULL(EM.EMPLASTNAME, '')
)) AS EMPNAME,
EM.LASTWOR_DATE,
EM.EMP_SHIFT,
EM.WEEKLYOFF,
CASE
WHEN EM.LASTWOR_DATE IS NOT NULL
THEN 'SKIPPED'
WHEN EXISTS
(
SELECT 1
FROM attendancetable A
WHERE A.Emp_Code = EM.EMPCODE
AND CAST(A.dateoffice AS DATE)
BETWEEN @StartDate AND @EndDate
)
THEN 'ALREADY_EXISTS'
WHEN NOT EXISTS
(
SELECT 1
FROM Misc_Mst M
WHERE M.Misc_Type = 90
AND CAST(M.Misc_Code AS VARCHAR) = CAST(EM.EMP_SHIFT AS VARCHAR)
AND M.Export_Type < 3
) AND (@DefShiftStart IS NULL OR @DefShiftStart = '')
THEN 'FAILED'
ELSE 'READY'
END AS RosterStatus,
CASE
WHEN EM.LASTWOR_DATE IS NOT NULL
THEN 'Employee has LASTWOR_DATE'
WHEN EXISTS
(
SELECT 1
FROM attendancetable A
WHERE A.Emp_Code = EM.EMPCODE
AND CAST(A.dateoffice AS DATE)
BETWEEN @StartDate AND @EndDate
)
THEN 'Roster already exists for selected period'
WHEN NOT EXISTS
(
SELECT 1
FROM Misc_Mst M
WHERE M.Misc_Type = 90
AND CAST(M.Misc_Code AS VARCHAR) = CAST(EM.EMP_SHIFT AS VARCHAR)
AND M.Export_Type < 3
) AND (@DefShiftStart IS NULL OR @DefShiftStart = '')
THEN 'Shift configuration not found'
ELSE 'Eligible for roster creation'
END AS Reason
FROM EMPLOYEEMASTER EM
WHERE 1 = 1
)
SELECT
EMPCODE,
EMPNAME,
EMP_SHIFT,
Weeklyoff,
RosterStatus,
Reason
INTO #EmployeeStatus
FROM EmployeeStatus;
;WITH DateRange AS
(
SELECT
@StartDate AS DateValue,
(DATEPART(WEEKDAY, @StartDate) + @@DATEFIRST - 1) % 7 AS DayNumber
UNION ALL
SELECT
DATEADD(DAY, 1, DateValue),
(
DATEPART(
WEEKDAY,
DATEADD(DAY, 1, DateValue)
) + @@DATEFIRST - 1
) % 7
FROM DateRange
WHERE DateValue < @EndDate
)
INSERT INTO attendancetable
(
emp_Code,
dateoffice,
shiftstarttime,
shiftendtime,
status,
flag,
wo_value
)
SELECT
EM.EMPCODE,
D.DateValue,
COALESCE(
NULLIF(LTRIM(RTRIM(CAST(M.Misc_Add1 AS VARCHAR(50)))), ''),
NULLIF(LTRIM(RTRIM(CAST(M.Misc_Dtl1 AS VARCHAR(50)))), ''),
@DefShiftStart
) AS shiftstarttime,
COALESCE(
NULLIF(LTRIM(RTRIM(CAST(M.Misc_Add2 AS VARCHAR(50)))), ''),
NULLIF(LTRIM(RTRIM(CAST(M.Misc_Dtl2 AS VARCHAR(50)))), ''),
@DefShiftEnd
) AS shiftendtime,
IIF(
CAST(D.DayNumber AS VARCHAR) = CAST(EM.Weeklyoff AS VARCHAR),
'WO',
'A'
) AS status,
IIF(
CAST(D.DayNumber AS VARCHAR) = CAST(EM.Weeklyoff AS VARCHAR),
'WO',
'A'
) AS flag,
0.00 AS wo_value
FROM EMPLOYEEMASTER EM
CROSS JOIN DateRange D
INNER JOIN #EmployeeStatus ES
ON ES.EMPCODE = EM.EMPCODE
AND ES.RosterStatus = 'READY'
LEFT JOIN Misc_Mst M
ON CAST(M.Misc_Code AS VARCHAR) = CAST(EM.EMP_SHIFT AS VARCHAR)
AND M.Misc_Type = 90
AND M.Export_Type < 3
LEFT JOIN attendancetable A
ON EM.EMPCODE = A.Emp_Code
AND CAST(D.DateValue AS DATE) = CAST(A.dateoffice AS DATE)
WHERE A.dateoffice IS NULL;
UPDATE ES
SET
RosterStatus =
CASE
WHEN EXISTS
(
SELECT 1
FROM attendancetable A
WHERE A.Emp_Code = ES.EMPCODE
AND CAST(A.dateoffice AS DATE)
BETWEEN @StartDate AND @EndDate
)
THEN 'CREATED'
ELSE 'FAILED'
END,
Reason =
CASE
WHEN EXISTS
(
SELECT 1
FROM attendancetable A
WHERE A.Emp_Code = ES.EMPCODE
AND CAST(A.dateoffice AS DATE)
BETWEEN @StartDate AND @EndDate
)
THEN 'Roster created successfully'
ELSE 'Roster could not be created'
END
FROM #EmployeeStatus ES
WHERE ES.RosterStatus = 'READY';
SELECT
EMPCODE AS empcode,
EMPNAME AS empname,
EMP_SHIFT AS shift,
RosterStatus AS status,
Reason AS reason
FROM #EmployeeStatus
ORDER BY
CASE RosterStatus
WHEN 'FAILED' THEN 1
WHEN 'SKIPPED' THEN 2
WHEN 'ALREADY_EXISTS' THEN 3
WHEN 'CREATED' THEN 4
ELSE 5
END,
EMPCODE;
SELECT
COUNT() AS totalEmployees,
SUM(
CASE
WHEN RosterStatus = 'CREATED'
THEN 1 ELSE 0
END
) AS createdEmployees,
SUM(
CASE
WHEN RosterStatus = 'ALREADY_EXISTS'
THEN 1 ELSE 0
END
) AS alreadyExists,
SUM(
CASE
WHEN RosterStatus = 'SKIPPED'
THEN 1 ELSE 0
END
) AS skippedEmployees,
SUM(
CASE
WHEN RosterStatus = 'FAILED'
THEN 1 ELSE 0
END
) AS failedEmployees
FROM #EmployeeStatus;
IF OBJECT_ID('tempdb..#EmployeeStatus') IS NOT NULL DROP TABLE #EmployeeStatus;
`;
const [resultsData] = await sequelize.query(query);
const summaryRow = resultsData.find((r) => r && Object.prototype.hasOwnProperty.call(r, "totalEmployees"));
const details = resultsData.filter((r) => r && Object.prototype.hasOwnProperty.call(r, "empcode"));
const summary = summaryRow || {};
const totalEmployees = Number(summary.totalEmployees || details.length);
const createdEmployees = Number(summary.createdEmployees || 0);
const alreadyExists = Number(summary.alreadyExists || 0);
const skippedEmployees = Number(summary.skippedEmployees || 0);
const failedEmployees = Number(summary.failedEmployees || 0);
console.log(`✅ [${compcode}] Month ${pad2(month)}/${year} Complete: Total: ${totalEmployees} | Created: ${createdEmployees} | Exists: ${alreadyExists} | Skipped: ${skippedEmployees} | Failed: ${failedEmployees}`);
if (createdEmployees > 0) {
logger.addImpact("attendancetable", `${month}-${year}`, createdEmployees);
}
if (alreadyExists > 0 || skippedEmployees > 0) {
logger.addSkip(alreadyExists + skippedEmployees);
}
}
console.log(`✅ Roster processing complete for ${compcode}`);
} catch (err) {
const util = require("util");
console.error(util.inspect(err, { depth: 6, showHidden: false }));
const nested = err?.original?.errors || err?.parent?.errors || err?.errors || [];
nested.forEach((e, i) => console.error(`nested[${i}]:`, e?.message, e?.number, e?.lineNumber));
const real = err?.original?.message || err?.parent?.message || nested[0]?.message || err.name;
logger.setError(new Error(real));
} finally {
if (sequelize) {
try {
await sequelize.close();
} catch (_) { }
}
}
try {
await logger.save();
writeDailySchedulerLog(logger.toJSON());
} catch (logErr) {
console.error("Logger failed:", logErr.message);
}
results.push(logger.toJSON());
}
// Close DBCON connection
if (sequelize1) {
try {
await sequelize1.close();
} catch (_) { }
}
console.log(`[ROSTER-CRON] ══ SCHEDULER RUN COMPLETED ══`);
return targetCompcode ? (results[0] || null) : results;
}

module.exports = {
GenerateAttendanceStatus,
GenerateCompOffScheduler,
runKpiReviewReminderScheduler,
runMetaLeadAutoCallScheduler,
processMetaLeadWebhookUpdates,
runInsuranceFollowupScheduler,
SyncMobileRightsScheduler,
SyncPreviousMonthRosterScheduler,
SyncEicherData,
runRosterScheduler
}