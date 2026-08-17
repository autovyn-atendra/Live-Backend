const Sequelize = require('sequelize');
const _SalaryFile = function (sequelize, DataTypes) {
  return sequelize.define('SALARYFILE', {
    Emp_Code: {
        type: DataTypes.STRING(20),
        allowNull: true,
        primaryKey: true,
      },
      Monthdays: {
        type: DataTypes.SMALLINT,
        allowNull: true
      },
      Present_days: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      Off_days: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      Holiday_Leaves: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      Total_Days: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      Gross: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      Basic: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      HRA: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      CONVEN: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      Medical: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      Other: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      Total: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      Gross_Earn: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      Basic_Earn: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      HRA_Earn: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      CONVEN_Earn: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      Medical_Earn: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      Other_Earn: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      Total_Earn: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      Arrear: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      Deducation: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      Advance: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      Final_Payment: {
        type: DataTypes.DECIMAL(19, 4),
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
      pf_chk: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      esic_chk: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      pf_employee: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      pf_employer: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      pf_emplpension: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      pf_employer_admin: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      esic_employee: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      esic_employer: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      lwf_employee: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      lwf_employer: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      tds: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      mob_ded: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      oth_ded: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      EWF: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      Bonus: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      SalMnth: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      MISC_DED: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      MISC_EARN: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      P1P2_DED: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      PROF_TAX: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      Washing_Arr: {
        type: DataTypes.REAL,
        allowNull: true
      },
      Medical_Arr: {
        type: DataTypes.REAL,
        allowNull: true
      },
      Conv_Arr: {
        type: DataTypes.REAL,
        allowNull: true
      },
      Basic_Arr: {
        type: DataTypes.REAL,
        allowNull: true
      },
      HRA_Arr: {
        type: DataTypes.REAL,
        allowNull: true
      },
      salyear: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      ABSENTVALUE: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      LEAVEVALUE: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      iPad_ded: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      Mediclaim_ded: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      New_Uniform: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      Loan: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      Uni_Ded: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      Suspend_Days: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      PF_EDLI: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      HR_Aprvl: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Acnt_Aprvl: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Chq_Print: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Sal_Disbursh: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Chq_No: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      Chq_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      Disb_Pay: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Bank_Name: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      ChqPrint_Name: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Sal_Mode: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      Sal_OnHold: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Bank_Ledger: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      PymtVch_Print: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      AdvEmp_Ledger: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Adv_JV: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      HoldEmp_Ledger: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Hold_JV: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Washing: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      Washing_Earn: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      INC_BATCH: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      ENTRY_BATCH: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      Penulty: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      OutStanding: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      OT_Day: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      OT_Amt: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      ESIC_WAGES: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      Sal_Unpaid: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      Lock_By: {
        type: DataTypes.STRING(30),
        allowNull: true
      },
      Lock_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      Lock_Time: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true
      },
      Account_No: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      Emp_Type: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      Reg_Desc: {
        type: DataTypes.STRING(60),
        allowNull: true
      },
      Div_Desc: {
        type: DataTypes.STRING(80),
        allowNull: true
      },
      Sec_Desc: {
        type: DataTypes.STRING(80),
        allowNull: true
      },
      Desig_Desc: {
        type: DataTypes.STRING(120),
        allowNull: true
      }
  }, {
    sequelize,
    tableName: 'SALARYFILE',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Emp_Ded__C5B6F0D2FCF4550A",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};

const Joi = require('joi');

const SalaryFileSchema = Joi.object({
    Emp_Code: Joi.string().max(20).allow(null),
    Monthdays: Joi.number().integer().allow(null),
    Present_days: Joi.number().precision(4).allow(null),
    Off_days: Joi.number().precision(4).allow(null),
    Holiday_Leaves: Joi.number().precision(4).allow(null),
    Total_Days: Joi.number().precision(4).allow(null),
    Gross: Joi.number().precision(4).allow(null),
    Basic: Joi.number().precision(4).allow(null),
    HRA: Joi.number().precision(4).allow(null),
    CONVEN: Joi.number().precision(4).allow(null),
    Medical: Joi.number().precision(4).allow(null),
    Other: Joi.number().precision(4).allow(null),
    Total: Joi.number().precision(4).allow(null),
    Gross_Earn: Joi.number().precision(4).allow(null),
    Basic_Earn: Joi.number().precision(4).allow(null),
    HRA_Earn: Joi.number().precision(4).allow(null),
    CONVEN_Earn: Joi.number().precision(4).allow(null),
    Medical_Earn: Joi.number().precision(4).allow(null),
    Other_Earn: Joi.number().precision(4).allow(null),
    Total_Earn: Joi.number().precision(4).allow(null),
    Arrear: Joi.number().precision(4).allow(null),
    Deducation: Joi.number().precision(4).allow(null),
    Advance: Joi.number().precision(4).allow(null),
    Final_Payment: Joi.number().precision(4).allow(null),
    Loc_Code: Joi.number().integer().allow(null),
    ServerId: Joi.number().integer().allow(null),
    pf_chk: Joi.number().precision(4).allow(null),
    esic_chk: Joi.number().precision(4).allow(null),
    pf_employee: Joi.number().precision(4).allow(null),
    pf_employer: Joi.number().precision(4).allow(null),
    pf_emplpension: Joi.number().precision(4).allow(null),
    pf_employer_admin: Joi.number().precision(4).allow(null),
    esic_employee: Joi.number().precision(4).allow(null),
    esic_employer: Joi.number().precision(4).allow(null),
    lwf_employee: Joi.number().precision(4).allow(null),
    lwf_employer: Joi.number().precision(4).allow(null),
    tds: Joi.number().precision(4).allow(null),
    mob_ded: Joi.number().precision(4).allow(null),
    oth_ded: Joi.number().precision(4).allow(null),
    EWF: Joi.number().precision(4).allow(null),
    Bonus: Joi.number().precision(4).allow(null),
    SalMnth: Joi.number().integer().allow(null),
    MISC_DED: Joi.number().precision(4).allow(null),
    MISC_EARN: Joi.number().precision(4).allow(null),
    P1P2_DED: Joi.number().precision(4).allow(null),
    PROF_TAX: Joi.number().precision(4).allow(null),
    Washing_Arr: Joi.number().precision(4).allow(null),
    Medical_Arr: Joi.number().precision(4).allow(null),
    Conv_Arr: Joi.number().precision(4).allow(null),
    Basic_Arr: Joi.number().precision(4).allow(null),
    HRA_Arr: Joi.number().precision(4).allow(null),
    salyear: Joi.number().integer().allow(null),
    ABSENTVALUE: Joi.number().precision(4).allow(null),
    LEAVEVALUE: Joi.number().precision(4).allow(null),
    iPad_ded: Joi.number().precision(4).allow(null),
    Mediclaim_ded: Joi.number().precision(4).allow(null),
    New_Uniform: Joi.number().precision(4).allow(null),
    Loan: Joi.number().precision(4).allow(null),
    Uni_Ded: Joi.number().precision(4).allow(null),
    Suspend_Days: Joi.number().precision(4).allow(null),
    PF_EDLI: Joi.number().precision(4).allow(null),
    HR_Aprvl: Joi.number().integer().allow(null),
    Acnt_Aprvl: Joi.number().integer().allow(null),
    Chq_Print: Joi.number().integer().allow(null),
    Sal_Disbursh: Joi.number().integer().allow(null),
    Chq_No: Joi.string().max(20).allow(null),
    Chq_Date: Joi.date().allow(null),
    Disb_Pay: Joi.number().integer().allow(null),
    Bank_Name: Joi.string().max(100).allow(null),
    ChqPrint_Name: Joi.string().max(100).allow(null),
    Sal_Mode: Joi.string().max(20).allow(null),
    Sal_OnHold: Joi.number().integer().allow(null),
    Bank_Ledger: Joi.number().integer().allow(null),
    PymtVch_Print: Joi.number().integer().allow(null),
    AdvEmp_Ledger: Joi.number().integer().allow(null),
    Adv_JV: Joi.number().integer().allow(null),
    HoldEmp_Ledger: Joi.number().integer().allow(null),
    Hold_JV: Joi.number().integer().allow(null),
    Washing: Joi.number().precision(4).allow(null),
    Washing_Earn: Joi.number().precision(4).allow(null),
    INC_BATCH: Joi.string().max(50).allow(null),
    ENTRY_BATCH: Joi.string().max(50).allow(null),
    Penulty: Joi.number().precision(4).allow(null),
    OutStanding: Joi.number().precision(4).allow(null),
    OT_Day: Joi.number().precision(4).allow(null),
    OT_Amt: Joi.number().precision(4).allow(null),
    ESIC_WAGES: Joi.number().precision(4).allow(null),
    Sal_Unpaid: Joi.number().precision(4).allow(null),
    Lock_By: Joi.string().max(30).allow(null),
    Lock_Date: Joi.date().allow(null),
    Lock_Time: Joi.number().precision(4).allow(null),
    Account_No: Joi.string().max(50).allow(null),
    Emp_Type: Joi.string().max(20).allow(null),
    Reg_Desc: Joi.string().max(60).allow(null),
    Div_Desc: Joi.string().max(80).allow(null),
    Sec_Desc: Joi.string().max(80).allow(null),
    Desig_Desc: Joi.string().max(120).allow(null)
});

module.exports = { _SalaryFile, SalaryFileSchema };
