const Sequelize = require('sequelize');
const _OfferDtl = function (sequelize, DataTypes) {
  return sequelize.define('OfferDtl', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Mst_ID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    TC_DESC: {
      type: DataTypes.STRING(1000),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'OfferDtl',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__OfferDtl__C5B6F0D27F26C08E",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};

const Joi = require('joi');

const OfferDtlSchema = Joi.object({
  UTD: Joi.number().integer().required(),
  Mst_ID: Joi.number().optional(),
  TC_DESC: Joi.string().max(1000).optional()
});

module.exports = { _OfferDtl, OfferDtlSchema };
