import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/checkRole.js";
import {
  createSubAdmin,
  getAllSubAdmins,
  assignAluminum,
  getAllAluminum,
  upload,
} from "../controllers/adminController.js";

const router = express.Router();

// Protect all routes, allow only super_admin
router.use(protect);
router.use(authorizeRoles("super_admin"));

router.post("/create-subadmin", createSubAdmin);
router.get("/subadmins", getAllSubAdmins);
router.post("/assign-aluminum", upload.single("image"), assignAluminum);
router.get("/aluminum", getAllAluminum);

export default router;
