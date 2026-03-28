const express = require('express');
const router = express.Router();
const { User, Department, Location, Role } = require('../models');
const { Op } = require('sequelize');

// Get all users with filters, search, pagination
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      search, 
      status, 
      roleId, 
      departmentId,
      sortBy = 'lastName',
      sortOrder = 'ASC'
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
      where[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { username: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (status) where.status = status;
    if (roleId) where.roleId = parseInt(roleId);
    if (departmentId) where.departmentId = parseInt(departmentId);

    const { count, rows } = await User.findAndCountAll({
      where,
      include: [
        { model: Department, attributes: ['id', 'name', 'code'] },
        { model: Location, attributes: ['id', 'name', 'code'] },
        { model: Role, attributes: ['id', 'name', 'code'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, sortOrder]]
    });

    res.json({
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single user
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [
        { model: Department, attributes: ['id', 'name', 'code'] },
        { model: Location, attributes: ['id', 'name', 'code'] },
        { model: Role, attributes: ['id', 'name', 'code', 'permissions'] }
      ]
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create user
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await user.update(req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk actions
router.patch('/bulk', async (req, res) => {
  try {
    const { ids, status } = req.body;
    await User.update({ status }, { where: { id: ids } });
    res.json({ message: 'Users updated', count: ids.length });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
