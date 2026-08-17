const Sequelize = require('sequelize');
const _DemoCarMaster = function(sequelize, DataTypes) {
  return sequelize.define('DemoCarMaster', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    VEH_REGNO: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    CHAS_NO: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    ENGINE_NO: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    MODEL_GROUP: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MODEL_NAME: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    VEH_COLOUR: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    KM_DRIVEN: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    REG_BRANCH: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    EXPORT_TYPE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    LOC_CODE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    SERVER_ID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    FUEL_TYPE: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    AVERAGE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Created_At: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('getdate')
    },
    Created_by: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Image: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    VEH_TYPE: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    RESP_PERSON: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    INSU_POL_NO: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    INSU_POL_DATE: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    INSU_EXPIRY_DATE: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    PUC_ISSUE_DATE: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    DATE_OF_PURCHASE: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    REGISTRATION_NAME: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    HYP_STAT: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    HYPOTHECATION: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    LOAN_SUB_FROM: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    LOAN_SUB_TO: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    RTO_REFUND_AMT: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    RTO_REFUND_DATE: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    CLAIM_SUBMITTED_DATE: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    CLAIM_RECEIVED_DATE: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    CLAIM_AMT: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    AUDIT_DATE: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    AUDIT_REM: {
      type: DataTypes.STRING(400),
      allowNull: true
    },
    REMARK: {
      type: DataTypes.STRING(400),
      allowNull: true
    },
    Department_Type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    EXP_FUEL_QTY: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
},
PP_LAST_KM: {
  type: DataTypes.INTEGER,
  allowNull: true
},

  }, {
    sequelize,
    tableName: 'DemoCarMaster',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__DemoCarM__C5B6F0D2FDAA4ACC",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};


const Joi = require('joi');

const demoCarMasterSchema = Joi.object({
  VEH_REGNO: Joi.string().max(25).allow(null).allow(''),
  CHAS_NO: Joi.string().max(30).allow(null).allow(''),
  ENGINE_NO: Joi.string().max(50).allow(null).allow(''),
  MODEL_GROUP: Joi.number().integer().allow(null).allow(''),
  MODEL_NAME: Joi.number().integer().allow(null).allow(''),
  VEH_COLOUR: Joi.string().max(30).allow(null).allow(''),
  KM_DRIVEN: Joi.number().integer().allow(null).allow(''),
  REG_BRANCH: Joi.number().integer().allow(null).allow(''),
  EXPORT_TYPE: Joi.number().integer().allow(null),
  LOC_CODE: Joi.number().integer().allow(null),
  SERVER_ID: Joi.number().integer().allow(null),
  FUEL_TYPE: Joi.string().max(25).allow(null).allow(''),
  AVERAGE: Joi.number().integer().allow(null).allow(''),
  Created_by: Joi.string().max(100).allow(null),
  Image: Joi.string().max(100).allow(null).allow(''),
  VEH_TYPE: Joi.string().max(200).allow(null).allow(''),
  RESP_PERSON: Joi.string().max(200).allow(null).allow(''),
  INSU_POL_NO: Joi.string().max(200).allow(null).allow(''),
  INSU_POL_DATE: Joi.date().raw().allow(null).allow(''),
  INSU_EXPIRY_DATE: Joi.date().raw().allow(null).allow(''),
  PUC_ISSUE_DATE: Joi.date().raw().allow(null).allow(''),
  DATE_OF_PURCHASE: Joi.date().raw().allow(null).allow(''),
  REGISTRATION_NAME: Joi.string().max(200).allow(null).allow(''),
  HYP_STAT: Joi.string().max(200).allow(null).allow(''),
  HYPOTHECATION: Joi.number().integer().allow(null).allow(''),
  LOAN_SUB_FROM: Joi.date().raw().allow(null).allow(''),
  LOAN_SUB_TO: Joi.date().raw().allow(null).allow(''),
  RTO_REFUND_AMT: Joi.number().precision(2).allow(null).allow(''),
  RTO_REFUND_DATE: Joi.date().raw().allow(null).allow(''),
  CLAIM_SUBMITTED_DATE: Joi.date().raw().allow(null).allow(''),
  CLAIM_RECEIVED_DATE: Joi.date().raw().allow(null).allow(''),
  CLAIM_AMT: Joi.number().precision(2).allow(null).allow(''),
  AUDIT_DATE: Joi.date().raw().allow(null).allow(''),
  AUDIT_REM: Joi.string().max(400).allow(null).allow(''),
  REMARK: Joi.string().max(400).allow(null).allow(''),
  Department_Type: Joi.string().max(50).allow(null).allow(''),
  EXP_FUEL_QTY: Joi.number().positive().required(),
  PP_LAST_KM: Joi.number().integer().allow(null).allow(''),
});

module.exports = {_DemoCarMaster, demoCarMasterSchema};
