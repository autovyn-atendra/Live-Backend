const Sequelize = require('sequelize');

const _Rtl_Cost_Dtl = (sequelize, DataTypes) => {
  return sequelize.define(
    'Rtl_Cost_Dtl',
    {
      UTD: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      TRAN_ID: { type: DataTypes.INTEGER, allowNull: true },

      // Add-On fields
      ...[...Array(15)].reduce((acc, _, i) => {
        const index = i + 1;
        acc[`Is_Add_On${index}`] = { type: DataTypes.INTEGER, allowNull: true };
        acc[`Sub_Add_On${index}`] = { type: DataTypes.INTEGER, allowNull: true };
        acc[`Price${index}`] = { type: DataTypes.DECIMAL(19, 4), allowNull: true };
        acc[`fin_price${index}`] = { type: DataTypes.DECIMAL(19, 4), allowNull: true };
        return acc;
      }, {}),

      Loc_Code: { type: DataTypes.INTEGER, allowNull: true },
       IS_QUOTATION_Y_N:  { type: DataTypes.INTEGER, allowNull: true },
      Export_Type: { type: DataTypes.INTEGER, allowNull: true },
      Created_At: { type: DataTypes.DATE, allowNull: true, defaultValue: Sequelize.literal('getdate()') },
      Created_by: { type: DataTypes.STRING(100), allowNull: true },

      BOOKING_ID: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
      timestamp: { type: DataTypes.DATE, allowNull: true },
    },
    {
      tableName: 'Rtl_Cost_Dtl',
      schema: 'dbo',
      timestamps: false,
      version: false,
    }
  );
};



const Joi = require('joi');

const Rtl_Cost_Dtl_Schema = Joi.object({
  UTD: Joi.number().integer().optional(),

  TRAN_ID: Joi.number().integer().allow(null),

  ...[...Array(15)].reduce((acc, _, i) => {
    const index = i + 1;
    acc[`Is_Add_On${index}`] = Joi.number().integer().allow(null);
    acc[`Sub_Add_On${index}`] = Joi.number().integer().allow(null);
    acc[`Price${index}`] = Joi.number().precision(4).allow(null);
    acc[`fin_price${index}`] = Joi.number().precision(4).allow(null);
    return acc;
  }, {}),

  Loc_Code: Joi.number().integer().allow(null),
  IS_QUOTATION_Y_N: Joi.number().integer().allow(null),
  Export_Type: Joi.number().integer().allow(null),
  Created_At: Joi.date().allow(null),
  Created_by: Joi.string().max(100).allow(null, ''),
  BOOKING_ID: Joi.string().max(100).optional().allow(null, ''),
 
  timestamp: Joi.date().allow(null),
});

module.exports = {_Rtl_Cost_Dtl, Rtl_Cost_Dtl_Schema };


