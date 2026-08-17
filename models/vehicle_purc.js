const Sequelize = require("sequelize");

const _HyundaiVehPurcImport = function (sequelize, DataTypes) {
  return sequelize.define(
    "Hyundai_Veh_Purc_Import",
    {
      UTD: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      Main_Dealer: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Dealer: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      HMI_Invoice_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      HMI_Invoice_No: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Excise_Invoice_No: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Order_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      Order_No: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Model: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Variant: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Color: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Vin_No: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      FSC: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Variant_Code: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Engine_No: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Financier_Name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Departure_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      Lot_Number: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Transporter_Name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Transporter_Vehicle_No: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Basic_Price: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Freight_Insurance: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Total_Invoice_value: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      IGST_Perc: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      IGST: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      SGST_Perc: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      SGST: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      CGST_Perc: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      CGST: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Comp_Cess_Perc: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Comp_Cess: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      TCS_Perc: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      TCS_Value: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      HMI_Invoice_Amount: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      HSN_Code: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Emission_Type: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Quantity: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      GRN_No: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      GRN_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      Sale_Tax: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      FOB_Key: {
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
      tableName: "Hyundai_Veh_Purc_Import",
      schema: "dbo",
      timestamps: false,
      indexes: [
        {
          name: "PK_Hyundai_Veh_Purc_Import",
          unique: true,
          fields: [{ name: "UTD" }],
        },
      ],
    }
  );
};

const Joi = require("joi");

const HyundaiVehPurcImportSchema = Joi.object({
  UTD: Joi.number().integer().optional(),
  Main_Dealer: Joi.string().max(50).allow(null).allow(""),
  Dealer: Joi.string().max(50).allow(null).allow(""),
  HMI_Invoice_Date: Joi.date().allow(null),
  HMI_Invoice_No: Joi.string().max(50).allow(null).allow(""),
  Excise_Invoice_No: Joi.string().max(50).allow(null).allow(""),
  Order_Date: Joi.date().allow(null),
  Order_No: Joi.string().max(50).allow(null).allow(""),
  Model: Joi.string().max(50).allow(null).allow(""),
  Variant: Joi.string().max(50).allow(null).allow(""),
  Color: Joi.string().max(50).allow(null).allow(""),
  Vin_No: Joi.string().max(50).allow(null).allow(""),
  FSC: Joi.string().max(50).allow(null).allow(""),
  Variant_Code: Joi.string().max(50).allow(null).allow(""),
  Engine_No: Joi.string().max(50).allow(null).allow(""),
  Financier_Name: Joi.string().max(50).allow(null).allow(""),
  Departure_Date: Joi.date().allow(null),
  Lot_Number: Joi.string().max(50).allow(null).allow(""),
  Transporter_Name: Joi.string().max(50).allow(null).allow(""),
  Transporter_Vehicle_No: Joi.string().max(50).allow(null).allow(""),
  Basic_Price: Joi.string().max(50).allow(null).allow(""),
  Freight_Insurance: Joi.string().max(50).allow(null).allow(""),
  Total_Invoice_value: Joi.string().max(50).allow(null).allow(""),
  IGST_Perc: Joi.string().max(50).allow(null).allow(""),
  IGST: Joi.string().max(50).allow(null).allow(""),
  SGST_Perc: Joi.string().max(50).allow(null).allow(""),
  SGST: Joi.string().max(50).allow(null).allow(""),
  CGST_Perc: Joi.string().max(50).allow(null).allow(""),
  CGST: Joi.string().max(50).allow(null).allow(""),
  Comp_Cess_Perc: Joi.string().max(50).allow(null).allow(""),
  Comp_Cess: Joi.string().max(50).allow(null).allow(""),
  TCS_Perc: Joi.string().max(50).allow(null).allow(""),
  TCS_Value: Joi.string().max(50).allow(null).allow(""),
  HMI_Invoice_Amount: Joi.string().max(50).allow(null).allow(""),
  HSN_Code: Joi.string().max(50).allow(null).allow(""),
  Emission_Type: Joi.string().max(50).allow(null).allow(""),
  Quantity: Joi.string().max(50).allow(null).allow(""),
  GRN_No: Joi.string().max(50).allow(null).allow(""),
  GRN_Date: Joi.date().allow(null),
  Sale_Tax: Joi.string().max(50).allow(null).allow(""),
  FOB_Key: Joi.string().max(50).allow(null).allow(""),
  Created_By: Joi.string().max(255).allow(null).allow(""),
    location: Joi.string().max(255).allow(null).allow(""),
});

module.exports = { HyundaiVehPurcImportSchema, _HyundaiVehPurcImport };
