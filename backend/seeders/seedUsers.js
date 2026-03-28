const bcrypt = require('bcryptjs');
const { sequelize, User, Department, Location, Role } = require('../src/models');

const departments = [
  { name: 'IT', code: 'IT' },
  { name: 'HR', code: 'HR' },
  { name: 'Finance', code: 'FIN' },
  { name: 'Sales', code: 'SALES' },
  { name: 'Marketing', code: 'MKT' },
  { name: 'Operations', code: 'OPS' },
  { name: 'Legal', code: 'LEG' },
  { name: 'Support', code: 'SUP' }
];

const locations = [
  { name: 'Moscow Office', code: 'MOW', address: 'Moscow, Russia' },
  { name: 'St. Petersburg Office', code: 'SPB', address: 'St. Petersburg, Russia' },
  { name: 'London Office', code: 'LON', address: 'London, UK' },
  { name: 'New York Office', code: 'NYC', address: 'New York, USA' },
  { name: 'Berlin Office', code: 'BER', address: 'Berlin, Germany' }
];

const roles = [
  { name: 'Administrator', code: 'admin', permissions: ['all'] },
  { name: 'Developer', code: 'developer', permissions: ['read', 'write'] },
  { name: 'Support Engineer', code: 'support', permissions: ['read', 'ticket'] },
  { name: 'Manager', code: 'manager', permissions: ['read', 'approve'] },
  { name: 'Viewer', code: 'viewer', permissions: ['read'] }
];

const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'Robert', 'Olivia', 'William', 'Sophia', 'James', 'Isabella', 'Alexander', 'Mia', 'Daniel', 'Charlotte', 'Matthew', 'Amelia', 'Andrew', 'Harper'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

async function seed() {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced');

    const deptRecords = await Department.bulkCreate(departments);
    const locRecords = await Location.bulkCreate(locations);
    const roleRecords = await Role.bulkCreate(roles);
    console.log('Reference data seeded');

    // Create admin user
    const adminPasswordHash = await bcrypt.hash('admin', 10);
    const adminRole = roleRecords.find(r => r.code === 'admin');
    const adminDept = deptRecords[0];
    const adminLoc = locRecords[0];

    await User.create({
      username: 'admin',
      email: 'admin@company.com',
      firstName: 'Admin',
      lastName: 'User',
      phone: '+1-555-0000',
      avatar: 'https://i.pravatar.cc/150?u=admin',
      departmentId: adminDept.id,
      locationId: adminLoc.id,
      roleId: adminRole.id,
      position: 'System Administrator',
      status: 'active',
      passwordHash: adminPasswordHash,
      adSynced: true,
      adGuid: 'admin-guid-001'
    });
    console.log('✓ Admin user created (admin/admin)');

    const users = [];
    for (let i = 0; i < 1200; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}`;
      const email = `${username}@company.com`;
      const status = Math.random() > 0.15 ? 'active' : 'inactive';
      const lastLogin = status === 'active' && Math.random() > 0.2 
        ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) 
        : null;

      const positions = ['System Administrator', 'Developer', 'Support Engineer', 'IT Manager', 'HR Specialist', 'Sales Executive', 'Marketing Analyst', 'Operations Lead'];
      const position = positions[Math.floor(Math.random() * positions.length)];

      users.push({
        username,
        email,
        firstName,
        lastName,
        phone: `+1-${Math.floor(Math.random()*900)+100}-${Math.floor(Math.random()*900)+100}-${Math.floor(Math.random()*9000)+1000}`,
        avatar: `https://i.pravatar.cc/150?u=${username}`,
        departmentId: deptRecords[Math.floor(Math.random() * deptRecords.length)].id,
        locationId: locRecords[Math.floor(Math.random() * locRecords.length)].id,
        roleId: roleRecords[Math.floor(Math.random() * roleRecords.length)].id,
        position,
        status,
        lastLoginAt: lastLogin,
        adSynced: Math.random() > 0.3,
        adGuid: `ad-guid-${i}-${Date.now()}`
      });
    }

    await User.bulkCreate(users, { batchSize: 100 });
    console.log('1200 users seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
