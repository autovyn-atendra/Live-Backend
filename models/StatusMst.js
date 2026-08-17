const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('StatusMst', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Desc: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    Early_Go: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Late_Come: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Allow_Days: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Priority_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Region: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    WEF: {
      type: DataTypes.DATE,
      allowNull: false
    },
    HALF: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Frequency0: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    HALF_VAL: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Created_At: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'Status_Mst',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Status_M__C5B6F0D291A41F5C",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};
