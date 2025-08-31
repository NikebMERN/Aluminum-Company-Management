import db from "../config/db.js";

// 1️⃣ Create a new stock request (Super Admin assigns it to a Sub Admin)
export const createStockRequest = async (req, res) => {
    try {
        const { subAdminId, items } = req.body;
        if (!subAdminId || !items || !items.length) {
            return res
                .status(400)
                .json({ message: "SubAdminId and items are required" });
        }

        const [result] = await db.query(
            "INSERT INTO stock_requests (super_admin_id, sub_admin_id) VALUES (?, ?)",
            [req.user.id, subAdminId]
        );

        const requestId = result.insertId;

        for (const item of items) {
            await db.query(
                "INSERT INTO stock_request_items (request_id, shape, quantity, description) VALUES (?, ?, ?, ?)",
                [requestId, item.shape, item.quantity, item.description]
            );
        }

        res.status(201).json({ message: "Stock request created", requestId });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// 2️⃣ Sub Admin: Submit quotations
export const submitQuotations = async (req, res) => {
    try {
        const { requestItemId, quotations } = req.body;
        if (!requestItemId || !quotations?.length) {
            return res
                .status(400)
                .json({ message: "Request item and quotations required" });
        }

        for (const q of quotations) {
            await db.query(
                "INSERT INTO quotations (request_item_id, company_name, price) VALUES (?, ?, ?)",
                [requestItemId, q.companyName, q.price]
            );
        }

        await db.query(
            "UPDATE stock_requests SET status = 'quotations_collected' WHERE id = (SELECT request_id FROM stock_request_items WHERE id = ?)",
            [requestItemId]
        );

        res.status(201).json({ message: "Quotations submitted" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// 3️⃣ Super Admin: Approve a specific quotation
export const approveStockQuotation = async (req, res) => {
    try {
        const { quotationId } = req.params;
        if (!quotationId) {
            return res.status(400).json({ message: "Quotation ID required" });
        }

        // Mark selected quotation
        await db.query("UPDATE quotations SET status = 'approved' WHERE id = ?", [
            quotationId,
        ]);

        // Fetch quotation + related request item
        const [rows] = await db.query(
            `SELECT q.id, q.price, i.id AS request_item_id, i.shape, i.quantity, i.request_id 
       FROM quotations q
       JOIN stock_request_items i ON q.request_item_id = i.id
       WHERE q.id = ?`,
            [quotationId]
        );

        if (!rows.length)
            return res.status(404).json({ message: "Quotation not found" });

        const q = rows[0];

        // Save chosen price into request item
        await db.query(
            "UPDATE stock_request_items SET chosen_price = ? WHERE id = ?",
            [q.price, q.request_item_id]
        );

        // Move stock into project_stock
        await db.query(
            "INSERT INTO project_stock (request_item_id, shape, total_quantity, chosen_price) VALUES (?, ?, ?, ?)",
            [q.request_item_id, q.shape, q.quantity, q.price]
        );

        // Update parent request status
        await db.query(
            "UPDATE stock_requests SET status = 'price_selected' WHERE id = ?",
            [q.request_id]
        );

        res.json({ message: "Quotation approved successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// 4️⃣ Sub Admin: Deduct stock when engineers use it
export const useStock = async (req, res) => {
    try {
        const { projectStockId, usedQuantity } = req.body;

        if (!projectStockId || !usedQuantity) {
            return res
                .status(400)
                .json({ message: "Project stock ID and used quantity required" });
        }

        // Fetch stock row
        const [rows] = await db.query(
            "SELECT total_quantity, used_quantity FROM project_stock WHERE request_item_id = ?",
            [projectStockId]
        );

        if (!rows.length) {
            return res.status(404).json({ message: "Stock not found" });
        }

        const stock = rows[0];

        if (usedQuantity > stock.total_quantity) {
            return res
                .status(400)
                .json({ message: "Requested quantity exceeds available stock" });
        }

        // Deduct directly from total_quantity
        const newTotal = stock.total_quantity - usedQuantity;
        const newUsed = stock.used_quantity + usedQuantity;

        await db.query(
            "UPDATE project_stock SET total_quantity = ?, used_quantity = ? WHERE id = ?",
            [newTotal, newUsed, projectStockId]
        );

        res.json({
            message: "Stock deducted successfully",
            deducted: usedQuantity,
            used_quantity: newUsed,
            total: newTotal,
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// 5️⃣ Get all quotations for a stock request
export const getQuotationsByRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const [quotes] = await db.query(
            `SELECT q.*, i.shape, i.quantity 
       FROM quotations q
       JOIN stock_request_items i ON q.request_item_id = i.id
       WHERE i.request_id = ?`,
            [requestId]
        );
        res.json(quotes);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// 6️⃣ Get one stock request (with items + quotations)
export const getStockRequestDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const [request] = await db.query(
            "SELECT * FROM stock_requests WHERE id = ?",
            [id]
        );
        if (!request.length)
            return res.status(404).json({ message: "Request not found" });

        const [items] = await db.query(
            "SELECT * FROM stock_request_items WHERE request_id = ?",
            [id]
        );

        for (let item of items) {
            const [quotes] = await db.query(
                "SELECT * FROM quotations WHERE request_item_id = ?",
                [item.id]
            );
            item.quotations = quotes;
        }

        res.json({ ...request[0], items });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// 7️⃣ Get all stock requests (Super Admin)
export const getAllStockRequests = async (req, res) => {
    try {
        const [requests] = await db.query(
            "SELECT * FROM stock_requests ORDER BY created_at DESC"
        );

        for (let request of requests) {
            const [items] = await db.query(
                "SELECT * FROM stock_request_items WHERE request_id = ?",
                [request.id]
            );
            request.items = items;
        }

        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// 8️⃣ Get stock requests for a specific Sub Admin
export const getStockRequestsBySubAdmin = async (req, res) => {
    try {
        const { subAdminId } = req.params;
        const [requests] = await db.query(
            "SELECT * FROM stock_requests WHERE sub_admin_id = ? ORDER BY created_at DESC",
            [subAdminId]
        );
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// 9️⃣ Disapprove (delete) a specific quotation
export const disapproveStockQuotation = async (req, res) => {
    try {
        const { quotationId } = req.params;
        if (!quotationId) {
            return res.status(400).json({ message: "Quotation ID required" });
        }

        // Get the quotation and its related request item
        const [rows] = await db.query(
            `SELECT q.*, i.id AS request_item_id, i.chosen_price, i.request_id 
             FROM quotations q 
             JOIN stock_request_items i ON q.request_item_id = i.id 
             WHERE q.id = ?`,
            [quotationId]
        );

        if (!rows.length)
            return res.status(404).json({ message: "Quotation not found" });

        const q = rows[0];

        // ✅ Update this quotation status back to "pending"
        await db.query(
            "UPDATE quotations SET status = 'pending' WHERE id = ?",
            [quotationId]
        );

        // ❌ Instead of deleting the stock_request_item (which cascades), 
        // just mark it as disapproved or inactive
        await db.query(
            "UPDATE stock_request_items SET status = 'disapproved' WHERE id = ?",
            [q.request_item_id]
        );

        // After marking, check if there are still ACTIVE items left in this request
        const [remainingItems] = await db.query(
            "SELECT * FROM stock_request_items WHERE request_id = ? AND status != 'disapproved'",
            [q.request_id]
        );

        // Update stock_request status depending on remaining items
        const newStatus = remainingItems.length ? "quotations_collected" : "pending";

        await db.query("UPDATE stock_requests SET status = ? WHERE id = ?", [
            newStatus,
            q.request_id,
        ]);

        res.json({
            message:
                "Quotation disapproved successfully. Status reset and stock_request_item marked as disapproved.",
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Get all stock request details for a specific Sub Admin
export const getStockDetailsBySubAdmin = async (req, res) => {
    try {
        const { subAdminId } = req.params;

        // Get all stock requests for the sub admin
        const [requests] = await db.query(
            "SELECT * FROM stock_requests WHERE sub_admin_id = ? ORDER BY created_at DESC",
            [subAdminId]
        );

        for (let request of requests) {
            // Get items for this request
            const [items] = await db.query(
                `SELECT sri.*, 
                        ps.total_quantity, 
                        ps.used_quantity 
                 FROM stock_request_items sri
                 LEFT JOIN project_stock ps 
                    ON ps.request_item_id = sri.id
                 WHERE sri.request_id = ?`,
                [request.id]
            );

            // For each item, get its quotations
            for (let item of items) {
                const [quotes] = await db.query(
                    "SELECT * FROM quotations WHERE request_item_id = ?",
                    [item.id]
                );
                item.quotations = quotes;
            }

            request.items = items;
        }

        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
