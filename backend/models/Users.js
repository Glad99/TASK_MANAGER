const mongoose = require("mongoose");

const UseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImageUrl: { type: String, default: null },
    role: { type: String, enum: ["admin", "user"], default: "user" }, // Role-based access control
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
});

module.exports = mongoose.model("User", UseSchema);