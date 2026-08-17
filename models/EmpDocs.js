const Sequelize = require('sequelize');

const _EmpDocs = function(sequelize, DataTypes) {
  return sequelize.define('EmpDocs', {
    Utd: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    EMP_CODE: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    DOC_NAME: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    DOC_PATH: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    columndoc_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    dateOffice: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    misspunch_inout: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    Created_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    refindex: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Seq_No: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'Emp_Docs',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Emp_Docs__C5B2047A674823D7",
        unique: true,
        fields: [
          { name: "Utd" },
        ]
      },
    ]
  });
};
const Joi = require('joi');

const empDocsValidationSchema = Joi.object({
  EMP_CODE: Joi.string().max(20).required(),
  DOC_NAME: Joi.string().max(100),
  DOC_PATH: Joi.string().max(300),
  columndoc_type: Joi.string().max(50),
  dateOffice: Joi.date().allow(null).allow('').raw(),
  misspunch_inout: Joi.number().integer().min(0).max(255),
  Created_Date: Joi.date().iso().required(),
  refindex: Joi.string().max(20),
  refindex: Joi.number().integer().allow(null, ''),

});
module.exports = { _EmpDocs , empDocsValidationSchema };
