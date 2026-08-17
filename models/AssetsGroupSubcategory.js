const Sequelize = require('sequelize');
const _AssetGroupSubcategory = function (sequelize, DataTypes) {
  return sequelize.define('AssetsGroupSubcategory', {
    Id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    icon: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Group_Id: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Series: {
      type: DataTypes.BOOLEAN,
      allowNull: true  // or true if null values are allowed
    },
    AMC: {
      type: DataTypes.BOOLEAN,
      allowNull: true  // or true if null values are allowed
    },
    common: {
      type: DataTypes.BOOLEAN,
      allowNull: true  // or true if null values are allowed
    },
    Depreciation_Method: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Created_by: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    HSN: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    UOM: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    itemType: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'Assets_Group_Subcategory',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Assets_G__3214EC0727A6667A",
        unique: true,
        fields: [
          { name: "Id" },
        ]
      },
    ]
  });
};
const Joi = require("joi");
const { _AssetGroup } = require('./AssetsGroup');


const assetsGroupSubcategorySchema = Joi.object({
  Id: Joi.number().integer().positive().optional(),
  name: Joi.string().max(255).required(),
  icon: Joi.string().max(255).optional(),
  Group_Id: Joi.number().integer().positive().required(),
  Created_by: Joi.string().max(100).optional().allow(null),
  Series: Joi.boolean().optional().allow(null, ''),
  AMC: Joi.boolean().optional().allow(null, ''),
  common: Joi.boolean().optional().allow(null, ''),
  Depreciation_Method: Joi.string().max(100).optional().allow(null),
  HSN: Joi.string().max(10).optional().allow(null, ''),
  UOM: Joi.string().max(10).optional().allow(null, ''),
  itemType: Joi.string().max(10).optional().allow(null, ''),
});
module.exports = { assetsGroupSubcategorySchema, _AssetGroupSubcategory };

