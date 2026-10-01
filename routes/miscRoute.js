// controllers/miscController.js
const { QueryTypes } = require("sequelize");
const { dbname } = require("../utils/dbconfig");

const compcode = process.env.DEFAULT_COMP_CODE

exports.getMiscData = async function (req, res) {
    let sequelize;
    try {
        sequelize = await dbname(req, compcode);
        const query = req.query || {};
        const params = req.params || {};

        const Misc_Type = parseInt(params.Misc_Type || query.Misc_Type);

        if (!Misc_Type || isNaN(Misc_Type) || Misc_Type <= 0) {
            return res.status(400).send({
                success: false,
                message: "Misc_Type is required and must be a valid positive number",
            });
        }

        // ── Step 1: Actual columns fetch karo ─────────────────
        const columnInfo = await sequelize.query(
            `SELECT 
                COLUMN_NAME  AS ColumnName,
                DATA_TYPE    AS DataType,
                CHARACTER_MAXIMUM_LENGTH AS MaxLength,
                IS_NULLABLE  AS IsNullable
             FROM INFORMATION_SCHEMA.COLUMNS
             WHERE TABLE_SCHEMA = 'dbo'
               AND TABLE_NAME   = 'Default_Mst'
             ORDER BY ORDINAL_POSITION`,
            { type: QueryTypes.SELECT }
        );

        if (!columnInfo || columnInfo.length === 0) {
            return res.status(404).send({
                success: false,
                message: "Default_Mst table not found or has no columns",
            });
        }

        const hasExportType = columnInfo.some(
            (c) => c.ColumnName.toLowerCase() === "export_type"
        );

        // ── Step 2: Dynamic SELECT ─────────────────────────────
        const selectCols = columnInfo
            .map((c) => `[${c.ColumnName}]`)
            .join(",\n                ");

        // ── Step 3: Data fetch (Export_Type < 3 for active) ──
        const status = String(query.status || "").toLowerCase().trim();
        let exportCondition = "(Export_Type IS NULL OR Export_Type < 3)";
        if (status === "all") {
            exportCondition = "(Export_Type IS NULL OR Export_Type <= 33)";
        } else if (status === "inactive" || status === "33") {
            exportCondition = "(Export_Type = 33 OR Export_Type >= 3)";
        } else if (status === "active" || status === "1") {
            exportCondition = "(Export_Type IS NULL OR Export_Type < 3)";
        }

        const whereClause = hasExportType
            ? `WHERE Misc_Type = :Misc_Type AND ${exportCondition}`
            : `WHERE Misc_Type = :Misc_Type`;

        const records = await sequelize.query(
            `SELECT ${selectCols}
             FROM Default_Mst
             ${whereClause}
             ORDER BY Misc_Code ASC`,
            {
                replacements: { Misc_Type },
                type: QueryTypes.SELECT,
            }
        );

        return res.status(200).send({
            success: true,
            message: `Misc data fetched successfully for type ${Misc_Type}`,
            total: records.length,
            columns: columnInfo, // ✅ frontend ko columns bhi bhejo
            data: records,
        });

    } catch (error) {
        console.error("Get Misc Data Error:", error);
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    } finally {
        if (sequelize) await sequelize.close();
    }
};

exports.getMiscType = async function (req, res) {
    let sequelize;
    try {
        sequelize = await dbname(req, compcode);

        const miscTypes = await sequelize.query(
            `SELECT DISTINCT Misc_Type
             FROM Default_Mst WITH (NOLOCK)
             WHERE Misc_Type IS NOT NULL
               AND (Export_Type IS NULL OR Export_Type < 33)
             ORDER BY Misc_Type ASC`,
            {
                type: QueryTypes.SELECT,
            }
        );

        return res.status(200).send({
            success: true,
            message: "Misc Types fetched successfully",
            count: miscTypes.length,
            data: miscTypes,
        });

    } catch (error) {
        console.error("Get Misc Type Error:", error);
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    } finally {
        if (sequelize) await sequelize.close();
    }
};

// controllers/miscController.js mein add karo

