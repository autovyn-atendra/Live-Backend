const Sequelize = require("sequelize");

const _TID_DTL = function (sequelize, DataTypes) {
    return sequelize.define(
        "TID_DTL",
        {
            TID: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },

            MST_TID: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            SRNO: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            SEQ_NO: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            SUB_SEQ_NO: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            TERMS: {
                type: DataTypes.TEXT, // varchar(MAX)
                allowNull: true,
            },

            SEGMENT_CODE: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            EXPORT_TYPE: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            Created_By: {
                type: DataTypes.STRING(255),
                allowNull: true,
            }
        },
        {
            tableName: "TID_DTL",
            schema: "dbo",
            timestamps: false,
        }
    );
};

module.exports = { _TID_DTL };
