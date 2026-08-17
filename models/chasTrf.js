const Sequelize = require("sequelize");

const _ChasTrf = function (sequelize, DataTypes) {
  return sequelize.define(
    "ChasTrf",
    {
      TRAN_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      CHAS_ID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      TRF_NO: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      DOC_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      TRF_TO: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Veh_Modl: {
        type: DataTypes.STRING(60),
        allowNull: true
      },
      Color: {
        type: DataTypes.STRING(60),
        allowNull: true
      },
      VIN: {
        type: DataTypes.STRING(30),
        allowNull: true
      },
      Chas_No: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      Engn_No: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      DSE: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      Remark: {
        type: DataTypes.STRING(150),
        allowNull: true
      },
      USR_CODE: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      ENTR_DATE: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      TRF_IN: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      TRFIN_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      TRFIN_USER: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Export_Type: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1
      },
      Loc_Code: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Driver: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      TrfOut_DRD_ID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Out_Time: {
        type: DataTypes.TIME,
        allowNull: true
      },
      In_Time: {
        type: DataTypes.TIME,
        allowNull: true
      },
      Item_Type: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Driver_Mob: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
    },
    {
      sequelize,
      tableName: "CHAS_TRF",
      schema: "dbo",
      timestamps: false,
      indexes: [
        {
          name: "PK_CHAS_TRF",
          unique: true,
          fields: [{ name: "TRAN_ID" }],
        },
      ],
    }
  );
};

module.exports = { _ChasTrf };
