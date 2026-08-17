const Sequelize = require('sequelize');
const _DmsRowData = function (sequelize, DataTypes) {
  return sequelize.define('DmsRowData', {
    Tran_Id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Tran_Type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Bill_No: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Bill_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    CANCEL_No: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    CANCEL_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Sale_Type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Chassis: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Engine: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    VIN: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Ledger_Id: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Ledger_Name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    State_Code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    GST: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Item_Code: {
      type: DataTypes.STRING(120),
      allowNull: true
    },
    HSN: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Basic_Price: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Disc_1: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Disc_2: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Disc_3: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Disc_4: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Taxable: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    CGST_Perc: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    SGST_Perc: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    IGST_Perc: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Cess_Perc: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    CGST: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    SGST: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    IGST: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Cess_Amt: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Rnd_Off: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Export_Type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Inv_Amt: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Rnd_Ledg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Disc_Perc: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    CGST_ACNT: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    SGST_ACNT: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    IGST_ACNT: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CGST_Post: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    SGST_Post: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    IGST_Post: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Loc_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    LOCATION: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Sup_Qty: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Sale_Ledg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Narration: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    Server_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Category: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Item_Type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Assessable_Rate: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Cess_Acnt: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Cess_Post: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Exp_Ledg4: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Exp_Perc4: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Exp_Amt4: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Exp_Ledg5: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Exp_Perc5: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Exp_Amt5: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Exp_Ledg6: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Exp_Perc6: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Exp_Amt6: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    IsRCM: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    UoM: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    IsCncl: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    IsReverse: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DrCR_Id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    LEDG_ACNT: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Seq_No: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Item_Seq: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Modl_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DRD_BillRef: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Hypo_Chrgs: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Insu_Chrgs: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Oth_Chrgs: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Parking_Chrgs: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    RoadTax_Chrgs: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    SmartCard_Chrgs: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    ENTR_MODE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    USR_CODE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ENTR_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    ENTR_TIME: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Wrty_GST: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ExtWrnty_Chrgs: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    TmpRegn_Chrgs: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Ref_Dt: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    TCS_TDS: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    SECTION_ID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    SECTION_LEDGER: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    SECTION_RATE: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    SECTION_AMT: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    PAN_NO: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Cost_Center: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    UTD: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Executive: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    MSIL_1: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    MSIL_2: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    MSIL_3: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    DLR_1: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    DLR_2: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    DLR_3: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    EW_From: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    EW_Upto: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    EW_Chas: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    EW_Eng: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    EW_MAKE: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    EW_VSL: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    PC_NAME: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    IRN: {
      type: DataTypes.STRING(70),
      allowNull: true
    },
    TCS: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    TCS_Perc: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    PAN: {
      type: DataTypes.STRING(12),
      allowNull: true
    },
    B2C_QR: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    ENTRY_BATCH: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Exp_Ledg7: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Exp_Ledg8: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Exp_Amt7: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Exp_Amt8: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    RECO_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    FIN_CTRL: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    MODL_GRP: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    TAX_RATE: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    RES_CITY: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    GSTR_FILLING: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Exp_Perc7: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Exp_Perc8: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Ledg_Add: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    Cons_Add: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    GST_REM: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    DISP_ADD: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    TDS_RECO_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    TDS_RECO_REM: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'DMS_ROW_DATA',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "DMS_ROW_DATA_Ind1",
        fields: [
          { name: "Tran_Id" },
          { name: "Tran_Type" },
          { name: "Bill_No" },
          { name: "Export_Type" },
          { name: "Loc_Code" },
          { name: "Bill_Date" },
          { name: "GST" },
          { name: "HSN" },
          { name: "UTD" },
        ]
      },
      {
        name: "PK__DMS_ROW___15B69B8E683CB8FE",
        unique: true,
        fields: [
          { name: "GUID" },
        ]
      },
    ]
  });
};


const Joi = require('joi');

