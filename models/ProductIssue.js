const Sequelize = require('sequelize');
const _Product_Issue = function (sequelize, DataTypes) {
  return sequelize.define('ProductIssue', {
    tran_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Req_Date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    EmpCode: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Category: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    SubCategory: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Description: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    Reason: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    Location: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Appr_1_Code: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Appr_1_Stat: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    Appr_1_Date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Appr_1_Rem: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    Appr_2_Code: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Appr_2_Stat: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    Appr_2_Date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Appr_2_Rem: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    Appr_3_Code: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Appr_3_Stat: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    Appr_3_Date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Appr_3_Rem: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    Fin_Appr: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    srm: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Issued_Asset: {
      type: DataTypes.STRING(4000),
      allowNull: true
    },
    Revoked_Asset: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    IssuedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Returnable: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Quantity: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Revoke_Reason: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    RevokeDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Created_By: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'Product_Issue',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Product___C5B6F0D28FFEE240",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};

const Joi = require('joi');

const productIssueSchema = Joi.object({
  tran_id: Joi.number().integer().positive(), // autoIncremented, so typically not needed in input validation
  Req_Date: Joi.date().optional(),
  EmpCode: Joi.alternatives()
    .try(Joi.string().max(10), Joi.number())
    .optional(),
  Category: Joi.alternatives()
    .try(Joi.string().max(20), Joi.number())
    .optional().allow(null, ''),
  SubCategory: Joi.alternatives()
    .try(Joi.string().max(20), Joi.number())
    .optional().allow(null, ''),
  Description: Joi.string().max(200).required(),
  Reason: Joi.string().max(200).optional().allow(null, ''),
  Location: Joi.alternatives()
    .try(Joi.string().max(10), Joi.number())
    .required(),
  Appr_1_Code: Joi.string().max(100).optional(),
  Appr_1_Stat: Joi.number().integer().min(0).max(255).optional(), // TINYINT
  Appr_1_Date: Joi.date().optional(),
  Appr_1_Rem: Joi.string().max(300).optional(),
  Appr_2_Code: Joi.string().max(100).optional(),
  Appr_2_Stat: Joi.number().integer().min(0).max(255).optional(), // TINYINT
  Appr_2_Date: Joi.date().optional(),
  Appr_2_Rem: Joi.string().max(300).optional(),
  Appr_3_Code: Joi.string().max(100).optional(),
  Appr_3_Stat: Joi.number().integer().min(0).max(255).optional(), // TINYINT
  Appr_3_Date: Joi.date().optional(),
  Appr_3_Rem: Joi.string().max(300).optional(),
  Fin_Appr: Joi.number().integer().min(0).max(255).optional(), // TINYINT
  srm: Joi.alternatives()
    .try(Joi.string().max(10), Joi.number())
    .optional(),
  Issued_Asset: Joi.string().max(4000).optional().allow(null),
  Revoked_Asset: Joi.string().max(4000).optional().allow(null),
  IssuedDate: Joi.date().optional().allow(null),
  Returnable: Joi.alternatives()
    .try(Joi.string().max(50), Joi.number())
    .optional(),
  Quantity: Joi.alternatives()
    .try(Joi.string().max(10), Joi.number())
    .optional(),
  Revoke_Reason: Joi.string().max(200).optional().allow(null),
  RevokeDate: Joi.date().optional().allow(null),
  Created_By: Joi.string().max(255).optional().allow(null),
});

module.exports = { _Product_Issue, productIssueSchema };

