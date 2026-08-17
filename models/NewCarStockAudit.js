const Sequelize = require('sequelize');
const _NewCarStockAudit = function (sequelize, DataTypes) {
  return sequelize.define('NewCarStockAudit', {
    UTD: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    vin: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    chassis: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    engine: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    model_color: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    model_name: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    model_code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Loc_Code: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'NewCar_StockAudit',
    schema: 'dbo',
    timestamps: false,
  });
};

const _NewCarAuditLogs = function (sequelize, DataTypes) {
  return sequelize.define('NewCarAuditLogs', {
    UTD: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    qr_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    User_Code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    EMPCODE: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Loc_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Latitude: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Longitude: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    VIN: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Remark: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    AuditTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    Type: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Location: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Phy_Location1: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Phy_Location2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'NewCar_AuditLogs',
    schema: 'dbo',
    timestamps: false
  });
};

module.exports = {
  _NewCarAuditLogs,
  _NewCarStockAudit
}