exports.createMiscData = async function (req, res) {
    let sequelize;
    try {
        sequelize = await dbname(req, compcode);
        const body = req.body || {};

        const Misc_Type = parseInt(body.Misc_Type);
        if (!Misc_Type || isNaN(Misc_Type) || Misc_Type <= 0) {
            return res.status(400).send({
                success: false,
                message: "Misc_Type is required and must be a valid positive number",
            });
        }

        if (!body.Misc_Name || !String(body.Misc_Name).trim()) {
            return res.status(400).send({
                success: false,
                message: "Misc_Name is required",
            });
        }

        const Misc_Name = String(body.Misc_Name).trim();

        // ── Duplicate Misc_Name check same Misc_Type par ──────
        const duplicate = await sequelize.query(
            `SELECT TOP 1 Misc_Code 
             FROM Default_Mst 
             WHERE Misc_Type = :Misc_Type 
               AND LTRIM(RTRIM(LOWER(Misc_Name))) = LTRIM(RTRIM(LOWER(:Misc_Name)))`,
            {
                replacements: { Misc_Type, Misc_Name },
                type: QueryTypes.SELECT,
            }
        );

        if (duplicate && duplicate.length > 0) {
            return res.status(409).send({
                success: false,
                message: `"${Misc_Name}" already exists for Misc_Type ${Misc_Type}`,
            });
        }

        // ── Auto Calculate Misc_Code ──────────────────────────
        // Har Misc_Type ke liye 1 se start hoga
        const maxCode = await sequelize.query(
            `SELECT ISNULL(MAX(Misc_Code), 0) AS MaxCode
             FROM Default_Mst
             WHERE Misc_Type = :Misc_Type`,
            {
                replacements: { Misc_Type },
                type: QueryTypes.SELECT,
            }
        );

        const Misc_Code = (maxCode[0]?.MaxCode || 0) + 1;

        // ── Step 3: Dynamic columns from Default_Mst schema ──
        const defaultMstCols = await sequelize.query(
            `SELECT COLUMN_NAME
             FROM INFORMATION_SCHEMA.COLUMNS
             WHERE TABLE_SCHEMA = 'dbo'
               AND TABLE_NAME = 'Default_Mst'
               AND UPPER(COLUMN_NAME) NOT IN ('UTD')`,
            { type: QueryTypes.SELECT }
        );

        const validColMap = {};
        defaultMstCols.forEach((c) => {
            validColMap[c.COLUMN_NAME.toLowerCase()] = c.COLUMN_NAME;
        });

        const allowedFields = {
            Misc_Code,
            Misc_Type,
            Misc_Name,
        };

        if (validColMap["export_type"]) allowedFields[validColMap["export_type"]] = 1;
        if (validColMap["serverid"]) allowedFields[validColMap["serverid"]] = 1;
        if (validColMap["loc_code"]) allowedFields[validColMap["loc_code"]] = req.headers.loc_code || 1;
        if (Misc_Type === 1001 && validColMap["misc_hod"]) allowedFields[validColMap["misc_hod"]] = 10;

        // Any field in body that matches a column in Default_Mst
        Object.keys(body).forEach((key) => {
            const actualCol = validColMap[key.toLowerCase()];
            if (actualCol && !["utd", "misc_code", "misc_type", "misc_name"].includes(key.toLowerCase())) {
                if (body[key] !== undefined && body[key] !== null && body[key] !== "") {
                    allowedFields[actualCol] = body[key];
                }
            }
        });

        const cols = Object.keys(allowedFields).map((c) => `[${c}]`).join(", ");
        const vals = Object.keys(allowedFields).map((c) => `:${c}`).join(", ");

        await sequelize.query(
            `INSERT INTO Default_Mst (${cols}) VALUES (${vals})`,
            {
                replacements: allowedFields,
                type: QueryTypes.INSERT,
            }
        );

        return res.status(201).send({
            success: true,
            message: "Misc record created successfully",
            data: { Misc_Code, Misc_Type, Misc_Name },
        });

    } catch (error) {
        console.error("Create Misc Data Error:", error);
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    } finally {
        if (sequelize) await sequelize.close();
    }
};

