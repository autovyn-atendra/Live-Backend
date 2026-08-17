const Sequelize = require("sequelize");
const _Asset_Request_Dtl = function (sequelize, DataTypes) {
  return sequelize.define(
    "AssetRequestDtl",
    {
      tran_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      Product_Code: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      Subcategory: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      Item_Description: {
        type: DataTypes.STRING(100),
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
      Total_Price: {
        type: DataTypes.DECIMAL(19, 4), // using decimal for money type
        allowNull: true,
      },
      Fin_Appr: {
        type: DataTypes.INTEGER, // using decimal for money type
        allowNull: true,
      },
      Request_Id: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      ITEM_TYPE: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      HSN: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      UOM1: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      Created_By: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      IsApproval: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      Location: {
        type: DataTypes.STRING(10),
        allowNull: true
      },
      srm: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      Quotation1: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      Quotation2: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      Quotation3: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      IsSpecialApr: {
        type: DataTypes.STRING(10),
        allowNull: true
      },
      Department: {
        type: DataTypes.STRING(10),
        allowNull: true
      },
    },
    {
      sequelize,
      tableName: "Asset_Request_Dtl",
      schema: "dbo",
      timestamps: false,
      indexes: [
        {
          name: "PK__Purchase__C5B6F0D2F02C5058",
          unique: true,
          fields: [{ name: "tran_id" }],
        },
      ],
    }
  );
};

const Joi = require("joi");

const AssetRequestdtlSchema = Joi.object({
  tran_id: Joi.number().integer().optional(), // will be auto-generated
  Product_Code: Joi.alternatives().try(Joi.string().max(20), Joi.number()).optional().allow(null),
  Subcategory: Joi.string().max(20).optional(),
  Item_Description: Joi.string().max(100).optional(),
  Quantity: Joi.string().max(20).required(),
  Unit_Price: Joi.alternatives().try(Joi.string().max(20), Joi.number()).optional().allow(null),
  Fin_Appr: Joi.alternatives().try(Joi.string().max(20), Joi.number()).optional().allow(null),
  Total_Price: Joi.number().precision(4).optional(),
  Request_Id: Joi.string().max(20).optional(),
  ITEM_TYPE: Joi.string().max(20).optional(),
  HSN: Joi.string().max(20).optional(),
  Department: Joi.string().max(20).optional(),
  UOM1: Joi.string().max(10).optional(),
  Created_By: Joi.string().max(255).optional(),
  IsApproval: Joi.alternatives().try(Joi.string().max(10), Joi.number()).optional().allow(null,''),
  Location: Joi.alternatives().try(Joi.string().max(10), Joi.number()).optional().allow(null),
  srm: Joi.string().max(20).optional(),
  Quotation1: Joi.alternatives().try(Joi.string().max(255), Joi.number()).optional().allow(null),
  Quotation2: Joi.alternatives().try(Joi.string().max(255), Joi.number()).optional().allow(null),
  Quotation3: Joi.alternatives().try(Joi.string().max(255), Joi.number()).optional().allow(null),
});

module.exports = {
  _Asset_Request_Dtl,
  AssetRequestdtlSchema,
};
