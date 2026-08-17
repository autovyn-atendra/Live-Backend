const {
  Sequelize,
  DataTypes,
  literal,
  Op,
  fn,
  col,
  where,
} = require("sequelize");
const { dbname } = require("../utils/dbconfig");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");
const { _ReleaseNote, _YoutubeUrl } = require("../models/releaseNote");
const { _UserTbl, userTblSchema } = require("../models/UserTbl");
const { _Employeemaster } = require("../models/Employeemaster");
const {
  _ApprovalMatrix,
  approvalMatrixSchema,
} = require("../models/ApprovalMatrix");
const { _MandatoryFields } = require("../models/MandatoryFields");
const { _WhatsAppMessages } = require("../models/WhatsAppMessages");
const { _WhatsAppUserConsent } = require("../models/WhatsappAppuserconsent");
const { _WhatsappRights, WhatsappRightsSchema } = require("../models/WhatsappRights");
const { _MSGTEMPLATE, MSGTEMPLATESchema } = require("../models/msg_template");
const {
  _DepartmentBranchApprovalMatrix,
} = require("../models/Department_Branch_Approval_Matrix");

const _UserRights = require("../models/UserRights");
const _MobileRights = require("../models/MobileRights");
const _USER_BANK = require("../models/UserBank");
const { dbauthenticate } = require("../utils/dbauthenticate");
const { _MiscMst } = require("../models/MiscMst");

const { _TID_MST } = require("../models/TID_MST");
const { _TID_DTL } = require("../models/TID_DTL");
const ExcelJS = require("exceljs");


const BranchNameAndDepartment = [
  { value: "Purchase_Request", label: "Purchase_Request" },
  { value: "expense", label: "expense" },
];
const FormData = require("form-data");
const { _UserCloudActHst, UserCloudActHstSchema } = require("../models/UserCloudActHst");
const { _UserMobActHst } = require("../models/UserMobActHst");
const nodemailer = require("nodemailer");
const { object } = require("joi");
const { WHATSAPP_API_USERID, WHATSAPP_API_RPASSWORD, FILE_UPLOAD_BASE_URL } = require("../config/envConfig");


const moduleName = [
  { value: "attdence", label: "ATTENDANCE" },
  { value: "misspunch", label: "MISS PUNCH" },
  { value: "leave", label: "LEAVE" },
  { value: "discount", label: "DISCOUNT" },
  { value: "gatepass", label: "GATEPASS" },
  { value: "BookingRefund", label: "BOOKING REFUND" },
  { value: "EXPENSE", label: "EXPENSE MANAGEMENT" },
  { value: "Fuel", label: "FUEL" },
  { value: "AssetIssue", label: "ASSET ISSUE" },
  { value: "AssetService", label: "ASSET SERVICE" },
  { value: "Asset", label: "ASSET" },
  { value: "SpecialAprAsset", label: "SPECIAL PURCHASE INVENTORY" },
  { value: "Payment_Tracker", label: "PAYMENT TRACKER" },
  { value: "Deal_Sheet", label: "DEAL SHEET" },
  { value: "democar", label: "DEMOCAR GATEPASS" },
  { value: "ICM", label: "ICM" },
  { value: "MGA", label: "MGA" },
  { value: "EmpSalary", label: "EMP SALARY" },
  { value: "Lead_Management", label: "LEAD MANAGEMENT" },
  { value: "petty_cash", label: "PETTY CASH" },
  { value: "StockManagement", label: "STOCK MANAGEMENT" },
  { value: "Shift", label: "SHIFT APPROVER" },
  { value: "compoff", label: "COMP OFF" },
  { value: "loan", label: "LOAN & ADVANCE" },
  { value: "Cancel Booking", label: "CANCEL BOOKING" },
  { value: "Slry_Paid_Days_Deviation", label: "Salary Paid Days Deviation" },
  { value: "vendor", label: "VENDOR MASTER" },
  { value: "ExcessBookingRefund", label: "EXCESS BOOKING REFUND" },
  { value: "Letter", label: "LETTER PRINT" },
  { value: "EMP_LOC_TRANSFER", label: "Employee Location Transfer" }
];

async function getWabaTemplateFromAutoVyn(templateName) {
  try {
    const sequelize = await dbname("", "DBCON");
    const MsgTemplate = _MSGTEMPLATE(sequelize, DataTypes);

    const result = await MsgTemplate.findOne({
      where: { AUTOVYN_TEMPLATE: templateName },
    });

    return result?.WABA_TEMPLATE || templateName; // fallback to original if not found
  } catch (err) {
    console.error("Error fetching WABA_TEMPLATE:", err)
    return templateName; // fallback to original
  }
}

async function SendWhatsAppMessgaeHindi(
  DLR_ID,
  number,
  template,
  parameter,
  tokenex
) {
  if (!DLR_ID) {
    return false;
  }
  if (!/^\d+$/.test(number) || number.length != 10 || !number) {
    return false;
  }
  // return true
  parameter.forEach((item) => {
    if (typeof item.text !== "string") {
      // Check if the text property is not already a string
      item.text = String(item.text); // Convert the value to a string
    }
    if (item.text.trim() === "") {
      item.text = item.text ? String(item.text) : "N/A";
    }
  });

  const resolvedTemplate = await getWabaTemplateFromAutoVyn(template);

  // console.log("Resolved WABA Template:", resolvedTemplate);
  // console.log(parameter);
  let messagejson = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: `91${number}`,
    type: "template",
    template: {
      name: resolvedTemplate?.toLowerCase(),
      language: {
        code: "hi",
      },
      components: [
        {
          type: "body",
          parameters: parameter,
        },
      ],
    },
  };
  try {
    if (!whatsappmsgAuth) {
      await getauthtoken();
    }
    const abcd2 = await axios.post(
      "https://messagingapi.charteredinfo.com/v19.0/442952878893870/messages",
      messagejson,
      {
        headers: {
          Authorization: `Bearer ${whatsappmsgAuth}`,
        },
      }
    );
    // console.log(abcd2.data);
    try {
      const sequelizeForWhatsapp = await dbname("", "DBCON");
      const WaHstWeb = _WhatsAppMessages(sequelizeForWhatsapp, DataTypes);
      if (abcd2.data?.messages[0]?.id) {
        await WaHstWeb.create({
          wamid: abcd2.data?.messages[0]?.id,
          DLR_ID: DLR_ID?.split("-")[0],
        });
      }
    } catch (e) { }
    return true;
  } catch (e) {
    if (tokenex == 1) {
      return false;
    } else {
      const data = await getauthtoken();
      if (data)
        await SendWhatsAppMessgaeHindi(DLR_ID, number, template, parameter, 1);
      console.log(e);
    }
  }
}
exports.SendWhatsAppMessgaeHindi = SendWhatsAppMessgaeHindi;

exports.findOne = async function (req, res) {
  let sequelize;
  try {
    sequelize = await dbname(req, req.headers.compcode);
    var UserTbl = _UserTbl(sequelize, DataTypes);
    var RightsTbl = _UserRights(sequelize, DataTypes);

    const userId = req.params.id;

    // console.log(userId, 'userIduserIduserId')
    const userCredsData = await UserTbl.findOne({
      where: {
        User_Code: userId,
        Export_Type: 1,
        Module_Code: 10,
      },
    });
    if (!userCredsData) {
      return res
        .status(401)
        .send({ success: "false", message: "No data found" });
    }
    const userRightsData = await RightsTbl.findAll({
      where: {
        User_Code: userId,
        Module_Code: 10,
      },
    });
    const userBasedRights = await RightsTbl.findAll({
      where: {
        User_Code: userId,
        Module_Code: 99,
      },
    });
    const rights = userRightsData.map((item) => item.Optn_Name);
    const rights1 = userBasedRights.map((item) => item.Optn_Name);
    const moduleCode =
      userRightsData.length > 0 ? userRightsData[0].Module_Code : null;
    const moduleCode1 =
      userBasedRights.length > 0 ? userBasedRights[0].Module_Code : null;
    const formattedUserRights = {
      rights,
      Module_Code: moduleCode,
    };
    const formattedUserRights1 = {
      rights1,
      Module_Code: moduleCode1,
    };
    const data = {
      UTD: userCredsData.UTD,
      isActive: userCredsData.Export_Type == 1 ? 1 : 0,
      UserTbl: userCredsData,
      userRights: formattedUserRights,
      userBasedRights: formattedUserRights1,
    };

    console.log(data, "data");
    await sequelize.close();
    res.status(200).send({ success: true, data });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .send({ success: "false", message: "Internal Server Error" });
  } finally {
    await sequelize.close()
  }
};
exports.findAll = async function (req, res) {
  const sequelize = await dbname(req, req.headers.compcode);
  try {
    const user = req.body.user_id ? `${req.body.user_id}` : null;
    var UserTbl = _UserTbl(sequelize, DataTypes);
    var RightsTbl = _UserRights(sequelize, DataTypes);

    const dataWhere = {
      Export_Type: 1,
      Module_Code: 10,
    };

    const data1Where = {
      Export_Type: 1,
      Module_Code: {
        [Sequelize.Op.not]: 10,
      },
    };

    // Agar admin nahi hai to User_Code = 1 hide kar do
    if (user != 1) {
      dataWhere.User_Code = {
        [Sequelize.Op.ne]: 1,
      };

      data1Where.User_Code = {
        [Sequelize.Op.ne]: 1,
      };
    }

    const data = await UserTbl.findAll({
      attributes: [
        ["User_Code", "value"],
        ["User_Name", "label"],
      ],
      where: dataWhere,
    });

    const data1 = await UserTbl.findAll({
      attributes: [
        ["User_Code", "value"],
        ["User_Name", "label"],
      ],
      where: data1Where,
    });
    const userRightsData = await RightsTbl.findAll({
      where: {
        User_Code: "-3",
        Module_Code: 10,
        Comp_Usercode: user,
      },
    });
    const userRightsDataofuser = await RightsTbl.findAll({
      where: {
        User_Code: "-3",
        Module_Code: 99,
        Comp_Usercode: user,
      },
    });

    // console.log(userRightsDataofuser, 'userRightsDataofuser')
    const rights = userRightsData.map((item) => item.Optn_Name);
    const rightsofuser = userRightsDataofuser.map((item) => item.Optn_Name);

    if (!data) {
      return res.status(500).send({ success: false, message: "No data found" });
    }
    return res
      .status(200)
      .send({ success: true, data, data1, rights, rightsofuser });
  } catch (e) {
    console.log(e);
  } finally {
    await sequelize.close();
  }
};
// Test the database connection and perform insert operations
exports.insertData = async function (req, res) {
  const userData = req.body;
  const sequelize = await dbname(req, req.headers.compcode);
  const t = await sequelize.transaction();
  var User_Tbl = _UserTbl(sequelize, DataTypes);
  var RightsTbl = _UserRights(sequelize, DataTypes);
  try {
    let { UserTbl, UTD } = userData;
    UserTbl.User_Name = UserTbl.User_Name?.trim();
    UserTbl.EMPCODE = UserTbl.EMPCODE?.trim();
    if (!UserTbl?.Multi_loc)
      return res
        .status(500)
        .send({ success: false, message: "Please select Location" });
    const { error, value } = userTblSchema.validate(UserTbl, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const errorMessage = error.details.map((err) => err.message).join(", ");
      return res.status(400).send({ success: false, message: errorMessage });
    }
    UserTbl = value;

    const existingUser = await User_Tbl.findOne({
      where: {
        user_name: UserTbl.User_Name,
        Module_Code: 10, // Assuming user_name is the column name for username
      },
    });
    if (existingUser) {
      return res
        .status(500)
        .send({ success: false, message: "Username already exists." });
    }
    // const hashedPassword = await bcrypt.hash(UserTbl.User_Pwd, 10); // Adjust the salt rounds as needed
    // UserTbl.Password = hashedPassword;
    const maxUser = await sequelize.query(
      `select isnull(max(user_code)+1,1) as maxUserCode from user_tbl`,
      { transaction: t }
    );

    if (userData.userBasedRights?.UbR?.includes("13.3.1")) {
      UserTbl.Emp_Pos = 99;
    }

    const userCreds1 = await User_Tbl.create(
      {
        ...UserTbl,
        User_Code: maxUser[0][0]?.maxUserCode,
        Export_Type: req.body.isActive == 1 ? 1 : 3,
      },
      {
        transaction: t,
      }
    );

    // console.log(userData, 'userDatauserDatauserDatauserData')
    const rightsData = userData.userRights.rights
      .filter((right) => right?.length > 4)
      .map((right) => ({
        User_Code: maxUser[0][0]?.maxUserCode,
        Optn_Name: right,
        Module_Code: userData.userRights.Module_Code,
      }));
    const UrB = userData.userBasedRights.UbR.filter(
      (right) => right?.length > 4
    ).map((right) => ({
      User_Code: maxUser[0][0]?.maxUserCode,
      Optn_Name: right,
      Module_Code: userData.userBasedRights.Module_Code,
    }));

    const a = [...rightsData, ...UrB];
    await RightsTbl.bulkCreate(a, { transaction: t });
    await t.commit();
    let Message = `User Created successfully on User Code : ${maxUser[0][0].maxUserCode}`;
    res.status(200).send({
      Message: Message,
    });
  } catch (e) {
    await t.rollback();
    console.log(e);
    res.status(500).send({
      success: false,
      message: "An error occurred while creating user.",
    });
  } finally {
    await sequelize.close();
  }
};


exports.updateDataforuser = async function (req, res) {

  const {
    User: { UTD, isActive, UserTbl, userRights, userBasedRights },
    LoginUser: adminUserCode,
  } = req.body;
  UserTbl.User_Name = UserTbl?.User_Name?.trim();
  UserTbl.EMPCODE = UserTbl?.EMPCODE?.trim();

  if (!UTD)
    return res
      .status(500)
      .send({ success: false, message: "UTD is Mandatory" });

  if (!UserTbl?.Multi_loc)
    return res
      .status(500)
      .send({ success: false, message: "Please select Location" });

  const sequelize = await dbname(req, req.headers.compcode);
  const t = await sequelize.transaction();

  const User_Tbl = _UserTbl(sequelize, DataTypes);
  const RightsTbl = _UserRights(sequelize, DataTypes);

  try {
    const maxUser = await sequelize.query(
      `SELECT * FROM user_tbl WHERE user_name = '${UserTbl.User_Name}' AND user_code NOT IN (${UserTbl.User_Code}) AND module_code = 10 AND export_type < 5`,
      { transaction: t }
    );

    if (maxUser[1] > 0) {
      return res
        .status(500)
        .send({ success: false, message: "Username already exists." });
    }

    const { error, value } = userTblSchema.validate(UserTbl, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details.map((err) => err.message).join(", ");
      return res.status(400).send({ success: false, message: errorMessage });
    }

    const validatedUserTbl = value;

    const existingUser = await sequelize.query(
      `SELECT * FROM user_tbl WHERE utd = ${UTD} AND export_type < 4`
    );

    if (!existingUser[0]?.length) {
      return res.status(500).send({
        success: false,
        message: "No user found with the provided UTD.",
      });
    }

    const { UTD: _, ...newUserTbl } = existingUser[0][0];
    await User_Tbl.create({ ...newUserTbl, Export_Type: 33 });

    if (userBasedRights?.UbR?.includes("13.3.1")) {
      validatedUserTbl.Emp_Pos = 99;
    } else {
      validatedUserTbl.Emp_Pos = null;
    }

    await User_Tbl.update(
      { ...validatedUserTbl, Export_Type: isActive == 1 ? 1 : 3 },
      { where: { UTD }, transaction: t }
    );

    const rightsData =
      userRights?.rights
        ?.filter((right) => right?.length > 4)
        ?.map((right) => ({
          User_Code: existingUser[0][0]?.User_Code,
          Optn_Name: right,
          Module_Code: userRights.Module_Code,
        })) || [];

    const UrB =
      userBasedRights?.UbR?.filter((right) => right?.length > 4)?.map(
        (right) => ({
          User_Code: existingUser[0][0]?.User_Code,
          Optn_Name: right,
          Module_Code: userBasedRights.Module_Code,
        })
      ) || [];

    const requestedRights = [...rightsData, ...UrB];
    const requestedRightKeys = new Set(
      requestedRights.map((r) => `${r.Module_Code}::${r.Optn_Name}`)
    );
    const targetUserCode = existingUser[0][0]?.User_Code;

    // Get admin's rights
    const adminRights = await RightsTbl.findAll({
      where: { User_Code: adminUserCode },
      transaction: t,
    });
    const adminRightMap = new Set(
      adminRights.map((r) => `${r.Module_Code}::${r.Optn_Name}`)
    );

    // Get target user's current rights
    const taraRights = await RightsTbl.findAll({
      where: { User_Code: targetUserCode },
      transaction: t,
    });

    // Remove rights that admin has and are unchecked in request
    for (const right of taraRights) {
  const rKey = `${right.Module_Code}::${right.Optn_Name}`;
  if (!requestedRightKeys.has(rKey)) {
    await right.destroy({ transaction: t });
  }
}

    // Add/update new rights
    for (const entry of requestedRights) {
      // const rKey = `${entry.Module_Code}::${entry.Optn_Name}`;
      // if (!adminRightMap.has(rKey)) {
      //   // console.log(`Skipping ${rKey} — not authorized`);
      //   continue;
      // }

      const [right, created] = await RightsTbl.findOrCreate({
        where: {
          User_Code: targetUserCode,
          Optn_Name: entry.Optn_Name,
        },
        defaults: {
          Module_Code: entry.Module_Code,
        },
        transaction: t,
      });

      if (!created && right.Module_Code !== entry.Module_Code) {
        await right.update(
          { Module_Code: entry.Module_Code },
          { transaction: t }
        );
      }
    }

    await t.commit();
    res
      .status(200)
      .send({ success: true, message: "User data Updated successfully" });
  } catch (e) {
    console.error(e);
    await t.rollback();
    res.status(500).send({
      success: false,
      message: "An error occurred while updating user.",
    });
  } finally {
    await sequelize.close();
  }
};

exports.updateData = async function (req, res) {
  const userData = req.body;
  let { UserTbl, UTD } = userData;
  UserTbl.User_Name = UserTbl.User_Name?.trim();
  UserTbl.EMPCODE = UserTbl.EMPCODE?.trim();
  if (!UTD)
    return res
      .status(500)
      .send({ success: false, message: "UTD is Mandatory" });
  if (!UserTbl?.Multi_loc)
    return res
      .status(500)
      .send({ success: false, message: "Please select Location" });
  const sequelize = await dbname(req, req.headers.compcode);
  const t = await sequelize.transaction();
  var User_Tbl = _UserTbl(sequelize, DataTypes);
  var RightsTbl = _UserRights(sequelize, DataTypes);
  const maxUser = await sequelize.query(
    `select *  from user_tbl where user_name = '${UserTbl.User_Name}' and user_code not in (${UserTbl.User_Code}) and module_code = 10 and export_type<5`,
    { transaction: t }
  );
  try {
    if (maxUser[1] > 0) {
      return res
        .status(500)
        .send({ success: false, message: "Username already exists." });
    }
    // if (UserTbl.User_Pwd && UserTbl?.User_Pwd?.length !== 60) {
    //   const hashedPassword = await bcrypt.hash(UserTbl.User_Pwd, 10);
    //   UserTbl.User_Pwd = hashedPassword;
    // }
    const { error, value } = userTblSchema.validate(UserTbl, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const errorMessage = error.details.map((err) => err.message).join(", ");
      return res.status(400).send({ success: false, message: errorMessage });
    }
    UserTbl = value;

    console.log(userData, "userData");
    if (userData.userBasedRights?.UbR?.includes("13.3.1")) {
      UserTbl.Emp_Pos = 99;
    } else {
      UserTbl.Emp_Pos = null;
    }

    // console.log(userData, 'userDatauserData')
    const existingUser = await sequelize.query(
      `select * from user_tbl where utd = ${UTD} and export_type < 4`
    );
    if (!existingUser[0]?.length) {
      return res.status(500).send({
        success: false,
        message: "No user found with the provided UTD.",
      });
    } else {
      const { UTD, ...newUserTbl } = existingUser[0][0];
      await User_Tbl.create(
        { ...newUserTbl, Export_Type: 33 }
        // { transaction: t }
      );
    }

    await User_Tbl.update(
      { ...UserTbl, Export_Type: req.body.isActive == 1 ? 1 : 3 },
      { where: { UTD } },
      { transaction: t }
    );

    await RightsTbl.destroy(
      { where: { User_Code: existingUser[0][0]?.User_Code } },
      { transaction: t }
    );

    const rightsData = userData.userRights.rights
      .filter((right) => right?.length > 4)
      .map((right) => ({
        User_Code: existingUser[0][0]?.User_Code,
        Optn_Name: right,
        Module_Code: userData.userRights.Module_Code,
      }));
    const UrB = userData.userBasedRights.UbR.filter(
      (right) => right?.length > 4
    ).map((right) => ({
      User_Code: existingUser[0][0]?.User_Code,
      Optn_Name: right,
      Module_Code: userData.userBasedRights.Module_Code,
    }));

    const a = [...rightsData, ...UrB];
    await RightsTbl.bulkCreate(a, { transaction: t });
    await t.commit();
    let Message = `User data Updated successfully`;
    res.status(200).send({
      Message: Message,
    });
  } catch (e) {
    console.log(e);
    await t.rollback();
    res.status(500).send({
      success: false,
      message: "An error occurred while creating user.",
    });
  } finally {
    await sequelize.close();
  }
};

// Sample data

