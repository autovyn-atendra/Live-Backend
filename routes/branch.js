const { Sequelize, DataTypes, literal, Op, where } = require("sequelize");
const { dbname } = require("../utils/dbconfig");

var { _GodownMst, GodownMstSchema } = require("../models/GodownMst");
var { _CompMst, compMstSchema } = require("../models/CompMst");
const {_BranchMst} = require('../models/BranchMst')
const _BranchCreds = require('../models/BranchCreds')
const _BranchDms = require('../models/BranchDms')
const _BranchLedg = require('../models/BranchLedg')

exports.insertData = async function (req, res) {
  const branchData = req.body;
  const sequelize = await dbname(req,req.headers.compcode);
  const t = await sequelize.transaction();
  const BranchMst = _GodownMst(sequelize, DataTypes);

  try {
    const BranchMst1 = await BranchMst.create(branchData.BranchMst, {
      transaction: t,
    });
    // const godwCode = BranchMst1.Godw_Code;
    // console.log(godwCode)
    // await BranchCreds.create({
    //     Godw_Code: godwCode,
    //     ...branchData.BranchCreds
    // }, { transaction: t });

    // await BranchDms.create({
    //     Godw_Code: godwCode,
    //     ...branchData.BranchDms
    // }, { transaction: t });

    // await BranchLedg.create({
    //     Godw_Code: godwCode,
    //     ...branchData.BranchLedg
    // }, { transaction: t });
    await t.commit();
    res.status(200).send({ success: true, Message: "data saved" });
  } catch (error) {
    await t.rollback();
    res.status(500).send({
      success: false,
      message: "An error occurred while creating branch.",
    });
  } finally {
    // Close the database connection
    await sequelize.close();
    console.log("Connection has been closed.");
  }
};

