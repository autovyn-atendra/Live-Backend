const Sequelize = require('sequelize');
const _EmpLang = function(sequelize, DataTypes) {
  return sequelize.define('EmpLang', {
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
    Emp_Language: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Emp_Language_Understand: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Emp_Language_Speak: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Emp_Language_Read: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Emp_Language_Write: {
      type: DataTypes.STRING(30),
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
    tableName: 'Emp_Lang',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Emp_Lang__C5B2047A82B862E8",
        unique: true,
        fields: [
          { name: "Utd" },
        ]
      },
    ]
  });
};
const Joi = require('joi');

const empLangSchema = Joi.object({
    Emp_Language: Joi.string().max(30).allow(null).allow(''),
    Emp_Language_Understand: Joi.string().max(30).allow(null).allow(''),
    Emp_Language_Speak: Joi.string().max(30).allow(null).allow(''),
    Emp_Language_Read: Joi.string().max(30).allow(null).allow(''),
    Emp_Language_Write: Joi.string().max(30).allow(null).allow(''),
});

module.exports = {empLangSchema,_EmpLang};
