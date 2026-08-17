const Sequelize = require('sequelize');
const _ExpenseApprovalMatrix = function (sequelize, DataTypes) {
  return sequelize.define('ExpenseApprovalMatrix', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Branch_Code: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Approver_1A: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Approver_1B: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Approver_1C: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Approver_2A: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Approver_2B: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Approver_2C: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Approver_3A: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Approver_3B: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Approver_3C: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Created_By: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    module: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Expense_Approval_Matrix',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Expense___C5B6F0D27E85EB46",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};


const Joi = require('joi');

const expenseApprovalMatrixSchema = Joi.object({
  Branch_Code: Joi.number().integer().required(),
  Approver_1A: Joi.number().integer().allow(null, ""),
  Approver_1B: Joi.number().integer().allow(null, ""),
  Approver_1C: Joi.number().integer().allow(null, ""),
  Approver_2A: Joi.number().integer().allow(null, ""),
  Approver_2B: Joi.number().integer().allow(null, ""),
  Approver_2C: Joi.number().integer().allow(null, ""),
  Approver_3A: Joi.number().integer().allow(null, ""),
  Approver_3B: Joi.number().integer().allow(null, ""),
  Approver_3C: Joi.number().integer().allow(null, ""),
  Created_By: Joi.number().integer().allow(null, ""),
  module: Joi.string().max(50).allow(null, ""),
});

module.exports = { _ExpenseApprovalMatrix, expenseApprovalMatrixSchema };
