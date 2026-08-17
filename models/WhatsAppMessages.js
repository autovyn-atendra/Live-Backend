const Sequelize = require('sequelize');
const _WhatsAppMessages = function (sequelize, DataTypes) {
  return sequelize.define('WhatsAppMessages', {
    Utd: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    User_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    wamid: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
      primaryKey: true
    },
    ContextWamid: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    PhoneNoId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MsgDirection: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    MsgType: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    SubmitDtTime: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ToFromPhoneNo: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    MsgStatus: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    SentOrFailTime: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    DeliveredTime: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ReadTime: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ConversationId: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    MsgCategory: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    MsgText: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    TemplateName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Sha256OfInMedia: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    MediaId: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    MediaUrl: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    MediaSize: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    BillingInfo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    BalUsed: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MimeType: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ErrCodeMsg: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    FileName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    DLR_ID: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Flag: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'WhatsAppMessages',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__WhatsApp__C5B2047A21D8E9A4",
        unique: true,
        fields: [
          { name: "Utd" },
        ]
      },
    ]
  });
};


module.exports = { _WhatsAppMessages }