const Sequelize = require("sequelize");
const _AdvanceDtl = function (sequelize, DataTypes) {
  return sequelize.define(
    "AdvanceDtl",
    {
      UTD: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      TRAN_ID: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      INO: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      INST_DATE: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      INST_AMT: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },
      REM_BAL: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },
      PYMT_RECVD: {
        type: DataTypes.SMALLINT,
        allowNull: true,
      },
      PYMT_REC_DATE: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      CREATED_BY: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "Advance_Dtl",
      schema: "dbo",
      timestamps: false,
      indexes: [
        {
          name: "PK_Advance__C5B6F0D2C2F78C20",
          unique: true,
          fields: [{ name: "UTD" }],
        },
      ],
    }
  );
};

const Joi = require("joi");

const AdvanceDtlSchema = Joi.object({
  
  TRAN_ID: Joi.number().integer(),
  INO: Joi.number().integer().required(),
  INST_DATE: Joi.date().allow(null).allow('').raw(),
  INST_AMT: Joi.number().required(),
  REM_BAL: Joi.number().required(),
  PYMT_RECVD: Joi.number().integer().required(),
  PYMT_REC_DATE: Joi.date().allow(null).allow('').raw(),
  CREATED_BY: Joi.string().max(200).required(),
});

module.exports = { _AdvanceDtl, AdvanceDtlSchema };
