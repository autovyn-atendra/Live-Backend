const Sequelize = require('sequelize');
_ChasAlot = function (sequelize, DataTypes) {
  return sequelize.define('ChasAlot', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    GD_FDI_ID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Booking_ID: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    CHAS_ID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Alottment_Rem: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    EMP_CODE: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    DMS_CODE: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    DE_ALOT_DMS_CODE: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    DeAlot_Res: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Customer_Name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    DeAlot_Date: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    Booking_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Appr_1_Code: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Appr_2_Code: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Appr_3_Code: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Appr_1_Stat: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Appr_2_Stat: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Appr_3_Stat: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Appr_1_Rem: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    Appr_2_Rem: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    Appr_3_Rem: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    Appr_1_Date: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    Appr_2_Date: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    Appr_3_Date: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    Fin_Appr_Stat: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    LOC_CODE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Export_Type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Created_by: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Request_Branch: {
      type: DataTypes.STRING(10),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Chas_Alot',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Chas_Alo__C5B6F0D242CF8278",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};


const Joi = require('joi');

const chasAlotSchema = Joi.object({
  GD_FDI_ID: Joi.number().integer().allow(null), // optional integer
  Booking_ID: Joi.string().max(50).allow(null), // optional string with max length 50
  CHAS_ID: Joi.number().integer().allow(null), // optional integer
  Alottment_Rem: Joi.string().max(500).allow(null), // optional string with max length 500
  Customer_Name: Joi.string().max(100).allow(null), // optional string with max length 500
  EMP_CODE: Joi.string().max(20).allow(null), // optional string with max length 20
  DMS_CODE: Joi.alternatives().try(
    Joi.string().max(20).allow(null),
    Joi.number().allow(null)), // optional string with max length 20
  DE_ALOT_DMS_CODE: Joi.string().max(20).allow(null), // optional string with max length 20
  DeAlot_Res: Joi.string().max(500).allow(null).allow(''), // optional string with max length 500
  DeAlot_Date: Joi.date().allow(null), // optional date for SMALLDATETIME
  Booking_Date: Joi.alternatives().try(
    Joi.date().iso(),               // Valid ISO 8601 date
    Joi.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/) // Matches ISO date string
  ).allow(null), // optional date for SMALLDATETIME
  Appr_1_Code: Joi.string().max(20).allow(null), // optional string with max length 20
  Appr_2_Code: Joi.string().max(20).allow(null), // optional string with max length 20
  Appr_3_Code: Joi.string().max(20).allow(null), // optional string with max length 20
  Appr_1_Stat: Joi.number().integer().allow(null), // optional integer
  Appr_2_Stat: Joi.number().integer().allow(null), // optional integer
  Appr_3_Stat: Joi.number().integer().allow(null), // optional integer
  Appr_1_Rem: Joi.string().max(250).allow(null), // optional string with max length 250
  Appr_2_Rem: Joi.string().max(250).allow(null), // optional string with max length 250
  Appr_3_Rem: Joi.string().max(250).allow(null), // optional string with max length 250
  Appr_1_Date: Joi.date().allow(null), // optional date for SMALLDATETIME
  Appr_2_Date: Joi.date().allow(null), // optional date for SMALLDATETIME
  Appr_3_Date: Joi.date().allow(null), // optional date for SMALLDATETIME
  Fin_Appr_Stat: Joi.number().integer().allow(null), // optional integer
  LOC_CODE: Joi.number().integer().allow(null), // optional integer
  Export_Type: Joi.number().integer().allow(null), // optional integer
  Created_by: Joi.string().max(100).allow(null), // optional string with max length 100
  Request_Branch: Joi.string().max(10).allow(null), // optional string with max length 100
});

module.exports = { _ChasAlot, chasAlotSchema };