exports.updateData = async function (req, res) {
  const branchData = req.body;
  const sequelize = await dbname(req,req.headers.compcode);
  const t = await sequelize.transaction();
  const BranchMst = _BranchMst(sequelize, DataTypes);
  const BranchCreds = _BranchCreds(sequelize, DataTypes);
  const BranchDms = _BranchDms(sequelize, DataTypes);
  const BranchLedg = _BranchLedg(sequelize, DataTypes);
  try {
    const { Godw_Code } = branchData;
    if (!Godw_Code)
      return res
        .status(500)
        .send({ success: false, message: "godown code is mandatory" });
    if (branchData.BranchMst)
      await BranchMst.update(
        branchData.BranchMst,
        { where: { Godw_Code } },
        { transaction: t }
      );
    if (branchData.BranchCreds)
      await BranchCreds.update(
        branchData.BranchCreds,
        { where: { Godw_Code } },
        { transaction: t }
      );
    if (branchData.BranchDms)
      await BranchDms.update(
        branchData.BranchDms,
        { where: { Godw_Code } },
        { transaction: t }
      );
    if (branchData.BranchLedg)
      await BranchLedg.update(
        branchData.BranchLedg,
        { where: { Godw_Code } },
        { transaction: t }
      );

    await t.commit();
    res.status(200).send({ success: true, Message: "Date updated" });
  } catch (error) {
    await t.rollback();
    res.status(500).send({
      success: false,
      message: "An error occurred while creating user.",
    });
  } finally {
    // Close the database connection
    await sequelize.close();
    console.log("Connection has been closed.");
  }
};
exports.findAll = async function (req, res) {
  const sequelize = await dbname(req,req.headers.compcode);
  try {
    const BranchMst = _GodownMst(sequelize, DataTypes);
    const CompMst = _CompMst(sequelize, DataTypes);
   
    // Fetch all branches grouped by Comp_Code
    const data = await sequelize.query(`SELECT Comp_Code, Godw_Code, Godw_Name
    FROM godown_mst
    WHERE godw_code IN (
        SELECT LTRIM(RTRIM(m.value('.[1]', 'VARCHAR(8000)'))) AS value
        FROM user_tbl
        CROSS APPLY (
            SELECT CAST('<x>' + REPLACE(multi_loc, ',', '</x><x>') + '</x>' AS XML)
        ) AS t(x)
        CROSS APPLY t.x.nodes('/x') AS a(m)
        WHERE user_code = '${req.body.User_Code}'
          AND export_type < 3 
          AND module_code = 10
    ) 
    AND (export_type < 3 or export_type = 50) order by Godw_Code;`);
    // const data = await sequelize.query(`SELECT Comp_Code, Godw_Code, Godw_Name
    // FROM godown_mst
    // WHERE godw_code IN (
    //     SELECT value
    //     FROM user_tbl
    //     CROSS APPLY STRING_SPLIT(multi_loc, ',')
    //     WHERE user_code = '${req.body.User_Code}'
    //       AND export_type < 3
    //       AND module_code = 10
    // ) and export_type < 3 order by godw_code`);
    const comp = await CompMst.findAll();
    const [compKeyData] = await sequelize.query('SELECT * FROM COMP_KEYDATA')

    await sequelize.close();

    if (!data[0] || data[0].length === 0) {
      return res.status(500).send({ success: false, message: "No data found" });
    }
    const compMap = comp.reduce((map, comp) => {
      map[comp.Comp_Code] = comp.Comp_Name;
      return map;
    }, {});
    // Aggregate branches by Comp_Code
    const aggregatedData = {};
    data[0]?.forEach((branch) => {
      if (!aggregatedData[branch.Comp_Code]) {
        aggregatedData[branch.Comp_Code] = {
          Comp_Code: branch.Comp_Code,
          Comp_Name: compMap[branch.Comp_Code],
          branch: [],
        };
      }
      aggregatedData[branch.Comp_Code].branch.push({
        value: branch.Godw_Code,
        label: branch.Godw_Name,
      });
    });

    const responseData = Object.values(aggregatedData);
    console.log(responseData,"responseData")
    return res.status(200).send({ success: true, data: responseData ,compKeyData : compKeyData});
  } catch (e) {
    await sequelize?.close();
    console.log(e);
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error" });
  } finally {
        await sequelize.close();
    }
};
exports.onlybranch = async function (req, res) {
  const sequelize = await dbname(req,req.headers.compcode);
    console.log(req.body);
    console.log(req.headers);
  try {
    const BranchMst = _GodownMst(sequelize, DataTypes);
    // Fetch all branches grouped by Comp_Code
    const data = await BranchMst.findAll({
      attributes: [
        ["Godw_Code", "Code"],
        ["Godw_Code", "value"],
        ["Godw_Name", "Name"],
        ["Godw_Name", "label"],
      ],
     where: {
    	[Op.or]: [
      	      { export_type: { [Op.lt]: 3 } },
      	      { export_type: 50 }
    	    ]
  	},
    });
     const result = await sequelize.query(
      `select misc_code, Misc_Name,Misc_Hod,
      (select top 1 Godw_Name from Godown_mst where godw_code=Misc_Hod and export_type<3)as Branch_name
       from  Misc_Mst where  Misc_Type = '631'`
    );
    const result1 = await sequelize.query(
      `select misc_code as value, Misc_Name as label
       from  Misc_Mst where  Misc_Type = '631'`
    );
    console.log('kkkkkkkkkkkkkkkkkkkkkk')
    await sequelize.close();
            return res.status(200).send({ success: true, data: data, result: result[0], result1: result1[0] });

  } catch (e) {
    await sequelize.close();
    console.log(e, 'komalalaala');
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error" });
  } finally {
        await sequelize.close();
    }
};
exports.findOne = async function (req, res) {
  const sequelize = await dbname(req,req.headers.compcode);
  try {
    const BranchMst = _BranchMst(sequelize, DataTypes);
    const BranchCreds = _BranchCreds(sequelize, DataTypes);
    const BranchDms = _BranchDms(sequelize, DataTypes);
    const BranchLedg = _BranchLedg(sequelize, DataTypes);
    const BranchId = req.params.id;

    console.log(BranchId,"branchid")

    const BranchMstData = await BranchMst.findOne({
      where: { Godw_Code: BranchId },
    });
    if (!BranchMstData) {
      return res
        .status(500)
        .send({ success: "false", message: "No data found" });
    }
    const BranchCredsData = await BranchCreds.findOne({
      where: { Godw_Code: BranchId },
    });
    const BranchDmsData = await BranchDms.findOne({
      where: { Godw_Code: BranchId },
    });
    const BranchLedgData = await BranchLedg.findOne({
      where: { Godw_Code: BranchId },
    });

    const data = {
      BranchMst: BranchMstData,
      BranchCreds: BranchCredsData,
      BranchDms: BranchDmsData,
      BranchLedg: BranchLedgData,
    };

    await sequelize.close();
    res.status(200).send({ success: true, data });
  } catch (e) {
    await sequelize.close();
    console.log(e);
  } finally {
        await sequelize.close();
    }
};