exports.passwordChange = async function (req, res) {
  const { username, password, newpassword } = req.body;
  let sequelize;
  try {
    sequelize = await dbname(req, req.headers.compcode);
    const t = await sequelize.transaction();
    var User_Tbl = _UserTbl(sequelize, DataTypes);

    const existingUser = await sequelize.query(
      `select *  from user_tbl where user_code = '${username}' and User_Pwd = '${password}' and module_code = 10 and export_type = 1`
    );
    try {
      if (existingUser[1] == 0) {
        return res.status(500).send({
          Message: "incorrect current password",
        });
      }
      await User_Tbl.update(
        { Last_PWD: password, User_Pwd: newpassword },
        { where: { UTD: existingUser[0][0].UTD } },
        { transaction: t }
      );

      await t.commit();
      let Message = `User data Updated successfully`;
      return res.status(200).send({
        Message: Message,
      });
    } catch (e) {
      console.log(e);
      await t.rollback();
      return res.status(500).send({
        success: false,
        message: "An error occurred while creating user.",
      });
    } finally {
      await sequelize.close();
      // console.log("Connection has been closed.");
    }
  } catch (e) {
    console.log(e);
    await t.rollback();
    return res.status(500).send({
      success: false,
      message: "An error occurred while creating user.",
    });
  } finally {
    await sequelize.close()
  }
};
exports.getyear = async function (req, res) {
  const sequelize = await dbname(req, req.headers.compcode);
  try {
    const db = sequelize.config.database?.slice(0, 6);
    const new_database = await sequelize.query(
      `select name , RIGHT(name,2) as year from sys.databases where name like '%${db}%' order by year desc`
    );

    res.status(200).send({ year: new_database[0] });
  } catch (e) {
    console.log(e);
    res.status(500).send({ year: { year: null } });
  } finally {
    if (sequelize) {
      await sequelize.close();
    }
  }
};
exports.approvalmatrix = async function (req, res) {
  let ApprovalMatrix = req.body;
  let { UTD, module_code, empcode, Created_by } = ApprovalMatrix;
  const sequelize = await dbname(req, req.headers.compcode);
  const t = await sequelize.transaction();
  var Approval_Matrix = _ApprovalMatrix(sequelize, DataTypes);

  try {
    const { error, value } = approvalMatrixSchema.validate(ApprovalMatrix, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const errorMessage = error.details.map((err) => err.message).join(", ");
      return res.status(400).send({ success: false, message: errorMessage });
    }
    ApprovalMatrix = value;
    let Message = `ApprovalMatrix Updated successfully`;
    const ApprovalData = await Approval_Matrix.findOne({
      where: {
        module_code,
        empcode,
      },
    });
    if (UTD) {
      delete ApprovalMatrix.module_code;
      delete ApprovalMatrix.empcode;
      await Approval_Matrix.update(
        { ...ApprovalMatrix, Created_by },
        { where: { UTD } },
        { transaction: t }
      );
      Message = `ApprovalMatrix Updated successfully`;
    } else {
      if (ApprovalData) {
        return res
          .status(401)
          .send({ success: "false", message: "UTD Required for this case" });
      }
      await Approval_Matrix.create(
        { ...ApprovalMatrix, Created_by },
        { transaction: t }
      );
      Message = `ApprovalMatrix Created successfully`;
    }

    await t.commit();
    res.status(200).send({
      Message: Message,
    });
  } catch (e) {
    console.log(e);
    await t.rollback();
    res.status(500).send({
      success: false,
      message: "An error occurred while creating user.",
    });
  } finally {
    await sequelize.close();
  }
};
exports.login = async function (req, res) {
  let { User_Name, Password, Year } = req.body;
  let sequelize;
  try {
    sequelize = await dbname(req, req.headers.compcode);
    const t = await sequelize.transaction();
    var User_Tbl = _UserTbl(sequelize, DataTypes);
    var RightsTbl = _UserRights(sequelize, DataTypes);
    const user = await User_Tbl.findOne({
      where: {
        User_Name: User_Name,
        Module_Code: 10,
        Export_Type: 1,
      },
    });

    if (!user) {
      res.status(500).send({ data: "user not found" });
    } else if (
      user.User_Pwd.toLowerCase() == Password.toLowerCase() &&
      user.User_Name.toUpperCase() == User_Name.toUpperCase()
    ) {
      const payload = { User_Code: user.User_Code, User_Name: user.User_Name };
      const email = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: "8h",
      }); // Change your-secret-key
      const name = user.User_Name;
      const id = user.User_Code;
      const EMPCODE = user.EMPCODE;
      const emp_dms_code = user.emp_dms_code;
      const multi = user.Multi_loc;
      const Phy_Loc = user.phy_loc;
      const userRightsData = await RightsTbl.findAll({
        where: { User_Code: id },
      });
      const rights = userRightsData
        .filter((item) => item.Module_Code === 10)
        .map((item) => item.Optn_Name?.trim());
      const role = rights;
      const rights1 = userRightsData
        .filter((item) => item.Module_Code === 99)
        .map((item) => item.Optn_Name);

      const role1 = rights1;

      const AutoVynRights = await sequelize.query(`
select GST_Lock_Date , INPUT_GST_Lock_Date from user_tbl where 
User_Code in (SELECT ERP_User_Code FROM User_tbl WHERE Export_type =1 AND Module_Code = 10 AND User_Code = ${id}) AND Export_type =1`);

      const DealerRights = await RightsTbl.findAll({
        where: {
          User_Code: -1,
          Module_Code: 50,
        },
      });

      const sql = `
      SELECT shortcut, url 
      FROM user_shortcuts 
      WHERE usercode = ?;
    `;

      const [Comp_KeyData] = await sequelize.query(
        `SELECT ISNULL(DEMOCAR_OTP, 0) AS DemoCar_Otp, ISNULL(Banking_Payment_Link, 0) AS Banking_Payment_Link, ISNULL(GP_KM_IMG, 0) AS GP_KM_IMG, ISNULL(FINANCE_PAYMENT_MODE, 0) AS FINANCE_PAYMENT_MODE, ISNULL(FINANCE_DATE, 0) AS FINANCE_DATE, ISNULL(PO_Automail, 0) AS PO_Automail, ISNULL(EmpMasterOtp, 0) AS EmpMasterOtp, ISNULL(TVIICM_DELV_CHALLAN, 0) AS TVIICM_DELV_CHALLAN, ISNULL(TV_SCRAP, 0) AS TV_SCRAP, ISNULL(TV_MODLCODE, 0) AS TV_MODLCODE, ISNULL(Banking_AccountNo_Verify, 0) AS Banking_AccountNo_Verify, ISNULL(Banking_IFSC_Verfy, 0) AS Banking_IFSC_Verfy, ISNULL(Expense_Financial_Posting, 0) AS Expense_Financial_Posting, ISNULL(Digilocker_Linked, 0) AS Digilocker_Linked,  ISNULL(Discount_Appr_Column, 0) AS Discount_Appr_Column, ISNULL(FINANCE_GST_INCLUDED, 0) AS FINANCE_GST_INCLUDED, ISNULL(FINANCE_DISABLE_FIELDS, 0) AS FINANCE_DISABLE_FIELDS ,
        ISNULL(Is_Shift_PastDate_Updation, 0) AS Is_Shift_PastDate_Updation,
         ISNULL(Show_Shift_Time, 0) AS Show_Shift_Time, 
         ISNULL(By_Pass_PreInv_Approval, 0) AS By_Pass_PreInv_Approval, 
          ISNULL(STOCK_INVENTORY_QR_WIDTH, 0) AS STOCK_INVENTORY_QR_WIDTH,
          ISNULL(STOCK_INVENTORY_QR_HEIGHT, 0) AS STOCK_INVENTORY_QR_HEIGHT,
          ISNULL(TV_PENDING_EXCESS_AMT, 0) AS TV_PENDING_EXCESS_AMT,
          ISNULL(exp_mng_dept_wise, 0) AS exp_mng_dept_wise,
          ISNULL(MODEL_EDIT_FLAG, 0) AS MODEL_EDIT_FLAG,
          ISNULL(IS_ALLOTMENT_ALLOWED_AMOUNT, 0) AS IS_ALLOTMENT_ALLOWED_AMOUNT,
            ISNULL(RECEIPT_FLAG, 0) AS RECEIPT_FLAG,
           ISNULL(IS_OFFER_LAPS, 0) AS IS_OFFER_LAPS,
          ISNULL(Auto_booking, 0) AS Auto_booking,
          ISNULL(Print_flag, 0) AS Print_flag,
          ISNULL(Whatsapp_Module_Code, 0) AS Whatsapp_Module_Code,
          ISNULL(WHATSAPP_DEALER_CODE, 0) AS WHATSAPP_DEALER_CODE,
          ISNULL(IS_ADJUSTMENT, 0) AS IS_ADJUSTMENT,
          ISNULL(back_date_mipunch_allowed, 0) AS back_date_mipunch_allowed,
          ISNULL(hide_deal_frz, 0) AS hide_deal_frz,
          ISNULL(enb_summer_btn, 0) AS enb_summer_btn,
          ISNULL(QUOTATION_PDF, 0) AS QUOTATION_PDF,
          ISNULL(DEFAULT_ASSET_CATEGORY_IMAGE, 0) AS DEFAULT_ASSET_CATEGORY_IMAGE,
          ISNULL(DEFAULT_ASSET_SUBCATEGORY_IMAGE, 0) AS DEFAULT_ASSET_SUBCATEGORY_IMAGE,
          ISNULL(DEFAULT_ASSET_IMAGE, 0) AS DEFAULT_ASSET_IMAGE,
          ISNULL(expense_templates, 0) AS expense_templates,
          ISNULL(expense_template_master, 0) AS expense_template_master,
          ISNULL(mand_SL_Img, 0) AS mand_SL_Img,
          ISNULL(Mand_send_ver_message, 0) AS Mand_send_ver_message,
          ISNULL(disc_open, 0) AS disc_open
         FROM COMP_KEYDATA`
      );
      const short_results = await sequelize.query(sql, {
        replacements: [user.User_Code],
        type: sequelize.QueryTypes.SELECT,
      });

      const DemoCarOtp = Comp_KeyData[0].DemoCar_Otp;
      const PO_Automail = Comp_KeyData[0].PO_Automail;
      const Banking_Payment_Link = Comp_KeyData[0].Banking_Payment_Link;
      const expense_templates = Comp_KeyData[0].expense_templates;
      const expense_template_master = Comp_KeyData[0].expense_template_master;
      const exp_mng_dept_wise = Comp_KeyData[0].exp_mng_dept_wise;
      const GP_KM_IMG = Comp_KeyData[0].GP_KM_IMG;
      const FINANCE_PAYMENT_MODE = Comp_KeyData[0].FINANCE_PAYMENT_MODE;
      const FINANCE_DATE = Comp_KeyData[0].FINANCE_DATE;
      const EmpMasterOtp = Comp_KeyData[0].EmpMasterOtp;
      const TVIICM_DELV_CHALLAN = Comp_KeyData[0].TVIICM_DELV_CHALLAN;
      const TV_SCRAP = Comp_KeyData[0].TV_SCRAP;
      const TV_MODLCODE = Comp_KeyData[0].TV_MODLCODE;
      const Banking_AccountNo_Verify = Comp_KeyData[0].Banking_AccountNo_Verify;
      const Banking_IFSC_Verfy = Comp_KeyData[0].Banking_IFSC_Verfy;
      const Expense_Financial_Posting = Comp_KeyData[0].Expense_Financial_Posting;
      const Digilocker_Linked = Comp_KeyData[0].Digilocker_Linked;
      const Discount_Appr_Column = Comp_KeyData[0].Discount_Appr_Column;
      const FINANCE_GST_INCLUDED = Comp_KeyData[0].FINANCE_GST_INCLUDED;
      const FINANCE_DISABLE_FIELDS = Comp_KeyData[0].FINANCE_DISABLE_FIELDS;
      const Is_Shift_PastDate_Updation = Comp_KeyData[0].Is_Shift_PastDate_Updation;
      const Show_Shift_Time = Comp_KeyData[0].Show_Shift_Time;
      const By_Pass_PreInv_Approval = Comp_KeyData[0].By_Pass_PreInv_Approval;
      const STOCK_INVENTORY_QR_WIDTH = Comp_KeyData[0].STOCK_INVENTORY_QR_WIDTH;
      const STOCK_INVENTORY_QR_HEIGHT = Comp_KeyData[0].STOCK_INVENTORY_QR_HEIGHT;
      const TV_PENDING_EXCESS_AMT = Comp_KeyData[0].TV_PENDING_EXCESS_AMT;
      const MODEL_EDIT_FLAG = Comp_KeyData[0].MODEL_EDIT_FLAG;
      const IS_ALLOTMENT_ALLOWED_AMOUNT = Comp_KeyData[0].IS_ALLOTMENT_ALLOWED_AMOUNT;
      const IS_OFFER_LAPS = Comp_KeyData[0].IS_OFFER_LAPS;
      const RECEIPT_FLAG = Comp_KeyData[0].RECEIPT_FLAG;
      const Auto_booking = Comp_KeyData[0].Auto_booking;
      const Print_flag = Comp_KeyData[0].Print_flag;
      const Whatsapp_Module_Code = Comp_KeyData[0].Whatsapp_Module_Code;
      const WHATSAPP_DEALER_CODE = Comp_KeyData[0].WHATSAPP_DEALER_CODE;
      const IS_ADJUSTMENT = Comp_KeyData[0].IS_ADJUSTMENT;
      const back_date_mipunch_allowed = Comp_KeyData[0].back_date_mipunch_allowed;
      const hide_deal_frz = Comp_KeyData[0].hide_deal_frz;
      const enb_summer_btn = Comp_KeyData[0].enb_summer_btn;
      const QUOTATION_PDF = Comp_KeyData[0].QUOTATION_PDF;
      const DEFAULT_ASSET_CATEGORY_IMAGE = Comp_KeyData[0].DEFAULT_ASSET_CATEGORY_IMAGE;
      const DEFAULT_ASSET_SUBCATEGORY_IMAGE = Comp_KeyData[0].DEFAULT_ASSET_SUBCATEGORY_IMAGE;
      const DEFAULT_ASSET_IMAGE = Comp_KeyData[0].DEFAULT_ASSET_IMAGE;
      const mand_SL_Img = Comp_KeyData[0].mand_SL_Img;
      const Mand_send_ver_message = Comp_KeyData[0].Mand_send_ver_message;
      const disc_open = Comp_KeyData[0].disc_open;

      let Emp_Loc = [];
      let FinalEmp_Loc = null;

      if (user.EMPCODE != null && user.EMPCODE !== "0") {
        Emp_Loc = await sequelize.query(
          `SELECT LOCATION FROM EMPLOYEEMASTER WHERE EMPCODE = '${user.EMPCODE}'`
        );

        if (Emp_Loc[0] && Emp_Loc[0].length > 0) {
          FinalEmp_Loc = Emp_Loc[0][0].LOCATION || "0";
        }
      }

      // console.log(FinalEmp_Loc, "FinalEmp_Loc");

      // Convert array to object format like { shortcut1: url1, shortcut2: url2 }
      const shortcuts = short_results.reduce((acc, row) => {
        acc[row.shortcut] = row.url;
        return acc;
      }, {});
      const Deal = DealerRights.map((item) => item.Optn_Name);
      const Primary_Branch = user.User_Color;
      res.status(200).json({
        email,
        name,
        id,
        multi,
        Phy_Loc,
        role,
        role1,
        Comp_Code: `${req.headers.compcode}`,
        EMPCODE,
        emp_dms_code,
        DB: sequelize?.config?.database,
        AutoVynRights: AutoVynRights[0][0],
        Deal,
        Primary_Branch,
        shortcuts: shortcuts,
        DemoCarOtp,
        Banking_Payment_Link,
        exp_mng_dept_wise,
        FinalEmp_Loc,
        GP_KM_IMG,
        PO_Automail,
        FINANCE_PAYMENT_MODE,
        FINANCE_DATE,
        EmpMasterOtp,
        TVIICM_DELV_CHALLAN,
        TV_SCRAP,
        TV_MODLCODE,
        Banking_AccountNo_Verify,
        Banking_IFSC_Verfy,
        Expense_Financial_Posting,
        Digilocker_Linked,
        expense_templates,
        expense_template_master,
        Discount_Appr_Column,
        FINANCE_GST_INCLUDED,
        FINANCE_DISABLE_FIELDS,
        Is_Shift_PastDate_Updation,
        Show_Shift_Time,
        By_Pass_PreInv_Approval,
        STOCK_INVENTORY_QR_WIDTH,
        STOCK_INVENTORY_QR_HEIGHT,
        TV_PENDING_EXCESS_AMT,
        IS_ALLOTMENT_ALLOWED_AMOUNT,
        IS_OFFER_LAPS,
        RECEIPT_FLAG,
        MODEL_EDIT_FLAG,
        Auto_booking,
        Print_flag,
        Whatsapp_Module_Code,
        WHATSAPP_DEALER_CODE,
        IS_ADJUSTMENT,
        back_date_mipunch_allowed,
        hide_deal_frz,
        enb_summer_btn,
        QUOTATION_PDF,
        DEFAULT_ASSET_IMAGE,
        DEFAULT_ASSET_SUBCATEGORY_IMAGE,
        DEFAULT_ASSET_CATEGORY_IMAGE,
        mand_SL_Img,
        disc_open,
        Mand_send_ver_message,
      });
    } else {
      res.send({ data: "Incorrect Password" });
    }
  } catch (error) {
    console.log("Error logging in:", error);
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Invalid Company Code " });
  } finally {
    await sequelize.close()
  }
};
exports.BranchNameAndDepartmentapprovalmatrixfindOne = async function (
  req,
  res
) {
  const module_code = req.body.module_code;
  const branch = req.body.branch;
  const department = req.body.department;
  const sequelize = await dbname(req, req.headers.compcode);
  try {
    const [result] = await sequelize.query(`select 
      UTD,module_code,department,branch,approver1_A,approver1_B,approver1_C,approver2_A,approver2_B,approver2_C,approver3_A,approver3_B,approver3_C
      from Department_Branch_Approval_Matrix where module_code='${module_code}' and branch = '${branch}' and department='${department}'`);

    const [approval_matrix] = await sequelize.query(`select
UTD,module_code,
(select top 1 misc_name from Misc_Mst where Misc_Type=630 and Misc_Code=department and Export_Type<3)as department1,
department,
(select top 1 godw_name from godown_mst where Godw_Code=branch and Export_Type<3)as branch1,
branch,approver1_A,
approver1_B,approver1_C,approver2_A,approver2_B,
approver2_C,approver3_A,approver3_B,approver3_C
from Department_Branch_Approval_Matrix where  module_code='${module_code}' and branch='${branch}'`);
    res
      .status(200)
      .send({ result: result[0], approval_matrix: approval_matrix });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .send({ success: "false", message: "Internal Server Error" });
  } finally {
    await sequelize.close();
  }
};

exports.approvalmatrixfindOne = async function (req, res) {
  const sequelize = await dbname(req, req.headers.compcode);
  try {
    const empcode = req.body.empcode;
    const data =
      await sequelize.query(`select top 1 (select top 1 concat(godw_code , ' - ',godw_name) from godown_mst where godw_code = location ) as Location,CORPORATEMAILID,MOBILE_NO,EMPLOYEEDESIGNATION ,concat(isnull(Title,'' ) , ' ' ,EmpFirstName , ' ' + EmpLastName) AS EMPNAME
    ,(select top 1 emp_dms_code from user_tbl where empcode= '${empcode}' and export_type < 3 and module_code = 10) as emp_dms_code
    ,(select top 1 Multi_Loc from user_tbl where empcode= '${empcode}' and export_type < 3 and module_code = 10) as Multi_Loc
      from EMPLOYEEMASTER where EMPCODE='${empcode}' AND LASTWOR_DATE IS NULL`);
    const approval_data = await sequelize.query(
      `select * from approval_matrix where empcode='${empcode}' `
    );
    // console.log({ data: data[0], approval_data: approval_data[0] });
    res.status(200).send({ data: data[0][0], approval_data: approval_data[0] });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .send({ success: "false", message: "Internal Server Error" });
  } finally {
    await sequelize.close();
  }
};
exports.approvalmatrixfindOneByLocation = async function (req, res) {
  const sequelize = await dbname(req, req.headers.compcode);
  try {
    const empcode = req.body.empcode;
    const data = await sequelize.query(`
      	  select distinct location,module_code ,approver1_A,approver1_B,approver2_A,approver2_B,approver3_A,approver3_B ,count(*) as count_ from (
      select (select top 1 misc_code from misc_mst where Misc_Type = 85 and  misc_code =(select top 1 location from EMPLOYEEMASTER where empcode = ap.empcode and export_type < 3) )as location,* from Approval_Matrix ap where module_code = '${req.body.module_code}'
      ) as asd where  location in (${req.body.branch})  group by location,module_code ,approver1_A,approver1_B,approver2_A,approver2_B,approver3_A,approver3_B `);
    const data2 = await sequelize.query(`
       	  SELECT count(*) as EmployeeCount
      FROM EMPLOYEEMASTER s
      WHERE NOT EXISTS (
          SELECT 1
          FROM Approval_Matrix t
          WHERE t.empcode = s.empcode
            AND t.module_code = '${req.body.module_code}'
      ) And s.Location in (${req.body.branch})`);

    res.status(200).send({ data: data[0], data2: data2[0][0] });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .send({ success: "false", message: "Internal Server Error" });
  } finally {
    await sequelize.close();
  }
};
exports.findAllEmployee = async function (req, res) {
  const sequelize = await dbname(req, req.headers.compcode);
  try {
    console.log(req.body, "req.body");
    const data = await sequelize.query(
      `select empcode as value,Convert(varchar,EMPCODE)+space(5)+'|'+space(5)+Convert(varchar,empfirstname)+ space(1)
      + ISNULL(Convert(varchar, EMPLASTNAME), '') AS label   from EMPLOYEEMASTER where export_type < 3 and LASTWOR_DATE is null and EMPFIRSTNAME is not null and  EMPFIRSTNAME <>'' and location in (select misc_code from misc_mst where misc_hod in (${req.body.branch}) and misc_type = 85 and export_type  < 3) order by empcode`
    );
    var branch = await sequelize.query(
      `select misc_code as value , misc_name as label from misc_mst where misc_hod in (${req.body.branch}) and misc_type = 85`
    );
    var location = await sequelize.query(
      `select Godw_Code as value , Godw_Name as label from Godown_mst where godw_code in (${req.body.branch}) and (export_type < 3 or export_type = 50)`
    );

    var department = await sequelize.query(
      `select misc_code as value , misc_name as label from misc_mst  where misc_type = 671 and export_type<3`
    );

    res.status(200).send({
      data: data[0],
      branch: branch[0],
      module: moduleName,
      location: location[0],
      department: department[0],
      BranchNameAndDepartment: BranchNameAndDepartment,
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .send({ success: "false", message: "Internal Server Error" });
  } finally {
    await sequelize.close();
  }
};

exports.BranchNameAndDepartmentapprovalmatrixsave = async function (req, res) {
  const body = req.body;
  const sequelize = await dbname(req, req.headers.compcode);
  const t = await sequelize.transaction();
  var Approval_Matrix = _DepartmentBranchApprovalMatrix(sequelize, DataTypes);
  try {
    const UTD = body.UTD;
    let ApprovalMatrixdata = {
      module_code: body.module_code,
      department: body.department,
      branch: body.branch,
      approver1_A: body.approver1_A,
      approver1_B: body.approver1_B,
      approver1_C: body.approver1_C,
      approver2_A: body.approver2_A,
      approver2_B: body.approver2_B,
      approver2_C: body.approver2_C,
      approver3_A: body.approver3_A,
      approver3_B: body.approver3_B,
      approver3_C: body.approver3_C,
      Created_by: body.Created_by,
    };
    if (UTD) {
      await Approval_Matrix.update(
        ApprovalMatrixdata,
        { where: { UTD } },
        { transaction: t }
      );
      Message = `ApprovalMatrix Updated successfully`;
    } else {
      await Approval_Matrix.create(ApprovalMatrixdata, { transaction: t });
      Message = `ApprovalMatrix Created successfully`;
    }
    await t.commit();
    res.status(200).send({
      Message: Message,
    });
  } catch (e) {
    console.log(e);
    await t.rollback();
    res.status(500).send({
      success: false,
      message: "An error occurred while creating user.",
    });
  } finally {
    await sequelize.close();
  }
};
exports.findMatrixEmployees = async function (req, res) {
  const sequelize = await dbname(req, req.headers.compcode);

  try {
    if (!req.body.branch) {
      return res.status(500).send({ Message: "Branch Code required" });
    }

    if (!req.body.Module_Code) {
      return res.status(500).send({ Message: "Module_Code required" });
    }

    const approvalType = req.body.approvalType || "defined";

    let leftCondition = "";

    if (req.body.includeLeft == "0") {
      leftCondition = " AND em.LASTWOR_DATE IS NULL ";
    }

    let whereCondition = `
        em.export_type = 1
        AND em.location IN (${req.body.branch})
        ${leftCondition}
    `; 

    if (approvalType === "defined") {
      whereCondition += `
        AND am.Module_Code='${req.body.Module_Code}'
      `;
    }

    if (approvalType === "notdefined") {
      whereCondition += `
        AND am.EMPCODE IS NULL
      `;
    } 

    if (approvalType === "all") {
      // No extra condition
    }

    const data = await sequelize.query(`
    
SELECT

    ch.misc_name AS Channel,
    cl.misc_name AS Cluster,
    br.misc_name AS Branch,

    em.EMPCODE,

    CONCAT(
        em.title,' ',
        em.empfirstname,' ',
        em.EMPLASTNAME
    ) AS emp_name,

    am.approver1_A,

    (
        SELECT TOP 1
        CONCAT(title,' ',empfirstname,' ',EMPLASTNAME)
        FROM EMPLOYEEMASTER
        WHERE EMPCODE = am.approver1_A
    ) approver1_Aname,

    am.approver1_B,

    (
        SELECT TOP 1
        CONCAT(title,' ',empfirstname,' ',EMPLASTNAME)
        FROM EMPLOYEEMASTER
        WHERE EMPCODE = am.approver1_B
    ) approver1_Bname,

    am.approver2_A,

    (
        SELECT TOP 1
        CONCAT(title,' ',empfirstname,' ',EMPLASTNAME)
        FROM EMPLOYEEMASTER
        WHERE EMPCODE = am.approver2_A
    ) approver2_Aname,

    am.approver2_B,

    (
        SELECT TOP 1
        CONCAT(title,' ',empfirstname,' ',EMPLASTNAME)
        FROM EMPLOYEEMASTER
        WHERE EMPCODE = am.approver2_B
    ) approver2_Bname,

    am.approver3_A,

    (
        SELECT TOP 1
        CONCAT(title,' ',empfirstname,' ',EMPLASTNAME)
        FROM EMPLOYEEMASTER
        WHERE EMPCODE = am.approver3_A
    ) approver3_Aname,

    am.approver3_B,

    (
        SELECT TOP 1
        CONCAT(title,' ',empfirstname,' ',EMPLASTNAME)
        FROM EMPLOYEEMASTER
        WHERE EMPCODE = am.approver3_B
    ) approver3_Bname

FROM EMPLOYEEMASTER em

LEFT JOIN Approval_Matrix am
ON am.EMPCODE = em.EMPCODE
AND am.Module_Code='${req.body.Module_Code}'

LEFT JOIN misc_mst ch
ON ch.misc_type = 627
AND ch.misc_code = em.channel

LEFT JOIN misc_mst cl
ON cl.misc_type = 626
AND cl.misc_code = em.cluster

LEFT JOIN misc_mst br
ON br.misc_type = 85
AND br.misc_code = em.location

WHERE
${whereCondition}

ORDER BY em.EMPCODE

`);

    return res.status(200).send({
      data: data[0],
    });

  } catch (e) {

    console.log(e);

    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });

  } finally {

    await sequelize.close();

  }
};
exports.approvalmatrixByLocation = async function (req, res) {
  let ApprovalMatrix = req.body.User;
  let {
    module_code,
    Check,
    Location,
    approver1_A,
    approver1_B,
    approver2_A,
    approver2_B,
    approver3_A,
    approver3_B,
    Created_by,
  } = ApprovalMatrix;
  if (module_code == "" || module_code == undefined || module_code == null) {
    return res.status(500).send({
      status: false,
      Message: "module_code is mandatory",
    });
  }
  if (Location == "" || Location == undefined || Location == null) {
    return res.status(500).send({
      status: false,
      Message: "Location is mandatory",
    });
  }
  const sequelize = await dbname(req, req.headers.compcode);
  const t = await sequelize.transaction();

  try {
    if (Check) {
      const QueryForNotNull = await sequelize.query(`update Approval_Matrix set 
    approver1_A	= ${approver1_A ? `'${approver1_A}'` : "approver1_A"},
    approver1_B	= ${approver1_B ? `'${approver1_B}'` : "approver1_B"},
    approver2_A	= ${approver2_A ? `'${approver2_A}'` : "approver2_A"},
    approver2_B	= ${approver2_B ? `'${approver2_B}'` : "approver2_B"},
    approver3_A	= ${approver3_A ? `'${approver3_A}'` : "approver3_A"},
    approver3_B  = ${approver3_B ? `'${approver3_B}'` : "approver3_B"},
    Created_by = ${Created_by} where utd in (
      select utd from (
          select (select top 1 misc_code from misc_mst where Misc_Type = 85 and  misc_code =(select top 1 location from EMPLOYEEMASTER where empcode = ap.empcode and export_type < 3) )as location,* from Approval_Matrix ap where module_code = '${module_code}'
          ) as asd where location in (${Location})
    )`);
    } else {
      const queryForNull = await sequelize.query(` update Approval_Matrix set 
    approver1_A	= ${approver1_A ? `'${approver1_A}'` : null},
    approver1_B	= ${approver1_B ? `'${approver1_B}'` : null},
    approver2_A	= ${approver2_A ? `'${approver2_A}'` : null},
    approver2_B	= ${approver2_B ? `'${approver2_B}'` : null},
    approver3_A	= ${approver3_A ? `'${approver3_A}'` : null},
    approver3_B  = ${approver3_B ? `'${approver3_B}'` : null},
    Created_by = ${Created_by} where utd in (
    select utd from (
          select (select top 1 misc_code from misc_mst where Misc_Type = 85 and  misc_code =(select top 1 location from EMPLOYEEMASTER where empcode = ap.empcode and export_type < 3) )as location,* from Approval_Matrix ap where module_code = '${module_code}'
          ) as asd where location in (${Location})
        )`);
    }
    await t.commit();
    res.status(200).send({
      Message: `Approval Updated for Employees on this Location`,
    });
  } catch (e) {
    console.log(e);
    await t.rollback();
    res.status(500).send({
      success: false,
      message: "An error occurred while creating user.",
    });
  } finally {
    await sequelize.close();
  }
};
exports.approvalmatrixTransfer = async function (req, res) {
  let ApprovalMatrix = req.body.tranfer;
  let { module_code, EMPCODE, Appr_Code, Created_by } = ApprovalMatrix;
  if (module_code == "" || module_code == undefined || module_code == null) {
    return res.status(500).send({
      status: false,
      Message: "module_code is mandatory",
    });
  }
  if (EMPCODE == "" || EMPCODE == undefined || EMPCODE == null) {
    return res.status(500).send({
      status: false,
      Message: "EMPCODE is mandatory",
    });
  }
  if (Appr_Code == "" || Appr_Code == undefined || Appr_Code == null) {
    return res.status(500).send({
      status: false,
      Message: "Appr_Code is mandatory",
    });
  }
  if (Created_by == "" || Created_by == undefined || Created_by == null) {
    return res.status(500).send({
      status: false,
      Message: "Created_by is mandatory",
    });
  }
  const sequelize = await dbname(req, req.headers.compcode);
  const t = await sequelize.transaction();

  try {
    const data = await sequelize.query(`
    UPDATE Approval_Matrix 
    SET 
        approver1_A = CASE 
            WHEN approver1_A = '${EMPCODE}' 
            THEN ${Appr_Code ? `'${Appr_Code}'` : null} 
            ELSE approver1_A 
        END,
        approver1_B = CASE 
            WHEN approver1_B = '${EMPCODE}' 
            THEN ${Appr_Code ? `'${Appr_Code}'` : null} 
            ELSE approver1_B 
        END,
        approver2_A = CASE 
            WHEN approver2_A = '${EMPCODE}' 
            THEN ${Appr_Code ? `'${Appr_Code}'` : null} 
            ELSE approver2_A 
        END,
        approver2_B = CASE 
            WHEN approver2_B = '${EMPCODE}' 
            THEN ${Appr_Code ? `'${Appr_Code}'` : null} 
            ELSE approver2_B 
        END,
        approver3_A = CASE 
            WHEN approver3_A = '${EMPCODE}' 
            THEN ${Appr_Code ? `'${Appr_Code}'` : null} 
            ELSE approver3_A 
        END,
        approver3_B = CASE 
            WHEN approver3_B = '${EMPCODE}' 
            THEN ${Appr_Code ? `'${Appr_Code}'` : null} 
            ELSE approver3_B 
        END,
        Created_by = ${Created_by}
    WHERE 
        ( approver1_A = '${EMPCODE}' OR approver1_B = '${EMPCODE}' or
          approver2_A = '${EMPCODE}' OR approver2_B = '${EMPCODE}' or 
          approver3_A = '${EMPCODE}' OR approver3_B = '${EMPCODE}'
        ) 
        AND utd IN (
            SELECT utd FROM (
                SELECT 
                    (SELECT TOP 1 misc_code 
                     FROM misc_mst 
                     WHERE Misc_Type = 85 
                     AND misc_code = (SELECT location FROM EMPLOYEEMASTER WHERE empcode = ap.empcode)) AS location, 
                    * 
                FROM Approval_Matrix ap 
                WHERE module_code = '${module_code}'
            ) AS asd 
        )
`);

    await t.commit();
    res.status(200).send({
      Message: `Approval Transfred for Employee on this Location`,
    });
  } catch (e) {
    console.log(e);
    await t.rollback();
    res.status(500).send({
      success: false,
      message: "An error occurred while creating user.",
    });
  } finally {
    await sequelize.close();
  }
};

