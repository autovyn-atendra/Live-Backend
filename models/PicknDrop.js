const Sequelize = require('sequelize');
const _Pick_Drop_Collection = function (sequelize, DataTypes) {
  return sequelize.define('PickDropCollection', {
    tran_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      Bill_Date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      Time: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      Veh_Req: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Customer_Name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Customer_Mob: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      Performa_Inv: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Bill_No: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Inv_Amt: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Driver_Name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Driver_Mob: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      Mode_Payment: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Amount_Paid: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Short_Access: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Location: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      Created_By: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      UPIPayment: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Remark: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      Req_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      Receipt_Amt: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      To_Branch: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    }, {
        sequelize,
        tableName: 'Pick_Drop_Collection',
        schema: 'dbo',
        timestamps: false,
        indexes: [
          {
            name: "PK__Product___C5B6F0D28FFEE240",
            unique: true,
            fields: [
              { name: "tran_id" },
            ]
          },
        ]
      });
    };



const Joi = require('joi')
const PickDropCollectionSchema = Joi.object({
  tran_id: Joi.number().integer().optional(),
  Bill_Date: Joi.date().optional().allow(null, ''),
  Time: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9](\.[0-9]+)?)?$/).optional(),
  Veh_Req: Joi.string().max(50).optional(),
  Customer_Name: Joi.string().max(100).optional(),
  Customer_Mob: Joi.string().max(10).optional().allow(null, ''),
  Performa_Inv: Joi.string().max(50).optional().allow(null, ''),
  Bill_No: Joi.string().max(50).optional().allow(null, ''),
  Inv_Amt: Joi.alternatives().try(Joi.string().max(50), Joi.number()).optional().allow(null, ''),
  Driver_Name: Joi.string().max(50).optional().allow(null, ''),
  Driver_Mob: Joi.string().max(10).optional().allow(null, ''),
  Mode_Payment: Joi.alternatives().try(Joi.string().max(50), Joi.number()).optional().allow(null, ''),
  Amount_Paid: Joi.string().max(50).optional().allow(null, ''),
  Short_Access: Joi.string().max(50).optional().allow(null, ''),
  Location: Joi.alternatives().try(Joi.string().max(10), Joi.number()).optional(),
  Created_By: Joi.string().max(255).optional(),
  UPIPayment: Joi.alternatives().try(Joi.string().max(100), Joi.number()).optional().allow(null, ''),
  Remark: Joi.string().max(100).optional().allow(null, ''),
  Req_Date: Joi.date().optional().raw(),
  Receipt_Amt: Joi.alternatives().try(Joi.string().max(50), Joi.number()).optional().allow(null, ''),
  To_Branch: Joi.alternatives().try(Joi.string().max(50), Joi.number()).optional().allow(null, ''),
  });
  
  module.exports = { _Pick_Drop_Collection, PickDropCollectionSchema };
  
  
