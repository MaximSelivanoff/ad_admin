#!/usr/bin/env node

const path = require('path');
const { sequelize, User } = require('./src/models');

async function runMigrations() {
  try {
    console.log('Starting migrations...');
    
    // First, sync database to create tables
    console.log('Creating tables...');
    await sequelize.sync({ alter: true });
    console.log('✓ Tables created/updated');

    // Then run migrations
    const migration = require('./migrations/add_position_to_users');
    await migration.up(sequelize);
    
    console.log('✓ Migrations completed successfully');

    // Check if database is empty, seed if needed
    const userCount = await User.count();
    if (userCount === 0) {
      console.log('\n📦 Database is empty, running seed data...');
      require('./seeders/seedUsers');
    } else {
      console.log(`✓ Database already contains ${userCount} users`);
      process.exit(0);
    }
  } catch (error) {
    console.error('✗ Migration failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

runMigrations();
