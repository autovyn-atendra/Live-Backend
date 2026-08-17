// employee_language.model.js

const { DataTypes } = require("sequelize");
const Joi = require("joi");


const _Employee_Language = function (sequelize, DataTypes) {
    return sequelize.define('Employee_Language', {
        Utd: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        Emp_Code: {
            type: DataTypes.STRING(10),
            allowNull: true,
        },
        Emp_Srno: {
            type: DataTypes.STRING(10),
            allowNull: true,
        },
        Emp_Language: {
            type: DataTypes.STRING(30),
            allowNull: true,
        },
        Emp_Language_Understand: {
            type: DataTypes.STRING(30),
            allowNull: true,
        },
        Emp_Language_Speak: {
            type: DataTypes.STRING(30),
            allowNull: true,
        },
        Emp_Language_Read: {
            type: DataTypes.STRING(30),
            allowNull: true,
        },
        Emp_Language_Write: {
            type: DataTypes.STRING(30),
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
        Serverid: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        Srno: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        CREATED_BY: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        CREATED_ON: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        lASTMODI_BY: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        LASTMODI_ON: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        }
    }, {
        tableName: "Employee_Language",
        timestamps: false,
    });
}

// Joi validation schema
const employeeLanguageSchema = Joi.object({
    Emp_Code: Joi.string().max(10).allow(null, ''),
    Emp_Srno: Joi.string().max(10).allow(null, ''),
    Emp_Language: Joi.string().max(30).allow(null, ''),
    Emp_Language_Understand: Joi.string().max(30).allow(null, ''),
    Emp_Language_Speak: Joi.string().max(30).allow(null, ''),
    Emp_Language_Read: Joi.string().max(30).allow(null, ''),
    Emp_Language_Write: Joi.string().max(30).allow(null, ''),
    Export_Type: Joi.number().integer().allow(null),
    Loc_Code: Joi.number().integer().allow(null),
    Serverid: Joi.number().integer().allow(null),
    Srno: Joi.number().integer().allow(null),
    CREATED_BY: Joi.string().max(50).allow(null, ''),
    CREATED_ON: Joi.date().allow(null),
    lASTMODI_BY: Joi.string().max(50).allow(null, ''),
    LASTMODI_ON: Joi.date().allow(null)
});

module.exports = { _Employee_Language, employeeLanguageSchema };
