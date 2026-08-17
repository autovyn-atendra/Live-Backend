const Sequelize = require("sequelize");
const _ReminderAsset = function (sequelize, DataTypes) {
    return sequelize.define('ReminderAsset', {
  reminder_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  reminder_name: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  time: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  frequency: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  validity: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  Category: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  SubCategory: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  Asset: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  Created_By: {
    type: DataTypes.STRING(255),
    allowNull: true
  },

}, {
  tableName: 'reminder_asset',
  timestamps: false,
});
}

const Joi = require("joi");

const reminderAssetSchema = Joi.object({
    reminder_name: Joi.string().max(50).allow(null),
    date: Joi.date().allow(null),
    time: Joi.string().max(255).allow(null),
    frequency: Joi.string().max(255).allow(null),
    validity: Joi.date().allow(null),
    description: Joi.string().max(255).allow(null),
    Category: Joi.number().integer().positive().allow(null),
    SubCategory: Joi.number().integer().positive().allow(null),
    Asset: Joi.number().integer().positive().allow(null),
    user_id: Joi.number().integer().allow(null),
    type: Joi.string().max(255).allow(null),
    Created_By: Joi.string().max(255).allow(null)
  });
  
  module.exports = { _ReminderAsset, reminderAssetSchema };