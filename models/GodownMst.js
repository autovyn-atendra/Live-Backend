const Sequelize = require("sequelize");
const _GodownMst = function (sequelize, DataTypes) {
  return sequelize.define(
    "GodownMst",
    {
      UTD: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      Comp_Code: {
        type: DataTypes.TINYINT,
        allowNull: true,
      },
      Godw_Code: {
        type: DataTypes.TINYINT,
        allowNull: true,
      },
      Godw_Name: {
        type: DataTypes.STRING(75),
        allowNull: true,
      },
      Godw_Add1: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Godw_Add2: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Godw_Add3: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Spl_Rem: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Pin_Code: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Mob_No: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      State: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      City: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Reg_Date: {
        type: "SMALLDATETIME",
        allowNull: true,
      },
      ECC_No: {
        type: DataTypes.STRING(40),
        allowNull: true,
      },
      IEC_No: {
        type: DataTypes.STRING(40),
        allowNull: true,
      },
      Goods_Name: {
        type: DataTypes.STRING(40),
        allowNull: true,
      },
      Chap_Head: {
        type: DataTypes.STRING(40),
        allowNull: true,
      },
      Excise_Book: {
        type: DataTypes.STRING(40),
        allowNull: true,
      },
      Range_Code: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Range_Name: {
        type: DataTypes.STRING(40),
        allowNull: true,
      },
      Range_Add1: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Range_Add2: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Range_Add3: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Div_Code: {
        type: DataTypes.STRING(40),
        allowNull: true,
      },
      Div_Name: {
        type: DataTypes.STRING(40),
        allowNull: true,
      },
      Div_Add1: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Div_Add2: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Div_Add3: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Com_Code: {
        type: DataTypes.STRING(40),
        allowNull: true,
      },
      Com_Name: {
        type: DataTypes.STRING(75),
        allowNull: true,
      },
      Com_Add1: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Com_Add2: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Com_Add3: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Exp_Date: {
        type: "SMALLDATETIME",
        allowNull: true,
      },
      ServerId: {
        type: DataTypes.TINYINT,
        allowNull: true,
      },
      Export_Type: {
        type: DataTypes.TINYINT,
        allowNull: true,
      },
      Godw_Catg: {
        type: DataTypes.SMALLINT,
        allowNull: true,
      },
      State_Code: {
        type: DataTypes.TINYINT,
        allowNull: true,
      },
      GST_No: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      PAN_No: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      GSTTYPE: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      PARTYTYPE: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      IsEComerce: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Br_Region: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Br_Segment: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Br_Location: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      BR_DMDT: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      BR_DMS: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      BR_MI: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      BR_EXTRANET: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      DMS_HSN_Code: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      DMS_TV_Code: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      DMS_Purc_Code: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      DMS_BT_Code: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      DMS_PART_TRFOUT: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      DMS_PART_TRFIN: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      BR_RECEIPT: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      NEWCAR_RCPT: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Cash_Rcpt: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Bank_Rcpt: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      CC_Rcpt: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      EW_ACNT: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      INSU_ACNT: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Fastag_Acnt: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      PTrfIn_Book: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      PTrfOut_Book: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      PTrfIn_Ledg: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      PTrfOut_ledg: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      NexaCard_Book: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      AutoCard_Book: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      NexaCard_Sale: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      AutoCard_Sale: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      EW_Payable: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Insu_Payable: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Fastag_Payable: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Nexacard_Payable: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Autocard_Payable: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      MCP_COLLECTION: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      MCP_SALE: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      MCP_BOOK: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      FSC_Income: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      FSC_Expense: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Bk_FSC_Income: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Bk_FSC_Expense: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      CSI_Yes: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Insu_Chrgs: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Oth_Chrgs: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Parking_Chrgs: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      RoadTax_Chrgs: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      SmartCard_Chrgs: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Newcar_JV: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Lock_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      Wrty_Book: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Wrty_Posting: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Wrty_GST: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Wrty_Sale: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Autodebit_Book: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      ExtWrnty_Chrgs: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      TmpRegn_Chrgs: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      BC_YES: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Godw_Seq: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      TDS_ENABLED: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      TCS_ENABLED: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Exch_Book: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Corp_Book: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Exch_Dr: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Corp_Dr: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Exch_Cr: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Corp_Cr: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      IsCostCenter: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Default_CC: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      item_post: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      ASP_Userid: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      ASP_Pwd: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      API_Usrname: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      API_Pwd: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      ASP_GSTIN: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      ASP_TockenId: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      FSC_TDS: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      MSR_BOOK: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      MSR_Sale: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Old_DMS_HSN_Code: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      Pymt_Link: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      PL_Ledg: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      PL_Book: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      ACN_Book: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      TRADE_NAME: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      GST_Lock_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      INPUT_GST_LOCK_DATE: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      LOB: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      CCP_Payable: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      CCP_Book: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Insu_Branch: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Bank_Name: {
        type: DataTypes.STRING(60),
        allowNull: true,
      },
      Bank_Ac: {
        type: DataTypes.STRING(60),
        allowNull: true,
      },
      Bank_Branch: {
        type: DataTypes.STRING(60),
        allowNull: true,
      },
      Bank_IFSC: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },
      UPI_ID: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Book_CN_Disc: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Book_CN_AUTOCARD: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Book_CN_TDS: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Book_CN_GSTTDS: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Ledg_CN_Disc: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Ledg_CN_AUTOCARD: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Ledg_CN_TDS: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Ledg_CN_GSTTDS: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      EW_CRN: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Ledger_On_LedgerID: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      SALES_INTEGRATION: {
        type: DataTypes.TINYINT,
        allowNull: true,
      },
      Daily_Seq: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      SALE_INV_PREFIX: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      NEWCAR_TCS: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      CESS_APP: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      CCP_CRN: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      TALLY_BRANCH_NAME: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      Godw_Abbr: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      TC_NUMBER: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      BRANCH_LOCK_DATE: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      BC_No: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      BC_Prefix: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Seva_Inv_Book_Code: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Geo_Location: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },
      Created_At: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      Created_by: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "Godown_Mst",
      schema: "dbo",
      timestamps: false,
      indexes: [
        {
          name: "PK__Godown_M__C5B6F0D257AF9124",
          unique: true,
          fields: [{ name: "UTD" }],
        },
      ],
    }
  );
};