exports.MandatoryFields = async function (req, res) {
  const sequelize = await dbname(req, req.headers.compcode);
  try {
    const data = await sequelize.query(`SELECT * FROM Mandatory_Fields`);
    const RightsTemplate = await sequelize.query(
      `select Emp_Code as value,Emp_Code as label from (
 SELECT distinct(Emp_Code) FROM Mobile_rights where module_code = 99
 ) as ab`
    );
    res.status(200).send({ data: data[0], RightsTemplate: RightsTemplate[0] });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .send({ success: "false", message: "Internal Server Error" });
  } finally {
    await sequelize.close();
  }
};
exports.MandatoryFieldsUpdate = async function (req, res) {
  const sequelize = await dbname(req, req.headers.compcode);
  var MandatoryFields = _MandatoryFields(sequelize, DataTypes);
  const { fields } = req.body;

  try {
    const transaction = await sequelize.transaction();
    try {
      const updatePromises = fields.map((field) =>
        MandatoryFields.update(
          { Is_Mandatory: field.Is_Mandatory },
          { where: { Utd: field.Utd }, transaction }
        )
      );

      await Promise.all(updatePromises);
      await transaction.commit();

      res.status(200).json({ message: "Update successful" });
    } catch (error) {
      await transaction.rollback();
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    await sequelize.close();
  }
};
exports.BranchApi = async function (req, res) {
  const sequelize = await dbname(req, req.headers.compcode);
  try {
    var data = await sequelize.query(
      `select godw_code as value , godw_name as label from godown_mst where godw_code in (${req.body.multi_loc}) and export_type < 3`
    );
    var data2 = await sequelize.query(
      `select misc_code as value , misc_name as label from misc_mst where misc_hod in (${req.body.multi_loc}) and misc_type = 85`
    );
    res.status(200).send({
      branch: data[0],
      branchMisc: data2[0],
      Options: moduleName,
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .send({ success: "false", message: "Internal Server Error" });
  } finally {
    await sequelize.close();
  }
};

let whatsappmsgAuth;

async function getauthtoken() {
  try {
    const abcd = await axios.post(
      "https://messagingapi.charteredinfo.com/AuthTokenV1/AuthToken",
      {
        userId: WHATSAPP_API_USERID,
        password: WHATSAPP_API_RPASSWORD,
      }
    );
    whatsappmsgAuth = abcd.data.txnOutcome;

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function SendWhatsAppMessgaeOtp(
  DLR_ID,
  number1,
  template,
  parameter,
  tokenex
) {
  if (!DLR_ID) {
    return false;
  }
  const number = number1?.slice(-10);
  if (!/^\d+$/.test(number) || number.length != 10 || !number) {
    return false;
  }

  try {
    const sequelize = await dbname('', DLR_ID);
    const [compKeyData] = await sequelize.query(
      `SELECT WHATSAPP_DEALER_CODE FROM COMP_KEYDATA`
    );

    if (compKeyData && compKeyData.length > 0 && compKeyData[0].WHATSAPP_DEALER_CODE == 1) {
      console.log(`WhatsApp OTP blocked for DLR_ID: ${DLR_ID} (WHATSAPP_DEALER_CODE = 1)`);
      return false;
    }
  } catch (error) {
    console.log("Error checking WHATSAPP_DEALER_CODE for OTP:", error);
  }

  const resolvedTemplate = await getWabaTemplateFromAutoVyn(template);
  let messagejson = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: `91${number}`,
    type: "template",
    template: {
      name: resolvedTemplate?.toLowerCase(),

      language: {
        code: "en",
      },
      components: [
        {
          type: "body",
          parameters: parameter,
        },
        {
          type: "button",
          sub_type: "url",
          index: "0",
          parameters: [
            {
              type: "text",
              text: parameter[0]?.text,
            },
          ],
        },
      ],
    },
  };

  try {
    if (!whatsappmsgAuth) {
      await getauthtoken();
    }
    const abcd2 = await axios.post(
      "https://messagingapi.charteredinfo.com/v19.0/442952878893870/messages",
      messagejson,
      {
        headers: {
          Authorization: `Bearer ${whatsappmsgAuth}`,
        },
      }
    );
    // console.log(abcd2.data);
    const istTime = new Date()
      .toLocaleString("sv-SE", { timeZone: "Asia/Kolkata" })
      .replace(" ", "T");
    try {
      const sequelizeForWhatsapp = await dbname("", "DBCON");
      const WaHstWeb = _WhatsAppMessages(sequelizeForWhatsapp, DataTypes);
      if (abcd2.data?.messages[0]?.id) {
        await WaHstWeb.create({
          wamid: abcd2?.data?.messages?.[0]?.id || null,
          DLR_ID: DLR_ID?.split("-")[0],
          ToFromPhoneNo: `91${number}`,
          MsgText: parameter.map((p) => p.text).join(", "),
          TemplateName: resolvedTemplate,
          SubmitDtTime: istTime,
        });
      }
    } catch (e) {
      // console.log(e, 'aaaa')
    }

    return true;
  } catch (e) {
    console.log(e.response.data, "this is error");
    if (tokenex == 1) {
      return false;
    } else {
      const data = await getauthtoken();
      if (data)
        SendWhatsAppMessgae(DLR_ID, number, template, parameter, "DONTCHECK", 1);
      // console.log(e.response)
    }
  }
}
exports.SendWhatsAppMessgaeOtp = SendWhatsAppMessgaeOtp;

function getISTDateTime() {
  const now = new Date();

  // IST में convert
  const istString = now.toLocaleString("en-GB", { timeZone: "Asia/Kolkata" });
  const [datePart, timePart] = istString.split(", ");

  // datePart = dd/mm/yyyy
  const [dd, mm, yyyy] = datePart.split("/");

  // timePart = HH:MM:SS
  const [hh, mi, ss] = timePart.split(":");

  const ms = String(now.getMilliseconds()).padStart(3, "0");

  return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")} ${hh.padStart(
    2,
    "0"
  )}:${mi}:${ss}.${ms}`;
}

getauthtoken();

function getModuleNameSimple() {
  const err = new Error();
  const stack = err.stack.split("\n");
  const routeLines = stack.filter(line => line.includes("\\routes\\") || line.includes("/routes/"));
  if (!routeLines.length) return "Unknown";

  const routeLine = routeLines[routeLines.length - 1];
  const parts = routeLine.split(/routes[\\/]/);
  if (parts.length < 2) return "Unknown";

  return parts[1].split(":")[0].replace(".js", "");
}

async function SendWhatsAppMessgae(
  DLR_ID,
  number1,
  template,
  parameter,
  flag = "CHECK",
  tokenex,
  ImageId = null,
) {
  try {
    // return []
    const sequelize = await dbname('', DLR_ID);
    const [compKeyData] = await sequelize.query(`SELECT WHATSAPP_DEALER_CODE FROM COMP_KEYDATA`);

    if (compKeyData && compKeyData.length > 0 && compKeyData[0].WHATSAPP_DEALER_CODE == 1) {
      console.log("Blocked: WHATSAPP_DEALER_CODE is 1");
      return {
        Status: false,
        Message: "WhatsApp blocked by WHATSAPP_DEALER_CODE"
      };
    }

    //Get Module Name
    const moduleName = getModuleNameSimple();
    console.log("Detected Module Name:", moduleName);

    if (moduleName) {
      const [moduleRights] = await sequelize.query(`SELECT DISTINCT Module_Code, Flag FROM WhatsappRights WHERE LOWER(Module_Name) = LOWER('${moduleName}')`);

      if (moduleRights.length > 0) {
        console.log(`Blocked by WhatsappRights for module: ${moduleName}`);
        return {
          Status: false,
          Message: `WhatsApp blocked — module '${moduleName}' exists in WhatsappRights`
        };
      }
    }
  } catch (error) {
    console.log("Error checking WhatsApp rules:", error);
    return {
      Status: false,
      Message: "Error while checking WhatsApp permissions"
    };
  }

  const numbersArray = Array.isArray(number1) ? number1 : [number1];
  let results = [];

  for (let oneNumber of numbersArray) {
    let res;
    if (flag == "DONTCHECK") {
      res = await SendWhatsAppMessgae_Direct(DLR_ID, oneNumber, template, parameter, tokenex, ImageId);
    } else {
      res = await SendWhatsAppMessgae_CheckLogic(DLR_ID, oneNumber, template, parameter, tokenex, ImageId)
    }
    results.push({
      number: oneNumber,
      status: res ? "SENT" : "FAILED",
    });
  }

  return results;
}

//CHECK BLOCK LOGIC
async function SendWhatsAppMessgae_CheckLogic(
  DLR_ID,
  number1,
  template,
  parameter,
  tokenex,
  ImageId = null
) {
  if (!DLR_ID) {
    return false;
  }

  let number = String(number1).replace(/\D/g, "");
  number = number.slice(-10);

  console.log("✅ Final Clean Number:", number);

  if (!/^\d{10}$/.test(number)) {
    console.log("❌ Invalid Mobile:", number1);
    return false;
  }
  // return true
  parameter.forEach((item) => {
    if (typeof item.text !== "string") {
      item.text = String(item.text);
    }
    if (item.text.trim() === "") {
      item.text = item.text ? String(item.text) : "N/A";
    }
  });
  const resolvedTemplate = await getWabaTemplateFromAutoVyn(template);

  const sequelize = await dbname("", "DBCON");
  const ControlTbl = _WhatsAppUserConsent(sequelize, DataTypes);

  const today = new Date().toISOString().split("T")[0];
  const now1 = getISTDateTime();
  const now = new Date();

  console.log(today, "today");
  console.log(now1, "now1");
  console.log(now, "now");
  console.log(number, "number");

  let user = await ControlTbl.findOne({
    where: sequelize.literal(
      `CAST([date] AS DATE) = '${today}' AND phoneNo = '${number}'`
    ),
  });

  if (user) {
    if (!user.OKFLAG && !user.OKTIME) {
      let msgs = user.msg_name
        ? user.msg_name.split(",").map((m) => m.trim())
        : [];
      if (!msgs.includes(resolvedTemplate)) msgs.push(resolvedTemplate);
      user.msg_name = msgs.join(",");

      user.count += 1;

      if (user.count > 10) {
        if (user.flag !== "BLOCKED") {
          user.flag = "BLOCKED";
          await user.save();

          await insertIntoWaHstWeb(
            DLR_ID,
            number,
            parameter,
            resolvedTemplate,
            null,
            "HOLD"
          );

          await sendRevMsg2(number);
          console.log(`${number} blocked after count ${user.count}`);
          return false;
        } else {
          await user.save();

          await insertIntoWaHstWeb(
            DLR_ID,
            number,
            parameter,
            resolvedTemplate,
            null,
            "HOLD"
          );
          console.log(`${number} already blocked, count incremented to ${user.count}`);
          return false;
        }
      }

      user.flag = "ALLOWED";
      await user.save();
    }
    else if (user.OKFLAG && user.OKTIME) {
      const okTime = new Date(user.OKTIME);
      const expiryToday = new Date(okTime.getTime() + 24 * 60 * 60 * 1000);
      console.log(expiryToday, 'expiryToday')
      if (now <= expiryToday) {
        console.log("Previous day consent valid, allow until expiry");
      } else {
        console.log("Consent expired, create new entry");
        user = null;
      }
    }
  }
  if (!user) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    const userPrevDay = await ControlTbl.findOne({
      where: sequelize.literal(
        `CAST([date] AS DATE) = '${yesterdayStr}' AND phoneNo = '${number}'`
      ),
    });

    if (userPrevDay && userPrevDay.OKTIME) {
      const okTime = new Date(userPrevDay.OKTIME);
      const expiryToday = new Date(okTime.getTime() + 24 * 60 * 60 * 1000);
      console.log(okTime, 'okTime')
      console.log(expiryToday, 'expiryToday')
      console.log(now, 'now')

      if (now1 < expiryToday) {
        console.log("Using yesterday consent, valid today");
        user = userPrevDay; // direct allow
      } else {
        console.log("Yesterday consent expired, creating fresh entry");
        user = null;
      }
    } else {
      console.log("No valid yesterday consent, creating fresh entry");
      user = null;
    }
  }

  // Fresh entry create करनी है (अगर ऊपर से null आया)
  if (!user) {
    user = await ControlTbl.create({
      phoneNo: number,
      count: 1,
      msg_name: resolvedTemplate,
      compcode: DLR_ID?.split("-")[0],
      flag: "ALLOWED",
      date: now1,
    });
  }


  if (
    DLR_ID.split("-")[0]?.toLowerCase() == "ranah" ||
    DLR_ID.split("-")[0]?.toLowerCase() == "rmpl2"
  ) {
    // let messagejson = {
    //   "messaging_product": "whatsapp",
    //   "recipient_type": "individual",
    //   "to": 918209932832,
    //   "type": "template",
    //   "template": {
    //     "name": template?.toLowerCase(),
    //     "language": {
    //       "code": "en"
    //     },
    //     "components": [
    //       {
    //         "type": "body",
    //         "parameters": parameter
    //       }
    //     ]
    //   }
    // }
    let messagejson = {
      to: `91${number}`,
      recipient_type: "individual",
      type: "template",
      template: {
        language: {
          policy: "deterministic",
          code: "en_US",
        },
        name: resolvedTemplate?.toLowerCase(),
        components: [
          {
            type: "body",
            parameters: parameter,
          },
        ],
      },
    };
    let abcd2;
    try {
      // const url = "https://crm.helloall.in/api/meta/v19.0/322026744336000/messages"; // Replace with actual URL
      // const options = {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': 'Bearer CT6ZGP8jfoD4YZmNfzFU035YllTb1hG9Ro3QIvLhK1U7V8YfDXIRsseMchLcUyZiH7YKOrd0NEKomN9eaO4kdV7VU5ERVJTQ09SRQ4HVU5ERVJTQ09SRQG2CYWe1zw3MHdGp2Fzu7P06IQeEQY0So' // Replace with your access token
      //   },
      //   body: JSON.stringify(messagejson)
      // };

      // // Send the request
      // fetch(url, options)
      //   .then(response => response.json())
      //   .then(data => // console.log('Message sent successfully:', data))
      //   .catch(error => console.error('Error sending message:', error));

      abcd2 = await axios.post(
        "https://crm.helloall.in/api/meta/v19.0/322026744336000/messages",
        messagejson,
        {
          headers: {
            Authorization: `Bearer CT6ZGP8jfoD4YZmNfzFU035YllTb1hG9Ro3QIvLhK1U7V8YfDXIRsseMchLcUyZiH7YKOrd0NEKomN9eaO4kdV7VU5ERVJTQ09SRQ4HVU5ERVJTQ09SRQG2CYWe1zw3MHdGp2Fzu7P06IQeEQY0So`,
          },
        }
      );
      // console.log(abcd2, "absc2");
      return true;
    } catch (e) {
      console.log(e);

      return false;
    }
  } else {
    let messagejson1 = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: `91${number}`,
      type: "template",
      template: {
        name: resolvedTemplate?.toLowerCase(),
        language: {
          code: "en",
        },
        components: [
          {
            type: "header",
            parameters: [
              {
                type: "image",
                image: {
                  id: ImageId,
                },
              },
            ],
          },
          {
            type: "body",
            parameters: parameter,
          },
        ],
      },
    };
    let messagejson = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: `91${number}`,
      type: "template",
      template: {
        name: resolvedTemplate?.toLowerCase(),
        language: {
          code: "en",
        },
        components: [
          {
            type: "body",
            parameters: parameter,
          },
        ],
      },
    };
    try {
      if (!whatsappmsgAuth) {
        await getauthtoken();
      }
      const abcd2 = await axios.post(
        "https://messagingapi.charteredinfo.com/v19.0/442952878893870/messages",
        ImageId ? messagejson1 : messagejson,
        {
          headers: {
            Authorization: `Bearer ${whatsappmsgAuth}`,
          },
        }
      );
      const istTime = new Date()
        .toLocaleString("sv-SE", { timeZone: "Asia/Kolkata" })
        .replace(" ", "T");
      try {
        const sequelizeForWhatsapp = await dbname("", "DBCON");
        const WaHstWeb = _WhatsAppMessages(sequelizeForWhatsapp, DataTypes);
        if (abcd2.data?.messages[0]?.id) {
          await WaHstWeb.create({
            wamid: abcd2?.data?.messages?.[0]?.id || null,
            DLR_ID: DLR_ID?.split("-")[0],
            ToFromPhoneNo: `91${number}`,
            MsgText: parameter.map((p) => p.text).join(", "),
            TemplateName: resolvedTemplate,
            SubmitDtTime: istTime,
            Flag: "ALLOWED",
          });
        }
      } catch (e) {
        // console.log(e, 'aaaa')
      }

      return true;
    } catch (e) {
      // console.log("❌ WhatsApp API Error:", e?.response?.data || e.message || e);
      if (tokenex == 1) {
        return false;
      } else {
        const data = await getauthtoken();
        if (data) {
          return SendWhatsAppMessgae(DLR_ID, number, template, parameter, "CHECK", 1);
        }
        // console.log("❌ Token fetch failed.");
        return false;
      }
    }
  }
}

//DONT CHECK LOGIC
async function SendWhatsAppMessgae_Direct(
  DLR_ID,
  number1,
  template,
  parameter,
  tokenex,
  ImageId = null
) {
  if (!DLR_ID) {
    return false;
  }
  let number = String(number1).replace(/\D/g, ""); // removes spaces + symbols
  number = number.slice(-10);
  if (!/^\d+$/.test(number) || number.length != 10 || !number) {
    return false;
  }
  // return true
  parameter.forEach((item) => {
    if (typeof item.text !== "string") {
      // Check if the text property is not already a string
      item.text = String(item.text); // Convert the value to a string
    }
    if (item.text.trim() === "") {
      item.text = item.text ? String(item.text) : "N/A";
    }
  });
  const resolvedTemplate = await getWabaTemplateFromAutoVyn(template);

  // console.log("Resolved WABA Template:", resolvedTemplate);

  if (
    DLR_ID.split("-")[0]?.toLowerCase() == "ranah" ||
    DLR_ID.split("-")[0]?.toLowerCase() == "rmpl2"
  ) {
    // let messagejson = {
    //   "messaging_product": "whatsapp",
    //   "recipient_type": "individual",
    //   "to": `918209932832`,
    //   "type": "template",
    //   "template": {
    //     "name": template?.toLowerCase(),
    //     "language": {
    //       "code": "en"
    //     },
    //     "components": [
    //       {
    //         "type": "body",
    //         "parameters": parameter
    //       }
    //     ]
    //   }
    // }
    let messagejson = {
      to: `91${number}`,
      recipient_type: "individual",
      type: "template",
      template: {
        language: {
          policy: "deterministic",
          code: "en_US",
        },
        name: resolvedTemplate?.toLowerCase(),
        components: [
          {
            type: "body",
            parameters: parameter,
          },
        ],
      },
    };
    let abcd2;
    try {
      // const url = "https://crm.helloall.in/api/meta/v19.0/322026744336000/messages"; // Replace with actual URL
      // const options = {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': 'Bearer CT6ZGP8jfoD4YZmNfzFU035YllTb1hG9Ro3QIvLhK1U7V8YfDXIRsseMchLcUyZiH7YKOrd0NEKomN9eaO4kdV7VU5ERVJTQ09SRQ4HVU5ERVJTQ09SRQG2CYWe1zw3MHdGp2Fzu7P06IQeEQY0So' // Replace with your access token
      //   },
      //   body: JSON.stringify(messagejson)
      // };

      // // Send the request
      // fetch(url, options)
      //   .then(response => response.json())
      //   .then(data => // console.log('Message sent successfully:', data))
      //   .catch(error => console.error('Error sending message:', error));

      abcd2 = await axios.post(
        "https://crm.helloall.in/api/meta/v19.0/322026744336000/messages",
        messagejson,
        {
          headers: {
            Authorization: `Bearer CT6ZGP8jfoD4YZmNfzFU035YllTb1hG9Ro3QIvLhK1U7V8YfDXIRsseMchLcUyZiH7YKOrd0NEKomN9eaO4kdV7VU5ERVJTQ09SRQ4HVU5ERVJTQ09SRQG2CYWe1zw3MHdGp2Fzu7P06IQeEQY0So`,
          },
        }
      );
      // console.log(abcd2, "absc2");
      return true;
    } catch (e) {
      console.log(e);

      return false;
    }
  } else {
    let messagejson1 = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: `91${number}`,
      type: "template",
      template: {
        name: resolvedTemplate?.toLowerCase(),
        language: {
          code: "en",
        },
        components: [
          {
            type: "header",
            parameters: [
              JSON.parse(ImageId)
            ],
          },
          {
            type: "body",
            parameters: parameter,
          },
        ],
      },
    };
    let messagejson = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: `91${number}`,
      type: "template",
      template: {
        name: resolvedTemplate?.toLowerCase(),
        language: {
          code: "en",
        },
        components: [
          {
            type: "body",
            parameters: parameter,
          },
        ],
      },
    };
    try {
      if (!whatsappmsgAuth) {
        await getauthtoken();
      }
      const abcd2 = await axios.post(
        "https://messagingapi.charteredinfo.com/v19.0/442952878893870/messages",
        ImageId ? messagejson1 : messagejson,
        {
          headers: {
            Authorization: `Bearer ${whatsappmsgAuth}`,
          },
        }
      );
      const istTime = new Date().toLocaleString("sv-SE", { timeZone: "Asia/Kolkata" }).replace(" ", "T");
      try {
        const sequelizeForWhatsapp = await dbname("", "DBCON");
        const WaHstWeb = _WhatsAppMessages(sequelizeForWhatsapp, DataTypes);
        if (abcd2.data?.messages[0]?.id) {
          await WaHstWeb.create({
            wamid: abcd2?.data?.messages?.[0]?.id || null,
            DLR_ID: DLR_ID?.split("-")[0],
            ToFromPhoneNo: `91${number}`,
            MsgText: parameter.map(p => p.text).join(", "),
            TemplateName: resolvedTemplate,
            SubmitDtTime: istTime,
          });
        }
      } catch (e) {
        // console.log(e, 'aaaa')
      }

      return true;
    } catch (e) {
      // console.log("❌ WhatsApp API Error:", e?.response?.data || e.message || e);
      if (tokenex == 1) {
        return false;
      } else {
        const data = await getauthtoken();
        if (data) {
          return await await SendWhatsAppMessgae(DLR_ID, number, template, parameter, "DONTCHECK", 1);
        }
        // console.log("❌ Token fetch failed.");
        return false;
      }
    }
  }
}

exports.SendWhatsAppMessgae = SendWhatsAppMessgae;

async function UploadDocumentTowhatsApp(file) {
  try {
    if (!whatsappmsgAuth) {
      await getauthtoken();
    }

    const formData = new FormData();

    // Add file from Multer
    formData.append("file", file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    // Required fields
    formData.append("messaging_product", "whatsapp");
    formData.append("type", file.mimetype); // auto set correct type

    const response = await axios.post(
      "https://messagingapi.charteredinfo.com/v19.0/442952878893870/media",
      formData,
      {
        headers: {
          Authorization: `Bearer ${whatsappmsgAuth}`,
          ...formData.getHeaders(),
        },
      }
    );

    return response.data;
  } catch (e) {
    console.error("WhatsApp Upload Error:", e.response?.data || e);
    return false
  }
}

async function sendRevMsg2(number) {
  const consentMsg = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: `91${number}`,
    type: "template",
    template: {
      name: "final_rev_massage1",
      language: { code: "en" },
    },
  };

  try {
    if (!whatsappmsgAuth) {
      await getauthtoken();
    }
    await axios.post(
      "https://messagingapi.charteredinfo.com/v19.0/442952878893870/messages",
      consentMsg,
      { headers: { Authorization: `Bearer ${whatsappmsgAuth}` } }
    );
    console.log("✅ final_rev_msg3 sent successfully");
  } catch (err) {
    console.error(
      "❌ Error sending final_rev_msg3:",
      err?.response?.data || err
    );
  }
}

async function insertIntoWaHstWeb(
  DLR_ID,
  number,
  parameter,
  resolvedTemplate,
  response = null,
  flag
) {
  try {
    const istTime = new Date()
      .toLocaleString("sv-SE", { timeZone: "Asia/Kolkata" })
      .replace(" ", "T");

    const sequelizeForWhatsapp = await dbname("", "DBCON");
    const WaHstWeb = _WhatsAppMessages(sequelizeForWhatsapp, DataTypes);

    await WaHstWeb.create({
      wamid: response?.data?.messages?.[0]?.id || null,
      DLR_ID: DLR_ID?.split("-")[0],
      ToFromPhoneNo: `91${number}`,
      MsgText: parameter.map((p) => p.text).join(", "),
      TemplateName: resolvedTemplate,
      SubmitDtTime: istTime,
      Flag: flag,
    });

    console.log(
      `📝 Message inserted into DB for ${number} (sent=${!!response})`
    );
  } catch (err) {
    console.error("❌ Error inserting into WaHstWeb:", err);
  }
}

exports.whatsAppMsgAttachement = async function (req, res) {
  try {
    if (
      !/^\d+$/.test(req.body.mobile_no) ||
      req.body.mobile_no.length != 10 ||
      !req.body.mobile_no
    ) {
      return res
        .status(500)
        .send({ status: false, message: "Invalid mobile no" });
    }
    if (
      req.body.template == "" ||
      req.body.template == undefined ||
      req.body.template == null
    ) {
      return res.status(500).send({
        status: false,
        message: "template name is mandatory",
      });
    }

    let parsedParams = null;

    try {
      parsedParams = JSON.parse(req.body.parameter);
    } catch (e) {
      return res.status(400).send({
        status: false,
        message: "parameter must be a valid JSON array string",
      });
    }

    // Now check if it's really an array
    if (!Array.isArray(parsedParams)) {
      return res.status(400).send({
        status: false,
        message: "parameter must be an array",
      });
    }

    // Allowed MIME categories
    const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    const DOCUMENT_TYPES = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ];
    const doc_type = req.body.doc_type;
    // -------- Check doc_type exists --------
    if (!["image", "document"].includes(doc_type)) {
      return res.status(400).send({
        status: false,
        message:
          "Invalid doc_type. Allowed values are: image, document.",
      });
    }

    // -------- Check file exists --------
    if (!req.files?.[0]) {
      return res.status(400).send({
        status: false,
        message: "File upload is required.",
      });
    }
    // -------- Validate file MIME vs doc_type --------
    const mime = req.files?.[0]?.mimetype;

    if (doc_type === "image" && !IMAGE_TYPES.includes(mime)) {
      return res.status(400).send({
        status: false,
        message:
          "Uploaded file is not a valid image. Allowed formats: jpeg, jpg, png, webp.",
      });
    }

    if (doc_type === "document" && !DOCUMENT_TYPES.includes(mime)) {
      return res.status(400).send({
        status: false,
        message:
          "Uploaded file is not a valid document. Allowed formats: pdf, doc, docx, xls, xlsx.",
      });
    }

    function transformArray(inputArray) {
      return inputArray.map((item, index) => {
        return {
          type: "text",
          text: item,
        };
      });
    }

    const transformedArray = transformArray(JSON.parse(req.body.parameter));
    const DocId = await UploadDocumentTowhatsApp(req.files[0]);
    if (!DocId) {
      return res.status(500).send({
        status: false,
        message: "Error Uploading the document to whatsapp server",
      });
    }
    console.log(req.files?.[0]?.originalname);
    let headerFormat = {
      type: doc_type,
      [doc_type]: {
        id: DocId?.id,
      },
    };
    if (doc_type === "document") {
      headerFormat[doc_type].filename = req.files?.[0]?.originalname;
    }

    const data = await SendWhatsAppMessgae(
      req.headers.compcode,
      req.body.mobile_no.toString(),
      req.body.template,
      transformedArray,
      "DONTCHECK",
      0,
      JSON.stringify(headerFormat)
    );
    if (data) {
      res.send({ status: true, message: "WhatsApp message sent successfully!" });
    } else {
      res
        .status(500)
        .send({ status: false, message: "error sending message!" });
    }
  } catch (e) {
    console.log("💥 Exception caught:", e);
    res.status(500).send({ status: false, message: "internal server error!" });
  }
};
exports.whatsappmsg = async function (req, res) {
  try {
    if (
      !/^\d+$/.test(req.body.mobile_no) ||
      req.body.mobile_no.length != 10 ||
      !req.body.mobile_no
    ) {
      return res
        .status(500)
        .send({ status: false, message: "Invalid mobile no" });
    }
    if (
      req.body.template == "" ||
      req.body.template == undefined ||
      req.body.template == null
    ) {
      return res.status(500).send({
        status: false,
        message: "template name is mandatory",
      });
    }

    if (!Array.isArray(req.body.parameter)) {
      return res.status(500).send({
        status: false,
        message: "perameter array is not a valid array",
      });
    }

    function transformArray(inputArray) {
      return inputArray.map((item, index) => {
        return {
          type: "text",
          text: item,
        };
      });
    }

    const transformedArray = transformArray(req.body.parameter);
    const data = await SendWhatsAppMessgaeOtp(
      req.headers.compcode,
      req.body.mobile_no.toString(),
      req.body.template,
      transformedArray
    );
    if (data) {
      res.send({ status: true, message: "message sent!" });
    } else {
      res
        .status(500)
        .send({ status: false, message: "error sending message!" });
    }
  } catch (e) {
    // console.log("💥 Exception caught:", e);
    res.status(500).send({ status: false, message: "internal server error!" });
  }
};
exports.dbauthenticate = async function (req, res) {
  let sequelize;
  try {
    sequelize = await dbname(req, req.headers.compcode);
    let dbdata = [[{}]];
    try {
      dbdata = await sequelize.query(`select New_dev_code from Comp_keydata`);
    } catch (e) {
      dbdata[0][0].New_dev_code = 999;
    }
    // console.log(`Data for ${req.headers.compcode}:`, dbdata[0][0].New_dev_code);
    const data = await dbauthenticate(
      req.headers.compcode,
      dbdata[0][0].New_dev_code
    );
    if (data) {
      res.status(200).send({
        Message: `Db Authenticated`,
      });
    } else {
      return res
        .status(500)
        .send({ success: "false", message: "Internal Server Error" });
    }
  } catch (e) {
    console.log(e);
  } finally {
    sequelize.close();
  }
};
exports.Alldbauthenticate = async function (req, res) {
  try {
    const configPath = path.join(__dirname, "../config/config.json");
    const databaseConfigs = JSON.parse(fs.readFileSync(configPath, "utf8"));
    const keysArray = Object.keys(databaseConfigs);

    async function processKeys() {
      for (const key of keysArray) {
        const compcode = key;
        let dbdata = [[{}]];
        let sequelize;

        try {
          if (compcode == "DBCON") {
            continue;
          }
          sequelize = await dbname(req, compcode);
        } catch (e) {
          continue;
        }
        try {
          dbdata = await sequelize.query(
            `select iif((select count(*) from COMP_KEYDATA )> 0  , (select new_dev_code from COMP_KEYDATA),999) as New_dev_code`
          );
        } catch (e) {
          dbdata[0][0].New_dev_code = 999;
        }
        // console.log(`Data for ${compcode}:`, dbdata[0][0].New_dev_code);
        try {
          const data = await dbauthenticate(
            compcode,
            dbdata[0][0].New_dev_code
          );
          // console.log(
          // `Authenticated ${compcode} with code ${dbdata[0][0].New_dev_code}`
          // );
        } catch (e) {
          console.error(`Error authenticating ${compcode}:`, e);
        }
      }
    }

    processKeys()
      .then(() => {
        res.status(200).send({
          Message: `Db Authenticated`,
        });
      })
      .catch((error) => {
        console.error("Error processing keys:", error);
        return res
          .status(500)
          .send({ success: "false", message: "Internal Server Error" });
      });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .send({ success: "false", message: "Internal Server Error" });
  }
};

exports.ranawhatsapp = async function (req, res) {
  try {
    if (
      !/^\d+$/.test(req.body.mobile_no) ||
      req.body.mobile_no.length != 10 ||
      !req.body.mobile_no
    ) {
      return res
        .status(500)
        .send({ status: false, message: "Invalid mobile no" });
    }
    if (
      req.body.template == "" ||
      req.body.template == undefined ||
      req.body.template == null
    ) {
      return res.status(500).send({
        status: false,
        message: "template name is mandatory",
      });
    }
    if (!Array.isArray(req.body.parameter)) {
      return res.status(500).send({
        status: false,
        message: "perameter array is not a valid array",
      });
    }
    function transformArray(inputArray) {
      return inputArray.map((item) => ({
        type: "text",
        text: item,
      }));
    }
    const transformedArray = transformArray(req.body.parameter);

    transformedArray.forEach((item) => {
      if (typeof item.text !== "string") {
        // Check if the text property is not already a string
        item.text = String(item.text); // Convert the value to a string
      }
      if (item.text.trim() === "") {
        item.text = item.text ? String(item.text) : "N/A";
      }
    });

    let messagejson = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: `91${req.body.mobile_no}`,
      type: "template",
      template: {
        name: req.body.template?.toLowerCase(),
        language: {
          code: "en",
        },
        components: [
          {
            type: "body",
            parameters: transformedArray,
          },
        ],
      },
    };
    let abcd2;
    try {
      abcd2 = await axios.post(
        "https://crm.helloall.in/api/meta/v19.0/322026744336000/messages",
        messagejson,
        {
          headers: {
            Authorization: `Bearer CT6ZGP8jfoD4YZmNfzFU035YllTb1hG9Ro3QIvLhK1U7V8YfDXIRsseMchLcUyZiH7YKOrd0NEKomN9eaO4kdV7VU5ERVJTQ09SRQ4HVU5ERVJTQ09SRQG2CYWe1zw3MHdGp2Fzu7P06IQeEQY0So`,
          },
        }
      );
      // console.log();

      res.send({ status: true, message: "message sent!", data: abcd2.data });
    } catch (e) {
      res.status(500).send({
        status: false,
        message: "error sending message!",
        data: abcd2.data,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ status: false, message: "internal server error!" });
  }
};

exports.StatementAccNo = async function (req, res) {
  // console.log(req.body, "req.body");
  // return;
  const sequelize = await dbname(req, req.headers.compcode);
  try {
    const data = await sequelize.query(`
    select ACCOUNTNO as label,(SELECT LEDG_CODE FROM LEDG_MST WHERE LEDG_NAME3 = ACCOUNTNO AND BankApiEnabled = 1) as value from BANK_API_SETUP WHERE Export_Type = 1
      `);
    res.status(200).send({ data: data[0] });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .send({ success: "false", message: "Internal Server Error" });
  } finally {
    await sequelize.close();
  }
};
exports.GetStatement = async function (req, res) {
  // console.log(req.body, "req.body");
  // return;
  const sequelize = await dbname(req, req.headers.compcode);
  try {
    const data = await sequelize.query(`
    SELECT *
    FROM API_BANK_STATEMENT
    WHERE PARSE(SUBSTRING(TXNDATE, 1, 10) AS DATETIME USING 'en-GB') BETWEEN '${req.body.DATE_FROM}' AND '${req.body.DATE_TO}' and bank_name='${req.body.Account_No}'
    ORDER BY PARSE(TXNDATE AS DATETIME USING 'en-GB') DESC
      `);
    res.status(200).send({ data: data[0] });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .send({ success: "false", message: "Internal Server Error" });
  } finally {
    await sequelize.close();
  }
};
exports.ApprovalMatrixImport = async function (req, res) {
  const sequelize = await dbname(req, req.headers.compcode);
  try {
    const data = await sequelize.query(`
      INSERT INTO Approval_Matrix(empcode, module_code)
      output inserted.UTD
      SELECT s.empcode, '${req.body.module_code}'
      FROM EMPLOYEEMASTER s
      WHERE NOT EXISTS (
          SELECT 1
          FROM Approval_Matrix t
          WHERE t.empcode = s.empcode
            AND t.module_code = '${req.body.module_code}'
      ) And s.Location = '${req.body.Location}'
      `);
    res.status(200).send({
      Message: `${data[0]?.length} Employees Imported for ${req.body.module_code} module`,
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .send({ success: "false", message: "Internal Server Error" });
  } finally {
    await sequelize.close();
  }
};

exports.MobileRightsUpdate = async function (req, res) {
  const sequelize = await dbname(req, req.headers.compcode);
  const t = await sequelize.transaction();
  var RightsTbl = _MobileRights(sequelize, DataTypes);
  try {
    const { checkedKeys, empCodeList, USER_CODE } = req.body;
    const filteredRights = checkedKeys.filter((right) => right?.length > 0);
    const rightsData = empCodeList.flatMap((empCode) => {
      return filteredRights.map((right) => ({
        Emp_Code: empCode?.toString(),
        Optn_Name: right,
        Module_Code: 10,
        USER_CODE: USER_CODE,
      }));
    });
    const data = empCodeList.map((data) => data.toString());
    const a = [...rightsData];
    await RightsTbl.destroy(
      {
        where: {
          Emp_Code: data,
        },
      },
      {
        transaction: t,
      }
    );
    await RightsTbl.bulkCreate(a, { transaction: t });
    await t.commit();
    let Message = `Mobile Rights Updated`;
    res.status(200).send({
      Message: Message,
    });
  } catch (e) {
    await t.rollback();
    console.log(e);
    res.status(500).send({
      success: false,
      message: "An error occurred while creating user.",
    });
  } finally {
    await sequelize.close();
  }
};
exports.SaveTemplateMobileRights = async function (req, res) {
  const sequelize = await dbname(req, req.headers.compcode);
  const t = await sequelize.transaction();
  var RightsTbl = _MobileRights(sequelize, DataTypes);
  try {
    const { checkedKeys, empCodeList, USER_CODE } = req.body;
    const filteredRights = checkedKeys.filter((right) => right?.length > 0);

    // Create rights data for each employee in the empCodeList
    const rightsData = empCodeList.flatMap((empCode) => {
      return filteredRights.map((right) => ({
        Emp_Code: empCode?.toString(), // Map the current empCode to User_Code
        Optn_Name: right,
        Module_Code: 99,
        USER_CODE: USER_CODE,
      }));
    });
    const data = empCodeList.map((data) => data.toString());
    const a = [...rightsData];
    await RightsTbl.destroy(
      {
        where: {
          Emp_Code: data, // Assuming 'User_Code' matches elements in empCodeList
        },
      },
      {
        transaction: t,
      }
    );
    await RightsTbl.bulkCreate(a, { transaction: t });
    await t.commit();
    const data2 =
      await sequelize.query(`select Emp_Code as value,Emp_Code as label from (
 SELECT distinct(Emp_Code) FROM Mobile_rights where module_code = 99
 ) as ab`);
    let Message = `Mobile Rights Updated`;
    res.status(200).send({
      Message: Message,
      templates: data2[0],
    });
  } catch (e) {
    await t.rollback();
    console.log(e);
    res.status(500).send({
      success: false,
      message: "An error occurred while creating user.",
    });
  } finally {
    await sequelize.close();
  }
};
exports.MobileRightsGet = async function (req, res) {
  const { Emp_Code } = req.body;
  let sequelize;
  try {
    sequelize = await dbname(req, req.headers.compcode);
    const t = await sequelize.transaction();
    var RightsTbl = _MobileRights(sequelize, DataTypes);
    const userRightsData = await RightsTbl.findAll({
      where: { Emp_Code: Emp_Code },
    });
    const datecalender = await sequelize.query(
      ` select (iif((select top 1 LEFT(Misc_Dtl1,2)  as date_ from Misc_Mst where Misc_Type = 25 and misc_code = 1) is null ,'0',(select top 1 LEFT(Misc_Dtl1,2)  as date_ from Misc_Mst where Misc_Type = 25 and misc_code = 1))) as CustumDateForCalender  `
    );
    const rights = userRightsData
      .filter((item) => item.Module_Code === 10)
      .map((item) => item.Optn_Name);
    const Template = userRightsData
      .filter((item) => item.Module_Code === 99)
      .map((item) => item.Optn_Name);
    let role = [];
    if (rights.length) {
      role = rights;
    } else if (Template.length) {
      role = Template;
    }
    return res.status(200).send({
      Status: true,
      Message: "response.Message",
      Query: datecalender[0][0].CustumDateForCalender,
      Result: role,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(200).send({
      Status: true,
      Message: "Message",
      Query: "",
      Result: [],
    });
  } finally {
    await sequelize.close();
  }
};

exports.MobileRightsDownload = async function (req, res) {
  const { Rights } = req.query;
  let sequelize;
  try {
    sequelize = await dbname(req, req.query.compcode);

    const txnDetails =
      await sequelize.query(` select distinct  fst.emp_code AS EMPCODE,
          (select top 1 concat(title,' ',empfirstname,' ',EMPLASTNAME)  from EMPLOYEEMASTER where empcode= fst.emp_code and export_type < 3) as EmployeeName,
          (select top 1 EMPLOYEEDESIGNATION  from EMPLOYEEMASTER where empcode= fst.emp_code and export_type < 3) as Designation,
          (select top 1 misc_name  from misc_mst where misc_type = 85 and  misc_code =(select top 1 location from EMPLOYEEMASTER where empcode= fst.emp_code and export_type < 3)) as Location,
          (select top 1 misc_name  from misc_mst where misc_type = 91 and  misc_code =(select top 1 sal_region from EMPLOYEEMASTER where empcode= fst.emp_code and export_type < 3)) as Region,
          (select top 1 misc_name  from misc_mst where misc_type = 68 and  misc_code =(select top 1 division from EMPLOYEEMASTER where empcode= fst.emp_code and export_type < 3)) as Department,
          (select top 1 misc_name  from misc_mst where misc_type = 81 and  misc_code =(select top 1 section from EMPLOYEEMASTER where empcode= fst.emp_code and export_type < 3)) as Section 
		  from (
		  SELECT Emp_Code 
      FROM Mobile_Rights 
      WHERE module_code = 10 and  optn_name IN (${Rights.split(",").map(
        (asad) => `'${asad}'`
      )})
      GROUP BY Emp_Code
      HAVING COUNT(DISTINCT optn_name) = ${Rights.split(",").length}) as fst`);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    // Add headers for the data starting from the 3rd row
    const headers = Object.keys(txnDetails[0][0]);
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } }; // white font color
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF006400" }, // dark green background color
      };
      cell.border = {
        top: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } },
      };
    });
    txnDetails[0]?.forEach((obj) => {
      const values = Object.values(obj);
      worksheet.addRow(values);
    });
    res
      .status(200)
      .setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="Mobile_App_Rights.xlsx"'
    );
    return workbook.xlsx
      .write(res)
      .then(() => {
        res.end();
      })
      .catch((error) => {
        console.error("Error creating workbook:", error);
        res.status(500).send("Internal Server Error");
      });
  } catch (error) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    res
      .status(200)
      .setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="NO_data_available.xlsx"'
    );
    return workbook.xlsx
      .write(res)
      .then(() => {
        res.end();
      })
      .catch((error) => {
        console.error("Error creating workbook:", error);
        res.status(500).send("Internal Server Error");
      });
  } finally {
    await sequelize.close();
  }
};
exports.MobileRightsAddExtra = async function (req, res) {
  const sequelize = await dbname(req, req.headers.compcode);
  const t = await sequelize.transaction();
  var RightsTbl = _MobileRights(sequelize, DataTypes);
  try {
    const { checkedKeys, empCodeList, USER_CODE } = req.body;
    const filteredRights = checkedKeys.filter((right) => right?.length > 0);

    // Create rights data for each employee in the empCodeList
    const rightsData = empCodeList.flatMap((empCode) => {
      return filteredRights.map((right) => ({
        Emp_Code: empCode?.toString(),
        Optn_Name: right,
        Module_Code: 10,
        USER_CODE: USER_CODE,
      }));
    });

    const empCodes = empCodeList.map((empCode) => empCode.toString());

    // Step 1: Fetch existing rights for these employees
    const existingRights = await RightsTbl.findAll({
      where: {
        Emp_Code: empCodes,
        Optn_Name: filteredRights,
      },
    });

    // Step 2: Filter out the existing rights
    const existingRightsSet = new Set(
      existingRights.map((right) => `${right.Emp_Code}-${right.Optn_Name}`)
    );
    const newRightsData = rightsData.filter(
      (right) => !existingRightsSet.has(`${right.Emp_Code}-${right.Optn_Name}`)
    );

    if (newRightsData.length > 0) {
      // Step 3: Insert only the new rights
      await RightsTbl.bulkCreate(newRightsData, { transaction: t });
    }

    await t.commit();
    let Message = `Mobile Rights Updated. ${newRightsData.length} new rights added.`;
    res.status(200).send({
      Message: Message,
    });
  } catch (e) {
    await t.rollback();
    console.log(e);
    res.status(500).send({
      success: false,
      message: "An error occurred while updating mobile rights.",
    });
  } finally {
    await sequelize.close();
  }
};
exports.MobileRightsRemoveExtra = async function (req, res) {
  const sequelize = await dbname(req, req.headers.compcode);
  const t = await sequelize.transaction();
  var RightsTbl = _MobileRights(sequelize, DataTypes);
  try {
    const { checkedKeys, empCodeList, USER_CODE } = req.body;
    const filteredRights = checkedKeys.filter((right) => right?.length > 0);

    // Remove only specified rights for each employee in empCodeList
    await RightsTbl.destroy(
      {
        where: {
          Emp_Code: empCodeList.map((empCode) => empCode.toString()), // Employees to remove rights from
          Optn_Name: filteredRights, // Rights to be removed
        },
      },
      { transaction: t }
    );

    await t.commit();
    res.status(200).send({
      Message: "Selected Mobile Rights Removed",
    });
  } catch (e) {
    await t.rollback();
    console.log(e);
    res.status(500).send({
      success: false,
      message: "An error occurred while removing rights.",
    });
  } finally {
    await sequelize.close();
  }
};

exports.importformatapprovalmatrix = async function (req, res) {
  const sequelize = await dbname(req, req.query.compcode);
  try {
    const Headeres = [
      "module_code",
      "empcode",
      "approver1_A",
      "approver1_B",
      "approver2_A",
      "approver2_B",
      "approver3_A",
      "approver3_B",
    ];

    const Employees = await sequelize.query(
      `
      SELECT
          EMPCODE,
          EMPFIRSTNAME + ' ' + ISNULL(EMPLASTNAME,'') AS EMPLOYEENAME, 
          EMPLOYEEDESIGNATION
      FROM EMPLOYEEMASTER WHERE LASTWOR_DATE IS NULL
      ORDER BY EMPFIRSTNAME
      `,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const workbook = new ExcelJS.Workbook();

    const sheet = workbook.addWorksheet("Approval Matrix Template");

    // Headers
    const headerRow = sheet.addRow(Headeres);

    headerRow.eachCell((cell) => {
      cell.font = {
        bold: true,
        color: { argb: "FFFFFFFF" },
      };

      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF006400" },
      };

      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
      };
    });

    // Blank Row
    sheet.addRow([]);
    // ============================
    // NOTE / INSTRUCTIONS
    // ============================
    sheet.getCell("A4").value = "NOTE";
    sheet.getCell("A4").font = {
      bold: true,
      size: 13,
      color: { argb: "FFFF0000" },
    };

    sheet.getCell("A5").value =
      "1. Fill data only below the header row.";

    sheet.getCell("A6").value =
      "2. Do NOT enter Employee Name. Use only Employee Code.";

    sheet.getCell("A7").value =
      "3. Refer to the 'Employee Reference' sheet for valid Employee Codes.";

    sheet.getCell("A8").value =
      "4. Refer to the 'Module Reference' sheet for valid Module Codes.";

    sheet.getCell("A9").value =
      "5. Before importing, keep ONLY the 'Approval Matrix Template' sheet in the workbook.";

    sheet.getCell("A10").value =
      "6. Right-click the 'Approval Matrix Template' sheet → Move or Copy... → (new book) → Create a copy.";

    sheet.getCell("A11").value =
      "7. Save the new workbook and import that file.";

    sheet.getCell("A12").value =
      "8. Do NOT import this template workbook directly because it contains reference sheets.";

    for (let i = 5; i <= 12; i++) {
      sheet.getCell(`A${i}`).alignment = {
        wrapText: true,
      };
    }

    sheet.getColumn("A").width = 100;

    const empSheet = workbook.addWorksheet("Employee Reference");

    const empHeader = empSheet.addRow([
      "Emp Code",
      "Employee Name",
      "EMPLOYEE DESIGNATION",
    ]);

    empHeader.eachCell((cell) => {
      cell.font = {
        bold: true,
        color: { argb: "FFFFFFFF" },
      };

      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF4472C4" },
      };
    });

    Employees.forEach((emp) => {
      empSheet.addRow([
        emp.EMPCODE,
        emp.EMPLOYEENAME,
        emp.EMPLOYEEDESIGNATION,
      ]);
    });

    const moduleSheet = workbook.addWorksheet("Module Reference");

    const moduleHeader = moduleSheet.addRow([
      "Module Code",
    ]);

    moduleHeader.eachCell((cell) => {
      cell.font = {
        bold: true,
        color: { argb: "FFFFFFFF" },
      };

      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF4472C4" },
      };
    });

    moduleName.forEach((m) => {
      moduleSheet.addRow([m.value]);
    });

    workbook.worksheets.forEach((worksheet) => {
      worksheet.columns.forEach((column) => {
        let maxLength = 10;

        column.eachCell({ includeEmpty: true }, (cell) => {
          const len = cell.value ? cell.value.toString().length : 0;
          if (len > maxLength) maxLength = len;
        });

        column.width = Math.min(maxLength + 5, 40);
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="Approval_matrix_Import_Template.xlsx"'
    );

    await workbook.xlsx.write(res);

    res.end();
  } catch (error) {
    console.error("Error creating workbook:", error);
    return res.status(500).send("Internal Server Error");
  } finally {
    if (sequelize) await sequelize.close();
  }
};

exports.excelimportapprovalmatrix = async function (req, res, next) {
  const sequelize = await dbname(req, req.headers.compcode);
  const t = await sequelize.transaction();
  try {
    const Insu_Data = _ApprovalMatrix(sequelize, DataTypes);
    const excelFile = req.files["excel"][0];
    if (!excelFile) {
      await sequelize.close();
      return res.status(400).send({ Message: "No file uploaded" });
    }
    const allowedModules = new Set(moduleName.map((m) => m.value));
    const EmployeeMaster = _Employeemaster(sequelize, DataTypes);

    const user = req.body.user;
    const branch = req.body.branch;

    const workbook = xlsx.read(excelFile.buffer, {
      type: "buffer",
      cellDates: true,
    });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const transformedData = xlsx.utils.sheet_to_json(sheet, { defval: "" });

    if (!transformedData.length) {
      await sequelize.close();
      return res
        .status(500)
        .send({ Message: "No data found in Excel or may be Invalid format" });
    }

    const renameKeys = (obj) => {
      const keyMap = {
        module_code: "module_code",
        empcode: "empcode",
        approver1_A: "approver1_A",
        approver1_B: "approver1_B",
        approver2_A: "approver2_A",
        approver2_B: "approver2_B",
        approver3_A: "approver3_A",
        approver3_B: "approver3_B",
      };
      return Object.keys(obj).reduce((acc, key) => {
        const newKey = keyMap[key] || key;
        acc[newKey] = obj[key] === "" ? null : String(obj[key]);
        return acc;
      }, {});
    };

    const data = transformedData.map(renameKeys);

    function adjustToIST(dateStr) {
      try {
        const date = new Date(dateStr);
        date.setHours(date.getHours() + 5);
        date.setMinutes(date.getMinutes() + 31);
        const ISTDateStr = date.toISOString();
        return ISTDateStr.slice(0, 10);
      } catch (err) {
        return parseDate(dateStr);
      }
    }

    function parseDate(dateStr) {
      const [day, month, year] = dateStr.split("/");
      const date = new Date(`${year}-${month}-${day}`);
      if (!isNaN(date.getTime())) {
        return date.toISOString().slice(0, 10);
      }
      return null;
    }

    const ErroredData = [];
    const CorrectData = [];
    let insertedCount = 0;
    let updatedCount = 0;

    const existingRecords = await Insu_Data.findAll({
      attributes: ["empcode", "module_code"],
      raw: true,
    });

    const existingKeys = new Set(
      existingRecords.map((e) => `${e.empcode}|${e.module_code}`)
    );

    const seenKeysInFile = new Set();
    const recordsToInsert = [];

    const validEMP = new Set(
      (
        await EmployeeMaster.findAll({
          attributes: ["EMPCODE"],
          raw: true,
        })
      ).map((e) => e.EMPCODE)
    );


    for (const obj of data) {
      const oldObj = { ...obj };
      const rejectionReasons = [];

      if (!validEMP.has(obj.empcode)) {
        rejectionReasons.push(
          `Invalid EMPCODE '${obj.empcode}'. Not found in Employee Master.`
        );
      }
      if (!allowedModules.has(obj.module_code)) {
        rejectionReasons.push(
          `Invalid module_code '${obj.module_code}'. Module not found in allowed list.`
        );
      }

      const key = `${obj.empcode}|${obj.module_code}`;
      if (seenKeysInFile.has(key)) {
        rejectionReasons.push(
          "Duplicate record in Excel file for same empcode and module_code."
        );
      } else {
        seenKeysInFile.add(key);
      }

      // Validate Approver A values
      if (
        obj.approver1_A &&
        obj.approver2_A &&
        obj.approver1_A === obj.approver2_A
      ) {
        rejectionReasons.push(
          "Approver1_A and Approver2_A should not be the same."
        );
      }
      if (
        obj.approver1_A &&
        obj.approver3_A &&
        obj.approver1_A === obj.approver3_A
      ) {
        rejectionReasons.push(
          "Approver1_A and Approver3_A should not be the same."
        );
      }
      if (
        obj.approver2_A &&
        obj.approver3_A &&
        obj.approver2_A === obj.approver3_A
      ) {
        rejectionReasons.push(
          "Approver2_A and Approver3_A should not be the same."
        );
      }

      // Validate Approver B values
      if (
        obj.approver1_B &&
        obj.approver2_B &&
        obj.approver1_B === obj.approver2_B
      ) {
        rejectionReasons.push(
          "Approver1_B and Approver2_B should not be the same."
        );
      }
      if (
        obj.approver1_B &&
        obj.approver3_B &&
        obj.approver1_B === obj.approver3_B
      ) {
        rejectionReasons.push(
          "Approver1_B and Approver3_B should not be the same."
        );
      }
      if (
        obj.approver2_B &&
        obj.approver3_B &&
        obj.approver2_B === obj.approver3_B
      ) {
        rejectionReasons.push(
          "Approver2_B and Approver3_B should not be the same."
        );
      }

      if (rejectionReasons.length > 0) {
        ErroredData.push({
          ...oldObj,
          rejectionReasons: rejectionReasons.join(", "),
        });
      } else {
        obj.Location = branch;

        if (existingKeys.has(key)) {
          // console.log(`🔄 Updating record for: ${key}`);
          await Insu_Data.update(
            {
              ...obj,
              Created_by: user,
            },
            {
              where: {
                empcode: obj.empcode,
                module_code: obj.module_code,
              },
              transaction: t,
            }
          );
          CorrectData.push({ ...obj, _action: "updated" });
          updatedCount++;
        } else {
          obj.Created_by = user;
          // console.log("🆕 Inserting new record with Created_By:", user);
          // console.log("📥 Insert Data Object:", obj);

          recordsToInsert.push(obj);
          CorrectData.push({ ...obj, _action: "inserted" });
          insertedCount++;
        }
      }
    }

    if (recordsToInsert.length > 0) {
      await Insu_Data.bulkCreate(recordsToInsert, { transaction: t });
    }

    await t.commit();
    res.status(200).send({
      ErroredData: ErroredData,
      CorrectData: CorrectData,
      Message: `${insertedCount} Records Inserted, ${updatedCount} Records Updated.`,
    });
  } catch (error) {
    await t.rollback();
    console.error("Error:", error);
    res.status(500).json({ Message: "An error occurred during file import." });
  } finally {
    await sequelize.close();
  }
};

exports.importformatuser = async function (req, res) {
  const sequelize = await dbname(req, req.query.compcode);
  try {
    const Headeres = [
      "User_Name",
      "User_Pwd",
      "User_mob",
      "User_Email",
      "Multi_loc",
      "EMPCODE",
      "emp_dms_code",
      "Template_Name", // <-- new column
    ];

    const workbook = new ExcelJS.Workbook();

    // ---------- Sheet 1: entry template ----------
    const worksheet = workbook.addWorksheet("Sheet1");
    const headerRow = worksheet.addRow(Headeres);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF006400" },
      };
    });
    worksheet.addRow();
    worksheet.addRow();
    worksheet.columns.forEach((column) => {
      let maxWidth = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const columnWidth = cell.value ? cell.value.toString().length : 10;
        maxWidth = Math.max(maxWidth, columnWidth);
      });
      column.width = maxWidth < 30 ? maxWidth : 30;
    });

    // ---------- Sheet 2: valid Template Names (from Master_User_Right) ----------
    const templateSheet = workbook.addWorksheet("TemplateNames");
    const trHeaderRow = templateSheet.addRow(["ID", "Template_Name (MISC_NAME)"]);
    trHeaderRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF006400" },
      };
    });

    const templateRows = await sequelize.query(
      `SELECT DISTINCT MISC_NAME, MIN(ID) as ID
       FROM Master_User_Right
       WHERE MISC_NAME IS NOT NULL
       GROUP BY MISC_NAME`
    );
    (templateRows[0] || []).forEach((row) => {
      templateSheet.addRow([row.ID, row.MISC_NAME]);
    });
    templateSheet.columns.forEach((column) => {
      let maxWidth = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const columnWidth = cell.value ? cell.value.toString().length : 10;
        maxWidth = Math.max(maxWidth, columnWidth);
      });
      column.width = maxWidth < 30 ? maxWidth : 30;
    });

    res
      .status(200)
      .setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="user_Import_Template.xlsx"'
    );
    return workbook.xlsx
      .write(res)
      .then(() => res.end())
      .catch((error) => {
        console.error("Error creating workbook:", error);
        res.status(500).send("Internal Server Error");
      });
  } catch (e) {
    console.log(e);
    // ...keep your existing fallback branch unchanged...
  } finally {
    if (sequelize) {
      await sequelize.close();
    }
  }
};

exports.excelimportuser = async function (req, res, next) {
  const sequelize = await dbname(req, req.headers.compcode);
  const t = await sequelize.transaction();
  try {
    const excelFile = req.files["excel"][0];
    if (!excelFile) {
      await t.rollback();
      await sequelize.close();
      return res.status(400).send({ Message: "No file uploaded" });
    }
    const workbook = xlsx.read(excelFile.buffer, {
      type: "buffer",
      cellDates: true,
    });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const transformedData = xlsx.utils.sheet_to_json(sheet, { defval: "" });

    if (!transformedData.length) {
      await t.rollback();
      await sequelize.close();
      return res
        .status(500)
        .send({ Message: "No data found in Excel or may be Invalid format" });
    }

    const renameKeys = (obj) => {
      const keyMap = {
        User_Name: "User_Name",
        User_Pwd: "User_Pwd",
        User_mob: "User_mob",
        User_Email: "User_Email",
        Module_Code: "Module_Code",
        Multi_loc: "Multi_loc",
        EMPCODE: "EMPCODE",
        emp_dms_code: "emp_dms_code",
        Template_Name: "Template_Name",
      };
      return Object.keys(obj).reduce((acc, key) => {
        const cleanKey = key.trim();
        const newKey = keyMap[cleanKey] || cleanKey;
        acc[newKey] = obj[key] === "" ? null : String(obj[key]).trim();
        return acc;
      }, {});
    };

    var User_Tbl = _UserTbl(sequelize, DataTypes);
    var RightsTbl = _UserRights(sequelize, DataTypes);

    const data = transformedData.map(renameKeys);
    const ErroredData = [];
    const CorrectData = [];

    for (const item of data) {
      const rejectionReasons = [];
      const existingUser = await User_Tbl.findOne({
        where: {
          user_name: item.User_Name,
          Module_Code: 10,
        },
        transaction: t, // ADDED
      });

      if (existingUser) {
        rejectionReasons.push("User Already Exists");
        ErroredData.push({
          ...item,
          rejectionReasons: rejectionReasons.join(""),
        });
        continue;
      }

      const maxUser = await sequelize.query(
        `select isnull(max(user_code)+1,1) as maxUserCode from user_tbl`,
        { transaction: t } // ADDED
      );
      const newUserCode = maxUser[0][0]?.maxUserCode;

      await User_Tbl.create(
        {
          ...item,
          User_Code: newUserCode,
          Export_Type: 1,
          Module_Code: 10,
        },
        { transaction: t } // ADDED
      );

      let rightsNote = "";
      if (item.Template_Name) {
        const roleRightsResult = await sequelize.query(
          `SELECT Optn_Name, Module_Code FROM Master_User_Right
           WHERE LTRIM(RTRIM(UPPER(MISC_NAME))) = UPPER(:templateName)
             AND Optn_Name IS NOT NULL`,
          { replacements: { templateName: item.Template_Name }, transaction: t } // ADDED
        );
        const roleRights = roleRightsResult[0];

        if (roleRights.length) {
          const rowsToInsert = roleRights.map((r) => ({
            User_Code: newUserCode,
            Optn_Name: r.Optn_Name,
            Module_Code: r.Module_Code,
          }));

          try {
            await RightsTbl.bulkCreate(rowsToInsert, { transaction: t }); // ADDED transaction
          } catch (insertErr) {
            console.error("RIGHTS INSERT FAILED:", insertErr); // exact DB error will print here
            throw insertErr; // bubble up so whole row rolls back cleanly
          }
        } else {
          rightsNote = `User created, but Template Name "${item.Template_Name}" has no rights configured.`;
        }
      } else {
        rightsNote = "User created without any Template Name / rights.";
      }

      CorrectData.push({
        ...item,
        rejectionReasons: rightsNote,
      });
    }

    await t.commit(); // ADDED — commit only after full loop succeeds
    res.status(200).send({
      ErroredData: ErroredData,
      CorrectData: CorrectData,
      Message: `${CorrectData.length} Records Inserted`,
    });
  } catch (error) {
    await t.rollback();
    console.error("Error:", error);
    res.status(500).json({ Message: "An error occurred during file import." });
  } finally {
    await sequelize.close();
  }
};
exports.rightsupdateformat = async function (req, res) {
  const sequelize = await dbname(req, req.query.compcode);
  try {
    const Headeres = ["TITLE", "KEY", "NEW KEY"];
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    const headerRow = worksheet.addRow(Headeres);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } }; // white font color
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF006400" }, // dark green background color
      };
    });
    worksheet.addRow();
    worksheet.addRow();
    worksheet.columns.forEach((column) => {
      let maxWidth = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const columnWidth = cell.value ? cell.value.toString().length : 10; // Minimum width 10
        maxWidth = Math.max(maxWidth, columnWidth);
      });
      column.width = maxWidth < 30 ? maxWidth : 30; // Set maximum width to 30
    });
    res
      .status(200)
      .setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="userrights_Import_Template.xlsx"'
    );
    return workbook.xlsx
      .write(res)
      .then(() => {
        res.end();
      })
      .catch((error) => {
        console.error("Error creating workbook:", error);
        res.status(500).send("Internal Server Error");
      });
  } catch (e) {
    console.log(e);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    res
      .status(200)
      .setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="Excel_import_Template.xlsx"'
    );
    return workbook.xlsx
      .write(res)
      .then(() => {
        res.end();
      })
      .catch((error) => {
        console.error("Error creating workbook:", error);
        res.status(500).send("Internal Server Error");
      });
  } finally {
    if (sequelize) {
      await sequelize.close();
    }
  }
};
exports.importformatuserrights = async function (req, res) {
  const sequelize = await dbname(req, req.query.compcode);
  try {
    const Headeres = ["User_Code", "Optn_Name", "Module_Code"];
    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet("Sheet1");
    const headerRow = worksheet.addRow(Headeres);

    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF006400" },
      };
    });

    worksheet.addRow();
    worksheet.addRow();

    worksheet.columns.forEach((column) => {
      let maxWidth = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const columnWidth = cell.value ? cell.value.toString().length : 10;
        maxWidth = Math.max(maxWidth, columnWidth);
      });
      column.width = maxWidth < 30 ? maxWidth : 30;
    });

    const sheet2 = workbook.addWorksheet("Sheet2");
    const sheet2Headers = ["User_Code", "User_Name"];
    const sheet2HeaderRow = sheet2.addRow(sheet2Headers);

    sheet2HeaderRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF006400" },
      };
    });

    // GET DATA FROM DB FOR CONDITIONS module_code = 10 & export_type < 3
    const users = await sequelize.query(
      `SELECT user_code, user_name
       FROM USER_TBL
       WHERE Module_Code = 10 AND export_type < 3`,
      { type: sequelize.QueryTypes.SELECT }
    );

    // Insert all rows in sheet2
    users.forEach((row) => {
      sheet2.addRow([row.user_code, row.user_name]);
    });

    // Auto column width
    sheet2.columns.forEach((column) => {
      let maxWidth = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const columnWidth = cell.value ? cell.value.toString().length : 10;
        maxWidth = Math.max(maxWidth, columnWidth);
      });
      column.width = maxWidth < 30 ? maxWidth : 30;
    });

    res.status(200).setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="userrights_Import_Template.xlsx"`
    );

    return workbook.xlsx.write(res).then(() => res.end());

  } catch (e) {
    console.error(e);
    res.status(500).send("Internal Server Error");
  } finally {
    if (sequelize) await sequelize.close();
  }
};


