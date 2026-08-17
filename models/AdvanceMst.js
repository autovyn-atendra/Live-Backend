const Sequelize = require('sequelize');
const _AdvanceMst = function(sequelize, DataTypes) {
  return sequelize.define('AdvanceMst', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    EMPCODE: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    SRNO: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    REQUEST_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    TRAN_TYPE: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    REQ_AMOUNT: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    SANC_AMOUNT: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    TENURE_MONTH: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    REPAYMENT_START_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    PENDING_BAL: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    TOTAL_RECIEVED: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    APPR_1_CODE: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    APPR_1_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    APPR_2_CODE: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    APPR_2_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    APPR_3_CODE: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    APPR_3_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    APPR_1_STATUS: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    APPR_2_STATUS: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    APPR_3_STATUS: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    FINAL_APPRV: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    REPAYMENT_DONE: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    CREATED_BY: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    LOC_CODE: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Advance_Mst',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Advance___C5B6F0D2A1AD35AC",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};


const Joi = require('joi');

const AdvanceMstSchema = Joi.object({
    EMPCODE: Joi.string().max(50).allow(null).allow(''),
    SRNO: Joi.number().integer().required(),
    TRAN_TYPE: Joi.string().max(25).required(),
    REQ_AMOUNT: Joi.number().required(), 
    SANC_AMOUNT: Joi.number(), 
    TENURE_MONTH: Joi.number().integer().required(),
    REPAYMENT_START_DATE: Joi.date().iso().required(), 
    PENDING_BAL: Joi.number(), 
    TOTAL_RECIEVED: Joi.number(),
    APPR_1_CODE: Joi.number().allow(null).allow(''),
    APPR_1_DATE: Joi.date().allow(null).allow(''),
    APPR_2_CODE: Joi.number().allow(null).allow(''),
    APPR_2_DATE: Joi.date().allow(null).allow(''),
    APPR_3_CODE: Joi.number().allow(null).allow(''),
    APPR_3_DATE: Joi.date().allow(null).allow(''),
    APPR_1_STATUS: Joi.number().integer(), 
    APPR_2_STATUS: Joi.number().integer(), 
    APPR_3_STATUS: Joi.number().integer(), 
    FINAL_APPRV: Joi.number().integer(), 
    REPAYMENT_DONE: Joi.number().integer(),
    CREATED_BY: Joi.string().max(200).required(),
    LOC_CODE: Joi.number().integer()
});

module.exports = { _AdvanceMst,  AdvanceMstSchema };