exports.updateMiscData = async function (req, res) {
    let sequelize;
    try {
        sequelize = await dbname(req, compcode);
        const body = req.body || {};
        const query = req.query || {};
        const params = req.params || {};

        const Misc_Type = parseInt(body.Misc_Type || params.Misc_Type || query.Misc_Type);
        if (!Misc_Type || isNaN(Misc_Type) || Misc_Type <= 0) {
            return res.status(400).send({
                success: false,
                message: "Misc_Type is required and must be a valid positive number",
            });
        }

        const Misc_Code = parseInt(body.Misc_Code ?? params.Misc_Code ?? query.Misc_Code);
        const UTD = body.UTD ? parseInt(body.UTD) : null;

        if ((Misc_Code === undefined || isNaN(Misc_Code)) && !UTD) {
            return res.status(400).send({
                success: false,
                message: "Misc_Code or UTD is required to identify the record",
            });
        }

        // ── Duplicate Misc_Name check on same Misc_Type ──────
        if (body.Misc_Name !== undefined) {
            if (!String(body.Misc_Name).trim()) {
                return res.status(400).send({
                    success: false,
                    message: "Misc_Name cannot be empty",
                });
            }
            const Misc_Name = String(body.Misc_Name).trim();
            const dupWhere = UTD
                ? `Misc_Type = :Misc_Type AND UTD <> :UTD AND LTRIM(RTRIM(LOWER(Misc_Name))) = LTRIM(RTRIM(LOWER(:Misc_Name)))`
                : `Misc_Type = :Misc_Type AND Misc_Code <> :Misc_Code AND LTRIM(RTRIM(LOWER(Misc_Name))) = LTRIM(RTRIM(LOWER(:Misc_Name)))`;

            const duplicate = await sequelize.query(
                `SELECT TOP 1 Misc_Code 
                 FROM Default_Mst 
                 WHERE ${dupWhere}`,
                {
                    replacements: { Misc_Type, Misc_Code, UTD, Misc_Name },
                    type: QueryTypes.SELECT,
                }
            );

            if (duplicate && duplicate.length > 0) {
                return res.status(409).send({
                    success: false,
                    message: `"${Misc_Name}" already exists for Misc_Type ${Misc_Type}`,
                });
            }
        }

        // ── Verify record exists ──────────────────────────────
        const checkWhere = UTD ? `UTD = :UTD` : `Misc_Type = :Misc_Type AND Misc_Code = :Misc_Code`;
        const existing = await sequelize.query(
            `SELECT TOP 1 * 
             FROM Default_Mst 
             WHERE ${checkWhere}`,
            {
                replacements: { Misc_Type, Misc_Code, UTD },
                type: QueryTypes.SELECT,
            }
        );

        if (!existing || existing.length === 0) {
            return res.status(404).send({
                success: false,
                message: `Record not found for Misc_Type ${Misc_Type}`,
            });
        }

        // ── Dynamic columns from Default_Mst schema ───────────
        const defaultMstCols = await sequelize.query(
            `SELECT COLUMN_NAME
             FROM INFORMATION_SCHEMA.COLUMNS
             WHERE TABLE_SCHEMA = 'dbo'
               AND TABLE_NAME = 'Default_Mst'
               AND UPPER(COLUMN_NAME) NOT IN ('UTD', 'MISC_TYPE', 'MISC_CODE')`,
            { type: QueryTypes.SELECT }
        );

        const validColMap = {};
        defaultMstCols.forEach((c) => {
            validColMap[c.COLUMN_NAME.toLowerCase()] = c.COLUMN_NAME;
        });

        const updateFields = {};
        Object.keys(body).forEach((key) => {
            const actualCol = validColMap[key.toLowerCase()];
            if (actualCol && !["utd", "misc_code", "misc_type"].includes(key.toLowerCase())) {
                const val = body[key];
                updateFields[actualCol] = (val === "" || val === null || val === undefined) ? null : val;
            }
        });

        // Set Export_Type = 2 if column exists and not provided
        if (validColMap["export_type"] && updateFields[validColMap["export_type"]] === undefined) {
            updateFields[validColMap["export_type"]] = 2;
        }

        if (Misc_Type === 1001 && validColMap["misc_hod"] && updateFields[validColMap["misc_hod"]] === undefined) {
            updateFields[validColMap["misc_hod"]] = 10;
        }

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).send({
                success: false,
                message: "No editable fields provided to update",
            });
        }

        const setClause = Object.keys(updateFields)
            .map((c) => `[${c}] = :${c}`)
            .join(", ");

        await sequelize.query(
            `UPDATE Default_Mst 
             SET ${setClause} 
             WHERE ${checkWhere}`,
            {
                replacements: { ...updateFields, Misc_Type, Misc_Code, UTD },
                type: QueryTypes.UPDATE,
            }
        );

        return res.status(200).send({
            success: true,
            message: "Misc record updated successfully",
            data: { Misc_Type, Misc_Code: existing[0]?.Misc_Code ?? Misc_Code, ...updateFields },
        });

    } catch (error) {
        console.error("Update Misc Data Error:", error);
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    } finally {
        if (sequelize) await sequelize.close();
    }
};

