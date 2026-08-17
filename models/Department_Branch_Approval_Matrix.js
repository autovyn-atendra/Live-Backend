const Sequelize = require('sequelize');

const _DepartmentBranchApprovalMatrix = function (sequelize, DataTypes) {
  return sequelize.define('Department_Branch_Approval_Matrix', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    module_code: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    department: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    branch: {
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
    approver1_C: {
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
    approver2_C: {
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
    approver3_C: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Created_by: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Department_Branch_Approval_Matrix',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_Department_Branch_Approval_Matrix",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};


module.exports = { _DepartmentBranchApprovalMatrix};
