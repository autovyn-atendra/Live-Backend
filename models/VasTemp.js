const Sequelize = require('sequelize');
const _VasTemp = function (sequelize, DataTypes) {
  return sequelize.define('VasTemp', {
    TRAN_ID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true,
    },
    Export_Type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    TRAN_TYPE: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'VAS_TEMP',
    schema: 'dbo',
    timestamps: false
  });
};

module.exports = { _VasTemp }