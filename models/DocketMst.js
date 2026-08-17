const Sequelize = require('sequelize');
const _DocketMst = function(sequelize, DataTypes) {
  return sequelize.define('DocketMst', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    BOOKING_ID: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    BOOKING_DATE: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    MODEL_VAR: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    MODEL_COL: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    CUST_NAME: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    MOD_NAME: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    CUST_MOB: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    ALOT_CHAS: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    ENG_NO: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    ALOT_MOD_VAR: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ALOT_COLOR: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    SALE_INV: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    SALE_INV_AMT: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    MSR_NO: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    MSR_AMT: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    EW_NO: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    EW_AMT: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    CCP_NO: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    CCP_AMT: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    FASTAG_NO: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    FASTAG_AMT: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    INS_COMP: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    INC_POLICY_NO: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    INC_POLICY_AMT: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    INC_POLICY_DATE: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    EXP_DEL_DATE: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    MGA_YN: {
      type: DataTypes.STRING(3),
      allowNull: true
    },
    MGA_PROM_AMT: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    MGA_TOTAL_AMT: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    FIN_NAME: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    FIN_TYPE: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    FIN_AMT: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    EXP_DOWN_PYMT: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    GP_SEQ: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    OLD_CAR_CUST: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    OLD_CAR_REG_NO: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    EXCH_YN: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    OLD_CAR_PUR_COST: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    EXCH_BONUS: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    EXP_FIN_AMT: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    LOC_CODE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DSE_FLAG: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    EDP_FLAG: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    TV_FLAG: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    INSU_FLAG: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MGA_FLAG: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    FIN_FLAG: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ACNT_FLAG: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    QM_FLAG: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Created_by: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    DSE_REM: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    DocketVerified: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    VER_CODE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    VER_REM: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    VER_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    DSE_CODE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    EDP_CODE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    TV_CODE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    INSU_CODE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    EXP_FIN_NAME: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MGA_CODE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    FIN_CODE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ACNT_CODE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
   
    QM_CODE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    RtoNocCheck: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    BankNocCheck: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CustIdCheck: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    OldCarInsuCheck: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    OldCarRcCheck: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Insurance_Mobile: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Insurance_Document: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    MGA_Document: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Financiar_Document: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    EmpCode: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Deal_Document: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    CUST_ID: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    EMP_NAME: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    EMP_CODE: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    BRANCH: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    RTO_FLAG: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    RTO_CODE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    RTO_DATE: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    RTO_AMOUNT: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    QCM_DATE: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    RTO_Document: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    DSE_DATE: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    MGA_12: {
      type: DataTypes.STRING(3),
      allowNull: true
    },
    LOAN_TYPE: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    MSSF: {
      type: DataTypes.STRING(3),
      allowNull: true
    },
    MSSF_ID: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
     MGA_INVOICE_NO: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    MGA_Invoice_Document: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'DocketMst',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__DocketMs__C5B6F0D29FDD5A45",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};


const Joi = require('joi');

const docketMstSchema = Joi.object({
  BOOKING_ID: Joi.string().max(20).required(),
  BOOKING_DATE: Joi.date().raw().optional().allow(null),
  MODEL_VAR: Joi.string().max(255).optional().allow(null).allow(""),
  MODEL_COL: Joi.string().max(255).optional().allow(null).allow(""),
  CUST_NAME: Joi.string().max(255).optional().allow(null).allow(""),
  MOD_NAME: Joi.string().max(255).optional().allow(null).allow(""),
  CUST_MOB: Joi.string().max(15).optional().allow(null).allow(""),
  EXCH_YN: Joi.string().max(10).optional().allow(null).allow(""),
  ALOT_CHAS: Joi.string().max(20).optional().allow(null).allow(""),
  ENG_NO: Joi.string().max(20).optional().allow(null).allow(""),
  ALOT_MOD_VAR: Joi.string().max(255).optional().allow(null).allow(""),
  ALOT_COLOR: Joi.string().max(255).optional().allow(null).allow(""),
  SALE_INV: Joi.string().max(20).optional().allow(null).allow(""),
  SALE_INV_AMT: Joi.number().precision(4).optional().allow(null),
  MSR_NO: Joi.string().max(20).optional().allow(null).allow(""),
  MSR_AMT: Joi.number().precision(4).optional().allow(null),
  EW_NO: Joi.string().max(20).optional().allow(null).allow(""),
  EW_AMT: Joi.number().precision(4).optional().allow(null),
  CCP_NO: Joi.string().max(20).optional().allow(null).allow(""),
  CCP_AMT: Joi.number().precision(4).optional().allow(null),
  FASTAG_NO: Joi.string().max(20).optional().allow(null).allow(""),
  FASTAG_AMT: Joi.number().precision(4).optional().allow(null),
  INS_COMP: Joi.number().integer().optional().allow(null),
  EXP_FIN_NAME: Joi.number().integer().optional().allow(null),
  INC_POLICY_NO: Joi.string().max(20).optional().allow(null).allow(""),
  INC_POLICY_AMT: Joi.number().precision(4).optional().allow(null),
  INC_POLICY_DATE: Joi.date().raw().optional().allow(null),
  EXP_DEL_DATE: Joi.date().raw().optional().allow(null),
  MGA_YN: Joi.string().max(3).optional().allow(null).allow(""),
  MGA_PROM_AMT: Joi.number().precision(4).optional().allow(null),
  MGA_TOTAL_AMT: Joi.number().precision(4).optional().allow(null),
  FIN_NAME: Joi.string().max(20).optional().allow(null).allow(""),
  FIN_TYPE: Joi.string().max(50).optional().allow(null).allow(""),
  FIN_AMT: Joi.number().precision(4).optional().allow(null),
  EXP_DOWN_PYMT: Joi.number().precision(4).optional().allow(null),
  GP_SEQ: Joi.string().max(20).optional().allow(null).allow(""),
  OLD_CAR_CUST: Joi.string().max(255).optional().allow(null,""),
  OLD_CAR_REG_NO: Joi.string().max(20).optional().allow(null).allow(""),
  OLD_CAR_PUR_COST: Joi.number().precision(4).optional().allow(null),
  EXCH_BONUS: Joi.number().precision(4).optional().allow(null),
  EXP_FIN_AMT: Joi.number().precision(4).optional().allow(null),
  LOC_CODE: Joi.number().integer().optional().allow(null),
  DSE_FLAG: Joi.number().integer().optional().allow(null),
  EDP_FLAG: Joi.number().integer().optional().allow(null),
  TV_FLAG: Joi.number().integer().optional().allow(null),
  INSU_FLAG: Joi.number().integer().optional().allow(null),
  MGA_FLAG: Joi.number().integer().optional().allow(null),
  FIN_FLAG: Joi.number().integer().optional().allow(null),
  ACNT_FLAG: Joi.number().integer().optional().allow(null),
  QM_FLAG: Joi.number().integer().optional().allow(null),
  DocketVerified: Joi.number().integer().optional().allow(null),
  VER_CODE: Joi.number().integer().optional().allow(null),
  Created_by: Joi.string().max(100).optional().allow(null),
  VER_REM: Joi.string().max(100).optional().allow(null),
  DSE_REM: Joi.string().max(1000).optional().allow(null),
  VER_DATE: Joi.date().raw().allow(null, ''),
  DSE_CODE: Joi.number().integer().optional().allow(null),
  EDP_CODE: Joi.number().integer().optional().allow(null),
  TV_CODE: Joi.number().integer().optional().allow(null),
  INSU_CODE: Joi.number().integer().optional().allow(null),
  MGA_CODE: Joi.number().integer().optional().allow(null),
  FIN_CODE: Joi.number().integer().optional().allow(null),
  ACNT_CODE: Joi.number().integer().optional().allow(null),
  QM_CODE: Joi.number().integer().optional().allow(null),
  RtoNocCheck: Joi.number().integer().optional().allow(null),
  BankNocCheck: Joi.number().integer().optional().allow(null),
  CustIdCheck: Joi.number().integer().optional().allow(null),
  OldCarInsuCheck: Joi.number().integer().optional().allow(null),
  OldCarRcCheck: Joi.number().integer().optional().allow(null),
  Insurance_Mobile: Joi.number().integer().optional().allow(null),
  Insurance_Document: Joi.number().integer().optional().allow(null),
  MGA_Document: Joi.number().integer().optional().allow(null),
  Financiar_Document: Joi.number().integer().optional().allow(null),
  EmpCode: Joi.number().integer().optional().allow(null),
  Deal_Document: Joi.number().integer().optional().allow(null),
  CUST_ID: Joi.number().integer().optional().allow(null),
  EMP_NAME: Joi.number().integer().optional().allow(null),
  EMP_CODE: Joi.number().integer().optional().allow(null),
  BRANCH: Joi.number().integer().optional().allow(null),
  RTO_FLAG: Joi.number().integer().optional().allow(null),
  RTO_CODE: Joi.number().integer().optional().allow(null),
  RTO_DATE: Joi.date().raw().optional().allow(null),
  RTO_AMOUNT: Joi.number().integer().optional().allow(null),
  QCM_DATE: Joi.date().raw().optional().allow(null),
  RTO_Document: Joi.number().integer().optional().allow(null),
  DSE_DATE: Joi.date().raw().optional().allow(null),
  MGA_12: Joi.string().max(3).optional().allow(null).allow(""),
  LOAN_TYPE: Joi.string().max(50).optional().allow(null).allow(""),
  MSSF: Joi.string().max(3).optional().allow(null).allow(""),
  MSSF_ID: Joi.string().max(100).optional().allow(null).allow(""),
    MGA_INVOICE_NO: Joi.string().max(50).optional().allow(null).allow(""),
  MGA_Invoice_Document: Joi.string().max(100).optional().allow(null).allow(""),
});

module.exports = {_DocketMst, docketMstSchema};
