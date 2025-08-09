import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

// Register route (for customers and optionally other roles)
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);

export default router;
