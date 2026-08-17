const Sequelize = require('sequelize');

const _LeaveBal = function (sequelize, DataTypes) {
  return sequelize.define('LeaveBal', {
    Emp_Code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    Leave_Type: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    Leave_Mnth: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Op_Bal: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Gen_Lev: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Avail_Lev: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Cl_Bal: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Leave_Yr: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'Leave_Bal',
    schema: 'dbo',
    timestamps: false,
    freezeTableName: true
  });
};

module.exports = { _LeaveBal };
