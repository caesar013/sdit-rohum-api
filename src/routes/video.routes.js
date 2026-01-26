import express from "express";
import {
  getAll,
  getById,
  getPlatforms,
  create,
  update,
  deleteVideo,
} from "../controllers/videoController.js";
import { authenticateToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getAll); // Get all videos with pagination
router.get("/platforms", getPlatforms); // Get available platforms
router.get("/:id", getById); // Get single video (increments views)

// Protected routes - Admin only
router.post("/", authenticateToken, isAdmin, create);
router.put("/:id", authenticateToken, isAdmin, update);
router.delete("/:id", authenticateToken, isAdmin, deleteVideo);

export default router;
