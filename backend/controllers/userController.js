const Task = require("../models/Task");
const User = require("../models/Users");
const bcrypt = require("bcryptjs");

// @desc Get all users (Admin Only)
// @route GET /api/users
// @access Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find({role:'member'}).select("-password"); // Exclude password from response

        // Add task counts to each user
        const usersWithTaskCount = await Promise.all(users.map(async (user) => {
            const taskCount = await Task.countDocuments({ user: user._id });
            return {
                ...user.toObject(),
                taskCount: taskCount
            };
        }));    
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }   
};

// @desc Get user by ID
// @route GET /api/users/:id
// @access Private/Admin
const getUserById = async (req, res) => {
    try{

    }catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Delete a user (Admin only)
// @route DELETE /api/users/:id
// @access Private (Admin)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        await user.remove();
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    getUsers,
    getUserById,
    deleteUser,
};