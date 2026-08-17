const Sequelize = require('sequelize');
const _purchase_Req_Product_Details_Dtl = function (sequelize, DataTypes) {
  return sequelize.define('PurchaseReqProductDetailsDtl', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Purchase_Req: {
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
    Purchase_Req_Product: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Created_By: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'Purchase_Req_Product_Details_dtl',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Purchase__C5B6F0D2F2A34551",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};

const Joi = require('joi');

const purchaseReqProductDetailsDtlSchema = Joi.object({
  UTD: Joi.number()
    .integer()
    .positive()
    .allow(null),  // Auto-increment field may not always be provided in client-side data
  Purchase_Req: Joi.string()
    .max(10)
    .required(),
  Asset_Product: Joi.string()
    .max(20)
    .required(),
  Asset_Issue_Qty: Joi.string()
    .max(20)
    .required(),
  Purchase_Req_Product: Joi.string()
    .max(20)
    .allow(null),  // This field is nullable
  Created_By: Joi.string()
    .max(255)
    .allow(null),  // Nullable field
});

module.exports = { _purchase_Req_Product_Details_Dtl, purchaseReqProductDetailsDtlSchema };

