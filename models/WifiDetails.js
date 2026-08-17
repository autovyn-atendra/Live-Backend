const Sequelize = require("sequelize");
const _WifiDetails = function (sequelize, DataTypes) {
  return sequelize.define(
    "WifiDetails",
    {
      WifiID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      SSID: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      BSSID: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Capabilities: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      SignalStrength: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      Frequency: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      ChannelWidth: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      EmpCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      BranchName: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      BranchCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      DeviceType: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Max_Strength_Allowed: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      Is_Activited: {
        type: DataTypes.STRING(5),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "WifiDetails",
      schema: "dbo",
      timestamps: false,
      indexes: [
        {
          name: "PK_WifiDetails",
          unique: true,
          fields: [{ name: "WifiID" }],
        },
      ],
    }
  );
};

const Joi = require("joi");

const WifiDetailsSchema = Joi.object({
  SSID: Joi.string().max(255).allow(null, ""),
  BSSID: Joi.string().max(50).allow(null, ""),
  Capabilities: Joi.string().max(500).allow(null, ""),
  SignalStrength: Joi.string().max(200).allow(null, ""),
  Frequency: Joi.string().max(200).allow(null, ""),
  ChannelWidth: Joi.string().max(200).allow(null, ""),
  EmpCode: Joi.string().max(50).allow(null, ""),
  BranchName: Joi.string().max(255).allow(null, ""),
  BranchCode: Joi.string().max(50).allow(null, ""),
  DeviceType: Joi.string().max(50).allow(null, ""),
  Max_Strength_Allowed: Joi.string().max(10).allow(null, ""),
  Is_Activited: Joi.string().max(5).allow(null, ""),
});

module.exports = {
  _WifiDetails,
  WifiDetailsSchema,
};
