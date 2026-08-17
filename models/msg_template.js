const Sequelize = require('sequelize');
const _MSGTEMPLATE = function (sequelize, DataTypes) {
  return sequelize.define('MSGTEMPLATE', {
    UTD: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      AUTOVYN_TEMPLATE: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      WABA_TEMPLATE: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
  }, {
    sequelize,
    tableName: 'MSG_TEMPLATE',
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

const Joi = require('joi');

const MSGTEMPLATESchema = Joi.object({
    UTD: Joi.number().integer().optional(),
    AUTOVYN_TEMPLATE: Joi.string().max(100).optional(),
    WABA_TEMPLATE: Joi.string().max(100).optional(),
});

module.exports = { _MSGTEMPLATE, MSGTEMPLATESchema };

