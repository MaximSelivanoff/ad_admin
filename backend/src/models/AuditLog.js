const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('AuditLog', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    action: { type: DataTypes.STRING, allowNull: false },
    entityType: { type: DataTypes.STRING },
    entityId: { type: DataTypes.INTEGER },
    details: { type: DataTypes.JSON },
    ipAddress: { type: DataTypes.STRING }
  }, { tableName: 'audit_logs', timestamps: true });
};
