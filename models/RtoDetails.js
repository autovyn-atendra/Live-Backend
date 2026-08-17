const Sequelize = require('sequelize');
const _RtoDetails = function (sequelize, DataTypes) {
  return sequelize.define('RtoDetails', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    INVOICE_NUMBER: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    REG_NUMBER: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    VAHAN_REG_NUMBER: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    INHOUSE: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    SAME_STATE: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    PERMANENT_TAX_PAID: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    NUMBER_GENERATED: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    DOCUMENTS_UPLOADED: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    FILE_SUBMITTED: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    RTO_APPROVAL_DONE: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    UPDATED_IN_DMS: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    REMARKS: {
      type: DataTypes.STRING(400),
      allowNull: true
    },
    Created_By: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Mi_Date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Rto_Details',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Rto_Deta__C5B6F0D2C096F3D9",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};

const Joi = require('joi');

const rtoDetailsSchema = Joi.object({
  UTD: Joi.number().integer().positive().optional(),
  INVOICE_NUMBER: Joi.string().max(30).optional().allow(null, ''),
  REG_NUMBER: Joi.string().max(30).optional().allow(null, ''),
  VAHAN_REG_NUMBER: Joi.string().max(30).optional().allow(null, ''),
  INHOUSE: Joi.string().max(10).optional().allow(null, ''),

  SAME_STATE: Joi.string()
    .max(10)
    .optional()
    .allow(null, ''),

  PERMANENT_TAX_PAID: Joi.string()
    .max(10)
    .optional()
    .allow(null, ''),

  NUMBER_GENERATED: Joi.string()
    .max(10)
    .optional()
    .allow(null, ''),

  DOCUMENTS_UPLOADED: Joi.string()
    .max(10)
    .optional()
    .allow(null, ''),

  FILE_SUBMITTED: Joi.string()
    .max(10)
    .optional()
    .allow(null, ''),

  RTO_APPROVAL_DONE: Joi.string()
    .max(10)
    .optional()
    .allow(null, ''),

  UPDATED_IN_DMS: Joi.string()
    .max(10)
    .optional()
    .allow(null, ''),

  REMARKS: Joi.string()
    .max(400)
    .optional()
    .allow(null, ''),

  Created_By: Joi.string()
    .max(255)
    .optional()
    .allow(null, ''),

  Mi_Date: Joi.date()
    .optional()
    .allow(null, ''),
});

module.exports = { _RtoDetails, rtoDetailsSchema };
