const Sequelize = require('sequelize');
const _BodyShopA = function (sequelize, DataTypes) {
  return sequelize.define('BodyShopA', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    batch_id: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Region: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Consignee_Code: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Dealer_Code: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    FOR_Code: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Outlet_code: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Location_Code: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Part_Category: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Part_Num: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Root_Part_Num: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Part_Description: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Financial_Year: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Financial_Month: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Month_Year: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Day: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Sale_Type: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Service_Description: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Variant_Name: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Variant_Code: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    JobCard_Num: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Dealer_Seq_No: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Document_Num: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Service_Advisor: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Vehicle_Registration_Num: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Base_Model_Name: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Net_Retail_DDL_wo_CO_DDL_DDT: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Net_Retail_Qty_wo_CO_DDL_DDT: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Created_date: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'BodyShop_A',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__BodyShop__3213E83F3F417502",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};

const _BodyShopB = function (sequelize, DataTypes) {
  return sequelize.define('BodyShopB', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    batch_id: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    DEALER_CODE: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    CONSIGNEE_CODE: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    MARUTI_ORDER_NO: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    DEALER_ORDER_NO: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    ORDER_TYPE: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    PART_NUMBER: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    PART_NAME: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    ALLOCATED_QTY: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    LOCATION: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Created_date: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'BodyShop_B',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__BodyShop__3213E83F8D6FFA6E",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
const _BodyShopC = function (sequelize, DataTypes) {
  return sequelize.define('BodyShopC', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    batch_id: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Dealer_Code: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Consignee_Code: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Maruti_Order_No: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Dealer_Order_No: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Part_Number: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Part_Name: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Order_Type: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Order_Qty: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Advanced_Order_Qty: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Back_Order_Qty: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Location: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Created_date: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'BodyShop_C',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__BodyShop__3213E83F88ADEFD2",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
const _BodyShopD = function (sequelize, DataTypes) {
  return sequelize.define('BodyShopD', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    batch_id: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Dealer_Code: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Consignee_Code: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Type: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    FIN_Ctrl_No: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Invoice_Date: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Value: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Gate_Pass_No: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Gate_Pass_Date: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Goods_Reciept_No: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Goods_Reciept_Date: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Transporter: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Truck_No: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Location: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Created_date: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'BodyShop_D',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__BodyShop__3213E83F983CB486",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
const _BodyShopE = function (sequelize, DataTypes) {
  return sequelize.define('BodyShopE', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    batch_id: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Dlr_Code: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Con_Code: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    MSIL_Order_No: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Dlr_Order_No: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Part_No: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Part_Name: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Pick_Qty: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Pick_Ticket_No: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Type: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    FIN_Ctrl_No: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Invoice_No: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Invoice_Date: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Gate_Pass_No: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Gate_Pass_Date: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Location: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Created_date: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'BodyShop_E',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__BodyShop__3213E83F55615F09",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
const _BodyShopF = function (sequelize, DataTypes) {
  return sequelize.define('BodyShopF', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    batch_id: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Category: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Dlr_Code: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Cons_Code: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    MSIL_Batch_No: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Batch_Date: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Dealer_Order_No: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Order_Category: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Order_Type: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    VALUE: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Status: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Location: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Created_date: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'BodyShop_F',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__BodyShop__3213E83F09B6A40A",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
const _BodyShopG = function (sequelize, DataTypes) {
  return sequelize.define('BodyShopG', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    batch_id: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Maruti_Ord_No: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Dlr_Ord_No: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    ORD_DATE: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    ORD_TYPE: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Pick_Ticket_No: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Part_No: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    PART_NAME: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    ALLOC_QTY: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    LOCATION: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Created_date: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'BodyShop_G',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__BodyShop__3213E83FBEF88C68",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
}
const _BodyShopH = function (sequelize, DataTypes) {
  return sequelize.define('BodyShopH', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    batch_id: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Dealer_Region_Code: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Dealer_City: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    MSIL_Service_Dealer_Code: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Dealer_FOR_Code: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Dealer_Outlet_Code: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Dealer_Name: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Service_Type_Description: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Holdup_JobCard_No: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    JobCard_Status: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    JobCard_Open_Date: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Promised_Date: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Date: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Holdup_Reason: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Odometer_Reading: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Model_Name: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Repeat_Flag: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Revised_Sugg_Promise_Date: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Suggested_Promise_Date: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Eng_Tran_Repair: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Part_Replacement: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Cutting_Welding: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    No_of_Panels: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Type_of_Insurance: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Revised_Promise_Date: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Insurance_Approval_Date: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Payable_By: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Reg_Num: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    HoldUp_days_from_JC_opening: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Holdup_day_Beyond_Promise_Time: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Colour_Code: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Colour_Description: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Created_date: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'BodyShop_H',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__BodyShop__3213E83F7BCCB28C",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
const _BodyShopI = function (sequelize, DataTypes) {
  return sequelize.define('BodyShopI', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    batch_id: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    DMS_Loc: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Requisition_No: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Requisition_Dt: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Reg_No: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Job_Card_No: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Customer_Name: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Part_No: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Part_Desc: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Bin_Location: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Requested_Qty: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Issued_Qty: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Pending_Qty: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Stock_Qty: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Selling_Price: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Part_Flagging: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    DMS_Order_No: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Order_Date: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Created_date: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'BodyShop_I',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__BodyShop__3213E83F42C9680E",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
const _BodyShopJ = function (sequelize, DataTypes) {
  return sequelize.define('BodyShopJ', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    batch_id: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    DLR_CODE: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    CONS_CODE: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Maruti_Ord_No: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    DlrOrd_No: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    ORD_TYPE: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Pick_Ticket_No: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    PART_NUMBER: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    PART_NAME: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    PICKED_QTY: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    LOCATION: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Created_date: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'BodyShop_J',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__BodyShop__3213E83FC7087863",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
const _BodyShopK = function (sequelize, DataTypes) {
  return sequelize.define('BodyShopK', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    batch_id: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Dealer_Ord_No: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    MSIL_Batch_No: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    MSIL_Ord_No: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Ord_Date: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Part_No: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Error: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Created_date: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'BodyShop_K',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__BodyShop__3213E83FC7087863",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
const _BodyShopL = function (sequelize, DataTypes) {
  return sequelize.define('BodyShopL', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    batch_id: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    LOCATION: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    STAGE: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    CUSTOMER: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    CONSIGNEE: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    ORDER_REFRENCE_NO: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    BATCH_NUMBER: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    ORDER_NUMBER: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    ORDER_CATG: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    ORDER_TYPE: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    BATCH_ORDER_DATE: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    ORDER_PART_NUMBER: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    SERVE_PART_NUMBER: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    ORDER_QTY: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    ACTUAL_QTY: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    PICT_TICKET_NO: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    PICT_TICKET_DATE: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    INVOICE_NUMBER: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    INVOICE_DATE: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    GRVR_NUMBER: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    GRVR_DATE: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    MGPA_NUMBER: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    MGPA_DATE: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    EXPECTED_TIME_OF_ARRIVAL: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    Created_date: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'BodyShop_L',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__BodyShop__3213E83F9706A480",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};

module.exports = {
  _BodyShopA,
  _BodyShopB,
  _BodyShopC,
  _BodyShopD,
  _BodyShopE,
  _BodyShopF,
  _BodyShopG,
  _BodyShopH,
  _BodyShopI,
  _BodyShopJ,
  _BodyShopK,
  _BodyShopL
}