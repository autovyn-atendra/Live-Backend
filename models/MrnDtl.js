const Sequelize = require('sequelize');
const _MrnDtl = function(sequelize, DataTypes) {
  return sequelize.define('MrnDtl', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Tran_Id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Tran_type: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    SrNo: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Item_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Ordr_Qty: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Recd_Qty: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Ordr_No: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    UOM: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Unit_Rate: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Item_Rate: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Item_Disc: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Disc_Amt: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Vat_Perc: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Vat_Amt: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Eduty_Perc: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Eduty_Amt: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Cvd_Perc: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Cvd_Amt: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Oth_Perc: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Oth_Amt: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Item_Amt: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Item_MRP: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Inv_Id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Inv_Qty: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Bal_Qty: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Item_Rem: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Post_Acnt: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ServerId: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    Export_Type: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    Loc_code: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Chln_No: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Pack_Size: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Due_Date: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    Recd_Date: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    Laps_Qty: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Laps_Date: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    Laps_Reason: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Ordr_Seq: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Chln_Seq: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Ordr_Book: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Chln_Book: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Chln_Id: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Ret_Ref: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Created_At: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('getdate')
    },
    Created_by: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Disc_Perct: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    AddDisc_Perct: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    SGST_Perct: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    CGST_Perct: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    IGST_Perct: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    SGST_Amount: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    CGST_Amount: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    IGST_Amount: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    TTL_Amount: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    INV_Amt: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'MrnDtl',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__MrnDtl__C5B6F0D2D5E6D54E",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};

const Joi = require('joi');

const MrnDtlSchema = Joi.object({
  Tran_Id: Joi.number().integer().required(),
  Tran_type: Joi.number().integer().allow(null),
  SrNo: Joi.number().integer().allow(null),
  Item_Code: Joi.number().integer().allow(null),
  Ordr_Qty: Joi.number().precision(4).allow(null),
  Recd_Qty: Joi.number().precision(4).allow(null),
  Ordr_No: Joi.string().max(50).allow(null),
  UOM: Joi.string().max(25).allow(null),
  Unit_Rate: Joi.number().precision(4).allow(null),
  Item_Rate: Joi.number().precision(4).allow(null),
  Item_Disc: Joi.number().precision(4).allow(null),
  Disc_Amt: Joi.number().precision(4).allow(null),
  Vat_Perc: Joi.number().precision(4).allow(null),
  Vat_Amt: Joi.number().precision(4).allow(null),
  Eduty_Perc: Joi.number().precision(4).allow(null),
  Eduty_Amt: Joi.number().precision(4).allow(null),
  Cvd_Perc: Joi.number().precision(4).allow(null),
  Cvd_Amt: Joi.number().precision(4).allow(null),
  Oth_Perc: Joi.number().precision(4).allow(null),
  Oth_Amt: Joi.number().precision(4).allow(null),
  Item_Amt: Joi.number().precision(4).allow(null),
  Item_MRP: Joi.number().precision(4).allow(null),
  Inv_Id: Joi.number().integer().allow(null),
  Inv_Qty: Joi.number().precision(4).allow(null),
  Bal_Qty: Joi.number().precision(4).allow(null),
  Item_Rem: Joi.string().max(25).allow(null),
  Post_Acnt: Joi.number().integer().allow(null),
  ServerId: Joi.number().integer().allow(null),
  Export_Type: Joi.number().integer().required(),
  Loc_code: Joi.number().integer().required(),
  Chln_No: Joi.string().max(25).allow(null),
  Pack_Size: Joi.string().max(100).allow(null),
  Due_Date: Joi.date().allow(null),
  Recd_Date: Joi.date().allow(null),
  Laps_Qty: Joi.number().precision(4).allow(null),
  Laps_Date: Joi.date().allow(null),
  Laps_Reason: Joi.number().integer().allow(null),
  Ordr_Seq: Joi.number().integer().allow(null),
  Chln_Seq: Joi.number().integer().allow(null),
  Ordr_Book: Joi.number().integer().allow(null),
  Chln_Book: Joi.number().integer().allow(null),
  Chln_Id: Joi.number().integer().allow(null),
  Ret_Ref: Joi.string().max(20).allow(null),
  Created_by: Joi.string().max(100).allow(null),
  IGST_Amount: Joi.number().precision(4).allow(null),
  CGST_Amount: Joi.number().precision(4).allow(null),
  SGST_Amount: Joi.number().precision(4).allow(null),
  IGST_Perct: Joi.string().max(10).allow(null),
  SGST_Perct: Joi.string().max(10).allow(null),
  CGST_Perct: Joi.string().max(10).allow(null),
  AddDisc_Perct: Joi.string().max(10).allow(null),
  Disc_Perct: Joi.string().max(10).allow(null),
  TTL_Amount: Joi.number().precision(4).allow(null),
  INV_Amt: Joi.number().precision(4).allow(null),
});

module.exports = {_MrnDtl, MrnDtlSchema};
