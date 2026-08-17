const Sequelize = require('sequelize');
const _InterviewSideTables = function (sequelize, DataTypes) {
  return sequelize.define('InterviewSideTables', {
    Utd: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    SRNO: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    SNo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Tbl_Type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Emp_Company: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Emp_Designation: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Emp_Responsibility: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Emp_From_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Emp_To_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Emp_Settlement_Done: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Emp_Drawn_Salary: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Emp_Leaving_Reason: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Emp_Degree: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Emp_Board: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Emp_College: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Emp_Passing_year: {
      type: DataTypes.STRING(4),
      allowNull: true
    },
    Emp_Percentage: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Emp_Tool: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Emp_Version: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Emp_Proficiency: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Emp_Last_Used: {
      type: DataTypes.STRING(4),
      allowNull: true
    },
    Emp_Experience: {
      type: DataTypes.STRING(4),
      allowNull: true
    },
    Emp_Language: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Emp_Language_Understand: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Emp_Language_Speak: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Emp_Language_Read: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Emp_Language_Write: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Emp_Ref_Name: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Emp_Ref_Occup: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Emp_Ref_Address: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Emp_Ref_Mobile: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Emp_Ref_emailid: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Emp_Ref_relation: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Nominee_Name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Member_Name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Relation: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Percentage: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Is_Minor: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Created_by: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    Created_At: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: 'Interview_sideTables',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Intervie__C5B2047AB21D332C",
        unique: true,
        fields: [
          { name: "Utd" },
        ]
      },
    ]
  });
};


module.exports = { _InterviewSideTables };