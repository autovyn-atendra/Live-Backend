const Sequelize = require('sequelize');
const _TvDo = function (sequelize, DataTypes) {
  return sequelize.define('TvDo', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    VEH_STAT: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    MODEL_VARIANT: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    MODEL_VAR: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    VEHREGNO: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    CHAS_NO: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    ENGINE_NO: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    REG_YEAR: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    RC_VAL_UPTO: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    INSU_VAL_UPTO: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    LOAN_AMT: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    CHALLAN_AMT: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    DOC_TRF_CHRGS: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    PURCHASE_COST: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    FIN_AMT: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    CHALLAN_DATE: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    REG_DATE: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    KM_DRIVEN: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    APPR_21_CODE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    APPR_21_STAT: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    APPR_21_REM: {
      type: DataTypes.STRING(400),
      allowNull: true
    },
    APPR_22_CODE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    APPR_22_STAT: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    APPR_22_REM: {
      type: DataTypes.STRING(400),
      allowNull: true
    },
    APPR_23_CODE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    APPR_23_STAT: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    APPR_23_REM: {
      type: DataTypes.STRING(400),
      allowNull: true
    },
    FIN_APPR_2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    VERF_DATE_2: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    Created_by: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Export_Type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    LOC_CODE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    FUEL_TYPE: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    FINANCIER_DO: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    BUY_TYPE: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    OWNER_COUNT: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    RE_PAINT_STAT: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    RE_PAINT_RMRK: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    PARTS_STAT: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    PARTS_RMRK: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    REPAIR_STAT: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    REPAIR_RMRK: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    STEREO_STAT: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    HANDOVER_STAT: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    HANDOVER_PERSON: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    uploaded_document: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'TV_DO',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__TV_DO__C5B6F0D20F68AB54",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};


const Joi = require('joi');

const TvDoSchema = Joi.object({
  VEH_STAT: Joi.string().max(20).allow(null, ''),
  MODEL_VARIANT: Joi.string().max(100).allow(null, ''),
  MODEL_VAR: Joi.string().max(100).allow(null, ''),
  VEHREGNO: Joi.string().max(20).allow(null, ''),
  CHAS_NO: Joi.string().max(20).allow(null, ''),
  ENGINE_NO: Joi.string().max(20).allow(null, ''),
  REG_YEAR: Joi.string().max(10).allow(null, ''),
  RC_VAL_UPTO: Joi.date().raw().allow(null, ''), 
  INSU_VAL_UPTO: Joi.date().raw().allow(null, ''), 
  LOAN_AMT: Joi.number().precision(4).allow(null, ''),
  CHALLAN_AMT: Joi.number().precision(4).allow(null, ''),
  FIN_AMT: Joi.number().precision(4).allow(null, ''),
  DOC_TRF_CHRGS: Joi.number().precision(4).allow(null, ''),
  PURCHASE_COST: Joi.number().precision(4).allow(null, ''),
  CHALLAN_DATE: Joi.date().raw().allow(null, ''), 
  REG_DATE: Joi.date().raw().allow(null, ''),
  KM_DRIVEN: Joi.number().integer().allow(null, ''),
  APPR_21_CODE: Joi.number().integer().allow(null, ''),
  APPR_21_STAT: Joi.number().integer().allow(null, ''),
  APPR_21_REM: Joi.string().max(400).allow(null, ''),
  APPR_22_CODE: Joi.number().integer().allow(null, ''),
  APPR_22_STAT: Joi.number().integer().allow(null, ''),
  APPR_22_REM: Joi.string().max(400).allow(null, ''),
  APPR_23_CODE: Joi.number().integer().allow(null, ''),
  APPR_23_STAT: Joi.number().integer().allow(null, ''),
  APPR_23_REM: Joi.string().max(400).allow(null, ''),
  FIN_APPR_2: Joi.number().integer().allow(null, ''),
  VERF_DATE_2: Joi.date().raw().allow(null, ''), 
  Created_by: Joi.string().max(100).allow(null, ''),
  Export_Type: Joi.number().integer().allow(null, ''),
  LOC_CODE: Joi.number().integer().allow(null, ''),
  FUEL_TYPE: Joi.string().max(20).allow(null, ''),
  FINANCIER_DO: Joi.number().integer().allow(null, ''),
  BUY_TYPE: Joi.string().max(20).allow(null, ''),
  OWNER_COUNT: Joi.number().integer().allow(null, ''),
  RE_PAINT_STAT: Joi.string().max(20).allow(null, ''),
  RE_PAINT_RMRK: Joi.string().max(250).allow(null, ''),
  PARTS_STAT: Joi.string().max(20).allow(null, ''),
  PARTS_RMRK: Joi.string().max(250).allow(null, ''),
  REPAIR_STAT: Joi.string().max(20).allow(null, ''),
  REPAIR_RMRK: Joi.string().max(250).allow(null, ''),
  STEREO_STAT: Joi.string().max(20).allow(null, ''),
  HANDOVER_STAT: Joi.string().max(20).allow(null, ''),
  HANDOVER_PERSON: Joi.string().max(100).allow(null, ''),
  uploaded_document: Joi.string().max(100).allow(null, ''),
});

module.exports = { _TvDo, TvDoSchema };
