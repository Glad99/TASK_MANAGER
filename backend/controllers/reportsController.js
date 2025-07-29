const Task = require("../models/Task");
const User = require("../models/User");
const excelJS = require("exceljs");


// @desc Export all tasks as an Excel file
// @route GET /api/reports/tasks
// @access Private/Admin
const exportTasksReport = async (req, res) => { 
    try{
        const tasks = await Task.find().populate("assignedTo", "name email").populate("createdBy", "name email");

        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet("Tasks Report");

        worksheet.columns = [
            { header: "Task ID", key: "_id", width: 30 },
            { header: "Title", key: "title", width: 30 },
            { header: "Description", key: "description", width: 50 },
            { header: "Status", key: "status", width: 20 },
            { header: "Priority", key: "priority", width: 20 },
            {header: "Due Date", key: "dueDate", width: 20 },
            { header: "Assigned To", key: "assignedTo.name", width: 30 },
        ];

        tasks.forEach((task) => {
            const assignedTo = task.assignedTo
            .map(user => `${user.name} (${user.email})`)
            .join (", ");
            worksheet.addRow({
                _id: task._id,
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                dueDate: task.dueDate.toISOString().split("T")[0], // Format date to YYYY-MM-DD
                assignedTo: assignedTo || "Unassigned",
            });
    });

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
        "Content-Disposition",
        `attachment; filename=tasks_report_${new Date().toISOString().split("T")[0]}.xlsx`
    );

    return workbook.xlsx.write(res).then(() => {
        res.status(200).end();
    });

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

