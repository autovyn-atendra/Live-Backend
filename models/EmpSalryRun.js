const Sequelize = require('sequelize');
const _Emp_SlryRun = function (sequelize, DataTypes) {
  return sequelize.define('EmpSalryRun', {
    UTD: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    Emp_Code: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    Rerun: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Type: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    Created_by: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    SNo: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    Loc_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

  }, {
    sequelize,
    tableName: 'Emp_SlryRun',
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

const EmpSlryRunSchema = Joi.object({
  Emp_Code: Joi.string().max(20).required(),
  Rerun: Joi.number().integer().required(),
  Type: Joi.string().max(10).optional(),
  Created_by: Joi.string().max(30).required(),
  SNo: Joi.string().max(10).optional(),
  Loc_Code: Joi.number().integer().allow(null, '')
});

module.exports = { _Emp_SlryRun, EmpSlryRunSchema };

