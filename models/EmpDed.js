const Sequelize = require('sequelize');
const _EmpDed = function (sequelize, DataTypes) {
  return sequelize.define('EmpDed', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Ded_Type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Emp_Id: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    Emp_Name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Mnth: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Rec_Date: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    Ded_Amt: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Basic_Arr: {
      type: DataTypes.REAL,
      allowNull: true
    },
    HRA_ARR: {
      type: DataTypes.REAL,
      allowNull: true
    },
    Conv_Arr: {
      type: DataTypes.REAL,
      allowNull: true
    },
    Medical_Arr: {
      type: DataTypes.REAL,
      allowNull: true
    },
    Washing_Arr: {
      type: DataTypes.REAL,
      allowNull: true
    },
    Yr: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Ded_Rem: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    INCENTIVE_AMT: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Entry_Mode: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Loc_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Created_by: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Export_type: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Export_Date: {
      type: DataTypes.DATE,
      allowNull: true, // Nullable
    },
    IMPORT_LOCATION: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Created_At: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('getdate')
    },
  }, {
    sequelize,
    tableName: 'Emp_Ded',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Emp_Ded__C5B6F0D2FCF4550A",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};

const Joi = require('joi');

const empDedSchema = Joi.object({
  Ded_Type: Joi.number().integer().positive().required(),
  Emp_Id: Joi.string().max(15).required(),
  Emp_Name: Joi.string().max(50).allow(null),
  Mnth: Joi.number().integer().allow(null),
  Rec_Date: Joi.date().raw().allow(null),
  Ded_Amt: Joi.number().precision(4).allow(null),
  Basic_Arr: Joi.number().allow(null),
  HRA_ARR: Joi.number().allow(null),
  Conv_Arr: Joi.number().allow(null),
  Medical_Arr: Joi.number().allow(null),
  Washing_Arr: Joi.number().allow(null),
  Yr: Joi.number().integer().allow(null),
  Ded_Rem: Joi.string().max(200).allow(null),
  INCENTIVE_AMT: Joi.number().precision(4).allow(null),
  Entry_Mode: Joi.number().integer().allow(null),
  Loc_Code: Joi.number().integer().allow(null),
  Created_by: Joi.string().max(100).allow(null),
  Export_type: Joi.string().max(10).allow(null),
  Export_Date: Joi.date().optional(),
  IMPORT_LOCATION: Joi.number().integer().allow(null),
});

module.exports = { _EmpDed, empDedSchema };
