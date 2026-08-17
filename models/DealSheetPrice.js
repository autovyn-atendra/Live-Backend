const Sequelize = require('sequelize');
const _DealSheetPrice = function (sequelize, DataTypes) {
  return sequelize.define('DealSheetPrice', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ModelCode: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ModelName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Clr: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    Price: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: true
    },
    Insurance_1_Year: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true
    },
    Insurance_1_3_Year: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true
    },
    Permanent: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true
    },
    Temporary: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true
    },
    Fastag: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true
    },
    Basic: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true
    },
    Tcs: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true
    },
    MCP_Amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true
    },
    Loyalty_Amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true
    },
    Dealer_EW_Royal_Platinum: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true
    },
    Solitaire_6th: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true
    },
    Royal_Platinum_5th: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true
    },
    Platinum_4th: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true
    },
    Gold_3th: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true
    },
    Ccp_Amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true
    },
    // Consumer: {
    //   type: DataTypes.DECIMAL(15, 2),
    //   allowNull: true
    // },
    // Corporate: {
    //   type: DataTypes.DECIMAL(15, 2),
    //   allowNull: true
    // },
    // Exchange: {
    //   type: DataTypes.DECIMAL(15, 2),
    //   allowNull: true
    // },
    // MSSF_Amount: {
    //   type: DataTypes.DECIMAL(15, 2),
    //   allowNull: true
    // },
    Broker_Discount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true
    },
    Valid_From: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Valid_Upto: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Municipal_Tax_1: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true
    },
    Municipal_Tax_2: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true
    },
    Municipal_Tax_3: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true
    },
    Municipal_Tax_4: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true
    },
    Municipal_Tax_5: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true
    },
    Loc_Code: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Created_By: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'Deal_Sheet_Price',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Deal_She__C5B6F0D24644DE9E",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};
const Joi = require('joi');

const dealSheetPriceSchema = Joi.object({
  UTD: Joi.number().integer().positive().optional(), // Auto-increment field, typically managed by the database
  ModelCode: Joi.string().max(50).allow(null).optional(),
  ModelName: Joi.string().max(255).required(),
  Clr: Joi.string().length(1).required(),
  Price: Joi.number().precision(4).required(),
  Insurance_1_Year: Joi.number().precision(2).required(),
  Insurance_1_3_Year: Joi.number().precision(2).required(),
  Permanent: Joi.number().precision(2).required(),
  Temporary: Joi.number().precision(2).required(),
  Fastag: Joi.number().precision(2).required(),
  Basic: Joi.number().precision(2).required(),
  Tcs: Joi.number().precision(2).required(),
  MCP_Amount: Joi.number().precision(2).required(),
  Loyalty_Amount: Joi.number().precision(2).required(),
  Dealer_EW_Royal_Platinum: Joi.number().precision(2).required(),
  Solitaire_6th: Joi.number().precision(2).required(),
  Royal_Platinum_5th: Joi.number().precision(2).required(),
  Platinum_4th: Joi.number().precision(2).required(),
  Gold_3th: Joi.number().precision(2).required(),
  Ccp_Amount: Joi.number().precision(2).required(),
  // Consumer: Joi.number().precision(2).required(),
  // Corporate: Joi.number().precision(2).required(),
  // Exchange: Joi.number().precision(2).required(),
  // MSSF_Amount: Joi.number().precision(2).required(),
  Broker_Discount: Joi.number().precision(2).required(),
  Valid_From: Joi.date().iso().required(),
  Valid_Upto: Joi.date().iso().required(),
  Municipal_Tax_1: Joi.number().precision(2).required(),
  Municipal_Tax_2: Joi.number().precision(2).required(),
  Municipal_Tax_3: Joi.number().precision(2).required(),
  Municipal_Tax_4: Joi.number().precision(2).required(),
  Municipal_Tax_5: Joi.number().precision(2).required(),
  Loc_Code: Joi.string().max(100).allow(null).optional(),
  Created_By: Joi.string().max(255).allow(null).optional(),
});

module.exports = { _DealSheetPrice, dealSheetPriceSchema };
