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
        const users = await User.find().select("name email _id");
        const tasks = await Task.find().populate("assignedTo", "name email").populate("createdBy", "name email _id");

        const userTaskMap = {};
        users.forEach((user) => {
            userTaskMap[user._id] = {
                name: user.name,
                email: user.email,
                taskCount: 0,
                inProgress: 0,
                completedTasks: 0,
            };
        });

            userTasks.forEach(task => {
                if (task.assignedTo){
                    tasks.assignedTo.forEach(assignedUser => {
                        if (userTaskMap[assignedUser._id]) {
                            userTaskMap[assignedUser._id].taskCount++;
                            if (task.status === "Pending") {
                                userTaskMap[assignedUser._id].pendingTasks++;
                            } else if (task.status === "In Progress") {
                                userTaskMap[assignedUser._id].inProgressTasks++;
                            } else if (task.status === "Completed") {
                                userTaskMap[assignedUser._id].completedTasks++;
                            }
                        }
                    });
                }
        });

        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet("User Tasks Report");

        worksheet.columns = [
            {header: "User Name", key: "name", width: 30 },
            {header: "Email", key: "email", width: 30 },
            {header: "Total Assigned Tasks", key: "taskCount", width: 20 },
            {header: "Pending Tasks", key: "pendingTasks", width: 20 },
            {header: "In Progress Tasks", key: "inProgressTasks", width: 20 },
            {header: "Completed Tasks", key: "completedTasks", width: 20 },
        ];

        Object.values(userTaskMap).forEach((user)=> {
            worksheet.addRow(user);
        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=user_tasks_report_${new Date().toISOString().split("T")[0]}.xlsx`
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

module.exports = {
    exportTasksReport,
    exportUsersReport,
};

