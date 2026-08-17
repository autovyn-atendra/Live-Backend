const Sequelize = require('sequelize');

const _InsuranceOfferMaster = function (sequelize, DataTypes) {

  return sequelize.define('Insu_Ofr_Mst', {

    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },

    Month: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    DateFrom: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },

    DateUpto: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },

    OfferName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },

    OfferValue: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true
    },
    couponValidityType: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true
    },
    ValidityInDays: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    LOC_CODE: {
      type: DataTypes.STRING(50),
      allowNull: true
    },

    Export_type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    Created_by: {
      type: DataTypes.STRING(100),
      allowNull: true
    },

    Created_At: {
      type: DataTypes.DATE,
      allowNull: true
    },

    Updated_At: {
      type: DataTypes.DATE,
      allowNull: true
    }

  }, {

    sequelize,
    tableName: 'Insu_Ofr_Mst',
    schema: 'dbo',
    timestamps: false

  });
};

const Joi = require("joi");

const InsuranceOfferMasterSchema = Joi.object({

  UTD: Joi.number().optional(),
  Month: Joi.number().required(),
  DateFrom: Joi.date().required(),
  DateUpto: Joi.date().required(),
  OfferName: Joi.string().max(255).required(),
  OfferValue: Joi.number().required(),
  couponValidityType: Joi.number().required(),
  ValidityInDays: Joi.string().max(20).allow("", null),
  LOC_CODE: Joi.alternatives()
    .try(
      Joi.string(),
      Joi.number()
    )
    .allow("", null),

  Export_type: Joi.number().allow(null),

  Created_by: Joi.string().allow("", null),

});

module.exports = {
  InsuranceOfferMasterSchema,
  _InsuranceOfferMaster
};