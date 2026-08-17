const Sequelize = require('sequelize');
const _MandatoryFields = function (sequelize, DataTypes) {
  return sequelize.define('MandatoryFields', {
    Utd: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Form_Name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Field_Name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Label_Id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Field_Id: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Table_ColumnName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Is_Mandatory: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    created_by: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    Is_Image: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Mandatory_Fields',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Mandator__C5B2047A18424B6C",
        unique: true,
        fields: [
          { name: "Utd" },
        ]
      },
    ]
  });
};


module.exports = { _MandatoryFields }