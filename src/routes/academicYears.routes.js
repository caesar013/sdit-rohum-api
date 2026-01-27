import express from "express";
import {
  getAllAcademicYears,
  getActiveAcademicYear,
  getAcademicYearById,
  createAcademicYear,
  setActiveAcademicYear,
  deleteAcademicYear,
} from "../controllers/academicYearController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getAllAcademicYears);
router.get("/active", getActiveAcademicYear);
router.get("/:id", getAcademicYearById);

// Admin routes
router.post("/", authenticateToken, createAcademicYear);
router.put("/:id/activate", authenticateToken, setActiveAcademicYear);
router.delete("/:id", authenticateToken, deleteAcademicYear);

export default router;
