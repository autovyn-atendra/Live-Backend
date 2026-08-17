const Sequelize = require('sequelize');
const _ExpenseMngDtl = function(sequelize, DataTypes) {
  return sequelize.define('ExpenseMngDtl', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Expense_Id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Template_Id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    DESCRIPTION: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    LOCATION: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    RATE: {
      type: DataTypes.DECIMAL(19,2),
      allowNull: true
    },
    QTY: {
      type: DataTypes.DECIMAL(19,2),
      allowNull: true
    },
    AMOUNT: {
      type: DataTypes.DECIMAL(19,2),
      allowNull: true
    },
    F_1: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    F_2: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    F_3: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    F_4: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    F_5: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    F_6: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    F_7: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    F_8: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    F_9: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    F_10: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
      F_11: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    F_12: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    F_13: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    F_14: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    F_15: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    F_16: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    F_17: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    F_18: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    F_19: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    F_20: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    Export_type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Created_By: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Created_At: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  }, {
    sequelize,
    tableName: 'Expense_Mng_Dtl',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Expense___C5B6F0D2A1CD1E75",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};

module.exports ={_ExpenseMngDtl}