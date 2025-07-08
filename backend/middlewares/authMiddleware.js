const jwt = require("jsonwebtoken");
const User = require("../models/Users");    

// Middleware to protect routes
const protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if (token && token.startsWith("Bearer")) {
            token = token.split(" ")[1]; // Extract the token from the header
            const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
            req.user = await User.findById(decoded.id).select("-password"); // Find the user by ID and exclude the password field
            next(); // Proceed to the next middleware or route handler
        } else {
            res.status(401).json({ message: "Not authorized, no token" }); // If no token is provided, return an error
        }
    } catch (error) {
        res.status(401).json({ message: "Not authorized, token failed" }); // If token verification fails, return an error
    }
};


//Middleware for Admin-only access
const adminOnly = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next(); // If the user is an admin, proceed to the next middleware or route handler
    } else {
        res.status(403).json({ message: "Access denied, admin only" }); // If not an admin, return an error
    }
};  

module.exports = { protect, adminOnly }; // Export the middleware functions for use in other files
// This code defines two middleware functions: `protect` and `admin`.