exports.excelimportuserrights = async function (req, res, next) {
  const sequelize = await dbname(req, req.headers.compcode);
  const t = await sequelize.transaction();

  try {
    const excelFile = req.files["excel"][0];
    if (!excelFile) {
      return res.status(400).send({ Message: "No file uploaded" });
    }

    const workbook = xlsx.read(excelFile.buffer, {
      type: "buffer",
      cellDates: true,
    });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const transformedData = xlsx.utils.sheet_to_json(sheet, { defval: "" });

    if (!transformedData.length) {
      return res.status(500).send({
        Message: "No data found in Excel or may be Invalid format",
      });
    }

    const renameKeys = (obj) => ({
      User_Code: obj.User_Code?.toString() || null,
      Optn_Name: obj.Optn_Name?.toString() || null,
      Module_Code: obj.Module_Code?.toString() || null,
    });

    var User_Tbl = _UserRights(sequelize, DataTypes);

    const data = transformedData.map(renameKeys);

    const CorrectData = [];
    const ErroredData = [];

    for (const item of data) {

      // ❗ Validation (optional but recommended)
      if (!item.User_Code || !item.Module_Code || !item.Optn_Name) {
        ErroredData.push({
          ...item,
          rejectionReasons: "Missing required fields"
        });
        continue;
      }

      // ✅ CHECK DUPLICATE
      const existing = await User_Tbl.findOne({
        where: {
          User_Code: item.User_Code,
          Module_Code: item.Module_Code,
          Optn_Name: item.Optn_Name,
        },
        transaction: t
      });

      if (existing) {
        // ❌ SKIP WITH REASON
        ErroredData.push({
          ...item,
          rejectionReasons: `Already exists for User: ${item.User_Code}, Module: ${item.Module_Code}, Option: ${item.Optn_Name}`
        });
        continue;
      }

      // ✅ INSERT
      await User_Tbl.create(item, { transaction: t });

      CorrectData.push({
        ...item
      });
    }

    await t.commit();

    res.status(200).send({
      Inserted: CorrectData.length,
      Failed: ErroredData.length,
      CorrectData,
      ErroredData,
      Message: `${CorrectData.length} inserted, ${ErroredData.length} skipped`,
    });

  } catch (error) {
    await t.rollback();
    console.error("Error:", error);

    res.status(500).json({
      Message: "An error occurred during file import.",
    });
  } finally {
    await sequelize.close();
  }
};


