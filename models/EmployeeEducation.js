const Sequelize = require('sequelize');

const _EmployeeEducation = function (sequelize, DataTypes) {
  return sequelize.define('Employee_Education', {
    Utd: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    Emp_Code: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Emp_Srno: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Emp_Degree: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Emp_Board: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Emp_College: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Emp_Passing_year: {
      type: DataTypes.STRING(4),
      allowNull: true
    },
    Emp_Percentage: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Export_Type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Loc_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Serverid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    SrNo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    LASTMODI_BY: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    LASTMODI_ON: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    CREATED_BY: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    CREATED_ON: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Employee_Education',
    schema: 'dbo',
    timestamps: false,
  });
};

const Joi = require('joi');

const employeeEducationSchema = Joi.object({
  Emp_Code: Joi.string().max(10).allow(null).allow(''),
  Emp_Srno: Joi.string().max(10).allow(null).allow(''),
  Emp_Degree: Joi.string().max(30).allow(null).allow(''),
  Emp_Board: Joi.string().max(30).allow(null).allow(''),
  Emp_College: Joi.string().max(30).allow(null).allow(''),
  Emp_Passing_year: Joi.string().max(4).allow(null).allow(''),
  Emp_Percentage: Joi.number().precision(4).allow(null).allow(''),
  Export_Type: Joi.number().integer().allow(null),
  Loc_Code: Joi.number().integer().allow(null),
  Serverid: Joi.number().integer().allow(null),
  SrNo: Joi.number().integer().allow(null),
  LASTMODI_BY: Joi.string().max(50).allow(null).allow(''),
  LASTMODI_ON: Joi.date().allow(null),
  CREATED_BY: Joi.string().max(50).allow(null).allow(''),
  CREATED_ON: Joi.date().allow(null)
});

module.exports = {
  _EmployeeEducation,
  employeeEducationSchema
};
