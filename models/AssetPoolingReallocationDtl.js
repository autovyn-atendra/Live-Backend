const Sequelize = require("sequelize");
const _AssetPoolingReallocationDtl = function (sequelize, DataTypes) {
  return sequelize.define(
    "AssetPoolingReallocationDtl",
    {
      UTD: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      Transfer_Date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      Category: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      SubCategory: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      PoolingId: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      Issue_Quantity: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      Description: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      Revoke: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      Revoke_Date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      Reason: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      Location: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Created_By: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "Asset_Pooling_Reallocation_Dtl",
      schema: "dbo",
      timestamps: false,
      indexes: [
        {
          name: "PK__Asset_Po__C5B6F0D2EABC06CF",
          unique: true,
          fields: [{ name: "UTD" }],
        },
      ],
    }
  );
};

const Joi = require("joi");

const assetPoolingReallocationDtlSchema = Joi.object({
  UTD: Joi.number().integer().positive().optional(),

  Transfer_Date: Joi.date().optional().allow(null).label("Transfer Date"),

  Category: Joi.string().max(50).required().label("Category"),

  SubCategory: Joi.alternatives()
    .try(Joi.string().max(20), Joi.number())
    .required()
    .label("SubCategory"),
  PoolingId: Joi.alternatives()
  .try(Joi.string().max(20), Joi.number())
  .optional().label("Pooling ID"),

  Issue_Quantity: Joi.string().max(50).required().label("Issue Quantity"),

  Description: Joi.string().max(200).required().label("Description"),

  Revoke: Joi.string().max(10).optional().allow(null).label("Revoke"),

  Revoke_Date: Joi.date().optional().allow(null).label("Revoke Date"),

  Reason: Joi.string().max(200).optional().allow(null).label("Reason"),

  Location: Joi.string().max(50).optional().label("Location"),

  Created_By: Joi.string().max(255).optional().allow(null).label("Created By"),
});

module.exports = {
  _AssetPoolingReallocationDtl,
  assetPoolingReallocationDtlSchema,
};
