const Sequelize = require('sequelize');
const _IcmDtl = function (sequelize, DataTypes) {
  return sequelize.define('IcmDtl', {
    TRAN_ID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Tran_Type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MRP_Price: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    drpInsu: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Ins_Pric: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Insu_Id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Insu_Ledg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    drpEW: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    EW_Pric: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    EW_Id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    EW_Ledg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    drpRTO: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    RTO_Pric: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    RTO_Id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    RTO_Ledg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    drpMGA: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MGA_Pric: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    MGA_Id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MGA_Ledg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    drpNexaCard: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Nexa_Card: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Nexa_Id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Nexa_Ledg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CNG_Chrgs: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    CNG_Id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CNG_Ledg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MCP_Chrgs: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    MCP_Id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MCP_Ledg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    HPN_Chrgs: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    HPN_Id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    HPN_Ledg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    HSRP_Chrgs: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    HSRP_Id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    HSRP_Ledg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Oth_Chrgs: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Oth_Id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Oth_Ledg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    FasTag: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Fastag_Id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Fastag_Ledg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    TAG_NO: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Cons_Disc: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Exch_Disc: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Corp_Disc: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Cons_Disc1: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    RIPS1_Disc: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    MI1_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    RIPS2_Disc: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    MI2_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    MDS_Offer: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Buffer_Disc: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Emp_Disc: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    MSIL_Disc: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    EXPORT_TYPE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    TCS_Chrgs: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Adnl_Disc: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    NonMGA_Chrgs: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    STV_DO: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    SFIN_DO: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    RTO_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Regn_No: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    RTO_RefNo: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    NonMGA_Oth: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    RTO_Pric2: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    MI_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    EW_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Meter_Patti: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    EW_PolicyNo: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    EW_PolicyAmt: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    MI_PolicyNo: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    MI_PolicyAmt: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Parking_Tax: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Card_Charges: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Temp_No: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Emp_Disc_DLR: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Emp_Disc_MSIL: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    RIPS3_Disc: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    MSSF: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    RC_Card: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    RC_Card_Id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    RC_Card_Ledg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Choice_No: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Choice_No_Id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Choice_No_Ledg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    PAN_Card: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    PAN_Card_Id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    PAN_Card_Ledg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    EW_CONTRACT_NO: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    RTO_FIN_PYMT_REF: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    DrNote_Amt: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    TCU_Chrgs: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    PPC_Chrgs: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    ISLK: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    RMK: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    VAS_Sale: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    MGA_Labor: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Sankool: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Seva_Oth: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    AdnlDisc_Remark: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    TCS_PERC: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    EACHING_CHRG: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    GUID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Created_by: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ICM_DTL',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__ICM_DTL__15B69B8EBC508FF6",
        unique: true,
        fields: [
          { name: "GUID" },
        ]
      },
    ]
  });
};

const Joi = require('joi');