exports.toggleMiscStatus = async function (req, res) {
    let sequelize;
    try {
        sequelize = await dbname(req, compcode);
        const body = req.body || {};
        const query = req.query || {};

        const Misc_Type = parseInt(body.Misc_Type || query.Misc_Type);
        const Misc_Code = body.Misc_Code !== undefined ? parseInt(body.Misc_Code) : (query.Misc_Code !== undefined ? parseInt(query.Misc_Code) : undefined);
        const UTD = body.UTD ? parseInt(body.UTD) : (query.UTD ? parseInt(query.UTD) : null);

        if (!UTD && (!Misc_Type || isNaN(Misc_Type) || Misc_Code === undefined || isNaN(Misc_Code))) {
            return res.status(400).send({
                success: false,
                message: "UTD or (Misc_Type and Misc_Code) is required to update status",
            });
        }

        // Verify record exists in Default_Mst
        const checkWhere = UTD
            ? `UTD = :UTD`
            : `Misc_Type = :Misc_Type AND Misc_Code = :Misc_Code`;

        const existing = await sequelize.query(
            `SELECT TOP 1 UTD, Misc_Type, Misc_Code, Misc_Name, Export_Type 
             FROM Default_Mst 
             WHERE ${checkWhere}`,
            {
                replacements: { Misc_Type, Misc_Code, UTD },
                type: QueryTypes.SELECT,
            }
        );

        if (!existing || existing.length === 0) {
            return res.status(404).send({
                success: false,
                message: "Record not found in Default_Mst",
            });
        }

        const currentRecord = existing[0];
        const currentExportType = parseInt(currentRecord.Export_Type, 10);

        // Determine target Export_Type:
        // Active => 1, Inactive => 33
        let targetExportType;
        if (body.status !== undefined) {
            const s = String(body.status).toLowerCase().trim();
            if (s === "1" || s === "active" || s === "true" || body.status === 1 || body.status === true) {
                targetExportType = 1;
            } else if (s === "33" || s === "inactive" || s === "false" || body.status === 33 || body.status === false) {
                targetExportType = 33;
            }
        } else if (body.action !== undefined) {
            const a = String(body.action).toLowerCase().trim();
            if (a === "active" || a === "activate") {
                targetExportType = 1;
            } else if (a === "inactive" || a === "deactivate") {
                targetExportType = 33;
            }
        }

        // If not explicitly provided, toggle based on current state:
        if (targetExportType === undefined) {
            // Current < 3 is active -> toggle to 33 (Inactive)
            // Current >= 3 is inactive -> toggle to 1 (Active)
            targetExportType = (!isNaN(currentExportType) && currentExportType < 3) ? 33 : 1;
        }

        // Check if Export_Type column exists
        const defaultMstCols = await sequelize.query(
            `SELECT COLUMN_NAME
             FROM INFORMATION_SCHEMA.COLUMNS
             WHERE TABLE_SCHEMA = 'dbo'
               AND TABLE_NAME = 'Default_Mst'
               AND LOWER(COLUMN_NAME) = 'export_type'`,
            { type: QueryTypes.SELECT }
        );

        if (!defaultMstCols || defaultMstCols.length === 0) {
            return res.status(400).send({
                success: false,
                message: "Export_Type column does not exist in Default_Mst",
            });
        }

        await sequelize.query(
            `UPDATE Default_Mst 
             SET Export_Type = :targetExportType 
             WHERE ${checkWhere}`,
            {
                replacements: { targetExportType, Misc_Type, Misc_Code, UTD },
                type: QueryTypes.UPDATE,
            }
        );

        const statusLabel = targetExportType === 1 ? "Active" : "Inactive";

        return res.status(200).send({
            success: true,
            message: `Record successfully marked as ${statusLabel} (Export_Type = ${targetExportType})`,
            data: {
                UTD: currentRecord.UTD,
                Misc_Type: currentRecord.Misc_Type,
                Misc_Code: currentRecord.Misc_Code,
                Misc_Name: currentRecord.Misc_Name,
                Export_Type: targetExportType,
                status: statusLabel,
            },
        });

    } catch (error) {
        console.error("Toggle Misc Status Error:", error);
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    } finally {
        if (sequelize) await sequelize.close();
    }
};