const Joi = require("joi");

const GodownMstSchema = Joi.object({
  Comp_Code: Joi.number().integer().allow(null).allow(''),
  Godw_Code: Joi.number().integer().allow(null).allow(''),
  Godw_Name: Joi.string().max(75).allow(null).allow(''),
  Godw_Add1: Joi.string().max(100).allow(null).allow(''),
  Godw_Add2: Joi.string().max(100).allow(null).allow(''),
  Godw_Add3: Joi.string().max(100).allow(null).allow(''),
  Spl_Rem: Joi.string().max(100).allow(null).allow(''),
  Pin_Code: Joi.string().max(50).allow(null).allow(''),
  Mob_No: Joi.string().max(50).allow(null).allow(''),
  State: Joi.string().max(50).allow(null).allow(''),
  City: Joi.string().max(50).allow(null).allow(''),
  Reg_Date: Joi.date().raw().allow(null).allow(''),
  ECC_No: Joi.string().max(40).allow(null).allow(''),
  IEC_No: Joi.string().max(40).allow(null).allow(''),
  Goods_Name: Joi.string().max(40).allow(null).allow(''),
  Chap_Head: Joi.string().max(40).allow(null).allow(''),
  Excise_Book: Joi.string().max(40).allow(null).allow(''),
  Range_Code: Joi.number().integer().allow(null).allow(''),
  Range_Name: Joi.string().max(40).allow(null).allow(''),
  Range_Add1: Joi.string().max(100).allow(null).allow(''),
  Range_Add2: Joi.string().max(100).allow(null).allow(''),
  Range_Add3: Joi.string().max(100).allow(null).allow(''),
  Div_Code: Joi.string().max(40).allow(null).allow(''),
  Div_Name: Joi.string().max(40).allow(null).allow(''),
  Div_Add1: Joi.string().max(100).allow(null).allow(''),
  Div_Add2: Joi.string().max(100).allow(null).allow(''),
  Div_Add3: Joi.string().max(100).allow(null).allow(''),
  Com_Code: Joi.string().max(40).allow(null).allow(''),
  Com_Name: Joi.string().max(75).allow(null).allow(''),
  Com_Add1: Joi.string().max(100).allow(null).allow(''),
  Com_Add2: Joi.string().max(100).allow(null).allow(''),
  Com_Add3: Joi.string().max(100).allow(null).allow(''),
  Exp_Date: Joi.date().raw().allow(null).allow(''),
  ServerId: Joi.number().integer().allow(null).allow(''),
  Export_Type: Joi.number().integer().allow(null).allow(''),
  Godw_Catg: Joi.number().integer().allow(null).allow(''),
  State_Code: Joi.number().integer().allow(null).allow(''),
  GST_No: Joi.string().max(30).allow(null).allow(''),
  PAN_No: Joi.string().max(30).allow(null).allow(''),
  GSTTYPE: Joi.number().integer().allow(null).allow(''),
  PARTYTYPE: Joi.number().integer().allow(null).allow(''),
  IsEComerce: Joi.number().integer().allow(null).allow(''),
  Br_Region: Joi.number().integer().allow(null).allow(''),
  Br_Segment: Joi.number().integer().allow(null).allow(''),
  Br_Location: Joi.number().integer().allow(null).allow(''),
  BR_DMDT: Joi.string().max(20).allow(null).allow(''),
  BR_DMS: Joi.string().max(20).allow(null).allow(''),
  BR_MI: Joi.string().max(20).allow(null).allow(''),
  BR_EXTRANET: Joi.string().max(20).allow(null).allow(''),
  DMS_HSN_Code: Joi.string().max(30).allow(null).allow(''),
  DMS_TV_Code: Joi.string().max(30).allow(null).allow(''),
  DMS_Purc_Code: Joi.string().max(100).allow(null).allow(''),
  DMS_BT_Code: Joi.string().max(100).allow(null).allow(''),
  DMS_PART_TRFOUT: Joi.string().max(100).allow(null).allow(''),
  DMS_PART_TRFIN: Joi.string().max(100).allow(null).allow(''),
  BR_RECEIPT: Joi.string().max(100).allow(null).allow(''),
  NEWCAR_RCPT: Joi.string().max(100).allow(null).allow(''),
  Cash_Rcpt: Joi.number().integer().allow(null).allow(''),
  Bank_Rcpt: Joi.number().integer().allow(null).allow(''),
  CC_Rcpt: Joi.number().integer().allow(null).allow(''),
  EW_ACNT: Joi.number().integer().allow(null).allow(''),
  INSU_ACNT: Joi.number().integer().allow(null).allow(''),
  Fastag_Acnt: Joi.number().integer().allow(null).allow(''),
  PTrfIn_Book: Joi.number().integer().allow(null).allow(''),
  PTrfOut_Book: Joi.number().integer().allow(null).allow(''),
  PTrfIn_Ledg: Joi.number().integer().allow(null).allow(''),
  PTrfOut_ledg: Joi.number().integer().allow(null).allow(''),
  NexaCard_Book: Joi.number().integer().allow(null).allow(''),
  AutoCard_Book: Joi.number().integer().allow(null).allow(''),
  NexaCard_Sale: Joi.number().integer().allow(null).allow(''),
  AutoCard_Sale: Joi.number().integer().allow(null).allow(''),
  EW_Payable: Joi.number().integer().allow(null).allow(''),
  Insu_Payable: Joi.number().integer().allow(null).allow(''),
  Fastag_Payable: Joi.number().integer().allow(null).allow(''),
  Nexacard_Payable: Joi.number().integer().allow(null).allow(''),
  Autocard_Payable: Joi.number().integer().allow(null).allow(''),
  MCP_COLLECTION: Joi.number().integer().allow(null).allow(''),
  MCP_SALE: Joi.number().integer().allow(null).allow(''),
  MCP_BOOK: Joi.number().integer().allow(null).allow(''),
  FSC_Income: Joi.number().integer().allow(null).allow(''),
  FSC_Expense: Joi.number().integer().allow(null).allow(''),
  Bk_FSC_Income: Joi.number().integer().allow(null).allow(''),
  Bk_FSC_Expense: Joi.number().integer().allow(null).allow(''),
  CSI_Yes: Joi.number().integer().allow(null).allow(''),
  Insu_Chrgs: Joi.number().integer().allow(null).allow(''),
  Oth_Chrgs: Joi.number().integer().allow(null).allow(''),
  Parking_Chrgs: Joi.number().integer().allow(null).allow(''),
  RoadTax_Chrgs: Joi.number().integer().allow(null).allow(''),
  SmartCard_Chrgs: Joi.number().integer().allow(null).allow(''),
  Newcar_JV: Joi.number().integer().allow(null).allow(''),
  Lock_Date: Joi.date().raw().allow(null).allow(''),
  Wrty_Book: Joi.number().integer().allow(null).allow(''),
  Wrty_Posting: Joi.number().integer().allow(null).allow(''),
  Wrty_GST: Joi.number().integer().allow(null).allow(''),
  Wrty_Sale: Joi.number().integer().allow(null).allow(''),
  Autodebit_Book: Joi.number().integer().allow(null).allow(''),
  ExtWrnty_Chrgs: Joi.number().integer().allow(null).allow(''),
  TmpRegn_Chrgs: Joi.number().integer().allow(null).allow(''),
  BC_YES: Joi.number().integer().allow(null).allow(''),
  Godw_Seq: Joi.number().integer().allow(null).allow(''),
  TDS_ENABLED: Joi.number().integer().allow(null).allow(''),
  TCS_ENABLED: Joi.number().integer().allow(null).allow(''),
  Exch_Book: Joi.number().integer().allow(null).allow(''),
  Corp_Book: Joi.number().integer().allow(null).allow(''),
  Exch_Dr: Joi.number().integer().allow(null).allow(''),
  Corp_Dr: Joi.number().integer().allow(null).allow(''),
  Exch_Cr: Joi.number().integer().allow(null).allow(''),
  Corp_Cr: Joi.number().integer().allow(null).allow(''),
  IsCostCenter: Joi.number().integer().allow(null).allow(''),
  Default_CC: Joi.number().integer().allow(null).allow(''),
  item_post: Joi.number().integer().allow(null).allow(''),
  ASP_Userid: Joi.string().max(50).allow(null).allow(''),
  ASP_Pwd: Joi.string().max(50).allow(null).allow(''),
  API_Usrname: Joi.string().max(50).allow(null).allow(''),
  API_Pwd: Joi.string().max(50).allow(null).allow(''),
  ASP_GSTIN: Joi.string().max(20).allow(null).allow(''),
  ASP_TockenId: Joi.string().max(50).allow(null).allow(''),
  FSC_TDS: Joi.number().integer().allow(null).allow(''),
  MSR_BOOK: Joi.number().integer().allow(null).allow(''),
  MSR_Sale: Joi.number().integer().allow(null).allow(''),
  Old_DMS_HSN_Code: Joi.string().max(10).allow(null).allow(''),
  Pymt_Link: Joi.string().max(200).allow(null).allow(''),
  PL_Ledg: Joi.number().integer().allow(null).allow(''),
  PL_Book: Joi.number().integer().allow(null).allow(''),
  ACN_Book: Joi.number().integer().allow(null).allow(''),
  TRADE_NAME: Joi.string().max(100).allow(null).allow(''),
  GST_Lock_Date: Joi.date().raw().allow(null).allow(''),
  INPUT_GST_LOCK_DATE: Joi.date().raw().allow(null).allow(''),
  LOB: Joi.number().integer().allow(null).allow(''),
  CCP_Payable: Joi.number().integer().allow(null).allow(''),
  CCP_Book: Joi.number().integer().allow(null).allow(''),
  Insu_Branch: Joi.string().max(50).allow(null).allow(''),
  Bank_Name: Joi.string().max(60).allow(null).allow(''),
  Bank_Ac: Joi.string().max(60).allow(null).allow(''),
  Bank_Branch: Joi.string().max(60).allow(null).allow(''),
  Bank_IFSC: Joi.string().max(25).allow(null).allow(''),
  UPI_ID: Joi.string().max(50).allow(null).allow(''),
  Book_CN_Disc: Joi.number().integer().allow(null).allow(''),
  Book_CN_AUTOCARD: Joi.number().integer().allow(null).allow(''),
  Book_CN_TDS: Joi.number().integer().allow(null).allow(''),
  Book_CN_GSTTDS: Joi.number().integer().allow(null).allow(''),
  Ledg_CN_Disc: Joi.number().integer().allow(null).allow(''),
  Ledg_CN_AUTOCARD: Joi.number().integer().allow(null).allow(''),
  Ledg_CN_TDS: Joi.number().integer().allow(null).allow(''),
  Ledg_CN_GSTTDS: Joi.number().integer().allow(null).allow(''),
  EW_CRN: Joi.number().integer().allow(null).allow(''),
  Ledger_On_LedgerID: Joi.number().integer().allow(null).allow(''),
  SALES_INTEGRATION: Joi.number().integer().allow(null).allow(''),
  Daily_Seq: Joi.number().integer().allow(null).allow(''),
  SALE_INV_PREFIX: Joi.string().max(30).allow(null).allow(''),
  NEWCAR_TCS: Joi.number().integer().allow(null).allow(''),
  CESS_APP: Joi.number().integer().allow(null).allow(''),
  CCP_CRN: Joi.number().integer().allow(null).allow(''),
  TALLY_BRANCH_NAME: Joi.string().max(150).allow(null).allow(''),
  Godw_Abbr: Joi.string().max(10).allow(null).allow(''),
  TC_NUMBER: Joi.string().max(15).allow(null).allow(''),
  BRANCH_LOCK_DATE: Joi.date().raw().allow(null).allow(''),
  BC_No: Joi.number().integer().allow(null).allow(''),
  BC_Prefix: Joi.string().max(50).allow(null).allow(''),
  Seva_Inv_Book_Code: Joi.number().integer().allow(null).allow(''),
  Geo_Location: Joi.string().max(300).allow(null).allow(''),
  Created_by: Joi.string().max(100).allow(null).allow(''),
});

module.exports = { _GodownMst, GodownMstSchema };
