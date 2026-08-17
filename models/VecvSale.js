const Sequelize = require('sequelize');
const _VecvSale = function(sequelize, DataTypes) {
  return sequelize.define('VecvSale', {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    PostingDate: {
      type: DataTypes.STRING(8),
      allowNull: true
    },
    Vbeln: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    SalesType: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    CompanyCode: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    PlantCode: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    PlantDesc: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    SoldPartyCcode: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    SoldPartyCname: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ShipPartyCcode: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    ShipPartyCname: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    CustGstin: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    BillCustCode: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    BillCustName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    BillCustCno: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    CustBillScode: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    CustBillPincode: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    BillPartyCgstin: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    BillLocation: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Quantity: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    SalesOrderNo: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    SalessOdate: {
      type: DataTypes.STRING(8),
      allowNull: true
    },
    SalesOtype: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    DocDate: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    ItemNo: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    MaterialNo: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    InvoiceValue: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    HsnCode: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    ItemDescr: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    TaxCode: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    TaxCodeDescr: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    CgstBaseValue: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    CgstRate: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    CgstAmount: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    SgstBaseValue: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    SgstRate: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    SgstAmount: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    IgstBaseValue: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    IgstRate: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    IgstAmount: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    DealerInvNo: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    VehicleRegNo: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    BillFromShipFrom: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    EwayBillNo: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    SupplyPlace: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    SupplyPlaceCode: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    InvoiceCancelled: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    InvoiceTypeDescr: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    TcsTax: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    MpgDescription: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ChassisNo: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    SaleDealNo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Verticle: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    EngineNo: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Cess: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    TcsValue: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    TcsAmount: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    SrnDate: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    SrnReason: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    SrnNo: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    InvoiceNo: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    BillMonth: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    BillYear: {
      type: DataTypes.STRING(4),
      allowNull: true
    },
    DseCode: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    DseName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    VecvInvNo: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    VecvInvDate: {
      type: DataTypes.STRING(8),
      allowNull: true
    },
    VecvSoNo: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    SoNo: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    BodyBuildingCode: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    InvoiceAmount: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    PlantGstRegno: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    CessValue: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    ShipFromLoc: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    CustBillSname: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    CustShipStcode: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    FinancerName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    PanNo: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Vecv_Sale',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Vecv_Sal__3214EC27CF42355E",
        unique: true,
        fields: [
          { name: "ID" },
        ]
      },
    ]
  });
};
module.exports = { _VecvSale };
