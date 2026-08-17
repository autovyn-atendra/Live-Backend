const Sequelize = require('sequelize');
const _LedgMst = function (sequelize, DataTypes) {
  return sequelize.define('LedgMst', {
    Ledg_Code: {
      primaryKey: true,
      type: DataTypes.FLOAT,
      allowNull: true,

    },
    Ledg_Class: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Group_Code: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Book_Code: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Ledg_Titl: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Ledg_Name: {
      type: DataTypes.STRING(120),
      allowNull: true
    },
    Ledg_Name2: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Ledg_Name3: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Ledg_Abbr: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Ledg_Add1: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Ledg_Add2: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Ledg_Add3: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Ledg_Add4: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Ledg_Add5: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Ledg_Add6: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Ledg_Ph1: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Ledg_Ph2: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    Ledg_Ph3: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    Ledg_Ph4: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    Ledg_Email: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    Ledg_Pan: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    Ledg_Tin: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Teh_Code: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    Dist_Code: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    State_Code: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    Op_Bal: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Cl_Bal: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    BIRTH_DATE: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    ANIV_DATE: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    Ledg_Limit: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    INTR_RATE: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    INTR_DAYS: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    ServerId: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Export_Type: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Exp_Date: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    Loc_code: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    ECC_No: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Srv_Tax: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Cust_Seg: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Cust_Catg: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Sub_Seg: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Email2: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    Email3: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    CST_No: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    GST_No: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Exc_Type: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    IEC_No: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Exc_Range: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Exc_Div: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Exc_Comm: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Exc_Regn: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Disc_1: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    Disc_2: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    Disc_3: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    Def_Ac: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    Bank_Name1: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    Br1_Add1: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    Br1_Add2: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    Ac_No1: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Ifsc_Code1: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    Bank_Name2: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Br2_Add1: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    Br2_Add2: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    Ac_No2: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Ifsc_Code2: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    DSE_Gen: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    Cust_Id: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Entry_Date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Modify_Date: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    Item_Post: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    Old_Ledg: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    GSTTYPE: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    PARTYTYPE: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    IsEComerce: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    Country: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    Chap_Head: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    GST: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    DBP_Head: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    Post_Branch: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Voucher_Tag: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    IsBilltoBill: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Cash_User: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Cash_Close: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Ledger_SName: {
      type: DataTypes.STRING(220),
      allowNull: true
    },
    ENTR_PC: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ENTR_USER: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    LAST_ALTER_USER: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    LAST_ALTER_PC: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    All_Br: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Reco_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Reco_Amt: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Ledg_PIN: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Ledg_City: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Cntrl_Acnt: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    IsComn: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    IsInvFund: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    OD_Ageing: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    NormalInt: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    OverDueInt: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Old_LCode: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Old_LName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Old_GCode: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    IsLockManual: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    IsIB: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    IsPost: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    IsDr: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    IsCr: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    BackDays: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Insu_Cntrl: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    IB_Locked: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    IB_NewRef: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    IB_AgnstRef: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ManualLock_From: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    PostHold_From: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    TDS_APP: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    TDS_SECTION: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    TDS_TYPE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    TCS_APP: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    TCS_SECTION: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    TCS_TYPE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    BRS_Flag: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CASH_FLAG: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    HSBC_Flag: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    TDS_PR: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    GST_Type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Show_Vch: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    TCS_Flag: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MSME: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Emp_Code: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Comp_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    TDS_Ledg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    TDS_Perc: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Party_Status: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    LOB: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Insu_CC: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    TALLY_GUID: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Form60: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Regn_No: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    BankApiEnabled: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Self_Bank_Trf: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Bank_Type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CORP_CC: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    API_Catg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    COMP_ACT_GRP: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    COMP_ACT_GRP_HST: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'Ledg_Mst',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "ClusteredIndex-20210404-233132",
        unique: true,
        fields: [
          { name: "Ledg_Code" },
        ]
      },
      {
        name: "Ledg_Mst_Ind1",
        fields: [
          { name: "Ledg_Code" },
          { name: "Ledg_Name" },
          { name: "Loc_code" },
        ]
      },
      {
        name: "NonClusteredIndex-20210404-235641",
        fields: [
          { name: "Group_Code" },
          { name: "Ledg_Name" },
          { name: "Ledg_Abbr" },
          { name: "Ledg_Add6" },
          { name: "Export_Type" },
          { name: "Loc_code" },
        ]
      },
      {
        name: "PK__Ledg_Mst__15B69B8FEB487013",
        unique: true,
        fields: [
          { name: "GUID" },
        ]
      },
    ]
  });
};

const Joi = require('joi');

