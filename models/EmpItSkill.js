const Sequelize = require('sequelize');
const _EmpItSkill = function(sequelize, DataTypes) {
  return sequelize.define('EmpItSkill', {
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
    Emp_Tool: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Emp_Version: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Emp_Proficiency: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Emp_Last_Used: {
      type: DataTypes.STRING(4),
      allowNull: true
    },
    Emp_Experience: {
      type: DataTypes.STRING(4),
      allowNull: true
    },
    Created_by: {
      type: DataTypes.STRING(30),
      allowNull: false
    } ,
    Created_At: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'Emp_ITSkill',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Emp_ITSk__C5B2047A4E0ED750",
        unique: true,
        fields: [
          { name: "Utd" },
        ]
      },
    ]
  });
};
const Joi = require('joi');

const empItSkillSchema = Joi.object({

    Emp_Tool: Joi.string().max(30).allow(null).allow(''),
    Emp_Version: Joi.string().max(30).allow(null).allow(''),
    Emp_Proficiency: Joi.string().max(30).allow(null).allow(''),
    Emp_Last_Used: Joi.string().max(4).allow(null).allow(''),
    Emp_Experience: Joi.string().max(4).allow(null).allow(''),
});

module.exports = {empItSkillSchema,_EmpItSkill};