const maskOTPInMessage = (text) => {
  if (text == null) return "";

  return String(text).replace(/\d+/g, (match) => "*".repeat(match.length));
};
exports.MessageHistory = async function (req, res) {
  const sequelize = await dbname("", "DBCON");
  const t = await sequelize.transaction();
  try {
    const DATE_FROM = req.body.DATE_FROM;
    const DATE_TO = req.body.DATE_TO;
    // Remove only specified rights for each employee in empCodeList
    const data = await sequelize.query(
      `select ToFromPhoneNo ,MsgText,SentOrFailTime , MsgStatus,TemplateName,MsgCategory,BalUsed,
      DeliveredTime,ReadTime from WhatsAppMessages  where DLR_ID = '${req.headers.compcode.split("-")[0]
      }' and cast(Created_date as date) between '${DATE_FROM}' and '${DATE_TO}' and ToFromPhoneNo is not null`
    );

    const countData = await sequelize.query(
      `SELECT
    TYPE,
    COUNT(*) AS TotalCount
FROM (
    SELECT
         CASE
            WHEN msgcategory = 'marketing' THEN 'MARKETTING'
            ELSE 'REGULAR'
        END AS TYPE
    FROM WhatsAppMessages
    WHERE CAST(Created_date AS DATE) BETWEEN :DATE_FROM AND :DATE_TO and ToFromPhoneNo is not null
      AND DLR_ID = '${req.headers.compcode.split("-")[0]}'
) t
GROUP BY TYPE

UNION ALL

SELECT
    'TOTALCOUNT' AS TYPE,
    COUNT(*) AS TotalCount
FROM WhatsAppMessages
WHERE CAST(Created_date AS DATE) BETWEEN :DATE_FROM AND :DATE_TO and ToFromPhoneNo is not null
  AND DLR_ID = '${req.headers.compcode.split("-")[0]}'`,
      {
        replacements: { DATE_FROM, DATE_TO },
        type: sequelize.QueryTypes.SELECT,
        transaction: t
      }
    );

    const sequelize1 = await dbname(req, req.headers.compcode);
    const [paymentData] = await sequelize1.query(
      `  SELECT
    ISNULL(Wtsp_markting_per_msz_chrg, 0) AS MARKETTING,
    ISNULL(Wtsp_utility_per_msz_chrg, 0) AS REGULAR
  FROM COMP_KEYDATA`
    );

    console.log(paymentData, "paymentData");

    console.log(paymentData, "paymentData")
    await t.commit();
    const finalData = data[0].map((row) => ({
      ...row,
      MsgText: maskOTPInMessage(row.MsgText),
    }));
    res.status(200).send({
      Message: "",
      data: finalData,
      countSummary: countData,
      paymentData
    });
  } catch (e) {
    await t.rollback();
    console.log(e);
    res.status(500).send({
      success: false,
      message: "An error occurred while removing rights.",
    });
  } finally {
    await sequelize.close();
  }
};

exports.savedealerrights = async function (req, res) {
  const checkedKeys2 = req.body.checkedKeys2;
  const sequelize = await dbname(req, req.headers.compcode);
  const t = await sequelize.transaction();
  var RightsTbl = _UserRights(sequelize, DataTypes);

  try {
    await sequelize.query(
      `delete from user_rights where module_code=50 and user_code='-1'`
    );
    const rightsData = checkedKeys2
      .filter((right) => right?.length > 4)
      .map((right) => ({
        User_Code: -1,
        Optn_Name: right,
        Module_Code: 50,
      }));
    const a = [...rightsData];
    await RightsTbl.bulkCreate(a, { transaction: t });
    await t.commit();
    let Message = `User Created successfully on User Code`;
    res.status(200).send({
      Message: Message,
    });
  } catch (e) {
    await t.rollback();
    console.log(e);
    res.status(500).send({
      success: false,
      message: "An error occurred while creating user.",
    });
  } finally {
    await sequelize.close();
  }
};

exports.findDealerRights = async function (req, res) {
  let sequelize;
  try {
    sequelize = await dbname(req, req.headers.compcode);
    var RightsTbl = _UserRights(sequelize, DataTypes);
    const userRightsData = await RightsTbl.findAll({
      where: {
        User_Code: -1,
        Module_Code: 50,
      },
    });

    const rights = userRightsData.map((item) => item.Optn_Name);
    await sequelize.close();
    res.status(200).send({ success: true, rights });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .send({ success: "false", message: "Internal Server Error" });
  } finally {
    await sequelize.close();
  }
};

exports.savewhatsapprights = async function (req, res) {
  const checkedKeys2 = req.body.checkedKeys2;
  const sequelize = await dbname(req, req.headers.compcode);
  const t = await sequelize.transaction();
  var RightsTbl = _UserRights(sequelize, DataTypes);

  try {
    await sequelize.query(
      `delete from WhatsappRights where module_code=11`
    );
    const rightsData = checkedKeys2
      .filter((right) => right?.length > 4)
      .map((right) => ({
        User_Code: -1,
        Optn_Name: right,
        Module_Code: 50,
      }));
    const a = [...rightsData];
    await RightsTbl.bulkCreate(a, { transaction: t });
    await t.commit();
    let Message = `User Created successfully on User Code`;
    res.status(200).send({
      Message: Message,
    });
  } catch (e) {
    await t.rollback();
    console.log(e);
    res.status(500).send({
      success: false,
      message: "An error occurred while creating user.",
    });
  } finally {
    await sequelize.close();
  }
};

//map the name with the api folder name
const moduleMapping = {
  "11": "Dashboard",
  "11.1": "Sales Dashboards",
  "11.2": "Workshop Dashboards",
  "11.3": "Bodyshop Dashboards",
  "11.4": "HRMS Dashboards",
  "11.5": "Other Dashboards",
  "99.2": "Workshop MIS",
  "99.3": "Bodyshop MIS",
  "20": "Bank Connect",
  "1.8": "Payment's ",
  "9": "Presale",
  "9.1": "quotation",
  "1.1": "discount",
  "1.12": "manualdiscount", //manualdiscount, veh_pre_invoice, customer_deal_sheet
  "1.25": "manualdiscount",
  "9.15": "manualdiscount",
  "9.2": "BookAlot",
  "1.11": "refund",
  "9.4": "Vehicle Delivery Tracker",
  "9.12": "Manual Gatepass",
  "9.8": "Stock Management",
  "9.6": "New Car Audit",
  "9.9": "Payment_Tracker",
  "9.14": "RTO",
  "9.10": "Cost Sheet",
  "17": "Sales",
  "10.1.1": "MGAApproval",
  "1.13": "Inventory Management",
  "17.1": "Cost Sheet (ICM)",
  "17.2": "Manual Invoice",
  "17.4": "MSIL Offer Upload",
  "1.2": "finpayout",
  "17.5": "MSIL RECEIVABLE",
  "17.3": "Reports",
  "2": "Payroll",
  "2.1": "Masters",
  "2.2": "interview",
  "2.3": "OnBoarding",
  "2.4": "HCM",
  "2.5": "Attendance Punch",
  "2.6": "ARS",
  "2.8": "Payroll",
  "2.16": "Reports",
  "2.7": "Excel Import",
  "2.9": "Compliance",
  "2.15": "Loan & Advance",
  "2.14": "Travel Claims",
  "2.12": "Employee Gatepass",
  "2.13": "Employee Exit Process",
  "3": "Insurance",
  "4": "Service",
  "4.2": "service",
  "4.7": "WorkShop Management",
  "4.3": "Parts Tracker",
  "4.4": "service",
  "4.5": "service",
  "4.8": "Master",
  "4.1": "Service",
  "5": "True Value",
  "5.1": "TvCostSheet",
  "5.2": "TvCostSheet",
  "5.3": "TvCostSheet",
  "6": "Incentive",
  "6.1": "Incentive",
  "6.2": "Workshop Incentive",
  "7": "Asset",
  "7.1": "asset",
  "7.2": "asset",
  "7.3": "asset",
  "7.6": "asset",
  "7.11": "asset",
  "7.9": "asset",
  "7.10": "asset",
  "7.7": "DashBoards",
  "7.8": "Report",
  "12": "asset",
  "12.4": "asset",
  "12.1": "asset",
  "12.2": "asset",
  "12.3": "asset",
  "12.5": "Reports",
  "13": "ExpenseAprvl",
  "2.11": "ExpenseAprvl",
  "14": "Demo Car Gatepass",
  "2.10": "DemoCar",
  "1.7": "fuel",
  "1": "Accounts ERP",
  "1.4": "Petty Cash",
  "1.6": "Budget",
  "1.9": "Ledger Master",
  "1.10": "Voucher",
  "1.14": "Daily Cash Updation",
  "1.15": "Masters",
  "1.16": "Voucher",
  "1.17": "Financial View",
  "1.18": "Financial Reports",
  "1.19": "BRS",
  "1.20": "GSTR",
  "1.21": "TDS - TCS",
  "16": "Honda Autowheels",
  "19": "Document Management",
  "18": "Excel Import Utility",
  "21": "Auto Net",
  "22": "Exceptional Reports",
};


exports.saveWhatsappRights1 = async function (req, res) {
  const { checkedKeys2, compcode, created_by } = req.body;
  const sequelize = await dbname(req, req.headers.compcode);
  const WhatsappRightsTbl = _WhatsappRights(sequelize, DataTypes);
  try {
    await sequelize.transaction(async (t) => {
      await WhatsappRightsTbl.destroy({ where: { compcode }, transaction: t });


      const rightsData = checkedKeys2.map((key) => ({
        compcode,
        Module_Code: key,
        Module_Name: moduleMapping[key] || "Unknown",
        Date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        Flag: 1,
        Created_By: req.body?.user?.name
      }));

      console.log(" Inserting records:", rightsData.length);
      await WhatsappRightsTbl.bulkCreate(rightsData, { transaction: t });
      console.log("✅ Insert successful");
      const moduleCodes = checkedKeys2.join(",");
      const updateQuery = `
        UPDATE COMP_KEYDATA
        SET Whatsapp_Module_Code = :moduleCodes
       
      `;
      console.log("🔄 Updating COMP_KEYDATA...");
      await sequelize.query(updateQuery, {
        replacements: { moduleCodes },
        transaction: t,
      });
      console.log("✅ COMP_KEYDATA updated successfully");
    });




    res.status(200).send({
      Status: true,
      Message: "Whatsapp Rights saved successfully.",
    });
  } catch (e) {
    console.error("❌ Error saving WhatsApp Rights:", e.message);
    res.status(500).send({
      Status: false,
      Message: "Error while saving WhatsApp Rights.",
      Error: e.message,
    });
  } finally {
    await sequelize.close();
  }
};

exports.findWhatsappRights = async function (req, res) {
  let sequelize;
  try {
    sequelize = await dbname(req, req.headers.compcode);
    const WhatsappRightsTbl = _WhatsappRights(sequelize, DataTypes);

    // Fetch rights for this company
    const whatsappRightsData = await WhatsappRightsTbl.findAll({
      where: {
        compcode: req.headers.compcode, // filter by company
      },
      attributes: ["Module_Code"], // only need the module codes
    });

    // Extract only the module codes
    const rights = whatsappRightsData.map((item) => item.Module_Code);

    res.status(200).send({
      success: true,
      rights,
    });
  } catch (error) {
    console.error("Error in findWhatsappRights:", error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  } finally {
    await sequelize.close();
  }
};


exports.findCompanyRights = async function (req, res) {
  let sequelize;
  try {
    sequelize = await dbname(req, req.headers.compcode);
    var RightsTbl = _UserRights(sequelize, DataTypes);
    const userRightsData = await RightsTbl.findAll({
      where: {
        User_Code: -3,
        Module_Code: 10,
      },
    });

    const rights = userRightsData.map((item) => item.Optn_Name);
    res.status(200).send({ success: true, rights });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .send({ success: "false", message: "Internal Server Error" });
  } finally {
    await sequelize.close();
  }
};

exports.saveCompanyRights = async function (req, res) {
  const checkedKeys2 = req.body.userRights.rights;
  const checkedKeys3 = req.body.userBasedRights.UbR;
  const sequelize = await dbname(req, req.headers.compcode);
  const t = await sequelize.transaction();
  var RightsTbl = _UserRights(sequelize, DataTypes);
  try {
    // console.log(req.body);
    await sequelize.query(
      `delete from user_rights where module_code=10 and user_code='-3' and Comp_Usercode = '${req.body.UserTbl.User_Code}'`
    );
    await sequelize.query(
      `delete from user_rights where module_code=99 and user_code='-3'  and Comp_Usercode = '${req.body.UserTbl.User_Code}'`
    );
    const rightsData = checkedKeys2
      .filter((right) => right?.length > 4)
      .map((right) => ({
        User_Code: -3,
        Optn_Name: right,
        Module_Code: 10,
        Comp_Usercode: req.body.UserTbl.User_Code,
      }));
    const rightsDataofuser = checkedKeys3
      .filter((right) => right?.length > 4)
      .map((right) => ({
        User_Code: -3,
        Optn_Name: right,
        Module_Code: 99,
        Comp_Usercode: req.body.UserTbl.User_Code,
      }));
    const a = [...rightsData, ...rightsDataofuser];
    await RightsTbl.bulkCreate(a, { transaction: t });
    await t.commit();
    let Message = `User Created successfully on User Code`;
    res.status(200).send({
      Message: Message,
    });
  } catch (e) {
    await t.rollback();
    console.log(e);
    res.status(500).send({
      success: false,
      message: "An error occurred while creating user.",
    });
  } finally {
    await sequelize.close();
  }
};

exports.addrelease = async function (req, res) {
  const sequelize = await dbname("", "DBCON");
  try {
    const { module_name, platform, release_date, description, created_by } =
      req.body;
    const Insu_Data = _ReleaseNote(sequelize, DataTypes);

    const newReleaseNote = await Insu_Data.create({
      module_name,
      platform,
      release_date,
      description,
      created_by,
    });

    res.status(201).send({
      success: true,
      message: "Release note added successfully!",
      data: newReleaseNote,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "An error occurred while creating user.",
    });
  } finally {
    await sequelize.close();
  }
};
exports.updaterelease = async function (req, res) {
  const sequelize = await dbname("", "DBCON");
  try {
    const { id, module_name, platform, release_date, description, created_by } =
      req.body;
    const Insu_Data = _ReleaseNote(sequelize, DataTypes);

    const [updated] = await Insu_Data.update(
      {
        module_name,
        platform,
        release_date,
        description,
        created_by,
      },
      {
        where: { id }, // Find the release note by id
      }
    );

    res.status(200).send({
      success: true,
      message: "Release note updated successfully!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "An error occurred while creating user.",
    });
  } finally {
    await sequelize.close();
  }
};
exports.findrelease = async function (req, res) {
  const sequelize = await dbname("", "DBCON");
  try {
    const result = await sequelize.query(
      `select id,module_name, platform, release_date, description from  release_notes order by release_date desc`
    );
    res.status(200).send(result[0]);
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "An error occurred while creating user.",
    });
  } finally {
    await sequelize.close();
  }
};

exports.findreleaseforlogin = async function (req, res) {
  const sequelize = await dbname(req, "DBCON");

  try {
    const result = await sequelize.query(`
      SELECT module_name, platform, release_date, description, ImgSourseArray ,solution ,benefit  
      FROM release_notes
      ORDER BY platform, release_date DESC
    `);

    const releaseNotes = { web: [], mobile: [] };

    result[0].forEach((note) => {
      const {
        module_name,
        platform,
        release_date,
        description,
        ImgSourseArray,
        solution,
        benefit,
      } = note;

      // Try to parse image array
      let imageArray = [];
      try {
        if (ImgSourseArray) {
          imageArray = JSON.parse(ImgSourseArray);
        }
      } catch (err) {
        console.error("Failed to parse ImgSourseArray:", ImgSourseArray);
      }

      const noteData = {
        module_name,
        release_date,
        description,
        images: imageArray,
        solution,
        benefit, // 📸 returning as array
      };

      const platformNormalized = (platform || "").toLowerCase().trim();

      if (platformNormalized === "web") {
        releaseNotes.web.push(noteData);
      } else if (platformNormalized === "mobile") {
        releaseNotes.mobile.push(noteData);
      } else {
        // console.log("Unknown platform record:", note);
      }
    });

    res.status(200).send(releaseNotes);
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "An error occurred while creating user.",
    });
  } finally {
    await sequelize.close();
  }
};