const LedgMstSchema = Joi.object({
  Ledg_Class: Joi.number().allow(null).allow(''),
  Group_Code: Joi.number(),
  Book_Code: Joi.string().max(20).allow(null).allow(''),
  Ledg_Titl: Joi.string().max(20).allow(null).allow(''),
  Ledg_Name: Joi.string().max(120),
  Ledg_Name2: Joi.string().max(100).allow(null).allow(''),
  Ledg_Name3: Joi.string().max(100).allow(null).allow(''),
  Ledg_Abbr: Joi.string().max(100).allow(null).allow(''),
  Ledg_Add1: Joi.string().max(255).allow(null).allow(''),
  Ledg_Add2: Joi.string().max(255).allow(null).allow(''),
  Ledg_Add3: Joi.string().max(255).allow(null).allow(''),
  Ledg_Add4: Joi.string().max(100).allow(null).allow(''),
  Ledg_Add5: Joi.string().max(100).allow(null).allow(''),
  Ledg_Add6: Joi.string().max(255).allow(null).allow(''),
  Ledg_Ph1: Joi.string().max(50).allow(null).allow(''),
  Ledg_Ph2: Joi.string().max(15).allow(null).allow(''),
  Ledg_Ph3: Joi.string().max(15).allow(null).allow(''),
  Ledg_Ph4: Joi.string().max(15).allow(null).allow(''),
  Ledg_Email: Joi.string().max(45).allow(null).allow(''),
  Ledg_Pan: Joi.string().max(15).allow(null).allow(''),
  Ledg_Tin: Joi.string().max(25).allow(null).allow(''),
  Teh_Code: Joi.string().max(15).allow(null).allow(''),
  Dist_Code: Joi.string().max(15).allow(null).allow(''),
  State_Code: Joi.string().max(15).allow(null).allow(''),
  Op_Bal: Joi.number().allow(null).allow(''),
  Cl_Bal: Joi.number().allow(null).allow(''),
  BIRTH_DATE: Joi.string().max(15).allow(null).allow(''),
  ANIV_DATE: Joi.string().max(15).allow(null).allow(''),
  Ledg_Limit: Joi.string().max(15).allow(null).allow(''),
  INTR_RATE: Joi.string().max(15).allow(null).allow(''),
  INTR_DAYS: Joi.string().max(15).allow(null).allow(''),
  ServerId: Joi.number().allow(null).allow(''),
  Export_Type: Joi.number().allow(null).allow(''),
  Exp_Date: Joi.string().max(15).allow(null).allow(''),
  Loc_code: Joi.number().allow(null).allow(''),
  ECC_No: Joi.string().max(25).allow(null).allow(''),
  Srv_Tax: Joi.string().max(25).allow(null).allow(''),
  Cust_Seg: Joi.string().max(25).allow(null).allow(''),
  Cust_Catg: Joi.string().max(25).allow(null).allow(''),
  Sub_Seg: Joi.string().max(25).allow(null).allow(''),
  Email2: Joi.string().max(45).allow(null).allow(''),
  Email3: Joi.string().max(45).allow(null).allow(''),
  CST_No: Joi.string().max(45).allow(null).allow(''),
  GST_No: Joi.string().max(25).allow(null).allow(''),
  Exc_Type: Joi.string().max(25).allow(null).allow(''),
  IEC_No: Joi.string().max(25).allow(null).allow(''),
  Exc_Range: Joi.string().max(25).allow(null).allow(''),
  Exc_Div: Joi.string().max(25).allow(null).allow(''),
  Exc_Comm: Joi.string().max(25).allow(null).allow(''),
  Exc_Regn: Joi.string().max(25).allow(null).allow(''),
  Disc_1: Joi.string().max(15).allow(null).allow(''),
  Disc_2: Joi.string().max(15).allow(null).allow(''),
  Disc_3: Joi.string().max(15).allow(null).allow(''),
  Def_Ac: Joi.string().max(15).allow(null).allow(''),
  Bank_Name1: Joi.string().max(45).allow(null).allow(''),
  Br1_Add1: Joi.string().max(45).allow(null).allow(''),
  Br1_Add2: Joi.string().max(45).allow(null).allow(''),
  Ac_No1: Joi.string().max(25).allow(null).allow(''),
  Ifsc_Code1: Joi.string().max(15).allow(null).allow(''),
  Bank_Name2: Joi.string().max(25).allow(null).allow(''),
  Br2_Add1: Joi.string().max(45).allow(null).allow(''),
  Br2_Add2: Joi.string().max(45).allow(null).allow(''),
  Ac_No2: Joi.string().max(25).allow(null).allow(''),
  Ifsc_Code2: Joi.string().max(15).allow(null).allow(''),
  DSE_Gen: Joi.string().max(45).allow(null).allow(''),
  Cust_Id: Joi.string().max(25).allow(null).allow(''),
  Entry_Date: Joi.date().allow(null).allow(''),
  Modify_Date: Joi.string().max(15).allow(null).allow(''),
  Item_Post: Joi.string().max(15).allow(null).allow(''),
  Old_Ledg: Joi.string().max(15).allow(null).allow(''),
  GSTTYPE: Joi.string().max(15).allow(null).allow(''),
  PARTYTYPE: Joi.string().max(15).allow(null).allow(''),
  IsEComerce: Joi.string().max(15).allow(null).allow(''),
  Country: Joi.string().max(15).allow(null).allow(''),
  Chap_Head: Joi.string().max(15).allow(null).allow(''),
  GST: Joi.string().max(25).allow(null).allow(''),
  DBP_Head: Joi.string().max(15).allow(null).allow(''),
  Post_Branch: Joi.string().max(10).allow(null).allow(''),
  Voucher_Tag: Joi.string().max(200).allow(null).allow(''),
  IsBilltoBill: Joi.number().allow(null).allow(''),
  Cash_User: Joi.number().allow(null).allow(''),
  Cash_Close: Joi.date().allow(null).allow(''),
  Ledger_SName: Joi.string().max(220).allow(null).allow(''),
  ENTR_PC: Joi.string().max(50).allow(null).allow(''),
  ENTR_USER: Joi.number().allow(null).allow(''),
  LAST_ALTER_USER: Joi.number().allow(null).allow(''),
  LAST_ALTER_PC: Joi.string().max(50).allow(null).allow(''),
  All_Br: Joi.number().allow(null).allow(''),
  Reco_Date: Joi.date().allow(null).allow(''),
  Reco_Amt: Joi.number().allow(null).allow(''),
  Ledg_PIN: Joi.string().max(10).allow(null).allow(''),
  Ledg_City: Joi.string().max(100).allow(null).allow(''),
  Cntrl_Acnt: Joi.number().allow(null).allow(''),
  IsComn: Joi.number().allow(null).allow(''),
  IsInvFund: Joi.number().allow(null).allow(''),
  OD_Ageing: Joi.number().allow(null).allow(''),
  NormalInt: Joi.number().allow(null).allow(''),
  OverDueInt: Joi.number().allow(null).allow(''),
  Old_LCode: Joi.number().allow(null).allow(''),
  Old_LName: Joi.string().max(100).allow(null).allow(''),
  Old_GCode: Joi.number().allow(null).allow(''),
  IsLockManual: Joi.number().allow(null).allow(''),
  IsIB: Joi.number().allow(null).allow(''),
  IsPost: Joi.number().allow(null).allow(''),
  IsDr: Joi.number().allow(null).allow(''),
  IsCr: Joi.number().allow(null).allow(''),
  BackDays: Joi.number().allow(null).allow(''),
  Insu_Cntrl: Joi.number().allow(null).allow(''),
  IB_Locked: Joi.date().allow(null).allow(''),
  IB_NewRef: Joi.number().allow(null).allow(''),
  IB_AgnstRef: Joi.number().allow(null).allow(''),
  ManualLock_From: Joi.date().allow(null).allow(''),
  PostHold_From: Joi.date().allow(null).allow(''),
  TDS_APP: Joi.number().allow(null).allow(''),
  TDS_SECTION: Joi.number().allow(null).allow(''),
  TDS_TYPE: Joi.number().allow(null).allow(''),
  TCS_APP: Joi.number().allow(null).allow(''),
  TCS_SECTION: Joi.number().allow(null).allow(''),
  TCS_TYPE: Joi.number().allow(null).allow(''),
  BRS_Flag: Joi.number().allow(null).allow(''),
  CASH_FLAG: Joi.number().allow(null).allow(''),
  HSBC_Flag: Joi.number().allow(null).allow(''),
  TDS_PR: Joi.number().allow(null).allow(''),
  GST_Type: Joi.number().allow(null).allow(''),
  Show_Vch: Joi.number().allow(null).allow(''),
  TCS_Flag: Joi.number().allow(null).allow(''),
  MSME: Joi.number().allow(null).allow(''),
  Emp_Code: Joi.string().max(10).allow(null).allow(''),
  Comp_Code: Joi.number().allow(null).allow(''),
  TDS_Ledg: Joi.number().allow(null).allow(''),
  TDS_Perc: Joi.number().allow(null).allow(''),
  Party_Status: Joi.number().allow(null).allow(''),
  LOB: Joi.number().allow(null).allow(''),
  Insu_CC: Joi.number().allow(null).allow(''),
  TALLY_GUID: Joi.string().max(100).allow(null).allow(''),
  Form60: Joi.number().allow(null).allow(''),
  Regn_No: Joi.string().max(15).allow(null).allow(''),
  BankApiEnabled: Joi.number().allow(null).allow(''),
  Self_Bank_Trf: Joi.number().allow(null).allow(''),
  Bank_Type: Joi.number().allow(null).allow(''),
  CORP_CC: Joi.number().allow(null).allow(''),
  API_Catg: Joi.number().allow(null).allow(''),
  COMP_ACT_GRP: Joi.number().allow(null).allow(''),
  COMP_ACT_GRP_HST: Joi.number().allow(null).allow(''),
});

module.exports = { _LedgMst, LedgMstSchema };

