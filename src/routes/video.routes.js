import express from "express";
import {
  getAll,
  getById,
  getPlatforms,
} from "../controllers/videoController.js";

const router = express.Router();

// Public routes
router.get("/", getAll); // Get all videos with pagination
router.get("/platforms", getPlatforms); // Get available platforms
router.get("/:id", getById); // Get single video (increments views)

export default router;
