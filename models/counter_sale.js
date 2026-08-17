const Sequelize = require("sequelize");

const _HyundaiCounterSaleImport = function (sequelize, DataTypes) {
    return sequelize.define(
        "Hyundai_Counter_Sale_Import",
        {
            UTD: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            Invoice_No_RO_Bill_No: {
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
            Ro_Type: {
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
            Veh_Reg_No: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            VIN: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            Part_Cat: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            GST: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            Rate_Perc: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            UQC: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            Place_of_Supply: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            Part_No: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            HSN: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            Part_Name: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            BATCH_CD: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            BATCH_DT: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            Qty: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            Unit_Price: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            Discount_Amount: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            Value: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            PART_TAX: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            K_CESS_Amount: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            PART_TAX_SGST: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            PART_TAX_CGST: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            PART_TAX_IGST: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            PART_TAX_TGST: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            FRG_INS_TAX_SGST: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            FRG_INS_TAX_CGST: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            FRG_INS_TAX_IGST: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            FRG_INS_TAX_TGST: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            INVOICE_VALUE: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            IRN_NO: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            IRN_DT: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            EWB: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            EWB_DT: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            PROMO_NO: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            SALES_CAT: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            MEMBER_CD: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            Created_By: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            location: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            
        },
        {
            sequelize,
            tableName: "Hyundai_Counter_Sale_Import",
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

const HyundaiCounterSaleImportSchema = Joi.object({
    UTD: Joi.number().integer().optional(),
    Invoice_No_RO_Bill_No: Joi.string().max(50).allow(null).allow(''),
    Sales_Date: Joi.date().allow(null),
    Sales_Type: Joi.string().max(50).allow(null).allow(''),
    Invoice_Type: Joi.string().max(50).allow(null).allow(''),
    Ro_Type: Joi.string().max(50).allow(null).allow(''),
    Cash_Credit: Joi.string().max(50).allow(null).allow(''),
    Customer_Code: Joi.string().max(50).allow(null).allow(''),
    Veh_Reg_No: Joi.string().max(50).allow(null).allow(''),
    VIN: Joi.string().max(50).allow(null).allow(''),
    Part_Cat: Joi.string().max(50).allow(null).allow(''),
    GST: Joi.string().max(50).allow(null).allow(''),
    Rate_Perc: Joi.string().max(50).allow(null).allow(''),
    UQC: Joi.string().max(50).allow(null).allow(''),
    Place_of_Supply: Joi.string().max(50).allow(null).allow(''),
    Part_No: Joi.string().max(50).allow(null).allow(''),
    HSN: Joi.string().max(50).allow(null).allow(''),
    Part_Name: Joi.string().max(50).allow(null).allow(''),
    BATCH_CD: Joi.string().max(50).allow(null).allow(''),
    BATCH_DT: Joi.date().allow(null),
    Qty: Joi.string().max(50).allow(null).allow(''),
    Unit_Price: Joi.string().max(50).allow(null).allow(''),
    Discount_Amount: Joi.string().max(50).allow(null).allow(''),
    Value: Joi.string().max(50).allow(null).allow(''),
    PART_TAX: Joi.string().max(50).allow(null).allow(''),
    K_CESS_Amount: Joi.string().max(50).allow(null).allow(''),
    PART_TAX_SGST: Joi.string().max(50).allow(null).allow(''),
    PART_TAX_CGST: Joi.string().max(50).allow(null).allow(''),
    PART_TAX_IGST: Joi.string().max(50).allow(null).allow(''),
    PART_TAX_TGST: Joi.string().max(50).allow(null).allow(''),
    FRG_INS_TAX_SGST: Joi.string().max(50).allow(null).allow(''),
    FRG_INS_TAX_CGST: Joi.string().max(50).allow(null).allow(''),
    FRG_INS_TAX_IGST: Joi.string().max(50).allow(null).allow(''),
    FRG_INS_TAX_TGST: Joi.string().max(50).allow(null).allow(''),
    INVOICE_VALUE: Joi.string().max(50).allow(null).allow(''),
    IRN_NO: Joi.string().max(50).allow(null).allow(''),
    IRN_DT: Joi.date().allow(null),
    EWB: Joi.string().max(50).allow(null).allow(''),
    EWB_DT: Joi.date().allow(null),
    PROMO_NO: Joi.string().max(50).allow(null).allow(''),
    SALES_CAT: Joi.string().max(50).allow(null).allow(''),
    MEMBER_CD: Joi.string().max(50).allow(null).allow(''),
    Created_By: Joi.string().max(255).allow(null).allow(''),
    location: Joi.string().max(255).allow(null).allow(''),
});

module.exports = { HyundaiCounterSaleImportSchema,_HyundaiCounterSaleImport };
