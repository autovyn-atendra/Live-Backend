const Sequelize = require('sequelize');
const _Honda_Price_List = function (sequelize, DataTypes) {
    return sequelize.define('Honda_Price_List', {
        UTD: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        City: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        State: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        ModelSegment: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        ModelName: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        ModelCode: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        Type: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        Color: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        ModelVariant: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        HSNCode: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        ModelSerialNo: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        ExShowroomPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        InsuranceAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        RegistrationAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        RoadTax: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        OnRoadPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        OtherTaxes: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        Created_by: {
            type: DataTypes.STRING(30),
            allowNull: true,
        },
        Location: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'Honda_Price_List',
        schema: 'dbo',
        timestamps: false,
        indexes: [
            {
                name: "PK_Honda_Price_List",
                unique: true,
                fields: [
                    { name: "UTD" },
                ],
            },
        ],
    });
};
const Joi = require('joi');

const Honda_Price_List_Shema = Joi.object({
    UTD: Joi.number().integer().positive(),
    City: Joi.string().max(50).allow(null, ''),
    State: Joi.string().max(50).allow(null, ''),
    ModelSegment: Joi.string().max(20).allow(null, ''),
    ModelName: Joi.string().max(200).allow(null, ''),
    ModelCode: Joi.string().max(20).allow(null, ''),
    Type: Joi.string().max(20).allow(null, ''),
    Color: Joi.string().max(100).allow(null, ''),
    ModelVariant: Joi.string().max(200).allow(null, ''),
    HSNCode: Joi.alternatives().try(Joi.string().max(20).allow(null, ""), Joi.number().allow(null, "")),
    ModelSerialNo: Joi.string().max(100).allow(null, ''),
    ExShowroomPrice: Joi.number().precision(2).positive().allow(null),
    InsuranceAmount: Joi.number().precision(2).positive().allow(null),
    RegistrationAmount: Joi.number().precision(2).positive().allow(null),
    RoadTax: Joi.number().precision(2).positive().allow(null),
    OnRoadPrice: Joi.number().precision(2).positive().allow(null),
    OtherTaxes: Joi.alternatives().try(Joi.string().max(50).allow(null, ""), Joi.number().allow(null, "")),
    Created_by: Joi.string().max(30).allow(null, ''),
    Location: Joi.alternatives().try(Joi.string().max(50).allow(null, ""), Joi.number().allow(null, "")),

});
module.exports = { _Honda_Price_List, Honda_Price_List_Shema };
