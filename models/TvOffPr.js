const Sequelize = require('sequelize');
const _TvOffPr = function(sequelize, DataTypes) {
  return sequelize.define('TvOffPr', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    TV_ICM_ID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CUST_NAME: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    CUST_MOB: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    PRICE: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Created_by: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'TV_OFF_PR',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__TV_OFF_P__C5B6F0D237C230F0",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};

const Joi = require('joi');

const TvOffPrSchema = Joi.object({ 
  TV_ICM_ID: Joi.number().integer().optional(),
  CUST_NAME: Joi.string().max(500).optional(), 
  CUST_MOB: Joi.string().max(15).optional(), 
  PRICE: Joi.number().precision(4).optional(), 
  Created_by: Joi.string().max(100).optional() 
});

module.exports = {_TvOffPr, TvOffPrSchema};
