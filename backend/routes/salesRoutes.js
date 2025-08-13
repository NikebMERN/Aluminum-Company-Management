import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  recordSale,
  getRevenueReport,
} from "../controllers/salesController.js";

const router = express.Router();

// Protect all sales routes
router.use(protect);

router.post("/record", recordSale);
router.get("/revenue-report/:subAdminId", getRevenueReport);

export default router;