const DmsRowDataSchema = Joi.object({
  Tran_Id: Joi.number().integer().allow(null),
  Tran_Type: Joi.string().max(50).allow(null),
  Bill_No: Joi.string().max(50).allow(null),
  Bill_Date: Joi.date().raw().allow(null),
  CANCEL_No: Joi.string().max(50).allow(null),
  CANCEL_Date: Joi.date().raw().allow(null),
  Sale_Type: Joi.string().max(50).allow(null),
  Chassis: Joi.string().max(50).allow(null),
  Engine: Joi.string().max(50).allow(null),
  VIN: Joi.string().max(50).allow(null),
  Ledger_Id: Joi.string().max(50).allow(null),
  Ledger_Name: Joi.string().max(200).allow(null),
  State_Code: Joi.string().max(50).allow(null),
  GST: Joi.string().max(50).allow(null),
  Item_Code: Joi.string().max(120).allow(null).allow(''),
  HSN: Joi.string().max(50).allow(null),
  Basic_Price: Joi.number().precision(4).allow(null),
  Disc_1: Joi.number().precision(4).allow(null),
  Disc_2: Joi.number().precision(4).allow(null),
  Disc_3: Joi.number().precision(4).allow(null),
  Disc_4: Joi.number().precision(4).allow(null),
  Taxable: Joi.number().precision(4).allow(null),
  CGST_Perc: Joi.number().precision(4).allow(null),
  SGST_Perc: Joi.number().precision(4).allow(null),
  IGST_Perc: Joi.number().precision(4).allow(null),
  Cess_Perc: Joi.number().precision(4).allow(null),
  CGST: Joi.number().precision(4).allow(null),
  SGST: Joi.number().precision(4).allow(null),
  IGST: Joi.number().precision(4).allow(null),
  Cess_Amt: Joi.number().precision(4).allow(null),
  Rnd_Off: Joi.number().precision(4).allow(null),
  Export_Type: Joi.number().integer().allow(null),
  Inv_Amt: Joi.number().precision(4).allow(null),
  Rnd_Ledg: Joi.number().integer().allow(null),
  Disc_Perc: Joi.number().precision(4).allow(null),
  CGST_ACNT: Joi.number().integer().allow(null),
  SGST_ACNT: Joi.number().integer().allow(null),
  IGST_ACNT: Joi.number().integer().allow(null),
  CGST_Post: Joi.number().integer().allow(null),
  SGST_Post: Joi.number().integer().allow(null),
  IGST_Post: Joi.number().integer().allow(null),
  Loc_Code: Joi.number().integer().allow(null),
  Location1: Joi.string().max(100).allow(null),
  Sup_Qty: Joi.number().precision(4).allow(null),
  Sale_ledg1: Joi.number().integer().allow(null),
  Narration: Joi.string().max(2000).allow(null),
  Server_id: Joi.number().integer().allow(null),
  Category: Joi.number().integer().allow(null),
  Item_Type: Joi.number().integer().allow(null),
  Assessable_Rate: Joi.number().precision(4).allow(null),
  Cess_Acnt: Joi.number().precision(4).allow(null),
  Cess_Post: Joi.number().precision(4).allow(null),
  Exp_Ledg4: Joi.number().integer().allow(null),
  Exp_Perc4: Joi.number().precision(4).allow(null),
  Exp_Amt4: Joi.number().precision(4).allow(null),
  Exp_Ledg5: Joi.number().integer().allow(null),
  Exp_Perc5: Joi.number().precision(4).allow(null),
  Exp_Amt5: Joi.number().precision(4).allow(null),
  Exp_Ledg6: Joi.number().integer().allow(null),
  Exp_Perc6: Joi.number().precision(4).allow(null),
  Exp_Amt6: Joi.number().precision(4).allow(null),
  IsRCM: Joi.number().integer().allow(null),
  UOM1: Joi.number().integer().allow(null),
  IsCncl: Joi.number().integer().allow(null),
  IsReverse: Joi.number().integer().allow(null),
  DrCR_Id: Joi.number().integer().allow(null),
  LEDG_ACNT: Joi.number().integer().allow(null),
  Seq_No: Joi.number().integer().allow(null),
  Item_Seq: Joi.number().integer().allow(null),
  Modl_Code: Joi.number().integer().allow(null),
  DRD_BillRef: Joi.string().max(50).allow(null),
  Hypo_Chrgs: Joi.number().precision(4).allow(null),
  Insu_Chrgs: Joi.number().precision(4).allow(null),
  Oth_Chrgs: Joi.number().precision(4).allow(null),
  Parking_Chrgs: Joi.number().precision(4).allow(null),
  RoadTax_Chrgs: Joi.number().precision(4).allow(null),
  SmartCard_Chrgs: Joi.number().precision(4).allow(null),
  ENTR_MODE: Joi.number().integer().allow(null),
  USR_CODE: Joi.number().integer().allow(null),
  ENTR_DATE: Joi.date().raw().allow(null),
  ENTR_TIME: Joi.number().precision(4).allow(null),
  Wrty_GST: Joi.number().integer().allow(null),
  ExtWrnty_Chrgs: Joi.number().precision(4).allow(null),
  TmpRegn_Chrgs: Joi.number().precision(4).allow(null),
  Ref_Dt: Joi.date().raw().allow(null),
  TCS_TDS: Joi.number().integer().allow(null),
  SECTION_ID: Joi.number().integer().allow(null),
  SECTION_LEDGER: Joi.number().integer().allow(null),
  SECTION_RATE: Joi.number().precision(4).allow(null),
  SECTION_AMT: Joi.number().precision(4).allow(null),
  PAN_NO: Joi.string().max(20).allow(null),
  Cost_Center1: Joi.number().integer().allow(null),
  UTD: Joi.number().integer().allow(null),
  Executive: Joi.string().max(80).allow(null),
  MSIL_1: Joi.number().precision(4).allow(null),
  MSIL_2: Joi.number().precision(4).allow(null),
  MSIL_3: Joi.number().precision(4).allow(null),
  DLR_1: Joi.number().precision(4).allow(null),
  DLR_2: Joi.number().precision(4).allow(null),
  DLR_3: Joi.number().precision(4).allow(null),
  EW_From: Joi.date().raw().allow(null),
  EW_Upto: Joi.date().raw().allow(null),
  EW_Chas: Joi.string().max(20).allow(null),
  EW_Eng: Joi.string().max(20).allow(null),
  EW_MAKE: Joi.string().max(30).allow(null),
  EW_VSL: Joi.string().max(30).allow(null),
  PC_NAME: Joi.string().max(100).allow(null),
  IRN: Joi.string().max(70).allow(null),
  TCS: Joi.number().precision(4).allow(null),
  TCS_Perc: Joi.number().precision(4).allow(null),
  PAN: Joi.string().max(12).allow(null),
  B2C_QR: Joi.string().max(500).allow(null),
  ENTRY_BATCH: Joi.string().max(50).allow(null),
  Exp_Ledg7: Joi.number().integer().allow(null),
  Exp_Ledg8: Joi.number().integer().allow(null),
  Exp_Amt7: Joi.number().precision(4).allow(null),
  Exp_Amt8: Joi.number().precision(4).allow(null),
  RECO_DATE: Joi.date().raw().allow(null),
  FIN_CTRL: Joi.string().max(30).allow(null),
  MODL_GRP: Joi.string().max(40).allow(null),
  TAX_RATE: Joi.number().precision(4).allow(null),
  RES_CITY: Joi.string().max(80).allow(null),
  GSTR_FILLING: Joi.string().max(20).allow(null),
  Exp_Perc7: Joi.number().precision(4).allow(null),
  Exp_Perc8: Joi.number().precision(4).allow(null),
  Ledg_Add: Joi.string().max(150).allow(null),
  Cons_Add: Joi.string().max(150).allow(null),
  GST_REM: Joi.string().max(300).allow(null),
  DISP_ADD: Joi.string().max(50).allow(null).allow(''),
  TDS_RECO_DATE: Joi.date().raw().allow(null),
  TDS_RECO_REM: Joi.string().max(200).allow(null),
});

module.exports = { _DmsRowData, DmsRowDataSchema };
