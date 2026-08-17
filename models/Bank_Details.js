const Sequelize = require('sequelize');
const _BANK_DETAILS = function (sequelize, DataTypes) {
  return sequelize.define('BANKDETAILS', {
    UTD: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      BANKNAME: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      ACCOUNT_TYPE: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      BANKACCOUNTNO: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      BRANCH: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      PAYMENTMODE: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      ifsc_code: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Emp_Ac_Name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Sal_Hold: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Export_Type: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Is_Verified: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Created_By: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      EMPCODE: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
  }, {
    sequelize,
    tableName: 'BANK_DETAILS',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Product___C5B6F0D28FFEE240",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};

module.exports = { _BANK_DETAILS };

