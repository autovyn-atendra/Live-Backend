const Sequelize = require('sequelize');
const _DOC_UPLOAD = function (sequelize, DataTypes) {
  return sequelize.define('DOC_UPLOAD', {
    TRAN_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Doc_Type: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    SRNO: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    path: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    File_Name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    User_Name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Upload_Date: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Export_Type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Keywords: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'DOC_UPLOAD',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Uploaded__C5B2047AD4E97158",
        unique: true,
        fields: [
          { name: "Utd" },
        ]
      },
    ]
  });
};

module.exports = { _DOC_UPLOAD }