const { DataTypes } = require("sequelize");
const Joi = require("joi");


const _Employee_ITSkill = function (sequelize, DataTypes) {
    return sequelize.define('Employee_ITSkill', {
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
        Emp_Tool: {
            type: DataTypes.STRING(30),
            allowNull: true,
        },
        Emp_Version: {
            type: DataTypes.STRING(30),
            allowNull: true,
        },
        Emp_Proficiency: {
            type: DataTypes.STRING(30),
            allowNull: true,
        },
        Emp_Last_Used: {
            type: DataTypes.STRING(4),
            allowNull: true,
        },
        Emp_Experience: {
            type: DataTypes.STRING(4),
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
        srno: {
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
        tableName: "Employee_ITSkill",
        timestamps: false,
    });
}
// ✅ Joi Schema
const employeeITSkillSchema = Joi.object({
    Emp_Code: Joi.string().max(10).allow(null, ''),
    Emp_Srno: Joi.string().max(10).allow(null, ''),
    Emp_Tool: Joi.string().max(30).allow(null, ''),
    Emp_Version: Joi.string().max(30).allow(null, ''),
    Emp_Proficiency: Joi.string().max(30).allow(null, ''),
    Emp_Last_Used: Joi.string().max(4).allow(null, ''),
    Emp_Experience: Joi.string().max(4).allow(null, ''),
    Export_Type: Joi.number().integer().allow(null),
    Loc_Code: Joi.number().integer().allow(null),
    Serverid: Joi.number().integer().allow(null),
    srno: Joi.number().integer().allow(null),
    CREATED_BY: Joi.string().max(50).allow(null, ''),
    CREATED_ON: Joi.date().allow(null),
    lASTMODI_BY: Joi.string().max(50).allow(null, ''),
    LASTMODI_ON: Joi.date().allow(null)
});



module.exports = { _Employee_ITSkill, employeeITSkillSchema }