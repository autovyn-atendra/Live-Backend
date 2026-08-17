const Sequelize = require('sequelize');
const _ChasTran = function(sequelize, DataTypes) {
  return sequelize.define('ChasTran', {
    Tran_Id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    CHAS_ID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    TRAN_TYPE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Tran_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Tran_Amt: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Asset_Ledg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Income_Ledg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Loc_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Export_Type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Item_Type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Item_Seq: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Created_By: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    GUID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'CHAS_TRAN',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "ClusteredIndex-20231230-223115",
        fields: [
          { name: "Tran_Id" },
          { name: "CHAS_ID" },
          { name: "TRAN_TYPE" },
          { name: "Tran_Date" },
          { name: "Tran_Amt" },
          { name: "Asset_Ledg" },
          { name: "Income_Ledg" },
          { name: "Loc_Code" },
          { name: "Export_Type" },
          { name: "Item_Type" },
          { name: "Item_Seq" },
        ]
      },
      {
        name: "PK__CHAS_TRA__15B69B8FF39F62C4",
        unique: true,
        fields: [
          { name: "GUID" },
        ]
      },
    ]
  });
};

const Joi = require('joi');

const chasTranSchema = Joi.object({
  Tran_Id: Joi.number().integer(),
  CHAS_ID: Joi.number().integer().allow(null),
  TRAN_TYPE: Joi.number().integer().allow(null),
  Tran_Date: Joi.date().raw().allow(null),
  Tran_Amt: Joi.number().precision(4).allow(null),
  Asset_Ledg: Joi.number().integer().allow(null),
  Income_Ledg: Joi.number().integer().allow(null),
  Loc_Code: Joi.number().integer().allow(null),
  Export_Type: Joi.number().integer().allow(null),
  Item_Type: Joi.number().integer().allow(null),
  Item_Seq: Joi.number().integer().allow(null),
  Created_By: Joi.string().max(200).allow(null),
  GUID: Joi.number().integer().optional()
});

module.exports = {_ChasTran , chasTranSchema};
