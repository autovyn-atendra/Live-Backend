const Sequelize = require("sequelize");

const _HyundaiCounterSummaryImport = function (sequelize, DataTypes) {
    return sequelize.define(
        "Hyundai_Counter_Summary_Import",
        {
            UTD: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            Invoice_No_Ro_Bill_No: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            Sales_Date: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            Sales_Type: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            Invoice_Type: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            RO_Type: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            Cash_Credit: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            Customer_Code: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            Veh_Regn_No_Pan_No: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            Discount_Amount: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            Taxable_Value_VAT: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            Taxable_Value_CST: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            Taxable_Value: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            Workshop_Labor: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            Service_Tax: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            Cess: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            VAT_Value: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            CST_Value: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            Value_K_CESS_Amount: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            Value_SGST: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            Value_CGST: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            Value_IGST: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            Value_TCS: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            Freight_insurance: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            VAT_on_Labour: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            Value_FRG_INS_SGST: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            Value_FRG_INS_CGST: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            Value_FRG_INS_IGST: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            H_Cess: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            Invoice_Value: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            IRN_NO: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            IRN_DT: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            location: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            Created_By: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            LEDG_ACNT: {
    type: DataTypes.STRING(50),
    allowNull: true,
},
          
        },
        {
            sequelize,
            tableName: "Hyundai_Counter_Summary_Import",
            schema: "dbo",
            timestamps: false,
            indexes: [
                {
                    name: "PK_Hyundai_Counter_A091E31A5140443F",
                    unique: true,
                    fields: [{ name: "UTD" }],
                },
            ],
        }
    );
};

const Joi = require("joi");

const HyundaiCounterSummaryImportSchema = Joi.object({
    UTD: Joi.number().integer().required(),

    Invoice_No_Ro_Bill_No: Joi.string().max(50).allow(null, ""),
    Sales_Date: Joi.date().allow(null),
    Sales_Type: Joi.string().max(50).allow(null, ""),
    Invoice_Type: Joi.string().max(50).allow(null, ""),
    RO_Type: Joi.string().max(50).allow(null, ""),
    Cash_Credit: Joi.string().max(50).allow(null, ""),
    Customer_Code: Joi.string().max(50).allow(null, ""),
    Veh_Regn_No_Pan_No: Joi.string().max(50).allow(null, ""),
    Discount_Amount: Joi.string().max(50).allow(null, ""),
    Taxable_Value_VAT: Joi.string().max(50).allow(null, ""),
    Taxable_Value_CST: Joi.string().max(50).allow(null, ""),
    Taxable_Value: Joi.string().max(50).allow(null, ""),
    Workshop_Labor: Joi.string().max(50).allow(null, ""),
    Service_Tax: Joi.string().max(50).allow(null, ""),
    Cess: Joi.string().max(50).allow(null, ""),
    VAT_Value: Joi.string().max(50).allow(null, ""),
    CST_Value: Joi.string().max(50).allow(null, ""),
    Value_K_CESS_Amount: Joi.string().max(50).allow(null, ""),
    Value_SGST:Joi.string().max(50).allow(null, ""),
    Value_CGST: Joi.string().max(50).allow(null, ""),
    Value_IGST: Joi.string().max(50).allow(null, ""),
    Value_TCS: Joi.string().max(50).allow(null, ""),
    Freight_insurance: Joi.string().max(50).allow(null, ""),
    VAT_on_Labour: Joi.string().max(50).allow(null, ""),
    Value_FRG_INS_SGST: Joi.string().max(50).allow(null, ""),
    Value_FRG_INS_CGST: Joi.string().max(50).allow(null, ""),
    Value_FRG_INS_IGST: Joi.string().max(50).allow(null, ""),
    H_Cess: Joi.string().max(50).allow(null, ""),
    Invoice_Value: Joi.string().max(50).allow(null, ""),
    IRN_NO: Joi.string().max(50).allow(null, ""),
    IRN_DT: Joi.date().allow(null),
    location: Joi.string().max(50).allow(null, ""),
    Created_By: Joi.string().max(255).allow(null, ""),
    LEDG_ACNT: Joi.string().max(50).allow(null, ""),
});

module.exports = { HyundaiCounterSummaryImportSchema, _HyundaiCounterSummaryImport };

