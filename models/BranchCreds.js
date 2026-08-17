const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BranchCreds', {
    Utd: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Godw_Code: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    ASP_Userid: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ASP_Pwd: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    API_Usrname: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    API_Pwd: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ASP_GSTIN: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    ASP_TockenId: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Bank_Name: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    Bank_Ac: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    Bank_Branch: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    Bank_IFSC: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    UPI_ID: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    Pymt_Link: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    Created_At: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'Branch_Creds',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Branch_C__C5B2047A5728B295",
        unique: true,
        fields: [
          { name: "Utd" },
        ]
      },
    ]
  });
};
