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
        const { subAdminId } = req.params;

        if (!subAdminId) {
            return res.status(400).json({ message: "subAdminId is required" });
        }

        const query = `
            SELECT 
                ai.sub_admin_id,
                COALESCE(SUM(s.quantity_sold * ai.price_per_item), 0) AS total_revenue,
                COALESCE(SUM(s.quantity_sold), 0) AS total_items_sold,
                COALESCE(SUM(ai.given_quantity), 0) AS total_items_assigned
            FROM aluminum_items ai
            LEFT JOIN sales s ON ai.id = s.item_id
            WHERE ai.sub_admin_id = ?
            GROUP BY ai.sub_admin_id
        `;

        const [rows] = await db.query(query, [subAdminId]);

        if (!rows.length) {
            return res.status(404).json({ message: "No sales or items found for this sub admin" });
        }

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



