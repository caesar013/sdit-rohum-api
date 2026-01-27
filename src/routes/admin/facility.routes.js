import express from "express";
import {
  getCategoryCounts,
  getConditionCounts,
  createFacility,
  updateFacility,
  deleteFacility,
} from "../../controllers/facilityController.js";
import { authenticateToken, isAdmin } from "../../middleware/auth.js";
import { uploadPhoto } from "../../middleware/upload.js";

const router = express.Router();

// Admin routes
router.get("/category-stats", authenticateToken, isAdmin, getCategoryCounts); // Get category counts
router.get("/condition-stats", authenticateToken, isAdmin, getConditionCounts); // Get condition counts
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
