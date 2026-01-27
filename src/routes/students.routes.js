import express from "express";
import {
  getAllStudents,
  getStudentById,
  getStudentEnrollmentHistory,
  getStudentStatuses,
} from "../controllers/studentController.js";

const router = express.Router();

// Public routes
router.get("/", getAllStudents);
router.get("/statuses", getStudentStatuses);
router.get("/:id", getStudentById);
router.get("/:id/enrollment-history", getStudentEnrollmentHistory);

export default router;
