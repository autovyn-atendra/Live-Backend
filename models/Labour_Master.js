const { DataTypes } = require('sequelize');

const _LabourMaster = (sequelize) => {
  return sequelize.define('LabourMaster', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    LabourName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    LabourCode: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Machother: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Loc_Code: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    IncentivePercentage: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Created_By: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Labour_Master',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_Labour_Master",
        unique: true,
        fields: [{ name: "UTD" }]
      }
    ]
  });
};
const Joi = require('joi');
const labourMasterSchema = Joi.object({
  LabourName: Joi.string().max(255).allow(null, ''),
  LabourCode: Joi.string().max(50).allow(null, ''),
  Machother: Joi.string().max(100).allow(null, ''),
  Loc_Code: Joi.string().max(10).allow(null, ''),
  Created_By: Joi.string().max(200).allow(null, ''),
  IncentivePercentage: Joi.number().precision(2).allow(null),
});

module.exports = {_LabourMaster,labourMasterSchema };
