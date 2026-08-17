const Sequelize = require('sequelize');
const _WaHstWeb = function(sequelize, DataTypes) {
  return sequelize.define('WaHstWeb', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    User_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    TRAN_ID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Temp_Name: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Mobile_No: {
      type: DataTypes.STRING(14),
      allowNull: true
    },
    Created_by: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'WA_HST_WEB',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__WA_HST_W__C5B6F0D20A4706AC",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};

module.exports = {_WaHstWeb};
