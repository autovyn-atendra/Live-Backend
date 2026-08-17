const Sequelize = require('sequelize');
const _Purchase_Req_Product_Details = function (sequelize, DataTypes) {
  return sequelize.define('PurchaseReqProductDetails', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Purchase_Id: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Item: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Item_Description: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Asset_Category: {
      type: DataTypes.STRING(20),
      allowNull: true
    },

    Quantity: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    IsIssued: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    Issue_Quantity: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Unit_Price: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Location: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Discount: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Total_Price: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true
    },
    Created_By: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'Purchase_Req_Product_Details',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Purchase__C5B6F0D2F02C5058",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};


const Joi = require('joi');

const purchaseReqProductDetailsSchema = Joi.object({
  UTD: Joi.number()
    .integer()
    .positive()
    .optional(), // UTD is auto-incremented, so it should not be required for validation
  Purchase_Id: Joi.string()
    .max(20)
    .optional(), // Purchase_Id is allowed to be null, so it's optional
  Item: Joi.alternatives().try(
    Joi.string().max(50).required(),
    Joi.number().optional().allow(null, '')
  ), // Item is not nullable, so it's required
  Item_Description: Joi.string()
    .max(100)
    .required(), // Item_Description is not nullable, so it's required
  Asset_Category: Joi.string()
    .max(20)
    .optional(), // Tax is not nullable, so it's required
  Quantity: Joi.string()
    .max(20)
    .optional().allow(null), // Quantity is not nullable, so it's 
  Location: Joi.alternatives().try(
    Joi.string().max(20).required(),
    Joi.number().optional().allow(null, '')
  ),
  IsIssued: Joi.string().max(10).optional(),
  Issue_Quantity: Joi.alternatives().try(
    Joi.string().max(20).required(),
    Joi.number().optional().allow(null, '')
  ), // Item is not nullable, so it's required
  Unit_Price: Joi.string()
    .max(20)
    .optional().allow(null, ''), // Unit_Price is allowed to be null, so it's optional
  Discount: Joi.string()
    .max(20)
    .optional().allow(null, ''), // Discount is allowed to be null, so it's optional
  Total_Price: Joi.number().optional().allow(null, ''),
  Created_By: Joi.string()
    .max(255)
    .optional(), // Created_By is allowed to be null, so it's optional
});


module.exports = { _Purchase_Req_Product_Details, purchaseReqProductDetailsSchema }