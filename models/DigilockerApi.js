const Sequelize = require('sequelize');
const _DigilockerApi = function (sequelize, DataTypes) {
  return sequelize.define('DigilockerApi', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    mobile_number: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    authorization_url: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    session_id: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    pan_number: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    aadharData: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    panData: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    drivingLicenseData: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Regenerate: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    aadhaar_number: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    driving_license: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'Digilocker_Api',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: 'unique_ifsc_account_number',
        unique: true,
        fields: ["mobile_number", "session_id"]
      }
    ]
  });
};


module.exports = { _DigilockerApi }