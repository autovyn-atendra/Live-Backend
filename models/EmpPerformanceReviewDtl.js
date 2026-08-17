const Sequelize = require("sequelize");
const _Emp_Performance_Review_Dtl = function (sequelize, DataTypes) {
  return sequelize.define(
    "EmpPerformanceReviewDtl",
    {
        UTD: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
          },
          ReviewUtd: {
            type: DataTypes.STRING(20),
            allowNull: true,
          },
          Empcode: {
            type: DataTypes.STRING(20),
            allowNull: true,
          },
          Tran_Type: {
            type: DataTypes.STRING(20),
            allowNull: true,
          },
          Training_Name: {
            type: DataTypes.STRING(500),
            allowNull: true,
          },
          Training_Date: {
            type: DataTypes.DATE,
            allowNull: true,
          },
          Award_Name: {
            type: DataTypes.STRING(500),
            allowNull: true,
          },
          Award_Date: {
            type: DataTypes.DATE,
            allowNull: true,
          },
          Counselling_Desc: {
            type: DataTypes.STRING(500),
            allowNull: true,
          },
          Counselling_Date: {
            type: DataTypes.DATE,
            allowNull: true,
          },
          Review_Code: {
            type: DataTypes.STRING(50),
            allowNull: true,
          },
          Review_Rating: {
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
      tableName: "Emp_Performance_Review_Dtl",
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

const EmpPerformanceReviewDtlSchema = Joi.object({
  UTD: Joi.number().integer().positive().allow(null), // Optional and numeric
    ReviewUtd: Joi.string().max(20).optional(),
    Empcode: Joi.string().max(20).optional(),
    Tran_Type: Joi.alternatives().try(Joi.string().max(20), Joi.number()).optional().allow(null, ""),
    Training_Name: Joi.string().max(500).optional(),
    Training_Date: Joi.date().optional(),
    Award_Name: Joi.string().max(500).optional(),
    Award_Date: Joi.date().optional(),
    Counselling_Desc: Joi.string().max(500).optional(),
    Counselling_Date: Joi.date().optional(),
    Review_Code: Joi.alternatives().try(Joi.string().max(50), Joi.number()).optional().allow(null, ""),
    Review_Rating: Joi.alternatives().try(Joi.string().max(50), Joi.number()).optional().allow(null, ""),
    Created_By: Joi.string().max(255).optional(),
});

module.exports = {
    _Emp_Performance_Review_Dtl,
    EmpPerformanceReviewDtlSchema,
};
