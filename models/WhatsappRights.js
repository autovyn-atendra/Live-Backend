const Sequelize = require('sequelize');
const _WhatsappRights = function (sequelize, DataTypes) {
  return sequelize.define('WhatsappRights', {
    UTD: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      compcode: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      Module_Code: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      Module_Name: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      Date: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      Flag: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      Created_By: {
        type: DataTypes.STRING(255),
        allowNull: true,
      }
  }, {
    sequelize,
    tableName: 'WhatsappRights',
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

const WhatsappRightsSchema = Joi.object({
    UTD: Joi.number().integer().optional(),
    comcpode: Joi.string().max(20).optional(),
    Module_Code: Joi.string().max(20).optional(),
    Module_Name: Joi.string().max(200).optional(),
    Date: Joi.date().optional(),
    Flag: Joi.string().max(10).optional(),
    Created_By: Joi.string().max(255).optional(),
});

module.exports = { _WhatsappRights, WhatsappRightsSchema };

