const { dbname } = require("../utils/dbconfig");

exports.getDashboardData = async (req, res) => {
    const sequelize = await dbname(req, req.headers.compcode);
    try {
        const { range = 6, location = "", month = "", year = new Date().getFullYear(), login_loc, loc_code, Loc_code } = req.body;
        const branchInput = login_loc || loc_code || Loc_code;
        let loginLocFilter = "";
        if (branchInput) {
            const locArray = Array.isArray(branchInput)
                ? branchInput
                : String(branchInput).split(',').map(s => s.trim()).filter(Boolean);
            if (locArray.length > 0) {
                const locValues = locArray.map(l => `'${String(l).replace(/'/g, "''")}'`).join(",");
                loginLocFilter = `AND EM.LOCATION IN (${locValues})`;
            }
        }
        // Get current date info
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        // Calculate months based on range
        const months = [];
        for (let i = range - 1; i >= 0; i--) {
            const date = new Date(currentYear, currentMonth - 1 - i, 1);
            months.push({
                month: date.toLocaleString('default', { month: 'short' }),
                year: date.getFullYear(),
                monthNum: date.getMonth() + 1
            });
        }
        // Base URL for photos
        const BASE_URL = process.env.DOC_BASE_URL || process.env.NEXT_PUBLIC_imagepath || "https://erp.autovyn.com/backend/fetch?filePath=";
        // Query 1: Total Employees
        const [totalEmployeesResult] = await sequelize.query(`
SELECT COUNT(*) as count FROM EMPLOYEEMASTER EM
WHERE (EM.Export_Type < 3 OR EM.Export_Type IS NULL)
${loginLocFilter}
`);
        const totalEmployees = totalEmployeesResult[0]?.count || 0;
        // Query 2: Active Employees
        const [activeEmployeesResult] = await sequelize.query(`
SELECT COUNT(*) as count FROM EMPLOYEEMASTER EM
WHERE (EM.LASTWOR_DATE IS NULL OR EM.LASTWOR_DATE = '')
AND (EM.Export_Type < 3 OR EM.Export_Type IS NULL)
${loginLocFilter}
`);
        const activeEmployees = activeEmployeesResult[0]?.count || 0;
        // Query 3: Total Departments
        const [departmentsResult] = await sequelize.query(`
SELECT COUNT(DISTINCT DIVISION) as count FROM EMPLOYEEMASTER EM
WHERE DIVISION IS NOT NULL AND DIVISION != '' AND DIVISION != '0'
AND (EM.Export_Type < 3 OR EM.Export_Type IS NULL)
${loginLocFilter}
AND EM.LASTWOR_DATE IS NULL
`);
        const departments = departmentsResult[0]?.count || 0;
        // Query 4: Total Designations
        const [designationsResult] = await sequelize.query(`
SELECT COUNT(DISTINCT EMPLOYEEDESIGNATION) as count FROM EMPLOYEEMASTER EM
WHERE EMPLOYEEDESIGNATION IS NOT NULL AND EMPLOYEEDESIGNATION != ''
AND (EM.Export_Type < 3 OR EM.Export_Type IS NULL) AND EM.LASTWOR_DATE IS NULL
${loginLocFilter}
`);
        const designations = designationsResult[0]?.count || 0;
        // Query 5: New Hires This Month
        const currentMonthStart = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;
        const [newHiresResult] = await sequelize.query(`
SELECT COUNT(*) as count FROM EMPLOYEEMASTER EM
WHERE CAST(EM.CURRENTJOINDATE AS DATE) >= '${currentMonthStart}'
AND (EM.Export_Type < 3 OR EM.Export_Type IS NULL)
${loginLocFilter}
`);
        const newHires = newHiresResult[0]?.count || 0;
        // Get previous month's data for percentages
        const prevMonthStart = new Date(currentYear, currentMonth - 2, 1);
        const prevMonthStartStr = `${prevMonthStart.getFullYear()}-${String(prevMonthStart.getMonth() + 1).padStart(2, '0')}-01`;
        const [prevTotalResult] = await sequelize.query(`
SELECT COUNT(*) as count FROM EMPLOYEEMASTER EM
WHERE (EM.Export_Type < 3 OR EM.Export_Type IS NULL)
${loginLocFilter}
`);
        const [prevActiveResult] = await sequelize.query(`
SELECT COUNT(*) as count FROM EMPLOYEEMASTER EM
WHERE (EM.LASTWOR_DATE IS NULL OR EM.LASTWOR_DATE = '')
AND (EM.Export_Type < 3 OR EM.Export_Type IS NULL)
${loginLocFilter}
`);
        const [prevNewHiresResult] = await sequelize.query(`
SELECT COUNT(*) as count FROM EMPLOYEEMASTER EM
WHERE CAST(EM.CURRENTJOINDATE AS DATE) >= '${prevMonthStartStr}'
AND CAST(EM.CURRENTJOINDATE AS DATE) < '${currentMonthStart}'
AND (EM.Export_Type < 3 OR EM.Export_Type IS NULL)
${loginLocFilter}
`);
        // Calculate percentages
        const totalPercentage = prevTotalResult[0]?.count && prevTotalResult[0]?.count > 0 ?
            ((totalEmployees - prevTotalResult[0]?.count) / prevTotalResult[0]?.count * 100).toFixed(1) : 0;
        const activePercentage = prevActiveResult[0]?.count && prevActiveResult[0]?.count > 0 ?
            ((activeEmployees - prevActiveResult[0]?.count) / prevActiveResult[0]?.count * 100).toFixed(1) : 0;
        const newHiresPercentage = prevNewHiresResult[0]?.count && prevNewHiresResult[0]?.count > 0 ?
            ((newHires - prevNewHiresResult[0]?.count) / prevNewHiresResult[0]?.count * 100).toFixed(1) :
            (newHires > 0 ? 100 : 0);
        // Query 6: Employee Overview - Monthly trend based on range
        const monthlyTrend = [];
        for (const monthData of months) {
            const monthEnd = new Date(monthData.year, monthData.monthNum, 0);
            const monthEndStr = `${monthData.year}-${String(monthData.monthNum).padStart(2, '0')}-${String(monthEnd.getDate()).padStart(2, '0')}`;
            const [totalUpToMonth] = await sequelize.query(`
SELECT COUNT(*) as count FROM EMPLOYEEMASTER EM
WHERE (EM.Export_Type < 3 OR EM.Export_Type IS NULL)
AND (EM.CURRENTJOINDATE <= '${monthEndStr}' OR EM.CURRENTJOINDATE IS NULL)
${loginLocFilter}
`);
            const [totalactive] = await sequelize.query(`
SELECT COUNT(*) as count FROM EMPLOYEEMASTER EM
WHERE (EM.Export_Type < 3 OR EM.Export_Type IS NULL)
AND (EM.CURRENTJOINDATE <= '${monthEndStr}' OR EM.CURRENTJOINDATE IS NULL)
AND (EM.LASTWOR_DATE IS NULL OR EM.LASTWOR_DATE > '${monthEndStr}' OR EM.LASTWOR_DATE = '')
${loginLocFilter}
`);
            monthlyTrend.push({
                month: monthData.month,
                total: totalUpToMonth[0]?.count || 0,
                active: totalactive[0]?.count || 0
            });
        }
        // 🔧 FIXED Query 7: Employees by Department with proper month & location filters
        let departmentWhereClause = "";
        let departmentJoinDateFilter = "";
        // Location filter for department query (pie chart location dropdown)
        if (location) {
            departmentWhereClause = `AND M85.Misc_Name = '${location}'`;
        }
        // Month filter - count employees who were ACTIVE in that month
        if (month) {
            const monthNum = getMonthNumber(month);
            const monthYear = year || new Date().getFullYear();
            const monthStart = `${monthYear}-${String(monthNum).padStart(2, '0')}-01`;
            const monthEnd = new Date(monthYear, monthNum, 0);
            const monthEndStr = `${monthYear}-${String(monthNum).padStart(2, '0')}-${String(monthEnd.getDate()).padStart(2, '0')}`;
            // Employees who joined before or during this month AND were still active at end of month
            departmentJoinDateFilter = `
AND (EM.CURRENTJOINDATE <= '${monthEndStr}' OR EM.CURRENTJOINDATE IS NULL)
AND (EM.LASTWOR_DATE IS NULL OR EM.LASTWOR_DATE > '${monthEndStr}' OR EM.LASTWOR_DATE = '')
`;
        } else {
            // If no month selected, show currently active employees (default behavior)
            departmentJoinDateFilter = `AND EM.LASTWOR_DATE IS NULL`;
        }
        const [employeesByDept] = await sequelize.query(`
SELECT
ISNULL(M68.Misc_Name, 'UNMAPPED - Code: ' + CAST(EM.DIVISION AS VARCHAR)) as department,
COUNT(*) as count
FROM EMPLOYEEMASTER EM
LEFT JOIN MISC_MST M68 ON M68.Misc_Type = 68
AND M68.Misc_Code = EM.DIVISION
AND (ISNULL(M68.Export_Type, 0) < 3)
LEFT JOIN MISC_MST M85 ON M85.Misc_Type = 85
AND M85.Misc_Code = EM.LOCATION
AND (ISNULL(M85.Export_Type, 0) < 3)
WHERE (EM.Export_Type < 3 OR EM.Export_Type IS NULL)
${loginLocFilter}
AND EM.DIVISION IS NOT NULL
AND EM.DIVISION != ''
AND EM.DIVISION != '0'
${departmentWhereClause}
${departmentJoinDateFilter}
GROUP BY ISNULL(M68.Misc_Name, 'UNMAPPED - Code: ' + CAST(EM.DIVISION AS VARCHAR))
ORDER BY count DESC
`);
        // Query 8: All Locations for filter dropdown
        const [allLocations] = await sequelize.query(`
SELECT DISTINCT
M85.Misc_Name as location,
COUNT(*) as count
FROM EMPLOYEEMASTER EM
LEFT JOIN MISC_MST M85 ON M85.Misc_Type = 85 AND M85.Misc_Code = EM.LOCATION AND (ISNULL(M85.Export_Type, 0) < 3)
WHERE (EM.Export_Type < 3 OR EM.Export_Type IS NULL)
AND M85.Misc_Name IS NOT NULL
AND M85.Misc_Name != ''
${loginLocFilter}
GROUP BY M85.Misc_Name
ORDER BY count DESC
`);
        // Query 9: Recent Joiners (Current Month only)
        const [recentJoiners] = await sequelize.query(`
SELECT
EM.EMPCODE,
LTRIM(RTRIM(CONCAT(EM.EMPFIRSTNAME, ' ', EM.EMPLASTNAME))) as name,
EM.EMPLOYEEDESIGNATION as designation,
CAST(EM.CURRENTJOINDATE AS DATE) as joiningDate,
ED.DOC_PATH as photoPath
FROM EMPLOYEEMASTER EM
LEFT JOIN EMP_DOCS ED
ON ED.EMP_CODE = EM.EMPCODE
AND ED.columndoc_type = 'EMPLOYEE'
AND ED.Seq_No = 1
AND (ISNULL(ED.export_type, 0) < 3)
WHERE (EM.Export_Type < 3 OR EM.Export_Type IS NULL)
AND EM.CURRENTJOINDATE IS NOT NULL
AND YEAR(EM.CURRENTJOINDATE) = ${currentYear}
AND MONTH(EM.CURRENTJOINDATE) = ${currentMonth}
${loginLocFilter}
ORDER BY EM.CURRENTJOINDATE DESC
`);
        // Format recent joiners with photo URL
        const formattedRecentJoiners = recentJoiners.map(emp => {
            let fullPhotoUrl = null;
            if (emp.photoPath && emp.photoPath.trim() !== '') {
                let cleanPath = emp.photoPath.replace(/\\/g, '/');
                cleanPath = cleanPath.replace(/^\/+/, '');
                const encodedPath = encodeURIComponent(cleanPath);
                fullPhotoUrl = `${BASE_URL}${encodedPath}`;
            }
            return {
                empcode: emp.EMPCODE,
                name: emp.name,
                designation: emp.designation || 'N/A',
                joiningDate: emp.joiningDate,
                photoUrl: fullPhotoUrl
            };
        });
        // Query 10: Employees by Location
        const [employeesByLocation] = await sequelize.query(`
SELECT
M85.Misc_Name as location,
COUNT(*) as count
FROM EMPLOYEEMASTER EM
LEFT JOIN MISC_MST M85 ON M85.Misc_Type = 85 AND M85.Misc_Code = EM.LOCATION AND (ISNULL(M85.Export_Type, 0) < 3)
WHERE (EM.Export_Type < 3 OR EM.Export_Type IS NULL)
AND M85.Misc_Name IS NOT NULL
AND M85.Misc_Name != ''
GROUP BY M85.Misc_Name
ORDER BY count DESC
`);
        res.status(200).send({
            success: true,
            data: {
                stats: {
                    totalEmployees,
                    activeEmployees,
                    departments,
                    designations,
                    newHires,
                    percentages: {
                        total: parseFloat(totalPercentage),
                        active: parseFloat(activePercentage),
                        newHires: parseFloat(newHiresPercentage)
                    }
                },
                monthlyTrend,
                employeesByDepartment: employeesByDept,
                recentJoiners: formattedRecentJoiners,
                employeesByLocation,
                allLocations
            }
        });
    } catch (err) {
        console.error("Dashboard API Error:", err);
        res.status(500).send({
            success: false,
            message: "Error fetching dashboard data",
            error: err.message
        });
    } finally {
        if (sequelize) await sequelize.close();
    }
};
function getMonthNumber(monthName) {
    const months = {
        'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
        'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
    };
    return months[monthName] || 0;
}

