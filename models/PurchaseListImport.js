const Sequelize = require('sequelize');
const _PurchaseListImport = function (sequelize, DataTypes) {
  return sequelize.define('PurchaseListImport', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Frame: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    EngineNo: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    RegistrationNo: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    ModelCategory: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    ModelName: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    ModelVariant: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    PhysicalStatus: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    ProductName: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    WarrantyEndDate: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    WarrantyExpiryKm: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    SellingDealerName: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    LastServiceDealer: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    LastServiceDate: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    LastServiceKms: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    LastServiceDivision: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    NextServiceDate: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    PDIDone: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    PDIDoneDate: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    CustomerName: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    ContactNumber: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    AccountName: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    PlantCode: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    TransporterCode: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    TransporterName: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    SellingDealerCode: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    TAXABLEVALUE: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    HMSIInvoiceAmount: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    HMSILoadReferenceNo: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    EmissionNorms: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    TruckNumber: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    ReferenceNo: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    PurchaseOrderNo: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    PaymentAmount: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    DispatchDate: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    DestinationLocation: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    ModelCode: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    TypeCode: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    OrderNo: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    Color: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    ColorCode: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    ManufacturingDate: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    VehicleStatus: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    Remarks: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    HMSIInvoiceNo: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    InvoiceDate: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    InventoryLocation: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    SalesCertificateDate: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    MTOC: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    HSNCode: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    KeyNo: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    GRNo: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    GRDate: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    ReferenceNumber: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    EWStartDate: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    EWEndDate: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    AMCDealer: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    AMCStartDate: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    AMCEndDate: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    EHAStartDate: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    EHAEndDate: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    RSAStartDate: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    RSAEndDate: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    PickDropDealer: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    PickDropStartDate: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    PickDropEndDate: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    ActualDeliveryDate: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    LastServiceType: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    DealerInvoiceNo: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    DlrInvoiceDate: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    TestRideVehicle: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    DivisionRegion: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    DivisionZone: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    DealerCity: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    State: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    MRNDate: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    MissedServiceDate: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    NextServiceType: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    CurrentMainDealerCode: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    DispatchDealerCode: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    DispatchDealerName: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    NetDealerPrice: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    CreditOfGST: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    DealerBillingPrice: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    CGSTAmount: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    SGSTAmount: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    IGSTAmount: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    EXShowroomPrice: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    GSTIN: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    LoyaltyID: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    LoyaltyRegisteredPhNo: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    LoyaltyFlag: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    EnrolDate: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    DeEnrolDate: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    RecallFlag: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    CurrentNetworkCode: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    CurrentNetworkName: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    CustomerFlag: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    CustomerCategory: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    CurrentNetworkType: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    CurrentMainDealerName: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    PermiumAMCPeriod: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    EWPLUSDealer: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    EWPLUSStartDate: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    EWPLUSEndDate: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    DataMask: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    Loc_code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    batch_id : {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Created_by: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'PurchaseListImport',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['Frame', 'EngineNo']
      },
    ],
  });
};

const Joi = require('joi');

