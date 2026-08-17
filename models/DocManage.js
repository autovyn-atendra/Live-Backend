const Sequelize = require('sequelize');
const _DocManage = function (sequelize, DataTypes) {
  return sequelize.define('DocManage', {
    Utd: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    DocType: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    RefId: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Keywords: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    OriginalName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    SMBPath: {
      type: DataTypes.STRING(1024),
      allowNull: false
    },
    UploadedBy: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    EmpCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    CreatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    Export_Type: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    TableField: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'DocManage',
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

module.exports = { _DocManage }