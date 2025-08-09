import db from "../config/db.js";
import bcrypt from "bcryptjs";

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

        await db.query(
            "INSERT INTO aluminum_items (sub_admin_id, shape, given_quantity, sold_quantity, price_per_item) VALUES (?, ?, ?, 0, ?)",
            [subAdminId, shape, quantity, price_per_item]
        );

        res.status(201).json({ message: "Aluminum assigned successfully" });
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
