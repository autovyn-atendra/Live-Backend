const Sequelize = require("sequelize");
const Joi = require("joi");

const _HyundaiWarrantyImport = function (sequelize, DataTypes) {
  return sequelize.define(
    "Hyundai_Warranty_Import",
    {
      UTD: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      Name: { type: DataTypes.STRING(255) },
      GST_No: { type: DataTypes.STRING(50) },
      Address: { type: DataTypes.STRING(500) },
      Invoice_No: { type: DataTypes.STRING(100) },
      Branch: { type: DataTypes.STRING(100) },

      Invoice_Date: { type: DataTypes.DATEONLY },
      Claim_No: { type: DataTypes.STRING(100) },
      Claim_Date: { type: DataTypes.DATEONLY },

      // MONEY columns (mapped safely)
      Total_Approved_Amt_Without_Tax: {
        type: DataTypes.DECIMAL(19, 4),
      },
      Total_Approved_Tax_Amt: {
        type: DataTypes.DECIMAL(19, 4),
      },
      Total_Approved_Amt: {
        type: DataTypes.DECIMAL(19, 4),
      },
      Tax_Rate: {
        type: DataTypes.DECIMAL(19, 4),
      },

      HSN_SAC_Code: { type: DataTypes.STRING(50) },
      Narration: { type: DataTypes.STRING(500) },

      Created_By: { type: DataTypes.STRING(255) },
      location: { type: DataTypes.STRING(100) },
    },
    {
      sequelize,
      tableName: "Hyundai_Warranty_Import",
      schema: "dbo",
      timestamps: false,
    }
  );
};

const Hyundai_Warranty_Import_Schema = Joi.object({
  Name: Joi.string().allow(null, ""),
  GST_No: Joi.string().allow(null, ""),
  Address: Joi.string().allow(null, ""),
  Invoice_No: Joi.string().allow(null, ""),
  Branch: Joi.string().allow(null, ""),
  Invoice_Date: Joi.date().allow(null),
  Claim_No: Joi.string().allow(null, ""),
  Claim_Date: Joi.date().allow(null),

  Total_Approved_Amt_Without_Tax: Joi.number().allow(null),
  Total_Approved_Tax_Amt: Joi.number().allow(null),
  Total_Approved_Amt: Joi.number().allow(null),
  Tax_Rate: Joi.number().allow(null),

  HSN_SAC_Code: Joi.string().allow(null, ""),
  Narration: Joi.string().allow(null, ""),

  Created_By: Joi.string().allow(null, ""),
  location: Joi.string().allow(null, ""),
});

module.exports = {
  _HyundaiWarrantyImport,
  Hyundai_Warranty_Import_Schema,
};
