const Sequelize = require('sequelize');
const _IDTO_VERIFICATION_API = function (sequelize, DataTypes) {
  return sequelize.define('IdtoVerificationApi', {
    utd: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    api_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    payload_hash: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    payload_json: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    vendor_response: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_success: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'IDTO_VERIFICATION_API',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['api_name', 'payload_hash']
      }
    ]
  });
};
module.exports = { _IDTO_VERIFICATION_API };
