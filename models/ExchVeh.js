const Sequelize = require('sequelize');
const _ExchVeh = function (sequelize, DataTypes) {
  return sequelize.define('ExchVeh', {
    Tran_Id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    NewChasNo: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    OldChasNo_1: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    OldRegno_1: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    oldEngno_1: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    OldModel_1: {
      type: DataTypes.STRING(70),
      allowNull: true
    },
    OldMfgYr_1: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    OldKm_1: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    OldAmount_1: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    NewChasno_1: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Notes_1: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    NewEngno_1: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Party_Name_1: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    Relation_1: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    TV_Evaluator_1: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    TVCust_Id_1: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    TV_PAN_1: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    TV_PurcAmt_1: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Loan_Paid_1: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    TV_NetAmt_1: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Refurb_Est_1: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Refurb_Act_1: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Thirdparty_InsuAmt_1: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    OldChasNo_2: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    OldRegno_2: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    oldEngno_2: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    OldModel_2: {
      type: DataTypes.STRING(70),
      allowNull: true
    },
    OldMfgYr_2: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    OldKm_2: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    OldAmount_2: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    NewChasno_2: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Notes_2: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    NewEngno_2: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Party_Name_2: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    Relation_2: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    TV_Evaluator_2: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    TVCust_Id_2: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    TV_PAN_2: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    TV_PurcAmt_2: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Loan_Paid_2: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    TV_NetAmt_2: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Refurb_Est_2: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Refurb_Act_2: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Thirdparty_InsuAmt_2: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    OldChasNo_3: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    OldRegno_3: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    oldEngno_3: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    OldModel_3: {
      type: DataTypes.STRING(70),
      allowNull: true
    },
    OldMfgYr_3: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    OldKm_3: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    OldAmount_3: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    NewChasno_3: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Notes_3: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    NewEngno_3: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Party_Name_3: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    Relation_3: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    TV_Evaluator_3: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    TVCust_Id_3: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    TV_PAN_3: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    TV_PurcAmt_3: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Loan_Paid_3: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    TV_NetAmt_3: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Refurb_Est_3: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Refurb_Act_3: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Thirdparty_InsuAmt_3: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Loc_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Export_Type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Exch_Type_1: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Exch_Type_2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Exch_Type_3: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    TV_Evaluator: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    Thirdparty_InsuAmt: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    TVCust_Id: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    TV_PAN: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    TV_PurcAmt: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Loan_Paid: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    TV_NetAmt: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Refurb_Est: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Refurb_Act: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    TV_Pymt_Recd: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    TV_Pymt_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    TV_JV_No: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    TV_Pymt_Recd2: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    TV_Pymt_Date2: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    TV_JV_No2: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    TV_Pymt_Recd3: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    TV_Pymt_Date3: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    TV_JV_No3: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    VIN: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    IsEBR: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ENG_No: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    GUID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Created_by: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Exch_Veh',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Exch_Veh__15B69B8E0951BC2E",
        unique: true,
        fields: [
          { name: "GUID" },
        ]
      },
    ]
  });
};


const Joi = require('joi');

