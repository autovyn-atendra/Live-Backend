const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Login', {
    username: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(15),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'login',
    schema: 'dbo',
    timestamps: false
  });
};
