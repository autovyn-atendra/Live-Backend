const Sequelize = require('sequelize');
const _AssetTemplate = function (sequelize, DataTypes) {
  return sequelize.define('AssetTemplate', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Template_Id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Field_Name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Field_Type: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Field_Req: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Field_Attr: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Table_field: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Created_By: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Export_type: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Asset_Template',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Asset_Te__C5B6F0D21F9B366F",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};

module.exports = { _AssetTemplate }