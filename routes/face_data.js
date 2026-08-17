const { QueryTypes } = require("sequelize");
const { dbname } = require("../utils/dbconfig");

// ============================================================
// GET ALL EMPLOYEES WITH FACE EMBEDDINGS + DOC PATH
// ============================================================
exports.getEmployeesWithFaceData = async function (req, res) {
  let sequelize;
//  console.log("req.headers.compcode",req.headers.compcode)
  try {
    sequelize = await dbname(req, req.headers.compcode);

    // ================================================================
    // STEP 1: Sabhi employees fetch karo jinke paas FACE_EMBEDDING hai
    // ================================================================
    const employees = await sequelize.query(
      `SELECT
         SRNO,
         EMPCODE,
         EMPFIRSTNAME,
         EMPLASTNAME,
         MOBILENO,
         FACE_EMBEDDING
       FROM dbo.EMPLOYEEMASTER
       WHERE FACE_EMBEDDING IS NOT NULL
         AND LTRIM(RTRIM(ISNULL(FACE_EMBEDDING, ''))) <> ''
       ORDER BY EMPCODE ASC`,
      { type: QueryTypes.SELECT }
    );

    if (employees.length === 0) {
      return res.status(200).send({
        success: true,
        message: "No employees found with face embeddings",
        data   : [],
        total  : 0,
      });
    }

    // ================================================================
    // STEP 2: Har employee ke liye DOC_PATH fetch karo
    // EMPCODE list banao — IN clause ke liye
    // ================================================================
    const empCodes = employees.map((e) => e.EMPCODE).filter(Boolean);

    // ✅ Sabhi docs ek saath fetch karo — N+1 query avoid
    const docsResult = await sequelize.query(
      `SELECT
         EMP_CODE,
         DOC_PATH
       FROM dbo.emp_docs
       WHERE EMP_CODE     IN (:empCodes)
         AND ISNULL(export_type, 0) < 3
         AND Seq_No       = '6'`,
      {
        replacements: { empCodes },
        type        : QueryTypes.SELECT,
      }
    );

    // ✅ Doc map banao — EMP_CODE → DOC_PATH
    // Agar ek employee ke multiple docs hain to pehla lo
    const docMap = new Map();
    for (const doc of docsResult) {
      const code = String(doc.EMP_CODE).trim();
      if (!docMap.has(code)) {
        docMap.set(code, doc.DOC_PATH || null);
      }
    }

    // ================================================================
    // STEP 3: Employees aur docs merge karo
    // ================================================================
    const data = employees.map((emp) => {
      const empCode = String(emp.EMPCODE || "").trim();

      // ✅ FACE_EMBEDDING parse karo
      // Agar JSON string hai to parse karo
      let faceEmbedding = emp.FACE_EMBEDDING;
      try {
        if (typeof faceEmbedding === "string") {
          faceEmbedding = JSON.parse(faceEmbedding);
        }
      } catch {
        // String hi rehne do agar parse nahi hua
        faceEmbedding = emp.FACE_EMBEDDING;
      }

      return {
        SRNO          : emp.SRNO,
        EMPCODE       : emp.EMPCODE,
        EMPFIRSTNAME  : emp.EMPFIRSTNAME  || "",
        EMPLASTNAME   : emp.EMPLASTNAME   || "",
        FULL_NAME     : `${emp.EMPFIRSTNAME || ""} ${emp.EMPLASTNAME || ""}`.trim(),
        MOBILENO      : emp.MOBILENO      || null,
        FACE_EMBEDDING: faceEmbedding,
        DOC_PATH      : docMap.get(empCode) || null,
        HAS_DOC       : docMap.has(empCode),
      };
    });

    return res.status(200).send({
      success: true,
      message: "Employee face data fetched successfully",
      data,
      total  : data.length,
      summary: {
        totalWithFace: data.length,
        totalWithDoc : data.filter((e) => e.HAS_DOC).length,
        totalWithoutDoc: data.filter((e) => !e.HAS_DOC).length,
      },
    });

  } catch (error) {
    console.error("Get Employee Face Data Error:", error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error  : error.message,
    });
  } finally {
    if (sequelize) await sequelize.close();
  }
};


// ============================================================
// GET SINGLE EMPLOYEE FACE DATA BY EMPCODE
// ============================================================
exports.getEmployeeFaceDataByCode = async function (req, res) {
  let sequelize;

  try {
    sequelize = await dbname(req, req.headers.compcode);

    const body    = req.body || {};
    const empCode = body.EMPCODE || req.params?.EMPCODE;

    if (!empCode) {
      return res.status(400).send({
        success: false,
        message: "EMPCODE is required",
      });
    }

    const empCodeStr = String(empCode).trim();

    // ================================================================
    // STEP 1: Employee fetch karo
    // ================================================================
    const employeeResult = await sequelize.query(
      `SELECT
         SRNO,
         EMPCODE,
         EMPFIRSTNAME,
         EMPLASTNAME,
         MOBILENO,
         FACE_EMBEDDING
       FROM dbo.EMPLOYEEMASTER
       WHERE EMPCODE        = :EMPCODE
         AND FACE_EMBEDDING IS NOT NULL
         AND LTRIM(RTRIM(ISNULL(FACE_EMBEDDING, ''))) <> ''`,
      {
        replacements: { EMPCODE: empCodeStr },
        type        : QueryTypes.SELECT,
      }
    );

    if (employeeResult.length === 0) {
      return res.status(404).send({
        success: false,
        message: `Employee not found or no face embedding for EMPCODE: ${empCodeStr}`,
      });
    }

    const emp = employeeResult[0];

    // ================================================================
    // STEP 2: DOC_PATH fetch karo
    // ================================================================
    const docResult = await sequelize.query(
      `SELECT TOP 1
         DOC_PATH
       FROM dbo.emp_docs
       WHERE EMP_CODE           = :EMP_CODE
         AND ISNULL(export_type, 0) < 3
         AND Seq_No             = '6'
       ORDER BY Seq_No ASC`,
      {
        replacements: { EMP_CODE: empCodeStr },
        type        : QueryTypes.SELECT,
      }
    );

    const docPath = docResult.length > 0
      ? (docResult[0].DOC_PATH || null)
      : null;

    // ✅ FACE_EMBEDDING parse
    let faceEmbedding = emp.FACE_EMBEDDING;
    try {
      if (typeof faceEmbedding === "string") {
        faceEmbedding = JSON.parse(faceEmbedding);
      }
    } catch {
      faceEmbedding = emp.FACE_EMBEDDING;
    }

    return res.status(200).send({
      success: true,
      message: "Employee face data fetched successfully",
      data: {
        SRNO          : emp.SRNO,
        EMPCODE       : emp.EMPCODE,
        EMPFIRSTNAME  : emp.EMPFIRSTNAME  || "",
        EMPLASTNAME   : emp.EMPLASTNAME   || "",
        FULL_NAME     : `${emp.EMPFIRSTNAME || ""} ${emp.EMPLASTNAME || ""}`.trim(),
        MOBILENO      : emp.MOBILENO      || null,
        FACE_EMBEDDING: faceEmbedding,
        DOC_PATH      : docPath,
        HAS_DOC       : !!docPath,
      },
    });

  } catch (error) {
    console.error("Get Employee Face Data By Code Error:", error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error  : error.message,
    });
  } finally {
    if (sequelize) await sequelize.close();
  }
};