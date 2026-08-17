const Sequelize = require('sequelize');
const _HolidayList = function(sequelize, DataTypes) {
  return sequelize.define('HolidayList', {
    
    Holiday_Code: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Holiday_Name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Rec_Date: {
      type: "SMALLDATETIME",
      allowNull: false
    },
    Rel_Code: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    Dept_Code: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    Loc_Code: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    Spl_Remark: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    Export_Type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Half_Holiday: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: false
    },
    Holiday_Val: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: false
    },
    Created_by: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    Created_At: {
      type: DataTypes.DATE,
      allowNull: true,
    } 
  }, {
    sequelize,
    tableName: 'Holiday_List',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Holiday___C5B6F0D2BDC563C4",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};


const Joi = require('joi');

const HolidayListSchema = Joi.object({
  Holiday_Name: Joi.string().max(50),
  Rec_Date: Joi.date().iso(),
  Rel_Code: Joi.string().max(500),
  Dept_Code: Joi.string().max(1000),
  Loc_Code: Joi.string().max(1000),
  Spl_Remark: Joi.string().max(200),
  Export_Type: Joi.number().integer(),
  Half_Holiday: Joi.number().precision(4),
  Holiday_Val: Joi.number().precision(4),
});

module.exports = { _HolidayList, HolidayListSchema };
