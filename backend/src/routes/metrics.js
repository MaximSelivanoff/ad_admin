const express = require('express');
const router = express.Router();
const { User, Role } = require('../models');
const { Op } = require('sequelize');

router.get('/', async (req, res) => {
  try {
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { status: 'active' } });
    const inactiveUsers = await User.count({ where: { status: 'inactive' } });
    
    const adminRole = await Role.findOne({ where: { code: 'admin' } });
    const adminCount = adminRole ? await User.count({ where: { roleId: adminRole.id } }) : 0;

    res.json({
      totalUsers,
      activeUsers,
      inactiveUsers,
      adminCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