exports.findAllBranchByEmpcode = async function (req, res) {
  const sequelize = await dbname(req, req.headers.compcode);

  try {
    const BranchMst = _GodownMst(sequelize, DataTypes);
    const CompMst = _CompMst(sequelize, DataTypes);
    const onlyShowroomBranchFlag = req.body?.onlyShowroomBranchFlag || null;

    let whereClause = "";
    let dataQuery = "";
        let data = [];

    if (onlyShowroomBranchFlag == "1" ) {
      whereClause = ` AND SALES_INTEGRATION > 0 `;


    // ✅ Step 1: Get Employee Physical Location
    const locationResult = await sequelize.query(
      `SELECT PHY_LOC_CODE FROM user_tbl WHERE Module_Code = 10 AND Export_Type < 3 AND empcode = :empcode`,
      {
        replacements: { empcode: req.body.empcode },
        type: sequelize.QueryTypes.SELECT
      }
    );

    const phyLocCode = locationResult[0]?.PHY_LOC_CODE;

    if (!phyLocCode || phyLocCode === '0' || phyLocCode === 0) {
      return res.status(400).json({
        success: false,
        message: 'Physical location is not set for this employee. Please contact HR for assistance.'
      });
    }

    // ✅ Step 2: Get phy_loc_fixed flag from COMP_KEYDATA
    const phyLocFixedResult = await sequelize.query(`SELECT phy_loc_fixed FROM COMP_KEYDATA`);
    const phyLocFixed = phyLocFixedResult[0][0]?.phy_loc_fixed;

    
    console.log("phyLocFixed",phyLocFixed);

    if (!phyLocFixed || phyLocFixed === '0' || phyLocFixed === 0 ) {
      // 🔄 Dynamic location based on multi_loc
      if (req.body.empcode != null) {
        dataQuery = `
          SELECT Comp_Code, Godw_Code, Godw_Name
          FROM godown_mst
          WHERE godw_code IN (
            SELECT LTRIM(RTRIM(m.value('.', 'VARCHAR(8000)'))) AS value
            FROM user_tbl
            CROSS APPLY (
                SELECT CAST('<x>' + REPLACE(multi_loc, ',', '</x><x>') + '</x>' AS XML)
            ) AS t(x)
            CROSS APPLY t.x.nodes('/x') AS a(m)
            WHERE empcode = :empcode
              AND export_type < 3 
              AND module_code = 10
          )
          AND (export_type < 3 OR export_type = 50)
          ${whereClause}
          ORDER BY Godw_Code;
        `;

        data = await sequelize.query(dataQuery, {
          replacements: { empcode: req.body.empcode },
          type: sequelize.QueryTypes.SELECT
        });
      }
    } else {

      // Example: Suppose second column is location type
      const locationTypeData = await sequelize.query(
        `select Misc_Code,Misc_Name,Misc_HOD from misc_mst where Misc_Type = 631  and Export_Type <3 and Misc_Code = :phyLocCode`,
        {
          replacements: { phyLocCode },
          type: sequelize.QueryTypes.SELECT
        }
      );
       console.log("locationTypeData",locationTypeData);
      // ✅ Static location — fetch two separate columns here

      const branchData = await sequelize.query(
        `SELECT Godw_Code as value, Godw_Name as label
         FROM godown_mst 
         WHERE Godw_Code = :godwCode 
         AND (export_type < 3 OR export_type = 50)
         `,
        {
          replacements: { godwCode: locationTypeData[0].Misc_HOD },
          type: sequelize.QueryTypes.SELECT
        }
      );

      console.log(branchData,"branchData");
      console.log("locationTypeData",locationTypeData);

      // You can merge or return both separately based on your frontend expectation
      await sequelize.close();
      return res.status(200).send({
        success: true,
        branchData:branchData,
        locationTypeData:locationTypeData
      });
    }
  }else if(onlyShowroomBranchFlag == "2"){
    whereClause = ` AND SALES_INTEGRATION > 0 `;
    dataQuery = `
          SELECT Comp_Code, Godw_Code, Godw_Name
          FROM godown_mst
          WHERE 
          (export_type < 3 OR export_type = 50)
          ${whereClause}
          ORDER BY Godw_Code;
        `;

        data = await sequelize.query(dataQuery, {
          type: sequelize.QueryTypes.SELECT
        });
  }
  
    // 🔁 Get company master
    const comp = await CompMst.findAll();

    await sequelize.close();

    if (!data || data.length === 0) {
      return res.status(200).send({ success: false, message: "No data found" });
    }

    // 🧠 Prepare map for company names
    const compMap = comp.reduce((map, comp) => {
      map[comp.Comp_Code] = comp.Comp_Name;
      return map;
    }, {});

    // 🧱 Grouped branch data
    const aggregatedData = {};
    data.forEach((branch) => {
      if (!aggregatedData[branch.Comp_Code]) {
        aggregatedData[branch.Comp_Code] = {
          Comp_Code: branch.Comp_Code,
          Comp_Name: compMap[branch.Comp_Code],
          branch: []
        };
      }

      aggregatedData[branch.Comp_Code].branch.push({
        value: branch.Godw_Code,
        label: branch.Godw_Name
      });
    });

    const responseData = Object.values(aggregatedData);

    return res.status(200).send({ success: true, data: responseData });

  } catch (e) {
    await sequelize?.close();
    console.error("Branch API error:", e);
    return res.status(500).send({ success: false, message: "Internal Server Error" });
  } finally {
        await sequelize.close();
    }
};

