const Sequelize = require("sequelize");
const _Insu_Entry = function (sequelize, DataTypes) {
  return sequelize.define(
    "InsuEntry",
    {
      SRNo: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      Policy_No: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      NewPolicy_No: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      CRE_NAME: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Customer_Name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Policy_Due: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      Registration_No: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      Engine_No: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Chassis_No: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Year_Manufacture: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      Sub_Model: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Address1: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      Address2: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      Address3: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      Cust_City: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      PinCode: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      Phone_No: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      MobileNo: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      Policy_Ren_Type: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Policy_Sub_Type: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      Dealer_Code: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      TeleCaller: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },
      Field_Executive: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      FollowUpDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      FollowUpTime: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      Status: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      Lost_Remark: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Premium: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Discount: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      With_Policy: {
        type: DataTypes.STRING(2),
        allowNull: true,
      },
      Claim_Coupon: {
        type: DataTypes.STRING(2),
        allowNull: true,
      },
      Washing_Coupon: {
        type: DataTypes.STRING(2),
        allowNull: true,
      },
      Policy_Issued_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      Policy_Dispatch_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      Direct_policy_issued: {
        type: DataTypes.STRING(2),
        allowNull: true,
      },
      Format_No: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Cheque_No: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Cheque_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      Bank_Name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Mode_Of_Payment: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Favour_Of: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      Coupon_No: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      Last_Expiry_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      Proposal_No: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      Payment_Status: {
        type: DataTypes.STRING(5),
        allowNull: true,
      },
      Delivery_Executive: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      Delivery_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      Delivered: {
        type: DataTypes.STRING(2),
        allowNull: true,
      },
      Conveyance_Applicable: {
        type: DataTypes.STRING(2),
        allowNull: true,
      },
      Cre_Code: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Act_Delivery_Date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      Created_By: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      Delv_Remark: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      loc_code: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      uploaded_document: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Delivery_Copy: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Created_At: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.Sequelize.fn("getdate"),
      },
      Due_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      LeadDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      CancleRemark: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      Remark: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      Location: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      EXPORT_TYPE: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      
    },
    {
      sequelize,
      tableName: "Insu_Entry",
      schema: "dbo",
      timestamps: false,
      indexes: [
        {
          name: "PK__Insu_Ent__A091E31A5140443F",
          unique: true,
          fields: [{ name: "SRNo" }],
        },
      ],
    }
  );
};
const Joi = require("joi");
const insuEntrySchema = Joi.object({
  SRNo: Joi.number().integer().positive().optional(), // autoIncrement field, Joi will validate this when inputting
  Policy_No: Joi.string().max(50).allow('', null).optional(),
  NewPolicy_No: Joi.string().max(50).allow('', null).optional(),
  CRE_NAME: Joi.string().max(50).allow('', null).optional(),
  Customer_Name: Joi.string().max(100).allow('', null).optional(),
  Policy_Due: Joi.date().iso().allow('', null).optional(),
  Registration_No: Joi.string().max(30).allow('', null).optional(),
  Engine_No: Joi.string().max(50).allow('', null).optional(),
  Chassis_No: Joi.string().max(50).allow('', null).optional(),
  Year_Manufacture: Joi.string().max(10).allow('', null).optional(),
  Sub_Model: Joi.string().max(50).allow('', null).optional(),
  Address1: Joi.string().max(200).allow('', null).optional(),
  CancleRemark: Joi.string().max(200).allow('', null).optional(),
  Remark: Joi.string().max(200).allow('', null).optional(),
  Location: Joi.alternatives().try(Joi.string().max(10), Joi.number()).allow('', null).optional(),
  Address2: Joi.string().max(200).allow('', null).optional(),
  Address3: Joi.string().max(200).allow('', null).optional(),
  Cust_City: Joi.string().max(50).allow('', null).optional(),
  PinCode: Joi.string().max(10).allow('', null).optional(),
  Phone_No: Joi.string().max(15).allow('', null).optional(),
  MobileNo: Joi.string().max(15).allow('', null).optional(),
  Policy_Ren_Type: Joi.string().max(50).allow('', null).optional(),
  Policy_Sub_Type: Joi.string().max(20).allow('', null).optional(),
  Dealer_Code: Joi.string().max(10).allow('', null).optional(),
  TeleCaller: Joi.string().max(25).allow('', null).optional(),
  Field_Executive: Joi.string().max(100).allow('', null).optional(),
  FollowUpDate: Joi.date().iso().allow('', null).optional(),
  FollowUpTime: Joi.string()
    .pattern(/^\d{2}:\d{2}(:\d{2})?$/)
    .allow('', null)
    .optional(),
  Status: Joi.string().max(20).allow('', null).optional(),
  Lost_Remark: Joi.string().max(100).allow('', null).optional(),
  Premium: Joi.string().max(50).allow('', null).optional(),
  Discount: Joi.string().max(50).allow('', null).optional(),
  With_Policy: Joi.string().max(2).allow('', null).optional(),
  Claim_Coupon: Joi.string().max(2).allow('', null).optional(),
  Washing_Coupon: Joi.string().max(2).allow('', null).optional(),
  Policy_Issued_Date: Joi.date().iso().allow('', null).optional(),
  Policy_Dispatch_Date: Joi.date().iso().allow('', null).optional(),
  Direct_policy_issued: Joi.string().max(2).allow('', null).optional(),
  Format_No: Joi.string().max(50).allow('', null).optional(),
  Cheque_No: Joi.string().max(50).allow('', null).optional(),
  Cheque_Date: Joi.date().iso().allow('', null).optional(),
  Bank_Name: Joi.string().max(50).allow('', null).optional(),
  Mode_Of_Payment: Joi.string().max(50).allow('', null).optional(),
  Favour_Of: Joi.string().max(30).allow('', null).optional(),
  Coupon_No: Joi.string().max(30).allow('', null).optional(),
  Last_Expiry_date: Joi.date().iso().allow('', null).optional(),
  Proposal_No: Joi.string().max(30).allow('', null).optional(),
  Delivery_Executive: Joi.string().max(30).allow('', null).optional(),
  Delv_Remark: Joi.string().max(200).allow('', null).optional(),
  Payment_Status: Joi.string().max(5).allow('', null).optional(),
  loc_code: Joi.alternatives().try(
    Joi.string().max(30).allow('', null),
    Joi.number().allow(null)
  ).optional(),
  Cre_Code: Joi.string().max(30).allow('', null).optional(),
  Delivery_Date: Joi.date().iso().allow('', null).optional(),
  Delivered: Joi.string().max(2).allow('', null).optional(),
  Conveyance_Applicable: Joi.string().max(2).allow('', null).optional(),
  uploaded_document: Joi.string().max(100).allow('', null).optional(),
  Created_By: Joi.string().max(30).required(),
  Created_At: Joi.date().optional().default(() => new Date()), // default to current date
  Due_Date: Joi.date().iso().allow('', null).optional(),
  LeadDate: Joi.date().iso().allow('', null).optional(),
  EXPORT_TYPE: Joi.number().integer().allow('', null).optional(),
  


});

module.exports = { insuEntrySchema, _Insu_Entry };
