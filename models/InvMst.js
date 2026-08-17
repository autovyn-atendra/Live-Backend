const Sequelize = require('sequelize');
const _InvMst = function(sequelize, DataTypes) {
  return sequelize.define('InvMst', {
    TRAN_ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    INV_No: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    INV_Date: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    Book_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Tran_Type: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    Ledg_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Ledg_Name: {
      type: DataTypes.STRING(70),
      allowNull: true
    },
    Ledg_Add1: {
      type: DataTypes.STRING(70),
      allowNull: true
    },
    Ledg_Add2: {
      type: DataTypes.STRING(70),
      allowNull: true
    },
    Ledg_Add3: {
      type: DataTypes.STRING(70),
      allowNull: true
    },
    Ordr_No: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    Ordr_Date: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    Sale_Ac: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Spl_Note: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Exp_Ledg1: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Exp_Perc1: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Exp_Amt1: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Exp_Ledg2: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Exp_Perc2: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Exp_Amt2: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Exp_Ledg3: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Exp_Perc3: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Exp_Amt3: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Exp_Ledg4: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Exp_Perc4: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Exp_Amt4: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Exp_Ledg5: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Exp_Perc5: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Exp_Amt5: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Exp_Ledg6: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Exp_Perc6: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Exp_Amt6: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Exp_Ledg7: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Exp_Perc7: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Exp_Amt7: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Disc1_Ledg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Disc1_Perc: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    Disc1_Amt: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Disc2_Ledg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Disc2_Perc: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    Disc2_Amt: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Disc3_Ledg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Disc3_Perc: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    Disc3_Amt: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Disc4_Ledg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Disc4_Perc: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    Disc4_Amt: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Item_Amt: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Lbr_Amt: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Exp_Amt: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Disc_Amt: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Bill_Amt: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Chas_Id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Item_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Stat_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Pin_Code: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Ph1: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Ph2: {
      type: DataTypes.STRING(12),
      allowNull: true
    },
    Ph3: {
      type: DataTypes.STRING(12),
      allowNull: true
    },
    Ph4: {
      type: DataTypes.STRING(12),
      allowNull: true
    },
    Spl_Rem1: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Spl_Rem2: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Ret_Doc: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Suply_Place: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ISRCM: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    GSTIN: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    COUNTRY: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    REGTYPE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    LOC_CODE: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    USR_CODE: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    ENTR_DATE: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    ENTR_TIME: {
      type: DataTypes.REAL,
      allowNull: true
    },
    MOD_USER: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    MOD_DATE: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    MOD_TIME: {
      type: DataTypes.REAL,
      allowNull: true
    },
    Server_id: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    Export_Type: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    ServerId: {
      type: DataTypes.INTEGER,
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
    }
  }, {
    sequelize,
    tableName: 'InvMst',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__InvMst__C314C336625BFCD8",
        unique: true,
        fields: [
          { name: "TRAN_ID" },
        ]
      },
    ]
  });
};


const Joi = require('joi');

