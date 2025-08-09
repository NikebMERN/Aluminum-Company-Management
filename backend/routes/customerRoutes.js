import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/checkRole.js";
import {
  listAvailableItems,
  placeOrder,
  getCustomerOrders,
} from "../controllers/customerController.js";

const router = express.Router();

// Protect routes, allow only customers
router.use(protect);
router.use(authorizeRoles("customer"));

router.get("/items", listAvailableItems);
router.post("/place-order", placeOrder);
router.get("/orders", getCustomerOrders);

export default router;
