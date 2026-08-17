const Sequelize = require('sequelize');
const _DealSheetMaster = function (sequelize, DataTypes) {
  return sequelize.define('DealSheetMaster', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Branch: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    validfrom: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    validTo: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    CREATED_BY: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'DealSheet_Master',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__DealShee__C5B6F0D25D65ABD0",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};
const Joi = require('joi');
const dealSheetMasterSchema = Joi.object({
  UTD: Joi.number().integer().positive().optional(),
  name: Joi.string()
    .max(50)
    .optional()
    .allow(null), // Optional, up to 50 characters, can be null

  Branch: Joi.alternatives().try(
    Joi.string().max(50).allow(null).optional(), // String, max length 50, nullable, optional
    Joi.number().allow(null).optional()           // Number, nullable, optional
  ),// Optional, up to 50 characters, can be null

  amount: Joi.number()
    .precision(2)
    .optional()
    .allow(null), // Optional, decimal with up to 2 decimal places, can be null

  validfrom: Joi.date()
    .iso()
    .optional()
    .allow(null), // Optional, ISO date format, can be null

  validTo: Joi.date()
    .iso()
    .optional()
    .allow(null), // Optional, ISO date format, can be null

  CREATED_BY: Joi.string()
    .max(200)
    .optional()
    .allow(null), // Optional, up to 200 characters, can be null
});

module.exports = { _DealSheetMaster, dealSheetMasterSchema };
