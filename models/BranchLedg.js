const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BranchLedg', {
    Utd: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Godw_Code: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    GSTTYPE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    PARTYTYPE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    IsEComerce: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Br_Region: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Br_Segment: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Br_Location: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Cash_Rcpt: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Bank_Rcpt: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CC_Rcpt: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    EW_ACNT: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    INSU_ACNT: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Fastag_Acnt: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    PTrfIn_Book: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    PTrfOut_Book: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    PTrfIn_Ledg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    PTrfOut_ledg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    NexaCard_Book: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    AutoCard_Book: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    NexaCard_Sale: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    AutoCard_Sale: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    EW_Payable: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Insu_Payable: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Fastag_Payable: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Nexacard_Payable: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Autocard_Payable: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MCP_COLLECTION: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MCP_SALE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MCP_BOOK: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    FSC_Income: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    FSC_Expense: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Bk_FSC_Income: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Bk_FSC_Expense: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CSI_Yes: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Insu_Chrgs: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Oth_Chrgs: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Parking_Chrgs: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    RoadTax_Chrgs: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    SmartCard_Chrgs: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Newcar_JV: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Wrty_Book: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Wrty_Posting: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Wrty_GST: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Wrty_Sale: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Autodebit_Book: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ExtWrnty_Chrgs: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    TmpRegn_Chrgs: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    BC_YES: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    TDS_ENABLED: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    TCS_ENABLED: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Exch_Book: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Corp_Book: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Exch_Dr: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Corp_Dr: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Exch_Cr: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Corp_Cr: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    IsCostCenter: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Default_CC: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    item_post: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    FSC_TDS: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MSR_BOOK: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MSR_Sale: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    PL_Ledg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    PL_Book: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ACN_Book: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Book_CN_Disc: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Book_CN_AUTOCARD: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Book_CN_TDS: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Book_CN_GSTTDS: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Ledg_CN_Disc: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Ledg_CN_AUTOCARD: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Ledg_CN_TDS: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Ledg_CN_GSTTDS: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    EW_CRN: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Ledger_On_LedgerID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    SALES_INTEGRATION: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Daily_Seq: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    NEWCAR_TCS: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CESS_APP: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CCP_CRN: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    BC_No: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    OFR_BOOK: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    RIPS_LEDG: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CONS_LEDG: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ISLK_LEDG: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    RMK_LEDG: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    EXCH_LEDG: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ADNL_LEDG: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    INV_StNo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Seva_Inv_Book_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CCP_Payable: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CCP_Book: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    LOB: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Created_At: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'Branch_Ledg',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Branch_L__C5B2047ABCB874F1",
        unique: true,
        fields: [
          { name: "Utd" },
        ]
      },
    ]
  });
};