exports.saveMobileRights = async function (req, res) {
    let sequelize;
    try {
        sequelize = await dbname(req, compcode);
        const body = req.body || {};
        const checkedKeys = Array.isArray(body.checkedKeys) ? body.checkedKeys : [];
        const moduleCode = parseInt(body.moduleCode || body.Misc_HOD || 10, 10) || 10;
        const locCode = req.headers.loc_code || 1;

        // Transaction to safely update / save 1001 records in Default_Mst with Export_Type = 33
        const t = await sequelize.transaction();
        try {
            // Filter unique, non-empty keys
            const uniqueKeys = Array.from(new Set(
                checkedKeys.map((k) => String(k).trim()).filter(Boolean)
            ));

            const defaultMstCols = await sequelize.query(
                `SELECT COLUMN_NAME
                 FROM INFORMATION_SCHEMA.COLUMNS
                 WHERE TABLE_SCHEMA = 'dbo'
                   AND TABLE_NAME = 'Default_Mst'
                   AND UPPER(COLUMN_NAME) NOT IN ('UTD')`,
                { type: QueryTypes.SELECT, transaction: t }
            );

            const validColSet = new Set(defaultMstCols.map((c) => c.COLUMN_NAME.toLowerCase()));
            const hasExportType = validColSet.has("export_type");
            const hasServerId = validColSet.has("serverid");
            const hasLocCode = validColSet.has("loc_code");
            const hasMiscHod = validColSet.has("misc_hod");

            // 1. Unchecked records ko Export_Type = 33 par set karo (Delete nahi karna)
            if (hasExportType) {
                if (uniqueKeys.length === 0) {
                    await sequelize.query(
                        `UPDATE Default_Mst 
                         SET Export_Type = 33 
                         WHERE Misc_Type = 1001 AND (Export_Type IS NULL OR Export_Type < 33)`,
                        { transaction: t }
                    );
                } else {
                    await sequelize.query(
                        `UPDATE Default_Mst 
                         SET Export_Type = 33 
                         WHERE Misc_Type = 1001 
                           AND Misc_Name NOT IN (:uniqueKeys)
                           AND (Export_Type IS NULL OR Export_Type < 33)`,
                        {
                            replacements: { uniqueKeys },
                            type: QueryTypes.UPDATE,
                            transaction: t,
                        }
                    );
                }
            }

            // 2. Existing records fetch karo taaki duplicate insert na ho aur Misc_Code maintain rahe
            const existingRows = await sequelize.query(
                `SELECT Misc_Code, Misc_Name, Export_Type 
                 FROM Default_Mst WITH (UPDLOCK)
                 WHERE Misc_Type = 1001`,
                { type: QueryTypes.SELECT, transaction: t }
            );

            const existingMap = new Map();
            let maxMiscCode = 0;
            for (const row of existingRows) {
                const nameKey = String(row.Misc_Name || "").trim().toLowerCase();
                if (nameKey) existingMap.set(nameKey, row);
                const codeNum = parseInt(row.Misc_Code, 10);
                if (!isNaN(codeNum) && codeNum > maxMiscCode) {
                    maxMiscCode = codeNum;
                }
            }

            // 3. Jo checked keys hain, agar exist karti hain toh Export_Type = 1 aur Misc_HOD = 10 karo,
            //    agar nayi hain toh fresh INSERT karo with Export_Type = 1 aur Misc_HOD = 10
            for (const key of uniqueKeys) {
                const lowerKey = key.toLowerCase();
                const existing = existingMap.get(lowerKey);

                if (existing) {
                    // Already in Default_Mst: Reactivate with Export_Type = 1 and Misc_HOD = moduleCode
                    const setFields = [];
                    const replacements = {
                        Misc_Type: 1001,
                        Misc_Code: existing.Misc_Code,
                    };

                    if (hasExportType) {
                        setFields.push("[Export_Type] = 1");
                    }
                    if (hasMiscHod) {
                        setFields.push("[Misc_HOD] = :Misc_HOD");
                        replacements.Misc_HOD = moduleCode;
                    }

                    if (setFields.length > 0) {
                        await sequelize.query(
                            `UPDATE Default_Mst 
                             SET ${setFields.join(", ")}
                             WHERE Misc_Type = :Misc_Type AND Misc_Code = :Misc_Code`,
                            {
                                replacements,
                                type: QueryTypes.UPDATE,
                                transaction: t,
                            }
                        );
                    }
                } else {
                    // New Right: Insert with next Misc_Code
                    maxMiscCode += 1;

                    const insertCols = ["Misc_Type", "Misc_Code", "Misc_Name"];
                    const insertVals = [":Misc_Type", ":Misc_Code", ":Misc_Name"];
                    const replacements = {
                        Misc_Type: 1001,
                        Misc_Code: maxMiscCode,
                        Misc_Name: key,
                    };

                    if (hasMiscHod) {
                        insertCols.push("Misc_HOD");
                        insertVals.push(":Misc_HOD");
                        replacements.Misc_HOD = moduleCode;
                    }
                    if (hasExportType) {
                        insertCols.push("Export_Type");
                        insertVals.push(":Export_Type");
                        replacements.Export_Type = 1;
                    }
                    if (hasServerId) {
                        insertCols.push("ServerId");
                        insertVals.push(":ServerId");
                        replacements.ServerId = 1;
                    }
                    if (hasLocCode) {
                        insertCols.push("Loc_code");
                        insertVals.push(":Loc_code");
                        replacements.Loc_code = locCode;
                    }

                    await sequelize.query(
                        `INSERT INTO Default_Mst (${insertCols.map((c) => `[${c}]`).join(", ")}) 
                         VALUES (${insertVals.join(", ")})`,
                        {
                            replacements,
                            type: QueryTypes.INSERT,
                            transaction: t,
                        }
                    );

                    existingMap.set(lowerKey, {
                        Misc_Code: maxMiscCode,
                        Misc_Name: key,
                    });
                }
            }

            await t.commit();

            return res.status(200).send({
                success: true,
                message: `Mobile Rights saved successfully (${uniqueKeys.length} active rights with Module Code ${moduleCode})`,
                count: uniqueKeys.length,
            });
        } catch (txErr) {
            await t.rollback();
            throw txErr;
        }
    } catch (error) {
        console.error("Save Mobile Rights Error:", error);
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    } finally {
        if (sequelize) await sequelize.close();
    }
};

