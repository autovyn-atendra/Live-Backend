const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CloudWa', {
    Tran_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true
    },
    WA_No: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    WA_MSG: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    WA_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    WA_Time: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    WA_Status: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'CLOUD_WA',
    schema: 'dbo',
    timestamps: false
  });
};
