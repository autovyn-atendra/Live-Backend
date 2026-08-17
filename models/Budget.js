const Sequelize = require('sequelize');
const Joi = require('joi');

const _Budget = function(sequelize, DataTypes) {
  return sequelize.define('Budget', {
    Utd: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    TYPE: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    CATEGORY: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    LOC_CODE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    UNIT: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    VALUE: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Created_by: {
      type: DataTypes.STRING(30),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'BUDGET',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__BUDGET__C5B2047AF29992E6",
        unique: true,
        fields: [
          { name: "Utd" },
        ]
      },
    ]
  });
};



const BudgetSchema = Joi.object({
  TYPE: Joi.string().max(40).allow(null).allow(''),
  CATEGORY: Joi.string().max(40).allow(null).allow(''),
  LOC_CODE: Joi.number().integer().allow(null).allow(''),
  UNIT: Joi.number().integer().allow(null).allow(''),
  VALUE: Joi.number().allow(null).allow(''),
  Created_by: Joi.string().max(30).required(),
});

module.exports = {_Budget, BudgetSchema};
