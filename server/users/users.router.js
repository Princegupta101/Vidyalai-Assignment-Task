const express = require('express');
const { fetchAllUsers } = require('./users.service');

const router = express.Router();

/**
 * Route handler to fetch all users.
 * @name GET /api/v1/users
 * @function
 * @memberof module:usersRouter
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */

router.get('/', async (req, res) => {
  try {
    const users = await fetchAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;