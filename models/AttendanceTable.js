const Sequelize = require('sequelize');
const _AttendanceTable = function(sequelize, DataTypes) {
  return sequelize.define('AttendanceTable', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    SRNO: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Emp_Code: {
      type: DataTypes.CHAR(20),
      allowNull: false
    },
    dateoffice: {
      type: "SMALLDATETIME",
      allowNull: false
    },
    rescd: {
      type: DataTypes.CHAR(3),
      allowNull: true
    },
    media: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    shiftstarttime: {
      type: DataTypes.TIME,
      allowNull: true
    },
    shiftendtime: {
      type: DataTypes.TIME,
      allowNull: true
    },
    lunchstarttime: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    lunchendtime: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    hoursworked: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true
    },
    exclunchhours: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true
    },
    otduration: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true
    },
    osduration: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true
    },
    otamount: {
      type: DataTypes.DECIMAL(11,2),
      allowNull: true
    },
    earlyarrival: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true
    },
    earlydeparture: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true
    },
    latearrival: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true
    },
    lunchearlydeparture: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true
    },
    lunchlatearrival: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true
    },
    totallosshrs: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true
    },
    status: {
      type: DataTypes.CHAR(6),
      allowNull: true
    },
    reason: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    shift: {
      type: DataTypes.CHAR(3),
      allowNull: true
    },
    shiftattended: {
      type: DataTypes.CHAR(3),
      allowNull: true
    },
    in1: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    in2: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    out1: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    out2: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    in1mannual: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    in2mannual: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    out1mannual: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    out2mannual: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    leavevalue: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true
    },
    presentvalue: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true
    },
    absentvalue: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true
    },
    holiday_value: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true
    },
    wo_value: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true
    },
    outworkduration: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true
    },
    leavetype: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    leavecode: {
      type: DataTypes.CHAR(3),
      allowNull: true
    },
    leaveamount: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true
    },
    flag: {
      type: DataTypes.CHAR(4),
      allowNull: true
    },
    leaveaprdate: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    voucher_no: {
      type: DataTypes.CHAR(10),
      allowNull: true
    },
    firsthalfleavecode: {
      type: DataTypes.CHAR(3),
      allowNull: true
    },
    secondhalfleavecode: {
      type: DataTypes.CHAR(3),
      allowNull: true
    },
    leavetype1: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    leavetype2: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    leaveamount1: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true
    },
    leaveamount2: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true
    },
    tlflag: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    vearlydeparture: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true
    },
    vlatearrival: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true
    },
    vlunchearlydeparture: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true
    },
    vlunchlatearrival: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true
    },
    vtotallosshrs: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true
    },
    os2otvflag: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    votduration: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true
    },
    votamount: {
      type: DataTypes.DECIMAL(11,2),
      allowNull: true
    },
    againstdate1: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    against1: {
      type: DataTypes.DECIMAL(3,2),
      allowNull: true
    },
    againstdate2: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    against2: {
      type: DataTypes.DECIMAL(3,2),
      allowNull: true
    },
    otapproval: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    cardot: {
      type: DataTypes.DECIMAL(8,2),
      allowNull: true
    },
    appot: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: true
    },
    appothod: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: true
    },
    otapprovalhod: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    assshift: {
      type: DataTypes.CHAR(3),
      allowNull: true
    },
    approve: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    intype: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    gatepass: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    Priority_Code: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    IsManual: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    MAN_APPR: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    mipunch_reason: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Mis_Enterby: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Mis_Aprby: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Shift_Enterby: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    MI_Remark: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DriveSerial: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    SystemSerial: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Reject_By: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Computer_name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    Man_Entry_Date: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    CO_Value: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    In_Latitude: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Out_Latitude: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    In_Longitude: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Out_Longitude: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    MAN_REJ: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Man_Recomend: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    App_in1: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    App_out1: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    NightShift: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    SPL_REMARK: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    Short_Lev: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    In_Add: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    Out_Add: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    In_Photo: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    Out_Photo: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    Device_in1: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    Device_Out1: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    Created_by: {
      type: DataTypes.STRING(30),
      allowNull: false
    } ,
    Created_At: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'Attendance_Table',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Attendan__C5B2047A91D339DA",
        unique: true,
        fields: [
          { name: "Utd" },
        ]
      },
    ]
  });
};


