const Sequelize = require('sequelize');
const _MGA_Approval = function (sequelize, DataTypes) {
  return sequelize.define('MGAApproval', {
    UTD: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      Req_Date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      EmpCode: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      Cust_Id: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      VIN: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Invoice_No: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Cust_Name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Cust_Mobile: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      MGAIssuedDMS: {
        type: DataTypes.STRING(10),
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
      Location: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      Cust_Status: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      MGAPromisedAmt: {
        type: DataTypes.STRING(20),
        allowNull: true,
      }
  }, {
    sequelize,
    tableName: 'MGA_Approval',
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

const MGAApprovalSchema = Joi.object({
    UTD: Joi.number().integer().optional(),
    Req_Date: Joi.date().optional(),
    EmpCode: Joi.string().max(10).optional(),
    Cust_Id: Joi.string().max(50).optional(),
    VIN: Joi.string().max(50).optional(),
    Invoice_No: Joi.string().max(50).optional(),
    Cust_Name: Joi.string().max(100).optional(),
    Cust_Mobile: Joi.string().max(15).optional(),
    MGAIssuedDMS: Joi.alternatives()
    .try(Joi.string().max(10), Joi.number())
    .optional(),
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
    Location: Joi.alternatives()
    .try(Joi.string().max(10), Joi.number())
    .optional(),
    Cust_Status: Joi.alternatives()
    .try(Joi.string().max(10), Joi.number())
    .optional(),
    MGAPromisedAmt: Joi.alternatives()
    .try(Joi.string().max(20), Joi.number())
    .optional(),
});

module.exports = { _MGA_Approval, MGAApprovalSchema };