exports.transferMiscData = async function (req, res) {
    let sourceSequelize, destSequelize;
    try {
        const destCompCode = req.headers.compcode;
        if (!destCompCode) {
            return res.status(400).send({
                success: false,
                message: "compcode is required in headers",
            });
        }

        // ── Step 1: 2 Sequelize connections (source: autovyn, dest: header compcode) ──
        sourceSequelize = await dbname(req, compcode);
        destSequelize = await dbname(req, destCompCode);

        if (!sourceSequelize) {
            return res.status(500).send({
                success: false,
                message: `Failed to connect to source database' for compcode '${compcode}'`,
            });
        }
        if (!destSequelize) {
            return res.status(500).send({
                success: false,
                message: `Failed to connect to destination database for compcode '${destCompCode}'`,
            });
        }

        // ── Step 2: Parse frontend inputs ─────────────────────
        const body = req.body || {};
        let transferList = [];

        if (Array.isArray(body.mappings) && body.mappings.length > 0) {
            transferList = body.mappings.map((m) => ({
                source_type: parseInt(m.source_type || m.source_misc_type || m.Misc_Type),
                target_type: parseInt(m.target_type || m.target_misc_type || m.source_type || m.Misc_Type),
            }));
        } else if (Array.isArray(body.misc_types) && body.misc_types.length > 0) {
            transferList = body.misc_types.map((t) => ({
                source_type: parseInt(t),
                target_type: parseInt(t),
            }));
        } else if (body.source_misc_type || body.source_type) {
            const sType = parseInt(body.source_misc_type || body.source_type);
            const tType = parseInt(body.target_misc_type || body.target_type || sType);
            transferList.push({ source_type: sType, target_type: tType });
        } else if (body.Misc_Type || body.misc_type) {
            const mType = parseInt(body.Misc_Type || body.misc_type);
            transferList.push({ source_type: mType, target_type: mType });
        }

        // Filter valid positive numbers (1002 is excluded from transfer)
        transferList = transferList.filter(
            (item) => item.source_type > 0 && item.target_type > 0 && item.source_type !== 1002
        );

        if (transferList.length === 0) {
            return res.status(400).send({
                success: false,
                message: "Please provide valid Misc_Type, source_misc_type, misc_types array, or mappings array in request body",
            });
        }

        // ── Step 3: Column schema match for Misc_Mst (only if non-1001 types present) ──
        let commonCols = [];
        let destColSet = new Set();
        const hasMiscMstItems = transferList.some((item) => item.source_type !== 1001);

        if (hasMiscMstItems) {
            const destCols = await destSequelize.query(
                `SELECT COLUMN_NAME
                 FROM INFORMATION_SCHEMA.COLUMNS
                 WHERE TABLE_SCHEMA = 'dbo'
                   AND TABLE_NAME = 'Misc_Mst'
                   AND UPPER(COLUMN_NAME) NOT IN ('UTD')`,
                { type: QueryTypes.SELECT }
            );

            if (!destCols || destCols.length === 0) {
                return res.status(404).send({
                    success: false,
                    message: "Destination table Misc_Mst not found or has no columns",
                });
            }

            const sourceCols = await sourceSequelize.query(
                `SELECT COLUMN_NAME
                 FROM INFORMATION_SCHEMA.COLUMNS
                 WHERE TABLE_SCHEMA = 'dbo'
                   AND TABLE_NAME = 'Default_Mst'`,
                { type: QueryTypes.SELECT }
            );

            const sourceColSet = new Set(sourceCols.map((c) => c.COLUMN_NAME.toLowerCase()));
            destColSet = new Set(destCols.map((c) => c.COLUMN_NAME.toLowerCase()));

            // Intersection of columns present in both tables
            commonCols = destCols.filter((c) => sourceColSet.has(c.COLUMN_NAME.toLowerCase()));
        }

        let totalTransferred = 0;
        let totalSkipped = 0;
        const details = [];

        // ── Step 4: Transfer each Misc_Type with 0% Duplicate check ──
        const loginUserCode = parseInt(
            req.headers.user_code ||
            req.headers.usercode ||
            req.headers.userid ||
            req.headers.emp_code ||
            body.user_code ||
            body.userCode ||
            body.USER_CODE ||
            1,
            10
        ) || 1;

        for (const mapping of transferList) {
            const { source_type, target_type } = mapping;

            switch (source_type) {
                // ── Special Case 1001: Mobile_Rights Transfer ───────────────
                case 1001: {
                    // Source: Default_Mst where Misc_Type = 1001
                    // Dest: Mobile_Rights where Emp_Code = '0'
                    // Mapping: Misc_Name -> Optn_Name, Misc_HOD -> Module_Code
                    // Emp_Code = '0', USER_CODE = loginUserCode
                    const sourceRecords = await sourceSequelize.query(
                        `SELECT Misc_Name, Misc_HOD, * 
                         FROM Default_Mst WITH (NOLOCK)
                         WHERE Misc_Type = 1001
                           AND (Export_Type IS NULL OR Export_Type < 33)
                         ORDER BY Misc_Code ASC`,
                        { type: QueryTypes.SELECT }
                    );

                    if (!sourceRecords || sourceRecords.length === 0) {
                        details.push({
                            source_type: 1001,
                            target_type: "Mobile_Rights",
                            status: "No data found in Default_Mst for Misc_Type 1001",
                            total_source: 0,
                            inserted: 0,
                            skipped: 0,
                        });
                        break;
                    }

                    // Check Mobile_Rights table in destination
                    const mrTableCheck = await destSequelize.query(
                        `SELECT COLUMN_NAME 
                         FROM INFORMATION_SCHEMA.COLUMNS 
                         WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'Mobile_Rights'`,
                        { type: QueryTypes.SELECT }
                    );

                    if (!mrTableCheck || mrTableCheck.length === 0) {
                        details.push({
                            source_type: 1001,
                            target_type: "Mobile_Rights",
                            status: "Table Mobile_Rights not found in destination database",
                            total_source: sourceRecords.length,
                            inserted: 0,
                            skipped: sourceRecords.length,
                        });
                        break;
                    }

                    const mrColSet = new Set(mrTableCheck.map((c) => c.COLUMN_NAME.toLowerCase()));
                    const hasUserCode = mrColSet.has("user_code");

                    // Fetch existing records from Mobile_Rights for Emp_Code = '0'
                    const existingMobileRights = await destSequelize.query(
                        `SELECT Optn_Name, Module_Code${hasUserCode ? ", USER_CODE" : ""} 
                         FROM Mobile_Rights WITH (NOLOCK)
                         WHERE Emp_Code = '0'`,
                        { type: QueryTypes.SELECT }
                    );

                    // Duplicate check set: Optn_Name (case-insensitive & trimmed)
                    const existingOptnSet = new Set(
                        existingMobileRights
                            .filter((r) => r.Optn_Name)
                            .map((r) => String(r.Optn_Name).trim().toLowerCase())
                    );

                    let insertedInType = 0;
                    let skippedInType = 0;
                    const insertedNames = [];
                    const skippedNames = [];

                    for (const record of sourceRecords) {
                        const rawOptnName = record.Misc_Name ? String(record.Misc_Name).trim() : "";
                        const moduleCode = (record.Misc_HOD !== null && record.Misc_HOD !== undefined && !isNaN(parseInt(record.Misc_HOD, 10)))
                            ? parseInt(record.Misc_HOD, 10)
                            : 0;

                        if (!rawOptnName) {
                            skippedInType++;
                            skippedNames.push({ reason: "Empty Misc_Name / Optn_Name", record });
                            continue;
                        }

                        const optnKey = rawOptnName.toLowerCase();

                        // 🛑 0% DUPLICATE CHECK: Skip if Optn_Name already exists for Emp_Code = '0'
                        if (existingOptnSet.has(optnKey)) {
                            skippedInType++;
                            skippedNames.push({ reason: "Duplicate Optn_Name already exists for Emp_Code '0'", Optn_Name: rawOptnName });
                            continue;
                        }

                        // Insert into Mobile_Rights
                        if (hasUserCode) {
                            await destSequelize.query(
                                `INSERT INTO Mobile_Rights (Emp_Code, Optn_Name, Module_Code, USER_CODE)
                                 VALUES (:Emp_Code, :Optn_Name, :Module_Code, :USER_CODE)`,
                                {
                                    replacements: {
                                        Emp_Code: "0",
                                        Optn_Name: rawOptnName,
                                        Module_Code: moduleCode,
                                        USER_CODE: loginUserCode,
                                    },
                                    type: QueryTypes.INSERT,
                                }
                            );
                        } else {
                            await destSequelize.query(
                                `INSERT INTO Mobile_Rights (Emp_Code, Optn_Name, Module_Code)
                                 VALUES (:Emp_Code, :Optn_Name, :Module_Code)`,
                                {
                                    replacements: {
                                        Emp_Code: "0",
                                        Optn_Name: rawOptnName,
                                        Module_Code: moduleCode,
                                    },
                                    type: QueryTypes.INSERT,
                                }
                            );
                        }

                        existingOptnSet.add(optnKey);
                        insertedInType++;
                        insertedNames.push({
                            Emp_Code: "0",
                            Optn_Name: rawOptnName,
                            Module_Code: moduleCode,
                            USER_CODE: loginUserCode,
                        });
                    }

                    totalTransferred += insertedInType;
                    totalSkipped += skippedInType;

                    details.push({
                        source_type: 1001,
                        target_type: "Mobile_Rights",
                        total_source: sourceRecords.length,
                        inserted: insertedInType,
                        skipped: skippedInType,
                        inserted_records: insertedNames,
                        skipped_records: skippedNames,
                    });
                    break;
                }

                // ── Default Case: Normal Default_Mst -> Misc_Mst Transfer ────
                default: {
                    const sourceRecords = await sourceSequelize.query(
                        `SELECT * 
                         FROM Default_Mst WITH (NOLOCK)
                         WHERE Misc_Type = :source_type
                           AND (Export_Type IS NULL OR Export_Type < 33)
                         ORDER BY Misc_Code ASC`,
                        {
                            replacements: { source_type },
                            type: QueryTypes.SELECT,
                        }
                    );

                    if (!sourceRecords || sourceRecords.length === 0) {
                        details.push({
                            source_type,
                            target_type,
                            status: "No data found in Default_Mst",
                            total_source: 0,
                            inserted: 0,
                            skipped: 0,
                        });
                        break;
                    }

                    // Fetch existing records in destination Misc_Mst (active < 33)
                    const existingDestRecords = await destSequelize.query(
                        `SELECT Misc_Code, Misc_Name 
                         FROM Misc_Mst WITH (NOLOCK)
                         WHERE Misc_Type = :target_type
                           ${destColSet.has("export_type") ? "AND (Export_Type IS NULL OR Export_Type < 33)" : ""}`,
                        {
                            replacements: { target_type },
                            type: QueryTypes.SELECT,
                        }
                    );

                    // Duplicate detection set: trimmed & lowercase Misc_Name
                    const existingNameSet = new Set(
                        existingDestRecords
                            .filter((r) => r.Misc_Name)
                            .map((r) => String(r.Misc_Name).trim().toLowerCase())
                    );

                    // Existing codes set
                    const existingCodeSet = new Set(
                        existingDestRecords
                            .map((r) => parseInt(r.Misc_Code))
                            .filter((c) => !isNaN(c))
                    );

                    // Find current MAX Misc_Code in destination (agar 10 tak bana hai to 10 milega, empty par 0)
                    const maxCodeResult = await destSequelize.query(
                        `SELECT ISNULL(MAX(Misc_Code), 0) AS MaxCode 
                         FROM Misc_Mst WITH (NOLOCK) 
                         WHERE Misc_Type = :target_type`,
                        {
                            replacements: { target_type },
                            type: QueryTypes.SELECT,
                        }
                    );

                    let currentMaxCode = parseInt(maxCodeResult[0]?.MaxCode || 0);

                    let insertedInType = 0;
                    let skippedInType = 0;
                    const insertedNames = [];
                    const skippedNames = [];

                    for (const record of sourceRecords) {
                        const rawName = record.Misc_Name ? String(record.Misc_Name).trim() : "";

                        if (!rawName) {
                            skippedInType++;
                            skippedNames.push({ reason: "Empty Misc_Name", Misc_Code: record.Misc_Code });
                            continue;
                        }

                        const nameKey = rawName.toLowerCase();

                        // 🛑 0% DUPLICATE CHECK: Skip if already exists in destination
                        if (existingNameSet.has(nameKey)) {
                            skippedInType++;
                            skippedNames.push({ reason: "Duplicate Misc_Name already exists", Misc_Name: rawName });
                            continue;
                        }

                        // 🚀 Auto-increment Misc_Code: Max ke aage se start hoga (jaise 10 hai to 11, 12, 13...)
                        currentMaxCode += 1;
                        const finalCode = currentMaxCode;

                        // Build insert payload
                        const sourceKeyMap = {};
                        for (const k of Object.keys(record)) {
                            sourceKeyMap[k.toLowerCase()] = k;
                        }

                        const insertPayload = {};
                        for (const col of commonCols) {
                            const colName = col.COLUMN_NAME;
                            const srcKey = sourceKeyMap[colName.toLowerCase()];
                            insertPayload[colName] = (srcKey !== undefined && record[srcKey] !== undefined)
                                ? record[srcKey]
                                : null;
                        }

                        // Override / assign target fields
                        insertPayload["Misc_Type"] = target_type;
                        insertPayload["Misc_Code"] = finalCode;
                        insertPayload["Misc_Name"] = rawName;

                        // Default standard columns: ensure Export_Type is always < 33 (1 by default)
                        if (destColSet.has("export_type")) {
                            const expVal = parseInt(insertPayload["Export_Type"], 10);
                            if (isNaN(expVal) || expVal >= 33 || expVal <= 0) {
                                insertPayload["Export_Type"] = 1;
                            }
                        }
                        if (destColSet.has("serverid") && (insertPayload["ServerId"] === null || insertPayload["ServerId"] === undefined)) {
                            insertPayload["ServerId"] = 1;
                        }
                        if (destColSet.has("loc_code") && (insertPayload["Loc_code"] === null || insertPayload["Loc_code"] === undefined)) {
                            insertPayload["Loc_code"] = req.headers.loc_code || 1;
                        }

                        const colKeys = Object.keys(insertPayload);
                        const colNamesSql = colKeys.map((c) => `[${c}]`).join(", ");
                        const colValsSql = colKeys.map((c) => `:${c}`).join(", ");

                        await destSequelize.query(
                            `INSERT INTO Misc_Mst (${colNamesSql}) VALUES (${colValsSql})`,
                            {
                                replacements: insertPayload,
                                type: QueryTypes.INSERT,
                            }
                        );

                        // Add to sets to guarantee 0% duplicate within the same batch
                        existingNameSet.add(nameKey);
                        existingCodeSet.add(finalCode);
                        insertedInType++;
                        insertedNames.push({ Misc_Code: finalCode, Misc_Name: rawName });
                    }

                    totalTransferred += insertedInType;
                    totalSkipped += skippedInType;

                    details.push({
                        source_type,
                        target_type,
                        total_source: sourceRecords.length,
                        inserted: insertedInType,
                        skipped: skippedInType,
                        inserted_records: insertedNames,
                        skipped_records: skippedNames,
                    });
                    break;
                }
            }
        }

        return res.status(200).send({
            success: true,
            message: `Transfer completed successfully. Inserted: ${totalTransferred}, Skipped (Duplicates): ${totalSkipped}`,
            total_transferred: totalTransferred,
            total_skipped: totalSkipped,
            compcode: destCompCode,
            details,
        });

    } catch (error) {
        console.error("Transfer Misc Data Error:", error);
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    } finally {
        if (sourceSequelize) {
            try { await sourceSequelize.close(); } catch (_) {}
        }
        if (destSequelize) {
            try { await destSequelize.close(); } catch (_) {}
        }
    }
};  


 