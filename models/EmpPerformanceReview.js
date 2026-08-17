const Sequelize = require("sequelize");
const _Emp_Performance_Review = function (sequelize, DataTypes) {
  return sequelize.define(
    "EmpPerformanceReview",
    {
      UTD: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      Empcode: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      Emp_Name: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      Region: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Location: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      Department: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      Designation: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      Gender: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      JoiningDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      DOB: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      Reporting_1: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      Reporting_2: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      Reporting_3: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      ApraisalDateFrom: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      ApraisalDateTo: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      LastPromotionDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      TotalAbsentDays: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      TotalPresentDays: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      Attn_age_per: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Last_Year_Rating: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Apraisal_Cycle: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Created_By: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "Emp_Performance_Review",
      schema: "dbo",
      timestamps: false,
      indexes: [
        {
          name: "PK__Purchase__C5B6F0D2F02C5058",
          unique: true,
          fields: [{ name: "UTD" }],
        },
      ],
    }
  );
};

const Joi = require("joi");

const EmpPerformanceReviewSchema = Joi.object({
  UTD: Joi.number().integer().positive().allow(null), // Optional and numeric
  Empcode: Joi.string().max(20).allow(null),
  Emp_Name: Joi.string().max(200).allow(null),
  Region: Joi.string().max(100).allow(null),
  Location: Joi.string().max(20).allow(null),
  Department: Joi.string().max(200).allow(null),
  Designation: Joi.string().max(200).allow(null),
  Gender: Joi.string().max(100).allow(null),
  JoiningDate: Joi.date().iso().allow(null),
  DOB: Joi.date().iso().allow(null),
  Reporting_1: Joi.string().max(200).allow(null),
  Reporting_2: Joi.string().max(200).allow(null),
  Reporting_3: Joi.string().max(200).allow(null),
  ApraisalDateFrom: Joi.date().iso().allow(null),
  ApraisalDateTo: Joi.date().iso().allow(null),
  LastPromotionDate: Joi.date().iso().allow(null),
  TotalAbsentDays: Joi.alternatives()
    .try(Joi.string().max(20), Joi.number())
    .optional()
    .allow(null, ""),
  TotalPresentDays: Joi.alternatives()
    .try(Joi.string().max(20), Joi.number())
    .optional()
    .allow(null, ""),
  Attn_age_per: Joi.string().max(50).allow(null),
  Last_Year_Rating: Joi.string().max(50).allow(null),
  Apraisal_Cycle: Joi.alternatives()
    .try(Joi.string().max(50), Joi.number())
    .optional()
    .allow(null, ""),
  Created_By: Joi.string().max(255).allow(null),
});

module.exports = {
  _Emp_Performance_Review,
  EmpPerformanceReviewSchema,
};
