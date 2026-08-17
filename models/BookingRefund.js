const Sequelize = require('sequelize');
const _BookingRefund = function (sequelize, DataTypes) {
  return sequelize.define('BookingRefund', {
    Tran_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    SRM: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    location: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Dms_Code: {
      type: DataTypes.STRING(50),
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
    Refund_id: {
      type: DataTypes.STRING(50),
      allowNull: true
    },    
    is_gd: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    Booking_Amt: {
      type: DataTypes.DECIMAL(19,2),
      allowNull: true
    },
    Booking_Amt_Actual: {
      type: DataTypes.DECIMAL(19,2),
      allowNull: true
    },
    Adnl_Amt: {
      type: DataTypes.DECIMAL(19,2),
      allowNull: true
    },
    Cncl_Charges: {
      type: DataTypes.DECIMAL(19,2),
      allowNull: true
    },
    Final_Amount: {
      type: DataTypes.DECIMAL(19,2),
      allowNull: true
    },
    Approved_Amt: {
      type: DataTypes.DECIMAL(19,2),
      allowNull: true
    },
    Appr_1_Code: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Appr_1_Stat: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    Appr_1_Rem: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    Appr_2_Code: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Appr_2_Stat: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    Appr_2_Rem: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    Appr_3_Code: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Appr_3_Stat: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    Appr_3_Rem: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    Fin_Appr: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    Is_Reapp: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Created_by: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Created_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'Booking_Refund',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Booking___950B12B8E22FD032",
        unique: true,
        fields: [
          { name: "Tran_id" },
        ]
      },
    ]
  });
};


const Joi = require('joi');

const bookingRefundSchema = Joi.object({
  SRM: Joi.string().max(20).required(),
  location: Joi.string().max(50).allow(null).allow(""),
  export_type: Joi.number().integer().allow(null).allow(""),
  remark_dse: Joi.string().max(150).allow(null).allow(""),
  booking_id: Joi.string().max(20).allow(null).allow(""),
  UTD: Joi.string().max(20).allow(null).allow(""),
  Appr_1_Code: Joi.string().max(100).allow(null).allow(""),
  Appr_1_Stat: Joi.number().integer().min(0).max(255).allow(null).allow(""),
  Appr_1_Rem: Joi.string().max(300).allow(null).allow(""),
  Appr_2_Code: Joi.string().max(100).allow(null).allow(""),
  Appr_2_Stat: Joi.number().integer().min(0).max(255).allow(null).allow(""),
  Appr_2_Rem: Joi.string().max(300).allow(null).allow(""),
  Appr_3_Code: Joi.string().max(100).allow(null).allow(""),
  Appr_3_Stat: Joi.number().integer().min(0).max(255).allow(null).allow(""),
  Appr_3_Rem: Joi.string().max(300).allow(null).allow(""),
  Fin_Appr: Joi.number().integer().min(0).max(255).allow(null).allow(""),
});



module.exports = { bookingRefundSchema, _BookingRefund };
