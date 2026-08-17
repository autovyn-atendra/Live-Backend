const Sequelize = require('sequelize');
const _AnnouncementUsers = function (sequelize, DataTypes) {
  return sequelize.define('AnnouncementUsers', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    announcement_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    employee_code: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    ReadDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    created: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'announcement_users',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__announce__3213E83F355D6A77",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "unique_announcement_employee",
        unique: true,
        fields: [
          { name: "announcement_id" },
          { name: "employee_code" },
        ]
      },
    ]
  });
};

module.exports = { _AnnouncementUsers };