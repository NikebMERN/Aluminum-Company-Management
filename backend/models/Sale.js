import db from "../config/db.js";

const Sale = {
    record: async (itemId, quantitySold, saleDate, soldBy) => {
        const [result] = await db.query(
            "INSERT INTO sales (item_id, quantity_sold, sale_date, sold_by) VALUES (?, ?, ?, ?)",
            [itemId, quantitySold, saleDate, soldBy]
        );
        return result.insertId;
    },
};

export default Sale;
