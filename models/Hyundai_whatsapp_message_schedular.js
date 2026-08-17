const Sequelize = require('sequelize');
const _Hyundai_whatsapp_message_schedular = function (sequelize, DataTypes) {
  return sequelize.define('Hyundaiwhatsappmessageschedular', {
    UTD: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      Dlr_Name: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      Message_Type: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      Days: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Hours: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      Created_By: {
        type: DataTypes.STRING(255),
        allowNull: true,
      }
  }, {
    sequelize,
    tableName: 'Hyundai_whatsapp_message_schedular',
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

const HyundaiwhatsappmessageschedularSchema = Joi.object({
    UTD: Joi.number().integer().optional(),
    Dlr_Name: Joi.string().max(10).optional(),
    Message_Type: Joi.string().max(200).optional(),
    Days: Joi.number().integer().optional(),
    Hours: Joi.string().max(10).optional(),
    Created_By: Joi.string().max(255).optional(),
});

module.exports = { _Hyundai_whatsapp_message_schedular, HyundaiwhatsappmessageschedularSchema };

