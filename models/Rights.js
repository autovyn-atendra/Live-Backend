const Sequelize = require('sequelize');
const _Rights = function (sequelize, DataTypes) {
  return sequelize.define('Rights', {
    Comp_Code: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    User_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Optn_Name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Optn_Valu: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    Module_Code: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    LOC_CODE: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    USR_CODE: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    SERVERID: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    UTD: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    }

  }, {
    sequelize,
    tableName: 'Rights',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "ClusteredIndex-20220719-130346",
        fields: [
          { name: "Comp_Code" },
          { name: "User_Code" },
          { name: "Optn_Name" },
          { name: "LOC_CODE" },
        ]
      },
    ]
  });
};

module.exports = {_Rights};