exports.ViewEmpData = async function (req, res) {
  const sequelize = await dbname(req, req.headers.compcode);
  try {
    const UserCode = req.body.UserCode;
    let result = [];

    if (UserCode) {
      result = await sequelize.query(
        `select * from user_tbl where user_name = '${req.body.EMPCODE}' and export_type < 3 and module_code = 10 and user_code not in (${UserCode})`
      );
    } else {
      result = await sequelize.query(
        `select * from user_tbl where user_name = '${req.body.EMPCODE}' and export_type < 3 and module_code = 10`
      );
    }

    // Check if result array has values
    if (result[0] && result[0].length > 0) {
      res.status(200).send({
        Status: true,
        Message: "User Already Exists",
        Query: "",
        Result: result[0],
      });
    } else {
      res.status(404).send({
        Status: false,
        Message: "",
        Query: "",
        Result: result[0], // If no result found, send null for Result
      });
    }
  } catch (e) {
    console.error(e);
    res.status(500).send({
      Status: false,
      Message: "",
      Query: "",
      Result: null,
    });
  } finally {
    if (sequelize) {
      await sequelize.close();
    }
  }
};

exports.userrightsreport = async function (req, res) {
  const sequelize = await dbname(req, req.headers.compcode);
  try {
    const result =
      await sequelize.query(`select (select top 1 empcode from user_tbl where user_tbl.User_Code = user_rights.User_Code and Module_Code=10 and Export_Type<3) as Empcode,
 (select top 1 User_Name from USER_TBL where USER_TBL.User_Code=user_rights.User_Code and Module_Code=10 and Export_Type<3)as User_Name,
 User_Code,Optn_Name as Optn_Key,
 (SELECT MISC_NAME FROM MISC_MST WHERE MISC_TYPE = 68 AND misc_mst.Misc_Code = (select DIVISION from EMPLOYEEMASTER where empcode = 
 (select top 1 empcode from user_tbl where user_tbl.User_Code = user_rights.User_Code and Module_Code=10 and Export_Type<3))) AS Department,
 (select EMPLOYEEDESIGNATION from EMPLOYEEMASTER where empcode = (select top 1 empcode from user_tbl where user_tbl.User_Code = user_rights.User_Code and Module_Code=10 and Export_Type<3)) AS Desgination,
 (SELECT TOP 1 GODW_NAME FROM GODOWN_MST WHERE Godw_Code = (SELECT LOCATION FROM EMPLOYEEMASTER WHERE EMPCODE = (select top 1 empcode from user_tbl where user_tbl.User_Code = user_rights.User_Code and Module_Code=10 and Export_Type<3)))
 AS BRANCH from user_rights where module_code=10 and user_code>0 and user_code<>1 order by User_Code`);
    res.status(200).send(result[0]);
  } catch (e) {
    console.error(e);
    res.status(500).send({
      Status: false,
      Message: "",
      Query: "",
      Result: null,
    });
  } finally {
    if (sequelize) {
      await sequelize.close();
    }
  }
};

exports.userrightsreportexcelupdate = async function (req, res, next) {
  const sequelize = await dbname(req, req.headers.compcode);
  const t = await sequelize.transaction();
  try {
    const excelFile = req.files["excel"][0]; // Accessing the uploaded file
    if (!excelFile) {
      await sequelize.close();
      return res.status(400).send({ Message: "No file uploaded" });
    }
    const workbook = xlsx.read(excelFile.buffer, {
      type: "buffer",
      cellDates: true,
    });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const transformedData = xlsx.utils.sheet_to_json(sheet, { defval: "" });

    if (!transformedData.length) {
      await sequelize.close();
      return res
        .status(500)
        .send({ Message: "No data found in Excel or may be Invalid format" });
    }
    const data = transformedData;
    const correctdata = [];
    for (obj of data) {
      const key = typeof obj.key === "string" ? obj.key.trim() : obj.key;
      const newKey =
        typeof obj.new_key === "string" ? obj.new_key.trim() : obj.new_key;

      if (key !== "" && key !== null && newKey !== "" && newKey !== null) {
        await sequelize.query(
          `UPDATE user_rights SET Optn_Name='${newKey}' 
               WHERE TRIM(Optn_Name)='${key}' AND module_code=10`
        );
        correctdata.push(obj);
      }
    }

    await t.commit();
    res.status(200).send({
      ErroredData: [],
      CorrectData: correctdata,
      Message: `${correctdata.length} Records Updated`,
    });
  } catch (error) {
    await t.rollback();
    console.error("Error:", error);
    res.status(500).json({ Message: "An error occurred during file import." });
  } finally {
    await sequelize.close();
  }
};

// Save YouTube URL
exports.SaveYoutubeUrl = async (req, res) => {
  try {
    const { Erp_Url, YoutubeUrl } = req.body;
    const sequelize = await dbname("", "DBCON");
    if (!YoutubeUrl || !Erp_Url)
      return res.status(400).json({ message: "URL is required" });
    const YoutubeUrl_table = _YoutubeUrl(sequelize, DataTypes);
    const newUrl = await YoutubeUrl_table.upsert({ Erp_Url, YoutubeUrl });
    res.status(201).json({ message: "URL saved successfully", url: newUrl });
  } catch (error) {
    console.log(e);
    res.status(500).json({ message: "Error saving URL", error });
  } finally {
    await sequelize.close();
  }
};
// Save YouTube URL
exports.FindYoutubeUrls = async (req, res) => {
  let sequelize;
  try {
    const { Erp_Url, YoutubeUrl } = req.body;
    // console.log(req.body);
    sequelize = await dbname("", "DBCON");
    const newUrl = await sequelize.query(
      `select * from YoutubeUrl where Erp_Url  = '${Erp_Url}'`
    );
    res.status(201).json(newUrl[0]);
  } catch (error) {
    console.log(e);
    res.status(500).json({ message: "Error saving URL", error });
  } finally {
    await sequelize.close();
  }
};
async function uploadImages(files, Created_by) {
  try {
    let dataArray = [];
    await Promise.all(
      files?.map(async (file, index) => {
        const customPath = `AUTOVYN_PDF/`;
        const ext = path.extname(file.originalname);
        // Generate randomUUID

        // Append extension to randomUUID
        const fileName = Created_by + ext;
        // console.log(fileName);
        const formData = new FormData();
        formData.append("photo", file.buffer, fileName);
        formData.append("customPath", customPath);
        try {
          const response = await axios.post(
            `${FILE_UPLOAD_BASE_URL}/upload-photo`,
            formData,
            {
              headers: formData.getHeaders(),
            }
          );
          // console.log(`Image uploaded successfully`);
        } catch (error) {
          console.error(`Error uploading image ${index}:`, error.message);
        }
        const data = {
          SRNO: index,
          EMP_CODE: Created_by,
          Created_by: Created_by,
          DOC_NAME: file.originalname,
          misspunch_inout: index,
          columndoc_type: "ORDERBOOKING",
          DOC_PATH: `${customPath}${fileName}`,
        };
        dataArray.push(data);
      })
    );

    // console.log(dataArray, "dataArray");
    return dataArray;
  } catch (e) {
    console.log(e);
  }
}
exports.UploadHelpPdf = async function (req, res) {
  try {
    try {
      if (req.files) {
        const EMP_DOCS_data = await uploadImages(req.files, req.body.URL);
      }
      res.status(200).send({ Message: "Documents Updated" });
    } catch (e) {
      console.log(e);
    }
  } catch (e) {
    console.log(e);
  }
};
exports.myshortcuts = async function (req, res) {
  let sequelize;
  try {
    sequelize = await dbname(req, req.headers.compcode);
    const usercode = req.body.usercode;
    const selectedOptions = req.body.selectedOptions;

    const formattedData = Object.entries(selectedOptions).map(
      ([shortcut, url]) => [usercode, shortcut, url]
    );

    const valuesPlaceholder = formattedData.map(() => "(?, ?, ?)").join(", ");
    const values = formattedData.flat(); // Flatten the array for query replacements

    const sql = `
      MERGE INTO user_shortcuts AS target
      USING (VALUES ${valuesPlaceholder}) 
      AS source (usercode, shortcut, url)
      ON target.usercode = source.usercode AND target.shortcut = source.shortcut
      WHEN MATCHED THEN 
        UPDATE SET target.url = source.url
      WHEN NOT MATCHED THEN 
        INSERT (usercode, shortcut, url) VALUES (source.usercode, source.shortcut, source.url);
    `;

    await sequelize.query(sql, { replacements: values });

    res.json({ success: true, message: "Shortcuts saved successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ success: false, message: "Database error" });
  } finally {
    await sequelize.close();
  }
};

exports.getMyShortcuts = async function (req, res) {
  let sequelize;
  try {
    sequelize = await dbname(req, req.headers.compcode);
    const usercode = req.body.usercode; // Get usercode from request
    const sql = `
      SELECT shortcut, url 
      FROM user_shortcuts 
      WHERE usercode = ?;
    `;

    const results = await sequelize.query(sql, {
      replacements: [usercode],
      type: sequelize.QueryTypes.SELECT,
    });

    // Convert array to object format like { shortcut1: url1, shortcut2: url2 }
    const shortcuts = results.reduce((acc, row) => {
      acc[row.shortcut] = row.url;
      return acc;
    }, {});
    res.json(shortcuts);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ success: false, message: "Database error" });
  } finally {
    await sequelize.close();
  }
};

exports.getemployees = async function (req, res) {
  const sequelize = await dbname(req, req.headers.compcode);
  try {
    const result = await sequelize.query(`SELECT DISTINCT User_Code, User_Name 
    FROM user_tbl 
    WHERE ISNULL(export_type, 0) < 3 and Module_Code = 10 ORDER BY USER_NAME `);
    res.status(200).send(result[0]);
  } catch (e) {
    console.error(e);
    res.status(500).send({
      Status: false,
      Message: "",
      Query: "",
      Result: null,
    });
  } finally {
    if (sequelize) {
      await sequelize.close();
    }
  }
};

exports.GetUserRights = async function (req, res) {
  let sequelize;
  try {
    sequelize = await dbname(req, req.headers.compcode);
    var UserTbl = _UserTbl(sequelize, DataTypes);
    var RightsTbl = _UserRights(sequelize, DataTypes);

    // Sabhi users ka data nikalne ke liye saari entries fetch karenge
    const userCredsData = await UserTbl.findAll({
      where: {
        Export_Type: 1,
        Module_Code: 10,
      },
    });

    if (!userCredsData || userCredsData.length === 0) {
      return res
        .status(401)
        .send({ success: "false", message: "No users found" });
    }

    // Saare users ke rights nikalne ke liye
    const userRightsData = await RightsTbl.findAll({
      where: {
        Module_Code: 10,
      },
    });

    const userBasedRights = await RightsTbl.findAll({
      where: {
        Module_Code: 99,
      },
    });

    // User-wise grouping karenge
    // console.log(userRightsData, "userRightsData");
    const groupedUserRights = {};
    userRightsData.forEach((item) => {
      if (!groupedUserRights[item.User_Code]) {
        groupedUserRights[item.User_Code] = [];
      }
      groupedUserRights[item.User_Code].push(item.Optn_Name);
    });

    const groupedUserBasedRights = {};
    userBasedRights.forEach((item) => {
      if (!groupedUserBasedRights[item.User_Code]) {
        groupedUserBasedRights[item.User_Code] = [];
      }
      groupedUserBasedRights[item.User_Code].push(item.Optn_Name);
    });

    const data = userCredsData.map((user) => ({
      UTD: user.UTD,
      isActive: user.Export_Type == 1 ? 1 : 0,
      UserTbl: user,
      userRights: {
        rights: groupedUserRights[user.User_Code] || [],
        Module_Code: 10,
      },
      userBasedRights: {
        rights1: groupedUserBasedRights[user.User_Code] || [],
        Module_Code: 99,
      },
    }));

    res.status(200).send({ success: true, data });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .send({ success: "false", message: "Internal Server Error" });
  } finally {
    await sequelize.close();
  }
};

exports.getbankinguserrights = async function (req, res) {
  let sequelize;
  try {
    sequelize = await dbname(req, req.headers.compcode);
    const UserBank = _USER_BANK(sequelize, DataTypes);

    const data = await UserBank.findAll();

    // Mapping numeric codes to readable rights
    const bankRightsMap = {
      1: "Bank User Rights",
      2: "Pymt Aprvl. Setup",
      3: "API Configuration",
      4: "Branch Mail Id's",
      5: "Vendor Payment Setup",
      6: "MSIL Ledg Payment Setup",
      7: "Payment Approval Process",
      8: "Self Bank Transfer",
      9: "Corporate Card Pymt Transfer",
      10: "Vendor Quick Pymt Transfer",
      11: "MSIL Quick Payment Transfer",
      12: "Bank Statement",
      13: "Daily Statement",
      14: "Bank Bal. View",
      15: "API Unpost View",
      16: "Export User Rights",
      17: "HSBC Payment Setup",
      18: "HSBCQuick Pymt Transfer",
    };

    // Mapping your custom labels to DB field names
    const bankRightsMap1 = {
      "User Code": "User_Code",
      "Full Name": "User_Full_Name",
      "Mobile No": "User_WA",
      Email: "User_Mail",
      "Limit 1": "Limit_1",
      "Limit 2": "Limit_2",
      "Limit 3": "Limit_3",
      "Limit 4": "Limit_4",
      "Limit 5": "Limit_5",
      "Limit 6": "Limit_6",
      "Limit 7": "Limit_7",
      "Limit 8": "Limit_8",
      "Limit 9": "Limit_9",
      "Limit 10": "Limit_10",
      "Limit 11": "Limit_11",
      "Limit 12": "Limit_12",
      "Bank Rights": "Bank_Rights",
      "Modified By": "Mod_User",
      "Modified Date": "Mod_Date",
      "Modified Time": "Mod_Time",
      View: "Is_Admin",
      Statement: "Show_Statement",
      Balance: "Show_Balance",
    };

    const filteredData = data.filter((item) => item.Export_Type < 3);

    const formatted = filteredData.map((item) => {
      const jsonItem = item.toJSON();
      const renamed = {};

      for (const [label, field] of Object.entries(bankRightsMap1)) {
        if (field === "Is_Admin") {
          renamed[label] = jsonItem[field] === 2 ? "Yes" : "No";
        } else if (field === "Show_Statement") {
          renamed[label] = jsonItem[field] === 1 ? "Yes" : "No";
        } else if (field === "Show_Balance") {
          renamed[label] = jsonItem[field] === 1 ? "Yes" : "No";
        } else if (field === "Bank_Rights") {
          const rightsCodes = jsonItem[field]
            ? jsonItem[field]
              .split(",")
              .map((code) => parseInt(code.trim(), 10))
            : [];
          renamed[label] = rightsCodes
            .map((code) => bankRightsMap[code])
            .filter(Boolean)
            .join(" | ");
        } else {
          renamed[label] = jsonItem[field] ?? "";
        }
      }

      return renamed;
    });

    res.status(200).send({ success: true, data: formatted });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "Internal server error" });
  } finally {
    await sequelize.close();
  }
};

exports.updateDataForLeftEmployee = async function (req, res) {
  const sequelize = await dbname(req, req.headers.compcode);

  try {
    const { ExportType, UserCode, Mod_User } = req.body;

    if (!UserCode) {
      return res.status(404).send({
        status: false,
        message: "Please select User !! ",
      });
    }
    console.log(req.body, "req.body");
    // First, fetch the current Export_type
    const [userRows] = await sequelize.query(
      `SELECT Export_type FROM user_tbl WHERE  user_code = ${UserCode}`,
      { type: sequelize.QueryTypes.SELECT }
    );
    console.log(userRows, "userRows");

    if (!userRows) {
      return res.status(404).send({
        status: false,
        message: "User not found",
      });
    }

    if (userRows.Export_type == 3) {
      return res.status(409).send({
        status: false,
        message: "User already marked as left",
      });
    }

    if (ExportType == 3) {
      const updateEmpLeftQuery = `UPDATE user_tbl SET export_type = 3 , Mod_User = ${Mod_User} , Mod_Date = getDate() WHERE export_type = 1 AND user_code = ${UserCode}`;
      console.log(updateEmpLeftQuery, "updateEmpLeftQuery");

      const [result] = await sequelize.query(updateEmpLeftQuery);

      return res.status(200).send({
        status: true,
        message: "User marked as left successfully",
        result,
      });
    }

    return res.status(400).send({
      status: false,
      message: "Invalid ExportType value",
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      status: false,
      message: "Internal server error",
    });
  } finally {
    if (sequelize) await sequelize.close();
  }
};

exports.ExpenseRightsAddExtra = async function (req, res) {
  const { empCodeList, selectedExpense } = req.body;

  if (!empCodeList?.length) {
    return res
      .status(400)
      .send({ success: false, message: "empCodeList is required" });
  }

  if (!selectedExpense?.length) {
    return res
      .status(400)
      .send({ success: false, message: "selectedExpense is required" });
  }

  const sequelize = await dbname(req, req.headers.compcode);
  const t = await sequelize.transaction();

  try {
    const User_Tbl = _UserTbl(sequelize, DataTypes);

    // Fetch current Multi_Cash for all employees in the list (export_type < 3)
    const users = await User_Tbl.findAll({
      where: {
        empcode: empCodeList,
        export_type: { [Op.lt]: 3 },
      },
      transaction: t,
    });

    for (let user of users) {
      let currentRights = [];

      if (user.Multi_Cash && user.Multi_Cash.trim() !== "") {
        currentRights = user.Multi_Cash.split(",").map((r) => r.trim());
      }

      // Merge and remove duplicates
      const updatedRights = Array.from(
        new Set([...currentRights, ...selectedExpense.map(String)])
      );

      // Update user row
      await User_Tbl.update(
        { Multi_Cash: updatedRights.join(",") },
        {
          where: { empcode: user.EMPCODE, export_type: { [Op.lt]: 3 } },
          transaction: t,
        }
      );
    }

    await t.commit();

    res.status(200).send({
      success: true,
      message: "Expense Template Rights updated successfully",
    });
  } catch (error) {
    console.error(error);
    await t.rollback();
    res.status(500).send({
      success: false,
      message: "Error updating Expense Template Rights",
    });
  } finally {
    await sequelize.close();
  }
};

exports.ExpenseRightsRemoveExtra = async function (req, res) {
  const sequelize = await dbname(req, req.headers.compcode);
  const t = await sequelize.transaction();

  try {
    const { empCodeList, selectedExpense } = req.body;

    if (!empCodeList?.length) {
      return res
        .status(400)
        .send({ success: false, message: "empCodeList is required" });
    }

    if (!selectedExpense?.length) {
      return res
        .status(400)
        .send({ success: false, message: "selectedExpense is required" });
    }

    const User_Tbl = _UserTbl(sequelize, DataTypes);

    // Update Multi_Cash as comma-separated values
    await User_Tbl.update(
      { Multi_Cash: selectedExpense.join(",") },
      {
        where: {
          empcode: empCodeList,
          export_type: { [Op.lt]: 3 },
        },
        transaction: t,
      }
    );

    await t.commit();
    res.status(200).send({
      success: true,
      message: "Multi_Cash updated successfully",
    });
  } catch (e) {
    await t.rollback();
    console.error(e);
    res.status(500).send({
      success: false,
      message: "An error occurred while updating Multi_Cash.",
    });
  } finally {
    await sequelize.close();
  }
};

exports.whatsappRead = async function (req, res) {
  try {

    const receivedHash = req.query.secsha;
    const expectedSecret = process.env.CI_WEBHOOK_SECRET;

    const expectedHash = crypto
      .createHash('sha256')
      .update(expectedSecret)
      .digest('base64');
    console.log(expectedHash, "expectedHash");
    console.log(receivedHash, "receivedHash");
    if (receivedHash !== expectedHash) {
      return res.status(403).send("Invalid secsha");
    }
    const from = req.body.from;
    const text = req.body.text?.body?.toLowerCase();
    const msgTime = req.body.msg_date_time.split("+")[0];

    const sequelize2 = await dbname("", "DBCON");
    const ControlTbl = _WhatsAppUserConsent(sequelize2, DataTypes);

    const number = from.slice(-10);

    await ControlTbl.update(
      { OKFLAG: "1", OKTIME: msgTime, flag: "ALLOWED" },
      { where: { phoneNo: number } }
    );

    console.log(`User ${number} allowed again`);


    return res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err);
    return res.sendStatus(500);
  }
};

exports.findOneforexpense = async function (req, res) {
  let sequelize;
  try {
    sequelize = await dbname(req, req.headers.compcode);
    var UserTbl = _UserTbl(sequelize, DataTypes);

    const userId = req.params.ExpenseId; // This is your empcode

    console.log(userId, "userId");

    // Find user where empcode matches and export_type < 3
    const userCredsData = await UserTbl.findOne({
      where: {
        EmpCode: userId,
        Export_Type: { [Op.lt]: 3 }, // less than 3
      },
    });

    if (!userCredsData) {
      return res.status(404).send({ success: false, message: "No user found" });
    }
    res.status(200).send({ success: true, data: userCredsData });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error" });
  } finally {
    await sequelize.close();
  }
};


exports.AadhaarPanMessageHistory = async function (req, res) {
  const sequelize = await dbname(req, req.headers.compcode);
  const t = await sequelize.transaction();
  try {
    const DATE_FROM = req.body.DATE_FROM;
    const DATE_TO = req.body.DATE_TO;

    const data = await sequelize.query(
      `SELECT *
FROM
(
  /* =========================
     1️⃣ PAN / AADHAAR from Pan_Aadhar_Log
     ========================= */
  SELECT
    'PAN_AADHAR_LOG' AS Source,
    l.UTD,
    l.Type,
    CASE
      WHEN l.Type IN ('Aadhar', 'Verify otp Aadhar') THEN 'AADHAAR'
      WHEN l.Type = 'Pan' THEN 'PAN'
    END AS MappedType,
    l.Value,
    CAST(l.Date AS DATE) AS Date,
    l.Time,
    l.[user] AS LoginUser,

    e.empcode,
    e.empfirstname + ' ' + e.emplastname AS UserName,

    NULL AS Pan_Name,
    NULL AS Pan_DOB,
    NULL AS Digi_Aadhaar

  FROM Pan_Aadhar_Log l

  LEFT JOIN EMPLOYEEMASTER e
    ON (
      (l.Type = 'Pan' AND LTRIM(RTRIM(UPPER(e.PANNO))) = LTRIM(RTRIM(UPPER(l.Value))))
      OR
      (l.Type IN ('Aadhar','Verify otp Aadhar') AND e.UID_NO = l.Value)
    )

  WHERE CAST(l.Date AS DATE) BETWEEN :DATE_FROM AND :DATE_TO


  UNION ALL


  /* =========================
     2️⃣ PAN from IDTO_VERIFICATION_API
     ========================= */
  SELECT
    'IDTO_API' AS Source,
    i.utd AS UTD,
    'Pan' AS Type,
    'PAN' AS MappedType,
    JSON_VALUE(i.payload_json, '$.pan_number') AS Value,
    CAST(i.created_at AS DATE) AS Date,
    CONVERT(TIME, i.created_at) AS Time,
    NULL AS LoginUser,

    e.empcode,
    e.empfirstname + ' ' + e.emplastname AS UserName,

    JSON_VALUE(i.payload_json, '$.name') AS Pan_Name,
    JSON_VALUE(i.payload_json, '$.dob') AS Pan_DOB,
    NULL AS Digi_Aadhaar

  FROM IDTO_VERIFICATION_API i

  LEFT JOIN EMPLOYEEMASTER e
    ON LTRIM(RTRIM(UPPER(e.PANNO))) =
       LTRIM(RTRIM(UPPER(JSON_VALUE(i.payload_json, '$.pan_number'))))

  WHERE i.api_name LIKE 'pan%'
    AND CAST(i.created_at AS DATE) BETWEEN :DATE_FROM AND :DATE_TO


  UNION ALL


  /* =========================
     3️⃣ AADHAAR from Digilocker_Api
     ========================= */
  SELECT
    'DIGILOCKER_API' AS Source,
    d.utd AS UTD,
    'Aadhar' AS Type,
    'AADHAAR' AS MappedType,
    d.aadhaar_number AS Value,
    CAST(d.created_date AS DATE) AS Date,
    CONVERT(TIME, d.created_date) AS Time,
    NULL AS LoginUser,

    e.empcode,
    e.empfirstname + ' ' + e.emplastname AS UserName,

    NULL AS Pan_Name,
    NULL AS Pan_DOB,
    d.aadhaar_number AS Digi_Aadhaar

  FROM Digilocker_Api d

  LEFT JOIN EMPLOYEEMASTER e
    ON e.UID_NO = d.aadhaar_number

  WHERE CAST(d.created_date AS DATE) BETWEEN :DATE_FROM AND :DATE_TO

) X

ORDER BY Date, Time;

`,
      {
        replacements: { DATE_FROM, DATE_TO },
        type: sequelize.QueryTypes.SELECT,
        transaction: t
      }
    );

    const countData = await sequelize.query(
      `
SELECT
  MappedType AS Type,
  COUNT(*) AS Count
FROM
(
  SELECT
    CASE
      WHEN Type IN ('Aadhar', 'Verify otp Aadhar') THEN 'AADHAAR'
      WHEN Type = 'Pan' THEN 'PAN'
    END AS MappedType
  FROM Pan_Aadhar_Log
  WHERE CAST(Date AS DATE) BETWEEN :DATE_FROM AND :DATE_TO

  UNION ALL
  SELECT 'PAN' AS MappedType
  FROM IDTO_VERIFICATION_API
  WHERE api_name LIKE 'pan%'
    AND CAST(created_at AS DATE) BETWEEN :DATE_FROM AND :DATE_TO

  UNION ALL
  SELECT 'AADHAAR' AS MappedType
  FROM Digilocker_Api
  WHERE CAST(created_date AS DATE) BETWEEN :DATE_FROM AND :DATE_TO
) T
GROUP BY MappedType

UNION ALL

SELECT
  'TOTAL' AS Type,
  COUNT(*) AS Count
FROM
(
  SELECT 1 AS CNT
  FROM Pan_Aadhar_Log
  WHERE CAST(Date AS DATE) BETWEEN :DATE_FROM AND :DATE_TO

  UNION ALL
  SELECT 1 AS CNT
  FROM IDTO_VERIFICATION_API
  WHERE api_name LIKE 'pan%'
    AND CAST(created_at AS DATE) BETWEEN :DATE_FROM AND :DATE_TO

  UNION ALL
  SELECT 1 AS CNT
  FROM Digilocker_Api
  WHERE CAST(created_date AS DATE) BETWEEN :DATE_FROM AND :DATE_TO
) X;

`,
      {
        replacements: { DATE_FROM, DATE_TO },
        type: sequelize.QueryTypes.SELECT,
        transaction: t
      }
    );

    const [paymentData] = await sequelize.query(
      `  SELECT
    ISNULL(aadhar_api_per_msz_chrg, 0) AS AADHAAR,
    ISNULL(pan_api_per_msz_chrg, 0) AS PAN
  FROM COMP_KEYDATA`
    );

    await t.commit();
    res.status(200).send({
      Message: "",
      data: data,
      countSummary: countData,
      paymentData
    });
  } catch (e) {
    await t.rollback();
    console.log(e);
    res.status(500).send({
      success: false,
      message: "An error occurred while fetching Aadhaar/Pan message history.",
    });
  } finally {
    await sequelize.close();
  }
};
exports.InsertUserActHst = async function (req, res) {
  const compcode = req.headers.compcode;
  const sequelize = await dbname(req, compcode);
  const data = req.body;
  if (!data) {
    return res.status(400).send({
      Status: false,
      Message: "Data not found",
    });
  }

  if (req.body.Emp_Code != null) {
    req.body.Emp_Code = req.body.Emp_Code.toString();
  }
  const UserCloudActHst = _UserCloudActHst(sequelize, Sequelize.DataTypes);
  const UserMobActHst = _UserMobActHst(sequelize, Sequelize.DataTypes);

  // FIX: Normalize Loc_Code before validation
  if (data.Loc_Code) {
    if (typeof data.Loc_Code === "string" && data.Loc_Code.includes(",")) {
      data.Loc_Code = 0; // if comma-separated → set to 0
      data.Action_LMode = 1
    } else {
      // convert to number if single value
      data.Loc_Code = Number(data.Loc_Code) || 0;
      data.Action_LMode = 0
    }
  } else {
    data.Loc_Code = 0;
  }


  // Get current date (YYYY-MM-DD)
  const getCurrentDate = () => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  };

  // Get current time (HHMMSS as NUMBER)
  const getCurrentTime = () => {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return Number(`${hh}.${mm}`); // Example -> 143522
  };

  const t = await sequelize.transaction();

  try {
    // Validate input
    const { error, value } = UserCloudActHstSchema.validate(data);
    if (error) {
      console.log("❌ Validation error:", error.details[0].message);
      await t.rollback();
      return res.status(400).send({
        Status: false,
        Message: error.details[0].message,
      });
    }

    // for web
    let insertedRow
    if (value.Src_Portal == 1) {
      // Insert record
      insertedRow = await UserCloudActHst.create(
        {
          USER_Code: value.USER_Code || 0,
          Login_Batch: value.Login_Batch || null,
          Action_Taken: value.Action_Taken || null,

          // Auto timestamp here
          Action_Date: getCurrentDate(),
          Action_Time: getCurrentTime(),

          Ledg_Code: value.Ledg_Code || 0,
          Group_Code: value.Group_Code || 0,
          Book_Code: value.Book_Code || 0,
          Loc_Code: value.Loc_Code || 0,
          Action_LMode: value.Action_LMode || 0,
          Src_Portal: value.Src_Portal || 0,
          Emp_Code: value.Emp_Code || null,
        },
        { transaction: t }
      );
    } else {
      // for mob
      insertedRow = await UserMobActHst.create(
        {
          USER_Code: value.USER_Code || 0,
          Login_Batch: value.Login_Batch || null,
          Action_Taken: value.Action_Taken || null,

          // Auto timestamp here
          Action_Date: getCurrentDate(),
          Action_Time: getCurrentTime(),

          Ledg_Code: value.Ledg_Code || 0,
          Group_Code: value.Group_Code || 0,
          Book_Code: value.Book_Code || 0,
          Loc_Code: value.Loc_Code || 0,
          Action_LMode: value.Action_LMode || 0,
          Src_Portal: value.Src_Portal || 0,
          Emp_Code: value.Emp_Code || null,
        },
        { transaction: t }
      );
    }


    await t.commit();

    return res.status(200).send({
      Status: true,
      Message: "Inserted successfully",
      Data: insertedRow,
    });

  } catch (err) {
    console.error("🔥 Error inserting USER_ACT_HST:", err);
    await t.rollback();
    return res.status(500).send({
      success: false,
      message: "An error occurred.",
    });
  } finally {
    await sequelize.close();
  }
};


