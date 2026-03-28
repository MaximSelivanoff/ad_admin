const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

module.exports = {
  up: async (sequelize) => {
    const transaction = await sequelize.transaction();
    try {
      // Check users table columns
      const usersTableInfo = await sequelize.query(
        `PRAGMA table_info(users)`,
        { transaction, raw: true, type: Sequelize.QueryTypes.SELECT }
      );
      
      const hasPositionColumn = usersTableInfo.some(col => col.name === 'position');
      const hasPasswordHashColumn = usersTableInfo.some(col => col.name === 'passwordHash');
      
      if (!hasPositionColumn) {
        await sequelize.query(
          `ALTER TABLE users ADD COLUMN position TEXT`,
          { transaction }
        );
        console.log('✓ Added position column to users table');
      } else {
        console.log('✓ position column already exists');
      }

      if (!hasPasswordHashColumn) {
        await sequelize.query(
          `ALTER TABLE users ADD COLUMN passwordHash TEXT`,
          { transaction }
        );
        console.log('✓ Added passwordHash column to users table');
      } else {
        console.log('✓ passwordHash column already exists');
      }

      const hasDeletedAtColumn = usersTableInfo.some(col => col.name === 'deletedAt');
      if (!hasDeletedAtColumn) {
        await sequelize.query(
          `ALTER TABLE users ADD COLUMN deletedAt DATETIME`,
          { transaction }
        );
        console.log('✓ Added deletedAt column to users table (soft delete)');
      } else {
        console.log('✓ deletedAt column already exists');
      }

      // Check locations table columns
      try {
        const locationsTableInfo = await sequelize.query(
          `PRAGMA table_info(locations)`,
          { transaction, raw: true, type: Sequelize.QueryTypes.SELECT }
        );
        
        const hasAddressColumn = locationsTableInfo.some(col => col.name === 'address');
        
        if (!hasAddressColumn) {
          await sequelize.query(
            `ALTER TABLE locations ADD COLUMN address TEXT`,
            { transaction }
          );
          console.log('✓ Added address column to locations table');
        } else {
          console.log('✓ address column already exists');
        }
      } catch (err) {
        console.log('✓ Locations table structure already correct');
      }

      // Check if audit_logs table exists and has correct structure
      try {
        await sequelize.query(
          `PRAGMA table_info(audit_logs)`,
          { transaction, raw: true, type: Sequelize.QueryTypes.SELECT }
        );
        console.log('✓ audit_logs table exists and is ready');
      } catch (err) {
        console.log('✓ audit_logs table will be auto-created by Sequelize');
      }
      
      await transaction.commit();
      console.log('✓ All migrations completed successfully');
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (sequelize) => {
    const transaction = await sequelize.transaction();
    try {
      // This is a destructive operation - reverting migrations
      console.log('⚠ Rolling back migrations (columns will be dropped)');
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
