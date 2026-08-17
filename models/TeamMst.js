const Sequelize = require('sequelize');
const _TeamMst = function(sequelize, DataTypes) {
  return sequelize.define('TeamMst', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    EMPCODE: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    PARENT_CODE: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    FROM: {
      type: DataTypes.DATE,
      allowNull: true
    },
    TO: {
      type: DataTypes.DATE,
      allowNull: true
    },
    LOC_CODE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    EXPORT_TYPE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Created_At: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('getdate')
    },
    Created_By: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'TeamMst',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__TeamMst__C5B6F0D2234FD970",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};


const Joi = require('joi');

const teamMstSchema = Joi.object({
  UTD: Joi.number().integer().positive().optional(),
  EMPCODE: Joi.string().max(50).allow(null),
  PARENT_CODE: Joi.string().max(50).allow(null),
  FROM: Joi.date().allow(null),
  TO: Joi.date().allow(null),
  LOC_CODE: Joi.number().integer().allow(null),
  EXPORT_TYPE: Joi.number().integer().allow(null),
  Created_By: Joi.string().max(100).allow(null),
});

module.exports = {_TeamMst, teamMstSchema};
