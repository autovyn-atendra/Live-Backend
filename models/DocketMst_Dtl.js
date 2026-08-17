const Sequelize = require("sequelize");
const _DocketMst_Details = function (sequelize, DataTypes) {
  return sequelize.define(
    "DocketMstDetails",
    {
      UTD: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      DocketMst_Id: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      MGA_Name: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      Quantity: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      Rate: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      Created_By: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      MGA_12: {
        type: DataTypes.STRING(3),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "DocketMst_Details",
      schema: "dbo",
      timestamps: false,
      indexes: [
        {
          name: "PK__Purchase__C5B6F0D2F02C5058",
          unique: true,
          fields: [{ name: "UTD" }],
        },
      ],
    }
  );
};

const Joi = require("joi");

const DocketMstDetailsSchema = Joi.object({
  UTD: Joi.number().integer().positive().optional(), // UTD is auto-incremented, so it should not be required for validation
  DocketMst_Id: Joi.alternatives()
    .try(Joi.string().max(20), Joi.number().integer().max(99999999999999999999))
    .optional(),
  MGA_Name: Joi.alternatives().try(
    Joi.string().max(500).required(),
    Joi.number().optional().allow(null)
  ), // Item is not nullable, so it's required
  Quantity: Joi.alternatives()
    .try(Joi.string().max(20), Joi.number().integer().max(99999999999999999999))
    .required(), // Quantity is not nullable, so it's required
  Rate: Joi.alternatives()
    .try(Joi.string().max(20), Joi.number().integer().max(99999999999999999999))
    .required(), // Unit_Price is allowed to be null, so it's optional
  Created_By: Joi.string().max(255).optional(), // Created_By is allowed to be null, so it's optional
  MGA_12: Joi.string().max(3).optional().allow(null).allow(""),

});


module.exports = {
  _DocketMst_Details,
  DocketMstDetailsSchema,
};
