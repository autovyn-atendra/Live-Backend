// models/DemoCarAppointment.js

const _DemoCarAppointment = function (sequelize, DataTypes) {
    return sequelize.define('Demo_Car_Appointment', {
        UTD: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        CustomerName: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        Mob_Number: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        Model_Name: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        Model_Group: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        DSE: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        Enq_No: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        Date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        Time: {
            type: DataTypes.TIME,
            allowNull: true
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        Created_By: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        Created_At: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'Demo_Car_Appointment',
        timestamps: false,         // ValidFrom/ValidTo SQL handle karta hai
        freezeTableName: true
    });
};

module.exports = { _DemoCarAppointment };