const Sequelize = require("sequelize");


const _HyundaiPartPurchaseImport = function (sequelize, DataTypes) {
  return sequelize.define(
        "Hyundai_Part_Purchase_Import",
  {
    UTD: {
      autoIncrement: true,
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    Invoice_No: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    Invoice_Date: {
      type: Sequelize.DataTypes.DATEONLY,
      allowNull: true,
    },
    Supplier: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    PO_No: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    GR_No: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    GR_Type: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    GR_Date: {
      type: Sequelize.DataTypes.DATEONLY,
      allowNull: true,
    },
    LS_OS_Type: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    HSN_CD: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    GSTNO: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    RATE_Perc: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    UQC: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    Place_of_supply: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    Part_No: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    Part_Name: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    Part_Type: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    Model: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    Source: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    RCV_QTY: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    List_Price: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    LIST_PRC_AMT: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    PCC_DC_AMT: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    AEP_DC_AMT: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    HDR_DC_AMT: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    ADD_DC_AMT: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    SPCL_DC_AMT: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    PSIR_DC_AMT: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    NDP: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    NDP_AMT: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    VSC: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    DSC: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    PSC: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    OSC: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    Material_Value: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    TCS_RT: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    TCS_AMT: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    Sales_Tax_Amt: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    Freight: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    Insurance: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    TXBL_AMOUNT: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    SGST: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    CGST: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    IGST: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    LDC: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    Total_ED_Value: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    },
    Created_By: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: true,
    },
    Created_At: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
    },
    ValidFrom: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
    },
    ValidTo: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
    },
    location: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "Hyundai_Part_Purchase_Import",
    schema: "dbo",
    timestamps: false,
  }
);
}

const Joi = require("joi");
const HyundaiPartPurchaseImportSchema = Joi.object({
  UTD: Joi.number().integer().optional(),
  Invoice_No: Joi.string().max(50).allow(null, ''),
  Invoice_Date: Joi.date().allow(null),
  Supplier: Joi.string().max(50).allow(null, ''),
  PO_No: Joi.string().max(50).allow(null, ''),
  GR_No: Joi.date().allow(null),
  GR_Type: Joi.string().max(50).allow(null, ''),
  GR_Date: Joi.date().allow(null),
  LS_OS_Type: Joi.string().max(50).allow(null, ''),
  HSN_CD: Joi.string().max(50).allow(null, ''),
  GSTNO: Joi.string().max(50).allow(null, ''),
  RATE_Perc: Joi.string().max(50).allow(null, ''),
  UQC: Joi.string().max(50).allow(null, ''),
  Place_of_supply: Joi.string().max(50).allow(null, ''),
  Part_No: Joi.string().max(50).allow(null, ''),
  Part_Name: Joi.string().max(50).allow(null, ''),
  Part_Type: Joi.string().max(50).allow(null, ''),
  Model: Joi.string().max(50).allow(null, ''),
  Source: Joi.string().max(50).allow(null, ''),
  RCV_QTY: Joi.string().max(50).allow(null, ''),
  List_Price: Joi.string().max(50).allow(null, ''),
  LIST_PRC_AMT: Joi.string().max(50).allow(null, ''),
  PCC_DC_AMT: Joi.string().max(50).allow(null, ''),
  AEP_DC_AMT: Joi.string().max(50).allow(null, ''),
  HDR_DC_AMT: Joi.string().max(50).allow(null, ''),
  ADD_DC_AMT: Joi.string().max(50).allow(null, ''),
  SPCL_DC_AMT: Joi.string().max(50).allow(null, ''),
  PSIR_DC_AMT: Joi.string().max(50).allow(null, ''),
  NDP: Joi.string().max(50).allow(null, ''),
  NDP_AMT: Joi.string().max(50).allow(null, ''),
  VSC: Joi.string().max(50).allow(null, ''),
  DSC: Joi.string().max(50).allow(null, ''),
  PSC: Joi.string().max(50).allow(null, ''),
  OSC: Joi.string().max(50).allow(null, ''),
  Material_Value: Joi.string().max(50).allow(null, ''),
  TCS_RT: Joi.string().max(50).allow(null, ''),
  TCS_AMT: Joi.string().max(50).allow(null, ''),
  Sales_Tax_Amt: Joi.string().max(50).allow(null, ''),
  Freight: Joi.string().max(50).allow(null, ''),
  Insurance: Joi.string().max(50).allow(null, ''),
  TXBL_AMOUNT: Joi.string().max(50).allow(null, ''),
  SGST: Joi.string().max(50).allow(null, ''),
  CGST: Joi.string().max(50).allow(null, ''),
  IGST: Joi.string().max(50).allow(null, ''),
  LDC: Joi.string().max(50).allow(null, ''),
  Total_ED_Value: Joi.string().max(50).allow(null, ''),
  Created_By: Joi.string().max(255).allow(null, ''),
  Created_At: Joi.date().required(),
  ValidFrom: Joi.date().required(),
  ValidTo: Joi.date().required(),
  location: Joi.string().max(255).allow(null, ''),
});

module.exports = {
  _HyundaiPartPurchaseImport,
  HyundaiPartPurchaseImportSchema,
};
``