// Get Employees by Type (All, Active, Department, Designation, New Hires, DesignationsList)
exports.getEmployeesByType = async (req, res) => {
    const sequelize = await dbname(req, req.headers.compcode);
    try {
        const { type, value, login_loc, loc_code, Loc_code } = req.body;
        // type can be: 'all', 'active', 'department', 'designation', 'newhires', 'designationslist'
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const currentMonthStart = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;
        
        let locationFilter = "";
        const branchInput = login_loc || loc_code || Loc_code;
        if (branchInput) {
            const locArray = Array.isArray(branchInput)
                ? branchInput
                : String(branchInput).split(',').map(s => s.trim()).filter(Boolean);
            if (locArray.length > 0) {
                const locValues = locArray.map(l => `'${String(l).replace(/'/g, "''")}'`).join(",");
                locationFilter = `AND EM.LOCATION IN (${locValues})`;
            }
        }
    
        let whereClause = "";
        let orderByClause = "EM.EMPCODE ASC";
        let isDesignationList = false;
        switch (type) {
            case 'all':
                whereClause = "";
                orderByClause = "EM.EMPCODE ASC";
                break;
            case 'active':
                whereClause = `AND (EM.LASTWOR_DATE IS NULL OR EM.LASTWOR_DATE = '')`;
                orderByClause = "EM.EMPCODE ASC";
                break;
            case 'department':
                whereClause = `AND M68.Misc_Name = '${value}'`;
                orderByClause = "EM.EMPCODE ASC";
                break;
            case 'designation':
                whereClause = `AND EM.EMPLOYEEDESIGNATION = '${value}'`;
                orderByClause = "EM.EMPCODE ASC";
                break;
            case 'newhires':
                whereClause = `AND CAST(EM.CURRENTJOINDATE AS DATE) >= '${currentMonthStart}'`;
                orderByClause = "EM.CURRENTJOINDATE DESC, EM.EMPCODE ASC";
                break;
            case 'designationslist':
                // This returns list of all designations with counts
                isDesignationList = true;
                break;
            default:
                whereClause = "";
                orderByClause = "EM.EMPCODE ASC";
        }
        // If it's designations list request
        if (type === 'designationslist') {
            const [designations] = await sequelize.query(`
SELECT
EM.EMPLOYEEDESIGNATION as designation,
COUNT(*) as count
FROM EMPLOYEEMASTER EM
WHERE (EM.Export_Type < 3 OR EM.Export_Type IS NULL)
AND EM.EMPLOYEEDESIGNATION IS NOT NULL
AND EM.EMPLOYEEDESIGNATION != ''
${locationFilter}
GROUP BY EM.EMPLOYEEDESIGNATION
ORDER BY EM.EMPLOYEEDESIGNATION ASC
`);
            return res.status(200).send({
                success: true,
                data: designations,
                total: designations.length,
                type: 'designationslist'
            });
        }
        // For employee lists
        const [employees] = await sequelize.query(`
SELECT
EM.EMPCODE,
LTRIM(RTRIM(CONCAT(EM.EMPFIRSTNAME, ' ', EM.EMPLASTNAME))) as name,
EM.EMPLOYEEDESIGNATION as designation,
M68.Misc_Name as department,
EM.CORPORATEMAILID as email,
EM.MOBILENO as mobile,
CAST(EM.CURRENTJOINDATE AS DATE) as joiningDate,
CASE
WHEN EM.LASTWOR_DATE IS NULL OR EM.LASTWOR_DATE = '' THEN 'Active'
ELSE 'Inactive'
END as status
FROM EMPLOYEEMASTER EM
LEFT JOIN MISC_MST M68 ON M68.Misc_Type = 68 AND M68.Misc_Code = EM.DIVISION AND (ISNULL(M68.Export_Type, 0) < 3)
WHERE (EM.Export_Type < 3 OR EM.Export_Type IS NULL)
${whereClause}
${locationFilter}
ORDER BY ${orderByClause}
`);
        res.status(200).send({
            success: true,
            data: employees,
            total: employees.length,
            type: type
        });
    } catch (err) {
        console.error("Get Employees By Type API Error:", err);
        res.status(500).send({
            success: false,
            message: "Error fetching data",
            error: err.message
        });
    } finally {
        if (sequelize) await sequelize.close();
    }
};

