const Sequelize = require("sequelize");
const _Employeemaster = function (sequelize, DataTypes) {
  return sequelize.define(
    "Employeemaster",
    {
      UTD: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      SRNO: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      PAN_CARD_VER: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      AADHAR_CARD_VER: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      DRIVING_VER: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      PASSPORT_VER: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      RESIGNATION_SUBMISSION_DATE: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      REASON_FOR_RESIGNATION: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      TEN_LEAVE_DATE: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      SEPERATIONREMARKS: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      SEPARATION_MODE: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      DATE_OF_SETTLEMENT: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      INTERVIEWREMAKS: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      ExitInterview_Done: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      DATE_OF_EXIT_INTERVIEW: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      EXP_IN_YEAR: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },

Source_Code: {
  type: DataTypes.STRING(20),
  allowNull: true,
},

      EMPCODE: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      MSPIN: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      TITLE: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      EMPFIRSTNAME: {
        type: DataTypes.STRING(150),
        allowNull: true,
        set(value) {
          this.setDataValue("EMPFIRSTNAME", value?.toUpperCase() || "");
        }
      },
      EMPLASTNAME: {
        type: DataTypes.STRING(150),
        allowNull: false,          // important
        defaultValue: '',          // default ''
        set(value) {
          if (value === null || value === undefined || value.trim() === '') {
            this.setDataValue('EMPLASTNAME', '');
          } else {
            this.setDataValue('EMPLASTNAME', value.toUpperCase());
          }
        }
      },
      PERMANENTADDRESS1: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      PERMANENTADDRESS2: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      PCITY: {
        type: DataTypes.SMALLINT,
        allowNull: true,
      },
      PPINCODE: {
        type: DataTypes.STRING(12),
        allowNull: true,
      },
      PSTATE: {
        type: DataTypes.SMALLINT,
        allowNull: true,
      },
      CURRENTADDRESS1: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      CURRENTADDRESS2: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      CCITY: {
        type: DataTypes.SMALLINT,
        allowNull: true,
      },
      CPINCODE: {
        type: DataTypes.STRING(12),
        allowNull: true,
      },
      CSTATE: {
        type: DataTypes.SMALLINT,
        allowNull: true,
      },
      LANDLINENO: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },
      MOBILENO: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },
      EMERGENCYNAME: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      EMERGENCYNO: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },
      PANNO: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },
      PFNO: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },
      ESINO: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },
      PASSPORTNO: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },
      PASSEXPIRYDATE: {
        type: "SMALLDATETIME",
        allowNull: true,
      },
      BLOODGROUP: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      DOB: {
        type: "SMALLDATETIME",
        allowNull: true,
      },
      GENDER: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      MARITALSTATUS: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      DOM: {
        type: "SMALLDATETIME",
        allowNull: true,
      },
      SKILLS: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },
      BASICQUALIFICATION: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      PROFESSIONALQUALIFICATION: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      FATHERNAME: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      FATHEROCCUPATION: {
        type: DataTypes.SMALLINT,
        allowNull: true,
      },
      FATHERCONTACTNO: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },
      MOTHERNAME: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      MOTHERCONTACTNO: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },
      SPOUSENAME: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      SPOUSECONTACTNO: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },
      SPOUSEGENDER: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      SIBLINGNAME: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      SIBLINGCONTACTNO: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },
      PREVIOUSCOMPANYNAME: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      PRECOMPCITY: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      PRECOMPCONTACTNO: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },
      PREJOININGDATE: {
        type: "SMALLDATETIME",
        allowNull: true,
      },
      PREENDDATE: {
        type: "SMALLDATETIME",
        allowNull: true,
      },
      PREDESIGNATION: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      EMPREFERENCENAME: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      REFERENCEDESIGNATION: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      ISMEDICALATTENTION: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      ISSERIOUSILLNESS: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      ISALLERGIES: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      CORPORATEMAILID: {
        type: DataTypes.STRING(70),
        allowNull: true,
      },
      CURRENTJOINDATE: {
        type: "SMALLDATETIME",
        allowNull: true,
      },
      PAYMENTMODE: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      BANKNAME: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      BANKACCOUNTNO: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      EMPLOYEETYPE: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      ORGANISATIONNAME: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      SBU_FUNCTION: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      DIVISION: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      REGION: {
        type: DataTypes.SMALLINT,
        allowNull: true,
      },
      UNIT: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },
      SECTION: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },
      LEVEL: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },
      LOCATION: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      ROLE: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      EMPLOYEEDESIGNATION: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      GRADE: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      SUPERVISORID: {
        type: DataTypes.SMALLINT,
        allowNull: true,
      },
      SUPERVISOR: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      ISTIMEVALIDATION: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },
      ISPAYROLL: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },
      PAYCYCLEDURATION: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      PROBATIONPERIOD: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      PROBATIONLEAVES: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      NOTICEPERIOD: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      RELCODE: {
        type: DataTypes.SMALLINT,
        allowNull: true,
      },
      Exp_Date: {
        type: "SMALLDATETIME",
        allowNull: true,
      },
      Export_Type: {
        type: DataTypes.TINYINT,
        allowNull: true,
      },
      Loc_Code: {
        type: DataTypes.SMALLINT,
        allowNull: true,
      },
      ServerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      DRIVINGLIC_ISSUEDATE: {
        type: "SMALLDATETIME",
        allowNull: true,
      },
      DRIVINGLIC_ISSUEPALACE: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      ACCOUNT_TYPE: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      PFTRUST_NO: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },
      EMPHEIGHT: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },
      EMPWEIGHT: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },
      P_NATIONALITY: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },
      UID_NO: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      ALTERNET_MAIL: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      EMPDEPENDENT: {
        type: DataTypes.SMALLINT,
        allowNull: true,
      },
      CHILDREN_DETAIL: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      LANGUAGE_DETAIL: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      NOMINEE_DETAIL: {
        type: DataTypes.SMALLINT,
        allowNull: true,
      },
      EMP_SHIFT: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      PF: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },
      PFSALARY_LIMIT: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },
      LWF: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },
      ESI_AMOUNT: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },
      BONUS_AMOUNT: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },
      MONTHLY_CTC: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },
      ANNUAL_CTC: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },
      COMP_NAME: {
        type: DataTypes.STRING(70),
        allowNull: true,
      },
      JOINING_TYPE: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      BRANCH: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      EMP_STATUS: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      USR_NAME: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      APPLICATION_ID: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      APPROVED_AUTHO: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      CREATED_BY: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
        CONTRACT_NUMBER: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },


      // MACHINE_NAME: {
      //   type: DataTypes.STRING(50),
      //   allowNull: true,
      // },
      CREATED_ON: {
        type: "SMALLDATETIME",
        allowNull: true,
      },
      LASTMODI_BY: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      LASTMODI_ON: {
        type: "SMALLDATETIME",
        allowNull: true,
      },
      BIOMETRIC_ID: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },
      PROPOSEDRETIRE_DATE: {
        type: "SMALLDATETIME",
        allowNull: true,
      },
      LASTWOR_DATE: {
        type: "SMALLDATETIME",
        allowNull: true,
      },
      RELEVE_STATUS: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },
      ADUSER_NAME: {
        type: DataTypes.STRING(40),
        allowNull: true,
      },
      EXT_NO: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      AUTOMAILER: {
        type: DataTypes.STRING(3),
        allowNull: true,
      },
      WEEKLYOFF: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      RESIGN_APPR: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      AX_EMP_CODE: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      AX_BAL: {
        type: DataTypes.REAL,
        allowNull: true,
      },
      Prob_period: {
        type: "SMALLDATETIME",
        allowNull: true,
      },
      empcode2: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      empcode3: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      empcode4: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      ADHARNO: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      pfnumber: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      esinumber: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      ein: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      mobile_limit: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      Rec_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      ifsc_code: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      MOBILE_NO: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      pre_Exp: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      landline_no: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      uidno: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      CNATIONALITY: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Father_Mob: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      Mother_Mob: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      Spouse_Mob: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      pfper: {
        type: DataTypes.REAL,
        allowNull: true,
      },
      esiper: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },
      IEMI: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      IsRW: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Reporting_1: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      Reporting_2: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      Reporting_3: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      App_Mispunch: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      App_Leave: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      App_Attendance: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      InBudget: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      Induction_Done: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },

      Sal_Region: {
        type: DataTypes.SMALLINT,
        allowNull: true,
      },
      Tocken_Id: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Interview_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      LWFNO: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Emp_Ac_Name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      PF_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        set(value) {
          if (!value || value === '') {
            this.setDataValue('PF_Date', null);
          } else {
            this.setDataValue('PF_Date', value);
          }
        }
      },
      ESI_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        set(value) {
          if (!value || value === '') {
            this.setDataValue('ESI_Date', null);
          } else {
            this.setDataValue('ESI_Date', value);
          }
        }
      },
      PASSPORT_EXPDATE: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      Punch_Type: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      PAY_CODE: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      Sal_Hold: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Relaxation_Type: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      ShiftIn_Relaxation: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },
      ShiftOut_Relaxation: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },
      Cumulative_Relaxation: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },
      Spl_Rem: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      Acnt_Loc: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      UAN_No: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      EmpType: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      FCM_TockenId: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      TCS_Rate: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      MSPN_Id: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      Android_ID: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: '',
        set(value) {
          if (value === null || value === undefined || value.trim() === '') {
            this.setDataValue('Android_ID', '');
          } else {
            this.setDataValue('Android_ID', value);
          }
        }
      },
      // multi_loc: {
      //   type: DataTypes.STRING(100),
      //   allowNull: true,
      // },
      Ledger_Code: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      IsMSPN: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      MSPN_DTL: {
        type: DataTypes.STRING(70),
        allowNull: true,
      },
      ESI_DEDUCTION: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      PF_DEDUCTION: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      pro_tax: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Token: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      Is_Profile_Filled: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      driving_licence: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      columndoc_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      mPunch: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      mApprove: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      mMispunch: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      mLeave: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      mCalender: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      mDeviceLog: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      mAttendanceLog: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      mLocationLog: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      mToDoList: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      mSuggestions: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      mUpdateIMEI: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      mTrackingReport: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      mLiveLocation: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      mAssetScan: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      mGeoFenceSetting: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      CATEGORY: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      CLUSTER: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      CHANNEL: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      COSTCENTRE: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      BONUS: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },
      LIN_NO: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      Dlv_Type: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },
      DRIVINGLIC_EXPDATE: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      MOBILE_RIGHTS: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },
      Confirmation_Date: {
        type: "SMALLDATETIME",
        allowNull: true,
      },
      Confirmed_By: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Marital_Status: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      CDIST: {
        type: DataTypes.SMALLINT,
        allowNull: true
      },
      PDIST: {
        type: DataTypes.SMALLINT,
        allowNull: true
      },
      DD_CLUB: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      Apprentice_Date_From: {
        type: DataTypes.DATE,
        allowNull: true
      },
      Apprentice_Date_To: {
        type: DataTypes.DATE,
        allowNull: true
      },
      Inserted_By: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      GEOOFFENCELOC: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      RESIGNED_STATUS: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
        SEPRATION_CATE: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      // mUserGeoLocation: {
      //   type: DataTypes.STRING(1),
      //   allowNull: true,
      // },
      // Created_At: {
      //   type: DataTypes.DATE,
      //   allowNull: false,

      // }
    },
    {
      sequelize,
      tableName: "EMPLOYEEMASTER",
      schema: "dbo",
      timestamps: false,
      indexes: [
        {
          name: "PK__EMPLOYEE__C5B6F0D2CD78DFC6",
          unique: true,
          fields: [{ name: "UTD" }],
        },
      ],
    }
  );
};

