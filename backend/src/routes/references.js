const express = require('express');
const router = express.Router();
const { Department, Location, Role, User, AuditLog } = require('../models');
const { Op } = require('sequelize');

// DEPARTMENTS
router.get('/departments', async (req, res) => {
  try {
    const departments = await Department.findAll({ order: [['name', 'ASC']] });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/departments', async (req, res) => {
  try {
    const { name, code, description } = req.body;
    
    if (!name || !code) {
      return res.status(400).json({ error: 'Name and code are required' });
    }

    const dept = await Department.create({ name, code, description });
    
    if (req.user) {
      await AuditLog.create({
        userId: req.user.id,
        action: 'CREATE',
        entityType: 'Department',
        entityId: dept.id,
        details: dept.toJSON()
      });
    }

    res.status(201).json(dept);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/departments/:id', async (req, res) => {
  try {
    const { name, code, description } = req.body;
    const dept = await Department.findByPk(req.params.id);
    
    if (!dept) {
      return res.status(404).json({ error: 'Department not found' });
    }

    const oldData = dept.toJSON();
    await dept.update({ name, code, description });

    if (req.user) {
      await AuditLog.create({
        userId: req.user.id,
        action: 'UPDATE',
        entityType: 'Department',
        entityId: dept.id,
        details: { before: oldData, after: dept.toJSON() }
      });
    }

    res.json(dept);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/departments/:id', async (req, res) => {
  try {
    const dept = await Department.findByPk(req.params.id);
    
    if (!dept) {
      return res.status(404).json({ error: 'Department not found' });
    }

    // Check if any users reference this department
    const userCount = await User.count({ where: { departmentId: dept.id } });
    if (userCount > 0) {
      return res.status(409).json({ 
        error: `Cannot delete department with ${userCount} assigned user(s)` 
      });
    }

    if (req.user) {
      await AuditLog.create({
        userId: req.user.id,
        action: 'DELETE',
        entityType: 'Department',
        entityId: dept.id,
        details: dept.toJSON()
      });
    }

    await dept.destroy();
    res.json({ message: 'Department deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// LOCATIONS
router.get('/locations', async (req, res) => {
  try {
    const locations = await Location.findAll({ order: [['name', 'ASC']] });
    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/locations', async (req, res) => {
  try {
    const { name, code, description, address } = req.body;
    
    if (!name || !code) {
      return res.status(400).json({ error: 'Name and code are required' });
    }

    const loc = await Location.create({ name, code, description, address });
    
    if (req.user) {
      await AuditLog.create({
        userId: req.user.id,
        action: 'CREATE',
        entityType: 'Location',
        entityId: loc.id,
        details: loc.toJSON()
      });
    }

    res.status(201).json(loc);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/locations/:id', async (req, res) => {
  try {
    const { name, code, description, address } = req.body;
    const loc = await Location.findByPk(req.params.id);
    
    if (!loc) {
      return res.status(404).json({ error: 'Location not found' });
    }

    const oldData = loc.toJSON();
    await loc.update({ name, code, description, address });

    if (req.user) {
      await AuditLog.create({
        userId: req.user.id,
        action: 'UPDATE',
        entityType: 'Location',
        entityId: loc.id,
        details: { before: oldData, after: loc.toJSON() }
      });
    }

    res.json(loc);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/locations/:id', async (req, res) => {
  try {
    const loc = await Location.findByPk(req.params.id);
    
    if (!loc) {
      return res.status(404).json({ error: 'Location not found' });
    }

    // Check if any users reference this location
    const userCount = await User.count({ where: { locationId: loc.id } });
    if (userCount > 0) {
      return res.status(409).json({ 
        error: `Cannot delete location with ${userCount} assigned user(s)` 
      });
    }

    if (req.user) {
      await AuditLog.create({
        userId: req.user.id,
        action: 'DELETE',
        entityType: 'Location',
        entityId: loc.id,
        details: loc.toJSON()
      });
    }

    await loc.destroy();
    res.json({ message: 'Location deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ROLES
router.get('/roles', async (req, res) => {
  try {
    const roles = await Role.findAll({ order: [['name', 'ASC']] });
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/roles', async (req, res) => {
  try {
    const { name, code, description } = req.body;
    
    if (!name || !code) {
      return res.status(400).json({ error: 'Name and code are required' });
    }

    const role = await Role.create({ name, code, description });
    
    if (req.user) {
      await AuditLog.create({
        userId: req.user.id,
        action: 'CREATE',
        entityType: 'Role',
        entityId: role.id,
        details: role.toJSON()
      });
    }

    res.status(201).json(role);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/roles/:id', async (req, res) => {
  try {
    const { name, code, description } = req.body;
    const role = await Role.findByPk(req.params.id);
    
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    const oldData = role.toJSON();
    await role.update({ name, code, description });

    if (req.user) {
      await AuditLog.create({
        userId: req.user.id,
        action: 'UPDATE',
        entityType: 'Role',
        entityId: role.id,
        details: { before: oldData, after: role.toJSON() }
      });
    }

    res.json(role);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/roles/:id', async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    // Check if any users reference this role
    const userCount = await User.count({ where: { roleId: role.id } });
    if (userCount > 0) {
      return res.status(409).json({ 
        error: `Cannot delete role with ${userCount} assigned user(s)` 
      });
    }

    if (req.user) {
      await AuditLog.create({
        userId: req.user.id,
        action: 'DELETE',
        entityType: 'Role',
        entityId: role.id,
        details: role.toJSON()
      });
    }

    await role.destroy();
    res.json({ message: 'Role deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
