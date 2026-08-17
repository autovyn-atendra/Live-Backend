const Sequelize = require('sequelize');
const _Honda_Acc = function (sequelize, DataTypes) {
    return sequelize.define('HondaAcc', {
        UTD: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        NetworkType: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        NetworkCode: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        NetworkName: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        InvoiceDate: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        InvoiceNumber: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        ReferenceNo: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        CustomerName: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        CustomerMobile: {
            type: DataTypes.STRING(15),
            allowNull: true,
        },
        CustomerState: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        CustomerStateCode: {
            type: DataTypes.STRING(10),
            allowNull: true,
        },
        AccountName: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        AccountMobile: {
            type: DataTypes.STRING(15),
            allowNull: true,
        },
        AccountState: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        AccountStateCode: {
            type: DataTypes.STRING(10),
            allowNull: true,
        },
        AccountGSTIN: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        AccountUIN: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        OrderType: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        PartCategory: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        PartLabourNumber: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        PartLabourDescription: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        Location: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        HSNSACCode: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        QTYShipped: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        BasicPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        TotalDiscount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        TaxableAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        CGSTAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        CGSTRate: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },
        SGSTAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        SGSTRate: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },
        IGSTAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        IGSTRate: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },
        UTGSTAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        UTGSTRate: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },
        TotalTax: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        LineItemInvoiceAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        JobCardNo: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        VehicleNo: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        LedgerName: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        Created_by: {
            type: DataTypes.STRING(30),
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'Honda_Acc',
        schema: 'dbo',
        timestamps: false,
        indexes: [
            {
                name: "PK_Honda_Acc",
                unique: true,
                fields: [
                    { name: "UTD" },
                ],
            },
        ],
    });
};
const Joi = require('joi');

const Honda_Acc_Shema = Joi.object({
    UTD: Joi.number().integer().positive(),
    NetworkType: Joi.string().max(50).allow(null, ""),
    NetworkCode: Joi.string().max(50).allow(null, ""),
    NetworkName: Joi.string().max(255).allow(null, ""),
    Location: Joi.string().max(50).allow(null),
    InvoiceDate: Joi.date().raw().allow(null),
    InvoiceNumber: Joi.string().max(50).allow(null, ""),
    ReferenceNo: Joi.string().max(50).allow(null, ""),
    CustomerName: Joi.string().max(255).allow(null, ""),
    CustomerMobile: Joi.string().max(15).allow(null, ""),
    CustomerState: Joi.string().max(50).allow(null, ""),
    CustomerStateCode: Joi.string().max(10).allow(null, ""),
    AccountName: Joi.string().max(255).allow(null, ""),
    AccountMobile: Joi.string().max(15).allow(null, ""),
    AccountState: Joi.string().max(50).allow(null, ""),
    AccountStateCode: Joi.string().max(10).allow(null, ""),
    AccountGSTIN: Joi.string().max(50).allow(null, ""),
    AccountUIN: Joi.string().max(50).allow(null, ""),
    OrderType: Joi.string().max(50).allow(null, ""),
    PartCategory: Joi.string().max(50).allow(null, ""),
    PartLabourNumber: Joi.string().max(50).allow(null, ""),
    PartLabourDescription: Joi.string().max(255).allow(null, ""),
    HSNSACCode: Joi.string().max(50).allow(null, ""),
    QTYShipped: Joi.alternatives().try(Joi.string().max(50).allow(null, ""), Joi.number().allow(null, "")),
    BasicPrice: Joi.number().precision(2).allow(null, ""),
    TotalDiscount: Joi.number().precision(2).allow(null),
    TaxableAmount: Joi.number().precision(2).allow(null),
    CGSTAmount: Joi.number().precision(2).allow(null),
    CGSTRate: Joi.alternatives().try(Joi.string().max(50).allow(null, ""), Joi.number().allow(null, "")),
    SGSTAmount: Joi.number().precision(2).allow(null),
    SGSTRate: Joi.alternatives().try(Joi.string().max(50).allow(null, ""), Joi.number().allow(null, "")),
    IGSTAmount: Joi.number().precision(2).allow(null),
    IGSTRate: Joi.alternatives().try(Joi.string().max(50).allow(null, ""), Joi.number().allow(null, "")),
    UTGSTAmount: Joi.number().precision(2).allow(null),
    UTGSTRate: Joi.alternatives().try(Joi.string().max(50).allow(null, ""), Joi.number().allow(null, "")),
    TotalTax: Joi.number().precision(2).allow(null),
    LineItemInvoiceAmount: Joi.number().precision(2).allow(null),
    JobCardNo: Joi.string().max(50).allow(null, ""),
    VehicleNo: Joi.string().max(50).allow(null, ""),
    LedgerName: Joi.string().max(255).allow(null, ""),
    Created_by: Joi.string().max(30).allow(null, ""),
});
module.exports = { _Honda_Acc, Honda_Acc_Shema };
