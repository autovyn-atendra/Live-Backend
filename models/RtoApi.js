const Sequelize = require('sequelize');
const _RtoApi = function (sequelize, DataTypes) {
  return sequelize.define('RtoApi', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Tran_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Cust_Id: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    Invoice_No: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Invoice_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Customer_Name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Model_Name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Colour_Name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Pan_No: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Aadhar_No: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Address1: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Address2: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Pin_Code: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Village: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    StateName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Finance_Name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Finance_Address: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Mobile_No: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Email_ID: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Engine_No: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Frame_No: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Basic_Price: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true
    },
    Policy_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Policy_No: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    exp_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Booking_No: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Owner_Type: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    OwnerCategory: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Manufacutring_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Sale_Certificate_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Sales_Certificate_Amount: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true
    },
    Insurance_Type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Hypothication: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    IDV: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Body_Type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Registration_Purpose: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Vehicle_Type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Permit_Category: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    RTO_Office_List: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Permit_Type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Avaliable_For_Rto: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Fetched_Rto: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    CreatedBy: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Application_no: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    INSURANCE_COMPANY_NAME: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    Vehicle_Class: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Vehicle_Category: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Registration_Type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Owner_Registration_Type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Son_Of: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    Ownership_serial: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    RationCard_No: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Voter_Id: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    DL_No: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    District: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Landmark: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Permanent_Address: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Permanent_Address2: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Permanent_Village: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Permanent_District: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Permanent_Landmark: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Permanent_State: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Permanent_PinCode: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    MI_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    KIT_Serial_No: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    KIT_Type: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    KIT_Manufacturer_Name: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    Workshop: {
      type: DataTypes.STRING(400),
      allowNull: true
    },
    License_No: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Cylinder_No: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Installation_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Pollution_Norms: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    Hydro_Validity_Upto: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Approval_Letter_No: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Approval_Letter_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Fuel_Type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Finance_PinCode: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    AC_Fitted: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'RTO_API',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__RTO_API__C5B6F0D27F3D2373",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};
module.exports = { _RtoApi }