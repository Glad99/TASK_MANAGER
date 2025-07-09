const express = require('express');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const { getUsers, getUserById, deleteUser } = require('../controllers/userController');

const router = express.Router();

// User Management Routes
router.get("/", protect, adminOnly, getUsers); // Get all users
router.get("/:id", protect, adminOnly, getUserById); // Get user by ID

module.exports = router;