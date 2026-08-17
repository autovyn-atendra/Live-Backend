const Sequelize = require("sequelize");

const _RtlCostMst = function (sequelize, DataTypes) {
    return sequelize.define(
        "RtlCostMst",
        {
            TRAN_ID: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                field: "TRAN_ID",
            },

            TRAN_TYPE: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: "TRAN_TYPE",
            },

            CURR_DATE: {
                type: DataTypes.TIME,
                allowNull: true,
                field: "CURR_DATE",
            },

            GDFDI_UTD: {
                type: DataTypes.BIGINT,
                allowNull: true,
                field: "GDFDI_UTD",
            },

            EMPCODE: {
                type: DataTypes.STRING(50),
                allowNull: true,
                field: "EMPCODE",
            },

            BOOKING_ID: {
                type: DataTypes.STRING(50),
                allowNull: true,
                field: "BOOKING_ID",
            },

            BOOKING_DATE: {
                type: DataTypes.TIME,
                allowNull: true,
                field: "BOOKING_DATE",
            },

            CUST_ID: {
                type: DataTypes.STRING(50),
                allowNull: true,
                field: "CUST_ID",
            },

            CUST_NAME: {
                type: DataTypes.STRING(100),
                allowNull: true,
                field: "CUST_NAME",
            },

            CUST_MIDDLENAME: {
                type: DataTypes.STRING(100),
                allowNull: true,
                field: "CUST_MIDDLENAME",
            },

            CUST_LASTNAME: {
                type: DataTypes.STRING(100),
                allowNull: true,
                field: "CUST_LASTNAME",
            },

            CUST_MOB: {
                type: DataTypes.STRING(10),
                allowNull: true,
                field: "CUST_MOB",
            },

            PAN_NO: {
                type: DataTypes.STRING(20),
                allowNull: true,
                field: "PAN_NO",
            },

            MODL_GRP: {
                type: DataTypes.STRING(20),
                allowNull: true,
                field: "MODL_GRP",
            },

            MODL_VAR: {
                type: DataTypes.STRING(20),
                allowNull: true,
                field: "MODL_VAR",
            },

            VEH_CLR: {
                type: DataTypes.STRING(20),
                allowNull: true,
                field: "VEH_CLR",
            },

            VAR_CODE: {
                type: DataTypes.STRING(50),
                allowNull: true,
                field: "VAR_CODE",
            },

            FUEL_TYPE: {
                type: DataTypes.STRING(50),
                allowNull: true,
                field: "FUEL_TYPE",
            },

            RM: {
                type: DataTypes.STRING(20),
                allowNull: true,
                field: "RM",
            },

            DEAL_ID: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: "DEAL_ID",
            },

            ALOT_ID: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: "ALOT_ID",
            },

            CANCEL_ID: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: "CANCEL_ID",
            },

            REFUND_ID: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: "REFUND_ID",
            },
            LOC_CODE: {
                type: DataTypes.STRING(20),
                allowNull: true,
                field: "LOC_CODE",
            },

            GD_LOC: {
                type: DataTypes.STRING(20),
                allowNull: true,
                field: "GD_LOC",
            },
            PRICE_LIST_MODL_VAR: {
                type: DataTypes.STRING(50),
                allowNull: true,
                field: "PRICE_LIST_MODL_VAR",
            },
            CUST_TYPE: {
                type: DataTypes.STRING(50),
                allowNull: true,
                field: "CUST_TYPE",
            },

            EXSHOWROOM_PRICE: {
                type: DataTypes.DECIMAL(19, 2),
                allowNull: true,
                field: "EXSHOWROOM_PRICE",
            },

            CHASSIS_NO: {
                type: DataTypes.STRING(50),
                allowNull: true,
                field: "CHASSIS_NO",
            },

            VIN: {
                type: DataTypes.STRING(100),
                allowNull: true,
                field: "VIN",
            },

            ENGINE_NO: {
                type: DataTypes.STRING(50),
                allowNull: true,
                field: "ENGINE_NO",
            },

            KEY_NO: {
                type: DataTypes.STRING(50),
                allowNull: true,
                field: "KEY_NO",
            },

            BILL_DATE: {
                type: DataTypes.TIME,
                allowNull: true,
                field: "BILL_DATE",
            },

            VEH_AGEING: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: "VEH_AGEING",
            },

            ONROAD_PRICE: {
                type: DataTypes.DECIMAL(19, 2),
                allowNull: true,
                field: "ONROAD_PRICE",
            },

            FIN_TYPE: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: "FIN_TYPE",
            },

            FIN_CODE: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: "FIN_CODE",
            },

            LOAN_TYPE: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: "LOAN_TYPE",
            },

            EXCH: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: "EXCH",
            },

            OLD_MODL: {
                type: DataTypes.STRING(200),
                allowNull: true,
                field: "OLD_MODL",
            },

            OLD_REGNO: {
                type: DataTypes.STRING(50),
                allowNull: true,
                field: "OLD_REGNO",
            },

            OLD_YEAR: {
                type: DataTypes.STRING(50),
                allowNull: true,
                field: "OLD_YEAR",
            },

            OLD_PRICE: {
                type: DataTypes.DECIMAL(19, 2),
                allowNull: true,
                field: "OLD_PRICE",
            },

            APPROVED_AMT: {
                type: DataTypes.DECIMAL(19, 2),
                allowNull: true,
                field: "APPROVED_AMT",
            },

            RELATION: {
                type: DataTypes.STRING(100),
                allowNull: true,
                field: "RELATION",
            },

            MANUFACTURE_YEAR: {
                type: DataTypes.STRING(20),
                allowNull: true,
                field: "MANUFACTURE_YEAR",
            },

            CONSUMER: {
                type: DataTypes.DECIMAL(19, 2),
                allowNull: true,
                field: "CONSUMER",
            },

            Rips: {
                type: DataTypes.DECIMAL(19, 2),
                allowNull: true,
                field: "Rips",
            },

            CORPORATE_YN: {
                type: DataTypes.STRING(20),
                allowNull: true,
                field: "CORPORATE_YN",
            },

            CORPORATE_TYPE: {
                type: DataTypes.STRING(100),
                allowNull: true,
                field: "CORPORATE_TYPE",
            },

            CORPORATE: {
                type: DataTypes.DECIMAL(19, 2),
                allowNull: true,
                field: "CORPORATE",
            },

            EXCHANGE_YN: {
                type: DataTypes.STRING(20),
                allowNull: true,
                field: "EXCHANGE_YN",
            },

            EXCHANGE_TYPE: {
                type: DataTypes.STRING(100),
                allowNull: true,
                field: "EXCHANGE_TYPE",
            },


            EXCHANGE: {
                type: DataTypes.DECIMAL(19, 2),
                allowNull: true,
                field: "EXCHANGE",
            },

            OFFER_1: {
                type: DataTypes.DECIMAL(19, 2),
                allowNull: true,
                field: "OFFER_1",
            },

            OFFER_2: {
                type: DataTypes.DECIMAL(19, 2),
                allowNull: true,
                field: "OFFER_2",
            },

            OFFER_3: {
                type: DataTypes.DECIMAL(19, 2),
                allowNull: true,
                field: "OFFER_3",
            },

            OFFER_4: {
                type: DataTypes.DECIMAL(19, 2),
                allowNull: true,
                field: "OFFER_4",
            },


            OFFER_5: {
                type: DataTypes.DECIMAL(19, 2),
                allowNull: true,
                field: "OFFER_5",
            },


            ADNL_DISCOUNT: {
                type: DataTypes.DECIMAL(19, 2),
                allowNull: true,
                field: "ADNL_DISCOUNT",
            },

            TOTAL_ADNL_DISCOUNT: {
                type: DataTypes.DECIMAL(19, 2),
                allowNull: true,
                field: "TOTAL_ADNL_DISCOUNT",
            },

            REMARK: {
                type: DataTypes.STRING(100),
                allowNull: true,
                field: "REMARK",
            },

            OTHER_REASON: {
                type: DataTypes.STRING(300),
                allowNull: true,
                field: "OTHER_REASON",
            },

            IS_GD: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: "IS_GD",
            },

            REAPPR_EMPCODE: {
                type: DataTypes.STRING(100),
                allowNull: true,
                field: "REAPPR_EMPCODE",
            },

            REAPPR_REMARK: {
                type: DataTypes.STRING(300),
                allowNull: true,
                field: "REAPPR_REMARK",
            },

            DOCUMENT: {
                type: DataTypes.TEXT, // VARCHAR(MAX)
                allowNull: true,
                field: "DOCUMENT",
            },

            // -------- CHASSIS ALLOTMENT --------

            CHAS_NO: {
                type: DataTypes.STRING(50),
                allowNull: true,
                field: "CHAS_NO",
            },

            CHAS_ID: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: "CHAS_ID",
            },

            ALLOTMENT_REM: {
                type: DataTypes.STRING(200),
                allowNull: true,
                field: "ALLOTMENT_REM",
            },

            DE_ALOT_DMS_CODE: {
                type: DataTypes.STRING(20),
                allowNull: true,
                field: "DE_ALOT_DMS_CODE",
            },

            DEALOT_REMARK: {
                type: DataTypes.STRING(300),
                allowNull: true,
                field: "DEALOT_REMARK",
            },

            DEALOT_DATE: {
                type: DataTypes.TIME,
                allowNull: true,
                field: "DEALOT_DATE",
            },

            CANCEL_REMARK: {
                type: DataTypes.STRING(300),
                allowNull: true,
                field: "CANCEL_REMARK",
            },

            CANCEL_DATE: {
                type: DataTypes.TIME,
                allowNull: true,
                field: "CANCEL_DATE",
            },

            DMS_CODE: {
                type: DataTypes.STRING(20),
                allowNull: true,
                field: "DMS_CODE",
            },

            BOOKING_AMT: {
                type: DataTypes.DECIMAL(19, 2),
                allowNull: true,
                field: "BOOKING_AMT",
            },

            CANCEL_APPROVED_AMT: {
                type: DataTypes.DECIMAL(19, 2),
                allowNull: true,
                field: "CANCEL_APPROVED_AMT",
            },

            REFUND_REF_ID: {
                type: DataTypes.STRING(50),
                allowNull: true,
                field: "REFUND_REF_ID",
            },

            REFUND_REMARK_DSE: {
                type: DataTypes.STRING(150),
                allowNull: true,
                field: "REFUND_REMARK_DSE",
            },

            BOOKING_AMT_ACTUAL: {
                type: DataTypes.DECIMAL(19, 2),
                allowNull: true,
                field: "BOOKING_AMT_ACTUAL",
            },

            ADNL_AMT: {
                type: DataTypes.DECIMAL(19, 2),
                allowNull: true,
                field: "ADNL_AMT",
            },

            CANCEL_CHARGES: {
                type: DataTypes.DECIMAL(19, 2),
                allowNull: true,
                field: "CANCEL_CHARGES",
            },

            FINAL_AMT: {
                type: DataTypes.DECIMAL(19, 2),
                allowNull: true,
                field: "FINAL_AMT",
            },

            IS_REAPP: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: "IS_REAPP",
            },

            EXPORT_TYPE: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: "EXPORT_TYPE",
            },

            APPR_1_CODE: {
                type: DataTypes.STRING(100),
                allowNull: true,
                field: "APPR_1_CODE",
            },

            APPR_1_STAT: {
                type: DataTypes.TINYINT,
                allowNull: true,
                field: "APPR_1_STAT",
            },

            APPR_1_REM: {
                type: DataTypes.STRING(300),
                allowNull: true,
                field: "APPR_1_REM",
            },

            APPR_1_DATE: {
                type: DataTypes.TIME,
                allowNull: true,
                field: "APPR_1_DATE",
            },

            APPR_2_CODE: {
                type: DataTypes.STRING(100),
                allowNull: true,
                field: "APPR_2_CODE",
            },

            APPR_2_STAT: {
                type: DataTypes.TINYINT,
                allowNull: true,
                field: "APPR_2_STAT",
            },

            APPR_2_REM: {
                type: DataTypes.STRING(300),
                allowNull: true,
                field: "APPR_2_REM",
            },

            APPR_2_DATE: {
                type: DataTypes.TIME,
                allowNull: true,
                field: "APPR_2_DATE",
            },

            APPR_3_CODE: {
                type: DataTypes.STRING(100),
                allowNull: true,
                field: "APPR_3_CODE",
            },

            APPR_3_STAT: {
                type: DataTypes.TINYINT,
                allowNull: true,
                field: "APPR_3_STAT",
            },

            APPR_3_REM: {
                type: DataTypes.STRING(300),
                allowNull: true,
                field: "APPR_3_REM",
            },

            APPR_3_DATE: {
                type: DataTypes.TIME,
                allowNull: true,
                field: "APPR_3_DATE",
            },

            Fin_Appr: {
                type: DataTypes.TINYINT,
                allowNull: true,
                field: "Fin_Appr",
            },

            ACCOUNT_CODE: {
                type: DataTypes.STRING(100),
                allowNull: true,
                field: "ACCOUNT_CODE",
            },

            ACCOUNT_STAT: {
                type: DataTypes.TINYINT,
                allowNull: true,
                field: "ACCOUNT_STAT",
            },

            ACCOUNT_REM: {
                type: DataTypes.STRING(300),
                allowNull: true,
                field: "ACCOUNT_REM",
            },

            ACCOUNT_DATE: {
                type: DataTypes.DATEONLY,
                allowNull: true,
                field: "ACCOUNT_DATE",
            },

            NEXT_LEVEL_APPR_CODE: {
                type: DataTypes.STRING(100),
                allowNull: true,
                field: "NEXT_LEVEL_APPR_CODE",
            },

            CREATED_BY: {
                type: DataTypes.STRING(100),
                allowNull: true,
                field: "CREATED_BY",
            },

            AGEING_IN_DAYS: {
                type: DataTypes.STRING(150),
                allowNull: true,
                field: "AGEING_IN_DAYS",
            },
            INV_NO: {
                type: DataTypes.STRING(100),
                allowNull: true,
                field: "INV_NO",
            },

            HSN: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: "HSN",
            },

            LEDG_CODE: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: "LEDG_CODE",
            },

            LEDG_CUST_NAME: {
                type: DataTypes.STRING(200),
                allowNull: true,
                field: "LEDG_CUST_NAME",
            },

            LEDG_PLACE_OF_SUPPLY: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: "LEDG_PLACE_OF_SUPPLY",
            },

            LEDG_GST_NO: {
                type: DataTypes.STRING(100),
                allowNull: true,
                field: "LEDG_GST_NO",
            },

            PERMANENT_ADDR1: {
                type: DataTypes.STRING(300),
                allowNull: true,
                field: "PERMANENT_ADDR1",
            },

            PERMANENT_ADDR2: {
                type: DataTypes.STRING(300),
                allowNull: true,
                field: "PERMANENT_ADDR2",
            },

            PERMANENT_ADDR3: {
                type: DataTypes.STRING(300),
                allowNull: true,
                field: "PERMANENT_ADDR3",
            },

            CUST_PLACE_OF_SUPPLY: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: "CUST_PLACE_OF_SUPPLY",
            },

            CUST_GST_NO: {
                type: DataTypes.STRING(100),
                allowNull: true,
                field: "CUST_GST_NO",
            },

            SHIPPING_ADDR1: {
                type: DataTypes.STRING(300),
                allowNull: true,
                field: "SHIPPING_ADDR1",
            },

            SHIPPING_ADDR2: {
                type: DataTypes.STRING(300),
                allowNull: true,
                field: "SHIPPING_ADDR2",
            },

            SHIPPING_ADDR3: {
                type: DataTypes.STRING(300),
                allowNull: true,
                field: "SHIPPING_ADDR3",
            },

            BASIC_PRICE: {
                type: DataTypes.DECIMAL(19, 2),
                allowNull: true,
                field: "BASIC_PRICE",
            },

            DISCOUNT_EXC_GST: {
                type: DataTypes.DECIMAL(19, 2),
                allowNull: true,
                field: "DISCOUNT_EXC_GST",
            },

            TAXABLE_VALUE: {
                type: DataTypes.DECIMAL(19, 2),
                allowNull: true,
                field: "TAXABLE_VALUE",
            },

            IGST_Amt: {
                type: DataTypes.DECIMAL(19, 2),
                allowNull: true,
                field: "IGST_Amt",
            },

            CGST_Amt: {
                type: DataTypes.DECIMAL(19, 2),
                allowNull: true,
                field: "CGST_Amt",
            },

            SGST_Amt: {
                type: DataTypes.DECIMAL(19, 2),
                allowNull: true,
                field: "SGST_Amt",
            },

            TCS_PERC: {
                type: DataTypes.DECIMAL(19, 2),
                allowNull: true,
                field: "TCS_PERC",
            },

            Total_Amt: {
                type: DataTypes.DECIMAL(19, 2),
                allowNull: true,
                field: "Total_Amt",
            },

            DLV_CHALLAN_DATE: {
                type: DataTypes.TIME,
                allowNull: true,
                field: "DLV_CHALLAN_DATE",
            },

            FINAL_INVOICE_DATE: {
                type: DataTypes.TIME,
                allowNull: true,
                field: "FINAL_INVOICE_DATE",
            },
            GST_PERCT: {
                type: DataTypes.DECIMAL(19, 2),
                allowNull: true,
                field: "GST_PERCT",
            },
            SHIP_CUST_NAME: {
                type: DataTypes.STRING(100),
                allowNull: true,
                field: "SHIP_CUST_NAME",
            },
            SHIP_CUST_MOB: {
                type: DataTypes.STRING(20),
                allowNull: true,
                field: "SHIP_CUST_MOB",
            },
            TCS_AMT: {
                type: DataTypes.DECIMAL(19, 2),
                allowNull: true,
                field: "TCS_AMT",
            },
            LOGIN_LOC_CODE: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: "LOGIN_LOC_CODE",
            },
            SEQ_NO: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: "SEQ_NO",
            },
            ALLOT_LOC_CODE: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: "ALLOT_LOC_CODE",
            },
            LEDG_PAN_NO: {
                type: DataTypes.STRING(20),
                allowNull: true,
                field: "LEDG_PAN_NO",
            },
            GST_TYPE: {
                type: DataTypes.STRING(10),
                allowNull: true,
                field: "GST_TYPE",
            },
            ERP_DSE: {
                type: DataTypes.STRING(200),
                allowNull: true,
                field: "ERP_DSE",
            },
            ERP_TL: {
                type: DataTypes.STRING(200),
                allowNull: true,
                field: "ERP_TL",
            },
            DMS_DSE: {
                type: DataTypes.STRING(200),
                allowNull: true,
                field: "DMS_DSE",
            },
            DMS_TL: {
                type: DataTypes.STRING(200),
                allowNull: true,
                field: "DMS_TL",
            },
            BOOKING_SOURCE: {
                type: DataTypes.STRING(200),
                allowNull: true,
                field: "BOOKING_SOURCE",
            },
            CARTAL_DISCOUNT: {
                type: DataTypes.DECIMAL(19, 2),
                allowNull: true,
                field: "CARTAL_DISCOUNT",
            },
            DELV_CUST_ID: {
                type: DataTypes.STRING(50),
                allowNull: true,
                field: "DELV_CUST_ID",
            },
            IS_MANUAL: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: "IS_MANUAL",
            },
            CANCEL_BY: {
                type: DataTypes.STRING(100),
                allowNull: true,
                field: "CANCEL_BY",
            },
            USER_CODE: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: "USER_CODE",
            },
            LOAN_AMOUNT: {
                type: DataTypes.DECIMAL(19, 2),
                allowNull: true,
                field: "LOAN_AMOUNT",
            },
            LOAN_DISBURSEMENT_AMOUNT: {
                type: DataTypes.DECIMAL(19, 2),
                allowNull: true,
                field: "LOAN_DISBURSEMENT_AMOUNT",
            },
            TOTAL_DEBIT_BAL: {
                type: DataTypes.DECIMAL(19, 2),
                allowNull: true,
                field: "TOTAL_DEBIT_BAL",
            },
            TOTAL_LEDG_BAL: {
                type: DataTypes.DECIMAL(19, 2),
                allowNull: true,
                field: "TOTAL_LEDG_BAL",
            },
            TOTAL_RECEIVED_BAL: {
                type: DataTypes.DECIMAL(19, 2),
                allowNull: true,
                field: "TOTAL_RECEIVED_BAL",
            },
            REFUND_REMARK_DSE1: {
                type: DataTypes.STRING(150),
                allowNull: true,
                field: "REFUND_REMARK_DSE1",
            },
            IS_SEZ_SUPPLY: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: "IS_SEZ_SUPPLY",
            },
            MODIFIED_LEDG_BAL: {
                type: DataTypes.DECIMAL(19, 2),
                allowNull: true,
                field: "MODIFIED_LEDG_BAL",
            },
        },
        {
            sequelize,
            tableName: "RTL_COST_MST",
            schema: "dbo",
            timestamps: false,
            indexes: [
                {
                    name: "PK_RTL_COST_MST",
                    unique: true,
                    fields: [{ name: "TRAN_ID" }],
                },
            ],
        }
    );
};

