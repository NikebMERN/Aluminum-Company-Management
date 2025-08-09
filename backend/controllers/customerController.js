import db from "../config/db.js";

// List all available aluminum items for customer
export const listAvailableItems = async (req, res) => {
    try {
        const [items] = await db.query(
            `SELECT ai.id, ai.shape, (ai.given_quantity - ai.sold_quantity) AS available_quantity, ai.price_per_item
       FROM aluminum_items ai
       WHERE (ai.given_quantity - ai.sold_quantity) > 0`
        );
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Place order
export const placeOrder = async (req, res) => {
    try {
        const customerId = req.user.id;
        const { items } = req.body; // items: [{ itemId, quantity }]

        // Insert order
        const [orderResult] = await db.query(
            "INSERT INTO orders (customer_id, order_date) VALUES (?, ?)",
            [customerId, new Date()]
        );

        const orderId = orderResult.insertId;

        // Insert order items
        for (const item of items) {
            await db.query(
                "INSERT INTO order_items (order_id, item_id, quantity) VALUES (?, ?, ?)",
                [orderId, item.itemId, item.quantity]
            );
        }

        res.status(201).json({ message: "Order placed successfully", orderId });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get customer orders
export const getCustomerOrders = async (req, res) => {
    try {
        const customerId = req.user.id;
        const [orders] = await db.query(
            `SELECT o.id, o.order_date, oi.item_id, oi.quantity, ai.shape, ai.price_per_item
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN aluminum_items ai ON oi.item_id = ai.id
       WHERE o.customer_id = ?`,
            [customerId]
        );
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
