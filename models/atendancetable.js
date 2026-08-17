const Sequelize = require("sequelize");
const _AttendanceTableNew = function (sequelize, DataTypes) {
  return sequelize.define(
    "AttendanceTable",
    {
      Emp_Code: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      dateoffice: {
        type: "SMALLDATETIME",
        allowNull: false,
      },
      rescd: {
        type: DataTypes.STRING(3),
        allowNull: true,
      },
      media: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      shiftstarttime: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      shiftendtime: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      lunchstarttime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      lunchendtime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      hoursworked: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      exclunchhours: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      otduration: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      osduration: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      otamount: {
        type: DataTypes.DECIMAL(11, 2),
        allowNull: true,
      },
      earlyarrival: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      earlydeparture: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      latearrival: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      lunchearlydeparture: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      lunchlatearrival: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      totallosshrs: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING(6),
        allowNull: true,
      },
      reason: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      shift: {
        type: DataTypes.STRING(3),
        allowNull: true,
      },
      shiftattended: {
        type: DataTypes.STRING(3),
        allowNull: true,
      },
      in1: {
        type: "SMALLDATETIME",
        allowNull: true,
      },
      in2: {
        type: "SMALLDATETIME",
        allowNull: true,
      },
      out1: {
        type: "SMALLDATETIME",
        allowNull: true,
      },
      out2: {
        type: "SMALLDATETIME",
        allowNull: true,
      },
      in1mannual: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      in2mannual: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      out1mannual: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      out2mannual: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      leavevalue: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      presentvalue: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      absentvalue: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      holiday_value: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      wo_value: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      outworkduration: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      leavetype: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      leavecode: {
        type: DataTypes.STRING(3),
        allowNull: true,
      },
      leaveamount: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      flag: {
        type: DataTypes.STRING(4),
        allowNull: true,
      },
      leaveaprdate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      voucher_no: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      firsthalfleavecode: {
        type: DataTypes.STRING(3),
        allowNull: true,
      },
      secondhalfleavecode: {
        type: DataTypes.STRING(3),
        allowNull: true,
      },
      leavetype1: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      leavetype2: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      leaveamount1: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      leaveamount2: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      tlflag: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      vearlydeparture: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      vlatearrival: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      vlunchearlydeparture: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      vlunchlatearrival: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      vtotallosshrs: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      os2otvflag: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      votduration: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      votamount: {
        type: DataTypes.DECIMAL(11, 2),
        allowNull: true,
      },
      againstdate1: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      against1: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: true,
      },
      againstdate2: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      against2: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: true,
      },
      otapproval: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      cardot: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: true,
      },
      appot: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: true,
      },
      appothod: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: true,
      },
      otapprovalhod: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      assshift: {
        type: DataTypes.STRING(3),
        allowNull: true,
      },
      approve: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      intype: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      gatepass: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      Priority_Code: {
        type: DataTypes.TINYINT,
        allowNull: true,
      },
      IsManual: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      MAN_APPR: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      mipunch_reason: {
        type: DataTypes.STRING(40),
        allowNull: true,
      },
      Mis_Enterby: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      Mis_Aprby: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      Shift_Enterby: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      MI_Remark: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      DriveSerial: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      SystemSerial: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Reject_By: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Computer_name: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      Man_Entry_Date: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      CO_Value: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      In_Latitude: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Out_Latitude: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      In_Longitude: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Out_Longitude: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      MAN_REJ: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      Man_Recomend: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      App_in1: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      App_out1: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      NightShift: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      SPL_REMARK: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Short_Lev: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      In_Add: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },
      Out_Add: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },
      In_Photo: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      Out_Photo: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      Device_in1: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      Device_Out1: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      Appr_1_Code: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      Appr_1_Stat: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Appr_1_Rem: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      Appr_2_Code: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      Appr_2_Stat: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Appr_2_Rem: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      Appr_3_Code: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      Appr_3_Stat: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Appr_3_Rem: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      UTD: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      Mi_Type: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "attendancetable",
      schema: "dbo",
      timestamps: false,
      indexes: [
        {
          name: "PK__Attendan__C5B2047A91D339DA",
          unique: true,
          fields: [{ name: "UTD" }],
        },
      ],
    }
  );
};

