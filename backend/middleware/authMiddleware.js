import jwt from "jsonwebtoken";
import db from "../config/db.js";

export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const [userRows] = await db.query(
                "SELECT id, name, email, role FROM users WHERE id = ?",
                [decoded.id]
            );

            if (userRows.length === 0) {
                return res.status(401).json({ message: "User not found" });
            }

            req.user = userRows[0];
            next();
        } catch (error) {
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
    } else {
        return res.status(401).json({ message: "Not authorized, no token" });
    }
};
