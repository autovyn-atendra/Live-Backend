const Sequelize = require('sequelize');
const _NewJoining = function(sequelize, DataTypes) {
  return sequelize.define('NewJoining', {
    TRAN_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    NAME: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    MOB_NO: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    WHATSAPP_NO: {
      type: DataTypes.CHAR(15),
      allowNull: true
    },
    ADDRESS: {
      type: DataTypes.CHAR(150),
      allowNull: true
    },
    PINCODE: {
      type: DataTypes.CHAR(10),
      allowNull: true
    },
    STATE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CITY: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    HIGH_QUAL: {
      type: DataTypes.CHAR(50),
      allowNull: true
    },
    PASSING_PER: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    FATHERS_NAME: {
      type: DataTypes.CHAR(80),
      allowNull: true
    },
    GENDER: {
      type: DataTypes.CHAR(20),
      allowNull: true
    },
    MOTHERS_NAME: {
      type: DataTypes.CHAR(80),
      allowNull: true
    },
    EXP_IN_YEAR: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CURRENT_CTC: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    LOC_CODE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DESIGNATION: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    EMAIL: {
      type: DataTypes.CHAR(50),
      allowNull: true
    },
    AADHAR_NO: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    DOB: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    
    RELIGION: {
      type: DataTypes.CHAR(10),
      allowNull: true
    },
    APPLICATION_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    INT_STATUS: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    INTR1DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    INTR1TIME: {
      type: DataTypes.TIME,
      allowNull: true
    },
    INTR2TIME: {
      type: DataTypes.TIME,
      allowNull: true
    },
    INTR2DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    INTR1BY: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    INTR2BY: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    INTR3BY: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    INTR4BY: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    INTR4TIME: {
      type: DataTypes.TIME,
      allowNull: true
    },
    INTR3TIME: {
      type: DataTypes.TIME,
      allowNull: true
    },
    INTR3DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    INTR4DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    REJECTION_REMARK: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    INTR1STATUS: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    INTR2STATUS: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    INTR3STATUS: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    INTR4STATUS: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    SKILLS: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    SOURCE_OF_REG: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    INTR1REMARK: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    INTR1RATING: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    INTR1SALARY: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    INTR2REMARK: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    INTR2RATING: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    INTR2SALARY: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    INTR4REMARK: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    INTR4RATING: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    INTR4SALARY: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    INTR3REMARK: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    INTR3RATING: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    INTR3SALARY: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    UNIQUE_ID: {
      type: DataTypes.STRING(100),
      allowNull: true
    } ,
  }, {
    sequelize,
    tableName: 'New_Joining',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__New_Join__C5B6F0D22DDDBF8E",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};

const Joi = require('joi');

const NewJoiningSchema = Joi.object({
  TRAN_ID:Joi.number().integer().optional(),
  NAME: Joi.string().max(80).allow(null).allow(''),
  MOB_NO: Joi.string().max(15).allow(null).allow(''),
  WHATSAPP_NO: Joi.string().max(15).allow(null).allow(''),
  ADDRESS: Joi.string().max(150).allow(null).allow(''),
  PINCODE: Joi.string().max(10).allow(null).allow(''),
  STATE: Joi.number().integer().allow(null).allow(''),
  CITY: Joi.number().allow(null).allow(''),
  HIGH_QUAL: Joi.string().max(50).allow(null).allow(''),
  PASSING_PER: Joi.number().integer().allow(null).allow(''),
  FATHERS_NAME: Joi.string().max(80).allow(null).allow(''),
  GENDER: Joi.number().allow(null).allow(''),
  MOTHERS_NAME: Joi.string().max(80).allow(null).allow(''),
  EXP_IN_YEAR: Joi.number().integer().allow(null).allow(''),
  CURRENT_CTC: Joi.number().precision(19).allow(null).allow(''),
  LOC_CODE: Joi.number().integer().allow(null).allow(''),
  DESIGNATION: Joi.number().allow(null).allow(''),
  EMAIL: Joi.string().max(50).allow(null).allow(''),
  AADHAR_NO: Joi.string().max(20).allow(null).allow(''),
  DOB: Joi.date().raw().allow(null).allow(''),
  DOM: Joi.date().raw().allow(null).allow(''),
  RELIGION: Joi.number().allow(null).allow(''),
  APPLICATION_DATE: Joi.date().raw().allow(null).allow(''),
  INT_STATUS: Joi.number().integer().allow(null).allow(''),
  INTR1DATE: Joi.date().raw().allow(null).allow(''),
  INTR1TIME: Joi.date().raw().allow(null).allow(''),
  INTR2TIME: Joi.date().raw().allow(null).allow(''),
  INTR2DATE: Joi.date().raw().allow(null).allow(''),
  INTR1BY: Joi.string().max(25).allow(null).allow(''),
  INTR2BY: Joi.string().max(25).allow(null).allow(''),
  INTR3BY: Joi.string().max(25).allow(null).allow(''),
  INTR4BY: Joi.string().max(25).allow(null).allow(''),
  INTR4TIME: Joi.date().raw().allow(null).allow(''),
  INTR3TIME: Joi.date().raw().allow(null).allow(''),
  INTR3DATE: Joi.date().raw().allow(null).allow(''),
  INTR4DATE: Joi.date().raw().allow(null).allow(''),
  REJECTION_REMARK: Joi.string().max(200).allow(null).allow(''),
  INTR1STATUS: Joi.number().integer().allow(null).allow(''),
  INTR2STATUS: Joi.number().integer().allow(null).allow(''),
  INTR3STATUS: Joi.number().integer().allow(null).allow(''),
  INTR4STATUS: Joi.number().integer().allow(null).allow(''),
  SKILLS: Joi.number().allow(null).allow(''),
  SOURCE_OF_REG: Joi.number().integer().allow(null).allow(''),
  INTR1REMARK: Joi.string().max(100).allow(null).allow(''),
  INTR1RATING: Joi.number().integer().allow(null).allow(''),
  INTR1SALARY: Joi.number().precision(19).allow(null).allow(''),
  INTR2REMARK: Joi.string().max(100).allow(null).allow(''),
  INTR2RATING: Joi.number().integer().allow(null).allow(''),
  INTR2SALARY: Joi.number().precision(19).allow(null).allow(''),
  INTR4REMARK: Joi.string().max(100).allow(null).allow(''),
  INTR4RATING: Joi.number().integer().allow(null).allow(''),
  INTR4SALARY: Joi.number().precision(19).allow(null).allow(''),
  INTR3REMARK: Joi.string().max(100).allow(null).allow(''),
  INTR3RATING: Joi.number().integer().allow(null).allow(''),
  INTR3SALARY: Joi.number().precision(19).allow(null).allow(''),
  UNIQUE_ID: Joi.string().max(100).allow(null).allow('')
});

module.exports = { _NewJoining, NewJoiningSchema };
