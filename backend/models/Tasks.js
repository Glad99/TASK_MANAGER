const mongoose = require("mongoose");
const { createIndexes } = require("./Users");

const todoSchema = new mongoose.Schema({
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
});

const taskSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    priority: {type: String, enum: ["low", "medium", "high"], default: "medium"},   
    status: {type: String, enum: ["pending", "in-progress", "completed"], default: "pending"},
    dueDate: {type: Date, required: true},
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    attachments: [{ type: String }], // Array of attachment URLs
    todoChecklist: [todoSchema], // Array of todo items
    progress: { type: Number, default: 0 }, // Progress percentage

}, {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
});

module.exports = mongoose.model("Task", taskSchema);