exports.findAllBranchListByEmpcode = async function (req, res) {
  const sequelize = await dbname(req, req.headers.compcode);

  try {
        let dataQuery = "";
        let data = [];
   
      if (req.body.empcode != null) {
        dataQuery = `
          SELECT Comp_Code, Godw_Code as value, Godw_Name as label
          FROM godown_mst
          WHERE godw_code IN (
            SELECT LTRIM(RTRIM(m.value('.', 'VARCHAR(8000)'))) AS value
            FROM user_tbl
            CROSS APPLY (
                SELECT CAST('<x>' + REPLACE(multi_loc, ',', '</x><x>') + '</x>' AS XML)
            ) AS t(x)
            CROSS APPLY t.x.nodes('/x') AS a(m)
            WHERE empcode = :empcode
              AND export_type < 3 
              AND module_code = 10
          )
          AND (export_type < 3 OR export_type = 50)
          ORDER BY Godw_Code;
        `;

        data = await sequelize.query(dataQuery, {
          replacements: { empcode: req.body.empcode },
          type: sequelize.QueryTypes.SELECT
        });
      }
  

    await sequelize.close();

    if (!data || data.length === 0) {
      return res.status(200).send({ success: false, message: "No data found" });
    }

  

    return res.status(200).send({ success: true, branchData: data });

  } catch (e) {
    await sequelize?.close();
    console.error("Branch API error:", e);
    return res.status(500).send({ success: false, message: "Internal Server Error" });
  } finally {
        await sequelize.close();
    }
};


