import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import subAdminRoutes from "./routes/subAdminRoutes.js";
import salesRoutes from "./routes/salesRoutes.js";
import deductRoute from "./routes/deductRoute.js";
import customerRoutes from "./routes/customerRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import stockRequestRoutes from "./routes/stockRequestRoutes.js";  // ✅ new import

import errorHandler from "./middleware/errorHandler.js";

dotenv.config();
console.clear();

const app = express();

app.use(cors());
app.use(express.json());

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/subadmin", subAdminRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/deduct", deductRoute);
app.use("/api/notifications", notificationRoutes);
app.use("/api/stock", stockRequestRoutes);  // ✅ new route

app.get("/", (req, res) => {
  res.send("Aluminum Company Management API is running");
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
