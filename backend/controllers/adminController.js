import db from "../config/db.js";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Folder where images will be stored
    },
    filename: (req, file, cb) => {
        cb(
            null,
            Date.now() + path.extname(file.originalname) // e.g. 1691687512.jpg
        );
    },
});

export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max size
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(
            path.extname(file.originalname).toLowerCase()
        );
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error("Only images are allowed"));
        }
    },
});

// Create Sub-admin
export const createSubAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const [exists] = await db.query("SELECT * FROM users WHERE email = ?", [
            email,
        ]);
        if (exists.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'sub_admin')",
            [name, email, hashedPassword]
        );

        res.status(201).json({ message: "Sub-admin created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all Sub-admins
export const getAllSubAdmins = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT id, name, email FROM users WHERE role = 'sub_admin'"
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Assign aluminum items to Sub-admin
export const assignAluminum = async (req, res) => {
    try {
        const { subAdminId, shape, quantity, price_per_item } = req.body;
        const imageFile = req.file ? req.file.filename : null;

        await db.query(
            "INSERT INTO aluminum_items (sub_admin_id, shape, given_quantity, sold_quantity, price_per_item, image_url) VALUES (?, ?, ?, 0, ?, ?)",
            [subAdminId, shape, quantity, price_per_item, imageFile]
        );

        res.status(201).json({
            message: "Aluminum assigned successfully",
            image: imageFile,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all aluminum stock details
export const getAllAluminum = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM aluminum_items");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
