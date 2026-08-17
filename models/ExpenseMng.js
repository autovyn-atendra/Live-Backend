const Sequelize = require('sequelize');
const _ExpenseMng = function (sequelize, DataTypes) {
  return sequelize.define('ExpenseMng', {
    Expense_Id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Template_Id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    REMARK: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    EMP_CODE: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    LOCATION: {
      type: DataTypes.STRING(20),
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
    Created_By: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Created_At: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    Cr_Ledg: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Dr_Ledg: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Vch_Type_Code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    DEPARTMENT: {
      type: DataTypes.STRING(50),
      allowNull: true
    },

  }, {
    sequelize,
    tableName: 'Expense_Mng',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Expense___D56F7ABDBB36268D",
        unique: true,
        fields: [
          { name: "Expense_Id" },
        ]
      },
    ]
  });
};

module.exports = { _ExpenseMng }
