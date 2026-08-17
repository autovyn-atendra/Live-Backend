const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('HistoryMaster', {
    UID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Table_Name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Modified_By: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Modified_Date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('getdate')
    },
    Export_type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Loc_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Primary_Col_Name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Primary_Col_ID: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Acnt_Type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Created_At: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'History_Master',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__History___C5B19602ED64E4BC",
        unique: true,
        fields: [
          { name: "UID" },
        ]
      },
    ]
  });
};