// Add this to your employee controller
exports.getEmployeeDetails = async (req, res) => {
    const sequelize = await dbname(req, req.headers.compcode);
    try {
        const { empcode, } = req.body;
        if (!empcode) {
            return res.status(400).send({
                success: false,
                message: "Employee code is required"
            });
        }
        // Base URL for photos
        const BASE_URL = process.env.DOC_BASE_URL || process.env.NEXT_PUBLIC_imagepath || "https://erp.autovyn.com/backend/fetch?filePath=";
        // Main Employee Query
        const [employeeDetails] = await sequelize.query(`
SELECT
EM.EMPCODE,
EM.EMPFIRSTNAME,
EM.EMPLASTNAME,
EM.GENDER,
EM.DOB,
EM.MARITALSTATUS,
EM.BLOODGROUP,
EM.CORPORATEMAILID,
EM.MOBILENO,
EM.EMERGENCYNO,
EM.PANNO,
EM.UAN_No,
EM.UID_NO as AADHARNO,
EM.PFNUMBER,
EM.ESINUMBER,
EM.CURRENTADDRESS1,
EM.CURRENTADDRESS2,
EM.CCITY,
EM.CPINCODE,
EM.CSTATE,
EM.PERMANENTADDRESS1,
EM.PERMANENTADDRESS2,
EM.PCITY,
EM.PPINCODE,
EM.PSTATE,
EM.FATHERNAME,
EM.MOTHERNAME,
EM.SPOUSENAME,
EM.SPOUSECONTACTNO,
EM.EMPLOYEEDESIGNATION,
EM.CURRENTJOINDATE,
EM.PAYMENTMODE,
EM.BANKNAME,
EM.BANKACCOUNTNO,
EM.IFSC_CODE,
ED.DOC_PATH as photoPath,
M68.Misc_Name as DEPARTMENT,
M85.Misc_Name as LOCATION,
M91.Misc_Name as REGION,
M81.Misc_Name as SECTION,
M90.ShiftName as EMP_SHIFT
FROM EMPLOYEEMASTER EM
LEFT JOIN EMP_DOCS ED
ON ED.EMP_CODE = EM.EMPCODE
AND ED.columndoc_type = 'EMPLOYEE'
AND ED.Seq_No = 1
AND (ISNULL(ED.export_type, 0) < 3)
LEFT JOIN MISC_MST M68 ON M68.Misc_Type = 68 AND M68.Misc_Code = EM.DIVISION AND (ISNULL(M68.Export_Type, 0) < 3)
LEFT JOIN MISC_MST M85 ON M85.Misc_Type = 85 AND M85.Misc_Code = EM.LOCATION AND (ISNULL(M85.Export_Type, 0) < 3)
LEFT JOIN MISC_MST M91 ON M91.Misc_Type = 91 AND M91.Misc_Code = EM.Sal_Region AND (ISNULL(M91.Export_Type, 0) < 3)
LEFT JOIN MISC_MST M81 ON M81.Misc_Type = 81 AND M81.Misc_Code = EM.SECTION AND (ISNULL(M81.Export_Type, 0) < 3)
OUTER APPLY (SELECT TOP 1 CONCAT(Misc_Add1,'-',Misc_Add2) AS ShiftName FROM Misc_Mst WHERE Misc_Type=90 AND Misc_Code=EM.EMP_SHIFT) M90
WHERE EM.EMPCODE = '${empcode}'
AND (EM.Export_Type < 3 OR EM.Export_Type IS NULL)
`);
        const [salaryData] = await sequelize.query(`
SELECT TOP 1
ISNULL(Gross,0) AS Salary
FROM SALARYFILE
WHERE Emp_Code='${empcode}'
ORDER BY SalYear DESC, SalMnth DESC
`);
        if (!employeeDetails || employeeDetails.length === 0) {
            return res.status(404).send({
                success: false,
                message: "Employee not found"
            });
        }
        const emp = employeeDetails[0];
        // Format photo URL
        let photoUrl = null;
        if (emp.photoPath && emp.photoPath.trim() !== '') {
            let cleanPath = emp.photoPath.replace(/\\/g, '/');
            cleanPath = cleanPath.replace(/^\/+/, '');
            const encodedPath = encodeURIComponent(cleanPath);
            photoUrl = `${BASE_URL}${encodedPath}`;
        }
        // Format date
        const formatDate = (dateString) => {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        };
        // Professional Information
        const professionalInfo = {
            employeeCode: emp.EMPCODE,
            designation: emp.EMPLOYEEDESIGNATION || 'N/A',
            department: emp.DEPARTMENT || 'N/A',
            location: emp.LOCATION || 'N/A',
            region: emp.REGION || 'N/A',
            section: emp.SECTION || 'N/A',
            shift: emp.EMP_SHIFT || 'N/A',
            joiningDate: formatDate(emp.CURRENTJOINDATE),
            paymentMode: emp.PAYMENTMODE || 'N/A',
            bankName: emp.BANKNAME || 'N/A',
            bankAccountNo: emp.BANKACCOUNTNO || 'N/A',
            ifscCode: emp.IFSC_CODE || 'N/A',
            salary: salaryData?.[0]?.Salary || 0
        };
        // Personal Information
        const personalInfo = {
            name: `${emp.EMPFIRSTNAME || ''} ${emp.EMPLASTNAME || ''}`.trim(),
            gender: emp.GENDER === 'Male' ? '👨 Male' : emp.GENDER === 'Female' ? '👩 Female' : emp.GENDER || 'N/A',
            dateOfBirth: formatDate(emp.DOB),
            bloodGroup: emp.BLOODGROUP || 'N/A',
            maritalStatus: emp.MARITALSTATUS === '1' ? 'Married' : emp.MARITALSTATUS === '0' ? 'Unmarried' : 'N/A',
            email: emp.CORPORATEMAILID || 'N/A',
            mobile: emp.MOBILENO || 'N/A',
            emergencyNo: emp.EMERGENCYNO || 'N/A',
            panNo: emp.PANNO || 'N/A',
            aadharNo: emp.AADHARNO || 'N/A',
            pfNumber: emp.PFNUMBER || 'N/A',
            esiNumber: emp.ESINUMBER || 'N/A',
            uanNo: emp.UAN_No || 'N/A',
            fatherName: emp.FATHERNAME || 'N/A',
            motherName: emp.MOTHERNAME || 'N/A',
            spouseName: emp.SPOUSENAME || 'N/A',
            spouseContact: emp.SPOUSECONTACTNO || 'N/A'
        };
        // Address Information
        const addressInfo = {
            current: {
                address: `${emp.CURRENTADDRESS1 || ''} ${emp.CURRENTADDRESS2 || ''}`.trim(),
            },
            permanent: {
                address: `${emp.PERMANENTADDRESS1 || ''} ${emp.PERMANENTADDRESS2 || ''}`.trim(),
            }
        };
        res.status(200).send({
            success: true,
            data: {
                photoUrl,
                professionalInfo,
                personalInfo,
                addressInfo
            }
        });
    } catch (err) {
        console.error("Employee Details API Error:", err);
        res.status(500).send({
            success: false,
            message: "Error fetching employee details",
            error: err.message
        });
    } finally {
        if (sequelize) await sequelize.close();
    }
};
exports.getEmployeeHistory = async function (req, res) {
    let sequelize;
    try {
        const companyCode = req.headers.compcode;
        const { SRNO, IsSalaryView } = req.body;
        if (!SRNO) {
            return res.status(400).json({
                success: false,
                message: "SRNO is required",
            });
        }
        const salaryFields = [
            "BANKNAME",
            "ACCOUNT_TYPE",
            "BRANCH",
            "PAYMENTMODE",
            "BANKACCOUNTNO",
            "ifsc_code",
            "Emp_Ac_Name",
            "Sal_Hold",
        ];
        sequelize = await dbname(req, companyCode);
        const [historyRows] = await sequelize.query(`
SELECT *
FROM EMPLOYEEMASTER_HST
WHERE SRNO = ${SRNO}
ORDER BY CREATED_ON ASC
`);
        const [currentRows] = await sequelize.query(`
SELECT *
FROM EMPLOYEEMASTER
WHERE SRNO = ${SRNO}
`);
        if (!currentRows.length) {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
            });
        }
        const ignoreColumns = [
            "CREATED_ON",
            "CREATED_BY",
            "LASTMODI_ON",
            "LASTMODI_BY",
            "VALIDFROM",
            "VALIDTO",
            "UTD",
            "TIMESTAMP"
        ];
        const logs = [];
        const getChanges = (oldRow, newRow) => {
            const changes = {};
            Object.keys(newRow).forEach((key) => {
                if (ignoreColumns.includes(key.toUpperCase())) return;
                // Hide salary/bank fields if user doesn't have rights
                if (!IsSalaryView && salaryFields.includes(key.toUpperCase())) {
                    return;
                }
                const oldValue =
                    oldRow[key] === null || oldRow[key] === undefined
                        ? ""
                        : String(oldRow[key]);
                const newValue =
                    newRow[key] === null || newRow[key] === undefined
                        ? ""
                        : String(newRow[key]);
                if (oldValue !== newValue) {
                    changes[key] = {
                        old: oldRow[key],
                        new: newRow[key],
                    };
                }
            });
            return changes;
        };
        // History vs History
        for (let i = 0; i < historyRows.length - 1; i++) {
            const oldRecord = historyRows[i];
            const newRecord = historyRows[i + 1];
            const changes = getChanges(oldRecord, newRecord);
            if (Object.keys(changes).length > 0) {
                logs.push({
                    updated_by: newRecord.LASTMODI_BY || newRecord.CREATED_BY || "SYSTEM",
                    updated_at: newRecord.LASTMODI_ON,
                    changes,
                });
            }
        }
        // Last History vs Current
        if (historyRows.length > 0) {
            const lastHistory = historyRows[historyRows.length - 1];
            const currentRecord = currentRows[0];
            const changes = getChanges(lastHistory, currentRecord);
            if (Object.keys(changes).length > 0) {
                logs.push({
                    updated_by: currentRecord.LASTMODI_BY || currentRecord.CREATED_BY || "SYSTEM",
                    updated_at: currentRecord.LASTMODI_ON,
                    changes,
                });
            }
        }
        // ✅ Sort by updated_at DESC (latest first)
        const sortedLogs = logs
            .filter(log => log.updated_at) // null dates hatao
            .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        console.log(sortedLogs, "logs");
        return res.status(200).json({
            success: true,
            data: sortedLogs,
        });
    } catch (error) {
        console.error("Employee History Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    } finally {
        if (sequelize) {
            await sequelize.close();
        }
    }
};

