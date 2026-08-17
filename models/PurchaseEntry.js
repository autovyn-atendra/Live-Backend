const Sequelize = require('sequelize');
const _PurchaseEntryMst = function(sequelize, DataTypes) {
  return sequelize.define('PurchaseEntryMst', {
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
      type: DataTypes.INTEGER,
      allowNull: true
    },
    BOOK_CODE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    VOUCHER_NO: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    VOUCHER_DATE: {
      type: 'SMALLDATETIME',
      allowNull: true
    },
    INV_NO: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    PARTY_AC: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DISP_NAME: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    REF_NO: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    REF_DATE: {
      type: 'SMALLDATETIME',
      allowNull: true
    },
    NARR: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    STATE_CODE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    SUPP_GST: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    REG_TYPE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    REV_CHRGS: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DISP_ADD: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    Created_by: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    DRD_ID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Exp_Ledg1: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Exp_Ledg2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Exp_Ledg3: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Exp_Ledg4: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    TDS_Ledg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Exp_Perc1: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Exp_Perc2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Exp_Perc3: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Exp_Perc4: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Tds_Perc: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Exp_Amt1: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Exp_Amt2: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Exp_Amt3: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Exp_Amt4: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Tds_Amt: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Inv_Amt: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    LOC_CODE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ServerId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Export_Type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'PurchaseEntryMst',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__PurchaseEntryMst__C5B6F0D2378853D7",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};

const Joi = require('joi');

const PurchaseEntryMstSchema = Joi.object({
  UTD: Joi.number().integer().positive().optional(), 
  TRAN_ID: Joi.number().integer().optional(),
  TRAN_TYPE: Joi.number().integer().optional(),
  BOOK_CODE: Joi.number().integer().optional().allow(null),
  VOUCHER_NO: Joi.number().integer().optional().allow(null).allow(''),
  VOUCHER_DATE: Joi.date().raw().allow(null),
  INV_NO: Joi.string().max(30).optional().allow(null).allow(''),
  PARTY_AC: Joi.number().integer().optional().allow(null).allow(''),
  DISP_NAME: Joi.string().max(150).optional().allow(null).allow(''),
  REF_NO: Joi.string().max(50).optional().allow(null).allow(''),
  REF_DATE: Joi.date().raw().allow(null).allow(''),
  NARR: Joi.string().max(300).optional().allow(null).allow(''),
  STATE_CODE: Joi.number().integer().optional().allow(null),
  SUPP_GST: Joi.string().max(30).optional().allow(null).allow(''),
  REG_TYPE: Joi.number().integer().optional().allow(null),
  REV_CHRGS: Joi.alternatives()
  .try(Joi.string().max(10), Joi.number())
  .optional().allow(null,''),
  DISP_ADD: Joi.string().max(300).optional().allow(null).allow(''),
  Created_by: Joi.string().max(100).optional().allow(null),
  DRD_ID: Joi.number().integer(),
  Exp_Ledg1: Joi.number().integer().allow(null),
  Exp_Ledg2: Joi.number().integer().allow(null),
  Exp_Ledg3: Joi.number().integer().allow(null),
  Exp_Ledg4: Joi.number().integer().allow(null),
  TDS_Ledg: Joi.number().integer().allow(null),
  Exp_Perc1: Joi.number().integer().allow(null),
  Exp_Perc2: Joi.number().integer().allow(null),
  Exp_Perc3: Joi.number().integer().allow(null),
  Exp_Perc4: Joi.number().integer().allow(null),
  Tds_Perc: Joi.number().integer().allow(null),
  Exp_Amt1: Joi.number().precision(4).optional().allow(null),
  Exp_Amt2: Joi.number().precision(4).optional().allow(null),
  Exp_Amt3: Joi.number().precision(4).optional().allow(null),
  Exp_Amt4: Joi.number().precision(4).optional().allow(null),
  Tds_Amt: Joi.number().precision(4).optional().allow(null),
  Inv_Amt: Joi.number().precision(4).optional().allow(null),
  LOC_CODE: Joi.number().integer(),
  Export_Type: Joi.number().integer(),
  ServerId: Joi.number().integer(),
});

module.exports = {_PurchaseEntryMst , PurchaseEntryMstSchema};
