const Sequelize = require('sequelize');
const _AssetPoolingReallocation = function (sequelize, DataTypes) {
  return sequelize.define('AssetPoolingReallocation', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Transfer_Date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    reallocation_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Category: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    SubCategory: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Asset_Product: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Remark: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    Location: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Revoke_Date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Created_By: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'asset_pooling_reallocation',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__asset_po__C5B6F0D2454C645B",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};
const Joi = require('joi');

const assetPoolingReallocationSchema = Joi.object({
  UTD: Joi.number()
    .integer()
    .positive()
    .optional(),

  Transfer_Date: Joi.date()
    .required()
    .label('Transfer Date'),
  reallocation_date: Joi.date()
    .optional().allow(null, '')
    .label('reallocation_date'),

  Category: Joi.string()
    .max(50)
    .required()
    .label('Category'),

  SubCategory: Joi.string()
    .max(50)
    .required()
    .label('SubCategory'),

  Asset_Product: Joi.string()
    .max(50)
    .required()
    .label('Asset Product'),

  Remark: Joi.string()
    .max(200)
    .optional()
    .allow(null)
    .label('Remark'),

  Location: Joi.alternatives()
    .try(Joi.string().max(50), Joi.number())
    .optional()
    .label('Location'),

  Revoke_Date: Joi.date()
    .optional()
    .allow(null)
    .label('Revoke Date'),

  Created_By: Joi.string()
    .max(255)
    .optional()
    .allow(null)
    .label('Created By'),
});

module.exports = { _AssetPoolingReallocation, assetPoolingReallocationSchema };
