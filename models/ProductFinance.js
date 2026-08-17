const Sequelize = require('sequelize');
const _Product_Finance = function (sequelize, DataTypes) {
  return sequelize.define('ProductFinance', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Vendor: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Purchase_Price: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Purchase: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Ac_Code: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Market_value: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    In_Service: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Po_No: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Scrap_Value: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Warrent_End: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Created_By: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Created_At: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('getdate')
    },
    Asset_Product: {
      type: DataTypes.STRING(10),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Product_Finance',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Product___C5B6F0D2890662B2",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};
const Joi = require('joi');

const productFinanceSchema = Joi.object({
  UTD: Joi.number().integer().positive(),
  Vendor: Joi.string().max(100).required(),
  Purchase_Price: Joi.number().precision(4).positive().allow(null),
  Purchase: Joi.string().max(10).allow(null),
  Ac_Code: Joi.string().max(20).allow(null),
  Market_value: Joi.number().precision(4).positive().allow(null),
  In_Service: Joi.string().max(10).allow(null),
  Po_No: Joi.string().max(20).allow(null),
  Scrap_Value: Joi.number().precision(4).positive().allow(null),
  Warrent_End: Joi.date().allow(null),
  Created_By: Joi.string().max(255).allow(null),
  Asset_Product: Joi.string().max(10).allow(null)
});

module.exports = { _Product_Finance, productFinanceSchema };
