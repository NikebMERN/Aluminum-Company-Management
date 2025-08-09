import db from "../config/db.js";

// Record a sale (can be used by sub-admin or super admin)
export const recordSale = async (req, res) => {
    try {
        const { itemId, quantitySold, saleDate } = req.body;
        const userId = req.user.id;

        // Insert sale record
        await db.query(
            "INSERT INTO sales (item_id, quantity_sold, sale_date, sold_by) VALUES (?, ?, ?, ?)",
            [itemId, quantitySold, saleDate || new Date(), userId]
        );

        res.status(201).json({ message: "Sale recorded successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get revenue report for super admin or sub admin
export const getRevenueReport = async (req, res) => {
    try {
        let query = "";
        let params = [];

        if (req.user.role === "super_admin") {
            query = `SELECT sub_admin_id, SUM(quantity_sold * price_per_item) AS total_revenue
               FROM sales s
               JOIN aluminum_items ai ON s.item_id = ai.id
               GROUP BY sub_admin_id`;
        } else if (req.user.role === "sub_admin") {
            query = `SELECT SUM(quantity_sold * price_per_item) AS total_revenue
               FROM sales s
               JOIN aluminum_items ai ON s.item_id = ai.id
               WHERE ai.sub_admin_id = ?`;
            params = [req.user.id];
        } else {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
