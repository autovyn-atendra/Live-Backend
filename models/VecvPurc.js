const Sequelize = require('sequelize');
const _VecvPurc = function(sequelize, DataTypes) {
  return sequelize.define('VecvPurc', {
    ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    PurchType: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    PurchOrdNo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    PurchOrdType: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    PurchOrdDesc: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    PoLineItem: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    RefPo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    VendorCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    PoDate: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    SoNo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    GrNo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    GrDate: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    GrQty: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    MatModelCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    MatModelCodeDesc: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Quantity: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    OrderUnit: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    InboundDelNo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    VendorInvNo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    VendorInvDate: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    VendorInvQty: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    DealerPlant: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    NpdPerUnit: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    NetDealerPrice: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    GrAmt: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    MrpPrice: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    MatType: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ListPrcPerUnit: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    PoTime: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    GrTime: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    VehInvTime: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    AutoManual: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    TotalTaxAmt: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    TaxAmt: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Amount: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    HsnCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    OdnNo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    OtherCharges: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    HandlingCharges: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    AddlTax: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    TaxCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    CgstRate: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    SgstRate: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    IgstRate: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    TaxDesc: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    LedgerCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    VendorName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    VendPlantCodeVehPuch: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    VendPlantDescVehPuch: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    SupplierGstn: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    StorageBin: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    DlrPlanttDesc: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    AppLevel: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    AppDecision: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    AppUserId: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    LubrListPrcPu: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    LubrNetPrc: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    LocalPartPrcPu: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ListPrice: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    LocalPartPrice: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    PartsDiscount: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    MsoDiscount: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    CashDiscount: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    DiscountPerOnMrp: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    AbsoluteDiscount: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    PrNo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    PrLineItem: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    PrDate: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    PrQty: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    EccOutboundVehPuch: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    EpodDate: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    EpodTime: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    EpodAgeing: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    TpodDate: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    TpodAgeing: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    State: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    PigstRegNo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Vertical: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    MarkType: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ProdDivision: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ProdSegment: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ProdCategory: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Tonnage: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ProdType: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    MatPricingGrp: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    DistrChannelVehPuch: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ChassisNo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    EngineNo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    SapInternalNoVehPuch: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    VecvInvNoVehPuch: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    VecvInvDateVehPuch: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    OdnNoVehPuch: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    MrpVehPuch: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    TradeDiscount: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    EarlyBirdSchm: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    AddStkSchm: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    NdpVehPurch: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    DiscpriorPrd1: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    BulkDiscountVehPuch: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    EntryTaxVehPuch: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    DiscPriorPrd2: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    AddCommission: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Optionals: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    SpecialDiscountVehPuch: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    PriceCorrection: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    NpdNetVehPuch: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    InvBeforeTaxVehPuch: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    CgstRatePerVehPuch: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    CgstValueVehPuch: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    SgstRatePerVehPuch: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    SgstValueVehPuch: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    IgstRatePerVehPuch: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    IgstValueVehPuch: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    TaxTypeVehPuch: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    VecvInvAmtVehPuch: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    LrNo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    FiDocumentVehPuch: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    CompanyCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Vecv_Purc',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Vecv_Pur__3214EC270F804A3B",
        unique: true,
        fields: [
          { name: "ID" },
        ]
      },
    ]
  });
};
module.exports = { _VecvPurc };
