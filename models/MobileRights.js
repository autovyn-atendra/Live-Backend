const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('MobileRights', {
    utd: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Emp_Code: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    Optn_Name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Module_Code: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    USER_CODE: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Mobile_Rights',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        unique: true, // Enforces uniqueness
        fields: ['Emp_Code', 'Optn_Name'], // Combination of these two fields must be unique
      },
      {
        name: "PK__User_Rig__DD7774CCCB21FDDE",
        unique: true,
        fields: [
          { name: "utd" },
        ]
      },
    ]
  });
};
