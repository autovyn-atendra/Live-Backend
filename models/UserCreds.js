const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('UserCreds', {
    User_Code: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    User_Name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: "UQ__User_Cre__681E8A606870B394"
    },
    Password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    User_Email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    User_mob: {
      type: DataTypes.STRING(13),
      allowNull: true
    },
    Multi_Loc: {
      type: DataTypes.STRING(355),
      allowNull: true
    },
    Module_Code: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Export_Type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Expiry_Date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Created_At: {
      type: DataTypes.DATE,
      allowNull: true,
    } 
  }, {
    sequelize,
    tableName: 'User_Creds',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__User_Cre__3E6D1F3547ACC351",
        unique: true,
        fields: [
          { name: "User_Code" },
        ]
      },
      {
        name: "UQ__User_Cre__681E8A606870B394",
        unique: true,
        fields: [
          { name: "User_Name" },
        ]
      },
    ]
  });
};
