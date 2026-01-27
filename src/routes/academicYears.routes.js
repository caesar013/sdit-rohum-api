import express from "express";
import {
  getAllAcademicYears,
  getActiveAcademicYear,
  getAcademicYearById,
} from "../controllers/academicYearController.js";

const router = express.Router();

// Public routes
router.get("/", getAllAcademicYears);
router.get("/active", getActiveAcademicYear);
router.get("/:id", getAcademicYearById);

export default router;
