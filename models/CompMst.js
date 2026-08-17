const Sequelize = require('sequelize');
const _CompMst = function(sequelize, DataTypes) {
  return sequelize.define('CompMst', {
    Comp_Code: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Comp_Name: {
      type: DataTypes.STRING(75),
      allowNull: false
    },
    Comp_Add1: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Comp_Add2: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Comp_Add3: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Spl_Rem: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Fin_SYear: {
      type: "SMALLDATETIME",
      allowNull: false
    },
    Fin_EYear: {
      type: "SMALLDATETIME",
      allowNull: false
    },
    Left_Head1: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Left_Head2: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Right_Head1: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Right_Head2: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Dlr_Code: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    State: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    City: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Pack_Type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ServerId: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    Export_Type: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    Cur_Symb: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Dec_Port: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Attn_lock: {
      type: "SMALLDATETIME",
      allowNull: false
    },
    DMS_city: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    Bill_Currency: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    Bank_Name: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    Bank_Ac: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    Bank_Branch: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    Bank_IFSC: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    State_Code: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    GSTIN: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    Loc_Abbr: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    comp_tin: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    comp_cin: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    DMS_Dlr_Code: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    Lock_Date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    Emp_Grup: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Turn_Over: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: false
    },
    Print_B2CQR: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: false
    },
    GST_Lock_Date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    INPUT_GST_LOCK_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    Pwd_Change_Days: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Pwd_Strength: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    BankApiEnabled: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Grp_Lvl: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Br_PL_Ledg: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Br_PL_From: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    BRANCH_LOCK_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Comp_Mst',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Comp_Mst__34D18239E24FE2BF",
        unique: true,
        fields: [
          { name: "Comp_Code" },
        ]
      },
    ]
  });
};



const Joi = require('joi');

const compMstSchema = Joi.object({
    Comp_Code: Joi.number().integer().required(),
    Comp_Name: Joi.string().max(75).required(),
    Comp_Add1: Joi.string().max(100).required(),
    Comp_Add2: Joi.string().max(100).required(),
    Comp_Add3: Joi.string().max(100).required(),
    Spl_Rem: Joi.string().max(100).required(),
    Fin_SYear: Joi.date().iso().required(),
    Fin_EYear: Joi.date().iso().required(),
    Left_Head1: Joi.string().max(50).required(),
    Left_Head2: Joi.string().max(50).required(),
    Right_Head1: Joi.string().max(50).required(),
    Right_Head2: Joi.string().max(50).required(),
    Dlr_Code: Joi.string().max(50).required(),
    State: Joi.string().max(50).required(),
    City: Joi.string().max(50).required(),
    Pack_Type: Joi.number().integer().required(),
    ServerId: Joi.number().integer().required(),
    Export_Type: Joi.number().integer(),
    Cur_Symb: Joi.string().max(255),
    Dec_Port: Joi.string().max(255),
    Attn_lock: Joi.date().iso().required(),
    DMS_city: Joi.string().max(20).required(),
    Bill_Currency: Joi.number().integer().required(),
    Bank_Name: Joi.string().max(60).required(),
    Bank_Ac: Joi.string().max(60).required(),
    Bank_Branch: Joi.string().max(60).required(),
    Bank_IFSC: Joi.string().max(25).required(),
    State_Code: Joi.number().integer().required(),
    GSTIN: Joi.string().max(20).required(),
    Loc_Abbr: Joi.string().max(10).required(),
    comp_tin: Joi.string().max(30).required(),
    comp_cin: Joi.string().max(30).required(),
    DMS_Dlr_Code: Joi.string().max(30).required(),
    Lock_Date: Joi.date().iso().required(),
    Emp_Grup: Joi.number().integer().required(),
    Turn_Over: Joi.number().precision(19).required(),
    Print_B2CQR: Joi.number().precision(19).required(),
    GST_Lock_Date: Joi.date().iso().required(),
    INPUT_GST_LOCK_DATE: Joi.date().iso().required(),
    Pwd_Change_Days: Joi.number().integer().required(),
    Pwd_Strength: Joi.number().integer().required(),
    BankApiEnabled: Joi.number().integer().required(),
    Grp_Lvl: Joi.number().integer().required(),
    Br_PL_Ledg: Joi.number().integer().required(),
    Br_PL_From: Joi.date().iso().required(),
    BRANCH_LOCK_DATE: Joi.date().iso(),
    ValidFrom: Joi.date().iso().required(),
    ValidTo: Joi.date().iso().required()
});

module.exports = {_CompMst, compMstSchema};
