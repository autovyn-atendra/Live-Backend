const Sequelize = require("sequelize");
const _Sal_Attn_Data_Excel = function (sequelize, DataTypes) {
  return sequelize.define(
    "SalAttnDataExcel",
    {
      UTD: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      Emp_Code: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      Monthdays: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      SalMnth: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
      },
      presentvalue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
      },
      Off_days: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
      },
      Holiday_Value: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
      },
      WO_Value: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
      },
      ABSENTVALUE: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
      },
      salyr: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Created_By: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      LEAVEVALUE: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
      },
      Export_Type: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "Sal_Attn_Data_Excel",
      schema: "dbo",
      timestamps: false,
      indexes: [
        {
          name: "PK__SalAttnDataExcel__UTD",
          unique: true,
          fields: [{ name: "UTD" }],
        },
      ],
    }
  );
};

const Joi = require("joi");


const SalAttnDataExcelSchema = Joi.object({
  Emp_Code: Joi.string().max(20).optional().allow(null, ''),
  Monthdays: Joi.number().integer().optional().allow(null, ''),
  SalMnth: Joi.number().precision(2).optional().allow(null, ''),
  presentvalue: Joi.number().precision(2).optional().allow(null, ''),
  Off_days: Joi.number().precision(2).optional().allow(null, ''),
  Holiday_Value: Joi.number().precision(2).optional().allow(null, ''),
  WO_Value: Joi.number().precision(2).optional().allow(null, ''),
  ABSENTVALUE: Joi.number().precision(2).optional().allow(null, ''),
  salyr: Joi.number().integer().optional().allow(null, ''),
  Created_By: Joi.string().max(255).optional().allow(null, ''),
  LEAVEVALUE: Joi.number().precision(2).optional().allow(null, ''),
  Export_Type: Joi.number().integer().optional().allow(null, ''),
});

module.exports = { _Sal_Attn_Data_Excel, SalAttnDataExcelSchema };
