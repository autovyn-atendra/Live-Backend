const Sequelize = require("sequelize");
const _GpMst = function (sequelize, DataTypes) {
  return sequelize.define(
    "GpMst",
    {
      Tran_Id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      GP_Seq: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      GP_No: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      GP_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      Time_Out: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      DMS_InvNo: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      DMS_InvDt: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      Chassis_No: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Ledg_Name: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },
      Cust_Id: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Job_No: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Est_Val: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },
      GP_Reason: {
        type: DataTypes.STRING(400),
        allowNull: true,
      },
      Acnt_Remark: {
        type: DataTypes.STRING(400),
        allowNull: true,
      },
      Export_Type: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Loc_Code: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Surveyor_Name: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      Claim_No: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Insu_Name: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },
      Delay_Reason: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      File_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      RptRecd_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      BR_InvNo: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      BR_InvDt: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      BR_INV_AMT: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },
      Totl_Inv_Amt: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },
      Bal_Amt: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },
      GUID: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      Created_by: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "GP_MST",
      schema: "dbo",
      timestamps: false,
      indexes: [
        {
          name: "PK__GP_MST__15B69B8EB1F3AEF4",
          unique: true,
          fields: [{ name: "GUID" }],
        },
      ],
    }
  );
};

const Joi = require("joi");

const gpMstSchema = Joi.object({
  Tran_Id: Joi.number().integer().allow(null),
  GP_Seq: Joi.number().integer().allow(null),
  GP_No: Joi.string().allow("").max(50).allow(null),
  GP_Date: Joi.date().raw().allow(null),
  Time_Out: Joi.string().allow("").max(10).allow(null),
  DMS_InvNo: Joi.string().allow("").max(50).allow(null),
  DMS_InvDt: Joi.date().raw().allow(null),
  Chassis_No: Joi.string().allow("").max(50).allow(null),
  Ledg_Name: Joi.string().allow("").max(300).allow(null),
  Cust_Id: Joi.string().allow("").max(50).allow(null),
  Job_No: Joi.string().allow("").max(50).allow(null),
  Est_Val: Joi.number().precision(4).allow(null),
  GP_Reason: Joi.string().allow("").max(400).allow(null),
  Acnt_Remark: Joi.string().allow("").max(400).allow(null),
  Export_Type: Joi.number().integer().allow(null),
  Loc_Code: Joi.number().integer().allow(null),
  Surveyor_Name: Joi.string().allow("").max(150).allow(null),
  Claim_No: Joi.string().allow("").max(100).allow(null),
  Insu_Name: Joi.string().allow("").max(300).allow(null),
  Delay_Reason: Joi.string().allow("").max(200).allow(null),
  File_Date: Joi.date().raw().allow(null),
  RptRecd_date: Joi.date().raw().allow(null),
  BR_InvNo: Joi.string().allow("").max(30).allow(null),
  BR_InvDt: Joi.date().raw().allow(null),
  BR_INV_AMT: Joi.number().precision(4).allow(null),
  Totl_Inv_Amt: Joi.number().precision(4).allow(null),
  Bal_Amt: Joi.alternatives()
  .try(Joi.string().max(4), Joi.number())
  .optional().allow(null,''),
  Created_by: Joi.string().allow("").max(200).allow(null),
});

module.exports = { _GpMst, gpMstSchema };