exports.GetPhyLocation = async function (req, res) {
  const sequelize = await dbname(req, req.headers.compcode);
  try {
    const MiscMst = _MiscMst(sequelize, DataTypes);
    const Phy_location = await MiscMst.findAll({
      attributes: [
        [Sequelize.cast(Sequelize.col("misc_code"), "VARCHAR"), "value"],
        ["misc_name", "label"],
      ],
      where: {
        misc_type: 631,
        Export_Type: { [Op.lt]: 3 }
      },
    });

    res.status(200).send({ success: true, Result: Phy_location });
  } catch (err) {
    console.log(err);
  } finally {
    await sequelize.close();
  }
};

exports.GeoOffenceLocation = async function (req, res) {
  const sequelize = await dbname(req, req.headers.compcode);
  try {
    const [GetGeoOffenceLoc] = await sequelize.query(`SELECT CAST(MISC_CODE AS VARCHAR) AS value, MISC_NAME AS label, SPL_REM AS splRem FROM MISC_MST 
      WHERE MISC_TYPE = 85 AND ISNULL(EXPORT_TYPE, 0) < 3 ORDER BY MISC_NAME `);

    console.log(GetGeoOffenceLoc, 'GetGeoOffenceLoc')
    res.status(200).send({ success: true, Result: GetGeoOffenceLoc });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: err.message });
  } finally {
    await sequelize.close();
  }
};

exports.AccountApiLogs = async (req, res) => {
  const sequelize = await dbname(req, req.headers.compcode);
  const t = await sequelize.transaction();

  try {
    const { DATE_FROM, DATE_TO } = req.body;
    const data = await sequelize.query(
      `
  -- ACCOUNT NUMBER API (SUCCESS ONLY)
  SELECT
    'ACCOUNT_API' AS ApiType,
    a.UTD,
    a.Ifsc,
    a.account_number,
    a.code,
    a.message,
    a.name_at_bank,
    a.transaction_id,
    a.Created_At,
    i.BANK,
    i.BRANCH,
    i.CITY,
    i.STATE
  FROM Account_No_Api a
  LEFT JOIN IFSC_CODE_API i
    ON i.IFSC = a.Ifsc
  WHERE a.account_exists = 1
    AND CAST(a.Created_At AS DATE)
    BETWEEN :DATE_FROM AND :DATE_TO

  UNION ALL

  -- IFSC CODE API (SUCCESS ONLY)
  SELECT
    'IFSC_API' AS ApiType,
    i.UTD,
    i.IFSC,
    NULL AS account_number,
    200 AS code,
    'IFSC details fetched successfully' AS message,
    NULL AS name_at_bank,
    NULL AS transaction_id,
    i.CreatedDate AS Created_At,
    i.BANK,
    i.BRANCH,
    i.CITY,
    i.STATE
  FROM IFSC_CODE_API i
  WHERE CAST(i.CreatedDate AS DATE)
    BETWEEN :DATE_FROM AND :DATE_TO

  ORDER BY Created_At DESC
  `,
      {
        replacements: { DATE_FROM, DATE_TO },
        type: sequelize.QueryTypes.SELECT,
        transaction: t,
      }
    );

    const countSummary = await sequelize.query(
      `
  SELECT ApiType AS TYPE, COUNT(*) AS TotalCount
  FROM (
    SELECT 'ACCOUNT_API' AS ApiType
    FROM Account_No_Api
    WHERE account_exists = 1
      AND CAST(Created_At AS DATE)
      BETWEEN :DATE_FROM AND :DATE_TO

    UNION ALL

    SELECT 'IFSC_API' AS ApiType
    FROM IFSC_CODE_API
    WHERE CAST(CreatedDate AS DATE)
      BETWEEN :DATE_FROM AND :DATE_TO
  ) x
  GROUP BY ApiType

  UNION ALL

  SELECT 'TOTAL' AS TYPE, COUNT(*)
  FROM (
    SELECT UTD
    FROM Account_No_Api
    WHERE account_exists = 1
      AND CAST(Created_At AS DATE)
      BETWEEN :DATE_FROM AND :DATE_TO

    UNION ALL

    SELECT UTD
    FROM IFSC_CODE_API
    WHERE CAST(CreatedDate AS DATE)
      BETWEEN :DATE_FROM AND :DATE_TO  
  ) y
  `,
      {
        replacements: { DATE_FROM, DATE_TO },
        type: sequelize.QueryTypes.SELECT,
        transaction: t,
      }
    );


    const [paymentData] = await sequelize.query(
      `  SELECT
    ISNULL(Ac_No_per_msz_chrg, 0) AS ACCOUNT_API,
    ISNULL(Ifsc_No_per_msz_chrg, 0) AS IFSC_API
  FROM COMP_KEYDATA`
    );


    await t.commit();

    res.status(200).json({
      data,
      countSummary,
      paymentData
    });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: "Error fetching logs" });
  } finally {
    await sequelize.close();
  }
};


async function uploadImage3(files, Comp_Code) {
  try {
    let dataArray = [];

    await Promise.all(
      files?.map(async (file, index) => {
        const customPath = `${Comp_Code}/FestivalMedia/`;
        const originalname = file.originalname; // ✅ Use original filename
        const formData = new FormData();

        formData.append("photo", file.buffer, originalname);
        formData.append("customPath", customPath);

        try {
          const response = await axios.post(
            `${FILE_UPLOAD_BASE_URL}/upload-photo`,
            formData,
            {
              headers: formData.getHeaders(),
            }
          );

          const data = {
            fieldname: file.fieldname,
            path: `${customPath}${originalname}`, // ✅ This will be: TEST/CompanyLogo/Pegasuslogo.jfif
            originalname: file.originalname, // ✅ Return original file name too
          };

          dataArray.push(data);
        } catch (error) {
          console.error(`Error uploading image ${index}:`, error.message);
        }
      })
    );

    return dataArray;
  } catch (e) {
    console.log(e);
  }
}

exports.uploadVideoImage = async function (req, res) {
  try {
    const sequelize = await dbname(req, "DBCON");
    const { festivalName, docType, uploadedBy } = req.body;

    if (!req.files || req.files.length === 0 || !festivalName || !docType) {
      return res.status(400).send({ success: false, message: "Missing required fields or file" });
    }

    // Upload to cloud
    const EMP_DOCS_data = await uploadImage3(
      req.files,
      req.headers.compcode.split("-")[0],
      req.body.name
    );
    console.log(EMP_DOCS_data, "EMP_DOCS_data");

    if (!EMP_DOCS_data || EMP_DOCS_data.length === 0) {
      return res.status(500).send({ success: false, message: "File upload to cloud failed" });
    }

    const smbPath = EMP_DOCS_data[0].path;
    const originalName = EMP_DOCS_data[0].originalname;

    // Insert into DB
    const insertQuery = `
      INSERT INTO UploadedFiles (DocType, RefId, Keywords, OriginalName, SMBPath, UploadedBy)
      VALUES (?, 0, ?, ?, ?, ?)
    `;

    await sequelize.query(insertQuery, {
      replacements: [docType, festivalName, originalName, smbPath, uploadedBy],
    });

    await sequelize.close();
    res.status(200).send({ success: true, message: "File uploaded successfully", path: smbPath });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send({ success: false, message: error.message || "Internal Server Error" });
  }
};

exports.getUploadedFiles = async function (req, res) {
  let sequelize;
  try {
    sequelize = await dbname(req, "DBCON");
    const query = `SELECT * FROM UploadedFiles ORDER BY CreatedAt DESC`;
    const [results] = await sequelize.query(query);
    await sequelize.close();
    res.status(200).send({ success: true, files: results });
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  } finally {
    await sequelize.close();
  }
};

exports.toggleActive = async function (req, res) {
  let sequelize;
  try {
    sequelize = await dbname(req, "DBCON");
    const { docType, newActiveUtd } = req.body;

    await sequelize.query(`UPDATE UploadedFiles SET RefId = 0 WHERE DocType = ?`, {
      replacements: [docType],
    });

    if (newActiveUtd) {
      await sequelize.query(`UPDATE UploadedFiles SET RefId = 1 WHERE Utd = ? AND DocType = ?`, {
        replacements: [newActiveUtd, docType],
      });
    }

    res.status(200).send({ success: true });
  } catch (error) {
    console.error("Error toggling active:", error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  } finally {
    await sequelize.close();
  }
};

exports.deactivateAll = async function (req, res) {
  let sequelize;
  try {
    sequelize = await dbname(req, "DBCON");
    const { docType } = req.body;
    if (!docType) {
      return res.status(400).send({ success: false, message: "DocType required" });
    }
    await sequelize.query(`UPDATE UploadedFiles SET RefId = 0 WHERE DocType = ?`, {
      replacements: [docType],
    });

    res.status(200).send({ success: true });
  } catch (error) {
    console.error("Error deactivating all:", error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  } finally {
    await sequelize.close();
  }
};


exports.getLoginFiles = async function (req, res) {
  let sequelize;
  try {
    const { DocType } = req.query;   // MOBILE / WEB
    const CompCode = "DBCON";        // fixed or from header

    if (!DocType) {
      return res.status(400).send({
        success: false,
        message: "DocType is required"
      });
    }

    sequelize = await dbname(req, CompCode);
    const query = `
      SELECT *
      FROM UploadedFiles
      WHERE DocType = :DocType
        AND RefId = 1
      ORDER BY CreatedAt DESC
    `;

    const [results] = await sequelize.query(query, {
      replacements: { DocType }
    });

    await sequelize.close();

    return res.status(200).send({
      success: true,
      files: results
    });

  } catch (error) {
    console.error("Error fetching files:", error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error"
    });
  } finally {
    await sequelize.close();
  }
};

async function sendEmail(toEmail, subject, htmlContent) {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "AUTOVYN.MAILER@gmail.com",
        pass: "lamdgvthpjetawtr",
      },
    });

    let mailOptions = {
      from: "AUTOVYN.MAILER@gmail.com",
      to: toEmail,
      subject: subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error occurred while sending email:", error);
    throw error;
  }
}

exports.sendFestivalOtp = async function (req, res) {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const userEmail = "ayushi@autovyn.com";

    const htmlContent = `
      <p>Your OTP for accessing the Festival Media page is:</p>
      <h2>${otp}</h2>
    `;

    await sendEmail(
      userEmail,
      "Festival Media OTP Verification",
      htmlContent
    );

    // 🔐 Encode OTP
    const encodedOtp = Buffer.from(otp).toString("base64");

    res.status(200).send({
      success: true,
      message: "OTP sent to your email",
      encodedOtp: encodedOtp, // ✅ send encoded
    });

  } catch (error) {
    console.error("Error sending festival OTP:", error);
    res.status(500).send({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

exports.SaveTermsnCondition = async function (req, res) {
  const { TERMS, SEGMENT_CODE, Created_by } = req.body;

  let t;
  let sequelize;
  try {
    sequelize = await dbname(req, req.headers.compcode);
    t = await sequelize.transaction();

    const TIDMst = _TID_MST(sequelize, Sequelize.DataTypes);

    // ✅ Convert segment to number (important)
    const segment = parseInt(SEGMENT_CODE);

    // ✅ Find max SRNO for that segment
    const maxSrno = await TIDMst.max("SRNO", {
      where: { SEGMENT_CODE: segment },
      transaction: t,
    });

    const newSrno = maxSrno ? maxSrno + 1 : 1;
    const newRecord = await TIDMst.create(
      {
        SRNO: newSrno,
        TERMS: TERMS,
        SEGMENT_CODE: segment,
        EXPORT_TYPE: 1,
        Created_By: Created_by,
      },
      { transaction: t }
    );

    await t.commit();

    res.status(200).json({
      success: true,
      data: newRecord,
    });

  } catch (err) {
    if (t) await t.rollback();
    console.error(err);
    res.status(500).json({ error: "Failed to create Terms & Condition" });
  } finally {
    await sequelize.close();
  }
};

exports.ViewTIDMst = async function (req, res) {
  let sequelize;
  try {
    sequelize = await dbname(req, req.headers.compcode);
    const query = `SELECT (SELECT MISC_NAME FROM MISC_MST WHERE MISC_TYPE = 302 AND ISNULL(EXPORT_TYPE, 0) < 3
     AND MISC_CODE= SEGMENT_CODE) AS SEGMENT_NAME,* FROM TID_MST WHERE EXPORT_TYPE < 33 ORDER BY TID, SRNO`;

    const [results] = await sequelize.query(query);

    await sequelize.close();

    return res.status(200).send({
      success: true,
      results: results
    });

  } catch (error) {
    console.error("Error fetching files:", error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error"
    });
  } finally {
    await sequelize.close();
  }
};

exports.UpdateTermsnCondition = async function (req, res) {
  const { TID, TERMS, SEGMENT_CODE, Created_by } = req.body;

  let t;
  let sequelize;
  try {
    if (!TID) {
      return res.status(400).json({
        success: false,
        message: "TID is required for update",
      });
    }

    sequelize = await dbname(req, req.headers.compcode);
    t = await sequelize.transaction();

    const TIDMst = _TID_MST(sequelize, Sequelize.DataTypes);

    const segment = parseInt(SEGMENT_CODE);

    const existingRecord = await TIDMst.findOne({
      where: { TID: TID },
      transaction: t,
    });

    if (!existingRecord) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    await TIDMst.update(
      {
        TERMS: TERMS,
        SEGMENT_CODE: segment,
        Created_By: Created_by,
      },
      {
        where: { TID: TID },
        transaction: t,
      }
    );

    await t.commit();

    res.status(200).json({
      success: true,
      message: "Terms & Condition updated successfully",
    });

  } catch (err) {
    if (t) await t.rollback();
    console.error(err);
    res.status(500).json({ error: "Failed to update Terms & Condition" });
  } finally {
    await sequelize.close();
  }
};

exports.ShowTermHeadingData = async function (req, res) {
  let sequelize;
  try {
    sequelize = await dbname(req, req.headers.compcode);
    const query = `SELECT TID AS value, TERMS AS label, SRNO FROM TID_MST WHERE SEGMENT_CODE = '${req.body?.SEGMENT_CODE}' AND EXPORT_TYPE < 33`;

    const [results] = await sequelize.query(query);

    await sequelize.close();

    return res.status(200).send({
      success: true,
      results: results
    });

  } catch (error) {
    console.error("Error fetching files:", error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error"
    });
  } finally {
    await sequelize.close();
  }
};


exports.SaveDtlTermsnCondition = async function (req, res) {
  const {
    SEGMENT_DTL_CODE,
    TERMS_DTL,
    SEQ_NO,
    SUB_SEQ_NO,
    Created_by,
    SRNO
  } = req.body;

  let t;
  let sequelize;
  try {
    sequelize = await dbname(req, req.headers.compcode);
    t = await sequelize.transaction();

    const TIDDtl = _TID_DTL(sequelize, Sequelize.DataTypes);

    const segment = parseInt(SEGMENT_DTL_CODE);
    const mstTid = parseInt(TERMS_DTL);
    const srno = parseInt(SRNO);

    // ✅ If SUB_SEQ_NO is empty → it's main sub heading
    if (!SUB_SEQ_NO) {

      // Get max SEQ_NO for this group
      const maxSeq = await TIDDtl.max("SEQ_NO", {
        where: {
          MST_TID: mstTid,
          SRNO: srno,
          SEGMENT_CODE: segment
        },
        transaction: t,
      });

      const newSeq = maxSeq ? maxSeq + 1 : 1;

      const newRecord = await TIDDtl.create({
        MST_TID: mstTid,
        SRNO: srno,
        SEQ_NO: newSeq,
        SUB_SEQ_NO: 0,
        TERMS: SEQ_NO,   // textarea value
        SEGMENT_CODE: segment,
        EXPORT_TYPE: 1,
        Created_By: Created_by,
      }, { transaction: t });

      await t.commit();

      return res.status(200).json({
        success: true,
        data: newRecord,
      });

    } else {

      const parentRecord = await TIDDtl.findOne({
        where: {
          MST_TID: mstTid,
          SRNO: srno,
          SEGMENT_CODE: segment,
          TERMS: SEQ_NO,        // match by text
          SUB_SEQ_NO: 0         // only main headings
        },
        transaction: t,
      });

      if (!parentRecord) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          message: "Parent heading not found",
        });
      }

      const parentSeq = parentRecord.SEQ_NO;

      const maxSubSeq = await TIDDtl.max("SUB_SEQ_NO", {
        where: {
          MST_TID: mstTid,
          SRNO: srno,
          SEGMENT_CODE: segment,
          SEQ_NO: parentSeq
        },
        transaction: t,
      });

      const newSubSeq = maxSubSeq ? maxSubSeq + 1 : 1;

      const newRecord = await TIDDtl.create({
        MST_TID: mstTid,
        SRNO: srno,
        SEQ_NO: parentSeq,
        SUB_SEQ_NO: newSubSeq,
        TERMS: SUB_SEQ_NO,   // sub heading text
        SEGMENT_CODE: segment,
        EXPORT_TYPE: 1,
        Created_By: Created_by,
      }, { transaction: t });

      await t.commit();

      return res.status(200).json({
        success: true,
        data: newRecord,
      });
    }


  } catch (err) {
    if (t) await t.rollback();
    console.log(err);
    res.status(500).json({ error: "Failed to create Terms Detail" });
  } finally {
    await sequelize.close();
  }
};

exports.HRMSLeadMaxNo = async function (req, res) {
  const sequelize = await dbname(req, req.headers.compcode);
  let query = "";
  try {
    query = `SELECT ISNULL(MAX(Lead_No), 0) + 1 AS Next_Lead_No FROM HRMS_Lead_Master`;
    const result = await sequelize.query(query);
    res.status(200).send({
      Status: true,
      Message: "Success",
      Query: query,
      Result: result[0],
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({ Status: false, Message: "Error fetching lead no", Query: query, Result: null });
  } finally {
    if (sequelize) await sequelize.close();
  }
};

// Update HRMSLeadSave - Added Attachment field
exports.HRMSLeadSave = async function (req, res) {
  const sequelize = await dbname(req, req.headers.compcode);
  let query = "";
  try {
    const {
      Name, Contact, Email, Company, Designation,
      Employees, Location, Lead_Source, Product, Lead_Status,
      Priority, Demo_Required, Demo_Date, Follow_Up_Date,
      Deal_Value, Notes, Remarks,
    } = req.body;
    const Created_By = req.headers.name || "";

    // ===== UPLOAD ATTACHMENT (same pattern as uploadSignature) =====
    let Attachment = "";
    if (req.files && req.files.length > 0) {
      const uploadedData = await uploadImage3(
        req.files,
        req.headers.compcode.split("-")[0] + "/leads" // customPath folder
      );
      if (uploadedData && uploadedData.length > 0) {
        Attachment = uploadedData[0].path;
      }
    }

    const maxQuery = `SELECT ISNULL(MAX(Lead_No), 0) + 1 AS Next_Lead_No FROM HRMS_Lead_Master`;
    const maxResult = await sequelize.query(maxQuery);
    const Lead_No = maxResult[0][0].Next_Lead_No;

    const esc = (v) => (v ? `'${String(v).replace(/'/g, "''")}'` : "NULL");
    const num = (v) => (v !== undefined && v !== null && v !== "" ? Number(v) : "NULL");
    const dt = (v) => (v ? `'${v}'` : "NULL");
    const empStr = (v) => {
      const raw = String(v || "").trim();
      return raw ? `'${raw.replace(/'/g, "''")}'` : "NULL";
    };
    query = `
      INSERT INTO HRMS_Lead_Master (
        Lead_No, Name, Contact, Email, Company, Designation,
        Employees, Location, Lead_Source, Product,
        Lead_Status, Priority, Demo_Required, Demo_Date, Follow_Up_Date,
        Deal_Value, Notes, Remarks, Attachment, Created_By, Created_At
      ) VALUES (
        ${Lead_No}, ${esc(Name)}, ${esc(Contact)}, ${esc(Email)}, ${esc(Company)}, ${esc(Designation)},
        ${empStr(Employees)}, ${esc(Location)}, ${esc(Lead_Source)}, ${esc(Product)},
        ${esc(Lead_Status)}, ${esc(Priority)}, ${esc(Demo_Required)}, ${dt(Demo_Date)}, ${dt(Follow_Up_Date)},
        ${num(Deal_Value)}, ${esc(Notes)}, ${esc(Remarks)}, ${esc(Attachment)}, ${esc(Created_By)}, GETDATE()
      )
    `;
    await sequelize.query(query);
    res.status(200).send({ Status: true, Message: "Lead saved successfully", Lead_No, Attachment, Query: query, Result: null });
  } catch (e) {
    console.error(e);
    res.status(500).send({ Status: false, Message: "Error saving lead", Query: query, Result: null });
  } finally {
    if (sequelize) await sequelize.close();
  }
};

// Update HRMSLeadUpdate - Added Attachment field
exports.HRMSLeadUpdate = async function (req, res) {
  const sequelize = await dbname(req, req.headers.compcode);
  let query = "";
  try {
    const {
      UTD, Name, Contact, Email, Company, Designation,
      Employees, Location, Lead_Source, Product, Lead_Status,
      Priority, Demo_Required, Demo_Date, Follow_Up_Date,
      Deal_Value, Notes, Remarks, Existing_Attachment, // <-- pass existing path from frontend
    } = req.body;
    const Updated_By = req.headers.name || "";

    // ===== ONLY upload if a NEW file was chosen, otherwise keep old path =====
    let Attachment = Existing_Attachment || "";
    if (req.files && req.files.length > 0) {
      const uploadedData = await uploadImage3(
        req.files,
        req.headers.compcode.split("-")[0] + "/leads"
      );
      if (uploadedData && uploadedData.length > 0) {
        Attachment = uploadedData[0].path;
      }
    }

    const esc = (v) => (v ? `'${String(v).replace(/'/g, "''")}'` : "NULL");
    const num = (v) => (v !== undefined && v !== null && v !== "" ? Number(v) : "NULL");
    const dt = (v) => (v ? `'${v}'` : "NULL");
    const empStr = (v) => {
      const raw = String(v || "").trim();
      return raw ? `'${raw.replace(/'/g, "''")}'` : "NULL";
    };
    query = `
      UPDATE HRMS_Lead_Master SET
        Name             = ${esc(Name)},
        Contact          = ${esc(Contact)},
        Email            = ${esc(Email)},
        Company          = ${esc(Company)},
        Designation      = ${esc(Designation)},
        Employees        = ${empStr(Employees)},
        Location         = ${esc(Location)},
        Lead_Source      = ${esc(Lead_Source)},
        Product          = ${esc(Product)},
        Lead_Status      = ${esc(Lead_Status)},
        Priority         = ${esc(Priority)},
        Demo_Required    = ${esc(Demo_Required)},
        Demo_Date        = ${dt(Demo_Date)},
        Follow_Up_Date   = ${dt(Follow_Up_Date)},
        Deal_Value       = ${num(Deal_Value)},
        Notes            = ${esc(Notes)},
        Remarks          = ${esc(Remarks)},
        Attachment       = ${esc(Attachment)},
        Updated_By       = ${esc(Updated_By)},
        Updated_At       = GETDATE()
      WHERE UTD = ${Number(UTD)}
    `;
    await sequelize.query(query);
    res.status(200).send({ Status: true, Message: "Lead updated successfully", Query: query, Result: null });
  } catch (e) {
    console.error(e);
    res.status(500).send({ Status: false, Message: "Error updating lead", Query: query, Result: null });
  } finally {
    if (sequelize) await sequelize.close();
  }
};

// Update HRMSLeadView - Added Attachment in SELECT
exports.HRMSLeadView = async function (req, res) {
  const sequelize = await dbname(req, req.headers.compcode);
  let query = "";
  try {
    const { dateFrom, dateTo, Lead_Status, Lead_Source, Priority, Created_By, utd } = req.body;

    let filters = "";
    if (dateFrom) filters += ` AND CAST(Created_At AS DATE) >= '${dateFrom}'`;
    if (dateTo) filters += ` AND CAST(Created_At AS DATE) <= '${dateTo}'`;
    if (Lead_Status) filters += ` AND Lead_Status = '${Lead_Status}'`;
    if (Lead_Source) filters += ` AND Lead_Source = '${Lead_Source}'`;
    if (Priority) filters += ` AND Priority = '${Priority}'`;
    if (Created_By) filters += ` AND Created_By = '${Created_By}'`;

    if (utd) filters += ` AND utd = '${utd}'`;

    query = `
      SELECT UTD, Lead_No, Name, Contact, Email, Company, Designation,
             Employees, Location, Lead_Source, Product,
             Lead_Status, Priority, Demo_Required,
             CONVERT(VARCHAR, Demo_Date, 23)        AS Demo_Date,
             CONVERT(VARCHAR, Follow_Up_Date, 23)   AS Follow_Up_Date,
             Deal_Value, Notes, Remarks, Attachment, Created_By, Created_At, Updated_By, Updated_At
      FROM HRMS_Lead_Master
      WHERE 1=1 ${filters}
      ORDER BY Lead_No DESC
    `;
    const result = await sequelize.query(query);
    res.status(200).send({ Status: true, Message: "Success", Query: query, Result: result[0] });
  } catch (e) {
    console.error(e);
    res.status(500).send({ Status: false, Message: "Error fetching leads", Query: query, Result: null });
  } finally {
    if (sequelize) await sequelize.close();
  }
};

exports.HRMSLeadDashboard = async function (req, res) {
  const sequelize = await dbname(req, req.headers.compcode);
  let query = "";
  try {
    query = `
      SELECT
        (SELECT COUNT(*) FROM HRMS_Lead_Master)                                             AS Total_Leads,
        (SELECT COUNT(*) FROM HRMS_Lead_Master WHERE Lead_Status = 'New Lead')              AS New_Leads,
        (SELECT COUNT(*) FROM HRMS_Lead_Master WHERE Lead_Status = 'Follow Up')             AS Follow_Up,
        (SELECT COUNT(*) FROM HRMS_Lead_Master WHERE Lead_Status = 'Demo Scheduled')        AS Demo_Scheduled,
        (SELECT COUNT(*) FROM HRMS_Lead_Master WHERE Lead_Status = 'Demo Done')             AS Demo_Done,
        (SELECT COUNT(*) FROM HRMS_Lead_Master WHERE Lead_Status = 'Proposal Sent')         AS Proposal_Sent,
        (SELECT COUNT(*) FROM HRMS_Lead_Master WHERE Lead_Status = 'Won')                   AS Won,
        (SELECT COUNT(*) FROM HRMS_Lead_Master WHERE Lead_Status = 'Lost')                  AS Lost,
        (SELECT COUNT(*) FROM HRMS_Lead_Master WHERE Lead_Status = 'Interested')            AS Interested,
        (SELECT COUNT(*) FROM HRMS_Lead_Master WHERE Lead_Status = 'Customer Busy')         AS Customer_Busy,
        (SELECT COUNT(*) FROM HRMS_Lead_Master WHERE CAST(Created_At AS DATE) = CAST(GETDATE() AS DATE)) AS Today_Leads,
        (SELECT COUNT(*) FROM HRMS_Lead_Master WHERE Follow_Up_Date = CAST(GETDATE() AS DATE))          AS Today_Followups,
        (SELECT COUNT(*) FROM HRMS_Lead_Master WHERE Follow_Up_Date < CAST(GETDATE() AS DATE)
         AND Lead_Status NOT IN ('Won','Lost','Not Interested','Wrong Number'))              AS Overdue_Followups
    `;
    const summary = await sequelize.query(query);

    const sourceQuery = `
      SELECT Lead_Source, COUNT(*) AS Count
      FROM HRMS_Lead_Master
      WHERE Lead_Source IS NOT NULL
      GROUP BY Lead_Source ORDER BY Count DESC
    `;
    const sourceResult = await sequelize.query(sourceQuery);

    const priorityQuery = `
      SELECT Priority, COUNT(*) AS Count
      FROM HRMS_Lead_Master
      WHERE Priority IS NOT NULL
      GROUP BY Priority
    `;
    const priorityResult = await sequelize.query(priorityQuery);

    const productQuery = `
      SELECT Product, COUNT(*) AS Count
      FROM HRMS_Lead_Master
      WHERE Product IS NOT NULL
      GROUP BY Product ORDER BY Count DESC
    `;
    const productResult = await sequelize.query(productQuery);

    res.status(200).send({
      Status: true, Message: "Success",
      Result: {
        summary: summary[0][0],
        source: sourceResult[0],
        priority: priorityResult[0],
        product: productResult[0],
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({ Status: false, Message: "Error fetching dashboard", Result: null });
  } finally {
    if (sequelize) await sequelize.close();
  }
};

exports.UpdateDtlTermsnCondition = async function (req, res) {

  const {
    TID,
    SEGMENT_CODE,
    TERMS_DTL,
    SEQ_NO,
    SUB_SEQ_NO,
    SRNO,
    Created_by
  } = req.body;

  let t;
  let sequelize;
  try {
    if (!TID) {
      return res.status(400).json({
        success: false,
        message: "TID is required for update",
      });
    }

    sequelize = await dbname(req, req.headers.compcode);
    t = await sequelize.transaction();

    const TIDDtl = _TID_DTL(sequelize, Sequelize.DataTypes);

    const existingRecord = await TIDDtl.findOne({
      where: { TID: TID },
      transaction: t,
    });

    if (!existingRecord) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    // Decide text safely
    const updatedText = SUB_SEQ_NO ? SUB_SEQ_NO : SEQ_NO;

    await TIDDtl.update(
      {
        SEGMENT_CODE: parseInt(SEGMENT_CODE),
        MST_TID: parseInt(TERMS_DTL),
        SRNO: parseInt(SRNO),
        TERMS: updatedText,
        Created_By: Created_by
      },
      {
        where: { TID: TID },
        transaction: t,
      }
    );

    await t.commit();

    return res.status(200).json({
      success: true,
      message: "Detail Terms updated successfully",
    });

  } catch (err) {
    if (t) await t.rollback();
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to update Terms Detail",
    });
  } finally {
    await sequelize.close();
  }
};


exports.ViewTIDDtl = async function (req, res) {
  let sequelize;
  try {
    sequelize = await dbname(req, req.headers.compcode);
    const query = `SELECT
    DTL.TID,
    DTL.SEGMENT_CODE,
    DTL.MST_TID,
    MISC.MISC_NAME AS SEGMENT_NAME,
    MST.TERMS AS TERMS_HEADING,

    CASE
        WHEN DTL.SUB_SEQ_NO = 0
        THEN DTL.TERMS
        ELSE PARENT.TERMS
    END AS TERMS_SUB_HEADING,

    CASE
        WHEN DTL.SUB_SEQ_NO > 0
        THEN DTL.TERMS
        ELSE NULL
    END AS TERMS_SUB_SUB_HEADING,

    DTL.SEQ_NO,
    DTL.SUB_SEQ_NO,
    DTL.Created_BY

FROM TID_DTL DTL

LEFT JOIN TID_DTL PARENT
    ON PARENT.MST_TID = DTL.MST_TID
    AND PARENT.SRNO = DTL.SRNO
    AND PARENT.SEGMENT_CODE = DTL.SEGMENT_CODE
    AND PARENT.SEQ_NO = DTL.SEQ_NO
    AND PARENT.SUB_SEQ_NO = 0

INNER JOIN TID_MST MST
    ON MST.TID = DTL.MST_TID
    AND MST.SRNO = DTL.SRNO

INNER JOIN MISC_MST MISC
    ON MISC.MISC_CODE = DTL.SEGMENT_CODE
    AND MISC.MISC_TYPE = 302
    AND ISNULL(MISC.EXPORT_TYPE,0) < 3

ORDER BY
    DTL.TID`;

    const [results] = await sequelize.query(query);

    await sequelize.close();

    return res.status(200).send({
      success: true,
      results: results
    });

  } catch (error) {
    console.error("Error fetching files:", error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error"
    });
  } finally {
    await sequelize.close();
  }
};


let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "automailerautovyn@gmail.com",
    pass: "azucvdumhwegelzg",
  },
});
let transporter2 = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "AUTOVYN.MAILER@gmail.com",
    pass: "lamdgvthpjetawtr",
  },
});

