const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BranchDms', {
    Utd: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Godw_Code: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    Div_Code: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    Div_Name: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    Div_Add1: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Div_Add2: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Div_Add3: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    BR_DMDT: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    BR_DMS: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    BR_MI: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    BR_EXTRANET: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    DMS_HSN_Code: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    DMS_TV_Code: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    DMS_Purc_Code: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    DMS_BT_Code: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    DMS_PART_TRFOUT: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    DMS_PART_TRFIN: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    BR_RECEIPT: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    NEWCAR_RCPT: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Created_At: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'Branch_Dms',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Branch_D__C5B2047A3417D901",
        unique: true,
        fields: [
          { name: "Utd" },
        ]
      },
    ]
  });
};
