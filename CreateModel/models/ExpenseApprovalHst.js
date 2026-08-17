const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ExpenseApprovalHst', {
    UTD: {
      type: DataTypes.INTEGER,
      allowNull: false
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
    tableName: 'Expense_Approval_Hst',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "ix_Expense_Approval_Hst",
        fields: [
          { name: "ValidTo" },
          { name: "ValidFrom" },
        ]
      },
    ]
  });
};
