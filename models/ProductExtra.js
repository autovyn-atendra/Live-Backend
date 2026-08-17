const Sequelize = require('sequelize');
const _Product_Extra = function (sequelize, DataTypes) {
  return sequelize.define('ProductExtra', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    F_1: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    F_2: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    F_3: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    F_4: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    F_5: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    F_6: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    F_7: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    F_8: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    F_9: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    F_10: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    Asset_Product: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'Product_Extra',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Product___C5B6F0D2301A1FEB",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};
const Joi = require('joi');

const productExtraSchema = Joi.object({
  UTD: Joi.number()
    .integer()
    .positive()
    .optional(), // `autoIncrement` field will be handled by the database
  F_1: Joi.string()
    .max(150)
    .optional()
    .allow(null),
  F_2: Joi.string()
    .max(150)
    .optional()
    .allow(null),
  F_3: Joi.string()
    .max(150)
    .optional()
    .allow(null),
  F_4: Joi.string()
    .max(150)
    .optional()
    .allow(null),
  F_5: Joi.string()
    .max(150)
    .optional()
    .allow(null),
  F_6: Joi.string()
    .max(150)
    .optional()
    .allow(null),
  F_7: Joi.string()
    .max(150)
    .optional()
    .allow(null),
  F_8: Joi.string()
    .max(150)
    .optional()
    .allow(null),
  F_9: Joi.string()
    .max(150)
    .optional()
    .allow(null),
  F_10: Joi.string()
    .max(150)
    .optional()
    .allow(null),
  Asset_Product: Joi.string()
    .max(10)
    .optional()
    .allow(null),
});

module.exports = { _Product_Extra, productExtraSchema };
