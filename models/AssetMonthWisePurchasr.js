const Sequelize = require("sequelize");
const _AssetMonthWisePurchase = function (sequelize, DataTypes) {
  return sequelize.define(
    "AssetMonthWisePurchase",
    {
      Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      SubcategoryId: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      Month: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      Purchase_Value: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Created_by: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "Asset_MonthWise_PurchaseValue",
      schema: "dbo",
      timestamps: false,
      indexes: [
        {
          name: "PK__Asset_Is__C5B6F0D21EED522D",
          unique: true,
          fields: [{ name: "Id" }],
        },
      ],
    }
  );
};

const Joi = require("joi");

const AssetMonthWisePurchaseSchema = Joi.object({
    Id: Joi.number().integer().optional(),
    SubcategoryId: Joi.alternatives().try(Joi.string().max(10), Joi.number()).required(),
    Month: Joi.string()
      .regex(/^(0[1-9]|1[0-2])$/) // Matches 01-12 for months
      .allow(null, ''),
    Purchase_Value: Joi.string().max(50).allow(null, ''),
    Created_by: Joi.string().max(100).allow(null, ''),
});

module.exports = { AssetMonthWisePurchaseSchema, _AssetMonthWisePurchase };
