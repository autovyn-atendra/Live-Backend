const Sequelize = require('sequelize');

const _AdnlDiscountMaster = function (sequelize, DataTypes) {
  return sequelize.define('AdnlDiscountMaster', {
    UTD: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Group_Code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Discount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Branch: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    validfrom: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    validTo: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    CREATED_BY: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Adnl_Discount_Master',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_AdnlDiscountMaster_UTD",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};

module.exports = { _AdnlDiscountMaster };
