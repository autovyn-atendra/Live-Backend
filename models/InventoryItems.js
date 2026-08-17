const Sequelize = require('sequelize');
const _InventoryItems = function (sequelize, DataTypes) {
  return sequelize.define('InventoryItems', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ITEM_CODE: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ITEM_NAME: {
      type: DataTypes.STRING(400),
      allowNull: true
    },
    HSN: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ITEM_TYPE: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    PROD_TYPE: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    ITEM_TYPE_DEPT: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ITEM_CAT: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    CLASSIFICATION: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    BIN_LOC: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    GST_RATE: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    DLR_PRICE: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    PURCH_PRICE: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    DISCOUNT_PERCT: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    SALE_PRICE: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    MRP_PRICE: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    OLD_PRICE: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    UOM: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    ALLOW_DECIMAL: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CONN_MODELS: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    BRAND: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    MS: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    LOC_CODE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    OPENING_QTY: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    OPENING_VAL: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Created_At: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('getdate')
    },
    Created_by: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    IN_STOCK_QTY: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    PRE_VENDOR: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    MODEL_VARIANT: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    PurchasePostLedg: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    SalePostLedg: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    BATCH_TRAN: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Root_Part_No: {
      type: DataTypes.STRING(40),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'InventoryItems',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Inventor__C5B6F0D2A89B1D97",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};

const Joi = require('joi');

const InventoryItemsSchema = Joi.object({
  ITEM_CODE: Joi.string().max(50).allow(null,''),
  ITEM_NAME: Joi.string().max(400).allow(null,''),
  HSN: Joi.string().max(50).allow(null,''),
  ITEM_TYPE: Joi.string().max(20).allow(null,''),
  PROD_TYPE: Joi.string().max(100).allow(null,''),
  ITEM_TYPE_DEPT: Joi.string().max(50).allow(null,''),
  ITEM_CAT: Joi.string().max(50).allow(null,''),
  CLASSIFICATION: Joi.string().max(100).allow(null,''),
  BIN_LOC: Joi.string().max(200).allow(null,''),
  GST_RATE: Joi.number().allow(null,''),
  DLR_PRICE: Joi.number().precision(4).allow(null,''),
  PURCH_PRICE: Joi.number().precision(4).allow(null,''),
  DISCOUNT_PERCT: Joi.number().precision(4).allow(null,''),
  SALE_PRICE: Joi.number().precision(4).allow(null,''),
  MRP_PRICE: Joi.number().precision(4).allow(null,''),
  OLD_PRICE: Joi.number().precision(4).allow(null,''),
  UOM: Joi.string().max(25).allow(null,''),
  ALLOW_DECIMAL: Joi.number().integer().allow(null,''),
  CONN_MODELS: Joi.string().max(25).allow(null,''),
  BRAND: Joi.string().max(25).allow(null,''),
  MS: Joi.string().max(10).allow(null,''),
  LOC_CODE: Joi.number().integer().allow(null,''),
  BATCH_TRAN: Joi.number().integer().allow(null,''),
  Created_by: Joi.string().max(100).allow(null,''),
  IN_STOCK_QTY: Joi.number().allow(null,''),
  PRE_VENDOR: Joi.string().max(40).allow(null,''),
  MODEL_VARIANT: Joi.string().max(100).allow(null,''),
  PurchasePostLedg: Joi.string().max(10).allow(null,''),
  SalePostLedg: Joi.string().max(10).allow(null,''),
  OPENING_QTY: Joi.number().allow(null,''),
  OPENING_VAL: Joi.number().allow(null,''),
  Root_Part_No: Joi.string().max(40).allow(null,''),

});

module.exports = { _InventoryItems, InventoryItemsSchema };