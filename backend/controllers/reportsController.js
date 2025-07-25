const Task = require("../models/Task");
const User = require("../models/User");
const excelJS = require("exceljs");


// @desc Export all tasks as an Excel file
// @route GET /api/reports/tasks
// @access Private/Admin
const exportTasksReport = async (req, res) => { 
    try{

    } catch (error) { 
        res
            .status(500)
            .json({ message: "Failed to export tasks report", error: error.message });
    }
};

// @desc Export all user-task report as an Excel file
// @route GET /api/reports/export/users
// @access Private/Admin 
const exportUsersReport = async (req, res) => {
    try{

    } catch (error) { 
        res
            .status(500)
            .json({ message: "Failed to export tasks report", error: error.message });
}
};

module.exports = {
    exportTasksReport,
    exportUsersReport,
};

