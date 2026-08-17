const Sequelize = require('sequelize');
const _UserTbl = function (sequelize, DataTypes) {
  return sequelize.define('UserTbl', {
    User_Code: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    User_Name: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    User_Pwd: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    Module_Code: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    User_Color: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Edit_Days: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    DOC_PRINT: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    LOCK_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Exp_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    ServerId: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    Export_Type: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    Comp_Code: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    HOD_Code: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Emp_Pos: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Multi_loc: {
      type: DataTypes.STRING(1100),
      allowNull: true
    },
    User_mob: {
      type: DataTypes.STRING(35),
      allowNull: true
    },
    Approver_Mob: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Maker: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Checker: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Maker_Checker: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    POSTED_EDIT: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    POSTED_DELETE: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    Reverse_Entry: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    Reverse_View: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    Cash_Sale: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Multi_Cash: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    Post_Ac: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    UnPost_Ac: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    Cash_Book: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    Back_days: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Inter_Branch: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MultiLoc_Login: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    Alter_Ledger: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    Alter_Group: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    Group_Change: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    Group_Hierarchy: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    Cashsheet_OTP: {
      type: DataTypes.STRING(22),
      allowNull: true
    },
    Rndoff_Limit: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Cash_Allow: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Disc_Aprl: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    Post_Days: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    PL_Ledger: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    HD_SrnNo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    HD_Enabled: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Bank_OTP: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DMS_UNPOST: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    GST_EDIT: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    BS_Ledger: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    HSBC_AC: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    Super_User: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    IB_UNPOST: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    Reco_Unpost: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    IB_CANCEL: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    Allow_QR: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DMS_Vch_Enable: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    Wks_Bill_Cancel: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    DMS_EINV: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    GST_Lock_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Rcpt_Cancel: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    INPUT_GST_LOCK_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    RCPT_2LAKH: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    ICM_POST: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    VCH_RECO: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    ICM_DELV: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    ICM_VCH_CNCL: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    ICM_Lock_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Last_PWD_Changed: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Last_PWD: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    DOC_DOWNLOAD: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    IsDirectPrint: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    RightPnl_Hide: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    F1_Hide: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    Department: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Designation: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    User_Full_Name: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    User_Email: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    Created_By: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    Created_On: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Allow_Generic: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    Lock_Mnth: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Lock_Time: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    CASH_RCPT: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    BANK_RCPT: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    CASH_PYMT: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    BANK_PYMT: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    CASH_RCPT_DAY: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    BANK_RCPT_DAY: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CASH_PYMT_DAY: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    BANK_PYMT_DAY: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    AllowGSTLocked: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    emp_dms_code: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    EMPCODE: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    seva_item_type: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    VAS_bookCode: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    ERP_User_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    PHY_LOC_CODE: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    UTD: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    phy_loc: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    TV_POSTING_LOC_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'user_tbl',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "ClusteredIndex-20220719-130413",
        fields: [
          { name: "User_Code" },
          { name: "User_Name" },
          { name: "Module_Code" },
          { name: "Export_Type" },
          { name: "Multi_loc" },
        ]
      },
    ]
  });
};

const Joi = require('joi');

