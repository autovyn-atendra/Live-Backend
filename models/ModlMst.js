const Sequelize = require('sequelize');
const _ModlMst = function (sequelize, DataTypes) {
  return sequelize.define('ModlMst', {
    Item_Code: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    Modl_Code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Modl_Name: {
      type: DataTypes.STRING(75),
      allowNull: true
    },
    Modl_Abbr: {
      type: DataTypes.STRING(12),
      allowNull: true
    },
    Modl_Grp: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Prod_Type: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    LOB_Code: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Prod_Catg: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Modl_Catg: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    Wrty_Days: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Wrty_Km: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    MRP_Price: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Cust_Price: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Dlr_Price: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    SDlr_Price: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Corp_Price: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    CSD_Price: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Cust_Tax: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    SDlr_Tax: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    CSD_Tax: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Chas_Prefix: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    Price_Date: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    Lbr_Tax: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    Modl_Dtl1: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Modl_Dtl2: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Modl_Dtl3: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Modl_Dtl4: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Modl_Dtl5: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Modl_Dtl6: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Modl_Dtl7: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Modl_Dtl8: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Modl_Dtl9: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Modl_Dtl10: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Seat_Cap: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Unld_Wt: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Body_Type: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Cyl_Cnt: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Whl_Base: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Veh_Class: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Modl_GVW: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Hp_Cc: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Cc_Hp: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Fuel_Type: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Frnt_Tyre: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Rear_Tyre: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Frnt_Axle: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Rear_Axle: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Euro_Type: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Form21_Etc1: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Form21_Etc2: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Form21_Etc3: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Form21_Etc4: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    First_Days: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    First_Km: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Next_Days: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Next_Km: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Rpt_Days: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Rpt_Km: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Trf_Ac: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Purc_Ac: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Sale_Ac: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Op_Stk: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Cl_Stk: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Op_Price: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Clr_type: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    Adnl_Pric1: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Adnl_Pric2: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Adnl_Pric3: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Adnl_Pric4: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Adnl_Pric5: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Adnl_Pric6: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Adnl_Pric7: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Adnl_Pric8: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Adnl_Pric9: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Adnl_Pric10: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Adnl_Pric11: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Adnl_Pric12: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Adnl_Pric13: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Adnl_Pric14: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Adnl_Pric15: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Exp_Date: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    ServerId: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    Export_Type: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    Loc_code: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    BSF_Price: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    CPC_Price: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    HSN: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Adnl_Pric16: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Trfin_Ledg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Trfout_Ledg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Pret_Ledg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Sret_Ledg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Asset_Ledg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Income_Ledg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Purc_Ledg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Sale_Ledg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    LOB: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'Modl_Mst',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Modl_Mst__C5B6F0D2206AF844",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};


const Joi = require('joi');

const ModlMstSchema = Joi.object({
  Item_Code: Joi.number().integer().allow(null).allow(''),
  Modl_Code: Joi.string().max(50).allow(null).allow(''),
  Modl_Name: Joi.string().max(75).allow(null).allow(''),
  Modl_Abbr: Joi.string().max(12).allow(null).allow(''),
  Modl_Grp: Joi.number().integer().allow(null).allow(''),
  Prod_Type: Joi.number().integer().allow(null).allow(''),
  LOB_Code: Joi.number().integer().allow(null).allow(''),
  Prod_Catg: Joi.number().integer().allow(null).allow(''),
  Modl_Catg: Joi.number().integer().allow(null).allow(''),
  Wrty_Days: Joi.string().max(10).allow(null).allow(''),
  Wrty_Km: Joi.string().max(10).allow(null).allow(''),
  MRP_Price: Joi.number().precision(19).allow(null).allow(''),
  Cust_Price: Joi.number().precision(19).allow(null).allow(''),
  Dlr_Price: Joi.number().precision(19).allow(null).allow(''),
  SDlr_Price: Joi.number().precision(19).allow(null).allow(''),
  Corp_Price: Joi.number().precision(19).allow(null).allow(''),
  CSD_Price: Joi.number().precision(19).allow(null).allow(''),
  Cust_Tax: Joi.number().precision(19).allow(null).allow(''),
  SDlr_Tax: Joi.number().precision(19).allow(null).allow(''),
  CSD_Tax: Joi.number().precision(19).allow(null).allow(''),
  Chas_Prefix: Joi.string().max(15).allow(null).allow(''),
  Price_Date: Joi.date().iso().allow(null).allow(''),
  Lbr_Tax: Joi.boolean().allow(null).allow(''),
  Modl_Dtl1: Joi.string().max(50).allow(null).allow(''),
  Modl_Dtl2: Joi.string().max(50).allow(null).allow(''),
  Modl_Dtl3: Joi.string().max(50).allow(null).allow(''),
  Modl_Dtl4: Joi.string().max(50).allow(null).allow(''),
  Modl_Dtl5: Joi.string().max(50).allow(null).allow(''),
  Modl_Dtl6: Joi.string().max(50).allow(null).allow(''),
  Modl_Dtl7: Joi.string().max(50).allow(null).allow(''),
  Modl_Dtl8: Joi.string().max(50).allow(null).allow(''),
  Modl_Dtl9: Joi.string().max(50).allow(null).allow(''),
  Modl_Dtl10: Joi.string().max(50).allow(null).allow(''),
  Seat_Cap: Joi.string().max(10).allow(null).allow(''),
  Unld_Wt: Joi.string().max(10).allow(null).allow(''),
  Body_Type: Joi.string().max(10).allow(null).allow(''),
  Cyl_Cnt: Joi.string().max(10).allow(null).allow(''),
  Whl_Base: Joi.string().max(10).allow(null).allow(''),
  Veh_Class: Joi.string().max(10).allow(null).allow(''),
  Modl_GVW: Joi.string().max(10).allow(null).allow(''),
  Hp_Cc: Joi.string().max(10).allow(null).allow(''),
  Cc_Hp: Joi.string().max(10).allow(null).allow(''),
  Fuel_Type: Joi.string().max(10).allow(null).allow(''),
  Frnt_Tyre: Joi.string().max(10).allow(null).allow(''),
  Rear_Tyre: Joi.string().max(10).allow(null).allow(''),
  Frnt_Axle: Joi.string().max(10).allow(null).allow(''),
  Rear_Axle: Joi.string().max(10).allow(null).allow(''),
  Euro_Type: Joi.string().max(10).allow(null).allow(''),
  Form21_Etc1: Joi.string().max(10).allow(null).allow(''),
  Form21_Etc2: Joi.string().max(10).allow(null).allow(''),
  Form21_Etc3: Joi.string().max(10).allow(null).allow(''),
  Form21_Etc4: Joi.string().max(10).allow(null).allow(''),
  First_Days: Joi.number().integer().allow(null).allow(''),
  First_Km: Joi.number().integer().allow(null).allow(''),
  Next_Days: Joi.number().integer().allow(null).allow(''),
  Next_Km: Joi.number().integer().allow(null).allow(''),
  Rpt_Days: Joi.number().integer().allow(null).allow(''),
  Rpt_Km: Joi.number().integer().allow(null).allow(''),
  Trf_Ac: Joi.number().integer().allow(null).allow(''),
  Purc_Ac: Joi.number().integer().allow(null).allow(''),
  Sale_Ac: Joi.number().integer().allow(null).allow(''),
  Op_Stk: Joi.number().integer().allow(null).allow(''),
  Cl_Stk: Joi.number().integer().allow(null).allow(''),
  Op_Price: Joi.number().precision(19).allow(null).allow(''),
  Clr_type: Joi.number().integer().allow(null).allow(''),
  Adnl_Pric1: Joi.number().precision(19).allow(null).allow(''),
  Adnl_Pric2: Joi.number().precision(19).allow(null).allow(''),
  Adnl_Pric3: Joi.number().precision(19).allow(null).allow(''),
  Adnl_Pric4: Joi.number().precision(19).allow(null).allow(''),
  Adnl_Pric5: Joi.number().precision(19).allow(null).allow(''),
  Adnl_Pric6: Joi.number().precision(19).allow(null).allow(''),
  Adnl_Pric7: Joi.number().precision(19).allow(null).allow(''),
  Adnl_Pric8: Joi.number().precision(19).allow(null).allow(''),
  Adnl_Pric9: Joi.number().precision(19).allow(null).allow(''),
  Adnl_Pric10: Joi.number().precision(19).allow(null).allow(''),
  Adnl_Pric11: Joi.number().precision(19).allow(null).allow(''),
  Adnl_Pric12: Joi.number().precision(19).allow(null).allow(''),
  Adnl_Pric13: Joi.number().precision(19).allow(null).allow(''),
  Adnl_Pric14: Joi.number().precision(19).allow(null).allow(''),
  Adnl_Pric15: Joi.number().precision(19).allow(null).allow(''),
  Exp_Date: Joi.date().iso().allow(null).allow(''),
  ServerId: Joi.number().integer().allow(null).allow(''),
  Export_Type: Joi.number().integer().allow(null).allow(''),
  Loc_code: Joi.number().integer().required(),
  BSF_Price: Joi.number().precision(19).allow(null).allow(''),
  CPC_Price: Joi.number().precision(19).allow(null).allow(''),
  HSN: Joi.string().max(30).allow(null).allow(''),
  Adnl_Pric16: Joi.number().precision(19).allow(null).allow(''),
  Trfin_Ledg: Joi.number().integer().allow(null).allow(''),
  Trfout_Ledg: Joi.number().integer().allow(null).allow(''),
  Pret_Ledg: Joi.number().integer().allow(null).allow(''),
  Sret_Ledg: Joi.number().integer().allow(null).allow(''),
  Asset_Ledg: Joi.number().integer().allow(null).allow(''),
  Income_Ledg: Joi.number().integer().allow(null).allow(''),
  Purc_Ledg: Joi.number().integer().allow(null).allow(''),
  Sale_Ledg: Joi.number().integer().allow(null).allow(''),
  LOB: Joi.number().integer().allow(null).allow(''),
  Created_At: Joi.date().iso().required(),
  Created_by: Joi.string().max(100).allow(null).allow(''),
  ValidFrom: Joi.date().iso().required(),
  ValidTo: Joi.date().iso().required(),
});

module.exports = { _ModlMst, ModlMstSchema };
