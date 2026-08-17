const Sequelize = require('sequelize');
const _BookMst = function(sequelize, DataTypes) {
  return sequelize.define('BookMst', {
    Book_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Book_Name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Book_Type: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Ledg_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Book_Bal: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Exp_Date: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    Server_Id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Export_Type: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    Loc_Code: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    ServerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Init_No: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Book_Sufix: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Book_Prefix: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Doc_Head: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Book_Catg: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    GST_Impact: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Zero_Padding: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Tally_Vch: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    DateFrom: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    DateUpto: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Vch_Seq: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Inv_Book: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DMS_Book: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    GST_YN: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Book_Class: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    TA_VCH: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    LOB: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Higher_Val: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    RctType: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Date_Print: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    IsZeroAmtInv: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    IsBankApi: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Bank_Ledg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CORPCC_Trf: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    GUID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Created_By: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Book_Mst',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Book_Mst__15B69B8EBF509619",
        unique: true,
        fields: [
          { name: "GUID" },
        ]
      },
    ]
  });
};

const Joi = require('joi');

const bookMstSchema = Joi.object({
  Book_Name: Joi.string().max(100).allow(null),
  Book_Type: Joi.string().max(10).allow(null),
  Ledg_Code: Joi.number().integer().allow(null),
  Book_Bal: Joi.number().allow(null),
  Exp_Date: Joi.date().raw().allow(null),
  Server_Id: Joi.number().integer().allow(null),
  Export_Type: Joi.number().integer().required(),
  Loc_Code: Joi.number().integer().allow(null),
  ServerId: Joi.number().integer().required(),
  Init_No: Joi.number().integer().allow(null),
  Book_Sufix: Joi.string().max(25).allow(null).allow(''),
  Book_Prefix: Joi.string().max(25).allow(null).allow(''),
  Doc_Head: Joi.string().max(100).allow(null).allow(''),
  Book_Catg: Joi.number().integer().allow(null),
  GST_Impact: Joi.number().integer().allow(null),
  Zero_Padding: Joi.number().integer().allow(null),
  Tally_Vch: Joi.string().max(100).allow(null).allow(''),
  DateFrom: Joi.date().raw().allow(null),
  DateUpto: Joi.date().raw().allow(null),
  Vch_Seq: Joi.number().integer().allow(null),
  Inv_Book: Joi.number().integer().allow(null),
  DMS_Book: Joi.number().integer().allow(null),
  GST_YN: Joi.number().integer().allow(null),
  Book_Class: Joi.number().integer().allow(null),
  TA_VCH: Joi.number().integer().allow(null),
  LOB: Joi.number().integer().allow(null),
  Higher_Val: Joi.number().allow(null),
  RctType: Joi.number().integer().allow(null),
  Date_Print: Joi.number().integer().allow(null),
  IsZeroAmtInv: Joi.number().integer().allow(null),
  IsBankApi: Joi.number().integer().allow(null),
  Bank_Ledg: Joi.number().integer().allow(null),
  CORPCC_Trf: Joi.number().integer().allow(null),
  Created_By: Joi.string().max(200).allow(null)
});

module.exports = {_BookMst, bookMstSchema};
