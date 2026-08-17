const { DataTypes } = require('sequelize');

const _WorkshopIncentiveTeamOther = (sequelize) => {
  return sequelize.define('WorkshopIncentiveTeamOtherStaff', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Base1: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Base2: {
      type:DataTypes.FLOAT,
      allowNull: true
    },
    EMPCODE: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    LEDGERCODE: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Designation: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    DMSName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ERPName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ACTIVE: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    IncentivePercentage: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    IncentiveCalculatedOn: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Location: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    DateFrom: {
      type: DataTypes.DATEONLY, // DATE type in SQL
      allowNull: true
    },
    DateUpto: {
      type: DataTypes.DATEONLY, // DATE type in SQL
      allowNull: true
    },
    Created_By: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Workshop_Incentive_Team_Other_Staff',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_Workshop_Incentive_Team_Other_Staff",
        unique: true,
        fields: [{ name: "UTD" }]
      }
    ]
  });
};

const Joi = require('joi');

const workshopIncentiveTeamOtherSchema = Joi.object({
  Base1: Joi.alternatives().try(Joi.string().max(50), Joi.number()).optional().allow(null),
  Base2: Joi.alternatives().try(Joi.string().max(50), Joi.number()).optional().allow(null),
  EMPCODE: Joi.alternatives().try(Joi.string().max(50), Joi.number()).optional().allow(null),
  LEDGERCODE: Joi.alternatives().try(Joi.string().max(50), Joi.number()).optional().allow(null),
  Designation: Joi.string().max(50).allow(null, ''),
  DMSName: Joi.string().max(255).allow(null, ''),
  ERPName: Joi.string().max(255).allow(null, ''),
  ACTIVE: Joi.string().max(10).allow(null, ''),
  IncentivePercentage: Joi.number().precision(2).allow(null),
  IncentiveCalculatedOn: Joi.string().max(100).allow(null, ''),
  Location: Joi.string().max(20).allow(null, ''),
  DateFrom: Joi.date().allow(null), // Ensuring it's a valid date
  DateUpto: Joi.date().allow(null), // Ensuring it's a valid date
  Created_By: Joi.string().max(255).allow(null, '')
});

module.exports = {_WorkshopIncentiveTeamOther, workshopIncentiveTeamOtherSchema };

