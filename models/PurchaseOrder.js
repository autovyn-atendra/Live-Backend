const Sequelize = require("sequelize");
const _Purchase_Order = function (sequelize, DataTypes) {
  return sequelize.define(
    "PurchaseOrder",
    {
      UTD: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      Req_Date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      Asset_Category: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      Contact_Number: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      Email: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Address: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      Vendor: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      City: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      State: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      Location: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      srm: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      Created_By: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      Document: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      Fin_Appr: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      department: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      Vendor_Email: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      AutoMailerStatus: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      PdfPath: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      Vendor_Address: {
        type: DataTypes.STRING(700),
        allowNull: true,
      },
      Vendor_Contact_Name: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      Vendor_Phone_No: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "Purchase_Order",
      schema: "dbo",
      timestamps: false,
      indexes: [
        {
          name: "PK__purchase__C5B6F0D2AB5F9DEC",
          unique: true,
          fields: [{ name: "UTD" }],
        },
      ],
    }
  );
};
const Joi = require("joi");

const purchaseOrderSchema = Joi.object({
  UTD: Joi.number().integer().positive().optional(), // UTD is auto-incremented, so it should not be required for validation
  Req_Date: Joi.date().optional(), // Req_Date is allowed to be null, so it's optional
  Asset_Category: Joi.alternatives()
    .try(Joi.string().max(20), Joi.number())
    .required(), // Asset_Category is not nullable, so it's required
  Contact_Number: Joi.string().max(20).required(), // Contact_Number is not nullable, so it's required
  Email: Joi.string().email().max(100).optional().allow(null), // Email is not nullable, so it's required and must be a valid email
  Address: Joi.string().max(200).optional(), // Address is allowed to be null, so it's optional
  Vendor: Joi.alternatives().try(Joi.string().max(20), Joi.number()).optional(),
  City: Joi.string().max(20).optional(), // City is allowed to be null, so it's optional
  srm: Joi.string().max(20).optional(), // City is allowed to be null, so it's optional
  State: Joi.string().max(20).optional(), // State is allowed to be null, so it's optional
  Location: Joi.alternatives()
    .try(Joi.string().max(10), Joi.number())
    .required(), // State is allowed to be null, so it's optional
  Created_By: Joi.string().max(255).optional(), // Created_By is allowed to be null, so it's optional
  Document: Joi.alternatives()
    .try(Joi.string().max(255), Joi.number()).optional().allow(null, ''), // Created_By is allowed to be null, so it's optional
  Fin_Appr: Joi.alternatives()
    .try(Joi.string().max(10), Joi.number()).optional().allow(null, ''), // Created_By is allowed to be null, so it's optional
    department: Joi.alternatives()
    .try(Joi.string().max(20), Joi.number()).optional().allow(null, ''), 
    Vendor_Email: Joi.alternatives()
    .try(Joi.string().max(100), Joi.number()).optional().allow(null, ''), 
    AutoMailerStatus: Joi.alternatives()
    .try(Joi.string().max(20), Joi.number()).optional().allow(null, ''), 
    PdfPath: Joi.alternatives()
    .try(Joi.string().max(255), Joi.number()).optional().allow(null, ''),
    Vendor_Address: Joi.alternatives()
    .try(Joi.string().max(700), Joi.number()).optional().allow(null, ''),
    Vendor_Contact_Name: Joi.alternatives()
    .try(Joi.string().max(200), Joi.number()).optional().allow(null, ''),
    Vendor_Phone_No: Joi.alternatives()
    .try(Joi.string().max(20), Joi.number()).optional().allow(null, ''),
});

module.exports = { _Purchase_Order, purchaseOrderSchema };
