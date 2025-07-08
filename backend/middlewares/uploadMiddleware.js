const multer =require("multer")

// Configure storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Directory where files will be stored
    },
    });

    // File filter to allow only images
    const fileFilter = (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
        if (allowedTypes.includes(file.mimetype)) { 
            cb(null, true); // Accept the file
        } else {
            cb(new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."), false); // Reject the file
        }
    };

    const upload = multer({ storage, fileFilter }); 

    module.exports = upload; // Export the configured multer instance
    // This middleware can be used in routes to handle file uploads