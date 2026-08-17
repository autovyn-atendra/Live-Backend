const Sequelize = require("sequelize");
const _ICM_Post_Ac = function (sequelize, DataTypes) {
  return sequelize.define(
    "ICM_Post_Ac",
    {
      Seq_No: {
        type: DataTypes.INTEGER,
        allowNull: true,
        primaryKey: true,
      },
      Payable_Ac: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Voucher_Code: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Voucher_Type: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Loc_Code: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Bank_Ref: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      GP_Prefix: {
        type: DataTypes.STRING(12),
        allowNull: true,
      },
      Print_UTPD: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "ICM_Post_Ac",
      schema: "dbo",
      timestamps: false,
      indexes: [
        {
          name: "PK__Product___C5B6F0D28FFEE240",
          unique: true,
          fields: [{ name: "Seq_No" }],
        },
      ],
    }
  );
};

const Joi = require("joi");

const ICMPostAcSchema = Joi.object({
  Seq_No: Joi.number().integer().optional().allow(null),
  Payable_Ac: Joi.number().integer().optional().allow(null),
  Voucher_Code: Joi.number().integer().optional().allow(null),
  Voucher_Type: Joi.number().integer().optional().allow(null, ""),
  Loc_Code: Joi.number().integer().optional().allow(null),
  Bank_Ref: Joi.number().integer().optional().allow(null),
  GP_Prefix: Joi.string().max(12).optional().allow(null),
  Print_UTPD: Joi.number().integer().optional().allow(null),
});

module.exports = { _ICM_Post_Ac, ICMPostAcSchema };
