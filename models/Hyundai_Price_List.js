const Sequelize = require('sequelize');
const _Hyundai_Price_List = function (sequelize, DataTypes) {
  return sequelize.define('HyundaiPriceListSchema', {
    UTD: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    Model_Code: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    Add_On: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    Sub_Add_On: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    Price: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    With_Effective_From: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    Enter_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    Created_By: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    Modl_Grp: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    Modl_Variant: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    Export_Type: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Cust_Type: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'Standard',
    },
    CSD_Price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    With_Effective_To: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

  }, {
    sequelize,
    tableName: 'Hyundai_Price_List',
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

const HyundaiPriceListSchema = Joi.object({
  Model_Code: Joi.string().max(300).allow(null, ''),
  Add_On: Joi.string().max(50).allow(null, ''),
  Sub_Add_On: Joi.string().max(50).allow(null, ''),
  Price: Joi.string().max(30).allow(null, ''),
  With_Effective_From: Joi.date().allow(null),
  Enter_Date: Joi.date().allow(null),
  Created_By: Joi.string().max(255).allow(null, ''),
  Modl_Grp: Joi.string().max(500).allow(null, ''),
  Modl_Variant: Joi.string().max(500).allow(null, ''),
  Export_Type: Joi.number().allow(null, ''),
  Cust_Type: Joi.string().max(50).allow(null, ''),
  CSD_Price: Joi.number().precision(2).allow(null, ''),
  With_Effective_To: Joi.date().allow(null),
});

module.exports = { _Hyundai_Price_List, HyundaiPriceListSchema };

