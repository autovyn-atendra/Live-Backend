const Sequelize = require('sequelize');
const _DispatchDump = function (sequelize, DataTypes) {
  return sequelize.define('DispatchDump', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    DELR: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    CITY: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    INVOICETYPE: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    Fin_No: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Invoice_GP_No: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    GR_No: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    ACCOUNTCODE: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    MODELCODE: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    COLOR: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    CHASSISPREFIX: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    CHASSISNO: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    ENGINENO: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    INVOICEDATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    INV_DATE_FOR_ROAD_PERMIT: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Basic_Value: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Discount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    DRF: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Assessable_Value: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    IGST: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Cess: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    TCS: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    InvoiceAmt: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    ORDERCATEGORY: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    PLANT: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    TIN: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    SENTBY: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    TRIPNO: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    TRANSPORTREGNUMBER: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    INDENT: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    TRANSNAME: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    EMAILID: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    FINANCIER: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Created_By: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'Dispatch_Dump',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Dispatch__C5B6F0D2D4D7A2F9",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};

const Joi = require('joi');

const dispatchDumpSchema = Joi.object({
  UTD: Joi.number().integer().positive().optional(),
  DELR: Joi.string().max(10).allow(null),
  CITY: Joi.string().max(10).allow(null),
  INVOICETYPE: Joi.string().length(1).allow(null),
  Fin_No: Joi.string().max(20).allow(null),
  Invoice_GP_No: Joi.string().max(20).allow(null),
  GR_No: Joi.string().max(20).allow(null),
  ACCOUNTCODE: Joi.string().length(1).allow(null),
  MODELCODE: Joi.string().max(20).allow(null),
  COLOR: Joi.string().max(10).allow(null),
  CHASSISPREFIX: Joi.string().max(20).allow(null),
  CHASSISNO: Joi.string().max(20).allow(null),
  ENGINENO: Joi.string().max(20).allow(null),
  INVOICEDATE: Joi.date().iso().allow(null),
  INV_DATE_FOR_ROAD_PERMIT: Joi.date().iso().allow(null),
  Basic_Value: Joi.number().precision(2).allow(null),
  Discount: Joi.number().precision(2).allow(null),
  DRF: Joi.number().precision(2).allow(null),
  Assessable_Value: Joi.number().precision(2).allow(null),
  IGST: Joi.number().precision(2).allow(null),
  Cess: Joi.number().precision(2).allow(null),
  TCS: Joi.number().precision(2).allow(null),
  InvoiceAmt: Joi.number().precision(2).allow(null),
  ORDERCATEGORY: Joi.string().max(10).allow(null),
  PLANT: Joi.string().max(10).allow(null),
  TIN: Joi.string().max(20).allow(null),
  SENTBY: Joi.string().max(50).allow(null),
  TRIPNO: Joi.string().max(20).allow(null),
  TRANSPORTREGNUMBER: Joi.string().max(20).allow(null),
  INDENT: Joi.string().max(20).allow(null),
  TRANSNAME: Joi.string().max(100).allow(null),
  EMAILID: Joi.string().max(100).allow(null),
  FINANCIER: Joi.string().max(50).allow(null),
  Created_By: Joi.string().max(255).allow(null)
});

module.exports = { _DispatchDump, dispatchDumpSchema };

