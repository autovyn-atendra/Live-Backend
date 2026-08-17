const Sequelize = require("sequelize");
const _icm_ext_dtl = function (sequelize, DataTypes) {
  return sequelize.define(
    "icmextdtl",
    {
      UTD: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      ext_Invoice_num: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Receipt_Amt: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
      },
      TDS_Amt: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
      },
      GST_Amount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
      },
      Receipt_No: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Receipt_Date: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      Account_No: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Bank_Name: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      Credit_Ref: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      Remark: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      Created_By: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      INVOICE_TYPE: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Receipt_Image: {
        type: DataTypes.STRING(500),
        allowNull: true
      },
      EXPORT_TYPE: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Gross_Amt: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
      },
      ICM_EXT_TOP_TRAN_ID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
    },
    {
      sequelize,
      tableName: "icm_ext_dtl",
      schema: "dbo",
      timestamps: false,
      indexes: [
        {
          name: "PK__Product___C5B6F0D28FFEE240",
          unique: true,
          fields: [{ name: "UTD" }],
        },
      ],
    }
  );
};

const Joi = require("joi");

const icmextdtlSchema = Joi.object({
  ext_Invoice_num: Joi.string().max(50).allow(null, ""),
  Receipt_Amt: Joi.number().precision(2).allow(null),
  TDS_Amt: Joi.number().precision(2).allow(null),
  GST_Amount: Joi.number().precision(2).allow(null),
  Receipt_No: Joi.string().max(100).allow(null, ""),
  Receipt_Date: Joi.date().allow(null),
  Account_No: Joi.string().max(50).allow(null, ""),
  Bank_Name: Joi.string().max(200).allow(null, ""),
  Credit_Ref: Joi.string().max(200).allow(null, ""),
  Remark: Joi.string().max(500).allow(null, ""),
  Created_By: Joi.string().max(255).allow(null, ""),
  INVOICE_TYPE: Joi.string().max(50).allow(null, ""),
  Receipt_Image: Joi.string().max(500).allow(null, ""),
  EXPORT_TYPE: Joi.number().optional().allow(null, ''),
  Gross_Amt: Joi.number().precision(2).allow(null),
  ICM_EXT_TOP_TRAN_ID: Joi.number().optional().allow(null, ''),
});

module.exports = { _icm_ext_dtl, icmextdtlSchema };