const icmDtlSchema = Joi.object({
  TRAN_ID: Joi.number().optional().allow(null, ''),
  Tran_Type: Joi.number().optional().allow(null, ''),
  MRP_Price: Joi.number().precision(4).optional().allow(null, ''),
  drpInsu: Joi.number().optional().allow(null, ''),
  Ins_Pric: Joi.number().precision(4).optional().allow(null, ''),
  Insu_Id: Joi.number().optional().allow(null, ''),
  Insu_Ledg: Joi.number().optional().allow(null, ''),
  drpEW: Joi.number().optional().allow(null, ''),
  EW_Pric: Joi.number().precision(4).optional().allow(null, ''),
  EW_Id: Joi.number().optional().allow(null, ''),
  EW_Ledg: Joi.number().optional().allow(null, ''),
  drpRTO: Joi.number().optional().allow(null, ''),
  RTO_Pric: Joi.number().precision(4).optional().allow(null, ''),
  RTO_Id: Joi.number().optional().allow(null, ''),
  RTO_Ledg: Joi.number().optional().allow(null, ''),
  drpMGA: Joi.number().optional().allow(null, ''),
  MGA_Pric: Joi.number().precision(4).optional().allow(null, ''),
  MGA_Id: Joi.number().optional().allow(null, ''),
  MGA_Ledg: Joi.number().optional().allow(null, ''),
  drpNexaCard: Joi.number().optional().allow(null, ''),
  Nexa_Card: Joi.number().precision(4).optional().allow(null, ''),
  Nexa_Id: Joi.number().optional().allow(null, ''),
  Nexa_Ledg: Joi.number().optional().allow(null, ''),
  CNG_Chrgs: Joi.number().precision(4).optional().allow(null, ''),
  CNG_Id: Joi.number().optional().allow(null, ''),
  CNG_Ledg: Joi.number().optional().allow(null, ''),
  MCP_Chrgs: Joi.number().precision(4).optional().allow(null, ''),
  MCP_Id: Joi.number().optional().allow(null, ''),
  MCP_Ledg: Joi.number().optional().allow(null, ''),
  HPN_Chrgs: Joi.number().precision(4).optional().allow(null, ''),
  HPN_Id: Joi.number().optional().allow(null, ''),
  HPN_Ledg: Joi.number().optional().allow(null, ''),
  HSRP_Chrgs: Joi.number().precision(4).optional().allow(null, ''),
  HSRP_Id: Joi.number().optional().allow(null, ''),
  HSRP_Ledg: Joi.number().optional().allow(null, ''),
  Oth_Chrgs: Joi.number().precision(4).optional().allow(null, ''),
  Oth_Id: Joi.number().optional().allow(null, ''),
  Oth_Ledg: Joi.number().optional().allow(null, ''),
  FasTag: Joi.number().precision(4).optional().allow(null, ''),
  Fastag_Id: Joi.number().optional().allow(null, ''),
  Fastag_Ledg: Joi.number().optional().allow(null, ''),
  TAG_NO: Joi.string().max(30).optional().allow(null, ''),
  Cons_Disc: Joi.number().precision(4).optional().allow(null, ''),
  Exch_Disc: Joi.number().precision(4).optional().allow(null, ''),
  Corp_Disc: Joi.number().precision(4).optional().allow(null, ''),
  Cons_Disc1: Joi.number().precision(4).optional().allow(null, ''),
  RIPS1_Disc: Joi.number().precision(4).optional().allow(null, ''),
  MI1_Date: Joi.date().raw().optional().allow(null, ''),
  RIPS2_Disc: Joi.number().precision(4).optional().allow(null, ''),
  MI2_Date: Joi.date().raw().optional().allow(null, ''),
  MDS_Offer: Joi.number().precision(4).optional().allow(null, ''),
  Buffer_Disc: Joi.number().precision(4).optional().allow(null, ''),
  Emp_Disc: Joi.number().precision(4).optional().allow(null, ''),
  MSIL_Disc: Joi.number().precision(4).optional().allow(null, ''),
  EXPORT_TYPE: Joi.number().optional().allow(null, ''),
  TCS_Chrgs: Joi.number().precision(4).optional().allow(null, ''),
  Adnl_Disc: Joi.number().precision(4).optional().allow(null, ''),
  NonMGA_Chrgs: Joi.number().precision(4).optional().allow(null, ''),
  STV_DO: Joi.number().precision(4).optional().allow(null, ''),
  SFIN_DO: Joi.number().precision(4).optional().allow(null, ''),
  RTO_Date: Joi.date().raw().optional().allow(null, ''),
  Regn_No: Joi.string().max(20).optional().allow(null, ''),
  RTO_RefNo: Joi.string().max(20).optional().allow(null, ''),
  NonMGA_Oth: Joi.number().precision(4).optional().allow(null, ''),
  RTO_Pric2: Joi.number().precision(4).optional().allow(null, ''),
  MI_Date: Joi.date().raw().optional().allow(null, ''),
  EW_Date: Joi.date().raw().optional().allow(null, ''),
  Meter_Patti: Joi.number().precision(4).optional().allow(null, ''),
  EW_PolicyNo: Joi.string().max(25).optional().allow(null, ''),
  EW_PolicyAmt: Joi.number().precision(4).optional().allow(null, ''),
  MI_PolicyNo: Joi.string().max(25).optional().allow(null, ''),
  MI_PolicyAmt: Joi.number().precision(4).optional().allow(null, ''),
  Parking_Tax: Joi.number().precision(4).optional().allow(null, ''),
  Card_Charges: Joi.number().precision(4).optional().allow(null, ''),
  Temp_No: Joi.string().max(30).optional().allow(null, ''),
  Emp_Disc_DLR: Joi.number().precision(4).optional().allow(null, ''),
  Emp_Disc_MSIL: Joi.number().precision(4).optional().allow(null, ''),
  RIPS3_Disc: Joi.number().precision(4).optional().allow(null, ''),
  MSSF: Joi.number().precision(4).optional().allow(null, ''),
  RC_Card: Joi.number().precision(4).optional().allow(null, ''),
  RC_Card_Id: Joi.number().optional().allow(null, ''),
  RC_Card_Ledg: Joi.number().optional().allow(null, ''),
  Choice_No: Joi.number().precision(4).optional().allow(null, ''),
  Choice_No_Id: Joi.number().optional().allow(null, ''),
  Choice_No_Ledg: Joi.number().optional().allow(null, ''),
  PAN_Card: Joi.number().precision(4).optional().allow(null, ''),
  PAN_Card_Id: Joi.number().optional().allow(null, ''),
  PAN_Card_Ledg: Joi.number().optional().allow(null, ''),
  EW_CONTRACT_NO: Joi.string().max(30).optional().allow(null, ''),
  RTO_FIN_PYMT_REF: Joi.string().max(30).optional().allow(null, ''),
  DrNote_Amt: Joi.number().precision(4).optional().allow(null, ''),
  TCU_Chrgs: Joi.number().precision(4).optional().allow(null, ''),
  PPC_Chrgs: Joi.number().precision(4).optional().allow(null, ''),
  ISLK: Joi.number().precision(4).optional().allow(null, ''),
  RMK: Joi.number().precision(4).optional().allow(null, ''),
  VAS_Sale: Joi.number().precision(4).optional().allow(null, ''),
  MGA_Labor: Joi.number().precision(4).optional().allow(null, ''),
  Sankool: Joi.number().precision(4).optional().allow(null, ''),
  Seva_Oth: Joi.number().precision(4).optional().allow(null, ''),
  AdnlDisc_Remark: Joi.string().max(50).optional().allow(null, ''),
  TCS_PERC: Joi.number().precision(4).optional().allow(null, ''),
  EACHING_CHRG: Joi.number().precision(4).optional().allow(null, ''),
});


module.exports = { _IcmDtl, icmDtlSchema };
