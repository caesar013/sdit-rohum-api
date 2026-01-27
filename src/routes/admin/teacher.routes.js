import express from "express";
import {
  getStatusCounts,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "../../controllers/teacherController.js";
import { authenticateToken, isAdmin } from "../../middleware/auth.js";
import { uploadPhoto } from "../../middleware/upload.js";

const router = express.Router();

// Admin routes
router.get("/stats", authenticateToken, isAdmin, getStatusCounts); // Get status counts
router.post(
  "/",
  authenticateToken,
  isAdmin,
  uploadPhoto.single("photo"),
  createTeacher,
);
router.put(
  "/:id",
  authenticateToken,
  isAdmin,
  uploadPhoto.single("photo"),
  updateTeacher,
);
router.delete("/:id", authenticateToken, isAdmin, deleteTeacher);

export default router;
