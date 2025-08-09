import db from "../config/db.js";

const User = {
    findByEmail: async (email) => {
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
            email,
        ]);
        return rows[0];
    },

    findById: async (id) => {
        const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
        return rows[0];
    },

    create: async (name, email, password, role) => {
        const [result] = await db.query(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            [name, email, password, role]
        );
        return result.insertId;
    },
};

export default User;
