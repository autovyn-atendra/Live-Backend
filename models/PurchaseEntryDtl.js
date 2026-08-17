const Sequelize = require('sequelize');
const _PurchaseEntryDtl = function (sequelize, DataTypes) {
  return sequelize.define('PurchaseEntryDtl', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    TRAN_ID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    TRAN_TYPE: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    CODE: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    DESCRIPTION: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Location: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CATEGORY: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    CATEGORYGST: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    ITEM_TYPE: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    UOM: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    HSN_CODE: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    QUANTITY: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    RATE: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    BATCH: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    SGST_PERCT: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    SGST_VALUE: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    CGST_PERCT: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CGST_VALUE: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    IGST_PERCT: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    IGST_VALUE: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    CESS_PERCT: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CESS_VALUE: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    DISC_PERCT: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DISC_VALUE: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    LOC_CODE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    EXPORT_TYPE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    SERVER_ID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    INV_DATE: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Created_by: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    BATCH: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    SubCategory: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    BRAND: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Sale_Ledg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Cost_Center: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Inv_Amt: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    SRNO: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CURR_STOCK: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    PO_Number: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    POPD: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
  }, {
    sequelize,
    tableName: 'PurchaseEntryDtl',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__PurchaseEntryDtl__C5B6F0D2C6757597",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};

const Joi = require('joi');

const PurchaseEntryDtlSchema = Joi.object({
  UTD: Joi.number().integer().positive().optional(),
  TRAN_ID: Joi.number().integer().optional().allow(null),
  TRAN_TYPE: Joi.string().max(20).optional().allow(null),
  CODE: Joi.string().max(20).optional().allow(null),
  DESCRIPTION: Joi.string().max(50).optional().allow(null),
  Location: Joi.number().integer().optional().allow(null),
  CATEGORY: Joi.string().max(20).optional().allow(null),
  CATEGORYGST: Joi.string().max(20).optional().allow(null),
  SubCategory: Joi.string().max(20).optional().allow(null),
  ITEM_TYPE: Joi.number().optional().allow(null),
  UOM: Joi.number().integer().optional().allow(null),
  HSN_CODE: Joi.string().max(50).optional().allow(null),
  QUANTITY: Joi.number().precision(2).optional().allow(null),
  RATE: Joi.number().precision(4).optional().allow(null),
  BATCH: Joi.string().max(50).optional().allow(null).allow(''),
  SGST_PERCT: Joi.number().optional().allow(null),
  SGST_VALUE: Joi.number().precision(4).optional().allow(null),
  CGST_PERCT: Joi.number().optional().allow(null),
  CGST_VALUE: Joi.number().precision(4).optional().allow(null),
  IGST_PERCT: Joi.number().optional().allow(null),
  IGST_VALUE: Joi.number().precision(4).optional().allow(null),
  CESS_PERCT: Joi.number().optional().allow(null),
  CESS_VALUE: Joi.number().precision(4).optional().allow(null),
  DISC_PERCT: Joi.number().optional().allow(null),
  DISC_VALUE: Joi.number().precision(4).optional().allow(null),
  LOC_CODE: Joi.number().integer().optional().allow(null),
  EXPORT_TYPE: Joi.number().integer().optional().allow(null),
  SERVER_ID: Joi.number().integer().optional().allow(null),
  INV_DATE: Joi.date().optional().allow(null),
  Created_by: Joi.string().max(100).optional().allow(null),
  BRAND: Joi.number().integer().optional().allow(null),
  Sale_Ledg: Joi.number().integer().optional().allow(null),
  Cost_Center: Joi.number().integer().optional().allow(null).allow(''),
  Inv_Amt: Joi.number().precision(4).optional().allow(null),
  SRNO: Joi.number().integer().optional().allow(null),
  CURR_STOCK: Joi.number().integer().optional().allow(null),
  PO_Number: Joi.alternatives().try(
    Joi.string().max(20),
    Joi.number().integer().max(99999999999999999999)
  ).optional(),
  POPD: Joi.alternatives().try(
    Joi.string().max(20),
    Joi.number().integer().max(99999999999999999999)
  ).optional(),
});

module.exports = { _PurchaseEntryDtl, PurchaseEntryDtlSchema };
