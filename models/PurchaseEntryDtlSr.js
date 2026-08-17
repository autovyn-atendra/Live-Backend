const Sequelize = require('sequelize');
const _PurchaseEntryDtlSr = function (sequelize, DataTypes) {
  return sequelize.define('PurchaseEntryDtlSr', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    TRAN_ID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Serial_No: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    isCreated: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Po: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'PurchaseEntryDtlSR',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Purchase__C5B6F0D2E2B1B0B8",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};
const Joi = require('joi');

const purchaseEntryDtlSRSchema = Joi.object({
  TRAN_ID: Joi.number().integer().optional(),
  Serial_No: Joi.string().max(50).optional(),
  isCreated: Joi.string().max(10).optional(),
  Po: Joi.string().max(50).optional(),
});

module.exports = { _PurchaseEntryDtlSr, purchaseEntryDtlSRSchema };

