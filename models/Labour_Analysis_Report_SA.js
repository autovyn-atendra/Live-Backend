const { DataTypes } = require('sequelize');

const _Labour_Analysis_Report_SA = (sequelize) => {
  return sequelize.define('LabourBillingSA', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    DealerName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    DealerCity: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Location: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Loc_Code: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    LabourCode: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    LabourDesc: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    BillNo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ServiceAdvisorTechnicianName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    JcNum: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    JcDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    CustomerName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    RegistrationNo: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Model: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    BillDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    BillDesc: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    BasicAmt: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    DiscountAmt: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    ChargesAmt: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    BillAmt: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    NetLabour: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    Created_By: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Labour_Analysis_Report_SA',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_Labour_Analysis_Report_SA",
        unique: true,
        fields: [{ name: "UTD" }]
      }
    ]
  });
};

const Joi = require('joi');
const _Labour_Analysis_ReportSASchema = Joi.object({
  UTD: Joi.number().integer().positive(),
  DealerName: Joi.string().max(255).allow(null, ''),
  DealerCity: Joi.string().max(100).allow(null, ''),
  Location: Joi.string().max(100).allow(null, ''),
  Loc_Code: Joi.alternatives()
  .try(Joi.string().max(20), Joi.number().custom((value) => String(value))) 
  .allow(null, ''),
  LabourCode: Joi.string().max(50).allow(null, ''),
  LabourDesc: Joi.string().max(255).allow(null, ''),
  BillNo: Joi.string().max(50).allow(null, ''),
  ServiceAdvisorTechnicianName: Joi.string().max(100).allow(null, ''),
  JcNum: Joi.string().max(50).allow(null, ''),
  JcDate: Joi.date().iso().allow(null),
  CustomerName: Joi.string().max(100).allow(null, ''),
  RegistrationNo: Joi.alternatives()
  .try(Joi.string().max(20), Joi.number().custom((value) => String(value))) 
  .allow(null, ''),
  Model: Joi.string().max(100).allow(null, ''),
  BillDate: Joi.date().iso().allow(null),
  BillDesc: Joi.string().max(100).allow(null, ''),
  BasicAmt: Joi.number().precision(2).allow(null),
  DiscountAmt: Joi.number().precision(2).allow(null),
  ChargesAmt: Joi.number().precision(2).allow(null),
  BillAmt: Joi.number().precision(2).allow(null),
  NetLabour: Joi.number().precision(2).allow(null),
  Created_By: Joi.string().max(255).allow(null, '')
});

module.exports = {_Labour_Analysis_Report_SA,_Labour_Analysis_ReportSASchema };
