const Sequelize = require("sequelize");
const Joi = require("joi");

const _SalesTeam = function (sequelize, DataTypes) {
  return sequelize.define(
    "SALES_TEAM",
    {
      UTD: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      Mnth: { type: DataTypes.INTEGER },
      Yr: { type: DataTypes.INTEGER },
 REGION: { type: DataTypes.STRING(50) },
      RM_Code: { type: DataTypes.STRING(20) },
      SRM_Code: { type: DataTypes.STRING(20) },
      ASM_Code: { type: DataTypes.STRING(20) },
      SM_Code: { type: DataTypes.STRING(20) },
      GM_Code: { type: DataTypes.STRING(20) },
      CGM_Code: { type: DataTypes.STRING(20) },

      Created_By: { type: DataTypes.STRING(255) },
      Created_On: { type: DataTypes.DATE },

      Modified_By: { type: DataTypes.STRING(255) },
      Modified_On: { type: DataTypes.DATE },

      Export_Type: { type: DataTypes.INTEGER },
      Location: { type: DataTypes.STRING(100) },
    },
    {
      sequelize,
      tableName: "SALES_TEAM",
      schema: "dbo",
      timestamps: false,
    }
  );
};

const SalesTeam_Schema = Joi.object({
  Mnth: Joi.number().integer().allow(null),
  Yr: Joi.number().integer().allow(null),
 REGION: Joi.string().allow(null, ""),
  RM_Code: Joi.string().allow(null, ""),
  SRM_Code: Joi.string().allow(null, ""),
  ASM_Code: Joi.string().allow(null, ""),
  SM_Code: Joi.string().allow(null, ""),
  GM_Code: Joi.string().allow(null, ""),
  CGM_Code: Joi.string().allow(null, ""),

  Created_By: Joi.string().allow(null, ""),
  Created_On: Joi.date().allow(null),
  Modified_By: Joi.string().allow(null, ""),
  Modified_On: Joi.date().allow(null),

  Export_Type: Joi.number().integer().allow(null),
  Location: Joi.string().allow(null, ""),
});

module.exports = {
  _SalesTeam,
  SalesTeam_Schema,
};
