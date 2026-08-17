const Sequelize = require('sequelize');
const _MarutiPayoutScheme = function (sequelize, DataTypes) {
  return sequelize.define('MarutiPayoutScheme', {
    UTD: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    Model_Cd: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    Fuel_Type: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Slab: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Price: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: true
    },
    Mnth: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    yr: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Target: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    export_type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    user_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    edit_time: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'Maruti_Payout_Scheme',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__EMPLOYEE__C5B6F0D2CD78DFC6",
        unique: true,
        fields: [{ name: "UTD" }],
      },
    ],
  });
};
module.exports = { _MarutiPayoutScheme };