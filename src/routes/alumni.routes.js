import express from "express";
import {
  getAllAlumni,
  getAlumniById,
  createAlumni,
  updateAlumni,
  updateAlumniStatus,
  deleteAlumni,
  getGraduationYears,
  getStatusCounts,
  getAlumniStatuses,
} from "../controllers/alumniController.js";
import { authenticateToken } from "../middleware/auth.js";
import { optionalAuth } from "../middleware/optionalAuth.js";
import { uploadPhoto } from "../middleware/upload.js";

const router = express.Router();

// Public routes (with optional auth to differentiate public vs admin)
router.get("/", optionalAuth, getAllAlumni);
router.get("/graduation-years", getGraduationYears);
router.get("/statuses", getAlumniStatuses);
router.get("/:id", optionalAuth, getAlumniById);
router.post("/", uploadPhoto.single("photo"), createAlumni); // Public self-registration

// Admin routes
router.get("/admin/status-counts", authenticateToken, getStatusCounts);
router.put("/:id", authenticateToken, uploadPhoto.single("photo"), updateAlumni);
router.put("/:id/status", authenticateToken, updateAlumniStatus);
router.delete("/:id", authenticateToken, deleteAlumni);

export default router;
