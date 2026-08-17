const Sequelize = require('sequelize');
const _GpDtl = function (sequelize, DataTypes) {
  return sequelize.define('GpDtl', {
    Tran_Id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Rect1_No: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Rect2_No: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Rect3_No: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Rect4_No: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Rect5_No: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Rect1_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Rect2_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Rect3_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Rect4_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Rect5_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Rcpt1_Amt: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Rcpt2_Amt: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Rcpt3_Amt: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Rcpt4_Amt: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Rcpt5_Amt: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Pymt1_Mode: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Pymt2_Mode: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Pymt3_Mode: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Pymt4_Mode: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Pymt_5_Mode: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Inst_No1: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Inst_No2: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Inst_No3: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Inst_No4: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Inst_No5: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Inst_Dt1: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Inst_Dt2: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Inst_Dt3: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Inst_Dt4: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Inst_Dt5: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Pymt5_Mode: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    GUID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Created_by: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'GP_DTL',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__GP_DTL__15B69B8EBFFF317C",
        unique: true,
        fields: [
          { name: "GUID" },
        ]
      },
    ]
  });
};

const Joi = require('joi');

const gpDtlSchema = Joi.object({
  Tran_Id: Joi.number().integer().allow(null),
  Rect1_No: Joi.string().allow("").max(50).allow(null),
  Rect2_No: Joi.string().allow("").max(50).allow(null),
  Rect3_No: Joi.string().allow("").max(50).allow(null),
  Rect4_No: Joi.string().allow("").max(50).allow(null),
  Rect5_No: Joi.string().allow("").max(50).allow(null),
  Rect1_Date: Joi.date().allow(null),
  Rect2_Date: Joi.date().allow(null),
  Rect3_Date: Joi.date().allow(null),
  Rect4_Date: Joi.date().allow(null),
  Rect5_Date: Joi.date().allow(null),
  Rcpt1_Amt: Joi.number().precision(4).allow(null),
  Rcpt2_Amt: Joi.number().precision(4).allow(null),
  Rcpt3_Amt: Joi.number().precision(4).allow(null),
  Rcpt4_Amt: Joi.number().precision(4).allow(null),
  Rcpt5_Amt: Joi.number().precision(4).allow(null),
  Pymt1_Mode: Joi.string().allow("").max(30).allow(null),
  Pymt2_Mode: Joi.string().allow("").max(30).allow(null),
  Pymt3_Mode: Joi.string().allow("").max(30).allow(null),
  Pymt4_Mode: Joi.string().allow("").max(30).allow(null),
  Pymt_5_Mode: Joi.number().integer().allow(null),
  Inst_No1: Joi.string().allow("").max(20).allow(null),
  Inst_No2: Joi.string().allow("").max(20).allow(null),
  Inst_No3: Joi.string().allow("").max(20).allow(null),
  Inst_No4: Joi.string().allow("").max(20).allow(null),
  Inst_No5: Joi.string().allow("").max(20).allow(null),
  Inst_Dt1: Joi.date().allow(null),
  Inst_Dt2: Joi.date().allow(null),
  Inst_Dt3: Joi.date().allow(null),
  Inst_Dt4: Joi.date().allow(null),
  Inst_Dt5: Joi.date().allow(null),
  Pymt5_Mode: Joi.string().allow("").max(30).allow(null),
  Created_by: Joi.string().allow("").max(200).allow(null)
});

module.exports = { _GpDtl, gpDtlSchema };
