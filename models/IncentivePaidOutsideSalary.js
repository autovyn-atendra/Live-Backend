const Sequelize = require("sequelize");
const _Incentive_Paid_Outside_Salary = function (sequelize, DataTypes) {
    return sequelize.define(
        "Incentive_Paid_Outside_Salary",
        {
            UTD: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            Emp_Code: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            Emp_Name: {
                type: DataTypes.STRING(300),
                allowNull: true,
            },
            IncMnth: {
                type: DataTypes.DECIMAL(18, 2), // Sequelize doesn’t have money, so DECIMAL is preferred
                allowNull: true,
            },
            Inc_Yr: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            Inc_Name: {
                type: DataTypes.STRING(300),
                allowNull: true,
            },
            Remark: {
                type: DataTypes.STRING(500),
                allowNull: true,
            },
            Amount: {
                type: DataTypes.DECIMAL(18, 2),
                allowNull: true,
            },
            Location: {
                type: DataTypes.STRING(10),
                allowNull: true,
            },
            Disb_Amt: {
                type: DataTypes.DECIMAL(18, 2),
                allowNull: true,
            },
            Disb_Location: {
                type: DataTypes.STRING(10),
                allowNull: true,
            },
            Created_By: {
                type: DataTypes.STRING(255),
                allowNull: true,
            }
        },
        {
            sequelize,
            tableName: "Incentive_Paid_Outside_Salary",
            schema: "dbo",
            timestamps: false,
            indexes: [
                {
                    name: "PK__Product___C5B6F0D28FFEE240",
                    unique: true,
                    fields: [{ name: "Seq_No" }],
                },
            ],
        }
    );
};

module.exports = { _Incentive_Paid_Outside_Salary };
