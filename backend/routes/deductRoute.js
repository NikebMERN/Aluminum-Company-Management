import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/checkRole.js";
import {
  updateSoldQuantity,
} from "../controllers/subAdminController.js";

const router = express.Router();

// Protect all routes, allow only sub_admin
router.use(protect);
router.use(authorizeRoles("customer"));

router.put("/update-sold", updateSoldQuantity);

export default router;
