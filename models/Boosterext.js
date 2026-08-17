const Sequelize = require('sequelize');
const _Booster_ext = function (sequelize, DataTypes) {
  return sequelize.define('Boosterext', {
    UTD: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      DisbAmt: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      ffin_code: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      invoice_no: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      invoice_date: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      Created_By: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      export_type: {
        type: DataTypes.INTEGER,
        allowNull: true,
      }
  }, {
    sequelize,
    tableName: 'Booster_ext',
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

const BoosterextSchema = Joi.object({
    UTD: Joi.number().integer().optional(),
    DisbAmt: Joi.string().max(100).optional(),
    ffin_code: Joi.string().max(100).optional(),
    invoice_no: Joi.string().max(100).optional(),
    invoice_date: Joi.date().optional(),
    location: Joi.string().max(10).optional(),
    Created_By: Joi.string().max(255).optional(),
    export_type: Joi.number().integer().optional(),
});

module.exports = { _Booster_ext, BoosterextSchema };