exports.getCeoSalaryDashboard = async (req, res) => {
    let sequelize;
    try {
        const companyCode = req.headers.compcode;
        sequelize = await dbname(req, companyCode);
        const { loc_code, month, year, range = 6, from_date, to_date } = req.body;

        // Login location filter (SQL-safe)
        let loginLocFilter = "";
        const branchInput = loc_code || req.body.Loc_code || req.body.login_loc;
        if (branchInput) {
            const locArray = Array.isArray(branchInput)
                ? branchInput
                : String(branchInput).split(',').map(s => s.trim()).filter(Boolean);
            if (locArray.length > 0) {
                const locValues = locArray.map(l => `'${String(l).replace(/'/g, "''")}'`).join(",");
                loginLocFilter = `AND ISNULL(S.Loc_Code, EM.LOCATION) IN (${locValues})`;
            }
        }

        // Department filter
        let deptFilter = "";
        const deptInput = req.body.dept_code || req.body.department;
        if (deptInput) {
            deptFilter = `AND (EM.DIVISION = '${String(deptInput).replace(/'/g, "''")}' OR S.Div_Desc = '${String(deptInput).replace(/'/g, "''")}')`;
        }

        // Determine date range (from_date and to_date) or fallback to target month/year
        let startYear, startMonth, endYear, endMonth;
        if (from_date && to_date) {
            const sParts = String(from_date).split('-');
            const eParts = String(to_date).split('-');
            startYear = parseInt(sParts[0], 10);
            startMonth = parseInt(sParts[1], 10);
            endYear = parseInt(eParts[0], 10);
            endMonth = parseInt(eParts[1], 10);
        }

        if (!endYear || !endMonth) {
            endYear = year ? parseInt(year, 10) : null;
            endMonth = month ? parseInt(month, 10) : null;
            if (!endYear || !endMonth) {
                const now = new Date();
                endYear = now.getFullYear();
                endMonth = now.getMonth(); // Previous calendar month
                if (endMonth === 0) {
                    endMonth = 12;
                    endYear -= 1;
                }
            }
        }

        if (!startYear || !startMonth) {
            startYear = endYear;
            startMonth = endMonth;
        }

        // Ensure start is not after end
        if (startYear > endYear || (startYear === endYear && startMonth > endMonth)) {
            const ty = startYear; const tm = startMonth;
            startYear = endYear; startMonth = endMonth;
            endYear = ty; endMonth = tm;
        }

        // Build list of months in selected range
        const selectedRangeMonths = [];
        let cy = startYear;
        let cm = startMonth;
        while (cy < endYear || (cy === endYear && cm <= endMonth)) {
            selectedRangeMonths.push({ year: cy, month: cm });
            cm++;
            if (cm > 12) {
                cm = 1;
                cy++;
            }
        }

        // SQL WHERE filter for the selected range
        let salaryFilter = "";
        if (startYear === endYear) {
            salaryFilter = `S.salyear = ${startYear} AND S.SalMnth BETWEEN ${startMonth} AND ${endMonth}`;
        } else {
            salaryFilter = `((S.salyear = ${startYear} AND S.SalMnth >= ${startMonth}) OR (S.salyear = ${endYear} AND S.SalMnth <= ${endMonth}) OR (S.salyear > ${startYear} AND S.salyear < ${endYear}))`;
        }

        // PRIMARY QUERY WITH GROUPING SETS AS SPECIFIED BY USER
        const [groupedRows] = await sequelize.query(`
            SELECT
                CASE
                    WHEN GROUPING(S.salyear) = 1 THEN 'Grand Total'
                    ELSE CAST(S.SalMnth AS VARCHAR(2))
                END AS Salary_Month,
                S.SalMnth,
                S.salyear,
                SUM(ISNULL(S.Gross_Earn, 0)) AS Total_Gross_Earn,
                SUM(ISNULL(S.Final_Payment, 0)) AS Total_Final_Payment,
                SUM(ISNULL(S.Deducation, 0)) AS Total_Deducation,
                COUNT(DISTINCT CASE WHEN ISNULL(S.Gross_Earn, 0) > 0 OR ISNULL(S.Final_Payment, 0) > 0 THEN S.Emp_Code END) AS EmpCount
            FROM SALARYFILE S WITH (NOLOCK)
            LEFT JOIN EMPLOYEEMASTER EM WITH (NOLOCK)
                ON LTRIM(RTRIM(CONVERT(varchar(50), S.Emp_Code))) = LTRIM(RTRIM(CONVERT(varchar(50), EM.EMPCODE)))
            WHERE (${salaryFilter})
            ${loginLocFilter}
            ${deptFilter}
            GROUP BY GROUPING SETS
            (
                (S.salyear, S.SalMnth),
                ()
            )
            ORDER BY
                GROUPING(S.salyear),
                S.salyear,
                S.SalMnth;
        `);

        const grandTotalRow = (groupedRows || []).find(r => r.Salary_Month === 'Grand Total') || {};
        const monthRowMap = {};
        (groupedRows || []).forEach(r => {
            if (r.Salary_Month !== 'Grand Total' && r.salyear && r.SalMnth) {
                monthRowMap[`${r.salyear}_${r.SalMnth}`] = r;
            }
        });

        // Cards show Grand Total from the grouping query
        const grossSalary = Math.round(Number(grandTotalRow.Total_Gross_Earn || 0));
        const deductionAmount = Math.round(Number(grandTotalRow.Total_Deducation || 0));
        const netPay = Math.round(Number(grandTotalRow.Total_Final_Payment || 0));
        const empCount = Number(grandTotalRow.EmpCount || 0);
        const avgGross = empCount > 0 ? Math.round(grossSalary / empCount) : 0;

        const reqRange = parseInt(range, 10) || 6;
        const monthShortNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        // Build targetPeriods for MonthWise chart:
        // If range spans multiple months (e.g. 6 to 9), chart shows all months in selected range.
        // If single month, chart shows trailing `reqRange` months ending at endMonth.
        let chartPeriods = [];
        if (selectedRangeMonths.length > 1) {
            chartPeriods = selectedRangeMonths;
        } else {
            for (let i = reqRange - 1; i >= 0; i--) {
                let m = endMonth - i;
                let y = endYear;
                while (m <= 0) {
                    m += 12;
                    y -= 1;
                }
                chartPeriods.push({ year: y, month: m });
            }
        }

        // Fetch any missing trailing months if needed for single-month chart view
        const missingPeriods = chartPeriods.filter(p => !monthRowMap[`${p.year}_${p.month}`]);
        if (missingPeriods.length > 0) {
            const missingConds = missingPeriods.map(p => `(S.salyear = ${p.year} AND S.SalMnth = ${p.month})`).join(' OR ');
            const [missingRows] = await sequelize.query(`
                SELECT 
                    S.salyear,
                    S.SalMnth,
                    SUM(ISNULL(S.Gross_Earn, 0)) AS Total_Gross_Earn,
                    SUM(ISNULL(S.Final_Payment, 0)) AS Total_Final_Payment,
                    SUM(ISNULL(S.Deducation, 0)) AS Total_Deducation,
                    COUNT(DISTINCT CASE WHEN ISNULL(S.Gross_Earn, 0) > 0 OR ISNULL(S.Final_Payment, 0) > 0 THEN S.Emp_Code END) AS EmpCount
                FROM SALARYFILE S WITH (NOLOCK)
                LEFT JOIN EMPLOYEEMASTER EM WITH (NOLOCK)
                    ON LTRIM(RTRIM(CONVERT(varchar(50), S.Emp_Code))) = LTRIM(RTRIM(CONVERT(varchar(50), EM.EMPCODE)))
                WHERE (${missingConds})
                ${loginLocFilter}
                ${deptFilter}
                GROUP BY S.salyear, S.SalMnth
            `);
            (missingRows || []).forEach(r => {
                monthRowMap[`${r.salyear}_${r.SalMnth}`] = r;
            });
        }

        // Assemble chronologically ordered monthWise data - STRICTLY REAL DATA FROM SALARYFILE
        const sortedMonthWise = chartPeriods.map(p => {
            const shortName = monthShortNames[p.month] || `M${p.month}`;
            const key = `${p.year}_${p.month}`;
            const row = monthRowMap[key];

            return {
                month: `${shortName} '${String(p.year).slice(2)}`,
                monthShort: shortName,
                salyear: p.year,
                SalMnth: p.month,
                gross: row ? Math.round(Number(row.Total_Gross_Earn || 0)) : 0,
                deductions: row ? Math.round(Number(row.Total_Deducation || 0)) : 0,
                netPay: row ? Math.round(Number(row.Total_Final_Payment || 0)) : 0,
                empCount: row ? Number(row.EmpCount || 0) : 0
            };
        });

        // Trend comparison with previous period of equal duration
        const numMonths = selectedRangeMonths.length;
        const prevPeriods = [];
        let pm = startMonth - 1;
        let py = startYear;
        for (let i = 0; i < numMonths; i++) {
            while (pm <= 0) {
                pm += 12;
                py -= 1;
            }
            prevPeriods.push({ year: py, month: pm });
            pm--;
        }

        let prevGross = 0;
        let prevNet = 0;
        const prevConds = prevPeriods.map(p => `(S.salyear = ${p.year} AND S.SalMnth = ${p.month})`).join(' OR ');
        if (prevConds) {
            const [prevRows] = await sequelize.query(`
                SELECT 
                    SUM(ISNULL(S.Gross_Earn, 0)) AS prevGross,
                    SUM(ISNULL(S.Final_Payment, 0)) AS prevNet
                FROM SALARYFILE S WITH (NOLOCK)
                LEFT JOIN EMPLOYEEMASTER EM WITH (NOLOCK)
                    ON LTRIM(RTRIM(CONVERT(varchar(50), S.Emp_Code))) = LTRIM(RTRIM(CONVERT(varchar(50), EM.EMPCODE)))
                WHERE (${prevConds})
                ${loginLocFilter}
                ${deptFilter}
            `);
            if (prevRows && prevRows.length > 0) {
                prevGross = Math.round(Number(prevRows[0].prevGross || 0));
                prevNet = Math.round(Number(prevRows[0].prevNet || 0));
            }
        }

        const grossDiffPct = prevGross > 0 ? (((grossSalary - prevGross) / prevGross) * 100).toFixed(1) : "0.0";
        const netDiffPct = prevNet > 0 ? (((netPay - prevNet) / prevNet) * 100).toFixed(1) : "0.0";
        const prevLabel = prevPeriods.length === 1 
            ? monthShortNames[prevPeriods[0].month] 
            : `${monthShortNames[prevPeriods[prevPeriods.length - 1].month]}-${monthShortNames[prevPeriods[0].month]}`;

        // Department-wise Salary: strictly for the selected period from SALARYFILE
        const [deptWiseRows] = await sequelize.query(`
            SELECT 
                ISNULL(M68.Misc_Name, ISNULL(S.Div_Desc, 'Unassigned')) AS Department,
                SUM(ISNULL(S.Gross_Earn, 0)) AS Amount,
                COUNT(DISTINCT CASE WHEN ISNULL(S.Gross_Earn, 0) > 0 THEN S.Emp_Code END) AS EmpCount
            FROM SALARYFILE S WITH (NOLOCK)
            LEFT JOIN EMPLOYEEMASTER EM WITH (NOLOCK)
                ON LTRIM(RTRIM(CONVERT(varchar(50), S.Emp_Code))) = LTRIM(RTRIM(CONVERT(varchar(50), EM.EMPCODE)))
            LEFT JOIN MISC_MST M68 WITH (NOLOCK) 
                ON M68.Misc_Type = 68 AND M68.Misc_Code = EM.DIVISION AND ISNULL(M68.Export_Type, 0) < 3
            WHERE (${salaryFilter})
            AND (EM.Export_Type < 3 OR EM.Export_Type IS NULL)
            AND (ISNULL(S.Gross_Earn, 0) > 0 OR ISNULL(S.Final_Payment, 0) > 0)
            ${loginLocFilter}
            ${deptFilter}
            GROUP BY ISNULL(M68.Misc_Name, ISNULL(S.Div_Desc, 'Unassigned'))
            ORDER BY Amount DESC
        `);

        // Location-wise Salary: strictly for the selected period from SALARYFILE
        // User requested: "Location - wise salary isme sabhi location ka dikhana hai" -> show all locations
        const [locWiseRows] = await sequelize.query(`
            SELECT 
                ISNULL(M85.Misc_Name, ISNULL(CONVERT(varchar(50), S.Loc_Code), 'Unknown')) AS Location,
                SUM(ISNULL(S.Gross_Earn, 0)) AS TotalSalary,
                COUNT(DISTINCT CASE WHEN ISNULL(S.Gross_Earn, 0) > 0 THEN S.Emp_Code END) AS EmpCount
            FROM SALARYFILE S WITH (NOLOCK)
            LEFT JOIN EMPLOYEEMASTER EM WITH (NOLOCK)
                ON LTRIM(RTRIM(CONVERT(varchar(50), S.Emp_Code))) = LTRIM(RTRIM(CONVERT(varchar(50), EM.EMPCODE)))
            LEFT JOIN MISC_MST M85 WITH (NOLOCK) 
                ON M85.Misc_Type = 85 
               AND M85.Misc_Code = ISNULL(S.Loc_Code, EM.LOCATION) 
               AND ISNULL(M85.Export_Type, 0) < 3
            WHERE (${salaryFilter})
            AND (EM.Export_Type < 3 OR EM.Export_Type IS NULL)
            AND (ISNULL(S.Gross_Earn, 0) > 0 OR ISNULL(S.Final_Payment, 0) > 0)
            ${deptFilter}
            GROUP BY ISNULL(M85.Misc_Name, ISNULL(CONVERT(varchar(50), S.Loc_Code), 'Unknown'))
            ORDER BY TotalSalary DESC
        `);

        const palette = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899', '#14B8A6', '#6366F1', '#84CC16'];
        const totalDeptAmt = (deptWiseRows || []).reduce((sum, r) => sum + Number(r.Amount || 0), 0) || grossSalary || 0;

        const formattedDeptWise = (deptWiseRows || []).map((r, idx) => {
            const rawAmt = Math.round(Number(r.Amount || 0));
            return {
                Department: r.Department || 'Other',
                Amount: rawAmt,
                percentage: totalDeptAmt > 0 ? `${((rawAmt / totalDeptAmt) * 100).toFixed(1)}%` : "0.0%",
                color: palette[idx % palette.length]
            };
        });

        const formattedLocWise = (locWiseRows || []).map(r => ({
            Location: r.Location || 'Unknown',
            TotalSalary: Math.round(Number(r.TotalSalary || 0))
        }));

        const firstPeriod = sortedMonthWise[0];
        const lastPeriod = sortedMonthWise[sortedMonthWise.length - 1];

        return res.status(200).send({
            success: true,
            period: {
                year: endYear,
                month: endMonth,
                startYear,
                startMonth,
                monthName: monthShortNames[endMonth],
                fromMonth: selectedRangeMonths.length > 1 ? monthShortNames[startMonth] : firstPeriod?.monthShort || monthShortNames[startMonth],
                fromYear: selectedRangeMonths.length > 1 ? startYear : firstPeriod?.salyear || startYear,
                toMonth: monthShortNames[endMonth],
                toYear: endYear,
                displayRange: selectedRangeMonths.length > 1 
                    ? `${monthShortNames[startMonth]} ${startYear} - ${monthShortNames[endMonth]} ${endYear}`
                    : `${monthShortNames[endMonth]} ${endYear}`
            },
            SalaryCards: {
                GrossSalary: grossSalary,
                DeductionAmount: deductionAmount,
                NetPay: netPay,
                AvgGross: avgGross,
                EmpCount: empCount,
                prevGross: prevGross,
                prevNet: prevNet,
                grossDiffText: (prevGross > 0 && grossSalary > 0) ? `${Number(grossDiffPct) >= 0 ? '+' : ''}${grossDiffPct}% vs ${prevLabel}` : "",
                netDiffText: (prevNet > 0 && netPay > 0) ? `${Number(netDiffPct) >= 0 ? '+' : ''}${netDiffPct}% vs ${prevLabel}` : ""
            },
            MonthWiseSalary: sortedMonthWise,
            DepartmentWiseSalary: formattedDeptWise,
            LocationWiseSalary: formattedLocWise
        });

    } catch (err) {
        console.error("CeoSalaryDashboard Error:", err);
        return res.status(500).send({
            success: false,
            message: "Error fetching CEO salary dashboard",
            error: err.message
        });
    } finally {
        if (sequelize) await sequelize.close();
    }
};