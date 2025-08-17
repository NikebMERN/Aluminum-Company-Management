// createSuperAdmin.js
import bcrypt from "bcryptjs";
import db from "./config/db.js"; // Adjust path if needed
import dotenv from "dotenv";
dotenv.config();

async function createSuperAdmin() {
    try {
        const name = "Super Admin";
        const email = "matimahtem@gmail.com";
        const password = "1234"; // Change to your desired password
        const role = "super_admin";

        // Check if super admin already exists
        const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [
            email,
        ]);
        if (existing.length > 0) {
            console.log("Super admin already exists.");
            process.exit(0);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert super admin into DB
        const [result] = await db.query(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            [name, email, hashedPassword, role]
        );

        console.log("Super admin created with ID:", result.insertId);
        process.exit(0);
    } catch (error) {
        console.error("Error creating super admin:", error);
        process.exit(1);
    }
}

createSuperAdmin();
