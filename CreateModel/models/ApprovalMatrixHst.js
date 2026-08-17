const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ApprovalMatrixHst', {
    UTD: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    module_code: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    empcode: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    approver1_A: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    approver1_B: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    approver2_A: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    approver2_B: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    approver3_A: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    approver3_B: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Created_At: {
      type: DataTypes.DATE,
      allowNull: false
    },
    ValidFrom: {
      type: DataTypes.DATE,
      allowNull: false
    },
    ValidTo: {
      type: DataTypes.DATE,
      allowNull: false
    },
    Created_by: {
      type: DataTypes.STRING(30),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Approval_Matrix_Hst',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "ix_Approval_Matrix_Hst",
        fields: [
          { name: "ValidTo" },
          { name: "ValidFrom" },
        ]
      },
    ]
  });
};
