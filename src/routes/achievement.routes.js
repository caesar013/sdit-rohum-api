import express from "express";
import {
  getAllAchievements,
  getAchievementById,
  getCategories,
  getLevels,
  getAvailableYears,
} from "../controllers/achievementController.js";

const router = express.Router();

// Public routes
router.get("/", getAllAchievements); // Get all achievements with filters
router.get("/categories", getCategories); // Get available categories
router.get("/levels", getLevels); // Get available levels
router.get("/years", getAvailableYears); // Get available years
router.get("/:id", getAchievementById); // Get achievement by ID

export default router;
