const Sequelize = require('sequelize');
const _EmpExperience = function(sequelize, DataTypes) {
  return sequelize.define('EmpExperience', {
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
    Emp_Company: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Emp_Designation: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Emp_Responsibility: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Emp_From_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Emp_To_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Emp_Settlement_Done: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Emp_Drawn_Salary: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Emp_Leaving_Reason: {
      type: DataTypes.STRING(50),
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
    tableName: 'Emp_Experience',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Emp_Expe__C5B2047ABC9ABACF",
        unique: true,
        fields: [
          { name: "Utd" },
        ]
      },
    ]
  });
};
const Joi = require('joi');

const empExperienceSchema = Joi.object({
    Emp_Company: Joi.string().max(30).allow(null).allow(''),
    Emp_Designation: Joi.string().max(30).allow(null).allow(''),
    Emp_Responsibility: Joi.string().max(30).allow(null).allow(''),
    Emp_From_Date: Joi.date().allow(null).allow('').raw(),
    Emp_To_Date: Joi.date().allow(null).allow('').raw(),
    Emp_Settlement_Done: Joi.string().max(30).allow(null).allow(''),
    Emp_Drawn_Salary: Joi.number().precision(19).max(9999999999999999.9999).allow(null).allow(''),
    Emp_Leaving_Reason: Joi.string().max(50).allow(null).allow(''),
});

module.exports = {empExperienceSchema,_EmpExperience};
