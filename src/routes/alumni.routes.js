import express from "express";
import {
  getAllAlumni,
  getAlumniById,
  createAlumni,
  getGraduationYears,
  getAlumniStatuses,
} from "../controllers/alumniController.js";
import { optionalAuth } from "../middleware/optionalAuth.js";
import { uploadPhoto } from "../middleware/upload.js";

const router = express.Router();

// Public routes (with optional auth to differentiate public vs admin)
router.get("/", optionalAuth, getAllAlumni);
router.get("/graduation-years", getGraduationYears);
router.get("/statuses", getAlumniStatuses);
router.get("/:id", optionalAuth, getAlumniById);
router.post("/", uploadPhoto.single("photo"), createAlumni); // Public self-registration

export default router;
