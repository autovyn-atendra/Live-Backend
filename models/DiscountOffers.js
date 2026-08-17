const Sequelize = require('sequelize');
const _DiscountOffers = function (sequelize, DataTypes) {
  return sequelize.define('DiscountOffers', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Model_Group: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Model_Group_Name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    Model_Code: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Model_Name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    MI_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Consumer: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Exch: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Mssf: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Corporate1: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Corporate2: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    scrappage: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Rips: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    MarutiEmp: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    MeriMaruti: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Valid_From: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Valid_Upto: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    MI_Date_Upto: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    State: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Region: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Channel: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Created_By: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Year: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Branch: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    VAHAN_DATE_FROM: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    VAHAN_DATE_UPTO: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    MI_Based: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Vahan_Based: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    EXPORT_TYPE: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Item_Code: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    sequelize,
    tableName: 'Discount_Offers',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Discount__C5B6F0D2FAE67A63",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};
const Joi = require("joi");

const discountOffersSchema = Joi.object({
  UTD: Joi.number().integer().positive().optional(),
  Model_Group: Joi.alternatives().try(Joi.string().max(20), Joi.number()).allow(null),// Allow null if the value is not required
  Model_Group_Name: Joi.string().max(200).allow(null),
  Model_Code: Joi.alternatives().try(Joi.string().max(20), Joi.number()).allow(null),
  Model_Name: Joi.string().max(200).allow(null),
  MI_Date: Joi.date().iso().allow(null), // ISO 8601 date format, allows null
  Consumer: Joi.number().precision(2).allow(null).empty(''),
  Exch: Joi.number().precision(2).allow(null).empty(''),
  Mssf: Joi.number().precision(2).allow(null).empty(''),
  Corporate1: Joi.number().precision(2).allow(null).empty(''),
  Corporate2: Joi.number().precision(2).allow(null).empty(''),
  scrappage: Joi.number().precision(2).allow(null).empty(''),
  Rips: Joi.number().precision(2).allow(null).empty(''),
  MarutiEmp: Joi.number().precision(2).allow(null).empty(''),
  MeriMaruti: Joi.number().precision(2).allow(null).empty(''),
  Valid_From: Joi.date().iso().allow(null),
  Valid_Upto: Joi.date().iso().allow(null),
  State: Joi.alternatives().try(Joi.string().max(20), Joi.number()).allow(null),
  Region: Joi.alternatives().try(Joi.string().max(20), Joi.number()).allow(null),
  Channel: Joi.alternatives().try(Joi.string().max(20), Joi.number()).allow(null),
  Created_By: Joi.string().max(255).allow(null),
  Year: Joi.alternatives().try(Joi.string().max(20), Joi.number()).allow(null),
  Branch: Joi.alternatives()
    .try(Joi.string().max(20).allow(''), Joi.number())
    .allow(null),
  MI_Date_Upto: Joi.date().iso().allow(null),
  VAHAN_DATE_FROM: Joi.date().iso().allow(null),
  VAHAN_DATE_UPTO: Joi.date().iso().allow(null),
  MI_Based: Joi.number().integer(),
  Vahan_Based: Joi.number().integer(),
  EXPORT_TYPE: Joi.number().integer(),
  Item_Code: Joi.number().integer(),

});

module.exports = { _DiscountOffers, discountOffersSchema };
