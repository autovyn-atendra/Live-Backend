const Sequelize = require('sequelize');
const _ApiLogs = function (sequelize, DataTypes) {
  return sequelize.define('ApiLogs', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Autovyn_request: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Req_option: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Req_value: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    Req_payload: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Response: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Response_status: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    COMP_CODE: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'Api_Logs',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Api_Logs__C5B6F0D24D95E11D",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};

module.exports = { _ApiLogs }