const Joi = require("joi");

const AttendanceTableNewSchema = Joi.object({
  Emp_Code: Joi.string().max(20).required().allow(null,''),
  dateoffice: Joi.date().raw().required(),
  rescd: Joi.string().max(3).optional().allow(null,''),
  media: Joi.string().max(1).optional().allow(null,''),
  shiftstarttime: Joi.number().precision(2).optional().allow(null,''),
  shiftendtime: Joi.number().precision(2).optional().allow(null,''),
  lunchstarttime: Joi.date().optional().allow(null,''),
  lunchendtime: Joi.date().optional().allow(null,''),
  hoursworked: Joi.number().precision(2).optional().allow(null,''),
  exclunchhours: Joi.number().precision(2).optional().allow(null,''),
  otduration: Joi.number().precision(2).optional().allow(null,''),
  osduration: Joi.number().precision(2).optional().allow(null,''),
  otamount: Joi.number().precision(2).optional().allow(null,''),
  earlyarrival: Joi.number().precision(2).optional().allow(null,''),
  earlydeparture: Joi.number().precision(2).optional().allow(null,''),
  latearrival: Joi.number().precision(2).optional().allow(null,''),
  lunchearlydeparture: Joi.number().precision(2).optional().allow(null,''),
  lunchlatearrival: Joi.number().precision(2).optional().allow(null,''),
  totallosshrs: Joi.number().precision(2).optional().allow(null,''),
  status: Joi.string().max(6).optional().allow(null,''),
  reason: Joi.string().max(50).optional().allow(null,''),
  shift: Joi.string().max(3).optional().allow(null,''),
  shiftattended: Joi.string().max(3).optional().allow(null,''),
  in1: Joi.date().raw().optional().allow(null,''),
  in2: Joi.date().raw().optional().allow(null,''),
  out1: Joi.date().raw().optional().allow(null,''),
  out2: Joi.date().raw().optional().allow(null,''),
  in1mannual: Joi.string().max(1).optional().allow(null,''),
  in2mannual: Joi.string().max(1).optional().allow(null,''),
  out1mannual: Joi.string().max(1).optional().allow(null,''),
  out2mannual: Joi.string().max(1).optional().allow(null,''),
  leavevalue: Joi.number().precision(2).optional().allow(null,''),
  presentvalue: Joi.number().precision(2).optional().allow(null,''),
  absentvalue: Joi.number().precision(2).optional().allow(null,''),
  holiday_value: Joi.number().precision(2).optional().allow(null,''),
  wo_value: Joi.number().precision(2).optional().allow(null,''),
  outworkduration: Joi.number().precision(2).optional().allow(null,''),
  leavetype: Joi.string().max(1).optional().allow(null,''),
  leavecode: Joi.string().max(3).optional().allow(null,''),
  leaveamount: Joi.number().precision(2).optional().allow(null,''),
  flag: Joi.string().max(4).optional().allow(null,''),
  leaveaprdate: Joi.date().optional().allow(null,''),
  voucher_no: Joi.string().max(10).optional().allow(null,''),
  firsthalfleavecode: Joi.string().max(3).optional().allow(null,''),
  secondhalfleavecode: Joi.string().max(3).optional().allow(null,''),
  leavetype1: Joi.string().max(1).optional().allow(null,''),
  leavetype2: Joi.string().max(1).optional().allow(null,''),
  leaveamount1: Joi.number().precision(2).optional().allow(null,''),
  leaveamount2: Joi.number().precision(2).optional().allow(null,''),
  tlflag: Joi.string().max(1).optional().allow(null,''),
  vearlydeparture: Joi.number().precision(2).optional().allow(null,''),
  vlatearrival: Joi.number().precision(2).optional().allow(null,''),
  vlunchearlydeparture: Joi.number().precision(2).optional().allow(null,''),
  vlunchlatearrival: Joi.number().precision(2).optional().allow(null,''),
  vtotallosshrs: Joi.number().precision(2).optional().allow(null,''),
  os2otvflag: Joi.string().max(1).optional().allow(null,''),
  votduration: Joi.number().precision(2).optional().allow(null,''),
  votamount: Joi.number().precision(2).optional().allow(null,''),
  againstdate1: Joi.date().optional().allow(null,''),
  against1: Joi.number().precision(2).optional().allow(null,''),
  againstdate2: Joi.date().optional().allow(null,''),
  against2: Joi.number().precision(2).optional().allow(null,''),
  otapproval: Joi.string().max(1).optional().allow(null,''),
  cardot: Joi.number().precision(2).optional().allow(null,''),
  appot: Joi.number().precision(2).optional().allow(null,''),
  appothod: Joi.number().precision(2).optional().allow(null,''),
  otapprovalhod: Joi.string().max(1).optional().allow(null,''),
  assshift: Joi.string().max(3).optional().allow(null,''),
  approve: Joi.string().max(1).optional().allow(null,''),
  intype: Joi.string().max(1).optional().allow(null,''),
  gatepass: Joi.string().max(1).optional().allow(null,''),
  Priority_Code: Joi.number().optional().allow(null,''),
  IsManual: Joi.string().max(1).optional().allow(null,''),
  MAN_APPR: Joi.string().max(1).optional().allow(null,''),
  mipunch_reason: Joi.string().max(40).optional().allow(null,''),
  Mis_Enterby: Joi.string().max(20).optional().allow(null,''),
  Mis_Aprby: Joi.string().max(20).optional().allow(null,''),
  Shift_Enterby: Joi.string().max(20).optional().allow(null,''),
  MI_Remark: Joi.number().optional().allow(null,''),
  DriveSerial: Joi.string().max(50).optional().allow(null,''),
  SystemSerial: Joi.string().max(50).optional().allow(null,''),
  Reject_By: Joi.string().max(50).optional().allow(null,''),
  Computer_name: Joi.string().max(200).optional().allow(null,''),
  Man_Entry_Date: Joi.string().max(200).optional().allow(null,''),
  CO_Value: Joi.number().optional().allow(null,''),
  In_Latitude: Joi.string().max(50).optional().allow(null,''),
  Out_Latitude: Joi.string().max(50).optional().allow(null,''),
  In_Longitude: Joi.string().max(50).optional().allow(null,''),
  Out_Longitude: Joi.string().max(50).optional().allow(null,''),
  MAN_REJ: Joi.string().max(10).optional().allow(null,''),
  Man_Recomend: Joi.string().max(10).optional().allow(null,''),
  App_in1: Joi.date().optional().allow(null,''),
  App_out1: Joi.date().optional().allow(null,''),
  NightShift: Joi.number().optional().allow(null,''),
  SPL_REMARK: Joi.string().max(100).optional().allow(null,''),
  Short_Lev: Joi.number().optional().allow(null,''),
  In_Add: Joi.string().max(300).optional().allow(null,''),
  Out_Add: Joi.string().max(300).optional().allow(null,''),
  In_Photo: Joi.string().max(200).optional().allow(null,''),
  Out_Photo: Joi.string().max(200).optional().allow(null,''),
  Device_in1: Joi.date().optional().allow(null,''),
  Device_Out1: Joi.date().optional().allow(null,''),
  Appr_1_Code: Joi.string().max(20).optional().allow(null,''),
  Appr_1_Stat: Joi.number().optional().allow(null,''),
  Appr_1_Rem: Joi.string().max(255).optional().allow(null,''),
  Appr_2_Code: Joi.string().max(20).optional().allow(null,''),
  Appr_2_Stat: Joi.number().optional().allow(null,''),
  Appr_2_Rem: Joi.string().max(255).optional().allow(null,''),
  Appr_3_Code: Joi.string().max(20).optional().allow(null,''),
  Appr_3_Stat: Joi.number().optional().allow(null,''),
  Appr_3_Rem: Joi.string().max(255).optional().allow(null,''),
  UTD: Joi.number().integer().optional().allow(null,''),
  Mi_Type: Joi.number().optional().allow(null,''),
});

module.exports = { _AttendanceTableNew, AttendanceTableNewSchema };