const userTblSchema = Joi.object({
  User_Name: Joi.string().max(30).allow(null).allow(''),
  User_Pwd: Joi.string().max(70).allow(null).allow(''),
  Module_Code: Joi.number().integer().allow(null).allow(''),
  User_Color: Joi.alternatives().try(Joi.string().max(50).allow(null).allow(''), Joi.number()),
  Edit_Days: Joi.string().max(50).allow(null).allow(''),
  DOC_PRINT: Joi.string().max(1).allow(null).allow(''),
  LOCK_DATE: Joi.date().allow(null).allow('').raw(),
  Exp_Date: Joi.date().allow(null).allow('').raw(),
  ServerId: Joi.number().integer().allow(null).allow(''),
  Export_Type: Joi.number().required(),
  Comp_Code: Joi.number().integer().allow(null).allow(''),
  HOD_Code: Joi.string().max(10).allow(null).allow(''),
  Emp_Pos: Joi.string().max(10).allow(null).allow(''),
  Multi_loc: Joi.string().max(1100).allow(null).allow(''),
  User_mob: Joi.string().max(35).allow(null).allow(''),
  Approver_Mob: Joi.string().max(100).allow(null).allow(''),
  Maker: Joi.number().integer().allow(null).allow(''),
  Checker: Joi.number().integer().allow(null).allow(''),
  Maker_Checker: Joi.number().integer().allow(null).allow(''),
  POSTED_EDIT: Joi.string().max(1).allow(null).allow(''),
  POSTED_DELETE: Joi.string().max(1).allow(null).allow(''),
  Reverse_Entry: Joi.string().max(1).allow(null).allow(''),
  Reverse_View: Joi.string().max(1).allow(null).allow(''),
  Cash_Sale: Joi.number().integer().allow(null).allow(''),
  Multi_Cash: Joi.string().max(1000).allow(null).allow(''),
  Post_Ac: Joi.string().max(1000).allow(null).allow(''),
  UnPost_Ac: Joi.string().max(1000).allow(null).allow(''),
  Cash_Book: Joi.string().max(1000).allow(null).allow(''),
  Back_days: Joi.number().integer().allow(null).allow(''),
  Inter_Branch: Joi.number().integer().allow(null).allow(''),
  MultiLoc_Login: Joi.string().max(2).allow(null).allow(''),
  Alter_Ledger: Joi.string().max(1).allow(null).allow(''),
  Alter_Group: Joi.string().max(1).allow(null).allow(''),
  Group_Change: Joi.string().max(1).allow(null).allow(''),
  Group_Hierarchy: Joi.string().max(1).allow(null).allow(''),
  Cashsheet_OTP: Joi.string().max(22).allow(null).allow(''),
  Rndoff_Limit: Joi.number().precision(4).allow(null).allow(''),
  Cash_Allow: Joi.number().integer().allow(null).allow(''),
  Disc_Aprl: Joi.string().max(1).allow(null).allow(''),
  Post_Days: Joi.number().integer().allow(null).allow(''),
  PL_Ledger: Joi.string().max(2).allow(null).allow(''),
  HD_SrnNo: Joi.string().max(50).allow(null).allow(''),
  HD_Enabled: Joi.number().integer().allow(null).allow(''),
  Bank_OTP: Joi.number().integer().allow(null).allow(''),
  DMS_UNPOST: Joi.string().max(2).allow(null).allow(''),
  GST_EDIT: Joi.string().max(2).allow(null).allow(''),
  BS_Ledger: Joi.string().max(2).allow(null).allow(''),
  HSBC_AC: Joi.string().max(300).allow(null).allow(''),
  Super_User: Joi.number().integer().allow(null).allow(''),
  IB_UNPOST: Joi.string().max(2).allow(null).allow(''),
  Reco_Unpost: Joi.string().max(2).allow(null).allow(''),
  IB_CANCEL: Joi.string().max(2).allow(null).allow(''),
  Allow_QR: Joi.number().integer().allow(null).allow(''),
  DMS_Vch_Enable: Joi.string().max(2).allow(null).allow(''),
  Wks_Bill_Cancel: Joi.string().max(1).allow(null).allow(''),
  DMS_EINV: Joi.string().max(1).allow(null).allow(''),
  GST_Lock_Date: Joi.date().allow(null).allow('').raw(),
  Rcpt_Cancel: Joi.string().max(1).allow(null).allow(''),
  INPUT_GST_LOCK_DATE: Joi.date().allow(null).allow('').raw(),
  RCPT_2LAKH: Joi.string().max(2).allow(null).allow(''),
  ICM_POST: Joi.string().max(2).allow(null).allow(''),
  VCH_RECO: Joi.string().max(10).allow(null).allow(''),
  ICM_DELV: Joi.string().max(5).allow(null).allow(''),
  ICM_VCH_CNCL: Joi.string().max(1).allow(null).allow(''),
  ICM_Lock_Date: Joi.date().allow(null).allow('').raw(),
  Last_PWD_Changed: Joi.date().allow(null).allow('').raw(),
  Last_PWD: Joi.string().max(20).allow(null).allow(''),
  DOC_DOWNLOAD: Joi.string().max(5).allow(null).allow(''),
  IsDirectPrint: Joi.string().max(5).allow(null).allow(''),
  RightPnl_Hide: Joi.string().max(2).allow(null).allow(''),
  F1_Hide: Joi.string().max(2).allow(null).allow(''),
  Department: Joi.string().max(50).allow(null).allow(''),
  Designation: Joi.string().max(50).allow(null).allow(''),
  User_Full_Name: Joi.string().max(60).allow(null).allow(''),
  User_Email: Joi.string().email().max(60).allow(null).allow(''),
  Created_By: Joi.string().max(60).allow(null).allow(''),
  Created_On: Joi.date().allow(null).allow('').raw(),
  Allow_Generic: Joi.string().max(5).allow(null).allow(''),
  Lock_Mnth: Joi.number().integer().allow(null).allow(''),
  Lock_Time: Joi.number().precision(4).allow(null).allow(''),
  CASH_RCPT: Joi.string().max(2).allow(null).allow(''),
  BANK_RCPT: Joi.string().max(2).allow(null).allow(''),
  CASH_PYMT: Joi.string().max(2).allow(null).allow(''),
  BANK_PYMT: Joi.string().max(2).allow(null).allow(''),
  CASH_RCPT_DAY: Joi.number().integer().allow(null).allow(''),
  BANK_RCPT_DAY: Joi.number().integer().allow(null).allow(''),
  CASH_PYMT_DAY: Joi.number().integer().allow(null).allow(''),
  BANK_PYMT_DAY: Joi.number().integer().allow(null).allow(''),
  AllowGSTLocked: Joi.string().max(5).allow(null).allow(''),
  emp_dms_code: Joi.string().max(15).allow(null).allow(''),
  EMPCODE: Joi.string().max(15).allow(null).allow(''),
  seva_item_type: Joi.string().max(200).allow(null).allow(''),
  ERP_User_Code: Joi.number().integer().allow(null).allow(''),
  VAS_bookCode: Joi.string().max(200).allow(null).allow(''),
  PHY_LOC_CODE: Joi.string().max(50).allow(null).allow(''),
  phy_loc: Joi.string().max(500).allow(null).allow(''),
  TV_POSTING_LOC_DATE: Joi.date().allow(null).allow('').raw(),
});


module.exports = { _UserTbl, userTblSchema };