const InvMstSchema = Joi.object({
  INV_No: Joi.number().integer().allow(null),
  INV_Date: Joi.date().allow(null),
  Book_Code: Joi.number().integer().allow(null),
  Tran_Type: Joi.number().integer().allow(null),
  Ledg_Code: Joi.number().integer().allow(null),
  Ledg_Name: Joi.string().max(70).allow(null).allow(""),
  Ledg_Add1: Joi.string().max(70).allow(null).allow(""),
  Ledg_Add2: Joi.string().max(70).allow(null).allow(""),
  Ledg_Add3: Joi.string().max(70).allow(null).allow(""),
  Ordr_No: Joi.string().max(15).allow(null).allow(""),
  Ordr_Date: Joi.date().allow(null),
  Sale_Ac: Joi.number().integer().allow(null),
  Spl_Note: Joi.string().max(100).allow(null).allow(""),
  Exp_Ledg1: Joi.number().integer().allow(null),
  Exp_Perc1: Joi.number().allow(null),
  Exp_Amt1: Joi.number().allow(null),
  Exp_Ledg2: Joi.number().integer().allow(null),
  Exp_Perc2: Joi.number().allow(null),
  Exp_Amt2: Joi.number().allow(null),
  Exp_Ledg3: Joi.number().integer().allow(null),
  Exp_Perc3: Joi.number().allow(null),
  Exp_Amt3: Joi.number().allow(null),
  Exp_Ledg4: Joi.number().integer().allow(null),
  Exp_Perc4: Joi.number().allow(null),
  Exp_Amt4: Joi.number().allow(null),
  Exp_Ledg5: Joi.number().integer().allow(null),
  Exp_Perc5: Joi.number().allow(null),
  Exp_Amt5: Joi.string().max(255).allow(null).allow(""),
  Exp_Ledg6: Joi.number().integer().allow(null),
  Exp_Perc6: Joi.number().allow(null),
  Exp_Amt6: Joi.number().allow(null),
  Exp_Ledg7: Joi.number().integer().allow(null),
  Exp_Perc7: Joi.number().allow(null),
  Exp_Amt7: Joi.number().allow(null),
  Disc1_Ledg: Joi.number().integer().allow(null),
  Disc1_Perc: Joi.string().max(15).allow(null).allow(""),
  Disc1_Amt: Joi.number().allow(null),
  Disc2_Ledg: Joi.number().integer().allow(null),
  Disc2_Perc: Joi.string().max(15).allow(null).allow(""),
  Disc2_Amt: Joi.number().allow(null),
  Disc3_Ledg: Joi.number().integer().allow(null),
  Disc3_Perc: Joi.string().max(15).allow(null).allow(""),
  Disc3_Amt: Joi.number().allow(null),
  Disc4_Ledg: Joi.number().integer().allow(null),
  Disc4_Perc: Joi.string().max(15).allow(null).allow(""),
  Disc4_Amt: Joi.number().allow(null),
  Item_Amt: Joi.number().allow(null),
  Lbr_Amt: Joi.number().allow(null),
  Exp_Amt: Joi.number().allow(null),
  Disc_Amt: Joi.number().allow(null),
  Bill_Amt: Joi.number().allow(null),
  Chas_Id: Joi.number().integer().allow(null),
  Item_Code: Joi.number().integer().allow(null),
  Stat_Code: Joi.number().integer().allow(null),
  Pin_Code: Joi.string().max(10).allow(null).allow(""),
  Ph1: Joi.string().max(50).allow(null).allow(""),
  Ph2: Joi.string().max(12).allow(null).allow(""),
  Ph3: Joi.string().max(12).allow(null).allow(""),
  Ph4: Joi.string().max(12).allow(null).allow(""),
  Spl_Rem1: Joi.string().max(100).allow(null).allow(""),
  Spl_Rem2: Joi.string().max(100).allow(null).allow(""),
  Ret_Doc: Joi.number().integer().allow(null),
  Suply_Place: Joi.number().integer().allow(null),
  ISRCM: Joi.number().integer().allow(null),
  GSTIN: Joi.string().max(20).allow(null).allow(""),
  COUNTRY: Joi.number().integer().allow(null),
  REGTYPE: Joi.number().integer().allow(null),
  LOC_CODE: Joi.number().integer().allow(null),
  USR_CODE: Joi.number().integer().allow(null),
  ENTR_DATE: Joi.date().allow(null),
  ENTR_TIME: Joi.number().allow(null),
  MOD_USER: Joi.number().integer().allow(null),
  MOD_DATE: Joi.date().allow(null),
  MOD_TIME: Joi.number().allow(null),
  Server_id: Joi.number().integer().allow(null),
  Export_Type: Joi.number().integer().allow(null),
  ServerId: Joi.number().integer().allow(null),
  Created_by: Joi.string().max(100).allow(null)
});

module.exports = {_InvMst, InvMstSchema};