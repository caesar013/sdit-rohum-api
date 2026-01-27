import express from "express";
import {
  createAcademicYear,
  setActiveAcademicYear,
  deleteAcademicYear,
} from "../../controllers/academicYearController.js";
import { authenticateToken } from "../../middleware/auth.js";

const router = express.Router();

// Admin routes
router.post("/", authenticateToken, createAcademicYear);
router.put("/:id/activate", authenticateToken, setActiveAcademicYear);
router.delete("/:id", authenticateToken, deleteAcademicYear);

export default router;
