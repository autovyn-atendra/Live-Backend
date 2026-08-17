const Sequelize = require('sequelize');
const _ChasMst = function(sequelize, DataTypes) {
  return sequelize.define('ChasMst', {
    Chas_Id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Chas_No: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Eng_No: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Srl_No: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Reg_No: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Clr_No: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Clr_Abbr: {
      type: DataTypes.STRING(12),
      allowNull: true
    },
    Key_No: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Btry_No: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Btry_Make: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Mfg_Mth: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Mfg_Year: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Cpn_No: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Cpn_Amt: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Avj_Km: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Km_Run: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Modl_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Ageing: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Purc_Id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    PInv_No: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    PInv_Date: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    Purc_Amt: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    PSup_No: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    DlvChln_Id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Sale_Id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    SInv_No: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    SInv_Date: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    Trfin_Id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Trfout_Id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CrNote_Id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DrNote_Id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Ledg_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Prty_Name: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    Prty_Add1: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Prty_Add2: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    Prty_Add3: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    Prty_Ph1: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Prty_Ph2: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Prty_Ph3: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Prty_Ph4: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Prty_Email: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Ledg_Os: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Prty_DOB: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    Prty_Aniv: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    Ins_Date: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    Ins_Due: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    PUC_Date: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    Teh_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Dist_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Stat_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Pin_Code: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Insu_Comp: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    AMC_From: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    AMC_Upto: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    AMC_AMT: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Chs_Rem1: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    Chs_Rem2: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    Chs_Dtl1: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Chs_Dtl2: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Chs_Dtl3: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Chs_Dtl4: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    PDI_Km: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    PDI_Date: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    First_Km: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    First_Date: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    Sec_Km: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Sec_Date: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    Thrd_Km: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Thrd_Date: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    Forth_Km: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Forth_Date: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    Loc_Code: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Comp_Code: {
      type: DataTypes.SMALLINT,
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
    Cust_Code: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    VIN: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Purc_Loc: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Item_Type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    trfin: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    trfout: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Recd_date: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    Damage: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CNgCert_RCD: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Form21_Rcd: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Stepney_Rcd: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    TollKit_Rcd: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    LOB: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Stock_Status: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Transit: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    GRN: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Allot: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Delv: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Invcd: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    GUID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Created_By: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'CHAS_MST',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__CHAS_MST__15B69B8E351CB2EA",
        unique: true,
        fields: [
          { name: "GUID" },
        ]
      },
    ]
  });
};

const Joi = require('joi');

