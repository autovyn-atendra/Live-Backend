const Sequelize = require('sequelize');
const _MiscMst = function (sequelize, DataTypes) {
  return sequelize.define('MiscMst', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Misc_Type: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Misc_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Misc_Name: {
      type: DataTypes.STRING(75),
      allowNull: true
    },
    Misc_Abbr: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Misc_Add1: {
      type: DataTypes.STRING(70),
      allowNull: true
    },
    Misc_Add2: {
      type: DataTypes.STRING(70),
      allowNull: true
    },
    Misc_Add3: {
      type: DataTypes.STRING(70),
      allowNull: true
    },
    Misc_Phon: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Misc_Mob: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Misc_Desig: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Misc_HOD: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Misc_Dtl1: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Misc_Dtl2: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Misc_Num1: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Join_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Birth_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Aniv_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Exp_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Server_Id: {
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
    Loc_code: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Misc_Dtl3: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    MISC_NUM2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Tally_Vch: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    SPL_REM: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    CC_Group: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CC_Ledg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    LOB: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CC_Ledg2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    IsZeroAmtInv: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Assessable_Column: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'Misc_Mst',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Misc_Mst__C5B6F0D2D1C29F4D",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};



const Joi = require('joi');

const MiscMstSchema = Joi.object({
  Misc_Type: Joi.number().integer(),
  Misc_Code: Joi.number().integer().allow(null).allow(''),
  Misc_Name: Joi.string().max(75).allow(null).allow(''),
  Misc_Abbr: Joi.string().max(50).allow(null).allow(''),
  Misc_Add1: Joi.string().max(70).allow(null).allow(''),
  Misc_Add2: Joi.string().max(70).allow(null).allow(''),
  Misc_Add3: Joi.string().max(70).allow(null).allow(''),
  Misc_Phon: Joi.string().max(50).allow(null).allow(''),
  Misc_Mob: Joi.string().max(50).allow(null).allow(''),
  Misc_Desig: Joi.string().max(50).allow(null).allow(''),
  Misc_HOD: Joi.number().integer().allow(null).allow(''),
  Misc_Dtl1: Joi.string().max(50).allow(null).allow(''),
  Misc_Dtl2: Joi.string().max(50).allow(null).allow(''),
  Misc_Num1: Joi.number().integer().allow(null).allow(''),
  Join_Date: Joi.date().raw().allow(null).allow(''),
  Birth_Date: Joi.date().raw().allow(null).allow(''),
  Aniv_Date: Joi.date().raw().allow(null).allow(''),
  Exp_Date: Joi.date().raw().allow(null).allow(''),
  Server_Id: Joi.number().integer().allow(null).allow(''),
  Export_Type: Joi.number().integer().allow(null).allow(''),
  ServerId: Joi.number().integer().allow(null).allow(''),
  Loc_code: Joi.number().integer().allow(null).allow(''),
  Loc_Code: Joi.number().integer().allow(null).allow(''),
  Misc_Dtl3: Joi.string().max(200).allow(null).allow(''),
  MISC_NUM2: Joi.number().integer().allow(null).allow(''),
  Tally_Vch: Joi.string().max(100).allow(null).allow(''),
  SPL_REM: Joi.string().max(200).allow(null).allow(''),
  CC_Group: Joi.number().integer().allow(null).allow(''),
  CC_Ledg: Joi.number().integer().allow(null).allow(''),
  LOB: Joi.number().integer().allow(null).allow(''),
  CC_Ledg2: Joi.number().integer().allow(null).allow(''),
  IsZeroAmtInv: Joi.number().integer().allow(null).allow(''),
  Assessable_Column: Joi.number().integer().allow(null).allow(''),
  // Created_by: Joi.string().max(100).allow(null).allow(''),
});

module.exports = { _MiscMst, MiscMstSchema };
