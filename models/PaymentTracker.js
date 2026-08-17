const Sequelize = require('sequelize');
const _Payment_Tracker = function (sequelize, DataTypes) {
  return sequelize.define('PaymentTracker', {
    tran_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Req_Date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Customer_Name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Mobile_No: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Model_Variant: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Bill_No: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Mode_OF_Payement: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Document: {
      type: DataTypes.STRING(400),
      allowNull: true
    },
    Dise_Amt: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Location: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    srm: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Created_By: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Payment_Tracker',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Payment___C5B6F0D2329550FC",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};
const Joi = require('joi');
const paymentTrackerSchema = Joi.object({
  tran_id: Joi.number().integer().positive().optional(), // autoIncrement primary key
  Req_Date: Joi.date().optional().allow(null), // Optional DATE field
  Customer_Name: Joi.string().max(100).optional().allow(null), // Max length 100
  Mobile_No: Joi.string()
    .pattern(/^[0-9]{10,20}$/) // Pattern for 10-20 digit mobile numbers
    .optional()
    .allow(null),
  Model_Variant: Joi.string().max(20).optional().allow(null), // Max length 20
  Bill_No: Joi.string().max(20).optional().allow(null, ''), // Max length 20
  Document: Joi.string().max(400).optional().allow(null, ''), // Max length 20
  Mode_OF_Payement: Joi.string().max(20).optional().allow(null), // Max length 20
  Dise_Amt: Joi.number().precision(4).optional().allow(null), // Decimal with precision (19, 4)
  Location: Joi.alternatives().try(Joi.string().max(10), Joi.number()).optional().allow(null), // Max length 10
  srm: Joi.string().max(20).optional().allow(null), // Max length 20
  Created_By: Joi.string().max(255).optional().allow(null), // Max length 255
});
module.exports = { _Payment_Tracker, paymentTrackerSchema };
