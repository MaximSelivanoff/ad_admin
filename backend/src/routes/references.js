const express = require('express');
const router = express.Router();
const { Department, Location, Role } = require('../models');

router.get('/departments', async (req, res) => {
  try {
    const departments = await Department.findAll({ order: [['name', 'ASC']] });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/locations', async (req, res) => {
  try {
    const locations = await Location.findAll({ order: [['name', 'ASC']] });
    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/roles', async (req, res) => {
  try {
    const roles = await Role.findAll({ order: [['name', 'ASC']] });
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
