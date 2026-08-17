const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('DiseAprvl', {
    tran_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Mob: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    Pan_No: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    Cust_Name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    Modl_Var: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    Veh_Clr: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    Delv_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Loan: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    MGA_Amt: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Insurance: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    RTO_Chrg: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    Loyalty_Card: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    Car_Exch: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    FastTeg: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    SRM: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    RM: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    Consumer: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Corporate: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Exch: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Aprvl_Offer: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Dise_Amt: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Aprvl_By: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Status: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Remark: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Curr_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Approved_amt: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    aprvl_by2: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    dual_apr: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    modl_group: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    wa_link: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    apr2_apr: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    export_type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    remark_dse: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    booking_id: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    UTD: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    isapp1: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    is_gd: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    EW: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CCP: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Fuel_Type: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Var_Cd: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    waiting: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Created_by: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'dise_aprvl',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__dise_apr__A67F8A20311C3F13",
        unique: true,
        fields: [
          { name: "tran_id" },
        ]
      },
    ]
  });
};


const Joi = require('joi');

const DiseAprvlSchema = Joi.object({
  Mob: Joi.string().max(10).required(),
  Pan_No: Joi.string().max(20).required(),
  Cust_Name: Joi.string().max(20).required(),
  Modl_Var: Joi.string().max(20).required(),
  Veh_Clr: Joi.string().max(20).required(),
  Delv_Date: Joi.date().allow(null).allow(''),
  Loan: Joi.string().max(20).required(),
  MGA_Amt: Joi.number().precision(4).allow(null).allow(''),
  Insurance: Joi.string().max(10).required(),
  RTO_Chrg: Joi.string().max(20).required(),
  Loyalty_Card: Joi.string().max(20).required(),
  Car_Exch: Joi.string().max(20).required(),
  FastTeg: Joi.string().max(20).required(),
  SRM: Joi.string().max(20).required(),
  RM: Joi.string().max(20).required(),
  Consumer: Joi.number().precision(4).allow(null).allow(''),
  Corporate: Joi.number().precision(4).allow(null).allow(''),
  Exch: Joi.number().precision(4).allow(null).allow(''),
  Aprvl_Offer: Joi.number().precision(4).allow(null).allow(''),
  Dise_Amt: Joi.number().precision(4).allow(null).allow(''),
  Aprvl_By: Joi.string().max(20).allow(null).allow(''),
  Status: Joi.string().max(10).allow(null).allow(''),
  Remark: Joi.string().max(100).allow(null).allow(''),
  Curr_Date: Joi.date().allow(null).allow(''),
  location: Joi.string().max(50).allow(null).allow(''),
  Approved_amt: Joi.number().precision(4).allow(null).allow(''),
  aprvl_by2: Joi.string().max(50).allow(null).allow(''),
  dual_apr: Joi.string().max(2).allow(null).allow(''),
  modl_group: Joi.number().integer().allow(null).allow(''),
  wa_link: Joi.string().max(100).allow(null).allow(''),
  apr2_apr: Joi.number().integer().allow(null).allow(''),
  export_type: Joi.number().integer().allow(null).allow(''),
  remark_dse: Joi.string().max(150).allow(null).allow(''),
  booking_id: Joi.string().max(20).allow(null).allow(''),
  UTD: Joi.string().max(20).allow(null).allow(''),
  isapp1: Joi.string().max(10).allow(null).allow(''),
  is_gd: Joi.string().max(10).allow(null).allow(''),
  EW: Joi.number().integer().allow(null).allow(''),
  CCP: Joi.number().integer().allow(null).allow(''),
  Fuel_Type: Joi.string().max(20).allow(null).allow(''),
  Var_Cd: Joi.string().max(20).allow(null).allow(''),
  waiting: Joi.number().integer().allow(null).allow(''),
  Created_by: Joi.string().max(100).allow(null).allow('')
});

module.exports = DiseAprvlSchema;
