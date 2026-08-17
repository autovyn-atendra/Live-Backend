const Sequelize = require('sequelize');
const _Purchase_Request = function (sequelize, DataTypes) {
  return sequelize.define('PurchaseRequest', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Req_Date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Asset_Category: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Contact_Number: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Address: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    City: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    State: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Location: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    srm: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Created_By: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    LocationTo: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Tran_Date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    sequelize,
    tableName: 'purchase_request',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__purchase__C5B6F0D2AB5F9DEC",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};
const Joi = require('joi');

const purchaseRequestSchema = Joi.object({
  UTD: Joi.number()
    .integer()
    .positive()
    .optional(), // UTD is auto-incremented, so it should not be required for validation
  Req_Date: Joi.date()
    .optional(), // Req_Date is allowed to be null, so it's optional
  Asset_Category: Joi.alternatives().try(
    Joi.string().max(20),
    Joi.number()
  ).allow(null, ""),// Asset_Category is not nullable, so it's required
  Contact_Number: Joi.string()
    .max(20)
    .allow(null, ""), // Contact_Number is not nullable, so it's required
  Email: Joi.string()
    .email()
    .max(100)
    .optional().allow(null, ""), // Email is not nullable, so it's required and must be a valid email
  Address: Joi.string()
    .max(200)
    .optional().allow(null, ''), // Address is allowed to be null, so it's optional
  City: Joi.string()
    .max(20)
    .optional().allow(null, ""), // City is allowed to be null, so it's optional
  srm: Joi.string()
    .max(20)
    .optional().allow(null, ""), // City is allowed to be null, so it's optional
  State: Joi.string()
    .max(20)
    .optional().allow(null, ""), // State is allowed to be null, so it's optional
  Location: Joi.alternatives().try(
    Joi.string().max(10),
    Joi.number()
  ).required(), // State is allowed to be null, so it's optional
  Created_By: Joi.string()
    .max(255)
    .optional(), // Created_By is allowed to be null, so it's optional
  LocationTo: Joi.alternatives().try(
    Joi.string().max(10),
    Joi.number().allow(null)
  ).required(),
  Tran_Date: Joi.date().optional().allow(null, ''),
});

module.exports = { _Purchase_Request, purchaseRequestSchema }