const Sequelize = require('sequelize');
const _ServOffCust = function (sequelize, DataTypes) {
  return sequelize.define('ServOffCust', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    CUSTOMER_NAME: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    MOBILE: {
      type: DataTypes.STRING(14),
      allowNull: true
    },
    EMAIL: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    VEH_REG_NO: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    MODEL: {
      type: DataTypes.STRING(400),
      allowNull: true
    },
    CUST_ID: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Loc_Code: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    BATCH_ID: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    BATCH_NAME: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    isApplied: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    isAppliedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isAvailed: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    ImportMonth: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    OFF_ID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isAvailedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Created_by: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    QR_PATH: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    AVAIL_EMP: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    FIN_INV_AMT: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    VIN_NO: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    INV_ON: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ServOffCust',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__ServOffC__C5B6F0D28E78466A",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};


const Joi = require('joi');

const ServOffCustSchema = Joi.object({
  CUSTOMER_NAME: Joi.string().max(500).allow(null),
  MOBILE: Joi.string().max(14).allow(null),
  EMAIL: Joi.string().email().max(200).allow(null),
  VEH_REG_NO: Joi.string().max(20).allow(null),
  MODEL: Joi.string().max(400).allow(null),
  CUST_ID: Joi.string().max(50).allow(null),
  Loc_Code: Joi.number().integer().allow(null),
  BATCH_ID: Joi.number().integer().allow(null),
  OFF_ID: Joi.number().integer().allow(null),
  BATCH_NAME: Joi.string().max(100).allow(null),
  isApplied: Joi.number().integer().allow(null),
  isAppliedDate: Joi.date().raw().allow(null),
  isAvailed: Joi.number().integer().allow(null),
  ImportMonth: Joi.number().integer().allow(null),
  FIN_INV_AMT: Joi.number().allow(null),
  isAvailedDate: Joi.date().raw().allow(null),
  Created_by: Joi.string().max(100).allow(null),
  QR_PATH: Joi.string().max(500).allow(null),
  AVAIL_EMP: Joi.string().max(100).allow(null),
  VIN_NO: Joi.string().max(100).allow(null),
  INV_ON: Joi.string().max(20).allow(null),
});

module.exports = { _ServOffCust, ServOffCustSchema };
