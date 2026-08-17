const Sequelize = require("sequelize");
const { DataTypes } = require("sequelize");
const Joi = require("joi");

const Insu_Renewal = function (sequelize, DataTypes) {
  return sequelize.define(
    "InsuRenewal",
    {
      UTD: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },

      CUST_NAME: {
        type: DataTypes.STRING(100), // NVARCHAR(100)
        allowNull: false,
      },

      CUST_MOB_NO: {
        type: DataTypes.BIGINT, // BIGINT
        allowNull: true,
      },

      POLICY_NAME: {
        type: DataTypes.STRING(100), // NVARCHAR(100)
        allowNull: false,
      },

      POLICY_NUMBER: {
        type: DataTypes.BIGINT, // BIGINT
        allowNull: false,
      },

      VEHICAL_REG_NO: {
        type: DataTypes.STRING(20), // VARCHAR(20)
        allowNull: true,
      },

      MODEL_NAME: {
        type: DataTypes.STRING(100), // NVARCHAR(100)
        allowNull: true,
      },

      POLICY_START_DATE: {
        type: DataTypes.DATEONLY, // DATE
        allowNull: false,
      },

      POLICY_END_DATE: {
        type: DataTypes.DATEONLY, // DATE
        allowNull: false,
      },

        // ✅ Newly added columns in DB
      INSU_TYPE: { type: DataTypes.STRING(100), allowNull: true },
      PREMIUM_AMOUNT: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
      PAYMENT_MODE: { type: DataTypes.STRING(20), allowNull: true },
      PAYMENT_DATE: { type: DataTypes.DATEONLY, allowNull: true },
      PAYMENT_AMOUNT: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
      UTR: { type: DataTypes.STRING(50), allowNull: true },
      CHEQUE_NO: { type: DataTypes.STRING(50), allowNull: true },
      BANK_NAME: { type: DataTypes.STRING(100), allowNull: true },
      REMARKS: { type: DataTypes.STRING(250), allowNull: true },
      DOC_PATH: { type: DataTypes.STRING(260), allowNull: true },

      TRAN_ID: { type: DataTypes.INTEGER, allowNull: true },


      CREATED_AT: {
        type: DataTypes.DATE, // DATETIME
        allowNull: false,
      },

      // Temporal columns (GENERATED ALWAYS) -> import me inko insert/update mat bhejna
      VALIDFROM: {
        type: DataTypes.DATE, // DATETIME2
        allowNull: false,
      },
      VALIDTO: {
        type: DataTypes.DATE, // DATETIME2
        allowNull: false,
      },
      EXPORT_TYPE: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    },
    {
      sequelize,
      tableName: "INSU_RENEWAL",
      schema: "dbo",
      timestamps: false,
      indexes: [
        {
          name: "PK_INSU_RENEWAL",
          unique: true,
          fields: [{ name: "UTD" }],
        },
      ],
    }
  );
};

// Joi schema (Excel import validation)
// Note: CREATED_AT / VALIDFROM / VALIDTO ko import me ignore/strip kar dena better hai
const insuRenewalSchema = Joi.object({
  UTD: Joi.number().integer().positive(),

  CUST_NAME: Joi.string().max(100).required(),

  CUST_MOB_NO: Joi.alternatives()
    .try(
      Joi.string().pattern(/^\d+$/).max(19),
      Joi.number().integer()
    )
    .allow(null, ""),

  POLICY_NAME: Joi.string().max(100).required(),

  POLICY_NUMBER: Joi.alternatives()
    .try(
      Joi.string().pattern(/^\d+$/).max(19),
      Joi.number().integer()
    )
    .required(),

  VEHICAL_REG_NO: Joi.string().max(20).allow(null, ""),
  MODEL_NAME: Joi.string().max(100).allow(null, ""),
  TRAN_ID: { type: DataTypes.INTEGER, allowNull: true },

  POLICY_START_DATE: Joi.date().raw().required(),
  POLICY_END_DATE: Joi.date().raw().required(),

  // Excel me column hai, but DB me default GETDATE() hai -> optional
  CREATED_AT: Joi.date().raw().allow(null, "").optional(),

  // Temporal columns -> import me nahi bhejna (strip removes from validated object)
  VALIDFROM: Joi.any().optional().allow(null, "").strip(),
  VALIDTO: Joi.any().optional().allow(null, "").strip(),
}).custom((obj, helpers) => {
  const s = new Date(obj.POLICY_START_DATE);
  const e = new Date(obj.POLICY_END_DATE);
  if (!isNaN(s) && !isNaN(e) && s > e) {
    return helpers.message("POLICY_START_DATE cannot be greater than POLICY_END_DATE");
  }
  return obj;
});

module.exports = { Insu_Renewal, insuRenewalSchema };