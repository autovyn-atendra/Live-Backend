const Sequelize = require("sequelize");
const _AssetCharacteristic = function (sequelize, DataTypes) {
  return sequelize.define(
    "AssetCharacteristic",
    {
      UTD: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      Type: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Name: {
        type: DataTypes.TEXT, // Change to JSON to allow array storage
        allowNull: true,
      },
      Category: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      SubCategory: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      AssetProduct: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      Created_by: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      TypeValue: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "Asset_Characteristic",
      schema: "dbo",
      timestamps: false,
      indexes: [
        {
          name: "PK__Asset_Is__C5B6F0D21EED522D",
          unique: true,
          fields: [{ name: "UTD" }],
        },
      ],
    }
  );
};

const Joi = require("joi");

const AssetCharacteristicSchema = Joi.object({
  UTD: Joi.number().integer().positive(),
  Type: Joi.string().max(100).optional(),
  Name: Joi.array().items(Joi.string().max(100)).optional(), 
  Category: Joi.alternatives().try(Joi.string().max(20), Joi.number()).optional(),
  SubCategory: Joi.alternatives().try(Joi.string().max(20), Joi.number()).optional(),
  AssetProduct: Joi.string().max(20).optional(),
  Created_by: Joi.string().max(100).optional(),
  TypeValue: Joi.string().max(10).optional(),
});

module.exports = { AssetCharacteristicSchema, _AssetCharacteristic };
