const Sequelize = require('sequelize');
const _Ew_Import = function (sequelize, DataTypes) {
  return sequelize.define('EwImport', {
    UTD: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    NetworkCode: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    NetworkName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    CustomerName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    CustomerMobile: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    OrderDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    ReferenceNumber: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    InvoiceNumber: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    OrderType: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    OrderSubType: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Status: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Comments: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    SubmittedDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    VehicleSaleDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    CancellationDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    BookletNumber: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    ContractStartDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    ContractEndDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    BalancePayment: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    Price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    PaymentRealized: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    TotalBillAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    CGST: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    SGST: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    UGST: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    IGST: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    CGSTPer: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    SGSTPer: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    UGSTPer: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    IGSTPer: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    ModelName: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ModelVariant: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    HSNCode: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    SACCode: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    FrameNumber: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    EngineNumber: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    SellingDealer: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    VehicleInvoiceNumber: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ServiceProduct: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    LedgerName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Created_by: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Location: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Ew_Import',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Ew_Impor__C5B6F0D2C4A42B10",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};
const Joi = require('joi');

const ewImportSchema = Joi.object({
  UTD: Joi.number().integer().positive(),
  NetworkCode: Joi.string().max(50).allow(null, ''),
  NetworkName: Joi.string().max(255).allow(null, ''),
  CustomerName: Joi.string().max(255).allow(null, ''),
  CustomerMobile: Joi.string().max(15).allow(null, ''),
  OrderDate: Joi.date().raw().allow(null),
  ReferenceNumber: Joi.string().max(50).allow(null, ''),
  InvoiceNumber: Joi.string().max(50).allow(null, ''),
  OrderType: Joi.string().max(50).allow(null, ''),
  OrderSubType: Joi.string().max(50).allow(null, ''),
  Status: Joi.string().max(50).allow(null, ''),
  Comments: Joi.string().max(100).allow(null, ''),
  VehicleSaleDate: Joi.date().raw().allow(null),
  SubmittedDate: Joi.date().raw().allow(null),
  CancellationDate: Joi.date().raw().allow(null),
  BookletNumber: Joi.string().max(100).allow(null, ''),
  ContractStartDate: Joi.date().raw().allow(null),
  ContractEndDate: Joi.date().raw().allow(null),
  BalancePayment: Joi.number().precision(2).allow(null),
  Price: Joi.number().precision(2).allow(null),
  PaymentRealized: Joi.number().precision(2).allow(null),
  TotalBillAmount: Joi.number().precision(2).allow(null),
  CGST: Joi.number().precision(2).allow(null),
  SGST: Joi.number().precision(2).allow(null),
  UGST: Joi.number().precision(2).allow(null),
  IGST: Joi.number().precision(2).allow(null),
  CGSTPer: Joi.number().precision(2).allow(null),
  SGSTPer: Joi.number().precision(2).allow(null),
  UGSTPer: Joi.number().precision(2).allow(null),
  IGSTPer: Joi.number().precision(2).allow(null),
  ModelName: Joi.string().max(50).allow(null, ''),
  ModelVariant: Joi.string().max(50).allow(null, ''),
  HSNCode: Joi.string().max(50).allow(null, ''),
  SACCode: Joi.string().max(50).allow(null, ''),
  FrameNumber: Joi.string().max(50).allow(null, ''),
  EngineNumber: Joi.string().max(50).allow(null, ''),
  SellingDealer: Joi.string().max(50).allow(null, ''),
  VehicleInvoiceNumber: Joi.string().max(50).allow(null, ''),
  ServiceProduct: Joi.string().max(50).allow(null, ''),
  LedgerName: Joi.string().max(255).allow(null, ''),
  Created_by: Joi.string().max(30).allow(null, ''),
  Location: Joi.string().max(50).allow(null, '')
});

module.exports = { _Ew_Import, ewImportSchema };

