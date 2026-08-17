const Sequelize = require('sequelize');
const _Insu_Payout_Policy = function (sequelize, DataTypes) {
  return sequelize.define('Insu_Payout_Policy', {
    UTD: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    EmpCode: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    Insu_Co_Name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    FirstYear_PayoutPer: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    Renewal_PayoutPer: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    DATE_FROM: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    DATE_TO: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    Created_By: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  }, {
    sequelize,
    tableName: 'Insu_Payout_Policy',
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

const InsuPayoutPolicySchema = Joi.object({
  UTD: Joi.number().integer().optional(),
  EmpCode: Joi.string().max(100).allow(null),
  Insu_Co_Name: Joi.string().max(100).allow(null),
  FirstYear_PayoutPer: Joi.string().max(50).allow(null),
  Renewal_PayoutPer: Joi.string().max(50).allow(null),
  DATE_FROM: Joi.date().raw().allow(null),
  DATE_TO: Joi.date().raw().allow(null),
  Created_By: Joi.string().max(255).allow(null),
});

//Joi.alternatives().try(Joi.string().max(10), Joi.number()).optional(),

module.exports = { _Insu_Payout_Policy, InsuPayoutPolicySchema };

