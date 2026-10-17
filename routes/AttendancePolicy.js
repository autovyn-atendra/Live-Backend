const { dbname } = require("../utils/dbconfig");

/**
 * Automatically resolves and deactivates any existing active policies that overlap on the same location & employee_types
 * ensuring only 1 policy remains active per location and employee_type combination without blocking the user.
 */
async function handlePolicyOverlap(sequelize, t, {
  policyId = null,
  companyCode,
  locations = [],
  employeeTypes = [],
  effectiveFrom,
  effectiveTo,
  user = 'SYSTEM'
}) {
  const normNewLocs = (Array.isArray(locations) ? locations : String(locations || "").split(","))
    .map((l) => String(l).trim())
    .filter(Boolean);
  const normNewTypes = (Array.isArray(employeeTypes) ? employeeTypes : String(employeeTypes || "").split(","))
    .map((t) => String(t).trim().toLowerCase())
    .filter(Boolean);

  if (normNewLocs.length === 0) return;

  const [existingPolicies] = await sequelize.query(
    `
    SELECT UTD, policy_name, location, employee_types, effective_from, effective_to
    FROM attendance_policies_table
    WHERE company_code = :companyCode
      AND ISNULL(export_type, 0) < 3
      AND is_active = 1
      AND (:policyId IS NULL OR UTD != :policyId)
  `,
    {
      replacements: {
        companyCode,
        policyId: policyId ? Number(policyId) : null,
      },
      transaction: t,
    }
  );

  for (const existing of existingPolicies) {
    const existLocs = (existing.location || "")
      .split(",")
      .map((l) => l.trim())
      .filter(Boolean);
    const existTypes = (existing.employee_types || "")
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    // Common locations
    const overlapLocs = normNewLocs.filter((loc) => existLocs.includes(loc));
    if (overlapLocs.length === 0) continue;

    // Check employee types overlap
    let hasTypeOverlap = false;
    if (normNewTypes.length === 0 || existTypes.length === 0) {
      hasTypeOverlap = true;
    } else {
      hasTypeOverlap = normNewTypes.some((t) => existTypes.includes(t));
    }

    if (!hasTypeOverlap) continue;

    const remainingLocs = existLocs.filter((loc) => !overlapLocs.includes(loc));

    if (remainingLocs.length === 0) {
      // Entire existing policy is overridden for all locations -> deactivate it
      await sequelize.query(
        `
        UPDATE attendance_policies_table
        SET export_type = 33,
            is_active = 0,
            updated_by = :user,
            updated_at = GETDATE()
        WHERE UTD = :utd
      `,
        {
          replacements: { utd: existing.UTD, user },
          transaction: t,
        }
      );

      await sequelize.query(
        `
        UPDATE attendance_status_rules_table
        SET export_type = 33,
            updated_by = :user,
            updated_at = GETDATE()
        WHERE policy_utd = :utd AND (export_type IS NULL OR export_type < 3)
      `,
        {
          replacements: { utd: existing.UTD, user },
          transaction: t,
        }
      );
    } else {
      // Partial locations overridden -> update existing policy with remaining locations
      await sequelize.query(
        `
        UPDATE attendance_policies_table
        SET location = :newLocStr,
            updated_by = :user,
            updated_at = GETDATE()
        WHERE UTD = :utd
      `,
        {
          replacements: {
            utd: existing.UTD,
            newLocStr: remainingLocs.join(","),
            user,
          },
          transaction: t,
        }
      );
    }
  }
}

