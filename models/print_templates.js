const Sequelize = require('sequelize');
const _Print_Templates = function (sequelize, DataTypes) {
    return sequelize.define('PrintTemplates', {
        TRAN_ID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },

        TEMPLATE_ID: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        EMPCODE: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        REQ_DATE: {
            type: DataTypes.TIME,
            allowNull: true,
        },

        LOC_CODE: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        APPR_1_CODE: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        APPR_1_STAT: {
            type: DataTypes.TINYINT,
            allowNull: true,
        },
        APPR_1_DATE: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        APPR_1_REM: {
            type: DataTypes.STRING(300),
            allowNull: true,
        },
        APPR_2_CODE: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        APPR_2_STAT: {
            type: DataTypes.TINYINT,
            allowNull: true,
        },
        APPR_2_DATE: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        APPR_2_REM: {
            type: DataTypes.STRING(300),
            allowNull: true,
        },
        APPR_3_CODE: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        APPR_3_STAT: {
            type: DataTypes.TINYINT,
            allowNull: true,
        },
        APPR_3_DATE: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        APPR_3_REM: {
            type: DataTypes.STRING(300),
            allowNull: true,
        },
        FIN_APPR: {
            type: DataTypes.TINYINT,
            allowNull: true,
        },
        Created_By: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        PDF_PATH: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        EXPORT_TYPE: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

    }, {
        sequelize,
        tableName: 'PRINT_TEMPLATES',
        schema: 'dbo',
        timestamps: false,
        indexes: [
            {
                name: "PK__Product___C5B6F0D28FFEE240",
                unique: true,
                fields: [
                    { name: "TRAN_ID" },
                ]
            },
        ]
    });
};

const Joi = require('joi');

const PrintTemplatesSchema = Joi.object({
    TRAN_ID: Joi.number().integer().optional().allow('', null),

    TEMPLATE_ID: Joi.number().integer().optional().allow('', null),

    EMPCODE: Joi.string().max(20).optional().allow('', null),

    REQ_DATE: Joi.date().optional().allow('', null),

    LOC_CODE: Joi.number().integer().optional().allow('', null),

    APPR_1_CODE: Joi.string().max(100).optional().allow('', null),
    APPR_1_STAT: Joi.number().integer().min(0).max(255).optional().allow('', null),
    APPR_1_DATE: Joi.date().optional(),
    APPR_1_REM: Joi.string().max(300).optional().allow('', null),

    APPR_2_CODE: Joi.string().max(100).optional().allow('', null),
    APPR_2_STAT: Joi.number().integer().min(0).max(255).optional().allow('', null),
    APPR_2_DATE: Joi.date().optional(),
    APPR_2_REM: Joi.string().max(300).optional().allow('', null),

    APPR_3_CODE: Joi.string().max(100).optional().allow('', null),
    APPR_3_STAT: Joi.number().integer().min(0).max(255).optional().allow('', null),
    APPR_3_DATE: Joi.date().optional(),
    APPR_3_REM: Joi.string().max(300).optional().allow('', null),

    FIN_APPR: Joi.number().integer().min(0).max(255).optional().allow('', null),

    Created_By: Joi.string().max(255).optional().allow('', null),

    PDF_PATH: Joi.string().max(500).optional().allow('', null),
    EXPORT_TYPE: Joi.number().integer().optional().allow('', null),
});

module.exports = { _Print_Templates, PrintTemplatesSchema };

