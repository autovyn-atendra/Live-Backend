const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('UserMst', {
    Id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    User_Code: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User_Creds',
        key: 'User_Code'
      }
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    pan: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    aadharcard: {
      type: DataTypes.STRING(12),
      allowNull: true
    },
    Department: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Designation: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    User_Full_Name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    EMPCODE: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    emp_dms_code: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Comp_Code: {
      type: DataTypes.STRING(10),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'User_Mst',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__User_Mst__3214EC073BB7C21D",
        unique: true,
        fields: [
          { name: "Id" },
        ]
      },
    ]
  });
};
