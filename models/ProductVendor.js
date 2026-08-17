const Sequelize = require('sequelize');
const _Product_Vendor = function (sequelize, DataTypes) {
  return sequelize.define('ProductVendor', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Vendor_Name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Vendor_Number: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Contact_Name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Phone_No: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Invoice_No: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    Vendor_Code: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Invoice_Date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Created_By: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Asset_Product: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'Product_Vendor',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Product___C5B6F0D2BD862D25",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};


const Joi = require('joi');

const productVendorSchema = Joi.object({
  UTD: Joi.number().integer().positive(),
  Vendor_Name: Joi.string().max(100).required(),
  Vendor_Number: Joi.string().max(20).allow(null,""),
  Contact_Name: Joi.string().max(100).allow(null,""),
  city: Joi.string().max(100).allow(null,""),
  Invoice_No: Joi.string().max(100).required(null),
  Vendor_Code: Joi.alternatives().try(
    Joi.string().max(20),
    Joi.number().integer().max(99999999999999999999)
  ).optional(),
  Invoice_Date: Joi.date()
  .optional(),
  address: Joi.string().max(200).allow(null,""),
  Email: Joi.string().email().max(100).allow(null,""),
  Phone_No: Joi.string().max(20).allow(null,""),
  Created_By: Joi.string().max(255).allow(null),
  Asset_Product: Joi.string().max(10).allow(null)
});

module.exports = { _Product_Vendor, productVendorSchema };