const Sequelize = require("sequelize");
const Joi = require("joi");

const _HyundaiDiscountListImport = function (sequelize, DataTypes) {
  return sequelize.define(
    "Hyundai_Discount_List_Import",
    {
      UTD: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      Model: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      Fuel: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },

      Variant: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      // Percentage (18%, 28%, etc.)
      Total_Tax_Percent: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },

      // MONEY columns (mapped as DECIMAL)
      Dealer_Purchase_Cost: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },

      GST: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },

      GST_Comp_Cess: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },

      Total_Tax_Credit: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },

      Dealer_Booking_Price: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },

      Total_Dealer_Margin: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },

      Base_Price_To_Customer: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },

      CGST: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },

      SGST: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },

      GST_Comp_Cess_2: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },

      Total_Tax: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },

      Ex_SR_Price: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },

      Scheme: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },

      HMIL_Part: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },

      Dealer_Part: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },

      Exchange_Discount: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },

      Scrap_Discount: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },

      Corporate_Discount: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },

      Government_Discount: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },

      Final_Ex_Showroom: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },

      Max_Discount: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },

      Export_Type: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      Created_By: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      location: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      Created_At: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      Valid_From: {
  type: DataTypes.DATE,
  allowNull: true,
},

Valid_To: {
  type: DataTypes.DATE,
  allowNull: true,
},

    },
    {
      tableName: "Hyundai_Discount_List_Import",
      schema: "dbo",
      timestamps: false,
    }
  );
};

const Hyundai_Discount_List_Import_Schema = Joi.object({
  Model: Joi.string().allow(null, ""),
  Fuel: Joi.string().allow(null, ""),
  Variant: Joi.string().allow(null, ""),

  Total_Tax_Percent: Joi.number().precision(2).allow(null),

  Dealer_Purchase_Cost: Joi.number().allow(null),
  GST: Joi.number().allow(null),
  GST_Comp_Cess: Joi.number().allow(null),
  Total_Tax_Credit: Joi.number().allow(null),

  Dealer_Booking_Price: Joi.number().allow(null),
  Total_Dealer_Margin: Joi.number().allow(null),
  Base_Price_To_Customer: Joi.number().allow(null),

  CGST: Joi.number().allow(null),
  SGST: Joi.number().allow(null),
  GST_Comp_Cess_2: Joi.number().allow(null),

  Total_Tax: Joi.number().allow(null),
  Ex_SR_Price: Joi.number().allow(null),

  Scheme: Joi.number().allow(null),
  HMIL_Part: Joi.number().allow(null),
  Dealer_Part: Joi.number().allow(null),

  Exchange_Discount: Joi.number().allow(null),
  Scrap_Discount: Joi.number().allow(null),
  Corporate_Discount: Joi.number().allow(null),
  Government_Discount: Joi.number().allow(null),

  Final_Ex_Showroom: Joi.number().allow(null),
  Max_Discount: Joi.number().allow(null),

  Export_Type: Joi.number().allow(null),
 Created_At: Joi.date().allow(null),
  

  Created_By: Joi.string().allow(null, ""),
  location: Joi.string().allow(null, ""),
  Valid_From: Joi.date().allow(null),
    Valid_To: Joi.date().allow(null),
});

module.exports = {
  _HyundaiDiscountListImport,
  Hyundai_Discount_List_Import_Schema,
};