const Joi = require('joi');

const attendanceTableSchema = Joi.object({
  SRNO: Joi.number().integer().allow(null).allow(''),
  Emp_Code: Joi.string().max(20),
  dateoffice: Joi.date(),
  rescd: Joi.string().max(3).allow(null).allow(''),
  media: Joi.string().max(1).allow(null).allow(''),
  shiftstarttime: Joi.string().regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)(\.\d{1,7})?$/).allow(null).allow(''),
  shiftendtime: Joi.string().regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)(\.\d{1,7})?$/).allow(null).allow(''),
  lunchstarttime: Joi.date().allow(null).allow(''),
  lunchendtime: Joi.date().allow(null).allow(''),
  hoursworked: Joi.number().precision(5).allow(null).allow(''),
  exclunchhours: Joi.number().precision(5).allow(null).allow(''),
  otduration: Joi.number().precision(5).allow(null).allow(''),
  osduration: Joi.number().precision(5).allow(null).allow(''),
  otamount: Joi.number().precision(11).allow(null).allow(''),
  earlyarrival: Joi.number().precision(5).allow(null).allow(''),
  earlydeparture: Joi.number().precision(5).allow(null).allow(''),
  latearrival: Joi.number().precision(5).allow(null).allow(''),
  lunchearlydeparture: Joi.number().precision(5).allow(null).allow(''),
  lunchlatearrival: Joi.number().precision(5).allow(null).allow(''),
  totallosshrs: Joi.number().precision(5).allow(null).allow(''),
  status: Joi.string().max(6).allow(null).allow(''),
  reason: Joi.string().max(50).allow(null).allow(''),
  shift: Joi.string().max(3).allow(null).allow(''),
  shiftattended: Joi.string().max(3).allow(null).allow(''),
  in1: Joi.date().raw().allow(null).allow(''),
  in2: Joi.date().raw().allow(null).allow(''),
  out1: Joi.date().raw().allow(null).allow(''),
  out2: Joi.date().raw().allow(null).allow(''),
  in1mannual: Joi.string().max(1).allow(null).allow(''),
  in2mannual: Joi.string().max(1).allow(null).allow(''),
  out1mannual: Joi.string().max(1).allow(null).allow(''),
  out2mannual: Joi.string().max(1).allow(null).allow(''),
  leavevalue: Joi.number().precision(5).allow(null).allow(''),
  presentvalue: Joi.number().precision(5).allow(null).allow(''),
  absentvalue: Joi.number().precision(5).allow(null).allow(''),
  holiday_value: Joi.number().precision(5).allow(null).allow(''),
  wo_value: Joi.number().precision(5).allow(null).allow(''),
  outworkduration: Joi.number().precision(5).allow(null).allow(''),
  leavetype: Joi.string().max(1).allow(null).allow(''),
  leavecode: Joi.string().max(3).allow(null).allow(''),
  leaveamount: Joi.number().precision(5).allow(null).allow(''),
  flag: Joi.string().max(4).allow(null).allow(''),
  leaveaprdate: Joi.date().allow(null).allow(''),
  voucher_no: Joi.string().max(10).allow(null).allow(''),
  firsthalfleavecode: Joi.string().max(3).allow(null).allow(''),
  secondhalfleavecode: Joi.string().max(3).allow(null).allow(''),
  leavetype1: Joi.string().max(1).allow(null).allow(''),
  leavetype2: Joi.string().max(1).allow(null).allow(''),
  leaveamount1: Joi.number().precision(5).allow(null).allow(''),
  leaveamount2: Joi.number().precision(5).allow(null).allow(''),
  tlflag: Joi.string().max(1).allow(null).allow(''),
  vearlydeparture: Joi.number().precision(5).allow(null).allow(''),
  vlatearrival: Joi.number().precision(5).allow(null).allow(''),
  vlunchearlydeparture: Joi.number().precision(5).allow(null).allow(''),
  vlunchlatearrival: Joi.number().precision(5).allow(null).allow(''),
  vtotallosshrs: Joi.number().precision(5).allow(null).allow(''),
  os2otvflag: Joi.string().max(1).allow(null).allow(''),
  votduration: Joi.number().precision(5).allow(null).allow(''),
  votamount: Joi.number().precision(11).allow(null).allow(''),
  againstdate1: Joi.date().allow(null).allow(''),
  against1: Joi.number().precision(3).allow(null).allow(''),
  againstdate2: Joi.date().allow(null).allow(''),
  against2: Joi.number().precision(3).allow(null).allow(''),
  otapproval: Joi.string().max(1).allow(null).allow(''),
  cardot: Joi.number().precision(8).allow(null).allow(''),
  appot: Joi.number().precision(6).allow(null).allow(''),
  appothod: Joi.number().precision(6).allow(null).allow(''),
  otapprovalhod: Joi.string().max(1).allow(null).allow(''),
  assshift: Joi.string().max(3).allow(null).allow(''),
  approve: Joi.string().max(1).allow(null).allow(''),
  intype: Joi.string().max(1).allow(null).allow(''),
  gatepass: Joi.string().max(1).allow(null).allow(''),
  Priority_Code: Joi.number().integer().allow(null).allow(''),
  IsManual: Joi.string().max(1).allow(null).allow(''),
  MAN_APPR: Joi.string().max(1).allow(null).allow(''),
  mipunch_reason: Joi.number().allow(null).allow(''),
  Mis_Enterby: Joi.string().max(20).allow(null).allow(''),
  Mis_Aprby: Joi.string().max(20).allow(null).allow(''),
  Shift_Enterby: Joi.string().max(20).allow(null).allow(''),
  MI_Remark: Joi.number().integer().allow(null).allow(''),
  DriveSerial: Joi.string().max(50).allow(null).allow(''),
  SystemSerial: Joi.string().max(50).allow(null).allow(''),
  Reject_By: Joi.string().max(50).allow(null).allow(''),
  Computer_name: Joi.string().max(200).allow(null).allow(''),
  Man_Entry_Date: Joi.string().max(200).allow(null).allow(''),
  CO_Value: Joi.number().integer().allow(null).allow(''),
  In_Latitude: Joi.string().max(50).allow(null).allow(''),
  Out_Latitude: Joi.string().max(50).allow(null).allow(''),
  In_Longitude: Joi.string().max(50).allow(null).allow(''),
  Out_Longitude: Joi.string().max(50).allow(null).allow(''),
  MAN_REJ: Joi.string().max(10).allow(null).allow(''),
  Man_Recomend: Joi.string().max(10).allow(null).allow(''),
  App_in1: Joi.date().allow(null).allow(''),
  App_out1: Joi.date().allow(null).allow(''),
  NightShift: Joi.number().integer().allow(null).allow(''),
  SPL_REMARK: Joi.string().max(200).allow(null).allow(''),
  Short_Lev: Joi.number().integer().allow(null).allow(''),
  In_Add: Joi.string().max(300).allow(null).allow(''),
  Out_Add: Joi.string().max(300).allow(null).allow(''),
  In_Photo: Joi.string().max(200).allow(null).allow(''),
  Out_Photo: Joi.string().max(200).allow(null).allow(''),
  Device_in1: Joi.date().allow(null).allow(''),
  Device_Out1: Joi.date().allow(null).allow(''),
  Created_by: Joi.string().max(30)
});

module.exports = {_AttendanceTable , attendanceTableSchema};
