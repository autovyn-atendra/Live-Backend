const Sequelize = require('sequelize');
const _Salarystructure = function (sequelize, DataTypes) {
  return sequelize.define('Salarystructure', {
    Emp_Code: {
      type: DataTypes.STRING(20),
      allowNull: true,
      primaryKey: true
    },
    Gross_Salary: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Basic: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    HRA: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Conveyance: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Medical: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Other: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Loc_Code: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    ServerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Rec_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Effective_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Uniform: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Washing: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Daily_Wages: {
  type: DataTypes.DECIMAL(19, 4),
  allowNull: true
},
    Export_Type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ENTR_USER: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ENTR_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    ENTR_TIME: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    ENTR_PC: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Mod_User: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MOD_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    MOD_TIME: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    MOD_PC: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    // UTD: {
    //   autoIncrement: true,
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   primaryKey: true
    // }
  }, {
    sequelize,
    tableName: 'SALARYSTRUCTURE',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__SALARYST__C5B6F0D2DA9DEBE7",
        unique: true,
        fields: [
          { name: "UTD" },
        ]
      },
    ]
  });
};


module.exports = { _Salarystructure }