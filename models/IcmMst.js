const Sequelize = require('sequelize');
const _IcmMst = function (sequelize, DataTypes) {
  return sequelize.define('IcmMst', {
    TRAN_ID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Tran_Type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DRD_ID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    INV_No: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    INV_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    DMS_Inv: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Cust_Id: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    File_No: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    File_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    drpTitle: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    drpTitl: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Ledg_Name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Ledg_Add1: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Ledg_Add2: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    Teh_Code: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Stat_Code: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Ph1: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Email_Id: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    drpCustType: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Pin_Code: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Pan_No: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    GST_No: {
      type: DataTypes.STRING(16),
      allowNull: true
    },
    Nomi_Name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Rel_Code: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    NDOB: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Fin_Code: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Br_Code: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Fin_Dono: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Pymt_Mode: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Modl_Grp: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Modl_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Veh_Clr: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Chas_Id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Chas_No: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Engn_No: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    DMS_DSE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ERP_DSE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DMS_TL: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ERP_TL: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Spl_Rem: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    Fin_Payout: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    DSE_Payout: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Veh_Cost: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Totl_Disc: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    OnRoad_Price: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Rect_Tot: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Bank_Rcpt: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Net_Bal: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    User_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    PC_Name: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    ENTR_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    ENTR_TIME: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    ServerId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    EXPORT_TYPE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Loc_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Veh_Del: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Del_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Org_Loc: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DO_AMT: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    VIN: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Del_CustId: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    FFin_Code: {
      type: DataTypes.STRING(70),
      allowNull: true
    },
    FBr_Code: {
      type: DataTypes.STRING(70),
      allowNull: true
    },
    FPymt_Mode: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    FERP_DSE: {
      type: DataTypes.STRING(70),
      allowNull: true
    },
    FERP_TL: {
      type: DataTypes.STRING(70),
      allowNull: true
    },
    Payout_Rate: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Payout_Amt: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Payout_GST: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Net_Payout: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    FLoan_Status: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    FLoan_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    FBank_Name: {
      type: DataTypes.STRING(70),
      allowNull: true
    },
    FAccount_No: {
      type: DataTypes.STRING(70),
      allowNull: true
    },
    FRecd_Amt: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    FCredit_Ref: {
      type: DataTypes.STRING(70),
      allowNull: true
    },
    FRemark: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    Delv_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Full_Pymt: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    PO_No: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    PO_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    PO_Amt: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Prty_Name_1: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Party_Trf_Amt_1: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Party_Rem_1: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Prty_Name_2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Party_Trf_Amt_2: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Party_Rem_2: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Prty_Name_3: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Party_Trf_Amt_3: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Party_Rem_3: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    PF_Charges: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Old_Car_Status: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Temp_No: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    FORM16: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    GP_Seq: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    GP_Prefix: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    GP_DATETIME: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    FUEL_TYPE: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    DO_Pymt_Recd: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    TV_Pymt_Recd: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    TV_Pymt_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    TV_JV_No: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    PO_Pymt_Recd: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    GM_Rem: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    IsMgmt: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DMS_FINANCIER: {
      type: DataTypes.STRING(120),
      allowNull: true
    },
    TV_AMT: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Ledg_Acnt: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    EW_Pending: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    FT_Pending: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    AC_Pending: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Disc_Apr_by: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Prty_Name_4: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Party_Trf_Amt_4: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Party_Rem_4: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Prty_Name_5: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Party_Trf_Amt_5: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Party_Rem_5: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Prty_Name_6: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Party_Trf_Amt_6: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Party_Rem_6: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Prty_Trf_Acnt_Id_1: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Prty_Trf_Acnt_Id_2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Prty_Trf_Acnt_Id_3: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Prty_Trf_Acnt_Id_4: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Prty_Trf_Acnt_Id_5: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Prty_Trf_Acnt_Id_6: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Dist_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Village: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    Aadhar_No: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    FASTAG_Number: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    MSSF_Id: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    PRICE_DT: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    DUAL_TONE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ICM_Verified: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Verify_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Verify_By: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DO_Pymt_Recd_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    ADNL_MGA_DISC: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Key_No: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Invoice_Regn_No: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    OS_Clear: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Book_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Del_OS: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inv_Number: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    GP_User: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Aproved_Adnl_Disc: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    TV_INV_No: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    GUID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Created_by: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ICM_MST',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__ICM_MST__15B69B8E4430AC8D",
        unique: true,
        fields: [
          { name: "GUID" },
        ]
      },
    ]
  });
};



