const Sequelize = require('sequelize');
const _BhatiaInvoice = function(sequelize, DataTypes) {
  return sequelize.define('BhatiaInvoice', {
    ICM_ID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Tran_Id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    GODW_SEQ: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    SALE_INV_PREFIX: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Invoice_No: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Invoice_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Gst_Perc: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Cess_Perc: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Invoice_HSN: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Invoice_Cust_Id: {
      type: DataTypes.STRING(120),
      allowNull: true
    },
    Invoice_Cust_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    VIN_INV: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    MODEL_INV: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    COLOR_INV: {
      type: DataTypes.STRING(100),
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
    TC_NUMBER: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Ledger_Name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Customer_Id: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Ledger_Name2_Title: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Ledger_Name2: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Param_Address: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    Temp_Address: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    PAN_NO: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Aadhar_no: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Mobile_no: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Place_of_Supply: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Modl_Code: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Modl_Desc: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    HSN_No: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Color: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    Euro_Type: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Order_No: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Order_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Key_No: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Booking_Dealer: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Delv_Dealer: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    GST_No: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Basic_Price: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Cons_Disc: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    MSSF_Disc: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Corp_Disc: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Spl_Scheme_Disc: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Exch_Disc: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Assessable_Value: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    CGST_Perc: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    SGST_Perc: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    IGST_Perc: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    CGST_Amt: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    SGST_Amt: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    IGST_Amt: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Cess_Amt: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Net_Amt: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Rnd_Amt: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Totl_Amt: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Veh_Class: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Maker_Name: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    Fuel_Type: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    HP_CC: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    Cyl_Cnt: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Seat_Cap: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Mfg_Year: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Unld_Wt: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Modl_GVW: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Body_Type: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Axle_Wt: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Frnt_Axle: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Pre_Inv_Dtl: {
      type: DataTypes.STRING(120),
      allowNull: true
    },
    Inv_Dtl: {
      type: DataTypes.STRING(120),
      allowNull: true
    },
    PI_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Financier: {
      type: DataTypes.STRING(120),
      allowNull: true
    },
    ENG_PreFix: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Cust_Catg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DHI_No: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    DHI_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Taxi_Veh: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    File_No: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    TCS_PERC: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    TCS_AMT: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    SR_NUM: {
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
    tableName: 'BHATIA_INVOICE',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__BHATIA_I__15B69B8E6C025479",
        unique: true,
        fields: [
          { name: "GUID" },
        ]
      },
    ]
  });
};

const Joi = require('joi');