const Joi = require("joi");

const EmployeemasterSchema = Joi.object({

  PAN_CARD_VER: Joi.boolean().allow(null).allow(''),
  AADHAR_CARD_VER: Joi.boolean().allow(null).allow(''),
  PASSPORT_VER: Joi.boolean().allow(null).allow(''),
  DRIVING_VER: Joi.boolean().allow(null).allow(''),
  RESIGNATION_SUBMISSION_DATE: Joi.date().raw().allow(null).allow(''),
  REASON_FOR_RESIGNATION: Joi.string().max(500).allow(null).allow(''),
  TEN_LEAVE_DATE: Joi.date().raw().allow(null).allow(''),
  SEPERATIONREMARKS: Joi.string().max(500).allow(null).allow(''),
  SEPARATION_MODE: Joi.string().max(200).allow(null).allow(''),
  DATE_OF_SETTLEMENT: Joi.date().raw().allow(null).allow(''),
  INTERVIEWREMAKS: Joi.string().max(500).allow(null).allow(''),
  ExitInterview_Done: Joi.string().max(200).allow(null).allow(''),
  DATE_OF_EXIT_INTERVIEW: Joi.date().raw().allow(null).allow(''),
  EXP_IN_YEAR: Joi.string().max(10).allow(null).allow(''),




Source_Code: Joi.string().max(20).allow(null).allow(''),
  EMPCODE: Joi.string().max(100).required(),
  MSPIN: Joi.string().max(50).allow(null).allow(''),
  TITLE: Joi.string().max(15).allow(null).allow(''),
  EMPFIRSTNAME: Joi.string().max(150).allow(null).allow(''),
  EMPLASTNAME: Joi.string().max(150).allow(null).allow(''),
  PERMANENTADDRESS1: Joi.string().max(250).allow(null).allow(''),
  PERMANENTADDRESS2: Joi.string().max(150).allow(null).allow(''),
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
  PFNO: Joi.string().max(25).allow(null).allow(''),
  ESINO: Joi.string().max(25).allow(null).allow(''),
  PASSPORTNO: Joi.string().max(25).allow(null).allow(''),
  PASSEXPIRYDATE: Joi.date().raw().allow(null).allow(''),
  BLOODGROUP: Joi.string().max(15).allow(null).allow(''),
  DOB: Joi.date().raw().allow(null).allow(''),
  GENDER: Joi.string().max(15).allow(null).allow(''),
  MARITALSTATUS: Joi.string().max(15).allow(null).allow(''),
  DOM: Joi.date().raw().allow(null).allow(''),
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
  PRECOMPCITY: Joi.string().max(10).allow(null).allow(''),
  PRECOMPCONTACTNO: Joi.string().max(25).allow(null).allow(''),
  PREJOININGDATE: Joi.date().raw().allow(null).allow(''),
  PREENDDATE: Joi.date().raw().allow(null).allow(''),
  PREDESIGNATION: Joi.string().max(50).allow(null).allow(''),
  EMPREFERENCENAME: Joi.string().max(100).allow(null).allow(''),
  REFERENCEDESIGNATION: Joi.string().max(50).allow(null).allow(''),
  ISMEDICALATTENTION: Joi.string().max(30).allow(null).allow(''),
  ISSERIOUSILLNESS: Joi.string().max(30).allow(null).allow(''),
  ISALLERGIES: Joi.string().max(30).allow(null).allow(''),
  CORPORATEMAILID: Joi.string().max(70).allow(null).allow(''),
  CURRENTJOINDATE: Joi.date().raw().allow(null).allow(''),
  PAYMENTMODE: Joi.string().max(15).allow(null).allow(''),
  BANKNAME: Joi.string().max(100).allow(null).allow(''),
  BANKACCOUNTNO: Joi.string().max(100).allow(null).allow(''),
  EMPLOYEETYPE: Joi.string().max(30).allow(null).allow(''),
  ORGANISATIONNAME: Joi.string().max(100).allow(null).allow(''),
  SBU_FUNCTION: Joi.string().max(30).allow(null).allow(''),
  DIVISION: Joi.string().max(30).allow(null).allow(''),
  REGION: Joi.number().integer().allow(null).allow(''),
  UNIT: Joi.string().max(25).allow(null).allow(''),
  SECTION: Joi.string().max(25).allow(null).allow(''),
  LEVEL: Joi.string().max(25).allow(null).allow(''),
  LOCATION: Joi.string().max(30).allow(null).allow(''),
  ROLE: Joi.string().max(50).allow(null).allow(''),
  EMPLOYEEDESIGNATION: Joi.string().max(50).allow(null).allow(''),
  GRADE: Joi.string().max(30).allow(null).allow(''),
  SUPERVISORID: Joi.number().integer().allow(null).allow(''),
  SUPERVISOR: Joi.string().max(50).allow(null).allow(''),
  ISTIMEVALIDATION: Joi.string().max(25).allow(null).allow(''),
  ISPAYROLL: Joi.string().max(25).allow(null).allow(''),
  PAYCYCLEDURATION: Joi.string().max(50).allow(null).allow(''),
  PROBATIONPERIOD: Joi.string().max(20).allow(null).allow(''),
  PROBATIONLEAVES: Joi.string().max(20).allow(null).allow(''),
  NOTICEPERIOD: Joi.string().max(200).allow(null).allow(''),
  RELCODE: Joi.string().max(10).allow(null).allow(''),
  Exp_Date: Joi.date().raw().allow(null).allow(''),
  Export_Type: Joi.number().integer().required(),
  Loc_Code: Joi.number().integer().allow(null).allow(''),
  ServerId: Joi.number().integer().required(),
  DRIVINGLIC_ISSUEDATE: Joi.date().raw().allow(null).allow(''),
  DRIVINGLIC_ISSUEPALACE: Joi.string().max(30).allow(null).allow(''),
  ACCOUNT_TYPE: Joi.string().max(15).allow(null).allow(''),
  PFTRUST_NO: Joi.string().max(25).allow(null).allow(''),
  EMPHEIGHT: Joi.number().precision(19).allow(null).allow(''),
  EMPWEIGHT: Joi.number().precision(19).allow(null).allow(''),
  P_NATIONALITY: Joi.string().max(25).allow(null).allow(''),
  UID_NO: Joi.string().max(30).allow(null).allow(''),
  ALTERNET_MAIL: Joi.string().max(30).allow(null).allow(''),
  EMPDEPENDENT: Joi.number().integer().allow(null).allow(''),
  CHILDREN_DETAIL: Joi.string().max(150).allow(null).allow(''),
  LANGUAGE_DETAIL: Joi.string().max(150).allow(null).allow(''),
  NOMINEE_DETAIL: Joi.number().integer().allow(null).allow(''),
  EMP_SHIFT: Joi.string().max(30).allow(null).allow(''),
  PF: Joi.number().precision(19).allow(null).allow(''),
  PFSALARY_LIMIT: Joi.number().precision(19).allow(null).allow(''),
  LWF: Joi.number().precision(19).allow(null).allow(''),
  ESI_AMOUNT: Joi.number().precision(19).allow(null).allow(''),
  BONUS_AMOUNT: Joi.number().precision(19).allow(null).allow(''),
  MONTHLY_CTC: Joi.number().precision(19).allow(null).allow(''),
  ANNUAL_CTC: Joi.number().precision(19).allow(null).allow(''),
  COMP_NAME: Joi.string().max(70).allow(null).allow(''),
  JOINING_TYPE: Joi.string().max(30).allow(null).allow(''),
  BRANCH: Joi.string().max(500).allow(null).allow(''),
  EMP_STATUS: Joi.string().max(20).allow(null).allow(''),
  USR_NAME: Joi.string().max(50).allow(null).allow(''),
  APPLICATION_ID: Joi.string().max(30).allow(null).allow(''),
  APPROVED_AUTHO: Joi.string().max(30).allow(null).allow(''),
  CREATED_BY: Joi.string().max(20).allow(null).allow(''),
  CONTRACT_NUMBER: Joi.string().max(25).allow(null).allow(''),

  // MACHINE_NAME: Joi.string().max(50).allow(null).allow(''),

  CREATED_ON: Joi.date().raw().allow(null).allow(''),
  LASTMODI_BY: Joi.string().max(20).allow(null).allow(''),
  LASTMODI_ON: Joi.date().raw().allow(null).allow(''),
  BIOMETRIC_ID: Joi.string().max(25).allow(null).allow(''),
  PROPOSEDRETIRE_DATE: Joi.date().raw().allow(null).allow(''),
  LASTWOR_DATE: Joi.date().raw().allow(null).allow(''),
  RELEVE_STATUS: Joi.string().max(25).allow(null).allow(''),
  ADUSER_NAME: Joi.string().max(40).allow(null).allow(''),
  EXT_NO: Joi.string().max(20).allow(null).allow(''),
  AUTOMAILER: Joi.string().max(3).allow(null).allow(''),
  WEEKLYOFF: Joi.string().max(15).allow(null).allow(''),
  RESIGN_APPR: Joi.string().max(10).allow(null).allow(''),
  AX_EMP_CODE: Joi.string().max(200).allow(null).allow(''),
  AX_BAL: Joi.number().allow(null).allow(''),
  Prob_period: Joi.date().raw().allow(null).allow(''),
  empcode2: Joi.string().max(30).allow(null).allow(''),
  empcode3: Joi.string().max(30).allow(null).allow(''),
  empcode4: Joi.string().max(30).allow(null).allow(''),
  ADHARNO: Joi.string().max(50).allow(null).allow(''),
  pfnumber: Joi.string().max(30).allow(null).allow(''),
  esinumber: Joi.string().max(30).allow(null).allow(''),
  ein: Joi.string().max(100).allow(null).allow(''),
  mobile_limit: Joi.string().max(10).allow(null).allow(''),
  Rec_Date: Joi.date().raw().allow(null).allow(''),
  ifsc_code: Joi.string().max(100).allow(null).allow(''),
  MOBILE_NO: Joi.string().max(15).allow(null).allow(''),
  pre_Exp: Joi.string().max(100).allow(null).allow(''),
  landline_no: Joi.string().max(15).allow(null).allow(''),
  uidno: Joi.string().max(20).allow(null).allow(''),
  CNATIONALITY: Joi.string().max(50).allow(null).allow(''),
  Father_Mob: Joi.string().max(30).allow(null).allow(''),
  Mother_Mob: Joi.string().max(30).allow(null).allow(''),
  Spouse_Mob: Joi.string().max(30).allow(null).allow(''),
  pfper: Joi.number().allow(null).allow(''),
  esiper: Joi.number().precision(19).allow(null).allow(''),
  IEMI: Joi.string().max(15).allow(null).allow(''),
  IsRW: Joi.number().integer().allow(null).allow(''),
  Reporting_1: Joi.string().max(30).allow(null).allow(''),
  Reporting_2: Joi.string().max(30).allow(null).allow(''),
  Reporting_3: Joi.string().max(30).allow(null).allow(''),
  App_Mispunch: Joi.string().max(10).allow(null).allow(''),
  App_Leave: Joi.string().max(10).allow(null).allow(''),
  App_Attendance: Joi.string().max(10).allow(null).allow(''),
  InBudget: Joi.boolean().allow(null).allow(''),
  Induction_Done: Joi.boolean().allow(null).allow(''),

  Sal_Region: Joi.number().integer().allow(null).allow(''),
  Tocken_Id: Joi.string().max(50).allow(null).allow(''),
  Interview_Date: Joi.date().raw().allow(null).allow(''),
  LWFNO: Joi.number().integer().allow(null).allow(''),
  Emp_Ac_Name: Joi.string().max(50).allow(null).allow(''),
  PF_Date: Joi.alternatives().try(
    Joi.date().iso(),
    Joi.string().valid('').default(null),  // convert '' → null
    Joi.valid(null)
  ),
  ESI_Date:
    Joi.alternatives().try(
      Joi.date().iso(),
      Joi.string().valid('').default(null),  // convert '' → null
      Joi.valid(null)
    ),
  PASSPORT_EXPDATE: Joi.date().raw().allow(null).allow(''),
  // Punch_Type: Joi.number().integer().allow(null).allow(''),

  Punch_Type: Joi.number().max(15).allow(null).allow(''),

  PAY_CODE: Joi.string().max(30).allow(null).allow(''),
  Sal_Hold: Joi.number().integer().allow(null).allow(''),
  Relaxation_Type: Joi.number().integer().allow(null).allow(''),
  ShiftIn_Relaxation: Joi.number().precision(19).allow(null).allow(''),
  ShiftOut_Relaxation: Joi.number().precision(19).allow(null).allow(''),
  Cumulative_Relaxation: Joi.number().precision(19).allow(null).allow(''),
  Spl_Rem: Joi.string().max(500).allow(null).allow(''),
  Acnt_Loc: Joi.number().integer().allow(null).allow(''),
  UAN_No: Joi.string().max(50).allow(null).allow(''),
  EmpType: Joi.number().integer().allow(null).allow(''),
  FCM_TockenId: Joi.string().max(500).allow(null).allow(''),
  TCS_Rate: Joi.number().integer().allow(null).allow(''),
  MSPN_Id: Joi.string().max(30).allow(null).allow(''),
  Android_ID: Joi.string().max(100).allow(null).allow(''),
  multi_loc: Joi.string().max(100).allow(null).allow(''),
  Ledger_Code: Joi.number().integer().allow(null).allow(''),
  IsMSPN: Joi.number().integer().allow(null).allow(''),
  MSPN_DTL: Joi.string().max(70).allow(null).allow(''),
  ESI_DEDUCTION: Joi.number().integer().allow(null).allow(''),
  PF_DEDUCTION: Joi.number().integer().allow(null).allow(''),
  pro_tax: Joi.number().integer().allow(null).allow(''),
  Token: Joi.string().max(500).allow(null).allow(''),
  Is_Profile_Filled: Joi.number().integer().allow(null).allow(''),
  driving_licence: Joi.string().max(50).allow(null).allow(''),
  columndoc_type: Joi.string().max(50).allow(null).allow(''),
  mPunch: Joi.string().max(1).allow(null).allow(''),
  mApprove: Joi.string().max(1).allow(null).allow(''),
  mMispunch: Joi.string().max(1).allow(null).allow(''),
  mLeave: Joi.string().max(1).allow(null).allow(''),
  mCalender: Joi.string().max(1).allow(null).allow(''),
  mDeviceLog: Joi.string().max(1).allow(null).allow(''),
  mAttendanceLog: Joi.string().max(1).allow(null).allow(''),
  mLocationLog: Joi.string().max(1).allow(null).allow(''),
  mToDoList: Joi.string().max(1).allow(null).allow(''),
  mSuggestions: Joi.string().max(1).allow(null).allow(''),
  mUpdateIMEI: Joi.string().max(1).allow(null).allow(''),
  mTrackingReport: Joi.string().max(1).allow(null).allow(''),
  mLiveLocation: Joi.string().max(1).allow(null).allow(''),
  mAssetScan: Joi.string().max(1).allow(null).allow(''),
  mGeoFenceSetting: Joi.string().max(1).allow(null).allow(''),
  mUserGeoLocation: Joi.string().max(1).allow(null).allow(''),
  CATEGORY: Joi.number().allow(null).allow(''),
  CLUSTER: Joi.number().allow(null).allow(''),
  CHANNEL: Joi.number().allow(null).allow(''),
  COSTCENTRE: Joi.number().allow(null).allow(''),
  BONUS: Joi.string().max(25).allow(null).allow(''),
  DRIVINGLIC_EXPDATE: Joi.date().raw().allow(null).allow(''),
  LIN_NO: Joi.string().max(20).allow(null).allow(''),
  Dlv_Type: Joi.string().max(25).allow(null).allow(''),
  MOBILE_RIGHTS: Joi.number().precision(19).allow(null).allow(''),
  Confirmation_Date: Joi.date().raw().allow(null).allow(''),
  Confirmed_By: Joi.string().max(100).allow(null).allow(''),
  Marital_Status: Joi.number().integer().allow(null).allow(''),
  CDIST: Joi.number().integer().allow(null).allow(''),
  PDIST: Joi.number().integer().allow(null).allow(''),
  DD_CLUB: Joi.string().max(20).allow(null).allow(''),
  Apprentice_Date_To: Joi.date().raw().allow(null).allow(''),
  Apprentice_Date_From: Joi.date().raw().allow(null).allow(''),
  Inserted_By: Joi.string().max(50).allow(null).allow(''),
  GEOOFFENCELOC: Joi.string().max(500).allow(null).allow(''),
  RESIGNED_STATUS: Joi.string().max(200).allow(null).allow(''),
  SEPRATION_CATE: Joi.string().max(200).allow(null).allow(''),
});

module.exports = { _Employeemaster, EmployeemasterSchema };
