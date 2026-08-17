const Sequelize = require('sequelize');
const _EmpEdu = function(sequelize, DataTypes) {
  return sequelize.define('EmpEdu', {
    Utd: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    SRNO: {
      type: DataTypes.INTEGER,
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
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Created_by: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    Created_At: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    } 
  }, {
    sequelize,
    tableName: 'Emp_Edu',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Emp_Edu__C5B2047A5AF226FD",
        unique: true,
        fields: [
          { name: "Utd" },
        ]
      },
    ]
  });
};

const Joi = require('joi');

const empEduSchema = Joi.object({
    Emp_Degree: Joi.string().max(30).allow(null).allow(''),
    Emp_Board: Joi.string().max(30).allow(null).allow(''),
    Emp_College: Joi.string().max(30).allow(null).allow(''),
    Emp_Passing_year: Joi.string().max(4).allow(null).allow(''),
    Emp_Percentage: Joi.number().precision(19).max(9999999999999999.9999).allow(null).allow(''),
});

module.exports = {empEduSchema,_EmpEdu};