exports.saveAttendancePolicy = async function (req, res) {
  let sequelize;
  let t;

  try {
    console.log('📝 Save Attendance Policy called');

    const formData = req.body.formData || {};
    const user = req.headers.name || 'SYSTEM';
    const companyCode = req.headers.compcode;

    // Validate
    if (!companyCode) {
      return res.status(400).json({ success: false, message: "Company code is required" });
    }

    if (!formData.policyName) {
      return res.status(400).json({ success: false, message: "Policy Name is required" });
    }

    if (!formData.effectiveFrom || !formData.effectiveTo) {
      return res.status(400).json({ success: false, message: "Effective dates are required" });
    }

    if (formData.effectiveFrom > formData.effectiveTo) {
      const tmp = formData.effectiveFrom;
      formData.effectiveFrom = formData.effectiveTo;
      formData.effectiveTo = tmp;
    }

    if (!formData.shiftCode) {
      return res.status(400).json({ success: false, message: "Shift is required" });
    }

    if (!formData.location || formData.location.length === 0) {
      return res.status(400).json({ success: false, message: "At least one location is required" });
    }

    // Validate status rules have at least P and HLF
    const statusRules = formData.statusRules || [];
    const hasP = statusRules.some(r => r.Desc === 'P');
    const hasHLF = statusRules.some(r => r.Desc === 'HLF');

    if (!hasP || !hasHLF) {
      return res.status(400).json({
        success: false,
        message: "P (Present) and HLF (Half Day) rules are required"
      });
    }

    // Validate unique priority codes
    const priorityCodes = statusRules
      .filter(rule => rule.Priority_Code && rule.Priority_Code.trim() !== '')
      .map(rule => rule.Priority_Code);

    const uniquePriorities = new Set(priorityCodes);
    if (priorityCodes.length !== uniquePriorities.size) {
      return res.status(400).json({
        success: false,
        message: "Each status rule must have a unique Priority Code"
      });
    }

    sequelize = await dbname(req, companyCode);
    t = await sequelize.transaction();

    // Auto-resolve overlapping active policies for same location & employee_types
    // (Old overlapping policy is automatically archived so only 1 policy stays active per location & employee_type)
    await handlePolicyOverlap(sequelize, t, {
      policyId: null,
      companyCode,
      locations: formData.location || [],
      employeeTypes: formData.employeeTypes || [],
      effectiveFrom: formData.effectiveFrom,
      effectiveTo: formData.effectiveTo,
      user,
    });



    // Convert predefined rules to JSON string
    const predefinedRulesJSON = JSON.stringify(formData.predefinedRules || []);

    // INSERT Query - using the correct parent table name
    const insertQuery = `
INSERT INTO attendance_policies_table (
    company_code,
    policy_name,
    description,
    is_active,
    effective_from,
    effective_to,
    location,
    employee_types,
    shift_code,
    shift_type,
    break_duration,
    break_type,
    working_hours,
    weekly_working_days,
    overtime_allowed,
    overtime_rate,
    max_overtime_per_day,
    max_overtime_per_month,
    overtime_compensatory_off,
    comp_off_validity_days,
    max_comp_off_balance,
    minimum_hours_for_comp_off,
    missing_punch_allowed,
    regularization_allowed,
    regularization_period,
    regularization_max_days,
    regularization_document_required,
    weekly_off_pattern,
    weekly_off_days,
    weekly_off_alternative,
    weekly_off_compensatory,
    enable_sandwich_policy,
    holiday_list,
    enable_geo_fence,
    allowed_radius,
    latitude,
    longitude,
    allow_mobile_punch,
    allow_web_punch,
    allow_biometric_punch,
    allow_face_recognition,
    attendance_source_priority,
    predefined_rules,
    created_by,
    created_at,
    export_type
)
OUTPUT INSERTED.UTD
VALUES (
    '${companyCode}',
    '${formData.policyName.replace(/'/g, "''")}',
    ${formData.description ? `'${formData.description.replace(/'/g, "''")}'` : 'NULL'},
    1,
    '${formData.effectiveFrom}',
    '${formData.effectiveTo}',
    '${(formData.location || []).join(',')}',
    '${(formData.employeeTypes || []).join(',')}',
    '${formData.shiftCode || ''}',
    '${formData.shiftType || ''}',
    ${formData.breakDuration ? `'${formData.breakDuration}'` : 'NULL'},
    '${formData.breakType || ''}',
    ${formData.workingHours ? `'${formData.workingHours}'` : 'NULL'},
    '${(formData.weeklyWorkingDays || []).join(',')}',
    ${formData.overtimeAllowed ? 1 : 0},
    ${formData.overtimeRate ? `'${formData.overtimeRate}'` : 'NULL'},
    ${formData.maxOvertimePerDay ? `'${formData.maxOvertimePerDay}'` : 'NULL'},
    ${formData.maxOvertimePerMonth ? `'${formData.maxOvertimePerMonth}'` : 'NULL'},
    ${formData.overtimeCompensatoryOff ? 1 : 0},
    ${formData.compOffValidityDays ? `'${formData.compOffValidityDays}'` : 'NULL'},
    ${formData.maxCompOffBalance ? `'${formData.maxCompOffBalance}'` : 'NULL'},
    ${formData.minimumHoursForCompOff ? `'${formData.minimumHoursForCompOff}'` : 'NULL'},
    ${formData.missingPunchAllowed ? 1 : 0},
    ${formData.regularizationAllowed ? 1 : 0},
    ${formData.regularizationPeriod ? `'${formData.regularizationPeriod}'` : 'NULL'},
    ${formData.regularizationMaxDays ? `'${formData.regularizationMaxDays}'` : 'NULL'},
    ${formData.regularizationDocumentRequired ? 1 : 0},
    '${formData.weeklyOffPattern || ''}',
    '${(formData.weeklyOffDays || []).join(',')}',
    ${formData.weeklyOffAlternative ? 1 : 0},
    ${formData.weeklyOffCompensatory ? 1 : 0},
    ${formData.enableSandwichPolicy ? 1 : 0},
    '${(formData.holidayList || []).join(',')}',
    ${formData.enableGeoFence ? 1 : 0},
    ${formData.allowedRadius ? `'${formData.allowedRadius}'` : 'NULL'},
    '${formData.latitude || ''}',
    '${formData.longitude || ''}',
    ${formData.allowMobilePunch ? 1 : 0},
    ${formData.allowWebPunch ? 1 : 0},
    ${formData.allowBiometricPunch ? 1 : 0},
    ${formData.allowFaceRecognition ? 1 : 0},
    '${formData.attendanceSourcePriority || ''}',
    '${predefinedRulesJSON.replace(/'/g, "''")}',
    '${user}',
    GETDATE(),
    1
)
`;

    const [policyResult] = await sequelize.query(insertQuery, {
      transaction: t
    });

    const policyUTD = policyResult[0].UTD;

    console.log("Inserted Policy UTD:", policyUTD);



    // ===== INSERT STATUS RULES =====
    if (statusRules.length > 0) {
      const [cols] = await sequelize.query(`
        SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'attendance_status_rules_table'
      `, { transaction: t });
      const colNames = cols.map(c => c.COLUMN_NAME.toLowerCase());
      const earlyCol = colNames.includes('early_go') ? 'early_go' : (colNames.includes('early_') ? 'early_' : 'early_go');
      const hasPresentVal = colNames.includes('presentvalue');
      const hasAbsentVal = colNames.includes('absentvalue');

      const statusRulesValues = statusRules.map(rule => {
        const desc = (rule.Desc || '').replace(/'/g, "''");
        const region = (rule.Region || '').replace(/'/g, "''");
        const absent = (rule.ABSENT || '').replace(/'/g, "''");
        const wef = rule.WEF || new Date().toISOString().split('T')[0];
        const presentValSql = (rule.PresentValue != null && rule.PresentValue !== '') ? Number(rule.PresentValue) : 'NULL';
        const absentValSql = (rule.AbsentValue != null && rule.AbsentValue !== '') ? Number(rule.AbsentValue) : 'NULL';

        return `(
          ${policyUTD},
          '${companyCode}',
          '${desc}',
          ${rule.Early_Go ? `'${rule.Early_Go}'` : 'NULL'},
          ${rule.Late_Come ? `'${rule.Late_Come}'` : 'NULL'},
          ${rule.Allow_Days ? `'${rule.Allow_Days}'` : 'NULL'},
          ${rule.Priority_Code ? `'${rule.Priority_Code}'` : 'NULL'},
          '${region}',
          ${hasPresentVal ? presentValSql + ',' : ''}
          ${hasAbsentVal ? absentValSql + ',' : ''}
          '${wef}',
          '${absent}',
          '${user}',
          GETDATE(),
          1
        )`;
      });

      const extraCols = [];
      if (hasPresentVal) extraCols.push('PresentValue');
      if (hasAbsentVal) extraCols.push('AbsentValue');
      const extraColsSql = extraCols.length > 0 ? extraCols.join(',') + ',' : '';

      const insertStatusRulesQuery = `
        INSERT INTO attendance_status_rules_table (
          policy_utd,
          company_code,
          [desc_code],
          [${earlyCol}],
          late_come,
          allow_days,
          priority_code,
          region,
          ${extraColsSql}
          wef,
          absent,
          created_by,
          created_at,
          export_type
        ) VALUES ${statusRulesValues.join(',')}
      `;

      await sequelize.query(insertStatusRulesQuery, { transaction: t });
    }

    await t.commit();

    return res.status(200).json({
      success: true,
      message: "Attendance Policy saved successfully",
      data: { UTD: policyUTD }
    });

  } catch (error) {
    console.error("❌ Error in saveAttendancePolicy:", error);
    try {
      if (t && !t.finished) await t.rollback();
    } catch (rbErr) {
      console.error("Rollback error:", rbErr.message);
    }
    const errorMessage = error?.parent?.message || error?.original?.message || error?.message || "Internal server error";
    return res.status(500).json({
      success: false,
      message: "Failed to save attendance policy",
      error: errorMessage
    });
  } finally {
    if (sequelize) await sequelize.close();
  }
};

exports.updateAttendancePolicy = async function (req, res) {
  let sequelize;
  let t;

  try {
    console.log("📝 Update Attendance Policy called");

    const formData = req.body.formData || {};
    const user = req.headers.name || "SYSTEM";
    const companyCode = req.headers.compcode;
    const policyId = req.body.policyId || formData.UTD;

    if (!policyId) {
      return res.status(400).json({
        success: false,
        message: "Policy ID is required",
      });
    }

    if (!companyCode) {
      return res.status(400).json({
        success: false,
        message: "Company code is required",
      });
    }

    // Validate status rules
    const statusRules = formData.statusRules || [];

    const hasP = statusRules.some((r) => r.Desc === "P");
    const hasHLF = statusRules.some((r) => r.Desc === "HLF");

    if (!hasP || !hasHLF) {
      return res.status(400).json({
        success: false,
        message: "P (Present) and HLF (Half Day) rules are required",
      });
    }

    if (formData.effectiveFrom && formData.effectiveTo && formData.effectiveFrom > formData.effectiveTo) {
      const tmp = formData.effectiveFrom;
      formData.effectiveFrom = formData.effectiveTo;
      formData.effectiveTo = tmp;
    }

    sequelize = await dbname(req, companyCode);
    t = await sequelize.transaction();

    // Auto-resolve overlapping active policies for same location & employee_types
    await handlePolicyOverlap(sequelize, t, {
      policyId,
      companyCode,
      locations: formData.location || [],
      employeeTypes: formData.employeeTypes || [],
      effectiveFrom: formData.effectiveFrom,
      effectiveTo: formData.effectiveTo,
      user,
    });

    // ==========================================
    // MARK OLD PARENT RECORD AS 33
    // ==========================================

    await sequelize.query(
      `
      UPDATE attendance_policies_table
      SET
          export_type = 33,
          updated_by = '${user}',
          updated_at = GETDATE()
      WHERE UTD = ${policyId}
        AND company_code = '${companyCode}'
      `,
      { transaction: t }
    );

    // ==========================================
    // MARK OLD CHILD RECORDS AS 33
    // ==========================================

    await sequelize.query(
      `
      UPDATE attendance_status_rules_table
      SET export_type = 33
      WHERE policy_utd = ${policyId}
        AND company_code = '${companyCode}'
      `,
      { transaction: t }
    );

    // ==========================================
    // INSERT NEW PARENT RECORD
    // ==========================================

    const predefinedRulesJSON = JSON.stringify(
      formData.predefinedRules || []
    );

    const insertQuery = `
    INSERT INTO attendance_policies_table (
        company_code,
        policy_name,
        description,
        is_active,
        effective_from,
        effective_to,
        location,
        employee_types,
        shift_code,
        shift_type,
        break_duration,
        break_type,
        working_hours,
        weekly_working_days,
        overtime_allowed,
        overtime_rate,
        max_overtime_per_day,
        max_overtime_per_month,
        overtime_compensatory_off,
        comp_off_validity_days,
        max_comp_off_balance,
        minimum_hours_for_comp_off,
        missing_punch_allowed,
        regularization_allowed,
        regularization_period,
        regularization_max_days,
        regularization_document_required,
        weekly_off_pattern,
        weekly_off_days,
        weekly_off_alternative,
        weekly_off_compensatory,
        enable_sandwich_policy,
        holiday_list,
        enable_geo_fence,
        allowed_radius,
        latitude,
        longitude,
        allow_mobile_punch,
        allow_web_punch,
        allow_biometric_punch,
        allow_face_recognition,
        attendance_source_priority,
        predefined_rules,
        created_by,
        created_at,
        export_type
    )
    OUTPUT INSERTED.UTD
    VALUES (
        '${companyCode}',
        '${formData.policyName.replace(/'/g, "''")}',
        ${formData.description
        ? `'${formData.description.replace(/'/g, "''")}'`
        : "NULL"
      },
        1,
        '${formData.effectiveFrom}',
        '${formData.effectiveTo}',
        '${(formData.location || []).join(",")}',
        '${(formData.employeeTypes || []).join(",")}',
        '${formData.shiftCode || ""}',
        '${formData.shiftType || ""}',
        ${formData.breakDuration
        ? `'${formData.breakDuration}'`
        : "NULL"
      },
        '${formData.breakType || ""}',
        ${formData.workingHours
        ? `'${formData.workingHours}'`
        : "NULL"
      },
        '${(formData.weeklyWorkingDays || []).join(",")}',
        ${formData.overtimeAllowed ? 1 : 0},
        ${formData.overtimeRate
        ? `'${formData.overtimeRate}'`
        : "NULL"
      },
        ${formData.maxOvertimePerDay
        ? `'${formData.maxOvertimePerDay}'`
        : "NULL"
      },
        ${formData.maxOvertimePerMonth
        ? `'${formData.maxOvertimePerMonth}'`
        : "NULL"
      },
        ${formData.overtimeCompensatoryOff ? 1 : 0},
        ${formData.compOffValidityDays
        ? `'${formData.compOffValidityDays}'`
        : "NULL"
      },
        ${formData.maxCompOffBalance
        ? `'${formData.maxCompOffBalance}'`
        : "NULL"
      },
        ${formData.minimumHoursForCompOff
        ? `'${formData.minimumHoursForCompOff}'`
        : "NULL"
      },
        ${formData.missingPunchAllowed ? 1 : 0},
        ${formData.regularizationAllowed ? 1 : 0},
        ${formData.regularizationPeriod
        ? `'${formData.regularizationPeriod}'`
        : "NULL"
      },
        ${formData.regularizationMaxDays
        ? `'${formData.regularizationMaxDays}'`
        : "NULL"
      },
        ${formData.regularizationDocumentRequired ? 1 : 0},
        '${formData.weeklyOffPattern || ""}',
        '${(formData.weeklyOffDays || []).join(",")}',
        ${formData.weeklyOffAlternative ? 1 : 0},
        ${formData.weeklyOffCompensatory ? 1 : 0},
        ${formData.enableSandwichPolicy ? 1 : 0},
        '${(formData.holidayList || []).join(",")}',
        ${formData.enableGeoFence ? 1 : 0},
        ${formData.allowedRadius
        ? `'${formData.allowedRadius}'`
        : "NULL"
      },
        '${formData.latitude || ""}',
        '${formData.longitude || ""}',
        ${formData.allowMobilePunch ? 1 : 0},
        ${formData.allowWebPunch ? 1 : 0},
        ${formData.allowBiometricPunch ? 1 : 0},
        ${formData.allowFaceRecognition ? 1 : 0},
        '${formData.attendanceSourcePriority || ""}',
        '${predefinedRulesJSON.replace(/'/g, "''")}',
        '${user}',
        GETDATE(),
        1
    )
    `;

    const [policyResult] = await sequelize.query(insertQuery, {
      transaction: t,
    });

    const newPolicyUTD = policyResult[0].UTD;

    // ==========================================
    // INSERT NEW STATUS RULES
    // ==========================================

    if (statusRules.length > 0) {
      const [cols] = await sequelize.query(`
        SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'attendance_status_rules_table'
      `, { transaction: t });
      const colNames = cols.map(c => c.COLUMN_NAME.toLowerCase());
      const earlyCol = colNames.includes('early_go') ? 'early_go' : (colNames.includes('early_') ? 'early_' : 'early_go');
      const hasPresentVal = colNames.includes('presentvalue');
      const hasAbsentVal = colNames.includes('absentvalue');

      const statusRulesValues = statusRules.map((rule) => {
        const desc = (rule.Desc || "").replace(/'/g, "''");
        const region = (rule.Region || "").replace(/'/g, "''");
        const absent = (rule.ABSENT || "").replace(/'/g, "''");
        const wef = rule.WEF || new Date().toISOString().split("T")[0];
        const presentValSql = (rule.PresentValue != null && rule.PresentValue !== '') ? Number(rule.PresentValue) : 'NULL';
        const absentValSql = (rule.AbsentValue != null && rule.AbsentValue !== '') ? Number(rule.AbsentValue) : 'NULL';

        return `(
          ${newPolicyUTD},
          '${companyCode}',
          '${desc}',
          ${rule.Early_Go
            ? `'${rule.Early_Go}'`
            : "NULL"
          },
          ${rule.Late_Come
            ? `'${rule.Late_Come}'`
            : "NULL"
          },
          ${rule.Allow_Days
            ? `'${rule.Allow_Days}'`
            : "NULL"
          },
          ${rule.Priority_Code
            ? `'${rule.Priority_Code}'`
            : "NULL"
          },
          '${region}',
          ${hasPresentVal ? presentValSql + ',' : ''}
          ${hasAbsentVal ? absentValSql + ',' : ''}
          '${wef}',
          '${absent}',
          '${user}',
          GETDATE(),
          1
        )`;
      });

      const extraCols = [];
      if (hasPresentVal) extraCols.push('PresentValue');
      if (hasAbsentVal) extraCols.push('AbsentValue');
      const extraColsSql = extraCols.length > 0 ? extraCols.join(',') + ',' : '';

      const insertStatusRulesQuery = `
        INSERT INTO attendance_status_rules_table (
          policy_utd,
          company_code,
          desc_code,
          [${earlyCol}],
          late_come,
          allow_days,
          priority_code,
          region,
          ${extraColsSql}
          wef,
          absent,
          created_by,
          created_at,
          export_type
        )
        VALUES ${statusRulesValues.join(",")}
      `;

      await sequelize.query(insertStatusRulesQuery, {
        transaction: t,
      });
    }

    await t.commit();

    return res.status(200).json({
      success: true,
      message: "Attendance Policy updated successfully",
      data: {
        UTD: newPolicyUTD,
      },
    });
  } catch (error) {
    console.error("❌ Error in updateAttendancePolicy:", error);

    try {
      if (t && !t.finished) {
        await t.rollback();
      }
    } catch (rbErr) {
      console.error("Rollback error:", rbErr.message);
    }

    const errorMessage = error?.parent?.message || error?.original?.message || error?.message || "Internal server error";
    return res.status(500).json({
      success: false,
      message: "Failed to update attendance policy",
      error: errorMessage,
    });
  } finally {
    if (sequelize) {
      await sequelize.close();
    }
  }
};

exports.getAttendancePolicyById = async function (req, res) {
  let sequelize;
  try {
    const companyCode = req.headers.compcode;
    const { policyId } = req.body;

    if (!companyCode) {
      return res.status(400).json({ success: false, message: "Company code is required" });
    }

    if (!policyId) {
      return res.status(400).json({ success: false, message: "Policy ID is required" });
    }

    sequelize = await dbname(req, companyCode);

    // Get policy details
    const query = `
      SELECT
        UTD,
        company_code,
        policy_name as policyName,
        description,
        is_active as isActive,
        effective_from as effectiveFrom,
        effective_to as effectiveTo,
        location as location,
        employee_types as employeeTypes,
        shift_code as shiftCode,
        shift_type as shiftType,
        break_duration as breakDuration,
        break_type as breakType,
        working_hours as workingHours,
        weekly_working_days as weeklyWorkingDays,
        overtime_allowed as overtimeAllowed,
        overtime_rate as overtimeRate,
        max_overtime_per_day as maxOvertimePerDay,
        max_overtime_per_month as maxOvertimePerMonth,
        overtime_compensatory_off as overtimeCompensatoryOff,
        comp_off_validity_days as compOffValidityDays,
        max_comp_off_balance as maxCompOffBalance,
        minimum_hours_for_comp_off as minimumHoursForCompOff,
        missing_punch_allowed as missingPunchAllowed,
        regularization_allowed as regularizationAllowed,
        regularization_period as regularizationPeriod,
        regularization_max_days as regularizationMaxDays,
        regularization_document_required as regularizationDocumentRequired,
        weekly_off_pattern as weeklyOffPattern,
        weekly_off_days as weeklyOffDays,
        weekly_off_alternative as weeklyOffAlternative,
        weekly_off_compensatory as weeklyOffCompensatory,
        enable_sandwich_policy as enableSandwichPolicy,
        holiday_list as holidayList,
        enable_geo_fence as enableGeoFence,
        allowed_radius as allowedRadius,
        latitude,
        longitude,
        allow_mobile_punch as allowMobilePunch,
        allow_web_punch as allowWebPunch,
        allow_biometric_punch as allowBiometricPunch,
        allow_face_recognition as allowFaceRecognition,
        attendance_source_priority as attendanceSourcePriority,
        predefined_rules as predefinedRules
      FROM attendance_policies_table
      WHERE UTD = ${policyId}
      AND company_code = '${companyCode}'
      AND (export_type IS NULL OR export_type < 3)
    `;

    const [policies] = await sequelize.query(query);

    if (!policies || policies.length === 0) {
      await sequelize.close();
      return res.status(404).json({
        success: false,
        message: "Policy not found"
      });
    }

    const policy = policies[0];

    // Get status rules
    const [cols] = await sequelize.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'attendance_status_rules_table'
    `);
    const colNames = cols.map(c => c.COLUMN_NAME.toLowerCase());
    const earlyCol = colNames.includes('early_go') ? 'early_go' : (colNames.includes('early_') ? 'early_' : 'early_go');
    const hasPresentVal = colNames.includes('presentvalue');
    const hasAbsentVal = colNames.includes('absentvalue');

    const statusRulesQuery = `
      SELECT
        [desc_code] AS [Desc],
        [${earlyCol}] AS Early_Go,
        late_come AS Late_Come,
        allow_days AS Allow_Days,
        priority_code AS Priority_Code,
        region AS Region,
        ${hasPresentVal ? 'PresentValue,' : ''}
        ${hasAbsentVal ? 'AbsentValue,' : ''}
        wef AS WEF,
        absent AS ABSENT
      FROM attendance_status_rules_table
      WHERE policy_utd = ${policyId}
      AND (export_type IS NULL OR export_type < 3)
      ORDER BY priority_code
    `;

    const [statusRules] = await sequelize.query(statusRulesQuery);
    policy.statusRules = statusRules || [];

    // Parse predefined rules
    if (policy.predefinedRules) {
      try {
        policy.predefinedRules = JSON.parse(policy.predefinedRules);
      } catch (e) {
        policy.predefinedRules = policy.predefinedRules.split(',').filter(Boolean);
      }
    } else {
      policy.predefinedRules = [];
    }

    // Parse string fields to arrays
    if (policy.location && typeof policy.location === 'string') {
      policy.location = policy.location.split(',').filter(Boolean);
    }
    if (policy.employeeTypes && typeof policy.employeeTypes === 'string') {
      policy.employeeTypes = policy.employeeTypes.split(',').filter(Boolean);
    }
    if (policy.weeklyWorkingDays && typeof policy.weeklyWorkingDays === 'string') {
      policy.weeklyWorkingDays = policy.weeklyWorkingDays.split(',').filter(Boolean);
    }
    if (policy.weeklyOffDays && typeof policy.weeklyOffDays === 'string') {
      policy.weeklyOffDays = policy.weeklyOffDays.split(',').filter(Boolean);
    }
    if (policy.holidayList && typeof policy.holidayList === 'string') {
      policy.holidayList = policy.holidayList.split(',').filter(Boolean);
    }

    await sequelize.close();

    return res.status(200).json({
      success: true,
      data: policy
    });

  } catch (error) {
    console.error("Error in getAttendancePolicyById:", error);
    if (sequelize) await sequelize.close();
    return res.status(500).json({
      success: false,
      message: "Failed to fetch attendance policy",
      error: error.message,
    });
  } finally {
    if (sequelize) await sequelize.close();
  }
};

