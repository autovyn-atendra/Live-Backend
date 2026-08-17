const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CloudQuery', {
    Query1: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    Query2: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    Query3: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    Query4: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    Query5: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    Query6: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    Query7: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    Query8: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    Query9: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    Query10: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    Query11: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    Query12: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    Query13: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    Query14: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    Query15: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    Query16: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    Query17: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    Query18: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    Query19: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    Query20: {
      type: DataTypes.STRING(2000),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'CLOUD_QUERY',
    schema: 'dbo',
    timestamps: false
  });
};
