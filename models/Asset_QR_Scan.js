const _AssetQRAudit = function (sequelize, DataTypes) {
  return sequelize.define(
    "Asset_QR_Audit",
    {
      Id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      Empcode: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Asset_Id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Asset_Name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      AssetCode: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      Category: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      SubCategory: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Location: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Export_Type: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Device_Id: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      Created_by: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Audit_Address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "Asset_QR_Audit",
      schema: "dbo",
      timestamps: false,
    }
  );
};

module.exports = { _AssetQRAudit };
