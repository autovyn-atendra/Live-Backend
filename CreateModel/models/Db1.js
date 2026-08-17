const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Db1', {
    tran_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    server_ip: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    port_no: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    dlr_id: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    db_name: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    export_type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    year: {
      type: DataTypes.STRING(10),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'db1',
    schema: 'dbo',
    timestamps: false
  });
};