const bhatiaInvoiceSchema = Joi.object({
  ICM_ID: Joi.number().required(),
  Tran_Id: Joi.number().optional().allow(null,''),
  GODW_SEQ: Joi.number().optional().allow(null,''),
  SALE_INV_PREFIX: Joi.string().max(30).optional().allow(null,''),
  Invoice_No: Joi.string().max(20).optional().allow(null,''),
  Invoice_Date: Joi.date().optional().allow(null,''),
  Gst_Perc: Joi.number().precision(4).optional().allow(null,''),
  Cess_Perc: Joi.number().precision(4).optional().allow(null,''),
  Invoice_HSN: Joi.string().max(20).optional().allow(null,''),
  Invoice_Cust_Id: Joi.string().max(120).optional().allow(null,''),
  Invoice_Cust_Code: Joi.number().optional().allow(null,''),
  VIN_INV: Joi.string().max(20).optional().allow(null,''),
  MODEL_INV: Joi.string().max(100).optional().allow(null,''),
  COLOR_INV: Joi.string().max(100).optional().allow(null,''),
  Loc_Code: Joi.number().optional().allow(null,''),
  Export_Type: Joi.number().optional().allow(null,''),
  TC_NUMBER: Joi.string().max(20).optional().allow(null,''),
  Ledger_Name: Joi.string().max(100).optional().allow(null,''),
  Customer_Id: Joi.string().max(20).optional().allow(null,''),
  Ledger_Name2_Title: Joi.string().max(10).optional().allow(null,''),
  Ledger_Name2: Joi.string().max(100).optional().allow(null,''),
  Param_Address: Joi.string().max(300).optional().allow(null,''),
  Temp_Address: Joi.string().max(300).optional().allow(null,''),
  PAN_NO: Joi.string().max(20).optional().allow(null,''),
  Aadhar_no: Joi.string().max(20).optional().allow(null,''),
  Mobile_no: Joi.string().max(25).optional().allow(null,''),
  Place_of_Supply: Joi.string().max(30).optional().allow(null,''),
  Modl_Code: Joi.string().max(20).optional().allow(null,''),
  Modl_Desc: Joi.string().max(200).optional().allow(null,''),
  HSN_No: Joi.string().max(20).optional().allow(null,''),
  Color: Joi.string().max(40).optional().allow(null,''),
  Euro_Type: Joi.string().max(25).optional().allow(null,''),
  Order_No: Joi.string().max(30).optional().allow(null,''),
  Order_Date: Joi.date().optional().allow(null,''),
  Key_No: Joi.string().max(20).optional().allow(null,''),
  Booking_Dealer: Joi.string().max(30).optional().allow(null,''),
  Delv_Dealer: Joi.string().max(30).optional().allow(null,''),
  GST_No: Joi.string().max(25).optional().allow(null,''),
  Basic_Price: Joi.number().precision(4).optional().allow(null,''),
  Cons_Disc: Joi.number().precision(4).optional().allow(null,''),
  MSSF_Disc: Joi.number().precision(4).optional().allow(null,''),
  Corp_Disc: Joi.number().precision(4).optional().allow(null,''),
  Spl_Scheme_Disc: Joi.number().precision(4).optional().allow(null,''),
  Exch_Disc: Joi.number().precision(4).optional().allow(null,''),
  Assessable_Value: Joi.number().precision(4).optional().allow(null,''),
  CGST_Perc: Joi.number().precision(4).optional().allow(null,''),
  SGST_Perc: Joi.number().precision(4).optional().allow(null,''),
  IGST_Perc: Joi.number().precision(4).optional().allow(null,''),
  CGST_Amt: Joi.number().precision(4).optional().allow(null,''),
  SGST_Amt: Joi.number().precision(4).optional().allow(null,''),
  IGST_Amt: Joi.number().precision(4).optional().allow(null,''),
  Cess_Amt: Joi.number().precision(4).optional().allow(null,''),
  Net_Amt: Joi.number().precision(4).optional().allow(null,''),
  Rnd_Amt: Joi.number().precision(4).optional().allow(null,''),
  Totl_Amt: Joi.number().precision(4).optional().allow(null,''),
  Veh_Class: Joi.string().max(30).optional().allow(null,''),
  Maker_Name: Joi.string().max(40).optional().allow(null,''),
  Fuel_Type: Joi.string().max(20).optional().allow(null,''),
  HP_CC: Joi.string().max(40).optional().allow(null,''),
  Cyl_Cnt: Joi.string().max(20).optional().allow(null,''),
  Seat_Cap: Joi.string().max(20).optional().allow(null,''),
  Mfg_Year: Joi.string().max(20).optional().allow(null,''),
  Unld_Wt: Joi.string().max(20).optional().allow(null,''),
  Modl_GVW: Joi.string().max(20).optional().allow(null,''),
  Body_Type: Joi.string().max(100).optional().allow(null,''),
  Axle_Wt: Joi.string().max(20).optional().allow(null,''),
  Frnt_Axle: Joi.string().max(20).optional().allow(null,''),
  Pre_Inv_Dtl: Joi.string().max(120).optional().allow(null,''),
  Inv_Dtl: Joi.string().max(120).optional().allow(null,''),
  PI_Date: Joi.date().optional().allow(null,''),
  Financier: Joi.string().max(120).optional().allow(null,''),
  ENG_PreFix: Joi.string().max(20).optional().allow(null,''),
  Cust_Catg: Joi.number().optional().allow(null,''),
  DHI_No: Joi.string().max(60).optional().allow(null,''),
  DHI_Date: Joi.date().optional().allow(null,''),
  Taxi_Veh: Joi.string().max(5).optional().allow(null,''),
  File_No: Joi.string().max(15).optional().allow(null,''),
  TCS_PERC: Joi.number().precision(4).optional().allow(null,''),
  TCS_AMT: Joi.number().precision(4).optional().allow(null,''),
  SR_NUM: Joi.string().max(20).optional().allow(null,''),
  GUID: Joi.number().required(),
  Created_by: Joi.string().max(200).optional().allow(null,'')
});

module.exports = {_BhatiaInvoice,bhatiaInvoiceSchema};
