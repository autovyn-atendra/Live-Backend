// routes/demoCarAppointment.js

const { DataTypes, Op, QueryTypes } = require("sequelize");
const { dbname } = require("../utils/dbconfig");
const { _DemoCarAppointment } = require("../models/DemoCarAppointment");

// ============================================================
// Helper - Date Convert (any format → YYYY-MM-DD)
// ============================================================
const convertDate = (dateStr) => {
  if (!dateStr) return null;

  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

  // DD-MM-YYYY
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
    const [day, month, year] = dateStr.split("-");
    return `${year}-${month}-${day}`;
  }

  // DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  }

  return dateStr;
};


// ============================================================
// 1. CREATE
// ============================================================
exports.createAppointment = async function (req, res) {
  const sequelize = await dbname(req, req.headers.compcode);

  try {
    const body = req.body;

    // ✅ Validation
    if (!body.CustomerName) {
      return res.status(400).send({ success: false, message: "CustomerName is required" });
    }
    if (!body.Mob_Number) {
      return res.status(400).send({ success: false, message: "Mob_Number is required" });
    }
    if (!body.Date) {
      return res.status(400).send({ success: false, message: "Date is required" });
    }
    if (!body.Time) {
      return res.status(400).send({ success: false, message: "Time is required" });
    }

    // ✅ Date Convert
    const formattedDate = convertDate(body.Date);

    // ✅ Raw Query - DSE bhi include kiya
    const result = await sequelize.query(
      `INSERT INTO Demo_Car_Appointment 
        (CustomerName, Mob_Number, Model_Name, Model_Group, Enq_No, Date, Time, status, Created_By, Created_At, DSE)
       OUTPUT INSERTED.UTD
       VALUES 
        (:CustomerName, :Mob_Number, :Model_Name, :Model_Group, :Enq_No, 
         CONVERT(date, :Date, 23),
         CONVERT(time(0), :Time),
         :status, :Created_By, GETDATE(), :DSE)`,
      {
        replacements: {
          CustomerName: body.CustomerName,
          Mob_Number:   body.Mob_Number,
          Model_Name:   body.Model_Name  || null,
          Model_Group:  body.Model_Group || null,
          Enq_No:       body.Enq_No      || null,
          Date:         formattedDate,
          Time:         body.Time,
          status:       body.status      ?? 0,
          Created_By:   body.Created_By  || null,
          DSE:          body.DSE         || null,  // ✅ DSE fixed
        },
        type: QueryTypes.SELECT
      }
    );

    const newUTD = result[0]?.UTD;

    return res.status(200).send({
      success: true,
      message: "Appointment created successfully",
      data: { UTD: newUTD, ...body, Date: formattedDate }
    });

  } catch (error) {
    console.error("Create Appointment Error:", error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  } finally {
    await sequelize.close();
  }
};


// ============================================================
// 2. GET ALL - Pagination + Date Filter + Status Filter
// ============================================================
exports.getAllAppointments = async function (req, res) {
  const sequelize = await dbname(req, req.headers.compcode);

  try {
    const {
      page     = 1,
      pageSize = 10,
      fromDate,
      toDate,
      status,
      search
    } = req.body;

    const pageNum = parseInt(page)     || 1;
    const limit   = parseInt(pageSize) || 10;
    const offset  = (pageNum - 1) * limit;

    let whereConditions = ` WHERE 1=1 `;
    const replacements  = {};

    if (fromDate && toDate) {
      whereConditions += ` AND CONVERT(date, d.[Date], 23) BETWEEN CONVERT(date, :fromDate, 23) AND CONVERT(date, :toDate, 23) `;
      replacements.fromDate = convertDate(fromDate);
      replacements.toDate   = convertDate(toDate);
    } else if (fromDate) {
      whereConditions += ` AND CONVERT(date, d.[Date], 23) >= CONVERT(date, :fromDate, 23) `;
      replacements.fromDate = convertDate(fromDate);
    } else if (toDate) {
      whereConditions += ` AND CONVERT(date, d.[Date], 23) <= CONVERT(date, :toDate, 23) `;
      replacements.toDate = convertDate(toDate);
    }

    if (status !== undefined && status !== null && status !== "") {
      whereConditions += ` AND d.status = :status `;
      replacements.status = parseInt(status);
    }

    if (search) {
      whereConditions += `
        AND (
          d.CustomerName LIKE :search 
          OR d.Mob_Number LIKE :search 
          OR d.Enq_No     LIKE :search
        )
      `;
      replacements.search = `%${search}%`;
    }

    // ✅ Count Query - JOIN ke saath
    const countResult = await sequelize.query(
      `SELECT COUNT(*) as total 
       FROM Demo_Car_Appointment d
       LEFT JOIN EMPLOYEEMASTER e 
          ON LTRIM(RTRIM(CAST(d.DSE AS VARCHAR))) = LTRIM(RTRIM(e.EMPCODE))
       ${whereConditions}`,
      { replacements, type: QueryTypes.SELECT }
    );
    const totalCount = countResult[0]?.total || 0;

    replacements.limit  = limit;
    replacements.offset = offset;

    // ✅ Data Query - DSE_Name JOIN
    const appointments = await sequelize.query(
      `SELECT 
          d.UTD,
          d.CustomerName,
          d.Mob_Number,
          d.Model_Name,
          d.Model_Group,
          d.Enq_No,
          CONVERT(varchar, d.[Date], 23)  AS [Date],
          CONVERT(varchar, d.[Time], 108) AS [Time],
          d.status,
          d.Created_By,
          d.Created_At,
          d.DSE,
          ISNULL(
            LTRIM(RTRIM(ISNULL(e.EMPFIRSTNAME, ''))) 
            + ' ' + 
            LTRIM(RTRIM(ISNULL(e.EMPLASTNAME, '')))
            , '-'
          ) AS DSE_Name
       FROM Demo_Car_Appointment d
       LEFT JOIN EMPLOYEEMASTER e 
          ON LTRIM(RTRIM(CAST(d.DSE AS VARCHAR))) = LTRIM(RTRIM(e.EMPCODE))
       ${whereConditions}
       ORDER BY d.[Date] DESC, d.[Time] DESC
       OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY`,
      { replacements, type: QueryTypes.SELECT }
    );

    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).send({
      success: true,
      data: appointments,
      pagination: {
        currentPage:  pageNum,
        pageSize:     limit,
        totalRecords: totalCount,
        totalPages:   totalPages,
        hasNextPage:  pageNum < totalPages,
        hasPrevPage:  pageNum > 1
      },
      filters: {
        fromDate: fromDate || null,
        toDate:   toDate   || null,
        status:   status   ?? null,
        search:   search   || null
      }
    });

  } catch (error) {
    console.error("Get All Error:", error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  } finally {
    await sequelize.close();
  }
};


// ============================================================
// 3. GET ONE
// ============================================================
exports.getOneAppointment = async function (req, res) {
  const sequelize = await dbname(req, req.headers.compcode);

  try {
    const { UTD } = req.body;

    if (!UTD) {
      return res.status(400).send({ success: false, message: "UTD is required" });
    }

    // ✅ DSE bhi select kiya
    const result = await sequelize.query(
      `SELECT 
          UTD,
          CustomerName,
          Mob_Number,
          Model_Name,
          Model_Group,
          Enq_No,
          CONVERT(varchar, [Date], 23)  AS [Date],
          CONVERT(varchar, [Time], 108) AS [Time],
          status,
          Created_By,
          Created_At,
          DSE
       FROM Demo_Car_Appointment
       WHERE UTD = :UTD`,
      { replacements: { UTD }, type: QueryTypes.SELECT }
    );

    if (!result || result.length === 0) {
      return res.status(404).send({
        success: false,
        message: `Appointment with UTD ${UTD} not found`
      });
    }

    return res.status(200).send({
      success: true,
      data: result[0]
    });

  } catch (error) {
    console.error("Get One Error:", error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  } finally {
    await sequelize.close();
  }
};


// ============================================================
// 4. UPDATE - DSE bhi update hoga
// ============================================================
exports.updateAppointment = async function (req, res) {
  const sequelize = await dbname(req, req.headers.compcode);

  try {
    const body = req.body;

    if (!body.UTD) {
      return res.status(400).send({ success: false, message: "UTD is required" });
    }

    // ✅ Exist check
    const existing = await sequelize.query(
      `SELECT UTD FROM Demo_Car_Appointment WHERE UTD = :UTD`,
      { replacements: { UTD: body.UTD }, type: QueryTypes.SELECT }
    );

    if (!existing || existing.length === 0) {
      return res.status(404).send({
        success: false,
        message: `Appointment with UTD ${body.UTD} not found`
      });
    }

    // ✅ Dynamic SET
    const setClauses   = [];
    const replacements = { UTD: body.UTD };

    if (body.CustomerName !== undefined) {
      setClauses.push(`CustomerName = :CustomerName`);
      replacements.CustomerName = body.CustomerName;
    }
    if (body.Mob_Number !== undefined) {
      setClauses.push(`Mob_Number = :Mob_Number`);
      replacements.Mob_Number = body.Mob_Number;
    }
    if (body.Model_Name !== undefined) {
      setClauses.push(`Model_Name = :Model_Name`);
      replacements.Model_Name = body.Model_Name;
    }
    if (body.Model_Group !== undefined) {
      setClauses.push(`Model_Group = :Model_Group`);
      replacements.Model_Group = body.Model_Group;
    }
    if (body.Enq_No !== undefined) {
      setClauses.push(`Enq_No = :Enq_No`);
      replacements.Enq_No = body.Enq_No;
    }
    if (body.Date !== undefined) {
      setClauses.push(`[Date] = CONVERT(date, :Date, 23)`);
      replacements.Date = convertDate(body.Date);
    }
    if (body.Time !== undefined) {
      setClauses.push(`[Time] = CONVERT(time(0), :Time)`);
      replacements.Time = body.Time;
    }
    if (body.status !== undefined) {
      setClauses.push(`status = :status`);
      replacements.status = body.status;
    }
    // ✅ DSE update
    if (body.DSE !== undefined) {
      setClauses.push(`DSE = :DSE`);
      replacements.DSE = body.DSE || null;
    }

    if (setClauses.length === 0) {
      return res.status(400).send({ success: false, message: "No fields to update" });
    }

    // ✅ Update
    await sequelize.query(
      `UPDATE Demo_Car_Appointment 
       SET ${setClauses.join(", ")} 
       WHERE UTD = :UTD`,
      { replacements, type: QueryTypes.UPDATE }
    );

    // ✅ Updated record - DSE bhi
    const updated = await sequelize.query(
      `SELECT 
          UTD, CustomerName, Mob_Number,
          Model_Name, Model_Group, Enq_No,
          CONVERT(varchar, [Date], 23)  AS [Date],
          CONVERT(varchar, [Time], 108) AS [Time],
          status, Created_By, Created_At,
          DSE
       FROM Demo_Car_Appointment 
       WHERE UTD = :UTD`,
      { replacements: { UTD: body.UTD }, type: QueryTypes.SELECT }
    );

    return res.status(200).send({
      success: true,
      message: "Appointment updated successfully",
      data: updated[0]
    });

  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  } finally {
    await sequelize.close();
  }
};