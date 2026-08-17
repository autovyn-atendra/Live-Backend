const Sequelize = require('sequelize');
const _Shift_Import = function (sequelize, DataTypes) {
  return sequelize.define('ShiftImport', {
    UTD: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Empcode: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    DateFrom: {
        type: DataTypes.DATEONLY,  // Stores only date
        allowNull: true
    },
    DateTo: {
        type: DataTypes.DATEONLY,  // Stores only date
        allowNull: true
    },
    Start_Time: {
        type: DataTypes.TIME,  // Stores only time
        allowNull: true
    },
    End_Time: {
        type: DataTypes.TIME,  // Stores only time
        allowNull: true
    },
    Loc_Code: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    Created_By: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
     Weekly_Off: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'Shift_Import',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Product___C5B6F0D28FFEE240",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};

const Joi = require('joi');

const ShiftImportSchema = Joi.object({
    Empcode: Joi.string().max(50).allow(null, ''),
    DateFrom: Joi.date().iso().allow(null,''), 
    DateTo: Joi.date().iso().allow(null,''),
    Start_Time: Joi.string()
        .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
        .allow(null,''),  // Validates HH:mm:ss format
    End_Time: Joi.string()
        .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
        .allow(null,''),  // Validates HH:mm:ss format
    Loc_Code: Joi.string().max(10).allow(null, ''),
    Created_By: Joi.string().max(255).allow(null, ''),
     Weekly_Off: Joi.string().max(20).allow(null, '')
});

module.exports = { _Shift_Import, ShiftImportSchema };

