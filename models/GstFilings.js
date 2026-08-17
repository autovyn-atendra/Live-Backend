const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('GstFilings', {
    Utd: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    GSTNo: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    GSTR1_1: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    valid_GSTR1_1: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    GSTR3B_1: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    valid_GSTR3B_1: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    GSTR1_2: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    valid_GSTR1_2: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    GSTR3B_2: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    valid_GSTR3B_2: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    GSTR1_3: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    valid_GSTR1_3: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    GSTR3B_3: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    valid_GSTR3B_3: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    GSTR1_4: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    valid_GSTR1_4: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    GSTR3B_4: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    valid_GSTR3B_4: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    GSTR1_5: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    valid_GSTR1_5: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    GSTR3B_5: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    valid_GSTR3B_5: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    GSTR1_6: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    valid_GSTR1_6: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    GSTR3B_6: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    valid_GSTR3B_6: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    GSTR1_7: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    valid_GSTR1_7: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    GSTR3B_7: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    valid_GSTR3B_7: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    GSTR1_8: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    valid_GSTR1_8: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    GSTR3B_8: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    valid_GSTR3B_8: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    GSTR1_9: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    valid_GSTR1_9: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    GSTR3B_9: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    valid_GSTR3B_9: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    GSTR1_10: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    valid_GSTR1_10: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    GSTR3B_10: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    valid_GSTR3B_10: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    GSTR1_11: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    valid_GSTR1_11: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    GSTR3B_11: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    valid_GSTR3B_11: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    GSTR1_12: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    valid_GSTR1_12: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    GSTR3B_12: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    valid_GSTR3B_12: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    Created_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('getdate')
    }
  }, {
    sequelize,
    tableName: 'GSTFilings',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__GSTFilin__C5B2047ABD4ED070",
        unique: true,
        fields: [
          { name: "Utd" },
        ]
      },
    ]
  });
};
