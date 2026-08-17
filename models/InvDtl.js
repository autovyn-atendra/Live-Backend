const Sequelize = require('sequelize');
const _InvDtl = function(sequelize, DataTypes) {
  return sequelize.define('InvDtl', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Tran_Id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Tran_type: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    SrNo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Item_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Item_Catg: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    Sup_Catg: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    Dmd_Qty: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Sup_Qty: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Unit_Rate: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Item_Disc: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Item_Rate: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Vat_Perc: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Item_Vat: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Amount: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Rtn_Qty: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Item_Ref: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Ref_Date: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    Post_Acnt: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Mech_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Entry_Date: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    Entry_User: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Edit_Date: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    Edit_User: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Loc_Code: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Comp_Code: {
      type: DataTypes.SMALLINT,
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
    tableName: 'InvDtl',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__InvDtl__C5B6F0D27337E144",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};


const Joi = require('joi');

const InvDtlSchema = Joi.object({
  Tran_Id: Joi.number().integer().allow(null),
  Tran_type: Joi.number().integer().allow(null),
  SrNo: Joi.number().integer().allow(null),
  Item_Code: Joi.number().integer().allow(null),
  Item_Catg: Joi.number().integer().allow(null),
  Sup_Catg: Joi.string().max(1).allow(null),
  Dmd_Qty: Joi.number().precision(4).allow(null),
  Sup_Qty: Joi.number().precision(4).allow(null),
  Unit_Rate: Joi.number().precision(4).allow(null),
  Item_Disc: Joi.number().precision(4).allow(null),
  Item_Rate: Joi.number().precision(4).allow(null),
  Vat_Perc: Joi.number().precision(4).allow(null),
  Item_Vat: Joi.number().precision(4).allow(null),
  Amount: Joi.number().precision(4).allow(null),
  Rtn_Qty: Joi.number().precision(4).allow(null),
  Item_Ref: Joi.string().max(50).allow(null),
  Ref_Date: Joi.date().allow(null),
  Post_Acnt: Joi.number().integer().allow(null),
  Mech_Code: Joi.number().integer().allow(null),
  Entry_Date: Joi.date().allow(null),
  Entry_User: Joi.number().integer().allow(null),
  Edit_Date: Joi.date().allow(null),
  Edit_User: Joi.number().integer().allow(null),
  Loc_Code: Joi.number().integer().allow(null),
  Comp_Code: Joi.number().integer().allow(null),
  ServerId: Joi.number().integer().allow(null),
  Export_Type: Joi.number().integer().required(),
  Created_by: Joi.string().max(100).allow(null)
});

module.exports = {_InvDtl, InvDtlSchema};
