const Sequelize = require('sequelize');

const _ManpowerBudget = function (sequelize, DataTypes) {
  return sequelize.define('ManpowerBudget', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Budget_Type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    value: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    positions: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    salary: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Created_by: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'Manpower_Budget',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_Manpower_Budget",
        unique: true,
        fields: [{ name: "UTD" }]
      }
    ]
  });
};
const Joi = require('joi');

const manpowerBudgetSchema = Joi.object({
  UTD: Joi.number().integer().optional(), // UTD is auto-incremented, so it's optional during creation
  Budget_Type: Joi.string().max(50).optional().allow(null), // Budget_Type is optional and can be null
  name: Joi.string().max(100).optional().allow(null), // name is optional and can be null
  value: Joi.string().max(100).optional().allow(null), // name is optional and can be null
  positions: Joi.number().optional().allow(null), // positions is optional and can be null
  salary: Joi.number().optional().allow(null), // salary is optional and can be null
  Created_by: Joi.string().max(100).optional().allow(null), // Created_by is optional and can be null
});

module.exports = { _ManpowerBudget,manpowerBudgetSchema };