async function sendmail(EMAIL, subject, html) {
  if (EMAIL) {
    var BCCMAIL = ["ayushi@autovyn.com"];
    let mailOptions = {
      from: "AUTOVYN.MAILER@gmail.com",
      to: EMAIL,
      bcc: BCCMAIL,
      subject: subject,
      html: html,
      // attachments: [
      //     {
      //         filename: 'favicon.png',
      //         path: 'public/favicon.png',
      //         cid: 'favicon'
      //     }
      // ]
    };
    let mailOptions2 = {
      from: "automailerautovyn@gmail.com",
      to: EMAIL,
      bcc: BCCMAIL,
      subject: subject,
      html: html,
      // attachments: [
      //     {
      //         filename: 'favicon.png',
      //         path: 'public/favicon.png',
      //         cid: 'favicon'
      //     }
      // ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        transporter2.sendMail(mailOptions2, (error, info1) => {
          if (error) {
            return false;
          }
          return true;
        });
        return false;
      }
      return true;
    });
  }
}

exports.sendmail = sendmail;



exports.LeadImport = async function (req, res) {

  const sequelize = await dbname(req, req.headers.compcode);
  const t = await sequelize.transaction();

  try {

    const excelFile = req.files["excel"][0];

    if (!excelFile) {

      await sequelize.close();

      return res.status(400).send({
        Message: "No file uploaded",
      });

    }

    const workbook = xlsx.read(excelFile.buffer, {
      type: "buffer",
    });

    // ONLY READ SHEET 1
    const sheetName = workbook.SheetNames[0];

    const sheet = workbook.Sheets[sheetName];

    const transformedData = xlsx.utils.sheet_to_json(sheet, {
      defval: "",
    });

    if (!transformedData.length) {

      await sequelize.close();

      return res.status(400).send({
        Message: "No data found in excel",
      });

    }

    // RENAME EXCEL COLUMNS
    const renameKeys = (obj) => {

      const keyMap = {
        "FULL NAME": "NAME",

        "PHONE NUMBER": "CONTACT",

        "COMPANY NAME": "COMPANY",

        "NO. OF EMPLOYEES": "EMPLOYEES",

      };

      return Object.keys(obj).reduce((acc, key) => {

        const normalizedKey = String(key).trim().toUpperCase();

        const newKey = keyMap[normalizedKey] || key;

        acc[newKey] =
          obj[key] === "" || obj[key] === undefined
            ? null
            : obj[key];

        return acc;

      }, {});

    };

    const data = transformedData.map(renameKeys);

    const ErroredData = [];
    const CorrectData = [];

    // ================= EXISTING LEADS (DUPLICATE CONTACT CHECK) =================
    const existingLeads = await sequelize.query(
      `
      SELECT CONTACT
      FROM HRMS_Lead_Master
   
      `,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const existingContactSet = new Set(
      existingLeads.map((e) =>
        String(e.CONTACT).trim()
      )
    );

    // TRACK DUPLICATES WITHIN THE SAME FILE
    const seenInFileSet = new Set();

    // ================= VALIDATION =================
    for (const obj of data) {

      const rejectionReasons = [];

      // NAME CHECK
      if (!obj.NAME || !String(obj.NAME).trim()) {
        rejectionReasons.push("Name Required");
      }

      // CONTACT CHECK
      const ContactValue = String(obj.CONTACT || "")
        .replace(/\D/g, "")
        .trim();

      if (!ContactValue) {

        rejectionReasons.push("Contact Required");

      } else if (
        ContactValue.length < 10 ||
        ContactValue.length > 13
      ) {

        rejectionReasons.push("Invalid Contact Number");

      }

      // COMPANY CHECK
      if (!obj.COMPANY || !String(obj.COMPANY).trim()) {
        rejectionReasons.push("Company Required");
      }

      // EMPLOYEES CHECK — allow plain number ("25") OR range ("15-20")
      const EmployeesRaw = String(obj.EMPLOYEES || "").trim();

      const rangePattern = /^\d+\s*-\s*\d+$/;
      const singlePattern = /^\d+$/;

      let EmployeesValid = false;
      let EmployeesValue = null;

      if (singlePattern.test(EmployeesRaw)) {

        if (Number(EmployeesRaw) > 0) {
          EmployeesValid = true;
          EmployeesValue = EmployeesRaw;
        }

      } else if (rangePattern.test(EmployeesRaw)) {

        const [min, max] = EmployeesRaw.split("-").map((v) => Number(v.trim()));

        if (min > 0 && max > 0 && min <= max) {
          EmployeesValid = true;
          EmployeesValue = `${min}-${max}`;
        }

      }

      if (!EmployeesValid) {
        rejectionReasons.push("Invalid Employees Count");
      }

      // DUPLICATE CHECK (ALREADY IN DB)
      if (
        ContactValue &&
        existingContactSet.has(ContactValue)
      ) {

        rejectionReasons.push(
          "Duplicate Contact - Lead Already Exists"
        );

      }

      // DUPLICATE CHECK (WITHIN SAME FILE)
      if (
        ContactValue &&
        seenInFileSet.has(ContactValue)
      ) {

        rejectionReasons.push(
          "Duplicate Contact In File"
        );

      }

      // ERROR DATA
      if (rejectionReasons.length > 0) {

        ErroredData.push({
          ...obj,
          rejectionReasons: rejectionReasons.join(", "),
        });

      }

      // CORRECT DATA
      else {

        seenInFileSet.add(ContactValue);

        CorrectData.push({

          NAME: String(obj.NAME).trim(),

          CONTACT: ContactValue,

          COMPANY: String(obj.COMPANY).trim(),

          EMPLOYEES: EmployeesValue,

          EXPORT_TYPE: 1,

          CREATED_BY: req.headers.name,

        });

      }

    }
    // ================= GET MAX LEAD NO =================
    const maxLeadNoResult = await sequelize.query(
      `
  SELECT ISNULL(MAX(Lead_No), 0) AS MaxLeadNo
  FROM HRMS_Lead_Master
  `,
      {
        type: sequelize.QueryTypes.SELECT,
        transaction: t,
      }
    );

    let nextLeadNo = maxLeadNoResult[0].MaxLeadNo + 1;
    // ================= INSERT =================
    if (CorrectData.length > 0) {

      for (const row of CorrectData) {

        await sequelize.query(
          `
          INSERT INTO HRMS_Lead_Master
          (
          Lead_No,
            NAME,
            CONTACT,
            COMPANY,
            EMPLOYEES,
           
            CREATED_BY,
            CREATED_AT  
          )
          VALUES
          (
          :Lead_No,
            :NAME,
            :CONTACT,
            :COMPANY,
            :EMPLOYEES,
            
            :CREATED_BY,
            GETDATE()
          )
          `,
          {
            replacements: {
              Lead_No: nextLeadNo,
              NAME: row.NAME,

              CONTACT: row.CONTACT,

              COMPANY: row.COMPANY,

              EMPLOYEES: row.EMPLOYEES,



              CREATED_BY: req.headers.name,

            },

            type: sequelize.QueryTypes.INSERT,

            transaction: t,
          }
        );
        nextLeadNo++;
      }

    }

    await t.commit();

    return res.status(200).send({

      Message: `${CorrectData.length} Records Imported Successfully`,

      CorrectData,

      ErroredData,

    });

  } catch (error) {

    await t.rollback();

    console.log(error);

    return res.status(500).send({
      Message: "Error while importing data",
      Error: error.message,
    });

  } finally {

    if (sequelize) {
      await sequelize.close();
    }

  }

};



exports.LeadFormat = async function (req, res) {

  const sequelize = await dbname(
    req,
    req.query.compcode
  );

  try {

    const workbook = new ExcelJS.Workbook();

    // ================= SHEET 1 =================
    const worksheet = workbook.addWorksheet("Sheet1");

    const headers = [
      "FULL NAME",
      "PHONE NUMBER",
      "COMPANY NAME",
      "NO. OF EMPLOYEES",
    ];

    worksheet.addRow(headers);

    // HEADER STYLE
    worksheet.getRow(1).font = {
      bold: true,
    };



    // AUTO WIDTH
    worksheet.columns.forEach((column) => {
      column.width = 30;
    });

    // DOWNLOAD FILE
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=LeadImportSample.xlsx"
    );

    await workbook.xlsx.write(res);

    res.end();

  } catch (error) {

    console.log(error);

    return res.status(500).send({
      Message: "Error while downloading format",
      Error: error.message,
    });

  } finally {

    if (sequelize) {
      await sequelize.close();
    }

  }

};
exports.addName = async function (req, res) {
  const { misc_name } = req.body;
  if (!misc_name || !misc_name.trim()) {
    return res.status(400).send({ success: false, message: "Please Enter The Name." });
  }
  const sequelize = await dbname(req, req.headers.compcode);
  const t = await sequelize.transaction();
  try {
    const maxIdResult = await sequelize.query(
      `SELECT ISNULL(MAX(ID), 0) + 1 AS newId FROM Master_User_Right`,
      { transaction: t }
    );
    const newId = maxIdResult[0][0].newId;

    await sequelize.query(
      `INSERT INTO Master_User_Right (ID, MISC_NAME, Created_By, Created_At) 
       VALUES (:ID, :MISC_NAME, :Created_By, GETDATE())`,
      {
        replacements: {
          ID: newId,
          MISC_NAME: misc_name.trim(),
          Created_By: req.headers.name || null,   // logged-in user ka naam header se
        },
        transaction: t,
      }
    );

    await t.commit();
    res.status(200).send({
      success: true,
      message: "Name added successfully",
      Result: { ID: newId, MISC_NAME: misc_name.trim() },
    });
  } catch (e) {
    await t.rollback();
    console.log(e);
    res.status(500).send({ success: false, message: "Error while adding name." });
  } finally {
    await sequelize.close();
  }
};

// -------------------- 2. FETCH LIST (left side list ke liye + refresh ke liye) --------------------
exports.fetchList = async function (req, res) {
  const sequelize = await dbname(req, req.headers.compcode);
  try {
    const result = await sequelize.query(
      `SELECT DISTINCT ID, MISC_NAME FROM Master_User_Right ORDER BY MISC_NAME`
    );
    res.status(200).send({ success: true, Result: result[0] });
  } catch (e) {
    console.log(e);
    res.status(500).send({ success: false, message: "Error while fetching list." });
  } finally {
    await sequelize.close();
  }
};

// -------------------- 3. FIND RIGHTS BY ID (row click karne par checkbox pre-select) --------------------
exports.findRights = async function (req, res) {
  const { ID } = req.body;
  if (!ID) return res.status(400).send({ success: false, message: "ID is required" });

  const sequelize = await dbname(req, req.headers.compcode);
  try {
    const result = await sequelize.query(
      `SELECT Optn_Name, Module_Code FROM Master_User_Right WHERE ID = :ID AND Optn_Name IS NOT NULL`,
      { replacements: { ID } }
    );
    const rows = result[0];

    const ModuleRights = rows.filter((r) => r.Module_Code == 10).map((r) => r.Optn_Name);
    const UserWiseRights = rows.filter((r) => r.Module_Code == 99).map((r) => r.Optn_Name);

    res.status(200).send({ success: true, Result: { ModuleRights, UserWiseRights } });
  } catch (e) {
    console.log(e);
    res.status(500).send({ success: false, message: "Error while fetching rights." });
  } finally {
    await sequelize.close();
  }
};

exports.saveRights = async function (req, res) {
  const { ID, MISC_NAME, ModuleRights = [], UserWiseRights = [] } = req.body;

  if (!ID) return res.status(400).send({ success: false, message: "Please select a name first." });

  const sequelize = await dbname(req, req.headers.compcode);
  const t = await sequelize.transaction();
  try {
    await sequelize.query(
      `DELETE FROM Master_User_Right WHERE ID = :ID AND Optn_Name IS NOT NULL`,
      { replacements: { ID }, transaction: t }
    );

    const Created_By = req.headers.name || null;

    const moduleRows = ModuleRights.filter((r) => r?.length > 0).map((r) => ({
      ID,
      MISC_NAME,
      Optn_Name: r,
      Module_Code: 10,
      Created_By,
    }));

    const userWiseRows = UserWiseRights.filter((r) => r?.length > 0).map((r) => ({
      ID,
      MISC_NAME,
      Optn_Name: r,
      Module_Code: 99,
      Created_By,
    }));

    const allRows = [...moduleRows, ...userWiseRows];

    for (const row of allRows) {
      await sequelize.query(
        `INSERT INTO Master_User_Right (ID, MISC_NAME, Optn_Name, Module_Code, Created_By, Created_At)
         VALUES (:ID, :MISC_NAME, :Optn_Name, :Module_Code, :Created_By, GETDATE())`,
        { replacements: row, transaction: t }
      );
    }

    await t.commit();
    res.status(200).send({ success: true, message: "Rights saved successfully." });
  } catch (e) {
    await t.rollback();
    console.log(e);
    res.status(500).send({ success: false, message: "Error while saving rights." });
  } finally {
    await sequelize.close();
  }
};

// -------------------- ROLE LIST (checkbox list ke liye) --------------------
exports.getRoleList = async function (req, res) {
  const sequelize = await dbname(req, req.headers.compcode);
  try {
    const result = await sequelize.query(
      `SELECT DISTINCT ID, MISC_NAME FROM Master_User_Right ORDER BY MISC_NAME`
    );
    res.status(200).send({ success: true, Result: result[0] });
  } catch (e) {
    console.log(e);
    res.status(500).send({ success: false, message: "Error while fetching role list." });
  } finally {
    await sequelize.close();
  }
};

exports.applyRoleRights = async function (req, res) {
  const { UserCodes = [], RoleIds = [] } = req.body;
  console.log("applyRoleRights called with:", { UserCodes, RoleIds });

  if (!UserCodes.length) {
    return res.status(400).send({ success: false, message: "Please select at least one user." });
  }
  if (!RoleIds.length) {
    return res.status(400).send({ success: false, message: "Please select at least one role." });
  }

  const sequelize = await dbname(req, req.headers.compcode);
  const t = await sequelize.transaction();
  var RightsTbl = _UserRights(sequelize, DataTypes);

  try {
    // 1. Role(s) ke rights ek baar hi nikal lo (sabhi selected users ke liye same rights use honge)
    const roleRightsResult = await sequelize.query(
      `SELECT Optn_Name, Module_Code FROM Master_User_Right 
       WHERE ID IN (:RoleIds) AND Optn_Name IS NOT NULL`,
      { replacements: { RoleIds }, transaction: t }
    );
    const roleRights = roleRightsResult[0];

    if (!roleRights.length) {
      await t.rollback();
      return res.status(400).send({
        success: false,
        message: "Selected role(s) have no rights configured yet.",
      });
    }

    // duplicate rights hatao (agar 2 role select kiye ho jinke rights overlap karte h)
    const uniqueMap = new Map();
    roleRights.forEach((r) => {
      uniqueMap.set(`${r.Module_Code}::${r.Optn_Name}`, {
        Optn_Name: r.Optn_Name,
        Module_Code: r.Module_Code,
      });
    });
    const uniqueRoleRights = Array.from(uniqueMap.values());

    // 2. Har selected user ke liye purane rights hatao aur naye insert karo
    for (const UserCode of UserCodes) {
      await RightsTbl.destroy({
        where: { User_Code: UserCode },
        transaction: t,
      });

      const rowsToInsert = uniqueRoleRights.map((r) => ({
        User_Code: UserCode,
        Optn_Name: r.Optn_Name,
        Module_Code: r.Module_Code,
      }));

      await RightsTbl.bulkCreate(rowsToInsert, { transaction: t });
    }

    await t.commit();
    res.status(200).send({
      success: true,
      message: `Role rights applied to ${UserCodes.length} user(s) successfully.`,
    });
  } catch (e) {
    await t.rollback();
    console.log(e);
    res.status(500).send({ success: false, message: "Error while applying role rights." });
  } finally {
    await sequelize.close();
  }
};

exports.getUserAppliedRoles = async function (req, res) {
  const { UserCode } = req.body;
  const sequelize = await dbname(req, req.headers.compcode);
  try {
    // User ke current rights nikalo
    const userRightsResult = await sequelize.query(
      `SELECT Optn_Name, Module_Code FROM User_Rights WHERE User_Code = :UserCode`,
      { replacements: { UserCode } }
    );
    const userRightsSet = new Set(
      userRightsResult[0].map((r) => `${r.Module_Code}::${r.Optn_Name}`)
    );

    // Har role ke rights check karo ki wo poore match karte h ya nahi
    const rolesResult = await sequelize.query(
      `SELECT DISTINCT ID FROM Master_User_Right WHERE Optn_Name IS NOT NULL`
    );
    const roleIds = rolesResult[0].map((r) => r.ID);

    const matchedRoleIds = [];
    for (const roleId of roleIds) {
      const roleRightsResult = await sequelize.query(
        `SELECT Optn_Name, Module_Code FROM Master_User_Right WHERE ID = :roleId AND Optn_Name IS NOT NULL`,
        { replacements: { roleId } }
      );
      const roleKeys = roleRightsResult[0].map((r) => `${r.Module_Code}::${r.Optn_Name}`);
      const allMatch = roleKeys.every((k) => userRightsSet.has(k));
      if (allMatch && roleKeys.length > 0) matchedRoleIds.push(roleId);
    }

    res.status(200).send({ success: true, Result: matchedRoleIds });
  } catch (e) {
    console.log(e);
    res.status(500).send({ success: false, message: "Error while checking applied roles." });
  } finally {
    await sequelize.close();
  }
};

exports.ModuleInformationView = async function (req, res) {
  const sequelize = await dbname(req, "DBCON");
  console.log(req.body,"llllll")

  try { 

    const query = `SELECT * FROM  DB_CON`;

    const data = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    return res.status(200).json({
      success: true,
      data,
    });

  } catch (error) {
    console.error("ModuleInformationView Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch data.",
      error: error.message,
    });
  } finally {
    await sequelize.close();
  }
};


// GET saved active states for a company (DLR_ID + DB_Name)
exports.GetActiveModuleReport = async function (req, res) {
  const sequelize = await dbname(req, req.headers.compcode);
  const { DLR_ID, DB_Name } = req.body;

  try {
    const data = await sequelize.query(
      `SELECT Module, Module_Key, Sub_Module, Sub_Module_Key, is_Active
       FROM Active_Module_Report
       WHERE DLR_ID = :DLR_ID AND DB_Name = :DB_Name`,
      {
        replacements: { DLR_ID, DB_Name },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("GetActiveModuleReport Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch active module report.",
      error: error.message,
    });
  } finally {
    await sequelize.close();
  }
};

// SAVE (upsert) active status for one Module + Sub_Module row
exports.SaveActiveModuleReport = async function (req, res) {
  const sequelize = await dbname(req, req.headers.compcode);
  const {
    DLR_ID,
    DB_Name,
    Module,
    Module_Key,
    Sub_Module,
    Sub_Module_Key,
    Compay_Nmae,
    is_Active,
    Export_type,
  } = req.body;

  const Created_By = req.headers.name || "";

  try {
    const existing = await sequelize.query(
      `SELECT UTD FROM Active_Module_Report
       WHERE DLR_ID = :DLR_ID AND DB_Name = :DB_Name
         AND Module_Key = :Module_Key AND Sub_Module_Key = :Sub_Module_Key`,
      {
        replacements: { DLR_ID, DB_Name, Module_Key, Sub_Module_Key },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (existing.length > 0) {
      await sequelize.query(
        `UPDATE Active_Module_Report
         SET is_Active = :is_Active,
             Module = :Module,
             Sub_Module = :Sub_Module,
             Compay_Nmae = :Compay_Nmae,
             Export_type = :Export_type
         WHERE DLR_ID = :DLR_ID AND DB_Name = :DB_Name
           AND Module_Key = :Module_Key AND Sub_Module_Key = :Sub_Module_Key`,
        {
          replacements: {
            is_Active,
            Module,
            Sub_Module,
            Compay_Nmae,
            Export_type,
            DLR_ID,
            DB_Name,
            Module_Key,
            Sub_Module_Key,
          },
          type: sequelize.QueryTypes.UPDATE,
        }
      );
    } else {
      await sequelize.query(
        `INSERT INTO Active_Module_Report
          (DLR_ID, DB_Name, Module, Module_Key, Sub_Module, Sub_Module_Key, Compay_Nmae, is_Active, Export_type, Created_By, Created_At)
         VALUES
          (:DLR_ID, :DB_Name, :Module, :Module_Key, :Sub_Module, :Sub_Module_Key, :Compay_Nmae, :is_Active, :Export_type, :Created_By, GETDATE())`,
        {
          replacements: {
            DLR_ID,
            DB_Name,
            Module,
            Module_Key,
            Sub_Module,
            Sub_Module_Key,
            Compay_Nmae,
            is_Active,
            Export_type,
            Created_By,
          },
          type: sequelize.QueryTypes.INSERT,
        }
      );
    }

    return res
      .status(200)
      .json({ success: true, message: "Saved successfully." });
  } catch (error) {
    console.error("SaveActiveModuleReport Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save active module report.",
      error: error.message,
    });
  } finally {
    await sequelize.close();
  }
};