const Sequelize = require('sequelize');
const _TvFields = function (sequelize, DataTypes) {
  return sequelize.define('TvFields', {
    UTD: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    FieldName: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    isActive: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Created_by: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'TvFields',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__TvFields__C5B6F0D2D4C11B33",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};

module.exports = { _TvFields }