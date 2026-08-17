const Sequelize = require('sequelize');
const _TvIcmDtl = function(sequelize, DataTypes) {
  return sequelize.define('TvIcmDtl', {
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
    SRNO: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    PURCHASE_COST: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    RF_BODYSHOP: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    RF_WORKSHOP: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    RF_TEFLON: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    RF: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    PUR_MGA_EXP: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    PUR_INS_EXP: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    PUR_WARR_EXP: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    PUR_MNGMT_EXP: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    PUR_EXCH_EXP: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    PUR_FUEL_EXP: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    PUR_INTEREST_EXP: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    PUR_OTHER_EXP: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    PUR_TOPUP_EXP: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    PUR_CARLOAN_EXP: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    EXPECT_SALEPERCT: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    EXPECT_SALEVAL: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    FIN_DO_AMT: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    FIN_PF_CHRG: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    NET_FIN_AMT: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    SALE_INV_AMT: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    GST_PERCT: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    SALE_TCS_PERCT: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    GST_AMT: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    TOTAL_MARGIN: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    TOTAL_VALUE: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    SALE_RTO: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    SALE_INS: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    SALE_EW: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    SALE_OC: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    SALE_PUC: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    SALE_DISC: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    TTL_CTC: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    NET_PNL: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    MO1: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    MO2: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    MO3: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    MO4: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    GSTINC: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    Created_by: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    PUR_CARR_EXP: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    SALE_TCS: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    SALE_MNGMNT_FEES: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
     FINAL_SALE_INV_AMT: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'TV_ICM_DTL',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__TV_ICM_D__C5B6F0D27A1C9E40",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};


const Joi = require('joi');

const TvIcmDtlSchema = Joi.object({
  SRNO: Joi.number().integer().allow(null).allow(''),
  PURCHASE_COST: Joi.number().allow(null).allow(''),
  RF_BODYSHOP: Joi.number().allow(null).allow(''),
  RF_WORKSHOP: Joi.number().allow(null).allow(''),
  RF_TEFLON: Joi.number().allow(null).allow(''),
  RF: Joi.number().allow(null).allow(''),
  PUR_MGA_EXP: Joi.number().allow(null).allow(''),
  PUR_INS_EXP: Joi.number().allow(null).allow(''),
  PUR_WARR_EXP: Joi.number().allow(null).allow(''),
  PUR_MNGMT_EXP: Joi.number().allow(null).allow(''),
  PUR_EXCH_EXP: Joi.number().allow(null).allow(''),
  PUR_FUEL_EXP: Joi.number().allow(null).allow(''),
  PUR_INTEREST_EXP: Joi.number().allow(null).allow(''),
  PUR_OTHER_EXP: Joi.number().allow(null).allow(''),
  PUR_TOPUP_EXP: Joi.number().allow(null).allow(''),
  PUR_CARLOAN_EXP: Joi.number().allow(null).allow(''),
  EXPECT_SALEPERCT: Joi.number().integer().allow(null).allow(''),
  EXPECT_SALEVAL: Joi.number().allow(null).allow(''),
  FIN_DO_AMT: Joi.number().allow(null).allow(''),
  FIN_PF_CHRG: Joi.number().allow(null).allow(''),
  NET_FIN_AMT: Joi.number().allow(null).allow(''),
  SALE_INV_AMT: Joi.number().allow(null).allow(''),
  GST_PERCT: Joi.number().integer().allow(null).allow(''),
  SALE_TCS_PERCT: Joi.number().integer().allow(null).allow(''),
  GST_AMT: Joi.number().allow(null).allow(''),
  TOTAL_MARGIN: Joi.number().allow(null).allow(''),
  TOTAL_VALUE: Joi.number().allow(null).allow(''),
  SALE_RTO: Joi.number().allow(null).allow(''),
  SALE_INS: Joi.number().allow(null).allow(''),
  SALE_EW: Joi.number().allow(null).allow(''),
  SALE_OC: Joi.number().allow(null).allow(''),
  SALE_PUC: Joi.number().allow(null).allow(''),
  SALE_DISC: Joi.number().allow(null).allow(''),
  TTL_CTC: Joi.number().allow(null).allow(''),
  NET_PNL: Joi.number().allow(null).allow(''),
  MO1: Joi.number().allow(null).allow(''),
  MO2: Joi.number().allow(null).allow(''),
  MO3: Joi.number().allow(null).allow(''),
  MO4: Joi.number().allow(null).allow(''),
  GSTINC: Joi.boolean().allow(null).empty('').default(null),
  PUR_CARR_EXP: Joi.number().allow(null).allow(''),
  SALE_TCS: Joi.number().allow(null).allow(''),
  SALE_MNGMNT_FEES: Joi.number().allow(null).allow(''),
  FINAL_SALE_INV_AMT: Joi.number().allow(null).allow(''),
});

module.exports = {_TvIcmDtl, TvIcmDtlSchema};