const exchVehSchema = Joi.object({
  Tran_Id: Joi.number().integer().allow(null,''),
  NewChasNo: Joi.string().max(30).allow(null,''),
  OldChasNo_1: Joi.string().max(30).allow(null,''),
  OldRegno_1: Joi.string().max(15).allow(null,''),
  oldEngno_1: Joi.string().max(30).allow(null,''),
  OldModel_1: Joi.string().max(70).allow(null,''),
  OldMfgYr_1: Joi.string().max(10).allow(null,''),
  OldKm_1: Joi.string().max(10).allow(null,''),
  OldAmount_1: Joi.number().precision(4).allow(null,''),
  NewChasno_1: Joi.string().max(30).allow(null,''),
  Notes_1: Joi.string().max(250).allow(null,''),
  NewEngno_1: Joi.string().max(25).allow(null,''),
  Party_Name_1: Joi.string().max(200).allow(null,''),
  Relation_1: Joi.string().max(25).allow(null,''),
  TV_Evaluator_1: Joi.string().max(40).allow(null,''),
  TVCust_Id_1: Joi.string().max(20).allow(null,''),
  TV_PAN_1: Joi.string().max(10).allow(null,''),
  TV_PurcAmt_1: Joi.number().precision(4).allow(null,''),
  Loan_Paid_1: Joi.number().precision(4).allow(null,''),
  TV_NetAmt_1: Joi.number().precision(4).allow(null,''),
  Refurb_Est_1: Joi.number().precision(4).allow(null,''),
  Refurb_Act_1: Joi.number().precision(4).allow(null,''),
  Thirdparty_InsuAmt_1: Joi.number().precision(4).allow(null,''),
  OldChasNo_2: Joi.string().max(30).allow(null,''),
  OldRegno_2: Joi.string().max(15).allow(null,''),
  oldEngno_2: Joi.string().max(30).allow(null,''),
  OldModel_2: Joi.string().max(70).allow(null,''),
  OldMfgYr_2: Joi.string().max(10).allow(null,''),
  OldKm_2: Joi.string().max(10).allow(null,''),
  OldAmount_2: Joi.number().precision(4).allow(null,''),
  NewChasno_2: Joi.string().max(30).allow(null,''),
  Notes_2: Joi.string().max(250).allow(null,''),
  NewEngno_2: Joi.string().max(25).allow(null,''),
  Party_Name_2: Joi.string().max(200).allow(null,''),
  Relation_2: Joi.string().max(25).allow(null,''),
  TV_Evaluator_2: Joi.string().max(40).allow(null,''),
  TVCust_Id_2: Joi.string().max(20).allow(null,''),
  TV_PAN_2: Joi.string().max(10).allow(null,''),
  TV_PurcAmt_2: Joi.number().precision(4).allow(null,''),
  Loan_Paid_2: Joi.number().precision(4).allow(null,''),
  TV_NetAmt_2: Joi.number().precision(4).allow(null,''),
  Refurb_Est_2: Joi.number().precision(4).allow(null,''),
  Refurb_Act_2: Joi.number().precision(4).allow(null,''),
  Thirdparty_InsuAmt_2: Joi.number().precision(4).allow(null,''),
  OldChasNo_3: Joi.string().max(30).allow(null,''),
  OldRegno_3: Joi.string().max(15).allow(null,''),
  oldEngno_3: Joi.string().max(30).allow(null,''),
  OldModel_3: Joi.string().max(70).allow(null,''),
  OldMfgYr_3: Joi.string().max(10).allow(null,''),
  OldKm_3: Joi.string().max(10).allow(null,''),
  OldAmount_3: Joi.number().precision(4).allow(null,''),
  NewChasno_3: Joi.string().max(30).allow(null,''),
  Notes_3: Joi.string().max(250).allow(null,''),
  NewEngno_3: Joi.string().max(25).allow(null,''),
  Party_Name_3: Joi.string().max(200).allow(null,''),
  Relation_3: Joi.string().max(25).allow(null,''),
  TV_Evaluator_3: Joi.string().max(40).allow(null,''),
  TVCust_Id_3: Joi.string().max(20).allow(null,''),
  TV_PAN_3: Joi.string().max(10).allow(null,''),
  TV_PurcAmt_3: Joi.number().precision(4).allow(null,''),
  Loan_Paid_3: Joi.number().precision(4).allow(null,''),
  TV_NetAmt_3: Joi.number().precision(4).allow(null,''),
  Refurb_Est_3: Joi.number().precision(4).allow(null,''),
  Refurb_Act_3: Joi.number().precision(4).allow(null,''),
  Thirdparty_InsuAmt_3: Joi.number().precision(4).allow(null,''),
  Loc_Code: Joi.number().integer().allow(null,''),
  Export_Type: Joi.number().integer().allow(null,''),
  Exch_Type_1: Joi.number().integer().allow(null,''),
  Exch_Type_2: Joi.number().integer().allow(null,''),
  Exch_Type_3: Joi.number().integer().allow(null,''),
  TV_Evaluator: Joi.string().max(40).allow(null,''),
  Thirdparty_InsuAmt: Joi.number().precision(4).allow(null,''),
  TVCust_Id: Joi.string().max(20).allow(null,''),
  TV_PAN: Joi.string().max(10).allow(null,''),
  TV_PurcAmt: Joi.number().precision(4).allow(null,''),
  Loan_Paid: Joi.number().precision(4).allow(null,''),
  TV_NetAmt: Joi.number().precision(4).allow(null,''),
  Refurb_Est: Joi.number().precision(4).allow(null,''),
  Refurb_Act: Joi.number().precision(4).allow(null,''),
  TV_Pymt_Recd: Joi.number().precision(4).allow(null,''),
  TV_Pymt_Date: Joi.date().raw().allow(null,''),
  TV_JV_No: Joi.string().max(50).allow(null,''),
  TV_Pymt_Recd2: Joi.number().precision(4).allow(null,''),
  TV_Pymt_Date2: Joi.date().raw().allow(null,''),
  TV_JV_No2: Joi.string().max(30).allow(null,''),
  TV_Pymt_Recd3: Joi.number().precision(4).allow(null,''),
  TV_Pymt_Date3: Joi.date().raw().allow(null,''),
  TV_JV_No3: Joi.string().max(30).allow(null,''),
  VIN: Joi.string().max(100).allow(null,''),
  IsEBR: Joi.number().integer().allow(null,''),
  ENG_No: Joi.string().max(20).allow(null,''),
  Created_by: Joi.string().max(200).allow(null,'')
});

module.exports = { _ExchVeh, exchVehSchema };
