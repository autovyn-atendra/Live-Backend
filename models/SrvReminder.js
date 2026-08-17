const _SrvReminder = function (sequelize, DataTypes) {
  return sequelize.define(
    "Srv_Reminder_Tbl",
    {
      UTD: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },

      Cust_Vehi_UTD: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      Service_Rule_UTD: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      Loc_Code: {
        type: DataTypes.STRING(50),
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

      Current_KM: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      Avg_Daily_KM: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },

      Next_Service_KM: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      Date_Based_Due_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },

      KM_Based_Due_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },

      Final_Due_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },

      Reminder_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },

      Reminder_Type: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },

      Reminder_Channel: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },

      Reminder_Status: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },

      Reminder_Count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      Last_Reminder_At: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      Call_Status: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },

      Customer_Response: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      Followup_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },

      Followup_Remark: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },

      Current_KM_Verified: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      Contacted_By: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      Appointment_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },

      Appointment_Time: {
        type: DataTypes.TIME,
        allowNull: true,
      },

      Appointment_Status: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },

      Appointment_Remark: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },

      Service_Status: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },

      Service_Completed_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },

      Service_Completed_KM: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      Service_Remark: {
        type: DataTypes.STRING(1000),
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
      tableName: "Srv_Reminder_Tbl",
      timestamps: false,
      freezeTableName: true,
    }
  );
};

module.exports = { _SrvReminder };