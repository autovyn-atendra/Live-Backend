const Sequelize = require('sequelize');
const _RTO_IMPORT = function (sequelize, DataTypes) {
  return sequelize.define('RtoImport', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Inv_No: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    MI_Date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Month: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Reg_No: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    VAH_REGNO: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    VAH_CLASS: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    VAH_MODEL: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    VAH_VEHICLECOLOUR: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    VAH_TYPE: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    VAH_OWNER: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    VAH_PRES_ADD: {
      type: DataTypes.STRING(400),
      allowNull: true
    },
    VAH_PRES_ADD_DISTRICT: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    VAH_PRES_ADD_STATE: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    VAH_PRES_ADD_CITY: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    VAH_PRES_ADD_PIN: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    VAH_REGAUTHORITY: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    VAH_REGDATE: {
      type: DataTypes.DATE,
      allowNull: true
    },
    VAH_VEHICLEINSCOMPNAME: {
      type: DataTypes.STRING(400),
      allowNull: true
    },
    VAH_RCFINANCER: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    VAH_ISCOMMERCIAL: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    Created_By: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Vin: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'RTO_IMPORT',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__RTO_IMPO__C5B6F0D278B36A4D",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};
const Joi = require('joi');

const RtoImportSchema = Joi.object({
  UTD: Joi.number().integer().positive().required(),
  Inv_No: Joi.string().max(50).allow(null, ''),
  MI_Date: Joi.date().allow(null),
  Month: Joi.number().allow(null),
  Reg_No: Joi.string().max(50).allow(null, ''),
  VAH_REGNO: Joi.string().max(50).allow(null, ''),
  VAH_CLASS: Joi.string().max(50).allow(null, ''),
  VAH_MODEL: Joi.string().max(50).allow(null, ''),
  VAH_VEHICLECOLOUR: Joi.string().max(50).allow(null, ''),
  VAH_TYPE: Joi.string().max(50).allow(null, ''),
  VAH_OWNER: Joi.string().max(50).allow(null, ''),
  VAH_PRES_ADD: Joi.string().max(400).allow(null, ''),
  VAH_PRES_ADD_DISTRICT: Joi.string().max(100).allow(null, ''),
  VAH_PRES_ADD_STATE: Joi.string().max(100).allow(null, ''),
  VAH_PRES_ADD_CITY: Joi.string().max(100).allow(null, ''),
  VAH_PRES_ADD_PIN: Joi.string().max(100).allow(null, ''),
  VAH_REGAUTHORITY: Joi.string().max(100).allow(null, ''),
  VAH_REGDATE: Joi.date().allow(null),
  VAH_VEHICLEINSCOMPNAME: Joi.string().max(400).allow(null, ''),
  VAH_RCFINANCER: Joi.string().max(200).allow(null, ''),
  VAH_ISCOMMERCIAL: Joi.string().max(200).allow(null, ''),
  Created_By: Joi.string().max(255).allow(null, ''),
  Vin: Joi.string().max(50).allow(null, ''),
});

module.exports = { _RTO_IMPORT, RtoImportSchema };

