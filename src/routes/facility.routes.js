import express from "express";
import {
  getAllFacilities,
  getFacilityById,
  getCategories,
  getConditions,
  getCategoryCounts,
  getConditionCounts,
  createFacility,
  updateFacility,
  deleteFacility,
} from "../controllers/facilityController.js";
import { authenticateToken, isAdmin } from "../middleware/auth.js";
import { uploadPhoto } from "../middleware/upload.js";

const router = express.Router();

// Public routes
router.get("/", getAllFacilities); // Get all facilities with filters
router.get("/categories", getCategories); // Get available categories
router.get("/conditions", getConditions); // Get available conditions
router.get("/:id", getFacilityById); // Get facility by ID

// Protected routes - Admin only
router.get(
  "/admin/category-stats",
  authenticateToken,
  isAdmin,
  getCategoryCounts,
); // Get category counts
router.get(
  "/admin/condition-stats",
  authenticateToken,
  isAdmin,
  getConditionCounts,
); // Get condition counts
router.post(
  "/",
  authenticateToken,
  isAdmin,
  uploadPhoto.single("photo"),
  createFacility,
);
router.put(
  "/:id",
  authenticateToken,
  isAdmin,
  uploadPhoto.single("photo"),
  updateFacility,
);
router.delete("/:id", authenticateToken, isAdmin, deleteFacility);

export default router;