exports.getAttendancePolicies = async function (req, res) {
  let sequelize;

  try {
    console.log('📝 Get All Attendance Policies called');
    const companyCode = req.headers.compcode;

    if (!companyCode) {
      return res.status(400).json({ success: false, message: "Company code is required" });
    }

    sequelize = await dbname(req, companyCode);

    const query = `
      SELECT
        UTD as id,
        policy_name as policyName,
        shift_type as shiftType,
        effective_from as startDate,
        effective_to as endDate,
        CASE
          WHEN is_active = 1 THEN 'active'
          ELSE 'inactive'
        END as status,
        0 as assignedEmployees
      FROM attendance_policies_table
      WHERE company_code = '${companyCode}'
      AND (export_type IS NULL OR export_type < 3)
      ORDER BY created_at DESC
    `;

    const [policies] = await sequelize.query(query);
    await sequelize.close();

    return res.status(200).json({
      success: true,
      data: policies
    });

  } catch (error) {
    console.error("❌ Error in getAttendancePolicies:", error);
    if (sequelize) await sequelize.close();
    return res.status(500).json({
      success: false,
      message: "Failed to get attendance policies",
      error: error.message
    });
  } finally {
    if (sequelize) await sequelize.close();
  }
};

exports.deleteAttendancePolicy = async function (req, res) {
  let sequelize;
  let t;

  try {
    console.log('🗑️ Delete Attendance Policy called');
    const { policyId } = req.body;
    const user = req.headers.name || 'SYSTEM';
    const companyCode = req.headers.compcode;

    if (!policyId) {
      return res.status(400).json({ success: false, message: "Policy ID is required" });
    }

    if (!companyCode) {
      return res.status(400).json({ success: false, message: "Company code is required" });
    }

    sequelize = await dbname(req, companyCode);
    t = await sequelize.transaction();

    // First check if policy exists
    const checkQuery = `
      SELECT UTD, policy_name
      FROM attendance_policies_table
      WHERE UTD = ${policyId}
      AND company_code = '${companyCode}'
      AND (export_type IS NULL OR export_type < 3)
    `;

    const [existing] = await sequelize.query(checkQuery, { transaction: t });

    if (!existing || existing.length === 0) {
      await t.rollback();
      await sequelize.close();
      return res.status(404).json({
        success: false,
        message: "Policy not found or already deleted"
      });
    }

    // Soft delete - set export_type = 33
    const deleteQuery = `
      UPDATE attendance_policies_table SET
        export_type = 33,
        is_active = 0,
        updated_by = '${user}',
        updated_at = GETDATE()
      WHERE UTD = ${policyId}
      AND company_code = '${companyCode}'
    `;

    await sequelize.query(deleteQuery, { transaction: t });

    // Also soft delete status rules
    await sequelize.query(
      `UPDATE attendance_status_rules_table SET
        updated_by = '${user}',
        updated_at = GETDATE()
      WHERE policy_utd = ${policyId} AND (export_type IS NULL OR export_type < 3)`
      ,
      { transaction: t }
    );

    await t.commit();
    await sequelize.close();

    return res.status(200).json({
      success: true,
      message: "Attendance Policy deleted successfully",
      data: {
        UTD: policyId,
        policyName: existing[0].policy_name
      }
    });

  } catch (error) {
    console.error("❌ Error in deleteAttendancePolicy:", error);
    if (t) await t.rollback();
    if (sequelize) await sequelize.close();
    return res.status(500).json({
      success: false,
      message: "Failed to delete attendance policy",
      error: error.message
    });
  } finally {
    if (sequelize) await sequelize.close();
  }
};

