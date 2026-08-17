const Sequelize = require('sequelize');
const _In_Service = function (sequelize, DataTypes) {
  return sequelize.define('InService', {
    UTD: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    Veh_Req: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    Customer_Name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    Visit_Purpose: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    InTime: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    OutTime: {
      type: DataTypes.TIME,
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
    Req_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    Cust_Mob: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    Service_Type: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    Vehicle_InBy: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    Driver_Name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    From_Branch: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  }, {
    sequelize,
    tableName: 'In_Service',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Product___C5B6F0D28FFEE240",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};



const Joi = require('joi')
const InServiceSchema = Joi.object({
  UTD: Joi.number().integer().optional(),
  Veh_Req: Joi.string().max(50).optional().messages({
    "string.empty": `"Veh_Req" cannot be empty.`,
  }),
  Customer_Name: Joi.string().max(100).optional(),
  Visit_Purpose: Joi.string().max(10).optional().allow(null, ''),
  InTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9](\.[0-9]+)?)?$/).optional(),
  OutTime: Joi.string().pattern(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).allow(null),
  Location: Joi.alternatives().try(Joi.string().max(10), Joi.number()).optional(),
  Created_By: Joi.string().max(255).optional(),
  Cust_Mob: Joi.string().max(20).optional().allow(null, ''),
  Req_Date: Joi.date().optional().raw(),
  Service_Type: Joi.alternatives().try(Joi.string().max(10), Joi.number()).optional().allow(null,''),
  Vehicle_InBy: Joi.alternatives().try(Joi.string().max(10), Joi.number()).optional().allow(null,''),
  Driver_Name: Joi.alternatives().try(Joi.string().max(100), Joi.number()).optional().allow(null,''),
  From_Branch: Joi.alternatives().try(Joi.string().max(50), Joi.number()).optional().allow(null,''),
});

module.exports = { _In_Service, InServiceSchema };