const Joi = require('joi');

const IcmMstSchema = Joi.object({
  TRAN_ID: Joi.number().optional().allow(null, ''),
  Tran_Type: Joi.number().optional().allow(null, ''),
  DRD_ID: Joi.number().optional().allow(null, ''),
  INV_No: Joi.number().optional().allow(null, ''),
  INV_Date: Joi.date().raw().optional().allow(null, ''),
  DMS_Inv: Joi.string().max(30).optional().allow(null, ''),
  Cust_Id: Joi.string().max(30).optional().allow(null, ''),
  File_No: Joi.number().optional().allow(null, ''),
  File_Date: Joi.date().raw().optional().allow(null, ''),
  drpTitle: Joi.string().max(10).optional().allow(null, ''),
  drpTitl: Joi.string().max(10).optional().allow(null, ''),
  Ledg_Name: Joi.string().max(100).optional().allow(null, ''),
  Ledg_Add1: Joi.string().max(100).optional().allow(null, ''),
  Ledg_Add2: Joi.string().max(300).optional().allow(null, ''),
  Teh_Code: Joi.string().max(10).optional().allow(null, ''),
  Stat_Code: Joi.string().max(10).optional().allow(null, ''),
  Ph1: Joi.string().max(30).optional().allow(null, ''),
  Email_Id: Joi.string().max(40).optional().allow(null, ''),
  drpCustType: Joi.number().optional().allow(null, ''),
  Pin_Code: Joi.string().max(10).optional().allow(null, ''),
  Pan_No: Joi.string().max(30).optional().allow(null, ''),
  GST_No: Joi.string().max(16).optional().allow(null, ''),
  Nomi_Name: Joi.string().max(50).optional().allow(null, ''),
  Rel_Code: Joi.string().max(10).optional().allow(null, ''),
  NDOB: Joi.date().raw().optional().allow(null, ''),
  Fin_Code: Joi.string().max(10).optional().allow(null, ''),
  Br_Code: Joi.string().max(30).optional().allow(null, ''),
  Fin_Dono: Joi.string().max(30).optional().allow(null, ''),
  Pymt_Mode: Joi.number().optional().allow(null, ''),
  Modl_Grp: Joi.number().optional().allow(null, ''),
  Modl_Code: Joi.number().optional().allow(null, ''),
  Veh_Clr: Joi.number().optional().allow(null, ''),
  Chas_Id: Joi.number().optional().allow(null, ''),
  Chas_No: Joi.string().max(30).optional().allow(null, ''),
  Engn_No: Joi.string().max(30).optional().allow(null, ''),
  DMS_DSE: Joi.number().optional().allow(null, ''),
  ERP_DSE: Joi.number().optional().allow(null, ''),
  DMS_TL: Joi.number().optional().allow(null, ''),
  ERP_TL: Joi.number().optional().allow(null, ''),
  Spl_Rem: Joi.string().max(200).optional().allow(null, ''),
  Fin_Payout: Joi.number().precision(4).optional().allow(null, ''),
  DSE_Payout: Joi.number().precision(4).optional().allow(null, ''),
  Veh_Cost: Joi.number().precision(4).optional().allow(null, ''),
  Totl_Disc: Joi.number().precision(4).optional().allow(null, ''),
  OnRoad_Price: Joi.number().precision(4).optional().allow(null, ''),
  Rect_Tot: Joi.number().precision(4).optional().allow(null, ''),
  Bank_Rcpt: Joi.number().precision(4).optional().allow(null, ''),
  Net_Bal: Joi.number().precision(4).optional().allow(null, ''),
  User_Code: Joi.number().optional().allow(null, ''),
  PC_Name: Joi.string().max(30).optional().allow(null, ''),
  ENTR_DATE: Joi.date().raw().optional().allow(null, ''),
  ENTR_TIME: Joi.number().precision(4).optional().allow(null, ''),
  ServerId: Joi.number().optional().allow(null, ''),
  EXPORT_TYPE: Joi.number().optional().allow(null, ''),
  Loc_Code: Joi.number().optional().allow(null, ''),
  Veh_Del: Joi.number().optional().allow(null, ''),
  Del_Date: Joi.date().raw().optional().allow(null, ''),
  Org_Loc: Joi.number().optional().allow(null, ''),
  DO_AMT: Joi.number().precision(4).optional().allow(null, ''),
  VIN: Joi.string().max(25).optional().allow(null, ''),
  Del_CustId: Joi.string().max(25).optional().allow(null, ''),
  FFin_Code: Joi.string().max(70).optional().allow(null, ''),
  FBr_Code: Joi.string().max(70).optional().allow(null, ''),
  FPymt_Mode: Joi.string().max(20).optional().allow(null, ''),
  FERP_DSE: Joi.string().max(70).optional().allow(null, ''),
  FERP_TL: Joi.string().max(70).optional().allow(null, ''),
  Payout_Rate: Joi.number().precision(4).optional().allow(null, ''),
  Payout_Amt: Joi.number().precision(4).optional().allow(null, ''),
  Payout_GST: Joi.number().precision(4).optional().allow(null, ''),
  Net_Payout: Joi.number().precision(4).optional().allow(null, ''),
  FLoan_Status: Joi.string().max(10).optional().allow(null, ''),
  FLoan_Date: Joi.date().raw().optional().allow(null, ''),
  FBank_Name: Joi.string().max(70).optional().allow(null, ''),
  FAccount_No: Joi.string().max(70).optional().allow(null, ''),
  FRecd_Amt: Joi.number().precision(4).optional().allow(null, ''),
  FCredit_Ref: Joi.string().max(70).optional().allow(null, ''),
  FRemark: Joi.string().max(150).optional().allow(null, ''),
  Delv_Date: Joi.date().raw().optional().allow(null, ''),
  Full_Pymt: Joi.number().optional().allow(null, ''),
  PO_No: Joi.string().max(100).optional().allow(null, ''),
  PO_Date: Joi.date().raw().optional().allow(null, ''),
  PO_Amt: Joi.number().precision(4).optional().allow(null, ''),
  Prty_Name_1: Joi.number().optional().allow(null, ''),
  Party_Trf_Amt_1: Joi.number().precision(4).optional().allow(null, ''),
  Party_Rem_1: Joi.string().max(100).optional().allow(null, ''),
  Prty_Name_2: Joi.number().optional().allow(null, ''),
  Party_Trf_Amt_2: Joi.number().precision(4).optional().allow(null, ''),
  Party_Rem_2: Joi.string().max(100).optional().allow(null, ''),
  Prty_Name_3: Joi.number().optional().allow(null, ''),
  Party_Trf_Amt_3: Joi.number().precision(4).optional().allow(null, ''),
  Party_Rem_3: Joi.string().max(100).optional().allow(null, ''),
  PF_Charges: Joi.number().precision(4).optional().allow(null, ''),
  Old_Car_Status: Joi.string().max(30).optional().allow(null, ''),
  Temp_No: Joi.string().max(30).optional().allow(null, ''),
  FORM16: Joi.number().optional().allow(null, ''),
  GP_Seq: Joi.number().optional().allow(null, ''),
  GP_Prefix: Joi.string().max(20).optional().allow(null, ''),
  GP_DATETIME: Joi.string().max(30).optional().allow(null, ''),
  FUEL_TYPE: Joi.string().max(20).optional().allow(null, ''),
  DO_Pymt_Recd: Joi.number().optional().allow(null, ''),
  TV_Pymt_Recd: Joi.number().precision(4).optional().allow(null, ''),
  TV_Pymt_Date: Joi.date().raw().optional().allow(null, ''),
  TV_JV_No: Joi.string().max(20).optional().allow(null, ''),
  PO_Pymt_Recd: Joi.number().precision(4).optional().allow(null, ''),
  GM_Rem: Joi.string().max(300).optional().allow(null, ''),
  IsMgmt: Joi.number().optional().allow(null, ''),
  DMS_FINANCIER: Joi.string().max(120).optional().allow(null, ''),
  TV_AMT: Joi.number().precision(4).optional().allow(null, ''),
  Ledg_Acnt: Joi.number().optional().allow(null, ''),
  EW_Pending: Joi.number().optional().allow(null, ''),
  FT_Pending: Joi.number().optional().allow(null, ''),
  AC_Pending: Joi.number().optional().allow(null, ''),
  Disc_Apr_by: Joi.string().max(30).optional().allow(null, ''),
  Prty_Name_4: Joi.number().optional().allow(null, ''),
  Party_Trf_Amt_4: Joi.number().precision(4).optional().allow(null, ''),
  Party_Rem_4: Joi.string().max(100).optional().allow(null, ''),
  Prty_Name_5: Joi.number().optional().allow(null, ''),
  Party_Trf_Amt_5: Joi.number().precision(4).optional().allow(null, ''),
  Party_Rem_5: Joi.string().max(100).optional().allow(null, ''),
});

module.exports = { _IcmMst, IcmMstSchema };
