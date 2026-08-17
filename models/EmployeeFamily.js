const { DataTypes } = require("sequelize");
const Joi = require("joi");


const _Employee_Family = function (sequelize, DataTypes) {
    return sequelize.define('Employee_Family', {
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
        Emp_Family_name: {
            type: DataTypes.STRING(30),
            allowNull: true,
        },
        Emp_Family_DOB: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        Emp_Family_Relation: {
            type: DataTypes.STRING(30),
            allowNull: true,
        },
        Emp_Family_Address: {
            type: DataTypes.STRING(30),
            allowNull: true,
        },
        Emp_Family_Bloodgroup: {
            type: DataTypes.STRING(30),
            allowNull: true,
        },
        Emp_Family_Gender: {
            type: DataTypes.STRING(30),
            allowNull: true,
        },
        Emp_Family_Mobileno: {
            type: DataTypes.STRING(30),
            allowNull: true,
        },
        Emp_Family_emailid: {
            type: DataTypes.STRING(30),
            allowNull: true,
        },
        Emp_Family_Profession: {
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
        }
    }, {
        tableName: "Employee_Family",
        timestamps: false,
    });
};
// ✅ Joi Schema
const employeeFamilySchema = Joi.object({
    Emp_Code: Joi.string().max(10).allow(null, ''),
    Emp_Srno: Joi.string().max(10).allow(null, ''),
    Emp_Family_name: Joi.string().max(30).allow(null, ''),
    Emp_Family_DOB: Joi.date().allow(null),
    Emp_Family_Relation: Joi.string().max(30).allow(null, ''),
    Emp_Family_Address: Joi.string().max(30).allow(null, ''),
    Emp_Family_Bloodgroup: Joi.string().max(30).allow(null, ''),
    Emp_Family_Gender: Joi.string().max(30).allow(null, ''),
    Emp_Family_Mobileno: Joi.string().max(30).allow(null, ''),
    Emp_Family_emailid: Joi.string().max(30).allow(null, ''),
    Emp_Family_Profession: Joi.string().max(30).allow(null, ''),
    Export_Type: Joi.number().integer().allow(null),
    Loc_Code: Joi.number().integer().allow(null),
    Serverid: Joi.number().integer().allow(null),
    Srno: Joi.number().integer().allow(null),
});



module.exports = { _Employee_Family, employeeFamilySchema }