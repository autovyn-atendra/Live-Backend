const Sequelize = require("sequelize");
const _Product_Histroy = function (sequelize, DataTypes) {
  return sequelize.define(
    "ProductHistory",
    {
      tran_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      Asset_ID: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      Category: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      SubCategory: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Tran_Type: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      Quantity: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      Source_Location: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      Destination_Location: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      Issued_To: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      Revoke_Reason: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Created_By: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      IssueDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      RevokeDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      PurchaseDtl: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      common: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      Tran_Date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "Product_History",
      schema: "dbo",
      timestamps: false,
      indexes: [
        {
          name: "PK__Product___A67F8A2054F58A67",
          unique: true,
          fields: [{ name: "tran_id" }],
        },
      ],
    }
  );
};

const Joi = require("joi");

const productHistorySchema = Joi.object({
  tran_id: Joi.number().integer().positive().optional(), // autoIncrement field, no need to validate on creation
  Asset_ID: Joi.string().max(10).optional(),
  Category: Joi.string().max(50).optional(),
  SubCategory: Joi.string().max(50).optional(),
  Tran_Type: Joi.string().max(10).optional(),
  Quantity: Joi.number().positive().optional(),
  Source_Location: Joi.string().max(10).optional(),
  Destination_Location: Joi.string().max(10).optional(),
  Issued_To: Joi.string().max(10).optional(),
  Revoke_Reason: Joi.string().max(100).optional(),
  common: Joi.string().max(10).optional().allow(null, ""),
  Created_By: Joi.string().max(255).optional(),
  IssueDate: Joi.date().optional().allow(null),
  Tran_Date: Joi.date().optional().allow(null),
  RevokeDate: Joi.date().optional().allow(null),
  PurchaseDtl: Joi.string().max(10).optional().allow(null),
});
module.exports = { _Product_Histroy, productHistorySchema };
