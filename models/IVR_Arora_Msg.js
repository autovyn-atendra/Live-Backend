// models/MsgAroraMaster.js
const Sequelize = require('sequelize');
const _IVRAroraMsg = function(sequelize, DataTypes) {
  return sequelize.define('IVRAroraMsg', {
    Utd: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    callId: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    did: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    cType: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    callLiveStatus: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    callStatus: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    campId: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    userId: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    cNumber: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    cNumber10: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    masterNumCTC: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    masterAgent: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    masterAgentNumber: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    ivrExecuteFlow: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    HangupBySourceDetected: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ivrSTime: {
      type: DataTypes.TIME,
      allowNull: true
    },
    ivrETime: {
      type: DataTypes.TIME,
      allowNull: true
    },
    ivrDuration: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    talkDuration: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    agentOnCallDuration: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    firstAttended: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    firstAnswerTime: {
      type: DataTypes.TIME,
      allowNull: true
    },
    lastHangupTime: {
      type: DataTypes.TIME,
      allowNull: true
    },
    lastFirstDuration: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    custAnswerSTime: {
      type: DataTypes.TIME,
      allowNull: true
    },
    custAnswerETime: {
      type: DataTypes.TIME,
      allowNull: true
    },
    custAnswerDuration: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    totalHoldDuration: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    callBack: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    queueDuration: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    callDisposition: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    exitCode: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    contactId: {
      type: DataTypes.STRING(20),
      allowNull: true
    },

    // JSON fields
    CTC: { type: DataTypes.JSON, allowNull: true },
    totalCreditsUsed: { type: DataTypes.JSON, allowNull: true },
    cliArr: { type: DataTypes.JSON, allowNull: true },
    ivrIdArr: { type: DataTypes.JSON, allowNull: true },
    aH: { type: DataTypes.JSON, allowNull: true },
    DTMF: { type: DataTypes.JSON, allowNull: true },
    contactInfo: { type: DataTypes.JSON, allowNull: true },
    contactListData: { type: DataTypes.JSON, allowNull: true },
    aHDetail: { type: DataTypes.JSON, allowNull: true },
    nH: { type: DataTypes.JSON, allowNull: true },
    nHDetail: { type: DataTypes.JSON, allowNull: true },
    aAnsH: { type: DataTypes.JSON, allowNull: true },
    recordings: { type: DataTypes.JSON, allowNull: true },
    voiceMail: { type: DataTypes.JSON, allowNull: true }
  }, {
    sequelize,
    tableName: 'IVR_Arora_Msg',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__IVR_Arora_Msg",
        unique: true,
        fields: [
          { name: "Utd" },
        ]
      }
    ]
  });
};


  module.exports = { _IVRAroraMsg };
