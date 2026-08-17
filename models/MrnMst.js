const Sequelize = require('sequelize');
const _MrnMst = function(sequelize, DataTypes) {
  return sequelize.define('MrnMst', {
    TRAN_ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    MRN_No: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MRN_Date: {
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
    Purc_Type: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    Supp_No: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Supp_Code: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Supp_Date: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    Chln_Id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Ordr_Id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    GR_Name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    GR_No: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    GR_Date: {
      type: "SMALLDATETIME",
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
    Exp_Amt1: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Exp_Perc1: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Exp_Ledg2: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Exp_Amt2: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Exp_Perc2: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Exp_Ledg3: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Exp_Amt3: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Exp_Perc3: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Exp_Ledg4: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Exp_Amt4: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Exp_Perc4: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Exp_Ledg5: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Exp_Amt5: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Exp_Perc5: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Exp_Ledg6: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Exp_Amt6: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Exp_Perc6: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Exp_Ledg7: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Exp_Amt7: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Exp_Perc7: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Exp_Ledg8: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Exp_Amt8: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Exp_Perc8: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Exp_Ledg9: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Exp_Amt9: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Exp_Perc9: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Exp_Ledg10: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Exp_Amt10: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Exp_Perc10: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Exp_Ledg11: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Exp_Amt11: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Exp_Perc11: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Item_Amt: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Exp_Amt: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Bill_Amt: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Ret_Doc: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Loc_Code: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    USR_CODE: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    MOD_USER: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    ENTR_DATE: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    Server_id: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    Export_Type: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    Post_Ac: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ServerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    CF_No: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    CF_Date: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    Bill_Currency: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    Pymt_Mode: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    Pymt_Date: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    Clear_Date: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    Desp_By: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    Form_Type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Form_SrlNo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Form_No: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Form_Date: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    DSE_Code: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Ordr_Type: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Cr_Days: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Supp_Name: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    PO_Status: {
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
    tableName: 'MrnMst',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__MrnMst__C314C3364A3B2318",
        unique: true,
        fields: [
          { name: "TRAN_ID" },
        ]
      },
    ]
  });
};


const Joi = require('joi');

const MrnMstSchema = Joi.object({
  MRN_No: Joi.number().integer().allow(null),
  MRN_Date: Joi.date().allow(null),
  Book_Code: Joi.number().integer().allow(null),
  Tran_Type: Joi.number().integer().allow(null),
  Purc_Type: Joi.number().integer().allow(null),
  Supp_No: Joi.string().max(25).allow(null),
  Supp_Code: Joi.number().integer().allow(null),
  Supp_Date: Joi.date().allow(null),
  Chln_Id: Joi.number().integer().allow(null),
  Ordr_Id: Joi.number().integer().allow(null),
  GR_Name: Joi.string().max(50).allow(null),
  GR_No: Joi.string().max(50).allow(null),
  GR_Date: Joi.date().allow(null),
  Spl_Note: Joi.string().max(100).allow(null),
  Exp_Ledg1: Joi.number().integer().allow(null),
  Exp_Amt1: Joi.number().allow(null),
  Exp_Perc1: Joi.number().allow(null),
  Exp_Ledg2: Joi.number().integer().allow(null),
  Exp_Amt2: Joi.number().allow(null),
  Exp_Perc2: Joi.number().allow(null),
  Exp_Ledg3: Joi.number().integer().allow(null),
  Exp_Amt3: Joi.number().allow(null),
  Exp_Perc3: Joi.number().allow(null),
  Exp_Ledg4: Joi.number().integer().allow(null),
  Exp_Amt4: Joi.number().allow(null),
  Exp_Perc4: Joi.number().allow(null),
  Exp_Ledg5: Joi.number().integer().allow(null),
  Exp_Amt5: Joi.number().allow(null),
  Exp_Perc5: Joi.number().allow(null),
  Exp_Ledg6: Joi.number().integer().allow(null),
  Exp_Amt6: Joi.number().allow(null),
  Exp_Perc6: Joi.number().allow(null),
  Exp_Ledg7: Joi.number().integer().allow(null),
  Exp_Amt7: Joi.number().allow(null),
  Exp_Perc7: Joi.number().allow(null),
  Exp_Ledg8: Joi.number().integer().allow(null),
  Exp_Amt8: Joi.number().allow(null),
  Exp_Perc8: Joi.number().allow(null),
  Exp_Ledg9: Joi.number().integer().allow(null),
  Exp_Amt9: Joi.number().allow(null),
  Exp_Perc9: Joi.number().allow(null),
  Exp_Ledg10: Joi.number().integer().allow(null),
  Exp_Amt10: Joi.number().allow(null),
  Exp_Perc10: Joi.number().allow(null),
  Exp_Ledg11: Joi.number().integer().allow(null),
  Exp_Amt11: Joi.number().allow(null),
  Exp_Perc11: Joi.number().allow(null),
  Item_Amt: Joi.number().allow(null),
  Exp_Amt: Joi.number().allow(null),
  Bill_Amt: Joi.number().allow(null),
  Ret_Doc: Joi.number().integer().allow(null),
  Loc_Code: Joi.number().integer().allow(null),
  USR_CODE: Joi.number().integer().allow(null),
  MOD_USER: Joi.number().integer().allow(null),
  ENTR_DATE: Joi.date().allow(null),
  Server_id: Joi.number().integer().allow(null),
  Export_Type: Joi.number().integer().required(),
  Post_Ac: Joi.number().integer().allow(null),
  ServerId: Joi.number().integer().required(),
  CF_No: Joi.string().max(25).allow(null),
  CF_Date: Joi.date().allow(null),
  Bill_Currency: Joi.number().integer().allow(null),
  Pymt_Mode: Joi.number().integer().allow(null),
  Pymt_Date: Joi.date().allow(null),
  Clear_Date: Joi.date().allow(null),
  Desp_By: Joi.string().max(250).allow(null),
  Form_Type: Joi.number().integer().allow(null),
  Form_SrlNo: Joi.string().max(50).allow(null),
  Form_No: Joi.string().max(25).allow(null),
  Form_Date: Joi.date().allow(null),
  DSE_Code: Joi.number().integer().allow(null),
  Ordr_Type: Joi.number().integer().allow(null),
  Cr_Days: Joi.number().allow(null),
  Supp_Name: Joi.string().max(250).allow(null),
  PO_Status: Joi.number().integer().allow(null),
  Created_by: Joi.string().max(100).allow(null)
});

module.exports = { _MrnMst, MrnMstSchema};
