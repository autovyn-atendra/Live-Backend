const Sequelize = require("sequelize");

const _ConsumerOfferMSIL = function (sequelize, DataTypes) {
    return sequelize.define(
        "Consumer_Offer_MSIL",
        {
            UTD: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            Model_Code: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            Model_Name: {
                type: DataTypes.STRING(200),
                allowNull: true,
            },
            Offer: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            Dealer_Share: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            MSIL_Share: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            Offer_Type: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            Location: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            Region: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            Date_From: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            Date_Upto: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            Created_By: {
                type: DataTypes.STRING(200),
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: "Consumer_Offer_MSIL",
            schema: "dbo",
            timestamps: false,
            indexes: [
                {
                    name: "PK_Consumer_Offer_MSIL",
                    unique: true,
                    fields: [{ name: "UTD" }],
                },
            ],
        }
    );
};

const Joi = require("joi");

const ConsumerOfferMSILSchema = Joi.object({
    UTD: Joi.number().integer().optional(),
    Model_Code: Joi.string().max(50).allow(null).allow(''),
    Model_Name: Joi.string().max(200).allow(null).allow(''),
    Offer: Joi.number().precision(2).allow(null),
    Dealer_Share: Joi.number().precision(2).allow(null),
    MSIL_Share: Joi.number().precision(2).allow(null),
    Offer_Type: Joi.string().max(50).allow(null).allow(''),
    Location: Joi.string().max(50).allow(null).allow(''),
    Region: Joi.string().max(50).allow(null).allow(''),
    Date_From: Joi.date().allow(null).allow(''),
    Date_Upto: Joi.date().allow(null).allow(''),
    Created_By: Joi.string().max(200).allow(null).allow(''),
});

module.exports = { _ConsumerOfferMSIL, ConsumerOfferMSILSchema };
