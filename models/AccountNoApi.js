const Sequelize = require('sequelize');
const _AccountNoApi = function (sequelize, DataTypes) {
  return sequelize.define('AccountNoApi', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Ifsc: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    account_number: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    code: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    message: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    account_exists: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    name_at_bank: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    transaction_id: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    raw_response: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Created_At: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Account_No_Api',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: 'unique_ifsc_account_number',
        unique: true,
        fields: ['Ifsc', 'account_number']
      }
    ]
  });
};

module.exports = { _AccountNoApi }