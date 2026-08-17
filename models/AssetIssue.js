const Sequelize = require("sequelize");
const _AssetIssue = function (sequelize, DataTypes) {
  return sequelize.define(
    "AssetIssue",
    {
      UTD: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      SRNO: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Emp_Code: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      Aset_Code: {
        type: DataTypes.STRING(250),
        allowNull: true
      },
      Emp_Loc: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Issue_Date: {
        type: "SMALLDATETIME",
        allowNull: true
      },
      Issue_Rem: {
        type: DataTypes.STRING(150),
        allowNull: true
      },
      Revoke_Date: {
        type: "SMALLDATETIME",
        allowNull: true
      },
      Revoke_User: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Revoke_Cond: {
        type: DataTypes.STRING(150),
        allowNull: true
      },
      Revoke_Rem: {
        type: DataTypes.STRING(150),
        allowNull: true
      },
      Export_type: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Loc_Code: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Inv_No: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Emp_Dept: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Asset_Serial_no: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Asset_Type: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Lost_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      sr_no: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Created_by: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Aset_Name: {
        type: DataTypes.STRING(500),
        allowNull: true
      },
      uploaded_document: {
        type: DataTypes.STRING(500),
        allowNull: true
      },
      Asset_category: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
       It_category: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
    },
    {
      sequelize,
      tableName: "Asset_Issue",
      schema: "dbo",
      timestamps: false,
      indexes: [
        {
          name: "PK__Asset_Is__C5B6F0D21EED522D",
          unique: true,
          fields: [
            { name: "UTD" },
          ]
        },
      ]
    }
  );
};

const Joi = require("joi");

const assetIssueSchema = Joi.object({
  SRNO: Joi.number().integer().positive().allow(null),
  Emp_Code: Joi.string().max(50).allow(null),
  Aset_Code: Joi.string().max(250).allow(null),
  Aset_Name: Joi.string().max(500).allow(null),
  Emp_Loc: Joi.string().max(100).allow(null),
  Issue_Date: Joi.date().raw().allow(null),
  Issue_Rem: Joi.string().max(150).allow(null),
  Revoke_Date: Joi.date().raw().allow(null),
  Revoke_User: Joi.number().integer().positive().allow(null),
  Revoke_Cond: Joi.string().max(150).allow(null),
  Revoke_Rem: Joi.string().max(150).allow(null),
  Export_type: Joi.number().integer().positive().allow(null),
  Loc_Code: Joi.number().integer().positive().allow(null),
  Inv_No: Joi.number().integer().positive().allow(null),
  Emp_Dept: Joi.string().max(100).allow(null),
  Asset_Serial_no: Joi.string().max(100).allow(null),
  Asset_Type: Joi.string().max(100).allow(null),
  Lost_Date: Joi.date().raw().allow(null),
  sr_no: Joi.number().integer().positive().allow(null),
  Created_by: Joi.string().max(100).allow(null),
  Aset_Name: Joi.string().max(500).allow(null),
  uploaded_document: Joi.string().max(500).allow(null),
  Asset_category: Joi.string().max(20).allow(null),
  It_category: Joi.string().max(20).allow(null),
});

module.exports = { assetIssueSchema, _AssetIssue };
