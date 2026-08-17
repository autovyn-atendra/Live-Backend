const Sequelize = require('sequelize');
const _FuelSlip = function(sequelize, DataTypes) {
  return sequelize.define('FuelSlip', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    TRAN_ID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    TRAN_TYPE: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    DMS_INV: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    GATEPASS_NO: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    GATEPASS_DATE: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    CUSTOMER_NAME: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    BRANCH: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    DSE_NAME: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    MODEL_NAME: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    DELIVERY_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    TYPE_OF_FUEL: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    QUANTITY: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    SLIP_GIVEN_TO: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    FUEL_SLIP_FLAG: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    LOC_CODE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    EXPORT_TYPE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    SERVER_ID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    REMARK: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    PRINTED_BY: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    VEH_REGNO: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    DEMO_CAR_ID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CHAS_NO: {
      type: DataTypes.STRING(50),
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
    VEH_COLOUR: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    KM_DRIVEN: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    REG_BRANCH: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    AVERAGE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    LOC_FROM: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    LOC_TO: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    DISTANCE_BET: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DRIVER_NAME: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    ENQUIRY_NO: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    LAST_KM_DRIVEN: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    REG_LOC_CODE: {
      type: DataTypes.STRING(100),
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
    IMAGE_PATH: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    FUEL_VENDOR: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CURR_ODO_KM: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    PP_LAST_KM: { type: DataTypes.INTEGER, allowNull: true },
    EXP_FUEL_QTY: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    LastFilledQty: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    ACTUAL_AVG: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    VARIANCE_PCT: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    THRESHOLD_APPLIED: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    EMPCODE: { type: DataTypes.STRING(100), allowNull: true },

    APPR_1_CODE: { type: DataTypes.STRING(100), allowNull: true },
    APPR_1_STAT: { type: DataTypes.INTEGER, allowNull: true },
    APPR_1_DATE: { type: DataTypes.DATE, allowNull: true },
    APPR_1_REMARK: { type: DataTypes.STRING(250), allowNull: true },

    APPR_2_CODE: { type: DataTypes.STRING(100), allowNull: true },
    APPR_2_STAT: { type: DataTypes.INTEGER, allowNull: true },
    APPR_2_DATE: { type: DataTypes.DATE, allowNull: true },
    APPR_2_REMARK: { type: DataTypes.STRING(250), allowNull: true },

    APPR_3_CODE: { type: DataTypes.STRING(100), allowNull: true },
    APPR_3_STAT: { type: DataTypes.INTEGER, allowNull: true },
    APPR_3_DATE: { type: DataTypes.DATE, allowNull: true },
    APPR_3_REMARK: { type: DataTypes.STRING(250), allowNull: true },

    APPR_REQUIRED: { type: DataTypes.INTEGER, allowNull: true },
    FIN_APPR: { type: DataTypes.INTEGER, allowNull: true },
  }, {
    sequelize,
    tableName: 'FuelSlip',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__FuelSlip__C5B6F0D281E5CE18",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};

const Joi = require('joi');

const fuelSlipSchema = Joi.object({
  TRAN_ID: Joi.number().integer().allow(null),
  TRAN_TYPE: Joi.string().max(50).allow(null),
  DMS_INV: Joi.string().max(50).allow(null),
  GATEPASS_NO: Joi.string().max(50).allow(null).allow(""),
  GATEPASS_DATE: Joi.string().max(50).allow(null).allow(""),
  CUSTOMER_NAME: Joi.string().max(200).allow(null).allow(""),
  BRANCH: Joi.string().max(200).allow(null),
   DSE_NAME: Joi.string().max(50).allow(null).allow(""),
  MODEL_NAME: Joi.string().max(50).allow(null),
  DELIVERY_DATE: Joi.date().iso().allow(null),
  TYPE_OF_FUEL: Joi.string().max(50).allow(null).allow(''),
  QUANTITY: Joi.number().integer().allow(null),
  SLIP_GIVEN_TO: Joi.string().max(100).allow(null).allow(''),
  FUEL_SLIP_FLAG: Joi.number().integer().allow(null),
  LOC_CODE: Joi.string().allow(null),
  EXPORT_TYPE: Joi.number().allow(null),
  SERVER_ID: Joi.number().allow(null),
  REMARK: Joi.string().max(250).allow(null).allow(""),
  PRINTED_BY: Joi.string().max(100).allow(null),
  VEH_REGNO: Joi.string().max(30).allow(null).allow(""),
  DEMO_CAR_ID: Joi.number().integer().allow(null),
  CHAS_NO: Joi.string().max(50).allow(null),
  ENGINE_NO: Joi.string().max(50).allow(null),
  MODEL_GROUP: Joi.number().integer().allow(null),
  VEH_COLOUR: Joi.string().max(10).allow(null).allow(""),
  KM_DRIVEN: Joi.number().integer().allow(null),
  REG_BRANCH: Joi.string().max(100).allow(null).allow(""),
  AVERAGE: Joi.number().integer().allow(null),
  LOC_FROM: Joi.string().max(200).allow(null).allow(""),
  LOC_TO: Joi.string().max(200).allow(null).allow(""),
  DISTANCE_BET: Joi.number().integer().allow(null).allow(""),
  DRIVER_NAME: Joi.string().max(100).allow(null).allow(""),
  ENQUIRY_NO: Joi.number().integer().allow(null).allow(""),
  LAST_KM_DRIVEN: Joi.string().allow(null).allow(""),
  REG_LOC_CODE: Joi.string().max(100).allow(null).allow(""),
  Created_by: Joi.string().max(100).allow(null),
  IMAGE_PATH: Joi.string().max(1000).allow(null),
  FUEL_VENDOR: Joi.number().integer().allow(null),
  CURR_ODO_KM: Joi.number().integer().allow(null),
   PP_LAST_KM: Joi.number().integer().allow(null),
  EXP_FUEL_QTY: Joi.number().allow(null),
  LastFilledQty: Joi.number().allow(null),
  ACTUAL_AVG: Joi.number().allow(null),
  VARIANCE_PCT: Joi.number().allow(null),
  THRESHOLD_APPLIED: Joi.number().allow(null),
  EMPCODE: Joi.string().max(50).allow(null).allow(""),

  APPR_1_CODE: Joi.string().max(50).allow(null).allow(""),
  APPR_1_STAT: Joi.number().integer().allow(null),
  APPR_1_DATE: Joi.date().allow(null),
  APPR_1_REMARK: Joi.string().max(250).allow(null).allow(""),

  APPR_2_CODE: Joi.string().max(50).allow(null).allow(""),
  APPR_2_STAT: Joi.number().integer().allow(null),
  APPR_2_DATE: Joi.date().allow(null),
  APPR_2_REMARK: Joi.string().max(250).allow(null).allow(""),

  APPR_3_CODE: Joi.string().max(50).allow(null).allow(""),
  APPR_3_STAT: Joi.number().integer().allow(null),
  APPR_3_DATE: Joi.date().allow(null),
  APPR_3_REMARK: Joi.string().max(250).allow(null).allow(""),

  APPR_REQUIRED: Joi.number().integer().allow(null),
  FIN_APPR: Joi.number().integer().allow(null),
});

module.exports = {_FuelSlip, fuelSlipSchema};