const Joi = require('joi')
const RtlCostMstSchema = Joi.object({
    TRAN_ID: Joi.number().integer().optional().allow(null, ''),
    TRAN_TYPE: Joi.number().integer().required().allow(null, ''),
    CURR_DATE: Joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}( \d{2}:\d{2}:\d{2})?$/) // YYYY-MM-DD or YYYY-MM-DD HH:mm:ss
        .optional()
        .allow(null, ''),
    GDFDI_UTD: Joi.number().optional().allow(null, ''),
    EMPCODE: Joi.string().max(50).optional().allow(null, ''),
    BOOKING_ID: Joi.string().max(50).optional().allow(null, ''),
    BOOKING_DATE: Joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}( \d{2}:\d{2}:\d{2})?$/)
        .optional()
        .allow(null, ''),
    CUST_ID: Joi.string().max(50).optional().allow(null, ''),
    CUST_NAME: Joi.string().max(100).optional().allow(null, ''),
    CUST_MIDDLENAME: Joi.string().max(100).optional().allow(null, ''),
    CUST_LASTNAME: Joi.string().max(100).optional().allow(null, ''),
    CUST_MOB: Joi.string().length(10).optional().allow(null, ''),
    PAN_NO: Joi.string().max(20).optional().allow(null, ''),
    MODL_GRP: Joi.string().max(20).optional().allow(null, ''),
    MODL_VAR: Joi.string().max(20).optional().allow(null, ''),
    VEH_CLR: Joi.string().max(20).optional().allow(null, ''),
    VAR_CODE: Joi.string().max(50).optional().allow(null, ''),
    FUEL_TYPE: Joi.string().max(50).optional().allow(null, ''),
    RM: Joi.string().max(20).optional().allow(null, ''),
    DEAL_ID: Joi.number().integer().optional().allow(null, ''),
    ALOT_ID: Joi.number().integer().optional().allow(null, ''),
    CANCEL_ID: Joi.number().integer().optional().allow(null, ''),
    REFUND_ID: Joi.number().integer().optional().allow(null, ''),
    LOC_CODE: Joi.string().max(20).optional().allow(null, ''),
    GD_LOC: Joi.string().max(20).optional().allow(null, ''),
    PRICE_LIST_MODL_VAR: Joi.string().max(50).optional().allow(null, ''),
    CUST_TYPE: Joi.string().max(50).optional().allow(null, ''),
    EXSHOWROOM_PRICE: Joi.number().precision(2).optional().allow(null, ''),
    CHASSIS_NO: Joi.string().max(50).optional().allow(null, ''),
    VIN: Joi.string().max(100).optional().allow(null, ''),
    ENGINE_NO: Joi.string().max(50).optional().allow(null, ''),
    KEY_NO: Joi.string().max(50).optional().allow(null, ''),
    BILL_DATE: Joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}( \d{2}:\d{2}:\d{2})?$/)
        .optional()
        .allow(null, ''),
    VEH_AGEING: Joi.number().integer().optional().allow(null, ''),
    ONROAD_PRICE: Joi.number().precision(2).optional().allow(null, ''),
    FIN_TYPE: Joi.number().integer().optional().allow(null, ''),
    FIN_CODE: Joi.number().integer().optional().allow(null, ''),
    LOAN_TYPE: Joi.number().integer().optional().allow(null, ''),
    EXCH: Joi.number().integer().optional().allow(null, ''),
    OLD_MODL: Joi.string().max(200).optional().allow(null, ''),
    OLD_REGNO: Joi.string().max(50).optional().allow(null, ''),
    OLD_YEAR: Joi.string().max(50).optional().allow(null, ''),
    OLD_PRICE: Joi.number().precision(2).optional().allow(null, ''),
    APPROVED_AMT: Joi.number().precision(2).optional().allow(null, ''),
    RELATION: Joi.string().max(100).optional().allow(null, ''),
    MANUFACTURE_YEAR: Joi.string().max(20).optional().allow(null, ''),
    CONSUMER: Joi.number().precision(2).optional().allow(null, ''),
    Rips: Joi.number().precision(2).optional().allow(null, ''),
    CORPORATE_YN: Joi.string().max(20).optional().allow(null, ''),
    CORPORATE_TYPE: Joi.string().max(100).optional().allow(null, ''),
    CORPORATE: Joi.number().precision(2).optional().allow(null, ''),
    EXCHANGE_YN: Joi.string().max(20).optional().allow(null, ''),
    EXCHANGE_TYPE: Joi.string().max(100).optional().allow(null, ''),
    EXCHANGE: Joi.number().precision(2).optional().allow(null, ''),
    OFFER_1: Joi.number().precision(2).optional().allow(null, ''),
    OFFER_2: Joi.number().precision(2).optional().allow(null, ''),
    OFFER_3: Joi.number().precision(2).optional().allow(null, ''),
    OFFER_4: Joi.number().precision(2).optional().allow(null, ''),
    OFFER_5: Joi.number().precision(2).optional().allow(null, ''),
    ADNL_DISCOUNT: Joi.number().precision(2).optional().allow(null, ''),
    TOTAL_ADNL_DISCOUNT: Joi.number().precision(2).optional().allow(null, ''),
    REMARK: Joi.string().max(100).optional().allow(null, ''),
    OTHER_REASON: Joi.string().max(300).optional().allow(null, ''),
    IS_GD: Joi.number().integer().optional().allow(null, ''),
    REAPPR_EMPCODE: Joi.string().max(100).optional().allow(null, ''),
    REAPPR_REMARK: Joi.string().max(300).optional().allow(null, ''),
    DOCUMENT: Joi.string().optional().allow(null, ''),

    // Chassis allotment
    CHAS_NO: Joi.string().max(50).optional().allow(null, ''),
    CHAS_ID: Joi.number().integer().optional().allow(null, ''),
    ALLOTMENT_REM: Joi.string().max(200).optional().allow(null, ''),
    DE_ALOT_DMS_CODE: Joi.string().max(20).optional().allow(null, ''),
    DEALOT_REMARK: Joi.string().max(300).optional().allow(null, ''),
    DEALOT_DATE: Joi.date().optional().allow(null, ''),
    CANCEL_REMARK: Joi.string().max(300).optional().allow(null, ''),
    CANCEL_DATE: Joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}( \d{2}:\d{2}:\d{2})?$/)
        .optional()
        .allow(null, ''),
    DMS_CODE: Joi.string().max(20).optional().allow(null, ''),
    BOOKING_AMT: Joi.number().precision(2).optional().allow(null, ''),
    CANCEL_APPROVED_AMT: Joi.number().precision(2).optional().allow(null, ''),
    REFUND_REMARK_DSE: Joi.string().max(150).optional().allow(null, ''),
    REFUND_REF_ID: Joi.string().max(50).optional().allow(null, ''),
    BOOKING_AMT_ACTUAL: Joi.number().precision(2).optional().allow(null, ''),
    ADNL_AMT: Joi.number().precision(2).optional().allow(null, ''),
    CANCEL_CHARGES: Joi.number().precision(2).optional().allow(null, ''),
    FINAL_AMT: Joi.number().precision(2).optional().allow(null, ''),
    IS_REAPP: Joi.number().integer().optional().allow(null, ''),
    EXPORT_TYPE: Joi.number().integer().optional().allow(null, ''),
    APPR_1_CODE: Joi.string().max(100).optional().allow(null, ''),
    APPR_1_STAT: Joi.number().integer().optional().allow(null, ''),
    APPR_1_REM: Joi.string().max(300).optional().allow(null, ''),
    APPR_1_DATE: Joi.date().optional().allow(null, ''),
    APPR_2_CODE: Joi.string().max(100).optional().allow(null, ''),
    APPR_2_STAT: Joi.number().integer().optional().allow(null, ''),
    APPR_2_REM: Joi.string().max(300).optional().allow(null, ''),
    APPR_2_DATE: Joi.date().optional().allow(null, ''),
    APPR_3_CODE: Joi.string().max(100).optional().allow(null, ''),
    APPR_3_STAT: Joi.number().integer().optional().allow(null, ''),
    APPR_3_REM: Joi.string().max(300).optional().allow(null, ''),
    APPR_3_DATE: Joi.date().optional().allow(null, ''),
    Fin_Appr: Joi.number().integer().optional().allow(null, ''),
    ACCOUNT_CODE: Joi.string().max(100).optional().allow(null, ''),
    ACCOUNT_STAT: Joi.number().integer().optional().allow(null, ''),
    ACCOUNT_REM: Joi.string().max(300).optional().allow(null, ''),
    ACCOUNT_DATE: Joi.date().optional().allow(null, ''),
    NEXT_LEVEL_APPR_CODE: Joi.string().max(100).optional().allow(null, ''),
    CREATED_BY: Joi.string().max(100).optional().allow(null, ''),
    AGEING_IN_DAYS: Joi.string().max(150).optional().allow(null, ''),
    INV_NO: Joi.string().max(100).optional().allow(null, ''),
    HSN: Joi.number().integer().optional().allow(null, ''),
    LEDG_CODE: Joi.number().integer().optional().allow(null, ''),
    LEDG_CUST_NAME: Joi.string().max(200).optional().allow(null, ''),
    LEDG_PLACE_OF_SUPPLY: Joi.number().integer().optional().allow(null, ''),
    LEDG_GST_NO: Joi.string().max(100).optional().allow(null, ''),
    PERMANENT_ADDR1: Joi.string().max(300).optional().allow(null, ''),
    PERMANENT_ADDR2: Joi.string().max(300).optional().allow(null, ''),
    PERMANENT_ADDR3: Joi.string().max(300).optional().allow(null, ''),
    CUST_PLACE_OF_SUPPLY: Joi.number().integer().optional().allow(null, ''),
    CUST_GST_NO: Joi.string().max(100).optional().allow(null, ''),
    SHIPPING_ADDR1: Joi.string().max(300).optional().allow(null, ''),
    SHIPPING_ADDR2: Joi.string().max(300).optional().allow(null, ''),
    SHIPPING_ADDR3: Joi.string().max(300).optional().allow(null, ''),
    BASIC_PRICE: Joi.number().precision(2).optional().allow(null, ''),
    DISCOUNT_EXC_GST: Joi.number().precision(2).optional().allow(null, ''),
    TAXABLE_VALUE: Joi.number().precision(2).optional().allow(null, ''),
    IGST_Amt: Joi.number().precision(2).optional().allow(null, ''),
    CGST_Amt: Joi.number().precision(2).optional().allow(null, ''),
    SGST_Amt: Joi.number().precision(2).optional().allow(null, ''),
    TCS_PERC: Joi.number().precision(2).optional().allow(null, ''),
    Total_Amt: Joi.number().precision(2).optional().allow(null, ''),
    DLV_CHALLAN_DATE: Joi.date().optional().allow(null, ''),
    FINAL_INVOICE_DATE: Joi.date().optional().allow(null, ''),
    GST_PERCT: Joi.number().precision(2).optional().allow(null, ''),
    SHIP_CUST_NAME: Joi.string().max(100).optional().allow(null, ''),
    SHIP_CUST_MOB: Joi.string().max(20).optional().allow(null, ''),
    TCS_AMT: Joi.number().precision(2).optional().allow(null, ''),
    LOGIN_LOC_CODE: Joi.number().integer().optional().allow(null, ''),
    SEQ_NO: Joi.number().integer().optional().allow(null, ''),
    ALLOT_LOC_CODE: Joi.number().integer().optional().allow(null, ''),
    LEDG_PAN_NO: Joi.string().max(20).optional().allow(null, ''),
    GST_TYPE: Joi.string().max(10).optional().allow(null, ''),
    ERP_DSE: Joi.string().max(200).optional().allow(null, ''),
    ERP_TL: Joi.string().max(200).optional().allow(null, ''),
    DMS_DSE: Joi.string().max(200).optional().allow(null, ''),
    DMS_TL: Joi.string().max(200).optional().allow(null, ''),
    BOOKING_SOURCE: Joi.string().max(200).optional().allow(null, ''),
    CARTAL_DISCOUNT: Joi.number().precision(2).optional().allow(null, ''),
    DELV_CUST_ID: Joi.string().max(50).optional().allow(null, ''),
    IS_MANUAL: Joi.number().integer().optional().allow(null, ''),
    CANCEL_BY: Joi.string().max(100).optional().allow(null, ''),
    USER_CODE: Joi.number().integer().optional().allow(null, ''),
    LOAN_AMOUNT: Joi.number().precision(2).optional().allow(null, ''),
    LOAN_DISBURSEMENT_AMOUNT: Joi.number().precision(2).optional().allow(null, ''),
    TOTAL_DEBIT_BAL: Joi.number().precision(2).optional().allow(null, ''),
    TOTAL_LEDG_BAL: Joi.number().precision(2).optional().allow(null, ''),
    TOTAL_RECEIVED_BAL: Joi.number().precision(2).optional().allow(null, ''),
    REFUND_REMARK_DSE1: Joi.string().max(150).optional().allow(null, ''),
    IS_SEZ_SUPPLY: Joi.number().integer().optional().allow(null, ''),
    MODIFIED_LEDG_BAL: Joi.number().precision(2).optional().allow(null, ''),
});

module.exports = { _RtlCostMst, RtlCostMstSchema };