exports.findPhysicalLocationByLocCode = async function (req, res) {
  const sequelize = await dbname(req, req.headers.compcode);
  try {
    const empcode = req.body?.empcode;

    // Get user's selected physical location
    const physicalLocation = await sequelize.query(`
      select PHY_LOC_CODE 
      from user_tbl 
      where empcode = '${empcode}' and Module_Code = 10 and Export_Type < 3
    `);

    let selectedValue = null;

    if (physicalLocation[0]?.length > 0) {
      selectedValue = physicalLocation[0][0]?.PHY_LOC_CODE;
    }

    // Always fetch full list
    const allLocations = await sequelize.query(`
      select Misc_Code as value, Misc_Name as label 
      from Misc_Mst 
      where Misc_Type = 631 
        and Misc_HOD = ${req.body.value} 
        and export_type < 3
    `);

    await sequelize.close();

    console.log("selectedValue",selectedValue)

    if (allLocations[0].length === 0) {
      return res.status(200).send({ Status: false, Message: "No data found" });
    }

    return res.status(200).send({
      Status: true,
      selectedValue: selectedValue,   // this will be used in frontend to pre-select
      Result: allLocations[0]         // full list for adapter
    });

  } catch (e) {
    await sequelize?.close();
    console.log(e);
    return res.status(500).send({ Status: false, Message: "Internal Server Error" });
  } finally {
        await sequelize.close();
    }
};

exports.findPhysicalLocationList = async function (req, res) {
  const sequelize = await dbname(req, req.headers.compcode);
  console.log(req.body.value);
  try {
    let resultData = [];
    if (resultData.length === 0) {
      const allLocations = await sequelize.query(`
        select Misc_Code as value, Misc_Name as label 
        from Misc_Mst 
        where Misc_Type = 631 
          and Misc_HOD = ${req.body.value} 
          and export_type < 3
      `);
      resultData = allLocations[0];
    }

    await sequelize.close();

    console.log(resultData,"resultdata")

    if (!resultData || resultData.length === 0) {
      return res.status(200).send({ Status: false, Message: "No data found" });
    }

    return res.status(200).send({ Status: true, data: resultData });

  } catch (e) {
    await sequelize?.close();
    console.log(e);
    return res.status(500).send({ Status: false, Message: "Internal Server Error" });
  } finally {
        await sequelize.close();
    }
};

exports.getAccountingLocation = async function (req, res) {
  const sequelize = await dbname(req, req.headers.compcode);
  console.log(req.body.misc_code);
  try {
      const [AccLocation] = await sequelize.query(`
        select Misc_Hod as value,
        (select top 1 Godw_Name from Godown_mst where godw_code=Misc_Hod and export_type<3)as label
        from Misc_Mst 
        where Misc_Type = 85 
          and Misc_Code = ${req.body.misc_code} 
          and export_type < 3
      `);
     

    await sequelize.close();

    console.log(AccLocation,"AccLocation")

    return res.status(200).send({ Status: true, data: AccLocation });

  } catch (e) {
    await sequelize?.close();
    console.log(e);
    return res.status(500).send({ Status: false, Message: "Internal Server Error" });
  } finally {
        await sequelize.close();
    }
};

exports.getHRLocation = async function (req, res) {
  const sequelize = await dbname(req, req.headers.compcode);
  console.log(req.body.gown_code);
  try {
      const [HRLocation] = await sequelize.query(`
        select Misc_Code as value,
        Misc_Name as label
        from Misc_Mst 
        where Misc_Type = 85 
          and Misc_Hod = ${req.body.gown_code} 
          and export_type < 3
      `);
     

    await sequelize.close();

    console.log(HRLocation,"HRLocation")

    return res.status(200).send({ Status: true, data: HRLocation });

  } catch (e) {
    await sequelize?.close();
    console.log(e);
    return res.status(500).send({ Status: false, Message: "Internal Server Error" });
  } finally {
        await sequelize.close();
    }
};


