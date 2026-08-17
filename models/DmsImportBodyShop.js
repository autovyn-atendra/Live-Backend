const Sequelize = require('sequelize');
const _DmsImportBodyShop = function(sequelize, DataTypes) {
  return sequelize.define('DmsImportBodyShop', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    SrlNo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    DealerName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    DealerCity: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Location: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    JobCardNo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    JCDateTime: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    ServiceType: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    RepeatRevisit: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    CustomerName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Phone: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    MobileNo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    CustomerCatg: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Psf_status: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    RegistrationNo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    CHASSIS: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ENGINENUM: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Color: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Variant: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Model: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Mi_yn: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    SaleDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    ImportDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Group: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    SA: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Technician: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    CircularNo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Mileage: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    EstLabAmt: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    EstPartAmt: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    PromisedDt: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    RevPromisedDt: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    ReadyDateTime: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    RevEstPartAmt: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    RevEstLabAmt: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    JCSource: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    App_sent_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    App_REJ_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    ApprovalStatus: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    CustRemarks: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    DlrRemarks: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Status: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    BillNo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    BillDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    LabourAmt: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    PartAmt: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    PickupRequired: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    PickupDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    PickupLocation: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    BillAmount: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Address1: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Address2: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Address3: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    City: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Pin: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Dob: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    DOA: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    CHKIN_DT: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    CHKOUT_DT: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Created_by: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Loc_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'DmsImportBodyShop',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__DmsImpor__C5B6F0D28EB9E3AC",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};


module.exports = {_DmsImportBodyShop };

