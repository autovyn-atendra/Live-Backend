const Sequelize = require("sequelize");

const Insu_Renewal_Mst = (sequelize, DataTypes) => {
  return sequelize.define(
    "InsuRenewalMst",
    {
      UTD: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

      VEHICAL_REG_NO: { type: DataTypes.STRING(20), allowNull: true },

      EXPORT_TYPE: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 1 },

      CREATED_AT: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.fn("GETDATE") },

      // GENERATED ALWAYS (temporal)
      VALIDFROM: { type: DataTypes.DATE, allowNull: true },
      VALIDTO: { type: DataTypes.DATE, allowNull: true },
    },
    {
      tableName: "INSU_RENEWAL_MST",
      schema: "dbo",
      timestamps: false,
    }
  );
};

module.exports = { Insu_Renewal_Mst };

