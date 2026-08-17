const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Roaster', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    SRNO: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Emp_Code: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Date_From: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    Date_Upto: {
      type: "SMALLDATETIME",
      allowNull: true
    },
    Start_Time: {
      type: DataTypes.TIME,
      allowNull: true
    },
    End_Time: {
      type: DataTypes.TIME,
      allowNull: true
    },
    Loc_Code: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    ServerId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    priority_code: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    Created_At: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'Roaster',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Roaster__C5B6F0D2C0281D09",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};