exports.getAttendancePolicyHistory = async function (req, res) {
  let sequelize;

  try {
    const companyCode = req.headers.compcode;
    const { policyId } = req.body;

    if (!companyCode) {
      return res.status(400).json({
        success: false,
        message: "Company code is required"
      });
    }

    if (!policyId) {
      return res.status(400).json({
        success: false,
        message: "Policy ID is required"
      });
    }

    sequelize = await dbname(req, companyCode);

    // Get current policy name
    const [policyRow] = await sequelize.query(`
        SELECT policy_name
        FROM attendance_policies_table
        WHERE UTD = ${policyId}
    `);

    if (policyRow.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Policy not found"
      });
    }

    const policyName = policyRow[0].policy_name;

    // Fetch all versions
    const [rows] = await sequelize.query(`
        SELECT *
        FROM attendance_policies_table
        WHERE company_code='${companyCode}'
        AND policy_name='${policyName.replace(/'/g, "''")}'
        ORDER BY Created_At ASC
    `);

    const result = [];

    for (let i = 0; i < rows.length - 1; i++) {

      const previous = rows[i];
      const current = rows[i + 1];

      let changes = {};

      Object.keys(current).forEach((key) => {

        if (
          previous[key] != current[key] &&
          ![
            'UTD',
            'Created_By',
            'Created_At',
            'Updated_By',
            'Updated_At',
            'ValidFrom',
            'ValidTo',
            'export_type'
          ].includes(key)
        ) {

          changes[key] = {
            old: previous[key],
            new: current[key]
          };
        }

      });

      if (Object.keys(changes).length > 0) {

        result.push({
          updated_by:
            current.Updated_By ||
            current.Created_By ||
            'SYSTEM',

          updated_at:
            current.Updated_At ||
            current.Created_At,

          changes
        });

      }
    }

    result.reverse();

    await sequelize.close();

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {

    console.log(error);

    if (sequelize) await sequelize.close();

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


exports.findAll = async function (req, res) {
  const sequelize = await dbname(req, req.headers.compcode);
  try {
    const branch = req.body.branch; // e.g. could be 2, or [2,3], etc.
    console.log(req.body, "branchbranchbranch");

    let branchCondition = "";

    // ✅ If branch is provided and not empty, add condition
    if (branch) {
      const locationQuery = `
      select Misc_Code from Misc_Mst where Misc_Type  = 85 and Misc_HOD in (${branch})`;
      console.log(locationQuery, "locationQuery");
      const [results] = await sequelize.query(locationQuery);

      const miscCodes = results.map((row) => row.Misc_Code).join(",");

      branchCondition = ` AND LOCATION IN (${miscCodes})`;
    }

    // Build your main query dynamically
    const query = `
      SELECT
        [EMPCODE] AS [value],
        CONCAT(EMPCODE, ' ', EMPFIRSTNAME, ' ', EMPLASTNAME) AS [label]
      FROM [dbo].[EMPLOYEEMASTER] AS [Employeemaster]
      WHERE export_type < 3
       
        ${branchCondition}
    `;

    console.log(query, "final query >>>>");

    const data = await sequelize.query(query);

    const Location = await sequelize.query(`
      SELECT
        CAST(Misc_Code AS VARCHAR) AS value,
        Misc_Name AS label  
      FROM Misc_Mst
      WHERE misc_type = 85
        AND export_type < 3;
    `);

    if (!data) {
      return res.status(500).send({ success: false, message: "No data found" });
    }

    return res.status(200).send({
      success: true,
      data: data[0],
      Location: Location[0],
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({ success: false, message: e.message });
  } finally {
    await sequelize.close();
  }
};


exports.getShifts = async function (req, res) {
  const sequelize = await dbname(req, req.headers.compcode);
  try {
    const compCode = req.headers.compcode;

    // Fetch Shifts (Misc_Type = 90)
    let shiftsQuery = `
      SELECT
        Misc_Code,
        MISC_NAME,
        Misc_Add1,
        Misc_Add2
      FROM Misc_Mst
      WHERE Misc_Type = 90
        AND EXPORT_TYPE = 1
    `;

    // Fetch Regions (Misc_Type = 91)
    let regionsQuery = `
      SELECT
        Misc_Code,
        MISC_NAME,
        Misc_Add1,
        Misc_Add2
      FROM Misc_Mst
      WHERE Misc_Type = 91
        AND EXPORT_TYPE = 1
    `;

    const shifts = await sequelize.query(shiftsQuery);
    const regions = await sequelize.query(regionsQuery);

    return res.status(200).send({
      success: true,
      data: shifts[0] || [],
      regions: regions[0] || [],
      message: "Data fetched successfully"
    });

  } catch (e) {
    console.log("Error in getShifts:", e);
    res.status(500).send({
      success: false,
      message: e.message
    });
  } finally {
    await sequelize.close();
  }
};

exports.checkPolicyExists = async function (req, res) {
  let sequelize;
  try {
    const companyCode = req.headers.compcode;
    const { locations = [], employeeTypes = [], policyId = null } = req.body;

    if (!companyCode) {
      return res.status(400).json({ success: false, message: "Company code is required" });
    }

    const normLocs = (Array.isArray(locations) ? locations : String(locations || "").split(","))
      .map((l) => String(l).trim())
      .filter(Boolean);
    const normTypes = (Array.isArray(employeeTypes) ? employeeTypes : String(employeeTypes || "").split(","))
      .map((t) => String(t).trim().toLowerCase())
      .filter(Boolean);

    if (normLocs.length === 0 || normTypes.length === 0) {
      return res.status(200).json({
        success: true,
        exists: false,
        conflicts: [],
        conflictingLocations: [],
        locationLabels: [],
        message: "",
      });
    }

    sequelize = await dbname(req, companyCode);

    const [existingPolicies] = await sequelize.query(
      `
      SELECT UTD, policy_name, location, employee_types, effective_from, effective_to
      FROM attendance_policies_table
      WHERE company_code = :companyCode
        AND ISNULL(export_type, 0) < 3
        AND is_active = 1
        AND (:policyId IS NULL OR UTD != :policyId)
    `,
      {
        replacements: {
          companyCode,
          policyId: policyId ? Number(policyId) : null,
        },
      }
    );

    const conflicts = [];
    const allCommonLocs = new Set();

    for (const existing of existingPolicies) {
      const existLocs = (existing.location || "")
        .split(",")
        .map((l) => l.trim())
        .filter(Boolean);
      const existTypes = (existing.employee_types || "")
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      const overlapLocs = normLocs.filter((loc) => existLocs.includes(loc));
      if (overlapLocs.length === 0) continue;

      // Check employee types overlap only against selected types
      const matchedTypes = normTypes.filter((t) => existTypes.includes(t));
      if (matchedTypes.length === 0) continue;

      overlapLocs.forEach((l) => allCommonLocs.add(l));

      conflicts.push({
        policyId: existing.UTD,
        policyName: existing.policy_name,
        locations: overlapLocs,
        employeeTypes: matchedTypes,
        effectiveFrom: existing.effective_from,
        effectiveTo: existing.effective_to,
      });
    }

    let locationLabels = [...allCommonLocs];
    if (locationLabels.length > 0) {
      try {
        const [locNames] = await sequelize.query(
          `
          SELECT Misc_Code, Misc_Name FROM Misc_Mst
          WHERE Misc_Type = 85 AND Misc_Code IN (:locCodes)
        `,
          { replacements: { locCodes: locationLabels } }
        );
        if (locNames && locNames.length > 0) {
          const map = new Map(
            locNames.map((r) => [String(r.Misc_Code), r.Misc_Name])
          );
          locationLabels = locationLabels.map((code) =>
            map.has(code) ? `${map.get(code)} (${code})` : code
          );
        }
      } catch (e) {
        // fallback
      }
    }

    await sequelize.close();

    const exists = conflicts.length > 0;
    let message = "";
    if (exists) {
      const p = conflicts[0];
      message = `Active policy "${p.policyName}"  already exists for Location [${locationLabels.join(", ")}] with Employee Type [${p.employeeTypes.join(", ")}].`;
    }

    return res.status(200).json({
      success: true,
      exists,
      conflicts,
      conflictingLocations: [...allCommonLocs],
      locationLabels,
      message,
    });
  } catch (error) {
    if (sequelize) await sequelize.close();
    console.error("❌ Error in checkPolicyExists:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to check policy existence",
      error: error.message,
    });
  }
};
