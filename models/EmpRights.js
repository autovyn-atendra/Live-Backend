const Sequelize = require('sequelize');
const _EmpRights = function(sequelize, DataTypes) {
  return sequelize.define('EmpRights', {
    Utd: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    SRNO: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Emp_Mst',
        key: 'SRNO'
      }
    },
    mobile_limit: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    IEMI: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    IsRW: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Reporting_1: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Reporting_2: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Reporting_3: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    App_Mispunch: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    App_Leave: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    App_Attendance: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Tocken_Id: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Relaxation_Type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ShiftIn_Relaxation: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    ShiftOut_Relaxation: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Cumulative_Relaxation: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Spl_Rem: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    FCM_TockenId: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Android_ID: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    multi_loc: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Token: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Is_Profile_Filled: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    mPunch: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    mApprove: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    mMispunch: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    mLeave: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    mCalender: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    mDeviceLog: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    mAttendanceLog: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    mLocationLog: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    mToDoList: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    mSuggestions: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    mUpdateIMEI: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    mTrackingReport: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    mLiveLocation: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    mAssetScan: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    mGeoFenceSetting: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    Created_by: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Created_At: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'Emp_Rights',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Emp_Righ__C5B2047A07E3A656",
        unique: true,
        fields: [
          { name: "Utd" },
        ]
      },
    ]
  });
};

const Joi = require('joi');

const EmpRightsSchema = Joi.object({
  mobile_limit: Joi.string().max(10).allow(null).allow(''),
  IEMI: Joi.string().max(15).allow(null).allow(''),
  IsRW: Joi.number().integer().allow(null).allow(''),
  Reporting_1: Joi.string().max(30).allow(null).allow(''),
  Reporting_2: Joi.string().max(30).allow(null).allow(''),
  Reporting_3: Joi.string().max(30).allow(null).allow(''),
  App_Mispunch: Joi.string().max(10).allow(null).allow(''),
  App_Leave: Joi.string().max(10).allow(null).allow(''),
  App_Attendance: Joi.string().max(10).allow(null).allow(''),
  Tocken_Id: Joi.string().max(50).allow(null).allow(''),
  Relaxation_Type: Joi.number().integer().allow(null).allow(''),
  ShiftIn_Relaxation: Joi.number().precision(4).allow(null).allow(''),
  ShiftOut_Relaxation: Joi.number().precision(4).allow(null).allow(''),
  Cumulative_Relaxation: Joi.number().precision(4).allow(null).allow(''),
  Spl_Rem: Joi.string().max(500).allow(null).allow(''),
  FCM_TockenId: Joi.string().max(500).allow(null).allow(''),
  Android_ID: Joi.string().max(100).allow(null).allow(''),
  multi_loc: Joi.string().max(100).allow(null).allow(''),
  Token: Joi.string().max(500).allow(null).allow(''),
  Is_Profile_Filled: Joi.number().integer().allow(null).allow(''),
  mPunch: Joi.string().max(1).allow(null).allow(''),
  mApprove: Joi.string().max(1).allow(null).allow(''),
  mMispunch: Joi.string().max(1).allow(null).allow(''),
  mLeave: Joi.string().max(1).allow(null).allow(''),
  mCalender: Joi.string().max(1).allow(null).allow(''),
  mDeviceLog: Joi.string().max(1).allow(null).allow(''),
  mAttendanceLog: Joi.string().max(1).allow(null).allow(''),
  mLocationLog: Joi.string().max(1).allow(null).allow(''),
  mToDoList: Joi.string().max(1).allow(null).allow(''),
  mSuggestions: Joi.string().max(1).allow(null).allow(''),
  mUpdateIMEI: Joi.string().max(1).allow(null).allow(''),
  mTrackingReport: Joi.string().max(1).allow(null).allow(''),
  mLiveLocation: Joi.string().max(1).allow(null).allow(''),
  mAssetScan: Joi.string().max(1).allow(null).allow(''),
  mGeoFenceSetting: Joi.string().max(1).allow(null).allow(''),
});


module.exports = {_EmpRights, EmpRightsSchema};
