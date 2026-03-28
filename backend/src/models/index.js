const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../data/itsm.db'),
  logging: false
});

const User = require('./User')(sequelize);
const Department = require('./Department')(sequelize);
const Location = require('./Location')(sequelize);
const Role = require('./Role')(sequelize);
const AuditLog = require('./AuditLog')(sequelize);

// Relations
Department.hasMany(User, { foreignKey: 'departmentId' });
User.belongsTo(Department, { foreignKey: 'departmentId' });

Location.hasMany(User, { foreignKey: 'locationId' });
User.belongsTo(Location, { foreignKey: 'locationId' });

Role.hasMany(User, { foreignKey: 'roleId' });
User.belongsTo(Role, { foreignKey: 'roleId' });

User.hasMany(AuditLog, { foreignKey: 'userId' });
AuditLog.belongsTo(User, { foreignKey: 'userId' });

module.exports = { sequelize, User, Department, Location, Role, AuditLog };
