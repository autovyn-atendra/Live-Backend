const _SrvCustVehi = function (sequelize, DataTypes) {
  return sequelize.define(
    "Srv_Cust_Vehi_Tbl",
    {
      UTD: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },

      Loc_Code: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },

      Veh_Reg_No: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },

      Cust_Name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      Cust_Mob: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },

      Model_Name: {
        type: DataTypes.STRING(256),
        allowNull: true,
      },

      Last_Service_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },

      Last_Service_KM: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      Avg_Daily_KM: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },

      Current_KM: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      Created_By: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      Created_At: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },

      Updated_By: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      Updated_At: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "Srv_Cust_Vehi_Tbl",
      timestamps: false,
      freezeTableName: true,
    }
  );
};

module.exports = { _SrvCustVehi };