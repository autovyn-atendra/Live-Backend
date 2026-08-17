const Sequelize = require("sequelize");
const _AssetGroup = function (sequelize, DataTypes) {
  return sequelize.define(
    "AssetsGroup",
    {
      Id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      icon: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      Asset_Type: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Created_by: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      DPRATE: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      DEPARTMENT: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "Assets_Group",
      schema: "dbo",
      timestamps: false,
      indexes: [
        {
          name: "PK__Assets_G__3214EC07AF4B2C67",
          unique: true,
          fields: [{ name: "Id" }],
        },
      ],
    }
  );
};
const Joi = require("joi");
const assetsGroupSchema = Joi.object({
  Id: Joi.number().integer().positive().optional(),
  name: Joi.string().max(255).required(),
  icon: Joi.string().max(255).optional(),
  Created_by: Joi.string().max(100).optional().allow(null),
  Asset_Type: Joi.number().integer().optional().allow(null),
  DPRATE: Joi.alternatives()
    .try(Joi.string().max(10), Joi.number())
    .optional()
    .allow(null, ""),
  DEPARTMENT: Joi.alternatives()
    .try(Joi.string().max(20), Joi.number())
    .optional()
    .allow(null, ""),
});

module.exports = { assetsGroupSchema, _AssetGroup };