const chasMstSchema = Joi.object({
  Chas_Id: Joi.number().integer(),
  Chas_No: Joi.string().max(25).allow(null).allow(''),
  Eng_No: Joi.string().max(25).allow(null).allow(''),
  Srl_No: Joi.string().max(25).allow(null).allow(''),
  Reg_No: Joi.string().max(25).allow(null).allow(''),
  Clr_No: Joi.string().max(50).allow(null).allow(''),
  Clr_Abbr: Joi.string().max(12).allow(null).allow(''),
  Key_No: Joi.string().max(25).allow(null).allow(''),
  Btry_No: Joi.string().max(50).allow(null).allow(''),
  Btry_Make: Joi.string().max(50).allow(null).allow(''),
  Mfg_Mth: Joi.string().max(25).allow(null).allow(''),
  Mfg_Year: Joi.string().max(25).allow(null).allow(''),
  Cpn_No: Joi.string().max(25).allow(null).allow(''),
  Cpn_Amt: Joi.number().precision(4).allow(null),
  Avj_Km: Joi.string().max(25).allow(null).allow(''),
  Km_Run: Joi.string().max(25).allow(null).allow(''),
  Modl_Code: Joi.number().integer().allow(null),
  Ageing: Joi.number().integer().allow(null),
  Purc_Id: Joi.number().integer().allow(null),
  PInv_No: Joi.string().max(25).allow(null).allow(''),
  PInv_Date: Joi.date().raw().allow(null),
  Purc_Amt: Joi.number().precision(4).allow(null),
  PSup_No: Joi.string().max(50).allow(null).allow(''),
  DlvChln_Id: Joi.number().integer().allow(null),
  Sale_Id: Joi.number().integer().allow(null),
  SInv_No: Joi.string().max(25).allow(null).allow(''),
  SInv_Date: Joi.date().raw().allow(null),
  Trfin_Id: Joi.number().integer().allow(null),
  Trfout_Id: Joi.number().integer().allow(null),
  CrNote_Id: Joi.number().integer().allow(null),
  DrNote_Id: Joi.number().integer().allow(null),
  Ledg_Code: Joi.number().integer().allow(null),
  Prty_Name: Joi.string().max(150).allow(null).allow(''),
  Prty_Add1: Joi.string().max(100).allow(null).allow(''),
  Prty_Add2: Joi.string().max(150).allow(null).allow(''),
  Prty_Add3: Joi.string().max(150).allow(null).allow(''),
  Prty_Ph1: Joi.string().max(50).allow(null).allow(''),
  Prty_Ph2: Joi.string().max(50).allow(null).allow(''),
  Prty_Ph3: Joi.string().max(50).allow(null).allow(''),
  Prty_Ph4: Joi.string().max(50).allow(null).allow(''),
  Prty_Email: Joi.string().max(50).allow(null).allow(''),
  Ledg_Os: Joi.number().precision(4).allow(null),
  Prty_DOB: Joi.date().raw().allow(null),
  Prty_Aniv: Joi.date().raw().allow(null),
  Ins_Date: Joi.date().raw().allow(null),
  Ins_Due: Joi.date().raw().allow(null),
  PUC_Date: Joi.date().raw().allow(null),
  Teh_Code: Joi.number().integer().allow(null),
  Dist_Code: Joi.number().integer().allow(null),
  Stat_Code: Joi.number().integer().allow(null),
  Pin_Code: Joi.string().max(10).allow(null).allow(''),
  Insu_Comp: Joi.number().integer().allow(null),
  AMC_From: Joi.date().raw().allow(null),
  AMC_Upto: Joi.date().raw().allow(null),
  AMC_AMT: Joi.number().precision(4).allow(null),
  Chs_Rem1: Joi.string().max(200).allow(null).allow(''),
  Chs_Rem2: Joi.string().max(200).allow(null).allow(''),
  Chs_Dtl1: Joi.string().max(50).allow(null).allow(''),
  Chs_Dtl2: Joi.string().max(50).allow(null).allow(''),
  Chs_Dtl3: Joi.string().max(50).allow(null).allow(''),
  Chs_Dtl4: Joi.string().max(50).allow(null).allow(''),
  PDI_Km: Joi.string().max(50).allow(null).allow(''),
  PDI_Date: Joi.date().raw().allow(null),
  First_Km: Joi.string().max(50).allow(null).allow(''),
  First_Date: Joi.date().raw().allow(null),
  Sec_Km: Joi.string().max(50).allow(null).allow(''),
  Sec_Date: Joi.date().raw().allow(null),
  Thrd_Km: Joi.string().max(50).allow(null).allow(''),
  Thrd_Date: Joi.date().raw().allow(null),
  Forth_Km: Joi.string().max(50).allow(null).allow(''),
  Forth_Date: Joi.date().raw().allow(null),
  Loc_Code: Joi.number().integer().allow(null),
  Comp_Code: Joi.number().integer().allow(null),
  ServerId: Joi.number().integer().allow(null),
  Export_Type: Joi.number().integer(),
  Cust_Code: Joi.string().max(30).allow(null).allow(''),
  VIN: Joi.string().max(20).allow(null).allow(''),
  Purc_Loc: Joi.number().integer().allow(null),
  Item_Type: Joi.number().integer().allow(null),
  trfin: Joi.number().integer().allow(null),
  trfout: Joi.number().integer().allow(null),
  Recd_date: Joi.date().raw().allow(null),
  Damage: Joi.number().integer().allow(null),
  CNgCert_RCD: Joi.number().integer().allow(null),
  Form21_Rcd: Joi.number().integer().allow(null),
  Stepney_Rcd: Joi.number().integer().allow(null),
  TollKit_Rcd: Joi.number().integer().allow(null),
  LOB: Joi.number().integer().allow(null),
  Stock_Status: Joi.number().integer().allow(null),
  Transit: Joi.number().integer().allow(null),
  GRN: Joi.number().integer().allow(null),
  Allot: Joi.number().integer().allow(null),
  Delv: Joi.number().integer().allow(null),
  Invcd: Joi.number().integer().allow(null),
  GUID: Joi.number().integer().optional(),
  Created_By: Joi.string().max(200),
});

module.exports = {_ChasMst , chasMstSchema};
