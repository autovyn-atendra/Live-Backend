const Sequelize = require("sequelize");
const _Insu_LeadEntry = function (sequelize, DataTypes) {
  return sequelize.define(
    "InsuLeadEntry",
    {
      SRNo: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      Lead_No: {
        type: DataTypes.STRING(70),
        allowNull: true,
      },
      Lead_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      Name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Customer_Name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Address: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      Telephone_No: {
        type: DataTypes.STRING(40),
        allowNull: true,
      },
      MobileNo: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      Email_ID: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Chassis_No: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Engine_No: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Purchase_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      Model: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      TeleCaller: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },
      Field_Executive: {
        type: DataTypes.STRING(25),
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
        type: DataTypes.STRING(2),
        allowNull: true,
      },
      Discount: {
        type: DataTypes.STRING(2),
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
        type: DataTypes.STRING(10),
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
      Delivery_Executive: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      Delivery_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      Due_Date: {
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
      Created_By: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      Created_At: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.Sequelize.fn("getdate"),
      },
    },
    {
      sequelize,
      tableName: "insu_LeadEntry",
      schema: "dbo",
      timestamps: false,
      indexes: [
        {
          name: "PK_insu_Lea_A091E31A691DE11A",
          unique: true,
          fields: [{ name: "SRNo" }],
        },
      ],
    }
  );
};

const Joi = require("joi");

const insuLeadEntrySchema = Joi.object({
  SRNo: Joi.number().integer().positive().optional(), // auto-incremented, not required in input
  Lead_No: Joi.string().max(70).optional().allow(null),
  Lead_Date: Joi.date().iso().optional().allow(null),
  Name: Joi.string().max(100).optional().allow(null),
  Customer_Name: Joi.string().max(100).optional().allow(null),
  Address: Joi.string().max(200).optional().allow(null),
  Telephone_No: Joi.string().max(40).optional().allow(null),
  MobileNo: Joi.string().max(15).optional().allow(null),
  Email_ID: Joi.string().email().max(100).optional().allow(null),
  Chassis_No: Joi.string().max(50).optional().allow(null),
  Engine_No: Joi.string().max(50).optional().allow(null),
  Purchase_Date: Joi.date().iso().optional().allow(null),
  Model: Joi.string().max(100).optional().allow(null),
  TeleCaller: Joi.string().max(25).optional().allow(null),
  Field_Executive: Joi.string().max(25).optional().allow(null),
  FollowUpDate: Joi.date().iso().optional().allow(null),
  FollowUpTime: Joi.string()
    .pattern(/^\d{2}:\d{2}(:\d{2})?$/)
    .optional()
    .allow(null),
  Status: Joi.string().max(20).optional().allow(null),
  Lost_Remark: Joi.string().max(100).optional().allow(null),
  Premium: Joi.string().max(50).optional().allow(null),
  Discount: Joi.string().max(50).optional().allow(null),
  With_Policy: Joi.string().max(2).optional().allow(null),
  Claim_Coupon: Joi.string().max(2).optional().allow(null),
  Washing_Coupon: Joi.string().max(2).optional().allow(null),
  Policy_Issued_Date: Joi.date().iso().optional().allow(null),
  Policy_Dispatch_Date: Joi.date().iso().optional().allow(null),
  Direct_policy_issued: Joi.string().max(2).optional().allow(null),
  Format_No: Joi.string().max(50).optional().allow(null),
  Cheque_No: Joi.string().max(50).optional().allow(null),
  Cheque_Date: Joi.date().iso().optional().allow(null),
  Bank_Name: Joi.string().max(50).optional().allow(null),
  Mode_Of_Payment: Joi.string().max(10).optional().allow(null),
  Favour_Of: Joi.string().max(30).optional().allow(null),
  Coupon_No: Joi.string().max(30).optional().allow(null),
  Last_Expiry_date: Joi.date().iso().optional().allow(null),
  Proposal_No: Joi.string().max(30).optional().allow(null),
  Delivery_Executive: Joi.string().max(30).optional().allow(null),
  Delivery_Date: Joi.date().iso().optional().allow(null),
  Due_Date: Joi.date().iso().optional().allow(null),
  Delivered: Joi.string().max(2).optional().allow(null),
  Conveyance_Applicable: Joi.string().max(2).optional().allow(null),
  Created_By: Joi.string().max(30).required(), // required
  Created_At: Joi.date()
    .optional()
    .default(() => new Date()), // default to current date
});
module.exports = { _Insu_LeadEntry, insuLeadEntrySchema };
