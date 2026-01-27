import express from "express";
import {
  getStatusCounts,
  updateAlumni,
  updateAlumniStatus,
  deleteAlumni,
} from "../../controllers/alumniController.js";
import { authenticateToken } from "../../middleware/auth.js";
import { uploadPhoto } from "../../middleware/upload.js";

const router = express.Router();

// Admin routes
router.get("/status-counts", authenticateToken, getStatusCounts);
router.put(
  "/:id",
  authenticateToken,
  uploadPhoto.single("photo"),
  updateAlumni,
);
router.put("/:id/status", authenticateToken, updateAlumniStatus);
router.delete("/:id", authenticateToken, deleteAlumni);

export default router;
