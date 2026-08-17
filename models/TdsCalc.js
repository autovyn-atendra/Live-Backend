const Sequelize = require('sequelize');
const _TDS_CALC = function (sequelize, DataTypes) {
  return sequelize.define('TdsCalc', {
    Tran_Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Emp_Code: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Emp_Name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    PAN_No: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Designation: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    BrLocation: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Residence: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Salaried: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Emp_Add: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    Landlord_PAN: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    PF: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Age: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Apr_01: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Apr_02: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Apr_03: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Apr_04: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Apr_05: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Apr_06: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Apr_07: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Apr_08: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Apr_09: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Apr_10: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Apr_11: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Apr_12: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Apr_13: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Apr_14: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    May_01: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    May_02: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    May_03: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    May_04: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    May_05: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    May_06: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    May_07: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    May_08: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    May_09: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    May_10: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    May_11: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    May_12: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    May_13: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    May_14: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    June_01: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    June_02: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    June_03: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    June_04: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    June_05: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    June_06: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    June_07: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    June_08: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    June_09: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    June_10: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    June_11: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    June_12: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    June_13: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    June_14: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Jul_01: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Jul_02: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Jul_03: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Jul_04: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Jul_05: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Jul_06: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Jul_07: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Jul_08: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Jul_09: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Jul_10: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Jul_11: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Jul_12: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Jul_13: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Jul_14: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Aug_01: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Aug_02: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Aug_03: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Aug_04: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Aug_05: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Aug_06: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Aug_07: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Aug_08: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Aug_09: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Aug_10: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Aug_11: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Aug_12: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Aug_13: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Aug_14: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Sep_01: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Sep_02: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Sep_03: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Sep_04: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Sep_05: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Sep_06: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Sep_07: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Sep_08: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Sep_09: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Sep_10: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Sep_11: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Sep_12: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Sep_13: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Sep_14: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Oct_01: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Oct_02: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Oct_03: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Oct_04: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Oct_05: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Oct_06: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Oct_07: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Oct_08: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Oct_09: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Oct_10: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Oct_11: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Oct_12: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Oct_13: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Oct_14: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Nov_01: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Nov_02: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Nov_03: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Nov_04: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Nov_05: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Nov_06: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Nov_07: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Nov_08: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Nov_09: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Nov_10: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Nov_11: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Nov_12: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Nov_13: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Nov_14: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Dec_01: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Dec_02: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Dec_03: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Dec_04: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Dec_05: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Dec_06: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Dec_07: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Dec_08: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Dec_09: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Dec_10: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Dec_11: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Dec_12: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Dec_13: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Dec_14: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Jan_01: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Jan_02: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Jan_03: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Jan_04: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Jan_05: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Jan_06: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Jan_07: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Jan_08: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Jan_09: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Jan_10: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Jan_11: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Jan_12: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Jan_13: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Jan_14: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Feb_01: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Feb_02: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Feb_03: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Feb_04: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Feb_05: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Feb_06: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Feb_07: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Feb_08: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Feb_09: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Feb_10: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Feb_11: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Feb_12: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Feb_13: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Feb_14: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Mar_01: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Mar_02: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Mar_03: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Mar_04: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Mar_05: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Mar_06: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Mar_07: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Mar_08: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Mar_09: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Mar_10: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Mar_11: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Mar_12: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Mar_13: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Mar_14: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Tot_01: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Tot_02: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Tot_03: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Tot_04: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Tot_05: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Tot_06: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Tot_07: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Tot_08: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Tot_09: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Tot_10: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Tot_11: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Tot_12: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Tot_13: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Tot_14: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inv_01: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inv_02: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inv_03: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inv_04: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inv_05: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inv_06: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inv_07: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inv_08: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inv_09: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inv_10_1: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inv_10_2: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inv_11: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inv_12_1: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inv_12_2: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inv_13_1: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inv_13_2: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inc_01: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inc_02: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inc_03: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inc_04: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inc_05: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inc_06: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inc_07: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inc_08: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inc_09: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inc_10: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inc_11: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inc_12: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inc_13: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inc_14: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inc_15: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inc_16: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inc_17: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inc_18: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inc_19: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inc_20: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inc_21: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inc_22: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inc_23: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inc_24: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inc_25: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inc_26: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inc_27: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inc_28: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Inc_29: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Ded_80C_1: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Ded_80C_2: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Ded_80D_1: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Ded_80D_2: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Ded_80G_Head: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Ded_80G_1: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Ded_80G_2: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Totl_Ded: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Net_Inc_1: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Net_Inc_2: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Tax_Payable: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Rebate_87A: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Surcharge: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Edu_Cess: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Totl_Tax: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    TDS_Deducation: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Bal_Tax: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    FY_Mnth: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Avg_Tds: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Loc_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    USR_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Export_Type: {
      type: DataTypes.INTEGER,
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
    MOD_USER: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Tax_Slab: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MOD_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    MOD_TIME: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'TDS_CALC',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__TDS_CALC__950EE6B07FECA12C",
        unique: true,
        fields: [
          { name: "Tran_Id" },
        ]
      },
    ]
  });
};


