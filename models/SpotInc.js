const Sequelize = require('sequelize');
const _SpotInc = function (sequelize, DataTypes) {
  return sequelize.define('SpotInc', {
    TRAN_ID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Tran_Type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DSE1: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Spot_Desig1: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Spot_Scheme1: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Spot_Inc1: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    IncDrCr1: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DSE2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Spot_Desig2: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Spot_Scheme2: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Spot_Inc2: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    IncDrCr2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DSE3: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Spot_Desig3: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Spot_Scheme3: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Spot_Inc3: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    IncDrCr3: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DSE4: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Spot_Desig4: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Spot_Scheme4: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Spot_Inc4: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    IncDrCr4: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DSE5: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Spot_Desig5: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Spot_Scheme5: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Spot_Inc5: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    IncDrCr5: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    EXPORT_TYPE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DMS_INV: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    GUID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Created_by: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'SPOT_INC',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__SPOT_INC__15B69B8E432E889C",
        unique: true,
        fields: [
          { name: "GUID" },
        ]
      },
    ]
  });
};

const Joi = require('joi');

const spotIncSchema = Joi.object({
  TRAN_ID: Joi.number().integer().allow(null),
  Tran_Type: Joi.number().integer().allow(null),
  DSE1: Joi.number().integer().allow(null),
  Spot_Desig1: Joi.string().max(30).allow(null),
  Spot_Scheme1: Joi.string().max(30).allow(null),
  Spot_Inc1: Joi.number().precision(4).allow(null),
  IncDrCr1: Joi.number().integer().allow(null),
  DSE2: Joi.number().integer().allow(null),
  Spot_Desig2: Joi.string().max(30).allow(null),
  Spot_Scheme2: Joi.string().max(30).allow(null),
  Spot_Inc2: Joi.number().precision(4).allow(null),
  IncDrCr2: Joi.number().integer().allow(null),
  DSE3: Joi.number().integer().allow(null),
  Spot_Desig3: Joi.string().max(30).allow(null),
  Spot_Scheme3: Joi.string().max(30).allow(null),
  Spot_Inc3: Joi.number().precision(4).allow(null),
  IncDrCr3: Joi.number().integer().allow(null),
  DSE4: Joi.number().integer().allow(null),
  Spot_Desig4: Joi.string().max(30).allow(null),
  Spot_Scheme4: Joi.string().max(30).allow(null),
  Spot_Inc4: Joi.number().precision(4).allow(null),
  IncDrCr4: Joi.number().integer().allow(null),
  DSE5: Joi.number().integer().allow(null),
  Spot_Desig5: Joi.string().max(30).allow(null),
  Spot_Scheme5: Joi.string().max(30).allow(null),
  Spot_Inc5: Joi.number().precision(4).allow(null),
  IncDrCr5: Joi.number().integer().allow(null),
  EXPORT_TYPE: Joi.number().integer().allow(null),
  DMS_INV: Joi.string().max(30).allow(null),
  Created_by: Joi.string().max(200).allow(null)
});

module.exports = { _SpotInc , spotIncSchema };
