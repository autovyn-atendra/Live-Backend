const Sequelize = require("sequelize");
const _GrupMst = function (sequelize, DataTypes) {
  return sequelize.define(
    "GrupMst",
    {
      Group_Code: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Group_Name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      Sub_Group: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Exp_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      Server_Id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Export_Type: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      ServerId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      Loc_code: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      CompAct_Head: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      IsPost_Br: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Head_Seq: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Old_GCode: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Old_GName: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Old_SGName: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      IsAllow: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      TAN_YN: {
        type: Sequelize.INTEGER, // Or BOOLEAN if appropriate
        allowNull: false,
      },
      IS_COMP_ACT: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      CompAct_Head2: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      IsGeneric: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      USER_BY: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "Grup_Mst",
      schema: "dbo",
      timestamps: false,


    }


  );
};



const Joi = require('joi');
const GrupMstSchema = Joi.object({
  Group_Name: Joi.string().max(255).allow(null).allow(''),
  Sub_Group: Joi.number().allow(null).allow(''),
  Exp_Date: Joi.string().max(255).allow(null).allow('').raw(),
  Server_Id: Joi.number().allow(null).allow(''),
  Export_Type: Joi.number().allow(null).allow(''),
  ServerId: Joi.number().allow(null).allow(''),
  Loc_code: Joi.number().allow(null).allow(''),
  CompAct_Head: Joi.string().max(255).allow(null).allow(''),
  IsPost_Br: Joi.number().integer().allow(null).allow(''),
  Head_Seq: Joi.number().integer().allow(null).allow(''),
  Old_GCode: Joi.number().integer().allow(null).allow(''),
  Old_GName: Joi.string().max(100).allow(null).allow(''),
  Old_SGName: Joi.number().integer().allow(null).allow(''),
  IsAllow: Joi.number().integer().allow(null).allow(''),
  TAN_YN: Joi.alternatives().try(
    Joi.boolean(),
    Joi.number().valid(0, 1).custom((value, helpers) => {
      if (value === 1) return true;
      if (value === 0) return false;
      return value;
    }),
    Joi.string().valid('true', 'false').custom((value, helpers) => {
      if (value === 'true') return true;
      if (value === 'false') return false;
      return value;
    })
  ).allow(null).allow(''),
  IS_COMP_ACT: Joi.number().integer().allow(null).allow(''),
  CompAct_Head2: Joi.string().max(255).allow(null).allow(''),
  IsGeneric: Joi.number().integer().allow(null).allow(''),
  USER_BY: Joi.string().max(50).required(),
});

module.exports = { _GrupMst, GrupMstSchema };
