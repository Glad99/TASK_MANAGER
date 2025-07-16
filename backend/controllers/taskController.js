const Task = require("../models/Task");

// @desc Get all tasks (Admin: all, User: only assigned tasks)
// @route Get /api/tasks/
// @access Private
const getTasks = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//  @desc Get a task by ID
//  @route Get /api/tasks/:id   
// @access Private
const getTaskById = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Create a new task (Admin only)
// @route Post /api/tasks/      
// @access Private
const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            assignedTo,
            dueDate,
            priority,
            attachments,
            todoChecklist,
        } = req.body;

        if (!Array.isArray(assignedTo)) {
            return res.status(400).json({ message: "AssignedTo must be an array of user IDs" });
        }

        const task = await Task.create({
            title,
            description,
            priority,
            assignedTo, 
            dueDate,
            createdBy: req.user._id,
            attachments,
            todoChecklist,
        });
        console.log("Task created:", task);
        res.status(201).json({
            message: "Task created successfully",   
            task,
        });  

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Update a task (Admin only)
// @route Put /api/tasks/:id
// @access Private  
const updateTask = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Delete a task (Admin only)
// @route Delete /api/tasks/:id
// @access Private
const deleteTask = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//  @desc Update task status (User)
//  @route Put /api/tasks/:id/status
//  @access Private
const updateTaskStatus = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Update task checklist
// @route Put /api/tasks/:id/todo
// @access Private
const updateTaskChecklist = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Dashboard Date (Admin only)
// @route Get /api/tasks/dashboard
// @access Private  
const getDashboardData = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Dashboard Data (User-specific)
// @route Get /api/tasks/user-dashboard-data
// @access Private
const getUserDashboardData = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    getTasks,      
    getTaskById,
    createTask,     
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskChecklist,    
    getDashboardData,
    getUserDashboardData,
};