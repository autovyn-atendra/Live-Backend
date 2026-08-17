const Sequelize = require('sequelize');
const _WhatsAppUserConsent = function (sequelize, DataTypes) {
  return sequelize.define('WhatsAppUserConsent', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      phoneNo: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      msg_name: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      compcode: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      date: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      flag: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      OKFLAG: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      OKTIME: {
        type: DataTypes.TIME,
        allowNull: true,
      },
  }, {
    sequelize,
    tableName: 'WhatsAppUserConsent',
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

module.exports = { _WhatsAppUserConsent  };

