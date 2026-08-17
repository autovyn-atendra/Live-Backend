const Sequelize = require('sequelize');
const _VecvWart = function(sequelize, DataTypes) {
  return sequelize.define('VecvWart', {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ZplantCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ZplantDescription: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ZplantGstRegNo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ZbillToCustCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ZbillCustName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ZbillCustContactNo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ZcustBillStateCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ZcustBillStateName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ZcustBillPinCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ZbillCustGstin: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ZbillLocation: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ZplaceSupply: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ZplaceSupply1: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ZclaimNo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ZexternalClaimNo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ZclaimType: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ZsalesOrderNo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ZinvCreDebSupple: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ZdocumentDate: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ZpostingDate: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ZitemNo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Zmatnr: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ZdesItem: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ZclaimApprovalDate: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Zquant: {
      type: DataTypes.DECIMAL(18,3),
      allowNull: true
    },
    Zuom: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Zbukrs: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Zdate: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ZmaterialType: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ZinvoiceValue: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    ZtaxCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ZigstAmt: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    ZigstRate: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ZigstBaseValue: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    ZsgstAmt: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    ZsgstRate: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ZsgstBaseValue: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    ZcgstAmt: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    ZcgstRate: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ZcgstBaseValue: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Ztds: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    ZtaxCodeDes: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ZhsnCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Vecv_wart',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Vecv_war__3214EC270AC8569E",
        unique: true,
        fields: [
          { name: "ID" },
        ]
      },
    ]
  });
};

module.exports = { _VecvWart };
