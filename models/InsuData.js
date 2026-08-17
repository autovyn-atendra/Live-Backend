const Sequelize = require("sequelize");
const _Insu_Data = function (sequelize, DataTypes) {
  return sequelize.define(
    "InsuData",
    {
      Tran_Id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      POLICY_NO: {
        type: DataTypes.STRING(70),
        allowNull: true,
      },
      Registration_No: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      Chassis_No: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      Customer_Name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Mobile_No: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      Email_Id: {
        type: DataTypes.STRING(40),
        allowNull: true,
      },
      City: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      Policy_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      Due_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      TRANSACTION_AMOUNT: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },
      Insurance_Company: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      Export_Type: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Policy_Status: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      MODEL: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "insu_data",
      schema: "dbo",
      timestamps: false,
      indexes: [
        {
          name: "PK__insu_dat__950EE6B0189DBF8D",
          unique: true,
          fields: [{ name: "Tran_Id" }],
        },
      ],
    }
  );
};

const Joi = require("joi");

const insuDataSchema = Joi.object({
  Tran_Id: Joi.number().integer().positive().optional(),
  POLICY_NO: Joi.string().max(70).optional().allow(null),
  Registration_No: Joi.string().max(20).optional().allow(null),
  Chassis_No: Joi.string().max(20).optional().allow(null),
  Customer_Name: Joi.string().max(100).optional().allow(null),
  Mobile_No: Joi.string().max(30).optional().allow(null),
  Email_Id: Joi.string().email().max(40).optional().allow(null),
  City: Joi.string().max(30).optional().allow(null),
  Policy_Date: Joi.date().iso().optional().allow(null),
  Due_Date: Joi.date().iso().optional().allow(null),
  TRANSACTION_AMOUNT: Joi.number().precision(4).optional().allow(null),
  Insurance_Company: Joi.string().max(200).optional().allow(null),
  Export_Type: Joi.number().integer().optional().allow(null),
  Policy_Status: Joi.number().integer().optional().allow(null),
  MODEL: Joi.string().max(200).optional().allow(null),
});

module.exports = { _Insu_Data, insuDataSchema };
