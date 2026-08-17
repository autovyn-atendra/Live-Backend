const Sequelize = require('sequelize');
const _Product_Issue_Dtl = function (sequelize, DataTypes) {
  return sequelize.define('ProductIssueDtl', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Product_Issue: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    Asset_Product: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    Asset_Issue_Qty: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    Revoke: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Created_By: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'Product_Issue_dtl',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Product___C5B6F0D28FFEE240",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};

const Joi = require('joi');

const productIssueDtlSchema = Joi.object({
  UTD: Joi.number().integer().positive(), 
  Product_Issue: Joi.string().max(10).required(),
  Asset_Product: Joi.string().max(20).required(),
  Asset_Issue_Qty: Joi.string().max(20).required(),
  Revoke: Joi.string().max(20).allow(null), 
  Created_By: Joi.string().max(255).allow(null), 
});

module.exports = { _Product_Issue_Dtl, productIssueDtlSchema };

