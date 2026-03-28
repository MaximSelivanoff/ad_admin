const express = require('express');
const router = express.Router();
const { AuditLog, User } = require('../models');
const { Op } = require('sequelize');

// Audit log list with filters, search, and sorting
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      userId, 
      changedBy,
      action, 
      entityType,
      search,
      startDate,
      endDate,
      sort = 'createdAt', 
      order = 'DESC' 
    } = req.query;
    
    const offset = (page - 1) * limit;
    const where = {};
    const userIncludeWhere = {};

    // Exact filters
    if (userId) where.userId = userId;
    if (action) where.action = action;
    if (entityType) where.entityType = entityType;
    
    // Filter by username of person who made change
    if (changedBy) userIncludeWhere.username = { [Op.like]: `%${changedBy}%` };

    // Date range filter
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        const endDt = new Date(endDate);
        endDt.setHours(23, 59, 59, 999); // End of day
        where.createdAt[Op.lte] = endDt;
      }
    }

    // Text search in multiple fields
    if (search) {
      where[Op.or] = [
        { action: { [Op.like]: `%${search}%` } },
        { entityType: { [Op.like]: `%${search}%` } },
        { details: { [Op.like]: `%${search}%` } },
        { '$User.username$': { [Op.like]: `%${search}%` } },
        { '$User.email$': { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await AuditLog.findAndCountAll({
      where,
      include: [{ 
        model: User, 
        attributes: ['id', 'username', 'email'],
        where: Object.keys(userIncludeWhere).length > 0 ? userIncludeWhere : undefined,
        required: !!changedBy
      }],
      order: [[sort, order.toUpperCase()]],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      subQuery: false
    });

    res.json({ 
      data: rows, 
      pagination: { 
        total: count, 
        page: parseInt(page, 10), 
        limit: parseInt(limit, 10), 
        totalPages: Math.ceil(count / limit) 
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
