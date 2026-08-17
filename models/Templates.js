const Sequelize = require('sequelize');
const _Template = function(sequelize, DataTypes) {
  return sequelize.define('Templates', {
    TEMPLATE_NO: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    TEMPLATE_NAME: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    CONTENT: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    KEYWORDS: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    SEND_DATE: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    SCHEDULED: {
      type: DataTypes.SMALLINT,
      allowNull: true
    } ,
    Created_by: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Created_At: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    SHOW_HEADER: {
  type: DataTypes.INTEGER,
  allowNull: true,
  defaultValue: 1
}
  }, {
    sequelize,
    tableName: 'Templates',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Template__BACD684416B8294A",
        unique: true,
        fields: [
          { name: "TEMPLATE_NO" },
        ]
      },
    ]
  });
};


const Joi = require('joi');

const TemplateDataSchema = Joi.object({
  TEMPLATE_NAME: Joi.string().max(50).allow(null).allow(''),
  CONTENT: Joi.string().allow(null).allow(''),
  KEYWORDS: Joi.string().allow(null).allow(''),
  SEND_DATE: Joi.string().max(50).allow(null).allow(''),
  SCHEDULED: Joi.number().integer().allow(null).allow(''),
  Created_by: Joi.string().max(100).allow(null).allow(''),
  SHOW_HEADER: Joi.number().integer().valid(0, 1).allow(null)
});

module.exports = { _Template , TemplateDataSchema };
