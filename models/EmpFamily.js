const Sequelize = require('sequelize');
const _EmpFamily = function(sequelize, DataTypes) {
  return sequelize.define('EmpFamily', {
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
    Emp_Family_name: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Emp_Family_DOB: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Emp_Family_Relation: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Emp_Family_Address: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Emp_Family_Bloodgroup: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Emp_Family_Gender: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Emp_Family_Mobileno: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Emp_Family_emailid: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Emp_Family_Profession: {
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
    tableName: 'Emp_Family',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Emp_Fami__C5B2047A68E8A37F",
        unique: true,
        fields: [
          { name: "Utd" },
        ]
      },
    ]
  });
};
const Joi = require('joi');

const empFamilySchema = Joi.object({

    Emp_Family_name: Joi.string().max(30).allow(null).allow(''),
    Emp_Family_DOB: Joi.date().allow(null).allow('').raw(),
    Emp_Family_Relation: Joi.string().max(30).allow(null).allow(''),
    Emp_Family_Address: Joi.string().max(30).allow(null).allow(''),
    Emp_Family_Bloodgroup: Joi.string().max(30).allow(null).allow(''),
    Emp_Family_Gender: Joi.string().max(30).allow(null).allow(''),
    Emp_Family_Mobileno: Joi.string().max(30).allow(null).allow(''),
    Emp_Family_emailid: Joi.string().email().max(30).allow(null).allow(''),
    Emp_Family_Profession: Joi.string().max(30).allow(null).allow(''),
});

module.exports = {empFamilySchema,_EmpFamily};
