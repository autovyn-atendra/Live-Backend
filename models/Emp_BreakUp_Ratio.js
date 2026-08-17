const Sequelize = require('sequelize');

const _EmployeeMaster_Salary_BreakUp = function (sequelize, DataTypes) {
  return sequelize.define(
    'EmployeeMasterSalaryBreakUp',
    {
      UTD: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      Basic: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      HRA: {
        type: DataTypes.DECIMAL(10, 2), // ✅ precise 2 decimal digits
        allowNull: true,
      },
      Conveyance: {
        type: DataTypes.DECIMAL(10, 2), // ✅ 2 decimal places
        allowNull: true,
      },
      Medical: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      DA: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      Washing: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      Uniform: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      Created_By: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'EmployeeMaster_Salary_BreakUp',
      schema: 'dbo',
      timestamps: false,
      indexes: [
        {
          name: 'PK_EmployeeMaster_Salary_BreakUp',
          unique: true,
          fields: [{ name: 'UTD' }],
        },
      ],
    }
  );
};

const Joi = require('joi');

const EmployeeMasterSalaryBreakUpSchema = Joi.object({
  UTD: Joi.number().integer().optional(),
  Basic: Joi.string().max(20).optional(),
  HRA: Joi.number().precision(2).optional().allow(null, ''), // ✅ numeric with 2 decimals
  Conveyance: Joi.number().precision(2).optional().allow(null, ''),
  Medical: Joi.number().precision(2).optional().allow(null, ''),
  DA: Joi.number().precision(2).optional().allow(null, ''),
  Washing: Joi.number().precision(2).optional().allow(null, ''),
  Uniform: Joi.number().precision(2).optional().allow(null, ''),
  Created_By: Joi.string().max(255).optional().allow(null, ''),
});

module.exports = { _EmployeeMaster_Salary_BreakUp, EmployeeMasterSalaryBreakUpSchema };
