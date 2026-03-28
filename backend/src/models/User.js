const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING },
    avatar: { type: DataTypes.STRING },
    departmentId: { type: DataTypes.INTEGER, allowNull: false },
    locationId: { type: DataTypes.INTEGER, allowNull: false },
    roleId: { type: DataTypes.INTEGER, allowNull: false },
    position: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.ENUM('active', 'inactive'), defaultValue: 'active' },
    lastLoginAt: { type: DataTypes.DATE },
    adSynced: { type: DataTypes.BOOLEAN, defaultValue: false },
    adGuid: { type: DataTypes.STRING },
    passwordHash: { type: DataTypes.STRING },
    deletedAt: { type: DataTypes.DATE, allowNull: true }
  }, {
    tableName: 'users',
    timestamps: true
  });
};
