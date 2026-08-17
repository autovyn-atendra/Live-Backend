const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ExpenseApprovalMatrixHst', {
    UTD: {
      type: DataTypes.INTEGER,
      allowNull: false
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
    Created_At: {
      type: DataTypes.DATE,
      allowNull: false
    },
    ValidFrom: {
      type: DataTypes.DATE,
      allowNull: false
    },
    ValidTo: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Expense_Approval_Matrix_Hst',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "ix_Expense_Approval_Matrix_Hst",
        fields: [
          { name: "ValidTo" },
          { name: "ValidFrom" },
        ]
      },
    ]
  });
};
