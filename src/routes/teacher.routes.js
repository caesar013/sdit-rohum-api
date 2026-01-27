import express from "express";
import {
  getAllTeachers,
  getTeacherById,
  getStatuses,
  getStatusCounts,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "../controllers/teacherController.js";
import { authenticateToken, isAdmin } from "../middleware/auth.js";
import { uploadPhoto } from "../middleware/upload.js";

const router = express.Router();

// Public routes
router.get("/", getAllTeachers); // Get all teachers with filters
router.get("/statuses", getStatuses); // Get available statuses
router.get("/:id", getTeacherById); // Get teacher by ID

// Protected routes - Admin only
router.get("/admin/stats", authenticateToken, isAdmin, getStatusCounts); // Get status counts
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
