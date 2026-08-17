const Sequelize = require("sequelize");
const _Product_Service = function (sequelize, DataTypes) {
  return sequelize.define(
    "ProductService",
    {
      UTD: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Req_Date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      EmpCode: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      Category: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      SubCategory: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      Description: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      Document: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      Reason: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      Location: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      Priority: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Service_Date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      Part_Amount: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },
      Labour_Amount: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },
      NextDue_Date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      Flag: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      Asset_Product: {
        type: DataTypes.STRING(4000),
        allowNull: true,
      },
      Appr_1_Code: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Appr_1_Stat: {
        type: DataTypes.TINYINT,
        allowNull: true,
      },
      Appr_1_Date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      Appr_1_Rem: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },
      Appr_2_Code: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Appr_2_Stat: {
        type: DataTypes.TINYINT,
        allowNull: true,
      },
      Appr_2_Date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      Appr_2_Rem: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },
      Appr_3_Code: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Appr_3_Stat: {
        type: DataTypes.TINYINT,
        allowNull: true,
      },
      Appr_3_Date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      Appr_3_Rem: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },
      Fin_Appr: {
        type: DataTypes.TINYINT,
        allowNull: true,
      },
      srm: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      Created_By: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      Service_Type: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      EmpDue_Date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      New_Description: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Service_Status: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "Product_Service",
      schema: "dbo",
      timestamps: false,
      indexes: [
        {
          name: "PK__Product___C5B6F0D28F0E29A3",
          unique: true,
          fields: [{ name: "UTD" }],
        },
      ],
    }
  );
};

const Joi = require("joi");

const productServiceSchema = Joi.object({
  Req_Date: Joi.date().optional(),
  EmpCode: Joi.string().max(10).optional(),
  Category: Joi.string().max(20).optional(),
  SubCategory: Joi.string().max(20).optional(),
  Description: Joi.string().max(100).optional(),
  Reason: Joi.string().max(200).optional(),
  Location: Joi.alternatives()
    .try(Joi.string().max(10), Joi.number())
    .optional(),
  Priority: Joi.alternatives()
    .try(Joi.string().max(100), Joi.number())
    .optional(),
  Service_Date: Joi.date().optional(),
  Part_Amount: Joi.number().precision(4).optional(),
  Labour_Amount: Joi.number().precision(4).optional(),
  NextDue_Date: Joi.date().optional(),
  Flag: Joi.string().max(10).optional().allow(null),
  Asset_Product: Joi.string().max(4000).optional(),
  Appr_1_Code: Joi.string().max(100).optional(),
  Appr_1_Stat: Joi.number().integer().min(0).max(255).optional(),
  Appr_1_Date: Joi.date().optional(),
  Appr_1_Rem: Joi.string().max(300).optional(),
  Appr_2_Code: Joi.string().max(100).optional(),
  Appr_2_Stat: Joi.number().integer().min(0).max(255).optional(),
  Appr_2_Date: Joi.date().optional(),
  Appr_2_Rem: Joi.string().max(300).optional(),
  Appr_3_Code: Joi.string().max(100).optional(),
  Appr_3_Stat: Joi.number().integer().min(0).max(255).optional(),
  Appr_3_Date: Joi.date().optional(),
  Appr_3_Rem: Joi.string().max(300).optional(),
  Fin_Appr: Joi.number().integer().min(0).max(255).optional(),
  srm: Joi.string().max(20).optional(),
  Created_By: Joi.string().max(255).optional(),
  Service_Type: Joi.string().max(100).optional(),
  EmpDue_Date: Joi.date().optional(),
  New_Description: Joi.string().max(50).optional(),
  Service_Status: Joi.string().max(50).optional(),
  Document: Joi.string().max(255).optional().allow(null, ''),
});

module.exports = { _Product_Service, productServiceSchema };
