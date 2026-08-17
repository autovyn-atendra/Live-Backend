const Sequelize = require('sequelize');
const _CarGetPass = function (sequelize, DataTypes) {
  return sequelize.define('CarGetPass', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    getPassNO: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CustDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    RegNo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    CustId: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    CustName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    FatherName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Address: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    EW: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    CCP: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    MSR: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    MSSF: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    RTO: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    DRTO: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    EXCHANGE: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    FastagNO: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    ToolKit: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    Stepney: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    JackRod: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    FirstKit: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    Reflector: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    FireExtin: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    Speakers: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    ParcelTray: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    StereoRemote: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    CNGKIT: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    Veh_Model: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    EngineNO: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ChasNo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Color: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Remark: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Fastag: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Modl_Var: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    FIN_NAME: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Executive: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    tl: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Pin: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Pan_No: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    loc_code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CREATED_BY: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'Car_GetPass',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Car_GetP__C5B6F0D2519900A5",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};
const Joi = require('joi');

const CarGetPassSchema = Joi.object({
  UTD: Joi.number().integer().positive().optional(),
  getPassNO: Joi.alternatives().try(
    Joi.string().max(20).allow(null),
    Joi.number().allow(null)
  ),
  CustDate: Joi.date().allow(null),
  RegNo: Joi.string().max(100).allow(null, ""),
  CustId: Joi.string().max(50).allow(null),
  CustName: Joi.string().max(100).allow(null),
  FatherName: Joi.string().max(100).allow(null),
  Modl_Var: Joi.alternatives().try(
    Joi.string().max(20).allow(null),
    Joi.number().allow(null)
  ),
  FIN_NAME: Joi.alternatives().try(
    Joi.string().max(20).allow(null),
    Joi.number().allow(null)
  ),
  tl: Joi.alternatives().try(
    Joi.string().max(20).allow(null),
    Joi.number().allow(null)
  ),
  Executive: Joi.alternatives().try(
    Joi.string().max(20).allow(null),
    Joi.number().allow(null)
  ),
  Address: Joi.string().max(255).allow(null),
  EW: Joi.boolean().allow(null),
  CCP: Joi.boolean().allow(null),
  MSR: Joi.boolean().allow(null),
  MSSF: Joi.boolean().allow(null),
  RTO: Joi.boolean().allow(null),
  DRTO: Joi.boolean().allow(null),
  EXCHANGE: Joi.boolean().allow(null),
  FastagNO: Joi.boolean().allow(null),
  ToolKit: Joi.boolean().allow(null),
  Stepney: Joi.boolean().allow(null),
  JackRod: Joi.boolean().allow(null),
  FirstKit: Joi.boolean().allow(null),
  Reflector: Joi.boolean().allow(null),
  FireExtin: Joi.boolean().allow(null),
  Speakers: Joi.boolean().allow(null),
  ParcelTray: Joi.boolean().allow(null),
  StereoRemote: Joi.boolean().allow(null),
  CNGKIT: Joi.boolean().allow(null),
  Pin: Joi.string().max(20).allow(null, ""),
  Pan_No: Joi.string().max(20).allow(null, ""),
  Veh_Model: Joi.alternatives().try(Joi.string().max(100), Joi.number()).allow(null),
  EngineNO: Joi.string().max(50).allow(null),
  ChasNo: Joi.string().max(50).allow(null),
  Color: Joi.alternatives().try(
    Joi.string().max(20).allow(null),
    Joi.number().allow(null)
  ),
  Remark: Joi.string().max(255).allow(null),
  Fastag: Joi.string().max(100).allow(null, ""),
  loc_code: Joi.number().integer().allow(null),
  CREATED_BY: Joi.string().max(200).allow(null),
});

module.exports = { _CarGetPass, CarGetPassSchema };
