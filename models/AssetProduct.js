const Sequelize = require('sequelize');
const _Asset_Product = function (sequelize, DataTypes) {
  return sequelize.define('AssetProduct', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Icon: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Category: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    Subcategory: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    Location: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Manufacturer: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Model: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Purchase_Date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Due_Date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Purchase_value: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    residualValue: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Description: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    Serial_No: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Asset_Status: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Asset_Nature: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Notes: {
      type: DataTypes.STRING(400),
      allowNull: true
    },
    Life_Span: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Depreciation_Method: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    totalUnits: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    unitsProduced: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    Qty: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    Created_By: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ITEM_TYPE: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Created_By: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    UOM1: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Duration: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Start_Date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    End_Date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Amc_Value: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Amc_Vendor: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Characteristics: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Min_Qty: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    MRP: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Price: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Unit_Rate: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    AssetCode: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ITEM_SUB_TYPE: {
      type: DataTypes.STRING(20),
      allowNull: true
    },

  }, {
    sequelize,
    tableName: 'Asset_Product',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Asset_Pr__C5B6F0D2A1348F27",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};

const Joi = require('joi');
const assetProductSchema = Joi.object({
  UTD: Joi.number().integer().positive(),
  Name: Joi.string().max(100).required(),
  Icon: Joi.string().max(100).allow(null),
  Category: Joi.string().max(10).required(),
  Subcategory: Joi.string().max(10).required(),
  Location: Joi.alternatives().try(Joi.string().max(100), Joi.number()).required(),
  Manufacturer: Joi.string().max(50).allow(null),
  Model: Joi.string().max(50).allow(null, ""),
  Purchase_Date: Joi.date().allow(null),
  Due_Date: Joi.date().allow(null),
  Purchase_value: Joi.number().precision(4).positive().allow(null),
  residualValue: Joi.number().precision(4).positive().allow(null),
  Description: Joi.string().max(200).allow(null),
  Serial_No: Joi.string().max(30).allow(null),
  Asset_Status: Joi.alternatives().try(Joi.string().max(50), Joi.number()).optional().allow(null),
  Asset_Nature: Joi.string().max(10).allow(null, ''),
  Notes: Joi.string().max(400).allow(null),
  Life_Span: Joi.number().integer().positive().allow(null),
  totalUnits: Joi.number().integer().positive().allow(null),
  Depreciation_Method: Joi.string().max(30).allow(null),
  unitsProduced: Joi.array().items(Joi.number()).allow(null),
  Qty: Joi.alternatives().try(Joi.string().max(100), Joi.number()).required(),
  Created_By: Joi.string().max(255).allow(null),
  ITEM_TYPE: Joi.alternatives().try(Joi.string().max(10), Joi.number()).optional().allow(null),
  UOM1: Joi.alternatives().try(Joi.string().max(10), Joi.number()).optional().allow(null, ""),
  Duration: Joi.alternatives().try(Joi.string().max(10), Joi.number()).optional().allow(null, ""),
  Start_Date: Joi.date().allow(null),
  End_Date: Joi.date().allow(null),
  Amc_Value: Joi.alternatives().try(Joi.string().max(20), Joi.number()).optional().allow(null, ""),
  Amc_Vendor: Joi.alternatives().try(Joi.string().max(100), Joi.number()).optional().allow(null, ""),
  Characteristics: Joi.alternatives().try(Joi.string().max(255), Joi.number()).optional().allow(null, ""),
  Min_Qty: Joi.alternatives().try(Joi.string().max(10), Joi.number()).optional().allow(null, ""),
  MRP: Joi.alternatives().try(Joi.string().max(10), Joi.number()).optional().allow(null, ""),
  Price: Joi.alternatives().try(Joi.string().max(10), Joi.number()).optional().allow(null, ""),
  Unit_Rate: Joi.alternatives().try(Joi.string().max(10), Joi.number()).optional().allow(null, ""),
  AssetCode: Joi.alternatives().try(Joi.string().max(50), Joi.number()).optional().allow(null, ""),
  ITEM_SUB_TYPE: Joi.alternatives().try(Joi.string().max(20), Joi.number()).optional().allow(null, ""),


});

module.exports = { _Asset_Product, assetProductSchema };