const Joi = require('joi');

const tdsCalcSchema = Joi.object({
  Tran_Id: Joi.number().integer().optional(),
  Emp_Code: Joi.string().max(25).optional(),
  Emp_Name: Joi.string().max(100).optional(),
  PAN_No: Joi.string().max(20).optional(),
  Designation: Joi.string().max(100).optional(),
  BrLocation: Joi.string().max(100).optional(),
  Residence: Joi.string().max(30).optional(),
  Salaried: Joi.string().max(30).optional(),
  Emp_Add: Joi.string().max(200).optional(),
  Landlord_PAN: Joi.string().max(20).optional(),
  PF: Joi.string().max(20).optional(),
  Age: Joi.number().integer().optional(),
  Apr_01: Joi.number().precision(4).optional(),
  Apr_02: Joi.number().precision(4).optional(),
  Apr_03: Joi.number().precision(4).optional(),
  Apr_04: Joi.number().precision(4).optional(),
  Apr_05: Joi.number().precision(4).optional(),
  Apr_06: Joi.number().precision(4).optional(),
  Apr_07: Joi.number().precision(4).optional(),
  Apr_08: Joi.number().precision(4).optional(),
  Apr_09: Joi.number().precision(4).optional(),
  Apr_10: Joi.number().precision(4).optional(),
  Apr_11: Joi.number().precision(4).optional(),
  Apr_12: Joi.number().precision(4).optional(),
  Apr_13: Joi.number().precision(4).optional(),
  Apr_14: Joi.number().precision(4).optional(),
  May_01: Joi.number().precision(4).optional(),
  May_02: Joi.number().precision(4).optional(),
  May_03: Joi.number().precision(4).optional(),
  May_04: Joi.number().precision(4).optional(),
  May_05: Joi.number().precision(4).optional(),
  May_06: Joi.number().precision(4).optional(),
  May_07: Joi.number().precision(4).optional(),
  May_08: Joi.number().precision(4).optional(),
  May_09: Joi.number().precision(4).optional(),
  May_10: Joi.number().precision(4).optional(),
  May_11: Joi.number().precision(4).optional(),
  May_12: Joi.number().precision(4).optional(),
  May_13: Joi.number().precision(4).optional(),
  May_14: Joi.number().precision(4).optional(),
  June_01: Joi.number().precision(4).optional(),
  June_02: Joi.number().precision(4).optional(),
  June_03: Joi.number().precision(4).optional(),
  June_04: Joi.number().precision(4).optional(),
  June_05: Joi.number().precision(4).optional(),
  June_06: Joi.number().precision(4).optional(),
  June_07: Joi.number().precision(4).optional(),
  June_08: Joi.number().precision(4).optional(),
  June_09: Joi.number().precision(4).optional(),
  June_10: Joi.number().precision(4).optional(),
  June_11: Joi.number().precision(4).optional(),
  June_12: Joi.number().precision(4).optional(),
  June_13: Joi.number().precision(4).optional(),
  June_14: Joi.number().precision(4).optional(),
  Jul_01: Joi.number().precision(4).optional(),
  Jul_02: Joi.number().precision(4).optional(),
  Jul_03: Joi.number().precision(4).optional(),
  Jul_04: Joi.number().precision(4).optional(),
  Jul_05: Joi.number().precision(4).optional(),
  Jul_06: Joi.number().precision(4).optional(),
  Jul_07: Joi.number().precision(4).optional(),
  Jul_08: Joi.number().precision(4).optional(),
  Jul_09: Joi.number().precision(4).optional(),
  Jul_10: Joi.number().precision(4).optional(),
  Jul_11: Joi.number().precision(4).optional(),
  Jul_12: Joi.number().precision(4).optional(),
  Jul_13: Joi.number().precision(4).optional(),
  Jul_14: Joi.number().precision(4).optional(),
  Aug_01: Joi.number().precision(4).optional(),
  Aug_02: Joi.number().precision(4).optional(),
  Aug_03: Joi.number().precision(4).optional(),
  Aug_04: Joi.number().precision(4).optional(),
  Aug_05: Joi.number().precision(4).optional(),
  Aug_06: Joi.number().precision(4).optional(),
  Aug_07: Joi.number().precision(4).optional(),
  Aug_08: Joi.number().precision(4).optional(),
  Aug_09: Joi.number().precision(4).optional(),
  Aug_10: Joi.number().precision(4).optional(),
  Aug_11: Joi.number().precision(4).optional(),
  Aug_12: Joi.number().precision(4).optional(),
  Aug_13: Joi.number().precision(4).optional(),
  Aug_14: Joi.number().precision(4).optional(),
  Sep_01: Joi.number().precision(4).optional(),
  Sep_02: Joi.number().precision(4).optional(),
  Sep_03: Joi.number().precision(4).optional(),
  Sep_04: Joi.number().precision(4).optional(),
  Sep_05: Joi.number().precision(4).optional(),
  Sep_06: Joi.number().precision(4).optional(),
  Sep_07: Joi.number().precision(4).optional(),
  Sep_08: Joi.number().precision(4).optional(),
  Sep_09: Joi.number().precision(4).optional(),
  Sep_10: Joi.number().precision(4).optional(),
  Sep_11: Joi.number().precision(4).optional(),
  Sep_12: Joi.number().precision(4).optional(),
  Sep_13: Joi.number().precision(4).optional(),
  Sep_14: Joi.number().precision(4).optional(),
  Oct_01: Joi.number().precision(4).optional(),
  Oct_02: Joi.number().precision(4).optional(),
  Oct_03: Joi.number().precision(4).optional(),
  Oct_04: Joi.number().precision(4).optional(),
  Oct_05: Joi.number().precision(4).optional(),
  Oct_06: Joi.number().precision(4).optional(),
  Oct_07: Joi.number().precision(4).optional(),
  Oct_08: Joi.number().precision(4).optional(),
  Oct_09: Joi.number().precision(4).optional(),
  Oct_10: Joi.number().precision(4).optional(),
  Oct_11: Joi.number().precision(4).optional(),
  Oct_12: Joi.number().precision(4).optional(),
  Oct_13: Joi.number().precision(4).optional(),
  Oct_14: Joi.number().precision(4).optional(),
  Nov_01: Joi.number().precision(4).optional(),
  Nov_02: Joi.number().precision(4).optional(),
  Nov_03: Joi.number().precision(4).optional(),
  Nov_04: Joi.number().precision(4).optional(),
  Nov_05: Joi.number().precision(4).optional(),
  Nov_06: Joi.number().precision(4).optional(),
  Nov_07: Joi.number().precision(4).optional(),
  Nov_08: Joi.number().precision(4).optional(),
  Nov_09: Joi.number().precision(4).optional(),
  Nov_10: Joi.number().precision(4).optional(),
  Nov_11: Joi.number().precision(4).optional(),
  Nov_12: Joi.number().precision(4).optional(),
  Nov_13: Joi.number().precision(4).optional(),
  Nov_14: Joi.number().precision(4).optional(),
  Dec_01: Joi.number().precision(4).optional(),
  Dec_02: Joi.number().precision(4).optional(),
  Dec_03: Joi.number().precision(4).optional(),
  Dec_04: Joi.number().precision(4).optional(),
  Dec_05: Joi.number().precision(4).optional(),
  Dec_06: Joi.number().precision(4).optional(),
  Dec_07: Joi.number().precision(4).optional(),
  Dec_08: Joi.number().precision(4).optional(),
  Dec_09: Joi.number().precision(4).optional(),
  Dec_10: Joi.number().precision(4).optional(),
  Dec_11: Joi.number().precision(4).optional(),
  Dec_12: Joi.number().precision(4).optional(),
  Dec_13: Joi.number().precision(4).optional(),
  Dec_14: Joi.number().precision(4).optional(),
  Jan_01: Joi.number().precision(4).optional(),
  Jan_02: Joi.number().precision(4).optional(),
  Jan_03: Joi.number().precision(4).optional(),
  Jan_04: Joi.number().precision(4).optional(),
  Jan_05: Joi.number().precision(4).optional(),
  Jan_06: Joi.number().precision(4).optional(),
  Jan_07: Joi.number().precision(4).optional(),
  Jan_08: Joi.number().precision(4).optional(),
  Jan_09: Joi.number().precision(4).optional(),
  Jan_10: Joi.number().precision(4).optional(),
  Jan_11: Joi.number().precision(4).optional(),
  Jan_12: Joi.number().precision(4).optional(),
  Jan_13: Joi.number().precision(4).optional(),
  Jan_14: Joi.number().precision(4).optional(),
  Feb_01: Joi.number().precision(4).optional(),
  Feb_02: Joi.number().precision(4).optional(),
  Feb_03: Joi.number().precision(4).optional(),
  Feb_04: Joi.number().precision(4).optional(),
  Feb_05: Joi.number().precision(4).optional(),
  Feb_06: Joi.number().precision(4).optional(),
  Feb_07: Joi.number().precision(4).optional(),
  Feb_08: Joi.number().precision(4).optional(),
  Feb_09: Joi.number().precision(4).optional(),
  Feb_10: Joi.number().precision(4).optional(),
  Feb_11: Joi.number().precision(4).optional(),
  Feb_12: Joi.number().precision(4).optional(),
  Feb_13: Joi.number().precision(4).optional(),
  Feb_14: Joi.number().precision(4).optional(),
  Mar_01: Joi.number().precision(4).optional(),
  Mar_02: Joi.number().precision(4).optional(),
  Mar_03: Joi.number().precision(4).optional(),
  Mar_04: Joi.number().precision(4).optional(),
  Mar_05: Joi.number().precision(4).optional(),
  Mar_06: Joi.number().precision(4).optional(),
  Mar_07: Joi.number().precision(4).optional(),
  Mar_08: Joi.number().precision(4).optional(),
  Mar_09: Joi.number().precision(4).optional(),
  Mar_10: Joi.number().precision(4).optional(),
  Mar_11: Joi.number().precision(4).optional(),
  Mar_12: Joi.number().precision(4).optional(),
  Mar_13: Joi.number().precision(4).optional(),
  Mar_14: Joi.number().precision(4).optional(),
  FY_Year: Joi.number().precision(2).optional(),
  TaxDed_YTD: Joi.number().precision(4).optional(),
  TaxDed_Prev_Yr: Joi.number().precision(4).optional(),
  TaxDed_Arrear_Yr: Joi.number().precision(4).optional(),
  TaxDed_Current_Yr: Joi.number().precision(4).optional(),
  TaxPayable: Joi.number().precision(4).optional(),
  TaxPaid: Joi.number().precision(4).optional(),
  TaxBalance: Joi.number().precision(4).optional(),
  Createby: Joi.string().max(25).optional(),
  Createdt: Joi.date().optional(),
  Updateby: Joi.string().max(25).optional(),
  Updatedt: Joi.date().optional(),
  FY_Mnth: Joi.number().integer().optional(),
  Month_Name: Joi.string().max(10).optional(),
  Active: Joi.string().max(10).optional(),
  Tax_Slab: Joi.number().precision(4).optional(),
});

module.exports = { _TDS_CALC, tdsCalcSchema };
