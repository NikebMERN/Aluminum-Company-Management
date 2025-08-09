// routes/admin.js
import express from 'express';
import { checkRole } from '../middleware/checkRole.js';
import Item from '../models/AluminumItem.js';
import Sale from '../models/Sale.js';

const router = express.Router();

// Create item
router.post('/items', checkRole(['admin', 'super_admin']), async (req, res) => {
    try {
        const branchId = req.user.role === 'admin' ? req.user.branchId : req.body.branchId;
        const item = new Item({ ...req.body, branchId });
        await item.save();
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get items
router.get('/items', checkRole(['admin', 'super_admin']), async (req, res) => {
    try {
        const filter = req.user.role === 'admin' ? { branchId: req.user.branchId } : {};
        const items = await Item.find(filter);
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Revenue report
router.get('/revenue', checkRole(['admin', 'super_admin']), async (req, res) => {
    try {
        const filter = req.user.role === 'admin' ? { branchId: req.user.branchId } : {};
        const sales = await Sale.find(filter);
        const totalRevenue = sales.reduce((sum, sale) => sum + sale.amount, 0);
        res.json({ totalRevenue });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Stock status report
router.get('/stock-status', checkRole(['admin', 'super_admin']), async (req, res) => {
    try {
        const filter = req.user.role === 'admin' ? { branchId: req.user.branchId } : {};
        const items = await Item.find(filter);
        const stockStatus = items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            branchId: item.branchId
        }));
        res.json(stockStatus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
