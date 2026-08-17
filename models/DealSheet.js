const Sequelize = require('sequelize');
const _DealSheet = function (sequelize, DataTypes) {
  return sequelize.define('DealSheet', {
    tran_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Req_Date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('getdate')
    },
    Customer_Name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Mobile_No: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Model: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Variant: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Color: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    vehicle_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Customer_Type_Broker: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    MFG_Year: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Booking_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Aadhar_No: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    PAN_No: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    GST_No: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Address: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Finance_Type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Loan_Amount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Old_Vehicle: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Old_Vehicle_Amount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Rto: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    RTO_Amount: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    RTO_Fency_Number: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Insurance: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Insurance_Type: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Preferred_Insurance_Partner: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Insurance_Amount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Municipal_Tax: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Municipal_Tax_Amount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    MGA: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    MGA_Amount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    EW: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    EW_Amount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Ccp: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Ccp_Amount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    MCP: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    MCP_Amount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Loyalty: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Loyalty_Amount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    FASTAG: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    FASTAG_Amount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    VAS: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    VAS_Amount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    MSSF: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Tcs: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Consumer: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Corporate: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Exchange: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Loan_Amount_Discount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Insurance_Amount_Discount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    MGA_Amount_Discount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    EW_Amount_Discount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Ccp_Amount_Discount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    MCP_Amount_Discount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    VAS_Amount_Discount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Broker_Discount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    OnRoad_Price: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Max_discount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Dise_Amt: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Approved_amt: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Location: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    srm: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Fin_Appr: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    Created_By: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'Deal_Sheet',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Deal_She__A67F8A204F8F504A",
        unique: true,
        fields: [
          { name: "tran_id" },
        ]
      },
    ]
  });
};
const Joi = require('joi');
const dealSheetSchema = Joi.object({
  tran_id: Joi.number().integer().positive().optional(), // Primary key, auto-incremented
  Customer_Name: Joi.string().max(100).allow(null, ''),
  Mobile_No: Joi.string().max(20).allow(null, ''),
  Email: Joi.string().email().max(100).allow(null, ''), // Validate email format
  Model: Joi.string().max(50).allow(null, ''),
  Variant: Joi.string().max(50).allow(null, ''),
  Color: Joi.string().max(50).allow(null, ''),
  vehicle_type: Joi.string().max(50).allow(null, ''),
  Customer_Type_Broker: Joi.string().max(50).allow(null, ''),
  MFG_Year: Joi.number().precision(2).allow(null),
  Booking_Date: Joi.date().optional().allow(null, ''),
  Aadhar_No: Joi.string().max(20).optional().allow(null, ''),
  PAN_No: Joi.string().max(20).optional().allow(null, ''),
  GST_No: Joi.string().max(20).optional().allow(null, ''),
  Address: Joi.string().max(100).optional().allow(null, ''),
  price: Joi.number().optional().allow(null, ''),
  Finance_Type: Joi.string().max(50).optional().allow(null, ''),
  Loan_Amount: Joi.number().optional().allow(null, ''),
  Old_Vehicle: Joi.string().max(20).optional().allow(null, ''),
  Old_Vehicle_Amount: Joi.number().optional().allow(null, ''),
  Rto: Joi.string().max(20).optional().allow(null, ''),
  RTO_Amount: Joi.number().optional().allow(null, ''),
  RTO_Fency_Number: Joi.number().optional().allow(null, ''),
  Insurance: Joi.string().max(20).optional().allow(null, ''),
  Insurance_Type: Joi.string().max(20).optional().allow(null, ''),
  Preferred_Insurance_Partner: Joi.string().max(100).optional().allow(null, ''),
  Insurance_Amount: Joi.number().optional().allow(null, ''),
  Municipal_Tax: Joi.string().max(20).optional().allow(null, ''),
  Municipal_Tax_Amount: Joi.number().optional().allow(null, ''),
  MGA: Joi.string().max(20).optional().allow(null, ''),
  MGA_Amount: Joi.number().optional().allow(null, ''),
  EW: Joi.string().max(50).optional().allow(null, ''),
  EW_Amount: Joi.number().optional().allow(null, ''),
  Ccp: Joi.string().max(20).optional().allow(null, ''),
  Ccp_Amount: Joi.number().optional().allow(null, ''),
  MCP: Joi.string().max(20).optional().allow(null, ''),
  MCP_Amount: Joi.number().optional().allow(null, ''),
  Loyalty: Joi.string().max(20).optional().allow(null, ''),
  Loyalty_Amount: Joi.number().optional().allow(null, ''),
  FASTAG: Joi.string().max(20).optional().allow(null, ''),
  FASTAG_Amount: Joi.number().optional().allow(null, ''),
  VAS: Joi.string().max(20).optional().allow(null, ''),
  VAS_Amount: Joi.number().optional().allow(null, ''),
  MSSF: Joi.string().max(20).optional().allow(null, ''),
  Tcs: Joi.number().optional().allow(null, ''),
  Consumer: Joi.number().optional().allow(null, ''),
  Corporate: Joi.number().optional().allow(null, ''),
  Exchange: Joi.number().optional().allow(null, ''),
  Loan_Amount_Discount: Joi.number().optional().allow(null, ''),
  Insurance_Amount_Discount: Joi.number().optional().allow(null, ''),
  MGA_Amount_Discount: Joi.number().optional().allow(null, ''),
  EW_Amount_Discount: Joi.number().optional().allow(null, ''),
  Ccp_Amount_Discount: Joi.number().optional().allow(null, ''),
  MCP_Amount_Discount: Joi.number().optional().allow(null, ''),
  VAS_Amount_Discount: Joi.number().optional().allow(null, ''),
  Broker_Discount: Joi.alternatives().try(
    Joi.string().max(50).allow(null).optional(), // String, max length 50, nullable, optional
    Joi.number().allow(null).optional()           // Number, nullable, optional
  ),
  OnRoad_Price: Joi.number().optional().allow(null, ''),
  Max_discount: Joi.number().precision(2).allow(null).allow(null, ''),
  Dise_Amt: Joi.number().precision(2).allow(null).allow(null, ''),
  Approved_amt: Joi.number().precision(2).allow(null).allow(null, ''),
  Location: Joi.alternatives().try(
    Joi.string().max(50).allow(null).optional(), // String, max length 50, nullable, optional
    Joi.number().allow(null).optional()           // Number, nullable, optional
  ),// Optional, up to 50 characters, can be null
  srm: Joi.string().max(20).allow(null, ''),
  Fin_Appr: Joi.number().integer().min(0).max(1).allow(null, ''), // TINYINT values (0 or 1)
  Created_By: Joi.string().max(255).allow(null, ''),
});

module.exports = { _DealSheet, dealSheetSchema };

