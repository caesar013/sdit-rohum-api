import express from "express";
import {
  getAllStudents,
  getStudentById,
  getStudentEnrollmentHistory,
  createStudent,
  updateStudent,
  deleteStudent,
  enrollStudent,
  unenrollStudent,
  getStudentStatuses,
} from "../controllers/studentController.js";
import { authenticateToken } from "../middleware/auth.js";
import { uploadPhoto } from "../middleware/upload.js";

const router = express.Router();

// Public routes
router.get("/", getAllStudents);
router.get("/statuses", getStudentStatuses);
router.get("/:id", getStudentById);
router.get("/:id/enrollment-history", getStudentEnrollmentHistory);

// Admin routes
router.post("/", authenticateToken, uploadPhoto.single("photo"), createStudent);
router.put("/:id", authenticateToken, uploadPhoto.single("photo"), updateStudent);
router.delete("/:id", authenticateToken, deleteStudent);
router.post("/:id/enroll", authenticateToken, enrollStudent);
router.delete("/:id/enroll/:class_id", authenticateToken, unenrollStudent);

export default router;
