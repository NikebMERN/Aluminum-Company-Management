// routes/notificationRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { sendNotificationEmail } from "../controllers/notificationController.js";

const router = express.Router();

router.post("/notify-stock-soldout", protect, sendNotificationEmail);

export default router;
