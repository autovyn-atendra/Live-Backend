const Sequelize = require('sequelize');
const _ExpenseApproval = function (sequelize, DataTypes) {
  return sequelize.define('ExpenseApproval', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Drd_Id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Acnt_Id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Utr_no: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Utr_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Autovyn_Pymt_Vch: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    Pymt_Done: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    Amount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    Appr_1_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Appr_1_Stat: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    Appr_1_Rem: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    Appr_2_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Appr_2_Stat: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    Appr_2_Rem: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    Appr_3_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Appr_3_Stat: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    Appr_3_Rem: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    Fin_Appr: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    Created_By: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Created_At: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    sequelize,
    tableName: 'Expense_Approval',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Expense___C5B6F0D23385F974",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};

const Joi = require('joi');

const expenseApprovalSchema = Joi.object({
  Drd_Id: Joi.number().integer().required(),
  Acnt_Id: Joi.number().integer().allow(null),
  Utr_no: Joi.string().max(100).allow(null),
  Utr_Date: Joi.date().iso().allow(null),
  Autovyn_Pymt_Vch: Joi.string().max(300).allow(null),
  Pymt_Done: Joi.number().integer().allow(null),
  Appr_1_Code: Joi.number().integer().allow(null),
  Appr_1_Stat: Joi.number().integer().allow(null),
  Appr_1_Rem: Joi.string().max(300).allow(null),
  Appr_2_Code: Joi.number().integer().allow(null),
  Appr_2_Stat: Joi.number().integer().allow(null),
  Appr_2_Rem: Joi.string().max(300).allow(null),
  Appr_3_Code: Joi.number().integer().allow(null),
  Appr_3_Stat: Joi.number().integer().allow(null),
  Appr_3_Rem: Joi.string().max(300).allow(null),
  Fin_Appr: Joi.number().integer().allow(null),
});

module.exports = { expenseApprovalSchema, _ExpenseApproval };
