const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Session', {
    sid: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    sess: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    expire: {
      type: DataTypes.DATE,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Session',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Session__DDDFDD3647A3EF6F",
        unique: true,
        fields: [
          { name: "sid" },
        ]
      },
    ]
  });
};
