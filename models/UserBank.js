const Sequelize = require('sequelize');
const _USER_BANK = function (sequelize, DataTypes) {
  return sequelize.define('USERBANK', {
    User_Code: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    User_Full_Name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    User_WA: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    User_Mail: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    Limit_1: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true,
    },
    Limit_2: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true,
    },
    Limit_3: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true,
    },
    Limit_4: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true,
    },
    Limit_5: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true,
    },
    Limit_6: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true,
    },
    Bank_Rights: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    Mod_User: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Mod_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    Mod_Time: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true,
    },
    Export_Type: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true,
    },
    User_Name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    Re_Init: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Allow_Post: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Limit_7: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true,
    },
    Limit_8: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true,
    },
    Limit_9: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true,
    },
    Limit_10: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true,
    },
    Limit_11: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true,
    },
    Limit_12: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true,
    },
    Is_Admin: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Show_Statement: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Show_Balance: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    sequelize,
    tableName: 'USER_BANK',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Product___C5B6F0D28FFEE240",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};




module.exports =  _USER_BANK ;

