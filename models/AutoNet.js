const Sequelize = require('sequelize');

const _AutonetTemp = function (sequelize, DataTypes) {
    return sequelize.define('Autonet_Temp', {
        UTD: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        Tran_id: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        Tbl_Name: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        Export_Type: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        Created_By: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        Created_At: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal("GETDATE()")
        }
 
    }, {
        sequelize,
        tableName: 'Autonet_Temp',
        schema: 'dbo',
        timestamps: false,
        indexes: [
            {
                name: "PK_Autonet_Temp",
                unique: true,
                fields: [
                    { name: "UTD" }
                ]
            }
        ]
    });
};

const Joi = require('joi');

const autonetTempSchema = Joi.object({
    Tran_id: Joi.string().max(20).required(),
    Tbl_Name: Joi.string().max(50).allow(null, ''),
    Export_Type: Joi.number().integer().allow(null),
    Created_By: Joi.string().max(255).allow(null, ''),
    Created_At: Joi.date().raw().allow(null),   // defaults to GETDATE()
});

module.exports = { autonetTempSchema, _AutonetTemp };
