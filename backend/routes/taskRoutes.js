const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

const router = express.Router();    

// Task Management Routes
router.get("/dashboard", protect, getDashboardData);
router.get("/user-dashboard", protect, getUserDashboardData);
router.get("/", protect, getTasks); // Get all tasks(Admin: all, User: assigned)
router.get("/:id", protect, getTaskById); // Get task by ID
router.post("/", protect, adminOnly, createTask); // Create a task (Admin only)
router.put("/:id", protect, adminOnly, UpdateTask); // Update a task details
router.delete("/:id", protect, adminOnly, deleteTask); // Delete a task (Admin Only)
router.put("/:id/status", protect, adminOnly, UpdateTaskStatus); // Updates task status
router.put("/:id/todo", protect, adminOnly, UpdateTaskChecklist); // Updates task Checklist

module.exports = router;