const Sequelize = require("sequelize");
const _Purchase_Order_Product_Details = function (sequelize, DataTypes) {
  return sequelize.define(
    "PurchaseOrderProductDetails",
    {
      UTD: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      Purchase_Id: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      Product_Code: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Item_Description: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Tax: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      Subcategory: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      Quantity: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      Unit_Price: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      Discount: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      Total_Price: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
      },
      Created_By: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      ITEM_TYPE: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      HSN: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      UOM1: {
        type: DataTypes.STRING(10),
        allowNull: true
      },
      PurchaseRequest_UTD: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
    },
    {
      sequelize,
      tableName: "Purchase_Order_Product_Details",
      schema: "dbo",
      timestamps: false,
      indexes: [
        {
          name: "PK__Purchase__C5B6F0D2F02C5058",
          unique: true,
          fields: [{ name: "UTD" }],
        },
      ],
    }
  );
};

const Joi = require("joi");

const purchaseOrderProductDetailsSchema = Joi.object({
  UTD: Joi.number().integer().positive().optional(), // UTD is auto-incremented, so it should not be required for validation
  Purchase_Id: Joi.alternatives().try(
    Joi.string().max(20),
    Joi.number().integer().max(99999999999999999999)
  ).optional(),
  Product_Code: Joi.alternatives().try(
    Joi.string().max(50).required(),
    Joi.number().optional().allow(null)
  ), // Item is not nullable, so it's required
  Item_Description: Joi.string().max(100).optional().allow(null, ''), // Item_Description is not nullable, so it's required
  Tax: Joi.string().max(20).optional(), // Tax is not nullable, so it's required
  HSN: Joi.string().max(20).optional(), // Tax is not nullable, so it's required
  Subcategory: Joi.string().max(20).required(), // Tax is not nullable, so it's required
  Quantity: Joi.alternatives().try(
    Joi.string().max(20),
    Joi.number().integer().max(99999999999999999999)
  ).required(), // Quantity is not nullable, so it's required
  Unit_Price: Joi.alternatives().try(
    Joi.string().max(20),
    Joi.number().integer().max(99999999999999999999)
  ).required(), // Unit_Price is allowed to be null, so it's optional
  Discount: Joi.alternatives().try(
    Joi.string().max(20),
    Joi.number().integer().max(99999999999999999999).allow(null, '')
  ).optional(), // Discount is allowed to be null, so it's optional
  Total_Price: Joi.number().positive().precision(2).optional(),
  Created_By: Joi.string().max(255).optional(), // Created_By is allowed to be null, so it's optional
  ITEM_TYPE: Joi.number().optional().allow(null),
  UOM1: Joi.string().max(10).allow(null, ""),
  PurchaseRequest_UTD: Joi.alternatives().try(
    Joi.string().max(20),
    Joi.number().integer().max(99999999999999999999).allow(null, '')
  ).optional(),
});

module.exports = {
  _Purchase_Order_Product_Details,
  purchaseOrderProductDetailsSchema,
};
