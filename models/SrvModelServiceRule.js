const _SrvModelServiceRule = function (sequelize, DataTypes) {
  return sequelize.define(
    "Srv_Model_Service_Rule_Tbl",
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

      Model_Name: {
        type: DataTypes.STRING(256),
        allowNull: true,
      },

      Service_Interval_KM: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      Service_Interval_Days: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      Rule_Type: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },

      Reminder_Before_Days_1: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      Reminder_Before_Days_2: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      Reminder_On_Due_Date: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },

      Overdue_Reminder_Days: {
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
      tableName: "Srv_Model_Service_Rule_Tbl",
      timestamps: false,
      freezeTableName: true,
    }
  );
};

module.exports = { _SrvModelServiceRule };