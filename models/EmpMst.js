const Sequelize = require('sequelize');
const _EmpMst = function(sequelize, DataTypes) {
  return sequelize.define('EmpMst', {
    SRNO: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    EMPCODE: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: "UQ__Emp_Mst__21EDEE6C0B027D21"
    },
    MSPIN: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    TITLE: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    EMPFIRSTNAME: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    EMPLASTNAME: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    PERMANENTADDRESS1: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    PERMANENTADDRESS2: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    MOBILE_NO: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    landline_no: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    Father_Mob: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Mother_Mob: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Spouse_Mob: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    CNATIONALITY: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    PCITY: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    PPINCODE: {
      type: DataTypes.STRING(12),
      allowNull: true
    },
    PSTATE: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    CURRENTADDRESS1: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    CURRENTADDRESS2: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    CCITY: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    CPINCODE: {
      type: DataTypes.STRING(12),
      allowNull: true
    },
    CSTATE: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    LANDLINENO: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    MOBILENO: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    EMERGENCYNAME: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    EMERGENCYNO: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    PANNO: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    PASSPORTNO: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    PASSEXPIRYDATE: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    driving_licence: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    columndoc_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    BLOODGROUP: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    DOB: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    GENDER: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    MARITALSTATUS: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    DOM: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    SKILLS: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    BASICQUALIFICATION: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    PROFESSIONALQUALIFICATION: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    FATHERNAME: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    FATHEROCCUPATION: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    FATHERCONTACTNO: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    MOTHERNAME: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    MOTHERCONTACTNO: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    SPOUSENAME: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    SPOUSECONTACTNO: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    SPOUSEGENDER: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    SIBLINGNAME: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    SIBLINGCONTACTNO: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    PREVIOUSCOMPANYNAME: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    PRECOMPCITY: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    PRECOMPCONTACTNO: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    PREJOININGDATE: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    PREENDDATE: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    PREDESIGNATION: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    EMPREFERENCENAME: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    REFERENCEDESIGNATION: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ISMEDICALATTENTION: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    ISSERIOUSILLNESS: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    ISALLERGIES: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    CORPORATEMAILID: {
      type: DataTypes.STRING(70),
      allowNull: true
    },
    Created_by: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Created_At: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'Emp_Mst',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Emp_Mst__A091E37A230B4869",
        unique: true,
        fields: [
          { name: "SRNO" },
        ]
      },
      {
        name: "UQ__Emp_Mst__21EDEE6C0B027D21",
        unique: true,
        fields: [
          { name: "EMPCODE" },
        ]
      },
    ]
  });
};

const Joi = require('joi');

const EmpMstSchema = Joi.object({
  EMPCODE: Joi.string().max(100).allow(null).allow(''),
  MSPIN: Joi.string().max(50).allow(null).allow(''),
  TITLE: Joi.string().max(15).allow(null).allow(''),
  EMPFIRSTNAME: Joi.string().max(150).allow(null).allow(''),
  EMPLASTNAME: Joi.string().max(150).allow(null).allow(''),
  PERMANENTADDRESS1: Joi.string().max(250).allow(null).allow(''),
  PERMANENTADDRESS2: Joi.string().max(150).allow(null).allow(''),
  MOBILE_NO: Joi.string().max(15).allow(null).allow(''),
  landline_no: Joi.string().max(15).allow(null).allow(''),
  Father_Mob: Joi.string().max(30).allow(null).allow(''),
  Mother_Mob: Joi.string().max(30).allow(null).allow(''),
  Spouse_Mob: Joi.string().max(30).allow(null).allow(''),
  CNATIONALITY: Joi.string().max(50).allow(null).allow(''),
  PCITY: Joi.number().integer().allow(null).allow(''),
  PPINCODE: Joi.string().max(12).allow(null).allow(''),
  PSTATE: Joi.number().integer().allow(null).allow(''),
  CURRENTADDRESS1: Joi.string().max(250).allow(null).allow(''),
  CURRENTADDRESS2: Joi.string().max(150).allow(null).allow(''),
  CCITY: Joi.number().integer().allow(null).allow(''),
  CPINCODE: Joi.string().max(12).allow(null).allow(''),
  CSTATE: Joi.number().integer().allow(null).allow(''),
  LANDLINENO: Joi.string().max(25).allow(null).allow(''),
  MOBILENO: Joi.string().max(25).allow(null).allow(''),
  EMERGENCYNAME: Joi.string().max(100).allow(null).allow(''),
  EMERGENCYNO: Joi.string().max(25).allow(null).allow(''),
  PANNO: Joi.string().max(25).allow(null).allow(''),
  PASSPORTNO: Joi.string().max(25).allow(null).allow(''),
  PASSEXPIRYDATE: Joi.date().allow(null).allow('').raw(),
  driving_licence: Joi.string().max(50).allow(null).allow(''),
  columndoc_type: Joi.string().max(50).allow(null).allow(''),
  BLOODGROUP: Joi.string().max(15).allow(null).allow(''),
  DOB: Joi.date().allow(null).allow('').allow(' ').raw(),
  GENDER: Joi.string().max(15).allow(null).allow(''),
  MARITALSTATUS: Joi.string().max(15).allow(null).allow(''),
  DOM: Joi.date().allow(null).allow('').raw(),
  SKILLS: Joi.string().max(25).allow(null).allow(''),
  BASICQUALIFICATION: Joi.string().max(50).allow(null).allow(''),
  PROFESSIONALQUALIFICATION: Joi.string().max(50).allow(null).allow(''),
  FATHERNAME: Joi.string().max(100).allow(null).allow(''),
  FATHEROCCUPATION: Joi.number().integer().allow(null).allow(''),
  FATHERCONTACTNO: Joi.string().max(25).allow(null).allow(''),
  MOTHERNAME: Joi.string().max(100).allow(null).allow(''),
  MOTHERCONTACTNO: Joi.string().max(25).allow(null).allow(''),
  SPOUSENAME: Joi.string().max(100).allow(null).allow(''),
  SPOUSECONTACTNO: Joi.string().max(25).allow(null).allow(''),
  SPOUSEGENDER: Joi.string().max(15).allow(null).allow(''),
  SIBLINGNAME: Joi.string().max(100).allow(null).allow(''),
  SIBLINGCONTACTNO: Joi.string().max(25).allow(null).allow(''),
  PREVIOUSCOMPANYNAME: Joi.string().max(100).allow(null).allow(''),
  PRECOMPCITY: Joi.number().integer().allow(null).allow(''),
  PRECOMPCONTACTNO: Joi.string().max(25).allow(null).allow(''),
  PREJOININGDATE: Joi.date().allow(null).allow('').raw(),
  PREENDDATE: Joi.date().allow(null).allow('').raw(),
  PREDESIGNATION: Joi.string().max(50).allow(null).allow(''),
  EMPREFERENCENAME: Joi.string().max(100).allow(null).allow(''),
  REFERENCEDESIGNATION: Joi.string().max(50).allow(null).allow(''),
  ISMEDICALATTENTION: Joi.string().max(30).allow(null).allow(''),
  ISSERIOUSILLNESS: Joi.string().max(30).allow(null).allow(''),
  ISALLERGIES: Joi.string().max(30).allow(null).allow(''),
  CORPORATEMAILID: Joi.string().max(70).allow(null).allow(''),
});

module.exports = { _EmpMst, EmpMstSchema };