const PurchaseListImportSchema = Joi.object({
  Frame: Joi.string().max(250).allow(null, ''),
  EngineNo: Joi.string().max(250).allow(null, ''),
  RegistrationNo: Joi.string().max(250).allow(null, ''),
  ModelCategory: Joi.string().max(250).allow(null, ''),
  ModelName: Joi.string().max(250).allow(null, ''),
  ModelVariant: Joi.string().max(250).allow(null, ''),
  PhysicalStatus: Joi.string().max(250).allow(null, ''),
  ProductName: Joi.string().max(250).allow(null, ''),
  WarrantyEndDate: Joi.string().max(250).allow(null, ''),
  WarrantyExpiryKm: Joi.string().max(250).allow(null, ''),
  SellingDealerName: Joi.string().max(250).allow(null, ''),
  LastServiceDealer: Joi.string().max(250).allow(null, ''),
  LastServiceDate: Joi.string().max(250).allow(null, ''),
  LastServiceKms: Joi.string().max(250).allow(null, ''),
  LastServiceDivision: Joi.string().max(250).allow(null, ''),
  NextServiceDate: Joi.string().max(250).allow(null, ''),
  PDIDone: Joi.string().max(250).allow(null, ''),
  PDIDoneDate: Joi.string().max(250).allow(null, ''),
  CustomerName: Joi.string().max(250).allow(null, ''),
  ContactNumber: Joi.string().max(250).allow(null, ''),
  AccountName: Joi.string().max(250).allow(null, ''),
  PlantCode: Joi.string().max(250).allow(null, ''),
  TransporterCode: Joi.string().max(250).allow(null, ''),
  TransporterName: Joi.string().max(250).allow(null, ''),
  SellingDealerCode: Joi.string().max(250).allow(null, ''),
  TAXABLEVALUE: Joi.string().max(250).allow(null, ''),
  HMSIInvoiceAmount: Joi.string().max(250).allow(null, ''),
  HMSILoadReferenceNo: Joi.string().max(250).allow(null, ''),
  EmissionNorms: Joi.string().max(250).allow(null, ''),
  TruckNumber: Joi.string().max(250).allow(null, ''),
  ReferenceNo: Joi.string().max(250).allow(null, ''),
  PurchaseOrderNo: Joi.string().max(250).allow(null, ''),
  PaymentAmount: Joi.string().max(250).allow(null, ''),
  DispatchDate: Joi.string().max(250).allow(null, ''),
  DestinationLocation: Joi.string().max(250).allow(null, ''),
  ModelCode: Joi.string().max(250).allow(null, ''),
  TypeCode: Joi.string().max(250).allow(null, ''),
  OrderNo: Joi.string().max(250).allow(null, ''),
  Color: Joi.string().max(250).allow(null, ''),
  ColorCode: Joi.string().max(250).allow(null, ''),
  ManufacturingDate: Joi.string().max(250).allow(null, ''),
  VehicleStatus: Joi.string().max(250).allow(null, ''),
  Remarks: Joi.string().max(250).allow(null, ''),
  HMSIInvoiceNo: Joi.string().max(250).allow(null, ''),
  InvoiceDate: Joi.string().max(250).allow(null, ''),
  InventoryLocation: Joi.string().max(250).allow(null, ''),
  SalesCertificateDate: Joi.string().max(250).allow(null, ''),
  MTOC: Joi.string().max(250).allow(null, ''),
  HSNCode: Joi.string().max(250).allow(null, ''),
  KeyNo: Joi.string().max(250).allow(null, ''),
  GRNo: Joi.string().max(250).allow(null, ''),
  GRDate: Joi.string().max(250).allow(null, ''),
  ReferenceNumber: Joi.string().max(250).allow(null, ''),
  EWStartDate: Joi.string().max(250).allow(null, ''),
  EWEndDate: Joi.string().max(250).allow(null, ''),
  AMCDealer: Joi.string().max(250).allow(null, ''),
  AMCStartDate: Joi.string().max(250).allow(null, ''),
  AMCEndDate: Joi.string().max(250).allow(null, ''),
  EHAStartDate: Joi.string().max(250).allow(null, ''),
  EHAEndDate: Joi.string().max(250).allow(null, ''),
  RSAStartDate: Joi.string().max(250).allow(null, ''),
  RSAEndDate: Joi.string().max(250).allow(null, ''),
  PickDropDealer: Joi.string().max(250).allow(null, ''),
  PickDropStartDate: Joi.string().max(250).allow(null, ''),
  PickDropEndDate: Joi.string().max(250).allow(null, ''),
  ActualDeliveryDate: Joi.string().max(250).allow(null, ''),
  LastServiceType: Joi.string().max(250).allow(null, ''),
  DealerInvoiceNo: Joi.string().max(250).allow(null, ''),
  DlrInvoiceDate: Joi.string().max(250).allow(null, ''),
  TestRideVehicle: Joi.string().max(250).allow(null, ''),
  DivisionRegion: Joi.string().max(250).allow(null, ''),
  DivisionZone: Joi.string().max(250).allow(null, ''),
  DealerCity: Joi.string().max(250).allow(null, ''),
  State: Joi.string().max(250).allow(null, ''),
  MRNDate: Joi.string().max(250).allow(null, ''),
  MissedServiceDate: Joi.string().max(250).allow(null, ''),
  NextServiceType: Joi.string().max(250).allow(null, ''),
  CurrentMainDealerCode: Joi.string().max(250).allow(null, ''),
  DispatchDealerCode: Joi.string().max(250).allow(null, ''),
  DispatchDealerName: Joi.string().max(250).allow(null, ''),
  NetDealerPrice: Joi.string().max(250).allow(null, ''),
  CreditOfGST: Joi.string().max(250).allow(null, ''),
  DealerBillingPrice: Joi.string().max(250).allow(null, ''),
  CGSTAmount: Joi.string().max(250).allow(null, ''),
  SGSTAmount: Joi.string().max(250).allow(null, ''),
  IGSTAmount: Joi.string().max(250).allow(null, ''),
  EXShowroomPrice: Joi.string().max(250).allow(null, ''),
  GSTIN: Joi.string().max(250).allow(null, ''),
  LoyaltyID: Joi.string().max(250).allow(null, ''),
  LoyaltyRegisteredPhNo: Joi.string().max(250).allow(null, ''),
  LoyaltyFlag: Joi.string().max(250).allow(null, ''),
  EnrolDate: Joi.string().max(250).allow(null, ''),
  DeEnrolDate: Joi.string().max(250).allow(null, ''),
  RecallFlag: Joi.string().max(250).allow(null, ''),
  CurrentNetworkCode: Joi.string().max(250).allow(null, ''),
  CurrentNetworkName: Joi.string().max(250).allow(null, ''),
  CustomerFlag: Joi.string().max(250).allow(null, ''),
  CustomerCategory: Joi.string().max(250).allow(null, ''),
  CurrentNetworkType: Joi.string().max(250).allow(null, ''),
  CurrentMainDealerName: Joi.string().max(250).allow(null, ''),
  PermiumAMCPeriod: Joi.string().max(250).allow(null, ''),
  EWPLUSDealer: Joi.string().max(250).allow(null, ''),
  EWPLUSStartDate: Joi.string().max(250).allow(null, ''),
  EWPLUSEndDate: Joi.string().max(250).allow(null, ''),
  DataMask: Joi.string().max(250).allow(null, ''),
  Created_by: Joi.string().max(100).allow(null, '')
});


module.exports = { _PurchaseListImport , PurchaseListImportSchema}