import db from "../config/db.js";

const Order = {
    createOrder: async (customerId, orderDate) => {
        const [result] = await db.query(
            "INSERT INTO orders (customer_id, order_date) VALUES (?, ?)",
            [customerId, orderDate]
        );
        return result.insertId;
    },

    addOrderItems: async (orderId, items) => {
        for (const item of items) {
            await db.query(
                "INSERT INTO order_items (order_id, item_id, quantity) VALUES (?, ?, ?)",
                [orderId, item.itemId, item.quantity]
            );
        }
    },

    getOrdersByCustomer: async (customerId) => {
        const [rows] = await db.query(
            `SELECT o.id, o.order_date, oi.item_id, oi.quantity, ai.shape, ai.price_per_item
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN aluminum_items ai ON oi.item_id = ai.id
       WHERE o.customer_id = ?`,
            [customerId]
        );
        return rows;
    },
};

export default Order;
