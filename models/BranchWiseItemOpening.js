const Sequelize = require('sequelize');
const _BranchWiseItemOpening = function (sequelize, DataTypes) {
  return sequelize.define('BranchWiseItemOpening', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Item_Code: {
      type: DataTypes.STRING(75),
      allowNull: true
    },
    Loc_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Opening_Qty: {
      type: DataTypes.DECIMAL(18, 4),  // instead of INTEGER
      allowNull: true
    },
    Opening_Val: {
      type: Sequelize.DECIMAL(18, 4),
      allowNull: true
    },
    Created_by: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'BranchWiseItemOpening',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__BranchWi__C5B6F0D2A4734102",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
}


const Joi = require('joi');

const branchWiseItemOpeningSchema = Joi.array().items(
  Joi.object({
    UTD: Joi.number().integer().positive().optional(),
    Id: Joi.number().integer().allow(null),
    Item_Code: Joi.string().max(75).allow(null).allow(''),
    Loc_Code: Joi.number().integer().allow(null),
    Opening_Qty: Joi.number().precision(4).allow(null), // was integer
    Opening_Val: Joi.number().precision(4).allow(null),
    Created_by: Joi.string().max(100).allow(null)
  })
);

module.exports = { branchWiseItemOpeningSchema, _BranchWiseItemOpening };
