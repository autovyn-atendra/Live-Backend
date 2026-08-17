const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ModelVariantMaster', {
    MODEL_VARIANT_MASTER_ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    MODEL_CD: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    MODEL_DESC: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    VARIANT_CD: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    VARIANT_DESC: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    ECOLOR_CD: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    ECOLOR_DESC: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    created_date: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    AX_FLAG: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    Created_At: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('getdate')
    },
    Created_by: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    ValidFrom: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('getdate')
    },
    ValidTo: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'model_variant_master',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__model_va__B0EED0F089FD278C",
        unique: true,
        fields: [
          { name: "MODEL_VARIANT_MASTER_ID" },
        ]
      },
    ]
  });
};
