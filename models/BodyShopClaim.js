const Sequelize = require('sequelize');
const _BodyShopClaim = function (sequelize, DataTypes) {
  return sequelize.define('BodyShopClaim', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    VEHREGNO: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    CHASS_NO: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ENG_NO: {
      type: DataTypes.STRING(75),
      allowNull: true
    },
    MOD_GRP: {
      type: DataTypes.STRING(12),
      allowNull: true
    },
    MOD_NAME: {
      type: DataTypes.STRING(12),
      allowNull: true
    },
    CUST_NAME: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    MOBILE: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    EMAIL: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    MAN_APPR_REM: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    EXP_DELV_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    SERV_ADV: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    MECHANIC: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    CLAIM_NO: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    CLAIM_SAN_AMT: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    SURV_NAME: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    SURV_MOB_NO: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    FILE_SUB_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    RES_DELAY: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    RPT_RECD_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    UTR_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    RPT_DELAY_RES: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    BI_INV: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    BR_INV: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    LOC_CODE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MAN_APPR_STAT: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    INS_COMP: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    INS_REC_AMT: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    CUST_REC_AMT: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    INS_DO_NO: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    UTR_NO: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    VER_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    MAN_APPR_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    isVerified: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ACC_APPR_CODE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    BSM_APPR_CODE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    JOB_STATUS: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    VER_REM: {
      type: DataTypes.STRING(400),
      allowNull: true
    },
    PART_EST: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    LAB_EST: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    TOT_EST: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    ACT_AMT_INC: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    GST_AMT_INC: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    TDS_AMT_INC: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    DISC_AMT_INC: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    PENDING_INSU: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    ACT_AMT_CUST: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    PENDING_CUST: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Created_by: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    CLAIM_TYPE: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    JOB_CARD_NO: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'BodyShopClaim',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__BodyShop__C5B6F0D2A2CABC7D",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};


const Joi = require('joi');

const bodyShopClaimSchema = Joi.object({
  VEHREGNO: Joi.string().max(50).allow(null, ''),
  CHASS_NO: Joi.string().max(50).allow(null, ''),
  ENG_NO: Joi.string().max(75).allow(null, ''),
  MOD_GRP: Joi.string().max(12).allow(null, ''),
  MOD_NAME: Joi.string().max(12).allow(null, ''),
  CUST_NAME: Joi.string().max(500).allow(null, ''),
  MOBILE: Joi.string().max(15).allow(null, ''),
  EMAIL: Joi.string().max(250).allow(null, ''),
  MAN_APPR_REM: Joi.string().max(250).allow(null, ''),
  EXP_DELV_DATE: Joi.date().raw().allow(null),
  SERV_ADV: Joi.string().max(200).allow(null, ''),
  MECHANIC: Joi.string().max(200).allow(null, ''),
  CLAIM_NO: Joi.string().max(50).allow(null, ''),
  CLAIM_SAN_AMT: Joi.number().precision(4).allow(null),
  SURV_NAME: Joi.string().max(200).allow(null, ''),
  SURV_MOB_NO: Joi.string().max(15).allow(null, ''),
  FILE_SUB_DATE: Joi.date().raw().allow(null),
  RES_DELAY: Joi.string().max(2000).allow(null, ''),
  RPT_RECD_DATE: Joi.date().raw().allow(null),
  UTR_DATE: Joi.date().raw().allow(null),
  MAN_APPR_DATE: Joi.date().raw().allow(null),
  RPT_DELAY_RES: Joi.string().max(2000).allow(null, ''),
  BI_INV: Joi.string().max(50).allow(null, ''),
  BR_INV: Joi.string().max(50).allow(null, ''),
  LOC_CODE: Joi.number().integer().allow(null),
  MAN_APPR_STAT: Joi.number().integer().allow(null),
  INS_COMP: Joi.number().integer().allow(null),
  INS_REC_AMT: Joi.number().precision(4).allow(null),
  CUST_REC_AMT: Joi.number().precision(4).allow(null),
  INS_DO_NO: Joi.string().max(50).allow(null, ''),
  UTR_NO: Joi.string().allow(null, '').optional(),
  JOB_STATUS: Joi.number().integer().allow(null, ''),
  VER_DATE: Joi.date().raw().allow(null, ''),
  isVerified: Joi.number().integer().allow(null),
  ACC_APPR_CODE: Joi.number().integer().allow(null),
  BSM_APPR_CODE: Joi.number().integer().allow(null),
  VER_REM: Joi.string().max(400).allow(null, ''),
  PART_EST: Joi.number().precision(4).allow(null, ''),
  LAB_EST: Joi.number().precision(4).allow(null, ''),
  TOT_EST: Joi.number().precision(4).allow(null, ''),
  ACT_AMT_INC: Joi.number().precision(4).allow(null),
  GST_AMT_INC: Joi.number().precision(4).allow(null),
  TDS_AMT_INC: Joi.number().precision(4).allow(null),
  DISC_AMT_INC: Joi.number().precision(4).allow(null),
  PENDING_INSU: Joi.number().precision(4).allow(null),
  ACT_AMT_CUST: Joi.number().precision(4).allow(null),
  PENDING_CUST: Joi.number().precision(4).allow(null),
  Created_by: Joi.string().max(100).allow(null, ''),
  JOB_CARD_NO: Joi.string().max(50).allow(null, ''),
  CLAIM_TYPE: Joi.string().max(10).allow(null, '')
});

module.exports = { _BodyShopClaim, bodyShopClaimSchema };
