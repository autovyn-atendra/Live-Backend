const Sequelize = require("sequelize");

const _UserMobActHst = function (sequelize, DataTypes) {
    return sequelize.define(
        "UserActHst",
        {
            UTD: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },

            USER_Code: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            Login_Batch: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },

            Action_Taken: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },

            Action_Date: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },

            Action_Time: {
                type: DataTypes.DECIMAL(19, 4),   // MONEY → DECIMAL(19,4)
                allowNull: true,
            },

            Ledg_Code: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            Group_Code: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            Book_Code: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            Loc_Code: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            Action_LMode: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            Src_Portal: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            Emp_Code: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: "USER_MOB_ACT_HST",
            schema: "dbo",
            timestamps: false,
            indexes: [
                {
                    name: "PK_USER_ACT_HST",
                    unique: true,
                    fields: [{ name: "UTD" }],
                },
            ],
        }
    );
};


const Joi = require("joi");

const UserMobActHstSchema = Joi.object({
    USER_Code: Joi.number().integer().allow(null),

    Login_Batch: Joi.string().max(20).allow(null).allow(""),

    Action_Taken: Joi.string().max(100).allow(null).allow(""),

    Action_Date: Joi.date().allow(null).allow("").raw(),

    Action_Time: Joi.number().allow(null),   // MONEY → number

    Ledg_Code: Joi.number().integer().allow(null),

    Group_Code: Joi.number().integer().allow(null),

    Book_Code: Joi.number().integer().allow(null),

    Loc_Code: Joi.number().integer().allow(null),

    Action_LMode: Joi.number().integer().allow(null),
    Src_Portal: Joi.number().integer().allow(null),
    Emp_Code: Joi.string().max(100).allow(null).allow(""),
});


module.exports = { _UserMobActHst, UserMobActHstSchema };

