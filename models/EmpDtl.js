const Sequelize = require('sequelize');
const _EmpDtl = function(sequelize, DataTypes) {
  return sequelize.define('EmpDtl', {
    Utd: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    SRNO: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Emp_Mst',
        key: 'SRNO'
      }
    },
    CURRENTJOINDATE: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    PAYMENTMODE: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    BANKNAME: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    BANKACCOUNTNO: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    EMPLOYEETYPE: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    ORGANISATIONNAME: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    SBU_FUNCTION: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    DIVISION: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    REGION: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    UNIT: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    SECTION: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    LEVEL: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    uidno: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    pfper: {
      type: DataTypes.REAL,
      allowNull: true
    },
    esiper: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    PFNO: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    ESINO: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Ledger_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Acnt_Loc: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    UAN_No: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    EmpType: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    IsMSPN: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MSPN_DTL: {
      type: DataTypes.STRING(70),
      allowNull: true
    },
    ESI_DEDUCTION: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    PF_DEDUCTION: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    pro_tax: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    TCS_Rate: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Rec_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    ifsc_code: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    pre_Exp: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Interview_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Sal_Region: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    LWFNO: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Emp_Ac_Name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    PF_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    ESI_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    PASSPORT_EXPDATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Punch_Type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    PAY_CODE: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Sal_Hold: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    InBudget: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    Induction_Done: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    ExitInterview_Done: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    LOCATION: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ROLE: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    EMPLOYEEDESIGNATION: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    GRADE: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    SUPERVISORID: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    SUPERVISOR: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ISTIMEVALIDATION: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    ISPAYROLL: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    PAYCYCLEDURATION: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    PROBATIONPERIOD: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    PROBATIONLEAVES: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    NOTICEPERIOD: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    RELCODE: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Exp_Date: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    Export_Type: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    Loc_Code: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    ServerId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DRIVINGLIC_ISSUEDATE: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    DRIVINGLIC_ISSUEPALACE: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    ACCOUNT_TYPE: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    PFTRUST_NO: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    EMPHEIGHT: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    EMPWEIGHT: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    P_NATIONALITY: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    UID_NO: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    ALTERNET_MAIL: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    EMPDEPENDENT: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    CHILDREN_DETAIL: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    LANGUAGE_DETAIL: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    NOMINEE_DETAIL: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    EMP_SHIFT: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    PF: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    PFSALARY_LIMIT: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    LWF: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    ESI_AMOUNT: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    BONUS_AMOUNT: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    MONTHLY_CTC: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    ANNUAL_CTC: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    COMP_NAME: {
      type: DataTypes.STRING(70),
      allowNull: true
    },
    JOINING_TYPE: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    BRANCH: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    EMP_STATUS: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    USR_NAME: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    APPLICATION_ID: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    APPROVED_AUTHO: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    BIOMETRIC_ID: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    PROPOSEDRETIRE_DATE: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    LASTWOR_DATE: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    RELEVE_STATUS: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    ADUSER_NAME: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    EXT_NO: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    AUTOMAILER: {
      type: DataTypes.STRING(3),
      allowNull: true
    },
    WEEKLYOFF: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    RESIGN_APPR: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    AX_EMP_CODE: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    AX_BAL: {
      type: DataTypes.REAL,
      allowNull: true
    },
    Prob_period: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    empcode2: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    empcode3: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    empcode4: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    ADHARNO: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    pfnumber: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    esinumber: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    ein: {
      type: DataTypes.STRING(100),
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
    tableName: 'Emp_Dtl',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Emp_Dtl__C5B2047AB16F7B8E",
        unique: true,
        fields: [
          { name: "Utd" },
        ]
      },
    ]
  });
};

const Joi = require('joi');

