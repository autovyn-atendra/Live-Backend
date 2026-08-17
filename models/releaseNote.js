const Sequelize = require('sequelize');

const _ReleaseNote = function (sequelize, DataTypes) {
    return sequelize.define('ReleaseNote', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        module_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        platform: {
            type: DataTypes.ENUM('web', 'mobile'),
            allowNull: false
        },
        release_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        created_by: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
    }, {
        sequelize,
        tableName: 'release_notes',
        schema: 'dbo',
        timestamps: false,
        indexes: [
            {
                name: 'release_note_index',
                fields: [
                    { name: 'platform' },
                    { name: 'release_date' },
                ]
            }
        ]
    });
};

const _YoutubeUrl = function (sequelize, DataTypes) {
    return sequelize.define('YoutubeUrl', {
        UTD: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        Erp_Url: {
            type: DataTypes.STRING(300),
            allowNull: true,
            unique: "UQ__YoutubeU__89A9E0BDE51A16D8"
        },
        YoutubeUrl: {
            type: DataTypes.STRING(300),
            allowNull: true
        }
    }, {
        sequelize,
        tableName: 'YoutubeUrl',
        schema: 'dbo',
        timestamps: false,
        indexes: [
            {
                name: "UQ__YoutubeU__89A9E0BDE51A16D8",
                unique: true,
                fields: [
                    { name: "Erp_Url" },
                ]
            },
        ]
    });
};
module.exports = { _ReleaseNote, _YoutubeUrl };
