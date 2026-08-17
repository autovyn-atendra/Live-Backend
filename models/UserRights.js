const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('UserRights', {
    utd: {
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
    Optn_Name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Module_Code: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Comp_Usercode: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'User_Rights',
    schema: 'dbo',
    timestamps: false,
    indexes: [
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
