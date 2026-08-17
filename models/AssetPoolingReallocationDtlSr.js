const Sequelize = require('sequelize');
const _AssetPoolingReallocationDtlSr = function (sequelize, DataTypes) {
  return sequelize.define('AssetPoolingReallocationDtlSr', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Asset_Pooling_Id: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    Asset_PoolingDtl_Id: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    Asset_Product: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    Asset_Issue_Qty: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    Asset_Revoke_Qty: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Created_By: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Asset_Pooling_Reallocation_DtlSR',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Asset_Po__C5B6F0D253CC4A3E",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};
const Joi = require('joi');

const assetPoolingReallocationDtlSrSchema = Joi.object({
  UTD: Joi.number()
    .integer()
    .positive()
    .optional(),

  Asset_Pooling_Id: Joi.string()
    .max(10)
    .required()
    .label('Asset Pooling ID'),

  Asset_PoolingDtl_Id: Joi.string()
    .max(10)
    .required()
    .label('Asset Pooling Detail ID'),

  Asset_Product: Joi.string()
    .max(20)
    .required()
    .label('Asset Product'),

  Asset_Issue_Qty: Joi.string()
    .max(20)
    .required()
    .label('Asset Issue Quantity'),

  Asset_Revoke_Qty: Joi.string()
    .max(20)
    .optional()
    .allow(null)
    .label('Asset Revoke Quantity'),

  Created_By: Joi.string()
    .max(255)
    .optional()
    .allow(null)
    .label('Created By'),




});

module.exports = { _AssetPoolingReallocationDtlSr, assetPoolingReallocationDtlSrSchema };
