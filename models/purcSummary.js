const Sequelize = require("sequelize");


const _HyundaiPurchaseSummaryImport = function (sequelize, DataTypes) {
  return sequelize.define(
        "Hyundai_Purchase_Summary_Import",
  {
    UTD: {
      autoIncrement: true,
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    Invoice_No: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    Invoice_Date: {
      type: Sequelize.DataTypes.DATEONLY,
      allowNull: true,
    },
    Supplier: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    Code_Name: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    GC: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    Transpoter: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    GR_No: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    GR_Type: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    GR_Date: {
      type: Sequelize.DataTypes.DATEONLY,
      allowNull: true,
    },
    Materail_Value: {
      type: Sequelize.DataTypes.STRING(20),
      allowNull: true,
    },
    CST_VAT: {
      type: Sequelize.DataTypes.STRING(20),
      allowNull: true,
    },
    Insurance: {
      type: Sequelize.DataTypes.STRING(20),
      allowNull: true,
    },
    Freight: {
      type: Sequelize.DataTypes.STRING(20),
      allowNull: true,
    },
    Other: {
      type: Sequelize.DataTypes.STRING(20),
      allowNull: true,
    },
    TXBL_AMT: {
      type: Sequelize.DataTypes.STRING(20),
      allowNull: true,
    },
    SGST: {
      type: Sequelize.DataTypes.STRING(20),
      allowNull: true,
    },
    CGST: {
      type: Sequelize.DataTypes.STRING(20),
      allowNull: true,
    },
    IGST: {
      type: Sequelize.DataTypes.STRING(20),
      allowNull: true,
    },
    TCS: {
      type: Sequelize.DataTypes.STRING(20),
      allowNull: true,
    },
    Total: {
      type: Sequelize.DataTypes.STRING(20),
      allowNull: true,
    },
    IRN_NO: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true,
    },
    IRN_DT: {
      type: Sequelize.DataTypes.DATEONLY,
      allowNull: true,
    },
     location: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: true,
    },
    
    Created_By: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: true,
    },
    
   
  },
  {
    sequelize,
    tableName: "Hyundai_Purchase_Summary_Import",
    schema: "dbo",
    timestamps: false,
  }
);
}

const Joi = require("joi");
const HyundaiPurchaseSummaryImportSchema = Joi.object({
  UTD: Joi.number().integer().optional(),
  Invoice_No: Joi.string().max(50).allow(null, ''),
  Invoice_Date: Joi.date().allow(null),
  Supplier: Joi.string().max(50).allow(null, ''),
  Code_Name: Joi.string().max(50).allow(null, ''),
  GC: Joi.string().max(50).allow(null, ''),
  Transpoter: Joi.string().max(50).allow(null, ''),
  GR_No: Joi.string().max(50).allow(null, ''),
  GR_Type: Joi.string().max(50).allow(null, ''),
  GR_Date: Joi.date().allow(null),
  Materail_Value: Joi.alternatives()
      .try(Joi.string().max(20), Joi.number())
      .required(),
  CST_VAT: Joi.alternatives()
      .try(Joi.string().max(20), Joi.number())
      .required(),
  Insurance: Joi.alternatives()
      .try(Joi.string().max(20), Joi.number())
      .required(),
  Freight: Joi.alternatives()
      .try(Joi.string().max(20), Joi.number())
      .required(),
  Other: Joi.alternatives()
      .try(Joi.string().max(20), Joi.number())
      .required(),
  TXBL_AMT: Joi.alternatives()
      .try(Joi.string().max(20), Joi.number())
      .required(),
  SGST: Joi.alternatives()
      .try(Joi.string().max(20), Joi.number())
      .required(),
  CGST: Joi.alternatives()
      .try(Joi.string().max(20), Joi.number())
      .required(),
  IGST: Joi.alternatives()
      .try(Joi.string().max(20), Joi.number())
      .required(),
  TCS: Joi.alternatives()
      .try(Joi.string().max(20), Joi.number())
      .required(),
  Total: Joi.alternatives()
      .try(Joi.string().max(20), Joi.number())
      .required(),
  IRN_NO: Joi.string().max(100).allow(null, ''),
  IRN_DT: Joi.date().allow(null),
   location: Joi.string().max(255).allow(null, ''),
  Created_By: Joi.string().max(255).allow(null, ''),
 
});

module.exports = {
  _HyundaiPurchaseSummaryImport,
  HyundaiPurchaseSummaryImportSchema,
};
``
