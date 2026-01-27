import express from "express";
import {
  getAllTeachers,
  getTeacherById,
  getStatuses,
} from "../controllers/teacherController.js";

const router = express.Router();

// Public routes
router.get("/", getAllTeachers); // Get all teachers with filters
router.get("/statuses", getStatuses); // Get available statuses
router.get("/:id", getTeacherById); // Get teacher by ID

export default router;
