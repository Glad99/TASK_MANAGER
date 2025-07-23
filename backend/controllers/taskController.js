const Task = require("../models/Task");

// @desc Get all tasks (Admin: all, User: only assigned tasks)
// @route Get /api/tasks/
// @access Private
const getTasks = async (req, res) => {
    try {
        const { status } = req.query; // Get status from query parameters
        let filter = {};

        if (status) {
            filter.status = status; // Filter tasks by status if provided
        }

        let tasks;
        if (req.user.role === "admin") {
            // Admin can see all tasks
            tasks = await Task.find(filter)
                .populate("assignedTo", "name email profileImageUrl");
        }

        // Add completed todoChecklist count to each task
        tasks = await Promise.all(
            tasks.map(async (task) => {
                const completedCount = task.todoChecklist.filter(item => item.completed).length;
                return {
                    ...task.toObject(),
                    completedCount,
                };
            }
        ));

        // Status summary counts
        const allTasks = await Task.countDocuments(
            req.user.role === "admin" ? {} : { assignedTo: req.user._id }
        );

        const pendingTasks = await Task.countDocuments({
            ...filter, 
            status: "pending",
            ...(req.user.role === "user" ? { assignedTo: req.user._id } : {} )
        });

        const inProgressTasks = await Task.countDocuments({
            ...filter,      
            status: "in-progress",
            ...(req.user.role === "user" ? { assignedTo: req.user._id } : {} )
        });

        const completedTasks = await Task.countDocuments({
            ...filter,
            status: "completed",
            ...(req.user.role === "user" ? { assignedTo: req.user._id } : {} )
        });

        res.json({
            tasks,
            statusSummary: {
                all: allTasks,
                pendingTasks,
                inProgressTasks,
                completedTasks,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//  @desc Get a task by ID
//  @route Get /api/tasks/:id   
// @access Private
const getTaskById = async (req, res) => {
    try {
    const task = await Task.findById(req.params.id)
        .populate("assignedTo", "name email profileImageUrl");

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Add completed todoChecklist count to the task
        const completedCount = task.todoChecklist.filter(item => item.completed).length;

        res.json({
            ...task.toObject(),
            completedCount,
        });
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
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });  

        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;            
        task.priority = req.body.priority || task.priority;
        task.dueDate = req.body.dueDate || task.dueDate;
        task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
        task.attachments = req.body.attachments || task.attachments;

        if (req.body.assignedTo) {
            if (!Array.isArray(req.body.assignedTo)) {
                return res.status(400).json({ message: "AssignedTo must be an array of user IDs" });    
            }
            task.assignedTo = req.body.assignedTo; // Update assigned users
        }

        const updatedTask = await task.save();
        res.json({ message: "Task updated successfully", task: updatedTask });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Delete a task (Admin only)
// @route Delete /api/tasks/:id
// @access Private
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });

        // Check if the user is authorized to delete the task
        if (task.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized to delete this task" });
        }

        await task.deleteOne();
        res.json({ message: "Task deleted successfully" }); 
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//  @desc Update task status (User)
//  @route Put /api/tasks/:id/status
//  @access Private
const updateTaskStatus = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });

        // Check if the user is assigned to the task
        let isAssigned = false;
        if (Array.isArray(task.assignedTo)) {
            isAssigned = task.assignedTo.some(userId => userId.toString() === req.user._id.toString());
        } else if (task.assignedTo) {
            isAssigned = task.assignedTo.toString() === req.user._id.toString();
        }
        if (!isAssigned && req.user.role !== "admin") {
            return res.status(403).json({ message: "You are not assigned to this task" });
        }

        task.status = req.body.status || task.status;

        if (task.status === "completed") {
            task.todoChecklist.forEach(item => item.completed = true);
            task.progress = 100;
        }
        await task.save();
        res.json({ message: "Task status updated to completed", task });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Update task checklist
// @route Put /api/tasks/:id/todo
// @access Private
const updateTaskChecklist = async (req, res) => {
    try {
        const { todoChecklist } = req.body;
        const task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ message: "Task not found" });

        if (!task.assignedTo.includes(req.user._id) && req.user.role !== "admin") {
            return res.status(403).json({ message: "You are not assigned to this task" });
        }

        task.todoChecklist = todoChecklist;

        // Auto-update status and progress based on checklist
        const completedCount = task.todoChecklist.filter(item => item.completed).length;
        const totalItems = task.todoChecklist.length;
        task.progress
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