const Sequelize = require('sequelize');
const _FinancerMaster = function (sequelize, DataTypes) {
  return sequelize.define('FinancerMaster', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Financer: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    godw_code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    validfrom: {
      type: DataTypes.DATE,
      allowNull: true
    },
    validTo: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    CREATED_BY: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    Gst: {
      type: DataTypes.BOOLEAN,
      allowNull: true  // or true if null values are allowed
    },
  }, {
    sequelize,
    tableName: 'Financer_Master',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Financer__C5B6F0D206511545",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};
const Joi = require('joi');
// Define the Joi schema
const financerSchema = Joi.object({
  UTD: Joi.number().integer().positive(),
  Financer: Joi.alternatives().try(
    Joi.string().max(20).allow(null).optional(), // String, max length 20, nullable, optional
    Joi.number().allow(null).optional()           // Number, nullable, optional
  ),
  godw_code: Joi.alternatives().try(
    Joi.string().max(50).allow(null).optional(), // String, max length 50, nullable, optional
    Joi.number().allow(null).optional()           // Number, nullable, optional
  ),
  amount: Joi.alternatives().try(
    Joi.number().precision(2).allow(null).optional(), // Decimal (10,2), nullable, optional
    Joi.string().allow(null).optional()                // String, nullable, optional
  ),
  validfrom: Joi.date().iso().allow(null).optional(),      // Date in ISO format, nullable, optional
  validTo: Joi.date().iso().allow(null).optional(),        // Date (YYYY-MM-DD), nullable, optional
  CREATED_BY: Joi.string().max(200).required(), // String, max length 200, nullable, optional
  Gst: Joi.boolean().optional().allow(null, ''),
});

module.exports = { _FinancerMaster, financerSchema }
