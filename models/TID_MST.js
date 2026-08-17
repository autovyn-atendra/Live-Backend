const Sequelize = require("sequelize");

const _TID_MST = function (sequelize, DataTypes) {
  return sequelize.define(
    "TID_MST",
    {
      TID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      SRNO: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      TERMS: {
        type: DataTypes.TEXT, // varchar(MAX)
        allowNull: true,
      },

      SEGMENT_CODE: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      EXPORT_TYPE: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      Created_By: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      tableName: "TID_MST",
      schema: "dbo",
      timestamps: false,
    }
  );
};

module.exports = { _TID_MST };
