import express from "express";
import {
  getAllAchievements,
  getAchievementById,
  getCategories,
  getLevels,
  getAvailableYears,
  getCategoryCounts,
  getLevelCounts,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} from "../controllers/achievementController.js";
import { authenticateToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getAllAchievements); // Get all achievements with filters
router.get("/categories", getCategories); // Get available categories
router.get("/levels", getLevels); // Get available levels
router.get("/years", getAvailableYears); // Get available years
router.get("/:id", getAchievementById); // Get achievement by ID

// Protected routes - Admin only
router.get(
  "/admin/category-stats",
  authenticateToken,
  isAdmin,
  getCategoryCounts,
); // Get category counts
router.get("/admin/level-stats", authenticateToken, isAdmin, getLevelCounts); // Get level counts
router.post("/", authenticateToken, isAdmin, createAchievement);
router.put("/:id", authenticateToken, isAdmin, updateAchievement);
router.delete("/:id", authenticateToken, isAdmin, deleteAchievement);

export default router;
