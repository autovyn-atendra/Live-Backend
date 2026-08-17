const Sequelize = require('sequelize');
const _BranchMst  = function(sequelize, DataTypes) {
  return sequelize.define('BranchMst', {
    Godw_Code: {
      autoIncrement: true,
      type: DataTypes.TINYINT,
      allowNull: false,
      primaryKey: true
    },
    Comp_Code: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    Godw_Name: {
      type: DataTypes.STRING(75),
      allowNull: true
    },
    Godw_Add1: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Godw_Add2: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Godw_Add3: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Godw_Seq: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Godw_Abbr: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Godw_Catg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    State_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Exp_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Lock_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Reg_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    GST_Lock_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    INPUT_GST_LOCK_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    ServerId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    BRANCH_LOCK_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Pin_Code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Mob_No: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    State: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    City: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    GST_No: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    PAN_No: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    TALLY_BRANCH_NAME: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    TRADE_NAME: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Insu_Branch: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    SALE_INV_PREFIX: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Old_DMS_HSN_Code: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Spl_Rem: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    ECC_No: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    IEC_No: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    Goods_Name: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    Chap_Head: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    Excise_Book: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    Range_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Range_Name: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    Range_Add1: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Range_Add2: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Range_Add3: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Com_Code: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    Com_Name: {
      type: DataTypes.STRING(75),
      allowNull: true
    },
    Com_Add1: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Com_Add2: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Com_Add3: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    TC_NUMBER: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    BC_Prefix: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    WA_Footer: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    Export_type: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    Created_by: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Created_At: {
      type: DataTypes.DATE,
      allowNull: true,
    } 
  }, {
    sequelize,
    tableName: 'Branch_Mst',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Branch_M__098C2B017D6FB5FA",
        unique: true,
        fields: [
          { name: "Godw_Code" },
        ]
      },
    ]
  });
};


const Joi = require('joi');

const branchMstSchema = Joi.object({
    Godw_Code: Joi.number().integer().min(1).required(),
    Comp_Code: Joi.number().integer().min(1).allow(null).allow(''),
    Godw_Name: Joi.string().max(75).allow(null).allow(''),
    Godw_Add1: Joi.string().max(100).allow(null).allow(''),
    Godw_Add2: Joi.string().max(100).allow(null).allow(''),
    Godw_Add3: Joi.string().max(100).allow(null).allow(''),
    Godw_Seq: Joi.number().integer().allow(null).allow(''),
    Godw_Abbr: Joi.string().max(20).allow(null).allow(''),
    Godw_Catg: Joi.number().integer().allow(null).allow(''),
    State_Code: Joi.number().integer().allow(null).allow(''),
    Exp_Date: Joi.date().allow(null).allow(''),
    Lock_Date: Joi.date().allow(null).allow(''),
    Reg_Date: Joi.date().allow(null).allow(''),
    GST_Lock_Date: Joi.date().allow(null).allow(''),
    INPUT_GST_LOCK_DATE: Joi.date().allow(null).allow(''),
    ServerId: Joi.number().integer().allow(null).allow(''),
    BRANCH_LOCK_DATE: Joi.date().allow(null).allow(''),
    Pin_Code: Joi.string().max(50).allow(null).allow(''),
    Mob_No: Joi.string().max(50).allow(null).allow(''),
    State: Joi.string().max(50).allow(null).allow(''),
    City: Joi.string().max(50).allow(null).allow(''),
    GST_No: Joi.string().max(20).allow(null).allow(''),
    PAN_No: Joi.string().max(20).allow(null).allow(''),
    TALLY_BRANCH_NAME: Joi.string().max(150).allow(null).allow(''),
    TRADE_NAME: Joi.string().max(100).allow(null).allow(''),
    Insu_Branch: Joi.string().max(50).allow(null).allow(''),
    SALE_INV_PREFIX: Joi.string().max(30).allow(null).allow(''),
    Old_DMS_HSN_Code: Joi.string().max(10).allow(null).allow(''),
    Spl_Rem: Joi.string().max(100).allow(null).allow(''),
    ECC_No: Joi.string().max(40).allow(null).allow(''),
    IEC_No: Joi.string().max(40).allow(null).allow(''),
    Goods_Name: Joi.string().max(40).allow(null).allow(''),
    Chap_Head: Joi.string().max(40).allow(null).allow(''),
    Excise_Book: Joi.string().max(40).allow(null).allow(''),
    Range_Code: Joi.number().integer().allow(null).allow(''),
    Range_Name: Joi.string().max(40).allow(null).allow(''),
    Range_Add1: Joi.string().max(100).allow(null).allow(''),
    Range_Add2: Joi.string().max(100).allow(null).allow(''),
    Range_Add3: Joi.string().max(100).allow(null).allow(''),
    Com_Code: Joi.string().max(40).allow(null).allow(''),
    Com_Name: Joi.string().max(75).allow(null).allow(''),
    Com_Add1: Joi.string().max(100).allow(null).allow(''),
    Com_Add2: Joi.string().max(100).allow(null).allow(''),
    Com_Add3: Joi.string().max(100).allow(null).allow(''),
    TC_NUMBER: Joi.string().max(1).allow(null).allow(''),
    BC_Prefix: Joi.string().max(50).allow(null).allow(''),
    WA_Footer: Joi.string().max(60).allow(null).allow(''),
    Export_type: Joi.number().integer().allow(null).allow(''),
    Created_by: Joi.string().max(30).allow(null).allow('')
});

module.exports = { _BranchMst, branchMstSchema};