const EmpDtlSchema = Joi.object({
  CURRENTJOINDATE: Joi.date().allow(null).allow('').raw(),
  PAYMENTMODE: Joi.string().max(15).allow(null).allow(''),
  BANKNAME: Joi.string().max(100).allow(null).allow(''),
  BANKACCOUNTNO: Joi.string().max(30).allow(null).allow(''),
  EMPLOYEETYPE: Joi.string().max(30).allow(null).allow(''),
  ORGANISATIONNAME: Joi.string().max(100).allow(null).allow(''),
  SBU_FUNCTION: Joi.string().max(30).allow(null).allow(''),
  DIVISION: Joi.number().allow(null).allow(''),
  REGION: Joi.number().integer().allow(null).allow(''),
  UNIT: Joi.string().max(25).allow(null).allow(''),
  SECTION: Joi.number().allow(null).allow(''),
  LEVEL: Joi.string().max(25).allow(null).allow(''),
  uidno: Joi.string().max(20).allow(null).allow(''),
  pfper: Joi.number().allow(null).allow(''),
  esiper: Joi.number().allow(null).allow(''),
  PFNO: Joi.string().max(25).allow(null).allow(''),
  ESINO: Joi.string().max(25).allow(null).allow(''),
  Ledger_Code: Joi.number().integer().allow(null).allow(''),
  Acnt_Loc: Joi.number().integer().allow(null).allow(''),
  UAN_No: Joi.string().max(50).allow(null).allow(''),
  EmpType: Joi.number().integer().allow(null).allow(''),
  IsMSPN: Joi.number().integer().allow(null).allow(''),
  MSPN_DTL: Joi.string().max(70).allow(null).allow(''),
  ESI_DEDUCTION: Joi.number().integer().allow(null).allow(''),
  PF_DEDUCTION: Joi.number().integer().allow(null).allow(''),
  pro_tax: Joi.number().integer().allow(null).allow(''),
  TCS_Rate: Joi.number().integer().allow(null).allow(''),
  Rec_Date: Joi.date().allow(null).allow('').raw(),
  ifsc_code: Joi.string().max(100).allow(null).allow(''),
  pre_Exp: Joi.string().max(100).allow(null).allow(''),
  Interview_Date: Joi.date().allow(null).allow('').raw(),
  Sal_Region: Joi.number().integer().allow(null).allow(''),
  LWFNO: Joi.number().integer().allow(null).allow(''),
  Emp_Ac_Name: Joi.string().max(50).allow(null).allow(''),
  PF_Date: Joi.date().allow(null).allow('').raw(),
  ESI_Date: Joi.date().allow(null).allow('').raw(),
  PASSPORT_EXPDATE: Joi.date().allow(null).allow('').raw(),
  Punch_Type: Joi.number().integer().allow(null).allow(''),
  PAY_CODE: Joi.string().max(30).allow(null).allow(''),
  Sal_Hold: Joi.number().integer().allow(null).allow(''),
  InBudget: Joi.boolean().allow(null).allow(''),
  Induction_Done: Joi.boolean().allow(null).allow(''),
  ExitInterview_Done: Joi.boolean().allow(null).allow(''),
  LOCATION: Joi.number().allow(null).allow(''),
  ROLE: Joi.string().max(50).allow(null).allow(''),
  EMPLOYEEDESIGNATION: Joi.number().allow(null).allow(''),
  GRADE: Joi.string().max(30).allow(null).allow(''),
  SUPERVISORID: Joi.number().integer().allow(null).allow(''),
  SUPERVISOR: Joi.string().max(50).allow(null).allow(''),
  ISTIMEVALIDATION: Joi.string().max(25).allow(null).allow(''),
  ISPAYROLL: Joi.string().max(25).allow(null).allow(''),
  PAYCYCLEDURATION: Joi.string().max(50).allow(null).allow(''),
  PROBATIONPERIOD: Joi.string().max(20).allow(null).allow(''),
  PROBATIONLEAVES: Joi.string().max(20).allow(null).allow(''),
  NOTICEPERIOD: Joi.string().max(20).allow(null).allow(''),
  RELCODE: Joi.number().integer().allow(null).allow(''),
  Exp_Date: Joi.date().allow(null).allow('').raw(),
  Export_Type: Joi.number().integer().allow(null).allow(''),
  Loc_Code: Joi.number().integer().allow(null).allow(''),
  ServerId: Joi.number().integer().allow(null).allow(''),
  DRIVINGLIC_ISSUEDATE: Joi.date().allow(null).allow('').raw(),
  DRIVINGLIC_ISSUEPALACE: Joi.string().max(30).allow(null).allow(''),
  ACCOUNT_TYPE: Joi.string().max(15).allow(null).allow(''),
  PFTRUST_NO: Joi.string().max(25).allow(null).allow(''),
  EMPHEIGHT: Joi.number().allow(null).allow(''),
  EMPWEIGHT: Joi.number().allow(null).allow(''),
  P_NATIONALITY: Joi.string().max(25).allow(null).allow(''),
  UID_NO: Joi.string().max(30).allow(null).allow(''),
  ALTERNET_MAIL: Joi.string().max(30).allow(null).allow(''),
  EMPDEPENDENT: Joi.number().integer().allow(null).allow(''),
  CHILDREN_DETAIL: Joi.string().max(150).allow(null).allow(''),
  LANGUAGE_DETAIL: Joi.string().max(150).allow(null).allow(''),
  NOMINEE_DETAIL: Joi.number().integer().allow(null).allow(''),
  EMP_SHIFT: Joi.string().max(30).allow(null).allow(''),
  PF: Joi.number().allow(null).allow(''),
  PFSALARY_LIMIT: Joi.number().allow(null).allow(''),
  LWF: Joi.number().allow(null).allow(''),
  ESI_AMOUNT: Joi.number().allow(null).allow(''),
  BONUS_AMOUNT: Joi.number().allow(null).allow(''),
  MONTHLY_CTC: Joi.number().allow(null).allow(''),
  ANNUAL_CTC: Joi.number().allow(null).allow(''),
  COMP_NAME: Joi.string().max(70).allow(null).allow(''),
  JOINING_TYPE: Joi.string().max(30).allow(null).allow(''),
  BRANCH: Joi.string().max(50).allow(null).allow(''),
  EMP_STATUS: Joi.string().max(20).allow(null).allow(''),
  USR_NAME: Joi.string().max(50).allow(null).allow(''),
  APPLICATION_ID: Joi.string().max(30).allow(null).allow(''),
  APPROVED_AUTHO: Joi.string().max(30).allow(null).allow(''),
  BIOMETRIC_ID: Joi.string().max(25).allow(null).allow(''),
  PROPOSEDRETIRE_DATE: Joi.date().allow(null).allow('').raw(),
  LASTWOR_DATE: Joi.date().allow(null).allow('').raw(),
  RELEVE_STATUS: Joi.string().max(25).allow(null).allow(''),
  ADUSER_NAME: Joi.string().max(40).allow(null).allow(''),
  EXT_NO: Joi.string().max(20).allow(null).allow(''),
  AUTOMAILER: Joi.string().max(3).allow(null).allow(''),
  WEEKLYOFF: Joi.string().max(15).allow(null).allow(''),
  RESIGN_APPR: Joi.string().max(10).allow(null).allow(''),
  AX_EMP_CODE: Joi.string().max(200).allow(null).allow(''),
  AX_BAL: Joi.number().allow(null).allow(''),
  Prob_period: Joi.date().allow(null).allow('').raw(),
  empcode2: Joi.string().max(30).allow(null).allow(''),
  empcode3: Joi.string().max(30).allow(null).allow(''),
  empcode4: Joi.string().max(30).allow(null).allow(''),
  ADHARNO: Joi.string().max(50).allow(null).allow(''),
  pfnumber: Joi.string().max(30).allow(null).allow(''),
  esinumber: Joi.string().max(30).allow(null).allow(''),
  ein: Joi.string().max(100).allow(null).allow(''),
});


module.exports = {EmpDtlSchema,_EmpDtl};
