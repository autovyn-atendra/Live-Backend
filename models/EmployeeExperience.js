const Sequelize = require('sequelize');
const Joi = require('joi');

const _EmployeeExperience = function (sequelize, DataTypes) {
    return sequelize.define('Employee_Experience', {
        Utd: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        Emp_Code: {
            type: DataTypes.STRING(10),
            allowNull: true
        },
        Emp_Srno: {
            type: DataTypes.STRING(10),
            allowNull: true
        },
        Emp_Company: {
            type: DataTypes.STRING(30),
            allowNull: true
        },
        Emp_Designation: {
            type: DataTypes.STRING(30),
            allowNull: true
        },
        Emp_Responsibility: {
            type: DataTypes.STRING(30),
            allowNull: true
        },
        Emp_From_Date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        Emp_To_Date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        Emp_Settlement_Done: {
            type: DataTypes.STRING(30),
            allowNull: true
        },
        Emp_Drawn_Salary: {
            type: DataTypes.DECIMAL(19, 4),
            allowNull: true
        },
        Emp_Leaving_Reason: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        Export_Type: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        Loc_Code: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        Serverid: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        SRNO: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        CREATED_BY: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        CREATED_ON: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        LASTMODI_BY: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        LASTMODI_ON: {
            type: DataTypes.DATEONLY,
            allowNull: true
        }
    }, {
        sequelize,
        tableName: 'Employee_Experience',
        schema: 'dbo',
        timestamps: false
    });
};

const employeeExperienceSchema = Joi.object({
    Emp_Code: Joi.string().max(10).allow(null).allow(''),
    Emp_Srno: Joi.string().max(10).allow(null).allow(''),
    Emp_Company: Joi.string().max(30).allow(null).allow(''),
    Emp_Designation: Joi.string().max(30).allow(null).allow(''),
    Emp_Responsibility: Joi.string().max(30).allow(null).allow(''),
    Emp_From_Date: Joi.date().allow(null),
    Emp_To_Date: Joi.date().allow(null),
    Emp_Settlement_Done: Joi.string().max(30).allow(null).allow(''),
    Emp_Drawn_Salary: Joi.number().precision(4).allow(null),
    Emp_Leaving_Reason: Joi.string().max(50).allow(null).allow(''),
    Export_Type: Joi.number().integer().allow(null),
    Loc_Code: Joi.number().integer().allow(null),
    Serverid: Joi.number().integer().allow(null),
    SRNO: Joi.number().integer().allow(null),
    CREATED_BY: Joi.string().max(50).allow(null).allow(''),
    CREATED_ON: Joi.date().allow(null),
    LASTMODI_BY: Joi.string().max(50).allow(null).allow(''),
    LASTMODI_ON: Joi.date().allow(null)
});

module.exports = {
    _EmployeeExperience,
    employeeExperienceSchema
};
