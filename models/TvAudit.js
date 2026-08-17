const Sequelize = require('sequelize');
const _TvAudit = function (sequelize, DataTypes) {
  return sequelize.define('TvAudit', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ICM_ID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    TV_PUR_INV: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    PUR_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    PURCHASE_COST: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    MODEL_VARIANT: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    MODEL_VAR: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    REG_YEAR: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    VEHREGNO: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    AGEING: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CHAS_NO: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    ENGINE_NO: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    PUR_EVAL_NAME: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    SELLER_NAME: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    AUDIT_STATUS: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    AUDIT_REMARK: {
      type: DataTypes.STRING(400),
      allowNull: true
    },
    Created_by: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'TV_Audit',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__TV_Audit__C5B6F0D2F358AB28",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};

const Joi = require('joi');

const tvAuditSchema = Joi.object({
  ICM_ID: Joi.number().integer().optional(),
  TV_PUR_INV: Joi.string().max(50).optional(),
  PUR_DATE: Joi.date().raw().allow(null).allow(''),
  PURCHASE_COST: Joi.number().precision(4).optional(),
  MODEL_VARIANT: Joi.string().max(200).optional(),
  MODEL_VAR: Joi.string().max(200).optional(),
  REG_YEAR: Joi.string().max(20).optional(),
  VEHREGNO: Joi.string().max(20).optional(),
  AGEING: Joi.number().integer().optional(),
  CHAS_NO: Joi.string().max(100).optional(),
  ENGINE_NO: Joi.string().max(100).optional(),
  PUR_EVAL_NAME: Joi.string().max(20).optional(),
  SELLER_NAME: Joi.string().max(20).optional(),
  AUDIT_STATUS: Joi.number().integer().optional(),
  AUDIT_REMARK: Joi.string().max(400).optional(),
  Created_by: Joi.string().max(100).optional(),
});

module.exports = { _TvAudit, tvAuditSchema };
