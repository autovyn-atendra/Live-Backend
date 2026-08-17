const Sequelize = require('sequelize');
const Joi = require('joi');

const _OfferMaster = function(sequelize, DataTypes) {
  return sequelize.define('OfferMaster', {
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
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Offers: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    OfferValue: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Weightage: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    LOC_CODE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MIN_INV_AMT: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Created_by: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    OfferOn: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'OfferMaster',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__OfferMas__C5B6F0D2D3B8A6C7",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};

const OfferMasterSchema = Joi.object({
  Month: Joi.number().integer().allow(null, ''),
  DateFrom: Joi.date().raw().allow(null, ''),
  DateUpto: Joi.date().raw().allow(null, ''),
  OfferName: Joi.string().max(100).allow(null, ''),
  Offers: Joi.string().max(50).allow(null, ''),
  OfferValue: Joi.number().integer().allow(null, ''),
  Weightage: Joi.number().integer().allow(null, ''),
  LOC_CODE: Joi.number().integer().allow(null, ''),
  MIN_INV_AMT: Joi.number().integer().allow(null, ''),
  Created_by: Joi.string().max(100).allow(null, ''),
  OfferOn: Joi.string().max(20).allow(null, ''),
});

module.exports = {_OfferMaster, OfferMasterSchema};
