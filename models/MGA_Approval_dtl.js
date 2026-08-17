const Sequelize = require('sequelize');
const _MGA_Approval_dtl = function (sequelize, DataTypes) {
  return sequelize.define('MGAApprovalDtl', {
    UTD: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      MGA_Approval_UTD: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      MGA_Description: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      Quantity: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      Amount: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      Created_By: {
        type: DataTypes.STRING(255),
        allowNull: true,
      }
  }, {
    sequelize,
    tableName: 'MGA_Approval_dtl',
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

const MGAApprovalDtlSchema = Joi.object({
    UTD: Joi.number().integer().optional(),
    MGA_Approval_UTD: Joi.string().max(10).optional(),
    MGA_Description: Joi.string().max(200).optional(),
    Quantity: Joi.string().max(10).optional(),
    Amount: Joi.string().max(10).optional(),
    Created_By: Joi.string().max(255).optional(),
});

module.exports = { _MGA_Approval_dtl, MGAApprovalDtlSchema };

