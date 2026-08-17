const Sequelize = require('sequelize');
const _InsuComp = function (sequelize, DataTypes) {
  return sequelize.define('InsuComp', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Insurance_Company: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Perferred: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Valid_From: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Valid_Upto: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Loc_Code: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Created_By: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'Insu_Comp',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Insu_Com__C5B6F0D220671437",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};
const Joi = require('joi');

const validateInsuComp = Joi.object({
  UTD: Joi.number().integer().positive().optional(),// Auto-incremented field; typically not required for input
  Insurance_Company: Joi.string().max(100).allow(null).optional(),
  Perferred: Joi.string().max(20).allow(null).optional(),
  Valid_From: Joi.date().iso().allow(null).optional(),
  Valid_Upto: Joi.date().iso().allow(null).optional(),
  Loc_Code: Joi.alternatives().try(
    Joi.string().max(50).allow(null).optional(), // String, max length 50, nullable, optional
    Joi.number().allow(null).optional()           // Number, nullable, optional
  ),
  Created_By: Joi.string().max(255).allow(null).optional(),
});

module.exports = { _InsuComp, validateInsuComp };
