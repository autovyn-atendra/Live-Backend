const Sequelize = require("sequelize");

const _ICM_Post = function (sequelize, DataTypes) {
  return sequelize.define(
    "ICM_Post",
    {
      Tran_Id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // ✅ set as primary key
        allowNull: false,
      },
      Seq_No: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
      Amount: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },
      Export_Type: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Loc_Code: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Acnt_Id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      ENTRY_BATCH: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Text_1: {
        type: DataTypes.STRING(60),
        allowNull: true,
      },
      Text_2: {
        type: DataTypes.STRING(60),
        allowNull: true,
      },
      Number_1: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Number_2: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Post_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "ICM_Post",
      schema: "dbo",
      timestamps: false,
      indexes: [
        {
          name: "PK__ICM_Post",
          unique: true,
          fields: [{ name: "Tran_Id" }], // ✅ use primary key here
        },
      ],
    }
  );
};


const Joi = require("joi");

const ICMPostSchema = Joi.object({
  Tran_Id: Joi.number().integer().optional(),
  Seq_No: Joi.number().integer().optional().allow(null),
  Payable_Ac: Joi.number().integer().optional().allow(null),
  Voucher_Code: Joi.number().integer().optional().allow(null),
  Voucher_Type: Joi.number().integer().optional().allow(null, ""),
  Amount: Joi.number().precision(4).optional().allow(null, ""),
  Export_Type: Joi.number().integer().optional().allow(null),
  Loc_Code: Joi.number().integer().optional().allow(null),
  Acnt_Id: Joi.number().integer().optional().allow(null),
  ENTRY_BATCH: Joi.string().max(100).optional().allow(null, ""),
  Text_1: Joi.string().max(60).optional().allow(null, ""),
  Text_2: Joi.string().max(60).optional().allow(null, ""),
  Number_1: Joi.number().integer().optional().allow(null),
  Number_2: Joi.number().integer().optional().allow(null),
  Post_Date: Joi.date().optional().allow(null),
});

module.exports = { _ICM_Post, ICMPostSchema };
