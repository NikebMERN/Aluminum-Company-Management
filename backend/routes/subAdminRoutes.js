import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/checkRole.js";
import {
  getAssignedItems,
  updateSoldQuantity,
  getRevenue,
} from "../controllers/subAdminController.js";

const router = express.Router();

// Protect all routes, allow only sub_admin
router.use(protect);
router.use(authorizeRoles("sub_admin"));

router.get("/items", getAssignedItems);
router.put("/update-sold", updateSoldQuantity);
router.get("/revenue", getRevenue);

export default router;
