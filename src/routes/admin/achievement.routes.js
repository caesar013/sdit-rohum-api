import express from "express";
import {
  getCategoryCounts,
  getLevelCounts,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} from "../../controllers/achievementController.js";
import { authenticateToken, isAdmin } from "../../middleware/auth.js";

const router = express.Router();

// Admin routes
router.get("/category-stats", authenticateToken, isAdmin, getCategoryCounts); // Get category counts
router.get("/level-stats", authenticateToken, isAdmin, getLevelCounts); // Get level counts
router.post("/", authenticateToken, isAdmin, createAchievement);
router.put("/:id", authenticateToken, isAdmin, updateAchievement);
router.delete("/:id", authenticateToken, isAdmin, deleteAchievement);

export default router;
