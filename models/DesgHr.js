const Sequelize = require('sequelize');
const _DesgHr = function(sequelize, DataTypes) {
  return sequelize.define('DesgHr', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Child: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Parent: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Created_At: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('getdate')
    },
    Created_by: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Desg_hr',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Desg_hr__C5B6F0D25FB36637",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};


const Joi = require('joi');

const DesgHrSchema = Joi.object({
  Child: Joi.string().max(100).allow(null).allow(''),
  Parent: Joi.string().max(50).allow(null).allow(''),
  Created_by: Joi.string().max(100).allow(null).allow(''),
});

module.exports = {DesgHrSchema, _DesgHr};
