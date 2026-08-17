const Sequelize = require('sequelize');
const _IfscCodeApi = function (sequelize, DataTypes) {
  return sequelize.define('IfscCodeApi', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    IFSC: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    MICR: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    BRANCH: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    ADDRESS: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    STATE: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    CONTACT: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    UPI: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    RTGS: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    CITY: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    CENTRE: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    DISTRICT: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    NEFT: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    IMPS: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    SWIFT: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    ISO3166: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    BANK: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    BANKCODE: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    ACCOUNT_NO: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    CreatedDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'IFSC_CODE_API',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: 'unique_ifsc_account_number',
        unique: true,
        fields: ['IFSC']
      },
    ]
  });
};


module.exports = { _IfscCodeApi }