const Sequelize = require('sequelize');
const _NmDtl = function (sequelize, DataTypes) {
  return sequelize.define('NmDtl', {
    Tran_Id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    SrNo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Item_No: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Item_Name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Item_Rate: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Qty: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Amount: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Loc_Code: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Export_Type: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Item_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    GUID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Created_by: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'NM_DTL',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__NM_DTL__15B69B8EAC7E1F49",
        unique: true,
        fields: [
          { name: "GUID" },
        ]
      },
    ]
  });
};


const Joi = require('joi');

const nmDtlSchema = Joi.object({
  Tran_Id: Joi.number().integer().required(),
  SrNo: Joi.number().integer().allow(null),
  Item_No: Joi.string().max(100).allow(null),
  Item_Name: Joi.string().max(100).allow(null),
  Item_Rate: Joi.number().precision(4).allow(null),
  Qty: Joi.number().precision(4).allow(null),
  Amount: Joi.number().precision(4).allow(null),
  Loc_Code: Joi.number().precision(4).allow(null),
  Export_Type: Joi.number().precision(4).allow(null),
  Item_Code: Joi.number().integer().allow(null),
  Created_by: Joi.string().max(200).allow(null)
});

module.exports = { _NmDtl, nmDtlSchema };
