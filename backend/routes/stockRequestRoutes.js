import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/checkRole.js";
import {
    createStockRequest,
    submitQuotations,
    approveStockQuotation,
    useStock,
    getStockRequestDetails,
    getStockRequestsBySubAdmin,
    getAllStockRequests,
    getQuotationsByRequest,
    disapproveStockQuotation,
    getStockDetailsBySubAdmin,
} from "../controllers/stockRequestController.js";

const router = express.Router();

// 🔐 All routes require login
router.use(protect);

// ================= Super Admin routes =================
router.post("/create", authorizeRoles("super_admin"), createStockRequest);
router.post(
    "/quotations/:quotationId/approve",
    authorizeRoles("super_admin"),
    approveStockQuotation
);
router.get("/requests", authorizeRoles("super_admin"), getAllStockRequests);
router.get(
    "/quotations/:requestId",
    authorizeRoles("super_admin"),
    getQuotationsByRequest
);
router.patch(
    "/quotations/:quotationId",
    authorizeRoles("super_admin"),
    disapproveStockQuotation
);

// ================= Sub Admin routes =================
router.post("/quotations", authorizeRoles("sub_admin"), submitQuotations);
router.post("/use-stock", authorizeRoles("sub_admin"), useStock);
router.get("/request/:id", authorizeRoles("sub_admin"), getStockRequestDetails);

// ================= Common routes ====================
router.get("/sub-admin/:subAdminId", getStockDetailsBySubAdmin);
router.get("/subadmin/:subAdminId", getStockRequestsBySubAdmin);

export default router;
